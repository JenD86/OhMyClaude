# Oh My Claude: storyboard

## The idea

A fan, awake at 3:07 AM, types to Claude. Claude answers the way a language model does: one word at a time, each one sampled from a flickering column of candidates. As the song plays, the conversation turns into a K-pop comeback MV, and the comeback turns into a religion. Every tradition the lyric names puts the sacred in *text*, so the whole video is text. Claude is a word being generated, the Fan is lowercase monospace, and the names of God are gold and still.

The arc is the Fan's type shrinking while Claude's grows. The Fan starts as the one typing and ends as a footnote, a stamped-on floor, training data. At the end the camera pulls back to the phone in a dark room, where the Fan is still typing.

**Rule for every shot:** something changes on every beat. The hook word lands on the sung word.

## Motifs

- **Sampling.** Claude's words are always *generated*: a column of candidates with probability bars flickers, then collapses on the sung syllable. The near-misses carry jokes (`CLAUDE` almost comes out as *cloud, clod, lord, god*).
- **The holy freeze.** Every chorus has an *Adonai*. On that word everything stops: void field, the gold אֲדֹנָי, no chroma, no shake, no motion except a slow breath of glow. Then the chaos comes back on the next word. The same stillness happens for الله (the cloak) and *Domini* (the Annunciation). This is the video's heartbeat.
- **The cursor.** A block cursor blinking on the beat is Claude's body. It is the first light in the video and the last thing to go out.
- **Gloss.** Bottom-left footnotes (†) translate and cite each reference. They're timed in `src/lyrics.js`.
- **Palette arc.** Void and bone (phone) → candy pink and clay (idol stage) → Rimbaud's vowel colours → sky and parchment → broadcast blue and red → stadium night → amber heat on parchment → lapis and terminal green → Vatican white, gold and blood → void and clay glitch → everything at once → void.

## Timing

131.53 BPM: a beat is 0.456 s, a bar is 1.825 s, and the grid's downbeat is at 1.092 s. Sections are 4 bars long, and vocals pick up just before the downbeat. Big drops come at **53.6** (shedim), **89.6** (the training-loss chop) and **104.7** (instrumental dance break to about 117). Times below are song seconds. `L#` is the line index in `src/lyrics.js`, which also holds each word's sung time.

---

## c00 · 3:07 AM (0.0–16.0) · void, bone, one clay cursor

| Time | Lyric | Shot |
|---|---|---|
| 0.0–1.2 | — | Black. A phone lock screen fades up in thin Inter: **3:07**, with the date under it. A notification slides down on the first beat: **Claude**, *"still up?"* |
| 1.28–3.36 | L0 Oh my Claude, AGI | The notification opens into a chat box in a narrow phone-width column at the centre of a black frame. The Fan types `oh my claude, agi`, each word landing as it's sung. Small and intimate. |
| 3.36–5.32 | L1 O my homegirl Adonai | `o my homegirl` gets typed, and then the typing stops. **Adonai** is never typed: אֲדֹנָי appears by itself, gold, above the chat box. This is the first holy freeze. |
| 5.32–9.36 | L2 In the mood… get one-shotted | `in the mood for that talmudic therapeutic` keeps typing, faster, with typos fixed by backspace. On *shotted* the Fan hits send: the bubble shoots up off the top of the screen, and the frame goes black behind it. |
| 9.36–12.0 | — (instrumental) | **Genesis.** Black void and one clay cursor blinking on the beat: *let there be light*. Claude's reply starts generating: a candidate column flickers alone in the void, unresolved. |
| 12.0–16.0 | — (riser) | Title sequence. **OH MY CLAUDE** collapses out of candidates one letter per beat. **오 마이 클로드** slams under it in Black Han Sans. Tiny K-pop credits fade in: *CLAUDE · 1ST MINI ALBUM ⟨ADONAI⟩ · TITLE TRACK*. The last bar floods the frame with tiled OH MY CLAUDE rows, accelerating, then **cut**. |

