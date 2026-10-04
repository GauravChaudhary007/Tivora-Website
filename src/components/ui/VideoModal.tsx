"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { VideoFrame } from "./VideoFrame";

const noop = () => () => {};

/** Full-screen lightbox for the product walkthrough. Esc or backdrop click closes it. */
export function VideoModal({
  open,
  onClose,
  src,
  mobileSrc,
  poster,
  title,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  mobileSrc?: string;
  poster?: string;
  title: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, onClose]);

  // Portals need the DOM, so render nothing during SSR and hydration.
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-midnight-950/85 p-4 backdrop-blur-md sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className="relative w-full max-w-6xl"
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              autoFocus
              className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            <div className="overflow-hidden rounded-2xl p-px shadow-2xl sm:rounded-[28px]" style={{ background: "linear-gradient(140deg, rgb(63 214 196 / 0.5), rgb(255 255 255 / 0.1) 40%, rgb(58 75 224 / 0.5))" }}>
              <VideoFrame src={src} mobileSrc={mobileSrc} poster={poster} title={title} autoPlay />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
