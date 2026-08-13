# Vitasilk 24K Gold — Landing Page

COD landing page for **Vitasilk 24K Gold 1L**, a glyoxylic-acid-free professional
straightening treatment. Bilingual Arabic (Moroccan Darija) / French, light-luxe
theme (ivory / champagne / gold).

Next.js 16 App Router · React 19 · Tailwind CSS v4 · Motion.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Orders fall back to `data/orders.jsonl` until `SHEETS_ENDPOINT` is configured, so
the form works out of the box with no setup.

## Where things live

| What | Where |
|---|---|
| Prices, WhatsApp number, product name, domain | `lib/config.ts` |
| All copy, both languages | `dictionaries/fr.ts` (shape) + `dictionaries/ar.ts` |
| Palette, fonts, gold gradients | `app/globals.css` (`@theme`) |
| Section order | `app/page.tsx` |
| Order intake | `app/api/order/route.ts` + `apps-script/Code.gs` |
| Image brief and prompts | `WORKFLOWS.md` |

### Changing the price

Edit `PRICE_DH` / `OLD_PRICE_DH` in `lib/config.ts` — nothing else. Every visible
price (hero CTA, offer card, sticky bar, form total) is derived from those two
numbers via `formatDh`, and the discount badge from `DISCOUNT_PCT`. The
dictionaries take a formatted price as an argument and never hardcode one.

### Contrast rule

Gold on ivory measures ~2:1 and cannot carry text. `.text-gold-gradient` is
capped at `#9a7b1e` and is only for 24px+ display type; anything smaller uses
`text-espresso` or `text-mocha`. The two full-bleed dark sections (`BrandStory`,
`Offer`) use the `*-on-dark` variants instead. See the comments in
`app/globals.css` before introducing new gold text.

## Order intake (Google Sheets)

1. Create a Google Sheet, then **Extensions > Apps Script**.
2. Paste `apps-script/Code.gs`, run `setupSheet` once, approve the permissions.
3. **Deploy > New deployment > Web app** — execute as *Me*, access *Anyone*.
4. Copy the `/exec` URL into `.env.local`:

```bash
cp .env.local.example .env.local
# then set SHEETS_ENDPOINT=https://script.google.com/macros/s/…/exec
```

The endpoint is read **server-side only** in `app/api/order/route.ts`. Do not
give it a `NEXT_PUBLIC_` prefix — that would ship a public write handle to your
sheet in the client bundle.

If Sheets is unreachable, the route still appends the lead to
`data/orders.jsonl` (flagged `sheetsError: true`) and returns 502, and the form
shows its WhatsApp fallback. Orders are never silently dropped.

## Images

All eight slots are filled with real product photography (~700 KB total). See
`WORKFLOWS.md` for the shot list, source filenames and the generation prompts.

To replace any of them, drop a new file in the source folder under the same name
and re-run:

```bash
node scripts/process-images.mjs        # the 7 section shots
node scripts/cutout-hero.mjs [src]     # hero — trim + encode, alpha preserved
```

The hero must stay transparent: `Hero.tsx` uses the file as a CSS mask for the
light-sweep animation. `cutout-hero.mjs` takes either an already-transparent PNG
(detected automatically, alpha used as-is) or a shot with a background, which it
removes by flood fill. Both paths write `scripts/_cutout-check.png` (the matte
over magenta) so the result can be eyeballed for halos and holes.

### Why the images live in `assets/`, not `public/`

They are **statically imported**, not referenced by URL string:

```tsx
import goldMacro from "@/assets/images/gold-macro.webp";
<Image src={goldMacro} fill className="object-cover" />
```

This buys two things that a `/images/…` string cannot:

1. **Stale caching becomes impossible.** Next emits the file as
   `/_next/static/media/gold-macro.<contenthash>.webp`. Replace the file and the
   hash changes, so the URL changes, so no browser or CDN can serve you the old
   one. With a plain `public/` URL the path never changes, and `next/image` sends
   `Cache-Control: max-age=14400` — meaning a swapped image keeps showing the
   previous version in your browser for four hours.
2. **Dimensions come from the file.** No `width`/`height` props to keep in sync,
   so a replacement with a different aspect ratio can't silently squash.

Files in `assets/` are only emitted if something imports them, so nothing is
double-shipped. `public/` still holds the two logo SVGs, which are referenced by
plain path.

To replace an image: drop it in the source folder, re-run the scripts, restart
dev. No cache clearing needed.

## Before going live

- [ ] `WHATSAPP_NUMBER` in `lib/config.ts` — verify it is the right line
- [ ] `SITE_URL` in `lib/config.ts` — currently `localhost:3000`, breaks OG tags
- [ ] `SHEETS_ENDPOINT` set in the deployment environment
- [ ] Confirm `OLD_PRICE_DH` (1700) is the price you want struck through

## Docker

```bash
echo "SHEETS_ENDPOINT=https://script.google.com/macros/s/AKfy…/exec" > .env
docker compose up -d --build
```

Serves on port `8086`, published on all interfaces. That is deliberate but
temporary: this page has no domain yet, so the port is how you reach it. Once a
domain exists, drop the `ports:` mapping and attach Traefik labels instead —
the VPS already runs a shared Traefik on 80/443. A reverse proxy in front is
what the Next.js self-hosting guide recommends, and it terminates TLS and
absorbs malformed requests that the Node server otherwise takes directly.

`.env` is gitignored. `SHEETS_ENDPOINT` is a live write handle to the order
sheet, so it is injected at runtime and never baked into a layer or prefixed
`NEXT_PUBLIC_`. Leave it unset and the page still runs, with orders falling
back to `data/orders.jsonl` in the `orders` volume.

The build is three stages ending in `node:22-alpine`: `npm ci`, then
`next build` producing `.next/standalone`, then a runtime holding only the
server, `.next/static` and `public/`. It runs as the non-root `nextjs` user.

Two things to leave alone unless you mean it:

- **`outputFileTracingIncludes` in `next.config.ts`** pulls `node_modules/sharp`
  into the standalone bundle. `sharp` is an *optional* dependency of Next, and
  tracing does not reliably follow it. Drop that entry and the image builds and
  starts fine, then 500s on the first optimised image — i.e. every image here.
- **`data/` is a named volume.** It holds the order fallback log, including
  leads flagged `"sheetsError": true` that never reached the Sheet. In the
  container's writable layer they would vanish on the next rebuild.

Orders survive redeploys:

```bash
docker compose exec web cat /app/data/orders.jsonl
```

The build needs egress to `fonts.googleapis.com` — `next/font/google` fetches
the typefaces at build time, not at runtime.

Before going live, set `SITE_URL` in `lib/config.ts` to the real domain. It is
compiled into the build, so changing it needs `up -d --build`, not a restart.