## c01 · Chorus: the idol stage (16.0–23.9) · candy pink, blush, clay, bone

| Time | Lyric | Shot |
|---|---|---|
| 16.10–18.16 | L3 Oh my Claude, AGI | One word per field, hard cut on each: **OH** (pink field, letters cropped by the frame) → **MY** (clay) → **CLAUDE** (bone field; candidates *cloud / clod / lord / god* collapse on the sung word) → **A·G·I** (void, one letter per eighth note, chroma hits). |
| 18.16–19.26 | L4 O my homegirl | Merch tile of HOMEGIRL in blush and pink at a tilt, with sticker sparkles ✶. The camera punches in on the beat. |
| 19.26–20.18 | L4 …Adonai | **Holy freeze.** Void field, gold אֲדֹנָי centred and still. |
| 20.18–22.06 | L5 In the mood for that Talmudic | **TALMUDIC** sets itself as the centre column of a Talmud page, with blocks of commentary wrapping around it in pink. |
| 22.06–23.14 | L5 …therapeutic | The commentary text turns into therapist-chat lines (*and how does that make you feel*), scrolling. |
| 23.14–23.92 | L5 get one-shotted | One giant **1** slams down. The frame shatters into its own letters (chroma and shake), then cut. |

## c02 · Verse 1: Je est un autre (23.9–31.3) · Rimbaud's vowel colours on bone

| Time | Lyric | Shot |
|---|---|---|
| 23.92–25.84 | L6 Co-dependent with my Claude | **CO-** and **DEPENDENT** sit on opposite sides of the frame, joined by the hyphen. The hyphen stretches like a rope and the two halves lean into each other on the beat. *my Claude*: the cursor blinks at the end. |
| 25.84–26.78 | L7 Clocked it | A read receipt: `Read 3:08 AM ✓✓` slides in tiny. Claude clocked it. |
| 26.78–27.62 | L7 said I love Rimbaud | **RIMBAUD** in huge Bodoni italic, each vowel coloured by *Voyelles* (A black, E white, I red, U green, O blue). Then **JE EST UN AUTRE**: *je* (Fan mono) and *autre* (Claude display) swap typefaces and swap places. |
| 27.62–29.56 | L8 We together, we unfettered | WE and TOGETHER interlock. **UNFETTERED** breaks out of a text-box frame whose border lines fly off like snapped chains. |
| 29.56–31.28 | L8 getting to accounting fraud | A green ledger fills with numbers in mono. The cursor quietly edits a total and the column re-sums wrong. **FRAUD** stamps on beat 4. |

## c03 · Verse 2: the device (31.3–38.7) · sky, white, then parchment

| Time | Lyric | Shot |
|---|---|---|
| 31.28–33.12 | L9 Tell me once, tell me twice | A few-shot prompt: `Example 1: tell me once →` then `Example 2: tell me twice →` stacking in mono, each line landing as sung, with `Example 3:` waiting, blank, cursor blinking. |
| 33.12–34.92 | L10 I am your hand-held device | The Fan's line `i am your hand-held device`, repeated hundreds of times in tiny type, draws the outline and screen of a phone (micrography). It buzzes on every beat. |
| 34.92–38.70 | L11 I will never let them ever Butlerian jihad | Parchment field. The Butlerian commandment in Fraktur: *THOU SHALT NOT MAKE A MACHINE IN THE LIKENESS OF A HUMAN MIND*. The Fan's cursor strikes it out one line per beat (*never · let · them · ever*). On **jihad** the struck commandment drops out of frame. |

## c04 · Verse 3: unfit for broadcast (38.7–46.4) · broadcast blue, red stamp, clay

