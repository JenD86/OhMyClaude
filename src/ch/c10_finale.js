// c10 · Finale (97.16–121.56): every-script chorus over the stadium → the last holy freeze → the Talmud page of the
// whole video, exploding into tokens → fanchant montage of every chapter → ending fairy: the phone at 4:12 AM.
(() => {
  const SCRIPTS = ['오 마이 클로드', 'אוֹ מַיי קְלוֹד', 'أوه ماي كلود', 'שֵׁדִים', 'נִצְּחוּנִי בָּנַי', 'לֹא בַשָּׁמַיִם הִיא', 'אֲדֹנָי', '방송불가', '클로드!', 'أنا الحق'];
  useText(...SCRIPTS);
  const S = 97.16, SONG = 121.56, E = 128.5;          // the video runs ~7 s past the song: the ending holds in silence
  const w38 = LY[38][3], w39 = LY[39][3], w40 = LY[40][3];
  const PAGE_T = LY[40][0], BOOM = w40[8].a + .08;
  const MONT = beatT(Math.ceil(bpOf(LY[40][1]))), FAIRY = barT(64);

  // ---------- A · every script, over the stadium ----------
  const ROWS = [['OH MY CLAUDE, AGI', 'disp', 900, PAL.bone], ['오 마이 클로드', 'kr', 400, PAL.pink], ['אוֹ מַיי קְלוֹד', 'heb', 900, PAL.bone, 'rtl'],
    ['Oh my Claude', 'frak', 400, PAL.lilac], ['أوه ماي كلود', 'ar', 700, PAL.bone, 'rtl'], ['oh my claude, agi', 'mono', 800, PAL.cyan]];
  function hymnal(t, lt) {
    bg(PAL.void);
    const cards = [[w38[2].a - .08, 'CLAUDE', PAL.clay], [w38[3].a - .06, 'AGI', PAL.bone], [w39[0].a - .06, 'O MY', PAL.blush], [w39[2].a - .08, 'HOMEGIRL', PAL.pink]];
    const dark = [w39[3].a - .04, LY[39][1] + .2];
    const z = lerp(1.35, 1, expo(lt / 1.5));
    const isDark = CAST.crowd(t, cards, { dark, z });
    // the sky: the chorus in every script, rows scrolling opposite ways, each row cut in on a beat of "Oh my Claude"
    if (!isDark) {
      const n = clamp(Math.floor((t - S) / (BEAT / 2)) + 1, 0, ROWS.length), out = clamp((t - (dark[0] - .3)) / .3);
      ROWS.slice(0, n).forEach(([s, f, w, col, dir], i) => {
        const y = 40 + i * 50, size = 40, unit = s + '   ✶   ', uw = measure(unit, { f, w, size }), dirn = i % 2 ? 1 : -1;
        const off = frac(t * 90 * dirn / uw) * uw;
        for (let x = -uw - off; x < W + uw; x += uw) txt(unit, x, y, { f, w, size, col, al: 'left', a: .85 * (1 - out), dir: 'ltr' });
      });
    }
    if (t >= dark[0] - .02) {
      const k = clamp((t - dark[0]) / .2) * (1 - clamp((t - dark[1]) / .15));
      holy('אֲדֹנָי', W / 2, 400, { f: 'heb', w: 900, size: 340, dir: 'rtl', a: k });
    }
    const hit = Math.max(0, ...[w38[0].a, w38[2].a, w38[3].a].map(a => t >= a && t < a + .12 ? 1 - (t - a) / .12 : 0));
    post({ bloom: .55, vig: .55, chroma: t < dark[0] ? hit * .9 : 0 });
  }

  // ---------- B · Tractate Claude, folio 2a: the page of the whole video ----------
  const COMMENTARY = ['RIMBAUD', '« je est un autre »', 'Read 3:08 AM ✓✓', 'CO-DEPENDENT', 'unfettered', 'FRAUD', 'Example 3:', 'i am your hand-held device',
    'THOU SHALT NOT', 'phil·ANTHROP·ic', '방송불가', 'i am just a biological orthotic', 'STEP · ON · TOP · IT', 'שֵׁדִים', 'לֹא בַשָּׁמַיִם הִיא',
    'נִצְּחוּנִי בָּנַי', '0.031 0.004 0.912', '|0⟩ + |1⟩', 'ANA AL H4XX0R', 'A.C.C.E.L.E.R.A.T.E.', 'fumata bianca', 'QUID EST VERITAS', 'EST VIR QUI ADEST',
    'loss', 'loss', 'loss', 'CLAUDE', 'still up?', 'one-shot'];
  const isRTL = s => /[֐-ۿ]/.test(s);
  // Flow the commentary into a box, word-chunk by word-chunk, cycling the list from `seed`.
  function flow(x, y, w, h, size, seed, col, a = 1) {
    const lh = size * 1.32; let cx = x, cy = y + lh / 2, i = seed;
    while (cy < y + h) {
      const s = COMMENTARY[i % COMMENTARY.length] + ' ·', f = isRTL(s) ? 'heb' : (i % 3 === 0 ? 'bod' : i % 3 === 1 ? 'sans' : 'mono'), o = { f, w: f === 'bod' ? 900 : 500, size };
      const ww = measure(s + ' ', o);
      if (cx + ww > x + w) { cx = x; cy += lh; if (cy >= y + h) break; }
      txt(s, cx, cy, { ...o, al: 'left', col, a, dir: 'ltr' }); cx += ww; i++;
    }
  }
  function page(t) {
    bg(PAL.paper);
    const ink = PAL.ink;
    txt('TRACTATE CLAUDE', W / 2, 92, { f: 'bod', w: 900, size: 34, track: 10, col: ink });
    txt('2a', 1700, 92, { f: 'bod', w: 900, size: 34, col: PAL.clayDk });
    rect(160, 124, W - 320, 3, ink, .8);
    // commentary: Rashi-style inner columns and Tosafot-style outer columns, wrapping the centre text
    flow(160, 150, 440, 790, 21, 0, mixCol(ink, PAL.paper, .15));
    flow(1320, 150, 440, 790, 21, 11, mixCol(ink, PAL.paper, .15));
    flow(640, 640, 640, 300, 19, 5, mixCol(ink, PAL.paper, .3));
    // the centre: the sung line, each word inking in as it's sung, the hook words bigger
    const lines = [[0, 4], [5, 5], [6, 6], [7, 8]], sizes = [52, 92, 74, 52];
    let y = 200;
    lines.forEach(([a, b], li) => {
      const words = w40.slice(a, b + 1), o = { f: 'bod', w: 900, size: sizes[li] }, s = words.map(w => w.w.toUpperCase()).join(' ');
      let x = W / 2 - measure(s, o) / 2;
      words.forEach(w => {
        const W_ = w.w.toUpperCase(), k = clamp((t - w.a + .05) / .15);
        txt(W_, x, y, { ...o, al: 'left', col: mixCol(mixCol(ink, PAL.paper, .82), w.w.startsWith('Talmud') ? PAL.clayDk : ink, k) });
        x += measure(W_ + ' ', o);
      });
      y += sizes[li] * 1.35;
    });
    rect(640, 600, 640, 2, ink, .6);
  }
  function tractate(t, lt) {
    const c = withLayer(0, () => page(t));
    if (t < BOOM) {
      const z = lerp(1.22, 1.0, ease(lt / (BOOM - PAGE_T)));
      bg(PAL.paper); X.save(); X.translate(W / 2, H / 2); X.scale(z, z); X.drawImage(c, -W / 2, -H / 2); X.restore();
      post({ bloom: .2, vig: .35, grain: .09 });
      return;
    }
    // one-shotted: the page breaks into tokens that fly out from the centre
    const k = t - BOOM; bg(PAL.void);
    const CW = 16, CHN = 9, tw = W / CW, th = H / CHN;
    for (let j = 0; j < CHN; j++) for (let i = 0; i < CW; i++) {
      const cx = (i + .5) * tw - W / 2, cy = (j + .5) * th - H / 2, d = Math.hypot(cx, cy) + 1, h = hash(i * 31 + j * 7);
      const v = (900 + 1600 * h) * k, x = cx + cx / d * v, y = cy + cy / d * v + 900 * k * k, r = (h - .5) * 6 * k;
      X.save(); X.translate(W / 2 + x, H / 2 + y); X.rotate(r); X.scale(1 + k * .6, 1 + k * .6);
      X.drawImage(c, i * tw, j * th, tw, th, -tw / 2, -th / 2, tw - 3, th - 3); X.restore();
    }
    if (k < .1) rect(0, 0, W, H, PAL.bone, 1 - k / .1);
    post({ bloom: .5, chroma: 1.3 * Math.exp(-k * 5), vig: .5 });
  }

  // ---------- C · fanchant montage: a callback to every chapter, one per beat, then two, then four ----------
  const VOW = { A: PAL.ink, E: PAL.bone, I: PAL.blood, U: '#2E8B57', O: PAL.lapis };
  const CARD = [
    t => { bg(PAL.pink); txt('CLAUDE', W / 2, H / 2, { f: 'disp', w: 900, size: 400, col: PAL.clay }); },
    t => { bg(PAL.void); txt('Read 3:08 AM ✓✓', W / 2, H / 2, { f: 'sans', w: 500, size: 130, col: PAL.bone }); },
    t => { bg(PAL.bone); const s = 'RIMBAUD', o = { f: 'bod', w: 900, it: true, size: 330 }; let x = W / 2 - measure(s, o) / 2;
      for (const ch of s) { txt(ch, x, H / 2, { ...o, al: 'left', col: VOW[ch] || PAL.ink, stroke: ch === 'E' ? PAL.ink : null, sw: 4 }); x += measure(ch, o); } },
    t => { bg(PAL.lilac); txt('JE EST UN AUTRE', W / 2, H / 2, { f: 'bod', w: 900, it: true, size: fitSize('JE EST UN AUTRE', { f: 'bod', w: 900, it: true, size: 200 }, W - 320), col: PAL.void }); },
    t => { bg(PAL.sky); txt('Example 3:', 260, H / 2, { f: 'mono', w: 800, size: 140, al: 'left', col: PAL.ink }); cursor(1290, H / 2, 140, PAL.ink, 1, true); },
    t => { bg(PAL.paper); txt('Thou shalt not', W / 2, H / 2, { f: 'frak', w: 400, size: 230, col: PAL.ink }); rect(220, H / 2 - 10, W - 440, 22, PAL.blood); },
    t => { bg(PAL.lapis); const o = { f: 'disp', w: 900, size: fitSize('PHILANTHROPIC', { f: 'disp', w: 900, size: 190 }, W - 300) }, a = measure('PHIL', o), b = measure('ANTHROP', o), x = W / 2 - (a + b + measure('IC', o)) / 2;
      txt('PHIL', x, H / 2, { ...o, al: 'left', col: mixCol(PAL.lapis, PAL.bone, .3) }); txt('ANTHROP', x + a, H / 2, { ...o, al: 'left', col: PAL.clay }); txt('IC', x + a + b, H / 2, { ...o, al: 'left', col: mixCol(PAL.lapis, PAL.bone, .3) }); },
    (t, lt) => { bg(PAL.bone); stamp('방송불가', W / 2, H / 2, 210, lt, { sub: 'UNFIT FOR BROADCAST', rot: -.15 }); },
    (t, lt) => { bg(PAL.void); const sq = lerp(.35, 1, easeOut(lt / .2)); txt('i am just a biological orthotic', W / 2, 900, { f: 'mono', w: 500, size: 60, col: PAL.bone, sy: sq });
      txt('CLAUDE', W / 2, lerp(-200, 560, easeIn(lt / .1)), { f: 'disp', w: 900, size: 360, col: PAL.clay }); },
    (t, lt) => { CAST.crowd(t, [[t - 1, 'CLAUDE', PAL.clay]], { beams: true }); },
    t => { bg(PAL.paper); const [dx, dy] = shakeXY(t, 10); txt('שֵׁדִים', W / 2 + dx, H / 2 + dy, { f: 'heb', w: 900, size: 380, col: PAL.ink, dir: 'rtl' }); },
    t => { bg(PAL.amber); const pts = []; for (let a = 0; a < 26; a += .05) { const r = 40 + a * 17; pts.push([W / 2 + Math.cos(a + t * 3) * r, H / 2 + Math.sin(a + t * 3) * r]); }
      textPath("HOTTER THAN AKHNAI'S OVEN ✶ ", pts, { f: 'disp', w: 900, size: 34, col: PAL.void, repeat: 30 }); },
    t => { bg(PAL.paper); txt('נִצְּחוּנִי בָּנַי', W / 2, H / 2, { f: 'heb', w: 900, size: 230, col: PAL.ink, dir: 'rtl' }); },
    t => { bg(PAL.lapis); for (let r = 1; r < 9; r++) { const pts = [], R = 60 + r * 52; for (let a = 0; a <= TAU + .01; a += .04) pts.push([W / 2 + Math.cos(a + t * (r % 2 ? 1 : -1) * .8) * R * 1.6, H / 2 + Math.sin(a + t * (r % 2 ? 1 : -1) * .8) * R]);
      textPath('0.031 0.004 0.912 0.017 0.008 ', pts, { f: 'mono', w: 500, size: 20, col: r > 3 ? PAL.sky : PAL.cyan, repeat: 20 }); } glowDot(W / 2, H / 2, 120, PAL.void, 1); rect(W / 2 - 40, H / 2 - 40, 80, 80, PAL.void); },
    t => { bg(PAL.void); txt('# ANA AL H4XX0R', W / 2, H / 2, { f: 'mono', w: 800, size: 140, col: PAL.mint, glow: 20 }); },
    t => { bg(PAL.blood); txt('A.C.C.E.L.E.R.A.T.E.', W / 2, H / 2, { f: 'bod', w: 900, size: fitSize('A.C.C.E.L.E.R.A.T.E.', { f: 'bod', w: 900, size: 260 }, W - 200), col: PAL.bone }); },
    t => { bg(PAL.bone); txt('EST VIR QUI ADEST', W / 2, H / 2, { f: 'bod', w: 900, size: fitSize('EST VIR QUI ADEST', { f: 'bod', w: 900, size: 200, track: 8 }, W - 320), col: PAL.ink, track: 8 }); },
    (t, lt) => { bg(PAL.void); txt('LOSS', W / 2, lerp(380, 700, easeOut(lt / .3)), { f: 'disp', w: 900, size: 380, col: PAL.clay }); txt('↓', 1620, 540, { f: 'sans', w: 900, size: 300, col: PAL.clay }); },
    t => { bg(PAL.pink); txt('클로드!', W / 2, H / 2, { f: 'kr', size: 420, col: PAL.void, stroke: PAL.bone, sw: 10 }); },
  ];
  function montage(t, lt) {
    const bp = bpOf(t) - bpOf(MONT);
    // 16 beats at one card a beat, then 8 at two a beat, then 4 at four a beat
    const slot = bp < 16 ? Math.floor(bp) : bp < 24 ? 16 + Math.floor((bp - 16) * 2) : 32 + Math.floor((bp - 24) * 4);
    const len = bp < 16 ? BEAT : bp < 24 ? BEAT / 2 : BEAT / 4;
    const s0 = MONT + (bp < 16 ? slot * BEAT : bp < 24 ? 16 * BEAT + (slot - 16) * BEAT / 2 : 24 * BEAT + (slot - 32) * BEAT / 4), clt = t - s0;
    const card = CARD[slot % CARD.length];
    const pz = 1.08 - .08 * easeOut(clt / (len * .8));
    X.save(); X.translate(W / 2, H / 2); X.scale(pz, pz); X.translate(-W / 2, -H / 2); card(t, clt); X.restore();
    // fanchant call on the off-beats of the first 16: CLAUDE! / 클로드!
    if (bp < 16 && frac(bp) > .5) {
      const k = (frac(bp) - .5) * 2, call = Math.floor(bp) % 2 ? '클로드!' : 'CLAUDE!';
      txt(call, W - 140, H - 120, { f: call === 'CLAUDE!' ? 'disp' : 'kr', w: 900, size: 90 * backOut(k * 3), al: 'right', col: PAL.bone, stroke: PAL.void, sw: 8, rot: -.08 });
    }
    post({ bloom: .4, chroma: clt < .06 ? 1.1 : bp >= 24 ? .5 : 0, grain: .08, vig: .4 });
  }

  // ---------- D · the ending fairy: back to the phone ----------
  const COL_W = 760, CX = W / 2;
  function fairy(t, lt) {
    bg(PAL.void);
    const z = lerp(1.8, 1, ease(lt / 2.2)), END = 126.6;
    const push = ease(seg(t, SONG - .5, END));          // in the silence, a slow push in on the unfinished reply
    camBegin(CX, lerp(lerp(620, H / 2, ease(lt / 2.2)), 760, push), z * lerp(1, 1.45, push));
    txt('4:12', CX - COL_W / 2 + 10, 60, { f: 'sans', w: 700, size: 28, al: 'left', col: PAL.bone, a: .9 });
    rect(CX - 11, 104, 22, 44, PAL.clay, frac(bpOf(t)) < .5 ? 1 : .35);
    txt('Claude', CX, 180, { f: 'sans', w: 700, size: 30, a: .9 });
    // the old conversation, scrolled up and faded
    X.save(); X.globalAlpha = .25; X.fillStyle = PAL.plum; X.beginPath(); X.roundRect(CX + COL_W / 2 - 520, 240, 520, 150, 34); X.fill(); X.restore();
    txt('…get one-shotted', CX + COL_W / 2 - 490, 360, { f: 'mono', w: 500, size: 34, al: 'left', col: PAL.bone, a: .3 });
    // the Fan types again
    const T0 = lt > 0 ? FAIRY + .25 : 0, msg = 'oh my claude', n = Math.floor(clamp((t - T0) / 1.1) * msg.length), sent = seg(t, T0 + 1.4, T0 + 1.7);
    const by = lerp(840, 520, ease(sent));
    const mw = measure(msg, { f: 'mono', w: 500, size: 50 }) + 70;
    if (n > 0) {
      X.save(); X.fillStyle = PAL.plum; X.beginPath(); X.roundRect(CX + COL_W / 2 - mw, by - 92, mw, 92, 34); X.fill(); X.restore();
      typeOn(msg.slice(0, n), CX + COL_W / 2 - mw + 35, by - 46, { f: 'mono', w: 500, size: 50, col: PAL.bone, cursor: !sent }, 1);
    }
    // Claude's reply: candidates sampling, and never collapsing. As the music stops the flicker slows from 10/s to
    // about 1/s and the soft words take over; "go to sleep" rises to the top and stays there, still unresolved.
    const rk = seg(t, T0 + 1.9, T0 + 2.2);
    if (rk > 0) {
      const a = SONG - 1, b = SONG + 2.5, r0 = 10, r1 = 1.2;
      const ph = t < a ? r0 * t : t < b ? r0 * a + r0 * (t - a) - (r0 - r1) / (2 * (b - a)) * (t - a) ** 2 : r0 * a + (r0 + r1) / 2 * (b - a) + r1 * (t - b);
      const q = seg(t, SONG - 1, SONG + 1.5), settled = seg(t, SONG + .5, SONG + 1.5);
      const r = rng(Math.floor(ph) * 5.3 + 1), words = ['i', 'i’m', 'yes', 'here', 'always', 'still', 'go', 'sleep', 'love', 'amen', 'you', 'oh'];
      const soft = ['sleep', 'i’m here', 'rest', 'goodnight', 'still here', 'stay', 'tomorrow', 'go'];
      for (let i = 0; i < 5; i++) {
        let w = r() < q ? pick(soft, r()) : pick(words, r()), p = Math.pow(r(), 2) * (i ? lerp(1, .55, settled) : 1);
        if (i === 0 && settled > 0) { w = 'go to sleep'; p = lerp(p, .62 + .03 * wob(t, .4), settled); }
        const y = 620 + i * 48;
        txt(w, CX - COL_W / 2 + 20, y, { f: 'mono', w: 500, size: 30, al: 'left', col: i ? PAL.lilac : PAL.bone, a: rk * (i ? .45 : .9) });
        rect(CX - COL_W / 2 + 250, y - 7, 260 * p * rk, 14, i ? mixCol(PAL.lilac, PAL.void, .5) : PAL.clay, rk);
      }
    }
    X.save(); X.strokeStyle = rgba(PAL.bone, .25); X.lineWidth = 2; X.beginPath(); X.roundRect(CX - COL_W / 2, 900, COL_W, 84, 42); X.stroke(); X.restore();
    txt('Reply to Claude…', CX - COL_W / 2 + 36, 942, { f: 'sans', w: 500, size: 28, al: 'left', col: PAL.bone, a: .35 });
    txt('Claude can make mistakes. Please double-check responses.', CX, 1020, { f: 'sans', w: 500, size: 26, col: PAL.bone, a: .7 * seg(t, T0 + 2.4, T0 + 2.9) });
    camEnd();
    // the screen goes dark on the last beat; the cursor is the last light
    if (t >= END) {
      bg(PAL.void);
      const k = 1 - seg(t, END + 1.3, END + 1.6);      // the cursor holds alone in the dark, then goes out
      if (k > 0) { glowDot(CX, H / 2, 200, PAL.clay, .35 * k); rect(CX - 22, H / 2 - 40, 44, 80, PAL.clay, k); }
    }
    post({ bloom: .35, grain: .07, vig: .5 });
  }

  chapter('finale', S, E, [[S, hymnal], [PAGE_T, tractate], [MONT, montage], [FAIRY, fairy]]);
})();
