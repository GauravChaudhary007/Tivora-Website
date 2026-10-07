import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { addressLine, appUrl, footerColumns, footerNote, site } from "@/content/site";

const linkCls = "inline-flex min-h-11 items-center text-ground hover:text-gold-soft";

export function SiteFooter() {
  return (
    <footer data-tone="night" className="border-t border-rule-dark bg-night pt-section-sm pb-24 text-ground scheme-dark sm:pb-section-sm">
      <div className="container-x grid gap-stack-lg lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <Logo tone="dark" className="h-10 w-auto" />
          <p className="mt-5 max-w-xs text-muted-dark">{site.tagline}</p>
        </div>

        <nav aria-label="Product">
          <h2 className="font-mono text-eyebrow font-medium uppercase text-gold">Product</h2>
          <ul className="mt-3">
            {footerColumns.product.map((l) => (
              <li key={l.href}>
                <Link href={l.href} prefetch={false} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="font-mono text-eyebrow font-medium uppercase text-gold">Company</h2>
          <ul className="mt-3">
            {footerColumns.company.map((l) => (
              <li key={l.href}>
                {l.href.startsWith("http") ? (
                  <a href={l.href} rel="noopener" className={linkCls}>
                    {l.label}
                  </a>
                ) : (
                  <Link href={l.href} prefetch={false} className={linkCls}>
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <a href={appUrl} rel="noopener" className={linkCls}>
                Login
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-eyebrow font-medium uppercase text-gold">Contact</h2>
          <address className="mt-3 not-italic text-muted-dark">
            <p>{addressLine}</p>
            <ul className="mt-2">
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className={linkCls}>
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={site.whatsapp.href} rel="noopener" className={linkCls}>
                  WhatsApp {site.whatsapp.label}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.emails.info}`} className={linkCls}>
                  {site.emails.info}
                </a>
              </li>
            </ul>
          </address>
        </div>
      </div>
      <p className="container-x mt-stack-lg border-t border-rule-dark pt-6 text-small text-muted-dark">{footerNote}</p>
    </footer>
  );
}
