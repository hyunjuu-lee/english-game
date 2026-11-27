#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v42 빌드 — 피클 화이트/민트 팔레트 · ㅌ 마스코트 · 보드 화살표 · 여정 카드 · 긴 문장 클램프.
   엔진(index-v31-engine.html 의 1~11장)을 쓰고, 화면·CSS·뷰 레이어를 새로 얹는다."""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC  = ROOT / "src"
OLD  = ROOT / "index-v31-engine.html"
OUT  = ROOT / "bundle" / "index.html"

SRC.mkdir(exist_ok=True)

def cut(text, start_pat, end_pat, name):
    i = text.find(start_pat)
    j = text.find(end_pat)
    assert i >= 0, "start not found: " + name
    assert j > i, "end not found: " + name
    return text[i:j]

def sub1(text, old, new, name):
    n = text.count(old)
    assert n == 1, "%s: expected 1 occurrence, found %d" % (name, n)
    return text.replace(old, new)

raw = OLD.read_text(encoding="utf-8")

# ── 1. 엔진(데이터·상태·사운드·연출·배치·출제·게임진행·종료) ──────────────
engine = cut(raw,
             "/* ══════════ 1. 데이터 ══════════ */",
             "/* ══════════ 12. 화면 ══════════ */",
             "engine")

# ══ v43 · RAW 를 300문장(패턴당 10)으로 갈아 끼운다 ══════════════════════
import json as _json
_data = _json.loads((SRC / "raw_v43.json").read_text(encoding="utf-8"))
_rows, _pats = _data["rows"], _data["patterns"]
rows = _rows

def _js(t):
    return '"' + str(t).replace("\\", "\\\\").replace('"', '\\"') + '"'

_lines = ["var RAW = ["]
_cur = 0
for _r in _rows:
    if _r[3] != _cur:
        _cur = _r[3]
        _lines.append("  /* 패턴 %d · %s */" % (_cur, _pats[_cur]))
    _id = _r[5] if len(_r) > 5 else 0
    _lines.append("  [%s,%s,%s,%d,%d,%d]," % (_js(_r[0]), _js(_r[1]), _js(_r[2]), _r[3], _r[4], _id))
_lines = _lines
_lines[-1] = _lines[-1].rstrip(",")
RAW_JS = "\n".join(_lines) + "\n];"

i_raw = engine.index("var RAW = [")
j_raw = engine.index("\n];", i_raw) + len("\n];")
engine = engine[:i_raw] + RAW_JS + engine[j_raw:]
assert engine.count("var RAW = [") == 1

PATS_JS = "var PATTERNS = [\n" + ",\n".join("  " + _js(_p) for _p in _pats) + "\n];"
i_pat = engine.index("var PATTERNS = [")
j_pat = engine.index("];", i_pat) + 2
engine = engine[:i_pat] + PATS_JS + engine[j_pat:]

engine = sub1(engine, "    DATA.push({ id:i+1, idx:i, ko:r[0], en:r[1], chunks:r[2].split(\"|\"), p:r[3], lv:r[4] });",
              "    DATA.push({ id:(r[5] || (i+1)), idx:i, ko:r[0], en:r[1], chunks:r[2].split(\"|\"), p:r[3], lv:r[4] });",
              "data-id")

# ══ v43 · 스테이지 목표 — 패턴마다 10문장을 쓸 수 있으니 Lv.1도 10문장 ═════
engine = sub1(engine, "goal:Math.min(GOAL_MIX, 5*MIX_EVERY*mix) });",
              "goal:Math.min(GOAL_MIX, 10*MIX_EVERY*mix) });", "goal-mix")
engine = sub1(engine, "goal:Math.min(GOAL_PAT, 5*p) });",
              "goal:Math.min(GOAL_PAT, 10*p) });", "goal-pat")
engine = sub1(engine, "goal:Math.min(GOAL_FINAL, 5*total) });",
              "goal:Math.min(GOAL_FINAL, 10*total) });", "goal-final")
engine = sub1(engine, "      /* 패턴 1은 복습할 앞 패턴이 없어서 그 패턴 5문장짜리 짧은 스테이지가 된다 */",
              "      /* 패턴마다 10문장 — Lv.1도 패턴 1의 10문장을 전부 푼다 */", "goal-comment")

# ══ v43 · 새 문장의 동사·명사 혼동형 함정 보강 ══════════════════════════
engine = sub1(engine, """  "had":["have"],
  "were":["was"]
};""", """  "had":["have"],
  "were":["was"],
  /* v43 — 새 문장(패턴당 10문장)의 동사·명사 혼동형 */
  "send":["show"], "sent":["send"], "prepare":["practice"],
  "translate":["print"], "print":["send"], "redo":["do"],
  "refund":["return"], "join":["come"], "reply":["answer"],
  "grab":["hold"], "head":["go"], "pack":["take"], "save":["keep"],
  "explain":["say"], "decide":["think"], "ignore":["miss"],
  "refill":["fill"], "pull":["stop"], "split":["share"],
  "splitting":["sharing"], "throwing":["taking"], "waiting":["standing"],
  "invited":["asked"], "delayed":["late"], "canceled":["closed"],
  "asleep":["sleeping"], "noisy":["quiet"], "quiet":["noisy"],
  "expensive":["cheap"], "cheap":["expensive"], "deposit":["price"],
  "luggage":["bag"], "laundry":["luggage"], "gym":["home"],
  "pharmacy":["hospital"], "coupon":["ticket"], "receipt":["bill"],
  "bill":["receipt"], "fork":["spoon"], "tax":["tip"],
  "slides":["files"], "numbers":["money"], "address":["phone"],
  "mood":["weather"], "passport":["ticket"], "gate":["door"],
  "fare":["price"], "flight":["train"], "downtown":["home"],
  "bridge":["road"], "morning":["evening"], "tonight":["tomorrow"],
  "screen":["page"], "medicine":["vitamin"], "shuttle":["taxi"],
  "appointment":["reservation"], "budget":["price"], "photos":["pictures"],
  "bike":["car"], "umbrella":["jacket"]
};""", "conf-v43")

# FILL — 최후 채움 함정 단어도 새 문장 어휘로 늘린다
import re as _re
_FILL_ADD = ["send", "prepare", "print", "translate", "join", "pull", "refill", "pack",
  "save", "explain", "decide", "ignore", "split", "return", "refund", "deposit",
  "luggage", "laundry", "gym", "pharmacy", "coupon", "receipt", "bill", "fork", "tax",
  "slides", "numbers", "address", "mood", "passport", "gate", "fare", "flight", "downtown",
  "bridge", "morning", "tonight", "screen", "medicine", "shuttle", "appointment", "budget"]
_mf = _re.search(r'var FILL = \[(.*?)\];', engine, _re.S)
assert _mf, "FILL not found"
_fill_old = [x.strip().strip('"') for x in _mf.group(1).split(",") if x.strip()]
_fill_new = _fill_old + [w for w in _FILL_ADD if w not in _fill_old]
engine = (engine[:_mf.start()] +
          "var FILL = [" + ", ".join('"' + w + '"' for w in _fill_new) + "];" +
          engine[_mf.end():])

# ══ v45 · 스테이지별 진행도(stageProg) 저장 — 홈 보드 게이지를 스테이지 진행도로 ══
engine = sub1(engine, "var store = { best:0, bestCombo:0, cleared:{}, sound:true, maxStage:1, lastStage:1,\n  stageDone:{}, stageBest:{}, bestSurv:0 };",
              "var store = { best:0, bestCombo:0, cleared:{}, sound:true, maxStage:1, lastStage:1,\n  stageDone:{}, stageBest:{}, stageCombo:{}, stageStars:{}, stageProg:{}, bestSurv:0 };",
              "store-prog")
engine = sub1(engine, "  k.stageDone = (o.stageDone && typeof o.stageDone === \"object\") ? o.stageDone : {};",
              "  k.stageDone = (o.stageDone && typeof o.stageDone === \"object\") ? o.stageDone : {};\n  k.stageProg = (o.stageProg && typeof o.stageProg === \"object\") ? o.stageProg : {};\n  k.stageCombo = (o.stageCombo && typeof o.stageCombo === \"object\") ? o.stageCombo : {};\n  k.stageStars = (o.stageStars && typeof o.stageStars === \"object\") ? o.stageStars : {};",
              "clean-prog")
engine = sub1(engine, '  if(!isInfStage(S.stage) && S.clears >= (S.goal || 1)) store.stageDone[k] = 1;',
              """  if(!store.stageCombo) store.stageCombo = {};
  if(!store.stageStars) store.stageStars = {};
  if(S.maxCombo > (+store.stageCombo[k] || 0)) store.stageCombo[k] = S.maxCombo;
  if(!isInfStage(S.stage)){
    if(S.clears >= (S.goal || 1)){
      store.stageDone[k] = 1;
      var st = Math.max(1, Math.min(3, S.hearts || 1));
      if(st > (+store.stageStars[k] || 0)) store.stageStars[k] = st;
    }
    var pr = Math.min(1, (S.clears || 0) / (S.goal || 1));
    if(!(store.stageProg[k] >= pr)) store.stageProg[k] = pr;
  }""",
              "record-prog")

# ══ v43 · 순차 해금 — 앞 레벨을 깨야 다음 레벨이 열린다 ══════════════════
engine = sub1(engine, "function isBoss(n){ return isInfStage(n); }",
"""function isBoss(n){ return isInfStage(n); }

/* ── 순차 해금 ──
   기본은 Lv.1만 열려 있고, 해금된 최대 단계를 깨면 그 다음 단계가 열린다.
   이미 클리어 기록(stageDone)이 있으면 '가장 높이 깬 단계 + 1'까지 자동으로 열린다. */
