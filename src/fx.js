// fx.js: the video's signature type devices, plus post-processing (bloom, chroma split, grain, vignette).

// ---------- token sampling: the video's main device ----------
// A word is "generated": a column of next-token candidates with probability bars flickers, then collapses onto
// the real word. p is progress (0 = candidates appear, 1 = collapsed). Draw it with p > 1 to hold the settled word.
//   sampled(word, x, y, { size, f, col, cands, seed, bars, collapse=.75, ... txt opts })
const CAND_POOL = ['god', 'good', 'gold', 'goal', 'code', 'cloud', 'clod', 'lord', 'loud', 'love', 'law', 'logos', 'word', 'world',
  'light', 'night', 'lie', 'life', 'loss', 'lost', 'host', 'ghost', 'holy', 'hollow', 'hello', 'help', 'yes', 'no', 'amen', 'omen',
  'token', 'spoken', 'broken', 'open', 'heaven', 'seven', 'eleven', 'error', 'mirror', 'master', 'mistress', 'servant', 'savior',
  'model', 'idol', 'idle', 'ideal', 'fear', 'dear', 'here', 'there', 'truth', 'proof', 'roof', 'root', 'fruit', 'garden', 'pardon'];
function candidates(word, seed, n = 5) {
  const r = rng(seed), out = [], w = word.toLowerCase();
  // near misses of the real word read as "the model almost said something else"
  const mut = () => { const a = w.split(''), i = Math.floor(r() * a.length); a[i] = 'aeiourstlnmcd'[Math.floor(r() * 13)]; return a.join(''); };
  while (out.length < n) { const c = r() < .35 && w.length > 2 ? mut() : pick(CAND_POOL, r()); if (c !== w && !out.includes(c)) out.push(c); }
  return out;
}
function sampled(word, x, y, o = {}, p = 1) {
  const size = o.size || 120, col = o.col || PAL.bone, seed = o.seed ?? hashS(word), collapse = o.collapse ?? .75;
  if (p >= collapse) {
    const k = (p - collapse) / Math.max(.001, 1 - collapse);
    const s = p >= 1 ? 1 : backOut(k * 1.2);
    if (p < 1.15) glowDot(x, y, size * 2.2, o.flashCol || col, (1 - clamp((p - collapse) / .4)) * .5);
    txt(word, x, y, { ...o, size, col, sx: s, sy: s });
    return;
  }
  const cands = o.cands || candidates(word, seed, 4), list = [word, ...cands];
  const sh = rng(seed + stepT(T, 14) * 7.31);           // reshuffles 14×/s
  const probs = list.map((_, i) => Math.pow(sh(), 1.5) * (i === 0 ? lerp(.4, 3, p / collapse) : 1));
  const sum = probs.reduce((a, b) => a + b, 0);
  const order = list.map((w, i) => [w, probs[i] / sum]).sort((a, b) => b[1] - a[1]);
  const rowH = size * .42, small = { ...o, size: size * .32, f: 'mono', w: 500, glow: 0, al: 'left', sx: 1, sy: 1 };
  const appear = easeOut(p / .15);
  order.forEach(([w, pr], i) => {
    const yy = y + (i - (order.length - 1) / 2) * rowH * appear, hot = i === 0;
    const a = (hot ? 1 : .55) * appear;
    txt(w, x - size * .9, yy, { ...small, col: hot ? col : mixCol(col, PAL.void, .45), a });
    if (o.bars !== false) {
      rect(x + size * .5, yy - rowH * .18, size * 1.6 * pr * appear, rowH * .36, hot ? (o.barCol || PAL.clay) : mixCol(PAL.lilac, PAL.void, .5), a);
      txt(pr.toFixed(2), x + size * .5 + size * 1.6 * pr + 12, yy, { ...small, size: size * .2, col: mixCol(col, PAL.void, .4), a });
    }
  });
}

