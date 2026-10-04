"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Play } from "lucide-react";

type VideoFrameProps = {
  /** Path under /public, e.g. "/videos/product-demo.mp4". */
  src: string;
  /** Optional lighter encode for phones (≤ 768px wide). */
  mobileSrc?: string;
  poster?: string;
  title: string;
  className?: string;
  /** Start playing as soon as the file is ready (used inside the lightbox). */
  autoPlay?: boolean;
};

type Status = "idle" | "ready" | "playing" | "unavailable";

/**
 * 16:9 premium video container. The video is only attached once the frame is
 * near the viewport (preload="metadata"), and shows a branded placeholder until
 * the real file exists.
 */
export function VideoFrame({ src, mobileSrc, poster, title, className = "", autoPlay = false }: VideoFrameProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useInView(wrap, { once: true, margin: "400px 0px" });
  const [status, setStatus] = useState<Status>("idle");

  const play = async () => {
    try {
      await video.current?.play();
      setStatus("playing");
    } catch {
      setStatus("unavailable");
    }
  };

  return (
    <div
      ref={wrap}
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl bg-midnight-900 sm:rounded-[28px] ${className}`}
    >
      {near && (
        <video
          ref={video}
          poster={poster}
          preload="metadata"
          playsInline
          controls={status === "playing"}
          onLoadedMetadata={() => {
            setStatus((s) => (s === "idle" ? "ready" : s));
            if (autoPlay) void play();
          }}
          onEnded={() => setStatus("ready")}
          className="absolute inset-0 size-full object-cover"
          aria-label={title}
        >
          {mobileSrc && <source src={mobileSrc} type="video/mp4" media="(max-width: 768px)" />}
          {/* Errors from <source> don't bubble to <video>, so the last source reports them. */}
          <source src={src} type="video/mp4" onError={() => setStatus("unavailable")} />
        </video>
      )}

      <AnimatePresence>
        {status !== "playing" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {/* Branded placeholder sits behind the play button until a poster/video frame shows */}
            {!poster && status !== "ready" && (
              <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#1b2550_0%,#0a0f24_70%)]">
                <div className="bg-grid-dark absolute inset-0 opacity-60" />
                <Image
                  src="/brand/tivora-symbol-white.svg"
                  alt=""
                  width={160}
                  height={160}
                  unoptimized
                  className="relative size-24 opacity-[0.08] sm:size-40"
                />
              </div>
            )}

            <div className="absolute inset-0 grid place-items-center bg-midnight-950/20">
              {status === "unavailable" ? (
                <div className="relative text-center">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-teal-light">Product demo</p>
                  <p className="mt-2 text-lg font-semibold text-white sm:text-2xl">Coming soon</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={play}
                  aria-label={`Play: ${title}`}
                  className="relative grid size-16 place-items-center rounded-full bg-white text-midnight shadow-[0_10px_40px_-6px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-out-expo group-hover:scale-110 sm:size-20"
                >
                  <span className="absolute inset-0 rounded-full bg-white/40 [animation:pulse-ring_2s_ease-out_infinite]" />
                  <Play className="relative ml-1 size-6 fill-current sm:size-7" aria-hidden />
                </button>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-midnight-950/80 to-transparent p-4 sm:p-6">
              <p className="text-sm font-semibold text-white sm:text-base">{title}</p>
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 sm:block">Tivora ERP · Walkthrough</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
