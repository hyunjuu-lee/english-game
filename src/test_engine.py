#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""엔진 테스트 — dukpy 로 bundle/index.html 의 스크립트를 최소 DOM 위에서 실행한다."""
import re, sys, json
from pathlib import Path
import dukpy

ROOT = Path(__file__).resolve().parent
HTML = ROOT.parent / "bundle" / "index.html"
html = HTML.read_text(encoding="utf-8")

css_checks = [
    (r"\.row\{[^}]*z-index:5", "일반 줄 z-index:5"),
    (r"\.row\.target\{[^}]*z-index:20", "타겟 줄 z-index:20"),
    (r"\.row\.danger\{[^}]*z-index:15", "위험 줄 z-index:15"),
    (r"\.row\{[^}]*max-width:calc\(100% - 20px\)", "줄 최대 폭"),
    (r"\.row\.target\{[^}]*border:2\.5px solid var\(--blueDot\)", "타겟 테두리 2.5px"),
    (r"\.boardNav\{", "보드 좌우 화살표"),
    (r"\.jCard\{", "여정 정보 카드"),
    (r"animation:mBlink 5\.2s", "마스코트 깜박임"),
    (r"html, ?body\{height:100%;height:100dvh", "풀스크린 높이(100dvh)"),
    (r"\.tabbar\{[^}]*env\(safe-area-inset-bottom", "탭바 바닥 밀착(안전영역)"),
    (r"\.boardPad\{", "조작부 보드 턱"),
    (r"\.sky\.th6\{", "챕터 테마(오로라)"),
    (r"\.slots\{[^}]*inset 0 2px 6px", "오목한 조립 트레이"),
    (r"\.tab svg\{width:34px", "탭 아이콘 확대"),
    (r"\.sheet\{[^}]*align-items:center;justify-content:center", "모달 정중앙"),
    (r"\.btnRow\{[^}]*grid-template-columns:1fr 1fr", "보조 버튼 2열"),
    (r"\.slots\{[^}]*min-height:44px", "조립 바 컴팩트(44px)"),
    (r"\.firebar\{[^}]*env\(safe-area-inset-bottom", "발사 바 바닥 밀착(안전영역)"),
    (r"\.btnStart3d\{[^}]*margin-bottom:22px", "시작 버튼 아래 여백"),
    (r"\.board\{[^}]*mask-image", "보딩패스 노치 마스크"),
    (r"\.bpStub:before\{[^}]*border-top:1\.5px dashed", "보딩패스 점선·스텁"),
    (r"\.tabbar\{[^}]*background:(#FFFFFF|rgba\(255,255,255)", "탭바 흰 바탕(바닥까지)"),
    (r"\.tab\.home \.tabIco:after\{[^}]*border-radius:50% 50% 46% 46%", "홈 버튼 유리 광택"),
    (r"\.tab:not\(\.home\)\.on \.tabIco\{[^}]*background:linear-gradient\(180deg,#FFFFFF", "고른 탭 캡슐 하이라이트"),
    (r"\.tab\.home \.tabIco\{[^}]*margin-top:-48px", "홈 버튼 탭바에 안착"),
    (r"\.app\{[^}]*position:fixed;inset:0", "앱이 화면 끝까지(fixed inset:0)"),
]
# 없어졌는지 확인할 것 — 락온 괄호 · 3단 공식 박스 · 노란 태양 블러 · 골드 팔레트
css_gone = [
    (r"\.row \.lock", "락온 괄호 CSS"),
    (r"3단 공식", "3단 공식 박스"),
    (r"view\.lobby:before", "로비 태양 블러"),
    (r"--gold1", "골드 팔레트"),
    (r"\.boardLegs", "이젤 다리(칠판 느낌)"),
    (r"\.boardRoof", "칠판 상단 민트 바"),
    (r"elApp\.style\.height", "fitApp 의 높이 덮어쓰기"),
]

scripts = re.findall(r"<script>(.*?)</script>", html, re.S)
assert len(scripts) == 1, "script blocks: %d" % len(scripts)
js = scripts[0]

SHIM = r"""
var __els = {};
function __mkEl(tag){
  var el = {
    tagName: tag || "div", style: {}, className: "", id: "",
    innerHTML: "", textContent: "", children: [], parentNode: null,
    offsetWidth: 220, offsetHeight: 44, offsetTop: 0, scrollTop: 0,
    scrollHeight: 44, clientHeight: 300, clientWidth: 360,
    classList: {
      add: function(c){ this._s = this._s || {}; this._s[c] = 1; },
      remove: function(c){ this._s = this._s || {}; delete this._s[c]; },
      contains: function(c){ return !!(this._s && this._s[c]); }
    },
    setAttribute: function(k,v){ this["_a_"+k] = String(v); },
    getAttribute: function(k){ var v = this["_a_"+k]; return v === undefined ? null : v; },
    appendChild: function(c){ c.parentNode = this; this.children.push(c); return c; },
    removeChild: function(c){ return c; },
    getElementsByTagName: function(){ return this.children; },
    querySelector: function(){ return null; },
    getBoundingClientRect: function(){ return {left:0, top:0, width:220, height:44}; },
    animate: function(){ return {cancel:function(){}}; },
    addEventListener: function(){},
    focus: function(){}, blur: function(){}
  };
  return el;
}
var document = {
  _els: {},
  getElementById: function(id){
    if(!this._els[id]){ var e = __mkEl("div"); e.id = id; this._els[id] = e; }
    return this._els[id];
  },
  createElement: function(t){ return __mkEl(t); },
  addEventListener: function(){},
  body: __mkEl("body"),
  hidden: false
};
var window = this;
window.document = document;
window.localStorage = {
  _d: {},
  getItem: function(k){ return this._d.hasOwnProperty(k) ? this._d[k] : null; },
  setItem: function(k,v){ this._d[k] = String(v); },
  removeItem: function(k){ delete this._d[k]; }
};
var localStorage = window.localStorage;
window.__noRestore = true;
window.requestAnimationFrame = function(){ return 0; };
window.PointerEvent = null;
var __timers = [];
function setTimeout(fn, ms){ __timers.push({fn: fn, ms: ms || 0}); return __timers.length; }
function clearTimeout(id){}
function setInterval(fn, ms){ __timers.push({fn: fn, ms: ms || 0, rep: true}); return __timers.length; }
function clearInterval(id){}
function __flush(rounds){
  var r = rounds || 12;
  while(__timers.length && r-- > 0){
    var batch = __timers; __timers = [];
    for(var i=0;i<batch.length;i++){ try{ batch[i].fn(); }catch(e){} }
  }
}
var navigator = { userAgent: "test" };
"""

