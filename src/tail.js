
/* ══════════ 13. 꼬리 모드 — 앞머리 + 꼬리를 한 번에 ══════════
   목표: 앞머리 뒤에 붙는 동사 덩어리(꼬리)를 1초 안에 떠올리게 만든다.
   - 60초 속도전 · 한 번 탭으로 답(보기 4개) · 빨리 맞히면 보너스, 틀리면 -3초
   - 인출 먼저: 익숙해진 꼬리(상자 2+)는 보기가 0.6초 늦게 나온다 → 먼저 머릿속으로 떠올린다
   - 헷갈리는 짝: 같은 동사로 시작하는 꼬리를 보기로 함께 낸다(take a picture / take a break)
   - 간격 반복(라이트너 상자 0~4): 1.5초 안에 맞히면 한 칸 위, 틀리면 0. 낮은 상자가 더 자주 나온다
   - 앞머리 섞기: 6문제마다 앞머리가 바뀌어 같은 꼬리를 여러 앞머리에 붙여 본다 */
var TAIL_HEADS = [
  { en:"I'm trying to",   ko:"~하려고 하는 중이야" },
  { en:"I'd like to",     ko:"~하고 싶어요" },
  { en:"Can I",           ko:"~해도 될까요?", q:true },
  { en:"I need to",       ko:"~해야 해" },
  { en:"Let me",          ko:"내가 ~할게" },
  { en:"I was about to",  ko:"막 ~하려던 참이었어" },
  { en:"I'm supposed to", ko:"~하기로 되어 있어" },
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
var TL = { on:false, t:0, left:60, score:0, combo:0, best:0, ok:0, n:0, times:[], head:0, headLeft:0,
  cur:-1, recent:[], opts:[], shownAt:0, lock:false, timer:0, delayT:0, wrongIds:{}, raf:0, last:0 };
var TL_SEC = 60;
function tailStore(){
  if(!store.tail || typeof store.tail !== "object") store.tail = {};
  return store.tail;
}
function tailBox(i){ var r = tailStore()[i]; return r ? (r.b || 0) : 0; }
function tailMastered(){ var i, c = 0; for(i=0;i<TAILS.length;i++) if(tailBox(i) >= 4) c++; return c; }
/* 다음 꼬리 — 낮은 상자일수록 자주, 최근 3개는 빼고 */
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
/* 보기 — 같은 동사로 시작하는 꼬리를 우선 섞는다 */
function tailOptions(ans){
  var head = TAILS[ans][0].split(" ")[0], same = [], other = [], i, out = [ans];
  for(i=0;i<TAILS.length;i++){
    if(i === ans) continue;
    if(TAILS[i][0].split(" ")[0] === head) same.push(i); else other.push(i);
  }
  same.sort(function(){ return Math.random() - .5; });
  other.sort(function(){ return Math.random() - .5; });
  for(i=0;i<same.length && out.length < 3;i++) out.push(same[i]);
  for(i=0;i<other.length && out.length < 4;i++) out.push(other[i]);
  return out.sort(function(){ return Math.random() - .5; });
}
function tailSentence(hi, ti){
  var h = TAIL_HEADS[hi];
  return h.en + " " + TAILS[ti][0] + (h.q ? "?" : ".");
}
function tailPaintHud(){
  $("tScore").textContent = TL.score.toLocaleString();
  $("tCombo").textContent = TL.combo >= 2 ? (TL.combo + "콤보") : "";
  var bar = $("tTimeBar");
  if(bar){
    bar.style.width = Math.max(0, TL.left / TL_SEC * 100).toFixed(1) + "%";
    bar.className = TL.left <= 10 ? "low" : "";
  }
}
function tailNextHead(){
  var n = TL.head;
  if(TAIL_HEADS.length > 1) while(n === TL.head) n = Math.floor(Math.random() * TAIL_HEADS.length);
  TL.head = n; TL.headLeft = 6;
  var h = TAIL_HEADS[n];
  $("tHeadEn").textContent = h.en + " ~" + (h.q ? "?" : "");
  $("tHeadKo").textContent = h.ko;
  var hd = $("tHead");
  if(hd && hd.animate) try{ hd.animate([{transform:"scale(.94)", opacity:.4},{transform:"scale(1)", opacity:1}], {duration:260, easing:"cubic-bezier(.2,.9,.3,1)"}); }catch(e){}
}
function tailQuestion(){
  if(!TL.on) return;
  if(TL.headLeft <= 0) tailNextHead();
  TL.headLeft--;
  var ti = tailPick();
  TL.cur = ti;
  TL.recent.push(ti); if(TL.recent.length > 3) TL.recent.shift();
  TL.opts = tailOptions(ti);
  var bx = tailBox(ti);
  $("tCueKo").textContent = TAILS[ti][1];
  $("tBox").textContent = bx >= 4 ? "익힘" : (bx >= 2 ? "떠올려 보세요" : (bx === 0 ? "새 꼬리" : ""));
  $("tBox").className = "tBox b" + bx;
  $("tSent").textContent = "";
  var box = $("tOpts"), h = "", i;
  for(i=0;i<TL.opts.length;i++) h += '<button class="tOpt" data-t="' + TL.opts[i] + '">' + esc(TAILS[TL.opts[i]][0]) + '</button>';
  box.innerHTML = h;
  /* 인출 먼저 — 익숙한 꼬리는 보기를 늦게 보여준다 */
  var wait = bx >= 2 ? 600 : 0;
  box.className = "tOpts" + (wait ? " wait" : "");
  TL.lock = !!wait;
  clearTimeout(TL.delayT);
  TL.delayT = setTimeout(function(){
    box.className = "tOpts";
    TL.lock = false;
    TL.shownAt = Date.now() - (wait ? 600 : 0);   /* 떠올리는 시간도 속도에 포함 */
  }, wait);
  if(!wait) TL.shownAt = Date.now();
}
function tailAnswer(ti, btn){
  if(!TL.on || TL.lock) return;
  var ans = TL.cur, dt = (Date.now() - TL.shownAt) / 1000, st = tailStore();
  var rec = st[ans] || (st[ans] = { b:0, ok:0, n:0 });
  rec.n++; TL.n++;
  if(ti === ans){
    TL.ok++; TL.combo++; if(TL.combo > TL.best) TL.best = TL.combo;
    TL.times.push(dt);
    var fast = dt <= 1.5;
    rec.ok++;
    if(fast) rec.b = Math.min(4, (rec.b || 0) + 1);
    var mult = TL.combo >= 10 ? 3 : (TL.combo >= 5 ? 2 : 1);
    var pts = (100 + (fast ? Math.round((1.5 - dt) * 100) + 50 : 0)) * mult;
    TL.score += pts;
    if(btn) btn.classList.add("ok");
    $("tSent").innerHTML = '<b>' + esc(TAIL_HEADS[TL.head].en) + '</b> ' + esc(TAILS[ans][0]) + (TAIL_HEADS[TL.head].q ? "?" : ".") +
      (fast ? ' <em>빠름! +' + pts + '</em>' : ' <span>+' + pts + '</span>');
    try{ sfxTap(Math.min(4, TL.combo)); }catch(e){}
    if(TL.combo % 5 === 0){ try{ sfxCombo(); }catch(e){} }
    TL.lock = true;
    setTimeout(function(){ TL.lock = false; tailQuestion(); }, 260);
  } else {
    TL.combo = 0;
    rec.b = 0;
    TL.wrongIds[ans] = (TL.wrongIds[ans] || 0) + 1;
    TL.left = Math.max(0, TL.left - 3);
    if(btn) btn.classList.add("bad");
    var kids = $("tOpts").children, k;
    for(k=0;k<kids.length;k++) if(+kids[k].getAttribute("data-t") === ans) kids[k].classList.add("ok");
    $("tSent").innerHTML = '<b>' + esc(TAIL_HEADS[TL.head].en) + '</b> ' + esc(TAILS[ans][0]) + (TAIL_HEADS[TL.head].q ? "?" : ".") + ' <span class="m">-3초</span>';
    try{ sfxBad(); }catch(e){}
    TL.lock = true;
    setTimeout(function(){ TL.lock = false; tailQuestion(); }, 900);
  }
  tailPaintHud();
}
function tailTick(ts){
  if(!TL.on) return;
  if(!TL.last) TL.last = ts;
  var dt = Math.min(0.1, (ts - TL.last) / 1000); TL.last = ts;
  TL.left -= dt;
  tailPaintHud();
  if(TL.left <= 0){ tailEnd(); return; }
  TL.raf = requestAnimationFrame(tailTick);
}
function openTail(){
  hideSheets(); hide($("sheetTail"));
  tailStore();
  V.cur = "tail";
  hide(elViewLobby); hide(elViewJourney); hide(elViewGame); hide(elBook); hide(elTabbar);
  show($("viewTail"));
  var q = $("btnTailQuit"); if(q && q.innerHTML === "") q.innerHTML = ICON.close;
  TL.on = true; TL.left = TL_SEC; TL.score = 0; TL.combo = 0; TL.best = 0; TL.ok = 0; TL.n = 0;
  TL.times = []; TL.recent = []; TL.wrongIds = {}; TL.lock = false; TL.last = 0; TL.headLeft = 0; TL.head = -1;
  tailPaintHud();
  tailQuestion();
  try{ if(store.sound) bgmStart(); }catch(e){}
  cancelAnimationFrame(TL.raf);
  TL.raf = requestAnimationFrame(tailTick);
}
function tailEnd(){
  TL.on = false;
  cancelAnimationFrame(TL.raf);
  clearTimeout(TL.delayT);
  try{ bgmStop(); }catch(e){}
  if(!store.tailBest || TL.score > store.tailBest) store.tailBest = TL.score;
  save();
  var avg = TL.times.length ? (TL.times.reduce(function(a, b){ return a + b; }, 0) / TL.times.length) : 0;
  $("tResScore").textContent = TL.score.toLocaleString();
  $("tResOk").textContent = TL.ok + "/" + TL.n;
  $("tResSpeed").textContent = avg ? avg.toFixed(1) + "초" : "-";
  $("tResTitle").textContent = TL.score >= (store.tailBest || 0) && TL.score > 0 ? "최고 기록!" : "60초 끝!";
  $("tResLead").textContent = "익힌 꼬리 " + tailMastered() + " / " + TAILS.length;
  var b = $("tResBadge"); if(b && b.innerHTML === "") b.innerHTML = mascotSVG();
  /* 이번 판에 틀린 꼬리 — 다음 판에 더 자주 나온다 */
  var ws = [], k;
  for(k in TL.wrongIds) if(TL.wrongIds.hasOwnProperty(k)) ws.push(+k);
  ws.sort(function(a, b2){ return TL.wrongIds[b2] - TL.wrongIds[a]; });
  var wh = "";
  if(ws.length){
    wh = '<em>다시 볼 꼬리</em>';
    for(k=0;k<Math.min(4, ws.length);k++) wh += '<p><b>' + esc(TAILS[ws[k]][0]) + '</b><i>' + esc(TAILS[ws[k]][1]) + '</i></p>';
  }
  $("tResWeak").innerHTML = wh;
  $("tResWeak").className = "tWeak" + (wh ? "" : " hide");
  show($("sheetTail"));
}
function closeTail(){
  TL.on = false;
  cancelAnimationFrame(TL.raf);
  clearTimeout(TL.delayT);
  try{ bgmStop(); }catch(e){}
  hide($("viewTail")); hide($("sheetTail"));
  save();
  goLobby();
}
function paintTailEntry(){
  var s = $("teSub");
  if(s) s.textContent = "익힌 꼬리 " + tailMastered() + "/" + TAILS.length + (store.tailBest ? " · 최고 " + store.tailBest.toLocaleString() : "");
  var ic = $("teIco"); if(ic && ic.innerHTML === "") ic.innerHTML = ICON.bolt;
  var g = $("teGo"); if(g && g.innerHTML === "") g.innerHTML = IC_RIGHT;
}
on($("btnTail"), "click", function(){ unlockAudio(); openTail(); });
on($("btnTailQuit"), "click", function(){ closeTail(); });
on($("btnTailAgain"), "click", function(){ unlockAudio(); openTail(); });
on($("btnTailHome"), "click", function(){ closeTail(); });
on($("tOpts"), TAP, function(e){
  var el = e.target;
  while(el && el !== this && !(el.getAttribute && el.getAttribute("data-t"))) el = el.parentNode;
  if(!el || el === this) return;
  if(e.preventDefault) e.preventDefault();
  tailAnswer(+el.getAttribute("data-t"), el);
});
try{ paintTailEntry(); }catch(e){}
window.__tail = { open:openTail, answer:tailAnswer, end:tailEnd, close:closeTail, state:TL, TAILS:TAILS, HEADS:TAIL_HEADS, box:tailBox, options:tailOptions };
