#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v43 데이터 생성 — index-v31-engine.html 의 RAW(패턴당 5문장)에
   new_sentences.NEW(패턴당 5문장)를 합쳐 src/raw_v43.json 을 만든다.

   raw_v43.json = {"patterns":[...], "rows":[[ko,en,chunks,p,lv], ...]}
   build.py 가 이 JSON 으로 엔진의 RAW 배열을 통째로 바꾼다.
"""
import json, re
from pathlib import Path
import new_sentences

ROOT = Path(__file__).resolve().parent
SRC  = ROOT.parent / "index-v31-engine.html"
OUT  = ROOT / "raw_v43.json"

raw = SRC.read_text(encoding="utf-8")

# ── 기존 RAW 파싱 ──────────────────────────────────────────────
i = raw.index("var RAW = [")
j = raw.index("];", i)
block = raw[i:j]

LINE = re.compile(r'^\s*\[(".*?"),(".*?"),(".*?"),(\d+),(\d+)\],?\s*$', re.M)
rows = []
for m in LINE.finditer(block):
    try:
        ko, en, ch = (json.loads('"' + m.group(k)[1:-1] + '"') for k in (1, 2, 3))
    except Exception:
        ko, en, ch = m.group(1)[1:-1], m.group(2)[1:-1], m.group(3)[1:-1]
    rows.append([ko, en, ch, int(m.group(4)), int(m.group(5))])
assert len(rows) == 150, "기존 RAW %d개" % len(rows)
for _i, _r in enumerate(rows):
    _r.append(_i + 1)          # 예전 문장 id 그대로 — 저장된 '푼 문장'이 다른 문장을 가리키지 않게

# ── PATTERNS 이름 ─────────────────────────────────────────────
p0 = raw.index("var PATTERNS = [")
p1 = raw.index("];", p0)
pats = re.findall(r'"(.*?)"', raw[p0:p1])
assert len(pats) == 31, "PATTERNS %d개" % len(pats)

# ── 기존 5문장 다듬기 — 한 패턴 안에서 뒷표현이 겹치지 않게 ────────
# (패턴, 문장 순번 0~4) → (ko, en, chunks)
EDITS = {
  (5, 2): ("이번 주 내내 야근하고 있었어", "I've been working late every night this week.",
           "I've been|working late|every night|this week"),
  (6, 3): ("내가 택시 불러 줄게", "Let me call you a taxi.",
           "Let me|call you|a taxi"),
  (10, 4): ("이게 내가 예약한 방인지 잘 모르겠어", "I'm not sure if this room is the one I booked.",
            "I'm not sure|if this room|is the one|I booked"),
  (11, 3): ("이거 내 가방 아닌 것 같아", "I don't think that bag is mine.",
            "I don't think|that bag is|mine"),
  (20, 1): ("혹시 자리 있나 해서요", "I was wondering if there's a table.",
            "I was wondering if|there's a table"),
}
for (p_, i_), val in EDITS.items():
    own = [r for r in rows if r[3] == p_]
    own[i_][0], own[i_][1], own[i_][2] = val
    own[i_][4] = max(1, min(5, len(val[2].split("|")) - 1))

# ── 패턴별 5 + 5 ──────────────────────────────────────────────
out = []
for p in range(1, 31):
    old = [r for r in rows if r[3] == p]
    assert len(old) == 5, "패턴 %d 기존 %d문장" % (p, len(old))
    new = new_sentences.NEW.get(p) or []
    assert len(new) == 5, "패턴 %d 새 문장 %d개" % (p, len(new))
    out.extend(old)
    for ko, en, ch in new:
        lv = max(1, min(5, len(ch.split("|")) - 1))
        out.append([ko, en, ch, p, lv, 151 + len(out) - 5*p])

assert len(out) == 300, "총 %d문장" % len(out)
OUT.write_text(json.dumps({"patterns": pats, "rows": out}, ensure_ascii=False, indent=0),
               encoding="utf-8")
print("raw_v43.json:", len(out), "문장 ·", OUT.stat().st_size, "bytes")
