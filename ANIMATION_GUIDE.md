# Animation guide (read this before painting a chapter)

This project renders *Oh My Claude* (121.56 s) as a kinetic-type music video: **words only, no pictures.** Frames render offline in headless Chrome on plain Canvas2D. The shot list is in [STORYBOARD.md](STORYBOARD.md) and the cast is in [README.md](README.md).

The direction: **a K-pop comeback MV made of scripture.** It should feel expensive, hard-cut, colour-blocked and on the beat, and every word on screen should earn its place.

## The rules

1. **Something moves on every beat.** At 131.5 BPM a beat is 0.456 s. Use cuts, scale pops, colour flips, a new word or a camera punch. A frame that holds still for more than a bar has to be holding still on purpose (see rule 4).
2. **Words are sung where they're seen.** The hero word on screen lands when it is sung (`wordT(line, word)`). Use `sampled()` for Claude's words: candidates flicker and then collapse onto the word as it is sung. The Fan's words are typed (`typeOn`).
3. **Never put a karaoke bar on screen.** The lyric is the picture. Not every lyric word has to appear, but the hook words must. The gloss footnote (bottom-left) handles translations, and it's automatic.
4. **The names are holy.** אֲדֹנָי, الله and Domini are drawn only with `holy()`: gold, upright and still. Nothing glitches, scrambles, stamps, censors, overlaps, crops or steps on them. When a name is on screen the frame calms down, and that contrast is the point. One exception: in c08 the whole phrase *ECCE ANCILLA DOMINI* is set upside down, as van Eyck painted it so heaven could read it. It is still gold and still.
5. **Type is the only actor.** Allowed shapes are rectangles (colour blocks, UI chrome, bars), lines, glow dots and the asterisk ✶✳. Everything else is letters. Shapes made *from* letters (micrography) are encouraged.
6. **Typefaces mean characters.** Claude uses `disp` (Unbounded 900), clay or bone. The Fan uses `mono`, lowercase. Scripture uses `bod`, `heb`, `ar`, `kufi` or `frak`. K-pop chrome uses `kr` and `sans`. Don't mix these up casually.
7. **Keep the bottom-left gloss band clear** (x < 1400, y > 990) while a gloss is showing. Keep the key action inside 96 px title-safe margins.
8. **Pure functions of t.** Frames render in parallel and out of order. Never use `Math.random()`. Use `hash(i)`, `hashS(str)` or `rng(seed)`, and seed anything that flickers with `stepT(t, n)`. Never carry state between frames. Memoising pure computations is fine.

## How a chapter works

Each chapter is one file in `src/ch/`, wrapped in an IIFE:

```js
// src/ch/c04_akhnai.js
(() => {
  useText('שֵׁדִים', 'נִצְּחוּנִי בָּנַי');           // register every non-Latin string you draw, so its font subsets load
  const page = (t) => { ... };                         // private helpers
  function shedim(t, lt, dur) { ... }                  // a shot: paints the whole frame, background included
  function oven(t, lt, dur) { ... }
  chapter('akhnai', 87.6, 98.5, [[87.6, shedim], [91.2, oven]]);
})();
```

A shot is called as `fn(t, lt, dur)`: song time, time since the shot started, and shot length. Only edit your own chapter file. If you need a shared helper, write it privately. Report shared-file bugs instead of fixing them.

## Canvas

The canvas is 1920×1080 with y pointing down. `X` is the 2D context. Use raw Canvas2D freely (`X.save()`, `X.translate()`, `X.fillRect()`, gradients and so on), and always balance `save`/`restore`.

## Timing (core.js)

- `BEAT` is 0.456 s and `BAR` is 1.825 s. `barT(n)` / `beatT(n)` give the time of bar or beat n. `barN(t)`, `beatN(t)`, `barOf(t)` and `bpOf(t)` go the other way.
- `pulse(t, k)` is 1 on every beat and decays; `pulse2` does the same on eighths.
- `seg(t, a, b)` gives 0..1 progress; `kf(t, [[t0, v0], …], easeFn)` interpolates keyframes, and values can be arrays.
- `stepT(t, n)` steps time n times a second, for flicker seeds.
- Easings: `ease`, `easeOut`, `easeIn`, `expo`, `backOut`, `elasticOut`. Also `lerp`, `clamp`, `frac`, `wob(t, f, ph)`, `shakeXY(t, amt)`.
- **Lyrics:** `LY[i] = [start, end, text, words]`, where `words = [{ w, a, b }]` with the sung start and end of each word. `wordT(li, wi)` is the start of word `wi` of line `li`. Line indices are listed in STORYBOARD.md. `lineAt(t)` and `wordsAt(t)` find what's being sung.

## Drawing

