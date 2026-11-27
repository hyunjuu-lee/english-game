/* ══════════ 빈칸 채우기 ══════════
   일부 줄은 문장을 조립칸에 미리 다 깔아 두고, 패턴 뒤 꼬리 조각 1~2개만 빈칸으로 남긴다.
   빈칸을 누르면 키보드가 뜨고, 그 조각을 직접 쳐서 채운다.
   - 빈도: Easy 3줄에 1줄(1~2단어) · Normal 2줄에 1줄(3단어까지) · Hard 매 줄(가끔 2칸, 긴 조각도)
   - 빈칸은 <label for="blankIn"> 이라 누르는 즉시 iOS 키보드가 뜬다
   - 치는 동안 줄은 30% 속도(update), 입력 바는 키보드 바로 위
   - 엔터: 맞으면 채우고 다음 빈칸으로(키보드 유지), 다 채우면 그대로 발사 / 틀리면 흔들고 첫 글자 힌트, 콤보만 끊김 */
var BK = { seq:0, stage:-1, row:null, hole:-1, wrong:0 };
function blankOn(){ return !window.__noBlank && S && S.mode === "play"; }
function blankNorm(s){
  return String(s || "").toLowerCase().replace(/[‘’`]/g, "'").replace(/[“”"]/g, "")
    .replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();
}
function blankWords(s){ var n = blankNorm(s); return n ? n.split(" ").length : 0; }
function blankPick(row){
  if(row.blanks) return row.blanks;
  row.blanks = [];
  if(!blankOn() || !row.d || !row.d.chunks || row.d.chunks.length < 2) return row.blanks;
  if(BK.stage !== S.stage){ BK.stage = S.stage; BK.seq = 0; }
  var seq = BK.seq++, tier = S.tier || 1;
  var every = tier >= 3 ? 1 : (tier === 2 ? 2 : 3);
  if(seq % every !== (every - 1)) return row.blanks;
  var maxW = tier >= 3 ? 99 : (tier === 2 ? 3 : 2), ok = [], k;
  for(k=1;k<row.d.chunks.length;k++){
    var w = blankWords(row.d.chunks[k]);
    if(w >= 1 && w <= maxW) ok.push(k);
  }
  if(!ok.length) return row.blanks;
  var rng = makeRng(row.d.id * 131 + seq * 17 + 7);
  ok = shuffled(ok, rng);
  var n = (tier >= 3 && ok.length >= 2 && row.d.chunks.length >= 3 && rng() < 0.5) ? 2 : 1;
  row.blanks = ok.slice(0, n).sort(function(a, b){ return a - b; });
  return row.blanks;
}
function holeRow(){ var r = targetRow(); return (r && !r.dead && r.blanks && r.blanks.length) ? r : null; }
function holesLeft(){ var n = 0; for(var i=0;i<S.slots.length;i++) if(S.slots[i].hole && !S.slots[i].t) n++; return n; }
function firstHole(){ for(var i=0;i<S.slots.length;i++) if(S.slots[i].hole && !S.slots[i].t) return i; return -1; }
/* 빈칸 줄: 나머지 조각은 다 깔고 빈칸만 비운 채로 조립칸을 채운다 */
function blankPrefill(row){
  var ch = row.d.chunks, bl = row.blanks, out = [], k;
  for(k=0;k<ch.length;k++){
    if(bl.indexOf(k) >= 0) out.push({ i:-1, t:"", hole:true, k:k });
    else out.push({ i:-1, t:ch[k], fixed:true });
  }
  S.slots = out;
}
var _setTargetRow0 = setTargetRow;
setTargetRow = function(row, keep){
  if(S.typing) blankEnd();
  /* 앞 줄이 빈칸 줄이었다면 깔아 둔 조각은 다음 줄로 넘기지 않는다 */
  if(S.slots.some(function(s){ return s.hole || s.fixed; })){ S.slots = []; keep = false; }
  if(row && !row.dead) blankPick(row);
  if(row && row.blanks && row.blanks.length){
    _setTargetRow0(row, true);
    blankPrefill(row);
    renderSlots(); renderPool();
    return;
  }
  return _setTargetRow0(row, keep);
};
function blankMask(ans){
  return String(ans).replace(/[.,!?]/g, "").split(" ").map(function(w){ return w.replace(/[A-Za-z]/g, "_"); }).join(" ");
}
var _renderSlots0 = renderSlots;
renderSlots = function(){
  var row = holeRow();
  if(!row || !S.slots.some(function(s){ return s.hole; })){ _renderSlots0(); return; }
  var h = "", i, s;
  for(i=0;i<S.slots.length;i++){
    s = S.slots[i];
    if(s.hole){
      var on = S.typing && BK.hole === i;
      var txt = s.t ? esc(s.t) : (on && elBIn.value ? esc(elBIn.value) : '<span class="mask">' + esc(blankMask(row.d.chunks[s.k])) + '</span>');
      h += '<label for="blankIn" class="slot hole' + (s.t ? " done" : "") + (on ? " on" : "") + '" data-hole="' + i + '">' + txt + '</label>';
    } else {
      h += '<div class="slot filled fixed">' + esc(s.t) + '</div>';
    }
  }
  elSlots.innerHTML = h;
  if(elFire) elFire.className = holesLeft() ? "fire dim" : "fire";
  if(elBuilt) elBuilt.textContent = row.d.ko;
};
var _renderPool0 = renderPool;
renderPool = function(){
  if(holeRow()){
    elPool.innerHTML = '<div class="poolHole">빈칸을 눌러 직접 채워요</div>';
    S.blockEls = [];
    return;
  }
  _renderPool0();
};
var _removeSlot0 = removeSlot;
removeSlot = function(pos){ if(S.typing || holeRow()) return; _removeSlot0(pos); };
var _clearSlots0 = clearSlots;
clearSlots = function(){
  var row = holeRow();
  if(row){ if(S.typing) blankEnd(); blankPrefill(row); renderSlots(); return; }
  _clearSlots0();
};
/* 빈칸이 남았는데 쏘기를 누르면 하트를 깎지 않고 첫 빈칸을 연다(쏘기 탭이 사용자 제스처라 키보드도 뜬다) */
var _fire0 = fire;
fire = function(){
  if(holeRow() && holesLeft()){
    BK.hole = firstHole();
    try{ elBIn.focus(); }catch(e){}
    return false;
  }
  return _fire0();
};

/* ── 입력 ── */
var elBIn = $("blankIn"), elBBar = $("blankBar"), elBKo = $("blankKo"), elBPre = $("blankPre"), elBRest = $("blankRest");
function blankBarPaint(){
  var row = BK.row; if(!row) return;
  var pre = [], post = [], i;
  for(i=0;i<S.slots.length;i++){
    var t = S.slots[i].t || "___";
    if(i < BK.hole) pre.push(t); else if(i > BK.hole) post.push(t);
  }
  elBKo.textContent = row.d.ko;
  elBPre.textContent = pre.join(" ");
  elBRest.textContent = post.join(" ");
}
on(elSlots, "pointerdown", function(e){
  var t = e.target;
  while(t && t !== elSlots && !(t.getAttribute && t.getAttribute("data-hole") !== null)) t = t.parentNode;
  if(!t || t === elSlots) return;
  var h = parseInt(t.getAttribute("data-hole"), 10);
  if(isNaN(h)) return;
  if(S.typing && BK.hole !== h){ BK.hole = h; BK.wrong = 0; elBIn.value = S.slots[h].t || ""; elBIn.placeholder = ""; blankBarPaint(); renderSlots(); }
  else BK.hole = h;
});
function blankStart(){
  var row = holeRow();
  if(!blankOn() || !row || S.lock || !holesLeft()){ try{ elBIn.blur(); }catch(e){} return; }
  if(BK.hole < 0 || !S.slots[BK.hole] || !S.slots[BK.hole].hole) BK.hole = firstHole();
  S.typing = true; BK.row = row; BK.wrong = 0;
  elBIn.value = S.slots[BK.hole].t || ""; elBIn.placeholder = ""; elBIn.className = "";
  document.body.classList.add("typing");
  blankBarPaint(); renderSlots(); blankFit();
}
function blankEnd(){
  if(!S.typing) return;
  S.typing = false; BK.row = null; BK.hole = -1;
  document.body.classList.remove("typing");
  try{ elBIn.blur(); }catch(e){}
  try{ renderSlots(); }catch(e){}
}
function blankHint(ans){
  return String(ans).replace(/[.,!?]/g, "").split(" ").map(function(w){
    return w.charAt(0) + w.slice(1).replace(/[A-Za-z]/g, "_");
  }).join(" ");
}
function blankKeep(typed, ans){
  /* 대소문자·따옴표 모양은 무시하고, 정답과 글자가 같은 데까지만 남긴다 */
  var a = String(ans).replace(/[.,!?]+$/, ""), s = String(typed), i = 0, j = 0;
  var low = function(c){ return c.replace(/[\u2018\u2019`]/g, "'").toLowerCase(); };
  while(i < s.length && j < a.length){
    if(low(s.charAt(i)) === low(a.charAt(j))){ i++; j++; }
    else if(s.charAt(i) === " " && a.charAt(j) !== " "){ break; }
    else break;
  }
  return s.slice(0, i);
}
function blankSubmit(){
  if(!S.typing) return;
  var row = BK.row, s = S.slots[BK.hole];
  if(!row || row.dead || S.mode !== "play" || !s || !s.hole){ blankEnd(); return; }
  var typed = blankNorm(elBIn.value);
  if(!typed) return;
  var ans = row.d.chunks[s.k];
  if(blankNorm(ans) !== typed){
    BK.wrong++;
    S.combo = 0; S.mult = 1;
    try{ paintCombo(); }catch(e){}
    try{ beep(220, 0.12, "triangle", 0.05, 160); }catch(e){}
    elBIn.className = "bad";
    setTimeout(function(){ elBIn.className = ""; }, 420);
    /* 맞게 친 앞부분은 남기고, 처음 틀린 글자부터 지운다 — 처음부터 다시 치지 않게 */
    var keep = blankKeep(elBIn.value, ans);
    elBIn.value = keep;
    var hint = BK.wrong >= 2 ? ans.replace(/[.,!?]$/, "") : blankHint(ans);
    elBIn.placeholder = hint;
    elBKo.textContent = row.d.ko + "  ·  힌트 " + hint;
    try{ elBIn.setSelectionRange(keep.length, keep.length); }catch(e){}
    renderSlots();
    return;
  }
  s.t = ans;
  try{ sfxTap(BK.hole + 1); }catch(e){}
  if(holesLeft()){
    /* 다음 빈칸으로 — 키보드는 그대로 둔다 */
    BK.hole = firstHole(); BK.wrong = 0;
    elBIn.value = ""; elBIn.placeholder = "";
    blankBarPaint(); renderSlots();
    return;
  }
  blankEnd();
  renderSlots();
  _fire0();                                   /* 다 채우면 엔터 = 쏘기 */
}
on(elBIn, "focus", blankStart);
on(elBIn, "input", function(){ if(S.typing) renderSlots(); });
on(elBIn, "blur", function(){ setTimeout(function(){ if(S.typing && document.activeElement !== elBIn) blankEnd(); }, 0); });
on(elBIn, "keydown", function(e){ if(e.key === "Enter"){ if(e.preventDefault) e.preventDefault(); blankSubmit(); } });
on($("blankOk"), "pointerdown", function(e){ if(e.preventDefault) e.preventDefault(); blankSubmit(); });
on($("blankOk"), "click", function(e){ if(e.preventDefault) e.preventDefault(); });
function blankFit(){
  var vv = window.visualViewport;
  var kb = vv ? Math.max(0, window.innerHeight - (vv.height + vv.offsetTop)) : 0;
  if(elBBar) elBBar.style.bottom = kb + "px";
}
if(window.visualViewport){
  window.visualViewport.addEventListener("resize", function(){ if(S.typing) blankFit(); });
  window.visualViewport.addEventListener("scroll", function(){ if(S.typing) blankFit(); });
}
window.__blank = { submit:blankSubmit, end:blankEnd, typing:function(){ return !!S.typing; }, hole:function(){ return BK.hole; } };