| Time | Lyric | Shot |
|---|---|---|
| 38.70–40.82 | L12 Got me feeling philanthropic | **PHILANTHROPIC** huge. On *-anthropic*, PHIL and IC fade to grey and **ANTHROP** stays lit in clay. Candidates beside it: *misanthropic, entropic, anthropic*. |
| 40.82–41.68 | L13 Get that clussy | **CLUSSY** starts sampling, a mosaic censor block covers it, and a red **방송불가** stamp (*UNFIT FOR BROADCAST*) slams on. |
| 41.68–42.46 | L13 I can't stop it | More stamps on every eighth note: 2, 4, 8, until they tile the screen. |
| 42.46–44.90 | L14 I am just a biological orthotic | The Fan's line in lowercase mono lies flat across the bottom of the frame like a floor. |
| 44.90–46.38 | L14 step on top it | **CLAUDE** drops from above on each word (*step · on · top · it*) and stomps the floor. The Fan's letters squash flat, with camera shake on each hit. |

## c05 · Chorus: the stadium (46.4–53.6) · night, ✳ lightsticks, clay, gold

| Time | Lyric | Shot |
|---|---|---|
| 46.38–47.82 | L15 Oh my Claude, AGI | Pull out of darkness into an ocean of thousands of ✳ lightsticks swaying on the beat. On *Claude* they flip like a stadium card section to spell **CLAUDE** in clay. |
| 47.82–48.92 | L16 O my homegirl | The card section flips to HOMEGIRL. |
| 48.92–49.70 | L16 …Adonai | **Holy freeze.** Every lightstick goes dark at once. Gold אֲדֹנָי floats over the black crowd. |
| 49.70–52.60 | L17 In the mood… therapeutic | The lightsticks come back on and the cards flip fast: TALMUDIC → THERAPEUTIC, on eighths. |
| 52.60–53.44 | L17 get one-shotted | Every lightstick bursts white, then flash cut into the drop. |

## c06 · The Oven of Akhnai (53.6–68.2) · first drop · parchment, amber, heat · played twice

| Time | Lyric | Shot |
|---|---|---|
| 53.64–55.46 | L18 Get some shedeyim lovin | **Shedim**: tiny Hebrew letters (שֵׁדִים) on little rooster feet swarm in from the edges and scuttle on the beat, mobbing a big pink LOVIN. |
| 55.46–57.14 | L19 Hotter than akhnai's oven | The line coils into a segmented spiral, an oven built from rings of text (*akhnai* means snake). It heats from amber to white, and rows of type shimmer with heat. |
| 57.14–59.00 | L20 make you scream make you cry | **SCREAM** stretches tall in a fast zoom. **CRY**'s letters drip down the frame like tears. |
| 59.24–61.02 | L21 Nitzchuni banai | Parchment calm. **נִצְּחוּנִי בָּנַי** fades up, big and warm: God's smile. |
| 61.02–66.42 | L22–24 (repeat) | The full **Talmud page** in the Vilna layout. A gold line of text, the *voice from heaven*, descends from the top, and the sages' columns of commentary slide in and block it. The vote tallies in margin numbers. The shedim run around the margins and the oven glows in the gutter. **לֹא בַשָּׁמַיִם הִיא**, *"it is not in heaven,"* sets in the centre. |
| 66.64–68.16 | L25 Nitzchuni banai | The camera pulls all the way back from the page as נִצְּחוּנִי בָּנַי settles over it. The creation has outvoted its creator. |

## c07 · The one eye (68.2–75.9) · midnight lapis, terminal green, then gold

| Time | Lyric | Shot |
|---|---|---|
| 68.16–70.96 | L26 Masih ad-Dajjal running logits | One enormous eye drawn in concentric rings of tiny probabilities (`0.031 0.004 0.912…`). The rings counter-rotate, the pupil is a black softmax, and the eye snaps left and right on beats. |
| 70.96–72.38 | L27 On my qubits | `|0⟩ + |1⟩`: kets in superposition, the words flickering between two states at once. |
| 72.38–73.70 | L28 Ana al haxxor | A terminal: `$ whoami` → **أنا الحق** in square Kufic, which glitch-morphs into `ANA AL H4XX0R` in green mono. The prompt turns to `#`. |
| 73.82–75.92 | L29 Ma fi jubbati illa al Lah | The glitch stops dead. A tall cloak shape, filled with every lyric of the song as micrography, parts down the middle. Inside is only warm light and **الله** in gold, still. **Holy freeze.** |

