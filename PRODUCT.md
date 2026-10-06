# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Owners, accountants and managers of Nepali trading, manufacturing and retail businesses (jewelry first, then general trading and paint) evaluating an ERP. They arrive from ads, referrals and HiTech's own client base, often on a phone over a slow connection, and want to see the real software before they will call. A secondary audience is HiTech's sales team, who send this site as the first demo.

## Product Purpose
Tivora ERP ("HiTech Intelligent ERP Solution") is HiTech Solutions and Services Pvt. Ltd.'s new ERP: sales, purchase, stock, production, transport, finance, fixed assets, trade finance, tax and reports on one platform, with Bikram Sambat dates and IRD formats built in. The site exists to get a qualified visitor to request a demo. Success is a completed demo request or a phone call to HiTech.

## Positioning
Built in Nepal for Nepal: BS and AD dates, VAT registers, Annex 9 and 13, TDS, CBMS-ready formats, on twelve connected modules that share one set of books. Only Jewelry is running with customers today; General trading and Paint are next.

## Operating Context
Visitors judge by the real screens. The demo company is "Kathmandu Paints"; screenshots are redacted demo data. Demo requests go through the contact form (`/api/demo/`) or the three HiTech phone numbers. Hosting is a cPanel static export (`npm run build:static`) or Docker standalone.

## Capabilities and Constraints
Twelve modules (Reports Centre, Purchase and Accounts Payable, Store and Inventory, Production, Sales and Accounts Receivable, Transport and Delivery, Customer Services, Finance and Accounts, Fixed Assets, Trade and Finance, Tax and IRD, Control Panel). Executive dashboard, Work Desk, Ctrl K menu search, company switcher. Next.js 16 App Router, Tailwind 4, GSAP, SVG only (no 3D library), both build modes must keep working. Claims policy is binding: no "AI-powered", "IRD certified", "government approved", prices, free trial, WhatsApp/SMS or mobile-app claims, no customer names or testimonials; HiTech's own figures (25+ years, 10,000+ clients) are attributed to HiTech.

## Brand Commitments
Official logo: `public/brand/tivora-official.svg` and its recoloured variants; never redrawn, set in a font or recoloured beyond the existing files. Palette (from the owner's brand sheet): mark brown #6E4A14, mark gold #C08A2E, accent/buttons #8A6420, page ground #F6F4F0, text #1C1A16. Typeface Manrope. Descriptor under the logo: "HiTech Intelligent ERP Solution".

## Evidence on Hand
Real app screenshots (redacted) in `public/screens/`; five narrated films in `public/videos/` (not in git). No customer names, testimonials, prices or certifications exist and none may be invented.

## Product Principles
1. Show the real software, never a redrawn interface.
2. Say only what is true today; "coming" means no feature list.
3. One platform, many modules: the site must never reduce Tivora to four boxes or a generic dashboard.
4. Fast and readable on a phone in Nepal before it is impressive on a laptop.
5. The path to a demo request is always one click away.

## Accessibility & Inclusion
WCAG 2.1 AA; captions and transcripts for every film; reduced-motion fallbacks; readable at 360 px; English with Nepali context (BS dates).
