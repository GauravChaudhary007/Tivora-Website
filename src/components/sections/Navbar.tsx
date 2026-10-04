"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { Button } from "@/components/ui/Button";

type MenuKey = "platform" | "industries" | null;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4">
      <motion.nav
        aria-label="Primary"
        initial={false}
        animate={{
          maxWidth: scrolled ? 1080 : 1200,
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`relative flex w-full items-center justify-between rounded-2xl px-3 transition-[background-color,box-shadow,border-color] duration-500 sm:px-4 ${
          scrolled
            ? "border border-white/10 bg-midnight-900/90 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
        onMouseLeave={() => setOpen(null)}
      >
        <a href="#top" aria-label="Tivora ERP home" className="flex shrink-0 items-center">
          <Image
            src="/brand/tivora-logo-white.svg"
            alt="TIVORA ERP"
            width={598}
            height={84}
            priority
            unoptimized
            className="h-6 w-auto sm:h-7"
          />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          <NavDropdown
            label="Platform"
            id="platform"
            open={open}
            setOpen={setOpen}
            items={nav.platform}
          />
          <NavDropdown
            label="Industries"
            id="industries"
            open={open}
            setOpen={setOpen}
            items={nav.industries}
            footer="More industries coming soon"
          />
          <li>
            <a href="#trust" className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
              Company
            </a>
          </li>
          <li>
            <a href="#contact" className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
              Contact
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Button href="#contact">Book a Demo</Button>
          </span>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl text-white ring-1 ring-white/15 lg:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            onClick={() => setMobile((m) => !m)}
          >
            {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>{mobile && <MobileMenu onClose={() => setMobile(false)} />}</AnimatePresence>
    </header>
  );
}

function NavDropdown({
  label,
  id,
  open,
  setOpen,
  items,
  footer,
}: {
  label: string;
  id: Exclude<MenuKey, null>;
  open: MenuKey;
  setOpen: (k: MenuKey) => void;
  items: readonly { label: string; href: string; note?: string }[];
  footer?: string;
}) {
  const isOpen = open === id;
  return (
    <li className="relative" onMouseEnter={() => setOpen(id)}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setOpen(isOpen ? null : id)}
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isOpen ? "text-white" : "text-white/70 hover:text-white"}`}
      >
        {label}
        <ChevronDown className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-midnight-900/95 p-2 shadow-2xl backdrop-blur-xl">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(null)}
                  className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
                >
                  <span className="block text-sm font-semibold text-white">{item.label}</span>
                  {item.note && <span className="mt-0.5 block text-xs text-white/50">{item.note}</span>}
                </a>
              ))}
              {footer && (
                <p className="mt-1 border-t border-white/10 px-3 pb-1.5 pt-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-teal-light/80">
                  {footer}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const groups = [
    { title: "Platform", items: nav.platform },
    { title: "Industries", items: nav.industries },
    {
      title: "Company",
      items: [
        { label: "About & IRD", href: "#trust" },
        { label: "Contact", href: "#contact" },
      ],
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 top-0 -z-10 overflow-y-auto bg-midnight-950/97 px-5 pb-10 pt-24 backdrop-blur-xl lg:hidden"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
        className="mx-auto flex max-w-md flex-col gap-8"
      >
        {groups.map((g) => (
          <motion.div
            key={g.title}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-light">{g.title}</p>
            <ul className="mt-3 divide-y divide-white/[0.07]">
              {g.items.map((i) => (
                <li key={i.href}>
                  <a href={i.href} onClick={onClose} className="flex py-3.5 text-lg font-semibold text-white">
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <Button href="#contact" size="lg" arrow className="w-full" onClick={onClose}>
            Book a Demo
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
