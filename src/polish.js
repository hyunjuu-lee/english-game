/* ══════════ v68 · 디자인 점검 반영 ══════════
   설정: 소리·발음을 켜짐/꺼짐 스위치 줄로 / 결과: 캐릭터 + "아쉽게 끝났어요" + 놓친 문장 듣기 */
function paintSetSwitches(){
  var bs = $("btnSetSound"), bv = $("btnSetVoice");
  if(bs){
    bs.className = "setRow";
    bs.setAttribute("role", "switch"); bs.setAttribute("aria-checked", store.sound ? "true" : "false");
    bs.innerHTML = '<span class="srT"><b>효과음·배경음악</b><i>게임 중 효과음과 음악</i></span><span class="sw' + (store.sound ? " on" : "") + '"><i></i></span>';
  }
  if(bv){
    var vOn = store.voice !== false;
    bv.className = "setRow";
    bv.setAttribute("role", "switch"); bv.setAttribute("aria-checked", vOn ? "true" : "false");
    bv.innerHTML = '<span class="srT"><b>정답 발음</b><i>맞히면 원어민 발음으로 읽어 줘요</i></span><span class="sw' + (vOn ? " on" : "") + '"><i></i></span>';
  }
  var rs = $("btnSetReset");
  if(rs && rs.className !== "setReset") rs.className = "setReset";
}
var _openSettingsP = openSettings;
openSettings = function(){ var r = _openSettingsP.apply(this, arguments); paintSetSwitches(); return r; };
on($("btnSetSound"), "click", function(){ setTimeout(paintSetSwitches, 0); });
on($("btnSetVoice"), "click", function(){ setTimeout(paintSetSwitches, 0); });
paintSetSwitches();
/* 설정 순서: 캐릭터 → 소리 → 기록 */
(function(){ try{ var cp = $("charPick"), bs = $("btnSetSound"); if(cp && bs && bs.parentNode) bs.parentNode.insertBefore(cp, bs); }catch(e){} })();

var _endRunP = endRun;
endRun = function(kind, lostRow){
  var r = _endRunP.apply(this, arguments);
  try{
    if(!isInfStage(S.stage)){
      var left = Math.max(0, (S.goal || 0) - (S.clears || 0));
      $("overTitle").textContent = "아쉽게 끝났어요";
      $("overLead").textContent = left ? (left + "문장 남기고 하트를 다 썼어요") : "하트를 다 썼어요";
    }
    var ic = $("overIcon");
    if(ic){ ic.className = "overAva"; ic.innerHTML = mascotSVG(); }
    var mb = $("ovMissed");
    if(mb && lostRow && lostRow.d && !mb.querySelector(".ovSay")){
      mb.insertAdjacentHTML("beforeend", '<button class="ovSay" aria-label="발음 듣기" data-en="' + esc(lostRow.d.en) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg></button>');
    }
  }catch(e){}
  return r;
};
on($("ovMissed"), "click", function(e){
  var el = e.target;
  while(el && el !== this && !(el.getAttribute && el.getAttribute("data-en"))) el = el.parentNode;
  if(!el || el === this) return;
  try{ sayEn(el.getAttribute("data-en")); }catch(e2){}
});
window.__polish = { over:function(){ var t = targetRow(); endRun("over", t); } };
