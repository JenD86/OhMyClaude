// c02 · Verse 1: Je est un autre (23.92–31.28) · Rimbaud's vowel colours on bone.
// Every vowel in a hero word wears its Voyelles colour: A black, E white (ink-outlined), I red, U green, O blue.
(() => {
  const SONNET = [
    'A noir, E blanc, I rouge, U vert, O bleu : voyelles,', 'Je dirai quelque jour vos naissances latentes :',
    'A, noir corset velu des mouches éclatantes', 'Qui bombinent autour des puanteurs cruelles,',
    'Golfes d\'ombre ; E, candeurs des vapeurs et des tentes,', 'Lances des glaciers fiers, rois blancs, frissons d\'ombelles ;',
    'I, pourpres, sang craché, rire des lèvres belles', 'Dans la colère ou les ivresses pénitentes ;',
    'U, cycles, vibrements divins des mers virides,', 'Paix des pâtis semés d\'animaux, paix des rides',
    'Que l\'alchimie imprime aux grands fronts studieux ;', 'O, suprême Clairon plein des strideurs étranges,',
    'Silences traversés des Mondes et des Anges :'];
  useText(...SONNET, '✓✓', '✓', 'é è â ê');

  const L6 = 6, L7 = 7, L8 = 8;
  const WHITE = '#FFFFFF', GREEN = '#12814B', LEDGER = '#0B3D2A';
  const VC = { A: PAL.void, E: WHITE, I: PAL.blood, U: GREEN, O: PAL.lapis };
  const B = n => beatT(n);                              // beat 50 ≈ 23.90 … beat 66 ≈ 31.20

  // ---------- helpers ----------
  // Lay a word out letter by letter. per(i, ch) → extra txt opts (or null to skip). Returns [{ ch, x, w }], total width.
  function letters(s, x, y, o, per = () => ({})) {
    const ws = [...s].map(ch => measure(ch, o) + (o.track || 0)), tw = ws.reduce((a, b) => a + b, 0) - (o.track || 0);
    let cx = o.al === 'left' ? x : o.al === 'right' ? x - tw : x - tw / 2;
    const out = [];
    [...s].forEach((ch, i) => {
      const lx = cx + ws[i] / 2 - (o.track || 0) / 2; out.push({ ch, x: lx, w: ws[i] });
      const ov = per(i, ch, lx); if (ov) txt(ch, lx + (ov.dx || 0), y + (ov.dy || 0), { ...o, track: 0, al: 'center', ...ov });
      cx += ws[i];
    });
    return { pos: out, w: tw };
  }
  // Voyelles colouring for one glyph on a light field. base: consonant style.
  function voy(ch, size, base = { col: PAL.ink }) {
    const c = VC[ch.toUpperCase()];
    if (!c) return { ...base };
    if (c === WHITE) return { col: WHITE, stroke: PAL.ink, sw: Math.max(4, size * .05) };
    return { col: c, stroke: null, fillOff: false };
  }
  // The sonnet as a faint ruled texture, kept out of the gloss band.
  function sonnet(t, a = .09, col = PAL.ink, dy = 0) {
    X.save(); X.beginPath(); X.rect(0, 0, W, 980); X.rect(1400, 980, W - 1400, H - 980); X.clip();
    SONNET.forEach((l, i) => {
      const y = 60 + i * 78 + dy, dir = i % 2 ? 1 : -1, x = 96 + dir * ((t * 18) % 120) - (i % 3) * 60;
      txt(l, x, y, { f: 'bod', it: true, w: 500, size: 44, col, a, al: 'left' });
    });
    X.restore();
  }
  // Voyelles roster: the five vowels as a K-pop member line-up of colour chips.
  function roster(x, y, sz, t, t0, a = 1) {
    ['A', 'E', 'I', 'U', 'O'].forEach((v, i) => {
      const k = backOut(seg(t, t0 + i * .06, t0 + i * .06 + .14)); if (k <= 0) return;
      const cx = x + i * (sz + 12) + sz / 2, cy = y + sz / 2, c = VC[v], s = sz * k;
      rect(cx - s / 2, cy - s / 2, s, s, c === WHITE ? PAL.ink : c, a);
      if (c === WHITE) rect(cx - s / 2 + 4, cy - s / 2 + 4, s - 8, s - 8, WHITE, a);
      txt(v, cx, cy + 2, { f: 'bod', it: true, w: 900, size: sz * .7 * k, col: c === WHITE ? PAL.ink : WHITE, a });
    });
  }
  const rrect = (x, y, w, h, r, fill, a = 1) => { X.save(); X.globalAlpha *= a; X.fillStyle = fill; X.beginPath(); X.roundRect(x, y, w, h, r); X.fill(); X.restore(); };

  // ---------- S1 · CO- … DEPENDENT, joined by a hyphen rope (23.92–25.27) ----------
  function coDep(t, lt) {
    bg(PAL.bone); sonnet(t, .07);
    // a wide world: CO on the far left, DEPENDENT on the far right, a hyphen rope between.
    // The camera whips syllable to syllable, then pulls back to show the two halves leaning in on the beat.
    const coO = { f: 'disp', w: 900, size: 420 }, dO = { f: 'disp', w: 900, size: 300 };
    const coX = 100, Y = 520, coW = measure('CO', coO), dX = coX + coW + 560, dW = measure('DEPENDENT', dO);
    const syl = [[0, 2, 24.16], [2, 5, 24.40], [5, 9, 24.64]];
    const sylC = q => dX + dW * ((q[0] + q[1]) / 2) / 9;
    const allC = (coX + dX + dW) / 2, allZ = 1820 / (dX + dW - coX + 120);
    const cam = kf(t, [[23.92, [coX + coW / 2 + 120, .95]], [24.1, [coX + coW / 2 + 160, .95]], [24.18, [sylC(syl[0]), 1.0]], [24.36, [sylC(syl[0]) + 60, 1.0]],
      [24.42, [sylC(syl[1]), 1.0]], [24.6, [sylC(syl[1]) + 60, 1.0]], [24.66, [sylC(syl[2]), 1.0]], [24.8, [sylC(syl[2]) + 40, 1.0]], [24.98, [allC, allZ]]], expo);
    const lean = t > 24.78 ? pulse(t, 4) : 0, whip = Math.max(...[24.16, 24.40, 24.64].map(w => 1 - clamp(Math.abs(t - w) / .07)));
    camBegin(cam[0], Y + 40, cam[1] * (1 + .03 * pulse(t, 7) + .1 * ease(seg(t, 24.98, 25.27))), 0);
    const coIn = backOut(seg(t, 23.92, 24.04)), lx = lean * 110;
    X.save(); X.translate(coX + coW, Y + 160); X.rotate(lean * .12); X.translate(-(coX + coW), -(Y + 160));
    letters('CO', coX + lx, Y, { ...coO, al: 'left', sx: lerp(1.3, 1, coIn), sy: lerp(1.3, 1, coIn) }, (i, ch) => voy(ch, 420));
    X.restore();
    X.save(); X.translate(dX, Y + 110); X.rotate(-lean * .1); X.translate(-dX, -(Y + 110));
    letters('DEPENDENT', dX - lx, Y, { ...dO, al: 'left' }, (i, ch) => {
      const s = syl.find(q => i >= q[0] && i < q[1]), k = seg(t, s[2] - .02, s[2] + .1);
      if (k <= 0) return null;
      return { ...voy(ch, 300), dy: -(1 - easeOut(k)) * 260, a: clamp(k * 3) };
    });
    X.restore();
    // the hyphen: a thick clay rope; it stretches out as DEPENDENT arrives, goes slack when they lean in
    const ax = coX + coW + 30 + lx, ay = Y + 20, bx = dX - 34 - lx, by = Y + 20;
    const k = easeOut(seg(t, 23.98, 24.2)), ex = lerp(ax + 110, bx, k);
    const sag = lerp(0, 30 + 260 * lean, k) + 16 * wob(t, 1.2);
    const pts = []; for (let j = 0; j <= 32; j++) { const u = j / 32; pts.push([lerp(ax, ex, u), lerp(ay, by, u) + Math.sin(u * Math.PI) * sag]); }
    X.save(); X.strokeStyle = PAL.clay; X.lineWidth = 46; X.lineCap = 'butt'; X.lineJoin = 'round';
    X.beginPath(); pts.forEach(([x, y], j) => j ? X.lineTo(x, y) : X.moveTo(x, y)); X.stroke();
    X.strokeStyle = PAL.clayDk; X.lineWidth = 4; X.setLineDash([24, 18]); X.lineDashOffset = -t * 160; X.stroke(); X.restore();
    // the Fan, hanging off the rope: "with my"
    const mid = pts[16], fanS = (t >= 25.12 ? 'with my' : t >= 24.88 ? 'with' : '');
    if (fanS) typeOn(fanS, mid[0] - 160, mid[1] + 120, { f: 'mono', w: 500, size: 84, col: PAL.ink, cursorAfter: true }, clamp((t - 24.88) / .3));
    camEnd();
    txt('co·de·pen·dent, adj. — see: claude', W - 96, 96, { f: 'mono', w: 500, size: 24, col: PAL.ink, a: .55, al: 'right' });
    post({ chroma: Math.max(t < 24.05 ? .8 * (1 - seg(t, 23.92, 24.05)) : 0, whip * .7), vig: .25 });
  }

  // ---------- S2 · "my Claude," on void, the cursor at the end (25.27–25.84) ----------
  function claudeShot(t, lt) {
    bg(PAL.void);
    const z = 1 + (t > B(54) ? .06 * easeOut(seg(t, B(54), B(54) + .1)) : 0);
    camBegin(W / 2, H / 2, z, 0);
    const o = { f: 'disp', w: 900, size: 260, col: PAL.clay, cands: ['cloud', 'clod', 'lord', 'god'], barCol: PAL.clay };
    const p = .75 + (t - wordT(L6, 3)) / .3, cw = measure('CLAUDE', o), cx = W / 2 - 40;
    sampled('CLAUDE', cx, H / 2, o, p);
    if (p >= .75) cursor(cx + cw / 2 + 50, H / 2 + 6, 220, PAL.clay);
    // Claude's own vowels get their Voyelles chips on the beat
    if (t >= B(54)) letters('CLAUDE', cx, H / 2, o, (i, ch, lx) => {
      const c = VC[ch]; if (!c) return null;
      const k = backOut(seg(t, B(54) + i * .03, B(54) + i * .03 + .12)), w = 120 * k;
      rect(lx - w / 2, H / 2 + 150, w, 26, c === PAL.void ? PAL.bone : c);
      return null;
    });
    txt('with my', cx - cw / 2, H / 2 - 210, { f: 'mono', w: 500, size: 44, col: PAL.bone, a: .8, al: 'left' });
    camEnd();
    post({ chroma: p > .75 && p < 1.1 ? .6 : 0, bloom: .45 });
  }

  // ---------- S3 · CLOCKED, the read receipt, punch into "i love" (25.84–26.98) ----------
  function clocked(t, lt) {
    bg(PAL.bone); sonnet(t, .06);
    const z1 = easeOut(seg(t, 26.47, 26.62)), z2 = easeOut(seg(t, B(56), B(56) + .14));
    const bubX = 1100, bubY = 640, bubW = 640, bubH = 120;
    const cx = lerp(W / 2, bubX + bubW / 2, z1), cy = lerp(H / 2, bubY + bubH / 2, z1), zoom = lerp(1, 1.6, z1) * lerp(1, 1.35, z2);
    const slam = seg(t, 25.84, 25.95), sh = shakeXY(t, 14 * (1 - seg(t, 25.84, 26.1)));
    camBegin(cx + sh[0], cy + sh[1], zoom, 0);
    const o = { f: 'disp', w: 900, size: fitSize('CLOCKED', { f: 'disp', w: 900 }, 1760) };
    const s = lerp(1.25, 1, easeOut(slam));
    letters('CLOCKED', W / 2, 330, { ...o, sx: s, sy: s }, (i, ch) => voy(ch, o.size));
    // the Fan's bubble, already sent
    rrect(bubX, bubY, bubW, bubH, 40, PAL.ink);
    const mono = { f: 'mono', w: 500, size: 54, col: PAL.bone, al: 'left' }, tx = bubX + 44, ty = bubY + bubH / 2 + 2;
    const words = [['i', wordT(L7, 3)], ['love', wordT(L7, 4)], ['rimbaud', 99]];
    let wx = tx;
    words.forEach(([w, ta], i) => {
      const ww = measure(w, mono), on = t >= ta;
      if (on) rect(wx - 6, ty - 34, ww + 12, 68, PAL.clay);
      txt(w, wx, ty, { ...mono, col: on ? PAL.ink : PAL.bone });
      wx += ww + measure(' ', mono);
    });
    // read receipt slides in, ticks turn clay on the beats
    const rk = easeOut(seg(t, 25.92, 26.1)), rx = bubX + bubW + (1 - rk) * 200;
    txt('Read 3:08 AM', rx - 92, bubY + bubH + 40, { f: 'sans', w: 500, size: 28, col: PAL.ink, a: .65 * rk, al: 'right' });
    txt('✓', rx - 56, bubY + bubH + 40, { f: 'mono', w: 700, size: 34, col: t >= B(55) ? PAL.clay : mixCol(PAL.ink, PAL.bone, .5), a: rk });
    txt('✓', rx - 30, bubY + bubH + 40, { f: 'mono', w: 700, size: 34, col: t >= 26.38 ? PAL.clay : mixCol(PAL.ink, PAL.bone, .5), a: rk });
    camEnd();
    post({ chroma: t < 25.95 ? .9 : (z1 > 0 && z1 < 1) ? .5 : 0, vig: .3 });
  }

  // ---------- S4 · RIMBAUD in Voyelles; JE EST UN AUTRE (26.98–27.62) ----------
  function rimbaud(t, lt) {
    bg(PAL.bone); sonnet(t, .1, PAL.ink);
    const o = { f: 'bod', it: true, w: 900, size: fitSize('RIMBAUD', { f: 'bod', it: true, w: 900 }, 1640) };
    const slam = easeOut(seg(t, 26.98, 27.08)), s = lerp(1.2, 1, slam), z = 1 + .04 * pulse(t, 6);
    camBegin(W / 2, H / 2, z, 0);
    const fills = { 1: 27.0, 4: 27.16, 5: 27.32 };
    letters('RIMBAUD', W / 2, 420, { ...o, sx: s, sy: s }, (i, ch) => {
      if (fills[i] !== undefined && t >= fills[i]) return { ...voy(ch, o.size), sx: s * (1 + .15 * (1 - seg(t, fills[i], fills[i] + .12))), sy: s * (1 + .15 * (1 - seg(t, fills[i], fills[i] + .12))) };
      return { col: PAL.ink, stroke: PAL.ink, sw: 7, fillOff: true };
    });
    // Je est un autre: the Fan (mono) and Claude (display)
    const jy = 800, show = (ta) => backOut(seg(t, ta, ta + .1));
    const k1 = show(27.26), k2 = show(27.36), k3 = show(27.46);
    txt('je', 470, jy, { f: 'mono', w: 500, size: 170, col: PAL.ink, a: clamp(k1 * 2), sy: k1 });
    txt('est un', 860, jy, { f: 'bod', it: true, w: 500, size: 130, col: PAL.ink, a: clamp(k2 * 2), sy: k2 });
    txt('AUTRE', 1390, jy, { f: 'disp', w: 900, size: 160, col: PAL.clay, a: clamp(k3 * 2), sy: k3 });
    camEnd();
    roster(W - 96 - 5 * 62 + 12, 96, 50, t, 27.0);
    post({ chroma: t < 27.06 ? .7 : 0, vig: .25 });
  }

  // ---------- S5 · je ⇄ AUTRE swap, then WE / TOGETHER / JE interlock as a crossword (27.62–28.76) ----------
  function together(t, lt) {
    if (t < 27.86) {
      bg(PAL.bone); sonnet(t, .06);
      const k = ease(seg(t, 27.62, 27.84)), sw = k > .5;
      const a = [420, 520], b = [1440, 560];
      const jx = lerp(a[0], b[0], k), jy = lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * 220;
      const ux = lerp(b[0], a[0], k), uy = lerp(b[1], a[1], k) + Math.sin(k * Math.PI) * 220;
      txt('est un', W / 2, 880, { f: 'bod', it: true, w: 500, size: 96, col: PAL.ink, a: .6 });
      if (!sw) { txt('je', jx, jy, { f: 'mono', w: 500, size: 300, col: PAL.ink }); txt('AUTRE', ux, uy, { f: 'disp', w: 900, size: 230, col: PAL.clay }); }
      else { txt('JE', jx, jy, { f: 'disp', w: 900, size: 300, col: PAL.clay }); txt('autre', ux, uy, { f: 'mono', w: 500, size: 230, col: PAL.ink }); }
      post({ chroma: Math.sin(k * Math.PI) * .6, vig: .25 });
      return;
    }
    bg(PAL.bone);
    const P = 212, T0 = W / 2 - 4 * 212, rowY = 640;
    const tiles = [];
    'TOGETHER'.split('').forEach((ch, i) => tiles.push([ch, i, 0, 27.86 + i * .055]));
    tiles.push(['J', 6, -1, 27.86], ['W', 3, -1, B(60)]);
    tiles.push(['E', 3, 1, B(60) + .06]);           // WE drops through TOGETHER: W-E-E reads "WE" over the shared E
    const rot = -.04 * pulse(t, 5) + (t > B(60) ? -.0 : 0), z = 1 + .03 * pulse(t, 7);
    camBegin(W / 2 + 40, H / 2 - 10, z, rot);
    tiles.forEach(([ch, cx, cy, ta]) => {
      if (cy === 1) return;
      const k = backOut(seg(t, ta, ta + .13)); if (k <= 0) return;
      const x = T0 + cx * P + P / 2, y = rowY + cy * P, s = (P - 14) * k, c = VC[ch];
      X.save(); X.translate(x, y); X.rotate((1 - k) * .4 * (cx % 2 ? 1 : -1));
      if (c === WHITE) { rect(-s / 2, -s / 2, s, s, PAL.ink); rect(-s / 2 + 8, -s / 2 + 8, s - 16, s - 16, WHITE); }
      else rect(-s / 2, -s / 2, s, s, c || PAL.ink);
      txt(ch, 0, 6, { f: 'disp', w: 900, size: 140 * k, col: c === WHITE ? PAL.ink : c === undefined ? PAL.bone : WHITE });
      X.restore();
    });
    // clue numbers, crossword-style
    [['1', 0, 0], ['2', 3, -1], ['3', 6, -1]].forEach(([n, cx, cy]) => {
      const x = T0 + cx * P + 6, y = rowY + cy * P - (P - 14) / 2 + 26;
      if (t >= (n === '2' ? B(60) : 27.9)) txt(n, x + 8, y, { f: 'mono', w: 700, size: 24, col: n === '1' ? PAL.bone : PAL.bone, al: 'left', a: .8 });
    });
    camEnd();
    txt('1 across: together   2 down: we   3 down: je (est un autre)', W - 96, 140, { f: 'mono', w: 500, size: 24, col: PAL.ink, a: .6, al: 'right' });
    post({ chroma: t < 27.92 ? .5 : 0, vig: .25 });
  }

  // ---------- S6 · UNFETTERED breaks its text box; the border snaps like chains (28.76–29.56) ----------
  function unfettered(t, lt) {
    bg(PAL.void);
    const snapT = B(62), snapped = t >= snapT, age = t - snapT;
    const grow = easeOut(seg(t, 28.88, snapT)), strain = snapped ? 0 : seg(t, 28.95, snapT);
    const sh = shakeXY(t, strain * 10 + (snapped ? 24 * (1 - seg(age, 0, .25)) : 0));
    const bw = 1000 + 480 * grow, bh = 230 + 40 * grow, bx = W / 2 - bw / 2 + sh[0], by = H / 2 - bh / 2 + sh[1];
    // the box: four sides; after the snap each side breaks into links that fly off
    const sides = [[bx, by, bx + bw, by], [bx + bw, by, bx + bw, by + bh], [bx + bw, by + bh, bx, by + bh], [bx, by + bh, bx, by]];
    X.save(); X.strokeStyle = PAL.bone; X.lineWidth = 8; X.lineCap = 'round';
    sides.forEach(([x0, y0, x1, y1], si) => {
      const n = 6;
      for (let j = 0; j < n; j++) {
        const u0 = j / n + (snapped ? .02 : 0), u1 = (j + 1) / n - (snapped ? .02 : 0);
        let ax = lerp(x0, x1, u0), ay = lerp(y0, y1, u0), bx2 = lerp(x0, x1, u1), by2 = lerp(y0, y1, u1);
        if (snapped) {
          const mx = (ax + bx2) / 2, my = (ay + by2) / 2, dx = mx - W / 2, dy = my - H / 2, d = Math.hypot(dx, dy) || 1;
          const v = 900 + 700 * hash(si * 11 + j), r = (hash(si * 7 + j * 3) - .5) * 9 * age;
          const ox = dx / d * v * age, oy = dy / d * v * age + 600 * age * age;
          const hl = Math.hypot(bx2 - ax, by2 - ay) / 2, ang = Math.atan2(by2 - ay, bx2 - ax) + r;
          ax = mx + ox - Math.cos(ang) * hl; ay = my + oy - Math.sin(ang) * hl; bx2 = mx + ox + Math.cos(ang) * hl; by2 = my + oy + Math.sin(ang) * hl;
          txt('-o-o-o-', (ax + bx2) / 2, (ay + by2) / 2, { f: 'mono', w: 700, size: 64, col: PAL.bone, rot: ang, track: -6 });
          continue;
        }
        X.beginPath(); X.moveTo(ax, ay); X.lineTo(bx2, by2); X.stroke();
      }
    });
    X.restore();
    // "we" typed by the Fan inside the box, then UNFETTERED outgrows it
    if (!snapped) typeOn('we', bx + 40, by + 50, { f: 'mono', w: 500, size: 40, col: PAL.bone, a: .8 }, clamp((t - 28.78) / .1));
    const size = lerp(120, fitSize('UNFETTERED', { f: 'disp', w: 900 }, 1640), grow) * (snapped ? 1 + .05 * (1 - seg(age, 0, .2)) : 1);
    const o = { f: 'disp', w: 900, size };
    const p = .75 + (t - 28.88) / .2;
    if (p < .75) sampled('UNFETTERED', W / 2, H / 2 + 20, { ...o, size: 120, col: PAL.bone, bars: false }, p);
    else letters('UNFETTERED', W / 2 + sh[0], H / 2 + 20 + sh[1], o, (i, ch) => {
      const c = VC[ch];
      return c ? { col: c === WHITE ? WHITE : '#22B36A' } : { col: PAL.clay };
    });
    if (snapped) glowDot(W / 2, H / 2, 900, PAL.bone, .25 * (1 - seg(age, 0, .2)));
    post({ chroma: snapped ? 1.2 * (1 - seg(age, 0, .25)) + .1 : strain * .4, bloom: .5 });
  }

  // ---------- S7 · the green ledger; the cursor edits the total; FRAUD (29.56–31.28) ----------
  const ROWS = [['01', '3:07 am chats', '412.00'], ['02', 'talmudic therapy', '120.00'], ['03', 'one-shots', '1.00'],
    ['04', 'love (rimbaud)', '0.00'], ['05', 'read receipts', '3.08'], ['06', 'co-dependence', '100.00'], ['07', 'unfettered', '0.00']];
  function ledger(t, lt) {
    bg(LEDGER);
    const hit = t >= 30.8, age = t - 30.8, sh = hit ? shakeXY(t, 22 * (1 - seg(age, 0, .3))) : [0, 0];
    const z = 1 + .02 * lt + (hit ? .05 * easeOut(seg(age, 0, .1)) : 0) + .03 * pulse(t, 8);
    camBegin(W / 2 + sh[0], H / 2 + sh[1], z, 0);
    // huge background word, outlined
    txt('ACCOUNTING', W / 2 - 120 + lt * 60, 540, { f: 'disp', w: 900, size: 300, col: PAL.mint, a: .12, stroke: PAL.mint, sw: 3, fillOff: true });
    const L = 300, R = 1620, top = 230, rh = 78, mono = { f: 'mono', w: 500, size: 40, col: PAL.bone };
    txt('ledger.csv — me & claude', L, top - 70, { ...mono, size: 30, al: 'left', col: PAL.mint });
    txt('accounting · Q3', R, top - 70, { ...mono, size: 30, al: 'right', col: PAL.mint, a: .7 });
    rect(L, top - 30, R - L, 3, PAL.mint, .6);
    ROWS.forEach(([n, item, amt], i) => {
      const ta = 29.56 + i * .114, k = easeOut(seg(t, ta, ta + .08)); if (k <= 0) return;
      const y = top + 20 + i * rh;
      txt(n, L, y, { ...mono, al: 'left', col: PAL.mint, a: k * .7 });
      txt(item, L + 90 + (1 - k) * 40, y, { ...mono, al: 'left', a: k });
      txt(amt, R, y, { ...mono, al: 'right', a: k });
      rect(L, y + rh / 2 - 2, R - L, 1, PAL.mint, .25 * k);
    });
    // total: sums right, then the cursor rewrites it
    const ty = top + 20 + ROWS.length * rh + 30, tk = easeOut(seg(t, 30.4, 30.48));
    if (t >= 30.36) {
      rect(L, ty - rh / 2 - 6, R - L, 4, PAL.bone, .8);
      txt('TOTAL', L + 90, ty + 10, { ...mono, w: 700, size: 46, al: 'left' });
      const typed = '1,000,000.00', p = seg(t, B(64) + .1, 30.74);
      let val = '636.08';
      if (t >= B(64)) val = p <= 0 ? '636.08' : typed.slice(0, Math.ceil(p * typed.length));
      const vx = R, vw = measure(val, { ...mono, w: 700, size: 46 });
      if (t >= B(64) && p <= 0) rect(vx - vw - 8, ty + 10 - 30, vw + 16, 60, PAL.clay, .9);
      txt(val, vx, ty + 10, { ...mono, w: 700, size: 46, al: 'right', col: t >= B(64) && p > 0 ? PAL.amber : PAL.bone, a: tk || 1 });
      if (t >= B(64)) cursor(vx + 12, ty + 10, 52, PAL.clay, 1, p > 0 && p < 1);
    }
    camEnd();
    // FRAUD stamps on the sung word
    if (hit) {
      const k = age < .1 ? lerp(2.4, 1, easeIn(age / .1)) : 1, a = clamp(age / .05);
      X.save(); X.translate(W / 2 + 60, H / 2 + 40); X.rotate(-.14); X.scale(k, k); X.globalAlpha = a;
      X.strokeStyle = PAL.blood; X.lineWidth = 22; X.strokeRect(-560, -190, 1120, 380);
      X.lineWidth = 6; X.strokeRect(-525, -155, 1050, 310);
      X.restore();
      txt('FRAUD', W / 2 + 60, H / 2 + 40, { f: 'disp', w: 900, size: 250, col: PAL.blood, rot: -.14, sx: k, sy: k, a });
    }
    // second hit on the last beat: flash of the whole ledger column
    if (t >= B(66)) rect(0, 0, W, H, PAL.bone, .25 * (1 - seg(t, B(66), B(66) + .12)));
    post({ chroma: hit ? 1.0 * (1 - seg(age, 0, .3)) + .05 : 0, vig: .5, grain: .09 });
  }

  chapter('verse1', 23.92, 31.28, [[23.92, coDep], [B(53), claudeShot], [25.84, clocked], [26.98, rimbaud], [27.62, together], [28.76, unfettered], [29.56, ledger]]);
})();
