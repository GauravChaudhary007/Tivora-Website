// Caption cues from a film JSON: single source for burned-in text, WebVTT and (WV3) the site transcript.
// Every caption item (h2, kicker, display, giant, mono, line) is a cue; overlapping items are merged into
// non-overlapping cues (one cue per time slice, lines in JSON order).
export function items(film) {
  const out = [];
  for (const sc of film.scenes) for (const c of sc.captions || []) out.push({ start: +(sc.in + c.t).toFixed(3), end: +(sc.in + c.t + c.dur).toFixed(3), text: (c.pill ? c.pill.text + " " : "") + c.text, order: out.length });
  for (const sc of film.scenes) if (sc.t4) out.push({ start: +(sc.in + sc.t4.t).toFixed(3), end: +(sc.in + sc.t4.t + sc.t4.dur).toFixed(3), text: sc.t4.text, order: out.length });
  return out;
}
export function cues(film) {
  const it = items(film), pts = [...new Set(it.flatMap((i) => [i.start, i.end]))].sort((a, b) => a - b), out = [];
  for (let k = 0; k < pts.length - 1; k++) {
    const a = pts[k], b = pts[k + 1], act = it.filter((i) => i.start <= a && i.end >= b).sort((x, y) => x.order - y.order);
    if (!act.length) continue;
    const text = act.map((i) => i.text).join("\n"), last = out[out.length - 1];
    if (last && last.end === a && last.text === text) last.end = b; else out.push({ start: a, end: b, text });
  }
  return out;
}
const ts = (s) => { const ms = Math.round(s * 1000), p = (n, l = 2) => String(n).padStart(l, "0"); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}.${p(ms % 1000, 3)}`; };
export const vtt = (film) => "WEBVTT\n\n" + cues(film).map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join("\n");