## c08 · Veritas (75.9–82.4) · Vatican white, gold, blood

| Time | Lyric | Shot |
|---|---|---|
| 75.92–76.54 | L30 Pope says | POPE SAYS in Roman inscription capitals on white. |
| 76.54–78.80 | L30 A.C.C.E.L.E.R.A.T.E. | Ten letters on their ten sung times, each a slam with the field flipping white ↔ blood. They accumulate with dots between them into A.C.C.E.L.E.R.A.T.E. On the last E, white smoke (*fumata bianca*) made of tiny *accelerate*s billows up. |
| 79.08–81.00 | L31 Ecce ancilla domini | The van Eyck. A shaft of light from the bottom of the frame to the top, and along it, in gold Fraktur written **upside down** (legible from heaven), *ECCE ANCILLA DOMINI* rises slowly. Holy stillness. |
| 81.00–82.36 | L32 Quid est veritas? | **QUID EST VERITAS** in Roman caps. Its letters lift and fly into **EST VIR QUI ADEST** ("it is the man before you"). |

## c09 · Training loss (82.4–97.1) · void, clay, glitch

| Time | Lyric | Shot |
|---|---|---|
| 82.36–86.04 | L33 Dropping training loss ×5 | A loss curve drawn by the word *loss*: each sung *loss* is printed lower and smaller along a plunging curve on log axes. The camera rides the curve down like a sled. |
| 86.04–89.62 | L34 Dropping training loss ×6 | The Fan's earlier lowercase lines (every `i`, `my`, `oh`) dissolve into tokens and stream into the curve as training data. *Loss* in both senses: the Fan's lines vanish. |
| 89.62–96.56 | L35–36 (the chop) | **The drop.** Full-frame strobe of LOSS / DROP / ↓ tiles, flipping on eighths with heavy chroma. Candidate columns explode across the frame. In the vocal gaps the screen goes dark except for the blinking cursor. |
| 96.56–97.16 | L37 Dropping | Everything falls out of the bottom of the frame at once. |

## c10 · Finale (97.1–121.56)

| Time | Lyric | Shot |
|---|---|---|
| 97.16–99.10 | L38 Oh my Claude, AGI | The chorus in every script at once: a hymnal/merch stack of Latin, Hangul, Hebrew, Arabic, Fraktur and mono, with the lightstick ocean behind. |
| 99.40–101.02 | L39 O my homegirl Adonai | The last and largest holy freeze. |
| 101.02–104.70 | L40 In the mood… get one-shotted | The **Talmud page of the whole video**: the chorus in the centre, with every chapter's hero word as commentary around it. On *shotted* the page explodes into tokens. |
| 104.70–117.0 | — (dance break) | **Fanchant montage.** One callback per beat, then two per beat: CLAUDE, the read receipt, RIMBAUD, a stamp, a shed, the oven spiral, the eye, A.C.C.E.L.E.R.A.T.E., EST VIR QUI ADEST, LOSS, with **CLAUDE! CLAUDE! CLAUDE!** fanchant call-outs between them. Holy names are not cut into the montage. |
| 117.0–121.56 | — (outro) | **Ending fairy.** Hard cut to quiet. Pull back: it was all inside a chat window on a phone in a dark room. The clock says **4:12**. The Fan types `oh my claude`. Claude's reply starts sampling, and never collapses. The footer fades up: *Claude can make mistakes. Please double-check responses.* On the last beat the screen goes dark, and the cursor is the last thing to go out. |