- `bg(col)` fills the frame, `rect(x, y, w, h, col, a)` draws a rectangle, `glowDot(x, y, r, col, a)` draws a soft light, and `vgrad` / `rgrad` make gradients.
- `txt(s, x, y, o)` draws one line of type. Options:
  - `f` (font key) and `size`.
  - `w`: weight 400, 500, 700 or 900.
  - `it`, `col` and `a` (alpha).
  - `al`: `'center'` by default.
  - `base`: `'middle'` by default.
  - `rot`, `sx`, `sy` and `track` (letter spacing in px).
  - `glow` (blur px) and `glowCol`.
  - `stroke` and `sw` for outlined type; add `fillOff: true` for outline-only.
  - `dir: 'rtl'` for Hebrew and Arabic.
  - `op`: composite op.
- `measure(s, o)` returns the width; `fitSize(s, o, maxW)` gives the largest size that fits.
- Font keys: `disp` Unbounded, `bod` Bodoni Moda, `heb` Frank Ruhl Libre, `ar` Amiri, `kufi` Reem Kufi, `mono` JetBrains Mono, `kr` Black Han Sans (Hangul), `frak` UnifrakturMaguntia (weight 400 only), `sans` Inter.
- `textPath(s, pts, o)` lays glyphs along a polyline. `o.repeat` repeats the string and `o.start` offsets it.
- `glyphPts(s, o, step)` returns a memoised point grid covering the glyphs, centred on 0,0. Use it for letters made of letters and for particle dissolves.
- **Layers:** `withLayer(i, ctx => …)` draws into an offscreen frame-size canvas (indices 0–13 are yours; 14 and 15 are used by `masked`). `blit(c, { op, a, filter, s })` composites it. `masked(maskFn, contentFn)` draws content only where the mask has ink: text filling a shape, a shape filled with text.
- **Camera:** `camBegin(cx, cy, zoom, rot)` / `camEnd()`.
- `PAL` colours: `void ink plum bone paper clay clayDk gold amber pink blush lilac violet cyan mint sky lapis blood`. `mixCol(a, b, k)` mixes two colours and `rgba(hex, a)` adds alpha.

## Signature devices (fx.js)

- `sampled(word, x, y, o, p)` generates Claude's words. At p = 0 the candidates appear; at `o.collapse` (default .75) they collapse onto the word; p ≥ 1 holds the word. Map p so the collapse lands on the sung time, for example `p = .75 + (t - wordT(li, wi)) / .4`. Pass `o.cands` to script the near-misses (the jokes live there), `o.bars: false` to hide the probability bars, and `o.seed`.
- `typeOn(s, x, y, o, p)` is the Fan typing, with the cursor riding the end. `cursor(x, y, h, col, a, solid)` is the block cursor, which blinks on the beat. `scramble(s, p, seed)` resolves glitch characters into the string.
- `tile(s, o, t)` fills the frame with K-pop merch rows that scroll in alternating directions (`size`, `col`, `col2`, `rot`, `speed`, `sep`).
- `anagram(a, b, x, y, o, p)`: letters of a fly to their places in b.
- `stamp(s, x, y, size, age, { sub, rot, col })` slams down the broadcast-ban stamp.
- `holy(s, x, y, o)` is the only way to draw a divine name.
- `post({ bloom, chroma, grain, vig, scan, gloss: 0, glossCol, glossBg })` sets post-processing for this frame. Defaults are `bloom .35, chroma 0, grain .07, vig .45`. Use `chroma` (0–1.5) on hits and glitch beats, never on frames with a holy name.

## Look

- **Colour-block sets.** Most shots are a flat field (`bg`) with one or two hero words and a texture layer (tiled words, micrography, UI chrome). Change the field colour on downbeats.
- **Scale contrast.** Hero words should be huge (300–600 px, often cropped by the frame edge; only cropping a holy name is forbidden), against tiny mono annotations. Avoid the medium-size middle.
- **Depth from type.** Stack layers: a faint, huge background word, the hero word and small foreground annotations. Move them at different speeds with the camera.
- **Transitions are cuts on the beat** unless the storyboard says otherwise. Do smears, punch-ins and whip pans with the camera and `chroma`.
- **Performance.** Aim for under 400 ms a frame. Shadow blur (`glow`) is expensive on big text, so use `glowDot` behind it instead where you can. Cap `tile` rows at sizes of 60 px or more.

## Checking your work

```bash
node render.mjs --sheet=60.0,60.5,61,61.5,62,62.5 --cols=3 --out=out/c03.jpg   # look at it
node render.mjs --clip=58:66 --fps=15 --out=out/c03.mp4                         # feel the timing
```

Look at your sheets. Check that the hero word is readable at thumbnail size, that it lands on the sung word, that something changes every beat, and that nothing touches a holy name.