function unlockedMax(){
  var n = 1, k, v;
  for(k in store.stageDone){
    if(!store.stageDone.hasOwnProperty(k) || !store.stageDone[k]) continue;
    v = +k;
    if(v + 1 > n) n = v + 1;
  }
  return Math.min(STAGES_TOTAL, Math.max(1, n));
}
function stageLocked(n){ return (n || 1) > unlockedMax(); }
function needStageOf(n){ return Math.max(1, (n || 1) - 1); }""", "unlock")

engine = sub1(engine, """function startStage(stage){
  var n = Math.max(1, Math.min(STAGES_TOTAL, stage || 1));
  var m = stageMeta(n);""", """function startStage(stage){
  var n = Math.max(1, Math.min(STAGES_TOTAL, stage || 1));
  if(stageLocked(n)){
    try{ if(window.__ui) window.__ui.blocked(n); }catch(e){}
    return false;
  }
  var m = stageMeta(n);""", "start-lock")

engine = sub1(engine, 'return "150문장 끝없이 · 살아남기";',
              'return "400문장 · 끝없이";', "stage-hint-inf")
engine = sub1(engine, "/* 무한전 = 150문장 전체 */", "/* 무한전 = 300문장 전체 */", "inf-comment")
engine = sub1(engine, 'toast("무한전 · 150문장 랜덤", true);',
              'toast("무한 모드 · 400문장 랜덤", true);', "inf-toast")

# ══ v47 · 빈 조립 바 안내 문구 ══
engine = sub1(engine, "  if(!S.slots.length) h = '<span class=\"hint\">· · ·</span>';",
              "  if(!S.slots.length) h = '<span class=\"hint\">단어를 순서대로 눌러요</span>';", "hint-text")

# ── 2. 엔진 패치 ─────────────────────────────────────────────────────────
engine = sub1(engine, """function paintCombo(){
  var c = S.combo, cls = "combo";
  if(c >= 10) cls += " fever";
  else if(c >= 6) cls += " m3";
  else if(c >= 3) cls += " m2";
  elCombo.className = cls;
  if(c >= 10) elCombo.innerHTML = ICON.flame + "<b>FEVER ×" + S.mult + "</b>";
  else if(c > 0) elCombo.innerHTML = "<b>×" + S.mult + "</b><i>" + c + " COMBO</i>";
  else elCombo.innerHTML = "<b>×1</b>";
}""", """function paintCombo(){
  var c = S.combo, cls = "combo";
  if(c >= 10) cls += " fever";
  else if(c >= 6) cls += " m3";
  else if(c >= 3) cls += " m2";
  elCombo.className = cls;
  if(c >= 10) elCombo.innerHTML = ICON.flame + "<b>FEVER ×" + S.mult + "</b>";
  else if(c > 0) elCombo.innerHTML = "<b>×" + S.mult + "</b><i>" + c + " COMBO</i>";
  else elCombo.innerHTML = "<b>×1</b>";
  if(c > 0 && elCombo.animate){
    try{ elCombo.animate([{transform:"scale(1.26)"},{transform:"scale(.94)"},{transform:"scale(1)"}],
      {duration:260, easing:"cubic-bezier(.34,1.56,.64,1)"}); }catch(e){}
  }
}""", "paintCombo")

# 폭발 파티클 — 별·색종이·스파크
engine = re.sub(
    r"function burst\(cx, cy\)\{.*?\n\}\n",
    """function burst(cx, cy){
  var pal = ["#ffd93d","#ff7aa2","#5ad2ff","#7cf7c2","#c39bff","#ffffff","#ffa64d"];
  var n = 8 + Math.min(8, (S.combo || 0)), i;
  for(i=0;i<n;i++){
    var d = document.createElement("div");
    var kind = i % 4, sz = 7 + Math.random()*9;
    d.className = "dot k" + kind;
    d.style.width = sz + "px";
    d.style.height = (kind === 1 ? sz*0.55 : sz) + "px";
    d.style.left = (cx - sz/2) + "px";
    d.style.top = (cy - sz/2) + "px";
    d.style.background = pal[(i*3 + (S.combo||0)) % pal.length];
    if(kind === 0) d.style.borderRadius = "50%";
    if(kind === 1) d.style.borderRadius = "2px";
    if(kind === 2) d.style.clipPath = "polygon(50% 0,63% 36%,100% 38%,70% 60%,82% 100%,50% 76%,18% 100%,30% 60%,0 38%,37% 36%)";
    if(kind === 3) d.style.clipPath = "polygon(50% 0,100% 100%,0 100%)";
    elFx.appendChild(d);
    var ang = Math.random()*Math.PI*2, dist = 46 + Math.random()*120;
    var dx = Math.cos(ang)*dist, dy = Math.sin(ang)*dist - 22;
    var rt = (Math.random()*720 - 360).toFixed(0) + "deg";
    if(d.animate){
      d.animate(
        [{transform:"translate(0,0) rotate(0deg) scale(.5)", opacity:1, offset:0},
         {transform:"translate(" + (dx*.55).toFixed(0) + "px," + (dy*.62).toFixed(0) + "px) rotate(" + rt + ") scale(1.15)", opacity:1, offset:.38},
         {transform:"translate(" + dx.toFixed(0) + "px," + (dy + 46).toFixed(0) + "px) rotate(" + rt + ") scale(.3)", opacity:0}],
        {duration: 620 + Math.random()*320, easing:"cubic-bezier(.16,.72,.32,1)"}
      );
    }
    (function(node){ setTimeout(function(){ if(node.parentNode) node.parentNode.removeChild(node); }, 1000); })(d);
  }
  var ring = document.createElement("div");
  ring.className = "ring";
  var R = 30;
  ring.style.width = (R*2) + "px"; ring.style.height = (R*2) + "px";
  ring.style.left = (cx - R) + "px"; ring.style.top = (cy - R) + "px";
  elFx.appendChild(ring);
  if(ring.animate){
    ring.animate([{transform:"scale(.35)", opacity:.95},{transform:"scale(2.5)", opacity:0}],
      {duration:520, easing:"cubic-bezier(.16,.7,.3,1)"});
  }
  setTimeout(function(){ if(ring.parentNode) ring.parentNode.removeChild(ring); }, 700);
  var pop = document.createElement("div");
  pop.className = "hitstar";
  pop.style.left = cx + "px"; pop.style.top = cy + "px";
  elFx.appendChild(pop);
  if(pop.animate){
    pop.animate([{transform:"translate(-50%,-50%) scale(.2) rotate(-25deg)", opacity:1},
                 {transform:"translate(-50%,-50%) scale(1.5) rotate(8deg)", opacity:.85, offset:.4},
                 {transform:"translate(-50%,-50%) scale(.6) rotate(0deg)", opacity:0}],
      {duration:420, easing:"cubic-bezier(.2,.9,.3,1)"});
  }
  setTimeout(function(){ if(pop.parentNode) pop.parentNode.removeChild(pop); }, 460);
}
""", engine, count=1, flags=re.S)

# 줄에 3색 포인트 + 살짝 떠 있는 몸통
engine = sub1(engine, """  el.appendChild(glow);
  el.appendChild(ko);
  el.appendChild(lock);""", """  var bob = document.createElement("span");
  bob.className = "bob";
  bob.appendChild(ko);
  bob.appendChild(lock);
  el.appendChild(glow);
  el.appendChild(bob);""", "row-children")

# 명중 연출 — 화면 흔들림
engine = sub1(engine, "      try{ burst(cx, cy); }catch(e){}",
              "      try{ burst(cx, cy); if(S.mult >= 2) shakeScreen(S.mult >= 3 ? 2 : 1); }catch(e){}",
              "hit-shake")

# 보스 처치 · 콤보 회복 골드/하트 펄스
engine = sub1(engine, """    if(bossHealed){
      try{ sfxCombo(); }catch(e){}
      toast("보스 처치 · 하트 +1 회복!", true);
    } else if(S.combo % 5 === 0){
      try{ sfxCombo(); }catch(e){}""", """    if(bossHealed){
      try{ sfxCombo(); }catch(e){}
      try{ goldPulse(); heartPulse(); }catch(e){}
      toast("보스 처치! 하트 +1", true);
    } else if(S.combo % 5 === 0){
      try{ sfxCombo(); }catch(e){}
      try{ if(healed) heartPulse(); else goldPulse(); }catch(e){}""", "hit-pulse")

# 바닥 충돌 흔들림
engine = sub1(engine, """  sfxBad();
  var cx = S.laneW/2, cy = row.y + S.R/2;""", """  sfxBad();
  try{ shakeScreen(2); }catch(e){}
  var cx = S.laneW/2, cy = row.y + S.R/2;""", "crash-shake")

# 스테이지 시작 → 게임 뷰로
engine = sub1(engine, """  hideSheets();
  clearRows();""", """  hideSheets();
  if(window.__ui) window.__ui.enterGame();
  clearRows();""", "start-enter")

# 결과 시트를 띄운 뒤 뷰 상태 정리
engine = sub1(engine, "  show(elSheetClear);",
              "  show(elSheetClear);\n  if(window.__ui) window.__ui.afterRun();", "clear-after")
engine = sub1(engine, "  show(elSheetOver);",
              "  show(elSheetOver);\n  if(window.__ui) window.__ui.afterRun();", "over-after")

# ── 중복 문장 스폰 방지 (같은 문장이 화면·대기열에 동시에 두 번 나오지 않게) ──
engine = sub1(engine, """function nextSentence(){
  if(!S.q || !S.q.length) refillQueue();
  var idx = S.q.shift();
  S.lastId = DATA[idx].id;
  return idx;
}""", """/* 지금 화면에 떠 있는 문장인가 */
function onScreenId(id){
  for(var i=0;i<S.rows.length;i++){
    var r = S.rows[i];
    if(r && !r.dead && r.d && r.d.id === id) return true;
  }
  return false;
}
function queueHas(idx){
  for(var i=0;i<S.q.length;i++) if(S.q[i] === idx) return true;
  return false;
}
function nextSentence(){
  var idx, guard = 0;
  if(!S.q || !S.q.length) refillQueue();
  idx = S.q.shift();
  /* 화면에 이미 같은 문장이 떠 있으면 뒤로 미루고 다음 문장을 꺼낸다 */
  while(guard++ < 600 && idx !== undefined && DATA[idx] && onScreenId(DATA[idx].id)){
    S.q.push(idx);
    if(!S.q.length){ refillQueue(); if(!S.q.length) break; }
    idx = S.q.shift();
  }
  if(idx === undefined){ refillQueue(); idx = S.q.shift(); }
  if(idx === undefined) idx = 0;
  S.lastId = DATA[idx].id;
  return idx;
}""", "nextSentence")

engine = sub1(engine, """function requeue(d){
  if(!d) return;
  if(S.clearedIds[String(d.id)]) return;        /* 이미 푼 문장은 다시 넣지 않는다 */
  var at = Math.min(REQUEUE_AT, S.q.length);
  S.q.splice(at, 0, d.idx);
}""", """function requeue(d){
  if(!d) return;
  if(S.clearedIds[String(d.id)]) return;        /* 이미 푼 문장은 다시 넣지 않는다 */
  if(onScreenId(d.id)) return;                 /* 화면에 같은 문장이 떠 있으면 중복 삽입 금지 */
  if(queueHas(d.idx)) return;                  /* 대기열에 이미 있으면 다시 넣지 않는다 */
  var at = Math.min(REQUEUE_AT, S.q.length);
  S.q.splice(at, 0, d.idx);
}""", "requeue")

# 바닥 충돌 — 줄을 먼저 지운 뒤 다시 큐에 넣는다(안 그러면 '화면에 있음'으로 판정됨)
engine = sub1(engine, """  requeue(row.d);
  boomRow(row);
  removeRow(row);""", """  boomRow(row);
  removeRow(row);
  requeue(row.d);""", "crash-requeue-order")

engine = sub1(engine, """function paintSound(){
  var b = $("btnSound");
  if(b){ b.innerHTML = store.sound ? ICON.sound : ICON.mute; b.className = "icon" + (store.sound ? "" : " off"); }
}""", """function paintSound(){
  var b = $("btnSound");
  if(b){ b.innerHTML = store.sound ? ICON.sound : ICON.mute; b.className = "icon3" + (store.sound ? "" : " off"); }
}""", "paintSound")

# ── 오답 피드백 — 어는 조각이 틀렸는지 보여준다 ──
engine = sub1(engine, """function wrongRow(row){
  S.lock = true;
  elSlots.className = "slots bad shake";
  sfxBad(); shakeEl(row.el);
  S.combo = 0; S.mult = 1; S.accel = 1;
  paintCombo(); paintSpeed();
  toast("오답 · 다시 조립!");
  setTimeout(function(){
    if(S.mode !== "play") return;
    S.slots = [];
    elSlots.className = "slots";
    renderSlots();
    renderPoolUsed();      /* 방금 쓴 단어 블록을 다시 고를 수 있게 used 해제 */
    S.lock = false;
  }, 460);
}""", """/* ── 어는 조각이 틀렸는지 알려주는 오답 피드백 ──
   담은 칩을 정답 문장과 앞에서부터 단어 단위로 대조해, 맞은 앞부분(.ok)은 남기고
   처음 어긋난 칩(.bad)부터 버린다. 그래서 틀린 조각만 골라 고쳐 쏘면 된다. */
function slotWordList(t){
  var w = norm(t).split(" "), out = [], i;
  for(i=0;i<w.length;i++) if(w[i]) out.push(w[i]);
  return out;
}
function matchPrefix(slots, en){
  var target = slotWordList(en), pos = 0, i, j, w;
  for(i=0;i<slots.length;i++){
    w = slotWordList(slots[i].t);
    if(!w.length) return i;
    for(j=0;j<w.length;j++){
      if(target[pos] !== w[j]) return i;
      pos++;
    }
  }
  return slots.length;
}
function wrongRow(row){
  S.lock = true;
  sfxBad(); shakeEl(row.el);
  S.combo = 0; S.mult = 1; S.accel = 1;
  paintCombo(); paintSpeed();
  var keep = matchPrefix(S.slots, row.d ? row.d.en : "");
  var kids = elSlots.children || [], i, el;
  elSlots.className = "slots check";
  for(i=0;i<kids.length;i++){
    el = kids[i];
    if(!el.classList) continue;
    if(i < keep) el.classList.add("ok");
    else if(i === keep) el.classList.add("bad");
    else el.classList.add("na");
  }
  if(keep >= S.slots.length){
    elBuilt.innerHTML = '<span class="hintIn ok">여기까지 맞아요</span> · 빠진 단어가 있어요';
    toast("빠진 단어가 있어요");
  } else if(keep === 0){
    elBuilt.innerHTML = '<span class="hintIn bad">첫 단어</span>부터 다시 골라요';
    toast("첫 단어부터 달라요");
  } else {
    elBuilt.innerHTML = '<span class="hintIn ok">' + keep + '개 맞음</span> · <span class="hintIn bad">' +
      esc(S.slots[keep].t) + '</span>부터 달라요';
    toast("빨간 단어부터 고쳐요");
  }
  setTimeout(function(){
    if(S.mode !== "play") return;
    if(keep < S.slots.length) S.slots = S.slots.slice(0, keep);   /* 맞은 앞부분만 남긴다 */
    elSlots.className = "slots";
    renderSlots();
    /* 남긴 조각은 초록으로 유지 — 다음 탭까지 어디까지 맞았는지 보인다 */
    var kids2 = elSlots.children || [], k2;
    for(k2=0;k2<kids2.length;k2++) if(kids2[k2].classList && k2 < keep) kids2[k2].classList.add("ok");
    if(keep > 0) elBuilt.innerHTML = '<span class="hintIn ok">' + keep + '개 맞음</span> · 이어서 골라요';
    renderPoolUsed();      /* 방금 쓴 단어 블록을 다시 고를 수 있게 used 해제 */
    S.lock = false;
  }, 900);
}""", "wrongRow")

# ══ v42 패치 ═══════════════════════════════════════════════════════════════
# 1) 타겟 캡슐의 양옆 괄호(락온 브래킷) 완전 제거 — 2.5px 단색 테두리만 남긴다
engine = sub1(engine, """  var lock = document.createElement("span");
  lock.className = "lock";
  for(var q=0;q<4;q++) lock.appendChild(document.createElement("i"));
""", "", "no-lock-dom")
engine = sub1(engine, """  bob.appendChild(ko);
  bob.appendChild(lock);""", """  bob.appendChild(ko);""", "no-lock-bob")

# 2) 긴 문장이 캡슐 밖으로 삐져나오지 않게 — 글자 축소 → 두 줄
engine = sub1(engine, """function applyRowSize(r){
  if(!r || !r.el) return;
  r.el.style.height = S.R + "px";
  r.el.style.fontSize = S.fontSize + "px";
  r.el.style.borderRadius = Math.max(9, Math.round(S.R*0.3)) + "px";
}""", """function applyRowSize(r){
  if(!r || !r.el) return;
  r.el.style.height = S.R + "px";
  r.el.style.fontSize = S.fontSize + "px";
  r.el.style.borderRadius = Math.max(9, Math.round(S.R*0.3)) + "px";
  fitRowText(r);
}
/* 글자 폭 어림값 — 한글은 글자 크기만큼, 영문은 0.56배 */
function koEstWidth(txt, fs){
  var w = 0, i, c;
  txt = String(txt || "");
  for(i=0;i<txt.length;i++){
    c = txt.charCodeAt(i);
    if(c === 32) w += fs*0.30;
    else if((c >= 0xAC00 && c <= 0xD7A3) || (c >= 0x3130 && c <= 0x318F) || (c >= 0x1100 && c <= 0x11FF)) w += fs*0.98;
    else w += fs*0.56;
  }
  return w * 0.985;
}
/* 폰트를 단계적으로 줄이고, 그래도 넘치면 두 줄로 감싼다 */
function fitRowText(r){
  if(!r || !r.el || !r.koEl) return;
  var avail = Math.max(96, (S.laneW || 340) - 60);
  var txt = r.koEl.textContent || "";
  var fs = S.fontSize || 14, min = 10;
  if(r.el.classList && r.el.classList.remove) r.el.classList.remove("twoline");
  while(fs > min && koEstWidth(txt, fs) > avail) fs -= 0.5;
  r.el.style.fontSize = fs + "px";
  if(koEstWidth(txt, fs) > avail && r.el.classList && r.el.classList.add) r.el.classList.add("twoline");
}""", "row-fit")

# 3) X좌표를 실제 줄 폭 기준으로 화면 안에 가둔다
engine = sub1(engine, """function paintRows(){
  var t = targetRow(), i, r, cls;
  for(i=0;i<S.rows.length;i++){
    r = S.rows[i];
    r.el.style.transform = "translate3d(" + (r.x || 0) + "px," + Math.round(r.y) + "px,0)";""",
"""function paintRows(){
  var t = targetRow(), i, r, cls, w, maxX;
  for(i=0;i<S.rows.length;i++){
    r = S.rows[i];
    w = (r.el && r.el.offsetWidth) ? r.el.offsetWidth : 0;
    if(w && S.laneW){
      maxX = Math.max(0, S.laneW - w - 6);
      if((r.x || 0) > maxX) r.x = maxX;
      if((r.x || 0) < 0) r.x = 0;
    }
    r.el.style.transform = "translate3d(" + (r.x || 0) + "px," + Math.round(r.y) + "px,0)";""", "paintRows-clamp")

engine = sub1(engine, "  var row = { uid:uid, d:d, el:el, y:-S.R, x:0, spd:spd, isBoss:(uid % 5 === 0), pool:null };",
              "  var row = { uid:uid, d:d, el:el, koEl:ko, y:-S.R, x:0, spd:spd, isBoss:(uid % 5 === 0), pool:null };", "row-koel")
engine = sub1(engine, "  var maxX = Math.max(0, (S.laneW || elLane.clientWidth || 340) - rw);",
              "  var maxX = Math.max(0, (S.laneW || elLane.clientWidth || 340) - rw - 6);", "spawn-clamp")

# 4) iOS Safari 소리 — 첫 제스처에서 무조건 resume + 1샘플 무음 재생으로 언락
engine = sub1(engine, """function unlockAudio(){
  var a = ctx(); if(!a) return;
  try{ if(a.state === "suspended") a.resume(); }catch(e){}
  try{
    var b = a.createBuffer(1, 1, a.sampleRate || 44100);
    var s = a.createBufferSource();
    s.buffer = b; s.connect(a.destination); s.start(0);
  }catch(e){}
}""", """function unlockAudio(){
  var a = ctx(); if(!a) return null;
  try{ if(a.state !== "running" && a.resume) a.resume(); }catch(e){}
  /* iOS Safari: 제스처 안에서 1샘플 무음 버퍼를 한 번 재생해야 오디오 세션이 열린다 */
  try{
    var b = a.createBuffer(1, 1, a.sampleRate || 44100);
    var s = a.createBufferSource();
    s.buffer = b; s.connect(a.destination);
    if(s.start) s.start(0);
  }catch(e){}
  return a;
}
/* 터치·복귀마다 오디오가 잠겼으면 다시 깨운다 — 쉬었다 와도 iOS 소리가 살아난다 */
(function(){
  if(typeof document === "undefined" || !document.addEventListener) return;
  var wasHidden = false;
  function resetAudio(){
    try{ bgmStop(); }catch(e){}
    if(AC){
      try{ if(AC.close) AC.close(); }catch(e){}
      AC = null;
    }
    BGM.master = null;
  }
  function wake(){
    /* iOS: 원어민 음성이 나오는 동안 오디오를 깨우려 하면 오디오 세션을 다시 잡느라
       탭 처리가 밀린다 — 말하는 중이면 건드리지 않고, 끝나면 sayDone 이 되살린다 */
    if(isSpeaking()) return;
    /* 이미 소리가 나고 있으면 할 일이 없다(탭마다 무음 버퍼를 만들지 않는다) */
    if(!wasHidden && AC && AC.state === "running"){
      if(store.sound && S.mode === "play" && !BGM.on){ try{ bgmStart(); }catch(e){} }
      return;
    }
    /* 'interrupted'(iOS 음성·전화가 오디오를 잠깐 가져간 상태)는 다시 만들지 않고 resume 만 —
       매번 새로 만들면 BGM 이 처음부터 다시 쌓이며 끊긴다 */
    if(wasHidden || (AC && AC.state === "closed")){
      wasHidden = false;
      resetAudio();
    }
    var a = unlockAudio();
    if(a && a.resume && a.state !== "running"){
      try{
        var p = a.resume();
        if(p && p.then) p.then(function(){
          if(store.sound && S.mode === "play" && !BGM.on){ try{ bgmStart(); }catch(e){} }
          if(BGM.on && BGM.master && AC){
            try{ BGM.master.gain.value = BGM.duck; BGM.next = AC.currentTime + 0.05; }catch(e){}
          }
        });
      }catch(e){}
    }
    if(store.sound && S.mode === "play" && !BGM.on){ try{ bgmStart(); }catch(e){} }
  }
  var evs = ["pointerdown","touchstart","click","keydown"], i;
  for(i=0;i<evs.length;i++) document.addEventListener(evs[i], wake, true);
  document.addEventListener("visibilitychange", function(){
    if(document.hidden){
      wasHidden = true;
      try{ bgmStop(); }catch(e){}
    }
  });
  if(typeof window !== "undefined" && window.addEventListener){
    window.addEventListener("pagehide", function(){ wasHidden = true; try{ bgmStop(); }catch(e){} });
  }
})();""", "audio-unlock")

# 5) 효과음·BGM 게인을 들리는 볼륨으로
engine = sub1(engine, "    g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.012);",
              "    g.gain.exponentialRampToValueAtTime(vol || 0.09, t0 + 0.012);", "beep-vol")
engine = sub1(engine, "function sfxTap(n){ beep(520 + Math.min(4, n)*70, 0.06, \"sine\", 0.05); }",
              "function sfxTap(n){ beep(520 + Math.min(4, n)*70, 0.06, \"sine\", 0.08); }", "sfx-tap")
engine = sub1(engine, """  beep(720, 0.08, "triangle", 0.07, 1180);
  setTimeout(function(){ beep(1180, 0.10, "triangle", 0.05, 1560); }, 55);
  noise(0.16, 0.035);""", """  beep(720, 0.08, "triangle", 0.11, 1180);
  setTimeout(function(){ beep(1180, 0.10, "triangle", 0.08, 1560); }, 55);
  noise(0.16, 0.05);""", "sfx-pop")
engine = sub1(engine, "function sfxBad(){ beep(240, 0.16, \"square\", 0.045, 130); }",
              "function sfxBad(){ beep(240, 0.16, \"square\", 0.07, 130); }", "sfx-bad")
engine = sub1(engine, "  beep(1500, 0.10, \"sawtooth\", 0.032, 420);",
              "  beep(1500, 0.10, \"sawtooth\", 0.05, 420);", "sfx-laser")
engine = sub1(engine, """  beep(660, 0.09, "sine", 0.06, 860);
  setTimeout(function(){ beep(990, 0.10, "sine", 0.055, 1200); }, 70);
  setTimeout(function(){ beep(1320, 0.12, "sine", 0.05, 1500); }, 150);""", """  beep(660, 0.09, "sine", 0.09, 860);
  setTimeout(function(){ beep(990, 0.10, "sine", 0.08, 1200); }, 70);
  setTimeout(function(){ beep(1320, 0.12, "sine", 0.07, 1500); }, 150);""", "sfx-combo")
engine = sub1(engine, "function sfxOver(){ beep(420, 0.5, \"sine\", 0.06, 110); }",
              "function sfxOver(){ beep(420, 0.5, \"sine\", 0.09, 110); }", "sfx-over")
engine = sub1(engine, "var BGM = { on:false, master:null, timer:0, next:0, step:0, bpm:116, duck:0.9 };",
              "var BGM = { on:false, master:null, timer:0, next:0, step:0, bpm:116, duck:0.95 };", "bgm-duck")
engine = sub1(engine, "    g.gain.exponentialRampToValueAtTime(0.085, t + 0.01);",
              "    g.gain.exponentialRampToValueAtTime(0.13, t + 0.01);", "bgm-kick")
engine = sub1(engine, "    g.gain.setValueAtTime(0.012, t);",
              "    g.gain.setValueAtTime(0.022, t);", "bgm-hat")
engine = sub1(engine, "  if(s === 0 || s === 4) bgmVoice(ch.bass, t, 0.26, \"triangle\", 0.075, 0);",
              "  if(s === 0 || s === 4) bgmVoice(ch.bass, t, 0.26, \"triangle\", 0.11, 0);", "bgm-bass")
engine = sub1(engine, "  bgmVoice(freq, t, 0.14, \"square\", 0.026, 2600);",
              "  bgmVoice(freq, t, 0.14, \"square\", 0.05, 2600);", "bgm-arp")
engine = sub1(engine, "  if(lead) bgmVoice(lead, t, 0.17, \"triangle\", 0.030, 5200);",
              "  if(lead) bgmVoice(lead, t, 0.17, \"triangle\", 0.055, 5200);", "bgm-lead")

# ══ v46 · 시즌 1 「여행자 자격」 — 클리어 시트 문구를 여정 컨셉으로 ═══════
engine = sub1(engine, """  $("clearTitle").textContent = btnLabel(S.stage) + " 클리어";
  if(S.stage >= LAST_LEVEL){
    $("clearLead").textContent = "36개 스테이지를 다 깼어요. 이제 무한 서바이벌뿐!";
  } else {
    $("clearLead").textContent = "다음은 " + stageLine(S.stage + 1);
  }""",
"""  if(S.stage >= LAST_LEVEL){
    $("clearTitle").textContent = "모든 레벨 완료!";
    $("clearLead").textContent = "이제 무한 모드가 열렸어요";
  } else {
    $("clearTitle").textContent = btnLabel(S.stage) + " 클리어!";
    $("clearLead").textContent = "다음 레벨이 열렸어요";
  }""", "clear-copy")

engine = sub1(engine, """$("clNew").innerHTML = wasNew ? '<div class="new">NEW STAGE</div>' : "";""",
              """$("clNew").innerHTML = wasNew ? '<div class="new">첫 완료</div>' : "";""", "new-island")

# ══ v46 · 발사 직후 단어판이 비지 않게 — 마지막 줄을 쏘면 다음 줄을 즉시 채운다 ══
engine = sub1(engine, """      removeRow(row);
      setTargetRow(S.rows[0] || null);
      if(!done) S.lock = false;""",
"""      removeRow(row);
      /* 화면에 줄이 0개가 되면 타겟이 없어져 단어판이 통째로 빈다 —
         다음 스폰 타이머를 기다리지 않고 바로 한 줄 채운다. */
      if(!done && S.mode === "play" && !S.rows.length){ try{ spawnRow(); }catch(e){} }
      setTargetRow(S.rows[0] || null);
      if(!done) S.lock = false;""", "hit-respawn")

# ══ v46 · 발사 판정 중 바닥 충돌 방지 — 줄을 바닥 직전에서 잠시 홀드 (ui.js update) ══
# (update 는 src/ui.js 에 있다)

# ══ v63 · 레벨별 3단계(티어) — 같은 패턴을 난이도만 올려 세 번, 뒤 레벨을 깨면 해금 ══
engine = sub1(engine, 'function needStageOf(n){ return Math.max(1, (n || 1) - 1); }',
'''function needStageOf(n){ return Math.max(1, (n || 1) - 1); }

/* ── 레벨별 3단계(티어) ──
   패턴 스테이지는 같은 패턴을 난이도만 올려 세 번 도전한다.
     Lv.N-1  그 패턴 집중 · 10문장
     Lv.N-2  Lv.N+4까지 깬 패턴을 섞어 12문장 (Lv.N-1 + Lv.N+4 클리어 시 해금)
     Lv.N-3  Lv.N+9까지 깬 패턴을 섞어 15문장 (Lv.N-2 + Lv.N+9 클리어 시 해금) */
var TIER_GOAL = [0, 10, 12, 15];
function needStage2(n){ return Math.min(LAST_LEVEL, (n || 1) + 4); }
function needStage3(n){ return Math.min(LAST_LEVEL, (n || 1) + 9); }
function tierNeed(n, t){ return (t <= 2) ? needStage2(n) : needStage3(n); }
function tierKey(n, t){ return (t > 1) ? (n + "-" + t) : String(n); }
function tierDone(n, t){ return !!store.stageDone[tierKey(n, t)]; }
function tierLocked(n, t){
  t = Math.max(1, Math.min(3, t || 1));
  if(stageLocked(n)) return true;
  if(t === 1) return false;
  if(tierDone(n, t)) return false;          /* 이미 깬 단계는 언제든 다시 할 수 있다 */
  if(!tierDone(n, t - 1)) return true;
  return !store.stageDone[String(tierNeed(n, t))];
}
var TIER_NAMES = ["", "Easy", "Normal", "Hard"];
/* 레벨 표기 — 패턴이면 Lv.N Easy, MIX/FINAL이면 Lv.N */
function lvStageLabel(n){
  var m = stageMeta(n);
  return (m && m.kind === "pat") ? ("Lv." + n + " Easy") : ("Lv." + n);
}
/* 잠긴 이유 — 시작 버튼에 들어갈 짧은 말 */
function tierNeedShort(n, t){
  t = Math.max(1, Math.min(3, t || 1));
  if(stageLocked(n)) return lvStageLabel(needStageOf(n)) + " 완료 후 열려요";
  if(!tierDone(n, t - 1)) return TIER_NAMES[t - 1] + " 완료 후 열려요";
  return lvStageLabel(tierNeed(n, t)) + " 완료 후 열려요";
}
/* 잠긴 이유 — 보드 아래 한 줄 */
function tierNeedDesc(n, t){
  t = Math.max(1, Math.min(3, t || 1));
  if(stageLocked(n)) return lvStageLabel(needStageOf(n)) + " 완료 후 열려요";
  if(!tierDone(n, t - 1)) return TIER_NAMES[t - 1] + " · " + lvStageLabel(tierNeed(n, t)) + " 완료 후 열려요";
  return lvStageLabel(tierNeed(n, t)) + " 완료 후 열려요";
}
/* 깬 단계 수 = 별 개수 */
function tierCount(n){ var c = 0, i; for(i=1;i<=3;i++) if(tierDone(n, i)) c++; return c; }
var MAX_STARS = 120;              /* 패턴 40개 x 3단계 — 한 단계 깰 때마다 별 1개 */
function totalStars(){
  var i, s = 0;
  for(i=0;i<STAGES.length;i++){
    if(STAGES[i].kind !== "pat") continue;
    s += tierCount(STAGES[i].n);
  }
  return s;
}
function tierGoal(n, t){
  var m = stageMeta(n);
  if(m.kind !== "pat") return m.goal;
  return TIER_GOAL[Math.max(1, Math.min(3, t || 1))];
}
/* 이 패턴에서 지금 열려 있는 가장 높은 단계 */
function tierOpen(n){ var t = 0, i; for(i=1;i<=3;i++) if(!tierLocked(n, i)) t = i; return t || 1; }
/* 홈 카드가 처음 골라 줄 단계 — 아직 안 깬, 가장 높은 열린 단계 */
function defaultTier(n){
  var t;
  if(stageMeta(n).kind !== "pat") return 1;
  for(t=1;t<=3;t++) if(!tierDone(n, t) && !tierLocked(n, t)) return t;
  for(t=3;t>=1;t--) if(!tierLocked(n, t)) return t;
  return 1;
}
/* 2·3단계가 섞어 내는 마지막 패턴 */
function tierMixTo(n, t){ return stageMeta(tierNeed(n, t)).to; }
function tierHint(n, t){
  var m = stageMeta(n);
  if(m.kind !== "pat") return stageHint(n);
  t = Math.max(1, Math.min(3, t || 1));
  if(t === 1) return TIER_GOAL[1] + "문장";
  return "복습 포함 · " + TIER_GOAL[t] + "문장";
}
/* 클리어한 뒤 이어서 할 단계 — 같은 레벨의 다음 단계가 열렸으면 그것부터 */
function nextStageTier(n, t){
  var t2;
  if(stageMeta(n).kind === "pat")
    for(t2 = (t || 1) + 1; t2 <= 3; t2++) if(!tierLocked(n, t2)) return { n:n, t:t2 };
  var n2 = Math.min(STAGES_TOTAL, (n || 1) + 1);
  return { n:n2, t:defaultTier(n2) };
}''', "tier-core")

# 티어 키("1-2")는 스테이지 번호가 아니다 — 해금 계산에서 건너뛴다
engine = sub1(engine, """    v = +k;
    if(v + 1 > n) n = v + 1;""",
"""    v = +k;
    if(isNaN(v)) continue;
    if(v + 1 > n) n = v + 1;""", "unlock-nan")

# 함정 후보 패턴 — 2·3단계는 섞어 내는 범위까지
engine = sub1(engine, """function patternsOf(stage){
  var set = {}, m = stageMeta(stage || 1), i;
  if(m.kind === "inf"){ for(i=1;i<PATTERNS.length;i++) set[i] = 1; return set; }
  for(i=1;i<=m.to;i++) set[i] = 1;
  return set;
}""",
"""function patternsOf(stage){
  var set = {}, m = stageMeta(stage || 1), i, to = m.to;
  if(m.kind === "inf"){ for(i=1;i<PATTERNS.length;i++) set[i] = 1; return set; }
  if(m.kind === "pat" && (S.tier || 1) > 1) to = Math.max(to, tierMixTo(m.n, S.tier));
  for(i=1;i<=to;i++) set[i] = 1;
  return set;
}""", "patterns-tier")

# 저장 — 마지막으로 고른 단계도 기억한다
engine = sub1(engine, "var store = { best:0, bestCombo:0, cleared:{}, sound:true, maxStage:1, lastStage:1,\n  stageDone:{}, stageBest:{}, stageCombo:{}, stageStars:{}, stageProg:{}, bestSurv:0 };",
              "var store = { best:0, bestCombo:0, cleared:{}, sound:true, maxStage:1, lastStage:1, lastTier:1,\n  stageDone:{}, stageBest:{}, stageCombo:{}, stageStars:{}, stageProg:{}, bestSurv:0 };",
              "store-tier")
engine = sub1(engine, "  k.lastStage = Math.min(STAGES_TOTAL, Math.max(1, +o.lastStage || 1));",
              "  k.lastStage = Math.min(STAGES_TOTAL, Math.max(1, +o.lastStage || 1));\n  k.lastTier = Math.max(1, Math.min(3, +o.lastTier || 1));",
              "clean-tier")

# 상태 — 지금 도는 단계
engine = sub1(engine, "  stage:1, goal:GOAL, clears:0, clearedIds:{},",
              "  stage:1, tier:1, goal:GOAL, clears:0, clearedIds:{},", "state-tier")

# HUD·버튼 라벨 — 패턴 스테이지는 Lv.N Easy / Normal / Hard
engine = sub1(engine, """function stageTagText(n){
  var m = stageMeta(n);
  if(m.kind === "pat")   return "Lv." + m.n;""",
"""function stageTagText(n, t){
  var m = stageMeta(n);
  if(m.kind === "pat")   return "Lv." + m.n + " " + (TIER_NAMES[t || 1] || "Easy");""", "tag-tier")
engine = sub1(engine, """function btnLabel(n){
  var m = stageMeta(n);
  if(m.kind === "pat")   return "Lv." + m.n;""",
"""function btnLabel(n, t){
  var m = stageMeta(n);
  if(m.kind === "pat")   return "Lv." + m.n + " " + (TIER_NAMES[t || 1] || "Easy");""", "btn-tier")
engine = sub1(engine, "  elStageTag.textContent = stageTagText(S.stage);",
              "  elStageTag.textContent = stageTagText(S.stage, S.tier);", "paint-stage-tier")

# 스테이지 시작 — 단계까지 받는다
engine = sub1(engine, """function startStage(stage){
  var n = Math.max(1, Math.min(STAGES_TOTAL, stage || 1));
  if(stageLocked(n)){
    try{ if(window.__ui) window.__ui.blocked(n); }catch(e){}
    return false;
  }
  var m = stageMeta(n);
  S.mode = "play"; S.lock = false;
  S.stage = n; store.lastStage = n;
  S.goal = m.goal; S.clears = 0; S.clearedIds = {};""",
"""function startStage(stage, tier){
  var n = Math.max(1, Math.min(STAGES_TOTAL, stage || 1));
  var m = stageMeta(n);
  var t = (m.kind === "pat") ? Math.max(1, Math.min(3, tier || 1)) : 1;
  if(tierLocked(n, t)){
    try{ if(window.__ui) window.__ui.blocked(n, t); }catch(e){}
    return false;
  }
  S.mode = "play"; S.lock = false;
  S.stage = n; store.lastStage = n; S.tier = t; store.lastTier = t;
  S.goal = tierGoal(n, t); S.clears = 0; S.clearedIds = {};""", "start-tier")
engine = sub1(engine, '  else if(m.kind === "mix")   setTimeout(function(){ toast("MIX " + m.mix + " · 패턴 1~" + m.to + " 총복습", true); }, 260);',
              '  else if(m.kind === "mix")   setTimeout(function(){ toast("MIX " + m.mix + " · 패턴 1~" + m.to + " 총복습", true); }, 260);\n  if(m.kind === "pat" && t > 1) setTimeout(function(){ toast("Lv." + n + "-" + t + " · 패턴 1~" + tierMixTo(n, t) + " 믹스", true); }, 260);',
              "start-toast-tier")

# 출제 — 2·3단계는 그 패턴 + 해금 기준까지 깬 패턴을 섞는다
engine = sub1(engine, "function queueFor(stage, run){", "function queueFor(stage, run, tier){", "queue-sign")
engine = sub1(engine, """  if(m.kind === "pat"){
    /* 그 패턴 5문장을 모두 넣고, 남는 자리는 앞 패턴 복습으로 번갈아 채운다 */""",
"""  if(m.kind === "pat" && (tier || 1) > 1){
    /* 2·3단계 — 그 패턴 5문장 + 해금 기준까지 깬 패턴(1~to)을 섞는다 */
    var tt = Math.max(2, Math.min(3, tier || 2)), to = tierMixTo(stage, tt);
    var mine = [], others = [], goalT = TIER_GOAL[tt];
    for(i=0;i<DATA.length;i++){
      if(DATA[i].p === m.p) mine.push(i);
      else if(DATA[i].p <= to) others.push(i);
    }
    mine = shuffled(mine, rng).slice(0, 5);
    others = shuffled(others, makeRng((stage || 1)*613 + tt*97 + (run || 0)*31 + 5)).slice(0, Math.max(0, goalT - mine.length));
    return shuffled(mine.concat(others), makeRng((stage || 1)*89 + tt*211 + (run || 0)*17 + 9));
  }

  if(m.kind === "pat"){
    /* 그 패턴 5문장을 모두 넣고, 남는 자리는 앞 패턴 복습으로 번갈아 채운다 */""", "queue-tier")
engine = sub1(engine, "  var ids = queueFor(S.stage, S.run), out = [], i;",
              "  var ids = queueFor(S.stage, S.run, S.tier), out = [], i;", "refill-tier")

# 난이도 — 2·3단계는 줄이 더 빨리 내려오고 함정이 늘어난다
engine = sub1(engine, "  var want = isInfStage(S.stage) ? 12 : Math.min(12, 8 + Math.floor((n - 1)/8));",
              "  var want = isInfStage(S.stage) ? 12 : Math.min(12, 8 + Math.floor((n - 1)/8) + ((S.tier || 1) - 1));",
              "trap-tier")
engine = sub1(engine, """  if(m.kind === "mix" || m.kind === "final") base -= 250;
  return Math.max(5400, Math.round(base));""",
"""  if(m.kind === "mix" || m.kind === "final") base -= 250;
  base = Math.max(5400, Math.round(base));
  if((S.tier || 1) > 1) base = Math.round(base / (S.tier === 3 ? 1.3 : 1.15));
  return base;""", "pace-tier")

# ══ v74 · 키캡 구역 분리(윗줄=파란 패턴, 아랫줄=일반 단어) + 알파벳순 정렬 ══
engine = sub1(engine, "  return shuffled(out.concat(traps), makeRng(d.id*104729 + 7));",
"""  var all = out.concat(traps);
  all.sort(function(a, b){
    var pa = OPENSET[norm(a)] ? 0 : 1, pb = OPENSET[norm(b)] ? 0 : 1;
    if(pa !== pb) return pa - pb;
    var la = norm(a), lb = norm(b);
    return la < lb ? -1 : (la > lb ? 1 : 0);
  });
  return all;""", "pool-group-sort")

engine = sub1(engine, """  for(i=0;i<S.blocks.length;i++){
    var t = S.blocks[i];
    var b = document.createElement("button");
    /* 패턴 앞머리 칩은 .pat 으로 눈에 띄게 — 정답·함정 오프너가 같은 색이라 스포일러는 없다 */
    b.className = OPENSET[norm(t)] ? "blk pat" : "blk";""",
"""  var prevPat = false;
  for(i=0;i<S.blocks.length;i++){
    var t = S.blocks[i];
    var isP = !!OPENSET[norm(t)];
    if(!isP && prevPat){
      var sep = document.createElement("span");
      sep.className = "poolSep";
      elPool.appendChild(sep);
    }
    prevPat = isP;
    var b = document.createElement("button");
    /* 패턴 앞머리 칩은 .pat 으로 눈에 띄게 — 정답·함정 오프너가 같은 색이라 스포일러는 없다 */
    b.className = isP ? "blk pat" : "blk";""", "pool-sep-render")

# ══ v75 · 긴장감 패키지: Easy 1.25배속 · 막판 2문장 러시 · 오답 +10% 낙하 · 위험구간 심장박동/SAVE +200 ══
engine = sub1(engine, 'if(m.kind === "pat" && t > 1) setTimeout(function(){ toast("Lv." + n + "-" + t + " · 패턴 1~" + tierMixTo(n, t) + " 믹스", true); }, 260);',
              'if(m.kind === "pat" && t > 1) setTimeout(function(){ toast(stageTagText(n, t) + " · 패턴 1~" + tierMixTo(n, t) + " 복습", true); }, 260);', "toast-tier-label")

engine = sub1(engine, '  BGM.bpm = 116 + Math.min(16, Math.floor(S.combo * 0.5));',
              '  BGM.bpm = 116 + Math.min(16, Math.floor(S.combo * 0.5)) + (S.danger ? 28 : 0);', "bgm-danger-bpm")

engine = sub1(engine, """  if((S.tier || 1) > 1) base = Math.round(base / (S.tier === 3 ? 1.3 : 1.15));
  return base;""",
"""  var spdDiv = (m.kind === "pat" && (S.tier || 1) === 1) ? 1.25 : ((S.tier || 1) === 3 ? 1.35 : ((S.tier || 1) === 2 ? 1.2 : 1));
  if(spdDiv > 1) base = Math.round(base / spdDiv);
  if(!isInfStage(stage) && (clears || 0) >= Math.max(1, tierGoal(stage, S.tier || 1) - 2)){
    base = Math.round(base / 1.3);
  }
  return base;""", "pace-rush-tier")

engine = sub1(engine, """    var gain = base * S.mult;
    S.score += gain;""",
"""    var savedDanger = !!(row && S.laneH && (row.y + S.R >= S.laneH * 0.72));
    var gain = base * S.mult + (savedDanger ? 200 : 0);
    S.score += gain;""", "hit-danger-save")

engine = sub1(engine, 'try{ floatText(gainTxt, cx, cy); }catch(e){}',
              'try{ floatText(savedDanger ? ("SAVE! +" + gain) : gainTxt, cx, cy); }catch(e){}', "hit-danger-float")

engine = sub1(engine, """function clearSlots(){
  if(S.mode !== "play" || S.lock) return;
  S.slots = [];
  elSlots.className = "slots";
  renderSlots();
  renderPoolUsed();
  beep(360, 0.06, "sine", 0.04, 260);
}""",
"""function clearSlots(){
  if(S.mode !== "play" || S.lock) return;
  S.slots = [];
  elSlots.className = "slots";
  renderSlots();
  renderPoolUsed();
  beep(360, 0.06, "sine", 0.04, 260);
}""", "clear-easy-autofill")

engine = sub1(engine, """    if(bossHealed){
      try{ sfxCombo(); }catch(e){}""",
"""    if(!done && !isInfStage(S.stage) && S.clears === S.goal - 2){
      setTimeout(function(){ if(S.mode === "play") toast("마지막 2문장 · 빨라져요!", true); }, 350);
    }
    if(bossHealed){
      try{ sfxCombo(); }catch(e){}""", "final-rush-toast")

engine = sub1(engine, """function wrongRow(row){
  S.lock = true;
  sfxBad(); shakeEl(row.el);""",
"""function wrongRow(row){
  S.lock = true;
  sfxBad(); shakeEl(row.el);
  if(row && !row.dead && S.laneH){
    row.y = Math.min(S.laneH - S.R - 6, row.y + Math.round(S.laneH * 0.10));
    if(row.el) row.el.style.transform = "translate3d(" + Math.round(row.x || 0) + "px," + Math.round(row.y) + "px,0)";
  }""", "wrong-drop-penalty")

engine = sub1(engine, 'var SIBLING = { 16: "There are" };',
"""var SIBLING = {
  1:  ["I tried to", "I'm supposed to"],
  2:  ["I'm supposed to", "I was supposed to"],
  3:  ["I'm about to", "I was about to"],
  4:  ["I was here to", "I'm trying to"],
  5:  ["I've tried to", "I'm trying to"],
  6:  ["Let's", "I'll"],
  7:  ["Can you", "Do you mind"],
  8:  ["Can I get", "Do you mind"],
  9:  ["Do you mind if I", "Can you"],
  10: ["I wasn't sure", "I don't think"],
  11: ["I thought", "I'm not sure"],
  12: ["I think you could", "You don't have to"],
  13: ["It felt like", "It looks like"],
  16: ["There are", "There was"],
  17: ["I wanted to", "I'm trying to"],
  18: ["I needed you to", "I want you to"],
  20: ["Do you know if", "I'm not sure"],
  31: ["Where can I", "How much"],
  32: ["How do I", "When can I"],
  33: ["Where can I", "How long does it take"],
  34: ["How much", "How do I get to"],
  35: ["How long", "How many"],
  36: ["Which one", "What do you want"],
  37: ["What is", "Which way is"],
  38: ["Where does", "How long"],
  39: ["Why didn't we", "How do we"],
  40: ["Do you want", "Where can I"]
};""", "sibling-tense-traps")

engine = sub1(engine, '  if(SIBLING[d.p]) push(SIBLING[d.p]);',
"""  if(SIBLING[d.p]){
    var sb = SIBLING[d.p];
    if(typeof sb === "string") push(sb);
    else for(var sbi=0;sbi<sb.length;sbi++) push(sb[sbi]);
  }""", "sibling-array-push")

engine = sub1(engine, '  { pats:[10, 11],         openers:["I\'m not sure if", "I don\'t think", "I think", "Are you sure"] },',
              '  { pats:[10, 11],         openers:["I\'m not sure", "I don\'t think", "I think", "Are you sure"] },', "conf-pat-10-fix")

engine = sub1(engine, '  "Do you mind ~ing?",', '  "Do you mind ~ing / if I ~?",', "pat9-title")

# 기록 — 단계별로 따로 남긴다 (1단계는 기존 키 그대로라 예전 기록과 호환)
engine = sub1(engine, """function recordStage(){
  var k = String(S.stage);
  if(S.score > (+store.stageBest[k] || 0)) store.stageBest[k] = S.score;""",
"""function recordStage(){
  var m = stageMeta(S.stage);
  var k = (m.kind === "pat") ? tierKey(S.stage, S.tier || 1) : String(S.stage);
  if(S.score > (+store.stageBest[k] || 0)) store.stageBest[k] = S.score;""", "record-key")
engine = sub1(engine, """    if(S.clears >= (S.goal || 1)){
      store.stageDone[k] = 1;
      var st = Math.max(1, Math.min(3, S.hearts || 1));
      if(st > (+store.stageStars[k] || 0)) store.stageStars[k] = st;
    }""",
"""    if(S.clears >= (S.goal || 1)){
      store.stageDone[k] = 1;
      if(m.kind !== "pat"){   /* 패턴 스테이지의 별은 '깬 단계 수'로 센다 */
        var st = Math.max(1, Math.min(3, S.hearts || 1));
        if(st > (+store.stageStars[k] || 0)) store.stageStars[k] = st;
      }
    }""", "record-tier-stars")

# 클리어 시트 — 단계 이름·별·다음 단계
engine = sub1(engine, "  var wasNew = !store.stageDone[String(S.stage)];",
              "  var wasNew = !tierDone(S.stage, S.tier || 1);", "clear-new")
engine = sub1(engine, "  paintStars(S.hearts);",
              "  paintStars(stageMeta(S.stage).kind === \"pat\" ? (S.tier || 1) : S.hearts);", "clear-stars")
engine = sub1(engine, '    $("clearTitle").textContent = btnLabel(S.stage) + " 클리어!";',
              '    $("clearTitle").textContent = btnLabel(S.stage, S.tier || 1) + " 클리어!";', "clear-title")
engine = sub1(engine, """  var nb = $("btnNextStage"), nn = Math.min(STAGES_TOTAL, S.stage + 1);
  setBtn(nb, ICON.rocket, btnLabel(nn) + " 시작");
  nb.setAttribute("data-next", String(nn));""",
"""  var nx2 = nextStageTier(S.stage, S.tier || 1);
  var nb = $("btnNextStage");
  setBtn(nb, ICON.rocket, btnLabel(nx2.n, nx2.t) + " 시작");
  nb.setAttribute("data-next", String(nx2.n));
  nb.setAttribute("data-tier", String(nx2.t));""", "clear-next")
engine = sub1(engine, '    if(w && w.signal) w.signal("영어 타임어택: " + btnLabel(S.stage) + " 클리어 · " + S.score + "점");',
              '    if(w && w.signal) w.signal("영어 타임어택: " + btnLabel(S.stage, S.tier || 1) + " 클리어 · " + S.score + "점");',
              "clear-signal")
engine = sub1(engine, '    if(w && w.signal) w.signal("영어 타임어택: " + btnLabel(S.stage) + " · " + S.clears',
              '    if(w && w.signal) w.signal("영어 타임어택: " + btnLabel(S.stage, S.tier || 1) + " · " + S.clears',
              "over-signal")

# ══ v63 · 정답 조립 순간 원어민 발음 한 번 (ui.js sayEn) ═══════════════════
engine = sub1(engine, """    paintScore(); paintCombo(); paintSpeed(); paintStage();

    var cx = (row.x || 0)""",
"""    paintScore(); paintCombo(); paintSpeed(); paintStage();
    /* 정답 조립 — 그 문장을 원어민 발음으로 한 번 들려준다(소리 꺼짐·음성 API 없음은 조용히 통과) */
    try{ if(typeof sayEn === "function" && store.voice !== false) sayEn(row.d.en); }catch(e){}

    var cx = (row.x || 0)""", "hit-speak")

# ══ v63 · 단어판에 정답이 사라지던 버그 ══════════════════════════════════
# ① 지난 스테이지의 고정 높이가 남아 있어 '자연 높이'가 아니라 '잘린 높이'를 재고 있었다.
engine = sub1(engine, """function freezePool(){
  if(!elPool) return;
  var appH = (elApp && elApp.clientHeight) || 0;
  var h = elPool.offsetHeight || 0;""",
"""function freezePool(){
  if(!elPool) return;
  var appH = (elApp && elApp.clientHeight) || 0;
  /* 지난 스테이지에서 박아 둔 height 가 남아 있으면 offsetHeight 가 '잘린 높이'로 나와
     단어판이 영영 그 높이에 갇힌다 — 먼저 풀어 두고 잰다. */
  elPool.style.height = "auto";
  var h = elPool.offsetHeight || 0;""", "freezep-auto")

# ② 그래도 넘치면 함정 칩부터 덜어낸다 — 정답 칩은 절대 지우지 않는다
engine = sub1(engine, """function renderPool(){""",
"""/* 화면 높이를 넘는 칩은 overflow:hidden 에 가려 눌리지도 않는다.
   넘치면 '정답이 아닌 칩'을 뒤에서부터 덜어내 단어판을 항상 다 보이게 만든다. */
function dropOneTrap(row){
  if(!row || !row.d) return false;
  var need = {}, i, k, cut = -1, ch = row.d.chunks;
  for(i=0;i<ch.length;i++){ k = norm(ch[i]); need[k] = (need[k] || 0) + 1; }
  for(i=S.blocks.length-1;i>=0;i--){
    k = norm(S.blocks[i]);
    if(need[k] > 0){ need[k]--; continue; }     /* 정답 칩은 세기만 하고 지나간다 */
    cut = i; break;
  }
  if(cut < 0) return false;
  S.blocks.splice(cut, 1);
  return true;
}
function prunePool(row){
  if(!elPool || !row || !row.d || !S.blocks.length) return;
  var guard = 0, changed = false;
  while(guard++ < 24){
    if(elPool.scrollHeight <= elPool.clientHeight + 1) break;
    if(!dropOneTrap(row)) break;
    changed = true;
    renderPool();
  }
  if(changed) row.pool = S.blocks.slice();
}
function renderPool(){""", "prune-pool")

engine = sub1(engine, """  ensurePool(row);
  S.blocks = row.pool;
  elSlots.className = "slots";
  renderSlots(); renderPool(); paintRows();""",
"""  ensurePool(row);
  S.blocks = row.pool;
  elSlots.className = "slots";
  renderSlots(); renderPool(); prunePool(row); paintRows();""", "settarget-prune")

engine = sub1(engine, """  renderSlots(); renderPool(); prunePool(row); paintRows();
}""",
"""  renderSlots(); renderPool(); prunePool(row);
  paintRows();
}
function isEasyPat(){
  var m = stageMeta(S.stage);
  return !!(m && m.kind === "pat" && (S.tier || 1) === 1);
}
function autoFillEasy(row){
  if(!isEasyPat() || !row || !row.d || !row.d.chunks || row.d.chunks.length < 2) return;
  if(S.slots && S.slots.length) return;
  var head = norm(row.d.chunks[0]), idx = -1, k;
  for(k=0;k<S.blocks.length;k++){
    if(norm(S.blocks[k]) === head){ idx = k; break; }
  }
  if(idx >= 0){
    S.slots = [{ i: idx, t: S.blocks[idx] }];
    renderSlots();
    renderPoolUsed();
  }
}""", "easy-autofill")

# ══ v63 · 진행도(문장 수) 저장 · 게임 오버에 '어디서 놓쳤는지' ═══════════════
engine = sub1(engine, """    var pr = Math.min(1, (S.clears || 0) / (S.goal || 1));
    if(!(store.stageProg[k] >= pr)) store.stageProg[k] = pr;""",
"""    var pr = Math.min(1, (S.clears || 0) / (S.goal || 1));
    if(!(store.stageProg[k] >= pr)) store.stageProg[k] = pr;
    if(!store.stageProgN) store.stageProgN = {};
    var sPr = Math.min(S.goal || 0, S.clears || 0);   /* 이 단계에서 가장 멀리 간 문장 수 */
    if(!(store.stageProgN[k] >= sPr)) store.stageProgN[k] = sPr;""", "prog-count")

engine = sub1(engine, """  if(S.hearts <= 0){
    S.lock = true;
    setTimeout(function(){ endRun("over"); }, 420);
  }""",
"""  if(S.hearts <= 0){
    S.lock = true;
    var lostRow = row;                     /* 어느 문장에서 끝났는지 결과 화면으로 넘긴다 */
    setTimeout(function(){ endRun("over", lostRow); }, 420);
  }""", "crash-lostrow")

engine = sub1(engine, """function endRun(kind){
  if(S.mode === "over") return;""",
"""function endRun(kind, lostRow){
  if(S.mode === "over") return;""", "endrun-sign")

engine = sub1(engine, """  $("ovCleared").textContent = inf ? ("생존 " + S.clears) : (S.clears + "/" + S.goal);""",
"""  var kOv = (stageMeta(S.stage).kind === "pat") ? tierKey(S.stage, S.tier || 1) : String(S.stage);
  var ovBest = inf ? 0 : (+(store.stageBest && store.stageBest[kOv]) || 0);
  $("ovCleared").textContent = inf ? ("생존 " + S.clears) : ovBest.toLocaleString();
  if($("ovBestLbl")) $("ovBestLbl").textContent = inf ? "생존" : "최고 점수";
  /* 어디까지 갔는지 · 어느 문장에서 놓쳤는지 */
  if($("ovBar")) $("ovBar").style.width = inf ? "100%" : (Math.round(Math.min(1, (S.clears || 0) / Math.max(1, S.goal || 1)) * 100) + "%");
  if($("ovGoalTxt")) $("ovGoalTxt").textContent = inf ? ("생존 " + S.clears + "문장") : ((S.clears || 0) + " / " + (S.goal || 0) + "문장");
  var mb = $("ovMissed");
  if(mb){
    if(lostRow && lostRow.d){
      mb.innerHTML = '<em>놓친 문장</em><b>' + esc(lostRow.d.ko) + '</b><i>' + esc(lostRow.d.en) + '</i>';
      show(mb);
    } else {
      mb.innerHTML = "";
      hide(mb);
    }
  }""", "over-progress")

# ══ v63 · 빈 별은 '빈 자리'로 보이게 (짙은 남색 별 → 옅은 회색 별) ═══════
engine = sub1(engine, """  I.starOff = ic("",
    '<path d="m12 2.4 2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.4l-5.9 3.2 1.2-6.6L2.4 9.4l6.7-.9z" fill="#28304c" stroke="#465374" stroke-width=".9" stroke-linejoin="round"/>');""",
"""  I.starOff = ic("",
    '<path d="m12 2.4 2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.4l-5.9 3.2 1.2-6.6L2.4 9.4l6.7-.9z" fill="#E8EDF3" stroke="#C7D1DE" stroke-width=".9" stroke-linejoin="round"/>');""", "staroff-pale")

(SRC / "engine.generated.js").write_text(engine, encoding="utf-8")

# ── 3. 화면 조각과 뷰 레이어 ──────────────────────────────────────────────
head = (SRC / "head.html").read_text(encoding="utf-8")

# ── 청크 다듬기 — '동사+목적어'를 분리해 키캡을 짧게, 시제 함정은 동사 한 단어만 ──
engine = sub1(engine, """  for(i=0;i<CONF_PAT.length;i++){
    g = CONF_PAT[i].openers;
    for(j=0;j<g.length;j++) OPENSET[norm(g[j])] = 1;
  }
})();""", """  for(i=0;i<CONF_PAT.length;i++){
    g = CONF_PAT[i].openers;
    for(j=0;j<g.length;j++) OPENSET[norm(g[j])] = 1;
  }
})();

/* ── 청크 다듬기 ──
   'finish my presentation' 같은 덩어리는 'finish' + 'my presentation' 으로 나눠
   키캡을 짧게 유지한다. 첫 조각(패턴 앞머리)은 절대 쪼개지 않는다. */
var KEEP_PAIR = {
  "check in":1, "check out":1, "check on":1, "look for":1, "look at":1, "look up":1,
  "pick up":1, "turn off":1, "turn on":1, "turn around":1, "put on":1, "put down":1,
  "take off":1, "take out":1, "take care":1, "get up":1, "get in":1, "get out":1,
  "give up":1, "drop off":1, "sign up":1, "wait for":1, "come back":1, "go back":1,
  "go out":1, "come in":1, "find out":1, "work out":1, "hold on":1, "call back":1,
  "pay for":1, "run out":1, "catch up":1, "clean up":1, "set up":1, "fill in":1,
  "move in":1, "move out":1, "stay up":1, "wake up":1, "grow up":1, "show up":1,
  "try on":1, "sit down":1, "lie down":1, "write down":1
};
var CHUNK_PREP = { "for":1, "at":1, "in":1, "on":1, "to":1, "with":1, "by":1, "from":1,
  "about":1, "until":1, "after":1, "before":1, "of":1, "near":1, "into":1, "over":1,
  "during":1, "around":1 };
function bareWord(w){ return String(w).toLowerCase().replace(/[.,?!~]/g, ""); }
/* 앞에서 떼어낼 수 있는 것은 '동사'뿐 — 전치사·한정사 덩어리(for next week, in a day)는 그대로 둔다 */
var CONF_VERB = { finish:1, book:1, check:1, stay:1, order:1, ask:1, help:1, mind:1, do:1,
  make:1, mean:1, worry:1, cancel:1, change:1, move:1, sign:1, share:1, depend:1, decide:1,
  come:1, go:1, take:1, bring:1, hold:1, carry:1, leave:1, get:1, say:1, tell:1, look:1,
  see:1, watch:1, open:1, close:1, want:1, need:1, have:1, meet:1, eat:1, sleep:1, sit:1,
  wait:1, pay:1, call:1, turn:1, pick:1, exchange:1, return:1, buy:1, find:1, keep:1,
  send:1, park:1, catch:1, fix:1, print:1, wash:1, drop:1, start:1, stop:1, spend:1,
  lose:1, win:1, join:1, visit:1, reach:1, arrive:1, drive:1, walk:1, run:1, fly:1,
  rent:1, reserve:1, confirm:1, transfer:1, charge:1, clean:1, cook:1, taste:1,
  recommend:1, wear:1, work:1, pack:1 };
function splitChunkWords(c){
  var w = String(c).split(" "), out = [], i, n = w.length;
  if(n <= 2) return [c];
  var head = bareWord(w[0]);
  var pair = bareWord(w[0]) + " " + bareWord(w[1]);
  if(CONF_VERB[head] && !KEEP_PAIR[pair]){
    out.push(w[0]);
    w = w.slice(1);
    n = w.length;
  }
  if(!n) return out;
  var cur = [w[0]];
  for(i=1;i<n;i++){
    if(CHUNK_PREP[bareWord(w[i])] && cur.length >= 1 && (n - i) >= 1){
      out.push(cur.join(" "));
      cur = [w[i]];
    } else {
      cur.push(w[i]);
    }
  }
  if(cur.length) out.push(cur.join(" "));
  return out;
}
/* 조각이 너무 많아지지 않게 — 동사 단독 조각은 살리고 짧은 짝부터 합친다 */
function packChunks(list, cap){
  cap = cap || 5;
  while(list.length > cap){
    var bi = -1, bl = 1e9, i, a, b;
    for(i=0;i<list.length-1;i++){
      a = list[i]; b = list[i+1];
      if(a.indexOf(" ") < 0 && CONF[bareWord(a)]) continue;      if(a.length + b.length < bl){ bl = a.length + b.length; bi = i; }
    }
    if(bi < 0) bi = 0;
    list.splice(bi, 2, list[bi] + " " + list[bi+1]);
  }
  return list;
}
(function(){
  var i, j, k, p, out, parts;
  for(i=0;i<DATA.length;i++){
    out = [DATA[i].chunks[0]];
    for(j=1;j<DATA[i].chunks.length;j++){
      parts = splitChunkWords(DATA[i].chunks[j]);
      for(k=0;k<parts.length;k++) out.push(parts[k]);
    }
    DATA[i].chunks = packChunks(out, 5);
  }
  for(p in BANK) if(BANK.hasOwnProperty(p)) BANK[p].length = 0;
  for(i=0;i<DATA.length;i++){
    if(!BANK[DATA[i].p]) BANK[DATA[i].p] = [];
    for(j=0;j<DATA[i].chunks.length;j++) BANK[DATA[i].p].push(DATA[i].chunks[j]);
  }
})();""", "chunk-split")

# 시제·혼동 함정은 동사 한 단어만 (목적어를 붙이지 않는다)
engine = sub1(engine, """      for(j=0;j<alts.length;j++){
        var rest = words.slice(1).join(" ");
        conf.push(alts[j] + (rest ? " " + rest : ""));
      }""", """      for(j=0;j<alts.length;j++) conf.push(alts[j]);""", "conf-single-word")

# ══ v52 · 정답 직후 입력 끊김 없애기 ══════════════════════════════════════
#   맞히는 순간 다음 줄로 타겟·단어판을 넘기고 입력 잠금을 푼다. 폭발 연출(130ms)은
#   맞힌 줄에서만 진행되고, 연출이 끝난 뒤에는 사용자가 이미 고르던 단어를 지우지 않는다.
engine = sub1(engine, """    elSlots.className = "slots ok";
    var gainTxt""", """    elSlots.className = "slots ok";
    if(!(!isInfStage(S.stage) && S.clears >= (S.goal || 1))){
      var nxRow = null, ri;
      for(ri=0;ri<S.rows.length;ri++){ if(S.rows[ri] !== row && !S.rows[ri].dead){ nxRow = S.rows[ri]; break; } }
      if(nxRow){ setTargetRow(nxRow); S.lock = false; }
    }
    var gainTxt""", "hit-next-now")
engine = sub1(engine, """      if(!done && S.mode === "play" && !S.rows.length){ try{ spawnRow(); }catch(e){} }
      setTargetRow(S.rows[0] || null);""", """      if(!done && S.mode === "play" && !S.rows.length){ try{ spawnRow(); }catch(e){} }
      /* targetRow() 는 조준한 줄이 없으면 첫 줄을 돌려주므로 uid 로 직접 확인한다 —
         조준이 아직 맞힌 줄에 있으면(=다음 줄로 안 넘어갔으면) 새 줄로 넘기고 단어판도 새로 */
      var liveT = null, ti;
      for(ti=0;ti<S.rows.length;ti++) if(S.rows[ti].uid === S.target && !S.rows[ti].dead){ liveT = S.rows[ti]; break; }
      if(!liveT) setTargetRow(S.rows[0] || null);""", "hit-keep-slots")

# ══ v53 · 음성과 입력 분리 ═════════════════════════════════════════════════
#   iOS 는 원어민 음성(speechSynthesis)이 나오는 동안 오디오를 음성 쪽으로 넘긴다.
#   그 사이 탭마다 효과음을 만들고 멈춘 오디오를 깨우고, BGM 이 계속 음표를 예약하면
#   버튼과 소리가 같이 버벅인다 → 말하는 동안엔 Web Audio 를 건드리지 않는다.
engine = sub1(engine, """function ctx(){
  if(AC){
    if(AC.state === "suspended"){ try{ AC.resume(); }catch(e){} }
    return AC;
  }""", """function isSpeaking(){
  /* iOS 의 speechSynthesis.speaking 값은 실제와 어긋날 때가 있다 — 앱이 직접 기록한 재생 상태가 우선 */
  /* iOS 는 음성이 끊긴 뒤에도 speaking 이 true 로 남아 오디오가 영영 안 깨어날 수 있다 — 앱 기록만 믿는다 */
  return (typeof voiceBusy === "function") ? voiceBusy() : false;
}
function ctx(){
  if(AC){
    if(AC.state === "suspended" && !isSpeaking()){ try{ AC.resume(); }catch(e){} }
    return AC;
  }""", "ctx-speaking")
engine = sub1(engine, """function beep(f, dur, type, vol, to){
  if(!store.sound) return;""", """function beep(f, dur, type, vol, to){
  if(!store.sound) return;""", "beep-speaking")
engine = sub1(engine, """function noise(dur, vol){
  if(!store.sound) return;""", """function noise(dur, vol){
  if(!store.sound) return;""", "noise-speaking")
engine = sub1(engine, """function bgmTick(){
  var a = AC;
  if(!BGM.on || !a) return;""", """function bgmTick(){
  var a = AC;
  if(!BGM.on || !a) return;
  /* 말하는 동안엔 음표를 예약하지 않는다 — 끝나면 지금 시점부터 이어서 */
  if(a.state !== "running"){ BGM.next = a.currentTime + 0.06; return; }""", "bgm-speaking")
engine = sub1(engine, "  applyRowSize(row);\n", "  applyRowSize(row);\n  try{ if(window.__voicePre) window.__voicePre(d.en); }catch(e){}   /* 줄이 내려오는 동안 발음 파일을 미리 받아 둔다 */\n", "voice-preload")
engine = sub1(engine, "  k.bestSurv = +o.bestSurv || 0;", "  k.bestSurv = +o.bestSurv || 0;\n  k.voice = o.voice !== false;\n  k.tail = (o.tail && typeof o.tail === \"object\") ? o.tail : {};\n  k.tailBest = +o.tailBest || 0;\n  if(o.owner === \"me\") k.owner = \"me\";\n  if(typeof o.avatar === \"string\") k.avatar = o.avatar;", "store-voice")

# ══ v57 · 문장이 맨 위로 튀던 문제 ═════════════════════════════════════════
#   등장 애니메이션(rowIn)이 transform 을 덮어써서, 다시 재생되면 위치(translate3d)가 사라져
#   문장이 맨 위에서 다시 내려오는 것처럼 보였다(iOS 는 화면 흔들림·클래스 변경 때 다시 재생할 수 있다).
#   → 위치와 겹치지 않는 opacity·scale 속성만 쓰고, 끝나면 애니메이션을 떼어 다시 재생될 일이 없게.
engine = sub1(engine, """  try{ el.style.animation = "rowIn .34s cubic-bezier(.2,.9,.25,1)"; }catch(e){}""",
"""  try{
    el.style.animation = "rowIn .34s cubic-bezier(.2,.9,.25,1)";
    setTimeout(function(){ try{ el.style.animation = "none"; }catch(e2){} }, 380);
  }catch(e){}""", "rowin-once")

# ══ v58 · 같은 뜻인데 오답 처리되던 문제 ════════════════════════════════════
#   Can you ↔ Could you, Can I get ↔ Could I get, Do you mind ↔ Would you mind,
#   I was wondering if ↔ I'm wondering if 는 한국어 뜻으로 구분할 수 없다.
#   → 함정 단어에서 빼고, 채점도 같은 뜻으로 본다.
engine = sub1(engine, 'openers:["Can I get", "Can you", "Could you", "Let me", "I\'d like to"]',
              'openers:["Can I get", "Can you", "Let me", "I\'d like to"]', "conf-no-could")
engine = sub1(engine, """  "can":["could"],\n""", "", "conf-can")
engine = sub1(engine, """  "could":["can"],\n""", "", "conf-could")
engine = sub1(engine, """function sameSentence(made, en){
  return norm(made.join(" ")) === norm(en);
}""", """/* 뜻이 같은 표현은 같은 답으로 본다 */
var SAME_MEAN = [
  [/^could you /, "can you "], [/^could i /, "can i "], [/^would you mind /, "do you mind "],
  [/^im wondering if /, "i was wondering if "], [/^i am wondering if /, "i was wondering if "],
  [/ if i could /, " if i can "],
  [/^what time /, "when "], [/^could you tell me /, "can you tell me "]
];
function meanNorm(t){
  var s = " " + norm(t) + " ", i;
  s = s.replace(/^ /, "");
  for(i=0;i<SAME_MEAN.length;i++) s = s.replace(SAME_MEAN[i][0], SAME_MEAN[i][1]);
  return s.trim();
}
function sameSentence(made, en){
  return meanNorm(made.join(" ")) === meanNorm(en);
}""", "same-meaning")

# ══ v51 · UX 라이팅 — 옛 엔진(v31)에서 오는 화면 문구 ═══════════════════
#   용어: 레벨(스테이지·섬 X) · 단어(블록·칩·조각 X) · 완료(클리어·통과 X) · 복습(MIX X) · 무한 모드(무한전 X)
_UX = [
  ('toast("블록을 담아주세요");', 'toast("단어를 먼저 골라요");'),
  ('toast("칩은 7개까지 담을 수 있어요");', 'toast("7개까지 담을 수 있어요");'),
  ('"줄이 바닥에 닿았어요 · 하트 -1"', '"놓쳤어요 · 하트 -1"'),
  ('(S.combo + "콤보 · 하트 +1 회복!")', '(S.combo + "콤보! 하트 +1")'),
  ('(S.combo + "콤보 · FEVER ×" + S.mult)', '(S.combo + "콤보! 점수 ×" + S.mult)'),
  ('toast("보스 처치 · 보너스 +150점!", true);', 'toast("보스 처치! +150점", true);'),
  ('inf ? "무한전 종료" : "게임 오버"', 'inf ? "무한 모드 끝" : "게임 오버"'),
  ('  if(m.kind === "mix")   return "MIX " + m.mix;\n  if(m.kind === "final") return "FINAL";\n  return "무한전";',
   '  if(m.kind === "mix")   return "복습 " + m.mix;\n  if(m.kind === "final") return "총복습";\n  return "무한 모드";'),
  ('  if(m.kind === "mix")   return "MIX " + m.mix;\n  if(m.kind === "final") return "FINAL MIX";\n  return "무한전";',
   '  if(m.kind === "mix")   return "복습 " + m.mix;\n  if(m.kind === "final") return "총복습";\n  return "무한 모드";'),
  ('  if(m.kind === "mix")   return "MIX " + m.mix + " · 패턴 1~" + m.to + " 총복습";\n  if(m.kind === "final") return "FINAL MIX · 패턴 1~" + m.to + " 총복습";\n  return "Lv." + m.n + " · 무한 서바이벌";',
   '  if(m.kind === "mix")   return "복습 " + m.mix + " · 패턴 1~" + m.to;\n  if(m.kind === "final") return "총복습 · 패턴 1~" + m.to;\n  return "Lv." + m.n + " · 무한 모드";'),
  ('toast("MIX " + m.mix + " · 패턴 1~" + m.to + " 총복습", true);', 'toast("복습 " + m.mix + " · 패턴 1~" + m.to, true);'),
  ('return (m && m.kind === "pat") ? ("Lv." + n + " Easy") : ("Lv." + n);', 'return "Lv." + n;'),
  ('$("clearTitle").textContent = btnLabel(S.stage, S.tier || 1) + " 클리어!";', '$("clearTitle").textContent = btnLabel(S.stage, S.tier || 1) + " 완료!";'),
  ('"이제 무한 모드가 열렸어요"', '"무한 모드가 열렸어요"'),
  ('? ("생존 " + S.clears + "문장 · 최고 " + store.bestSurv + "문장")\n    : "여기까지예요. 바로 다시 갈 수 있어요.";',
   '? (S.clears + "문장 버텼어요 · 최고 " + store.bestSurv + "문장")\n    : "";'),
]
for _a, _b in _UX:
    assert engine.count(_a) >= 1, "UX 문구를 못 찾음: " + _a[:60]
    engine = engine.replace(_a, _b)

# ── 3. 화면 조각과 뷰 레이어 ──────────────────────────────────────────────
body = (SRC / "body.html").read_text(encoding="utf-8")
ui   = (SRC / "ui.js").read_text(encoding="utf-8")
ui   = ui + "\n" + (SRC / "tail.js").read_text(encoding="utf-8")
ui   = ui + "\n" + (SRC / "blank.js").read_text(encoding="utf-8")
ui   = ui + "\n" + (SRC / "fx.js").read_text(encoding="utf-8")

# v47 · 진행 기록 복구 — Lv.1~28 을 Easy·Normal·Hard 전부 깬 것으로 채운다.
#   저장소가 날아가도(iOS 저장소 정리·주소 변경) 앱을 열 때마다 다시 채워진다.
#   더하기만 하고 지우지 않으므로 새로 깬 기록·최고 점수는 그대로 남는다.
engine = engine + """
(function(){
  try{
    if(window.__noRestore) return;              /* 테스트에서는 빈 저장소로 시작 */
    /* 복구는 주인 기기에서만: 이미 Lv.21 이상인 기기(지금 쓰던 기기)이거나 주소에 #me 를 붙여 연 경우.
       처음 여는 다른 사람은 Lv.1 부터 시작한다. */
    var byLink = /(^|[#&?])me(=1)?($|&)/.test((location.hash || "") + "&" + (location.search || "").slice(1));
    if(store.owner !== "me"){
      if(byLink || (store.maxStage || 1) > 20){ store.owner = "me"; save(); }
      else return;
    }
    if(byLink){ try{ history.replaceState(null, "", location.pathname); }catch(e){} }
    var RESTORE_UPTO = Math.min(28, STAGES_TOTAL - 1), changed = false, maxP = 1, n, t, k, m, d, i;
    function mark(obj, key, val){ if(!(obj[key] >= val)){ obj[key] = val; changed = true; } }
    if(!store.stageStars) store.stageStars = {};
    if(!store.stageProg) store.stageProg = {};
    for(n=1;n<=RESTORE_UPTO;n++){
      m = stageMeta(n);
      if(m.kind === "pat") maxP = Math.max(maxP, m.p); else if(m.to) maxP = Math.max(maxP, m.to);
      if(m.kind === "pat"){
        for(t=1;t<=3;t++){
          k = tierKey(n, t);
          mark(store.stageDone, k, 1);
          mark(store.stageProg, k, 1);
          mark(store.stageStars, k, 3);
        }
      } else {
        k = String(n);
        mark(store.stageDone, k, 1);
        mark(store.stageProg, k, 1);
        mark(store.stageStars, k, 3);
      }
    }
    for(i=0;i<DATA.length;i++){
      d = DATA[i];
      if(d.p >= 1 && d.p <= maxP && !store.cleared[String(d.id)]){ store.cleared[String(d.id)] = 1; changed = true; }
    }
    if((store.maxStage || 1) < RESTORE_UPTO + 1){ store.maxStage = RESTORE_UPTO + 1; changed = true; }
    if((store.lastStage || 1) < RESTORE_UPTO + 1){ store.lastStage = RESTORE_UPTO + 1; store.lastTier = 1; changed = true; }
    if(changed) save();
  }catch(e){}
})();
"""

body = body.replace(
    '<button class="btn ghost" id="btnSetSound">소리 끄기</button>',
    '<button class="btn ghost" id="btnSetSound">소리 끄기</button>\n'
    '    <div class="charPick" id="charPick" role="group" aria-label="캐릭터 고르기"></div>\n'
    '    <button class="btn ghost" id="btnSetVoice">정답 발음 끄기</button>\n'
    '    <div style="display:flex;gap:8px;margin-top:8px;">\n'
    '      <button class="btn ghost" id="btnSetBackup" style="flex:1;margin-top:0;">기록 백업</button>\n'
    '      <button class="btn ghost" id="btnSetRestore" style="flex:1;margin-top:0;">기록 복원</button>\n'
    '    </div>\n'
    '    <button class="btn ghost" id="btnSetReset" style="margin-top:8px;color:#D9493A;">처음부터 다시 하기</button>'
)

ui = ui + """
/* 캐릭터 고르기 */
function paintCharPick(){
  var box = $("charPick"); if(!box) return;
  var cur = store.avatar || "panda", h = '<div class="cpTitle">내 캐릭터</div><div class="cpGrid">', i, id;
  for(i=0;i<CHAR_ORDER.length;i++){
    id = CHAR_ORDER[i];
    h += '<button class="cpItem' + (id === cur ? " on" : "") + '" data-char="' + id + '" aria-pressed="' + (id === cur) + '">' +
         '<span class="cpArt">' + mascotSVG(id) + '</span><span class="cpName">' + CHAR_NAME[id] + '</span></button>';
  }
  box.innerHTML = h + "</div>";
}
on($("charPick"), "click", function(e){
  var el = e.target;
  while(el && el !== this && !(el.getAttribute && el.getAttribute("data-char"))) el = el.parentNode;
  if(!el || el === this) return;
  store.avatar = el.getAttribute("data-char");
  save();
  paintCharPick();
  repaintMascots();
  try{ sfxTap(3); }catch(e2){}
});
paintCharPick();
on($("btnSetVoice"), "click", function(){
  store.voice = (store.voice === false);
  save();
  openSettings();
});
/* 초기화 — 실수 방지를 위해 두 번 눌러야 지운다. 소리 설정만 남긴다 */
var resetArm = 0;
on($("btnSetReset"), "click", function(){
  var b = $("btnSetReset");
  if(!resetArm){
    resetArm = setTimeout(function(){ resetArm = 0; b.textContent = "처음부터 다시 하기"; }, 3000);
    b.textContent = "한 번 더 누르면 모든 기록이 지워져요";
    return;
  }
  clearTimeout(resetArm); resetArm = 0;
  store = cleanStore({ sound: store.sound, voice: store.voice });
  save();
  b.textContent = "처음부터 다시 하기";
  hide(elSheetSet);
  goLobby();
});
on($("btnSetBackup"), "click", function(){
  try{
    var code = btoa(unescape(encodeURIComponent(JSON.stringify(store))));
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(code).then(function(){
        alert("백업 코드를 복사했어요. 메모장 등에 보관해 주세요.");
      }, function(){
        prompt("아래 백업 코드를 복사해 두세요.", code);
      });
    } else {
      prompt("아래 백업 코드를 복사해 두세요.", code);
    }
  }catch(e){ alert("백업 코드 생성에 실패했어요."); }
});
on($("btnSetRestore"), "click", function(){
  var code = prompt("백업 코드를 붙여넣어 주세요.");
  if(!code) return;
  try{
    var parsed = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    var cleaned = cleanStore(parsed);
    if(!cleaned) throw new Error("invalid");
    store = cleaned;
    save();
    hide(elSheetSet);
    goLobby();
    alert("기록을 복원했어요.");
  }catch(e){ alert("백업 코드가 올바르지 않아요."); }
});
"""

# 홈 화면 아이콘 — 옛 남색 번개 아이콘 대신 지금 게임 결로 그린 180x180 PNG 를 심는다
import base64 as _b64
_icon = (ROOT / "icon-180.png").read_bytes()
_icon_tag = ('<link rel="apple-touch-icon" sizes="180x180" href="data:image/png;base64,'
             + _b64.b64encode(_icon).decode("ascii") + '">')
head = head.replace("__APPICON__", _icon_tag)

ui = ui + "\n" + (SRC / "polish.js").read_text(encoding="utf-8")
ui = ui + "\n" + (SRC / "tailfx.js").read_text(encoding="utf-8")
html = (head + "\n" + body + "\n<script>\n(function(){\n'use strict';\n\n"
        + engine + "\n" + ui + "\n})();\n</script>\n</body>\n</html>\n")
# 자동 업데이트용 빌드 번호 — 파일 내용으로 정해서 같은 소스면 같은 번호
import hashlib as _hl
# 원어민 발음 파일 목록 — audio/ 에 실제로 있는 파일만 문장→해시로 넣는다(없는 건 기기 음성)
import hashlib as _hl2
def _vnorm(s): return s.replace("\u2019","'").replace("\u2018","'").replace("\u201c",'"').replace("\u201d",'"').strip()
_vf = {}
for _r in _data["rows"]:
    _k = _hl2.sha1(_vnorm(_r[1]).encode("utf-8")).hexdigest()[:10]
    if (ROOT / "audio" / (_k + ".mp3")).exists(): _vf[_vnorm(_r[1])] = _k
html = html.replace("__VOICE_FILES__", _json.dumps(_vf, ensure_ascii=False))
print("voice files:", len(_vf))
html = html.replace("__BUILD_ID__", _hl.sha1(html.encode("utf-8")).hexdigest()[:10])

# 웹 파일엔 시스템 이모지·기호 문자를 쓰지 않는다(아이콘은 전부 인라인 SVG)
html = html.replace("\u2192", "->").replace("\u2713", "")
OUT.write_text(html, encoding="utf-8")
print("built", OUT, len(html), "bytes")
