/* ══════════ 패턴 도전 — 지도에서 패턴 1부터 차례로 깨는 패턴 스테이지 ══════════
   · 패턴 하나 = 도전 하나: 그 패턴 문장 전부를 한 번씩(섞어서), 다시 내기 없음
   · 정확도 70% 이상이면 클리어 · 별: 70% 1개 · 80% 2개 · 90% 3개 (store.tailCh[p] 에 최고 별)
   · 열림: 패턴 1은 처음부터, 그다음은 앞 도전을 깨고 + 본 게임에서 그 패턴 레벨이 열려 있을 때
   · 지도: 패턴 레벨 노드 옆에 패턴 칩(번개 + 별 / 자물쇠) */
function tailChStore(){ if(!store.tailCh || typeof store.tailCh !== "object") store.tailCh = {}; return store.tailCh; }
function tailChStars(p){ return +(tailChStore()[String(p)] || 0); }
function patStage(p){ for(var i=0;i<STAGES.length;i++) if(STAGES[i].kind === "pat" && STAGES[i].p === p) return STAGES[i].n; return 0; }
function tailChOpen(p){
  if(p <= 0) return false;
  var n = patStage(p);
  if(n && stageLocked(n)) return false;
  return p === 1 || tailChStars(p - 1) >= 1;
}
function tailChPool(p){
  var out = [], i, d, rest;
  for(i=0;i<DATA.length;i++){
    d = DATA[i];
    if(d.p !== p || !d.chunks || d.chunks.length < 2) continue;
    rest = d.chunks.slice(1).join(" ").replace(/[.?!]+\s*$/, "");
    if(!rest) continue;
    out.push({ id:"s" + d.id, head:d.chunks[0], tail:rest, ko:d.ko, en:d.en, p:d.p });
  }
  return out;
}
var TCH = { p:0, seq:[], k:0 };
function openTailCh(p){
  var pool = tailChPool(p);
  if(!pool.length) return;
  TCH.p = p; TCH.k = 0; TCH.seq = shuffled(pool.slice(), Math.random);
  TL_N = pool.length;
  openTail();
  TL.pool = pool;
  var h = $("tBox"); if(h) h.textContent = "패턴 도전 " + p;
}
/* 홈의 패턴 훈련(섞어서 10문제)으로 열 때는 도전 모드를 끈다 */
document.addEventListener("click", function(e){
  var el = e.target; while(el && el !== document && el.id !== "btnTail") el = el.parentNode;
  if(el && el.id === "btnTail"){ TCH.p = 0; TL_N = 10; }
}, true);
var _tailPickCh = tailPick;
tailPick = function(){
  if(TCH.p){ var q = TCH.seq[TCH.k % TCH.seq.length]; TCH.k++; return q; }
  return _tailPickCh.apply(this, arguments);
};
var _tailQuestionCh = tailQuestion;
tailQuestion = function(){
  var r = _tailQuestionCh.apply(this, arguments);
  if(TCH.p){ var b = $("tBox"); if(b) b.textContent = "패턴 도전 " + TCH.p + " · " + Math.min(TL.i + 1, TL_N) + "/" + TL_N; }
  return r;
};
var _tailSubmitCh = tailSubmit;
tailSubmit = function(){
  var r = _tailSubmitCh.apply(this, arguments);
  if(TCH.p && TL.retry && TL.retry.length){       /* 도전에서는 다시 내기 없이 한 번씩만 */
    TL.retry = [];
    var tip = $("tTip"); if(tip && TL.phase === "done") tip.textContent = "정답을 한 번 읽고 넘어가요";
  }
  return r;
};
var _tailEndCh = tailEnd;
tailEnd = function(){
  var p = TCH.p;
  var r = _tailEndCh.apply(this, arguments);
  var again = $("btnTailAgain"), home = $("btnTailHome");
  if(!p){
    if(again) again.textContent = "한 판 더";
    if(home) home.textContent = "홈";
    return r;
  }
  var acc = TL.ok / TL_N, stars = acc >= 0.9 ? 3 : (acc >= 0.8 ? 2 : (acc >= 0.7 ? 1 : 0));
  var prev = tailChStars(p);
  if(stars > prev){ tailChStore()[String(p)] = stars; save(); }
  var t = $("tResTitle"), ld = $("tResLead");
  if(t) t.textContent = stars ? ("패턴 도전 " + p + " 클리어!") : ("패턴 도전 " + p + " 실패");
  var pk = (typeof PAT_KO !== "undefined" && PAT_KO[p]) ? PAT_KO[p] : "";
  var head = TCH.seq[0] ? TCH.seq[0].head : "";
  if(ld) ld.textContent = (head ? head + " ~ · " : "") + String(pk).replace(/^~\s*/, "") + "\n" + (stars ? ("정답 " + TL.ok + " / " + TL_N + (prev && stars <= prev ? " · 최고 기록 별 " + prev + "개" : "")) : ("70% 이상 맞히면 클리어 · 이번 " + TL.ok + " / " + TL_N));
  var next = p + 1, hasNext = tailChPool(next).length > 0 && tailChOpen(next);
  TCH.after = stars && hasNext ? next : p;
  if(again) again.textContent = stars ? (hasNext ? "다음 패턴 도전 " + next : "한 번 더") : "다시 도전";
  if(home) home.textContent = "지도";
  var nr = document.getElementById("tResNew"); if(nr) nr.style.display = "none";   /* 최고 점수 비교는 섞어 풀기용 — 도전에서는 별로 본다 */
  return r;
};
/* 결과의 두 버튼 — 도전 모드일 때만 가로챈다(시트에서 먼저 잡아 원래 동작을 막는다) */
$("sheetTail").addEventListener("click", function(e){
  if(!TCH.p) return;
  var el = e.target; while(el && el !== this && !el.id) el = el.parentNode;
  if(!el || (el.id !== "btnTailAgain" && el.id !== "btnTailHome")) return;
  e.stopPropagation(); if(e.preventDefault) e.preventDefault();
  if(el.id === "btnTailAgain"){ var p = TCH.after || TCH.p; hide($("sheetTail")); openTailCh(p); return; }
  TCH.p = 0; TL_N = 10; TL.on = false;
  try{ bgmStop(); }catch(e2){}
  hide($("viewTail")); hide($("sheetTail"));
  openJourney();
}, true);
var _closeTailCh = closeTail;
closeTail = function(){
  var wasCh = TCH.p;
  TCH.p = 0; TL_N = 10;
  if(wasCh){ TL.on = false; try{ bgmStop(); }catch(e){} hide($("viewTail")); hide($("sheetTail")); save(); openJourney(); return; }
  return _closeTailCh.apply(this, arguments);
};

