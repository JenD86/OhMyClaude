# beatgrid.py: fit an exact BPM + phase to the song's onset envelope, and print a per-bar energy map.
# usage: ffmpeg -i assets/song.mp3 -ac 1 -ar 22050 -f s16le - | python3 tools/beatgrid.py
import sys, numpy as np
x = np.frombuffer(sys.stdin.buffer.read(), dtype=np.int16).astype(float) / 32768
sr, h = 22050, 256
fr = np.lib.stride_tricks.sliding_window_view(x, 2048)[::h]
S = np.abs(np.fft.rfft(fr * np.hanning(2048), axis=1))
low = np.maximum(0, np.diff(np.log1p(S[:, 1:40]), axis=0)).sum(1)   # kick band
fl = np.maximum(0, np.diff(np.log1p(S), axis=0)).sum(1)
fps = sr / h
env = low / low.max() + .5 * fl / fl.max()
best = (0, 0, 0)
for bpm in np.arange(126, 133, .01):
    per = 60 / bpm * fps
    for ph in np.arange(0, per, .5):
        idx = (ph + np.arange(0, (len(env) - ph) / per) * per).astype(int)
        s = env[idx].mean()
        if s > best[0]: best = (s, bpm, ph / fps)
_, bpm, off = best
beat = 60 / bpm
print(f"BPM={bpm:.2f} BEAT={beat:.5f} OFF={off:.4f}")
# downbeat: which beat-in-bar has the strongest kick
k = [np.mean([low[int((off + (i * 4 + j) * beat) * fps)] for i in range(int(len(low) / fps / beat / 4) - 1)]) for j in range(4)]
d = int(np.argmax(k)); print("bar phase (beat idx of downbeat):", d, [round(v, 3) for v in k])
rms = np.sqrt((fr ** 2).mean(1)); bar = 4 * beat
nb = int(len(rms) / fps / bar)
e = np.array([rms[int((off + (d + i * 4) * beat) * fps):int((off + (d + i * 4) * beat + bar) * fps)].mean() for i in range(nb)])
lo = np.array([low[int((off + (d + i * 4) * beat) * fps):int((off + (d + i * 4) * beat + bar) * fps)].mean() for i in range(nb)])
for i in range(nb):
    t = off + (d + i * 4) * beat
    print(f"bar {i:2d} {t:6.2f}s  rms {'#' * int(e[i] / e.max() * 30):30s} kick {'*' * int(lo[i] / lo.max() * 20)}")
