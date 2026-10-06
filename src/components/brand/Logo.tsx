// The official logo, always as an <img> of the right file (inline SVG would collide the mask IDs).
// tone = the ground it sits on: "light" -> original colours, "dark" -> reversed file for night grounds.
// Never set "TIVORA ERP" as text. Minimum size: lockup 32px tall (descriptor), symbol 20px.
const FILES = {
  lockup: { light: "/brand/tivora-official.svg", dark: "/brand/tivora-logo-dark.svg", width: 581, height: 100 },
  symbol: { light: "/brand/tivora-symbol.svg", dark: "/brand/tivora-symbol-dark.svg", width: 96, height: 96 },
} as const;

export function Logo({
  kind = "lockup",
  tone = "light",
  className = "",
  alt = "TiVora ERP",
  priority = false,
}: {
  kind?: "lockup" | "symbol";
  tone?: "light" | "dark";
  className?: string;
  /** Pass "" when the logo sits next to the product name in text. */
  alt?: string;
  priority?: boolean;
}) {
  const f = FILES[kind];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG logo files are served as-is
    <img
      src={f[tone]}
      width={f.width}
      height={f.height}
      alt={alt}
      className={className}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
