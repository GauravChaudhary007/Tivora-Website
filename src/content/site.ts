// Company facts, navigation and standard captions. Wording follows the Tivora ERP Website
// Brief (29 Sep 2026) and the claims policy (docs/REVAMP-SPEC.md section H).
export const site = {
  name: "Tivora ERP",
  tagline: "One platform. Every business.",
  /** Descriptor inside the official lockup; "HiTech Intelligent Unified Enterprise Platforms" is the open alternative. */
  descriptor: "HiTech Intelligent ERP Solution",
  company: "HiTech Solutions and Services Pvt. Ltd.",
  url: "https://tivoraerp.com", // assumed domain, see spec section G10
  website: "https://www.hitechnepal.com.np",
  websiteLabel: "hitechnepal.com.np",
  address: { street: "4th Floor, Divine Complex, Kalimati", city: "Kathmandu", country: "Nepal" },
  phones: [
    { label: "01-5389641", tel: "+97715389641" },
    { label: "01-5389642", tel: "+97715389642" },
    { label: "01-5389643", tel: "+97715389643" },
  ],
  emails: { info: "info@hitechnepal.com.np", support: "support@hitechnepal.com.np" },
  /** Mirrors --color-night in globals.css (viewport.themeColor needs a literal). */
  themeColor: "#110D08",
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.country}`;

export const nav = [
  { label: "Platform", href: "/platform/" },
  { label: "Modules", href: "/modules/" },
  { label: "Work Desk", href: "/work-desk/" },
  { label: "Industries", href: "/industries/" },
  { label: "About", href: "/about/" },
] as const;

export const CTA = { label: "Request a demo", href: "/contact/" } as const;

export const footerColumns = {
  product: [
    { label: "Platform", href: "/platform/" },
    { label: "Modules", href: "/modules/" },
    { label: "Work Desk", href: "/work-desk/" },
    { label: "Industries", href: "/industries/" },
  ],
  company: [
    { label: "About HiTech", href: "/about/" },
    { label: "Request a demo", href: "/contact/" },
    { label: site.websiteLabel, href: site.website },
  ],
} as const;

export const footerNote =
  "Tivora ERP is a product of HiTech Solutions and Services Pvt. Ltd., Kathmandu. Screens show a demo company with sample data.";

/** Standard screenshot captions (claims policy, section H). */
export const DEMO_CAPTION = {
  paint: 'Demo company "Kathmandu Paints", sample figures. The Paint edition is coming.',
  jewelry: "Tivora ERP – Jewelry, demo data.",
  core: "Tivora ERP menu, demo company.",
} as const;

/** All routes, for the sitemap (WP3) and nav checks. */
export const routes = ["/", "/platform/", "/modules/", "/work-desk/", "/industries/", "/industries/jewelry/", "/about/", "/contact/"] as const;
