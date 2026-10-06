// Film engine: builds ONE paused GSAP timeline from video/films/<id>.json. Exposes window.__ready, __seek(t), __duration, __warnings.
// Determinism: no Date/Math.random, no CSS transitions/animations. Every moving value is a plain object tweened by GSAP and
// written to the DOM by a render function that __seek() calls after tl.time(t).
(async () => {
  const TK = window.TOKENS, W = TK.stage.w, H = TK.stage.h, FPS = TK.stage.fps;
  const warnings = (window.__warnings = []);
  const warn = (m) => warnings.push(m);
  const kebab = (s) => s.replace(/([a-z])([0-9])/g, "$1-$2").replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  const rs = document.documentElement.style;
  for (const [k, v] of Object.entries(TK.color)) rs.setProperty("--color-" + kebab(k), v);
  rs.setProperty("--font-sans", TK.font.sans); rs.setProperty("--font-serif", TK.font.serif); rs.setProperty("--font-mono", TK.font.mono);
  rs.setProperty("--ember", TK.ember); rs.setProperty("--shadow-card", TK.shadowCard); rs.setProperty("--shadow-frame-dark", TK.shadowFrameDarkFixed);

  const film = await (await fetch(`/video/films/${new URLSearchParams(location.search).get("film")}.json`)).json();
  const PL = await (await fetch("/video/frames/plates.json")).json();
  const WORLD = await (await fetch("/video/build/iso-world.svg")).text();
  await Promise.all(['600 64px "Source Serif 4"', "700 32px Manrope", "400 20px Manrope", '500 20px "IBM Plex Mono"'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;

  gsap.ticker.lagSmoothing(0);
  const tl = gsap.timeline({ paused: true });
  const stage = document.getElementById("stage");
  const EZ = (n) => ({ inOut: TK.ease.inOut, out: TK.ease.out, in: "power2.in", linear: "none" })[n || "inOut"] || n;
  const D = TK.dur;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const el = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };

  // ---- brand art measurement (symbol art bbox inside its img box), so alignment never relies on a typed number
  const symImg = new Image(); symImg.src = "/brand/tivora-symbol-dark.svg"; await symImg.decode();
  const SYM = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 480;
    const g = c.getContext("2d"); g.drawImage(symImg, 0, 0, 480, 480);
    const d = g.getImageData(0, 0, 480, 480).data; let x0 = 480, y0 = 480, x1 = 0, y1 = 0;
    for (let y = 0; y < 480; y++) for (let x = 0; x < 480; x++) if (d[(y * 480 + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return { a: Math.max(x1 - x0, y1 - y0) / 480, cx: (x0 + x1) / 2 / 480, cy: (y0 + y1) / 2 / 480 };
  })();

  // ---- iso world math: mirrors src/components/home/world.ts + src/lib/iso.ts (extract-world.mjs asserts the constants)
  const WS = { S: 180, GAP: 180, GS: 85, H: 22, VB: { x: 80, y: 90, w: 1040, h: 700 }, O: { x: 600, y: 472 } };
  const ORDER = ["counter", "godown", "floor", "ledger"], POS = { counter: [-1, -1], godown: [1, -1], floor: [1, 1], ledger: [-1, 1] };
  const C30 = Math.cos(Math.PI / 6), WC = (WS.S + WS.GAP) / 2;
  const iso = (x, y, z = 0) => [(x - y) * C30, (x + y) * 0.5 - z];
  const centre = (d, z = WS.H) => iso(POS[d][0] * WC, POS[d][1] * WC, z);
  const collapse = (d) => { const k = (WS.GAP - WS.GS) / 2, [x, y] = iso(POS[d][0] * k, POS[d][1] * k); return { x: -x, y: -y }; };
  const SYM_SIDE = 2 * WS.S + WS.GS; // symbol side in world units (collapsed slabs)

  // ---- callouts, plates, camera
  const normCall = (c) => (Array.isArray(c) ? { t: c[0], dur: c[1], x: c[2], y: c[3], w: c[4], h: c[5], label: c[6], ...(c[7] || {}) } : c);
  const normKey = (k) => (Array.isArray(k) ? { t: k[0], x: k[1], y: k[2], z: k[3], ease: k[4], t2: k[5] } : k);

  function makePlate(parent, id, o = {}) {
    const m = PL[id]; if (!m) throw new Error("unknown plate " + id);
    const { w, h } = m;
    const fit = o.fixedFit || (o.fitW ? o.fitW / w : o.fit === "w" ? 1600 / w : Math.min(1600 / w, 880 / h));
    const u = 1 / fit, CH = o.chrome === false ? 0 : 38 * u;
    let pane = parent;
    if (!o.noPane) {
      const b = o.box || [0, 0, W, H];
      pane = el("div", "pane", parent); Object.assign(pane.style, { left: b[0] + "px", top: b[1] + "px", width: b[2] + "px", height: b[3] + "px" });
      if (o.clip) pane.style.overflow = "hidden";
    }
    const bw = (o.box || [0, 0, W, H])[2], bh = (o.box || [0, 0, W, H])[3];
    const cam = el("div", "cam", pane); cam.style.setProperty("--u", u);
    const frame = el("div", "frame", cam);
    Object.assign(frame.style, { width: w + "px", height: CH + h + "px", borderRadius: 14 * u + "px", boxShadow: o.noShadow ? "none" : o.dark ? TK.shadowFrameDark(u) : TK.shadowFrame(u) });
    const clip = el("div", "", frame); Object.assign(clip.style, { position: "absolute", inset: 0, overflow: "hidden", borderRadius: 14 * u + "px" });
    if (CH) {
      const ch = el("div", "chrome", clip); ch.style.height = CH + "px";
      for (let i = 0; i < 3; i++) { const d = el("i", "", ch); Object.assign(d.style, { width: 10 * u + "px", height: 10 * u + "px", marginLeft: (i ? 8 : 16) * u + "px" }); }
      if (film.chrome) { const p = el("b", "", ch, film.chrome); Object.assign(p.style, { marginLeft: 14 * u + "px", padding: 3 * u + "px " + 16 * u + "px" }); }
    }
    const img = el("img", "plate", clip); img.src = `/video/frames/${id}.png`; Object.assign(img.style, { top: CH + "px", width: w + "px", height: h + "px" });
    const svg = sv("svg", { class: "ov", viewBox: `0 0 ${w} ${h}`, width: w, height: h }, frame); svg.style.top = CH + "px";
    const labels = el("div", "labels", frame); Object.assign(labels.style, { top: CH + "px", width: w + "px", height: h + "px" });
    const P = { anchor: o.anchor, off: { x: 0, y: 0 }, id, w, h, fit, u, CH, cam, svg, labels, bw, bh, edition: m.edition, scale2: m.scale === 2, rings: [], sh: o.sh ?? 0, shy: o.shy ?? 0, clampOn: o.clamp !== false, fixed: !!o.fixedFit, cs: { x: 50, y: 50, lz: 0, dx: 0, dy: 0, dz: 0 } };
    P.render = (ext = 1) => {
      let s;
      if (P.fixed) s = fit; else {
        const c = P.cs, z = Math.exp(c.lz + c.dz); s = fit * z;
        const k = clamp((z - 1) / 0.4, 0, 1);
        const ax = (P.anchor ? P.anchor[0] : bw * (0.5 + P.sh * k)) + P.off.x, ay = (P.anchor ? P.anchor[1] : bh * (0.5 + P.shy * k)) + P.off.y;
        let tx = ax - s * ((c.x + c.dx) / 100) * w, ty = ay - s * (CH + ((c.y + c.dy) / 100) * h);
        if (P.clampOn) { const fw = s * w, fh = s * (CH + h); if (fw > bw) tx = clamp(tx, bw - fw, 0); if (fh > bh) ty = clamp(ty, bh - fh, 0); }
        cam.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${s.toFixed(5)})`;
        P.tx = tx; P.ty = ty;
      }
      updateRings(P, s * ext);
    };
    if (P.fixed) cam.style.transform = `scale(${fit})`;
    return P;
  }

  function addCamera(P, keysIn, A, dur, drift) {
    const keys = keysIn.map(normKey);
    P.cs.x = keys[0].x; P.cs.y = keys[0].y; P.cs.lz = Math.log(keys[0].z);
    const lim = P.scale2 ? 2.2 : 1.6;
    keys.forEach((k, i) => {
      if (!k.t2 && k.z > lim) warn(`zoom ${k.z} > ${lim} on ${P.id} at t=${A + k.t}`);
      if (!i) return;
      const p = keys[i - 1];
      tl.to(P.cs, { x: k.x, y: k.y, lz: Math.log(k.z), duration: Math.max(0.001, k.t - p.t), ease: EZ(k.ease) }, A + p.t);
    });
    const dr = drift || [0.22, 0.12]; // % of plate per second, under the 0.6 cap
    tl.fromTo(P.cs, { dx: 0, dy: 0, dz: 0 }, { dx: dr[0] * dur, dy: dr[1] * dur, dz: 0.012 * dur, duration: dur, ease: "none" }, A);
  }

  function addCallout(P, dIn, A) {
    const d = normCall(dIn), r = { d, p: 0, op: 0, spot: 0 };
    const kind = d.kind || "ring";
    if (d.spot) r.spotEl = sv("path", { fill: TK.spot, "fill-rule": "evenodd" }, P.svg);
    if (kind === "marker") r.mk = el("div", "mk", P.labels, d.n);
    else if (kind === "underline") r.line = sv("line", { pathLength: 1, stroke: TK.color.gold, "stroke-linecap": "round", "stroke-dasharray": 1 }, P.svg);
    else r.rect = sv("rect", { pathLength: 1, fill: "none", stroke: TK.color.gold, "stroke-dasharray": 1 }, P.svg);
    if (d.label) r.lbl = el("div", "lbl", P.labels, d.label);
    P.rings.push(r);
    tl.set(r, { op: 1 }, A + d.t);
    tl.to(r, { p: 1, duration: D.base, ease: EZ() }, A + d.t);
    if (d.spot) tl.to(r, { spot: 1, duration: D.slow }, A + d.t);
    tl.to(r, { op: 0, spot: 0, duration: D.fast }, A + d.t + d.dur - D.fast);
  }

  function updateRings(P, s) {
    const pad = 6 / s, sw = 3 / s;
    for (const r of P.rings) {
      const vis = r.op > 0.002, d = r.d;
      for (const e of [r.rect, r.line, r.mk, r.lbl, r.spotEl]) if (e) e.style.display = vis ? "" : "none";
      if (!vis) continue;
      const x = (d.x / 100) * P.w, y = (d.y / 100) * P.h, w = ((d.w || 0) / 100) * P.w, h = ((d.h || 0) / 100) * P.h;
      if (r.rect) {
        sv_set(r.rect, { x: x - pad, y: y - pad, width: w + 2 * pad, height: h + 2 * pad, rx: 10 / s, "stroke-width": sw, "stroke-dashoffset": 1 - r.p, opacity: r.op });
      }
      if (r.line) sv_set(r.line, { x1: x, y1: y + h + pad, x2: x + w, y2: y + h + pad, "stroke-width": 5 / s, "stroke-dashoffset": 1 - r.p, opacity: r.op });
      if (r.mk) { r.mk.style.opacity = r.op; r.mk.style.transform = `translate(${x}px,${y}px) scale(${1 / s}) translate(-50%,-50%)`; }
      if (r.spotEl) {
        const X = x - pad, Y = y - pad, WW = w + 2 * pad, HH = h + 2 * pad;
        r.spotEl.setAttribute("d", `M0 0H${P.w}V${P.h}H0Z M${X} ${Y}h${WW}v${HH}h${-WW}Z`); r.spotEl.style.opacity = r.spot;
      }
      if (r.lbl) {
        r.lbl.style.opacity = r.op;
        const pos = d.lpos || "top";
        const bx = x - pad, by = pos === "bottom" ? y + h + pad + 8 / s : y - pad - 8 / s;
        r.lbl.style.transform = `translate(${bx}px,${by}px) scale(${1 / s}) translateY(${pos === "bottom" ? "0" : "-100%"})`;
      }
    }
  }
  const sv_set = (e, a) => { for (const k in a) e.setAttribute(k, a[k]); };

  // ---- brand elements: symbol (art-box aligned) and lockup
  const SYMD = 400; // img box px; art px = SYM.a * SYMD * scale
  function makeSym(parent) {
    const img = el("img", "sym", parent); img.src = "/brand/tivora-symbol-dark.svg";
    Object.assign(img.style, { left: 0, top: 0, width: SYMD + "px", height: SYMD + "px", transformOrigin: `${SYM.cx * SYMD}px ${SYM.cy * SYMD}px` });
    const st = { x: W / 2, y: H / 2, art: 238, th: 0, sx: 1, sy: 1, op: 0 };
    st.render = () => {
      img.style.visibility = st.op > 0.002 ? "visible" : "hidden"; img.style.opacity = st.op;
      const sc = st.art / (SYM.a * SYMD);
      img.style.transform = `translate(${st.x - SYM.cx * SYMD}px,${st.y - SYM.cy * SYMD}px) scale(${st.sx * sc},${st.sy * sc}) rotate(${st.th}deg)`;
    };
    return st;
  }
  function makeLock(parent) {
    const img = el("img", "lock", parent); img.src = "/brand/tivora-logo-dark.svg";
    const st = { x: W / 2, y: H / 2, w: 820, op: 0, wipe: 1 };
    st.render = () => {
      img.style.visibility = st.op > 0.002 ? "visible" : "hidden"; img.style.opacity = st.op;
      const h = (st.w * 100) / 581;
      Object.assign(img.style, { width: st.w + "px", height: h + "px", left: st.x - st.w / 2 + "px", top: st.y - h / 2 + "px", clipPath: `inset(0 ${(1 - st.wipe) * 100}% 0 0)` });
    };
    return st;
  }

  // ---- captions
  function textItem(S, c, A, parentTone) {
    const cls = c.style === "h2" ? "ci h2" : "ci " + c.style;
    const e = el("div", cls + (c.fx === "sweep" ? " sweep" : "") + (c.color ? " " + c.color : ""), S.el);
    e.innerHTML = (c.pill ? `<span class="pill ${c.pill.kind}">${c.pill.text}</span>` : "") + c.text;
    if (c.size) e.style.fontSize = c.size + "px";
    const pos = c.pos || (c.style === "display" || c.style === "giant" ? "c" : "ll");
    if (c.x != null) { e.style.left = c.x + "px"; e.style.top = c.y + "px"; if (c.w) e.style.width = c.w + "px"; }
    else if (pos === "c") { Object.assign(e.style, { left: 0, width: W + "px", textAlign: "center", top: (c.y ?? H / 2) + "px" }); e.dataset.mid = 1; }
    else if (pos === "ll") { Object.assign(e.style, { left: "96px", bottom: "96px", maxWidth: "904px" }); }
    else if (pos === "tl") { Object.assign(e.style, { left: "96px", top: "72px", maxWidth: "904px" }); }
    if (c.align) e.style.textAlign = c.align;
    if (e.dataset.mid) e.style.marginTop = -e.offsetHeight / 2 + "px";
    const a = A + c.t;
    tl.fromTo(e, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: D.slow, ease: EZ("out") }, a);
    if (c.fx === "sweep") { const sp = { p: 0 }; tl.fromTo(sp, { p: 0 }, { p: 100, duration: 1.4, ease: EZ() }, a); S.r.push(() => e.style.setProperty("--p", sp.p.toFixed(2) + "%")); }
    if (c.slide) tl.to(e, { y: c.slide, duration: 0.8, ease: EZ() }, a + c.slideT);
    tl.to(e, { autoAlpha: 0, duration: D.base }, a + c.dur - D.base);
    return e;
  }

  function buildCaptions(S, sc) {
    const A = sc.in, items = (sc.captions || []).map((c) => ({ style: "h2", ...c }));
    const onPaper = sc.tone !== "night" && sc.panel !== false;
    const h2s = items.filter((c) => c.style === "h2" && !c.pos && c.x == null);
    const used = new Set();
    for (const c of items) {
      if (c.style !== "h2" || c.pos || c.x != null) continue;
      const kids = items.filter((k) => k.style === "kicker" && k.t >= c.t - 0.001 && k.t < c.t + c.dur && !used.has(k));
      kids.forEach((k) => used.add(k));
      const g = el("div", "cp ll" + (onPaper ? " paper" : ""), S.el); S.el.classList.add(sc.tone);
      if (sc.cap === "tl") { g.classList.remove("ll"); g.classList.add("tl"); }
      el("div", "h2", g, c.text);
      const need = Math.max(1.2, c.text.length / 15); if (c.dur < need && !sc.readOk) warn(`caption too short (${c.dur} < ${need.toFixed(1)}): ${c.text}`);
      tl.fromTo(g, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: D.slow, ease: EZ("out") }, A + c.t);
      tl.to(g, { autoAlpha: 0, duration: D.base }, A + c.t + c.dur - D.base);
      if (kids.length) {
        const ks = el("div", "ks", g); let maxH = 0;
        const els = kids.map((k) => { const e = el("div", "k", ks, k.text); return e; });
        ks.style.height = "auto"; els.forEach((e) => { e.style.visibility = "visible"; maxH = Math.max(maxH, e.offsetHeight); e.style.visibility = ""; }); ks.style.height = "0px";
        tl.fromTo(ks, { height: 0 }, { height: maxH, duration: D.slow, ease: EZ("out") }, A + kids[0].t);
        kids.forEach((k, i) => {
          tl.fromTo(els[i], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: D.slow, ease: EZ("out") }, A + k.t);
          tl.to(els[i], { autoAlpha: 0, duration: D.base }, A + k.t + k.dur - D.base);
        });
      }
    }
    for (const c of items) if (!used.has(c) && !(c.style === "h2" && !c.pos && c.x == null)) textItem(S, c, A);
  }

  // ---- scene frame, transitions
  const scenes = [], renderers = [];
  const FX0 = { ty: 0, rx: 0, ry: 0, sc: 1, op: 1, m: 1 };
  function newScene(sc) {
    const el0 = el("div", "scene " + sc.tone, stage);
    if (sc.tone === "night" && sc.ember !== false) el("div", "ember", el0);
    const S = { sc, el: el0, rig: el("div", "rig", el0), fx: { ...FX0 }, in: sc.in, vis: [sc.in, sc.out], r: [] };
    if (sc.tone !== "night" && sc.type !== "wall") {
      const mo = el("div", "motif", S.rig); // parallax motif: slow shapes that move against the camera
      [[-100, 120, 520], [1500, 640, 640], [900, -260, 380]].forEach(([x, y, s]) => Object.assign(el("i", "", mo).style, { left: x + "px", top: y + "px", width: s + "px", height: s + "px" }));
      S.motif = mo;
    }
    S.render = () => {
      const f = S.fx;
      S.rig.style.transform = `perspective(2400px) translate3d(0,${f.ty}px,0) rotateX(${f.rx}deg) rotateY(${f.ry}deg) scale(${f.sc})`;
      S.rig.style.opacity = f.op;
      if (f.m < 1) {
        const c = sc.maskAt || [W / 2, H / 2], q = 150, m = f.m, r = lerp(q * 2 * 0.32, TK.radius.frame, m);
        S.el.style.clipPath = `inset(${lerp(c[1] - q, 0, m)}px ${lerp(W - c[0] - q, 0, m)}px ${lerp(H - c[1] - q, 0, m)}px ${lerp(c[0] - q, 0, m)}px round ${r}px)`;
      } else S.el.style.clipPath = "none";
      if (S.motif) { const p = S.P0; const tx = p ? (p.tx || 0) : 0, ty = p ? (p.ty || 0) : 0; S.motif.style.transform = `translate(${-tx * 0.12}px,${-ty * 0.12}px)`; }
      S.r.forEach((fn) => fn());
    };
    return S;
  }

  function enterFx(S, sc) {
    const a = sc.in + (sc.enterDelay || 0), e = sc.enter || "cut";
    if (e === "T3") {
      tl.fromTo(S.fx, { ty: H * 0.12, op: 0 }, { ty: 0, op: 1, duration: D.slow, ease: EZ("out") }, a);
      tl.fromTo(S.fx, { rx: 8, ry: -12 }, { rx: 0, ry: 0, duration: 1.2, ease: EZ("out") }, a);
    } else if (e === "T1") {
      tl.fromTo(S.fx, { m: 0.0001 }, { m: 1, duration: 0.9, ease: EZ() }, a);
    } else if (e === "T2") {
      tl.fromTo(S.fx, { sc: 1.18, op: 0 }, { sc: 1, op: 1, duration: 0.5, ease: EZ("out") }, a);
    } else if (e === "fade") tl.fromTo(S.fx, { op: 0 }, { op: 1, duration: D.base }, a);
    else if (e === "hold") { /* visible at start with nothing to animate */ }
    if (sc.enterDelay) { S.vis[0] = a; }
    S.enterDur = { T3: D.slow, T1: 0.9, T2: 0.5, fade: D.base }[e] || 0;
    if (e === "T1" || sc.enterDelay) S.fx.m = e === "T1" ? 0.0001 : 1;
  }

  // ---- scene builders
  const B = {};

  B.screen = (S, sc) => {
    const P = makePlate(S.rig, sc.plate, { fitW: sc.fitW, anchor: sc.anchor, fit: sc.fit, sh: sc.shift ?? (sc.tone === "night" ? 0 : 0.12), shy: sc.shiftY ?? -0.04, dark: sc.tone === "night", clamp: sc.clamp });
    S.P0 = P;
    addCamera(P, sc.camera, sc.in, sc.out - sc.in + (S.tail || 0), sc.drift);
    (sc.extras || []).forEach((x) => {
      const Q = makePlate(S.rig, x.plate, { fitW: x.fitW, anchor: x.anchor, chrome: false, dark: true, clamp: false });
      addCamera(Q, x.camera || [[0, 50, 50, 1], [1, 50, 50, 1]], sc.in, sc.out - sc.in, [0, 0]);
      if (x.parallax) tl.fromTo(Q.off, { y: 0 }, { y: x.parallax, duration: sc.out - sc.in, ease: "none" }, sc.in);
      S.r.push(() => Q.render());
    });
    (sc.callouts || []).forEach((c) => addCallout(P, c, sc.in));
    S.r.push(() => P.render());
    if (sc.t4) buildT4(S, sc);
  };

  B.split = (S, sc) => {
    sc.panes.forEach((pn) => {
      const P = makePlate(S.rig, pn.plate, { box: pn.box, clip: true, chrome: false, noShadow: true, fit: pn.fit, sh: 0, shy: 0, clamp: pn.clamp });
      const pane = P.cam.parentElement; Object.assign(pane.style, { borderRadius: "14px", boxShadow: TK.shadowFrame(1), overflow: "hidden", background: TK.color.ground });
      // a pane shows a window onto the plate: zoom is measured against the full-frame fit (see spec 2.0), so pass pane z through
      addCamera(P, pn.camera, sc.in + (pn.delay || 0), sc.out - sc.in - (pn.delay || 0), sc.drift);
      (pn.callouts || []).forEach((c) => addCallout(P, c, sc.in));
      S.r.push(() => P.render());
      if (pn.delay) tl.fromTo(pane, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: D.slow, ease: EZ("out") }, sc.in + pn.delay);
    });
  };

  B.wall = (S, sc) => {
    const TW = 1100, TH = 836, GAPW = 80, cols = 4;
    const wp = el("div", "wallp", S.rig), wall = el("div", "wall", wp);
    const tiles = sc.tiles.map((t, i) => {
      const col = i % cols, row = Math.floor(i / cols), x = col * (TW + GAPW), y = row * (TH + GAPW);
      const tile = el("div", "tile", wall); Object.assign(tile.style, { left: x + "px", top: y + "px", width: TW + "px", height: TH + "px" });
      const m = PL[t.plate];
      const P = makePlate(tile, t.plate, { noPane: true, fixedFit: TW / m.w, noShadow: true });
      P.bw = TW; P.bh = TH;
      if (t.ring) addCallout(P, [t.ringT ?? i * sc.dwell + 0.5, sc.dwell - 0.5, ...t.ring], sc.in);
      return { tile, P, cx: x + TW / 2, cy: y + TH / 2, st: { flat: 0, op: sc.dim ?? 0.4 }, t };
    });
    const camS = { fx: tiles[0].cx, fy: tiles[0].cy, s: sc.zoom || 1.1 };
    const home = { fx: (cols * (TW + GAPW) - GAPW) / 2, fy: (3 * (TH + GAPW) - GAPW) / 2, s: sc.pull || 0.34 };
    tiles.forEach((T, i) => {
      const a = sc.in + i * sc.dwell;
      if (i) tl.to(camS, { fx: T.cx, fy: T.cy, duration: sc.move, ease: EZ() }, a);
      tl.to(T.st, { flat: 1, op: 1, duration: sc.move, ease: EZ() }, a);
      if (i < tiles.length - 1) tl.to(T.st, { flat: 0, op: sc.dim ?? 0.4, duration: sc.move, ease: EZ() }, a + sc.dwell);
    });
    if (sc.pullAt != null) {
      const a = sc.in + sc.pullAt;
      tl.to(camS, { ...home, duration: 0.6, ease: EZ() }, a);
      tiles.forEach((T) => tl.to(T.st, { flat: 0, op: 1, duration: 0.6, ease: EZ() }, a));
    }
    S.r.push(() => {
      wall.style.transform = `translate(${W / 2 + (sc.cx || 130)}px,${H / 2 + (sc.cy || 20)}px) rotateX(6deg) rotateY(-14deg) scale(${camS.s}) translate(${-camS.fx}px,${-camS.fy}px)`;
      tiles.forEach((T) => { T.tile.style.opacity = T.st.op; T.tile.style.transform = `rotateY(${14 * T.st.flat}deg) rotateX(${-6 * T.st.flat}deg)`; T.P.render(camS.s); });
    });
  };

  // T4: giant word crosses the frame; behind its left side the tone is night
  function buildT4(S, sc) {
    const t4 = sc.t4, A = sc.in + t4.t;
    const nightL = el("div", "wipe", S.el); nightL.style.background = TK.color.night; nightL.style.visibility = "hidden";
    const mk = (cls) => { const e = el("div", "ci giant " + cls, S.el, t4.text); e.style.visibility = "hidden"; e.style.whiteSpace = "nowrap"; e.style.top = (t4.top ?? H / 2 - 130) + "px"; return e; };
    const ink = mk("ink"), gr = mk("");
    const ww = ink.offsetWidth, st = { xc: -ww / 2 };
    tl.fromTo(st, { xc: -ww / 2 }, { xc: W + ww / 2, duration: t4.dur, ease: EZ() }, A);
    tl.set([nightL, ink, gr], { visibility: "visible" }, A);
    S.r.push(() => {
      nightL.style.clipPath = `inset(0 ${Math.max(0, W - st.xc)}px 0 0)`;
      for (const e of [ink, gr]) e.style.left = st.xc - ww / 2 + "px";
      ink.style.clipPath = `inset(0 0 0 ${ww / 2}px)`; gr.style.clipPath = `inset(0 ${ww / 2}px 0 0)`;
    });
  }

  B.type = (S, sc) => { S.el.classList.add(sc.tone); /* captions only */ };

  B.logo = (S, sc) => {
    const A = sc.in, sym = makeSym(S.rig), lock = makeLock(S.rig), cy = sc.cy || H / 2;
    sym.y = lock.y = cy; lock.wipe = 0;
    const em = S.el.querySelector(".ember");
    if (em) tl.fromTo(em, { opacity: 0 }, { opacity: 1, duration: D.slow }, A);
    tl.fromTo(sym, { op: 0, art: 238 * 0.9 }, { op: 1, art: 238, duration: D.reveal, ease: EZ("out") }, A + 0.1);
    tl.set(lock, { op: 1 }, A + 1.4);
    tl.to(lock, { wipe: 1, duration: D.slow, ease: EZ() }, A + 1.4);
    tl.to(sym, { op: 0, duration: D.base }, A + 1.4);
    tl.to(lock, { wipe: 1, duration: 0.001 }, A + 3.0);
    tl.to(lock, { op: 0, duration: D.base }, A + 3.0);
    tl.to(sym, { op: 1, duration: D.base }, A + 3.0);
    S.r.push(sym.render, lock.render);
  };

  B.world = (S, sc) => {
    const A = sc.in, wc = sc.world || {}, k = wc.k || 1.2, ox = wc.ox || 1230, oy = wc.oy || 520, V = WS.VB;
    const host = el("div", "world", S.rig); host.innerHTML = WORLD;
    const svg = host.firstElementChild;
    svg.setAttribute("width", V.w * k); svg.setAttribute("height", V.h * k);
    svg.style.left = ox - (WS.O.x - V.x) * k + "px"; svg.style.top = oy - (WS.O.y - V.y) * k + "px";
    const ds = {}; svg.querySelectorAll("[data-d]").forEach((g) => (ds[g.dataset.d] = g));
    const links = [...svg.querySelectorAll("[data-link]")], chipEl = svg.querySelector("[data-chip]"), camg = svg.querySelector("[data-cam]");
    const park = centre(wc.chipAt || "counter", WS.H + 95);
    const Wd = { op: wc.op ?? 1, sep: wc.sep ?? 1, cam: { x: 0, y: 0, s: wc.s ?? 1 }, dop: { counter: 1, godown: 1, floor: 1, ledger: 1 }, link: [0, 0, 0, 0], chip: { x: park[0], y: park[1], op: wc.chip === false ? 0 : 1 } };
    const focusV = (d, s, fx, fy) => { const p = centre(d); return { x: (fx - ox) / k - s * p[0], y: (fy - oy) / k - s * p[1] }; };
    const cards = [];
    for (const st of sc.steps || []) {
      const a = A + st.t, ease = EZ(st.ease);
      if (st.cam) {
        const c = st.cam, v = c.d ? focusV(c.d, c.s, c.fx ?? ox, c.fy ?? oy - 40) : { x: c.x ?? 0, y: c.y ?? 0 };
        tl.to(Wd.cam, { x: v.x, y: v.y, s: c.s, duration: st.dur, ease }, a);
      }
      if (st.chip) { const p = centre(st.chip, WS.H + 95); tl.to(Wd.chip, { x: p[0], y: p[1], op: 1, duration: st.dur, ease: EZ("out") }, a); }
      if (st.link != null) tl.to(Wd.link, { [st.link]: 1, duration: st.dur, ease: EZ() }, a);
      if (st.dim !== undefined) ORDER.forEach((d) => tl.to(Wd.dop, { [d]: st.dim === null || st.dim === d ? 1 : 0.35, duration: D.base }, a));
      if (st.card) {
        const c = el("div", "card", S.rig); c.innerHTML = `<small>${st.card.tag}</small><span>${st.card.text}</span>`;
        const cs = { op: 0 }; cards.push({ c, cs, d: st.card.d });
        tl.fromTo(cs, { op: 0 }, { op: 1, duration: D.base }, a);
        tl.to(cs, { op: 0, duration: D.base }, a + st.dur - D.base);
      }
      if (st.op != null) tl.to(Wd, { op: st.op, duration: st.dur, ease }, a);
      if (st.sep != null) tl.to(Wd, { sep: st.sep, duration: st.dur, ease }, a);
    }
    // symbol <-> world morph (iso = diag(1.2247, 0.7071) . rotate(45deg); slab tops land on the tilted squares)
    let sym, lock;
    const tgt = { x: ox, y: oy - WS.H * k }, artEnd = SYM_SIDE * k;
    if (wc.morph) {
      sym = makeSym(S.rig); lock = makeLock(S.rig);
      if (wc.morph === "in") {
        Object.assign(sym, { x: W / 2, y: H / 2, art: 238, op: 1 }); Wd.op = 0; Wd.sep = 0;
        tl.to(sym, { x: tgt.x, y: tgt.y, art: artEnd, th: 45, sx: Math.SQRT2 * C30 * 1.0, sy: Math.SQRT1_2, duration: 1.6, ease: EZ() }, A);
        tl.to(Wd, { op: 1, duration: 0.6, ease: "none" }, A + 1.5);
        tl.to(sym, { op: 0, duration: 0.6, ease: "none" }, A + 1.5);
        tl.to(Wd, { sep: 1, duration: 1.2, ease: EZ("out") }, A + 1.9);
        tl.fromTo(Wd.cam, { s: 1 }, { s: 1.1, duration: sc.out - sc.in - 1.5, ease: "none" }, A + 1.5);
      } else {
        // out: world spread -> collapsed -> symbol (un-tilts) -> lockup wipe
        const c0 = wc.centre || [W / 2, H / 2 + 20];
        Object.assign(sym, { x: tgt.x, y: tgt.y, art: artEnd, th: 45, sx: Math.SQRT2 * C30, sy: Math.SQRT1_2, op: 0 });
        lock.x = c0[0]; lock.y = c0[1]; lock.wipe = 0;
        tl.to(Wd.cam, { s: 1, duration: 1.0, ease: EZ() }, A + 0.3);
        tl.to(Wd, { sep: 0, duration: 1.0, ease: EZ() }, A + 0.3);
        tl.to(Wd, { op: 0, duration: 0.5, ease: "none" }, A + 1.4);
        tl.to(sym, { op: 1, duration: 0.5, ease: "none" }, A + 1.4);
        tl.to(sym, { x: c0[0], y: c0[1], art: 238, th: 0, sx: 1, sy: 1, duration: 1.2, ease: EZ() }, A + 1.7);
        tl.set(lock, { op: 1 }, A + 3.0);
        tl.to(lock, { wipe: 1, duration: 0.7, ease: EZ() }, A + 3.0);
        tl.to(sym, { op: 0, duration: D.base }, A + 3.0);
      }
    }
    // render: world + cards (+ morph elements)
    S.r.push(() => {
      svg.style.opacity = Wd.op; svg.style.visibility = Wd.op > 0.002 ? "visible" : "hidden";
      ORDER.forEach((d) => { const c = collapse(d); ds[d].style.transform = `translate(${(1 - Wd.sep) * c.x}px,${(1 - Wd.sep) * c.y}px)`; ds[d].style.opacity = Wd.dop[d]; });
      camg.setAttribute("transform", `translate(${Wd.cam.x} ${Wd.cam.y}) scale(${Wd.cam.s})`);
      links.forEach((l, i) => (l.style.strokeDashoffset = 1 - Wd.link[i]));
      chipEl.style.transform = `translate(${Wd.chip.x}px,${Wd.chip.y}px)`; chipEl.style.opacity = Wd.chip.op;
      cards.forEach(({ c, cs, d }) => {
        const p = centre(d), x = ox + k * (Wd.cam.s * p[0] + Wd.cam.x), y = oy + k * (Wd.cam.s * p[1] + Wd.cam.y);
        c.style.visibility = cs.op > 0.002 ? "visible" : "hidden"; c.style.opacity = cs.op;
        c.style.transform = `translate(${x + 70}px,${y - 270}px)`;
      });
      if (sym) { sym.render(); lock.render(); }
    });
    S.world = { Wd, sym, lock };
  };

  B.endcard = (S, sc) => {
    const A = sc.in, hold = sc.hold || 0, e = film.end, carry = !!sc.carry;
    const lock = makeLock(S.rig); const cy0 = sc.fromY || 470, top = [W / 2, 172];
    const tag = el("div", "ci display", S.el, film.tagline); Object.assign(tag.style, { left: 0, width: W + "px", textAlign: "center", top: "590px", visibility: "hidden" });
    const lines = [
      el("div", "ci display", S.el, e.cta), el("div", "ci line", S.el, e.url), el("div", "ci mono", S.el, e.phones), el("div", "ci mono", S.el, e.product + "\n" + e.demo),
    ];
    lines[0].style.top = "400px"; lines[1].style.top = "590px"; lines[2].style.top = "660px"; lines[3].style.top = "900px";
    lines.forEach((l) => Object.assign(l.style, { left: 0, width: W + "px", textAlign: "center" }));
    lines[2].style.textTransform = "none"; lines[2].style.fontSize = "24px"; lines[2].style.letterSpacing = ".06em";
    lines[1].style.color = TK.color.ground;
    lock.x = W / 2; lock.y = hold || carry ? cy0 : top[1]; lock.w = hold || carry ? 820 : 560; lock.op = carry ? 1 : 0;
    if (carry) { tag.style.visibility = "visible"; tl.set(tag, { autoAlpha: 1 }, A); }
    else if (hold) {
      tl.fromTo(lock, { op: 0 }, { op: 1, duration: D.slow, ease: EZ("out") }, A);
      tl.fromTo(tag, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: D.slow, ease: EZ("out") }, A + 0.2);
    } else tl.fromTo(lock, { op: 0 }, { op: 1, duration: D.slow }, A);
    const b = A + hold;
    if (hold || carry) {
      tl.to(lock, { y: top[1], w: 560, duration: 0.8, ease: EZ() }, b);
      tl.to(tag, { autoAlpha: 0, duration: D.base }, b);
    }
    lines.forEach((l, i) => tl.fromTo(l, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: D.slow, ease: EZ("out") }, b + 0.3 + i * 0.12));
    S.r.push(lock.render);
  };

  // ---- assemble
  const sceneList = film.scenes;
  sceneList.forEach((sc, i) => {
    const S = newScene(sc); scenes.push(S);
    S.tail = 0;
  });
  sceneList.forEach((sc, i) => {
    const S = scenes[i], nx = sceneList[i + 1];
    // how long this scene stays on screen after its `out`, while the next one enters over it
    const nEnter = nx ? ({ T3: D.slow, T1: 0.9, T2: 0.5, fade: D.base }[nx.enter] || 0) + (nx.enterDelay || 0) : 0;
    S.tail = nEnter;
    S.vis = [sc.in, sc.out + nEnter];
    enterFx(S, sc);
    if (sc.enterDelay) { S.vis[0] = sc.in + sc.enterDelay; }
    if (nx && nx.enter === "T3") { tl.to(S.fx, { sc: 0.92, op: 0, duration: D.slow, ease: EZ("out") }, nx.in); }
    if (sc.exit === "fly") tl.to(S.fx, { sc: 0.4, op: 0, duration: D.slow, ease: EZ() }, sc.out - D.slow);
    if (sc.toneTo) { // background tone tween (night -> ground)
      const bg = { p: 0 }, from = TK.color[sc.toneTo.from || sc.tone], to = TK.color[sc.toneTo.tone], em = S.el.querySelector(".ember");
      tl.to(bg, { p: 1, duration: sc.toneTo.dur, ease: EZ() }, sc.in + sc.toneTo.t);
      S.r.push(() => { S.el.style.background = mix(from, to, bg.p); if (em) em.style.opacity = 1 - bg.p; });
    }
    B[sc.type](S, sc);
    buildCaptions(S, sc);
    // demo caption / bug on paint plates
    const plates = sc.type === "screen" ? [sc.plate] : sc.type === "split" ? sc.panes.map((p) => p.plate) : sc.type === "wall" ? sc.tiles.map((t) => t.plate) : [];
    const paint = plates.some((p) => PL[p].edition === "paint");
    if (sc.demo || (paint && sc.bug !== false)) {
      const full = sc.demo === true, b = el("div", "bug" + (full ? " full" : ""), S.el, full ? film.demo : film.bug);
      const bt = full ? Math.min(3, sc.out - sc.in - (sc.demoAt || 0)) : sc.out - sc.in;
      tl.set(b, { visibility: "visible" }, sc.in + (sc.demoAt || 0)); tl.set(b, { visibility: "hidden" }, sc.in + (sc.demoAt || 0) + bt);
    }
    // visibility window
    tl.set(S.el, { display: "block" }, S.vis[0]);
    if (i < sceneList.length - 1) tl.set(S.el, { display: "none" }, S.vis[1]);
    scenes[i].start = S.vis[0];
  });
  tl.set({}, {}, film.duration); // pin duration
  const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], t))).join(",")})`; };

  // ---- preload and expose
  scenes.forEach((S) => S.render());
  scenes.forEach((S, i) => { if (i) S.el.style.display = "none"; });
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  window.__duration = film.duration;
  window.__seek = (t) => {
    tl.time(t, false);
    for (const S of scenes) if (t >= S.vis[0] - 1e-6 && t <= S.vis[1] + 1e-6) S.render();
  };
  window.__seek(0);
  window.__ready = true;
})().catch((e) => { window.__error = String(e && e.stack || e); });
