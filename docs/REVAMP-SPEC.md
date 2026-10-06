# Tivora ERP website: revamp spec (v1)

Owner of this spec: Head of Department (creative + technical direction), 2026-10-06.
Audience: the engineers who build it. This file is the single source of direction. Where it is silent, choose the smallest thing that works and note it in the PR.

Supersedes `memory.md` sections 1, 6, 8, 9 (keep content, teal palette, page map). Still valid from `memory.md`: section 4 (build modes), section 10 (trailingSlash, Apache, form both builds, accessibility rules), section 12 (live-site bugs). Read `AGENTS.md` and the guides in `node_modules/next/dist/docs/01-app/` (static-exports, linking-and-navigating, metadata-and-og-images, fonts) before writing routing, metadata, Link or font code. Next 16.3.8: `params` is a Promise, use `PageProps<'/route'>` / `LayoutProps<'/route'>`; `redirects`/`headers`/`rewrites`/proxy/default image loader are unsupported in static export.

---

## 0. Inputs inspected and what they established

| Input | Finding that drives a decision |
|---|---|
| `assests/attached-logo.svg` (= `public/brand/tivora-official.svg`, byte-identical) | 581x100. Symbol in `<g clip-path=clip0>` lines 2-45, box x0..96, y2..98. Wordmark "TIVORA" (bronze) + sparkle + "ERP" (gold) in `<g clip-path=clip1>` lines 46-66, box x112..581, y0..56. Descriptor "HITECH INTELLIGENT ERP SOLUTION" is the single slate path on line 67 (y79..94). Masks on lines 3-5, 7-10, 17-20 use `fill="white"` / `stroke="black"` as luminance masks. The four symbol circles carry tiny white glyphs (lines 30-43): bar chart (top-left), cart (top-right, gold), document (bottom-left), people (bottom-right). |
| 10 screenshots in `Tivora ERP/Assests/*.PNG` | Real app, ~1900x925 (menus ~290x925). Serif page titles ("Namaste, Paint", "Kathmandu Paints"), sans UI that reads as IBM Plex Sans, metadata in a Plex-Mono-like face. Ground #F6F4F0-ish, bronze buttons, green icons on Finance/Trade/Tax. **Sensitive items found:** notification badge "8" on every top bar; a person's name "Bishnu Adhikari" (Work Desk); "Everest Chemicals & Pigments Pvt. Ltd." (Exec dash, Work Desk) and "Balaju Hardware & Paints" (Work Desk) look like plausible real businesses; Work Desk bottom-left shows a browser status URL `https://dev.tivoraerp.com/start`. |
| `directives/tivora-product-knowledge.md` + `Tivora ERP Website Brief.html` | Claims policy (section H below). Brief is authoritative for product facts and gives finished copy, the form fields, and a documented palette (ground, paper, ink, muted, rule, tint, ok, no, plus a dark theme). |
| Reference reel (19.8 s) | Principles only: (1) one hero object, transformed by scroll; (2) isometric low-poly "worlds" in a single accent colour on a pale ground, with small info cards pinned to parts of the world; (3) dark editorial pages, giant type as image; (4) masked/zoom transitions between scenes; (5) very few elements per frame. |
| Current repo | Infra is sound (two build modes, PHP + TS form handlers, GSAP helper). **All current design and media must go:** both videos (`public/videos/*`, 31 MB) show the old teal brand and a phone/WhatsApp delivery flow (claims-policy violation: no mobile app, no WhatsApp); root metadata says "IRD certified" (violation). |

---

## A. Concept and narrative

> **Correction (owner feedback, supersedes the four-district world below).** The product has TWELVE modules (Reports Centre, Purchase & Accounts Payable, Store & Inventory, Production, Sales & Accounts Receivable, Transport & Delivery, Customer Services, Finance & Accounts, Fixed Assets, Trade & Finance, Tax & IRD, Control Panel; Jewelry adds Karigar, Manufacturing, RFID, Gold Loans). The logo's 2x2 mark is brand art, never a module count. Scene 1's world is now those twelve modules as a labelled 4 x 3 grid of slabs (`world.ts` MODS); the bill's path lights four stops (Sales, Store & Inventory, Production, Finance + Tax & IRD) while the rest stay visible. Eyebrow "One entry, twelve modules"; captions read "Stop n of 4 on the bill's path". Info cards sit below the world; the camera is clamped to the world. Scenes 2 and 8 use the same world (zoom to the Finance slab; the grid gathers and cross-fades to the symbol); the films' world scenes use it too (`video/engine/engine.js`). "Ten modules" / "four districts" wording elsewhere in this file is superseded.

### Big idea: "Follow one bill."