/* ── 지도: 패턴 레벨 옆 패턴 칩 ── */
var IC_BOLT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>';
function paintTailChips(){
  if(!elJNodes) return;
  var old = elJNodes.querySelectorAll(".jTailCh"), i;
  for(i=0;i<old.length;i++) old[i].parentNode.removeChild(old[i]);
  var nodes = elJNodes.querySelectorAll(".jNode.kind-pat"), W = elJNodes.clientWidth || 360, h = "";
  for(i=0;i<nodes.length;i++){
    var nd = nodes[i], n = +nd.getAttribute("data-stg"), m = stageMeta(n);
    if(!m || m.kind !== "pat" || !tailChPool(m.p).length) continue;
    var x = parseFloat(nd.style.left) || 0, y = parseFloat(nd.style.top) || 0;
    var side = x < W / 2 ? 1 : -1;
    var st = tailChStars(m.p), open = tailChOpen(m.p), cls = "jTailCh" + (st ? " done" : (open ? " open" : " lock")), inner = "", k;
    if(st){ inner = '<span class="tcI">' + IC_BOLT + '</span><span class="tcS">'; for(k=0;k<3;k++) inner += '<i class="' + (k < st ? "on" : "") + '"></i>'; inner += '</span>'; }
    else if(open) inner = '<span class="tcI">' + IC_BOLT + '</span><span class="tcT">패턴</span>';
    else inner = '<span class="tcL">' + lockSVG() + '</span>';
    h += '<button class="' + cls + '" data-tailch="' + m.p + '" aria-label="패턴 도전 ' + m.p + (st ? " 별 " + st + "개" : (open ? "" : " 잠김")) + '" style="left:' + (x + side * 62).toFixed(1) + 'px;top:' + (y - 6).toFixed(1) + 'px">' + inner + '</button>';
  }
  elJNodes.insertAdjacentHTML("beforeend", h);
}
var _buildJourneyCh = buildJourney;
buildJourney = function(){ var r = _buildJourneyCh.apply(this, arguments); try{ paintTailChips(); }catch(e){} return r; };
var _openJourneyCh = openJourney;
openJourney = function(){ var r = _openJourneyCh.apply(this, arguments); try{ paintTailChips(); }catch(e){} return r; };
elJNodes.addEventListener("click", function(e){
  var el = e.target;
  while(el && el !== elJNodes && !(el.getAttribute && el.getAttribute("data-tailch"))) el = el.parentNode;
  if(!el || el === elJNodes) return;
  if(e.stopPropagation) e.stopPropagation();
  var p = +el.getAttribute("data-tailch");
  if(!tailChOpen(p)){
    try{ toast(p > 1 && tailChStars(p - 1) < 1 ? ("패턴 도전 " + (p - 1) + "을 먼저 깨요") : "본 게임에서 이 레벨을 먼저 열어요"); }catch(e2){}
    return;
  }
  try{ unlockAudio(); }catch(e3){}
  openTailCh(p);
}, true);
window.__tailCh = { open:openTailCh, stars:tailChStars, isOpen:tailChOpen, pool:tailChPool };

