export const site = {
  name: "Tivora ERP",
  descriptor: "HiTech Intelligent Unified Enterprise Platforms",
  company: "HiTech Solutions and Services Pvt. Ltd.",
  address: "4th Floor, Divine Complex, Kalimati, Kathmandu, Nepal",
  phones: ["01-5389641", "01-5389642", "01-5389643"],
  website: "https://www.hitechnepal.com.np",
  /** Full product walkthrough (1:43), opened from the hero with sound and controls. */
  demoVideo: "/videos/product-demo.mp4",
  /** Lighter 720p encode of the walkthrough, served to phones. */
  demoVideoMobile: "/videos/product-demo-720.mp4",
  demoPoster: "/videos/product-demo-poster.jpg",
  demoDuration: "1:43",
  /**
   * Short silent loop that autoplays in the hero (quotation → invoice → WhatsApp).
   * Set to "" to show the interactive dashboard mockup instead.
   */
  heroLoopVideo: "/videos/hero-loop.mp4",
  heroLoopPoster: "/videos/hero-loop-poster.jpg",
} as const;

export const nav = {
  platform: [
    { label: "Workdesk", href: "#workdesk", note: "Your operational command center" },
    { label: "Modules", href: "#modules", note: "Every department, connected" },
    { label: "Automation", href: "#automation", note: "Order to invoice in one click" },
    { label: "Reports & Dashboards", href: "#dashboards", note: "Your data, your way" },
  ],
  industries: [
    { label: "Jewellery", href: "#industry-jewellery" },
    { label: "Manufacturing", href: "#industry-manufacturing" },
    { label: "FMCG", href: "#industry-fmcg" },
    { label: "Trading", href: "#industry-trading" },
    { label: "Pharmaceutical", href: "#industry-pharmaceutical" },
    { label: "Automobile", href: "#industry-automobile" },
  ],
};

/** Format a number with Nepali/Indian digit grouping, e.g. 1,24,300 */
export const npr = (n: number) => new Intl.NumberFormat("en-IN").format(Math.round(n));
