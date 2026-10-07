"use client";

import { useRef, useState } from "react";

type Conn = { saveData?: boolean; effectiveType?: string };

/**
 * The only <video> in the site. Until the button is pressed only the poster exists: no video element,
 * so not even metadata is fetched (zero video bytes on load). Narrated film (starts only after the visitor presses play, so sound is allowed); captions are WebVTT, off by default (words are burned in).
 * 720p when Save-Data is on, the connection is 3g or slower, or the screen is under 1024 px wide; else 1080p.
 */
export function VideoPlayer({
  title,
  length,
  poster,
  posterAlt,
  src1080,
  src720,
  vtt,
}: {
  title: string;
  length: string;
  poster: string;
  posterAlt: string;
  src1080: string;
  src720: string;
  vtt?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const name = title.replace(/\.$/, "");

  function play() {
    const c = (navigator as Navigator & { connection?: Conn }).connection;
    const small = c?.saveData || /^(slow-2g|2g|3g)$/.test(c?.effectiveType ?? "") || window.innerWidth < 1024;
    setSrc(small ? src720 : src1080);
    // The <video> mounts on the next render; move focus to it so the native controls take over from the keyboard.
    requestAnimationFrame(() => video.current?.focus());
  }

  return (
    <div className="relative aspect-video w-full">
      {src ? (
        <video
          ref={video}
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="auto"
          aria-label={`${name}, ${length}, with narration`}
          className="absolute inset-0 size-full rounded-frame bg-night shadow-frame"
        >
          {vtt && <track kind="captions" srcLang="en" label="English" src={vtt} />}
        </video>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized JPG, static export has no optimizer */}
          <img
            src={poster}
            alt={posterAlt}
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full rounded-frame bg-night object-cover shadow-frame"
          />
          <button
            type="button"
            onClick={play}
            aria-label={`Play video: ${name}, ${length}, with narration`}
            className="group absolute inset-0 flex items-center justify-center rounded-frame"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-night/80 text-gold shadow-card transition-transform duration-fast ease-out-expo group-hover:scale-110 sm:size-20">
              <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-current" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
