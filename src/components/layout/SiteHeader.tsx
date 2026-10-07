"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CTA, appUrl, nav } from "@/content/site";
import { GROUPS, modulePages } from "@/content/module-pages";
import { ModulesMenu } from "./ModulesMenu";
import { ModuleIcon } from "@/components/ui/ModuleIcon";

const isActive = (here: string, href: string) => {
  const h = href.replace(/\/$/, "");
  return here === h || here.startsWith(h + "/");
};

export function SiteHeader() {
  const pathname = usePathname();
  const here = pathname.replace(/\/$/, "") || "/";
  const [open, setOpen] = useState(false);
  const [modsOpen, setModsOpen] = useState(false); // mobile accordion
  const [night, setNight] = useState(true); // every page opens on a night section
  const [pastHero, setPastHero] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Header tone: night while a night section sits under the header line; observer, not a scroll listener.
  // The mobile bar appears once the first section has scrolled out.
  useEffect(() => {
    const under = new Set<Element>();
    const tone = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) under.add(e.target);
          else under.delete(e.target);
        }
        setNight(under.size > 0);
      },
      { rootMargin: "0px 0px -96% 0px" },
    );
    document.querySelectorAll("main [data-tone='night'], footer[data-tone='night']").forEach((el) => tone.observe(el));
    const hero = document.querySelector("main > :first-child");
    const bar = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    if (hero) bar.observe(hero);
    return () => {
      tone.disconnect();
      bar.disconnect();
    };
  }, [pathname]);

  // Menu open: lock scroll, Esc closes and returns focus, focus moves into the panel.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const tone = night || open ? "night" : "light";

  return (
    <>
      <header
        data-tone={tone}
        className="fixed inset-x-0 top-0 z-50 h-header border-b border-rule bg-ground/85 text-ink backdrop-blur-md transition-colors duration-(--duration-base) data-[tone=night]:border-transparent data-[tone=night]:bg-night/90 data-[tone=night]:text-ground"
      >
        <div className="container-x flex h-full items-center justify-between gap-4">
          <Link href="/" aria-label="TiVora ERP home" className="inline-flex min-h-11 shrink-0 items-center" onClick={close}>
            <Logo tone="light" className="h-8 w-auto sm:h-10 in-data-[tone=night]:hidden" alt="TiVora ERP" />
            <Logo tone="dark" className="hidden h-8 w-auto sm:h-10 in-data-[tone=night]:block" alt="" />
          </Link>

          <nav aria-label="Main" className="hidden h-full items-center gap-1 lg:flex">
            {nav.map((l) =>
              l.href === "/modules/" ? (
                <ModulesMenu key={l.href} active={isActive(here, l.href)} />
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(here, l.href) ? "page" : undefined}
                  className="inline-flex min-h-11 items-center px-3 font-bold underline-offset-8 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-gold aria-[current=page]:decoration-2"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ButtonLink href={appUrl} variant="secondary">
                Login
              </ButtonLink>
            </div>
            <div className="hidden sm:block">
              <ButtonLink href={CTA.href}>{CTA.label}</ButtonLink>
            </div>
            <button
              ref={menuBtn}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 font-bold lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" ref={panel} hidden={!open} data-tone="night" className="fixed inset-0 z-40 overflow-y-auto bg-night text-ground scheme-dark lg:hidden">
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col gap-2 pt-header pb-8">
          <ul className="mt-6 flex flex-col">
            {nav.map((l) =>
              l.href === "/modules/" ? (
                <li key={l.href}>
                  <div className="flex items-center border-b border-rule-dark">
                    <Link
                      href={l.href}
                      onClick={close}
                      aria-current={isActive(here, l.href) ? "page" : undefined}
                      className="block flex-1 py-4 font-display text-h2 font-semibold aria-[current=page]:text-gold"
                    >
                      {l.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={modsOpen}
                      aria-controls="mobile-modules"
                      aria-label="Show modules"
                      onClick={() => setModsOpen((o) => !o)}
                      className="inline-flex size-11 items-center justify-center rounded-md"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-5 transition-transform duration-(--duration-fast) ${modsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  <div id="mobile-modules" hidden={!modsOpen} className="pb-3">
                    {GROUPS.map((g) => (
                      <div key={g} className="mt-3">
                        <p className="font-mono text-eyebrow font-medium uppercase text-gold">{g}</p>
                        <ul className="mt-1">
                          {modulePages
                            .filter((m) => m.group === g)
                            .map((m) => (
                              <li key={m.slug}>
                                <Link href={`/modules/${m.slug}/`} onClick={close} className="flex min-h-11 items-center gap-3 py-1.5">
                                  <ModuleIcon name={m.icon} className="size-9!" />
                                  <span>
                                    <span className="block font-bold leading-tight">{m.name}</span>
                                    <span className="block text-small text-muted-dark">{m.short}</span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                    <Link href="/modules/" onClick={close} className="mt-2 inline-flex min-h-11 items-center font-bold text-gold-soft underline underline-offset-4">
                      All modules
                    </Link>
                  </div>
                </li>
              ) : (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={close}
                    aria-current={isActive(here, l.href) ? "page" : undefined}
                    className="block border-b border-rule-dark py-4 font-display text-h2 font-semibold aria-[current=page]:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <ButtonLink href={appUrl} variant="secondary" onClick={close}>
              Login
            </ButtonLink>
            <ButtonLink href={CTA.href} onClick={close}>
              {CTA.label}
            </ButtonLink>
          </div>
        </nav>
      </div>

      {pastHero && !open && pathname !== "/contact/" && (
        <div data-tone="night" className="fixed inset-x-0 bottom-0 z-40 border-t border-rule-dark bg-night p-3 sm:hidden">
          <ButtonLink href={CTA.href}>{CTA.label}</ButtonLink>
        </div>
      )}
    </>
  );
}
