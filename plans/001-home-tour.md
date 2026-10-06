# 001 · One calm tour for the whole home page

Commit when written: 858e59b · Severity: HIGH (cohesion) · Executor: a model with no context and no taste: follow the values exactly.

## Why
The home page currently has four unrelated motion languages: three GSAP pins with different smoothing (`DashboardZoom` scrub 3 feels floaty, `NepalScene` and `ModuleTrack` scrub 1), scroll-driven CSS fades (`.home-flow`), the autoplay loop in `HeroCore`, and one-shot IntersectionObserver reveals. Nothing tells the visitor where they are in the story. The owner wants "the tour we had at the beginning, but better, more suitable, understandable, professional and elegant": ONE motion language and a visible sense of progress through the page.

Purpose of each addition (named): chapter rail = **state indication** (where am I), progress hairline = **state indication**, grouped stagger = **explanation** (reading order), screen rise = **spatial consistency** (the real screens arrive the same way every time), smoothing = **feedback**. All are occasional-tier (a page is scrolled a few times a day), so they may be visible, but each stays under 700 ms and uses only `transform` and `opacity`.

## Hard limits
- Home first-load JS must stay ≤ 150 KB gzip (it is 147.7 now). No new dependency. If the rail pushes it over, load it with `next/dynamic` (`ssr: false`) after idle.
- No hex in `.tsx`; colours only via tokens in `src/app/globals.css`.
- Content, claims, pages and the demo form do not change. Do not touch `video/**`, `public/videos/**`, `assests/**`, `.gitea/**`.
- Reduced motion: no rail animation, no progress hairline, no stagger, no rise: everything visible and static. No-JS: all content visible.
- Never `transition: all`, never `ease-in`, never `scale(0)`, never animate width/height/top/left.

## Motion language (use these values, nothing else)
- Easing for entering things: `var(--ease-out-expo)` = `cubic-bezier(0.16, 1, 0.3, 1)` (already a token). On-screen movement: `var(--ease-in-out)`.
- Reveal: `opacity 0 → 1`, `translateY(24px) → 0`, `var(--duration-slow)` (700 ms). Existing `.js-reveal` already does this: reuse it.
- Stagger: 70 ms between siblings, max 5 siblings (6th+ share the 5th delay).
- Screen rise: see step 3.
- Scrubbed GSAP scenes: `scrub: 1` everywhere (one smoothing value), `anticipatePin: 1`.

## Steps

### 1. Chapters and ids
Give each home section a stable id so the rail can target it. Current order in `src/app/page.tsx`: `HeroCore` (renders two sections: hero, then explainer), `ProofReveal`, `WorkDeskScene`, `DashboardZoom`, `NepalScene`, `ModuleTrack`, `TradesScene`, `ClosingScene` (its form section already has `id="demo"`).
Add `id` attributes (on the `<section>`/`<Section>` root of each; `Section` accepts an `id` prop) so the chapters are exactly:

| id | label | section |
|---|---|---|
| `tour-platform` | Platform | HeroCore's second section (the explainer; the hero film section above it is not a chapter) |
| `tour-screen` | The real screen | ProofReveal |
| `tour-workdesk` | Work Desk | WorkDeskScene |
| `tour-dashboards` | Dashboards | DashboardZoom |
| `tour-nepal` | Made for Nepal | NepalScene |
| `tour-modules` | Twelve modules | ModuleTrack |
| `tour-editions` | Editions | TradesScene |
| `demo` | Request a demo | ClosingScene form section (existing id) |

Put the list in one constant `CHAPTERS` exported from `src/components/home/TourRail.tsx` (id + label). Where a scene's root is a pinned wrapper, put the id on the outermost element so `scrollIntoView` lands at its start.

