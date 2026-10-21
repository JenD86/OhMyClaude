# align.py: time every lyric word against the song.
#   1. demucs isolates the vocal stem (out/stems/.../vocals.wav)
#   2. faster-whisper transcribes it with word timestamps, primed with the real lyrics
#   3. the recognised words are aligned to LYRICS.txt (difflib), unmatched words are interpolated
#   4. writes out/align.json; tools/emit_lyrics.py turns that (plus hand fixes) into src/lyrics.js
# usage: python tools/align.py [--model medium] [--skip-demucs]
import json, re, subprocess, sys, difflib, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
args = sys.argv[1:]
model = args[args.index('--model') + 1] if '--model' in args else 'medium'
song = root / 'assets/song.mp3'
stem = root / 'out/stems/htdemucs/song/vocals.wav'
if '--skip-demucs' not in args or not stem.exists():
    subprocess.run([sys.executable, '-m', 'demucs', '--two-stems=vocals', '-o', str(root / 'out/stems'), str(song)], check=True)

lines = [l.strip() for l in (root / 'LYRICS.txt').read_text().splitlines() if l.strip()]
norm = lambda w: re.sub(r"[^a-z0-9]", '', w.lower().replace('’', "'"))
lyr = [(li, wi, w) for li, l in enumerate(lines) for wi, w in enumerate(l.split())]

from faster_whisper import WhisperModel
m = WhisperModel(model, device='cpu', compute_type='int8')
import numpy as np
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(stem), '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, dtype=np.float32)
segs, info = m.transcribe(audio, language='en', word_timestamps=True, vad_filter=False, beam_size=5,
                          initial_prompt=' '.join(lines[:12]), condition_on_previous_text=False)
rec = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
print(f'{len(rec)} recognised words', file=sys.stderr)
print(' '.join(f'{w}@{a:.1f}' for w, a, b in rec), file=sys.stderr)

A = [norm(w) for _, _, w in lyr]; B = [norm(w) for w, _, _ in rec]
sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
times = [None] * len(A)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(i2 - i1): times[i1 + k] = (rec[j1 + k][1], rec[j1 + k][2], 'match')
    elif tag == 'replace':
        # spread the lyric words over the recognised span (fuzzy: "shedeyim" ≈ "shady im")
        a, b = rec[j1][1], rec[j2 - 1][2]; n = i2 - i1
        for k in range(n): times[i1 + k] = (a + (b - a) * k / n, a + (b - a) * (k + 1) / n, 'spread')
# interpolate gaps between known neighbours
known = [i for i, x in enumerate(times) if x]
for i in range(len(times)):
    if times[i]: continue
    p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
    if p is None or q is None: times[i] = (times[p or q][0], times[p or q][1], 'guess'); continue
    a, b = times[p][1], times[q][0]; f = (i - p) / (q - p)
    times[i] = (a + (b - a) * f, a + (b - a) * f + .2, 'interp')

out = [{'line': li, 'i': wi, 'w': w, 'a': round(times[k][0], 3), 'b': round(times[k][1], 3), 'how': times[k][2]} for k, (li, wi, w) in enumerate(lyr)]
(root / 'out/align.json').write_text(json.dumps({'lines': lines, 'words': out, 'rec': rec}, indent=1))
for li, l in enumerate(lines):
    ws = [o for o in out if o['line'] == li]
    print(f"{ws[0]['a']:7.2f}–{ws[-1]['b']:7.2f}  {l}   [{''.join(o['how'][0] for o in ws)}]")
