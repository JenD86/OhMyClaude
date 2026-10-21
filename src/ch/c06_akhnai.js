// c06 · The Oven of Akhnai (53.64–68.16). The first drop. Shedim (demons on rooster feet) swarm a pink LOVIN,
// the lyric coils into a segmented spiral oven that heats to white, SCREAM stretches, CRY drips, and God smiles:
// נִצְּחוּנִי בָּנַי. Second pass: a Vilna Talmud page where the sages' columns block the voice from heaven and
// לֹא בַשָּׁמַיִם הִיא sets in the centre. Then the camera pulls back for the last Nitzchuni.
(() => {
  const SHEDIM = 'שֵׁדִים', NB1 = 'נִצְּחוּנִי', NB2 = 'בָּנַי', LO = 'לֹא', BASH = 'בַשָּׁמַיִם', HI = 'הִיא';
  const LET = ['ש', 'ד', 'י', 'ם'];
  const POOL = [
    'תנו רבנן חתכו חוליות ונתן חול בין חוליא לחוליא', 'רבי אליעזר מטהר וחכמים מטמאין', 'וזה הוא תנור של עכנאי',
    'מאי עכנאי שהקיפוהו דברים כעכנא זו וטמאוהו', 'אם הלכה כמותי חרוב זה יוכיח', 'נעקר חרוב ממקומו מאה אמה',
    'אין מביאין ראיה מן החרוב', 'אם הלכה כמותי אמת המים יוכיחו', 'חזרו אמת המים לאחוריהם', 'כותלי בית המדרש יוכיחו',
    'הטו כותלי בית המדרש ליפול', 'גער בהם רבי יהושע', 'לא נפלו מפני כבודו של רבי יהושע', 'ולא זקפו מפני כבודו של רבי אליעזר',
    'ועדיין מטין ועומדין', 'עמד רבי יהושע על רגליו ואמר לא בשמים היא', 'אחרי רבים להטות', 'ורואה כמין רגלי תרנגול',
    'אי בעי למחזינהו', 'נצחוני בני נצחוני בני', 'מאי לא בשמים היא',
  ];
  const HEAD = 'בבא מציעא', PEREK = 'פרק רביעי · הזהב', DAF = 'נט:', BOX = 'תנור';
  const VOICE = 'מה לכם אצל רבי אליעזר שהלכה כמותו בכל מקום';
  const OVEN_HEB = 'יאנכע לש רונת';                       // תנור של עכנאי, reversed: textPath lays glyphs one by one
  useText(SHEDIM, NB1, NB2, LO, BASH, HI, ...LET, ...POOL, HEAD, PEREK, DAF, BOX, VOICE, OVEN_HEB, 'ינב ינוחצנ');

  const S = 53.64, E = 68.16;
  const wt = (li, wi) => LY[li][3][wi].a;
  const DROP = beatT(116);                                   // 54.008: the drop
  const INK = '#24140C', PARCH = '#EFE4CC', PAGE = '#F6EDD8', EMBER = '#1C0B05', HOT = '#FFF6E4';
  const HEAT = [[0, '#4A1A0B'], [.25, PAL.clayDk], [.45, PAL.clay], [.65, PAL.amber], [.82, '#FFD58A'], [1, HOT]];
  function heatCol(k) {
    k = clamp(k);
    for (let i = 1; i < HEAT.length; i++) if (k <= HEAT[i][0]) return mixCol(HEAT[i - 1][1], HEAT[i][1], (k - HEAT[i - 1][0]) / (HEAT[i][0] - HEAT[i - 1][0]));
    return HOT;
  }
  // hop: eased beat-quantised motion. Darts in the first ~35% of each step, then holds.
  const hop = (t, t0, per = BEAT) => { if (t < t0) return 0; const h = (t - t0) / per; return Math.floor(h) + expo(frac(h) * 2.8); };

  // ---------- a shed: a Hebrew letter on rooster feet. (x, y) is where the feet touch the ground ----------
  function shed(x, y, s, ch, o = {}) {
    const ph = o.ph || 0, dir = o.dir || 1, a = o.a ?? 1;
    const bob = Math.abs(Math.sin(ph)) * s * .1 + (o.bob || 0);
    const by = y - s * .78 - bob;
    X.save(); X.globalAlpha *= a; X.strokeStyle = o.leg || PAL.clay; X.lineWidth = Math.max(1.3, s * .06); X.lineCap = 'round'; X.lineJoin = 'round';
    X.beginPath();
    for (const side of [0, 1]) {
      const q = ph + side * Math.PI, st = Math.sin(q) * s * .2, lift = Math.max(0, Math.cos(q)) * s * .1;
      const hx = x + (side ? .09 : -.09) * s, hy = by + s * .3;
      const fx = x + st * dir + (side ? .06 : -.06) * s, fy = y - lift;
      const kx = (hx + fx) / 2 - dir * s * .1, ky = (hy + fy) / 2;      // bird knees bend backwards
      X.moveTo(hx, hy); X.lineTo(kx, ky); X.lineTo(fx, fy);
      for (const ang of [-.55, -.12, .3]) { X.moveTo(fx, fy); X.lineTo(fx + dir * Math.cos(ang) * s * .2, fy + Math.sin(ang) * s * .1); }
      X.moveTo(fx, fy); X.lineTo(fx - dir * s * .1, fy + s * .01);         // the spur
    }
    X.stroke(); X.restore();
    txt(ch, x, by, { f: 'heb', w: 900, size: s, col: o.col || INK, a, dir: 'rtl' });
  }

  // ---------- layer effects ----------
  // Heat shimmer: re-blit the layer in thin rows, each shifted by a travelling sine.
  function shimmer(c, amp, t, step = 6) {
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
    for (let y = 0; y < H; y += step) {
      const dx = amp * (Math.sin(y * .034 + t * 17) * .7 + Math.sin(y * .011 - t * 6.3) * .3);
      X.drawImage(c, 0, y, W, step, dx, y, W, step);
    }
    X.restore();
  }
  // Drip: stretch vertical strips of a layer downward from y0, by a hashed length per strip (ink running).
  function drip(c, amt, seed, y0, y1, x0 = 0, x1 = W, sw = 5, a = 1, yMax = 1e9) {
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = a;
    for (let x = x0; x < x1; x += sw) {
      const h = hash(Math.floor(x / sw) * 3.17 + seed), L = Math.min(yMax - y1, amt * (.08 + Math.pow(h, 4) * 1.9));
      if (L < 2) continue;
      X.drawImage(c, x, y0, sw, y1 - y0, x, y0, sw, y1 - y0 + L);
    }
    X.restore();
  }

  // ---------- the oven: a segmented log-spiral of text, heating ----------
  const OVEN_STR = "HOTTER THAN AKHNAI'S OVEN ✶ " + OVEN_HEB + ' ✶ ';
  function spiral(cx, cy, o = {}) {
    const sc = o.sc || 1, k = .075, r0 = 30 * sc, rMax = (o.rMax || 1300) * sc, thMax = Math.log(rMax / r0) / k;
    const SEG = Math.PI / 3, nSeg = Math.ceil(thMax / SEG), rot = o.rot || 0, heat = o.heat ?? .5, reveal = o.reveal ?? 1;
    let acc = 0;
    for (let s = 0; s < nSeg; s++) {
      const u = s / nSeg, rmA = r0 * Math.exp(k * (s + .5) * SEG), nch = Math.round(rmA * SEG * 1.003 / (rmA * .26 * .78));
      const off = acc % OVEN_STR.length; acc += nch;                                   // 0 inner, 1 outer
      if (1 - u > reveal + .02) continue;                   // reveal from the outside in
      const th0 = s * SEG + .05, th1 = (s + 1) * SEG - .05, pts = [];
      for (let j = 0; j <= 10; j++) { const th = lerp(th0, th1, j / 10), r = r0 * Math.exp(k * th); pts.push([cx + Math.cos(th + rot) * r, cy + Math.sin(th + rot) * r]); }
      const rm = r0 * Math.exp(k * (th0 + th1) / 2), size = rm * .26;
      if (size < 5) continue;
      const hk = heat + (1 - u) * .35 - (s % 2) * .12 + (o.flick ? (hash(s * 7 + o.flick) - .5) * .12 : 0);
      const str = OVEN_STR.slice(off) + OVEN_STR.slice(0, off);
      textPath(str, pts, { f: 'disp', w: 900, size, col: heatCol(hk), repeat: 3, a: o.a ?? 1 });
    }
  }

  // ---------- swarm (shot 1) ----------
  const LOV = { f: 'disp', w: 900, size: 520 }, LOV_Y = 560;
  const SW = (() => {
    const r = rng(.6180339), out = [], N = 84;
    for (let i = 0; i < N; i++) {
      let x, y;
      do { x = 120 + r() * (W - 240); y = 140 + r() * (H - 260); } while ((Math.abs(x - W / 2) < 520 && Math.abs(y - 470) < 230) || (x < 1420 && y > 940));
      out.push({ ch: LET[i % 4], s: 44 + Math.pow(r(), 2) * 70, scat: [x, y], ang: r() * TAU, li: r(), ph0: r() * 6, d0: .6 + r() * .9 });
    }
    return out;
  })();
  let _lov = null;
  const lovPts = () => _lov || (_lov = glyphPts('LOVIN', LOV, 14).filter(p => p[1] < 40));   // standing points on the upper letters
  function swarm(t, col, leg, phase) {
    const L = lovPts();
    SW.forEach((p, i) => {
      let x, y, dir = 1, ph;
      const c0 = [W / 2 + Math.cos(p.ang) * 60, H / 2 + Math.sin(p.ang) * 40];
      const h1 = hop(t, DROP, BEAT / 2), k1 = clamp(h1 / 3);
      x = lerp(c0[0], p.scat[0], easeOut(k1)); y = lerp(c0[1], p.scat[1], easeOut(k1));
      dir = p.scat[0] > c0[0] ? 1 : -1; ph = h1 * Math.PI + p.ph0;
      if (k1 >= 1) { const w = Math.floor(h1) + i; x += Math.sin(w * 1.3) * 10; dir = Math.sin(w * 1.3) > Math.sin((w - 1) * 1.3) ? 1 : -1; }
      if (phase >= 1) {
        const tg = L[Math.floor(p.li * L.length)], tx = W / 2 + tg[0], ty = LOV_Y + tg[1];
        const h2 = hop(t, wt(18, 3) - .03, BEAT / 2), k2 = clamp(h2 / (2 + p.d0));
        dir = tx > p.scat[0] ? 1 : -1; ph = (h1 + h2) * Math.PI + p.ph0;
        x = lerp(x, tx, easeOut(k2)); y = lerp(y, ty, easeOut(k2));
        if (k2 >= 1) x += Math.sin((Math.floor(h2) + i) * 2.1) * 6;
      }
      shed(x, y, p.s * (phase >= 1 ? .72 : 1), p.ch, { col, leg, ph, dir });
    });
  }

  // =============== SHOT 1 · 53.64 Get some shedeyim lovin ===============
  function shDrop(t, lt) {
    if (t < DROP) {                                         // pre-drop: paper, one lone shed, GET / SOME
      bg(PAL.paper);
      const g = t < wt(18, 1) ? 'GET' : 'SOME', ta = t < wt(18, 1) ? wt(18, 0) : wt(18, 1), k = expo((t - ta) / .12);
      txt(g, W / 2, 470, { f: 'disp', w: 900, size: 230, col: PAL.clay, sx: lerp(1.3, 1, k), sy: lerp(1.3, 1, k), track: -6 });
      const hx = hop(t, S - .1, BEAT / 2);
      shed(lerp(W + 60, 1240, clamp(hx / 3)), 830, 90, 'ש', { ph: hx * Math.PI, dir: -1 });
      txt('get some', W / 2, 640, { f: 'mono', w: 500, size: 30, col: PAL.clayDk, track: 10, a: .8 });
      post({ bloom: .25, vig: .3 });
      return;
    }
    const dt = t - DROP, b = beatN(t) - 116, lov = t >= wt(18, 3) - .03;
    const [sx, sy] = shakeXY(t, 30 * Math.exp(-dt * 5) + 8 * pulse(t, 9));
    // field flips on every beat
    const FIELDS = lov ? [[PAL.paper, PAL.pink, INK, PAL.clay], [INK, PAL.pink, PAL.amber, PAL.clay], [PAL.amber, PAL.pink, INK, PAL.clayDk]]
      : [[PAL.amber, INK, INK, PAL.clayDk], [PAL.clayDk, PAL.paper, PAL.paper, PAL.amber]];
    const lb = lov ? Math.max(0, beatN(t + .07) - beatN(wt(18, 3) + .07)) : b;
    const [field, hero, sc, leg] = FIELDS[lb % FIELDS.length];
    bg(field);
    X.save(); X.translate(sx, sy);
    const z = 1 + .035 * pulse(t, 7);
    X.translate(W / 2, H / 2); X.scale(z, z); X.translate(-W / 2, -H / 2);
    if (!lov) {
      // backdrop: rows of tiny shedim letters scrolling, merch-style
      for (let r = 0; r < 9; r++) {
        const y = 60 + r * 120, off = frac(t * .7 * (r % 2 ? 1 : -1) + r * .37) * 300;
        for (let x = -300 + off; x < W + 300; x += 300) txt(SHEDIM, x, y, { f: 'heb', w: 900, size: 64, col: hero, a: .1, dir: 'rtl' });
      }
      if (t >= wt(18, 2) - .02) {
        const k = expo((t - wt(18, 2) + .02) / .14);
        txt(SHEDIM, W / 2, 450, { f: 'heb', w: 900, size: 400, col: hero, sx: lerp(1.6, 1, k), sy: lerp(1.6, 1, k), dir: 'rtl' });
        txt('SHEDEYIM', W / 2, 690, { f: 'mono', w: 700, size: 34, col: hero, track: 22, a: .85 });
      } else {
        glowDot(W / 2, H / 2, 900, PAL.bone, 1 - clamp(dt / .25));      // the drop flash
        for (let e = 0; e < 3; e++) {                                      // shockwave: the word bursting outward
          const ek = clamp(dt / .2 - e * .25);
          txt(SHEDIM, W / 2, 450, { f: 'heb', w: 900, size: 400, col: INK, dir: 'rtl', sx: .4 + ek * 1.4, sy: .4 + ek * 1.4, stroke: INK, sw: 6, fillOff: e > 0, a: (1 - ek) * (e ? .6 : 1) });
        }
      }
      swarm(t, sc, leg, 0);
    } else {
      const k = expo((t - wt(18, 3) + .03) / .14);
      txt('LOVIN', W / 2, LOV_Y, { ...LOV, col: hero, sx: lerp(1.5, 1, k), sy: lerp(1.5, 1, k) });
      txt('♥ ' + SHEDIM + ' ♥', W / 2, 180, { f: 'heb', w: 900, size: 70, col: sc, dir: 'rtl', a: .9 });
      swarm(t, sc, leg, 1);
    }
    X.restore();
    if (dt < .1) rect(0, 0, W, H, PAL.bone, 1 - dt / .1);
    post({ bloom: .45, vig: .35, chroma: .9 * Math.exp(-dt * 6) + .25 * pulse(t, 10), grain: .08 });
  }

  // =============== SHOT 2 · 55.46 Hotter than akhnai's oven ===============
  function shOven(t, lt, dur) {
    const k = lt / dur, heat = lerp(.15, .75, k) + (t > wt(19, 3) ? .25 * (1 - clamp((t - wt(19, 3)) / .5)) + .15 : 0);
    const L = withLayer(1, () => {
      bg(EMBER);
      glowDot(W / 2, H / 2, lerp(500, 1100, k), PAL.amber, lerp(.15, .5, k));
      const z = lerp(1.25, .95, ease(k)) * (1 + .05 * pulse(t, 7));
      const rot = -t * .9 + hop(t, S, BEAT) * .35;
      const rev = clamp(hop(t, wt(19, 0) - .04, BEAT / 2) / 7);
      camBegin(W / 2, H / 2, z, 0);
      spiral(W / 2, H / 2, { rot, heat, reveal: lerp(.2, 1, rev), flick: stepT(t, 12) });
      camEnd();
      // the hero word in the mouth of the oven
      let word = 'HOTTER', ta = wt(19, 0);
      if (t >= wt(19, 1)) { word = 'THAN'; ta = wt(19, 1); }
      if (t >= wt(19, 3)) { word = 'OVEN'; ta = wt(19, 3); }
      const o = { f: 'disp', w: 900, track: -4, col: heatCol(heat + .3), stroke: EMBER, sw: 18 };
      if (t >= wt(19, 2) && t < wt(19, 3)) {
        const p = .75 + (t - wt(19, 2)) / .4;
        sampled("AKHNAI'S", W / 2, H / 2, { ...o, size: 230, cands: ['ANAKIN', 'ACHING', 'ECHIDNA', 'AKHNAI'], bars: true, barCol: PAL.amber, seed: 6 }, p);
      } else {
        const size = word === 'OVEN' ? 470 : word === 'THAN' ? 300 : 330, kk = expo((t - ta) / .14);
        txt(word, W / 2, H / 2, { ...o, size, sx: lerp(1.4, 1, kk), sy: lerp(1.4, 1, kk) });
      }
      txt('תַּנּוּרוֹ שֶׁל עַכְנַאי · BAVA METZIA 59b', W - 110, 96, { f: 'mono', w: 500, size: 22, col: PAL.amber, al: 'right', a: .7 });
    });
    bg(EMBER);
    shimmer(L, lerp(3, 12, k), t);
    post({ bloom: lerp(.45, .8, k), vig: .55, chroma: t > wt(19, 3) && t < wt(19, 3) + .15 ? .9 : .15 * pulse(t, 8), grain: .09 });
  }
  useText('תַּנּוּרוֹ שֶׁל עַכְנַאי');

  // =============== SHOT 3 · 57.14 make you scream make you cry ===============
  function shScream(t, lt) {
    const tS = wt(20, 2), tC = wt(20, 5);
    if (t < tS) {                                            // make · you
      bg(PAL.clayDk);
      const w2 = t < wt(20, 1) ? 'MAKE' : 'MAKE YOU';
      txt(w2, W / 2, H / 2, { f: 'disp', w: 900, size: 200, col: PAL.amber, sx: 1 + .06 * pulse(t, 8) });
      post({ bloom: .35, vig: .4 });
      return;
    }
    if (t < wt(20, 3)) {                                     // SCREAM stretches tall in a fast zoom
      const k = (t - tS) / (wt(20, 3) - tS);
      bg(k > .5 ? '#3A0E06' : EMBER);
      const [sx, sy] = shakeXY(t, 14 + 20 * k);
      const st = lerp(1, 3.6, expo(k * 1.2)), z = lerp(1, 1.7, easeIn(k));
      for (let e = 4; e >= 1; e--) {                         // echo outlines, one per eighth
        const ek = frac((t - tS) * 2 / BEAT + e / 4);
        txt('SCREAM', W / 2, H / 2, { f: 'disp', w: 900, size: 300, sx: z * (1 + ek * .8) / Math.sqrt(st) * 1.3, sy: z * st * (1 + ek * .6), col: PAL.amber, stroke: PAL.amber, sw: 3, fillOff: true, a: (1 - ek) * .7 });
      }
      txt('SCREAM', W / 2 + sx, H / 2 + sy, { f: 'disp', w: 900, size: 300, sx: z / Math.sqrt(st) * 1.3, sy: z * st, col: HOT });
      post({ bloom: .6, vig: .5, chroma: .5 + k, grain: .1 });
      return;
    }
    if (t < tC) {                                            // make · you (again)
      bg(INK);
      txt(t < wt(20, 4) ? 'MAKE' : 'MAKE YOU', W / 2, H / 2, { f: 'disp', w: 900, size: 160, col: PAL.paper });
      post({ bloom: .3, vig: .4 });
      return;
    }
    // CRY: the letters run down the frame like tears
    const k = t - tC, o = { f: 'disp', w: 900, size: 520, col: INK, track: 10 };
    bg(PAL.paper);
    const C = withLayer(1, () => { txt('CRY', W / 2, 420, { ...o, sx: 1 + .03 * pulse(t, 8) }); });
    drip(C, lerp(0, 520, easeOut(k / .7)), 3, 420, 640, 400, 1520, 5, 1, 960);
    blit(C);
    for (let i = 0; i < 9; i++) {                            // falling tear drops
      const x = 600 + hash(i * 3.3) * 760, d = frac(k * 1.1 + hash(i)) * 400;
      glowDot(x, 640 + d, 16, PAL.clayDk, .6 * (1 - d / 400));
    }
    post({ bloom: .25, vig: .35, glossBg: INK });
  }

  // =============== SHOT 4 · 59.24 Nitzchuni banai (first pass: calm) ===============
  const NBO = { f: 'heb', w: 900, dir: 'rtl' };
  function smile(t, cx, cy, size, t1, t2, o = {}) {
    // Dignified: no glitch, no shake. Each word fades up warm on its sung time.
    const k1 = ease((t - t1 + .1) / .7), k2 = ease((t - t2 + .1) / .7), col = o.col || '#4A2412';
    const w1 = measure(NB1, { ...NBO, size }), w2 = measure(NB2, { ...NBO, size }), gap = size * .3, tw = w1 + w2 + gap;
    glowDot(cx, cy, size * 3.2, PAL.amber, .22 * Math.max(k1, k2) * (o.ga ?? 1));
    txt(NB1, cx + tw / 2 - w1 / 2, cy + (1 - k1) * 18, { ...NBO, size, col, a: k1 * (o.a ?? 1) });
    txt(NB2, cx - tw / 2 + w2 / 2, cy + (1 - k2) * 18, { ...NBO, size, col, a: k2 * (o.a ?? 1) });
  }
  function rings(t, cx, cy, a) {
    // faint concentric rings of tiny text breathing outward on the beat
    for (let r = 0; r < 6; r++) {
      const R = 300 + r * 120 + 14 * pulse(t, 4) * (r + 1) / 3, n = Math.round(TAU * R / 18), pts = [];
      for (let j = 0; j <= n; j++) { const th = j / n * TAU + t * .05 * (r % 2 ? 1 : -1); pts.push([cx + Math.cos(th) * R, cy + Math.sin(th) * R * .62]); }
      textPath('ינב ינוחצנ · ', pts, { f: 'heb', w: 500, size: 18, col: PAL.clayDk, a: a * (.42 - r * .05), repeat: 200 });
    }
  }
  function audience(t, x0, y, n, a = 1) {
    for (let i = 0; i < n; i++) {
      const bob = Math.max(0, Math.sin((bpOf(t) + i * .13) * Math.PI)) * 5;
      shed(x0 + i * 62, y, 56, LET[i % 4], { ph: 0, dir: -1, bob, a, leg: PAL.clay });
    }
  }
  function shNitz(t, lt) {
    bg(PARCH);
    X.fillStyle = rgrad(W / 2, H / 2 - 20, 900, [[0, rgba('#FFE2A8', .7)], [1, rgba(PARCH, 0)]]); X.fillRect(0, 0, W, H);
    const z = 1 + lt * .02;
    camBegin(W / 2, H / 2, z);
    rings(t, W / 2, 470, 1);
    smile(t, W / 2, 450, 290, wt(21, 0), wt(21, 1));
    txt('nitzchuni banai', W / 2, 650, { f: 'mono', w: 500, size: 28, col: PAL.clayDk, track: 12, a: ease((t - wt(21, 1)) / .6) * .85 });
    camEnd();
    audience(t, 1440, 1010, 7);
    post({ bloom: .3, vig: .3, grain: .06, chroma: 0 });
  }

  // =============== SHOT 5 · 61.02 the Talmud page (Vilna layout) ===============
  const PG = { x0: 330, x1: 1590, y0: 46, y1: 968 };
  const COLS = {                                             // world rects
    gem: { x: 790, y: 150, w: 340, h: 760, size: 23, lh: 33, w8: 500, col: INK },
    rashi: { x: 1150, y: 150, w: 300, h: 760, size: 15, lh: 21, w8: 400, col: '#5A3420' },
    tos: { x: 470, y: 150, w: 300, h: 760, size: 15, lh: 21, w8: 400, col: '#5A3420' },
    mL: { x: 345, y: 150, w: 105, h: 300, size: 10, lh: 15, w8: 400, col: '#7A5236' },
    mR: { x: 1468, y: 520, w: 108, h: 380, size: 10, lh: 15, w8: 400, col: '#7A5236' },
  };
  const _cols = {};
  function colCanvas(key) {
    if (_cols[key]) return _cols[key];
    const C = COLS[key], c = mkCanvas(C.w, C.h), g = c.getContext('2d'), r = rng(hashS(key));
    g.font = fontStr({ f: 'heb', w: C.w8, size: C.size }); g.textAlign = 'right'; g.textBaseline = 'middle'; g.direction = 'rtl'; g.fillStyle = C.col;
    const rows = Math.floor(C.h / C.lh);
    for (let i = 0; i < rows; i++) {
      let s = ''; while (s.length < C.w / C.size * 2.4) s += POOL[Math.floor(r() * POOL.length)] + ' ';
      if (key === 'gem' && i < 4) continue;                    // room for the opening-word box
      if ((key === 'gem' && (i === 13)) || (key !== 'gem' && r() < .05)) s = s.slice(0, Math.floor(s.length * .4));   // paragraph ends
      g.fillText(s, C.w, C.lh * (i + .5));
    }
    return (_cols[key] = c);
  }
  const VOICE_Y = 252;                                       // where the voice from heaven is stopped
  // The page in world coordinates. o: { t, build (time the columns arrive), heat, block (0..1), voice, center (0..1), dim }
  function page(t, o) {
    const sh = (ta, dx, dy) => { const k = expo((t - ta) / .22); return [lerp(dx, 0, k), lerp(dy, 0, k), clamp((t - ta) / .05)]; };
    // paper and frame
    X.save(); X.fillStyle = 'rgba(60,30,10,.18)'; X.fillRect(PG.x0 + 14, PG.y0 + 18, PG.x1 - PG.x0, PG.y1 - PG.y0); X.restore();
    rect(PG.x0, PG.y0, PG.x1 - PG.x0, PG.y1 - PG.y0, PAGE);
    const T0 = o.build;
    // header
    if (t >= T0) {
      txt(HEAD, W / 2, 92, { f: 'heb', w: 900, size: 40, col: INK, dir: 'rtl' });
      txt(DAF, PG.x1 - 70, 92, { f: 'heb', w: 900, size: 40, col: INK, dir: 'rtl' });
      txt(PEREK, PG.x0 + 110, 92, { f: 'heb', w: 500, size: 20, col: INK, dir: 'rtl' });
      rect(PG.x0 + 30, 122, PG.x1 - PG.x0 - 60, 3, INK); rect(PG.x0 + 30, 129, PG.x1 - PG.x0 - 60, 1, INK);
    }
    const put = (key, ta, dx, dy, a = 1) => {
      if (t < ta) return; const C = COLS[key], [ox, oy, k] = sh(ta, dx, dy);
      X.save(); X.globalAlpha *= k * a; X.drawImage(colCanvas(key), C.x + ox, C.y + oy); X.restore();
    };
    // gemara centre column, with the body fading when לא בשמים היא takes over
    if (t >= T0 + BEAT * .25) {
      const C = COLS.gem, [ox, oy, k] = sh(T0 + BEAT * .25, 0, 900), c = colCanvas('gem');
      X.save(); X.globalAlpha *= k;
      const cut = 300;                                         // rows above this stay; below fades under the centre text
      X.drawImage(c, 0, 0, C.w, cut, C.x + ox, C.y + oy, C.w, cut);
      X.globalAlpha *= lerp(1, .1, o.center || 0);
      X.drawImage(c, 0, cut, C.w, C.h - cut, C.x + ox, C.y + oy + cut, C.w, C.h - cut);
      X.restore();
      // the opening word, boxed, Vilna style
      const bx = C.x + C.w / 2 + ox, byy = C.y + 62 + oy, ba = k * (1 - (o.block || 0));
      X.save(); X.globalAlpha *= ba; X.strokeStyle = INK; X.lineWidth = 3; X.strokeRect(bx - 110, byy - 52, 220, 104); X.lineWidth = 1; X.strokeRect(bx - 102, byy - 44, 204, 88); X.restore();
      txt(BOX, bx, byy + 4, { f: 'heb', w: 900, size: 76, col: INK, dir: 'rtl', a: ba });
    }
    put('rashi', T0 + BEAT * 1.6, 700, 0);
    put('tos', T0 + BEAT * 2.6, -700, 0);
    put('mL', T0 + BEAT * 3.6, -300, 0, .9);
    put('mR', T0 + BEAT * 3.6, 300, 0, .9);
    // column rules
    if (t >= T0 + BEAT * 2.6) for (const x of [780, 1140]) rect(x, 150, 1, 760, INK, .35);
    // the oven, glowing in the gutter under the outer margin
    if (t >= T0 + BEAT * 3.6) {
      const ox = 398, oy = 800, hk = o.heat ?? .4;
      glowDot(ox, oy, 150, PAL.amber, .35 + .3 * hk + .15 * pulse(t, 5));
      spiral(ox, oy, { sc: .13, rMax: 680, rot: -t * 2, heat: .35 + hk * .6, flick: stepT(t, 12) });
      txt('תנור', ox, oy + 118, { f: 'heb', w: 700, size: 14, col: PAL.clayDk, dir: 'rtl' });
    }
    // the vote tally in the margin: R. Eliezer 1, the sages one more group of five per beat
    if (t >= T0 + BEAT * 3.6) {
      const n = clamp(Math.floor((t - T0) / BEAT) - 2, 0, 14), tx = 352, ty = 500;
      txt('SAGES', tx, ty - 26, { f: 'mono', w: 700, size: 11, col: INK, al: 'left', track: 2 });
      X.save(); X.strokeStyle = INK; X.lineWidth = 1.6; X.beginPath();
      for (let g = 0; g < n; g++) {
        const gx = tx + (g % 3) * 34, gy = ty + Math.floor(g / 3) * 34;
        for (let j = 0; j < 4; j++) { X.moveTo(gx + j * 6, gy); X.lineTo(gx + j * 6, gy + 22); }
        X.moveTo(gx - 3, gy + 18); X.lineTo(gx + 22, gy + 4);
      }
      X.stroke(); X.restore();
      txt(String(n * 5), tx + 50, ty + 184, { f: 'mono', w: 700, size: 22, col: PAL.clayDk });
      txt('R. ELIEZER', 1475, 150 + 14, { f: 'mono', w: 700, size: 11, col: INK, al: 'left', track: 2 });
      txt('1', 1520, 210, { f: 'mono', w: 700, size: 40, col: PAL.clayDk });
    }
    // heaven's light: the page goes dark while the voice descends, and relights when the sages block it
    if (o.dark > .01) rect(PG.x0, PG.y0, PG.x1 - PG.x0, PG.y1 - PG.y0, '#1A0A04', .78 * o.dark);
    // the voice from heaven: warm light, descending, stopped by the sages' columns
    if (o.voice != null) {
      const vk = o.voice, vy = lerp(10, VOICE_Y - 40, easeIn(clamp(vk))), hit = vk >= 1;
      const va = hit ? lerp(1, .35, clamp((t - o.voiceHit) / 1.2)) : 1;
      const [jx, jy] = hit ? shakeXY(t, 6 * Math.exp(-(t - o.voiceHit) * 6)) : [0, 0];
      const sa = va * (hit ? (o.dark || 0) : 1);
      X.save(); X.fillStyle = vgrad([[0, rgba('#FFF2D0', 0)], [1, rgba('#FFE7B8', .6 * sa)]], 0, vy - 900, vy + 10); X.fillRect(620, vy - 900, 680, 910); X.restore();
      glowDot(960, vy, 420, PAL.amber, .5 * sa);
      const vs = fitSize(VOICE, { f: 'heb', w: 700, size: 60 }, 660), vc = mixCol('#B85A00', HOT, o.dark || 0);
      txt(VOICE, 960 + jx, vy + jy, { f: 'heb', w: 700, size: vs, col: vc, dir: 'rtl', a: va });
      txt('A VOICE FROM HEAVEN: “THE LAW IS AS ELIEZER SAYS”', 960, vy + vs * .9, { f: 'mono', w: 700, size: 13, track: 3, col: vc, a: va * .9 });
    }
    // the sages' columns slide in and close over the centre
    if (o.block) {
      const k = o.block, c1 = colCanvas('tos'), c2 = colCanvas('rashi'), y = VOICE_Y + 18, h = 104, bw = 330;
      const lx = lerp(PG.x0 - bw - 40, 960 - bw, k), rx = lerp(PG.x1 + 40, 960, k);
      X.save();
      for (const [x0, c, sx0] of [[lx, c1, 0], [rx, c2, 0]]) {
        rect(x0 + 8, y + 10, bw, h, '#000', .25); rect(x0, y, bw, h, PAGE);
        X.drawImage(c, sx0, 220, Math.min(bw, c.width), h - 16, x0 + 6, y + 8, bw - 12, h - 16);
        X.strokeStyle = INK; X.lineWidth = 4; X.strokeRect(x0 + 2, y + 2, bw - 4, h - 4);
      }
      txt('THE SAGES', lx + bw / 2, y + h + 14, { f: 'mono', w: 700, size: 12, track: 4, col: INK, a: k });
      txt('THE SAGES', rx + bw / 2, y + h + 14, { f: 'mono', w: 700, size: 12, track: 4, col: INK, a: k });
      X.restore();
    }
    // לֹא בַשָּׁמַיִם הִיא sets in the centre, one word at a time
    if (o.center) {
      const ws = [[LO, wt(23, 2)], [BASH, wt(23, 2) + BEAT], [HI, wt(23, 3)]];
      ws.forEach(([s, ta], i) => {
        if (t < ta - .02) return;
        const k = expo((t - ta + .02) / .14), sz = Math.min(150, fitSize(s, { ...NBO, size: 150 }, 320));
        txt(s, 960, 540 + i * 140, { ...NBO, size: sz, col: INK, sx: lerp(1.5, 1, k), sy: lerp(1.5, 1, k) });
      });
    }
    // shedim run laps around the page margin, hopping on the beat
    if (o.shedim) {
      const per = 2 * ((PG.x1 - PG.x0) + (PG.y1 - PG.y0));
      for (let i = 0; i < 14; i++) {
        const d = frac(i / 14 + hop(t, 0, BEAT / 2) * .006 * (i % 3 ? 1 : 1.4)) * per;
        let x, y, dir = 1, wx = PG.x1 - PG.x0, hy = PG.y1 - PG.y0;
        if (d < wx) { x = PG.x0 + d; y = PG.y0 + 4; }
        else if (d < wx + hy) { x = PG.x1 - 6; y = PG.y0 + d - wx; }
        else if (d < 2 * wx + hy) { x = PG.x1 - (d - wx - hy); y = PG.y1 - 4; dir = -1; }
        else { x = PG.x0 + 6; y = PG.y1 - (d - 2 * wx - hy); dir = -1; }
        shed(x, y, 30, LET[i % 4], { ph: hop(t, 0, BEAT / 2) * Math.PI + i, dir, col: INK, leg: PAL.clay, a: o.shedim });
      }
    }
  }
  function footer() {                                         // keep the gloss band clean: a dark letterbox
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
    X.fillStyle = vgrad([[0, rgba('#21100A', 0)], [.35, '#21100A'], [1, '#21100A']], 0, 940, H); X.fillRect(0, 940, W, H - 940);
    X.restore();
  }
  // camera framings for the page, cut on the beat: [t, cx, cy, zoom]
  const T22 = wt(22, 0), T23 = wt(23, 0), T24 = wt(24, 0), T25 = wt(25, 0);
  const CAM = [
    [T22, 960, 520, 1.0], [beatT(132), 960, 400, 1.18], [beatT(134), 960, 520, 1.0],
    [T23, 960, 380, 1.32],
    [T24, 960, 510, 1.0], [wt(24, 2) - .02, 960, 610, 1.75], [beatT(141), 520, 760, 2.4], [beatT(142), 420, 560, 2.0],
    [wt(24, 5) - .02, 960, 520, 1.12], [beatT(143), 960, 560, 1.3],
  ];
  function backdrop(t, heat) {
    bg('#21100A');
    glowDot(W / 2, H / 2, 1300, PAL.amber, .28 + .25 * heat + .08 * pulse(t, 5));
  }
  function shPage(t, lt) {
    backdrop(t, .3);
    let c = CAM[0]; for (const k of CAM) if (t >= k[0]) c = k;
    const punch = 1 + .03 * pulse(t, 8), scream = t >= wt(24, 2) - .02 && t < beatT(141);
    const [jx, jy] = scream ? shakeXY(t, 14) : [0, 0];
    const heat = t >= wt(24, 2) - .02 ? clamp(1 - (t - wt(24, 2)) / 1.4) * .9 + .1 : .25;
    const tVH = wt(23, 0) - .02, voice = t >= tVH ? clamp((t - tVH) / (beatT(136) - tVH)) : null;   // hits on the downbeat of bar 34
    const block = t >= tVH ? expo((t - tVH) / (beatT(136) - tVH + .02)) : 0;
    const L = withLayer(2, () => {
      camBegin(c[1] + jx, c[2] + jy, c[3] * punch);
      const dark = t >= tVH ? ease((t - tVH) / .15) * (1 - ease((t - beatT(136)) / .35)) : 0;
      page(t, { build: T22, heat, voice, dark, voiceHit: beatT(136), block, center: t >= wt(23, 2) - .02 ? 1 : 0, shedim: t >= wt(22, 2) - .05 ? 1 : 0 });
      // LOVIN: a pink sticker slapped on the page for one beat
      if (t >= wt(22, 3) - .02 && t < T23) {
        const k = expo((t - wt(22, 3) + .02) / .12);
        txt('LOVIN', 1190, 640, { f: 'disp', w: 900, size: 200, col: PAL.pink, rot: -.16, sx: lerp(1.6, 1, k), sy: lerp(1.6, 1, k), stroke: PAGE, sw: 14 });
      }
      if (t >= wt(22, 2) - .02 && t < wt(22, 3) - .02) {
        const k = expo((t - wt(22, 2)) / .12);
        txt(SHEDIM, 960, 520, { ...NBO, size: 190, col: PAL.pink, sx: lerp(1.5, 1, k), sy: lerp(1.5, 1, k), stroke: PAGE, sw: 10 });
      }
      // SCREAM in a marginal hand, red-hot
      if (t >= wt(24, 2) - .02) {
        const k = expo((t - wt(24, 2)) / .12);
        txt('SCREAM', 960, 640, { f: 'disp', w: 900, size: 150, col: HOT, stroke: '#6A1A06', sw: 14, rot: -.08, sx: lerp(1.6, 1, k), sy: lerp(1.6, 1, k) * 1.25, a: clamp(1 - (t - beatT(141)) / .2) });
      }
      if (t >= wt(24, 5) - .02) {
        const k = expo((t - wt(24, 5)) / .12);
        txt('CRY', 960, 640, { f: 'disp', w: 900, size: 230, col: INK, rot: .04, sx: lerp(1.5, 1, k), sy: lerp(1.5, 1, k) });
      }
      camEnd();
      // heat tint: the ink glows
      if (heat > .3) { X.save(); X.globalCompositeOperation = 'source-atop'; X.fillStyle = rgba(PAL.amber, (heat - .3) * .45); X.fillRect(0, 0, W, H); X.restore(); }
    });
    if (heat > .3) { backdrop(t, heat); shimmer(L, 8 * heat, t); } else blit(L);
    if (t >= wt(24, 5) - .02) drip(L, lerp(0, 260, easeOut((t - wt(24, 5)) / .6)), 9, 200, 760, 0, W, 4, .55);
    footer();
    post({ bloom: .3 + heat * .3, vig: .45, grain: .07, chroma: scream ? .45 : (t >= beatT(136) && t < beatT(136) + .12 ? .6 : 0), glossBg: INK });
  }

  // =============== SHOT 6 · 66.64 pull back: Nitzchuni banai ===============
  function shPull(t, lt) {
    backdrop(t, .2);
    const z = kf(t, [[T25, 1.12], [beatT(144) + .2, .78], [beatT(145), .78], [beatT(145) + .2, .56], [beatT(146), .56], [beatT(146) + .25, .4]], expo);
    const pp = clamp((1.12 - z) / .72), dy = 200 * pp;
    camBegin(960, 508 - dy / z, z);
    for (const [ax, ay] of [[-1500, 0], [1500, 0], [-3000, 0], [3000, 0], [-1500, 1150], [0, 1150], [1500, 1150]]) {   // the rest of the library
      X.save(); X.globalAlpha = .5; rect(PG.x0 + ax, PG.y0 + ay, PG.x1 - PG.x0, PG.y1 - PG.y0, PAGE);
      for (const key of ['gem', 'rashi', 'tos']) { const C = COLS[key]; X.drawImage(colCanvas(key), C.x + ax, C.y + ay); }
      X.restore();
    }
    X.save(); X.globalAlpha = lerp(1, .55, seg(t, T25, T25 + .6));
    page(t, { build: -10, heat: .25, voice: 1, voiceHit: wt(23, 0) - 10, block: 1, center: 1, shedim: 1 });
    X.restore();
    camEnd();
    // veil, then the smile over the page
    const wy = lerp(460, 300, pp), va = 1 - .55 * pp;
    X.fillStyle = rgrad(W / 2, wy, 950, [[0, rgba('#F6E8C8', .9 * va)], [.45, rgba('#F6E8C8', .66 * va)], [1, rgba('#F6E8C8', 0)]]); X.fillRect(0, 0, W, H);
    smile(t, W / 2, wy, 260, wt(25, 0), wt(25, 1));
    txt('nitzchuni banai', W / 2, wy + 190, { f: 'mono', w: 500, size: 28, col: PAL.clayDk, track: 12, a: ease((t - wt(25, 1)) / .6) * .85 });
    post({ bloom: .3, vig: .45, grain: .06, chroma: 0 });
  }

  chapter('akhnai', S, E, [[S, shDrop], [wt(19, 0), shOven], [wt(20, 0), shScream], [wt(21, 0), shNitz], [wt(22, 0), shPage], [wt(25, 0), shPull]]);
})();