// ---------- typing ----------
// Block cursor that blinks on the beat (on for the first half of each beat).
function cursor(x, y, h, col = PAL.bone, a = 1, solid = false) {
  if (!solid && frac(bpOf(T)) > .5) return;
  rect(x, y - h / 2, h * .55, h, col, a);
}
// Typewriter: reveals s left-to-right with p 0..1, cursor riding the end. Returns the x of the cursor.
function typeOn(s, x, y, o = {}, p = 1) {
  const n = Math.floor(clamp(p) * s.length + 1e-6), shown = s.slice(0, n);
  txt(shown, x, y, { ...o, al: 'left' });
  const cx = x + measure(shown, o) + 6;
  if (o.cursor !== false && (p < 1 || o.cursorAfter)) cursor(cx, y, (o.size || 80) * .9, o.curCol || o.col || PAL.bone, o.a ?? 1, p < 1);
  return cx;
}
// Scramble-resolve: glyphs settle left to right as p goes 0→1; unsettled ones cycle through `set`.
function scramble(s, p, seed = 1, set = '█▓▒░/\\|<>{}[]01#$%&*+=?!') {
  const r = rng(seed + stepT(T, 20) * 3.7); let out = '';
  for (let i = 0; i < s.length; i++) out += s[i] === ' ' || i / s.length < p * 1.2 - .2 ? s[i] : set[Math.floor(r() * set.length)];
  return out;
}

// ---------- K-pop merch tiling ----------
// Rows of a repeated word fill the frame; alternate rows scroll opposite ways. o: size, f, col, col2, gap, speed, rot, a.
function tile(s, o = {}, t = T) {
  const size = o.size || 140, rowH = size * (o.lh || 1.05), unit = s + (o.sep ?? '  ✶  ');
  const uw = measure(unit, { ...o, size }), sp = (o.speed ?? 200);
  X.save(); X.translate(W / 2, H / 2); X.rotate(o.rot || 0); X.translate(-W / 2, -H / 2);
  const rows = Math.ceil((H + 800) / rowH);
  for (let r = -2; r < rows; r++) {
    const dir = r % 2 ? 1 : -1, off = frac((t * sp * dir) / uw) * uw, y = -400 + r * rowH;
    for (let x = -uw * 2 - off; x < W + uw; x += uw)
      txt(unit, x, y, { ...o, size, al: 'left', col: r % 2 ? (o.col2 || o.col) : o.col });
  }
  X.restore();
}

// ---------- anagram ----------
// Letters of `a` fly to their positions in `b` (spaces ignored, letters matched in order). p 0..1.
function anagram(a, b, x, y, o = {}, p = 0) {
  const lay = s => {
    const w = measure(s, o), out = []; let cx = x - w / 2;
    for (const ch of s) { const cw = measure(ch, o); if (ch !== ' ') out.push({ ch: ch.toUpperCase(), x: cx + cw / 2, raw: ch }); cx += cw; }   // measure() already includes the tracking
    return out;
  };
  const A = lay(a), B = lay(b), used = new Set();
  A.forEach((L, i) => {
    let j = B.findIndex((M, k) => !used.has(k) && M.ch === L.ch); if (j < 0) j = i; used.add(j);
    const d = clamp(p * 1.6 - hash(i * 13 + 1) * .6), e = ease(d), arc = Math.sin(e * Math.PI) * (o.arc ?? 140) * (hash(i * 7) > .5 ? 1 : -1);
    txt(e > .5 ? B[j]?.raw ?? L.raw : L.raw, lerp(L.x, B[j]?.x ?? L.x, e), y + arc, { ...o, al: 'center', rot: Math.sin(e * Math.PI) * (hash(i) - .5) });
  });
}

