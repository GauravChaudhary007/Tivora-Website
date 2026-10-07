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

## Deploy

Two builds from one codebase (`trailingSlash: true` in both):

- **Docker / Node:** `npm run build`, then `node .next/standalone/server.js`. The form posts to `src/app/api/demo/route.ts`; set `DEMO_WEBHOOK_URL` (see `.env.example`). Without it the form answers 503 with a friendly message.
- **cPanel / Apache (static):** `npm run build:static` writes `out/` (asserts all 8 routes, `404.html`, `sitemap.xml`, `robots.txt`, no `_next/image`) and copies `deploy/static/` into it (`.htaccess`, `api/demo/index.php`, `api/demo/config.php`). Upload the contents of `out/` to `public_html`, then edit `api/demo/config.php` on the server (`to_email` and/or `webhook_url`; never commit real values). Keep `route.ts` and `index.php` in lockstep: same field keys (`name, company, industry, city, phone, email, message`), same length caps.

### Lead pipeline (cPanel, PHP 7.4+)

`api/demo/index.php` validates, drops bots (honeypot, under 3 s, over 5 per IP per hour; answered `ok`, nothing kept), merges repeats (same phone or email within 7 days), appends the lead to a local queue first, scores it (`config/lead-rules.json`, copied to `out/api/demo/lead-rules.json` by the build), answers the visitor, then in the same request writes a row to the Excel sheet and posts a Teams card. Each target is tried independently and its status is kept on the queue record; the cron retry resends failures. Copy `api/demo/config.sample.php` to `config.php` on the server (it documents every key; never commit real values). Set `data_dir` to a folder outside `public_html`; empty uses `api/demo/data/` (web access denied). With Graph and Teams both unset, the old `to_email` / `webhook_url` behaviour still applies.

One-time setup:

1. **Azure app + Graph.** Entra admin centre: register an app, add a client secret, API permission Microsoft Graph application `Sites.Selected` (admin consent), then grant the app write access to the lead site (`POST /sites/{site-id}/permissions`, role `write`). Put `tenant_id`, `client_id`, `client_secret` in `config.php`. Get `drive_id` and `item_id` of the workbook from Graph Explorer (`/sites/{site-id}/drive`, then `/drive/root:/Leads.xlsx`).
2. **Workbook.** Excel Table named `Leads` with exactly these columns in this order (do not reorder): Lead ID, Received, Name, Company, Phone, Email, Industry, City, Business size, Timeline, Current software, Message, Landing page / UTM, Marketing consent (timestamp), Score, Priority, Score reasons, Owner, Contacted at, Outcome, Notes, Unsubscribed, Last email sent, Last WhatsApp sent, WhatsApp done, Last synced. On Outcome add a Data Validation list: `Deal,Potential,Nurturing`. Give sales edit access. Set `sheet_url`.
3. **Teams.** In the sales channel: Workflows, "Post to a channel when a webhook request is received"; paste the URL into `teams_webhook_url`.
4. **Brevo.** Create the account, authenticate the sending domain (SPF, DKIM, DMARC), create three lists (Deal, Potential, Nurturing), create an API key; fill `brevo_api_key` and `brevo_list_ids`. Build the email series per list (starter wording is under `templates.email` in `lead-rules.json`).
5. **Cron** (cPanel, Cron Jobs): `*/15 * * * * php /home/USER/public_html/api/demo/sync.php all`. `sync.php` also runs `retry`, `outcomes`, `whatsapp` on their own. It is CLI only and web-denied.
6. **WhatsApp send queue (free, manual send).** Once a day after `whatsapp_hour` (Nepal time) `sync.php` posts one Teams message: up to 25 consenting leads with an Outcome whose cadence is due (Potential 7 days, Nurturing 14, Deal 30; edit `cadenceDays`). Sales taps each Send link (WhatsApp opens with the text from `templates.whatsapp` ready), presses send from the Business number, then ticks `WhatsApp done` in the sheet; the next sync stamps `Last WhatsApp sent` and clears the tick, so nobody is messaged twice. Unofficial bulk tools are not used.
7. **Consent wording** (version id `v1`, shown beside the unchecked checkbox, text lives in `src/content/site.ts`): "I agree to receive TiVora updates by email and WhatsApp. You can opt out at any time." Only consenting leads enter Brevo or the WhatsApp list; everyone is still contacted about their inquiry. Have the wording reviewed against Nepal's privacy law before launch.

Tests (portable PHP in `tools/php`, git-ignored): `tools/php/php.exe -c tools/php.ini tests/lead/score_test.php` and `node tests/lead/e2e.mjs` (mock Graph, Teams and Brevo; real `php -S`).
