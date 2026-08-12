# Asset Workflows — Vitasilk 24K Gold 1L

Landing page imagery brief. Every prompt below targets the **light-luxe theme**:
ivory `#fbf8f2`, pearl `#f3ede1`, champagne `#e3d3b0`, gold `#c9a227`.

> The dark-background prompts in the sibling `vitasilk` (Botox Capillaire) project
> are **not reusable here** — that page is black + gold, this one is ivory + gold.

---

## Rules (always)

- **Product fidelity is sacred.** Never generate the bottle from a text-only prompt.
  Every product shot below starts from a real photo of the actual 24K Gold bottle,
  supplied as a reference/edit input. Reject any output with a warped label,
  garbled text, drifted cap shape, or wrong proportions.
- **One reference photo unlocks everything.** Shoot the bottle once, straight-on,
  in flat even light against any plain wall. Sharpness of the label matters far
  more than the lighting — the model relights it.
- **Keep everything on the ivory/champagne/gold palette** so shots drop into the
  page without a colour mismatch. If a generation comes back cool-toned or grey,
  regenerate rather than colour-correcting — cool greys fight the warm ivory.
- Model: **Google Nano Banana 2** (Flash for drafts, Pro for the final pick).
- Deliver into `assets/images/` using the exact filenames in the table.

## Shot list — all delivered ✓

Sources live in `C:/Users/Brandshift 01/Downloads/vitasilk 24k img/` under these
names. Re-generating any slot means dropping a replacement there under the same
filename and re-running the scripts.

| # | Slot | Source | Output | Ratio |
|---|------|--------|--------|-------|
| 1 | Hero | pre-cut transparent PNG (see below) | `bottle-hero.webp` | tight crop |
| 2 | Ingredients | `gold-macro.png` | `gold-macro.webp` | 16:9 |
| 3 | Promise card | `studio-pedestal.png` | `studio-pedestal.webp` | 16:9 |
| 4 | Brand story | `brand-story-light.png` | `brand-story-light.webp` | 16:9 |
| 5a | After | `hair-after.png` | `hair-after.webp` | 3:4 |
| 5b | Before | `hair-before.png` | `hair-before.webp` | 3:4 |
| 6 | Offer + OG | `studio-front.png` | `studio-front.webp` | 1:1 |
| 7 | Testimonials | `testimonial-side.png` | `testimonial-side.webp` | 4:5 |

---

## 1 — Hero cutout (`bottle-hero.webp`)

The page's LCP element, and the only asset that **must** ship with real alpha —
`Hero.tsx` uses the file as a CSS `maskImage` to drive the animated light sweep
across the bottle. A baked-in background breaks that effect.

**Current source:** a pre-cut transparent PNG (708×1440, from Magnific's
background remover), trimmed by the script to 488×1311. This is the preferred
route — a dedicated remover beats the local flood fill on glossy black glass.

```bash
node scripts/cutout-hero.mjs "path/to/transparent-bottle.png"
```

`scripts/cutout-hero.mjs` detects a pre-cut source — transparent border ring plus
>10% transparent area — and trusts its alpha untouched, only trimming to the
bounding box, resizing and encoding. Blurring and re-thresholding a clean binary
matte would just chew a pixel off an edge that is already correct.

### Fallback: a shot with a background

If you only have a flat studio shot, the script removes the background itself.
Generate at **3:4, 2k** with your real bottle photo attached as the reference:

> Professional product photography, front-facing studio shot of this exact bottle,
> keep the label design, logo, typography and all text completely unchanged and
> tack sharp. Place it on a seamless warm ivory background with soft diffused
> daylight from the upper left, a gentle champagne-gold glow behind the bottle, a
> soft natural contact shadow beneath it, delicate highlight running down the glass
> edge, bright airy high-end cosmetic lighting, ultra sharp focus on the label, no
> props, centered composition, generous empty space around the product.

That path flood-fills the background inward from the border, comparing each pixel
to its already-classified *neighbour* rather than to a global background model —
that way smooth gradients (the vignette, the diagonal light beam) get crawled and
removed, while the hard bottle edge stops the fill. It requires two conditions:

- the bottle must **not touch the left or right frame edge** (the fill is seeded
  from the border), and
- the background must stay **smooth and continuous** — no hard-edged props or
  sharp shadow lines connecting the product to the frame edge.

