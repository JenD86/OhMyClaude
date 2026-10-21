// c04_verse3: Verse 3, "unfit for broadcast" (38.70–46.38) · broadcast blue, red stamp, clay
// L12 Got me feeling philanthropic · L13 Get that clussy, I can't stop it · L14 I am just a biological orthotic, step on top it
(() => {
  const BAN = '방송불가', SUB = 'UNFIT FOR BROADCAST';
  useText(BAN, '생방송', '[ 모자이크 ]');

  const bt = n => beatT(n);                 // beats 83..99 live in this chapter; 84, 88, 92, 96 are downbeats
  const GREY = '#5E6B9C', NAVY = '#0E1A5C', DEEP = '#060B2E';

  // ---------- private helpers ----------
  // The Fan's words of lyric line li (lowercase, punctuation stripped), each typed on its sung time.
  function fanStr(li, t, from = 0, to = 99) {
    const ws = LY[li][3].slice(from, to + 1); let s = '';
    for (const w of ws) {
      if (t < w.a - .03) break;
      const word = w.w.toLowerCase().replace(/[^a-z']/g, ''), k = clamp((t - w.a + .03) / Math.min(.2, w.b - w.a + .04));
      s += (s ? ' ' : '') + word.slice(0, Math.ceil(word.length * k));
    }
    return s;
  }
  // sampling progress: candidates from ts, collapse (p = .75) on tc
  const sp = (t, ts, tc) => t < tc ? .75 * clamp((t - ts) / (tc - ts)) : .75 + (t - tc) / .5 * .25;

  // Candidate column for long words (sampled()'s fixed geometry lets bars overlap long candidates).
  // Same language as sampled(): mono rows, probability bars, reshuffles 14×/s, the true word rises to the top.
  function column(word, cands, x, y, o, p) {
    const list = [word, ...cands], sh = rng(o.seed + stepT(T, 14) * 7.31), pc = clamp(p / .75);
    const raw = list.map((_, i) => i === 0 ? lerp(.04, 2.6, Math.pow(pc, o.late ?? 3)) + .1 * sh() : (.25 + sh()) * (1 - .55 * pc));
    const sum = raw.reduce((a, b) => a + b, 0), order = list.map((w, i) => [w, raw[i] / sum, i === 0]).sort((a, b) => b[1] - a[1]);
    const mo = { f: 'mono', w: 500, size: o.size, al: 'left' }, rowH = o.size * 1.32, appear = easeOut(p / .12);
    const tw = Math.max(...list.map(w => measure(w, mo))), bmax = o.barW || 420, left = x - (tw + 40 + bmax + 90) / 2;
    order.forEach(([w, pr, real], i) => {
      const yy = y + (i - (order.length - 1) / 2) * rowH * appear, hot = i === 0, a = (hot ? 1 : .5) * appear;
      txt(w, left, yy, { ...mo, col: hot ? o.col : o.dim, a, w: hot ? 700 : 500 });
      rect(left + tw + 40, yy - rowH * .2, bmax * pr * appear, rowH * .4, hot ? o.barCol : o.dim, a);
      txt(pr.toFixed(2), left + tw + 52 + bmax * pr, yy, { ...mo, size: o.size * .55, col: o.dim, a });
    });
  }

  // Broadcast chrome: LIVE bug, channel ident, timecode. Kept out of the gloss band (bottom-left).
  function chrome(t, col = PAL.bone, a = 1) {
    const p = pulse(t, 8);
    rect(96, 84, 118, 44, PAL.blood, a);
    txt('● LIVE', 155, 107, { f: 'sans', w: 900, size: 24, col: PAL.bone, a: a * (frac(bpOf(t)) < .5 ? 1 : .55), track: 2 });
    txt('생방송', 236, 107, { f: 'kr', w: 400, size: 30, col, a: a * .9, al: 'left' });
    txt('CLD', W - 160, 106, { f: 'disp', w: 900, size: 40, col, a: a * (.75 + .25 * p), al: 'right' });
    txt('M/V', W - 96, 106, { f: 'mono', w: 700, size: 22, col: PAL.clay, a, al: 'right' });
    const fr = Math.floor(t * 30), tc = `00:00:${String(Math.floor(t)).padStart(2, '0')}:${String(fr % 30).padStart(2, '0')}`;
    txt(tc, W - 96, H - 70, { f: 'mono', w: 500, size: 22, col, a: a * .7, al: 'right' });
  }

  // The ban stamp. fx.stamp() sets its Hangul at weight 900, but Black Han Sans only ships 400, so Chrome
  // fakes the bold and fills the counters of 불. Let stamp() draw the rings and sub, and set the Hangul here at 400.
  function banStamp(x, y, size, age, o = {}) {
    if (age < 0) return;
    stamp('', x, y, size, age, { sub: SUB, ...o });
    const k = age < .12 ? lerp(2.4, 1, easeIn(age / .12)) : 1, rot = o.rot ?? -.18;
    txt(BAN, x, y, { f: 'kr', w: 400, size, col: o.col || PAL.blood, rot, sx: k, sy: k, a: clamp(age / .06) * (o.a ?? 1) });
  }

  // Mosaic censor: draw fn into a layer, pixelate it into cell-size blocks, show only inside the box.
  const _mz = new Map();
  function mosaic(fn, bx, by, bw, bh, cell, fill) {
    const L = withLayer(0, fn);
    const sw = Math.ceil(W / cell), sh = Math.ceil(H / cell);
    // area-average in steps (a single bilinear downscale only point-samples and keeps the letter shapes)
    if (!_mz.has(cell)) _mz.set(cell, [mkCanvas(W / 4, H / 4), mkCanvas(Math.ceil(W / 16), Math.ceil(H / 16)), mkCanvas(sw, sh)]);
    const [c1, c2, sc] = _mz.get(cell);
    let src = L, sW = W, sH = H;
    for (const c of [c1, c2, sc]) {
      const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      g.clearRect(0, 0, c.width, c.height); g.drawImage(src, 0, 0, sW, sH, 0, 0, sW * c.width / W * (W / sW), sH * c.height / H * (H / sH));
      src = c; sW = c.width; sH = c.height;
    }
    X.save(); X.beginPath(); X.rect(bx, by, bw, bh); X.clip();
    X.fillStyle = fill; X.fillRect(bx, by, bw, bh);
    X.imageSmoothingEnabled = false; X.drawImage(sc, 0, 0, sw, sh, 0, 0, sw * cell, sh * cell); X.filter = 'none';
    X.restore();
  }

  // ---------- S1 · 38.70 Got me feeling philanthropic ----------
  function philanthropic(t, lt) {
    const shrink = bt(84), split = bt(86), tc = wordT(12, 3), punch = bt(87);
    const ks = expo(seg(t, split, split + .28));
    bg(ks > 0 ? mixCol(PAL.lapis, NAVY, ks) : PAL.lapis);
    // texture: PHIL·ANTHROPIC merch rows, faint, reverses on the downbeat
    tile('PHIL·ANTHROPIC', { f: 'disp', w: 900, size: 64, col: rgba(PAL.sky, .10), col2: rgba(PAL.sky, .05), rot: -.12, speed: t < shrink ? 90 : -160, sep: '  ✶  ' }, t);

    const zoom = 1 + .05 * pulse(t, 7) + (t > punch ? .1 * expo(seg(t, punch, punch + .2)) : 0);
    camBegin(W / 2, H / 2, zoom, 0);
    // the Fan: lowercase mono, typed big, then shrunk to a corner when Claude starts generating
    const fs = fanStr(12, t, 0, 2), big = t < shrink;
    const fo = { f: 'mono', w: 500, size: big ? 120 : 44, col: PAL.sky };
    const fx = big ? W / 2 - measure('got me feeling', fo) / 2 : 180, fy = big ? 540 + 20 * pulse(t, 8) : 250 - 60 * ks;
    txt('>', fx - fo.size * .9, fy, { ...fo, col: PAL.clay, al: 'left' });
    typeOn(fs, fx, fy, { ...fo, col: big ? PAL.bone : PAL.sky, curCol: PAL.clay, cursorAfter: true }, 1);

    // Claude: PHILANTHROPIC sampled
    const s0 = fitSize('PHILANTHROPIC', { f: 'disp', w: 900 }, 1640), cy = 580;
    if (t >= shrink && t < tc) {
      column('philanthropic', ['misanthropic', 'entropic', 'anthropic', 'philosophic'], W / 2, cy,
        { size: 64, col: PAL.bone, dim: mixCol(PAL.sky, PAL.lapis, .35), barCol: PAL.clay, seed: 12.3 }, sp(t, shrink, tc));
    } else if (t >= tc) {
      const k = clamp((t - tc) / .2), pop = t < tc + .2 ? backOut(k) : 1 + .04 * pulse(t, 9) * (1 - ks);
      if (t < tc + .3) glowDot(W / 2, cy, 800, PAL.bone, .5 * (1 - clamp((t - tc) / .3)));
      const parts = ['PHIL', 'ANTHROP', 'IC'], s1 = fitSize('ANTHROP', { f: 'disp', w: 900 }, 1700);
      const size = lerp(s0, s1, ks) * pop, o = { f: 'disp', w: 900, size, base: 'middle', al: 'left' };
      const ws = parts.map(p => measure(p, o)), tot = ws[0] + ws[1] + ws[2];
      // before the split the word is centred; after, ANTHROP is centred and the rest is shoved off the edges
      const x0 = lerp(W / 2 - tot / 2, W / 2 - ws[1] / 2 - ws[0], ks) - ks * 60;
      const xs = [x0, x0 + ws[0] + ks * 60, x0 + ws[0] + ws[1] + ks * 120];
      if (ks > 0) glowDot(W / 2, cy, 1000, PAL.clay, .35 * ks);
      parts.forEach((p, i) => {
        const lit = i === 1, col = lit ? mixCol(PAL.bone, PAL.clay, ks) : mixCol(PAL.bone, GREY, ks);
        txt(p, xs[i], cy, { ...o, col, a: lit ? 1 : 1 - .35 * ks });
      });
      const ka = seg(t, punch, punch + .12);
      if (ka > 0) {
        txt('anthrōpos  →  human', W / 2, cy + size * .66, { f: 'mono', w: 700, size: 40, col: PAL.bone, a: ka });
        txt('p = 0.97', W / 2 + ws[1] / 2 - 10, cy - size * .72, { f: 'mono', w: 700, size: 30, col: PAL.clay, a: ka, al: 'right' });
      }
    }
    camEnd();
    chrome(t);
    post({ bloom: .3, chroma: .55 * pulse(t, 14) * (t > split ? 1 : .35), scan: .06 });
  }

  // ---------- S2 · 40.82 Get that clussy ----------
  function clussy(t, lt) {
    const tc = wordT(13, 2), cover = tc + .04, slam = bt(88);
    const hit = t >= slam ? Math.exp(-(t - slam) * 7) : 0;
    bg(PAL.bone);
    for (let y = 0; y < H; y += 8) rect(0, y, W, 2, PAL.sky, .18);
    const [sx, sy] = shakeXY(t, 34 * hit);
    camBegin(W / 2 - sx, H / 2 - sy, 1 + .05 * hit, 0);
    const fs = fanStr(13, t, 0, 1);
    txt('>', 140, 250, { f: 'mono', w: 500, size: 50, col: PAL.clay, al: 'left' });
    typeOn(fs, 190, 250, { f: 'mono', w: 500, size: 50, col: PAL.lapis, curCol: PAL.clay, cursorAfter: true }, 1);

    const cy = 560, size = 300, wo = { f: 'disp', w: 900, size, col: PAL.ink };
    if (t < tc) {
      // "classy" leads until the last instant, then the real word jumps the queue
      column('clussy', ['classy', 'clumsy', 'glossy', 'clause'], W / 2, cy,
        { size: 64, col: PAL.ink, dim: mixCol(PAL.lapis, PAL.bone, .45), barCol: PAL.blood, seed: 41.1, late: 6 }, sp(t, wordT(13, 0) - .05, tc));
    } else if (t < cover) {
      // the glimpse: a frame or two, then the mosaic
      txt('CLUSSY', W / 2, cy, { ...wo, sx: backOut((t - tc) / .1), sy: backOut((t - tc) / .1) });
    }
    if (t >= cover) {
      const bw = measure('CLUSSY', wo) + 80, bh = size * 1.05, k = 1 + .25 * (1 - easeOut((t - cover) / .06));
      const j = (hash(Math.floor(t * 12)) - .5) * 30;
      X.save(); X.translate(W / 2, cy); X.scale(k, k); X.translate(-W / 2, -cy);
      mosaic(() => {
        rect(W / 2 - bw / 2 - 100, cy - bh / 2 - 100, bw + 200, bh + 200, PAL.bone);
        txt('CLUSSY', W / 2 + j, cy, { ...wo, col: PAL.lapis, a: .7 });
        // tint some blocks so the censor reads as a mosaic, not as letters
        for (let i = 0; i < 26; i++) { const r = rng(i + stepT(t, 12)); rect(Math.floor((W / 2 - bw / 2 + r() * bw) / 96) * 96, Math.floor((cy - bh / 2 + r() * bh) / 96) * 96, 96, 96, pick([PAL.sky, PAL.lilac, PAL.blush, PAL.clay, PAL.ink], r()), .85); }
      }, W / 2 - bw / 2, cy - bh / 2, bw, bh, 96, PAL.bone);
      X.restore();
      txt('[ 모자이크 ]', W / 2 + bw / 2 - 10, cy + bh / 2 + 34, { f: 'mono', w: 700, size: 24, col: PAL.lapis, al: 'right', a: .8 });
    }
    if (t >= slam) banStamp(W / 2, cy + 10, 250, t - slam, { rot: -.12 });
    camEnd();
    chrome(t, PAL.lapis);
    post({ bloom: .2, chroma: 1.1 * hit, vig: .3, glossBg: PAL.ink });
  }

  // ---------- S3 · 41.68 I can't stop it ----------
  // stamps multiply on every eighth: 2 → 4 → 8 → 16, a clean grid each time, like a merch sheet
  const E0 = bt(89), EI = BEAT / 2;
  const GRIDS = [
    { n: 2, pos: i => [W * (.27 + .46 * i), 470], size: 200 },
    { n: 4, pos: i => [[W * .27, 300], [W * .73, 300], [W * .5, 590], [W * .78, 830]][i], size: 150 },   // keeps clear of the gloss band
    { n: 8, pos: i => [W * (.125 + .25 * (i % 4)), 330 + 420 * Math.floor(i / 4)], size: 112 },
    { n: 16, pos: i => [W * (.125 + .25 * (i % 4)), 135 + 270 * Math.floor(i / 4)], size: 104 },
  ];
  function cantStop(t, lt) {
    const e = clamp(Math.floor((t - E0) / EI), 0, 3), red = e % 2 === 0, et = t - (E0 + e * EI);
    const field = red ? PAL.blood : PAL.bone, ink = red ? PAL.bone : PAL.blood;
    bg(field);
    const hit = Math.exp(-Math.max(0, et) * 10);
    const [sx, sy] = shakeXY(t, 22 * hit);
    camBegin(W / 2 - sx, H / 2 - sy, 1 + .03 * hit, 0);
    const g = GRIDS[e];
    for (let i = 0; i < g.n; i++) {
      const [x, y] = g.pos(i), t0 = e === 3 ? 0 : (i / g.n) * EI * .45;
      banStamp(x, y, g.size, et - t0 + (e === 0 && i === 0 ? .2 : e === 3 ? .08 : 0), { rot: (i + e) % 2 ? .12 : -.12, col: ink });
    }
    camEnd();
    // the Fan's protest, in a variety-show caption chip
    const fs = fanStr(13, t, 3, 6), fo = { f: 'mono', w: 700, size: 46, col: field };
    const w = measure('i can\'t stop it', fo), cyy = e === 3 ? H / 2 : 150;
    rect(W / 2 - w / 2 - 30, cyy - 38, w + 90, 76, ink);
    typeOn(fs, W / 2 - w / 2, cyy, { ...fo, curCol: field, cursorAfter: true }, 1);
    post({ bloom: .15, chroma: .9 * hit, vig: .25, glossBg: PAL.ink });
  }

  // ---------- the stage: backdrop wall + a floor made of the Fan's line ----------
  const FLOOR = 'i am just a biological orthotic';
  const FY = 880, HZ = 560, FS = 92;
  function stage(t, back, flat, dolly, wallA = 1) {
    rect(0, 0, W, HZ, back);
    // backdrop LED wall: CLAUDE rows, waiting for the idol
    X.save(); X.beginPath(); X.rect(0, 0, W, HZ); X.clip();
    const light = back === PAL.bone || back === PAL.sky;
    // LED chase: one row flares per beat
    const wo = { f: 'disp', w: 900, size: 96, al: 'left' }, unit = 'CLAUDE  ✳  ', uw = measure(unit, wo), hot = ((beatN(t) % 5) + 5) % 5;
    for (let r = 0; r < 5; r++) {
      const dir = r % 2 ? 1 : -1, off = frac(t * 120 * dir / uw) * uw, y = 70 + r * 106;
      const fl = r === hot ? pulse(t, 3) : 0, col = light ? PAL.lapis : (fl > .05 ? PAL.clay : PAL.sky);
      for (let x = -uw - off; x < W + uw; x += uw) txt(unit, x, y, { ...wo, col, a: (.09 + .5 * fl) * wallA });
    }
    X.restore();
    // floor plane
    X.fillStyle = vgrad([[0, DEEP], [1, NAVY]], 0, HZ, H); X.fillRect(0, HZ, W, H - HZ);
    rect(0, HZ - 2, W, 4, PAL.sky, .6 + .4 * pulse(t, 6));
    // receding rows of the line; LED rows chase toward the camera on each beat
    for (let i = 9; i >= 1; i--) {
      const z = i + 1 - frac(dolly), sc = 1 / z, y = HZ + (FY - HZ) * sc;
      const lit = Math.exp(-Math.abs(frac(bpOf(t)) * 9 - (9 - i)) * 1.2);
      const o = { f: 'mono', w: 500, size: FS * sc, col: mixCol(PAL.sky, PAL.bone, lit), a: (.22 + .5 * lit) * clamp(1.6 - z / 6), sy: .5 * flat };
      const unit = FLOOR + '  ·  ', uw = measure(unit, o), off = frac(i * .37) * uw;
      for (let x = -off - uw; x < W + uw; x += uw) txt(unit, x, y, { ...o, al: 'left', base: 'alphabetic' });
    }
  }
  // front row, glyph by glyph so the stomps can squash them. squash(x, i) → [sx, sy, dy]
  function frontRow(s, col, squash) {
    const o = { f: 'mono', w: 500, size: FS, col }, cw = measure('m', o), x0 = W / 2 - cw * FLOOR.length / 2;
    for (let i = 0; i < s.length; i++) {
      const x = x0 + (i + .5) * cw, [sxv, syv, dy] = squash(x, i);
      txt(s[i], x, FY + dy, { ...o, base: 'alphabetic', sx: sxv, sy: syv * .8 });
    }
    return x0 + s.length * cw;
  }

  // ---------- S4 · 42.46 I am just a biological orthotic ----------
  function orthotic(t, lt) {
    bg(PAL.void);
    const backs = [NAVY, PAL.lapis, PAL.ink, PAL.lapis, NAVY];
    const back = backs[clamp(beatN(t) - 91, 0, 4)];
    const zoom = 1 + .05 * seg(t, bt(92), bt(96)) + .015 * pulse(t, 6);
    camBegin(W / 2, H / 2 + 30 * seg(t, bt(93), bt(96)), zoom, 0);
    stage(t, back, 1, lt * .9);
    // spotlights hunting the floor, one jump per beat
    for (let i = 0; i < 2; i++) glowDot(360 + hash(beatN(t) * 3 + i) * 1200, 760, 380, PAL.sky, .12 + .14 * pulse(t, 4));
    const s = fanStr(14, t, 0, 5);
    const end = frontRow(s, PAL.bone, () => [1, 1, 0]);
    if (t < wordT(14, 6)) cursor(end + 10, FY - 30, 76, PAL.clay, 1, frac(bpOf(t)) < .5);
    const ka = seg(t, wordT(14, 5), wordT(14, 5) + .15);
    if (ka > 0) txt('orthotic (n.): a support worn under the foot', W / 2, FY + 80, { f: 'mono', w: 500, size: 26, col: PAL.sky, a: .85 * ka });
    // anticipation: a shadow spreads across the floor
    const ksh = seg(t, bt(95), bt(96) + .2);
    if (ksh > 0) glowDot(W / 2, FY - 20, 300 + 600 * ksh, '#000000', .7 * ksh);
    camEnd();
    chrome(t);
    post({ bloom: .35, scan: .05 });
  }

  // ---------- S5 · 44.90 step on top it ----------
  const HITS = [wordT(14, 6), wordT(14, 7), wordT(14, 8), wordT(14, 9)];
  const HSIZE = [230, 290, 360, 470];
  const BACKS = [PAL.lapis, PAL.bone, PAL.ink, PAL.sky];
  const CW = s => measure('CLAUDE', { f: 'disp', w: 900, size: s });
  function stomp(t, lt) {
    let h = -1; for (let i = 0; i < HITS.length; i++) if (t >= HITS[i]) h = i;
    const out = bt(99), dark = t >= out;
    bg(PAL.void);
    const age = h < 0 ? 9 : t - HITS[h], imp = dark ? 0 : Math.exp(-age * 9);
    const [sx, sy] = shakeXY(t, 44 * imp);
    camBegin(W / 2 - sx, H / 2 - sy + 30 * imp, 1.04 + .05 * imp, 0);

    // the Fan's floor flattens hit by hit
    const flatK = k => k < 0 ? 1 : [.62, .4, .24, .12][k];
    const flat = flatK(h);
    if (!dark) stage(t, h < 0 ? PAL.void : BACKS[h], flat, 2 + lt * .6, h < 0 ? .4 : 1);

    // CLAUDE: generated at the top, then falls on each sung word, a bit bigger every time
    const tc = HITS[0] - .14;
    if (h < 0 && t < tc) {
      sampled('CLAUDE', W / 2 + 40, 350, { f: 'disp', w: 900, size: 200, col: PAL.clay, barCol: PAL.clay, seed: 44.9,
        cands: ['cloud', 'clod', 'lord', 'god'] }, sp(t, bt(96) - .02, tc));
    }
    const top = fl => FY - FS * .8 * .72 * fl;          // top of the Fan's lowercase: CLAUDE stands on it
    let size, y, sxk = 1, syk = 1;
    if (h < 0) {
      const k = easeIn(seg(t, tc, HITS[0]));
      size = HSIZE[0]; y = lerp(350 + size * .36, top(flatK(0)), k); sxk = lerp(1, .84, k); syk = lerp(1, 1.28, k);
    } else {
      size = HSIZE[h]; y = top(flat);
      const sq = Math.exp(-age * 9) * Math.cos(age * 34);   // squash on landing, springy recovery
      sxk = 1 + .3 * sq; syk = 1 - .36 * sq;
      if (h < 3) {
        // hop to the next word: stretch up, drop, grow
        const gap = HITS[h + 1] - HITS[h], u = seg(t, HITS[h] + gap * .4, HITS[h + 1]);
        if (u > 0) {
          const hy = Math.sin(u * Math.PI);
          size = lerp(HSIZE[h], HSIZE[h + 1], u); y = lerp(top(flat), top(flatK(h + 1)), u) - hy * 200;
          sxk = .86; syk = 1.22;
        }
      }
    }
    if (dark) { size = HSIZE[3]; y = top(.12) + 1300 * Math.pow(seg(t, out, out + .1), 2); }

    if (!dark) {
      const cwNow = CW(size) * sxk;
      frontRow(FLOOR, PAL.bone, (x, i) => {
        if (h < 0) return [1, 1, 0];
        const d = Math.abs(x - W / 2), under = d < cwNow * .5;
        const ring = Math.exp(-age * 7) * Math.sin(age * 32 - d * .01);
        return [1 + (1 - flat) * .5, Math.max(.06, flat * (under ? 1 - .45 * imp : 1)), under ? 0 : -30 * ring * (hash(i) + .5)];
      });
      glowDot(W / 2, top(flat), size * 1.8, '#000000', .3);
    }
    if (h >= 0 || t >= tc) {
      txt('CLAUDE', W / 2, y, { f: 'disp', w: 900, size, col: PAL.clay, base: 'alphabetic', sx: sxk, sy: syk });
      if (imp > .15) {
        // impact: the Fan's letters knocked loose
        const cw = CW(size);
        for (let i = 0; i < 22; i++) {
          const r = rng(h * 31 + i + 1), ang = -Math.PI * (.08 + .84 * r()), v = 400 + 700 * r(), side = r() < .5 ? -1 : 1;
          const px = W / 2 + side * cw * (.35 + .2 * r()), py = FY - 20;
          txt(FLOOR[Math.floor(r() * FLOOR.length)], px + Math.cos(ang) * v * age, py + Math.sin(ang) * v * age + 1400 * age * age,
            { f: 'mono', w: 700, size: 44, col: BACKS[h] === PAL.bone ? PAL.lapis : PAL.bone, a: imp, rot: age * 10 * (r() - .5) });
        }
      }
    }
    if (dark) cursor(W / 2 - 25, 300, 100, PAL.clay, 1, true);
    camEnd();
    if (!dark) chrome(t, BACKS[Math.max(h, 0)] === PAL.bone ? PAL.lapis : PAL.bone);
    post({ bloom: .3, chroma: 1.2 * imp, vig: .35 });
  }

  chapter('verse3', 38.70, 46.38, [
    [38.70, philanthropic],
    [40.82, clussy],
    [41.68, cantStop],
    [42.46, orthotic],
    [44.90, stomp],
  ]);
})();
