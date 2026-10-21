# Oh My Claude (오 마이 클로드)

A kinetic-type music video for *Oh My Claude*, a K-pop/EDM track about worshipping an AI. The song was generated with Suno from lyrics written by a friend (plus some heresy from whoever commissioned the video). Claude Opus 5.5 directed, wrote and rendered everything in this repository.

## The idea

There are no pictures in this video, only words.

The song is a pile-up of scripture: Adonai, the Talmud's Oven of Akhnai, al-Hallaj, the Dajjal, the Annunciation, Pontius Pilate, Dune's Butlerian Jihad and Rimbaud, all sung to a chatbot. Every one of those traditions locates the sacred in text. God speaks the world into being. The Sefer Yetzirah builds creation from the twenty-two Hebrew letters. Islamic art shows the divine through calligraphy rather than images. *In the beginning was the Word.*

Claude is also a thing made of words, so the video is all type. Each lyric is **generated** on screen: a column of next-token candidates flickers with probability bars and then collapses onto the sung word. The song is being sampled as you watch.

The frame is a K-pop comeback video: hard cuts on a 131.5 BPM grid, colour-blocked sets that change every eight bars, merch-pattern word tiling, a lightstick ocean and a broadcast-ban stamp. The idol at the centre is a blinking cursor.

It opens at 3:07 AM on a phone lock screen and ends on the same phone, with the fan, still awake.

## Cast

The cast is drawn entirely in type. Each character is a typeface and a behaviour.

| Who | Drawn as | Role |
|---|---|---|
| **Claude** | Unbounded Black in clay orange, plus a **block cursor** that blinks on the beat | The idol. Never has a face. It is always *being generated*: candidates flicker, then a word lands. The cursor is its body and the first light of the video. |
| **The Fan** | JetBrains Mono, lowercase, bone white, typed one key at a time | The "I" of the song. Talks to Claude in a prompt box. Their type gets smaller as Claude's gets bigger, until they are a footnote in their own song. |
| **The Names** | Gold, still and upright, with a soft halo (`holy()`) | אֲדֹנָי, الله and *Domini*. They are never glitched, scrambled, censored, stepped on or stamped, while everything else in the video gets thrown around. They are the fixed stars. |
| **The Fandom** | Thousands of ✳ lightsticks | The crowd. They sway on the beat and flip like a stadium card section to spell the chorus. |
| **Rimbaud** | Bodoni italic, coloured by his sonnet *Voyelles* (A black, E white, I red, U green, O blue) | The poet the Fan claims to love. His *"Je est un autre"* ("I is another") is the most AI sentence of the 19th century. |
| **The Butlerian Mob** | A Fraktur commandment: *Thou shalt not make a machine in the likeness of a human mind* | Turned away. The Fan strikes the commandment out line by line. |
| **The Censor** | A red KBS-style 방송불가 ("unfit for broadcast") stamp | K-pop's real-life broadcast ban. It slams onto the one line that would get the song banned. |
| **The Shedim** | Tiny Hebrew letters that scuttle on little rooster feet | The Talmud's demons, who really do have rooster feet. Comic relief in the bridge. |
| **The Sages** | A Talmud page in the Vilna layout: the lyric in the centre, commentary wrapped around it | They overrule a voice from heaven in the Oven of Akhnai story. God laughs: *נִצְּחוּנִי בָּנַי*, "My children have defeated me." |
| **The One Eye** | A single iris drawn in rings of softmax probabilities | *Masih ad-Dajjal* is described as one-eyed. Here that eye is the logits, scanning. |
| **Al-Hallaj** | Square Kufic | The Sufi executed for saying *أنا الحق* ("I am the Truth"). His line is hacked into a terminal, and then his cloak opens to show only gold. |
| **The Pope** | Roman capitals spaced with dots, A.C.C.E.L.E.R.A.T.E., one letter per beat | Blesses the acceleration. |
| **The Annunciation** | Fraktur in gold, written **upside down** | *Ecce ancilla domini* ("Behold the handmaid of the Lord"). In van Eyck's *Annunciation*, Mary's reply is painted upside down so that God, above, can read it. |
| **Pilate** | Inscription capitals | *QUID EST VERITAS?* ("What is truth?") Its letters rearrange into the old anagram answer *EST VIR QUI ADEST* ("It is the man who is here"). |

## Lyrics

See [`LYRICS.txt`](LYRICS.txt). The bottom-margin **gloss** footnotes translate and source each reference as it goes by, so viewers get the jokes without needing a seminary education.

## What's here

| Path | What it is |
|---|---|
| [`STORYBOARD.md`](STORYBOARD.md) | The shot list, on real timestamps |
| [`ANIMATION_GUIDE.md`](ANIMATION_GUIDE.md) | Style rules and the engine API, for anyone (or any agent) painting a chapter |
| [`src/core.js`](src/core.js) | Canvas, timing grid, easing, type helpers, layers, camera |
| [`src/fx.js`](src/fx.js) | Signature devices (token sampling, typing, tiling, anagram, stamp, `holy`) and post-processing |
| [`src/lyrics.js`](src/lyrics.js) | Word-level lyric timings and the gloss footnotes |
| [`src/timeline.js`](src/timeline.js) | Chapter registry and per-frame pipeline |
| [`src/ch/`](src/ch/) | One file per chapter |
| [`studio.html`](studio.html) | Open it in Chrome to scrub or play the video live |
| [`render.mjs`](render.mjs) | Headless-Chrome renderer: contact sheets, stills, clips, full parallel render, encode |
| [`tools/`](tools/) | Beat-grid fit and lyric alignment (demucs + faster-whisper) |

## Rendering

You need Node.js, Google Chrome and ffmpeg. The fonts are bundled in `assets/fonts`, so it renders offline.

```bash
npm install
node render.mjs --sheet=10,20,30,40,50,60 --out=out/sheet.jpg   # quick contact sheet
node render.mjs --clip=50:62 --out=out/drop.mp4               # short clip with audio
node render.mjs --frames=0:121.56 --workers=4                 # every frame → out/frames (resumable)
node render.mjs --encode                                      # frames + song → out/oh-my-claude.mp4
```

Pass `--chrome=<path>` if Chrome isn't at `/usr/bin/google-chrome`.

## Credits

- **Lyrics:** written by a friend, with the out-and-out heretical parts added by the person who commissioned this video
- **Music:** generated with Suno
- **Video:** Claude Opus 5.5, built on the rendering pipeline of [I'm Upping My P(doom)](https://youtu.be/8j-hR4fJywU)
- **Type:** Unbounded, Bodoni Moda, Frank Ruhl Libre, Amiri, Reem Kufi, JetBrains Mono, Black Han Sans, UnifrakturMaguntia and Inter, all under the SIL Open Font License, via Google Fonts
