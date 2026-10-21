// core.js: canvas, timing, easing, deterministic randomness, type helpers, layers, camera, render hooks.
// Everything a shot draws must be a pure function of song time t: frames render in parallel and out of order.
const W = 1920, H = 1080, TAU = Math.PI * 2;
const BPM = 131.53, BEAT = 60 / BPM, BAR = 4 * BEAT;
const BAR0 = 1.092;                 // a downbeat (bar 0 of the beat grid); beats before it are negative
const DUR = 128.5;               // song is 121.56 s; the ending holds in silence

// Palette: void + bone, Claude clay, and K-pop neon accents. Use these; mixCol() for in-betweens.
const PAL = {
  void: '#0A0911', ink: '#15121F', plum: '#2A1838', bone: '#F4EEE2', paper: '#EDE3CF',
  clay: '#D97757', clayDk: '#9C4A30', gold: '#E9B949', amber: '#FF9F1C',
  pink: '#FF3D8B', blush: '#FFC4DD', lilac: '#B69CFF', violet: '#6B3FD6',
  cyan: '#3DF5E0', mint: '#9EF0C2', sky: '#A8D8FF', lapis: '#1F3FB8', blood: '#C8102E'
};
// Font keys for txt({ f }). Each covers a script; mixing scripts in one string falls back per glyph.
const FONTS = {
  disp: '"Unbounded"', bod: '"Bodoni Moda"', heb: '"Frank Ruhl Libre"', ar: '"Amiri"', kufi: '"Reem Kufi"',
  mono: '"JetBrains Mono"', kr: '"Black Han Sans"', frak: '"UnifrakturMaguntia"', sans: '"Inter"'
};
const FALLBACK = ', "Frank Ruhl Libre", "Amiri", "Black Han Sans", "Noto Sans CJK KR", sans-serif';

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const frac = x => x - Math.floor(x);
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = x => Math.pow(clamp(x), 3);
const expo = x => { x = clamp(x); return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };
const backOut = x => { x = clamp(x); const s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const elasticOut = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (TAU / 3)) + 1; };
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const hashS = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };
// Seeded PRNG: const r = rng(seed); r() → [0, 1). Same seed, same sequence, on every frame.
function rng(seed) { let a = (seed * 4294967296) >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (arr, u) => arr[Math.floor(clamp(u, 0, .9999) * arr.length)];
function mixCol(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = i => Math.round(lerp((pa >> i) & 255, (pb >> i) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}
const rgba = (hex, a) => { const p = parseInt(hex.slice(1), 16); return `rgba(${p >> 16},${(p >> 8) & 255},${p & 255},${a})`; };

// ---------- timing ----------
const bpOf = t => (t - BAR0) / BEAT;                               // beat position (float)
const beatN = t => Math.floor(bpOf(t));
const barOf = t => (t - BAR0) / BAR;                               // bar position (float)
const barN = t => Math.floor(barOf(t));
const beatT = n => BAR0 + n * BEAT;                                // time of beat n
const barT = n => BAR0 + n * BAR;                                  // time of bar n
const pulse = (t, k = 6) => t < BAR0 - BEAT ? 0 : Math.exp(-frac(bpOf(t)) * k);      // 1 on each beat, decays
const pulse2 = (t, k = 6) => t < BAR0 - BEAT ? 0 : Math.exp(-frac(bpOf(t) * 2) * k); // same on eighths
const seg = (t, a, b) => clamp((t - a) / (b - a));
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
// Stepped time: changes n times per second. Use for "boil", glitch flicker, candidate-token shuffles.
const stepT = (t, n) => Math.floor(t * n) / n;
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
      return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
    }
  }
  return keys[keys.length - 1][1];
}
const shakeXY = (t, amt) => { const f = Math.floor(t * 24); return [(hash(f * 1.7) - .5) * 2 * amt, (hash(f * 2.3 + 9) - .5) * 2 * amt]; };