### 2. Chapter rail + progress hairline
Create `src/components/home/TourRail.tsx` (client component) and render it once at the top of `src/app/page.tsx`'s wrapper div.
- Markup: `<nav aria-label="Home page chapters" class="tour-rail">` containing an `<ol>` of `<li><a href="#id" aria-current={active ? "location" : undefined}><span class="tour-dot"/><span class="tour-label">Label</span></a></li>`. Real anchor links (works without JS; click scrolls with the browser's native smooth behaviour only when motion is allowed: add `scroll-behavior: smooth` for `html` inside `@media (prefers-reduced-motion: no-preference)` only if not already present).
- Visibility: `hidden` below 1280 px (`xl:flex`), fixed at `left-5`, vertically centred, `z-30` (below the header).
- Dots: 8 px circles, 14 px apart; the active dot is a 8×22 px pill (`transform: scaleY` is NOT allowed to distort the radius: animate `height` is forbidden, so draw the active state as a second absolutely positioned pill whose `transform: translateY(...)` slides to the active slot over `var(--duration-base)` with `var(--ease-out-expo)`).
- Labels: appear on hover and `:focus-visible` only (opacity + `translateX(-4px) → 0`, `var(--duration-fast)`), never permanently, so they cannot cover content at 1280 px.
- Colour follows the section underneath: the observer sets `data-on="night"` or `data-on="light"` on the nav from the active section's `data-tone`; dots use `var(--color-ground)` on night and `var(--color-ink)` on light, with `transition: background-color var(--duration-base) var(--ease-in-out)` so the colour change is smooth.
- Active tracking: one `IntersectionObserver` with `rootMargin: "-45% 0px -45% 0px"` over the chapter elements; the entry that is intersecting is active. No scroll listeners.
- Hairline: a fixed `2px` bar at the very top, `background: var(--color-gold)`, `transform-origin: left`, `transform: scaleX(0)` growing to `1` with `animation: tour-progress linear both; animation-timeline: scroll(root);` inside `@supports (animation-timeline: scroll())` and `@media (prefers-reduced-motion: no-preference)`. Browsers without support simply show no bar. `pointer-events: none`, `z-index` above the header.
- Put all CSS in `src/app/globals.css` under a comment `/* Home tour: chapter rail and progress hairline */`.
- Size check: after building, confirm home first-load JS gzip is ≤ 150 KB. If not, wrap `TourRail` in `next/dynamic` with `{ ssr: false }` loaded from a tiny client wrapper.

### 3. One entrance for every real screen ("rise")
Add to `src/app/globals.css` (inside the existing `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference` guards used by `.home-flow`):
```css
@keyframes screen-rise { from { opacity: 0.55; transform: translateY(40px) scale(0.97); } }
.screen-rise { animation: screen-rise linear both; animation-timeline: view(); animation-range: entry 0% entry 55%; }
```
(No `to` frame: the element ends at its natural state, so no transform remains and GSAP pins are not affected.) Apply `className="screen-rise"` to the frame wrapper of: `ProofReveal` screen column, and the `WorkDeskScene` frame wrapper (inside the element GSAP does NOT already transform: if GSAP already animates that element's transform, put the class on a new outer wrapper `div`). Do not apply it inside `DashboardZoom`, `NepalScene` or `ModuleTrack` (pinned).

### 4. Grouped stagger for text blocks
In `src/components/motion/RevealRoot.tsx` and `globals.css`: elements with `data-stagger` mark a group. On entering the viewport (same observer) the group gets `is-in`; its direct children rise with `transition-delay: calc(min(var(--i), 4) * 70ms)` where `--i` is each child's index, set once in JS when the group is initialised. Children are visible by default and only hidden after JS adds `js-reveal-group` (same safety pattern as `.js-reveal`). Use it on: the `TradesScene` card row, the `ModuleTrack` heading block, the `ClosingScene` contact aside. Do not nest a `data-reveal` inside a `data-stagger` group.

### 5. Smooth the pinned scenes
In `DashboardZoom.tsx`, `NepalScene.tsx`, `ModuleTrack.tsx`, `WorkDeskScene.tsx`: set every `scrub` value to `1` (DashboardZoom is currently 3, NepalScene/ModuleTrack 1, WorkDeskScene 1) and add `anticipatePin: 1` to each `scrollTrigger` that has `pin: true`. Do not change any `end` distance, timeline content or copy.

### 6. Keep what already works
Do not change: `HeroCore` autoplay loop, `Flows`, the dark/light colour blend (`.home-flow` seam rules), the hero film, section copy.

## Verification (bounded: one batched round, one fix batch, at most one confirming round)
1. `npm run lint`, `npx next typegen && npx tsc --noEmit`, `npm run build`, `npm run build:static`; report first-load JS gzip for `/` (≤ 150 KB) from the build output.
2. Headless Chrome (use `video/node_modules/playwright-core`, `channel: "chrome"`, a local dev server on a free port; the Browser pane is throttled and does not count): at 1440×900 scroll the page in 300 px steps; at each step record the active chapter in `.tour-rail [aria-current]` and assert it matches the section in the viewport centre; assert the hairline `transform` increases monotonically; assert no horizontal overflow at 1440, 1024, 390; assert zero console errors; with `emulateMedia({ reducedMotion: "reduce" })` assert the rail dots are static and the hairline is absent and all content has `opacity: 1`.
3. Screenshot desktop at 6 scroll positions and look: rail dots legible on both dark and light sections, no label covering content, rail colour change is a fade not a flash.
4. Feel-check (a human must do these; list them in your report as "not verified"): play the scroll at normal speed in a real browser; the pinned scenes should hand over without a jump; the rail pill should glide, not teleport; nothing should feel sticky or float after you stop scrolling.

## Done when
All steps applied, verification 1–3 pass, `plans/README.md` status for 001 set to DONE with the measured bundle size, and one commit with explicit paths (never `git add -A`): trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`, git identity unset so use one-off `-c user.name` / `-c user.email`.