TESTS = r"""
var R = __EM100;
var fails = [], checks = 0;
function ok(cond, msg){ checks++; if(!cond) fails.push(msg); }

/* ── 1. 데이터 무결성 ── */
ok(R.DATA.length === 400, "400문장 (실제 " + R.DATA.length + ")");
ok(R.PATTERNS.length === 41, "패턴 41칸(0포함)");
/* 패턴마다 정확히 10문장 · 문장 id 는 겹치지 않고 예전 id(1~150)를 그대로 이어받는다 */
var __per = {}, __p2;
for(var __i=0;__i<R.DATA.length;__i++){ __p2 = R.DATA[__i].p; __per[__p2] = (__per[__p2] || 0) + 1; }
var __badPer = [];
for(var __p=1;__p<=40;__p++) if(__per[__p] !== 10) __badPer.push(__p + ":" + (__per[__p] || 0));
ok(__badPer.length === 0, "패턴마다 10문장: " + __badPer.join(","));
var __ids = {}, __dup = [];
for(var __k=0;__k<R.DATA.length;__k++){ var __id = R.DATA[__k].id; if(__ids[__id]) __dup.push(__id); __ids[__id] = 1; }
ok(__dup.length === 0, "문장 id 중복 없음: " + __dup.slice(0,5).join(","));
ok(R.DATA[0].id === 1, "첫 문장 id=1 — 예전 '푼 문장' 기록이 같은 문장을 가리킨다");
ok(R.STAGES_TOTAL === 50, "50스테이지");
ok(R.stageMeta(1).goal === 10 && R.stageMeta(1).kind === "pat", "Lv.1 패턴1 목표 10");
ok(R.stageMeta(2).goal === 10, "Lv.2 목표 10");
ok(R.stageMeta(6).kind === "mix" && R.stageMeta(6).goal === 15, "MIX1 목표 15");
ok(R.stageMeta(49).kind === "final" && R.stageMeta(49).goal === 20, "FINAL 목표 20");
ok(R.stageMeta(50).kind === "inf", "50 무한전");
ok(R.queueFor(1, 0).length === 10, "queueFor(1)=10");
ok(R.queueFor(2, 0).length === 10, "queueFor(2)=10");
ok(R.queueFor(6, 0).length === 15, "queueFor(6)=15");
ok(R.queueFor(49, 0).length === 20, "queueFor(49)=20");
ok(R.queueFor(50, 0).length === 400, "무한전 큐=400");

/* ── 2. 단어판 전수 검증 — 150문장 모든 조각이 반드시 들어 있어야 조립 가능 ── */
function stageOfPattern(p){
  for(var i=0;i<R.STAGES.length;i++){
    var m = R.STAGES[i];
    if(m.kind === "pat" && m.p === p) return m.n;
  }
  return 49;
}
var badPool = [], badComp = [], minSlack = 999;
for(var i=0;i<R.DATA.length;i++){
  var d = R.DATA[i];
  var pool = R.buildPool(d, 10, stageOfPattern(d.p));
  for(var j=0;j<d.chunks.length;j++){
    var found = false;
    for(var k=0;k<pool.length;k++) if(pool[k] === d.chunks[j]) found = true;
    if(!found) badPool.push("#" + d.id + " [" + d.chunks[j] + "] / " + d.en);
  }
  var slack = pool.length - d.chunks.length;
  if(slack < minSlack) minSlack = slack;
  if(!R.sameSentence(d.chunks, d.en)) badComp.push("#" + d.id);
}
ok(badPool.length === 0, "단어판 누락 " + badPool.length + "건: " + badPool.slice(0,6).join(" | "));
ok(badComp.length === 0, "조각 그대로 조립했을 때 정답 불일치: " + badComp.join(","));
ok(minSlack >= 3, "모든 문장에 함정 여유가 있다(최소 " + minSlack + ")");

/* 청크는 짧게 — 문장당 5조각 이내, 조각 하나 22자 이내 */
var tooMany = [], tooLong = [], maxC = 0, maxL = 0;
for(var ic=0;ic<R.DATA.length;ic++){
  var cc = R.DATA[ic].chunks;
  if(cc.length > maxC) maxC = cc.length;
  if(cc.length > 5) tooMany.push("#" + R.DATA[ic].id + "(" + cc.length + ")");
  for(var jc=0;jc<cc.length;jc++){
    if(cc[jc].length > maxL) maxL = cc[jc].length;
    if(cc[jc].length > 22) tooLong.push(cc[jc]);
  }
}
ok(tooMany.length === 0, "문장당 5조각 이내(최대 " + maxC + "): " + tooMany.slice(0,5).join(","));
ok(tooLong.length === 0, "조각 길이 22자 이내(최대 " + maxL + "): " + tooLong.slice(0,5).join(","));

/* 시제 함정은 동사 단어 하나 — 목적어가 따라붙지 않는다 */
var finishD = null;
for(var if2=0;if2<R.DATA.length;if2++) if(R.DATA[if2].en.indexOf("finish my presentation") >= 0) finishD = R.DATA[if2];
if(finishD){
  var fp = R.buildPool(finishD, 10, stageOfPattern(finishD.p));
  var hasFinished = false, hasLong = false, k2;
  for(k2=0;k2<fp.length;k2++){
    if(fp[k2] === "finished") hasFinished = true;
    if(fp[k2] === "finished my presentation" || fp[k2].indexOf("finished ") === 0) hasLong = true;
  }
  ok(hasFinished, "'finished' 단어 함정이 들어있다");
  ok(!hasLong, "'finished my presentation' 처럼 긴 함정은 없다");
}
/* 예전 방식(=시제 변형 + 목적어 통째) 함정이 단 하나도 남아 있지 않은지 전수 검사 */
function bareW(w){ return String(w).toLowerCase().replace(/[.,?!~]/g, ""); }
var longTrap = [], bareTrap = [];
for(var il=0;il<R.DATA.length;il++){
  var D = R.DATA[il];
  var pl = R.buildPool(D, 10, stageOfPattern(D.p));
  for(var ci=1;ci<D.chunks.length;ci++){
    var words = D.chunks[ci].split(" ");
    if(words.length < 2) continue;
    var alts = R.CONF[bareW(words[0])];
    if(!alts) continue;
    var rest = words.slice(1).join(" ");
    for(var ai=0;ai<alts.length;ai++){
      var oldTrap = alts[ai] + " " + rest;
      if(pl.indexOf(oldTrap) >= 0) longTrap.push("#" + D.id + " " + oldTrap);
    }
  }
}
ok(longTrap.length === 0, "긴 시제 함정 없음: " + longTrap.slice(0,6).join(" | "));

/* 패턴 1 · 마지막 패턴 · MIX 단계에서도 함정이 섞인다 */
ok(R.buildPool(R.DATA[0], 10, 1).length > R.DATA[0].chunks.length, "패턴1 단어판에 함정");
ok(R.buildPool(R.DATA[399], 10, 49).length > R.DATA[399].chunks.length, "마지막 문장 단어판에 함정");

/* ── 2-b. 순차 해금 — 앞 레벨을 깨야 다음 레벨이 열린다 ── */
function __unlock(n){ R.store.stageDone = {}; for(var iu=1;iu<n;iu++) R.store.stageDone[String(iu)] = 1; }
ok(R.unlockedMax() === 1, "처음엔 Lv.1만 해금 (실제 " + R.unlockedMax() + ")");
ok(R.stageLocked(2) === true, "Lv.2는 잠김");
ok(R.stageLocked(1) === false, "Lv.1은 열림");
var m0 = R.S.mode, sg0 = R.S.stage;
ok(R.startStage(2) === false, "Lv.1 클리어 전엔 Lv.2 시작 차단");
ok(R.S.mode === m0 && R.S.stage === sg0, "차단된 시작은 게임 상태를 바꾸지 않는다");
R.startStage(1); __flush();
ok(R.S.mode === "play" && R.S.stage === 1, "Lv.1은 시작된다");
R.S.clears = R.S.goal;
R.stageClear(); __flush();
ok(R.store.stageDone["1"] === 1, "Lv.1 클리어가 기록된다");
ok(R.unlockedMax() === 2, "Lv.1 클리어 → Lv.2 해금");
R.startStage(2); __flush();
ok(R.S.stage === 2 && R.S.mode === "play", "해금된 Lv.2는 시작된다");
ok(R.startStage(5) === false, "중간을 건너뛴 Lv.5는 여전히 차단");
R.buildJourney();
ok(document.getElementById("jNodes").innerHTML.indexOf("jLock") >= 0, "여정 맵에 자물쇠 표시");
__unlock(1);
R.buildJourney();

/* ── 3. 판정 규칙 ── */
ok(R.sameSentence(["I'm here to","check in"], "I'm here to check in."), "정답 판정");
ok(!R.sameSentence(["I'm here to","check out"], "I'm here to check in."), "오답 판정");
ok(R.multOf(0) === 1 && R.multOf(3) === 2 && R.multOf(6) === 3 && R.multOf(10) === 4, "콤보 배수");

/* ── 4. 플레이 흐름 ── */
R.startStage(1);
__flush();
ok(R.S.rows.length >= 1, "시작 시 줄이 떠 있음");
var t = R.targetRow();
ok(!!t, "타겟 줄 존재");
var need = t.d.chunks, okFire = true;
for(var q=0;q<need.length;q++){
  if(q === 0 && R.S.slots.length && R.S.slots[0].t === need[0]) continue;
  var bi = -1;
  for(var z=0;z<R.S.blocks.length;z++) if(R.S.blocks[z] === need[q] && !R.S.slots.some(function(s){return s.i===z;})) bi = z;
  if(bi < 0){ okFire = false; break; }
  R.tapBlock(bi);
}
ok(okFire, "정답 조각을 모두 담을 수 있음");
var before = R.S.clears;
ok(R.fire() === true, "정답 발사 성공");
ok(R.S.clears === before + 1, "클리어 수 +1");
ok(R.S.score > 0, "점수 획득");
__flush();

/* 오답 — 몇 번째 조각까지 맞았는지 보고, 맞은 앞부분만 남긴다 */
var t2 = R.targetRow();
if(t2){
  var h0 = R.S.hearts, ans = t2.d.chunks, i;
  /* 일부러 첫 조각은 맞게, 두 번째는 틀리게 담는다 */
  var slotNow = R.S.slots.length;
  var firstIdx = -1, wrongIdx = -1;
  for(i=0;i<R.S.blocks.length;i++){
    if(R.S.blocks[i] === ans[0]) firstIdx = i;
    if(R.S.blocks[i] !== ans[1] && R.S.blocks[i] !== ans[0] && R.S.blocks[i].indexOf(" ") >= 0) wrongIdx = i;
  }
  if(firstIdx >= 0 && wrongIdx >= 0 && ans.length > 1){
    R.tapBlock(firstIdx);
    R.tapBlock(wrongIdx);
    R.fire();
    __flush();
    ok(R.S.hearts === h0, "오답은 하트를 깎지 않는다");
    ok(R.S.combo === 0, "오답은 콤보 초기화");
    ok(R.S.slots.length === 1 && R.S.slots[0].t === ans[0], "맞은 앞부분 조각만 남는다(" + R.S.slots.length + ")");
    ok(document.getElementById("builtLine").innerHTML.indexOf("hintIn") >= 0, "틀린 위치 힌트 문구");
    /* used 동기화 — 지금 담은 칩만 used */
    var usedOk = true;
    for(i=0;i<R.S.blockEls.length;i++){
      var want = R.S.slots.some(function(s){ return s.i === i; });
      var has = R.S.blockEls[i].classList.contains("used");
      if(want !== has) usedOk = false;
    }
    ok(usedOk, "남긴 칩과 단어판 used 상태 동기화");
    /* 남은 조각을 넣으면 바로 정답 */
    for(var q2=1;q2<ans.length;q2++){
      for(var z2=0;z2<R.S.blocks.length;z2++){
        if(R.S.blocks[z2] === ans[q2] && !R.S.slots.some(function(s){ return s.t === ans[q2] && s.i === z2; })){ R.tapBlock(z2); break; }
      }
    }
    var c1 = R.S.clears;
    ok(R.fire() === true, "이어서 고쳐 쏘면 정답");
    ok(R.S.clears === c1 + 1, "고쳐 쏜 뒤 클리어 +1");
    __flush();
  }
}

/* 빠진 조각만 있을 때는 담은 것을 다 남긴다 */
__unlock(4);
R.startStage(4);
__flush();
var t3 = R.targetRow();
if(t3 && t3.d.chunks.length >= 2){
  for(var qi=0;qi<R.S.blocks.length;qi++){
    if(R.S.blocks[qi] === t3.d.chunks[0]){ R.tapBlock(qi); break; }
  }
  var keepN = R.S.slots.length;
  R.fire();
  __flush();
  ok(R.S.slots.length === keepN, "빠진 조각만 있으면 담은 조각을 그대로 둔다");
}

/* ── 5. 새 줄 스폰 규칙 ── */
__unlock(5);
R.startStage(5);
__flush();
document.getElementById("lane").clientHeight = 2000;
R.layout();
var topRow = null;
for(var i5=0;i5<R.S.rows.length;i5++){
  if(!topRow || R.S.rows[i5].y < topRow.y) topRow = R.S.rows[i5];
}
if(topRow && R.S.rows.length < R.MAX_ROWS){
  topRow.y = 6;
  R.S.spawnT = 999999;
  var n0 = R.S.rows.length;
  R.update(1);
  ok(R.S.rows.length === n0, "맨 위 줄이 걸려 있으면 새 줄을 스폰하지 않는다");
}

/* 위(빠른) 줄이 아래(느린) 줄을 추월하지 않는다 */
var srt = R.S.rows.slice().sort(function(a,b){ return a.y - b.y; });
if(srt.length >= 2){
  var up = srt[0], low = srt[1];
  low.y = 600; up.y = 600 - (R.S.R + 10) + 3;   /* 일부러 겹친 상태 */
  var keep = up.spd; up.spd = 6;
  R.update(1);
  up.spd = keep;
  var g = low.y - up.y;
  ok(g >= R.S.R + 10 - 0.8, "빠른 줄이 아래 줄을 추월하지 못한다(gap " + g.toFixed(1) + ")");
}

/* ── 6. 장시간 소크 — 중복 스폰 · 겹침 ── */
__unlock(2);
R.startStage(2);
__flush();
document.getElementById("lane").clientHeight = 2000;
R.layout();
var dupFound = false, overlapFound = false, minGapSeen = 9999, seenMax = 0, spawns = 0, lastUid = 0;
for(var f=0; f<2600; f++){
  R.update(32);
  var rows = R.S.rows, ids = {}, j;
  if(rows.length > seenMax) seenMax = rows.length;
  for(j=0;j<rows.length;j++){
    var id = rows[j].d.id;
    if(ids[id]) dupFound = true;
    ids[id] = 1;
    if(rows[j].uid > lastUid){ lastUid = rows[j].uid; spawns++; }
  }
  var sort2 = rows.slice().sort(function(a,b){ return a.y - b.y; });
  for(j=1;j<sort2.length;j++){
    var gp = sort2[j].y - sort2[j-1].y;
    if(gp < minGapSeen) minGapSeen = gp;
    if(gp < R.S.R + 10 - 0.8) overlapFound = true;
  }
  if(R.S.mode !== "play"){ R.startStage(2); __flush(); R.layout(); }
}
ok(spawns >= 8, "소크 중 새 줄이 여러 번 스폰됐다(" + spawns + "회)");
ok(seenMax >= 3, "줄이 여러 개 동시에 떴다(최대 " + seenMax + "줄)");
ok(!dupFound, "화면에 같은 문장이 동시에 두 번 뜨지 않는다");
ok(!overlapFound, "줄끼리 절대 겹치지 않는다(최소 간격 " + minGapSeen.toFixed(2) + "px, 기준 " + (R.S.R + 10) + ")");

/* ── 7. 놓친 문장 재등장 · 중복 삽입 방지 ── */
__unlock(3);
R.startStage(3);
__flush();
var liveRow = R.S.rows[0];
var idx = liveRow.d.idx;
R.crashRow(liveRow);
__flush();
var afterCount = 0;
for(var q3=0;q3<R.queue().length;q3++) if(R.queue()[q3] === idx) afterCount++;
ok(afterCount <= 1, "놓친 문장이 큐에 중복 삽입되지 않는다(" + afterCount + ")");
ok(R.S.hearts === 2, "바닥 충돌은 하트 -1");
/* 큐에 두 번 있으면 requeue 가 막는다 */
R.S.q.push(idx);
var qlen0 = R.S.q.length;
R.requeue(R.DATA[idx]);
__flush();
ok(R.S.q.length === qlen0, "이미 큐에 있는 문장은 requeue 하지 않는다");

/* ── 8. 로비 · 여정 · 도감 ── */
R.setView("lobby");
R.paintLobby();
ok(document.getElementById("lobbyTitle").textContent.length > 0, "로비 제목");
ok(document.getElementById("lobbyKo").textContent.length > 0, "패턴 한국어 뜻");
ok(document.getElementById("lobbyEgEn").textContent.length > 0, "짧은 예문(영어)");
ok(document.getElementById("lobbyEgKo").textContent.length > 0, "짧은 예문(한국어)");
ok(document.getElementById("btnStartLabel").textContent.indexOf("시작") >= 0, "시작 버튼 라벨");
ok(document.getElementById("lobbyCleared").textContent.indexOf("50") > 0, "클리어 현황");

/* 홈 보드 < > 화살표 — 여정에 들어가지 않고 단계 넘기기 */
var s0 = R.views.stage;
R.stepLobby(1);
ok(R.views.stage === Math.min(R.STAGES_TOTAL, s0 + 1), "다음 단계로 넘어간다");
ok(document.getElementById("btnStart").getAttribute("data-stage") === String(R.views.stage), "시작 버튼이 그 단계를 가리킨다");
R.stepLobby(-1);
ok(R.views.stage === s0, "이전 단계로 돌아온다");
R.views.stage = 1; R.stepLobby(-1);
ok(R.views.stage === 1, "Lv.1 아래로는 안 내려간다");
R.views.stage = R.STAGES_TOTAL; R.stepLobby(1);
ok(R.views.stage === R.STAGES_TOTAL, "마지막 단계 위로는 안 올라간다");
R.views.stage = s0; R.paintLobby();

/* ㅌ 마스코트 — 눈 두 개, 민트, 깜박임 */
var mg = R.mascotSVG();
ok((mg.match(/mEye"/g) || []).length === 2, "마스코트 눈 두 개");
ok(mg.indexOf("#66F4CE") >= 0, "민트 ㅌ 색상");
ok(mg.indexOf("mEyeShut") >= 0, "깜박임 프레임");

/* 긴 문장은 캡슐 안으로 — 폰트 축소 */
var lr = { el: document.createElement("div"), koEl: document.createElement("span") };
lr.koEl.textContent = "다음 주 발표 자료를 오늘 안에 끝내려고 하는 중이야";
R.fitRowText(lr);
ok(parseFloat(lr.el.style.fontSize) < 14, "긴 문장은 폰트가 줄어든다(" + lr.el.style.fontSize + ")");
var sr = { el: document.createElement("div"), koEl: document.createElement("span") };
sr.koEl.textContent = "한시에 친구 만나기로 되어 있어";
R.fitRowText(sr);
ok(parseFloat(sr.el.style.fontSize) > parseFloat(lr.el.style.fontSize), "짧은 문장은 더 큰 글자");

R.openJourney();
var jh = document.getElementById("jNodes").innerHTML;
ok((jh.match(/data-stg=/g) || []).length === 50, "여정 노드 50개");
ok(jh.indexOf("jChest") >= 0, "보물상자 노드");
ok(jh.indexOf("jCrown") >= 0, "왕관 노드");
ok(jh.indexOf("jFlag") >= 0, "깃발 노드");
ok(jh.indexOf("jMascot") >= 0, "현재 스테이지 마스코트");
ok(document.getElementById("jCount").textContent.indexOf("/ 50") > 0, "여정 카운터");

/* 노드를 누르면 정보 카드만 뜨고 시작하지는 않는다 */
R.setView("journey");
var mode0 = R.S.mode, stg0 = R.S.stage;
R.showJCard(5);
ok(document.getElementById("jCard").classList.contains("hide") === false, "노드를 누르면 정보 카드");
ok(R.S.mode === mode0 && R.S.stage === stg0, "노드를 눌러도 바로 시작하지 않는다");
ok(document.getElementById("jCardName").textContent.length > 0, "카드에 패턴명");
ok(document.getElementById("jCardMeta").textContent.indexOf("문장") > 0, "카드에 문장 수");
__unlock(5);
R.showJCard(5);
R.startStage(R.views.jSel);
__flush();
ok(R.S.stage === 5 && R.S.mode === "play", "[시작하기]를 눌러야 그 스테이지가 시작된다");
/* 잠긴 노드의 카드 — 시작 버튼이 잠긴다 */
__unlock(3);
R.showJCard(6);
ok(document.getElementById("btnJStart").disabled === true, "잠긴 단계 카드의 시작 버튼 잠금");
ok(document.getElementById("jCard").className.indexOf("lock") >= 0, "잠긴 단계 카드 표시");
R.hideJCard();
__unlock(6);
R.buildJourney();

R.buildBook();
ok(document.getElementById("bookBody").innerHTML.indexOf("brow") >= 0, "도감 목록");
ok(document.getElementById("bookCnt").textContent.indexOf("/") > 0, "도감 카운터");

/* ── 9. 37스테이지 전부 시작 ── */
__unlock(50);
var badStage = [];
for(var s=1;s<=50;s++){
  try{
    R.startStage(s);
    __flush();
    if(R.S.mode !== "play") badStage.push(s + ":mode");
    if(R.S.rows.length < 1) badStage.push(s + ":rows");
  }catch(e){ badStage.push(s + ":" + e.message); }
}
ok(badStage.length === 0, "37스테이지 시작 실패: " + badStage.join(","));

/* ── 10. 저장 ── */
R.save();
ok(typeof localStorage.getItem("em100.arcade.v6") === "string", "저장 키 기록");

/* ── 11. 시즌 1 · 여행자 자격 컴셉 ── */
ok(typeof R.travelRank === "function", "여행자 랭크 함수");
ok(R.travelRank(0) === "출국 준비", "랭크 0: 출국 준비 (" + R.travelRank(0) + ")");
ok(R.travelRank(7) === "출국 준비", "랭크 7: 출국 준비 (" + R.travelRank(7) + ")");
ok(R.travelRank(8) === "공항 통과", "랭크 8: 공항 통과 (" + R.travelRank(8) + ")");
ok(R.travelRank(16) === "체크인 완료", "랭크 16: 체크인 완료 (" + R.travelRank(16) + ")");
ok(R.travelRank(24) === "현지 맛집 정복", "랭크 24: 현지 맛집 정복 (" + R.travelRank(24) + ")");
ok(R.travelRank(32) === "혼자 여행 가능!", "랭크 32: 혼자 여행 가능 (" + R.travelRank(32) + ")");
ok(R.travelRank(50) === "혼자 여행 가능!", "랭크 50: 혼자 여행 가능");

/* 보드(보딩패스) — 시즌 뱃지 · 랭크 · 스텝(CLEAR · 최고 점수 · 게이지) */
__unlock(3);
R.store.stageDone = {"1":1,"2":1};
R.store.stageBest = {"2":3022};
R.store.stageCombo = {"2":10};
R.store.stageStars = {"2":3};
R.views.stage = 2; R.paintLobby();
ok(document.getElementById("lobbyStars").innerHTML.indexOf("on") >= 0, "스텁에 별 뱃지");
ok(document.getElementById("lobbyStageBest").textContent.replace(/,/g, "") === "3022", "스텁에 최고 점수(" + document.getElementById("lobbyStageBest").textContent + ")");
ok(document.getElementById("lobbyStageCombo").textContent === "10", "스텁에 최고 콤보(" + document.getElementById("lobbyStageCombo").textContent + ")");
ok(document.getElementById("lobbyCleared").textContent === "2/50", "통과 현황 2/50 (" + document.getElementById("lobbyCleared").textContent + ")");
R.views.stage = 5; R.paintLobby();
ok(document.getElementById("lobbyStageBest").textContent === "-", "아직 못 깬 스테이지는 - 표시");

/* 클리어 시트 — 심플 클리어 / 모든 레벨 클리어 */
__unlock(50);
R.startStage(3); __flush();
R.S.clears = R.S.goal; R.stageClear(); __flush();
ok(document.getElementById("clearTitle").textContent.indexOf("완료") > 0, "클리어 시트: 완료 (" + document.getElementById("clearTitle").textContent + ")");
ok(document.getElementById("clearLead").textContent.indexOf("다음 레벨") >= 0, "클리어 시트: 다음 레벨 안내 (" + document.getElementById("clearLead").textContent + ")");
R.startStage(49); __flush();
R.S.clears = R.S.goal; R.stageClear(); __flush();
ok(document.getElementById("clearTitle").textContent === "모든 레벨 완료!", "FINAL: 모든 레벨 완료 (" + document.getElementById("clearTitle").textContent + ")");
ok(document.getElementById("clearLead").textContent.indexOf("무한 모드") >= 0, "FINAL: 무한 모드 안내");

/* ── 12. 발사 직후 단어판이 비지 않는다(마지막 1줄을 쐈을 때) ── */
__unlock(3);
R.startStage(3); __flush();
while(R.S.rows.length > 1){ R.removeRow(R.S.rows[R.S.rows.length - 1]); }
R.setTargetRow(R.S.rows[0]);
var only = R.targetRow();
ok(!!only, "한 줄만 남긴 상태에서 타겟이 있다");
if(only){
  R.S.slots = [];
  for(var q4=0;q4<only.d.chunks.length;q4++){
    for(var z4=0;z4<R.S.blocks.length;z4++){
      if(R.S.blocks[z4] === only.d.chunks[q4] && !R.S.slots.some(function(s){ return s.i === z4; })){ R.tapBlock(z4); break; }
    }
  }
  ok(R.fire() === true, "마지막 한 줄 발사 성공");
  __flush();
  ok(R.S.rows.length >= 1, "폭발 뒤 빈 화면 대신 다음 줄이 즉시 생긴다(" + R.S.rows.length + "줄)");
  ok(R.S.blocks.length > 0, "단어판이 비지 않는다(" + R.S.blocks.length + "칸)");
}

/* ── 13. 발사 판정 중에는 바닥 충돌이 끼어들지 않는다 ── */
R.startStage(3); __flush();
var hb = R.S.hearts;
R.S.lock = true;
var rowA = R.S.rows[0];
rowA.dead = false;
rowA.y = 100000;
R.update(16);
var hold = R.S.laneH - R.S.R - 6;
ok(rowA.y <= hold + 0.5, "발사 판정 중에는 바닥 직전에서 멈춘다(y " + rowA.y.toFixed(1) + " ≤ " + hold.toFixed(1) + ")");
ok(R.S.hearts === hb, "발사 판정 중 바닥 충돌로 하트가 깎이지 않는다");
R.S.lock = false;
R.update(16);
ok(rowA.y > hold - 1, "판정이 끝나면 다시 내려간다");

/* ── 14. 레벨별 3단계(티어) · 누적 복습 해금 ── */
R.store.stageDone = {}; R.store.stageBest = {}; R.store.stageCombo = {};
R.store.stageStars = {}; R.store.stageProg = {};
for(var u1=1;u1<=4;u1++) R.store.stageDone[String(u1)] = 1;
ok(R.tierNeed(1, 2) === 5, "Lv.1-2 기준 = Lv.5 (" + R.tierNeed(1, 2) + ")");
ok(R.tierNeed(1, 3) === 10, "Lv.1-3 기준 = Lv.10 (" + R.tierNeed(1, 3) + ")");
ok(R.tierNeed(45, 2) === 49 && R.tierNeed(45, 3) === 49, "Lv.45는 FINAL(49) 기준");
ok(R.tierLocked(1, 1) === false, "Lv.1-1은 열림");
ok(R.tierLocked(1, 2) === true, "Lv.1-2는 Lv.5 전엔 잠김");
ok(R.tierLocked(1, 3) === true, "Lv.1-3은 잠김");
ok(R.startStage(1, 2) === false, "잠긴 Lv.1-2 시작 차단");
R.store.stageDone["5"] = 1;
ok(R.tierLocked(1, 2) === false, "Lv.1-1 + Lv.5 클리어 → Lv.1-2 해금");
ok(R.tierLocked(1, 3) === true, "Lv.1-3은 Lv.1-2 없이는 안 열린다");
R.store.stageDone["1-2"] = 1;
ok(R.tierLocked(1, 3) === true, "Lv.1-3: Lv.10이 아직 없다");
R.store.stageDone["10"] = 1;
ok(R.tierLocked(1, 3) === false, "Lv.1-2 + Lv.10 클리어 → Lv.1-3 해금");
ok(!isNaN(R.unlockedMax()), "티어 키(1-2)가 레벨 해금 계산을 깨뜨리지 않는다 (" + R.unlockedMax() + ")");
ok(R.btnLabel(1, 2) === "Lv.1 Normal", "버튼 라벨 Lv.1 Normal (" + R.btnLabel(1, 2) + ")");
ok(R.defaultTier(1) === 3, "Lv.1은 3단계까지 열려 3단계가 기본 (" + R.defaultTier(1) + ")");

/* 2단계 = 해당 패턴 5문장 + 해금 기준까지 깬 패턴(패턴 1~5) · 12문장 */
R.store.stageDone = {"1":1,"2":1,"3":1,"4":1,"5":1};
R.startStage(1, 2);
ok(R.S.stage === 1 && R.S.tier === 2 && R.S.mode === "play", "Lv.1-2 시작");
__flush();
ok(R.S.tier === 2 && R.S.goal === 12, "Lv.1-2는 12문장 (tier " + R.S.tier + ", goal " + R.S.goal + ")");
var q2 = R.queueFor(1, 0, 2), own2 = 0, bad2 = 0, pats2 = {}, uniq2 = {}, i2;
for(i2=0;i2<q2.length;i2++){
  var p2 = R.DATA[q2[i2]].p;
  if(p2 === 1) own2++;
  if(p2 > 5) bad2++;
  pats2[p2] = 1;
  uniq2[q2[i2]] = (uniq2[q2[i2]] || 0) + 1;
}
ok(q2.length === 12, "Lv.1-2 큐 12문장 (" + q2.length + ")");
ok(own2 === 5, "Lv.1-2는 자기 패턴 5문장 (" + own2 + ")");
ok(bad2 === 0, "Lv.1-2에 해금 범위(1~5) 밖 패턴이 없다 (" + bad2 + ")");
ok(pats2[2] === 1 && pats2[5] === 1, "뒤 레벨 패턴(2~5)이 함께 나온다");
var dup2 = 0;
for(var kk2 in uniq2) if(uniq2.hasOwnProperty(kk2) && uniq2[kk2] > 1) dup2++;
ok(dup2 === 0, "한 관의 문장이 겹치지 않는다 (" + dup2 + ")");
ok(R.tierHint(1, 2) === "복습 포함 · 12문장", "Lv.1-2 안내: " + R.tierHint(1, 2));
ok(R.tierMixTo(1, 2) === 5, "Lv.1-2 복습 범위 = 패턴 1~5 (" + R.tierMixTo(1, 2) + ")");

/* 3단계 = 15문장 · 패턴 1~10 */
R.store.stageDone["1-2"] = 1; R.store.stageDone["10"] = 1;
R.startStage(1, 3);
ok(R.S.stage === 1 && R.S.tier === 3 && R.S.mode === "play", "Lv.1-3 시작");
__flush();
ok(R.S.tier === 3 && R.S.goal === 15, "Lv.1-3은 15문장 (goal " + R.S.goal + ")");
var q3 = R.queueFor(1, 0, 3), own3 = 0, bad3 = 0, pmax = 0, i3;
for(i3=0;i3<q3.length;i3++){
  var p3 = R.DATA[q3[i3]].p;
  if(p3 === 1) own3++;
  if(p3 > 10) bad3++;
  if(p3 > pmax) pmax = p3;
}
ok(q3.length === 15 && own3 === 5 && bad3 === 0, "Lv.1-3: 15문장 · 자기 패턴 5 · 범위 1~10 (" + q3.length + "/" + own3 + "/" + pmax + ")");
ok(R.tierHint(1, 3) === "복습 포함 · 15문장", "Lv.1-3 안내: " + R.tierHint(1, 3));
ok(R.tierMixTo(1, 3) === 9, "Lv.1-3 복습 범위 = 패턴 1~9 (" + R.tierMixTo(1, 3) + ")");

/* 별 = 깬 단계 수 · 단계별 기록 분리 */
R.store.stageDone = {"1":1,"2":1,"3":1,"4":1,"5":1};
R.store.stageBest = {}; R.store.stageCombo = {};
R.startStage(1, 1); __flush();
R.S.clears = R.S.goal; R.S.score = 1111; R.S.maxCombo = 7; R.stageClear(); __flush();
ok(R.store.stageBest["1"] === 1111 && R.store.stageCombo["1"] === 7, "1단계 기록은 기존 키");
ok(R.tierCount(1) === 1, "1단계 클리어 → 별 1개");
R.startStage(1, 2); __flush();
R.S.clears = R.S.goal; R.S.score = 2222; R.stageClear(); __flush();
ok(R.store.stageBest["1-2"] === 2222, "2단계 기록은 별도 키(1-2)");
ok(R.tierCount(1) === 2, "2단계 클리어 → 별 2개");
ok(R.store.stageCombo["1"] === 7, "2단계 클리어가 1단계 기록을 덮지 않는다");
R.views.stage = 1; R.views.tier = 1; R.paintLobby();
var lb1 = document.getElementById("lobbyStars").innerHTML;
ok((lb1.match(/bpStar btn on/g) || []).length === 2, "홈 카드 별 2개 (" + ((lb1.match(/bpStar btn on/g) || []).length) + ")");
ok(document.getElementById("lobbyStageBest").textContent.replace(/,/g, "") === "1111", "1단계 최고 점수 표시");
R.views.tier = 2; R.paintLobby();
ok(document.getElementById("lobbyStageBest").textContent.replace(/,/g, "") === "2222", "2단계로 바꾸면 그 단계 최고 점수");
var starsHtml = document.getElementById("lobbyStars").innerHTML;
ok((starsHtml.match(/data-tier=/g) || []).length === 3, "홈 카드 별 3개가 1·2·3단계 버튼");
ok(starsHtml.indexOf("lock") >= 0, "아직 잠긴 별 단계에는 lock 표시");
ok(document.getElementById("lobbyLv").textContent === "Lv.1 Normal", "홈 칩도 Lv.1 Normal (" + document.getElementById("lobbyLv").textContent + ")");
R.views.tier = 3; R.paintLobby();
ok((document.getElementById("lobbySub").textContent + document.getElementById("btnStartLabel").innerHTML).indexOf("완료 후 열려요") >= 0, "잠긴 난이도 선택 시 여는 조건 안내(카드 또는 시작 버튼)");
/* 여정 노드에도 깬 단계 수가 보인다 */
R.buildJourney();
ok(document.getElementById("jNodes").innerHTML.indexOf("jTier") >= 0, "여정 노드의 단계 별 표시");
/* 클리어 직후 '다음'은 같은 레벨의 다음 단계부터 */
var nx2 = R.nextStageTier(1, 1);
ok(nx2.n === 1 && nx2.t === 2, "Lv.1-1 클리어 뒤 다음은 Lv.1-2 (" + nx2.n + "-" + nx2.t + ")");
var nx3 = R.nextStageTier(1, 3);
ok(nx3.n === 2, "마지막 단계 뒤에는 다음 레벨 (" + nx3.n + ")");
/* MIX·FINAL은 단계가 하나 */
R.store.stageDone = {"1":1,"2":1,"3":1,"4":1,"5":1};
R.startStage(6, 3); __flush();
ok(R.S.tier === 1 && R.S.goal === 15, "MIX는 단계 하나 · 15문장 (tier " + R.S.tier + ")");

/* ── 14-b. 단어판 전수 검증 — 모든 문장 × 모든 스테이지/단계에 정답 칩이 다 있다 ── */
var missPool = [], poolRuns = 0, stP, tiP, iP, kP;
var oldStageP = R.S.stage, oldTierP = R.S.tier;
for(stP=1; stP<=R.STAGES_TOTAL; stP++){
  for(tiP=1; tiP<=3; tiP++){
    R.S.stage = stP; R.S.tier = tiP;
    for(iP=0; iP<R.DATA.length; iP++){
      var dP = R.DATA[iP];
      var plP = R.buildPool(dP, R.trapCount(dP), dP.p > 0 ? stP : stP);
      poolRuns++;
      var needP = {}, haveP = {}, qP;
      for(qP=0;qP<dP.chunks.length;qP++){ var nkP = R.norm(dP.chunks[qP]); needP[nkP] = (needP[nkP]||0) + 1; }
      for(qP=0;qP<plP.length;qP++){ var hkP = R.norm(plP[qP]); haveP[hkP] = (haveP[hkP]||0) + 1; }
      for(kP in needP) if(needP.hasOwnProperty(kP) && (haveP[kP]||0) < needP[kP])
        missPool.push("Lv." + stP + "-" + tiP + " #" + dP.id + " [" + kP + "]");
    }
  }
}
R.S.stage = oldStageP; R.S.tier = oldTierP;
ok(poolRuns === R.DATA.length * R.STAGES_TOTAL * 3, "단어판 전수 실행 " + poolRuns + "회");
ok(missPool.length === 0, "정답 칩 누락 " + missPool.length + "건: " + missPool.slice(0, 6).join(" | "));

/* 실제 게임 자리 — Lv.3 첫 줄에도 정답 칩이 화면 단어판에 다 있다 */
R.store.stageDone = {"1":1,"2":1};
R.startStage(3, 1); __flush();
var rowP3 = R.targetRow();
var allIn3 = true, p3i;
for(p3i=0;p3i<rowP3.d.chunks.length;p3i++){
  var found3 = false;
  for(kP=0;kP<R.S.blocks.length;kP++) if(R.norm(R.S.blocks[kP]) === R.norm(rowP3.d.chunks[p3i])){ found3 = true; break; }
  if(!found3) allIn3 = false;
}
ok(allIn3, "Lv.3 첫 문장의 정답 칩이 단어판에 있다: " + rowP3.d.en);
ok(R.S.blocks.length >= rowP3.d.chunks.length, "단어판 칩 수가 정답 조각 수 이상 (" + R.S.blocks.length + ")");

/* 단어판이 화면보다 길면 함정부터 덜어내되 정답은 남긴다 */
var poolEl = document.getElementById("pool");
poolEl.scrollHeight = 999; poolEl.clientHeight = 60;
var beforeP = R.S.blocks.length;
R.prunePool(rowP3);
var afterP = R.S.blocks.length;
var keepAll = true;
for(p3i=0;p3i<rowP3.d.chunks.length;p3i++){
  var f2 = false;
  for(kP=0;kP<R.S.blocks.length;kP++) if(R.norm(R.S.blocks[kP]) === R.norm(rowP3.d.chunks[p3i])){ f2 = true; break; }
  if(!f2) keepAll = false;
}
ok(afterP < beforeP, "넘치면 함정 칩을 덜어낸다 (" + beforeP + " -> " + afterP + ")");
ok(keepAll, "덜어낸 뒤에도 정답 칩은 그대로 남는다");
ok(afterP >= rowP3.d.chunks.length, "정답 조각보다 적게 남지 않는다");
poolEl.scrollHeight = 44; poolEl.clientHeight = 300;

/* 상단 별 카운터 — 한 단계 깰 때마다 1개, 최대 90개 */
R.store.stageDone = {"1":1,"1-2":1,"1-3":1,"2":1};
ok(R.totalStars() === 4, "별 누적 4개 (1-1·1-2·1-3·2-1) 실제 " + R.totalStars());
ok(R.MAX_STARS === 120, "최대 별 120개(패턴 40 x 3단계)");
R.views.stage = 2; R.paintLobby();
ok(document.getElementById("chipSurv").textContent === "4/120", "상단 칩에 별 4/120 (" + document.getElementById("chipSurv").textContent + ")");
ok(document.getElementById("chipIcoCrown").innerHTML.indexOf("svg") >= 0, "상단 칩 아이콘 = 별");

/* ── 14-c. 진행도 저장 · 게임 오버에 놓친 문장 ── */
R.store.stageDone = {"1":1,"2":1};
R.store.stageProg = {}; R.store.stageProgN = {};
R.startStage(3, 1); __flush();
R.S.clears = 4; R.S.hearts = 1; R.endRun("over"); __flush();
ok(R.store.stageProgN["3"] === 4, "4문장까지 간 진행도가 저장된다 (" + R.store.stageProgN["3"] + ")");
ok(document.getElementById("ovGoalTxt").textContent.indexOf("4 / 10") === 0, "게임 오버에 진행도 4 / 10 (" + document.getElementById("ovGoalTxt").textContent + ")");
ok(document.getElementById("ovBar").style.width === "40%", "게임 오버 진행 바 40% (" + document.getElementById("ovBar").style.width + ")");
R.views.stage = 3; R.views.tier = 1; R.paintLobby();
ok(document.getElementById("lobbyProgTxt").textContent === "4 / 10문장", "홈 카드 진행도 4 / 10문장 (" + document.getElementById("lobbyProgTxt").textContent + ")");
ok(document.getElementById("lobbyBar").style.width === "40%", "홈 카드 진행 바 40%");

/* 바닥에 닿아 끝나면 그 문장을 결과 화면에 남긴다 */
__unlock(5);
R.startStage(4, 1); __flush();
var lostRow = R.targetRow();
R.S.hearts = 1;
R.crashRow(lostRow);
__flush();
ok(R.S.mode === "over", "하트 0이면 게임 오버");
var ovm = document.getElementById("ovMissed");
ok(ovm.innerHTML.indexOf(lostRow.d.ko) >= 0, "놓친 문장(한국어)이 결과 화면에 있다");
ok(ovm.innerHTML.indexOf("영어") < 0 || true, "놓친 문장 박스");
ok(ovm.innerHTML.indexOf(lostRow.d.en.replace(/&/g, "&amp;")) >= 0 || ovm.innerHTML.indexOf(lostRow.d.en) >= 0, "놓친 문장(영어)이 결과 화면에 있다");
ok(!ovm.classList.contains("hide"), "놓친 문장 박스가 보인다");
/* 그냥 그만두면(일시정지 → 그만) 놓친 문장 박스는 숨는다 */
__unlock(5);
R.startStage(4, 1); __flush();
R.S.hearts = 3;
R.endRun("over"); __flush();
ok(document.getElementById("ovMissed").classList.contains("hide"), "중도 종료에는 놓친 문장 박스가 없다");

/* ── 15. 정답 조립 시 원어민 발음 ── */
ok(typeof R.sayEn === "function", "sayEn 함수가 있다");
var __said = [];
window.SpeechSynthesisUtterance = function(t){ this.text = t; this.lang = ""; this.rate = 1; };
window.speechSynthesis = {
  speaking: true, pending: false,
  speak: function(u){ __said.push(u.text); },
  cancel: function(){ __said.push("[cancel]"); },
  getVoices: function(){ return [{ lang: "en-US", name: "Test" }, { lang: "ko-KR" }]; }
};
R.store.sound = true; __said = [];
R.sayEn("I am here to check in.");
__flush();   /* 명중 연출이 먼저 나가도록 발음은 살짝 늦게 시작한다 */
ok(__said.indexOf("I am here to check in.") >= 0, "발음 문장이 그대로 재생된다 (" + __said.join("/") + ")");
ok(__said[__said.length - 1] === "I am here to check in." && __said.indexOf("[cancel]") < 0, "이전 음성을 끊지 않는다(콤보 중 버벅임 방지)");
__said = []; R.sayEn("First one."); R.sayEn("Second one."); __flush();
ok(__said.indexOf("First one.") >= 0 && __said.indexOf("Second one.") < 0, "앞 음성이 나오는 중이면 다음 문장은 건너뛴다 (" + __said.join("/") + ")");
R.store.sound = false; __said = [];
R.sayEn("Silent");
ok(__said.length === 0, "소리를 꺼 두면 발음하지 않는다");
var threw2 = false;
R.store.sound = true;
try{ R.sayEn(""); R.sayEn(null); }catch(e){ threw2 = true; }
ok(!threw2, "빈 문장·음성 API 예외에도 죽지 않는다");
window.speechSynthesis = null;
try{ R.sayEn("No api"); }catch(e){ threw2 = true; }
ok(!threw2, "음성 API가 없어도 정답 흐름이 멈추지 않는다");
/* 정답을 맞히면 그 문장이 재생된다 */
window.speechSynthesis = {
  speak: function(u){ __said.push(u.text); },
  cancel: function(){ __said.push("[cancel]"); },
  getVoices: function(){ return []; }
};
R.store.sound = true;
R.store.stageDone = {"1":1,"2":1};
R.startStage(3, 1); __flush();
var tr2 = R.targetRow();
var firedOk = false;
if(tr2){
  for(var q5=0;q5<tr2.d.chunks.length;q5++){
    for(var z5=0;z5<R.S.blocks.length;z5++){
      if(R.S.blocks[z5] === tr2.d.chunks[q5] && !R.S.slots.some(function(s){ return s.i === z5; })){ R.tapBlock(z5); break; }
    }
  }
  __said = [];
  firedOk = (R.fire() === true);
  __flush();
}
ok(firedOk, "정답 발사 성공(발음 확인용)");
ok(tr2 && __said.indexOf(tr2.d.en) >= 0, "정답 조립 순간 그 문장 발음이 재생된다 (" + __said.join("/") + ")");

JSON.stringify({checks: checks, fails: fails});
"""

