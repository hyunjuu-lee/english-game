
/* ══════════ 13. 패턴 모드 — 영어를 보지 않고 패턴를 떠올려 쳐 넣기 ══════════
   - 앞머리(그 문장의 패턴 첫 조각)는 영어로 보여주고, 한국어 문장을 보고 나머지 패턴를 타이핑한다(보기 없음)
   - 칸 가이드: 단어마다 글자 수만큼 빈칸 → 몇 단어·몇 글자인지만 알려준다
   - 힌트: 빈칸 단어를 누르면 그 단어 첫 글자가 보인다(힌트를 쓰면 반점, 상자는 오르지 않음)
   - 정확도: 한 판 10문제, 단어별로 맞음/틀림 표시. 틀리면 정답을 한 번 따라 쳐야 넘어간다
   - 간격 반복(상자 0~4): 힌트 없이 맞히면 +1, 틀리면 0. 낮은 상자가 더 자주 나온다
   - 문제 범위: 본 게임에서 지금 하는 레벨까지의 패턴 문장(한국어 전체 문장이 단서) */
/* ── 본 게임 진도와 연결 ──
   지금 하는 레벨까지 나온 패턴의 문장에서 '앞머리(첫 조각) + 패턴(나머지)'를 뽑는다.
   예: Lv.21(패턴 18) → 패턴 1~18 의 180문장. 레벨이 오르면 패턴 문제도 늘어난다. */
function tailMaxPattern(){
  var n = Math.max(1, Math.min(STAGES_TOTAL, store.lastStage || 1)), k, mp = 1, m;
  for(k=1;k<=n;k++){ m = stageMeta(k); if(m.kind === "pat") mp = Math.max(mp, m.p); else if(m.to) mp = Math.max(mp, m.to); }
  /* 지금 레벨의 패턴까지(무한 모드면 전부) */
  m = stageMeta(n);
  if(m.kind === "inf" || m.kind === "final") mp = PATTERNS.length - 1;
  return mp;
}
function tailPool(){
  var mp = tailMaxPattern(), out = [], i, d, head, rest;
  for(i=0;i<DATA.length;i++){
    d = DATA[i];
    if(d.p > mp || !d.chunks || d.chunks.length < 2) continue;
    head = d.chunks[0];
    rest = d.chunks.slice(1).join(" ").replace(/[.?!]+\s*$/, "");
    if(!rest) continue;
    out.push({ id:"s" + d.id, head:head, tail:rest, ko:d.ko, en:d.en, p:d.p });
  }
  return out;
}
var TL_N = 10;
var TL = { on:false, i:0, score:0, ok:0, hints:0, cur:null, pool:[], recent:[], wrongIds:{},
  hinted:{}, phase:"ask", usedHint:false, retry:[], retried:{} };
