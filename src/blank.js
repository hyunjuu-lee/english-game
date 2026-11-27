/* ══════════ 빈칸 직접 쓰기 ══════════
   패턴 뒤 꼬리 조각 중 일부를 단어판에서 빼고, 그 자리를 키보드로 직접 쳐서 채운다.
   - 빈도: Easy 3줄에 1줄(1~2단어 조각) · Normal 2줄에 1줄(3단어까지) · Hard 모든 줄(1~2칸, 긴 조각도)
   - 단어판의 [직접 쓰기] 칩은 <label for="blankIn"> 이라 누르면 iOS 키보드가 바로 뜬다
   - 치는 동안 줄은 30% 속도로 내려온다(update 패치), 입력 바는 키보드 바로 위에 붙는다
   - 엔터: 맞으면 그 조각으로 확정, 문장이 다 맞으면 그대로 발사 / 틀리면 그 칸만 흔들고 첫 글자 힌트, 콤보만 끊김 */
var BLANK = "__BLANK__";
var BK = { seq:0, stage:-1, row:null, wrong:0 };
function blankOn(){ return !window.__noBlank && S && S.mode === "play"; }
function blankNorm(s){
  return String(s || "").toLowerCase().replace(/[‘’`]/g, "'").replace(/[“”"]/g, "")
    .replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();
}
function blankWords(s){ var n = blankNorm(s); return n ? n.split(" ").length : 0; }
/* 이 줄에서 뚫을 꼬리 조각 번호들 */
function blankPick(row){
  if(row.blanks) return row.blanks;
  row.blanks = [];
  if(!blankOn() || !row.d || !row.d.chunks || row.d.chunks.length < 2) return row.blanks;
  if(BK.stage !== S.stage){ BK.stage = S.stage; BK.seq = 0; }
  var seq = BK.seq++, tier = S.tier || 1;
  var every = tier >= 3 ? 1 : (tier === 2 ? 2 : 3);
  if(seq % every !== (every - 1)) return row.blanks;           /* Easy: 3번째 줄마다, Normal: 2번째 줄마다 */
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
/* 단어판: 뚫린 조각을 빼고 [직접 쓰기] 칩을 넣는다 */
var _ensurePool0 = ensurePool;
ensurePool = function(row){
  var fresh = !row.pool;
  var pool = _ensurePool0(row);
  if(fresh){
    var bl = blankPick(row), j, k;
    if(bl.length){
      for(j=0;j<bl.length;j++){
        var want = norm(row.d.chunks[bl[j]]);
        for(k=0;k<pool.length;k++) if(pool[k] !== BLANK && norm(pool[k]) === want){ pool.splice(k, 1); break; }
      }
      for(j=0;j<bl.length;j++) pool.push(BLANK);
    }
  }
  return pool;
};
var _renderPool0 = renderPool;
renderPool = function(){
  _renderPool0();
  for(var i=0;i<S.blockEls.length;i++){
    var b = S.blockEls[i];
    if(!b || S.blocks[i] !== BLANK) continue;
    var lb = document.createElement("label");
    lb.setAttribute("for", "blankIn");
    lb.className = "blk blank";
    lb.setAttribute("data-b", String(i));
    lb.innerHTML = '<i class="pen"></i>직접 쓰기';
    lb.style.cssText = b.style.cssText;
    b.parentNode.replaceChild(lb, b);
    S.blockEls[i] = lb;
  }
  blankPaintUsed();
};
function blankUsedCount(){ var n = 0; for(var i=0;i<S.slots.length;i++) if(S.slots[i].blank) n++; return n; }
function blankPaintUsed(){
  var used = blankUsedCount() + (S.typing ? 1 : 0), n = 0;
  for(var i=0;i<S.blockEls.length;i++){
    if(S.blocks[i] !== BLANK || !S.blockEls[i]) continue;
    S.blockEls[i].classList.toggle("used", n < used);
    n++;
  }
}
var _renderPoolUsed0 = renderPoolUsed;
renderPoolUsed = function(){ _renderPoolUsed0(); blankPaintUsed(); };
/* 일반 칩 탭으로 [직접 쓰기] 칩이 들어가지 않게, 치는 중엔 칩을 안 받는다 */
var _tapBlock0 = tapBlock;
tapBlock = function(i){
  if(S.typing) return;
  if(S.blocks[i] === BLANK) return;
  return _tapBlock0(i);
};
var _removeSlot0 = removeSlot;
removeSlot = function(pos){ if(S.typing) return; _removeSlot0(pos); blankPaintUsed(); };
var _clearSlots0 = clearSlots;
clearSlots = function(){ if(S.typing) blankEnd(); _clearSlots0(); blankPaintUsed(); };
/* 조준이 바뀌면(맞힘·바닥 충돌·다른 줄 선택) 치던 건 취소 */
var _setTargetRow0 = setTargetRow;
setTargetRow = function(row, keep){ if(S.typing) blankEnd(); return _setTargetRow0(row, keep); };

/* 단어판이 넘칠 때 함정부터 빼는데, [직접 쓰기] 칩은 절대 빼지 않는다 */
dropOneTrap = function(row){
  if(!row || !row.d) return false;
  var need = {}, i, k, cut = -1, ch = row.d.chunks;
  for(i=0;i<ch.length;i++){ k = norm(ch[i]); need[k] = (need[k] || 0) + 1; }
  for(i=S.blocks.length-1;i>=0;i--){
    if(S.blocks[i] === BLANK) continue;
    k = norm(S.blocks[i]);
    if(need[k] > 0){ need[k]--; continue; }
    cut = i; break;
  }
  if(cut < 0) return false;
  S.blocks.splice(cut, 1);
  return true;
};
/* ── 입력 바 ── */
var elBIn = $("blankIn"), elBBar = $("blankBar"), elBKo = $("blankKo"), elBPre = $("blankPre"), elBRest = $("blankRest");
function blankRow(){ var r = targetRow(); return (r && !r.dead) ? r : null; }
function blankRemaining(row){
  /* 아직 안 채운 빈칸 조각들 */
  var left = [], done = {}, i, j;
  for(i=0;i<S.slots.length;i++) if(S.slots[i].blank) done[norm(S.slots[i].t)] = (done[norm(S.slots[i].t)] || 0) + 1;
  var bl = row.blanks || [];
  for(j=0;j<bl.length;j++){
    var c = row.d.chunks[bl[j]], k = norm(c);
    if(done[k]){ done[k]--; continue; }
    left.push(c);
  }
  return left;
}
function blankStart(){
  var row = blankRow();
  if(!blankOn() || !row || S.lock || !blankRemaining(row).length){ try{ elBIn.blur(); }catch(e){} return; }
  S.typing = true; BK.row = row; BK.wrong = 0;
  elBIn.value = ""; elBIn.placeholder = "";
  elBIn.className = "";
  elBKo.textContent = row.d.ko;
  elBPre.textContent = builtText();
  elBRest.textContent = (S.slots.length + 1 < row.d.chunks.length) ? "…" : "";
  document.body.classList.add("typing");
  blankPaintUsed();
  blankFit();
  try{ sfxTap(S.slots.length + 1); }catch(e){}
}
function blankEnd(){
  if(!S.typing) return;
  S.typing = false; BK.row = null;
  document.body.classList.remove("typing");
  try{ elBIn.blur(); }catch(e){}
  blankPaintUsed();
}
function blankHint(ans){
  /* 첫 글자만 보이고 나머지는 글자 수만큼 _ */
  return String(ans).replace(/[.,!?]/g, "").split(" ").map(function(w){
    return w.charAt(0) + w.slice(1).replace(/[A-Za-z]/g, "_");
  }).join(" ");
}
function blankSubmit(){
  if(!S.typing) return;
  var row = BK.row;
  if(!row || row.dead || S.mode !== "play"){ blankEnd(); return; }
  var typed = blankNorm(elBIn.value);
  if(!typed) return;
  var left = blankRemaining(row), hit = null, i;
  for(i=0;i<left.length;i++) if(blankNorm(left[i]) === typed){ hit = left[i]; break; }
  if(!hit){
    BK.wrong++;
    S.combo = 0; S.mult = 1;
    try{ paintCombo(); }catch(e){}
    try{ beep(220, 0.12, "triangle", 0.05, 160); }catch(e){}
    elBIn.className = "bad";
    setTimeout(function(){ elBIn.className = ""; }, 420);
    elBIn.value = "";
    /* 1번 틀리면 첫 글자, 2번째부터는 정답 전체를 흐리게 보여 준다 — 보고라도 치게 */
    var ans = left[0] || "";
    elBIn.placeholder = BK.wrong >= 2 ? ans.replace(/[.,!?]$/, "") : blankHint(ans);
    return;
  }
  S.slots.push({ i:-1, t:hit, blank:true });
  blankEnd();
  renderSlots();
  renderPoolUsed();
  var made = [];
  for(i=0;i<S.slots.length;i++) made.push(S.slots[i].t);
  if(sameSentence(made, row.d.en)){ fire(); return; }     /* 빈칸이 마지막이면 엔터 = 쏘기 */
  try{ sfxTap(S.slots.length); }catch(e){}
}
on(elBIn, "focus", blankStart);
on(elBIn, "blur", function(){ setTimeout(function(){ if(S.typing && document.activeElement !== elBIn) blankEnd(); }, 0); });
on(elBIn, "keydown", function(e){ if(e.key === "Enter"){ if(e.preventDefault) e.preventDefault(); blankSubmit(); } });
/* [확인] 버튼은 키보드가 내려가지 않게 pointerdown 에서 처리 */
on($("blankOk"), "pointerdown", function(e){ if(e.preventDefault) e.preventDefault(); blankSubmit(); });
on($("blankOk"), "click", function(e){ if(e.preventDefault) e.preventDefault(); });
/* 키보드 바로 위에 입력 바를 붙인다 */
function blankFit(){
  var vv = window.visualViewport;
  var kb = vv ? Math.max(0, window.innerHeight - (vv.height + vv.offsetTop)) : 0;
  if(elBBar) elBBar.style.bottom = kb + "px";
}
if(window.visualViewport){
  window.visualViewport.addEventListener("resize", function(){ if(S.typing) blankFit(); });
  window.visualViewport.addEventListener("scroll", function(){ if(S.typing) blankFit(); });
}
window.__blank = { start:blankStart, submit:blankSubmit, end:blankEnd, pick:blankPick, remaining:blankRemaining,
  input:function(v){ elBIn.value = v; }, typing:function(){ return !!S.typing; } };
