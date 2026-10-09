# Session handoff: TiVora ERP website

Written 2026-10-09 for a new Claude Code account that has no context. Read this file first, then `CLAUDE.md`, `AGENTS.md`, `docs/REVAMP-SPEC.md` and `memory.md`. No passwords, keys or tokens are in this file and none should ever be added.

## 1. What this project is

A premium, cinematic public website for **TiVora ERP**, made by HiTech Solutions and Services Pvt. Ltd. (Kathmandu, Nepal). The repo is at `C:\Users\Gaurav Chaudhary\Documents\tivora-website`, branch `revamp/cinematic-site`. Live domain: tivoraerp.com.

- **Stack:** Next.js 16.3.8 (App Router). Next.js 16 has breaking changes, so read the relevant guide in `node_modules/next/dist/docs/` before writing code. Tailwind 4 with tokens in `src/app/globals.css` (`@theme`). Animation uses GSAP and ScrollTrigger through `useScene`, `MOTION_QUERIES` and `live()` in `src/lib/scene.ts`, plus `RevealRoot` (`data-reveal`, `data-stagger`).
- **Two build modes:** `npm run build` (standalone, for Docker) and `npm run build:static` (for cPanel, with a PHP form handler). `build:static` fails with EPERM if a `next dev` server is running and holding `src/app/api`. Stop the dev server first.
- **Brand:** logo `assests/attached-logo.svg` (the folder name is spelled "assests" on purpose). Colours bronze #6E4A14, gold #C08A2E, slate #5E574B. The brand is spelled **TiVora**. Content comes from the CEO brochure `assests/TiVora_ERP_Brochure.pdf` (text in `docs/CEO-BROCHURE.txt`) and from the live app at dev.tivoraerp.com.

## 2. Rules from the owner (follow these)