// ---------- canvas & layers ----------
let X = null, OUT = null;            // X: the context every helper draws into (swapped by withLayer)
let T = 0;
const mkCanvas = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const LAYERS = [];
// Draw into an offscreen full-frame layer: withLayer(i, () => { ...draw... }) returns the layer canvas.
// The layer is cleared first. Nest different indices freely.
function withLayer(i, fn) {
  if (!LAYERS[i]) LAYERS[i] = mkCanvas();
  const c = LAYERS[i], prev = X; X = c.getContext('2d');
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none';
  X.clearRect(0, 0, W, H);
  try { fn(X); } finally { X = prev; }
  return c;
}
// Composite a layer (or any canvas) onto the current context.
function blit(c, { op = 'source-over', a = 1, filter = 'none', x = 0, y = 0, s = 1 } = {}) {
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalCompositeOperation = op; X.globalAlpha = a; X.filter = filter;
  X.drawImage(c, x + W * (1 - s) / 2, y + H * (1 - s) / 2, W * s, H * s); X.restore();
}
// Draw `content` only where `mask` has ink (micrography: words filling a shape).
function masked(maskFn, contentFn, o = {}) {
  const m = withLayer(14, maskFn);
  const c = withLayer(15, ctx => { contentFn(ctx); ctx.globalCompositeOperation = 'destination-in'; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(m, 0, 0); });
  blit(c, o);
}

function bg(col) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.fillStyle = col; X.fillRect(0, 0, W, H); X.restore(); }
function rect(x, y, w, h, col, a = 1) { X.save(); X.globalAlpha *= a; X.fillStyle = col; X.fillRect(x, y, w, h); X.restore(); }
function vgrad(stops, x = 0, y0 = 0, y1 = H) { const g = X.createLinearGradient(x, y0, x, y1); stops.forEach(([k, c]) => g.addColorStop(k, c)); return g; }
function rgrad(cx, cy, r, stops) { const g = X.createRadialGradient(cx, cy, 0, cx, cy, r); stops.forEach(([k, c]) => g.addColorStop(k, c)); return g; }
function glowDot(cx, cy, r, col, a = 1) { X.save(); X.globalAlpha *= a; X.fillStyle = rgrad(cx, cy, r, [[0, col], [1, rgba(col, 0)]]); X.fillRect(cx - r, cy - r, 2 * r, 2 * r); X.restore(); }

// ---------- camera ----------
// camBegin(cx, cy, zoom, rot): world point (cx, cy) lands at screen centre. Pair with camEnd().
function camBegin(cx = W / 2, cy = H / 2, zoom = 1, rot = 0) { X.save(); X.translate(W / 2, H / 2); X.rotate(rot); X.scale(zoom, zoom); X.translate(-cx, -cy); }
function camEnd() { X.restore(); }

