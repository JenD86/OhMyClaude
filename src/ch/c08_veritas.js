// c08_veritas: Veritas (75.92–82.36) · Vatican white, gold, blood, ink. See STORYBOARD.md.
//   A  75.92 POPE SAYS          inscription capitals, white → blood on "says"
//   B  76.54 A.C.C.E.L.E.R.A.T.E. one slam per sung letter, field flips white ↔ blood; fumata bianca on the last E
//   C  79.08 ECCE ANCILLA DOMINI  van Eyck: gold Fraktur, upside down, rising along a shaft of light. Holy freeze.
//   D  81.00 QUID EST VERITAS     Pilate in Roman caps → anagram → EST VIR QUI ADEST
(() => {
  const WHITE = '#F7F3EA', INK = '#120E0C', BLOOD = PAL.blood, GOLD = PAL.gold;
  const ROM = { f: 'bod', w: 900 };
  const MONO = { f: 'mono', w: 500 };
  const L30 = LY[30][3], L32 = LY[32][3];
  const LT = L30.slice(2).map(w => w.a);              // the ten sung letter times
  const LETTERS = 'ACCELERATE';

  // Lay out a string glyph by glyph (own tracking, so draws and flights share exact positions).
  const _lay = new Map();
  function lay(s, o, track, cx) {
    const key = s + '|' + fontStr(o) + '|' + track + '|' + cx; if (_lay.has(key)) return _lay.get(key);
    const ws = [...s].map(ch => measure(ch, o));
    const total = ws.reduce((a, b) => a + b, 0) + track * (s.length - 1);
    let x = cx - total / 2; const out = [];
    [...s].forEach((ch, i) => { out.push({ ch, x: x + ws[i] / 2, w: ws[i] }); x += ws[i] + track; });
    out.total = total; _lay.set(key, out); return out;
  }
  const roman = n => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n];

  // Thin inscription rules (double line), the panel of a Roman monument.
  function rules(y, col, a = 1, x0 = 96, x1 = W - 96) {
    rect(x0, y, x1 - x0, 6, col, a); rect(x0, y + 14, x1 - x0, 2, col, a);
  }

  // ───────────────────────── A: POPE SAYS (75.92–76.54)
  function pope(t, lt) {
    const tS = L30[1].a, says = t >= tS;
    const field = says ? BLOOD : WHITE, ink = says ? WHITE : BLOOD, faint = says ? '#B00D28' : '#ECE5D8';
    bg(field);
    // texture: VRBI ET ORBI merch rows, faint
    tile('VRBI ET ORBI', { ...ROM, size: 92, col: faint, track: 18, speed: 160, sep: '  ✳  ' }, t);
    const z = 1 + .05 * Math.exp(-(t - (says ? tS : 75.92)) * 14);
    camBegin(W / 2, H / 2, z, 0);
    const o = { ...ROM, size: 330 };
    const pk = backOut(seg(t, 75.92, 76.02));
    if (!says) {
      txt('POPE', W / 2, H / 2 - 10, { ...o, size: 420, track: 60, col: ink, sx: lerp(1.25, 1, pk), sy: lerp(1.25, 1, pk) });
    } else {
      const sk = backOut(seg(t, tS, tS + .1));
      txt('POPE', W / 2, 330, { ...o, track: 70, col: ink });
      txt('SAYS', W / 2, 690, { ...o, track: 70, col: ink, sx: lerp(1.35, 1, sk), sy: lerp(1.35, 1, sk) });
      rules(498, ink, .9, 360, W - 360);
    }
    camEnd();
    txt('PONTIFEX MAXIMVS', 96, 96, { ...MONO, size: 22, col: ink, al: 'left', track: 8, a: .8 });
    txt('EX CATHEDRA', W - 96, 96, { ...MONO, size: 22, col: ink, al: 'right', track: 8, a: .8 });
    post({ bloom: .25, grain: .06, vig: .3, chroma: .5 * Math.exp(-(t - (says ? tS : 75.92)) * 12) });
  }

  // ───────────────────────── B: A.C.C.E.L.E.R.A.T.E. (76.54–79.08), fumata on the last E
  const ROWO = { ...ROM, size: 170 };
  const ROWTR = -6;
  const ROWSTR = 'A.C.C.E.L.E.R.A.T.E.';
  const ROWY = 590;
  function smoke(t, rowL) {
    const t0 = LT[9]; if (t < t0) return;
    const eX = rowL[18].x;                                    // the last E is the chimney
    // volume: soft white puffs
    for (let i = 0; i < 60; i++) {
      const e = t0 + hash(i * 3.1) * .28, a = t - e; if (a < 0) continue;
      const fromE = hash(i * 5.7) < .55, x0 = fromE ? eX : lerp(rowL[0].x, eX, hash(i * 9.3));
      const rise = 1300 * (1 - Math.exp(-a * 2.6)) * lerp(.55, 1.1, hash(i * 1.3));
      const x = x0 + (hash(i * 7.7) - .5) * 900 * a + wob(a, .9, hash(i)) * 40;
      const r = lerp(90, 380, clamp(a / .45)) * lerp(.7, 1.3, hash(i * 2.9));
      glowDot(x, ROWY - 60 - rise, r, '#FFFFFF', .55 * clamp(a / .08));
    }
    // texture: tiny "accelerate"s
    X.save(); X.fillStyle = '#FFFFFF'; X.textAlign = 'center'; X.textBaseline = 'middle';
    for (let i = 0; i < 520; i++) {
      const e = t0 + hash(i * 1.37 + 4) * .36, a = t - e; if (a < 0) continue;
      const fromE = hash(i * 2.71) < .6, x0 = fromE ? eX + (hash(i * 8.1) - .5) * 80 : lerp(rowL[0].x, eX, hash(i * 6.3));
      const rise = 1400 * (1 - Math.exp(-a * 2.4)) * lerp(.35, 1.15, hash(i * 4.4));
      const x = x0 + (hash(i * 3.9) - .5) * 1100 * a * lerp(.4, 1, rise / 1400) + wob(a, 1.3, hash(i * 7)) * 30;
      const y = ROWY - 70 - rise;
      if (y < -40) continue;
      const sz = Math.round(lerp(11, 34, clamp(a / .4)) * lerp(.6, 1.3, hash(i * 5.5)));
      X.globalAlpha = clamp(a / .06) * lerp(.55, 1, hash(i * 9.9));
      X.font = fontStr({ f: 'bod', w: 700, it: true, size: sz });
      X.fillText('accelerate', x, y);
    }
    X.restore();
  }
  function accel(t, lt) {
    let n = -1; for (let i = 0; i < 10; i++) if (t >= LT[i]) n = i;
    const tn = LT[n], on = t - tn, blood = n % 2 === 1;
    const last = n === 9;
    const field = blood ? BLOOD : WHITE, ink = blood ? WHITE : BLOOD;
    bg(field);
    // the new letter, giant, behind everything
    const gk = easeOut(on / .12);
    txt(LETTERS[n], W / 2, H / 2 + 60, { ...ROM, size: 1500 * lerp(1.18, 1, gk), col: blood ? '#A80A24' : '#E6DCCB' });
    const z = 1 + .06 * Math.exp(-on * 12);
    camBegin(W / 2, H / 2, z, 0);
    rules(ROWY - 190, ink, .85); rules(ROWY + 150, ink, .85);
    txt('POPE  SAYS', W / 2, ROWY - 255, { ...ROM, size: 54, col: ink, track: 30 });
    const rowL = lay(ROWSTR, ROWO, ROWTR, W / 2);
    const rowCol = last ? INK : ink;
    if (last) smoke(t, rowL);
    for (let i = 0; i <= n; i++) {
      const L = rowL[i * 2], D = rowL[i * 2 + 1], age = t - LT[i];
      const k = i === n ? backOut(seg(age, 0, .11)) : 1, s = lerp(1.9, 1, k);
      txt(L.ch, L.x, ROWY, { ...ROWO, col: rowCol, sx: s, sy: s });
      if (age > .05) txt('.', D.x, ROWY, { ...ROWO, col: last ? GOLD : rowCol });
      // the token strip: every letter is a sampled token, with its probability
      const ck = easeOut(seg(age, 0, .08));
      rect(L.x - 34, ROWY + 196, 68, 40, rowCol, (i === n && !last ? .9 : .14) * ck);
      txt(L.ch + '.', L.x, ROWY + 216, { ...MONO, size: 22, col: i === n && !last ? field : rowCol, a: ck });
      txt('p ' + (.9 + hash(i * 3.3) * .09).toFixed(2).slice(1), L.x, ROWY + 262, { ...MONO, size: 16, col: rowCol, a: .6 * ck });
      if (i === n) rect(L.x - L.w / 2, ROWY + 104, L.w, 8, GOLD, 1);
    }
    camEnd();
    txt(roman(n), W - 96, 96, { ...ROM, size: 64, col: ink, al: 'right' });
    txt('LITTERA', W - 96, 150, { ...MONO, size: 18, col: ink, al: 'right', track: 6, a: .7 });
    txt('PONTIFEX MAXIMVS · EX CATHEDRA', 96, 96, { ...MONO, size: 22, col: ink, al: 'left', track: 8, a: .8 });
    if (last) txt('FVMATA BIANCA', 96, 140, { ...MONO, size: 22, col: ink, al: 'left', track: 8, a: .8 * clamp((t - tn) / .1) });
    post({ bloom: last ? .45 : .25, grain: .06, vig: .3, chroma: .8 * Math.exp(-on * 16) });
  }

  // ───────────────────────── C: ECCE ANCILLA DOMINI (79.08–81.00) · holy freeze
  const ECCE = 'Ecce ancilla Domini';
  function ecce(t, lt, dur) {
    bg('#0B0807');
    // the shaft of light: bottom of the frame to the top
    const cx = W / 2;
    X.save();
    const hg = X.createLinearGradient(cx - 700, 0, cx + 700, 0);
    hg.addColorStop(0, rgba(GOLD, 0)); hg.addColorStop(.3, rgba(GOLD, .05)); hg.addColorStop(.42, rgba(GOLD, .18));
    hg.addColorStop(.5, rgba('#FFF2C8', .32)); hg.addColorStop(.58, rgba(GOLD, .18)); hg.addColorStop(.7, rgba(GOLD, .05)); hg.addColorStop(1, rgba(GOLD, 0));
    X.fillStyle = hg; X.fillRect(cx - 700, 0, 1400, H);
    X.fillStyle = vgrad([[0, rgba('#0B0807', .35)], [.6, rgba('#0B0807', 0)], [1, rgba(GOLD, .12)]]); X.fillRect(cx - 700, 0, 1400, H);
    X.restore();
    // the phrase, whole, upside down (as van Eyck painted it, for heaven to read). Gold, glow, still.
    const a = ease(seg(t, 79.08, 79.5));
    const y = lerp(720, 430, seg(t, 79.08, 81.0));
    const br = .5 + .5 * Math.sin((t - 79.08) * TAU / 1.8);
    glowDot(cx, y, 760, PAL.amber, (.16 + .08 * br) * a);
    glowDot(cx, y, 380, GOLD, (.18 + .08 * br) * a);
    // van Eyck's architecture: thin gold colonnettes and a lintel, static, far from the phrase
    for (const x of [200, 236, W - 236, W - 200]) rect(x, 0, 3, H, GOLD, .16);
    rect(200, 150, 39, 3, GOLD, .16); rect(W - 239, 150, 39, 3, GOLD, .16);
    const size = 150;
    txt(ECCE, cx, y, { f: 'frak', w: 400, size, col: GOLD, rot: Math.PI, glow: 10 + 6 * br, glowCol: PAL.amber, a });
    txt('legible from heaven  ↑', W - 96, 96, { ...MONO, size: 20, col: GOLD, al: 'right', a: .45 * a });
    post({ bloom: .5, chroma: 0, grain: .05, vig: .55 });
  }

  // ───────────────────────── D: QUID EST VERITAS → EST VIR QUI ADEST (81.00–82.36)
  const QO = { ...ROM, size: 150 };
  const QA = 'QUID EST VERITAS', QB = 'EST VIR QUI ADEST', QTR = 8, QY = 520;
  const F0 = 81.80, F1 = 82.14;                          // the anagram flight
  function quid(t, lt) {
    const tQ = L32[0].a, tE = L32[1].a, tV = L32[2].a;
    const stage = t >= F1 ? 3 : t >= tV ? 2 : t >= tE ? 1 : 0;
    const fields = [WHITE, BLOOD, WHITE, INK], inks = [INK, WHITE, BLOOD, WHITE];
    bg(fields[stage]); const ink = inks[stage];
    const hitT = [tQ, tE, tV, F1][stage], on = t - hitT;
    const A = lay(QA, QO, QTR, W / 2 - 40), B = lay(QB, QO, QTR, W / 2);
    // faint giant echo of the current word
    const echo = ['QUID', 'EST', 'VERITAS', 'ADEST'][stage];
    txt(echo, W / 2, H / 2 + 40, { ...ROM, size: stage === 2 ? 560 : 760, col: mixCol(fields[stage], ink, .07) });
    // hard-cut camera: tight on QUID, wider on QUID EST, full line on VERITAS
    const camX = stage === 0 ? (A[0].x + A[3].x) / 2 : stage === 1 ? (A[0].x + A[7].x) / 2 : W / 2;
    const z = [1.75, 1.3, 1, 1][stage] * (1 + .05 * Math.exp(-on * 12));
    camBegin(camX, QY, z, 0);
    rules(QY - 170, ink, .8, -600, W + 600); rules(QY + 135, ink, .8, -600, W + 600);
    const words = [[0, 4, tQ], [5, 8, tE], [9, 16, tV]];
    if (t < F0) {
      words.forEach(([i0, i1, tw]) => {
        if (t < tw) return;
        const k = backOut(seg(t, tw, tw + .09)), s = lerp(i1 - i0 > 4 ? 1.18 : 1.4, 1, k);
        for (let i = i0; i < i1; i++) if (A[i].ch !== ' ') {
          const cxw = (A[i0].x + A[i1 - 1].x) / 2;
          txt(A[i].ch, lerp(cxw, A[i].x, 1) + (A[i].x - cxw) * (s - 1), QY, { ...QO, col: ink, sx: s, sy: s });
        }
      });
      if (t >= tV + .1) txt('?', A[15].x + A[15].w / 2 + 44, QY, { ...QO, col: BLOOD === ink ? INK : BLOOD });
    } else {
      // private anagram: letters lift, fly, land; no rotation
      const used = new Set();
      A.forEach((L, i) => {
        if (L.ch === ' ') return;
        let j = B.findIndex((M, k) => !used.has(k) && M.ch === L.ch); used.add(j);
        const d = hash(i * 13 + 1) * .1, k = clamp((t - F0 - d) / (F1 - F0 - .1));
        const e = ease(k), lift = Math.sin(e * Math.PI) * (hash(i * 7) > .5 ? -150 : 150);
        const x = lerp(L.x, B[j].x, e), y = QY + lift;
        const land = t >= F1 ? backOut(seg(t, F1, F1 + .1)) : 1;
        const s = t >= F1 ? lerp(1.25, 1, land) : 1 + .15 * Math.sin(e * Math.PI);
        const col = t >= F1 ? (j >= 11 ? GOLD : ink) : (k > 0 && k < 1 ? BLOOD : ink);
        txt(L.ch, x + (x - W / 2) * (s - 1) * .3, y, { ...QO, col, sx: s, sy: s });
      });
      if (t >= F1) txt('IT IS THE MAN BEFORE YOU', W / 2, QY + 220, { ...MONO, size: 30, col: ink, track: 14, a: .85 * clamp((t - F1) / .1) });
    }
    camEnd();
    // sampled candidates over VERITAS
    if (t >= tE + .1 && t < tV + .2) {
      const cands = [['veritas', 1], ['truth', .8], ['argmax', .6], ['the most likely token', .45]];
      const p = seg(t, tE + .1, tV), cx = (A[9].x + A[15].x) / 2, y0 = QY - 390;
      const sh = rng(7 + stepT(t, 14) * 3.1), col = stage === 1 ? WHITE : INK;
      const pr = cands.map(([w, b], i) => i === 0 ? lerp(.2, .97, p) : sh() * b * (1 - p) * .6);
      const sum = pr.reduce((a, b) => a + b, 0);
      const order = cands.map((c, i) => [c[0], pr[i] / sum]).sort((a, b) => b[1] - a[1]);
      const fade = t < tV ? 1 : 1 - seg(t, tV, tV + .2);
      order.forEach(([w, q], i) => {
        const yy = y0 + i * 44;
        txt(w, cx - 40, yy, { ...MONO, size: 30, col, al: 'right', a: (i ? .55 : 1) * fade });
        rect(cx, yy - 8, 380 * q, 16, i ? mixCol(col, BLOOD, .5) : GOLD, fade * (i ? .6 : 1));
        txt(q.toFixed(2), cx + 380 * q + 14, yy, { ...MONO, size: 22, col, al: 'left', a: .7 * fade });
      });
    }
    txt('IOANNES XVIII · XXXVIII', W - 96, 96, { ...MONO, size: 22, col: ink, al: 'right', track: 8, a: .8 });
    txt('PILATVS', 96, 96, { ...MONO, size: 22, col: ink, al: 'left', track: 8, a: .8 });
    post({ bloom: .3, grain: .06, vig: .3, chroma: .7 * Math.exp(-on * 14) });
  }

  chapter('veritas', 75.92, 82.36, [[75.92, pope], [76.54, accel], [79.08, ecce], [81.0, quid]]);
})();
