// Background removal for the hero bottle.
//
// Hero.tsx uses the hero file as a CSS mask to drive the light sweep, so it
// needs real alpha.
//
// Two paths, chosen automatically:
//
// A. Source already cut out (transparent PNG from a background remover) — its
//    alpha is trusted as-is. Only the trim/resize/encode tail runs.
// B. Source is a flat studio shot — gradient-tolerant flood fill seeded from
//    the border. Comparing each candidate against its already-classified
//    NEIGHBOUR (rather than a global background model) means smooth gradients —
//    the vignette and the diagonal light beam in the source shot — get crawled
//    and removed, while the hard bottle edge is a large enough jump to stop the
//    fill. A global background model cannot represent that beam and leaves a
//    ragged halo behind.
//
// Run with: node scripts/cutout-hero.mjs [srcPath]
import sharp from "sharp";

const SRC = process.argv[2] ?? "C:/Users/Brandshift 01/Downloads/magnific_remove-background_fFaciibCDY.png";
const OUT = "assets/images";

const TOL = 11; // max per-channel step between neighbours still counted as background
const DARK_STOP = 110; // never let the fill cross into the dark bottle body
const ERODE = 0.38; // alpha midpoint after blur — pulls the matte in ~1px
const SOFT = 0.9; // edge softness

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const idx = (x, y) => (y * W + x) * C;
const lum = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

// Is the source already cut out? A transparent border ring plus a substantial
// transparent area is the signature; a photo with a baked-in background has an
// opaque border and never satisfies this.
let borderOpaque = 0;
for (let x = 0; x < W; x++) {
  if (data[idx(x, 0) + 3] > 8) borderOpaque++;
  if (data[idx(x, H - 1) + 3] > 8) borderOpaque++;
}
for (let y = 0; y < H; y++) {
  if (data[idx(0, y) + 3] > 8) borderOpaque++;
  if (data[idx(W - 1, y) + 3] > 8) borderOpaque++;
}
let transparent = 0;
for (let p = 0; p < W * H; p++) if (data[p * C + 3] < 8) transparent++;
const preCut = borderOpaque === 0 && transparent / (W * H) > 0.1;

const finalA = Buffer.alloc(W * H);

if (preCut) {
  // Path A — trust the supplied matte. Blurring and re-thresholding a clean
  // binary alpha would only chew a pixel off an edge that is already correct.
  for (let p = 0; p < W * H; p++) finalA[p] = data[p * C + 3];
  console.log(`pre-cut source detected (${(transparent / (W * H) * 100).toFixed(1)}% transparent) — skipping flood fill`);
} else {
  // Path B, step 1. Flood fill the background inward from every border pixel.
  const bg = new Uint8Array(W * H);
  const stack = [];
  const seed = (x, y) => {
    const p = y * W + x;
    if (!bg[p] && lum(idx(x, y)) >= DARK_STOP) {
      bg[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < W; x++) {
    seed(x, 0);
    seed(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    seed(0, y);
    seed(W - 1, y);
  }

  const step = (fromI, x, y) => {
    const p = y * W + x;
    if (bg[p]) return;
    const toI = idx(x, y);
    if (lum(toI) < DARK_STOP) return;
    if (
      Math.abs(data[toI] - data[fromI]) <= TOL &&
      Math.abs(data[toI + 1] - data[fromI + 1]) <= TOL &&
      Math.abs(data[toI + 2] - data[fromI + 2]) <= TOL
    ) {
      bg[p] = 1;
      stack.push(p);
    }
  };

  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    const y = (p / W) | 0;
    const i = idx(x, y);
    if (x > 0) step(i, x - 1, y);
    if (x < W - 1) step(i, x + 1, y);
    if (y > 0) step(i, x, y - 1);
    if (y < H - 1) step(i, x, y + 1);
  }

  // 2. Anything the fill never reached is product — including interior glossy
  //    highlights, which would otherwise punch holes through the black body.
  const alpha = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) alpha[p] = bg[p] ? 0 : 255;

  // 3. Blur then re-threshold: antialiases the matte and erodes it slightly, so
  //    no rim of champagne background survives around the silhouette.
  // NB: sharp may hand back more than one channel here even though the input is
  // greyscale, so read the real stride rather than assuming 1.
  const { data: blurred, info: bInfo } = await sharp(alpha, {
    raw: { width: W, height: H, channels: 1 },
  })
    .blur(1.4)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const BC = bInfo.channels;

  for (let p = 0; p < W * H; p++) {
    const v = blurred[p * BC] / 255;
    const t = (v - ERODE) / (SOFT - ERODE);
    finalA[p] = Math.round(Math.max(0, Math.min(1, t)) * 255);
  }

  const removed = ((bg.reduce((a, b) => a + b, 0) / (W * H)) * 100).toFixed(1);
  console.log(`flood fill removed ${removed}% of the frame`);
}

const rgba = Buffer.alloc(W * H * 4);
for (let p = 0; p < W * H; p++) {
  const a = finalA[p];
  // Neutralise the RGB of fully-transparent pixels. Left as-is they keep the
  // original champagne value, which bleeds back in wherever the image is
  // resampled — and makes sharp's RGB-keyed .trim() useless.
  rgba[p * 4] = a ? data[p * C] : 0;
  rgba[p * 4 + 1] = a ? data[p * C + 1] : 0;
  rgba[p * 4 + 2] = a ? data[p * C + 2] : 0;
  rgba[p * 4 + 3] = a;
}

// Bounding box straight off the alpha channel — deterministic, unlike .trim()
let x0 = W, y0 = H, x1 = -1, y1 = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (finalA[y * W + x] > 8) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
if (x1 < 0) throw new Error("cutout is empty — check TOL / DARK_STOP");

await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
  .resize({ height: 1400, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/bottle-hero.png`);

await sharp(`${OUT}/bottle-hero.png`)
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(`${OUT}/bottle-hero.webp`);

const meta = await sharp(`${OUT}/bottle-hero.png`).metadata();
console.log(`bottle-hero: ${meta.width}x${meta.height}, alpha=${meta.hasAlpha} (trimmed from ${W}x${H})`);

// Contact sheet over magenta so fringing and holes are obvious on inspection.
await sharp({
  create: { width: meta.width, height: meta.height, channels: 4, background: "#ff00ff" },
})
  .composite([{ input: `${OUT}/bottle-hero.png` }])
  .png()
  .toFile("scripts/_cutout-check.png");
console.log("wrote scripts/_cutout-check.png (magenta backdrop) for inspection");
