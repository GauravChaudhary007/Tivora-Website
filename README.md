# Tivora ERP — marketing website

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Motion · Lucide

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Things to finish before launch

| What | Where |
| --- | --- |
| Product tour video | Done — `public/videos/product-demo.mp4` (1080p, 19.8 MB) + `product-demo-720.mp4` (phones, 9.6 MB) + poster. Opens from "Watch the full tour". |
| Hero loop | Done — `public/videos/hero-loop.mp4` (9.5 s, silent, 0.74 MB): quotation → invoice → WhatsApp. Autoplays; skipped on Data Saver / 2G / reduced motion. Set `heroLoopVideo` to "" in `src/lib/site.ts` to show the interactive dashboard mockup instead. |
| Demo form delivery | Set `DEMO_WEBHOOK_URL` (see `.env.example`). Handler: `src/app/api/demo/route.ts`. |
| Industry copy | Generic by design — refine per industry in `src/components/sections/IndustrySelector.tsx`. |
| Contact details | `src/lib/site.ts` |

## Structure

- `src/app/page.tsx` — section order (the scroll narrative)
- `src/components/sections/*` — one component per section
- `src/components/ui/*` — `SectionHeading`, `Button`, `Reveal`, `AnimatedNumber`, `VideoFrame`, …
- `src/lib/gsap.ts` — GSAP/ScrollTrigger registration + shared `MOTION_QUERIES` (desktop / mobile / reduced motion)
- `src/components/product/*` — product UI mockups drawn in the application's own palette and fonts (IBM Plex Sans, Fraunces, gold #8a6420)
- `public/brand/*` — Tivora logos (from the brand identity)

## Motion rules

- GSAP + ScrollTrigger for scroll storytelling (hero tilt, automation pin, module ecosystem, manufacturing track, video reveal, CTA reveal).
- Motion for UI state (tabs, menus, hover/tap, list transitions).
- Every GSAP effect is registered through `gsap.matchMedia()`; with `prefers-reduced-motion: reduce` the page renders in its final, fully readable state.
- All dashboard numbers in mockups are illustrative and labelled as such.

## Re-encoding the video

Source: the original export (1080p30, H.264). Commands used (ffmpeg):

```bash
# full tour, streaming-friendly
ffmpeg -i tivora_video.mp4 -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/videos/product-demo.mp4
ffmpeg -i tivora_video.mp4 -vf scale=1280:-2 -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k public/videos/product-demo-720.mp4
# hero loop (0:37–0:46.5), silent
ffmpeg -ss 37 -t 9.5 -i tivora_video.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart public/videos/hero-loop.mp4
```
