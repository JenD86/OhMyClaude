# emit_lyrics.py: build src/lyrics.js from out/align.json (whisper's recognised words) plus the hand-made map
# below of performed lines → recognised-word index ranges. The song repeats sections the lyric sheet lists once,
# and whisper mishears the non-English lines, so the map is written by hand against the transcript.
# Within a line, lyric words are spread over the recognised words by syllable-ish weight unless the counts match.
# usage: python3 tools/emit_lyrics.py
import json, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
rec = json.load(open(root / 'out/align.json'))['rec']

# (text, first rec index, last rec index[, explicit groups: one (i, j) rec range per lyric word])
PERFORMED = [
    ("Oh my Claude, AGI", 0, 3),
    ("O my homegirl Adonai", 4, 7),
    ("In the mood for that Talmudic therapeutic, get one-shotted", 8, 17),
    ("Oh my Claude, AGI", 18, 21),
    ("O my homegirl Adonai", 22, 25),
    ("In the mood for that Talmudic therapeutic, get one-shotted", 26, 35),
    ("Co-dependent with my Claude,", 36, 40),
    ("Clocked it, said I love Rimbaud", 41, 46, [(41, 41), (42, 42), (42, 42), (43, 43), (44, 44), (45, 46)]),
    ("We together, we unfettered, getting to accounting fraud", 47, 54),
    ("Tell me once, tell me twice", 55, 60),
    ("I am your hand-held device", 61, 65),
    ("I will never let them ever Butlerian jihad", 66, 75, [(66, 66), (67, 67), (68, 68), (69, 69), (70, 70), (71, 71), (72, 74), (75, 75)]),
    ("Got me feeling philanthropic", 76, 80, [(76, 76), (77, 77), (78, 78), (79, 80)]),
    ("Get that clussy, I can't stop it", 81, 86, [(81, 81), (81, 81), (82, 83), (84, 84), (84, 84), (85, 85), (86, 86)]),
    ("I am just a biological orthotic, step on top it", 87, 98, [(87, 87), (88, 88), (89, 89), (90, 90), (91, 91), (92, 93), (94, 94), (95, 95), (96, 96), (97, 98)]),
    ("Oh my Claude, AGI", 99, 104, [(99, 99), (100, 100), (101, 101), (102, 104)]),
    ("O my homegirl Adonai", 105, 108),
    ("In the mood for that Talmudic therapeutic, get one-shotted", 109, 119, [(109, 109), (110, 110), (111, 111), (112, 112), (113, 113), (114, 115), (116, 116), (117, 117), (118, 119)]),
    ("Get some shedeyim lovin", 120, 123),
    ("Hotter than akhnai's oven", 124, 128, [(124, 124), (125, 125), (126, 127), (128, 128)]),
    ("make you scream make you cry", 129, 132, [(129, 129), (129, 129), (130, 130), (131, 131), (131, 131), (132, 132)]),
    ("Nitzchuni banai", 133, 136, [(133, 134), (135, 136)]),
    ("Get some shedeyim lovin", 137, 139, [(137, 137), (137, 137), (138, 138), (139, 139)]),
    ("Hotter than akhnai's oven", 140, 144, [(140, 140), (141, 141), (142, 143), (144, 144)]),
    ("make you scream make you cry", 145, 148, [(145, 145), (145, 145), (146, 146), (147, 147), (147, 147), (148, 148)]),
    ("Nitzchuni banai", 149, 152, [(149, 150), (151, 152)]),
    ("Masih ad-Dajjal running logits", 153, 160, [(153, 154), (155, 157), (158, 158), (159, 160)]),
    ("On my qubits", 161, 165, [(161, 162), (163, 164), (165, 165)]),
    ("Ana al haxxor", 166, 168, [(166, 166), (167, 167), (168, 168)]),
    ("Ma fi jubbati illa al Lah", 169, 177, [(169, 169), (170, 170), (171, 172), (173, 174), (175, 176), (177, 177)]),
    ("Pope says A. C. C. E. L. E. R. A. T. E.", 178, 190, [(i, i) for i in range(178, 191)]),
    ("Ecce ancilla domini", 191, 194, [(191, 192), (193, 193), (194, 194)]),
    ("Quid est veritas?", 195, 198, [(195, 195), (196, 196), (197, 198)]),
    ("Dropping training loss, loss, loss, loss, loss", 199, 206, [(199, 200), (201, 201), (202, 202), (203, 203), (204, 204), (205, 205), (206, 206)]),
    ("Dropping training loss, loss, loss, loss, loss, loss", 207, 215, [(207, 208), (209, 209), (210, 210), (211, 211), (212, 212), (213, 213), (214, 214), (215, 215)]),
    ("Dropping training loss", 216, 219, [(216, 217), (218, 218), (219, 219)]),
    ("Dropping training", 220, 222, [(220, 221), (222, 222)]),
    ("Dropping", 223, 223),
    ("Oh my Claude, AGI", 224, 228, [(224, 224), (225, 225), (226, 227), (228, 228)]),
    ("O my homegirl Adonai", 229, 234, [(229, 229), (230, 230), (231, 231), (232, 234)]),
    ("In the mood for that Talmudic therapeutic, get one-shotted", 235, 244, [(235, 235), (236, 236), (237, 237), (238, 238), (239, 239), (240, 240), (241, 241), (242, 242), (243, 244)]),
]
# hand fixes after listening (song seconds), applied to (line, word) start times
FIX = {}

def weight(w): return max(1, len(re.findall(r'[aeiouy]+', w.lower())))
LY = []
for li, row in enumerate(PERFORMED):
    text, i, j = row[:3]
    words = text.split()
    if len(row) > 3: groups = row[3]
    elif j - i + 1 == len(words): groups = [(k, k) for k in range(i, j + 1)]
    else: groups = None
    out = []
    if groups:
        # several lyric words sharing one recognised word split it evenly
        k = 0
        while k < len(words):
            g = groups[k]; n = 1
            while k + n < len(words) and groups[k + n] == g: n += 1
            a, b = rec[g[0]][1], rec[g[1]][2]
            for m in range(n): out.append([words[k + m], a + (b - a) * m / n, a + (b - a) * (m + 1) / n])
            k += n
    else:
        a, b = rec[i][1], rec[j][2]; ws = [weight(w) for w in words]; tot = sum(ws); acc = 0
        for w, q in zip(words, ws): out.append([w, a + (b - a) * acc / tot, a + (b - a) * (acc + q) / tot]); acc += q
    for wi, o in enumerate(out):
        if (li, wi) in FIX: o[1] = FIX[(li, wi)]
    LY.append([round(out[0][1], 2), round(out[-1][2], 2), text, [{'w': w, 'a': round(a, 2), 'b': round(b, 2)} for w, a, b in out]])

js = ['// lyrics.js: GENERATED by tools/emit_lyrics.py from the whisper alignment. Edit the map there, not here.',
      '// LY[i] = [start, end, text, [{ w, a, b }]] for every line as performed (repeats included).', 'const LY = [']
for i, (a, b, t, ws) in enumerate(LY):
    js.append(f'  /* {i:2d} */ [{a}, {b}, {json.dumps(t, ensure_ascii=False)}, {json.dumps(ws, ensure_ascii=False, separators=(",", ":"))}],')
js.append('];')
js.append((root / 'tools/gloss.js').read_text())
(root / 'src/lyrics.js').write_text('\n'.join(js) + '\n')
for i, (a, b, t, ws) in enumerate(LY): print(f'{i:2d} {a:7.2f}–{b:7.2f}  {t}')