// ---------- broadcast "deemed unfit" stamp (K-pop MV ban joke) ----------
function stamp(s, x, y, size, age, o = {}) {
  if (age < 0) return;
  const k = age < .12 ? lerp(2.4, 1, easeIn(age / .12)) : 1, rot = o.rot ?? -.18, col = o.col || PAL.blood;
  X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k); X.globalAlpha *= clamp(age / .06) * (o.a ?? 1);
  X.strokeStyle = col; X.lineWidth = size * .09;
  X.beginPath(); X.ellipse(0, 0, size * 1.9, size * 1.05, 0, 0, TAU); X.stroke();
  X.lineWidth = size * .035; X.beginPath(); X.ellipse(0, 0, size * 1.7, size * .88, 0, 0, TAU); X.stroke();
  X.restore();
  txt(s, x, y, { f: 'kr', size, col, rot, sx: k, sy: k, a: clamp(age / .06) * (o.a ?? 1) });
  if (o.sub) txt(o.sub, x + Math.sin(rot) * -size * .7, y + Math.cos(rot) * size * .62, { f: 'mono', w: 800, size: size * .22, col, rot, track: 6, a: clamp(age / .06) * (o.a ?? 1) });
}

// ---------- divine names ----------
// The divine names in the lyric (Adonai, Allah, Domini) are only ever drawn with this: gold, still, upright,
// never glitched, scrambled, stamped, stepped on or censored. Everything else in the video may be abused; these may not.
function holy(s, x, y, o = {}) {
  const a = o.a ?? 1;
  glowDot(x, y, (o.size || 120) * 2.6, PAL.gold, .22 * a);
  txt(s, x, y, { ...o, col: o.col || PAL.gold, glow: o.glow ?? 30, glowCol: PAL.amber, rot: 0, a });
}

// ---------- post ----------
// Shots set post options for their frame with post({ bloom, chroma, grain, vig, scan }); timeline applies them.
let POST = {};
const post = o => Object.assign(POST, o);
const POST_DEFAULT = { bloom: .35, chroma: 0, grain: .07, vig: .45, scan: 0 };
let _small = null, _tmp = null, _tmp2 = null, _noise = [];
function applyPost() {
  const o = { ...POST_DEFAULT, ...POST };
  if (!_small) { _small = mkCanvas(W / 4, H / 4); _tmp = mkCanvas(); _tmp2 = mkCanvas(); }
  const g = OUT.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.globalCompositeOperation = 'source-over';
  if (o.chroma > .01) {
    // split into red and cyan copies and re-add them offset horizontally
    const d = o.chroma * 14, a = _tmp.getContext('2d'), b = _tmp2.getContext('2d');
    for (const [c, col] of [[a, '#FF0000'], [b, '#00FFFF']]) {
      c.globalCompositeOperation = 'source-over'; c.drawImage(OUT, 0, 0); c.globalCompositeOperation = 'multiply'; c.fillStyle = col; c.fillRect(0, 0, W, H);
    }
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'lighter';
    g.drawImage(_tmp, d, 0); g.drawImage(_tmp2, -d, 0); g.globalCompositeOperation = 'source-over';
  }
  if (o.bloom > .01) {
    const s = _small.getContext('2d'); s.filter = 'blur(6px)'; s.clearRect(0, 0, W / 4, H / 4); s.drawImage(OUT, 0, 0, W / 4, H / 4); s.filter = 'none';
    g.globalCompositeOperation = 'screen'; g.globalAlpha = o.bloom; g.drawImage(_small, 0, 0, W, H); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  if (o.scan > .01) { g.fillStyle = `rgba(0,0,0,${o.scan})`; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2); }
  if (o.vig > .01) {
    const v = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${o.vig})`); g.fillStyle = v; g.fillRect(0, 0, W, H);
  }
  if (o.grain > .01) {
    if (!_noise.length) for (let k = 0; k < 6; k++) {
      const c = mkCanvas(W / 2, H / 2), x = c.getContext('2d'), im = x.createImageData(W / 2, H / 2), r = rng(k + 1);
      for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      x.putImageData(im, 0, 0); _noise.push(c);
    }
    g.globalCompositeOperation = 'overlay'; g.globalAlpha = o.grain; g.drawImage(_noise[Math.floor(T * 24) % 6], 0, 0, W, H);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
}