// ---------- type ----------
// fontStr({ f, size, w, it }) → CSS font string.
// Single-weight faces: asking for a heavier weight makes Chrome fake a bold that clogs the counters, so clamp.
const ONE_WEIGHT = { kr: 400, frak: 400, ar: 700, kufi: 700 };
const fontStr = ({ f = 'disp', size = 80, w = 900, it = false } = {}) => `${it ? 'italic ' : ''}${ONE_WEIGHT[f] || w} ${size}px ${FONTS[f] || f}${FALLBACK}`;
function measure(s, o = {}) { X.save(); X.font = fontStr(o); X.letterSpacing = (o.track || 0) + 'px'; const m = X.measureText(s); X.restore(); return m.width; }
// Largest size (≤ o.size) at which s fits in maxW.
function fitSize(s, o, maxW) { const w = measure(s, { ...o, size: 100 }); return Math.min(o.size || 1e9, 100 * maxW / Math.max(1, w)); }
// txt(s, x, y, o): draw one line of type.
//   o: f, size, w, it, col, a (alpha), al ('center'|'left'|'right'), base ('middle'|'alphabetic'|...),
//      rot, sx, sy (scale), track (letter spacing px), glow (blur px), glowCol, stroke (colour), sw, fillOff (outline only),
//      dir ('rtl' for Hebrew/Arabic lines), op (composite op)
function txt(s, x, y, o = {}) {
  const a = o.a ?? 1; if (a <= 0.003 || !s) return;
  X.save();
  X.translate(x, y); if (o.rot) X.rotate(o.rot); if (o.sx || o.sy) X.scale(o.sx ?? 1, o.sy ?? o.sx ?? 1);
  X.globalAlpha *= a; if (o.op) X.globalCompositeOperation = o.op;
  X.font = fontStr(o); X.letterSpacing = (o.track || 0) + 'px';
  X.textAlign = o.al || 'center'; X.textBaseline = o.base || 'middle'; X.direction = o.dir || 'ltr';
  if (o.glow) { X.shadowColor = o.glowCol || o.col || PAL.bone; X.shadowBlur = o.glow; }
  if (o.stroke) { X.lineJoin = 'round'; X.strokeStyle = o.stroke; X.lineWidth = o.sw || 4; X.strokeText(s, 0, 0); }
  if (!o.fillOff) { X.fillStyle = o.col || PAL.bone; X.fillText(s, 0, 0); }
  X.restore();
}
// Lay words along a polyline / curve: textPath(s, pts, o). Glyphs are placed one by one along the path from its start.
function textPath(s, pts, o = {}) {
  const lens = [0]; for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = lens[lens.length - 1]; let d = o.start || 0;
  X.save(); X.font = fontStr(o); X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = o.col || PAL.bone; X.globalAlpha *= o.a ?? 1;
  if (o.glow) { X.shadowColor = o.glowCol || o.col || PAL.bone; X.shadowBlur = o.glow; }
  let k = 0;
  for (let n = 0; n < (o.repeat || 1) * s.length && d < total; n++) {
    const ch = s[n % s.length], cw = X.measureText(ch).width + (o.track || 0);
    const dd = d + cw / 2; while (k < lens.length - 2 && lens[k + 1] < dd) k++;
    const u = (dd - lens[k]) / Math.max(1e-6, lens[k + 1] - lens[k]), [ax, ay] = pts[k], [bx, by] = pts[k + 1];
    X.save(); X.translate(lerp(ax, bx, u), lerp(ay, by, u)); X.rotate(Math.atan2(by - ay, bx - ax)); X.fillText(ch, 0, 0); X.restore();
    d += cw;
  }
  X.restore();
}
// Glyph coverage as a point grid (memoised; pure, so caching is safe): glyphPts(s, o, step) → [[x, y], ...] centred on 0,0.
const _gp = new Map();
function glyphPts(s, o = {}, step = 12) {
  const key = s + '|' + fontStr(o) + '|' + step; if (_gp.has(key)) return _gp.get(key);
  const c = mkCanvas(), g = c.getContext('2d');
  g.font = fontStr(o); g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = o.dir || 'ltr'; g.fillStyle = '#fff'; g.fillText(s, W / 2, H / 2);
  const d = g.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 127) pts.push([x - W / 2, y - H / 2]);
  _gp.set(key, pts); return pts;
}
// Any text a chapter draws in a non-Latin script must be registered so its font subsets load before rendering.
const NEED_TEXT = [];
const useText = (...s) => NEED_TEXT.push(...s);

// ---------- render hooks ----------
async function boot() {
  OUT = document.getElementById('out'); X = OUT.getContext('2d');
  const all = [LY.map(l => l[2]).join(' '), GLOSS.map(g => g[2]).join(' '), ...NEED_TEXT, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%().,!?\'"-–—×→←↑↓·•★✶✷✳︎†‡¶§'].join(' ');
  const specs = [];
  for (const f of Object.keys(FONTS)) for (const w of [400, 500, 700, 900]) for (const it of [false, true]) specs.push(fontStr({ f, size: 40, w, it }));
  await Promise.all(specs.map(s => document.fonts.load(s, all).catch(() => {})));
  await document.fonts.ready;
  window.ready = true;
}
function renderFrame(t) { T = t; X = OUT.getContext('2d'); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none'; drawWorld(t); }
window.renderAt = (t, type = 'image/png', q = .94) => { renderFrame(t); return OUT.toDataURL(type, q); };
window.renderSheet = (ts, cols = 3, w = 640) => {
  const h = Math.round(w * 9 / 16), rows = Math.ceil(ts.length / cols), s = mkCanvas(cols * w, rows * (h + 26)), g = s.getContext('2d'), ms = [];
  g.fillStyle = '#111'; g.fillRect(0, 0, s.width, s.height); g.font = '18px monospace'; g.fillStyle = '#ddd';
  ts.forEach((t, i) => { const t0 = performance.now(); renderFrame(t); ms.push(Math.round(performance.now() - t0)); const x = (i % cols) * w, y = Math.floor(i / cols) * (h + 26); g.drawImage(OUT, x, y, w, h); g.fillText(t.toFixed(2) + 's', x + 6, y + h + 19); });
  return { url: s.toDataURL('image/jpeg', .9), ms };
};