function tailStore(){
  if(!store.tail || typeof store.tail !== "object") store.tail = {};
  return store.tail;
}
function tailBox(i){ var r = tailStore()[i]; return r ? (r.b || 0) : 0; }
/* 익힘 = 서로 다른 판에서 힌트 없이 3번 맞힌 패턴(상자 3 이상). 연습 중 = 1~2번 맞힌 패턴 */
var TAIL_MASTER = 3;
function tailMastered(pool){ var i, c = 0; pool = pool || tailPool(); for(i=0;i<pool.length;i++) if(tailBox(pool[i].id) >= TAIL_MASTER) c++; return c; }
function tailLearning(pool){ var i, c = 0, b; pool = pool || tailPool(); for(i=0;i<pool.length;i++){ b = tailBox(pool[i].id); if(b >= 1 && b < TAIL_MASTER) c++; } return c; }
/* 다음 패턴 — 낮은 상자일수록 자주, 이번 판에 나온 건 빼고 */
function tailPick(){
  var w = [5, 4, 3, 2, 1], tot = 0, i, arr = [], r, P = TL.pool;
  for(i=0;i<P.length;i++){
    if(TL.recent.indexOf(P[i].id) >= 0) continue;
    var ww = w[Math.min(4, tailBox(P[i].id))];
    arr.push([P[i], ww]); tot += ww;
  }
  if(!arr.length) return P[Math.floor(Math.random() * P.length)];
  r = Math.random() * tot;
  for(i=0;i<arr.length;i++){ r -= arr[i][1]; if(r <= 0) return arr[i][0]; }
  return arr[arr.length - 1][0];
}
function tailWords(t){ return String(t).replace(/[\u2018\u2019\u02bc]/g, "'").toLowerCase().replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean); }
/* 칸 그리기 — 정답 단어마다 글자 수만큼 칸, 입력한 글자를 채워 넣는다 */
function tailPaintSlots(mark){
  var ans = tailWords(TL.cur.tail);
  var typed = String($("tInput").value || "").replace(/[\u2018\u2019\u02bc]/g, "'").toLowerCase().replace(/^\s+/, "").split(/\s+/);
  var h = "", w, k, ch, cls;
  for(w=0;w<ans.length;w++){
    var tw = (typed[w] || "").replace(/[^a-z']/g, "");
    var wcls = "tWord";
    if(mark) wcls += (tw === ans[w]) ? " ok" : " bad";
    h += '<span class="' + wcls + '" data-w="' + w + '">';
    for(k=0;k<ans[w].length;k++){
      ch = tw[k] || "";
      cls = "tCell" + (ch ? " on" : "");
      /* 채점 후 틀린 단어는 칸에 정답 글자를 채워 보여 준다 */
      if(mark && tw !== ans[w]){ ch = ans[w][k]; cls = "tCell on fix" + (tw[k] === ans[w][k] ? " same" : ""); }
      if(!ch && k === 0 && TL.hinted[w]){ ch = ans[w][0]; cls += " hint"; }
      h += '<i class="' + cls + '">' + esc(ch) + '</i>';
    }
    if(!(mark && tw !== ans[w]) && tw.length > ans[w].length) h += '<i class="tCell over">+' + (tw.length - ans[w].length) + '</i>';
    h += '</span>';
  }
  var sl = $("tSlots");
  sl.innerHTML = h;
  /* 빈칸이 항상 한 줄에 들어가게 칸 너비를 글자 수에 맞춰 줄인다 */
  var letters = 0, i2;
  for(i2=0;i2<ans.length;i2++) letters += ans[i2].length;
  var avail = Math.max(200, ($("viewTail").clientWidth || 360) - 48);
  var cw = Math.floor((avail - ans.length * 14 - letters * 3) / Math.max(1, letters));
  /* 너무 작아지면(긴 문장) 두 줄로 나누고 칸은 읽기 좋은 크기로 */
  var wrap = cw < 15;
  cw = wrap ? Math.max(15, Math.min(20, Math.floor((avail * 2 - ans.length * 14 - letters * 3) / Math.max(1, letters)))) : Math.min(24, cw);
  sl.style.flexWrap = wrap ? "wrap" : "nowrap";
  sl.style.rowGap = wrap ? "6px" : "0";
  sl.style.setProperty("--cw", cw + "px");
  sl.style.setProperty("--cf", Math.max(13, Math.min(19, Math.round(cw * 0.8))) + "px");
}
function tailPaintHud(){
  $("tScore").textContent = Math.min(TL.i + 1, TL_N) + "/" + TL_N;
  $("tCombo").textContent = TL.score ? (TL.score + "점") : "";
  var bar = $("tTimeBar"); if(bar) bar.style.width = (TL.i / TL_N * 100).toFixed(1) + "%";
}
function tailQuestion(){
  if(!TL.on) return;
  var q = null, k, again = false;
  for(k=0;k<TL.retry.length;k++) if(TL.retry[k].at <= TL.i){ q = TL.retry.splice(k,1)[0].q; again = true; break; }
  if(!q) q = tailPick();
  TL.cur = q; TL.recent.push(q.id);
  try{ if(window.__voicePre) window.__voicePre(q.en); }catch(e){}
  TL.hinted = {}; TL.usedHint = false; TL.phase = "ask";
  $("tHeadEn").textContent = q.head + " ~";
  $("tHeadKo").textContent = PAT_KO[q.p] || "";
  var bx = tailBox(q.id);
  $("tCueKo").textContent = q.ko;
  $("tBox").textContent = again ? "다시 한 번" : (bx >= TAIL_MASTER ? "마스터 패턴" : (bx === 0 ? "새 패턴" : bx + "번 맞힌 패턴"));
  $("tBox").className = "tBox b" + bx;
  $("tSent").innerHTML = "";
  $("tTip").textContent = "빈칸을 누르면 첫 글자 힌트";
  $("tGo").textContent = "확인";
  var inp = $("tInput"); inp.value = ""; inp.className = "tInput";
  tailPaintSlots(false);
  tailPaintHud();
  try{ inp.focus(); }catch(e){}
}
function tailSubmit(){
  if(!TL.on) return;
  var inp = $("tInput"), q = TL.cur, ans = q.tail;
  var ok = tailWords(inp.value).join(" ") === tailWords(ans).join(" ");
  var noArt = function(s){ return tailWords(s).filter(function(w){ return w !== "a" && w !== "an" && w !== "the"; }).join(" "); };
  var almost = !ok && noArt(inp.value) === noArt(ans);
  if(TL.phase === "done"){ TL.i++; tailAfter(); return; }
  if(!String(inp.value).trim()) return;
  var st = tailStore(), rec = st[q.id] || (st[q.id] = { b:0, ok:0, n:0 });
  rec.n++;
  tailPaintSlots(true);
  try{ if(store.voice !== false) sayEn(q.en); }catch(e){}   /* 채점하면서 원어민 발음으로 문장 전체를 들려준다 */
  var full = '<b>' + esc(q.head) + '</b> ' + esc(q.en.slice(q.head.length).replace(/^\s+/, ""));
  if(ok || almost){
    var pts = almost ? 5 : (TL.usedHint ? 5 : 10);
    TL.score += pts; TL.ok++;
    rec.ok++;
    if(ok && !TL.usedHint) rec.b = Math.min(4, (rec.b || 0) + 1);
    $("tSent").innerHTML = full + ' <em>+' + pts + (almost ? ' (a/the 확인)' : (TL.usedHint ? ' (힌트)' : '')) + '</em>';
    try{ sfxPop(); }catch(e){}
    TL.phase = "done";
    $("tGo").textContent = "다음";
    $("tTip").textContent = almost ? "거의 정답! a / the 만 달라요" : (TL.usedHint ? "다음엔 힌트 없이!" : "정답!");
    var at = TL.i;
    setTimeout(function(){ if(TL.on && TL.phase === "done" && TL.i === at){ TL.i++; tailAfter(); } }, 1100);
  } else {
    rec.b = 0;
    TL.wrongIds[q.id] = q;
    $("tSent").innerHTML = '정답: ' + full;
    try{ sfxBad(); }catch(e){}
    /* 틀리면 정답만 보여 주고, 같은 문장을 3문제 뒤에 한 번 더 낸다 */
    var back = TL.i + 3;
    if(back < TL_N && !TL.retried[q.id]){ TL.retried[q.id] = 1; TL.retry.push({ q:q, at:back }); }
    TL.phase = "done";
    $("tGo").textContent = "다음";
    $("tTip").textContent = back < TL_N ? "이 문장은 조금 뒤에 다시 나와요" : "정답을 한 번 읽고 넘어가요";
    inp.className = "tInput bad";
  }
  save();
}
function tailAfter(){
  if(TL.i >= TL_N){ tailEnd(); return; }
  tailQuestion();
}
function openTail(){
  hideSheets(); hide($("sheetTail"));
  tailStore();
  V.cur = "tail";
  hide(elViewLobby); hide(elViewJourney); hide(elViewGame); hide(elBook); hide(elTabbar);
  show($("viewTail"));
  var q = $("btnTailQuit"); if(q && q.innerHTML === "") q.innerHTML = ICON.close;
  TL.on = true; TL.i = 0; TL.score = 0; TL.ok = 0; TL.hints = 0; TL.recent = []; TL.wrongIds = {}; TL.retry = []; TL.retried = {};
  TL.pool = tailPool();
  tailQuestion();
}
function tailEnd(){
  TL.on = false;
  var acc = Math.round(TL.ok / TL_N * 100);
  if(!store.tailBest || TL.score > store.tailBest) store.tailBest = TL.score;
  save();
  try{ $("tInput").blur(); }catch(e){}
  $("tResScore").textContent = TL.score + "점";
  $("tResOk").textContent = acc + "%";
  $("tResSpeed").textContent = TL.hints + "번";
  $("tResTitle").textContent = acc === 100 ? "전부 정답!" : "10문제 끝!";
  $("tResLead").textContent = "마스터 " + tailMastered(TL.pool) + " · 연습 중 " + tailLearning(TL.pool) + " / " + TL.pool.length;
  var b = $("tResBadge"); if(b && b.innerHTML === "") b.innerHTML = mascotSVG();
  var ws = [], k, wh = "";
  for(k in TL.wrongIds) if(TL.wrongIds.hasOwnProperty(k)) ws.push(TL.wrongIds[k]);
  if(ws.length){
    wh = '<em>다시 볼 패턴</em>';
    for(k=0;k<Math.min(5, ws.length);k++) wh += '<p><b>' + esc(ws[k].en) + '</b><i>' + esc(ws[k].ko) + '</i></p>';
  }
  $("tResWeak").innerHTML = wh;
  $("tResWeak").className = "tWeak" + (wh ? "" : " hide");
  show($("sheetTail"));
}
function closeTail(){
  TL.on = false;
  try{ $("tInput").blur(); }catch(e){}
  hide($("viewTail")); hide($("sheetTail"));
  save();
  goLobby();
}
function paintTailEntry(){
  var s = $("teSub");
  var pool = tailPool();
  if(s) s.textContent = "마스터 " + tailMastered(pool) + " · 연습 중 " + tailLearning(pool) + " / " + pool.length;
  var ic = $("teIco"); if(ic && ic.innerHTML === "") ic.innerHTML = ICON.bolt;
  var g = $("teGo"); if(g && g.innerHTML === "") g.innerHTML = IC_RIGHT;
}
on($("btnTail"), "click", function(){ unlockAudio(); openTail(); });
on($("btnTailQuit"), "click", function(){ closeTail(); });
on($("btnTailAgain"), "click", function(){ openTail(); });
on($("btnTailHome"), "click", function(){ closeTail(); });
on($("tGo"), "click", function(){ tailSubmit(); });
on($("tInput"), "input", function(){ if(TL.phase !== "done") tailPaintSlots(false); });
on($("tInput"), "keydown", function(e){ if(e.key === "Enter"){ if(e.preventDefault) e.preventDefault(); tailSubmit(); } });
/* 빈칸 단어를 누르면 그 단어 첫 글자 힌트 */
on($("tSlots"), "click", function(e){
  var el = e.target;
  while(el && el !== this && !(el.getAttribute && el.getAttribute("data-w"))) el = el.parentNode;
  if(!el || el === this || TL.phase !== "ask") return;
  var w = +el.getAttribute("data-w");
  if(!TL.hinted[w]){ TL.hinted[w] = true; TL.usedHint = true; TL.hints++; }
  tailPaintSlots(false);
  try{ $("tInput").focus(); }catch(e2){}
});
(function(){
  var vv = window.visualViewport, el = $("viewTail");
  if(!vv || !el) return;
  function fit(){
    if(V.cur !== "tail"){ el.style.top = ""; el.style.height = ""; return; }
    el.style.top = Math.round(vv.offsetTop) + "px";
    el.style.height = Math.round(vv.height) + "px";
    try{ if(window.scrollY) window.scrollTo(0, 0); }catch(e){}
  }
  vv.addEventListener("resize", fit);
  vv.addEventListener("scroll", fit);
  on($("tInput"), "focus", function(){ setTimeout(fit, 50); setTimeout(fit, 300); });
  window.__tailFit = fit;
})();
try{ paintTailEntry(); }catch(e){}
window.__tail = { open:openTail, submit:tailSubmit, end:tailEnd, close:closeTail, state:TL, pool:tailPool, maxP:tailMaxPattern, box:tailBox };
