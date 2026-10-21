// c05 · Chorus: the stadium (46.38–53.64). An ocean of ✳ lightsticks that flips like a card section to spell
// each sung word; on Adonai every light goes out and the name hangs over the dark crowd.
(() => {
  useText('אֲדֹנָי');
  const S = 46.38, E = 53.64, HOR = 330;
  const ws = li => LY[li][3];
  // Card states: [time the wave starts, word, colour]. Each sung word flips the section.
  const CARDS = [
    [ws(15)[2].a - .1, 'CLAUDE', PAL.clay], [ws(15)[3].a - .08, 'AGI', PAL.bone],
    [ws(16)[0].a - .08, 'O MY', PAL.blush], [ws(16)[2].a - .1, 'HOMEGIRL', PAL.pink],
    ...ws(17).slice(0, 8).map((w, i) => [w.a - .08, w.w.replace(/[,]/g, '').toUpperCase(), [PAL.cyan, PAL.bone, PAL.mint, PAL.blush, PAL.bone, PAL.clay, PAL.cyan, PAL.bone][i]]),
  ];
  const DARK = [ws(16)[3].a - .04, ws(17)[0].a - .1];          // the holy freeze: lights out
  const BURST = ws(17)[8].a + .12;                              // one-shotted: every light bursts white
  const FIELD = PAL.lilac;

  // ---------- sprites ----------
  const sprites = new Map();
  function sprite(col) {
    if (sprites.has(col)) return sprites.get(col);
    const c = mkCanvas(96, 96), g = c.getContext('2d');
    const gr = g.createRadialGradient(48, 48, 0, 48, 48, 48); gr.addColorStop(0, rgba(col, .55)); gr.addColorStop(.35, rgba(col, .18)); gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 96, 96);
    g.font = `900 46px "Inter", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = mixCol(col, '#FFFFFF', .35); g.fillText('✳', 48, 50);
    sprites.set(col, c); return c;
  }
  // ---------- crowd layout (perspective rows below the horizon) ----------
  const CROWD = (() => {
    const out = [], R = 34;
    for (let r = 0; r < R; r++) {
      const d = Math.pow(r / (R - 1), 1.7), y = lerp(HOR + 20, H + 60, d), sp = lerp(15, 78, d);
      const n = Math.ceil((W + 300) / sp);
      for (let i = 0; i < n; i++) { const h = hash(r * 997 + i); out.push({ x: -150 + i * sp + (r % 2) * sp / 2 + (h - .5) * sp * .3, y: y + (hash(i * 31 + r) - .5) * sp * .25, s: sp / 64, r, h }); }
    }
    return out;
  })();
  // ---------- word masks: sampled at each stick's screen position ----------
  const masks = new Map();
  function mask(word) {
    if (masks.has(word)) return masks.get(word);
    const c = mkCanvas(W / 4, H / 4), g = c.getContext('2d'), o = { f: 'disp', w: 900, size: 100 };
    const size = fitSize(word, { ...o, size: 470 }, W - 200) / 4;
    g.font = fontStr({ ...o, size }); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff';
    g.fillText(word, W / 8, (HOR + 400) / 4);
    const d = g.getImageData(0, 0, W / 4, H / 4).data, m = new Uint8Array((W / 4) * (H / 4));
    for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 100 ? 1 : 0;
    masks.set(word, m); return m;
  }
  const inMask = (m, x, y) => { const X4 = Math.round(x / 4), Y4 = Math.round(y / 4); return X4 >= 0 && Y4 >= 0 && X4 < W / 4 && Y4 < H / 4 && m[Y4 * (W / 4) + X4] === 1; };

  // ---------- the crowd (shared: CAST.crowd is reused by the finale) ----------
  // cards: [[t, word, colour], ...]; o: { dark: [a, b], burst, z, sx, sy, sway, field, beams }
  function crowd(t, cards, o = {}) {
    const dark = o.dark && t >= o.dark[0] && t < o.dark[1], dk = dark ? 1 - ease((t - o.dark[0]) / .12) : 1;
    X.fillStyle = vgrad([[0, '#07060D'], [.32, PAL.plum], [.36, '#1B1230'], [1, PAL.void]]); X.fillRect(0, 0, W, H);
    glowDot(W / 2, HOR, 900, PAL.violet, .35 * dk);
    if (o.beams !== false) for (let b = 0; b < 6; b++) {
      const a = -Math.PI / 2 + (b - 2.5) * .28 + Math.sin(t * 1.3 + b) * .2 * (b % 2 ? 1 : -1);
      X.save(); X.translate(W / 2 + (b - 2.5) * 220, HOR); X.rotate(a + Math.PI / 2);
      const g = X.createLinearGradient(0, 0, 0, -1100); g.addColorStop(0, rgba(b % 2 ? PAL.lilac : PAL.pink, .22 * dk)); g.addColorStop(1, rgba(PAL.lilac, 0));
      X.fillStyle = g; X.beginPath(); X.moveTo(-14, 0); X.lineTo(14, 0); X.lineTo(120, -1100); X.lineTo(-120, -1100); X.fill(); X.restore();
    }
    const z = o.z ?? 1;
    camBegin(W / 2 + (o.sx || 0), H / 2 + 120 * (z - 1) + (o.sy || 0), z * (1 + .012 * pulse(t, 6)));
    const bp = bpOf(t), field = o.field || FIELD;
    for (const p of CROWD) {
      const delay = (p.x / W) * .22;
      let k = -1; for (let i = cards.length - 1; i >= 0; i--) if (t >= cards[i][0] + delay) { k = i; break; }
      let col = field, a = .18 + .14 * p.h, flip = 1;
      if (k >= 0) {
        const fp = (t - cards[k][0] - delay) / .12; flip = fp < 1 ? Math.abs(Math.cos(fp * Math.PI)) : 1;
        if (cards[k][1] && inMask(mask(cards[k][1]), p.x, p.y)) { col = cards[k][2]; a = 1; }
        else a = .1 + .1 * p.h;
      }
      if (o.dark && t >= o.dark[0] + delay * .3 && t < o.dark[1] + delay) { a = .04; col = field; }      // lights out, row by row
      if (o.burst && t >= o.burst + delay * .5) { col = PAL.bone; a = 1; }
      const sway = Math.sin((bp - p.r * .02) * Math.PI) * 7 * p.s * (dark ? 0 : 1) * (o.sway ?? 1);
      const s = p.s * (a > .9 ? 1.5 : 1) * (.95 + .1 * pulse(t, 8) * (a > .9 ? 1 : 0));
      X.globalAlpha = a; const sp = sprite(col);
      X.drawImage(sp, p.x + sway - 48 * s * flip, p.y - 48 * s, 96 * s * flip, 96 * s);
    }
    X.globalAlpha = 1;
    camEnd();
    return dark;
  }
  CAST.crowd = crowd;

  // ---------- frame ----------
  function stadium(t, lt) {
    bg(PAL.void);
    const z = lerp(2.4, 1, expo(lt / 1.2)), [sx, sy] = shakeXY(t, t > BURST ? 14 * Math.exp(-(t - BURST) * 6) : 0);
    const dark = crowd(t, CARDS, { dark: DARK, burst: BURST, z, sx, sy });
    // holy freeze: the name over the dark crowd
    if (t >= DARK[0] - .02 && t < DARK[1] + .15) {
      const k = clamp((t - DARK[0]) / .18) * (1 - clamp((t - DARK[1]) / .15));
      holy('אֲדֹנָי', W / 2, 330, { f: 'heb', w: 900, size: 230, dir: 'rtl', a: k });
    }
    if (t >= BURST) { const f = 1 - clamp((t - BURST) / .5); rect(0, 0, W, H, PAL.bone, .85 * Math.pow(f, 2) * (t > BURST + .06 ? 1 : (t - BURST) / .06)); }
    // the burst rises to a white-out into the drop
    if (t > E - .25) rect(0, 0, W, H, PAL.paper, ease((t - (E - .25)) / .25));
    post({ bloom: dark ? .3 : .6, grain: .07, vig: .55, chroma: t >= BURST && t < BURST + .2 ? 1 : 0 });
  }
  chapter('chorus3', S, E, [[S, stadium]]);
})();
