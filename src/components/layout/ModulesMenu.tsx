"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GROUPS, modulePages } from "@/content/module-pages";
import { ModuleIcon } from "@/components/ui/ModuleIcon";

/**
 * Desktop mega-menu under "Modules". Opens on hover, click of the chevron button, or ArrowDown.
 * Escape / click outside / focus leaving closes it. The "Modules" text is still a link to /modules/.
 * The panel is absolutely positioned against the (fixed) header, so opening it never shifts layout.
 */
export function ModulesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pinned = useRef(false); // opened by click/keyboard: hover-leave must not close it
  const focusFirst = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const close = () => {
    clearTimeout(leaveTimer.current);
    pinned.current = false;
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    if (focusFirst.current) {
      focusFirst.current = false;
      // The panel is `visibility: hidden` until its open transition has begun, and hidden elements cannot take focus.
      setTimeout(() => wrap.current?.querySelector<HTMLElement>("[data-menu-item]")?.focus(), 50);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const inside = wrap.current?.contains(document.activeElement);
      close();
      if (inside) btn.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const items = () => Array.from(wrap.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? []);
  const move = (e: React.KeyboardEvent, dir: 1 | -1) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    e.preventDefault();
    list[(i + dir + list.length) % list.length]?.focus();
  };

  return (
    <div
      ref={wrap}
      className="flex h-full items-center"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(leaveTimer.current);
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse" || pinned.current) return;
        leaveTimer.current = setTimeout(() => setOpen(false), 140);
      }}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node | null)) close();
      }}
    >
      <Link
        href="/modules/"
        aria-current={active ? "page" : undefined}
        className="inline-flex min-h-11 items-center pl-3 font-bold underline-offset-8 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-gold aria-[current=page]:decoration-2"
      >
        Modules
      </Link>
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls="modules-menu"
        aria-label="Modules menu"
        onClick={() => {
          if (open && pinned.current) return close();
          pinned.current = true;
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            pinned.current = true;
            if (open) items()[0]?.focus();
            else {
              focusFirst.current = true;
              setOpen(true);
            }
          }
        }}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-4 transition-transform duration-(--duration-fast) ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        id="modules-menu"
        data-open={open}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") move(e, 1);
          else if (e.key === "ArrowUp") move(e, -1);
        }}
        className="invisible absolute top-full left-1/2 w-[min(54rem,calc(100vw-2rem))] -translate-x-1/2 translate-y-1 rounded-b-xl border border-rule bg-paper p-5 text-ink opacity-0 shadow-frame transition-[opacity,transform,visibility] duration-(--duration-base) ease-(--ease-out-expo) data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100"
      >
        <div className="grid gap-x-6 gap-y-4 lg:grid-cols-[2fr_1fr]">
          {GROUPS.map((g) => (
            <section key={g} aria-label={g}>
              <h2 className="px-3 font-mono text-eyebrow font-medium uppercase text-accent">{g}</h2>
              <ul className={`mt-2 grid ${g === "Core modules" ? "grid-cols-2" : ""}`}>
                {modulePages
                  .filter((m) => m.group === g)
                  .map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/modules/${m.slug}/`}
                        data-menu-item
                        onClick={close}
                        className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 hover:bg-tint focus-visible:bg-tint"
                      >
                        <ModuleIcon name={m.icon} className="size-9! bg-tint! text-accent!" />
                        <span className="min-w-0">
                          <span className="block font-bold leading-tight">{m.name}</span>
                          <span className="block text-small leading-snug text-muted">{m.short}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-3 border-t border-rule pt-3">
          <Link
            href="/modules/"
            data-menu-item
            onClick={close}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 font-bold text-accent hover:bg-tint hover:text-bronze"
          >
            All modules <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
