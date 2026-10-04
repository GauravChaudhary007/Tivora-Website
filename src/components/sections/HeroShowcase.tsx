"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Play } from "lucide-react";
import Image from "next/image";
import { site } from "@/lib/site";
import { ScaledStage } from "@/components/product/ScaledStage";
import { DASH_H, DASH_W, ExecutiveDashboardMock } from "@/components/product/ExecutiveDashboardMock";

export function HeroShowcase({ onPlay }: { onPlay: () => void }) {
  return site.heroLoopVideo ? <VideoShowcase onPlay={onPlay} /> : <MockShowcase onPlay={onPlay} />;
}

/** Real product details called out on the live mockup (positions in % of the screen). */
const hotspots = [
  { x: 47, y: 3.1, text: "Ctrl K — jump to any screen in seconds" },
  { x: 77.5, y: 3.1, text: "Bikram Sambat calendar, built in" },
  { x: 79, y: 15.5, text: "Live figures, refreshed every 5 minutes" },
  { x: 41.5, y: 44, text: "Targets tracked as you sell" },
  { x: 66, y: 73.5, text: "Click any figure for the detail behind it" },
];

/** Interactive recreation of the executive dashboard (used when no hero loop is configured). */
function MockShowcase({ onPlay }: { onPlay: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-20% 0px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % hotspots.length), 3200);
    return () => window.clearInterval(id);
  }, [inView, paused]);

  return (
    <div ref={root} className="relative mx-auto max-w-[1160px]">
      {/* Browser frame */}
      <div className="relative rounded-[18px] bg-gradient-to-b from-white/25 via-white/10 to-white/5 p-px shadow-[0_50px_120px_-30px_rgb(0_0_0/0.75),0_0_0_1px_rgb(255_255_255/0.04)] sm:rounded-[22px]">
        <div className="overflow-hidden rounded-[17px] bg-[#E6E6E1] sm:rounded-[21px]">
          <div className="flex h-9 items-center gap-3 border-b border-black/[0.06] bg-[#EDEDE8] px-4">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#e0695a]" />
              <span className="size-2.5 rounded-full bg-[#e8b04b]" />
              <span className="size-2.5 rounded-full bg-[#5fb35c]" />
            </div>
            <div className="mx-auto hidden w-[46%] items-center justify-center rounded-md bg-white/70 py-1 text-[11px] text-black/45 sm:flex">
              Tivora ERP · Executive dashboard
            </div>
            <span className="ml-auto hidden w-10 sm:block" />
          </div>

          <div className="relative">
            {/* Desktop / tablet: the full application screen */}
            <div className="hidden sm:block">
              <ScaledStage width={DASH_W} height={DASH_H}>
                <ExecutiveDashboardMock />
              </ScaledStage>
            </div>
            {/* Phone: the compact layout, still the real screen */}
            <div className="sm:hidden">
              <ScaledStage width={720} height={1080}>
                <ExecutiveDashboardMock compact />
              </ScaledStage>
            </div>

            {/* Hotspots (large screens) */}
            {(
              <div className="pointer-events-none absolute inset-0 hidden lg:block">
                {hotspots.map((h, i) => {
                  const on = i === active;
                  const flip = h.x > 60;
                  return (
                    <div key={h.text} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                      <button
                        type="button"
                        aria-label={h.text}
                        onMouseEnter={() => {
                          setPaused(true);
                          setActive(i);
                        }}
                        onMouseLeave={() => setPaused(false)}
                        onFocus={() => setActive(i)}
                        className="pointer-events-auto relative -ml-2.5 -mt-2.5 grid size-5 place-items-center"
                      >
                        <span className="absolute inset-0 rounded-full bg-indigo/40 [animation:pulse-ring_1.8s_ease-out_infinite]" />
                        <span className={`relative size-2.5 rounded-full ring-2 ring-white transition-colors ${on ? "bg-indigo" : "bg-indigo/70"}`} />
                      </button>
                      <AnimatePresence>
                        {on && (
                          <motion.span
                            initial={{ opacity: 0, y: 6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className={`absolute top-4 whitespace-nowrap rounded-lg bg-midnight px-3 py-2 text-[12px] font-semibold text-white shadow-xl ${flip ? "right-0" : "left-0"}`}
                          >
                            {h.text}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Soft fade at the bottom edge of the screen */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F2F2EE] to-transparent" />
          </div>
        </div>
      </div>

      <TourButton onPlay={onPlay} />
    </div>
  );
}

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Autoplay only when motion is welcome and the connection isn't constrained. */
function canAutoplay() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slow = Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType ?? "");
  return !window.matchMedia(REDUCE).matches && !slow;
}

/**
 * The real product, autoplaying: a short silent loop cut from the walkthrough.
 * The poster paints instantly; the video fades in once it can play, pauses when
 * off screen, and is skipped entirely on Data Saver, 2G or reduced motion.
 */
function VideoShowcase({ onPlay }: { onPlay: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const visible = useInView(root);
  const allowed = useSyncExternalStore(subscribeMotion, canAutoplay, () => false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (visible) v.play().catch(() => {});
    else v.pause();
  }, [visible, allowed]);

  return (
    <div ref={root} className="relative mx-auto max-w-[1160px]">
      <div className="relative rounded-[18px] bg-gradient-to-b from-white/30 via-white/10 to-white/5 p-px shadow-[0_50px_120px_-30px_rgb(0_0_0/0.75)] sm:rounded-[26px]">
        <div className="relative aspect-video overflow-hidden rounded-[17px] bg-mist sm:rounded-[25px]">
          <Image
            src={site.heroLoopPoster}
            alt="Tivora ERP: a quotation becomes a sales order, delivery challan, invoice and WhatsApp message in one click"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1160px"
            className="object-cover"
          />
          {allowed && (
            <video
              ref={video}
              src={site.heroLoopVideo}
              poster={site.heroLoopPoster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              aria-hidden
              onCanPlay={() => setReady(true)}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            />
          )}
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-midnight/80 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur sm:left-5 sm:top-5 sm:text-xs">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-teal-light [animation:pulse-ring_1.6s_ease-out_infinite]" />
              <span className="relative size-1.5 rounded-full bg-teal-light" />
            </span>
            Real product · Quotation → Invoice → WhatsApp
          </div>
        </div>
      </div>
      <TourButton onPlay={onPlay} />
    </div>
  );
}

function TourButton({ onPlay }: { onPlay: () => void }) {
  return (
    <div className="mt-5 flex justify-center sm:absolute sm:inset-x-0 sm:-bottom-6 sm:mt-0">
      <motion.button
        type="button"
        onClick={onPlay}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="group flex items-center gap-3 rounded-full bg-midnight py-2 pl-2 pr-5 text-sm font-semibold text-white shadow-[0_16px_40px_-10px_rgb(0_0_0/0.6)] ring-1 ring-white/15"
      >
        <span className="relative grid size-9 place-items-center rounded-full bg-white text-midnight">
          <span className="absolute inset-0 rounded-full bg-white/50 [animation:pulse-ring_2s_ease-out_infinite]" />
          <Play className="relative ml-0.5 size-4 fill-current" />
        </span>
        Watch the full tour
        <span className="font-mono text-xs font-normal text-white/50">{site.demoDuration}</span>
      </motion.button>
    </div>
  );
}
