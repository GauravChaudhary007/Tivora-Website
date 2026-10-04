import Image from "next/image";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-midnight-950 text-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/brand/tivora-logo-white.svg" alt="TIVORA ERP" width={598} height={84} unoptimized className="h-7 w-auto" />
          <p className="mt-4 max-w-xs font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.18em] text-white/45">
            {site.descriptor}
          </p>
          <p className="mt-6 text-sm font-semibold text-white/80">One platform. Every business.</p>
        </div>

        <FooterCol title="Platform" items={nav.platform} />
        <FooterCol title="Industries" items={nav.industries} />

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-light">Contact</p>
          <address className="mt-4 space-y-2 text-sm not-italic text-white/60">
            <p>{site.company}</p>
            <p>{site.address}</p>
            <p>
              {site.phones.map((p, i) => (
                <span key={p}>
                  <a href={`tel:${p.replace(/-/g, "")}`} className="transition-colors hover:text-white">
                    {p}
                  </a>
                  {i < site.phones.length - 1 && " · "}
                </span>
              ))}
            </p>
            <p>
              <a href={site.website} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                www.hitechnepal.com.np
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/[0.07]">
        <div className="container-x flex flex-col gap-2 py-6 text-[12px] text-white/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.company} All rights reserved.</p>
          <p>Made in Kathmandu, Nepal.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-light">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.href}>
            <a href={i.href} className="text-sm text-white/60 transition-colors hover:text-white">
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
