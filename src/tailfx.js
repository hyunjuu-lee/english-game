/* ══════════ 패턴 훈련 — 게임 요소 ══════════
   배경음악 · 연속 정답 콤보(보너스 점수) · 정답 폭죽 · 콤보 배너 · 진행 바 위를 달리는 캐릭터 ·
   오답 흔들림 · 결과 별 1~3개와 최고 기록 */
var TFX = { combo:0, best:0, ups:0, newMaster:0 };
var elTView = $("viewTail");
(function(){
  var bar = $("tTimeBar"); if(!bar || !bar.parentNode) return;
  var run = document.createElement("span"); run.className = "tRunner"; run.id = "tRunner";
  bar.parentNode.appendChild(run);
})();
function tRunnerPaint(hop){
  var r = $("tRunner"); if(!r) return;
  if(!r.firstChild) r.innerHTML = mascotSVG();
  r.style.left = (Math.min(TL.i, TL_N) / TL_N * 100).toFixed(1) + "%";
  if(hop && r.animate){
    try{ r.animate([{transform:"translate(-50%,0) scale(1)"},{transform:"translate(-50%,-14px) scale(1.12,.92)"},{transform:"translate(-50%,0) scale(1)"}],
      {duration:420, easing:"cubic-bezier(.3,.7,.4,1)"}); }catch(e){}
  }
}
function tPop(txt, cls){
  var d = document.createElement("div"); d.className = "tPop " + (cls || ""); d.textContent = txt;
  var cue = $("tCue"); (cue || elTView).appendChild(d);
  if(d.animate) d.animate([{transform:"translate(-50%,0) scale(.5)", opacity:0},{transform:"translate(-50%,-26px) scale(1.15)", opacity:1, offset:.3},{transform:"translate(-50%,-56px) scale(1)", opacity:0}], {duration:900, easing:"cubic-bezier(.2,.8,.3,1)"});
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 920);
}
function tConfetti(){
  var host = $("tCue"); if(!host || !document.createElement) return;
  var pal = ["#FFE066","#FF8A6B","#7CF7C2","#8F72FF","#4C94FF","#FFFFFF"], i;
  for(i=0;i<22;i++){
    var d = document.createElement("i"); d.className = "tConf";
    d.style.background = pal[i % pal.length];
    d.style.left = "50%"; d.style.top = "55%";
    host.appendChild(d);
    var a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 110;
    var dx = Math.cos(a) * v, dy = Math.sin(a) * v - 40, rt = (Math.random() * 720 - 360) | 0;
    if(d.animate) d.animate([{transform:"translate(0,0) rotate(0)", opacity:1},{transform:"translate(" + dx + "px," + (dy + 70) + "px) rotate(" + rt + "deg)", opacity:0}],
      {duration:700 + Math.random() * 400, easing:"cubic-bezier(.15,.7,.3,1)"});
    (function(el){ setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 1150); })(d);
  }
}
var T_MARK = { 3:"좋아요!", 5:"대단해요!", 7:"불붙었어요!", 10:"완벽해요!" };
function tBanner(n){
  if(!T_MARK[n]) return;
  var d = document.createElement("div"); d.className = "tBan";
  d.innerHTML = "<b>" + n + "연속</b><i>" + T_MARK[n] + "</i>";
  elTView.appendChild(d);
  if(d.animate) d.animate([{transform:"translate(-50%,-50%) scale(2) rotate(-6deg)", opacity:0},{transform:"translate(-50%,-50%) scale(.95) rotate(-3deg)", opacity:1, offset:.2},
    {transform:"translate(-50%,-50%) scale(1) rotate(-3deg)", opacity:1, offset:.7},{transform:"translate(-50%,-62%) scale(1.04) rotate(-3deg)", opacity:0}], {duration:1100, easing:"cubic-bezier(.2,.9,.25,1)"});
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 1150);
}
function tCombo(){
  var c = $("tCombo"); if(!c) return;
  c.className = TFX.combo >= 2 ? "on" : "";
  c.innerHTML = (TFX.combo >= 2 ? '<span class="tFire">' + TFX.combo + '연속</span>' : "") + '<span class="tPts">' + TL.score + '점</span>';
}
var _tailPaintHud0 = tailPaintHud;
tailPaintHud = function(){ _tailPaintHud0(); tCombo(); tRunnerPaint(false); };
var _openTail0 = openTail;
openTail = function(){
  TFX.combo = 0; TFX.best = 0; TFX.ups = 0; TFX.newMaster = 0;
  var r = _openTail0.apply(this, arguments);
  try{ if(store.sound){ bgmStart(); } }catch(e){}
  tCombo(); tRunnerPaint(false);
  return r;
};
var _tailSubmit0 = tailSubmit;
tailSubmit = function(){
  var was = TL.phase, ok0 = TL.ok, sc0 = TL.score, qid = TL.cur && TL.cur.id, b0 = qid ? tailBox(qid) : 0;
  var r = _tailSubmit0.apply(this, arguments);
  if(was === "done" || TL.phase !== "done") return r;     /* 다음 문제로 넘기기 · 빈 입력 */
  if(TL.ok > ok0){
    TFX.combo++; if(TFX.combo > TFX.best) TFX.best = TFX.combo;
    var bonus = TFX.combo >= 2 ? Math.min(10, (TFX.combo - 1) * 2) : 0;
    TL.score += bonus;
    tPop("+" + (TL.score - sc0) + (bonus ? " 콤보" : ""), TFX.combo >= 5 ? "hot" : "");
    tConfetti(); tBanner(TFX.combo); tRunnerPaint(true);
    var b1 = qid ? tailBox(qid) : 0;
    if(b1 > b0){ TFX.ups++; if(b1 === TAIL_MASTER){ TFX.newMaster++; setTimeout(function(){ tPop("마스터!", "hot"); }, 380); } }
    try{ if(TFX.combo >= 3) sfxPop(); }catch(e){}
    var cue = $("tCue"); if(cue){ cue.classList.remove("tGood"); void cue.offsetWidth; cue.classList.add("tGood"); }
  } else {
    TFX.combo = 0;
    var cue2 = $("tCue"); if(cue2){ cue2.classList.remove("tBad"); void cue2.offsetWidth; cue2.classList.add("tBad"); }
    var f = document.createElement("div"); f.className = "tRed"; elTView.appendChild(f);
    if(f.animate) f.animate([{opacity:0},{opacity:1, offset:.2},{opacity:0}], {duration:450});
    setTimeout(function(){ if(f.parentNode) f.parentNode.removeChild(f); }, 470);
  }
  tCombo();
  return r;
};
var _tailEnd0 = tailEnd;
tailEnd = function(){
  var prevBest = +store.tailBest || 0;
  var r = _tailEnd0.apply(this, arguments);
  try{ bgmStop(); }catch(e){}
  try{
    var acc = TL.ok / TL_N, stars = acc >= 0.9 ? 3 : (acc >= 0.7 ? 2 : (acc >= 0.4 ? 1 : 0)), h = "", k;
    for(k=0;k<3;k++) h += '<i class="' + (k < stars ? "on" : "") + '">' + (k < stars ? ICON.star : ICON.starOff) + '</i>';
    var lead = $("tResLead");
    if(lead){
      var sEl = document.getElementById("tResStars");
      if(!sEl){ sEl = document.createElement("div"); sEl.id = "tResStars"; sEl.className = "tStars"; lead.parentNode.insertBefore(sEl, lead); }
      sEl.innerHTML = h;
      var kids = sEl.children;
      for(k=0;k<kids.length;k++) if(kids[k].className === "on" && kids[k].animate)
        kids[k].animate([{transform:"scale(0) rotate(-40deg)", opacity:0},{transform:"scale(1.3)", opacity:1, offset:.6},{transform:"scale(1)", opacity:1}], {duration:450, delay:200 + k * 220, fill:"backwards", easing:"cubic-bezier(.3,1.4,.5,1)"});
    }
    $("tResTitle").textContent = stars === 3 ? (acc === 1 ? "전부 정답!" : "훌륭해요!") : (stars === 2 ? "잘했어요!" : (stars === 1 ? "조금만 더!" : "다시 해 봐요"));
    $("tResSpeed").textContent = TFX.best + "연속";
    var lb = $("tResSpeed").previousElementSibling; if(lb) lb.textContent = "최고 연속";
    if(TL.score > prevBest && TL.score > 0){
      var nr = document.getElementById("tResNew");
      if(!nr){ nr = document.createElement("div"); nr.id = "tResNew"; nr.className = "new"; $("tResWeak").parentNode.insertBefore(nr, $("tResWeak")); }
      nr.textContent = "NEW RECORD"; nr.style.display = "";
    } else { var nr2 = document.getElementById("tResNew"); if(nr2) nr2.style.display = "none"; }
    var ld = $("tResLead");
    if(ld) ld.textContent = "이번 판 패턴 " + TFX.ups + "개 한 단계 UP" + (TFX.newMaster ? " · 새로 마스터 " + TFX.newMaster + "개" : "") + "\n" + ld.textContent;
    try{ if(stars >= 2) sfxPop(); }catch(e){}
  }catch(e){}
  return r;
};
var _closeTail0 = closeTail;
closeTail = function(){ try{ bgmStop(); }catch(e){} return _closeTail0.apply(this, arguments); };
