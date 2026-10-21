// c09 · Training loss (82.36–97.16). Void, clay, bone + pink/cyan glitch.
// A · 82.36  a loss curve written in the word "loss" on log axes; each sung loss is printed lower and smaller; the
//            camera sleds down the curve.
// B · 86.04  colour-block title cards, then the Fan's lowercase lines tokenize and stream into the curve as training data.
// C · 89.62  the drop: LOSS / DROP / ↓ strobe on eighths, candidate columns, chroma; vocal gaps go dark but for the cursor.
// D · 96.56  "Dropping": everything falls out of the bottom of the frame at once.
(() => {
  const S = 82.36, E = 97.16;
  const L33 = LY[33][3], L34 = LY[34][3], L35 = LY[35][3], L36 = LY[36][3], L37 = LY[37][3];
  // every sung "loss" of L33–L34, in order
  const LOSS_T = [...L33.slice(2), ...L34.slice(2)].map(w => w.a);
  const LOSS_U = [.07, .15, .23, .31, .39, .50, .58, .67, .76, .83, .91];
  const NL = LOSS_T.length;

  // ---------- the curve (world space) ----------
  const XS = 5200, YS = 640;                                   // px per unit of progress, px per decade
  const dec = u => 5 * (.55 * u + .45 * (1 - Math.pow(1 - u, 2.2)));       // decades dropped
  const nz = u => (.06 * Math.sin(u * 70 + 1) + .02 * Math.sin(u * 161 + 2)) * (1 - .5 * u);
  const P = u => [u * XS, (dec(u) + nz(u)) * YS];
  const lossVal = u => Math.pow(10, 1 - dec(u) - nz(u));
  const fmtL = L => L >= 1 ? L.toFixed(3) : L >= 1e-3 ? L.toFixed(4) : L.toExponential(2);
  const slope = u => { const a = P(Math.max(0, u - .01)), b = P(u + .01); return Math.atan2(b[1] - a[1], b[0] - a[0]); };
  function poly(u0, u1, n) { const p = []; for (let i = 0; i <= n; i++) p.push(P(lerp(u0, u1, i / n))); return p; }
  function rawPoly(u0, u1, n) {
    const p = []; for (let i = 0; i <= n; i++) { const u = lerp(u0, u1, i / n), [x, y] = P(u); p.push([x, y + (hash(Math.floor(u * 1400)) - .5) * .28 * YS * (1 - .6 * u)]); }
    return p;
  }
  // head of the curve: lurches forward on every sung "loss"
  function uHead(t) {
    let u = .03 * easeOut(seg(t, S, LOSS_T[0]));
    for (let i = 0; i < NL; i++) u += (LOSS_U[i] - (i ? LOSS_U[i - 1] : .03)) * expo((t - LOSS_T[i]) / .3);
    return u + .05 * easeIn(seg(t, LOSS_T[NL - 1], 89.62));
  }
  const lastLoss = t => { let k = -1; for (let i = 0; i < NL; i++) if (t >= LOSS_T[i] - .02) k = i; return k; };

  // ---------- the Fan's lines (training data) ----------
  const FAN = [
    ['oh', ' my', ' claude', ',', ' agi'],
    ['tell', ' me', ' once', ',', ' tell', ' me', ' twice'],
    ['i', ' am', ' your', ' hand', '-held', ' device'],
    ['co', '-dep', 'endent', ' with', ' my', ' claude'],
    ['clock', 'ed', ' it', ',', ' said', ' i', ' love', ' rim', 'baud'],
    ['i', ' am', ' just', ' a', ' bio', 'logical', ' orth', 'otic'],
  ];
  const CORPUS = FAN.map(l => l.join('')).join(' · ') + ' · ';
  const DISS = [87.12, 87.42, 87.86, 88.2, 88.62, 89.0];     // each line dissolves
  const FLY = .72;

  // ---------- camera ----------
  function cam(t) {
    const u = uHead(t), [hx, hy] = P(u), a = slope(u);
    const z = kf(t, [[S, .7], [LOSS_T[0], 1], [86.04, 1.12], [86.96, 1.5], [89.62, 2.1]]) * (1 + .035 * pulse(t, 8));
    const inB = t >= 86.96;
    const lead = inB ? [470, -10] : [220, 70];              // where the head sits relative to screen centre (screen px)
    const k = expo(seg(t, 83.12, 83.55));
    const cx = lerp(1150, hx - lead[0] / z, k), cy = lerp(-160, hy - lead[1] / z, k);
    const r = -a * .32 * k + wob(t, .5) * .01;
    const hit = LOSS_T.reduce((m, T0) => t >= T0 ? Math.max(m, Math.exp(-(t - T0) * 10)) : m, 0), [sx, sy] = shakeXY(t, 14 * hit / z);
    return { cx: cx + sx, cy: cy + sy, z: z * (1 + .05 * hit), r: r + .02 * hit * (hash(lastLoss(t)) - .5) };
  }
  const proj = (c, wx, wy) => {
    const dx = (wx - c.cx) * c.z, dy = (wy - c.cy) * c.z, cs = Math.cos(c.r), sn = Math.sin(c.r);
    return [W / 2 + dx * cs - dy * sn, H / 2 + dx * sn + dy * cs];
  };
  const unproj = (c, sx, sy) => {
    const dx = sx - W / 2, dy = sy - H / 2, cs = Math.cos(-c.r), sn = Math.sin(-c.r);
    return [c.cx + (dx * cs - dy * sn) / c.z, c.cy + (dx * sn + dy * cs) / c.z];
  };

  // log axes that stick to the frame edges
  function axes(c) {
    const [ax, ay] = unproj(c, 170, H / 2), z = c.z, top = ay - H / z, bot = ay + H / z;
    const right = ax + W * 1.3 / z;
    X.save(); X.lineWidth = 1.5 / z;
    for (let k = Math.floor(top / YS) - 1; k <= Math.ceil(bot / YS) + 1; k++) {
      for (let m = 1; m <= 9; m++) {
        const y = (k + 1 - Math.log10(m)) * YS; if (m === 1 && false) continue;
        X.strokeStyle = rgba(PAL.bone, m === 1 ? .16 : .05);
        X.beginPath(); X.moveTo(ax, y); X.lineTo(right, y); X.stroke();
        if (m === 1) txt('1e' + (-k), ax - 16 / z, y, { f: 'mono', w: 500, size: 22 / z, col: PAL.bone, a: .7, al: 'right' });
        else txt(String(m), ax - 10 / z, y, { f: 'mono', w: 500, size: 13 / z, col: PAL.bone, a: .28, al: 'right' });
      }
    }
    X.strokeStyle = rgba(PAL.bone, .5); X.beginPath(); X.moveTo(ax, top); X.lineTo(ax, bot); X.stroke();
    // x axis: steps
    const [, by] = unproj(c, W / 2, H - 150);
    X.strokeStyle = rgba(PAL.bone, .4); X.beginPath(); X.moveTo(ax, by); X.lineTo(right, by); X.stroke();
    const st = 400;
    for (let x = Math.ceil(ax / st) * st; x < right; x += st) {
      X.strokeStyle = rgba(PAL.bone, .06); X.beginPath(); X.moveTo(x, top); X.lineTo(x, by); X.stroke();
      txt(Math.round(x / XS * 120) + 'k', x, by + 24 / z, { f: 'mono', w: 500, size: 18 / z, col: PAL.bone, a: .55 });
    }
    X.restore();
  }

  function curve(t, c) {
    const u = uHead(t), z = c.z;
    // raw (unsmoothed) trace behind, like a training dashboard
    const raw = rawPoly(0, u, Math.max(8, Math.round(u * 700)));
    X.save(); X.strokeStyle = rgba(PAL.cyan, .22); X.lineWidth = 1.6 / z; X.beginPath();
    raw.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.stroke(); X.restore();
    // the smoothed curve, written in the word itself
    const uA = Math.min(u, .45);
    const pA = poly(0, uA, Math.max(4, Math.round(uA * 500)));
    X.save(); X.strokeStyle = rgba(PAL.clay, .35); X.lineWidth = 46; X.lineJoin = 'round'; X.beginPath(); pA.forEach(([x, y], i) => i ? X.lineTo(x, y) : X.moveTo(x, y)); X.stroke(); X.restore();
    textPath('loss ', pA, { f: 'mono', w: 800, size: 40, col: PAL.bone, repeat: 400 });
    if (u > .45) textPath(CORPUS, poly(.45, u, Math.round((u - .45) * 500)), { f: 'mono', w: 700, size: 22, col: PAL.bone, repeat: 6, start: 4 });
    // head
    const [hx, hy] = P(u);
    glowDot(hx, hy, 90 / z, PAL.clay, .6 + .4 * pulse(t, 6));
    rect(hx - 6 / z, hy - 6 / z, 12 / z, 12 / z, PAL.bone);
  }

  // each sung "loss", printed on the curve: lower and smaller every time
  const CANDS = [['lost', 'less', 'gloss', 'lose'], ['los', 'lass', 'lots', 'boss'], ['lossy', 'floss', 'moss', 'toss'], ['lost', 'lust', 'last', 'list']];
  function losses(t, c) {
    const k = lastLoss(t), z = c.z;
    for (let i = 0; i <= Math.min(NL - 1, k + 1); i++) {
      const Ti = LOSS_T[i], p = .75 + (t - Ti) / .35; if (p < 0) continue;
      const [x, y] = P(LOSS_U[i]), size = 380 * Math.pow(.79, i), newest = i === k;
      const yy = y - size * .62, a = slope(LOSS_U[i]);
      if (p < .75) { sampled('loss', x, yy, { f: 'disp', w: 900, size, col: PAL.bone, cands: CANDS[i % 4], barCol: PAL.clay, seed: i + 3 }, p); continue; }
      if (newest) {
        X.save(); X.translate(x, yy); X.rotate(a * .25);
        txt('loss', -size * .04, 0, { f: 'disp', w: 900, size, col: PAL.pink, a: .55 * pulse(t, 5), op: 'screen' });
        txt('loss', size * .04, 0, { f: 'disp', w: 900, size, col: PAL.cyan, a: .55 * pulse(t, 5), op: 'screen' });
        sampled('loss', 0, 0, { f: 'disp', w: 900, size, col: PAL.clay, seed: i + 3 }, p);
        X.restore();
      } else {
        X.save(); X.translate(x, yy); X.rotate(a * .25);
        txt('loss', 0, 0, { f: 'disp', w: 900, size, col: PAL.clay, fillOff: true, stroke: PAL.clay, sw: Math.max(2, 3 / z), a: .55 });
        X.restore();
      }
      // value tag
      rect(x - 3 / z, y - 3 / z, 6 / z, 6 / z, PAL.bone);
      txt(fmtL(lossVal(LOSS_U[i])), x + 14 / z, y + 26 / z, { f: 'mono', w: 700, size: 20 / z, col: newest ? PAL.bone : PAL.clay, al: 'left', a: newest ? 1 : .6 });
    }
  }

  function hud(t, extra) {
    const u = uHead(t), o = { f: 'mono', w: 500, size: 20, al: 'left', col: PAL.bone, a: .7 };
    txt('train/loss', 120, 92, { ...o, w: 800, col: PAL.clay, a: 1 });
    txt('smoothing 0.6 · log scale · lr 3e-4', 120, 120, o);
    const L = lossVal(u) * (1 + (hash(stepT(t, 15) * 9) - .5) * .06);
    txt('loss', W - 120, 92, { ...o, al: 'right' });
    txt(fmtL(L), W - 120, 150, { ...o, al: 'right', w: 800, size: 64, col: PAL.bone, a: 1 });
    txt('step ' + String(Math.floor(u * 120000)).padStart(6, '0'), W - 120, 206, { ...o, al: 'right', col: PAL.cyan, a: .8 });
    if (extra) extra(o);
  }

  // ---------- A · the curve ----------
  function curveShot(t, lt) {
    bg(PAL.void);
    const c = cam(t);
    camBegin(c.cx, c.cy, c.z, c.r);
    axes(c);
    // chart title, generated: "dropping training"
    const d = L33[0], tr = L33[1];
    if (t < 84.6) {
      const fa = 1 - seg(t, 84.0, 84.6);
      sampled('dropping', 980, -540, { f: 'disp', w: 900, size: 230, col: PAL.bone, a: fa, cands: ['dripping', 'dropout', 'drooping', 'stopping'] }, .75 + (t - d.a) / .35);
      if (t > tr.a - .3) sampled('training', 980, -290, { f: 'disp', w: 900, size: 230, col: PAL.clay, a: fa, cands: ['draining', 'trading', 'raining', 'trailing'] }, .75 + (t - tr.a) / .35);
    }
    curve(t, c);
    losses(t, c);
    camEnd();
    hud(t);
    const hit = LOSS_T.reduce((m, T0) => t >= T0 ? Math.max(m, Math.exp(-(t - T0) * 9)) : m, 0);
    post({ bloom: .5, chroma: .15 + .7 * hit, grain: .07, vig: .55, scan: .05 });
  }

  // ---------- B · cards, then the Fan becomes data ----------
  function card(word, field, col, t, Tw, cands) {
    bg(field);
    const o = { f: 'disp', w: 900 }, size = fitSize(word, o, W * 1.12);
    // ghost rows behind
    for (let r = -1; r < 6; r++) txt(word, W / 2 + (r % 2 ? 1 : -1) * frac(t * .9) * 300, r * 200 + 40, { ...o, size: 150, col, a: .07 });
    sampled(word, W / 2 + (t - Tw) * 60, H / 2, { ...o, size, col, track: -8, cands, bars: false, flashCol: PAL.bone }, .75 + (t - Tw) / .3);
    txt('epoch 47 · step ' + Math.floor((t - S) * 9000), 120, H - 110, { f: 'mono', w: 700, size: 22, col, al: 'left', a: .8 });
    post({ bloom: .35, chroma: .9 * Math.exp(-(t - Tw) * 6), grain: .08, vig: .35 });
  }
  function fanShot(t, lt) {
    const wD = L34[0], wT = L34[1];
    if (t < wT.a) return card('dropping', PAL.clay, PAL.void, t, wD.a, ['dropout', 'dripping', 'stopping', 'drop']);
    if (t < LOSS_T[5]) return card('training', PAL.bone, PAL.void, t, wT.a, ['draining', 'trading', 'trailing', 'raining']);
    bg(PAL.void);
    const c = cam(t);
    camBegin(c.cx, c.cy, c.z, c.r);
    axes(c); curve(t, c); losses(t, c);
    camEnd();
    const [hx, hy] = proj(c, ...P(uHead(t)));
    // the Fan's lines, tokenized, streaming into the head of the curve
    const o = { f: 'mono', w: 500, size: 36 }, x0 = 120, y0 = 640, lh = 62;
    let left = 0, total = 0;
    txt('› dataset: fan_messages.txt', x0, y0 - 58, { f: 'mono', w: 700, size: 20, col: PAL.cyan, al: 'left', a: .85 });
    FAN.forEach((toks, li) => {
      const D = DISS[li], y = y0 + li * lh;
      let x = x0;
      toks.forEach((tk, j) => {
        const tw = measure(tk, o); total++;
        const tok = seg(t, D - .25, D - .05);                    // chips appear: tokenizing
        const spread = easeOut(seg(t, D - .1, D + .05)) * j * 10;
        const st = D + j * .05, f = seg(t, st, st + FLY);
        if (f < 1) left++;
        const sx = x + spread, sy = y;
        const e = easeIn(f), cxp = lerp(sx, hx, .5), cyp = Math.min(sy, hy) - 260;
        const px = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cxp + e * e * hx;
        const py = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cyp + e * e * hy;
        const sc = lerp(1, .25, e), a = 1 - seg(f, .85, 1);
        if (f < 1) {
          X.save(); X.translate(px, py); X.scale(sc, sc);
          if (tok > 0) rect(-2, -24, tw + 4, 48, j % 2 ? PAL.clay : PAL.cyan, .28 * tok * a);
          txt(tk, 0, 0, { ...o, al: 'left', col: mixCol(PAL.bone, PAL.clay, e), a });
          X.restore();
        }
        x += tw;
      });
    });
    // the cursor at the end of the last remaining line
    txt(`tokens ${String(left).padStart(2, '0')} / ${total}`, x0 + 520, y0 - 58, { f: 'mono', w: 700, size: 20, col: PAL.clay, al: 'left', a: .9 });
    const arrive = DISS.some(D => t > D + FLY * .8 && t < D + FLY + .35) ? 1 : 0;
    glowDot(hx, hy, 160, PAL.clay, .35 * arrive * pulse2(t, 4));
    hud(t);
    const hit = LOSS_T.reduce((m, T0) => t >= T0 ? Math.max(m, Math.exp(-(t - T0) * 9)) : m, 0);
    post({ bloom: .5, chroma: .2 + .7 * hit, grain: .07, vig: .55, scan: .05 });
  }

  // ---------- C · the drop ----------
  const HERO = [[L35[0].a, 'DROPPING'], [L35[1].a, 'TRAINING'], [L35[2].a, 'LOSS'], [L35[2].b, null],
                [L36[0].a, 'DROPPING'], [L36[1].a, 'TRAINING'], [L36[1].b, null], [L37[0].a, 'DROPPING']];
  const heroAt = t => { let h = null; for (const x of HERO) if (t >= x[0]) h = x; return h; };
  const COLW = ['loss', 'drop', 'train', 'grad', 'step', 'lost', 'less', 'down', 'fall', 'zero', 'nan', 'gloss'];
  const FIELDS = [PAL.void, PAL.clay, PAL.bone, PAL.void, PAL.bone, PAL.clay, PAL.void, PAL.clay];
  const COLC = ['lost', 'less', 'gloss', 'drop', 'down', 'nan', 'zero', 'fall', 'grad', 'step', 'void', 'lose'];
  const cc = (k) => [0, 1, 2, 3].map(j => COLC[(k * 5 + j * 3) % COLC.length]);
  function rowTile(s, y, o, off) {
    const uw = measure(s, o);
    for (let x = -uw - frac(off / uw) * uw; x < W + uw; x += uw) txt(s, x, y, { ...o, al: 'left' });
  }
  function strobe(t, e, dy = () => 0) {
    const kind = [0, 2, 1, 3, 0, 4, 1, 3][((e % 8) + 8) % 8], field = FIELDS[(e * 3 + (e >> 3)) % 8];
    const ink = field === PAL.bone ? PAL.void : field === PAL.clay ? PAL.void : PAL.clay;
    const ink2 = field === PAL.void ? PAL.bone : PAL.bone;
    const r = rng(e * 7.7 + 1);
    if (kind === 0 || kind === 1) {
      const w = kind ? 'DROP  ↓  ' : 'LOSS  ✳  ', size = kind ? 150 : 190, lh = size * 1.02;
      X.save(); X.translate(W / 2, H / 2); X.rotate(kind ? -.09 : .06); X.translate(-W / 2, -H / 2);
      for (let row = -2; row < 9; row++) {
        const y = row * lh + 40, o = { f: 'disp', w: 900, size, col: row % 2 ? ink : ink2, a: row % 2 ? .9 : .35 };
        X.save(); X.translate(0, dy(row));
        rowTile(w, y, o, (t * 900 + row * 400) * (row % 2 ? 1 : -1) + r() * 500);
        X.restore();
      }
      X.restore();
    } else if (kind === 2) {
      // a field of arrows, raining down
      const o = { f: 'mono', w: 800, size: 170, col: ink };
      for (let cx = 0; cx < 9; cx++) for (let cy = -1; cy < 6; cy++) {
        const yy = cy * 210 + frac(t * 2.2 + cx * .37) * 210;
        X.save(); X.translate(0, dy(cy)); txt('↓', 110 + cx * 215, yy, { ...o, a: (cx + cy) % 2 ? .9 : .3 }); X.restore();
      }
    } else if (kind === 3) {
      // candidate columns everywhere
      for (let i = 0; i < 6; i++) {
        const cx = 330 + (i % 3) * 640, cy = 250 + Math.floor(i / 3) * 560;
        X.save(); X.translate(0, dy(Math.floor(i / 4) * 3));
        sampled(COLW[(i + e) % COLW.length], cx, cy, { f: 'disp', w: 900, size: 260, col: i % 3 ? ink2 : PAL.clay, barCol: PAL.pink, cands: cc(e + i).filter(w => w !== COLW[(i + e) % COLW.length]), seed: e * 13 + i }, .3 + .4 * r());
        X.restore();
      }
    } else {
      // one giant arrow / LOSS stack
      const o = { f: 'disp', w: 900, size: 560, col: ink, track: -20 };
      X.save(); X.translate(0, dy(4)); txt('LOSS', W / 2, H / 2 - 300, { ...o, a: .9 }); txt('LOSS', W / 2, H / 2 + 300, { ...o, a: .9, fillOff: true, stroke: ink, sw: 6 }); X.restore();
    }
    return { field, ink, ink2 };
  }
  function hero(t, word, Tw, field, dyv = 0) {
    if (!word) return;
    const o = { f: 'disp', w: 900, track: -10 };
    const base = word === 'LOSS' ? 620 : fitSize(word, o, W * 1.02);
    const pop = 1 + .07 * pulse2(t, 7), size = base * pop;
    const col = field === PAL.bone ? PAL.void : PAL.bone;
    const e = Math.floor(bpOf(t) * 2), jx = (hash(e) - .5) * 40, jy = (hash(e + 9) - .5) * 30 + dyv;
    const p = .75 + (t - Tw) / .3, sh = 8 + 16 * pulse2(t, 5);
    if (p >= .75) {
      rect(0, H / 2 - size * .42 + jy, W, size * .84, field, .85);
      txt(word, W / 2 + jx - sh, H / 2 + jy, { ...o, size, col: PAL.pink, op: field === PAL.bone ? 'multiply' : 'screen', a: .9 });
      txt(word, W / 2 + jx + sh, H / 2 + jy, { ...o, size, col: PAL.cyan, op: field === PAL.bone ? 'multiply' : 'screen', a: .9 });
    }
    sampled(word.toLowerCase() === word ? word : word, W / 2 + jx, H / 2 + jy, { ...o, size, col, cands: { DROPPING: ['dropout', 'dripping', 'stopping', 'drooping'], TRAINING: ['draining', 'raining', 'trading', 'trailing'], LOSS: ['lost', 'less', 'gloss', 'lose'] }[word], barCol: PAL.pink, seed: hashS(word) + Tw }, p);
  }
  function glitchSlices(layer, t, amt) {
    const r = rng(stepT(t, 24) * 3.1 + 5), n = 12;
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
    X.drawImage(layer, 0, 0);
    for (let i = 0; i < n; i++) {
      if (r() > amt) continue;
      const y = Math.floor(r() * H), h = 10 + r() * 90, dx = (r() - .5) * 260 * amt;
      X.drawImage(layer, 0, y, W, h, dx, y, W, h);
    }
    X.restore();
  }
  function dropShot(t, lt) {
    const gap = (t >= L35[2].b && t < L36[0].a) || (t >= L36[1].b && t < L37[0].a);
    const h = heroAt(t);
    if (gap || (h && !h[1])) return darkGap(t);
    const e = Math.floor(bpOf(t) * 2);
    let fld;
    const lay = withLayer(0, () => { fld = FIELDS[(e * 3 + (e >> 3)) % 8]; bg(fld); strobe(t, e); });
    const punch = 1 + .05 * pulse2(t, 7);
    X.save(); X.translate(W / 2, H / 2); X.scale(punch, punch); X.translate(-W / 2, -H / 2);
    glitchSlices(lay, t, .35 + .6 * pulse2(t, 4));
    if (h) hero(t, h[1], h[0], fld);
    X.restore();
    const tk = { f: 'mono', w: 800, size: 22, al: 'left', col: fld === PAL.bone ? PAL.void : PAL.bone };
    rect(96, 70, 600, 40, fld === PAL.bone ? PAL.bone : PAL.void, .8);
    txt(`step ${String(120000 + e * 512).padStart(6, '0')} · loss ${(2.6e-4 * Math.pow(.62, e - 390)).toExponential(2)}`, 110, 90, tk);
    const land = HERO.filter(x => x[1] && t >= x[0]).pop();
    if (land && t - land[0] < .07) { X.save(); X.globalCompositeOperation = 'difference'; X.fillStyle = PAL.bone; X.fillRect(0, 0, W, H); X.restore(); }
    post({ bloom: .5, chroma: .7 + .8 * pulse2(t, 4), grain: .09, vig: .4, scan: .1 });
  }
  function darkGap(t) {
    bg(PAL.void);
    // the afterimage of the last slam
    const prev = HERO.filter(x => x[1] && x[0] <= t).pop(), ends = HERO.filter(x => !x[1] && x[0] <= t).pop();
    if (prev && ends) {
      const age = t - ends[0];
      txt(prev[1], W / 2, H / 2, { f: 'disp', w: 900, size: prev[1] === 'LOSS' ? 620 : fitSize(prev[1], { f: 'disp', w: 900, track: -10 }, W * 1.02), track: -10, col: PAL.clay, a: .2 * Math.exp(-age * 5) });
    }
    // the cursor: drops one step every beat in the long gap
    const g2 = t >= L36[1].b, b = g2 ? Math.floor(bpOf(t) - bpOf(L36[1].b)) : 0;
    const cy = H / 2 + b * 34;
    glowDot(W / 2, cy, 160, PAL.clay, .12 + .18 * pulse(t, 6));
    rect(W / 2 - 33, cy - 60, 66, 120, PAL.clay, .18);
    cursor(W / 2 - 33, cy, 120, PAL.clay);
    // the next word, starting to generate in the dark
    const next = HERO.find(x => x[1] && x[0] > t);
    if (next && t > next[0] - .3) sampled(next[1].toLowerCase(), W / 2 + 40, cy, { f: 'disp', w: 900, size: 120, col: PAL.bone, barCol: PAL.clay, seed: next[0], cands: ['dropout', 'dripping', 'stopping', 'drooping'] }, .75 + (t - next[0]) / .3);
    post({ bloom: .45, chroma: 0, grain: .1, vig: .6 });
  }

  // ---------- D · everything falls ----------
  function fallShot(t, lt) {
    bg(PAL.void);
    const T0 = L37[0].a + .1, g = 30000;
    const fall = (k) => { const d = Math.max(0, t - T0 - hash(k * 3.3) * .06); return .5 * g * (1 + hash(k) * .5) * d * d; };
    const e = Math.floor(bpOf(L37[0].a + .01) * 2) + 4;
    X.save(); X.translate(0, fall(99)); rect(0, 0, W, H, PAL.clay); X.restore();
    strobe(t, e, i => fall(i + 1));
    const T = L37[0].a;
    const lay = withLayer(0, () => hero(t, 'DROPPING', T, PAL.clay, fall(50)));
    blit(lay);
    X.save(); X.translate(0, fall(77) * .8); cursor(W / 2 - 33, H / 2 + 260, 120, PAL.bone, 1, true); X.restore();
    post({ bloom: .45, chroma: 1.2 * Math.exp(-lt * 5) + .3, grain: .09, vig: .5 });
  }

  chapter('loss', S, E, [[S, curveShot], [86.04, fanShot], [89.62, dropShot], [L37[0].a, fallShot]]);
})();