### Checking the result

Either way the script writes `scripts/_cutout-check.png`, the matte composited
over magenta. Open it: any surviving halo or punched-through hole is obvious
there. On the fallback path, if the edge looks wrong, tune `TOL` (larger = fill
crawls further) and `ERODE` (larger = matte pulls in tighter) at the top of the
file.

## 2 — Ingredient macro (`gold-macro.webp`)

No product needed. **16:9, 2k.**

> Extreme macro photograph of delicate 24 karat gold leaf flakes suspended in a
> clear viscous serum droplet, shot on a smooth warm ivory surface, shallow depth
> of field with the gold foil catching warm light and shimmering, soft diffused
> daylight, tiny champagne-coloured reflections, luxurious minimal beauty
> editorial styling, creamy bokeh, no props, clean negative space on the right
> third for text overlay.

## 3 — Promise card (`studio-pedestal.webp`)

Sits at the top of the "promise" card in the problem section, cropped to 16:9.
**16:9, 2k**, real photo attached.

> Editorial product photograph of this exact bottle standing on a minimal ivory
> geometric pedestal, slight three-quarter angle, soft diffused studio daylight
> from the top left, delicate soft shadow cast across the pedestal, clean
> gradient background from warm ivory to soft champagne, high-end minimalist
> beauty-brand aesthetic, label sharp and unchanged, very shallow falloff on the
> background, large amount of empty negative space to the right of the product
> for text overlay.

## 4 — Brand story (`brand-story-light.webp`)

Full-bleed parallax backdrop. No product needed. **16:9, 2k.**

> Bright airy editorial photograph inside a luxury hair salon, sunlight streaming
> through sheer linen curtains onto a woman with long glossy straight dark hair
> seen from behind, warm ivory and cream interior, brass and champagne-gold
> fixtures softly out of focus, calm serene high-end atmosphere, film-like warm
> colour grading, soft natural light, no visible branding or text, shallow depth
> of field.

## 5 — Before / After pair (drag slider)

**Order matters.** The slider clips one image over the other, so the two frames must
be **pixel-aligned** — same woman, same pose, same framing, same background.

**5a. Generate the "after" first** — 3:4, 2k:

> Back view of a woman with long, perfectly straight, silky glossy dark hair,
> mirror-like shine, healthy smooth cuticle, soft diffused daylight from the
> left, warm ivory studio background with a subtle champagne gradient, luxury
> haircare advertisement photography, sharp detail in the hair, natural warm
> colour grading.

**5b. Then generate the "before" as an edit**, passing the after-image as
`references[{type: image}]`:

> Keep the exact same woman, exact same pose, exact same framing, exact same
> ivory background and lighting — but change the hair to dry, frizzy, damaged
> hair with visible flyaways, split ends, dull matte texture and no shine.

If you generate them independently the slider will look like two different photos
mid-drag and the effect collapses.

## 6 — Offer card + OG image (`studio-front.webp`)

Shown at full quality in the offer block **and** used as the social share image, so
this is the one to spend the most effort on. **1:1, 2k** (upscale to 4k if offered),
real photo attached.

> Luxury cosmetic product photograph of this exact bottle, centered, front-facing,
> shot straight-on at eye level, resting on a polished cream marble surface with a
> soft subtle reflection below it, background a smooth vertical gradient from warm
> ivory at the top to soft champagne at the bottom, single warm golden key light
> from the upper left creating a bright highlight along the cap and a soft rim of
> light down the right edge, label and all text perfectly sharp and legible,
> premium studio advertising quality, no dust or scratches, no props.

## 7 — Testimonials side image (`testimonial-side.webp`)

No product needed. **4:5, 2k.**

> Natural lifestyle portrait of a Moroccan woman in her early thirties with long
> healthy glossy straight dark hair, running her fingers through it, genuine warm
> smile, soft natural window light, warm ivory and cream background, authentic
> unposed feel, shallow depth of field, warm film-like colour grading, no visible
> branding or text.

---

---

## Local processing

```bash
node scripts/process-images.mjs   # the 7 section shots → web-sized WebP
node scripts/cutout-hero.mjs      # hero: background removal → transparent WebP
```

Both read from the `SRC` path at the top of each file. Outputs land in
`assets/images/` and total ~700 KB.