The symbol is four rounded module squares joined by 45-degree links. We build the homepage as a small isometric **business world made of those four squares**: each square extrudes into a district of the business, and the links become the roads between them. Then we do the one thing every ERP site says and none shows: **we follow a single bill through the whole business.** A gold voucher chip (`SI-2083/84-00001`, the brief's own fiscal-year number format) leaves the counter, moves the stock in the godown, is felt on the production floor, and lands in the ledger and the VAT book. Same entry, four places, no retyping. That is the brief's core sentence ("A sale made at the counter updates the stock and the ledger at the same moment") turned into a scroll.

The four districts map onto the four corners of the mark (and onto the glyphs inside its circles):

| Symbol corner | Glyph in the mark | District | Module(s) it stands for |
|---|---|---|---|
| top-right (gold) | cart | **Counter** | Sales & Accounts Receivable, Customer Services |
| bottom-right | people | **Godown** | Purchase & Accounts Payable, Store & Inventory |
| bottom-left | document | **Floor** | Production Plan & Manufacturing |
| top-left | bar chart | **Ledger** | Finance & Accounts, Trade & Finance, Tax & IRD, Reports Centre |

Order of travel: Counter, Godown, Floor, Ledger (clockwise from the gold square, so the bill starts on the one gold corner).

Then the world hands over to **the real product**: the ledger tile's top face zooms until it fills the screen and resolves, through a rounded-square mask, into the real Home screenshot. From there the page is editorial and light: real screens, cropped, zoomed and parallaxed, never redrawn. The page closes by collapsing the world back into the official symbol: four modules, one core.

Tone: plain, specific, the trade's own words. No "seamless", "unlock", "empower", "next-gen", "revolutionize", "all-in-one solution", "AI".

### Homepage storyboard

Heights are scroll distance on desktop (>=1024 px, motion allowed). Mobile and reduced-motion behaviour is in section D.

**Scene 0: Core (hero). Dark (`--color-night`). Pinned, 160vh.**
- Frame at load (no motion needed for LCP): headline left/centre, the official symbol (`/brand/tivora-symbol-dark.svg`, `<img>`, 22vmin) right/centre, soft ember glow behind it.
- Copy:
  - Eyebrow (mono): `Tivora ERP · from HiTech, Kathmandu`
  - H1 (serif display): **One platform. Every business.**
  - Lead: Sales, buying, stock, the production floor and the books, in one system. Bikram Sambat dates, VAT and IRD formats are built in, because it is made in Nepal for Nepal.
  - Buttons: primary **See it on your own numbers** (`/contact/`), secondary **Explore the platform** (`/platform/`).
  - Status line (small, with a gold dot): Tivora ERP – Jewelry is running in showrooms today. General trading and Paint are next.
- Scroll 0-100%: the symbol `<img>` gets a CSS isometric transform (`rotateX(55deg) rotateZ(-45deg)`, scale 1 to 1.6) and at 60-80% cross-fades into the isometric world SVG whose four slab tops sit exactly where the projected squares are. Headline drifts up (y -12vh) and fades by 70%. This is a transform of the real logo file, not a redraw; the slab world is an illustration built from the motif and is never shown as the logo.

**Scene 1: Follow one bill. Dark. Pinned, 400vh, scrubbed (`scrub: 0.6`), 4 beats + outro.**
- The world (one inline SVG, `aria-hidden`) occupies the right 60%; the four districts separate along the diagonals by one module width; links between them light in gold as the chip travels. Camera = `<g>` transform: each beat pans/zooms (scale 1.0 to 1.35) toward the active district. Inactive districts drop to 35% opacity.
- Left column: a fixed caption stack; each beat swaps the caption with a 24px y-slide + fade. A small HTML info card (like the reel's) is anchored to the active district: module name + 1 line.
- Beat copy (H2 serif, body sans; module lines are the app's own wording):
  1. **Counter.** *A bill at the counter.* Sales & Accounts Receivable: billing at the counter, orders and estimates, receipts, and what customers owe.
  2. **Godown.** *The stock moves with it.* Store & Inventory: items, today's rate, where stock is, and everything that moves it. FIFO, LIFO, moving average or board-rate valuation.
  3. **Floor.** *The floor knows what to make.* Production Plan & Manufacturing: BOMs, production plans and orders, material to the floor, receipts costed batch by batch, variance and the Production Journal.
  4. **Ledger.** *And the ledger already has it.* Finance & Accounts, Tax & IRD: true double-entry, VAT worked out on each line and gathered into the VAT books, Annex 9 and Annex 13.
  - Outro (last 15%): all four districts lit, chip parked on the ledger. Line in display serif: **Typed once. Every number agrees.** (from the brief: "nothing is typed twice and the numbers always agree").
- Chip label: `SI-2083/84-00001` in mono, gold on night. It moves along the link paths with GSAP `motionPath`? **No**: MotionPathPlugin is extra weight; the links are straight 45-degree segments, so tween `x`/`y` between four known points.

**Scene 2: Proof. Dark to light. Pinned, 140vh.**
- The Ledger slab's top face scales up to cover the viewport (transform on the world `<g>`). At 40% a full-bleed layer with the **Home (Paint)** screenshot in a browser frame reveals through `clip-path: inset(..% round 32%)` that opens from a rounded square (the module square shape) to the full frame (`round 14px`). Background tweens `--color-night` to `--color-ground` between 40% and 80%.
- Copy (appears at 70%, light section from here):
  - H2: **This is the real screen.**
  - Body: Ten modules on one menu. Ctrl K finds any entry. Switch companies from the top bar, and read every date in Bikram Sambat and AD.
  - Caption under frame (standard demo caption, see section H): Demo company "Kathmandu Paints", sample figures. The Paint edition is coming.

**Scene 3: Work Desk. Light (`--color-ground`). Not pinned. 1 viewport + parallax.**
- Layout: copy 5 columns left, frame 7 columns right, bleeding off the right edge on desktop.
- Screenshot: **Work Desk (redacted)**, cropped to the top 60% ("Good afternoon, Paint" to the end of "Needs you now"). Inside the frame the image translates y from 0 to -8% while the frame translates +6% (counter-parallax), `scrub: true`.
- Three numbered markers (HTML, gold ring, 28 px) placed over the three "CRITICAL" cards with short labels outside the frame: "Over the credit limit", "Order late on the floor", "Journal not posted". Markers point at real UI; they do not alter it.
- Copy: H2 **Mornings start with what needs you.** Body: The Work Desk lists what is late, critical or due, across every module: a customer over the credit limit, a manufacturing order past its date, a supplier payment coming up. The action is one click away. Link: **See the Work Desk** (`/work-desk/`).

**Scene 4: The whole business on one page. Light (`--color-paper`). Pinned, 160vh.**
- Screenshot: **Executive dashboard (Paint, redacted)**. Starts as a full frame at 72% width; scroll zooms (scale 1 to 1.9, transform-origin top-left area of the "Sales · Aswin 2083" card) so the sales card fills the frame, then pans right to "Running total against target", then down to "At a glance". Three stops, each with a caption that swaps in a side column:
  1. Sales for the period, against the same days last month.
  2. A running total against target.
  3. At a glance: money received, what customers owe, what you owe, cash and bank.
- H2: **The whole business on one page.** (the app's own subtitle). Sub: Today, this month, last month or year to date.

**Scene 5: Nepal built in. Dark (`--color-night`). Pinned, 140vh. Giant type.**
- Mega type, full width: **2083** (serif, `--text-mega`, gold 0 to 100% fill via `background-clip:text` sweep tied to scroll). Under it in mono: `2083-06-14 BS · 2026-09-30 AD` (verbatim from the app top bar).
- At 50% the "2083" slides up and the four facts stack in, one per 12% of scroll:
  - Bikram Sambat dates and fiscal years throughout, documents numbered by fiscal year (`SI-2083/84-00001`).
  - 13% VAT on each line, the VAT books, the monthly VAT return, Annex 9 and Annex 13.
  - TDS where it applies, on labour and services.
  - E-invoicing in the CBMS format IRD publishes: CBMS-ready, built to IRD's current formats.
- H2 (above the facts): **Made for the way Nepal does business.**

**Scene 6: Ten modules, one core. Light. Desktop: pinned horizontal track, 200vh. Mobile: native `scroll-snap-type: x mandatory` row.**
- 10 module cards (from `src/content/modules.ts`): lucide icon in a rounded-square chip (radius 32% = the symbol's corner ratio), module name, the app's one-line description. Cards 320 x 360, gap 24. A thin gold line runs through all cards at icon height (the "core").
- H2: **Ten modules. One ledger underneath.** Link: **All modules** (`/modules/`).
- Trade & Finance gets one more line on its card: LCs, bank guarantees, foreign-currency revaluation.

**Scene 7: One trade at a time. Light (`--color-ground`). Not pinned.**
- H2: **Built one trade at a time.** Body: Every Tivora product shares the same accounting core and stock engine, and adds a pack for its own trade.
- Left: large card **Tivora ERP – Jewelry, available now**. Screenshot **Home (Jewelry)** cropped to the modules grid, masked in a rounded-square-cornered frame, `Menu Jewelry` strip overlapping its left edge (y-parallax +40px). Bullets: Karigar / Workshop, RFID, Gold Loans, board rates. Link **See Jewelry** (`/industries/jewelry/`).
- Right: list of trades, each a row with a "Coming" pill, no feature lists: Tivora ERP (general trading and accounting), Paint, then FMCG, Automobile, Home Appliances, Pharma.

**Scene 8: Made by HiTech. Light (`--color-paper`). Short.**
- One line plus link, **no figures on the home page** (brief: figures belong on About): Tivora ERP is the new platform from HiTech Solutions and Services, who have built business software in Nepal for more than 25 years. Link **About HiTech** (`/about/`).

**Scene 9: Back to the core + demo form. Dark. Pin 100vh for the collapse only.**
- The world (small, centred) collapses: districts slide back along the diagonals into four slabs, slabs un-tilt, cross-fade into the official symbol `<img>`. Then the form section scrolls normally.
- H2: **See it on your own numbers.** Body: Tell us about your business and we will show you Tivora ERP on a trade like yours. Form: `DemoForm` (section E). Side: address, phones, email.

---

## B. Design tokens

All tokens live in **one place: `src/app/globals.css` `@theme`**. Components use Tailwind utilities generated from them (`bg-night`, `text-gold`, `text-h2`, `py-section`, `max-w-content`, `rounded-module`, `ease-out-expo`). No hex values, no arbitrary `[..]` colours or sizes anywhere else. GSAP reads durations/eases from `src/lib/motion.ts`, which mirrors the motion tokens (only place duplication is allowed; keep the comment pointing back).

### B1. Colour

Provenance labels are mandatory as comments in `globals.css`.

```css
@theme {
  /* OFFICIAL: from the logo file assests/attached-logo.svg. Only these three are brand colours. */
  --color-bronze: #6E4A14;   /* mark + TIVORA */
  --color-gold:   #C08A2E;   /* mark accent + ERP + sparkle */
  --color-slate:  #5E574B;   /* descriptor line */

  /* DOCUMENTED, brand-adjacent: Tivora ERP Website Brief (29 Sep 2026), brand section */
  --color-accent: #8A6420;   /* buttons/links on light */
  --color-ground: #F6F4F0;   /* page ground (light) */
  --color-ink:    #1C1A16;   /* text on light; also raised dark surface */

  /* DOCUMENTED, brief stylesheet (not brand): light theme support */
  --color-paper:  #FFFEFB;   /* cards / alt light section */
  --color-rule:   #E3DDD1;   /* hairlines on light */
  --color-tint:   #F3EAD8;   /* highlighted panel on light */
  --color-muted:  #6B6457;   /* secondary text on light */
  --color-ok:     #2F6B3A;   /* "Available now" pill text */
  --color-ok-tint:#E5EFE2;

  /* DOCUMENTED, brief stylesheet dark theme */
  --color-gold-soft:   #D3A65B; /* gold text/links on dark when #C08A2E feels heavy */
  --color-gold-light:  #E0B872; /* hover on dark */
  --color-muted-dark:  #A99E8B; /* secondary text on dark; reversed descriptor */
  --color-rule-dark:   #332C20; /* hairlines on dark */

  /* DERIVED (this spec): shades of ink/bronze for the cinematic dark mode */
  --color-night:   #110D08;  /* primary dark ground: --color-ink darkened ~40%, hue 35deg of bronze */
  --color-night-2: #1C1A16;  /* = --color-ink, raised surface on dark */
  --color-night-3: #2A241B;  /* cards on dark, slab side faces */
  --color-slab-top:#3B3224;  /* iso slab top face on dark */
}
```

Light/dark is **per section**, not a site theme toggle. The site does not follow `prefers-color-scheme` (the art direction is fixed); `color-scheme` is set per section (`dark` on night sections) so form controls and scrollbars match.

Section tones: `night` (dark cinematic: hero, world, Nepal, closing CTA), `ground` (default light), `paper` (alternate light). Never two adjacent sections of the same tone unless they are one scene.

### B2. Contrast rules (measured, WCAG 2.1)

| Pair | Ratio | Rule |
|---|---|---|
| ground text on night `#F6F4F0/#110D08` | 17.6 | body on dark |
| muted-dark on night `#A99E8B/#110D08` | 7.3 | secondary on dark |
| gold on night `#C08A2E/#110D08` | 6.4 | gold text allowed on night / night-2 (5.7) / night-3 (5.1) |
| ink on gold `#1C1A16/#C08A2E` | 5.7 | **primary button on dark: gold fill, ink label** |
| ink on ground | 15.8 | body on light |
| muted on ground `#6B6457` | 5.3 | secondary on light |
| accent on ground `#8A6420` | 4.9 | links / eyebrows on light |
| paper on accent | 5.3 | **primary button on light: accent fill, paper label** |
| gold on ground | **2.8 FAIL** | never gold text on light; gold only as fills, lines, icons >=3:1 not required for decoration |
| bronze on night | **2.4 FAIL** | never bronze on dark; on dark the logo uses the reversed file |

Other rules: body text >= 16 px, inputs 16 px (iOS zoom), tap targets >= 44 px, focus ring `2px solid` gold on dark / accent on light, `outline-offset: 3px`, never removed. Text never sits on a screenshot without a solid panel behind it.

### B3. Type

Fonts via `next/font/google` in `src/app/layout.tsx`, all `display: "swap"`, `subsets: ["latin"]`:

| Role | Family | next/font | Weights | Why |
|---|---|---|---|---|
| UI, body, headings H3 and below | Manrope | `Manrope` (variable) | variable | brief: Manrope for everything on the site |
| Display (H1, H2, mega, scene titles) | Source Serif 4 | `Source_Serif_4` | `["600"]`, normal only | the app sets page titles in a sturdy text serif ("Namaste, Paint", "Kathmandu Paints"); exact app font is unconfirmed, Source Serif 4 600 is the closest Google equivalent by eye. Echoes the product so the screenshots feel native. |
| Eyebrows, numbers in chips, doc numbers | IBM Plex Mono | `IBM_Plex_Mono` | `["500"]` | brief uses IBM Plex Mono; app metadata lines look like it. Replaces JetBrains Mono. |

Never set "TIVORA ERP" in any font: always the logo file.

```css
@theme {
  --font-sans:    var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-serif), ui-serif, Georgia, serif;
  --font-mono:    var(--font-plex-mono), ui-monospace, monospace;

  --text-mega: clamp(5rem, 1rem + 18vw, 16rem);      --text-mega--line-height: 0.85;   --text-mega--letter-spacing: -0.04em;
  --text-display: clamp(2.5rem, 1.3rem + 5vw, 5.75rem); --text-display--line-height: 1.0; --text-display--letter-spacing: -0.025em;
  --text-h1: clamp(2.25rem, 1.6rem + 2.8vw, 4rem);   --text-h1--line-height: 1.05;   --text-h1--letter-spacing: -0.02em;
  --text-h2: clamp(1.75rem, 1.3rem + 2vw, 3rem);     --text-h2--line-height: 1.1;    --text-h2--letter-spacing: -0.015em;
  --text-h3: clamp(1.1875rem, 1.1rem + 0.45vw, 1.5rem); --text-h3--line-height: 1.25;
  --text-lead: clamp(1.0625rem, 1rem + 0.35vw, 1.25rem); --text-lead--line-height: 1.6;
  --text-body: 1rem;      --text-body--line-height: 1.65;
  --text-small: 0.875rem; --text-small--line-height: 1.5;
  --text-eyebrow: 0.75rem; --text-eyebrow--line-height: 1.2; --text-eyebrow--letter-spacing: 0.14em;
}
```

Usage: `display` and `h1`/`h2` in `font-display` (serif 600); `h3`, nav, buttons in Manrope 700; body Manrope 400/500; eyebrow `font-mono uppercase`. One `<h1>` per page. `text-wrap: balance` on headings, `pretty` on paragraphs. Max line length 64ch.

### B4. Space, layout, radius, depth, motion

```css
@theme {
  /* Section rhythm (from memory.md section 9, kept) */
  --spacing-section-sm: clamp(3rem, 2.4rem + 2.5vw, 4rem);
  --spacing-section:    clamp(4rem, 3rem + 4vw, 6rem);
  --spacing-section-lg: clamp(5rem, 3.5rem + 6vw, 8rem);
  --spacing-stack:      clamp(2rem, 1.6rem + 1.5vw, 2.5rem);
  --spacing-stack-lg:   clamp(2.5rem, 2rem + 2vw, 3.5rem);
  --spacing-gutter:     clamp(1rem, 0.5rem + 2vw, 2rem);   /* 16 px at 360, 32 px at >=1200 */
  --spacing-header:     4rem;                               /* 64 px header height */

  /* Containers (max-w-*) */
  --container-content: 76rem;  /* 1216 */
  --container-wide:    90rem;  /* 1440, screenshot scenes */
  --container-prose:   42rem;  /* 672 */

  /* Radius. --radius-module = corner/side ratio of the logo squares (12.57/38.86 = 0.32) */
  --radius-sm: 6px;  --radius-md: 10px;  --radius-lg: 16px;  --radius-xl: 24px;
  --radius-frame: 14px;      /* browser frame around screenshots */
  --radius-module: 32%;      /* icon chips, mask shape, anything that quotes the symbol */

  /* Depth */
  --shadow-card:  0 1px 2px rgb(28 26 22 / 0.05), 0 12px 32px -12px rgb(28 26 22 / 0.18);
  --shadow-frame: 0 0 0 1px rgb(28 26 22 / 0.08), 0 40px 100px -40px rgb(28 26 22 / 0.45);
  --shadow-frame-dark: 0 0 0 1px rgb(246 244 240 / 0.08), 0 40px 120px -30px rgb(0 0 0 / 0.7);
  --shadow-glow-gold: 0 0 80px 8px rgb(192 138 46 / 0.22);

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 160ms;   /* hover, focus */
  --duration-base: 320ms;   /* menus, pills */
  --duration-slow: 700ms;   /* reveals */
  --duration-reveal: 1000ms;/* scene caption swaps (non-scrubbed) */
}
```

Plus in `@layer base`/`@layer utilities` (not tokens): `.container-x` (`mx-auto px-gutter max-w-content`), `.bg-ember` (`radial-gradient(60% 50% at 50% 40%, rgb(192 138 46 / .18), transparent 70%)`), `.frame` (browser chrome, see `Screen`), and the global reduced-motion override (`@media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important; scroll-behavior:auto!important } }`). **No** global `scroll-behavior: smooth`.

Grid: 12 columns, `gap-6 lg:gap-8`. Copy/visual split 5/7.

---

## C. Routes and information architecture

Eight routes. All static, all `trailingSlash: true`. No dynamic segments (nothing to `generateStaticParams`).

| Path | Page | Content source | Key sections |
|---|---|---|---|
| `/` | Home | section A | Scenes 0-9 |
| `/platform/` | The core | brief "What is Tivora ERP", "three reasons", /nepal and /security copy | PageHero ("One accounting core. One stock engine."), Three reasons (Books your auditor accepts / Stock that adds up / Nepal built in, brief copy verbatim), Built for Nepal (`#nepal`, brief /nepal copy + fiscal-year number example), Your records stay yours (`#security`, brief /security copy), How you move around (Ctrl K menu search, modern vs classic menu with `Menu 1` and `classic` screenshots side by side, company switcher, BS+AD dates, light and dark themes), CTA band |
| `/modules/` | Modules | `src/content/modules.ts` | PageHero, sticky module rail (left, desktop) listing the 10 modules + "Jewelry pack" group with 4; one anchored section per module (`#sales`, `#customer-services`, `#purchase`, `#inventory`, `#production`, `#finance`, `#trade-finance`, `#tax`, `#reports`, `#administration`, `#jewelry-pack`): icon chip, name, app one-liner, 3-6 bullets from the brief's /features list; screenshots: `sales-dashboard` under Sales, `finance-dashboard` under Finance, `dashboards` under Reports. CTA band |
| `/work-desk/` | Work Desk & Dashboards | screenshots + product doc | PageHero ("Mornings start with what needs you."), Work Desk (redacted screenshot, three markers as on home), Dashboards index (`dashboards` screenshot: one dashboard per module, each opening on its trend with your work, what is critical and what is outstanding a tab away; app wording), Executive dashboard (zoom scene reused from home as a lighter non-pinned version), CTA band |
| `/industries/` | Industries | `src/content/trades.ts` | PageHero ("Built one trade at a time."), Jewelry card (available now, link), Coming list (General trading and accounting, Paint, FMCG, Automobile, Home Appliances, Pharma) with "Coming" pills and **no feature lists**, CTA band |
| `/industries/jewelry/` | Tivora ERP – Jewelry | brief /jewelry copy | PageHero (brief: "Your gold is accounted for, every gram of it."), In the showroom / In the workshop / When you grow (brief copy verbatim), Jewelry modules (Karigar / Workshop, Manufacturing, RFID, Gold Loans with the app's lines), screenshots `home-jewelry` + `menu-jewelry`, Plans strip: Standard (one showroom), Business (a growing shop with a workshop), Enterprise (manufacturers and chains), each "Ask for a quote" to `/contact/?trade=jewelry`. No limits table in v1. CTA band |
| `/about/` | About HiTech | brief /about copy | PageHero ("Made by HiTech"), HiTech figures **attributed**: "HiTech Solutions and Services: 25+ years · 10,000+ clients · 100+ professionals · 15+ branches", other HiTech products as one line (Swastik, Swastik POS, Swastik Restaurant, Bizant, Pharmasoft, HiTech Payroll, HiTech Smartsuite), office address + phones, link to www.hitechnepal.com.np |
| `/contact/` | Request a demo | brief /contact | PageHero ("See it on your own numbers."), `DemoForm`, contact block (address, 3 phones, info@ and support@, website). Reads `?trade=` to preselect the trade |
| 404 | `not-found.tsx` | | short message, links to `/` and `/contact/` |

**Cut (and why):** per-module detail routes (evidence per module is 1-6 lines; anchors on `/modules/` carry it without thin pages), `/plans` and the limits table (prices and plan naming are open questions; plan names live on `/industries/jewelry/`), `/security` and `/nepal` as separate pages (sections on `/platform/` with anchors), industry pages for coming trades (policy: no feature lists), video tour, testimonials, logos wall, blog, FAQ (the brief's IRD answer is flagged "check with owner"), old-hash redirect script (old anchors fall back to the homepage, acceptable).

**Header** (`SiteHeader`): official logo (left) | Platform · Modules · Work Desk · Industries · About | **Request a demo** button (always visible on >=640 px). Height 64 px, sticky. Over night sections: transparent background, reversed logo, ground text; over light sections: `bg-ground/85` with `backdrop-blur-md`, official logo, ink text. Switch with an `IntersectionObserver` on `[data-tone="night"]` sections under the header line (no scroll listeners). Active link via `usePathname()` with `aria-current="page"`. Mobile (<1024): logo + "Menu" button (`aria-expanded`, `aria-controls`), full-screen night panel, links in serif h2 size, Esc closes, focus returns to button, body scroll locked; demo CTA as full-width button at the bottom of the panel. Below 640 px a sticky bottom bar "Request a demo" appears after the hero (hidden on `/contact/`).

**Footer** (`SiteFooter`, night): reversed logo + descriptor (the lockup carries it), tagline "One platform. Every business.", columns: Product (Platform, Modules, Work Desk, Industries), Company (About HiTech, Request a demo, hitechnepal.com.np), Contact (address, phones, info@). Bottom line: "Tivora ERP is a product of HiTech Solutions and Services Pvt. Ltd., Kathmandu. Screens show a demo company with sample data." Footer `<Link prefetch={false}>`.

**CTA wording:** primary everywhere "Request a demo" (header) / "See it on your own numbers" (scene CTAs). Plans: "Ask for a quote". Never "Book a free demo", "Start free trial", "Buy".

**Metadata** (`src/lib/seo.ts` helper `pageMeta({ title, description, path })` returns `title`, `description`, `alternates.canonical`, full `openGraph` with `images: ["/opengraph-image.png"]`, because a page-level `openGraph` replaces the parent's). Root layout: `metadataBase: new URL("https://tivoraerp.com")`, `title: { default: "Tivora ERP · One platform. Every business.", template: "%s · Tivora ERP" }`, description: "Tivora ERP from HiTech, Kathmandu: sales, buying, stock, production and accounts in one system, with Bikram Sambat dates, VAT and IRD formats built in." `viewport.themeColor: "#110D08"`. JSON-LD `Organization` for HiTech (name, address, telephone, url) in the root layout as a `<script type="application/ld+json">`. `sitemap.ts` and `robots.ts` with `export const dynamic = "force-static"`.

---

## D. Motion system

**Libraries.** GSAP 3.15 + ScrollTrigger + `@gsap/react` only (already installed). **Remove `motion`** (second animation runtime, ~35-45 KB gz, nothing it does here GSAP + CSS cannot) and with it `Providers.tsx`. **No Lenis**: native scroll + `scrub: 0.6` is smooth enough and keeps scroll accessible and cheap. **No three.js / r3f**: the world is isometric, so true 3D buys nothing a projected SVG cannot draw; three + r3f is ~150-200 KB gz plus GPU cost on mid-range Androids, unacceptable for Nepali mobile data. **No MotionPathPlugin, no SplitText** (straight segments; word reveals done with CSS on spans if needed).

**The isometric world.** `src/lib/iso.ts` exports `iso(x, y, z)` (2:1 dimetric: `sx = (x - y) * cos30`, `sy = (x + y) * sin30 - z`) and `prism(x, y, z, w, d, h)` returning `{ top, left, right }` polygon point strings. `src/components/home/IsoWorld.tsx` is a **server component** that renders one `<svg viewBox="0 0 1200 900" aria-hidden="true">` with groups `#d-counter`, `#d-godown`, `#d-floor`, `#d-ledger`, `#links`, `#chip`. Each district = one rounded slab (the module square: draw the top face as a path with corner radius 32% projected; side faces as prisms) + at most 12 low-poly props:
- Counter: counter block, till, two bill slips stacked.
- Godown: 3 rack rows of 4 boxes each.
- Floor: 2 tanks (tall prisms), 1 mixer block, conveyor slab.
- Ledger: 4 stacked book slabs rising like a tower, one open VAT-book slab on top.
Colours: top faces `--color-slab-top`, left faces `--color-night-3`, right faces `--color-night-2`, edges 1px `--color-rule-dark`; one gold face per district (the gold corner of the mark = Counter has the gold slab edge); links 6px gold stroke at 45 degrees, `stroke-dasharray` animated to "light up". Total SVG < 20 KB, < 200 nodes. GSAP animates only `transform` and `opacity` on groups and `stroke-dashoffset` on links.

**Scroll wiring.** One `gsap.matchMedia()` per scene component using `MOTION_QUERIES` from `src/lib/gsap.ts` (desktop / mobile / reduce), inside `useGSAP({ scope })` so everything reverts on unmount/route change. Pins use `pinSpacing: true` and are set up in DOM order. Call `ScrollTrigger.refresh()` once after fonts load (`document.fonts.ready`) in `ScrollRefresh` (mounted once in the root layout). One shared reveal: `RevealRoot` runs `ScrollTrigger.batch("[data-reveal]", ...)` (fade + 24px rise, `--duration-slow`, `ease-out-expo`), so ordinary sections need no client code; elements are visible by default and only hidden by a `.js-reveal` class that the script adds (no-JS and crawler safe).

**Mobile (<1024 px, motion allowed):** Scene 0 pin 100vh; Scene 1 pin 250vh with the world at full width on top and captions in a fixed panel below it (no overlay cards); Scene 2 mask reveal not pinned (plays once on enter, 0.9s); Scene 4 no zoom: three cropped stills (pre-cropped files, see E) in a swipe row; Scene 5 no pin, "2083" fills on enter; Scene 6 native scroll-snap row; Scene 9 collapse not pinned (plays on enter). `ScrollTrigger.config({ ignoreMobileResize: true })`.

**Reduced motion (`prefers-reduced-motion: reduce`):** no pins, no scrub, no parallax, no auto-playing anything. World rendered once in its "all lit" outro state with the 4 beats as a static numbered list beside it; screenshots static; reveals off (content visible). Must read as a complete page.

**Performance budgets (enforced in F):**
- First-load JS: home <= 150 KB gz (GSAP+ST ~ 45 KB of it); other routes <= 110 KB gz. GSAP is imported only by client components that animate (home scenes, `RevealRoot`, header observer does not need GSAP).
- LCP <= 2.5 s on Lighthouse mobile (Slow 4G): LCP element is the hero H1 text; the symbol `<img>` has `fetchPriority="high"` and explicit size. No images above the fold except the symbol SVG.
- CLS <= 0.02: every `<img>` has `width`/`height`; pinned scenes reserve height via `pinSpacing`; fonts with `display: swap` + next/font fallback metrics.
- TBT <= 200 ms. INP <= 200 ms.
- Images: WebP; 1600 w <= 180 KB, 960 w <= 90 KB each; home total image transfer <= 900 KB; all below-fold `loading="lazy" decoding="async"`.
- Fonts total <= 120 KB (3 families, 1 weight each except Manrope variable).
- Animate only `transform`, `opacity`, `clip-path`, `stroke-dashoffset`. No `filter: blur()` animation. `will-change` only during pins.
- 60 fps target on a mid-range Android (test with 4x CPU throttle in DevTools: no long frames > 50 ms during scrub).

---

## E. Component and file plan

### E1. Delete

```
src/components/sections/**            (all 21 files incl. old DemoForm; rewritten below)
src/components/product/**             (ExecutiveDashboardMock is a redrawn UI: forbidden)
src/components/ui/**                  (AnimatedNumber, Button, Reveal, SectionHeading, Spark, VideoFrame, VideoModal, WhatsAppGlyph)
src/components/Providers.tsx
src/lib/chart.ts
src/app/favicon.ico                   (replaced by src/app/icon.svg)
public/videos/**                      (old teal brand + phone/WhatsApp flow; 31 MB)
public/brand/tivora-logo.svg, tivora-logo-white.svg, tivora-symbol-white.svg   (old teal)
public/brand/tivora-symbol.svg        (old teal; regenerated with the same name, bronze)
package.json: remove "motion"; move "ffmpeg-static", "ffprobe-static" out (delete: no video left); add devDependency "sharp": "0.35.5" (already installed transitively; make it explicit for the scripts)
```

### E2. Keep (modify only as stated)

```
src/app/api/demo/route.ts      add `city` (clean(v,80)); rename nothing; keep 422/503/502 behaviour
src/app/api/health/route.ts    unchanged
src/lib/gsap.ts                unchanged (MOTION_QUERIES stays the contract)
scripts/build-static.mjs       add asserts: out/<route>/index.html for all 8 routes, out/sitemap.xml, out/robots.txt, and no "_next/image" in out/**/*.html
deploy/static/.htaccess        DirectoryIndex index.html index.php; RewriteEngine On + www->apex + https rules; immutable cache for /_next/static; remove video ExpiresByType
deploy/static/api/demo/index.php  add `city` field, same limits as route.ts
next.config.ts                 trailingSlash: true and images: { unoptimized: true } in both modes; headers() source becomes "/:dir(brand|screens)/:file*"
Dockerfile, docker-compose.yml unchanged
```

### E3. Create

```
scripts/brand-variants.mjs     reads public/brand/tivora-official.svg, writes the 3 variants (E4), asserts the multiset of `d=` attributes per variant equals the source subset (logo integrity check). Run: node scripts/brand-variants.mjs
scripts/prep-screens.mjs       sharp: reads ../Tivora ERP/Assests/*.PNG (path constant at top), applies redactions + crops (E5), writes public/screens/<slug>-960.webp and -1600.webp (menus: -1x and -2x at native width), and a scratch contact sheet for visual check (not committed). Outputs are committed; script is re-runnable.

src/app/globals.css            rewritten: @import "tailwindcss"; @theme tokens (section B); base; utilities
src/app/layout.tsx             fonts, metadata, JSON-LD, <SkipLink/>, <SiteHeader/>, <main id="main">, <SiteFooter/>, <RevealRoot/>, <ScrollRefresh/>
src/app/icon.svg               copy of public/brand/tivora-symbol.svg
src/app/opengraph-image.png    1200x630: official logo centred on --color-ground, tagline under it in Manrope (made by prep-screens.mjs with sharp)
src/app/page.tsx               home: composes scenes 0-9
src/app/platform/page.tsx
src/app/modules/page.tsx
src/app/work-desk/page.tsx
src/app/industries/page.tsx
src/app/industries/jewelry/page.tsx
src/app/about/page.tsx
src/app/contact/page.tsx
src/app/not-found.tsx
src/app/sitemap.ts             from nav in src/content/site.ts; force-static
src/app/robots.ts              force-static

src/content/site.ts            company, contact, descriptor ("HiTech Intelligent ERP Solution"), nav, footer, DEMO_CAPTION strings (replaces src/lib/site.ts; delete that file)
src/content/modules.ts         10 core + 4 jewelry modules: { slug, name, icon (lucide name), appLine, bullets[], pack: "core"|"jewelry" }
src/content/trades.ts          { slug, name, status: "available"|"coming", href? }
src/content/screens.ts         registry: { slug, alt, width, height, caption, edition: "paint"|"jewelry"|"core", srcSet } for every file in public/screens
src/lib/seo.ts                 pageMeta()
src/lib/iso.ts                 iso(), prism()
src/lib/motion.ts              EASE/DURATION constants mirroring the tokens

src/components/brand/Logo.tsx          <img> of the right file; props: kind "lockup"|"symbol", tone "light"|"dark", className; alt "Tivora ERP" (symbol alt "" when next to text)
src/components/layout/SiteHeader.tsx   client
src/components/layout/SiteFooter.tsx   server
src/components/layout/SkipLink.tsx     server
src/components/layout/Section.tsx      server; props tone "night"|"ground"|"paper", size "sm"|"md"|"lg", id?; sets data-tone, color-scheme, padding (only place vertical padding is set)
src/components/layout/PageHero.tsx     server; eyebrow, title (h1 serif), lead, actions; night tone; top padding includes header
src/components/layout/CtaBand.tsx      server; "See it on your own numbers" + button
src/components/ui/ButtonLink.tsx       server; variant "primary"|"secondary"|"ghost", tone-aware via data-tone ancestor CSS
src/components/ui/Screen.tsx           server; browser frame (3 dots + address pill showing "Tivora ERP" text, no URL) around <img srcSet sizes width height loading>; optional caption (defaults to the edition's demo caption); props: slug, priority?, crop? (object-position), className
src/components/ui/Pill.tsx             server; "Available now" (ok) | "Coming" (muted)
src/components/ui/ModuleIcon.tsx       server; lucide icon in rounded-module chip
src/components/motion/RevealRoot.tsx   client; ScrollTrigger.batch on [data-reveal]
src/components/motion/ScrollRefresh.tsx client; refresh after document.fonts.ready and on pathname change
src/components/forms/DemoForm.tsx      client; fields below

src/components/home/HeroCore.tsx       Scene 0 (client)
src/components/home/IsoWorld.tsx       the SVG (server, imported by the client scenes as children)
src/components/home/OneBillScene.tsx   Scenes 1 (client; pins, chip, captions)
src/components/home/ProofReveal.tsx    Scene 2 (client)
src/components/home/WorkDeskScene.tsx  Scene 3 (client, parallax only)
src/components/home/DashboardZoom.tsx  Scene 4 (client); prop `pinned` (home true, /work-desk false)
src/components/home/NepalScene.tsx     Scene 5 (client)
src/components/home/ModuleTrack.tsx    Scene 6 (client on desktop pin; mobile CSS only)
src/components/home/TradesScene.tsx    Scene 7 (server + data-reveal)
src/components/home/ClosingScene.tsx   Scenes 8-9 (client for the collapse; contains <DemoForm/>)
```

Lucide: check each icon name exists in `node_modules/lucide-react` (v1.52 renamed several). Suggested: ReceiptText, HeartHandshake, ShoppingCart, Package, Factory, Scale, Landmark, FileText, ChartColumn, SlidersHorizontal, Hammer, FlaskConical, ScanLine, LockKeyhole.

**DemoForm fields** (brief): Name (required), Business name, Trade (select: Jewelry, General trading, Paint, FMCG, Automobile, Home Appliances, Pharma, Other), City, Phone (required unless email), Email (optional), Message. Visible `<label>`s, 16 px inputs, `autocomplete` set, `inputmode="tel"`. POST JSON to **`/api/demo/`** (trailing slash). Keys: `name, company, industry, city, phone, email, message` (keeps the handlers' existing key names). States: idle / sending (button disabled, "Sending...") / sent ("Thank you. We will call you back." no promise of time) / error (server message + phones). Errors `role="alert"`. Preselect trade from `?trade=` via `useSearchParams` inside a `<Suspense>` (required for static export).

### E4. Logo variants (recolour only; no path, viewBox-proportion or spacing change)

Source: `public/brand/tivora-official.svg` (keep it, byte-identical to `assests/attached-logo.svg`). Never recolour anything inside `<mask>` or `<clipPath>` (lines 3-5, 7-10, 17-20, 69-74: their white/black are luminance masks).

| File | How | Use |
|---|---|---|
| `tivora-official.svg` | untouched | light grounds, lockup (header on light, About) |
| `tivora-logo-dark.svg` | `#6E4A14` to `#F6F4F0` everywhere outside masks; `#C08A2E` unchanged; `#5E574B` to `#A99E8B`; glyph `fill="white"`/`stroke="white"` on lines 30-43 to `#110D08` | night grounds (header over night, footer) |
| `tivora-symbol.svg` | keep lines 1-45 + `clip0` def only (drop the `clip1` group lines 46-66, the descriptor path line 67, and the `clip1` def); set `width="96" height="96" viewBox="0 2 96 96"` | favicon, light-ground symbol |
| `tivora-symbol-dark.svg` | symbol cut + the dark recolour | hero, closing scene |

Minimum sizes: lockup height >= 32 px (descriptor is illegible below that; see G4); symbol >= 20 px. Clear space = 1/4 of symbol height on all sides. Always via `<img>` (inline SVG would collide mask IDs). No effects, no outlines, no rotation except the hero's documented isometric transform of the symbol file.

### E5. Screenshot prep (`public/screens/`)

Coordinates below are approximate in source pixels (~1.48 x the 1280-wide preview); the engineer measures exactly on the source and confirms visually on the contact sheet. Redaction = `sharp` composite of a blurred copy of the same region (sigma 8) so the layout stays readable but text is not.

| Slug | Source | Crop | Redact |
|---|---|---|---|
| `home-paint` | Home Paint.PNG | full | bell badge (approx x1585-1615, y10-40) |
| `work-desk` | Work Desk Paint.PNG | drop bottom 45 px (status URL `dev.tivoraerp.com`) | bell badge; "Bishnu Adhikari" (approx x1180-1300, y400-428); "Balaju Hardware & Paints" (approx x340-560, y350-380); "Everest Chemicals & Pigments Pvt. Ltd." (approx x355-850, y735-765) |
| `executive-dashboard` | Executive dash Paint.PNG | full | bell badge; "Everest Chemicals & Pigments Pvt. Ltd." (approx x1120-1405, y810-855) |
| `executive-sales`, `executive-target`, `executive-glance` | Executive dash Paint.PNG | the three zoom stops for mobile Scene 4 | same as above |
| `sales-dashboard` | sales dash paint.PNG | full | bell badge |
| `finance-dashboard` | Finance and sales dash paint.PNG | full | bell badge |
| `dashboards` | Dashboards.PNG | full | bell badge |
| `home-jewelry` | Home jewelry.PNG | full | none (verify) |
| `menu-paint` | Menu 1.PNG | full | none |
| `menu-jewelry` | Menu Jewelry.PNG | full | none |
| `menu-classic` | classic.PNG | full | none |

Alt text describes what is on screen (e.g. "Tivora ERP Work Desk listing three critical items under Needs you now"), not marketing.

### E6. Work packages

Engineers own **disjoint files**. Shared files (`globals.css`, `src/content/*`, `src/lib/*`, `layout.tsx`, `ui/*`, `layout/*`, `brand/*`) are owned by WP0 and frozen after WP0 merges; changes go through the WP0 owner.

| WP | Owner | Files | Depends on | Done when |
|---|---|---|---|---|
| **WP0 Foundation** | Engineer A | E1 deletions; `package.json`; `next.config.ts`; `scripts/brand-variants.mjs`; `scripts/prep-screens.mjs`; `public/brand/*`; `public/screens/*`; `src/app/{globals.css,layout.tsx,icon.svg,opengraph-image.png,not-found.tsx}`; `src/content/*`; `src/lib/{seo,iso,motion}.ts`; `src/components/{brand,layout,ui,motion}/*`; stub `page.tsx` for all 8 routes (PageHero + "Coming in WP1/WP2") | none | lint, tsc, both builds green; header/footer correct at 360/768/1440; every redaction visually verified on the contact sheet; brand-variants check passes |
| **WP1 Homepage** | Engineer A (after WP0) | `src/components/home/*`, `src/app/page.tsx` | WP0 | Scenes 0-9 per section A at desktop, mobile and reduced motion; budgets met |
| **WP2 Inner pages** | Engineer B | `src/app/{platform,modules,work-desk,industries,about}/**/page.tsx`, `src/components/pages/*` (create only if a block is used on 2+ inner pages) | WP0. `/work-desk/` imports `DashboardZoom` from WP1: build that page last, or use `Screen` until WP1 lands | copy per section C, claims check passes |
| **WP3 Conversion, SEO, build** | Engineer C | `src/app/contact/page.tsx`, `src/components/forms/DemoForm.tsx`, `src/app/api/demo/route.ts`, `deploy/static/**`, `scripts/build-static.mjs`, `src/app/{sitemap,robots}.ts`, `README.md` (deploy section only) | WP0 | form posts in both builds (curl/`php -S`), static asserts pass, sitemap/robots in `out/` |
| **WP4 Verification** | Engineer C, after WP1-3 merge | none (fixes go back to file owners) | WP1-3 | checklist F all green, numbers recorded at the bottom of this file |

Order: WP0 first (single engineer, then merge). WP1, WP2, WP3 in parallel. WP4 last. `ClosingScene` (WP1) imports `DemoForm` (WP3): WP3 lands `DemoForm` first as its first commit; until then WP1 renders a `CtaBand`.

Git: work on a branch, commit per WP. Do not push, deploy, or touch `.gitea/` without the owner's go-ahead (deleted Gitea CI files are an open question in `memory.md`). `AGENTS.md`/`CLAUDE.md` blocks re-added by `next dev` may be committed as is.

---

## F. Acceptance checklist

Build and code
- [ ] `npm run lint` clean.
- [ ] `npx next typegen && npx tsc --noEmit` clean.
- [ ] `npm run build` (standalone) succeeds; `node .next/standalone/server.js` serves all 8 routes, `/about` 308s to `/about/`, `/api/health` 200, `POST /api/demo/` returns 503 with no webhook set and 422 on empty name.
- [ ] `npm run build:static` succeeds; script asserts `out/{,platform/,modules/,work-desk/,industries/,industries/jewelry/,about/,contact/}index.html`, `out/404.html`, `out/sitemap.xml`, `out/robots.txt`; `grep -r "_next/image" out` empty.
- [ ] `php -S localhost:8080 -t out` and POST JSON to `/api/demo/` reaches `index.php` (validation errors returned as JSON).
- [ ] No hex colours outside `globals.css` (`grep -rnE "#[0-9a-fA-F]{3,6}\b" src --include=*.tsx` empty, except `IsoWorld` must use `var(--color-*)` too).
- [ ] No `motion`, `three`, `lenis` in `package.json`; no `<video>` in `src`.

Responsive and accessibility
- [ ] 360, 768, 1440 widths on every route: no horizontal page scroll, header fits, CTAs full width < 640 px, tap targets >= 44 px.
- [ ] `prefers-reduced-motion: reduce` (DevTools emulation): no pins, everything readable, nothing hidden.
- [ ] Keyboard: skip link, visible focus everywhere, mobile menu Esc + focus return, form usable without mouse.
- [ ] One `<h1>` per page; every screenshot has alt text; contrast pairs only from table B2.
- [ ] Zero console errors or warnings in dev and production on every route (including hydration warnings).

Performance (Lighthouse mobile, production build, on `/`, `/industries/jewelry/`, `/contact/`)
- [ ] Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO 100.
- [ ] LCP <= 2.5 s, CLS <= 0.02, TBT <= 200 ms.
- [ ] First-load JS: home <= 150 KB gz, others <= 110 KB gz (from build output).
- [ ] Home image transfer <= 900 KB; no image loads above the fold except the symbol SVG.
- [ ] Scrub smooth at 4x CPU throttle (no frame > 50 ms during Scene 1).

Claims policy (grep `out/**/*.html` and read every page)
- [ ] No: "certified", "approved", "guarantee", "AI", "AI-powered", "free trial", "free", "price", "Rs"/"NPR" prices, "discount", "WhatsApp", "SMS", "mobile app", "App Store", "Google Play", "uptime", "next-gen", "revolution", "launched", "available now" (except the Jewelry pill).
- [ ] Only Jewelry is "Available now"; General, Paint and later trades say "Coming" with no feature lists.
- [ ] HiTech figures appear only on `/about/`, exactly "25+", "10,000+", "100+", "15+", attributed to HiTech.
- [ ] No customer names, logos, counts or testimonials.
- [ ] Every Paint screenshot carries the demo caption; no screenshot is redrawn, recoloured, or edited beyond crop/redaction; all four redactions present.
- [ ] Compliance wording only "CBMS-ready" / "built to IRD's current formats".
- [ ] Root metadata no longer says "IRD certified".

Logo integrity
- [ ] `node scripts/brand-variants.mjs` passes (path `d` sets identical to source).
- [ ] `tivora-official.svg` byte-identical to `assests/attached-logo.svg`.
- [ ] No old teal file referenced anywhere (`grep -rn "12A594\|141C3D\|tivora-logo-white" src public` empty).
- [ ] Logo never below 32 px lockup / 20 px symbol; never set as text.

---

## G. Open questions and risks

1. **Live app access.** `dev.tivoraerp.com` is login-gated and no credentials exist. Screenshots + product doc are the only product source; nothing else may be shown. Fresh, higher-resolution captures (2x, no badge, fictional names) from HiTech would replace every redaction. Ask for them.
2. **Are "Everest Chemicals & Pigments Pvt. Ltd.", "Balaju Hardware & Paints" and "Bishnu Adhikari" fictional?** Default: blurred. If HiTech confirms they are invented demo data, remove those redactions.
3. **Brand conflict.** The brand identity PDF uses navy/teal; the official logo file and the app use bronze/gold. This spec follows the logo file and the brief ("follow the files above"). The "THEME TEST · BRONZE" variant in the PDF should be confirmed as the adopted brand, and the PDF reissued, before print or ads diverge.
4. **No-descriptor lockup.** The only lockup carries "HITECH INTELLIGENT ERP SOLUTION", which is unreadable at header size (32-40 px tall). We may not recompose it. Ask the brand owner for an official symbol + wordmark lockup without descriptor. Also open from the brief: descriptor wording ("ERP Solution" vs "Unified Enterprise Platforms").
5. **Display serif is an inference.** The app's serif heading font is unconfirmed; Source Serif 4 600 is a by-eye match. Confirm with the app team (`apps/jewelry-pos`) and swap the one `next/font` import if different.
6. **Public product name.** "Tivora ERP – Jewelry" vs "ALANZA" for existing customers (brief open question). Spec uses "Tivora ERP – Jewelry".
7. **Paint screenshots on a site where Paint is "coming".** Allowed by the brief with the demo caption, but most homepage screens are the Paint demo. Jewelry-edition captures of Work Desk and the Executive dashboard would fix this.
8. **Form destination.** Email inbox, Zoho CRM or WhatsApp (brief open question). Handlers stay as they are (webhook / PHP mail); configuration is the owner's.
9. **Launch-gated claims** (IRD certified, Nepal Government compliant, AI) switch on only with evidence; when they do, update section H and the grep list in F.
10. **Domain**: `tivoraerp.com` assumed for `metadataBase`, canonical and sitemap. Confirm (brief lists the domain as open).
11. **Deleted media.** Removing both videos drops the only motion footage; a new product film must use the bronze brand and show no phone/WhatsApp delivery.

---

## H. Claims policy (binding, summary of brief + product doc)

- Say: "CBMS-ready", "built to IRD's current formats", "intelligent ERP", "coming", "Ask for a quote", "Request a demo", "See it on your own numbers".
- Don't say: IRD certified, government approved, guaranteed compliance, AI-powered or any AI feature, mobile app, SMS/WhatsApp features, prices/discounts/free trial, uptime or response-time promises, outcome promises ("save X%", "zero errors"), comparisons with competitors or with HiTech's older products, "first next-gen".
- Only Tivora ERP – Jewelry is live. Everything else is "coming", without feature lists.
- HiTech figures are HiTech's: 25+ years, 10,000+ clients, 100+ professionals, 15+ branches. Exactly those numbers, attributed, on About.
- No customer names, logos, counts or testimonials.
- Screenshots: real app, demo data, as-is in a frame; crop/mask/zoom/redact only; never redrawn. Standard captions (in `src/content/site.ts`):
  - Paint: `Demo company "Kathmandu Paints", sample figures. The Paint edition is coming.`
  - Jewelry: `Tivora ERP – Jewelry, demo data.`
  - Core (menus): `Tivora ERP menu, demo company.`

---

## Results log (WP4 fills this in)

Run 2026-10-06 (WP4). First-load JS gz = every `<script src>` in the static export HTML, gzipped (framework + page), excluding the 38.7 KB `noModule` polyfill that modern browsers do not fetch. Lighthouse was not run (no tool available): Perf, A11y, LCP, CLS, TBT are not measured.

| Date | Route | Perf | A11y | LCP | CLS | TBT | First-load JS gz (budget) |
|---|---|---|---|---|---|---|---|
| 2026-10-06 | / | n/m | n/m | n/m | n/m | n/m | 193.8 KB (150) OVER |
| 2026-10-06 | /platform/ | n/m | n/m | n/m | n/m | n/m | 136.5 KB (110) OVER |
| 2026-10-06 | /modules/ | n/m | n/m | n/m | n/m | n/m | 137.6 KB (110) OVER |
| 2026-10-06 | /work-desk/ | n/m | n/m | n/m | n/m | n/m | 182.9 KB (110) OVER |
| 2026-10-06 | /industries/ | n/m | n/m | n/m | n/m | n/m | 136.5 KB (110) OVER |
| 2026-10-06 | /industries/jewelry/ | n/m | n/m | n/m | n/m | n/m | 137.6 KB (110) OVER |
| 2026-10-06 | /about/ | n/m | n/m | n/m | n/m | n/m | 136.5 KB (110) OVER |
| 2026-10-06 | /contact/ | n/m | n/m | n/m | n/m | n/m | 138.2 KB (110) OVER |

Budget notes: React-dom (69.9 KB) + Next client (44.1 KB) + runtime (7.4 + 3.8 + 1.9 KB) is ~127 KB before any page code, so the 110 KB inner-page budget cannot be met on Next 16 + React 19; 150 KB on the home page fails by GSAP (43.5 + 9.3 KB) plus lucide icons (13.8 KB). Moving GSAP out of the root layout (RevealRoot now IntersectionObserver + CSS; ScrollRefresh imports GSAP lazily, only on pages with a `[data-pin]` scene) cut inner pages from 179.8 to 136.5 KB. Treat the inner-page budget as ~140 KB or decide to drop lucide-react on the home route; owner's call.

Other checklist numbers: static export has all 8 routes + 404.html + sitemap.xml + robots.txt, 0 files contain `_next/image`; screens dir 932 KB total; claims grep over `out/**/*.html` finds only "Bank guarantees" (expected), "Available now" only on Jewelry, "25+"/"10,000+" only in `out/about/`; no hex in `src/**/*.tsx`; no teal references; no `motion`/`three`/`lenis`/`<video>`; `brand-variants: OK`; `tivora-official.svg` byte-identical to `assests/attached-logo.svg`.

### Results log: head-of-department review fixes (2026-10-06, Sonnet)

First-load JS gz, same method as above (every non-`noModule` `<script src>` in `out/**/index.html`, gzipped). Before = table above.

| Route | Before | After | Budget note |
|---|---|---|---|
| / | 193.8 KB | 147.1 KB | target ~140: not reached (-7 KB more would need motion code split per scene) |
| /platform/, /industries/, /about/ | 136.5 KB | 136.7 KB | <= 140 met |
| /modules/, /industries/jewelry/ | 137.6 KB | 136.7 KB | <= 140 met |
| /contact/ | 138.2 KB | 138.5 KB | <= 140 met |
| /work-desk/ | 182.9 KB | 139.9 KB | <= 140 met |

How: GSAP + ScrollTrigger now load through one shared dynamic import (`src/lib/scene.ts` `loadGsap()`, on idle after first paint; `useScene()` replaces `useGSAP`, scenes set up in DOM order, one debounced `ScrollTrigger.refresh()`), `@gsap/react` is no longer imported; `ModuleTrack` takes server-rendered `ModuleCards` as children and `ModuleIcon` renders plain SVG from `src/content/icon-nodes.ts` (generated by `scripts/gen-icons.mjs`), because lucide's `Icon` is a client component and shipped even from a server render. SSR output is unchanged (all copy readable without JS); the hero is laid out the same before and after GSAP loads, so nothing above the fold shifts.

Review items: (1) hero and Scene 1 are now ONE pinned scene (`HeroCore.tsx`, `OneBillScene.tsx` deleted, beat copy in `beats.ts`): the real symbol tilts, travels to the world's centre and scales onto its slab tops (measured, not guessed), cross-fades into the world, and the beats start from that exact size and position. No second world instance, no dead frame. (2) World is the full 7 columns with the SVG viewBox cropped to its content (about 20% larger on screen), `--color-slab-top-lit` (derived, labelled in globals.css) lightens the slab tops, and the camera now pivots on the world origin (the old `svgOrigin: "0 0"` zoomed about the SVG corner, which is what pushed Godown off the right edge; GSAP's svgOrigin also drifts under re-mounts, so the camera is a plain object written to the group's `transform`, `makeCamera` in `world.ts`). Active district sits left of centre; info cards are placed from the same anchor. (3) `ProofReveal`: the frame is a full-bleed (cover scale) layer under the rounded-square mask and settles into its 7-column slot from 65% of the scrub. (4) Dashboard stop 3 re-framed (scale 1.62, x 0.468) to the first three At a glance cards; mobile `executive-glance` re-cropped; caption 3 no longer says "cash and bank". The full dashboard still shows the cash and bank card (negative figures) in the opening frame before the first zoom. (5) `--text-mega: clamp(6rem, 26vw, 18rem)`; no overflow at 360, 768, 1440 on all 8 routes. (6) Mobile stills: `home-paint-m1/m2`, `work-desk-m1..m3` (same redactions, then cropped) in swipe rows on Home, Proof and `/work-desk/`. (7) Work Desk markers sit on the card top-right corners and the image no longer moves inside the frame (that parallax was what carried the markers over the text); copy 4 columns, frame 8, bleeding right. (8) About prose no longer restates HiTech figures. (9) Bell badge is covered with the sampled top-bar colour instead of blurred. (10) "jewelry" everywhere (the app's and the product name's spelling); the brief's generic prose says "jewellery", normalised.

Not measured: Lighthouse (no tool), real-device scrub smoothness, reduced-motion emulation (static layout checked in the markup only).
