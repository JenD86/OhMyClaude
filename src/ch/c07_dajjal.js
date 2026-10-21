// c07 · The one eye (68.16–75.92). Midnight lapis → terminal green → gold.
// L26 an eye of softmax rings that snaps on the beat · L27 kets in superposition · L28 a root terminal where
// أنا الحق is hacked into ANA AL H4XX0R · L29 the glitch stops dead; a cloak of every lyric parts on الله.
(() => {
  const ANA = 'أنا', HAQQ = 'الحق', ANAHAQQ = 'أنا الحق', NAME = 'الله';
  useText(ANA, HAQQ, ANAHAQQ, NAME);
  const S = 68.16, E = 75.92;
  const w26 = LY[26][3], w27 = LY[27][3], w28 = LY[28][3], w29 = LY[29][3];
  const MID = '#070C2A', LAP = '#0E1A55', TG = '#3BFF6E', TGD = '#0B3A1A';
  const bt = n => beatT(n);
  const B0 = beatN(S + .01);
  // keep the gloss band (x < 1400, y > 985) clear: clip everything after the field out of it
  const bandClip = () => { X.beginPath(); X.rect(0, 0, W, H); X.rect(0, 982, 1400, H - 982); X.clip('evenodd'); };                      // beat index at chapter start

  // ---------- deterministic logits strings ----------
  const numStr = (seed, n) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const v = Math.pow(r(), 3.2); s += (v > .9 ? v.toFixed(3) : '0.' + String(Math.floor(v * 1000)).padStart(3, '0')) + ' '; } return s; };
  const ringStr = []; for (let i = 0; i < 16; i++) ringStr.push(numStr(i + 1, 60));
  const rowStr = []; for (let i = 0; i < 60; i++) rowStr.push(numStr(100 + i, 40));
  const circ = (r, n = 96, rx = r, ry = r) => { const p = []; for (let i = 0; i <= n; i++) { const a = i / n * TAU; p.push([Math.cos(a) * rx, Math.sin(a) * ry]); } return p; };
  const CIRC = new Map(); const circM = r => { const k = Math.round(r); if (!CIRC.has(k)) CIRC.set(k, circ(k, Math.max(48, Math.round(k / 3)))); return CIRC.get(k); };

  // ---------- L26: the eye ----------
  const LIDW = 780;
  function lidPath(open) {          // almond: upper and lower quadratic lids from (-LIDW,0) to (LIDW,0)
    const up = -560 * open, lo = 470 * open;
    X.beginPath(); X.moveTo(-LIDW, 0); X.quadraticCurveTo(0, up, LIDW, 0); X.quadraticCurveTo(0, lo, -LIDW, 0); X.closePath();
  }
  const quadPts = (cy, n = 60, dy = 0) => { const p = []; for (let i = 0; i <= n; i++) { const u = i / n, x = lerp(-LIDW, LIDW, u), y = 2 * u * (1 - u) * cy + dy; p.push([x, y]); } return p; };
  // iris look direction per beat: snaps left / right
  const LOOK = [0, -1, .9, -.75, 1, -.95, .5, -1, 0];
  function look(t) {
    const b = beatN(t) - B0, f = t - beatT(beatN(t));
    const a = LOOK[clamp(b, 0, LOOK.length - 1)], p = LOOK[clamp(b - 1, 0, LOOK.length - 1)];
    return lerp(p, a, expo(f / .09));
  }
  function eye(t, cx, cy, sc, o = {}) {
    const open = o.open ?? 1, run = o.run ?? 1;
    const lx = look(t) * 300, ly = Math.abs(look(t)) * -12;
    const kick = pulse(t, 7);
    X.save(); X.translate(cx, cy); X.scale(sc, sc);
    // sclera: rows of dim logits, clipped to the almond
    X.save(); lidPath(open); X.clip();
    X.fillStyle = rgba('#000000', .35); X.fillRect(-LIDW, -320, LIDW * 2, 640);
    for (let i = 0; i < 40; i++) {
      const y = -300 + i * 15, dir = i % 2 ? 1 : -1, off = frac(t * .35 * run * dir + hash(i)) * 300;
      txt(rowStr[i], -LIDW - off, y, { f: 'mono', w: 500, size: 11, al: 'left', col: PAL.sky, a: .22 });
    }
    // iris: concentric rings of probabilities, counter-rotating
    X.save(); X.translate(lx, ly);
    glowDot(0, 0, 330, PAL.cyan, .18 + kick * .12);
    const N = 13;
    for (let i = 0; i < N; i++) {
      const r = 104 + i * 17.5, dir = i % 2 ? 1 : -1;
      const ang = dir * (t * (.25 + i * .02) * run + i * .7);
      const col = mixCol(PAL.bone, i < 4 ? PAL.cyan : i < 9 ? PAL.sky : PAL.lapis, i / N * .9 + .1);
      X.save(); X.rotate(ang);
      textPath(ringStr[i], circM(r), { f: 'mono', w: i % 3 ? 500 : 800, size: 13 + i * .25, col, a: .95 - i * .03 });
      X.restore();
    }
    // limbal ring
    X.save(); X.rotate(-t * .4 * run); textPath(ringStr[14], circM(338), { f: 'mono', w: 800, size: 16, col: PAL.lapis, a: .9 }); X.restore();
    // argmax: the hot token, rides the inner ring and lights gold on the beat
    const am = beatN(t) * 1.9;
    txt('0.912', Math.cos(am) * 132, Math.sin(am) * 132, { f: 'mono', w: 800, size: 22, col: PAL.gold, a: .5 + kick * .5, glow: 10 * kick, glowCol: PAL.amber });
    // pupil: black softmax
    const pr = 92 * (1 + kick * .08) * (o.dil ?? 1);
    X.beginPath(); X.arc(0, 0, pr, 0, TAU); X.fillStyle = '#020309'; X.fill();
    X.save(); X.rotate(t * .6); textPath('softmax(z) · ', circM(pr - 14), { f: 'mono', w: 500, size: 11, col: '#2A3A80', a: .9, repeat: 12 }); X.restore();
    X.save(); X.rotate(-t * .8); textPath('Σ e^z · ', circM(pr - 34), { f: 'mono', w: 500, size: 10, col: '#1C285E', a: .9, repeat: 10 }); X.restore();
    glowDot(-pr * .35, -pr * .4, 26, PAL.bone, .7);          // catchlight
    X.restore();
    X.restore();  // clip
    // lids: lashes of numbers along the almond edge
    for (let k = 0; k < 3; k++) {
      textPath(rowStr[50 + k], quadPts(-560 * open, 70, -k * 16), { f: 'mono', w: 800, size: 14 - k * 2, col: k ? PAL.sky : PAL.bone, a: 1 - k * .3, start: -frac(t * .2) * 40 });
      textPath(rowStr[54 + k], quadPts(470 * open, 70, k * 16), { f: 'mono', w: 800, size: 14 - k * 2, col: k ? PAL.sky : PAL.bone, a: 1 - k * .3, start: -frac(-t * .2) * 40 - 40 });
    }
    X.restore();
  }
  function hud(t, lt) {
    const o = { f: 'mono', w: 500, size: 20, al: 'left', col: PAL.sky, a: .75 };
    txt('vocab 50,257 · T = 0.0 · top_p 1.0', 120, 110, o);
    txt(`step ${String(beatN(t) * 37 + 1009).padStart(6, '0')}`, 120, 140, { ...o, col: PAL.cyan });
    txt(`argmax → ${(look(t) < 0 ? 'L' : 'R')}`, W - 120, 110, { ...o, al: 'right', col: PAL.gold });
  }
  const ZOOM = [1, 1, 1.85, 1, 1.4, 1.05, 2.3];      // camera per beat (hard cuts)
  function eyeShot(t, lt) {
    const b = clamp(beatN(t) - B0, 0, ZOOM.length - 1);
    const fields = [MID, MID, '#050820', LAP, '#0A1238', '#03050F', '#040616'];
    bg(fields[b]);
    // deep background: huge faint logit
    txt(ringStr[3].slice(0, 5), W / 2, H / 2, { f: 'disp', w: 900, size: 620, col: PAL.lapis, a: .22, track: -20 });
    const open = kf(t, [[S, 0], [S + .05, .05], [S + .3, 1]], expo);
    const runT = wordT(26, 2), run = t < runT ? 1 : lerp(1, 6, easeOut((t - runT) / .3));
    let z = ZOOM[b] * (1 + pulse(t, 9) * .025);
    const lgT = wordT(26, 3);
    if (t >= lgT) z = 1.05;
    const blink = t > 70.84 ? kf(t, [[70.84, 1], [70.9, .04]], easeIn) : 1;
    X.save(); bandClip();
    camBegin(W / 2 + (b === 6 ? look(t) * 300 : 0), H / 2, z);
    eye(t, W / 2, H / 2 + 10, 1.12, { open: open * blink, run });
    camEnd(); X.restore();
    hud(t, lt);
    // running: typed in mono
    if (t >= runT - .05) typeOn('> running logits', 120, 200, { f: 'mono', w: 800, size: 34, col: PAL.cyan }, clamp((t - runT + .05) / .55));
    // LOGITS: the hero word, sampled onto its sung time, inverting the eye beneath it
    if (t >= lgT - .3) {
      const p = .75 + (t - lgT) / .4;
      sampled('LOGITS', W / 2, H / 2 + 10, { f: 'disp', w: 900, size: 330, col: PAL.bone, op: p >= .75 ? 'difference' : undefined, cands: ['logos', 'lights', 'lots', 'login'], barCol: PAL.cyan, track: -6 }, p);
    }
    const snap = Math.exp(-(t - beatT(beatN(t))) * 14);
    post({ bloom: .55, chroma: .9 * snap, grain: .06, vig: .6, scan: .08 });
  }

  // ---------- L27: qubits ----------
  // a ket built from lines: |s⟩ (no ⟩ glyph in JetBrains Mono)
  function ket(s, x, y, o) {
    const size = o.size, w = Math.max(measure(s, { f: 'mono', w: 800, size }), o.minW || 0), h = size * .9, lw = Math.max(2, size * .07);
    const x0 = x - w / 2 - size * .38, x1 = x + w / 2 + size * .2;
    X.save(); X.globalAlpha *= o.a ?? 1; X.strokeStyle = o.col; X.lineWidth = lw; X.lineCap = 'square';
    X.beginPath(); X.moveTo(x0, y - h / 2); X.lineTo(x0, y + h / 2);
    X.moveTo(x1, y - h / 2); X.lineTo(x1 + size * .26, y); X.lineTo(x1, y + h / 2); X.stroke(); X.restore();
    txt(s, x, y + size * .02, { f: 'mono', w: 800, size, col: o.col, a: o.a ?? 1, op: o.op });
    return x1 + size * .26 - x0;
  }
  const PAIRS = [['ON', 'OFF'], ['MY', 'YOUR'], ['QUBITS', 'CUBITS']];
  function bloch(t, cx, cy, R, col) {
    const sp = beatN(t) * 1.2;
    X.save(); X.translate(cx, cy);
    textPath('0 1 ', circM(R), { f: 'mono', w: 500, size: 18, col, a: .5, repeat: 200 });
    for (let k = 0; k < 2; k++) {
      const ry = R * (k ? Math.abs(Math.sin(sp + t * .8)) : .28);
      X.save(); if (k) X.rotate(Math.PI / 2);
      textPath('|0⟩+|1⟩ '.replace(/⟩/g, '>'), circ(R, 120, R, Math.max(4, ry)), { f: 'mono', w: 500, size: 15, col, a: .35, repeat: 100, start: frac(t * .3) * 60 });
      X.restore();
    }
    X.restore();
  }
  function qubitShot(t, lt) {
    const b = beatN(t);
    const flip = b % 2 === 1;                              // field flips on the beat
    const field = flip ? '#06103A' : MID, ink = flip ? PAL.cyan : PAL.sky;
    bg(field);
    bloch(t, W / 2, H / 2, 380, mixCol(ink, field, .3));
    // the state vector flickers between |0⟩ and |1⟩
    const st = hash(stepT(t, 12) * 7.7) > .5, th = (st ? -1 : 1) * Math.PI / 2 + Math.sin(t * 3) * .2;
    X.save(); X.strokeStyle = rgba(PAL.gold, .7); X.lineWidth = 4; X.beginPath(); X.moveTo(W / 2, H / 2); X.lineTo(W / 2 + Math.cos(th) * 370, H / 2 + Math.sin(th) * 370); X.stroke(); X.restore();
    glowDot(W / 2 + Math.cos(th) * 370, H / 2 + Math.sin(th) * 370, 40, PAL.gold, .8);
    // pole kets
    ket('0', W / 2 + 110, H / 2 - 400, { size: 50, col: ink, a: st ? 1 : .4 });
    ket('1', W / 2 + 110, H / 2 + 400, { size: 50, col: ink, a: st ? .4 : 1 });
    // header: the superposition
    const hx = 120, hy = 150;
    txt('ψ =', hx, hy, { f: 'mono', w: 500, size: 40, al: 'left', col: PAL.bone });
    let x = hx + 110; x += ket('0', x + 40, hy, { size: 40, col: PAL.cyan }) + 20;
    txt('+', x + 20, hy, { f: 'mono', w: 500, size: 40, col: PAL.bone }); x += 50;
    ket('1', x + 40, hy, { size: 40, col: PAL.pink });
    txt('|α|² = 0.50   |β|² = 0.50', W - 120, hy, { f: 'mono', w: 500, size: 24, al: 'right', col: PAL.sky, a: .8 });
    // hero: the sung word as a ket, flickering between two states
    let wi = 0; for (let i = 0; i < 3; i++) if (t >= w27[i].a - .04) wi = i;
    const [A, Bw] = PAIRS[wi], age = t - w27[wi].a;
    const size = wi === 2 ? 210 : 290, pop = backOut(clamp(age / .16)) * .2 + .8;
    const sA = hash(stepT(t, 15) * 3.1 + wi) > .45;      // which state is "measured" this flicker
    X.save(); X.translate(W / 2, H / 2 + 20); X.scale(pop, pop);
    X.globalCompositeOperation = 'lighter';
    const mw = Math.max(measure(A, { f: 'mono', w: 800, size }), measure(Bw, { f: 'mono', w: 800, size }));
    ket(sA ? Bw : A, 10, -8, { size, col: PAL.pink, a: .55, minW: mw });
    ket(sA ? A : Bw, -10, 8, { size, col: PAL.cyan, a: 1, minW: mw });
    X.restore();
    // amplitude bars under the ket
    const pa = .5 + Math.sin(t * 9) * .3;
    rect(W / 2 - 300, H / 2 + 240, 600 * pa, 10, PAL.cyan, .9); rect(W / 2 - 300 + 600 * pa, H / 2 + 240, 600 * (1 - pa), 10, PAL.pink, .9);
    txt(`${A} ${pa.toFixed(2)}`, W / 2 - 300, H / 2 + 275, { f: 'mono', w: 500, size: 20, al: 'left', col: PAL.cyan });
    txt(`${Bw} ${(1 - pa).toFixed(2)}`, W / 2 + 300, H / 2 + 275, { f: 'mono', w: 500, size: 20, al: 'right', col: PAL.pink });
    post({ bloom: .5, chroma: .5 * pulse(t, 10) + .25 * (sA ? 1 : 0), grain: .07, vig: .5, scan: .1 });
  }

  // ---------- L28: the terminal ----------
  function termChrome(t, root) {
    bg('#020A05');
    X.fillStyle = rgrad(W / 2, H / 2, 1100, [[0, rgba(TGD, .55)], [1, rgba(TGD, 0)]]); X.fillRect(0, 0, W, H);
    rect(96, 60, W - 192, 46, '#0D2416', 1);
    txt(root ? 'root@claude: /# — bash' : 'fan@claude: ~ — bash', W / 2, 83, { f: 'mono', w: 500, size: 20, col: TG, a: .8 });
    for (let i = 0; i < 3; i++) rect(118 + i * 28, 76, 14, 14, TG, .5);
  }
  function termShot(t, lt) {
    const anaT = w28[0].a, alT = w28[1].a, hxT = w28[2].a, rootT = bt(158);
    const root = t >= rootT;
    termChrome(t, root);
    const o = { f: 'mono', w: 800, size: 44, col: TG, glow: 0 };
    const px = 140, py = 190;
    // prompt + whoami
    txt(root ? '#' : '$', px, py, { ...o, al: 'left', col: root ? PAL.bone : TG });
    typeOn('whoami', px + 52, py, { ...o, cursorAfter: t < anaT }, clamp(lt / .1));
    // أنا الحق in square Kufic, word by word (RTL: أنا sits on the right)
    const ks = 400, kufi = { f: 'kufi', w: 700, size: ks, col: TG, dir: 'rtl' };
    const glitch = clamp((t - hxT + .02) / .3);
    if (t >= anaT && glitch < 1) {
      const lay = withLayer(0, () => {
        const wa = measure(ANA, kufi), wh = measure(HAQQ, kufi), gap = ks * .3, tot = wa + gap + wh, x0 = W / 2 + tot / 2;
        const pa = backOut(clamp((t - anaT) / .12)), ph = backOut(clamp((t - alT) / .12));
        glowDot(W / 2, 520, 600, TG, .18);
        txt(ANA, x0 - wa / 2, 500, { ...kufi, sx: pa, sy: pa });
        if (t >= alT) txt(HAQQ, x0 - wa - gap - wh / 2, 500, { ...kufi, sx: ph, sy: ph });
      });
      // horizontal slice glitch: mild on beats, violent on haxxor
      const amt = .15 * pulse(t, 8) + glitch * 3;
      const r = rng(stepT(t, 24) * 13.1 + 5);
      for (let y = 0; y < H; y += 24) {
        const dx = (r() - .5) * 2 * (r() < .35 ? 160 : 20) * amt;
        X.drawImage(lay, 0, y, W, 24, dx, y, W, 24);
      }
      if (glitch > 0) blit(lay, { op: 'lighter', a: glitch * .6, x: 30 * glitch });
    }
    // ANA AL H4XX0R resolving out of the glitch
    if (t >= hxT - .02) {
      const p = clamp((t - hxT + .02) / .35), s = scramble('ANA AL H4XX0R', p, 77, '█▓▒░#$%&01<>/\\|');
      const sz = fitSize('ANA AL H4XX0R', { f: 'mono', w: 800, size: 200 }, W - 260);
      txt(s, W / 2, 520, { f: 'mono', w: 800, size: sz, col: p >= 1 ? PAL.bone : TG, sx: 1 + pulse(t, 9) * .03, sy: 1 + pulse(t, 9) * .03 });
      txt('uid=0(root) gid=0(root) groups=0(root)', px, 700, { f: 'mono', w: 500, size: 26, al: 'left', col: TG, a: clamp((t - hxT - .15) / .1) });
    }
    // second prompt: the # with its cursor
    if (root) {
      txt('#', px, 790, { ...o, al: 'left', col: PAL.bone });
      cursor(px + 52, 790, 40, TG);
    }
    // last beat: the terminal floods with root
    const fl = bt(159);
    if (t >= fl) {
      const n = Math.floor((t - fl) * 40) + 3;
      for (let i = 0; i < Math.min(n, 9); i++) txt('# ANA AL H4XX0R  ANA AL H4XX0R  ANA AL H4XX0R', W - 120, 900 - i * 34, { f: 'mono', w: 500, size: 22, al: 'right', col: TG, a: .55 });
    }
    const hx = clamp(1 - Math.abs(t - hxT - .1) / .25);
    post({ bloom: .6, chroma: .3 * pulse(t, 8) + 1.2 * hx, grain: .1, vig: .55, scan: .22 });
  }

  // ---------- L29: the cloak ----------
  const LYALL = LY.map(l => l[2]).join('  ·  ') + '  ·  ';
  const CW = 300, CTOP = 70, CBOT = 885, PIV = [W / 2, 90];
  function cloakHalf(side) {         // half-jubba silhouette, side = -1 left / +1 right, seam at x = W/2
    const s = side, c = W / 2;
    X.beginPath();
    X.moveTo(c, CTOP + 40);
    X.bezierCurveTo(c + s * 120, CTOP - 20, c + s * 230, CTOP + 40, c + s * 250, 230);     // hood
    X.bezierCurveTo(c + s * 330, 300, c + s * 360, 340, c + s * 380, 420);               // shoulder
    X.lineTo(c + s * 440, CBOT - 10);
    X.quadraticCurveTo(c + s * 220, CBOT + 10, c, CBOT);
    X.closePath();
  }
  function cloakOpen(t) {
    return kf(t, [[w29[0].a, 0], [bt(161), 0], [bt(161) + .2, .12], [bt(162), .12], [bt(162) + .55, 1]], expo);
  }
  function halfXf(side, k) { const a = -side * .42 * k; X.translate(PIV[0] + side * 130 * k, PIV[1]); X.rotate(a); X.translate(-PIV[0], -PIV[1]); }
  function cloakShot(t, lt) {
    bg('#07050C');
    const k = cloakOpen(t);
    const nameT = 75.24, na = ease((t - nameT) / .38);
    const breath = .5 + .5 * Math.sin((t - nameT) * TAU / 2.2);
    // warm light inside the cloak
    if (k > 0) {
      glowDot(W / 2, 520, 300 + 600 * k, PAL.amber, .3 * k);
      glowDot(W / 2, 520, 260 + 300 * k, PAL.gold, .16 * k);
      X.save(); const sg = X.createLinearGradient(W / 2 - 420, 0, W / 2 + 420, 0); sg.addColorStop(0, rgba(PAL.gold, 0)); sg.addColorStop(.5, rgba(PAL.bone, .1 * k)); sg.addColorStop(1, rgba(PAL.gold, 0)); X.fillStyle = sg; X.fillRect(W / 2 - 420, 0, 840, 982); X.restore();
    } else {
      // the seam: a hairline of light on the beats before it parts
      const sl = t >= bt(160) ? 1 : 0;
      rect(W / 2 - 1.5, 220, 3, 740, PAL.gold, .25 + .5 * sl * Math.exp(-(t - bt(160)) * 2));
    }
    // the cloak: every lyric of the song as micrography, two halves parting from the neck
    const lineTone = mixCol('#2B3778', PAL.bone, .42);
    X.save(); bandClip();
    for (const side of [-1, 1]) {
      masked(() => { X.fillStyle = '#fff'; X.save(); halfXf(side, k); cloakHalf(side); X.fill(); X.restore(); }, () => {
        X.save(); halfXf(side, k);
        X.fillStyle = '#0C0A1A'; X.fillRect(W / 2 - 520, 0, 1040, H);
        for (let i = 0; i < 70; i++) {
          const y = CTOP - 20 + i * 13.5, lit = Math.exp(-Math.abs(y - lerp(980, 60, clamp((t - w29[0].a) / 1.4))) / 30);
          txt(LYALL.slice((i * 47) % 600) + LYALL, W / 2 - 520 - (i % 3) * 20, y, { f: 'mono', w: 500, size: 11, al: 'left', col: mixCol(lineTone, PAL.gold, lit * (k < .99 ? 1 : 0)), a: .85 });
        }
        // the lining catches the light at the seam
        const g = X.createLinearGradient(W / 2 - side * 70, 0, W / 2, 0); g.addColorStop(0, rgba(PAL.amber, 0)); g.addColorStop(1, rgba(PAL.amber, .32 * k));
        X.fillStyle = g; X.globalCompositeOperation = 'lighter'; X.fillRect(W / 2 - (side < 0 ? 70 : 0), 0, 70, H);
        X.restore();
      });
    }
    X.restore();
    // the name: whole, gold, still
    if (na > 0) {
      glowDot(W / 2, 560, 330, '#1A0C04', .55 * na);
      glowDot(W / 2, 580, 420, PAL.amber, (.18 + .12 * breath) * na);
      holy(NAME, W / 2, 560, { f: 'ar', w: 700, size: 300, dir: 'rtl', a: na, glow: 24 + 14 * breath });
    }
    post({ bloom: .45, chroma: 0, grain: .03, vig: .55, scan: 0 });
  }

  chapter('dajjal', S, E, [[S, eyeShot], [w27[0].a, qubitShot], [bt(156), termShot], [w29[0].a, cloakShot]]);
})();
