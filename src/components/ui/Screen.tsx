import { SCREENS, type ScreenSlug } from "@/content/screens";
import { DEMO_CAPTION } from "@/content/site";

/**
 * A real app screenshot in a browser frame. Never redraw or recolour the image: crop with
 * `imgClassName` (e.g. "aspect-video object-cover") + `crop` (object-position) only.
 * Caption defaults to the standard demo caption for the screen's edition; pass false to hide.
 */
export function Screen({
  slug,
  priority = false,
  crop,
  caption,
  sizes = "(min-width: 1280px) 720px, 100vw",
  className = "",
  imgClassName = "",
  highlight,
}: {
  slug: ScreenSlug;
  priority?: boolean;
  crop?: string;
  caption?: string | false;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Spotlight on part of the screen (percent of the image): the rest dims, the area gets a gold ring and an optional label. */
  highlight?: { x: number; y: number; w: number; h: number; label?: string };
}) {
  const s = SCREENS[slug];
  const text = caption === undefined ? DEMO_CAPTION[s.edition] : caption;
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-frame bg-paper shadow-frame in-data-[tone=night]:shadow-frame-dark">
        <div className="flex items-center gap-2 border-b border-rule bg-ground px-4 py-2.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-rule" />
          <span className="size-2.5 rounded-full bg-rule" />
          <span className="size-2.5 rounded-full bg-rule" />
          <span className="ml-3 rounded-full bg-paper px-4 py-0.5 text-eyebrow text-muted">TiVora ERP</span>
        </div>
        <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized WebP, static export has no optimizer */}
        <img
          src={s.src}
          srcSet={s.srcSet}
          sizes={s.srcSet ? sizes : undefined}
          width={s.width}
          height={s.height}
          alt={s.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          style={crop ? { objectPosition: crop } : undefined}
          className={`block h-auto w-full ${imgClassName}`}
        />
        {highlight && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute rounded-md ring-2 ring-gold shadow-[0_0_0_200vmax_color-mix(in_srgb,var(--color-night)_58%,transparent)]"
              style={{ left: `${highlight.x}%`, top: `${highlight.y}%`, width: `${highlight.w}%`, height: `${highlight.h}%` }}
            />
            {highlight.label && (
              <span
                className="pointer-events-none absolute rounded-full bg-gold px-3 py-1 text-small font-bold text-night shadow-frame-dark"
                style={{ left: `calc(${highlight.x + highlight.w}% + 0.75rem)`, top: `calc(${highlight.y}% + 1rem)` }}
              >
                {highlight.label}
              </span>
            )}
          </>
        )}
        </div>
      </div>
      {text && <figcaption className="mt-3 text-small text-muted in-data-[tone=night]:text-muted-dark">{text}</figcaption>}
    </figure>
  );
}
