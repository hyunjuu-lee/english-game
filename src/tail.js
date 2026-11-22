
/* ══════════ 13. 꼬리 모드 — 영어를 보지 않고 꼬리를 떠올려 쳐 넣기 ══════════
   - 앞머리(영어)는 고정해서 보여주고, 한국어 꼬리만 보고 영어 꼬리를 타이핑한다(보기 없음)
   - 칸 가이드: 단어마다 글자 수만큼 빈칸 → 몇 단어·몇 글자인지만 알려준다
   - 힌트: 빈칸 단어를 누르면 그 단어 첫 글자가 보인다(힌트를 쓰면 반점, 상자는 오르지 않음)
   - 정확도: 한 판 10문제, 단어별로 맞음/틀림 표시. 틀리면 정답을 한 번 따라 쳐야 넘어간다
   - 간격 반복(상자 0~4): 힌트 없이 맞히면 +1, 틀리면 0. 낮은 상자가 더 자주 나온다
   - 앞머리 섞기: 3문제마다 앞머리가 바뀐다 */
var TAIL_HEADS = [
  { en:"I'm trying to",    ko:"~하려고 하는 중이야" },
  { en:"I'd like to",      ko:"~하고 싶어요" },
  { en:"Can I",            ko:"~해도 될까요?", q:true },
  { en:"I need to",        ko:"~해야 해" },
  { en:"Let me",           ko:"내가 ~할게" },
  { en:"I was about to",   ko:"막 ~하려던 참이었어" },
  { en:"I'm supposed to",  ko:"~하기로 되어 있어" },
  { en:"I just wanted to", ko:"그냥 ~하고 싶었어" }
];
/* 어느 앞머리에 붙여도 문법이 맞는 동사 덩어리 30개 */
var TAILS = [
  ["pay by card", "카드로 계산하기"],
  ["get a refund", "환불받기"],
  ["book a table", "자리 예약하기"],
  ["leave my bags here", "여기 짐 맡기기"],
  ["check in early", "일찍 체크인하기"],
  ["check out late", "늦게 체크아웃하기"],
  ["take a picture", "사진 찍기"],
  ["take a break", "잠깐 쉬기"],
  ["call a taxi", "택시 부르기"],
  ["change my room", "방 바꾸기"],
  ["change my booking", "예약 바꾸기"],
  ["sit by the window", "창가에 앉기"],
  ["order now", "지금 주문하기"],
  ["try this on", "이거 입어 보기"],
  ["split the bill", "나눠서 계산하기"],
  ["get some water", "물 좀 받기"],
  ["ask a question", "질문 하나 하기"],
  ["cancel my order", "주문 취소하기"],
  ["wait a minute", "잠깐 기다리기"],
  ["send the file", "파일 보내기"],
  ["check this", "이거 확인하기"],
  ["go home early", "일찍 집에 가기"],
  ["find the restroom", "화장실 찾기"],
  ["exchange money", "환전하기"],
  ["pick up the tickets", "표 찾기"],
  ["see the menu", "메뉴 보기"],
  ["turn down the music", "음악 줄이기"],
  ["get a receipt", "영수증 받기"],
  ["carry this bag", "이 가방 들기"],
  ["catch the last train", "막차 타기"]
];
var TL_N = 10;
var TL = { on:false, i:0, score:0, ok:0, hints:0, head:0, cur:-1, recent:[], wrongIds:{},
  hinted:{}, phase:"ask", usedHint:false };