/* ══════════ 패턴별 익힘 표시 — 힌트 없이 3번 맞히면 익힘 ══════════
   문제 화면: 체크 3칸 + "익힘까지 N번" / 맞히면 새 칸이 톡 채워지고, 3칸이 다 차면 "익힘!"
   문장 탭: 문장마다 체크 3칸, 패턴 제목 옆에 "패턴 익힘 x/10" */
function tailMarksHTML(b, pop){
  var h = '<span class="tMk">', k;
  for(k=0;k<TAIL_MASTER;k++) h += '<i class="' + (k < b ? "on" : "") + (pop && k === b - 1 ? " pop" : "") + '">' + (k < b ? IC_CK : "") + '</i>';
  return h + '</span>';
}
function paintTailMarks(pop){
  var q = TL.cur; if(!q) return;
  var el = $("tMarks");
  if(!el){
    var cue = $("tCueKo"); if(!cue || !cue.parentNode) return;
    el = document.createElement("div"); el.id = "tMarks"; el.className = "tMarks";
    cue.parentNode.insertBefore(el, cue);
  }
  var b = Math.min(TAIL_MASTER, tailBox(q.id)), left = TAIL_MASTER - b;
  el.className = "tMarks" + (left ? "" : " done");
  el.innerHTML = tailMarksHTML(b, pop) + '<em>' + (left ? ("마스터까지 " + left + "번") : "마스터 패턴") + '</em>';
}
var _tailQuestionMk = tailQuestion;
tailQuestion = function(){ var r = _tailQuestionMk.apply(this, arguments); paintTailMarks(false); return r; };
var _tailSubmitMk = tailSubmit;
tailSubmit = function(){
  var q = TL.cur, b0 = q ? tailBox(q.id) : 0, was = TL.phase;
  var r = _tailSubmitMk.apply(this, arguments);
  if(was !== "done" && q && TL.phase === "done"){
    var b1 = tailBox(q.id);
    paintTailMarks(b1 > b0);
  }
  return r;
};
/* 도전 결과에 이 패턴 익힘 수 */
var _tailEndMk = tailEnd;
tailEnd = function(){
  var p = TCH.p;
  var r = _tailEndMk.apply(this, arguments);
  if(p){
    var pool = tailChPool(p), ld = $("tResLead");
    if(ld) ld.textContent += "\n이 표현 마스터 " + tailMastered(pool) + " / " + pool.length;
  }
  return r;
};
/* 문장 탭 */
var _buildBookMk = buildBook;
buildBook = function(){
  var r = _buildBookMk.apply(this, arguments);
  try{
    var rows = elBookBody.querySelectorAll(".brow"), i, d, tx;
    for(i=0;i<rows.length && i<DATA.length;i++){
      d = DATA[i];
      if(!d.chunks || d.chunks.length < 2) continue;
      tx = rows[i].querySelector(".txt");
      if(tx) tx.insertAdjacentHTML("beforeend", '<span class="bTail">' + tailMarksHTML(Math.min(TAIL_MASTER, tailBox("s" + d.id)), false) + '</span>');
    }
    var hs = elBookBody.querySelectorAll(".pgroup h3 em"), seen = {}, ps = [];
    for(i=0;i<DATA.length;i++) if(!seen[DATA[i].p]){ seen[DATA[i].p] = 1; ps.push(DATA[i].p); }
    for(i=0;i<hs.length && i<ps.length;i++){
      var pool = tailChPool(ps[i]);
      if(pool.length) hs[i].insertAdjacentHTML("afterend", '<em class="bTailCnt">마스터 ' + tailMastered(pool) + '/' + pool.length + '</em>');
    }
  }catch(e){}
  return r;
};
