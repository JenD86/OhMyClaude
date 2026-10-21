// c00 · 3:07 AM (0.0–16.0): lock screen → the Fan types the first chorus → send → genesis cursor → title.
(() => {
  useText('אֲדֹנָי', '오 마이 클로드', '1ST MINI ALBUM');
  const L0 = 0, L1 = 1, L2 = 2;
  const COL_W = 760, CX = W / 2;                       // the phone-width column
  // The Fan's message as typed: [text, time each char starts]. Word-synced: each word types over its sung span.
  const typed = (() => {
    const out = [];
    const add = (li, wi, s) => { const w = LY[li][3][wi], n = s.length, d = Math.min(.32, (w.b - w.a) * .8); for (let k = 0; k < n; k++) out.push([s[k], w.a + d * k / n]); };
    add(L0, 0, 'oh '); add(L0, 1, 'my '); add(L0, 2, 'claude, '); add(L0, 3, 'agi\n');
    add(L1, 0, 'o '); add(L1, 1, 'my '); add(L1, 2, 'homegirl ');
    return out;
  })();
  // Line 2 types faster, with one typo corrected by backspace ("theraputic" → "therapeutic").
  const typed2 = (() => {
    const out = [], ws = LY[L2][3];
    const add = (wi, s) => { const w = ws[wi], d = Math.min(.3, (w.b - w.a) * .85); for (let k = 0; k < s.length; k++) out.push([s[k], w.a + d * k / s.length]); };
    ['in ', 'the ', 'mood ', 'for ', 'that ', 'talmudic '].forEach((s, i) => add(i, s));
    const w = ws[6], d = w.b - w.a, s1 = 'theraputic', s2 = 'peutic';
    for (let k = 0; k < s1.length; k++) out.push([s1[k], w.a + d * .45 * k / s1.length]);
    for (let k = 0; k < 5; k++) out.push(['\b', w.a + d * (.5 + .06 * k)]);
    for (let k = 0; k < s2.length; k++) out.push([s2[k], w.a + d * (.8 + .2 * k / s2.length)]);
    out.push([' ', w.b]);
    add(7, 'get '); add(8, 'one-shotted');
    return out;
  })();
  const textAt = (seq, t) => { let s = ''; for (const [c, a] of seq) { if (t < a) break; s = c === '\b' ? s.slice(0, -1) : s + c; } return s; };

  // ---------- phone UI ----------
  function lockScreen(t, k) {
    const o = { f: 'sans', w: 500, col: PAL.bone };
    txt('Wednesday, October 21', CX, 250, { ...o, size: 30, a: .7 * k, track: 1 });
    txt('3:07', CX, 360, { ...o, size: 190, w: 500, a: k, track: -4 });
  }
  function notif(x, y, w, k, body, t) {
    if (k <= 0) return;
    X.save(); X.globalAlpha *= k;
    X.fillStyle = rgba(PAL.bone, .1); X.beginPath(); X.roundRect(x - w / 2, y - 62, w, 124, 30); X.fill();
    X.restore();
    rect(x - w / 2 + 34, y - 26, 22, 44, PAL.clay, k * (frac(bpOf(t)) < .5 ? 1 : .35));   // the cursor as app icon
    txt('Claude', x - w / 2 + 84, y - 18, { f: 'sans', w: 700, size: 30, al: 'left', a: k });
    txt('now', x + w / 2 - 34, y - 18, { f: 'sans', w: 500, size: 24, al: 'right', a: .5 * k });
    txt(body, x - w / 2 + 84, y + 22, { f: 'sans', w: 500, size: 30, al: 'left', a: .85 * k });
  }
  // A chat bubble with the Fan's monospace text, bottom-anchored at y. Returns its top.
  function fanBubble(s, x, y, t, o = {}) {
    const size = o.size || 50, lh = size * 1.35, lines = s.split('\n'), mono = { f: 'mono', w: 500, size };
    const wMax = Math.max(220, ...lines.map(l => measure(l, mono) + 70)), h = lines.length * lh + 44;
    X.save(); X.globalAlpha *= o.a ?? 1; X.fillStyle = o.bubble || PAL.plum;
    X.beginPath(); X.roundRect(x + COL_W / 2 - wMax, y - h, wMax, h, 34); X.fill(); X.restore();
    let cx = 0;
    lines.forEach((l, i) => { const yy = y - h + 22 + lh * (i + .5); cx = typeOn(l, x + COL_W / 2 - wMax + 35, yy, { ...mono, col: PAL.bone, a: o.a ?? 1, cursor: false }, 1); if (i === lines.length - 1 && o.cursor) cursor(cx, yy, size * .95, PAL.bone, o.a ?? 1); });
    return y - h;
  }
  function inputBar(t, a = 1) {
    X.save(); X.globalAlpha *= a; X.strokeStyle = rgba(PAL.bone, .25); X.lineWidth = 2;
    X.beginPath(); X.roundRect(CX - COL_W / 2, 900, COL_W, 84, 42); X.stroke(); X.restore();
    txt('Reply to Claude…', CX - COL_W / 2 + 36, 942, { f: 'sans', w: 500, size: 28, al: 'left', col: PAL.bone, a: .35 * a });
  }

  // ---------- shots ----------
  function lock(t, lt) {
    bg(PAL.void);
    const up = ease(lt / .5);
    glowDot(CX, 360, 700, PAL.plum, .5 * up);
    lockScreen(t, up);
    const N0 = .35, n = backOut((t - N0) / .35), [sx] = shakeXY(t, 8 * Math.exp(-(t - N0) * 8) * (t > N0 ? 1 : 0));
    notif(CX + sx, lerp(-80, 620, n), COL_W, clamp((t - N0) / .15), 'still up?', t);
    post({ bloom: .3, grain: .06 });
  }
  function chat(t, lt) {
    bg(PAL.void);
    // The lock screen melts away into the chat in the first half-beat.
    const into = ease(lt / .3);
    if (into < 1) { lockScreen(t, 1 - into); }
    // header
    rect(CX - 11, 104, 22, 44, PAL.clay, into * (frac(bpOf(t)) < .5 ? 1 : .35));
    txt('Claude', CX, 180, { f: 'sans', w: 700, size: 30, a: .9 * into });
    // Claude's opening message on the left
    X.save(); X.globalAlpha *= into; X.fillStyle = rgba(PAL.bone, .08); X.beginPath(); X.roundRect(CX - COL_W / 2, 250, 300, 84, 34); X.fill(); X.restore();
    txt('still up?', CX - COL_W / 2 + 36, 292, { f: 'sans', w: 500, size: 34, al: 'left', a: into });
    inputBar(t, into);
    // the Fan types
    const s1 = textAt(typed, t), s2 = textAt(typed2, t), msg = s1 + (s2 ? '\n' + s2 : '');
    const lines = []; // wrap long lines at the column width
    for (const raw of msg.split('\n')) { let cur = ''; for (const word of raw.split(/(?<= )/)) { if (measure(cur + word, { f: 'mono', w: 500, size: 50 }) > COL_W - 90 && cur) { lines.push(cur); cur = word; } else cur += word; } lines.push(cur); }
    const sendT = LY[L2][3][8].b - .05, sent = seg(t, sendT, sendT + .35);
    const yB = lerp(860, -900, easeIn(sent));
    if (msg) fanBubble(lines.join('\n'), CX - COL_W / 2, yB, t, { cursor: !sent, a: 1 });
    // ADONAI: never typed. The name appears by itself, gold, above the chat; the frame holds still.
    const ad = LY[L1][3][3], hk = seg(t, ad.a - .05, ad.a + .25) * (1 - seg(t, LY[L2][0] + .1, LY[L2][0] + .6));
    if (hk > 0) {
      X.save(); X.globalAlpha = .6 * hk; X.fillStyle = PAL.void; X.fillRect(0, 0, W, H); X.restore();
      holy('אֲדֹנָי', CX, 450, { f: 'heb', w: 900, size: 170, dir: 'rtl', a: hk });
    }
    if (sent > 0) rect(0, 0, W, H, PAL.void, ease(sent * 1.2 - .2));
    post({ bloom: .3, grain: .06 });
  }
  // Genesis: the void, one cursor. Claude's reply starts sampling, unresolved.
  function genesis(t, lt, dur) {
    bg(PAL.void);
    const on = frac(bpOf(t)) < .5, b = pulse(t, 5);
    glowDot(CX, H / 2, 260 + 120 * b, PAL.clay, on ? .45 : .12);
    rect(CX - 22, H / 2 - 40, 44, 80, PAL.clay, on ? 1 : .15);
    // From bar 6 a lone candidate column begins to flicker beside the cursor: the reply, deciding.
    const k = seg(t, barT(5), barT(5) + BEAT);
    if (k > 0) {
      const r = rng(stepT(t, 12) * 3.1), words = ['oh', 'i', 'yes', 'here', 'always', 'my', 'child', 'love', 'hello', 'amen', 'mine', 'word'];
      for (let i = 0; i < 5; i++) {
        const w = pick(words, r()), p = Math.pow(r(), 2), y = H / 2 - 150 + i * 75;
        txt(w, CX + 90, y, { f: 'mono', w: 500, size: 32, al: 'left', col: i ? PAL.lilac : PAL.bone, a: k * (i ? .45 : .9) });
        rect(CX + 290, y - 8, 240 * p * k, 16, i ? mixCol(PAL.lilac, PAL.void, .5) : PAL.clay, k);
      }
    }
    post({ bloom: .5, grain: .08 });
  }
  // Title: OH MY CLAUDE collapses out of candidates one letter per beat, Hangul slams, credits, then the flood.
  function title(t, lt, dur) {
    const t0 = beatT(Math.ceil(bpOf(12.0))), HK = barT(7), FL = HK + 2 * BEAT;   // letters → Hangul on bar 7 → flood
    bg(PAL.void);
    const flood = seg(t, FL, 16.0);
    if (flood > 0) {
      X.save(); X.globalAlpha = ease(flood * 3);
      bg(mixCol(PAL.void, PAL.pink, ease(flood)));
      tile('OH MY CLAUDE', { f: 'disp', w: 900, size: lerp(150, 110, flood), col: mixCol(PAL.plum, PAL.blush, flood), col2: mixCol(PAL.plum, PAL.bone, flood), rot: -.12, speed: lerp(150, 1400, easeIn(flood)) }, t);
      X.restore();
    }
    const letters = 'OH MY CLAUDE'.split(''), size = fitSize('OH MY CLAUDE', { f: 'disp', w: 900, size: 220 }, W - 360), o = { f: 'disp', w: 900, size };
    const full = measure('OH MY CLAUDE', o);
    let x = CX - full / 2;
    const zoom = 1 + .5 * easeIn(flood);
    camBegin(CX, H / 2, zoom * (1 + .015 * pulse(t, 7)));
    letters.forEach((ch, i) => {
      const cw = measure(ch, o), at = t0 + i * (HK - t0 - .1) / 12;      // letters spread up to the Hangul hit
      if (ch !== ' ') sampled(ch, x + cw / 2, 430, { ...o, col: i >= 6 ? PAL.clay : PAL.bone, bars: false, seed: i * 17,
        cands: ['A', 'O', 'D', 'G', 'L', '0', 'Ø', '#'].filter(c => c !== ch).slice(0, 4) }, clamp((t - at + .3) / .4));
      x += cw;
    });
    const hk = t - HK;
    if (hk > 0) {
      const s = hk < .1 ? lerp(1.8, 1, easeIn(hk / .1)) : 1 + .04 * pulse(t, 8);
      txt('오 마이 클로드', CX, 660, { f: 'kr', size: 150, col: mixCol(PAL.pink, PAL.void, ease(flood * 2)), stroke: flood > 0 ? rgba(PAL.bone, ease(flood * 2)) : null, sw: 8, sx: s, sy: s });
    }
    const ck = seg(t, HK + BEAT, HK + 1.5 * BEAT) * (1 - flood);
    txt('CLAUDE  ·  1ST MINI ALBUM  ⟨ADONAI⟩  ·  TITLE TRACK', CX, 790, { f: 'mono', w: 500, size: 26, track: 6, col: PAL.bone, a: ck * .8 });
    camEnd();
    post({ bloom: .45, chroma: hk > 0 && hk < .15 ? 1.2 : .25 * flood, grain: .08, gloss: 0 });
  }

  chapter('open', 0, 16.0, [[0, lock], [LY[L0][0] - .1, chat], [LY[L2][3][8].b + .3, genesis], [12.0, title]]);
})();