function tailStore(){
  if(!store.tail || typeof store.tail !== "object") store.tail = {};
  return store.tail;
}
function tailBox(i){ var r = tailStore()[i]; return r ? (r.b || 0) : 0; }
function tailMastered(){ var i, c = 0; for(i=0;i<TAILS.length;i++) if(tailBox(i) >= 4) c++; return c; }
/* 다음 꼬리 — 낮은 상자일수록 자주, 이번 판에 나온 건 빼고 */
function tailPick(){
  var w = [5, 4, 3, 2, 1], tot = 0, i, arr = [], r;
  for(i=0;i<TAILS.length;i++){
    if(TL.recent.indexOf(i) >= 0) continue;
    var ww = w[Math.min(4, tailBox(i))];
    arr.push([i, ww]); tot += ww;
  }
  r = Math.random() * tot;
  for(i=0;i<arr.length;i++){ r -= arr[i][1]; if(r <= 0) return arr[i][0]; }
  return arr[arr.length - 1][0];
}
function tailWords(t){ return String(t).toLowerCase().replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean); }
/* 칸 그리기 — 정답 단어마다 글자 수만큼 칸, 입력한 글자를 채워 넣는다 */
function tailPaintSlots(mark){
  var ans = tailWords(TAILS[TL.cur][0]);
  var typed = String($("tInput").value || "").toLowerCase().replace(/^\s+/, "").split(/\s+/);
  var h = "", w, k, ch, cls;
  for(w=0;w<ans.length;w++){
    var tw = (typed[w] || "").replace(/[^a-z']/g, "");
    var wcls = "tWord";
    if(mark) wcls += (tw === ans[w]) ? " ok" : " bad";
    h += '<span class="' + wcls + '" data-w="' + w + '">';
    for(k=0;k<ans[w].length;k++){
      ch = tw[k] || "";
      cls = "tCell" + (ch ? " on" : "");
      if(!ch && k === 0 && TL.hinted[w]){ ch = ans[w][0]; cls += " hint"; }
      h += '<i class="' + cls + '">' + esc(ch) + '</i>';
    }
    if(tw.length > ans[w].length) h += '<i class="tCell over">+' + (tw.length - ans[w].length) + '</i>';
    h += '</span>';
  }
  $("tSlots").innerHTML = h;
}
function tailNextHead(){
  var n = TL.head;
  if(TAIL_HEADS.length > 1) while(n === TL.head) n = Math.floor(Math.random() * TAIL_HEADS.length);
  TL.head = n;
  var hd = TAIL_HEADS[n];
  $("tHeadEn").textContent = hd.en + " ~" + (hd.q ? "?" : "");
  $("tHeadKo").textContent = hd.ko;
}
function tailPaintHud(){
  $("tScore").textContent = Math.min(TL.i + 1, TL_N) + "/" + TL_N;
  $("tCombo").textContent = TL.score ? (TL.score + "점") : "";
  var bar = $("tTimeBar"); if(bar) bar.style.width = (TL.i / TL_N * 100).toFixed(1) + "%";
}
function tailQuestion(){
  if(!TL.on) return;
  if(TL.i % 3 === 0) tailNextHead();
  var ti = tailPick();
  TL.cur = ti; TL.recent.push(ti);
  TL.hinted = {}; TL.usedHint = false; TL.phase = "ask";
  var bx = tailBox(ti);
  $("tCueKo").textContent = TAILS[ti][1];
  $("tBox").textContent = bx >= 4 ? "익힘" : (bx === 0 ? "새 꼬리" : "상자 " + bx);
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
  var inp = $("tInput"), ans = TAILS[TL.cur][0], hd = TAIL_HEADS[TL.head];
  var ok = tailWords(inp.value).join(" ") === tailWords(ans).join(" ");
  if(TL.phase === "copy"){
    /* 틀린 문제는 정답을 한 번 따라 쳐야 넘어간다 */
    if(ok){ TL.i++; tailAfter(); }
    else { inp.className = "tInput shake"; setTimeout(function(){ inp.className = "tInput"; }, 400); try{ sfxBad(); }catch(e){} }
    return;
  }
  if(TL.phase === "done"){ TL.i++; tailAfter(); return; }
  if(!String(inp.value).trim()) return;
  var st = tailStore(), rec = st[TL.cur] || (st[TL.cur] = { b:0, ok:0, n:0 });
  rec.n++;
  tailPaintSlots(true);
  if(ok){
    var pts = TL.usedHint ? 5 : 10;
    TL.score += pts; TL.ok++;
    rec.ok++;
    if(!TL.usedHint) rec.b = Math.min(4, (rec.b || 0) + 1);
    $("tSent").innerHTML = '<b>' + esc(hd.en) + '</b> ' + esc(ans) + (hd.q ? "?" : ".") +
      ' <em>+' + pts + (TL.usedHint ? ' (힌트)' : '') + '</em>';
    try{ sfxPop(); }catch(e){}
    TL.phase = "done";
    $("tGo").textContent = "다음";
    $("tTip").textContent = TL.usedHint ? "다음엔 힌트 없이!" : "정답!";
    var at = TL.i;
    setTimeout(function(){ if(TL.on && TL.phase === "done" && TL.i === at){ TL.i++; tailAfter(); } }, 1000);
  } else {
    rec.b = 0;
    TL.wrongIds[TL.cur] = (TL.wrongIds[TL.cur] || 0) + 1;
    $("tSent").innerHTML = '정답: <b>' + esc(hd.en) + '</b> ' + esc(ans) + (hd.q ? "?" : ".");
    try{ sfxBad(); }catch(e){}
    TL.phase = "copy";
    $("tGo").textContent = "확인";
    $("tTip").textContent = "정답을 한 번 따라 쳐 보세요";
    inp.value = ""; inp.className = "tInput";
    TL.hinted = {};
    var keep = $("tSlots").innerHTML;
    setTimeout(function(){ if(TL.phase === "copy" && !$("tInput").value) tailPaintSlots(false); }, 900);
    $("tSlots").innerHTML = keep;
    try{ inp.focus(); }catch(e){}
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
  TL.on = true; TL.i = 0; TL.score = 0; TL.ok = 0; TL.hints = 0; TL.recent = []; TL.wrongIds = {}; TL.head = -1;
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
  $("tResLead").textContent = "익힌 꼬리 " + tailMastered() + " / " + TAILS.length;
  var b = $("tResBadge"); if(b && b.innerHTML === "") b.innerHTML = mascotSVG();
  var ws = [], k, wh = "";
  for(k in TL.wrongIds) if(TL.wrongIds.hasOwnProperty(k)) ws.push(+k);
  if(ws.length){
    wh = '<em>다시 볼 꼬리</em>';
    for(k=0;k<Math.min(5, ws.length);k++) wh += '<p><b>' + esc(TAILS[ws[k]][0]) + '</b><i>' + esc(TAILS[ws[k]][1]) + '</i></p>';
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
  if(s) s.textContent = "영어 안 보고 쳐 넣기 · 익힌 꼬리 " + tailMastered() + "/" + TAILS.length;
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
try{ paintTailEntry(); }catch(e){}
window.__tail = { open:openTail, submit:tailSubmit, end:tailEnd, close:closeTail, state:TL, TAILS:TAILS, HEADS:TAIL_HEADS, box:tailBox };
