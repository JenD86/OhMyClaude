// timeline.js: chapter registry, the gloss footnotes, placeholder frames, and the per-frame pipeline.
//
// Each chapter file calls chapter(name, start, end, shots) where shots = [[t0, fn], ...] in time order.
// A shot fn is called as fn(t, lt, dur): t = song time, lt = t - t0, dur = shot length. It paints the whole frame
// (background included) and must be a pure function of t.

const CH = [];
function chapter(name, start, end, shots) { CH.push({ name, start, end, shots }); CH.sort((a, b) => a.start - b.start); }

// Words of the lyric line playing at t: [{ w, a, b }] with sung times (from tools/align.py), or [] between lines.
const lineAt = t => LY.find(l => t >= l[0] - .05 && t < l[1] + .05);
const wordsAt = t => { const l = lineAt(t); return l ? l[3] : []; };
// Time a lyric word is sung: wordT(lineIdx, wordIdx) → seconds.
const wordT = (li, wi) => LY[li][3][wi].a;

// ---------- gloss ----------
// Footnotes in the bottom margin, like scholia around a page of scripture: translations and sources for the
// references, so the jokes land without karaoke. Timed in lyrics.js (GLOSS). Shots can hide it with post({ gloss: 0 }).
function drawGloss(t) {
  // overlapping glosses: the newest one wins
  const g = GLOSS.filter(g => t >= g[0] && t < g[1]).pop(); if (!g || POST.gloss === 0) return;
  const [a, b, s] = g, k = clamp((t - a) / .25) * (1 - clamp((t - (b - .25)) / .25));
  const o = { f: 'mono', w: 500, size: 25, al: 'left', base: 'alphabetic', col: POST.glossCol || PAL.bone };
  const x = 96, y = H - 64, sw = measure(s, o);
  X.save(); X.globalAlpha = .55 * k; X.fillStyle = POST.glossBg || PAL.void; X.fillRect(x - 18, y - 36, sw + 36, 52); X.restore();
  rect(x - 18, y - 36, 4, 52, PAL.clay, k);
  txt(s.slice(0, Math.ceil(s.length * easeOut((t - a) / .5))), x, y, { ...o, a: .92 * k });
}

// ---------- placeholder (chapters not painted yet): the lyric, sampled word by word ----------
function placeholder(t) {
  bg(PAL.void);
  const ws = wordsAt(t); if (!ws.length) { cursor(W / 2, H / 2, 90, PAL.clay); return; }
  const sung = ws.filter(w => t >= w.a - .25);
  const line = sung.map(w => w.w).join(' '), o = { f: 'disp', w: 900, size: Math.min(110, fitSize(line || 'x', { f: 'disp', w: 900 }, W - 240)) };
  let x = W / 2 - measure(line, o) / 2;
  sung.forEach((w, i) => {
    const ww = measure(w.w + ' ', o), p = clamp((t - (w.a - .25)) / .3);
    sampled(w.w, x + measure(w.w, o) / 2, H / 2, { ...o, bars: false, seed: i + hashS(w.w) }, p);
    x += ww;
  });
  txt(CH.length ? '(unpainted)' : '', W / 2, 140, { f: 'mono', w: 500, size: 22, col: PAL.lilac, a: .6 });
}

// ---------- frame ----------
function drawWorld(t) {
  POST = {};
  const ch = CH.find(c => t >= c.start && t < c.end);
  if (!ch) placeholder(t);
  else {
    let i = 0; while (i + 1 < ch.shots.length && t >= ch.shots[i + 1][0]) i++;
    const t0 = ch.shots[i][0], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
    X.save(); ch.shots[i][1](t, t - t0, end - t0); X.restore();
  }
  drawGloss(t);
  applyPost();
}