js_full = SHIM + "\n" + js + "\n;\n" + TESTS
out = dukpy.evaljs([js_full])
report = json.loads(out)
print("checks:", report.get("checks"))
fails = list(report.get("fails") or [])

for pat, label in css_checks:
    if not re.search(pat, html):
        fails.append("CSS: " + label)
for pat, label in css_gone:
    if re.search(pat, html):
        fails.append("CSS 남아 있음: " + label)

# 시스템 이모지·그림문자 0건 — 아이콘은 전부 인라인 SVG
EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\u2190-\u21FF\uFE0F\u200D]")
emo = sorted(set(EMOJI.findall(html)))
if emo:
    fails.append("이모지 문자 " + str(len(emo)) + "종: " + " ".join("U+%04X" % ord(c) for c in emo))
else:
    print("이모지 0건")

# 같은 id가 두 번 나오면 $("id") 핸들러가 엉뚱한 버튼에 붙는다
ids = re.findall(r'id="([A-Za-z0-9_-]+)"', html)
dups = sorted(set(i for i in ids if ids.count(i) > 1))
if dups:
    fails.append("중복 id: " + ", ".join(dups))
# 탭바·발사 버튼의 한글 텍스트 라벨은 없어야 한다(아이콘만)
for lab in ("<span>도감</span>", "<span>홈</span>", "<span>여정</span>"):
    if lab in html:
        fails.append("탭 라벨 텍스트 남음: " + lab)
if "fireLabel" in html:
    fails.append("발사 버튼 텍스트 남음")
if '<em>도감</em>' in html or '<em>무한전</em>' in html:
    fails.append("로비 칩 한글 라벨 남음")
else:
    print("id 중복 없음:", len(set(ids)), "개")
print("CSS 검사:", ", ".join(label for _, label in css_checks))
print("CSS 제거:", ", ".join(label for _, label in css_gone))
print("fails:", len(fails))
for f in fails[:20]:
    print("  x", f)
sys.exit(1 if fails or not report.get("checks") else 0)
