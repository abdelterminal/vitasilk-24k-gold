// Asset prep for the 24K Gold landing page.
// Re-run with: node scripts/process-images.mjs
//
// Expects the generated originals (see WORKFLOWS.md) in SRC, named as below.
//
// The hero is handled separately by scripts/cutout-hero.mjs, which removes the
// background — the light sweep in Hero.tsx masks itself to the bottle's
// silhouette, which only works with real transparency.
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";

const SRC = "C:/Users/Brandshift 01/Downloads/vitasilk 24k img";
const OUT = "assets/images";
mkdirSync(OUT, { recursive: true });

// Section shots → web-sized WebP. [source filename, output filename, width]
const shots = [
  ["gold-macro.png", "gold-macro.webp", 1600],
  ["studio-pedestal.png", "studio-pedestal.webp", 1600],
  ["brand-story-light.png", "brand-story-light.webp", 2000],
  ["hair-before.png", "hair-before.webp", 1200],
  ["hair-after.png", "hair-after.webp", 1200],
  ["studio-front.png", "studio-front.webp", 1200],
  ["testimonial-side.png", "testimonial-side.webp", 1000],
];

for (const [src, out, width] of shots) {
  const from = `${SRC}/${src}`;
  if (!existsSync(from)) {
    console.warn(`skipped ${out}: missing ${from}`);
    continue;
  }
  await sharp(from)
    .rotate() // respect EXIF orientation
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(`${OUT}/${out}`);
  console.log(`${out} ✓`);
}

console.log("done — run scripts/cutout-hero.mjs for the hero bottle");
