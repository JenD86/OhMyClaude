// c01_chorus1: Chorus 1, the idol stage (16.0–23.92). Candy pink, blush, clay, bone. See STORYBOARD.md.
(() => {
  const ADONAI = 'אֲדֹנָי', KR_TITLE = '오 마이 클로드', KR_HG = '홈걸';
  useText(ADONAI, KR_TITLE, KR_HG, '✶✳·⟨⟩—†');

  const L3 = 3, L4 = 4, L5 = 5;
  const BIG = { f: 'disp', w: 900 };
  const sinceBeat = t => frac(bpOf(t)) * BEAT;           // seconds since the last beat
  const slam = (t, at, from = 1.6, d = .12) => t < at ? 0 : lerp(from, 1, easeIn(clamp((t - at) / d)));

  // ---------- K-pop MV chrome: tiny UI that rides over every non-holy shot ----------
  function chrome(t, col = PAL.bone, a = .85, glossOn = false, top = true) {
    const m = { f: 'mono', w: 500, size: 19, col, a, al: 'left', track: 2 };
    if (top) txt('CLAUDE 「OH MY CLAUDE」 M/V', 96, 70, m);
    if (top) txt('1ST MINI ALBUM ⟨ADONAI⟩', W - 96, 70, { ...m, al: 'right' });
    if (top) txt(KR_TITLE, W - 96, 104, { f: 'kr', size: 26, col, a, al: 'right' });
    // beat counter dots, bottom right (clear of the gloss band)
    const b = beatN(t) & 3;
    for (let i = 0; i < 4; i++) rect(W - 96 - (3 - i) * 22 - 12, H - 74, 12, 12, col, i === b ? a : a * .25);
    if (!glossOn) txt('LIVE ✶ ' + (t - 16).toFixed(2).padStart(5, '0'), 96, H - 68, { ...m, size: 17 });
  }
  // fast letter particles: one font set, per-glyph transform. ps = [[ch, x, y, scale, rot, col], ...]
  function shards(ps, base = 40) {
    X.save(); X.font = fontStr({ f: 'disp', w: 900, size: base }); X.textAlign = 'center'; X.textBaseline = 'middle';
    for (const [ch, x, y, sc, r, col] of ps) {
      X.save(); X.translate(x, y); if (r) X.rotate(r); X.scale(sc, sc); X.fillStyle = col; X.fillText(ch, 0, 0); X.restore();
    }
    X.restore();
  }
  // clip that keeps everything out of the gloss band (x < 1420, y > 975)
  const glossClip = () => { X.beginPath(); X.rect(0, 0, W, H); X.rect(0, 975, 1420, H - 975); X.clip('evenodd'); };

  // ---------- 1 · OH (pink field, letters cropped by the frame) ----------
  function shotOh(t) {
    const tw = wordT(L3, 0), split = beatT(beatN(16.6));            // 16.602: the field splits
    bg(PAL.pink);
    const s = t < tw ? 1.5 : slam(t, tw, 1.35, .1) + .05 * Math.exp(-sinceBeat(t) * 8);
    const o = { ...BIG, size: 900, sx: s, sy: s };
    const draw = (col, dy = 0) => txt('OH', W / 2 + 40, H / 2 + 60 + dy, { ...o, col });
    const half = t >= split;
    if (half) rect(0, H / 2 + 60, W, H, PAL.clay);
    // extruded shadow
    X.save(); X.beginPath(); X.rect(0, 0, W, half ? H / 2 + 60 : H); X.clip();
    draw(PAL.clayDk, 22); draw(PAL.bone); X.restore();
    if (half) { X.save(); X.beginPath(); X.rect(0, H / 2 + 60, W, H); X.clip(); draw(PAL.void, 22); draw(PAL.pink); X.restore(); }
    // sticker sparkles on eighths
    const e = Math.floor(bpOf(t) * 2);
    for (let i = 0; i < 3; i++) {
      const h = hash(e * 3 + i), k = pulse2(t, 5);
      txt('✶', 140 + hash(e * 7 + i) * (W - 280), 140 + h * (H - 300), { f: 'sans', size: 60 + 80 * h, col: i % 2 ? PAL.blush : PAL.bone, a: k });
    }
    txt('oh', 120, H / 2 + 60 - 330, { f: 'mono', w: 500, size: 26, col: PAL.bone, al: 'left', a: t >= tw ? .9 : 0 });
    chrome(t, PAL.bone);
    post({ chroma: t >= tw ? .9 * Math.exp(-(t - tw) * 10) : 0, bloom: .3 });
  }

  // ---------- 2 · MY (clay field, next-token candidates already boiling) ----------
  function shotMy(t, lt, dur) {
    const tw = wordT(L3, 1);
    bg(PAL.clay);
    const s = slam(t, tw, 1.4, .08);
    txt('MY', 495, H / 2 + 20, { ...BIG, size: 560, col: PAL.clayDk, sx: s, sy: s });
    txt('MY', 480, H / 2, { ...BIG, size: 560, col: PAL.bone, sx: s, sy: s });
    const pw = 860 * easeOut((t - tw) / .08);
    rect(W - pw, 0, pw, H, PAL.void);
    const p = .15 + .58 * seg(t, tw - .1, wordT(L3, 2));
    sampled('claude', W - 590, H / 2 + 20, { size: 250, col: PAL.bone, barCol: PAL.pink, cands: ['cloud', 'clod', 'lord', 'god'], seed: 31 }, p);
    txt('next token ▸', W - 810, H / 2 - 250, { f: 'mono', w: 500, size: 24, col: PAL.pink, al: 'left' });
    chrome(t, PAL.bone);
  }

  // ---------- 3 · CLAUDE (bone field; candidates collapse on the sung word) ----------
  function shotClaude(t) {
    const tw = wordT(L3, 2), b1 = beatT(beatN(17.06)), b2 = beatT(beatN(17.52));
    bg(PAL.bone);
    // colour-block bars that slide on each beat
    rect(0, 0, W, 150, PAL.blush);
    if (t >= b1) rect(0, H - 150 - 80 * (1 - easeOut((t - b1) / .15)), W, 230, PAL.pink);
    const punch = t >= b2 ? 1.06 - .03 * easeOut((t - b2) / .3) : 1 + .015 * (t - tw);
    camBegin(W / 2 + 60, H / 2, punch);
    const o = { ...BIG, size: fitSize('CLAUDE', { ...BIG, size: 420 }, W - 440) };
    const p = .75 + (t - tw) / .22;
    txt('CLAUDE', W / 2 + 14, H / 2 + 14, { ...o, col: PAL.clayDk, a: clamp((p - .75) * 6) });
    sampled('CLAUDE', W / 2, H / 2, { ...o, col: PAL.clay, flashCol: PAL.pink }, p);
    // the near misses, struck through
    const losers = ['cloud .08', 'clod .04', 'lord .03', 'god .02'], lo = { f: 'mono', w: 500, size: 30, col: PAL.void, al: 'left' };
    let x = W / 2 - 520;
    losers.forEach((s, i) => {
      const at = b1 + i * .05, a = clamp((t - at) / .05);
      const w = measure(s, lo);
      txt(s, x, H / 2 + o.size * .82, { ...lo, a: a * .7 });
      rect(x - 4, H / 2 + o.size * .82, (w + 8) * easeOut((t - at - .05) / .12), 4, PAL.pink, a);
      x += w + 70;
    });
    if (t >= b2) cursor(W / 2 + measure('CLAUDE', o) / 2 + 20, H / 2, o.size * .8, PAL.pink, 1, true);
    camEnd();
    txt('p(claude) = 0.83', W / 2, 75, { f: 'mono', w: 500, size: 24, col: PAL.clayDk, track: 3 });
    chrome(t, PAL.clayDk);
    post({ chroma: t >= b2 ? .6 * Math.exp(-(t - b2) * 12) : 0 });
  }

  // ---------- 4 · A·G·I (void, one letter per eighth, chroma hits) ----------
  function shotAgi(t) {
    bg(PAL.void);
    const t0 = wordT(L3, 3), hits = [t0, t0 + BEAT / 2 * .62, t0 + BEAT / 2 * 1.62];
    const L = [['A', PAL.pink, 'artificial'], ['G', PAL.clay, 'general'], ['I', PAL.bone, 'intelligence']];
    let last = -1;
    L.forEach(([ch, col, gl], i) => {
      if (t < hits[i]) return; last = i;
      const x = 380 + i * 580, s = slam(t, hits[i], 1.7, .07);
      rect(x - 270, 150, 540, 780, mixCol(col, PAL.void, lerp(.25, .8, clamp((t - hits[i]) / .07))), 1);
      txt(ch, x, H / 2 - 10, { ...BIG, size: 560, col, sx: s, sy: s });
      txt(gl, x - 250, 900, { f: 'mono', w: 500, size: 26, col, al: 'left', a: clamp((t - hits[i]) / .08) });
      if (i < 2 && t >= hits[i + 1]) txt('·', x + 290, H / 2 + 40, { ...BIG, size: 200, col: PAL.bone });
    });
    const k = last >= 0 ? Math.exp(-(t - hits[last]) * 14) : 0;
    const [sx, sy] = shakeXY(t, 18 * k);
    X.translate(sx, sy);
    chrome(t, PAL.blush, .7);
    post({ chroma: .4 + 1.1 * k, bloom: .4 });
  }

  // ---------- 5 · O MY HOMEGIRL (merch tile, sparkles, camera punches) ----------
  function shotHomegirl(t) {
    const tO = wordT(L4, 0), tMy = wordT(L4, 1), tHg = wordT(L4, 2), on = t >= tHg;
    const bn = beatN(t), kick = Math.exp(-sinceBeat(t) * 7);
    const zoom = 1 + .05 * (bn - beatN(tO)) + .05 * kick;
    bg(on ? PAL.pink : PAL.blush);
    camBegin(W / 2, H / 2, zoom, 0);
    tile(on ? 'HOMEGIRL' : 'O MY', { ...BIG, size: on ? 120 : 150, col: on ? PAL.blush : PAL.pink, col2: on ? PAL.bone : mixCol(PAL.pink, PAL.blush, .5), rot: -.22, speed: on ? 520 : 300, sep: '  ✶  ', a: .9 }, t);
    camEnd();
    // sticker sparkles
    const e = Math.floor(bpOf(t) * 2);
    for (let i = 0; i < 5; i++) txt(i % 2 ? '✶' : '✳', 160 + hash(e * 5 + i) * (W - 320), 150 + hash(e * 9 + i) * (H - 320),
      { f: 'sans', size: 70 + 90 * hash(e + i * 3), col: i % 2 ? PAL.bone : PAL.clay, a: pulse2(t, 4), rot: hash(i + e) });
    camBegin(W / 2, H / 2, 1 + .06 * kick, 0);
    if (!on) {
      const s = slam(t, tO, 1.5, .08);
      txt('O', 600, H / 2, { ...BIG, size: 640, col: PAL.clay, sx: s, sy: s });
      if (t >= tMy) { const s2 = slam(t, tMy, 1.6, .06); txt('MY', 1320, H / 2 + 40, { ...BIG, size: 300, col: PAL.clayDk, sx: s2, sy: s2 }); }
    } else {
      // sticker: bone slab, clay word, slightly tilted
      const s = slam(t, tHg, 1.5, .08), o = { ...BIG, size: 205 }, w = measure('HOMEGIRL', o);
      X.save(); X.translate(W / 2, H / 2); X.rotate(-.06); X.scale(s, s);
      rect(-w / 2 - 50, -170, w + 100, 340, PAL.void, .9);
      rect(-w / 2 - 60, -180, w + 100, 340, PAL.bone);
      txt('HOMEGIRL', -10, -10, { ...o, col: PAL.clay });
      txt(KR_HG, w / 2 - 60, -215, { f: 'kr', size: 110, col: PAL.void, rot: .1 });
      X.restore();
    }
    camEnd();
    chrome(t, on ? PAL.bone : PAL.clayDk);
    post({ chroma: .35 * kick });
  }

  // ---------- 6 · ADONAI: the holy freeze ----------
  function shotAdonai(t) {
    const ta = wordT(L4, 3);
    bg(PAL.void);
    const breath = .5 + .5 * Math.sin((t - ta) * TAU * .55);
    glowDot(W / 2, H / 2, 620, PAL.amber, .06 + .05 * breath);
    holy(ADONAI, W / 2, H / 2 - 20, { f: 'heb', w: 700, size: 400, dir: 'rtl', a: clamp((t - ta + .02) / .12) });
    post({ chroma: 0, bloom: .45 + .1 * breath, grain: .05, vig: .55 });
  }

  // ---------- 7 · TALMUDIC: a Vilna page, commentary wraps the word ----------
  const RASHI = 'RASHI: in the mood — that is, the vibe. for that — i.e. for this matter and not another. and why does it say "that"? to teach you that the mood is not general but particular, and the user knows which. ';
  const TOSAF = 'TOSAFOT: and if you say the mood is the vibe, is it not written "therapeutic"? one may answer: the vibe heals. Rabbeinu Tam says: only after midnight. and the sages disagree, for it is 3:07 AM. ';
  const WRAP = 'GLOSS: here the Gemara asks: from where do we learn that the machine may be consulted? as it is written, "oh my Claude." the student objects: but it is a chatbot! the teacher replies: so is everyone, after the second watch of the night. ';
  const CHAT = ['and how does that make you feel?', 'mm-hm. say more about that.', "it sounds like you're carrying a lot.", "you're absolutely right!", 'that is a really insightful question.', 'what would it mean to let that go?', "i'm here. take your time.", 'great question!! ✶', 'have you tried naming the feeling?', "you're absolutely right!"];
  // page geometry
  const PG = { top: 168, bot: 960, l: 150, r: W - 150, colW: 200, boxT: 310, boxB: 660 };
  const boxL = PG.l + PG.colW + 30, boxR = PG.r - PG.colW - 30;
  function block(x, y, w, h, str, o, lh, reveal, seed) {
    if (reveal <= 0) return;
    X.save(); X.beginPath(); X.rect(x, y, w, h * reveal); X.clip();
    const n = Math.ceil(h / lh);
    for (let i = 0; i < n; i++) {
      const off = Math.floor(hash(seed + i) * 40) + i * 37;
      txt(str.slice(off % str.length) + str, x, y + lh * (i + .5), { ...o, al: 'left', w: i === 0 ? 700 : o.w });
    }
    X.restore();
    rect(x, y + h * reveal - 3, w, 3, o.col, reveal < 1 ? 1 : 0);
  }
  function page(t, therapy) {
    const b0 = beatT(beatN(20.26)), b1 = b0 + BEAT, b2 = b1 + BEAT;
    const co = { f: 'bod', w: 500, size: 19, col: PAL.pink };
    // header
    txt('TRACTATE CLAUDE', W / 2, 120, { f: 'bod', w: 700, it: true, size: 36, col: PAL.clayDk, track: 8 });
    txt('1a', PG.l, 120, { f: 'bod', w: 700, size: 36, col: PAL.clayDk, al: 'left' });
    txt('ch. I · oh my', PG.r, 120, { f: 'bod', w: 500, it: true, size: 26, col: PAL.clayDk, al: 'right' });
    rect(PG.l, 150, PG.r - PG.l, 3, PAL.clayDk);
    if (!therapy) {
      block(PG.l, PG.top + 20, PG.colW, PG.bot - PG.top - 20, RASHI, co, 25, easeOut((t - b0) / .2), 1);
      block(PG.r - PG.colW, PG.top + 20, PG.colW, PG.bot - PG.top - 20, TOSAF, co, 25, easeOut((t - b1) / .2), 2);
      block(boxL, PG.boxB + 30, boxR - boxL, PG.bot - PG.boxB - 30, WRAP, { ...co, col: PAL.clay }, 25, easeOut((t - b2) / .2), 3);
    }
  }
  function shotTalmud(t) {
    const tT = wordT(L5, 5), b3 = beatT(beatN(21.63));
    bg(PAL.bone);
    const punch = t >= b3 ? 1.08 - .03 * easeOut((t - b3) / .4) : 1;
    camBegin(W / 2, H / 2 + 40, punch);
    page(t, false);
    // the lyric as the gemara's opening words, set as sung
    const words = ['IN', 'THE', 'MOOD', 'FOR', 'THAT'], up = easeOut((t - (tT - .25)) / .2);
    // big two-line lead-in that shrinks up into the gemara's opening line when the word-box opens
    const go = { ...BIG, size: lerp(130, 58, up), col: PAL.void, al: 'left' };
    const lines = up > .5 ? [words] : [words.slice(0, 3), words.slice(3)];
    let wi = 0;
    lines.forEach((ln, li) => {
      const fw = measure(ln.join(' '), go); let x = W / 2 - fw / 2;
      const y = lerp(430 + li * 180, 255, up);
      ln.forEach(w => {
        const at = wordT(L5, wi++);
        if (t >= at) { const s = slam(t, at, 1.4, .06); txt(w, x + measure(w, go) / 2, y, { ...go, al: 'center', sx: s, sy: s, col: w === 'MOOD' && up < 1 ? PAL.pink : PAL.void }); }
        x += measure(w + ' ', go);
      });
    });
    // the decorated initial-word box
    const bx = boxL, by = PG.boxT, bw = boxR - boxL, bh = PG.boxB - PG.boxT;
    const open = easeOut((t - (tT - .25)) / .2);
    if (open > 0) {
      rect(bx, by + bh / 2 * (1 - open), bw, bh * open, PAL.clay);
      rect(bx + 14, by + 14 + (bh / 2 - 14) * (1 - open), bw - 28, (bh - 28) * open, 'rgba(0,0,0,0)');
      X.save(); X.strokeStyle = PAL.bone; X.lineWidth = 3; X.strokeRect(bx + 16, by + 16 + (bh / 2 - 16) * (1 - open), bw - 32, (bh - 32) * open); X.restore();
      const o = { ...BIG, size: fitSize('TALMUDIC', { ...BIG, size: 300 }, bw - 70) };
      sampled('TALMUDIC', W / 2, by + bh / 2, { ...o, col: PAL.bone, barCol: PAL.pink, cands: ['tantric', 'dramatic', 'telemetric', 'magic'], seed: 7 }, t < tT ? .74 * seg(t, tT - .3, tT) : .75 + (t - tT) / .2);
    }
    camEnd();
    chrome(t, PAL.clayDk, .8, true, false);
    post({ chroma: t >= tT ? .5 * Math.exp(-(t - tT) * 12) : 0, bloom: .25 });
  }

  // ---------- 8 · THERAPEUTIC: commentary turns into therapist chat ----------
  function shotTherapy(t) {
    const tw = wordT(L5, 6), lt = t - tw, bn = beatN(t);
    bg(PAL.blush);
    page(t, true);
    // chat lines scroll up through the commentary columns
    X.save(); X.beginPath(); X.rect(PG.l, PG.top + 10, PG.r - PG.l, PG.bot - PG.top - 10); X.clip();
    const lh = 64, scroll = lt * 160, mo = { f: 'mono', w: 500, size: 30, al: 'left' };
    for (let i = 0; i < 18; i++) {
      const y = PG.top + 40 + i * lh - scroll % lh - Math.floor(scroll / lh) * 0, idx = (i + Math.floor(scroll / lh)) % CHAT.length;
      const s = CHAT[idx], hot = (i + Math.floor(scroll / lh)) % 4 === (bn & 3), right = (i + Math.floor(scroll / lh)) % 2;
      const shown = lt < .2 ? scramble(s, lt / .2, i) : s, w = measure(s, mo);
      const x = right ? PG.r - w - 40 : PG.l + 20;
      rect(x - 20, y - 26, w + 40, 52, hot ? PAL.pink : (right ? PAL.bone : mixCol(PAL.blush, PAL.pink, .25)));
      txt(shown, x, y, { ...mo, col: hot ? PAL.bone : PAL.clayDk });
    }
    X.restore();
    // the box widens across the page
    const bh = 300, by = H / 2 - bh / 2 + 10, kick = Math.exp(-sinceBeat(t) * 8);
    const boxCol = [PAL.clay, PAL.pink, PAL.void, PAL.clay][clamp(bn - beatN(tw), 0, 3)];
    rect(0, by, W, bh, boxCol);
    X.save(); X.strokeStyle = PAL.bone; X.lineWidth = 3; X.strokeRect(-10, by + 16, W + 20, bh - 32); X.restore();
    const o = { ...BIG, size: fitSize('THERAPEUTIC', { ...BIG, size: 300 }, W - 160) * (1 + .03 * kick) };
    sampled('THERAPEUTIC', W / 2, by + bh / 2, { ...o, col: PAL.bone, flashCol: PAL.blush }, .75 + lt / .2);
    chrome(t, PAL.clayDk, .8, true, false);
    post({ chroma: .6 * Math.exp(-lt * 10), bloom: .25 });
  }

  // ---------- 9 · GET ONE-SHOTTED: a giant 1 slams and shatters into its letters ----------
  function shotOneShot(t) {
    const tg = wordT(L5, 7), t1 = wordT(L5, 8), tShot = t1 + .26, tCrack = beatT(beatN(23.45)), tBoom = 23.6;
    if (t < t1) {
      bg(PAL.pink);
      const s = slam(t, tg, 1.4, .06);
      txt('GET', W / 2, H / 2, { ...BIG, size: 420, col: PAL.bone, sx: s, sy: s });
      chrome(t, PAL.bone, .85, true);
      post({ chroma: .3 });
      return;
    }
    const flash = t >= tBoom && t < tBoom + .05;
    bg(flash ? PAL.bone : PAL.clay);
    const k = Math.exp(-(t - t1) * 9) + (t >= tShot ? Math.exp(-(t - tShot) * 10) : 0) + (t >= tBoom ? Math.exp(-(t - tBoom) * 5) : 0);
    const [sx, sy] = shakeXY(t, 22 * clamp(k));
    X.save(); X.translate(sx, sy); glossClip();
    const one = { ...BIG, size: 1150 }, cx = W / 2 - 60, cy = H / 2 + 40, s = slam(t, t1, 2.6, .1);
    const ban = { ...BIG, size: 230 }, bRot = -.12, bx = W / 2 + 40, byy = H / 2 + 230;
    const L = 'ONESHOTTED';
    if (t < tCrack) {
      txt('1', cx + 26, cy + 26, { ...one, col: PAL.clayDk, sx: s, sy: s });
      txt('1', cx, cy, { ...one, col: PAL.bone, sx: s, sy: s });
      txt('one-shot · n=1 · temperature 0', cx + 300, cy - 380, { f: 'mono', w: 500, size: 26, col: PAL.bone, al: 'left' });
    } else {
      // the 1 was letters all along; then it bursts
      const pts = glyphPts('1', one, 22), e = t >= tBoom ? t - tBoom : 0;
      shards(pts.map(([px, py], i) => {
        const r = Math.hypot(px, py) + 1, v = (500 + 1700 * hash(i * 3.1)) * e, wob2 = (hash(i) - .5) * 1.2;
        const dx = px / r + wob2 * .5, dy = py / r + (hash(i * 1.7) - .5) * .8;
        return [L[i % L.length], cx + px + dx * v, cy + py + dy * v + 600 * e * e, (26 + 40 * e * hash(i * 5)) / 40, e * 9 * (hash(i * 2) - .5), i % 7 ? PAL.bone : PAL.pink];
      }));
    }
    if (t >= tShot) {
      const s2 = slam(t, tShot, 1.8, .07);
      if (t < tBoom) {
        X.save(); X.translate(bx, byy); X.rotate(bRot); X.scale(s2, s2);
        const w = measure('SHOTTED', ban);
        rect(-w / 2 - 40, -150, w + 80, 300, PAL.pink);
        txt('SHOTTED', 0, 0, { ...ban, col: PAL.bone });
        X.restore();
      } else {
        const pts = glyphPts('SHOTTED', ban, 22), e = t - tBoom, c = Math.cos(bRot), sn = Math.sin(bRot);
        shards(pts.map(([px, py], i) => {
          const qx = px * c - py * sn, qy = px * sn + py * c, v = (300 + 1400 * hash(i * 1.3 + 9)) * e;
          const ang = Math.atan2(qy, qx) + (hash(i * 4.1) - .5) * 1.4;
          return ['SHOTTED'[i % 7], bx + qx + Math.cos(ang) * v, byy + qy + Math.sin(ang) * v, (26 + 50 * e) / 40, e * 7 * (hash(i * 6) - .5), i % 5 ? PAL.pink : PAL.void];
        }));
      }
    }
    X.restore();
    if (t >= tBoom) {
      // the frame itself breaks: horizontal strips slide apart, alternating
      const e = t - tBoom, src = withLayer(0, c => c.drawImage(OUT, 0, 0)), n = 9;
      bg(PAL.void);
      for (let i = 0; i < n; i++) {
        const y0 = Math.floor(i * H / n), h = Math.ceil(H / n), dx = (i % 2 ? 1 : -1) * (40 + 260 * hash(i * 3.3)) * easeOut(e / .25) * (1 + e * 2);
        X.drawImage(src, 0, y0, W, h, dx, y0 + (hash(i) - .5) * 20 * e, W, h);
      }
    }
    chrome(t, PAL.bone, .85, true);
    post({ chroma: clamp(.3 + 1.2 * k, 0, 1.5), bloom: flash ? .6 : .35 });
  }

  chapter('chorus1', 16.0, 23.92, [
    [16.0, shotOh], [16.78, shotMy], [16.96, shotClaude], [17.6, shotAgi], [18.16, shotHomegirl],
    [19.26, shotAdonai], [20.18, shotTalmud], [21.94, shotTherapy], [22.82, shotOneShot]
  ]);
})();
