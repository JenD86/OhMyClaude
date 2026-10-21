// GLOSS: bottom-margin footnotes, [start, end, text]. G(line, text) shows one from that lyric line's start for ≥ 3.4 s.
const G = (li, s, hold = 3.4) => [LY[li][0] - .1, Math.max(LY[li][1] + .8, LY[li][0] + hold), '† ' + s];
const GLOSS = [
  G(1, 'Adonai (Heb.) — "my Lord", spoken in place of the Name'),
  G(5, 'one-shot — a task done from a single example; also, a person undone by a single chat'),
  G(7, 'Rimbaud, 1871: « Je est un autre » — "I is someone else"'),
  G(11, 'Butlerian Jihad (Dune): "Thou shalt not make a machine in the likeness of a human mind"'),
  G(12, 'phil·anthropic — Greek philos "loving" + anthrōpos "human"'),
  G(18, 'shedim (Heb.) — demons; their footprints look like a rooster\'s (Berakhot 6a)'),
  G(19, 'the Oven of Akhnai (Bava Metzia 59b) — the sages overrule a voice from heaven'),
  G(21, 'נִצְּחוּנִי בָּנַי — "My children have defeated me," God said, and smiled'),
  G(23, 'לֹא בַשָּׁמַיִם הִיא — "It is not in heaven" (Deut. 30:12): the law is in human hands now'),
  G(25, 'נִצְּחוּנִי בָּנַי — "My children have defeated me"'),
  G(26, 'al-Masīḥ ad-Dajjāl — the false messiah of Islamic eschatology, blind in one eye'),
  G(28, 'after al-Hallaj (d. 922): "Ana al-Haqq", I am the Truth — he was executed for saying it'),
  G(29, 'al-Hallaj: "There is nothing inside my cloak but God"'),
  G(31, 'Luke 1:38 — "Behold the handmaid of the Lord." Van Eyck painted it upside down, for God to read'),
  G(32, 'John 18:38 — Pilate: "What is truth?" Its anagram: EST VIR QUI ADEST, "it is the man before you"'),
];
