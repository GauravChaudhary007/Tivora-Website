// The ONE tokens file for the films. Mirrors src/app/globals.css @theme (docs/REVAMP-SPEC.md B1/B4) and src/lib/motion.ts.
// video/render.mjs asserts every hex below still exists in globals.css, so drift fails the render instead of shipping.
// Never type a colour anywhere else in video/engine or video/films: add it here, with its source.
window.TOKENS = {
  color: {
    bronze: "#6E4A14", gold: "#C08A2E", slate: "#5E574B", // OFFICIAL (logo file)
    accent: "#8A6420", ground: "#F6F4F0", ink: "#1C1A16", // DOCUMENTED (brief)
    paper: "#FFFEFB", rule: "#E3DDD1", tint: "#F3EAD8", muted: "#6B6457", ok: "#2F6B3A", okTint: "#E5EFE2",
    goldSoft: "#D3A65B", goldLight: "#E0B872", mutedDark: "#A99E8B", ruleDark: "#332C20",
    night: "#110D08", night2: "#1C1A16", night3: "#2A241B", slabTop: "#3B3224", slabTopLit: "#5C4B32", // DERIVED
  },
  ease: { out: "expo.out", inOut: "power2.inOut" }, // --ease-out-expo, --ease-in-out
  dur: { fast: 0.16, base: 0.32, slow: 0.7, reveal: 1.0 }, // --duration-*
  radius: { frame: 14, module: 0.32, md: 10, xl: 24 }, // px, ratio, px, px
  // box-shadows are functions of u (CSS px per screen px) so they keep the same visual strength inside scaled plates
  shadowFrame: (u) => `0 0 0 ${u}px rgb(28 26 22 / 0.08), 0 ${40 * u}px ${100 * u}px ${-40 * u}px rgb(28 26 22 / 0.45)`,
  shadowFrameDark: (u) => `0 0 0 ${u}px rgb(246 244 240 / 0.08), 0 ${40 * u}px ${120 * u}px ${-30 * u}px rgb(0 0 0 / 0.7)`,
  shadowCard: "0 1px 2px rgb(28 26 22 / 0.05), 0 12px 32px -12px rgb(28 26 22 / 0.18)",
  shadowFrameDarkFixed: "0 0 0 1px rgb(246 244 240 / 0.08), 0 40px 120px -30px rgb(0 0 0 / 0.7)",
  ember: "radial-gradient(60% 50% at 50% 40%, rgb(192 138 46 / 0.18), transparent 70%)", // .bg-ember
  spot: "rgb(17 13 8 / 0.35)", // callout spotlight (spec 2.0) = night at 35%
  font: {
    sans: '"Manrope", "Manrope Fallback", sans-serif',
    serif: '"Source Serif 4", "Source Serif 4 Fallback", serif',
    mono: '"IBM Plex Mono", "IBM Plex Mono Fallback", monospace',
  },
  stage: { w: 1920, h: 1080, fps: 30, safeX: 96, safeY: 72 },
};
