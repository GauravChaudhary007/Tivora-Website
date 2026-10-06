// Composes a calm ambient bed (our own, so royalty-free): slow Am-F-C-G pads plus a soft arpeggio, 110 s, written to video/audio/music.wav.
// Usage: node video/music.mjs
import { writeFileSync } from "node:fs";
const SR = 44100, LEN = 110, BPM = 66, BEAT = 60 / BPM;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const CH = [[57, 60, 64], [53, 57, 60], [48, 55, 64], [55, 59, 62]]; // Am, F, C/E, G (MIDI): A3 C4 E4 / F3 A3 C4 / C3 G3 E4 / G3 B3 D4
const buf = new Float32Array(SR * LEN);
const add = (t0, d, f, a, kind) => {
  const i0 = Math.floor(t0 * SR), n = Math.floor(d * SR);
  for (let i = 0; i < n && i0 + i < buf.length; i++) {
    const t = i / SR;
    const env = kind === "pad" ? Math.min(1, t / 1.6) * Math.min(1, (d - t) / 2.2) : Math.exp(-t * 3.2) * Math.min(1, t / 0.01);
    const s = Math.sin(2 * Math.PI * f * t) + (kind === "pad" ? 0.3 * Math.sin(2 * Math.PI * f * 2.003 * t) : 0.15 * Math.sin(2 * Math.PI * f * 2 * t));
    buf[i0 + i] += a * env * s;
  }
};
const BAR = 4 * BEAT;
for (let bar = 0; bar * BAR < LEN; bar++) {
  const c = CH[bar % 4], t0 = bar * BAR;
  c.forEach((m) => { add(t0, BAR + 1.6, hz(m - 12), 0.07, "pad"); add(t0, BAR + 1.6, hz(m), 0.05, "pad"); });
  for (let k = 0; k < 8; k++) add(t0 + k * BEAT / 2, 1.6, hz(c[k % 3] + 12 + (k % 5 === 4 ? 12 : 0)), 0.05, "pluck");
}
let peak = 0;
for (const v of buf) peak = Math.max(peak, Math.abs(v));
const pcm = Buffer.alloc(buf.length * 2);
buf.forEach((v, i) => pcm.writeInt16LE(Math.round((v / peak) * 0.8 * 32767), i * 2));
const h = Buffer.alloc(44);
h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVEfmt ", 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
writeFileSync("video/audio/music.wav", Buffer.concat([h, pcm]));
console.log("music.wav written");
