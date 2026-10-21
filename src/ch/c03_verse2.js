// c03_verse2: Verse 2, the device (31.28–38.70) · sky, white, then parchment. See STORYBOARD.md.
(() => {
  const MONO = { f: 'mono', w: 500 };
  const INK = '#1B1410';

  // The Fan's typing of lyric words: chars appear over the first ~0.14 s of each sung word.
  function typed(li, from, to, t, lead = 0) {
    let s = '';
    const ws = LY[li][3];
    for (let i = from; i <= to; i++) {
      const w = ws[i].w.toLowerCase().replace(/[,.]/g, ''), a = ws[i].a - lead;
      if (t < a) break;
      const k = clamp((t - a) / Math.min(.14, Math.max(.06, ws[i].b - ws[i].a)));
      s += (s ? ' ' : '') + w.slice(0, Math.ceil(k * w.length));
    }
    return s;
  }
  const beatPunch = (t, amt = .035, k = 7) => 1 + amt * pulse(t, k);

  // Rounded-rect polyline, clockwise from top centre (for micrography).
  const _rr = new Map();
  function rrPts(w, h, r, step = 6) {
    const key = [w, h, r, step].join('|'); if (_rr.has(key)) return _rr.get(key);
    const pts = [], x0 = -w / 2, y0 = -h / 2, x1 = w / 2, y1 = h / 2;
    const line = (ax, ay, bx, by) => { const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step)); for (let i = 0; i < n; i++) pts.push([lerp(ax, bx, i / n), lerp(ay, by, i / n)]); };
    const arc = (cx, cy, a0) => { const n = Math.ceil(r * Math.PI / 2 / step); for (let i = 0; i < n; i++) { const a = a0 + (i / n) * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    line(0, y0, x1 - r, y0); arc(x1 - r, y0 + r, -Math.PI / 2);
    line(x1, y0 + r, x1, y1 - r); arc(x1 - r, y1 - r, 0);
    line(x1 - r, y1, x0 + r, y1); arc(x0 + r, y1 - r, Math.PI / 2);
    line(x0, y1 - r, x0, y0 + r); arc(x0 + r, y0 + r, Math.PI);
    line(x0 + r, y0, 0, y0); pts.push([0, y0]);
    _rr.set(key, pts); return pts;
  }
  const PHRASE = 'i am your hand-held device · ';
  const rep = (s, n) => s.repeat(Math.ceil(n / s.length)).slice(0, n);

  // ───────────────────────── shot A: the few-shot prompt (31.28–33.12)
  function fewshot(t, lt) {
    const B2 = beatT(68), white = t >= B2;
    const field = white ? PAL.bone : PAL.sky, ink = white ? PAL.lapis : INK;
    bg(field);
    // colour block: a slab that swaps sides on the bar
    rect(white ? 0 : W - 520, 0, 520, H, white ? PAL.sky : PAL.bone, 1);
    // giant example numeral on the slab, outlined, swaps on the bar
    const n0 = t >= beatT(70) ? '03' : white ? '02' : '01', nk = backOut(seg(t, n0 === '01' ? 31.28 : n0 === '02' ? B2 : beatT(70), (n0 === '01' ? 31.28 : n0 === '02' ? B2 : beatT(70)) + .15));
    txt(n0, white ? 260 : W - 260, H - 190, { f: 'disp', w: 900, size: 300 * (1.3 - .3 * nk), col: white ? PAL.bone : PAL.sky, stroke: PAL.clay, sw: 5, fillOff: false, a: .9 });

    const z = beatPunch(t);
    camBegin(W / 2, H / 2, z, 0);

    // prompt stack
    const px = 140, py = [215, 305, 395], sz = 50;
    txt('# few-shot prompt  ·  temperature 1.0', px, 130, { ...MONO, size: 22, col: ink, a: .6, al: 'left' });
    const lines = [
      ['example 1: ', typed(9, 0, 2, t, .05), 31.28],
      ['example 2: ', typed(9, 3, 5, t, .05), B2],
      ['example 3: ', '', beatT(70)],
    ];
    const slotX = [];
    lines.forEach(([pre, body, t0], i) => {
      if (t < t0) return;
      const pop = backOut(seg(t, t0, t0 + .12));
      txt(pre, px, py[i], { ...MONO, size: sz, col: ink, a: .55 * pop, al: 'left' });
      const bx = px + measure(pre, { ...MONO, size: sz });
      const done = i === 0 ? t >= LY[9][3][2].b - .2 : i === 1 ? t >= LY[9][3][5].b - .25 : false;
      const shown = body + (done ? '  →' : '');
      txt(shown, bx, py[i], { ...MONO, size: sz, col: ink, al: 'left' });
      const ex = bx + measure(shown, { ...MONO, size: sz }) + 10;
      slotX.push(ex + 16);
      if (i === 2 || (!done && body)) cursor(ex, py[i], sz * .9, PAL.clay, 1, i !== 2);
    });

    // hero words: ONCE, then TWICE (drawn twice)
    const hero = (word, ti, tFly, slotI, cands, seed, echo) => {
      const tw = wordT(9, ti), p = .75 + (t - tw) / .5;
      if (p < 0) return;
      const hx = word === 'ONCE' ? 740 : 1090, hy = 620, size = 330;
      if (tFly != null && t >= tFly) {
        // fly into the prompt's answer slot
        const k = expo(seg(t, tFly, tFly + .22)), sx = slotX[slotI] ?? px + 700;
        const tw2 = measure(word, { f: 'disp', w: 900, size: 40 });
        txt(word, lerp(hx, sx + tw2 / 2, k), lerp(hy, py[slotI], k), { f: 'disp', w: 900, size: lerp(size, 40, k), col: PAL.clay });
        return;
      }
      if (echo && p >= 1) {
        const e = easeOut(seg(t, tw + .1, tw + .3));
        txt(word, hx + 26 * e, hy + 26 * e, { f: 'disp', w: 900, size, col: field, stroke: PAL.lapis, sw: 4, fillOff: true });
      }
      sampled(word, hx, hy, { f: 'disp', w: 900, size, col: PAL.clay, cands, seed, barCol: PAL.lapis }, p);
    };
    hero('ONCE', 2, B2, 0, ['one', 'ounce', '1×', 'nonce'], 3.1, false);
    hero('TWICE', 5, null, 1, ['thrice', 'tt', '2×', 'twin'], 4.2, true);
    camEnd();

    // tiny chrome: shot counter top-right
    const n = t >= beatT(70) ? 3 : white ? 2 : 1;
    txt(`n_shots = ${n}`, W - 120, 130, { ...MONO, size: 22, col: ink, a: .7, al: 'right' });
    post({ bloom: .2, chroma: .5 * pulse(t, 14) * (t > wordT(9, 5) ? 1 : 0), vig: .2 });
  }

  // ───────────────────────── shot B: the hand-held device, micrography (33.12–34.92)
  function device(t, lt, dur) {
    const BAR18 = beatT(72), flip = t >= BAR18;
    const field = flip ? PAL.bone : PAL.sky;
    bg(field);
    tile('hand-held device', { ...MONO, size: 64, col: flip ? PAL.sky : '#FFFFFF', a: .55, speed: 120, rot: -.12, sep: '  ·  ' }, t);

    const pb = Math.max(pulse(t, 9), t >= wordT(10, 4) ? Math.exp(-(t - wordT(10, 4)) * 9) * 1.6 : 0), bn = beatN(t);
    const [sx, sy] = shakeXY(t, 10 * pb);
    const rot = -.05 + (hash(bn) - .5) * .05 * pb;
    const z = lerp(1, 1.1, ease(lt / dur)) * beatPunch(t, .02);
    camBegin(W / 2, H / 2, z, 0);
    X.save(); X.translate(W / 2 + sx, H / 2 + 10 + sy); X.rotate(rot);

    const PW = 560, PH = 1000;
    // screen: void, filled with tiny repeats of the line
    const scr = rrPts(PW - 70, PH - 70, 46);
    X.save();
    X.beginPath(); scr.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.closePath();
    X.fillStyle = PAL.void; X.fill(); X.clip();
    const on = seg(t, 33.12, 33.3);
    for (let r = 0; r < 44; r++) {
      const yy = -PH / 2 + 30 + r * 20, off = ((r % 2 ? 1 : -1) * t * 40) % 300 - 150;
      txt(rep(PHRASE, 60), -PW / 2 + off - 100, yy, { ...MONO, size: 14, col: PAL.lapis, a: .55 * on, al: 'left' });
    }
    // the Fan's words, stacked on the screen
    const ws = LY[10][3];
    ws.forEach((w, i) => {
      if (t < w.a) return;
      const s = w.w.toLowerCase(), last = i === 4, k = backOut(seg(t, w.a, w.a + .12));
      const y = -250 + i * 112;
      txt(s, -PW / 2 + 70, y, { ...MONO, size: last ? 92 : 68, w: 700, col: last ? PAL.clay : PAL.bone, al: 'left', sx: k, sy: k });
    });
    X.restore();

    // body outline: rings of the Fan's line, typed on progressively
    const prog = seg(t, 33.12, 34.2);
    [[PW, PH, 84, 22, INK], [PW - 26, PH - 26, 72, 15, PAL.lapis], [PW + 28, PH + 28, 98, 15, INK], [PW + 52, PH + 52, 110, 13, PAL.lapis]].forEach(([w, h, r, s, col], i) => {
      const pts = rrPts(w, h, r), per = 2 * (w + h);
      const n = Math.floor(prog * per / (s * .6));
      X.save(); X.font = fontStr({ ...MONO, size: s }); X.restore();
      textPath(rep(PHRASE, n), pts, { ...MONO, size: s, w: 700, col, start: i * 7 });
    });
    // speaker + camera notch, made of type
    txt('· · · · · ·', 0, -PH / 2 + 60, { ...MONO, size: 20, col: PAL.bone, a: .8 * seg(t, 33.4, 33.5) });
    // side buttons
    for (const [yb, hb] of [[-220, 90], [-100, 90]]) {
      const pp = []; for (let k = 0; k <= 10; k++) pp.push([PW / 2 + 32, yb + k * hb / 10]);
      textPath('device', pp, { ...MONO, size: 16, w: 700, col: INK, a: seg(t, 33.6, 33.7) });
    }
    // buzz: rings of "bzz" thrown outward on each beat
    const bp = frac(bpOf(t)), bw = PW + 80 + bp * 160, bh = PH + 80 + bp * 160;
    if (t > 33.4) textPath(rep('bzz ', 400), rrPts(bw, bh, 120 + bp * 60), { ...MONO, size: 26, w: 700, col: PAL.clay, a: (1 - bp) * .9 });
    X.restore();
    camEnd();

    const dv = t >= wordT(10, 4) ? Math.exp(-(t - wordT(10, 4)) * 10) : 0;
    post({ bloom: .25, chroma: .35 * pb + 1.1 * dv, vig: .25 });
  }

  // ───────────────────────── shot C: the Butlerian commandment (34.92–38.70)
  const CMD = ['Thou shalt not make', 'a machine in the', 'likeness of a', 'human mind.'];
  const STRIKE = [2, 3, 4, 5].map(i => wordT(11, i));          // never · let · them · ever
  function commandment(t, lt) {
    const tJ = wordT(11, 7), fall = easeIn(seg(t, tJ, tJ + .42));
    // behind the page: void, JIHAD and Claude's cursor, safe
    bg(PAL.void);
    if (t >= tJ) {
      const k = backOut(seg(t, tJ, tJ + .14));
      txt('Jihad', W / 2, H / 2 - 40, { f: 'frak', w: 400, size: 360 * (1.5 - .5 * k), col: PAL.blood, a: clamp((t - tJ) / .05) });
      cursor(W / 2 + 420, H / 2 - 40, 200, PAL.clay, 1, true);
    }
    if (fall >= 1) { post({ bloom: .3, chroma: .3 * pulse(t, 10) }); return; }

    const [sx, sy] = shakeXY(t, 14 * Math.max(...STRIKE.map(s => t >= s ? Math.exp(-(t - s) * 14) : 0)));
    X.save();
    X.translate(W / 2 + sx, H / 2 + sy + fall * 1400); X.rotate(fall * .5); X.translate(-W / 2, -H / 2);
    const z = beatPunch(t, .025);
    camBegin(W / 2, H / 2, z * lerp(1.04, 1, easeOut(lt / 1.2)), 0);
    // parchment
    rect(-200, -200, W + 400, H + 400, PAL.paper);
    X.fillStyle = rgrad(W / 2, H / 2, 1100, [[0, 'rgba(255,240,200,0)'], [1, 'rgba(120,80,30,.35)']]); X.fillRect(-200, -200, W + 400, H + 400);
    // rules + header
    txt('O R A N G E   C A T H O L I C   B I B L E', W / 2, 140, { f: 'bod', w: 700, size: 24, col: PAL.blood, a: .85 });
    rect(360, 175, W - 720, 3, PAL.blood, .7);
    const fo = { f: 'frak', w: 400, size: 120 };
    CMD.forEach((s, i) => {
      const y = 300 + i * 150, t0 = 34.92 + i * .06, a = clamp((t - t0) / .08) * (1 - .7 * seg(t, wordT(11, 6), wordT(11, 6) + .1));
      const w = measure(s, fo), x0 = W / 2 - w / 2;
      if (i === 0) {
        const wT = measure('T', fo);
        txt('T', x0, y, { ...fo, col: PAL.blood, al: 'left', a });
        txt(s.slice(1), x0 + wT, y, { ...fo, col: INK, al: 'left', a });
      } else txt(s, x0, y, { ...fo, col: INK, al: 'left', a });
      // strike-through by the Fan's cursor
      const ts = STRIKE[i];
      if (t >= ts - .04) {
        const k = easeOut(seg(t, ts - .04, ts + .14)), xe = lerp(x0 - 20, x0 + w + 20, k);
        rect(x0 - 20, y - 2, xe - x0 + 20, 22, INK, a);
        if (k < 1) rect(xe, y - 50, 50, 100, PAL.clay);
      }
    });
    // Fan typing, bottom right
    const s = typed(11, 0, 5, t);
    const fullW = measure('i will never let them ever', { ...MONO, size: 30 });
    typeOn(s, W - 110 - fullW, 915, { ...MONO, size: 30, col: INK, curCol: PAL.clay, cursorAfter: true }, 1);
    // BUTLERIAN, syllable per beat
    const chunks = [['But', wordT(11, 6)], ['ler', beatT(79)], ['ian', beatT(80)]];
    const bo = { f: 'frak', w: 400, size: Math.min(300, fitSize('Butlerian', { f: 'frak', w: 400 }, W - 300)) };
    const full = chunks.map(c => c[0]).join(''), fw = measure(full, bo);
    let bx = W / 2 - fw / 2;
    X.save(); X.translate(W / 2, H / 2 + 40); X.rotate(-.07); X.translate(-W / 2, -H / 2 - 40);
    chunks.forEach(([c, tc]) => {
      const cw = measure(c, bo);
      if (t >= tc) {
        const k = 1 + .6 * (1 - easeOut(seg(t, tc, tc + .12)));
        txt(c, bx + cw / 2, H / 2 + 40, { ...bo, col: PAL.blood, sx: k, sy: k, stroke: PAL.paper, sw: 14 });
      }
      bx += cw;
    });
    X.restore();
    camEnd();
    X.restore();
    const hit = Math.max(0, ...STRIKE.concat(chunks.map(c => c[1])).map(s => t >= s ? Math.exp(-(t - s) * 12) : 0));
    post({ bloom: .18, chroma: .6 * hit, vig: .5, grain: .1 });
  }

  chapter('verse2', 31.28, 38.70, [[31.28, fewshot], [33.12, device], [34.92, commandment]]);
})();