- **Never type a password or credential** into the app or any form. The owner signs in themselves, and the capture script waits for that.
- **Do not push, deploy, touch `.gitea/`, or commit `assests/` raw captures or `public/videos/`.** `public/videos/` is git-ignored on purpose. The Claude Code safety check blocks pushes to GitHub from the assistant, so the owner pushes from their own terminal.
- **App interaction (if testing the live app again):** only records marked WEBTEST, 1 to 3 per module. Never delete, edit or approve existing records. Never touch Control Panel, Administration, users, roles, licence, backup, import, recalculate, fiscal-year close or numbering. Nothing sent to outside parties. List every record created.
- **Claims:** no prices, no free trial, no customer names in copy. "AI-powered" was rejected; use "intelligent". **"IRD certified" is now an owner-approved claim** (the owner said it is one of TiVora's strengths).
- **Removed on request, do not bring back:** "real software/screen" phrases, classic-menu mentions, disclaimers and captions (including the "company figures" lines), the "One menu for every module" section, the 9800133468 phone number, and any link to hitechnepal.com in the end of videos.
- **Owner style complaints so far:** no container boxes around the hero video, nothing overlapping the video, the compact spacing pass was reverted, and images must not be blurred (test data is fine to show).
- **CLAUDE.md rules:** for library docs try Context7 first, then Ref; delegate heavy research to a subagent and return a short summary; keep reports concise.
- **Git identity:** commits use `Gaurav Chaudhary <bff.sdlkpgc@gmail.com>`; earlier commits use ashnav@hitechnepal.com.np or a Claude address. This machine has no global git identity, so pass it with `git -c user.name=... -c user.email=...`.
- **Communication:** the owner wants short answers and low token use.

## 3. Current state of the repo

Latest commit is `603b31a`. The branch tracks the remote `github` (https://github.com/GauravChaudhary007/Tivora-Website.git) and is 2 commits ahead of it, so the owner still needs to push. A second remote `origin` is the internal server `git.swastik.local`, unreachable from this machine.

Commands for the owner to run (in Git Bash or Command Prompt, inside the project folder):

    git push github revamp/cinematic-site

### Done and committed

- **Home page order:** hero (with the film and the GatewayFlow canvas background), Strengths (HiTech figures plus four pillars including **IRD certified**), the 16-module process tour, "One Home" proof, Work Desk scene, dashboards, the "Ready for Nepal" bento, trades and closing form.
- **Header and contact:** Login button to https://dev.tivoraerp.com, WhatsApp +977 9709117067, a Modules mega-menu dropdown (Core modules and Jewellery pack).
- **Module pages:** 13 pages at `/modules/<slug>/` (sales, purchase, inventory, karigar, factory, rfid, gold-loans, customer-services, transport, finance, fixed-assets, trade-finance, tax-ird). Data lives in `src/content/module-pages.ts`; adding a module is one entry. Each page shows its own `module-<slug>` screenshot.
- **Screenshots:** rebuilt from new 2x captures of the Jewelry company (no blur or cover). Registry is `src/content/screens.ts`, built by `scripts/prep-screens.mjs` into `public/screens/`. Capture with `node scripts/capture-app.mjs` (the owner signs in manually).
- **Demo popup:** every "Request a demo" link opens the inquiry form in a native dialog (`src/components/forms/DemoDialog.tsx`); the link still navigates without JavaScript, on `/contact/`, or with modifier keys.
- **Home film:** the home page now plays the owner-supplied `public/videos/Tivora_ERP_Film_v3.mp4` (2:04). `src/content/videos.ts` has `version: "v3"`, `file`, and `captions: false` for it. `scripts/check-videos.mjs` and `video/sync-text.mjs` respect that; sync-text skips the master so it never overwrites the hand-written transcript.
- **IRD certified** now appears in the home Strengths and Nepal tile, the Platform page, the module list and the Tax and IRD page.

### Uncommitted (left on purpose)

- All of `video/` changes: the Work Desk film tools (see section 4), updated films JSON, narration, plates.
- `.gitea/` deletions, `package-lock.json` (line endings only), `memory.md`, `assests/`, `.boost/`, and `_modcheck.mjs` (a throwaway test script left by an engineer; safe to delete).

## 4. Videos

- **Engine:** Playwright frame-stepper plus ffmpeg. `node video/render.mjs <film>` (supports `--shots t`, `--from/--to`). Films are in `video/films/*.json`; scene types are logo, type, world, screen, split, wall, endcard and a new `kinetic`. Tokens are in `video/engine/tokens.js`. Plates come from `video/prep-frames.mjs`, which reads `assests/app-captures` (new `--only <prefix>` flag).
- **Audio:** free Piper voice `jenny_dioco` (venv `video/.venv`, model `video/voice/jenny.onnx`, script from tables in `docs/NARRATION-SCRIPT.md`): `node video/voice.mjs`, then `node video/mix-audio.mjs` (music from `video/music.mjs`), then `node video/sync-text.mjs`. ffmpeg is at `video/node_modules/ffmpeg-static/ffmpeg.exe`. A fallback in `video/serve.mjs` fixes fonts that were missing and had stopped every render.
- **Work Desk film:** a new 10-second film exists at `video/out/workdesk.mp4` (1080p with voice and music). The owner has not yet said where it goes on the site, and it must not be added to the website or committed until they say so. Its build files (`video/films/workdesk.json`, `video/music-workdesk.mjs`, engine changes) are uncommitted. Narration: "Your Work Desk. What needs you now, and today's work. Money owed, and owing. Sales, VAT and alerts, all on one screen. TiVora, the intelligent ERP."
- **Voice choice:** Claude has no voice of its own, so the free Piper voice is used. The paid Higgsfield "Willow" voice was dropped (very few credits left).
- **Old five films** (master v1, owner, money, stock, sales) still exist in `public/videos/` and are used on the inner pages. The master v1 is replaced on the home page by the v3 film.
- The v3 film has no caption file and its "Read the video as text" lists on-screen headlines only. If the owner sends the narration script, put it in the transcript in `src/content/videos.ts`. The film may still show old contact details on its end card.

## 5. Lead form backend (PHP, cPanel)

Flow: form (`src/components/forms/DemoForm.tsx`) posts to `/api/demo/`, handled by `deploy/static/api/demo/index.php`. It validates, spam-checks, dedupes, **saves the lead first to `leads.ndjson`** in a `data` folder beside the script (or `data_dir` in `config.php`), scores it, answers the visitor, then delivers to the targets you configure.

- **Scoring** (`config/lead-rules.json`): weights timeline 25, size 20, industry 15, contact 15, software 10, message 10, location 5. Hot 70 or more, Warm 40 to 69, Cold under 40.
- **Tests:** PHP 8.3 portable at `tools/php`. `tools/php/php.exe -c tools/php.ini tests/lead/score_test.php` (30 checks) and `node tests/lead/e2e.mjs` (19 checks). Both passed locally; nothing was tested on a real cPanel server.
- **The form has two consent ticks** (email, WhatsApp) and a WhatsApp Channel join step (the link `site.whatsappChannel` in `src/content/site.ts` is still empty).
- **Delivery is not set up.** `config.php` still has the placeholder `sales@example.com`, so on a live site leads would only be saved to the server file and nobody would be notified.

Owner still needs to provide or do: the WhatsApp Channel link; a Teams webhook URL (Teams Workflows "Post to a channel when a webhook request is received"); the Excel Online workbook and an Azure app with Microsoft Graph `Sites.Selected` access (an M365 admin must grant it); a cPanel cron job for `sync.php` every 15 minutes; and a decision on email sending. The owner asked whether a backend email engine could replace Brevo. I said yes and explained the deliverability trade-offs, and asked for the monthly volume and whether cPanel allows a separate sending mailbox. **No answer yet, and the email engine is not built.** Simplest start: set `to_email` in `config.php` to the sales mailbox.

The approved design is in `C:\Users\Gaurav Chaudhary\.claude\plans\i-need-to-make-cryptic-lampson.md` (may not exist on the new account). Short version: outcome column in the sheet (Deal, Potential, Nurturing) drives email lists, and WhatsApp follow-up is a free semi-automatic send queue (wa.me links), not the paid per-message API.

## 6. Still to do

1. **Owner pushes** the 2 unpushed commits to GitHub (assistant cannot).
2. **Decide where the Work Desk film goes** (for example the Work Desk page), then wire it in and commit the film tools. Do not do this unprompted.
3. **Lead delivery setup** (section 5) and the email-engine decision.
4. **Paint and Trading companies:** research and screenshots for these industries were postponed until the owner signs in to those companies. Only the Jewelry company has been captured.
5. **Run `npm run build:static`** (with no dev server running) and fix anything it asserts; only the standard `npm run build` was checked for the module pages. Check the new module pages and the strengths row at phone width by eye.
6. **Delete `_modcheck.mjs`.**
7. **Optional:** my hands-on test of the jewelry sales flow was paused with nothing saved. No WEBTEST records exist in the app.
8. A dev-server page-load warning in the Nepal section came from a stale build; restarting `next dev` clears it.

## 7. How to run and check

- **Local site:** `npm run dev` (the app preview in this setup uses port 3111, from `.claude/launch.json`).
- **Checks:** `npx tsc --noEmit` and `npx eslint src`.
- **Headless browser checks:** use `video/node_modules/playwright-core` with `channel: "chrome"`; the in-app browser pane is throttled and slow for screenshots.
- **Video files check:** `node scripts/check-videos.mjs` (set `REQUIRE_VIDEOS=1` to fail instead of warn).

## 8. Working style that worked

An Opus session acts as head of department and gives focused jobs to Sonnet or Opus subagents (module pages, image rebuild, film). The head reviews and reports briefly. Subagents were stopped once by a usage limit and resumed with SendMessage. Spot-check anything a subagent says it did, since some reports skipped phone-width and build checks.
