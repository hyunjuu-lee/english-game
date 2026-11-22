/* ══════════ 12. 화면 · 뷰 ══════════ */
/* iOS 웹뷰의 실제 보이는 높이는 CSS(fixed + inset:0)가 이미 꽉 채운다.
   예전처럼 .app 높이를 스크립트로 덮어쓰면 iOS 홈화면 앱에서 화면 아래가 남는다 — 다시는 덮어쓰지 않는다. */
function fitApp(){
  layout();
}
var elViewLobby = $("viewLobby"), elViewJourney = $("viewJourney"), elViewGame = $("viewGame");
var elTabbar = $("tabbar"), elBook = $("book"), elBookBody = $("bookBody"), elBookCnt = $("bookCnt");
var elJNodes = $("jNodes"), elJMap = $("jMap"), elJPath = $("jPath"), elJDeco = $("jDeco");
var elJScroll = $("jScroll"), elJCount = $("jCount"), elSheetSet = $("sheetSet");
var elSheetStart = null;

var V = { cur:"lobby", bookFrom:"lobby", jBuilt:false, jW:0, jH:0, pos:[], stage:1, tier:1, jSel:0, jTier:1 };

function show(el){ if(el && el.classList) el.classList.remove("hide"); }
function hide(el){ if(el && el.classList) el.classList.add("hide"); }
function hideSheets(){
  hide(elSheetPause); hide(elSheetClear); hide(elSheetOver); hide(elSheetSet); hide(elBook);
}

/* 화면 전환 — lobby | journey | game */
function setView(name){
  V.cur = name;
  if(name === "game"){
    hide(elViewLobby); hide(elViewJourney); hide(elBook); show(elViewGame); hide(elTabbar);
  } else if(name === "journey"){
    hide(elViewLobby); hide(elViewGame); hide(elBook); show(elViewJourney); show(elTabbar);
    paintTabs("journey");
  } else if(name === "book"){
    hide(elViewLobby); hide(elViewJourney); hide(elViewGame); show(elBook); show(elTabbar);
    paintTabs("book");
  } else {
    hide(elViewJourney); hide(elViewGame); hide(elBook); show(elViewLobby); show(elTabbar);
    paintTabs("lobby");
  }
}
function paintTabs(active){
  var tabs = elTabbar ? elTabbar.getElementsByTagName("button") : [], i, t;
  for(i=0;i<tabs.length;i++){
    t = tabs[i];
    var on = t.getAttribute("data-tab") === active;
    t.className = "tab" + (t.getAttribute("data-tab") === "lobby" ? " home" : "") + (on ? " on" : "");
  }
}
/* 홈으로 — 마지막에 하던 스테이지를 보드에 올린다 */
function goLobby(){
  hideSheets();
  V.stage = Math.max(1, Math.min(STAGES_TOTAL, store.lastStage || 1));
  V.tier = defaultTier(V.stage);
  setView("lobby");
  paintLobby();
}

/* ══════════ 12b. 마스코트 · 조각 아이콘 ══════════ */
var MG_SEQ = 0;
/* 피클 앱의 자음 ㅌ 마스코트 — IMG_1548 의 실루엣을 그대로 옮겼다.
   거의 1:1 로 통통한 조약돌 몸통(왼쪽은 매끈한 큰 곡선) + 오른쪽에만 얕게 솟은 세 개의 둥근 돌기.
   테두리 선 없이 민트 클레이 그라디언트 한 덩어리, 까만 세로 눈 두 개가 몸통 중앙보다 살짝 아래. */
var MG_PATH = "M32.0 4.0C35.5 3.8 38.6 4.5 41.4 4.8C44.1 5.2 46.7 5.7 48.6 6.2C50.5 6.8 51.9 7.4 52.8 7.9C53.7 8.4 53.3 8.8 53.8 9.3C54.4 9.8 55.6 10.4 56.2 11.0C56.8 11.6 57.2 12.3 57.5 13.0C57.8 13.7 58.0 14.5 58.0 15.2C58.0 15.9 57.8 16.7 57.5 17.4C57.2 18.1 56.8 18.8 56.2 19.4C55.6 20.0 54.3 20.4 53.8 21.1C53.4 21.8 53.6 22.8 53.6 23.6C53.6 24.4 53.5 25.4 53.8 26.1C54.2 26.8 55.1 27.2 55.7 27.8C56.2 28.4 56.8 29.1 57.2 29.8C57.6 30.5 57.9 31.3 57.9 32.0C57.9 32.7 57.6 33.5 57.2 34.2C56.8 34.9 56.2 35.6 55.7 36.2C55.1 36.8 54.4 37.2 54.1 37.9C53.8 38.6 53.8 39.6 53.8 40.4C53.8 41.2 53.8 42.2 54.1 42.9C54.4 43.6 55.4 44.0 55.9 44.6C56.5 45.2 57.1 45.9 57.5 46.6C57.8 47.3 58.0 48.1 58.0 48.8C58.0 49.5 57.7 50.3 57.2 51.0C56.8 51.7 56.1 52.4 55.4 53.0C54.7 53.6 53.9 54.1 52.8 54.7C51.7 55.3 50.4 56.0 48.6 56.6C46.9 57.2 45.2 57.8 42.4 58.3C39.6 58.9 36.2 60.0 32.0 60.0C27.8 60.0 20.0 59.1 16.9 58.4C13.8 57.8 14.4 57.0 13.3 56.1C12.2 55.1 11.2 54.0 10.4 52.7C9.6 51.4 8.9 49.8 8.3 48.2C7.8 46.7 7.4 44.9 7.0 43.2C6.7 41.5 6.5 39.7 6.3 38.2C6.1 36.6 6.0 35.2 6.0 33.7C6.0 32.2 6.2 30.7 6.3 29.2C6.5 27.7 6.7 26.2 6.9 24.7C7.2 23.2 7.5 21.7 7.9 20.2C8.3 18.7 8.7 17.2 9.2 15.8C9.8 14.4 10.2 13.0 11.1 11.8C12.0 10.7 13.0 9.8 14.6 8.8C16.1 7.8 17.4 6.6 20.3 5.8C23.2 5.0 28.5 4.2 32.0 4.0Z";
function mascotSVG(){
  var u = "m" + (++MG_SEQ);
  return '<svg class="mascot" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<radialGradient id="' + u + '" cx="38%" cy="20%" r="92%">' +
        '<stop offset="0" stop-color="#95FBE5"/><stop offset=".38" stop-color="#66F4CE"/>' +
        '<stop offset=".78" stop-color="#48EABF"/><stop offset="1" stop-color="#37E2B4"/>' +
      '</radialGradient>' +
      '<linearGradient id="' + u + 's" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset=".58" stop-color="#0FA57F" stop-opacity="0"/>' +
        '<stop offset="1" stop-color="#0FA57F" stop-opacity=".16"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<ellipse cx="32" cy="61.2" rx="14" ry="2.2" fill="#0FA57F" opacity="0.09"/>' +
    '<path d="' + MG_PATH + '" fill="url(#' + u + ')"/>' +
    '<path d="' + MG_PATH + '" fill="url(#' + u + 's)"/>' +
    '<ellipse cx="22" cy="15" rx="7.5" ry="4.4" fill="#FFFFFF" opacity="0.14" transform="rotate(-20 22 15)"/>' +
    '<ellipse class="mEye" cx="23.6" cy="32.4" rx="3.7" ry="7.3" fill="#111827"/>' +
    '<ellipse class="mEye" cx="38.4" cy="32.4" rx="3.7" ry="7.3" fill="#111827"/>' +
    '<ellipse class="mEye mShine" cx="22.5" cy="29.2" rx="1.25" ry="1.6" fill="#FFFFFF" opacity="0.95"/>' +
    '<ellipse class="mEye mShine" cx="37.3" cy="29.2" rx="1.25" ry="1.6" fill="#FFFFFF" opacity="0.95"/>' +
    '<rect class="mEyeShut" x="20.2" y="30.8" width="6.8" height="3.2" rx="1.6" fill="#111827" opacity="0"/>' +
    '<rect class="mEyeShut" x="35.0" y="30.8" width="6.8" height="3.2" rx="1.6" fill="#111827" opacity="0"/>' +
    '</svg>';
}
/* 3D 자물쇠 — 은색 고리 + 골드 몸체 + 열쇠 구멍 (잠긴 스테이지 표시 전용) */
var LCK_SEQ = 0;
function lockSVG(){
  var u = "k" + (++LCK_SEQ);
  return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<linearGradient id="' + u + 's" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#F2F6FB"/><stop offset=".55" stop-color="#C3CFDF"/>' +
        '<stop offset="1" stop-color="#94A3B8"/></linearGradient>' +
      '<linearGradient id="' + u + 'g" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FFE49B"/><stop offset=".5" stop-color="#FFC33D"/>' +
        '<stop offset="1" stop-color="#F0950A"/></linearGradient>' +
    '</defs>' +
    '<path d="M7.2 10.4V7.9a4.8 4.8 0 0 1 9.6 0v2.5" fill="none" stroke="url(#' + u + 's)" stroke-width="3.3" stroke-linecap="round"/>' +
    '<rect x="3.4" y="9.8" width="17.2" height="12.6" rx="3.6" fill="url(#' + u + 'g)" stroke="#C07408" stroke-width="1.05"/>' +
    '<rect x="5" y="11.2" width="14" height="4.2" rx="2.1" fill="#FFF3CB" opacity=".55"/>' +
    '<circle cx="12" cy="15.3" r="1.75" fill="#7A4A05"/>' +
    '<path d="M11.15 16.3h1.7l.55 3.2h-2.8z" fill="#7A4A05"/>' +
    '</svg>';
}

/* ══════════ 12b-2. 스테이지 게임판 배경 — 6개 챕터 테마 ══════════ */
/* 1~6 라군 · 7~12 오션 · 13~18 바이올렛 · 19~24 선셋 · 25~30 에메랄드 · 31~37 오로라 */
function chapterOf(n){ return Math.max(1, Math.min(6, Math.ceil((n || 1) / 6))); }
function artClouds(op){
  return '<svg class="artTop" viewBox="0 0 120 20" preserveAspectRatio="none" height="26%">' +
    '<g fill="#FFFFFF" opacity="' + op + '">' +
      '<ellipse cx="20" cy="9" rx="17" ry="6"/><ellipse cx="36" cy="11" rx="12" ry="5"/>' +
      '<ellipse cx="88" cy="6" rx="18" ry="6"/><ellipse cx="103" cy="9" rx="12" ry="4"/>' +
      '<ellipse cx="62" cy="4" rx="10" ry="4"/>' +
    '</g></svg>';
}
function artWaves(color, op){
  return '<svg class="artBot" viewBox="0 0 120 24" preserveAspectRatio="none" height="26%">' +
    '<path d="M0 9 Q10 3 20 9 T40 9 T60 9 T80 9 T100 9 T120 9 V24 H0 Z" fill="' + color + '" opacity="' + op + '"/>' +
    '<path d="M0 16 Q10 11 20 16 T40 16 T60 16 T80 16 T100 16 T120 16 V24 H0 Z" fill="' + color + '" opacity="' + (op * 0.7).toFixed(2) + '"/>' +
    '</svg>';
}
function artHills(color, op){
  return '<svg class="artBot" viewBox="0 0 120 26" preserveAspectRatio="none" height="32%">' +
    '<path d="M0 26 V13 C14 5 26 5 38 11 C52 18 64 7 78 9 C92 11 104 5 120 11 V26 Z" fill="' + color + '" opacity="' + op + '"/>' +
    '<path d="M0 26 V19 C16 13 30 15 44 19 C60 23 76 17 92 18 C104 19 112 21 120 20 V26 Z" fill="' + color + '" opacity="' + (op * 0.8).toFixed(2) + '"/>' +
    '</svg>';
}
function artStars(color, op){
  var pts = [[8,6,1.4],[20,14,1],[33,5,1.1],[46,11,1.6],[58,4,1],[70,13,1.3],
             [84,7,1],[96,15,1.5],[110,6,1.1],[64,20,1],[28,23,1],[101,24,1.2]];
  var out = '<svg class="artTop" viewBox="0 0 120 40" preserveAspectRatio="none" height="46%"><g fill="' + color + '" opacity="' + op + '">';
  for(var i=0;i<pts.length;i++) out += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + pts[i][2] + '"/>';
  return out + '</g></svg>';
}
function artSun(){
  return '<svg class="artTop" viewBox="0 0 120 40" preserveAspectRatio="none" height="34%">' +
    '<circle cx="97" cy="13" r="12" fill="#FFF6E3" opacity=".9"/>' +
    '<circle cx="97" cy="13" r="20" fill="#FFF1D8" opacity=".28"/></svg>';
}
function artAurora(){
  return '<svg class="artTop" viewBox="0 0 120 40" preserveAspectRatio="none" height="48%">' +
    '<path d="M-4 12 C18 26 40 2 62 10 C82 17 104 3 124 9 L124 -8 L-4 -8 Z" fill="#7CF7D2" opacity=".24"/>' +
    '<path d="M-4 21 C20 31 44 10 66 18 C88 26 106 13 124 18 L124 -6 L-4 -6 Z" fill="#8FB4FF" opacity=".18"/>' +
    '</svg>';
}
function stageArtSVG(ch){
  if(ch === 1) return artClouds(.55) + artWaves("#FFFFFF", .28);
  if(ch === 2) return artClouds(.5) + artWaves("#CFE9FF", .6);
  if(ch === 3) return artClouds(.34) + artHills("#FFFFFF", .26);
  if(ch === 4) return artSun() + artHills("#FFE6CE", .55);
  if(ch === 5) return artClouds(.3) + artHills("#DBFFF3", .45);
  return artAurora() + artStars("#FFFFFF", .75) + artHills("#1B2750", .55);
}
/* 게임판 .sky 에 챕터 테마 클래스와 배경 아트를 입힌다 */
function paintSky(){
  if(!elSky) return;
  var ch = chapterOf(S.stage), art = $("stageArt"), html = stageArtSVG(ch);
  elSky.className = "sky th" + ch;
  if(art && art.innerHTML !== html) art.innerHTML = html;
}
var IC_CK = '<svg viewBox="0 0 24 24"><path d="M4.5 12.6l5 5L19.6 6.8" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var IC_HOUSE = '<svg viewBox="0 0 24 24"><path d="M12 3.2 3.4 10.6c-.4.4-.1 1 .4 1h1.6v8c0 .6.4 1 1 1h4v-5.4c0-.6.4-1 1-1h1.2c.6 0 1 .4 1 1V21h4c.6 0 1-.4 1-1v-8h1.6c.5 0 .8-.6.4-1z" fill="currentColor"/></svg>';
/* 여정 — 민트 섬 위 코랄 깃발 (컬러 3D) */
var IC_FLAG = '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="tabFlF" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#FFB067"/><stop offset=".55" stop-color="#FF8A3D"/><stop offset="1" stop-color="#FF5122"/>' +
  '</linearGradient><linearGradient id="tabFlS" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#8BEBD1"/><stop offset="1" stop-color="#43D3AC"/></linearGradient></defs>' +
  '<g transform="translate(-3.2,-3.2) scale(1.2)">' +
  '<ellipse cx="16" cy="26.4" rx="11.4" ry="4.2" fill="url(#tabFlS)"/>' +
  '<ellipse cx="16" cy="25.2" rx="7.6" ry="2.7" fill="#D8FFF2" opacity=".85"/>' +
  '<rect x="13.1" y="6.6" width="2.4" height="18.4" rx="1.2" fill="url(#tabFlS)" opacity=".9"/>' +
  '<rect x="13.4" y="6.6" width="1" height="18" rx=".5" fill="#FFFFFF" opacity=".45"/>' +
  '<path d="M15.6 7.4h9.4c1.5 0 2.1 1.7 1 2.7l-2.2 2.3 2.2 2.3c1.1 1 .5 2.7-1 2.7h-9.4z" fill="url(#tabFlF)" stroke="#FFFFFF" stroke-width="1.1" stroke-linejoin="round"/>' +
  '<path d="M15.6 8.6h8.6c.7 0 1 .8.5 1.3l-1.2 1.2" stroke="#FFFFFF" stroke-width=".9" fill="none" opacity=".55"/>' +
  '</g></svg>';
/* 도감 — 민트 3D 책 + 크림 페이지 + 코랄 책갈피 */
var IC_BOOK = '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="tabBkC" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#6DF7D5"/><stop offset=".5" stop-color="#2EE0B4"/><stop offset="1" stop-color="#0DAE84"/>' +
  '</linearGradient><linearGradient id="tabBkP" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F3E7CC"/></linearGradient></defs>' +
  '<g transform="translate(-3.2,-3.2) scale(1.2)">' +
  '<rect x="8.6" y="5.4" width="18.4" height="21.6" rx="3" fill="url(#tabBkP)" stroke="#E2D3B4" stroke-width="1"/>' +
  '<path d="M12 10.6h10M12 14.3h7" stroke="#DED0B2" stroke-width="1.7" stroke-linecap="round"/>' +
  '<rect x="5" y="4" width="18.6" height="24" rx="3.6" fill="url(#tabBkC)" stroke="#0AA37C" stroke-width="1.2"/>' +
  '<rect x="5" y="4" width="4.6" height="24" rx="2.3" fill="#0FB88C" opacity=".42"/>' +
  '<path d="M9.6 4.4v23.2" stroke="#FFFFFF" stroke-width="1.1" opacity=".55"/>' +
  '<path d="M13 8.4h6.6M13 12h5" stroke="#EAFFF9" stroke-width="1.8" stroke-linecap="round" opacity=".92"/>' +
  '<path d="M19.2 4h4.4v8.4l-2.2-2.2-2.2 2.2z" fill="#FF7A45" stroke="#FFFFFF" stroke-width=".9" stroke-linejoin="round"/>' +
  '</g></svg>';
var IC_GEAR = '<svg viewBox="0 0 24 24"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zm8.3 3.8c0-.5 0-1-.1-1.5l2-1.5-2-3.4-2.3.9c-.8-.6-1.6-1.1-2.5-1.4L15 3h-4l-.4 2.1c-.9.3-1.7.8-2.5 1.4L5.8 5.6l-2 3.4 2 1.5c-.1.5-.1 1-.1 1.5s0 1 .1 1.5l-2 1.5 2 3.4 2.3-.9c.8.6 1.6 1.1 2.5 1.4L11 21h4l.4-2.1c.9-.3 1.7-.8 2.5-1.4l2.3.9 2-3.4-2-1.5c.1-.5.1-1 .1-1.5z" fill="currentColor"/></svg>';
var IC_LEFT = '<svg viewBox="0 0 24 24"><path d="M15 4.6 7.6 12l7.4 7.4" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* 여정 노드의 작은 별 — 깬 단계 수(1/2/3)를 점처럼 보여준다 */
var IC_TIER_STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.1 1.1-6.5L2.6 9.6l6.5-.9z" fill="currentColor"/></svg>';
var IC_RIGHT = '<svg viewBox="0 0 24 24"><path d="M9 4.6 16.4 12 9 19.4" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* 보딩패스 시즌 뱃지의 작은 비행기 스티커 */
var IC_PLANE = '<svg viewBox="0 0 24 24"><path d="M2.6 10.9 20.7 2.3c.9-.4 1.8.5 1.4 1.4l-8.6 18.1c-.4.9-1.7.8-2-.2l-2.1-6.3-6.3-2.1c-1-.3-1.1-1.6-.5-2.3z" fill="currentColor"/><path d="M9.4 13.3 21.4 2.8" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".6"/></svg>';
/* 보물상자 — 파랑 */
function chestSVG(){
  var u = "c" + (++MG_SEQ);
  return '<span class="jChest"><svg viewBox="0 0 64 56" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<linearGradient id="' + u + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#AFE4FF"/><stop offset=".45" stop-color="#2F8BFF"/><stop offset="1" stop-color="#0050BF"/></linearGradient>' +
      '<linearGradient id="' + u + 'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A8FE8"/><stop offset="1" stop-color="#0040A0"/></linearGradient>' +
    '</defs>' +
    '<ellipse cx="32" cy="51" rx="24" ry="5" fill="#002B6B" opacity=".22"/>' +
    '<path d="M9 27h46v18.6c0 2-1.6 3.4-3.4 3.4H12.4C10.6 49 9 47.6 9 45.6z" fill="url(#' + u + 'w)" stroke="#002B6B" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M9 27C9 18.7 19.3 13 32 13s23 5.7 23 14z" fill="url(#' + u + 'g)" stroke="#002B6B" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<rect x="8" y="25.4" width="48" height="8" rx="2" fill="url(#' + u + 'g)" stroke="#002B6B" stroke-width="1.6"/>' +
    '<rect x="26.6" y="29" width="10.8" height="15" rx="2.4" fill="#EAF5FF" stroke="#002B6B" stroke-width="1.4"/>' +
    '<circle cx="32" cy="35.6" r="2.4" fill="#005CE6"/>' +
    '<path d="M18.6 21.6c2.6-1.9 5.6-3 9-3.4" stroke="#EAF5FF" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".8"/>' +
    '<path d="M32 4.4l1.9 4 4.4.6-3.2 3.1.8 4.4L32 14.3l-3.9 2.2.8-4.4-3.2-3.1 4.4-.6z" fill="#FFFFFF" stroke="#0050BF" stroke-width=".8"/>' +
    '</svg></span>';
}
/* 왕관 — 오렌지 */
function crownSVG(){
  var u = "k" + (++MG_SEQ);
  return '<span class="jCrown"><svg viewBox="0 0 56 44" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="' + u + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9A8"/><stop offset=".5" stop-color="#FF7A00"/><stop offset="1" stop-color="#E84500"/></linearGradient></defs>' +
    '<path d="M6 12.6 16.4 19 28 5.2 39.6 19 50 12.6 45.4 34H10.6z" fill="url(#' + u + 'g)" stroke="#B32A00" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M11.6 30.4h32.8" stroke="#C44200" stroke-width="2"/>' +
    '<circle cx="6" cy="10.6" r="3.4" fill="#FFBB7A" stroke="#B32A00" stroke-width="1.2"/>' +
    '<circle cx="50" cy="10.6" r="3.4" fill="#FFBB7A" stroke="#B32A00" stroke-width="1.2"/>' +
    '<circle cx="28" cy="4.6" r="3.6" fill="#FFBB7A" stroke="#B32A00" stroke-width="1.2"/>' +
    '<circle cx="28" cy="22" r="2.4" fill="#FFE7CC"/>' +
    '</svg></span>';
}

/* ── 여정 풍경 조각 — 로비 일러스트와 같은 톤의 구름·민트 언덕 ── */
var CLOUD_SVG = '<svg viewBox="0 0 100 44" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
  '<g fill="#FFFFFF"><ellipse cx="26" cy="29" rx="23" ry="14"/><ellipse cx="50" cy="20" rx="25" ry="16"/>' +
  '<ellipse cx="74" cy="29" rx="20" ry="13"/></g></svg>';
function cloudSVG(){ return CLOUD_SVG; }
/* ══════════ 12c. 홈 로비 ══════════ */
/* 영어 발음 — 도감 문장 탭과 '정답 조립' 순간에 한 번씩 읽어 준다.
   소리를 꺼 두었으면 조용히 지나가고, 음성 API가 없는 곳에서도 죽지 않는다. */
function sayEn(txt){
  if(!store.sound) return;
  txt = String(txt || "");
  if(!txt) return;
  try{
    var sy = window.speechSynthesis;
    if(!sy || typeof SpeechSynthesisUtterance === "undefined") return;
    sy.cancel();                      /* 연속으로 맞혀도 음성이 밀리지 않게 마지막 것만 */
    var u = new SpeechSynthesisUtterance(txt);
    u.lang = "en-US"; u.rate = 0.92;
    try{
      var vs = sy.getVoices ? sy.getVoices() : [];
      for(var i=0;i<vs.length;i++){ if(/en[-_]US/i.test(vs[i].lang)){ u.voice = vs[i]; break; } }
    }catch(e2){}
    sy.speak(u);
  }catch(e){}
}
function speak(txt){ sayEn(txt); }
/* 패턴 30개의 한국어 뜻 — 보드에서 패턴명 바로 아래에 보여준다 */
var PAT_KO = ["",
  "~하려고 하는 중이야", "~하기로 되어 있어", "막 ~하려던 참이었어", "~하러 왔어요",
  "계속 ~해 왔어", "내가 ~할게", "~ 주실 수 있어요?", "~해 줄 수 있어요?",
  "~해도 괜찮을까요?", "~인지 잘 모르겠어", "~인 것 같지 않아", "~하는 게 좋을 것 같아",
  "~인 것 같은 느낌이야", "~처럼 보여", "~인 것처럼 들려", "~이 있어",
  "~하고 싶어요", "네가 ~해줘야 해", "그냥 ~하고 싶었어", "혹시 ~인지 궁금해서",
  "문제는 ~라는 거야", "내가 아는 한은 ~", "~ 안 해도 돼", "~해보는 게 좋을지도",
  "~에 따라 달라", "~ 알려줄게", "~하려던 건 아니었어", "빨리 ~하고 싶어",
  "그래서 ~한 거야", "바로 그거야"
];
function boardKoOf(n){
  var m = stageMeta(n);
  if(m.kind === "pat")   return PAT_KO[m.p] || "";
  if(m.kind === "mix")   return "패턴 1~" + m.to + " 총복습";
  if(m.kind === "final") return "패턴 30종 총동원";
  return "끝없는 300문장 서바이벌";
}
/* 보드에 올릴 짧은 예문 1개 — 그 단계에서 가장 짧은 문장 */
function exampleOf(n){
  var m = stageMeta(n), i, best = null, d;
  for(i=0;i<DATA.length;i++){
    d = DATA[i];
    if(m.kind === "pat" && d.p !== m.p) continue;
    if((m.kind === "mix" || m.kind === "final") && d.p > m.to) continue;
    if(m.kind === "inf" && d.lv > 3) continue;
    if(!best || d.en.length < best.en.length) best = d;
  }
  return best;
}
function stageHint(n){
  var m = stageMeta(n);
  if(m.kind === "pat")   return "패턴 " + m.p + " 집중 · " + m.goal + "문장";
  if(m.kind === "mix")   return "패턴 1~" + m.to + " 골고루 · " + m.goal + "문장";
  if(m.kind === "final") return "패턴 30종 총동원 · " + m.goal + "문장";
  return "300문장 끝없이 · 살아남기";
}
function boardTitleOf(n){
  var m = stageMeta(n);
  if(m.kind === "pat")   return PATTERNS[m.p];
  if(m.kind === "mix")   return "패턴 1~" + m.to + " 총복습";
  if(m.kind === "final") return "파이널 믹스";
  return "무한 서바이벌";
}
function clearedStages(){
  var n = 0, k;
  /* 단계 키(1-2, 1-3)는 빼고 스테이지 번호만 센다 — 섬 37개 기준 */
  for(k in store.stageDone) if(store.stageDone.hasOwnProperty(k) && store.stageDone[k] && /^\d+$/.test(k)) n++;
  return n;
}
/* ── 시즌 1 · 여행자 자격 ──
   클리어한 섬(스테이지)이 늘면 여행자 랭크가 한 칸씩 올라간다. */
var TRAVEL_RANKS = [
  { min: 0,  label: "출국 준비" },
  { min: 8,  label: "공항 통과" },
  { min: 16, label: "체크인 완료" },
  { min: 24, label: "현지 맛집 정복" },
  { min: 32, label: "혼자 여행 가능!" }
];
function travelRank(done){
  var r = TRAVEL_RANKS[0], i;
  for(i=0;i<TRAVEL_RANKS.length;i++) if((done || 0) >= TRAVEL_RANKS[i].min) r = TRAVEL_RANKS[i];
  return r.label;
}
/* ── 3단계 알약 — 같은 패턴을 난이도만 올려 세 번 ──
   깬 단계는 민트 + 체크, 지금 고른 단계는 진한 민트, 잠긴 단계는 자물쇠. */
function tierPills(n, sel){
  var m = stageMeta(n), t, h = "", cls, done, lk;
  if(m.kind !== "pat") return "";
  h = '<span class="tSeg">';
  for(t=1;t<=3;t++){
    done = tierDone(n, t);
    lk = tierLocked(n, t);
    cls = "tSegBtn" + (t === sel ? " on" : "") + (done ? " done" : "") + (lk ? " lock" : "");
    h += '<button class="' + cls + '" data-tier="' + t + '" aria-label="' + t + '">' +
         (lk ? '<i class="iLock">' + lockSVG() + '</i>' : '') +
         '<b>' + t + '</b></button>';
  }
  return h + '</span>';
}
function selectTier(t){
  t = Math.max(1, Math.min(3, t || 1));
  if(t === V.tier) return;
  V.tier = t;
  if(store.sound) beep(660 + t*60, 0.05, "sine", 0.05);
  paintLobby();
}
function paintLobby(){
  var n = Math.max(1, Math.min(STAGES_TOTAL, V.stage || store.lastStage || 1));
  V.stage = n;
  var m = stageMeta(n), done = clearedStages(), i;
  var tier = (m.kind === "pat") ? Math.max(1, Math.min(3, V.tier || 1)) : 1;
  V.tier = tier;
  var lk = tierLocked(n, tier), kk = tierKey(n, tier);

  var bestEl = $("lobbyBest"); if(bestEl) bestEl.textContent = String(store.best || 0);
  var ico = $("lobbyBestIco"); if(ico && ico.innerHTML === "") ico.innerHTML = ICON.coin;

  var lb = $("lobbyHearts");
  if(lb){
    var hh = "";
    for(i=0;i<MAX_HEARTS;i++) hh += ICON.heart;
    lb.innerHTML = hh;
  }

  var lv = $("lobbyLv");
  if(lv){
    lv.textContent = stageTagText(n, tier);
    lv.className = "lvChip" + (m.kind === "pat" ? "" : " " + m.kind);
  }
  var dn = $("lobbyDone");
  if(dn){
    if(tierDone(n, tier)){ dn.innerHTML = IC_CK + "CLEAR"; show(dn); }
    else hide(dn);
  }
  var t = $("lobbyTitle"); if(t) t.textContent = boardTitleOf(n);
  var bk = $("lobbyKo");   if(bk) bk.textContent = boardKoOf(n);
  var s = $("lobbySub");
  if(s){
    s.textContent = lk ? tierNeedDesc(n, tier) : tierHint(n, tier);
    s.className = "boardSub" + (lk ? " lock" : "");
  }
  var ex = exampleOf(n);
  var e1 = $("lobbyEgEn"), e2 = $("lobbyEgKo");
  if(e1) e1.textContent = ex ? ex.en : "";
  if(e2) e2.textContent = ex ? ex.ko : "";
  var cl = $("lobbyCleared"); if(cl) cl.textContent = done + "/" + STAGES_TOTAL;
  var rk = $("lobbyRank"); if(rk) rk.textContent = travelRank(done);
  /* 게이지는 '이 스테이지'의 진행도 — 깬 스테이지는 100% 꽉 찬 골드 게이지 */
  var pr = tierDone(n, tier) ? 1 : (+store.stageProg[kk] || 0);
  var bar = $("lobbyBar");
  if(bar){
    bar.style.width = Math.round(Math.max(0, Math.min(1, pr)) * 100) + "%";
    bar.className = (pr >= 0.999) ? "done" : "";
  }
  /* 이번 단계에서 몇 문장까지 갔는지 — 클리어했으면 꽉 찬다 */
  var gNow = tierGoal(n, tier);
  var cntNow = tierDone(n, tier) ? gNow : (+(store.stageProgN && store.stageProgN[kk]) || 0);
  var pt = $("lobbyProgTxt");
  if(pt) pt.textContent = cntNow + " / " + gNow + "문장";
  var sb = $("lobbyStageBest");
  if(sb){
    var sbv = +(store.stageBest && store.stageBest[kk]) || 0;
    sb.textContent = sbv > 0 ? sbv.toLocaleString() : "-";
  }
  var sc = $("lobbyStageCombo");
  if(sc){
    var scv = +(store.stageCombo && store.stageCombo[kk]) || 0;
    sc.textContent = scv > 0 ? String(scv) : "-";
  }
  var ls = $("lobbyStars");
  if(ls){
    var sh = "", si;
    if(m.kind === "pat"){
      for(si=1;si<=3;si++){
        var sDone = tierDone(n, si), sLk = tierLocked(n, si);
        sh += '<button class="bpStar btn' + (sDone ? " on" : "") + (si === tier ? " sel" : "") + (sLk ? " lock" : "") +
              '" data-tier="' + si + '" aria-label="' + si + '단계">' + (sDone ? ICON.star : ICON.starOff) + '</button>';
      }
    } else {
      var stars = +(store.stageStars && store.stageStars[String(n)]) || ((store.stageDone && store.stageDone[String(n)]) ? 3 : 0);
      for(si=0;si<3;si++) sh += '<i class="bpStar' + (si < stars ? " on" : "") + '">' + (si < stars ? ICON.star : ICON.starOff) + '</i>';
    }
    ls.innerHTML = sh;
  }
  var bl = $("btnStartLabel");
  if(bl){
    if(lk) bl.innerHTML = '<span class="iLock">' + lockSVG() + '</span>' + tierNeedShort(n, tier);
    else bl.textContent = btnLabel(n, tier) + " 시작!";
  }
  var locked = lk;
  var cb = $("lobbyCombo"); if(cb) cb.textContent = "최고 콤보 " + (store.bestCombo || 0);
  var ht = $("lobbyHeartsTxt"); if(ht) ht.textContent = "하트 " + MAX_HEARTS;
  var av = $("lobbyAvatar"); if(av && av.innerHTML === "") av.innerHTML = mascotSVG();
  var bm = $("boardMascot"); if(bm && bm.innerHTML === "") bm.innerHTML = mascotSVG();
  var ag = $("avatarGear"); if(ag && ag.innerHTML === "") ag.innerHTML = IC_GEAR;
  var bi = $("btnStart");
  if(bi){
    bi.setAttribute("data-stage", String(n));
    bi.setAttribute("data-tier", String(tier));
    bi.disabled = locked;
    bi.className = "btn3 mint btnStart3d" + (locked ? " locked" : "");
  }
  var pv = $("btnStagePrev"), nx = $("btnStageNext");
  if(pv){ if(pv.innerHTML === "") pv.innerHTML = IC_LEFT; pv.disabled = (n <= 1); }
  if(nx){ if(nx.innerHTML === "") nx.innerHTML = IC_RIGHT; nx.disabled = (n >= STAGES_TOTAL); }
  var cbk = $("chipBook"); if(cbk) cbk.textContent = clearedCount() + "/" + DATA.length;
  var csu = $("chipSurv"); if(csu) csu.textContent = totalStars() + "/" + MAX_STARS;
  var cib = $("chipIcoBook"); if(cib && cib.innerHTML === "") cib.innerHTML = ICON.book;
  var cic = $("chipIcoCrown"); if(cic && cic.innerHTML === "") cic.innerHTML = ICON.star;
}
/* 보드 화살표 — 여정 지도에 들어가지 않고 단계를 넘겨본다 */
function stepLobby(d){
  var n = Math.max(1, Math.min(STAGES_TOTAL, (V.stage || 1) + d));
  if(n === V.stage) return;
  V.stage = n;
  V.tier = defaultTier(n);
  if(store.sound) beep(620 + (d > 0 ? 90 : 0), 0.05, "sine", 0.05);
  paintLobby();
}

/* ══════════ 12d. 여정 맵 ══════════ */
function openJourney(){
  hideSheets();
  V.jSel = 0;
  hide($("jCard"));
  if(elJScroll && elJScroll.classList) elJScroll.classList.remove("padcard");
  setView("journey");
  buildJourney();
  var raf = window.requestAnimationFrame || function(f){ return setTimeout(f, 16); };
  raf(function(){ buildJourney(); scrollToNow(); });
}
function scrollToNow(){
  if(!elJScroll || !elJScroll.querySelector) return;
  var now = elJScroll.querySelector(".jNode.now");
  if(!now) return;
  var top = now.offsetTop || 0;
  elJScroll.scrollTop = Math.max(0, top - Math.round((elJScroll.clientHeight || 400) * 0.56));
}
function buildJourney(){
  if(!elJNodes || !elJMap) return;
  var n = STAGES.length, i, m;
  var box = null;
  try{ box = elJScroll.getBoundingClientRect ? elJScroll.getBoundingClientRect() : null; }catch(e){ box = null; }
  var W = Math.round((box && box.width) || elJScroll.clientWidth || elViewJourney.clientWidth || 350);
  if(W < 200) W = Math.round((elViewJourney.clientWidth || 350));
  if(W < 200) W = 350;
  var gap = 104, padTop = 140, padBot = 132;
  var H = padTop + padBot + (n - 1) * gap;
  V.jW = W; V.jH = H; V.pos = [];
  elJMap.style.width = W + "px";
  elJMap.style.height = H + "px";
  elJMap.style.margin = "0 auto";

  var amp = Math.max(38, W * 0.225), cx = W / 2;
  var jx = [], jy = [];
  for(i=0;i<n;i++){
    var x = cx + Math.sin(i * 0.78 + 0.4) * amp + Math.cos(i * 1.63) * 6;
    x = Math.max(60, Math.min(W - 60, x));
    jx.push(x);
    jy.push(H - padBot - i * gap);
    V.pos.push({ x:x, y:H - padBot - i * gap });
  }

  /* 길 — 점들을 부드럽게 잇는 곡선 */
  function pt(k){ return { x:jx[Math.max(0, Math.min(n-1, k))], y:jy[Math.max(0, Math.min(n-1, k))] }; }
  var d = "M" + jx[0].toFixed(1) + " " + jy[0].toFixed(1);
  for(i=0;i<n-1;i++){
    var p0 = pt(i-1), p1 = pt(i), p2 = pt(i+1), p3 = pt(i+2);
    var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
  }
  if(elJPath){
    elJPath.setAttribute("viewBox", "0 0 " + W + " " + H);
    elJPath.setAttribute("width", W);
    elJPath.setAttribute("height", H);
    elJPath.innerHTML =
      '<path d="' + d + '" fill="none" stroke="#BFEBDB" stroke-width="38" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="#FFFFFF" stroke-width="30" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="#A6E9D3" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 13"/>';
  }

  /* 여정 하늘 풍경 — 홈 로비와 같은 민트 톤(햇살·구름·부드러운 언덕).
     언덕은 가장자리가 번지는 민트 덩어리로 깔아 길·노드를 가리지 않는다. */
  if(elJDeco){
    var sc = "", srng = makeRng(9137), sk, cy2, cw, mw2, mh2, mx2;
    sc += '<span class="sun"></span>';
    /* 구름 */
    for(sk=0; sk<Math.ceil(H/440)+1; sk++){
      cy2 = 34 + sk*440 + Math.round(srng()*150);
      cw = 62 + Math.round(srng()*52);
      sc += '<span class="cloud" style="left:' + Math.round(srng()*Math.max(30, W-cw-10)) + 'px;top:' + cy2 +
            'px;width:' + cw + 'px;height:' + Math.round(cw*0.44) + 'px;opacity:' + (0.8 + srng()*0.2).toFixed(2) + '">' + cloudSVG() + '</span>';
    }
    /* 부드러운 민트 언덕 — 좌우 가장자리 위주로 번지게 */
    for(sk=0; sk<Math.ceil(H/300)+1; sk++){
      mw2 = 250 + Math.round(srng()*190);
      mh2 = 120 + Math.round(srng()*100);
      mx2 = (sk % 2 === 0) ? (-Math.round(mw2*0.42) + Math.round(srng()*40))
                           : (W - Math.round(mw2*0.58) - Math.round(srng()*40));
      sc += '<span class="mound' + (sk % 3 === 0 ? " deep" : "") + '" style="left:' + mx2 +
            'px;top:' + (110 + sk*300 + Math.round(srng()*70)) + 'px;width:' + mw2 + 'px;height:' + mh2 +
            'px;opacity:' + (0.58 + srng()*0.26).toFixed(2) + '"></span>';
    }
    var dh = sc;
    elJDeco.innerHTML = dh;
  }

  /* 노드 */
  var out = "", kind, done;
  for(i=0;i<n;i++){
    m = STAGES[i];
    kind = m.kind;
    done = !!store.stageDone[String(m.n)];
    var lk = stageLocked(m.n);
    var cls = "jNode kind-" + kind + (done ? " done" : "") + (lk ? " lock" : "") + (m.n === (store.lastStage || 1) ? " now" : "");
    out += '<button class="' + cls + '" data-stg="' + m.n + '" aria-label="' + esc(stageLine(m.n)) +
           '" style="left:' + jx[i].toFixed(1) + 'px;top:' + jy[i].toFixed(1) + 'px">';
    out += '<span class="jBase"></span>';
    if(kind === "mix" || kind === "final"){
      out += chestSVG();
      out += '<span class="jNo">' + m.n + '</span>';
      out += '<span class="jCap">' + (kind === "mix" ? ("MIX " + m.mix) : "FINAL") + '</span>';
    } else if(kind === "inf"){
      out += '<span class="jPod gold"></span><span class="jNum">37</span>';
      out += crownSVG();
      out += '<span class="jCap">무한전</span>';
    } else {
      out += '<span class="jPod"></span>';
      out += '<span class="jFlag"><span class="pole"></span><span class="cloth"></span></span>';
      out += '<span class="jNum">' + m.n + '</span>';
      var tcn = tierCount(m.n), tsn = "", tsi;
      for(tsi=0;tsi<3;tsi++) tsn += '<i class="' + (tsi < tcn ? "on" : "") + '">' + IC_TIER_STAR + '</i>';
      out += '<span class="jTier">' + tsn + '</span>';
    }
    if(lk) out += '<span class="jLock">' + lockSVG() + '</span>';
    if(done && kind !== "inf") out += '<span class="jChk">' + IC_CK + '</span>';
    if(m.n === (store.lastStage || 1)){
      var mLeft = (jx[i] > W * 0.52) ? -80 : 32;
      out += '<span class="jMascot" style="margin-left:' + mLeft + 'px">' + mascotSVG() + '</span>';
    }
    out += '</button>';
  }
  elJNodes.innerHTML = out;
  if(elJCount) elJCount.textContent = clearedStages() + " / " + STAGES_TOTAL;
  V.jBuilt = true;
  if(V.jSel) paintJSelect();
}
/* 노드를 누르면 바로 시작하지 않고, 정보 카드를 먼저 띄운다 */
function showJCard(n){
  V.jSel = n;
  V.jTier = defaultTier(n);
  paintJCard(n, V.jTier);
  show($("jCard"));
  if(elJScroll && elJScroll.classList) elJScroll.classList.add("padcard");
  paintJSelect();
}
/* 여정 카드의 한 줄 요약 — 깬 단계 + 다음 단계가 열리는 조건 */
function tierNoteOf(n){
  var m = stageMeta(n), t, done = [], firstLock = 0;
  if(m.kind !== "pat") return "";
  for(t=1;t<=3;t++){
    if(tierDone(n, t)) done.push(String(t));
    else if(!firstLock && tierLocked(n, t)) firstLock = t;
  }
  if(!firstLock) return done.length === 3 ? "Easy·Normal·Hard 모두 완료" : (done.join("·") + " 완료");
  var cond;
  if(stageLocked(n)) cond = lvStageLabel(needStageOf(n)) + " 성공 시 오픈";
  else if(!tierDone(n, firstLock - 1)) cond = "Lv." + n + " " + TIER_NAMES[firstLock - 1] + " 성공 시 오픈";
  else cond = lvStageLabel(tierNeed(n, firstLock)) + " 성공 시 오픈";
  return (done.length ? done.join("·") + " 완료 · " : "") + TIER_NAMES[firstLock] + "는 " + cond;
}
/* 카드 내용 — 고른 단계의 이름·문장 수·기록과 시작 버튼 */
function paintJCard(n, tier){
  var m = stageMeta(n), dn;
  var t = (m.kind === "pat") ? Math.max(1, Math.min(3, tier || 1)) : 1;
  V.jTier = t;
  var lk = tierLocked(n, t);
  var lv = $("jCardLv"); if(lv) lv.textContent = stageTagText(n, t);
  var nm = $("jCardName"); if(nm) nm.textContent = boardTitleOf(n);
  var mt = $("jCardMeta");
  if(mt) mt.textContent = (m.kind === "inf") ? "무한 · 살아남기" : tierHint(n, t);
  var tp = $("jCardTiers"); if(tp) tp.innerHTML = tierPills(n, t);
  var tn = $("jCardTierNote"); if(tn) tn.textContent = tierNoteOf(n);
  dn = $("jCardDone");
  if(dn){
    if(tierDone(n, t)){ dn.innerHTML = IC_CK + "CLEAR"; show(dn); }
    else hide(dn);
  }
  var jb = $("btnJStart");
  if(jb){
    jb.disabled = lk;
    if(lk) jb.innerHTML = '<span class="iLock">' + lockSVG() + '</span>' + tierNeedShort(n, t);
    else jb.textContent = "시작하기";
    jb.className = "jCardBtn" + (lk ? " lock" : "");
  }
  var jc = $("jCard"); if(jc) jc.className = "jCard" + (lk ? " lock" : "");
}
function hideJCard(){
  V.jSel = 0;
  hide($("jCard"));
  if(elJScroll && elJScroll.classList) elJScroll.classList.remove("padcard");
  paintJSelect();
}
/* 선택한 노드 표시 + 현재 위치 마스코트를 그 노드로 옮긴다 */
function paintJSelect(){
  if(!elJNodes || !elJNodes.getElementsByTagName) return;
  var kids = elJNodes.getElementsByTagName("button"), i, j, node, sel = null, mas = null, sp;
  for(i=0;i<kids.length;i++){
    node = kids[i];
    if(!node.getAttribute) continue;
    if(V.jSel && String(node.getAttribute("data-stg")) === String(V.jSel)){
      if(node.classList) node.classList.add("sel");
      sel = node;
    } else if(node.classList){
      node.classList.remove("sel");
    }
    sp = node.getElementsByTagName ? node.getElementsByTagName("span") : [];
    for(j=0;j<sp.length;j++) if(sp[j].className === "jMascot"){ mas = sp[j]; break; }
  }
  if(sel && mas && sel.appendChild){
    var sx = parseFloat(sel.style.left) || 0, mw = elJMap ? elJMap.clientWidth || 360 : 360;
    mas.style.marginLeft = (sx > mw * 0.52 ? -80 : 32) + "px";
    sel.appendChild(mas);
  }
}
/* 엔진·호스트가 부르는 스테이지 목록 = 여정 맵 */
function renderStages(){ openJourney(); }

/* ══════════ 12e. 도감 ══════════ */
function buildBook(){
  var i, h = "", lastP = -1, pn = 0;
  for(i=0;i<DATA.length;i++){
    var d = DATA[i], done = !!store.cleared[String(d.id)];
    if(d.p !== lastP){
      if(lastP !== -1) h += "</div>";
      h += '<div class="pgroup"><h3>' + esc(PATTERNS[d.p]) + (PAT_KO[d.p] ? ' <span class="pko">' + esc(PAT_KO[d.p]) + '</span>' : "") +
           "<em>" + patternCount(d.p) + "문장</em></h3>";
      lastP = d.p;
      pn = 0;
    }
    h += '<div class="brow' + (done ? " done" : "") + '" data-say="' + esc(d.en) + '">' +
         '<div class="num">' + (++pn) + "</div>" +
         '<div class="txt"><b>' + esc(d.en) + " </b><span>" + esc(d.ko) + "</span></div>" +
         '<div class="lv">L' + d.lv + "</div>" +
         '<div class="chk">' + (done ? ICON.check : "") + "</div>" +
         "</div>";
  }
  if(lastP !== -1) h += "</div>";
  elBookBody.innerHTML = h;
  elBookBody.scrollTop = 0;
  elBookCnt.textContent = clearedCount() + " / " + DATA.length;
}
function openBook(){
  hideSheets();
  buildBook();
  setView("book");
}
function closeBook(){
  goLobby();
}
function refreshStart(){ paintLobby(); }

/* ══════════ 12f. 시트 · 별 ══════════ */
function paintStars(got){
  if(!elStars) return;
  var h = "", i;
  for(i=0;i<3;i++) h += '<i class="st' + (i < got ? " on" : " off") + '">' + ((i < got) ? ICON.star : ICON.starOff) + "</i>";
  elStars.innerHTML = h;
}
function openPause(){
  if(S.mode !== "play" || S.lock) return;
  S.mode = "paused";
  bgmStop();
  $("pScore").textContent = String(S.score);
  $("pClear").textContent = isInfStage(S.stage) ? ("생존 " + S.clears) : (S.clears + "/" + S.goal);
  $("pCombo").textContent = String(S.combo);
  show(elSheetPause);
}
function closePause(){
  hide(elSheetPause);
  if(S.mode === "paused"){
    S.mode = "play";
    lastTs = 0;
    bgmStart();
  }
}
function openSettings(){
  $("setBest").textContent = String(store.best || 0);
  $("setCombo").textContent = String(store.bestCombo || 0);
  $("setCleared").textContent = clearedStages() + "/" + STAGES_TOTAL;
  $("btnSetSound").innerHTML = (store.sound ? ICON.mute : ICON.sound) + "<span>" + (store.sound ? "사운드 끄기" : "사운드 켜기") + "</span>";
  show(elSheetSet);
}

/* ══════════ 12g. 연출 추가 ══════════ */
function shakeScreen(n){
  var a = elApp;
  if(!a || !a.animate) return;
  var d = n >= 3 ? 9 : (n === 2 ? 6 : 4);
  try{
    a.animate([
      {transform:"translate(0,0)"},
      {transform:"translate(" + (-d) + "px," + (d * 0.45) + "px)"},
      {transform:"translate(" + d + "px," + (-d * 0.35) + "px)"},
      {transform:"translate(" + (-d * 0.4) + "px,0)"},
      {transform:"translate(0,0)"}
    ], {duration: n >= 3 ? 320 : 210, easing:"ease-out"});
  }catch(e){}
}
function goldPulse(){
  var d = document.createElement("div");
  d.className = "goldpulse";
  document.body.appendChild(d);
  if(d.animate){
    d.animate([{opacity:0},{opacity:.95, offset:.22},{opacity:0}], {duration:620, easing:"ease-out"});
  }
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 660);
}
function heartPulse(){
  if(!elHearts) return;
  var box = null;
  try{ box = elHearts.getBoundingClientRect(); }catch(e){ box = null; }
  if(!box || !box.width) return;
  var d = document.createElement("div");
  d.className = "heartpulse";
  d.style.left = (box.left + box.width / 2 - 26) + "px";
  d.style.top = (box.top + box.height / 2 - 26) + "px";
  document.body.appendChild(d);
  if(d.animate){
    d.animate([{transform:"scale(.4)", opacity:.95},{transform:"scale(2.1)", opacity:0}], {duration:640, easing:"cubic-bezier(.2,.9,.3,1)"});
  }
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 700);
}
function fireRecoil(){
  if(!elFire) return;
  elFire.className = S.slots.length ? "fire" : "fire dim";
  elFire.classList.add("recoil");
  setTimeout(function(){ if(elFire) elFire.classList.remove("recoil"); }, 300);
}

/* ══════════ 13. 루프 ══════════ */
var lastTs = 0;
var MIN_ROW_GAP = 10;      /* 줄과 줄 사이 최소 여백(px) — 겹쳐 보이지 않게 */
function update(dt){
  if(S.mode !== "play") return;
  var lh = (elLane && elLane.clientHeight) || 0;
  if(lh > 0 && Math.abs(lh - S.laneH) > 3) layout();
  var gap = spawnGap();
  var v = S.pitch / gap;
  S.v = v; S.accel = accelOf(S.combo);
  var i, r;
  for(i=0;i<S.rows.length;i++){
    r = S.rows[i];
    r.y += v*(r.spd || 1)*dt;
  }
  /* 발사 판정(S.lock) 중에는 다른 줄이 바닥에 닿지 않게 잠시 세운다 —
     폭발 연출이 끝나기 전에 바닥 충돌이 끼어들어 타겟·단어판·콤보를 덮어쓰지 않도록. */
  if(S.lock){
    var holdY = Math.max(0, S.laneH - S.R - 6);
    for(i=0;i<S.rows.length;i++){
      r = S.rows[i];
      if(r && !r.dead && r.y > holdY) r.y = holdY;
    }
  }
  /* ── 겹침 방지 ──
     위(빠른) 줄이 바로 아래(느린) 줄을 따라잡지 못하게 한다. 아래 줄은 그대로 두고
     위 줄의 y를 '아래 줄 y - (R + 여백)'로 묶어, 어떤 속도 조합에서도 두 줄이 포개지지 않는다. */
  var order = S.rows.slice().sort(function(a,b){ return a.y - b.y; });
  var minGap = S.R + MIN_ROW_GAP;
  for(i=order.length-1;i>0;i--){
    var below = order[i], above = order[i-1];
    if(below.y - above.y < minGap) above.y = below.y - minGap;
  }
  S.spawnT += dt;
  if(S.spawnT >= gap){
    var topY = Infinity;
    for(i=0;i<S.rows.length;i++) if(S.rows[i].y < topY) topY = S.rows[i].y;
    /* 맨 위 줄이 아직 위쪽에 걸려 있으면 새 줄은 잠시 기다린다(스폰 직후 포개짐 방지) */
    if(S.rows.length < MAX_ROWS && topY >= S.R + 14){
      S.spawnT = Math.max(0, S.spawnT - gap);
      spawnRow();
    } else {
      S.spawnT = gap;
    }
  }
  var inD = false;
  for(i=0;i<S.rows.length;i++){
    r = S.rows[i];
    if(r.y + S.R >= S.laneH * 0.72) inD = true;
    if(r.y + S.R >= S.laneH){ crashRow(r); break; }
  }
  S.danger = inD;
  if(elSky && elSky.classList){
    if(inD) elSky.classList.add("inDanger");
    else elSky.classList.remove("inDanger");
  }
  paintRows();
}
function frame(ts){
  var dt = lastTs ? Math.min(80, ts - lastTs) : 16;
  lastTs = ts;
  update(dt);
  try{ window.requestAnimationFrame(frame); }catch(e){}
}

/* ══════════ 14. 이벤트 ══════════ */
on(elPool, TAP, function(e){
  var t = e.target;
  while(t && t !== elPool && !(t.getAttribute && t.getAttribute("data-i") !== null && t.getAttribute("data-i") !== undefined)) t = t.parentNode;
  if(!t || t === elPool) return;
  var i = parseInt(t.getAttribute("data-i"), 10);
  if(!isNaN(i)) tapBlock(i);
});
on(elSlots, TAP, function(e){
  var t = e.target;
  while(t && t !== elSlots && !(t.getAttribute && t.getAttribute("data-pos") !== null)) t = t.parentNode;
  if(!t || t === elSlots) return;
  var p = parseInt(t.getAttribute("data-pos"), 10);
  if(!isNaN(p)) removeSlot(p);
});
function onSkyTap(e){
  var t = e.target;
  while(t && t !== elSky && !(t.getAttribute && t.getAttribute("data-uid"))) t = t.parentNode;
  if(t && t !== elSky){
    var uid = parseInt(t.getAttribute("data-uid"), 10);
    if(!isNaN(uid)) return selectTarget(uid);
  }
  if(!elLane || !S.rows.length) return;
  var rect = elLane.getBoundingClientRect();
  var cy = (e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY) || 0;
  var py = cy - rect.top;
  for(var i=0;i<S.rows.length;i++){
    var r = S.rows[i];
    if(py >= r.y - 10 && py <= r.y + S.R + 10) return selectTarget(r.uid);
  }
}
on(elSky, "pointerdown", onSkyTap);
on(elSky, "touchstart", onSkyTap);
on(elSky, "click", onSkyTap);
on(elFire, "click", function(){ unlockAudio(); fireRecoil(); fire(); });
on($("btnClear"), "click", clearSlots);

on($("btnStart"), "click", function(){
  unlockAudio();
  var st = parseInt($("btnStart").getAttribute("data-stage"), 10);
  var tr = parseInt($("btnStart").getAttribute("data-tier"), 10);
  startStage(isNaN(st) ? store.lastStage : st, isNaN(tr) ? 1 : tr);
});
/* 보드의 3단계 알약 — 잠긴 단계도 미리 골라 해금 조건을 볼 수 있다 */
on($("boardCard"), "click", function(e){
  var el = e.target, box = $("boardCard");
  while(el && el !== box && !(el.getAttribute && el.getAttribute("data-tier"))) el = el.parentNode;
  if(!el || el === box) return;
  var t = parseInt(el.getAttribute("data-tier"), 10);
  if(!isNaN(t)){ unlockAudio(); selectTier(t); }
});
/* 홈 보드의 < > — 단계를 넘겨보고, 시작은 아래 버튼으로 */
on($("btnStagePrev"), "click", function(){ unlockAudio(); stepLobby(-1); });
on($("btnStageNext"), "click", function(){ unlockAudio(); stepLobby(1); });
on($("btnProfileSet"), "click", function(){ openSettings(); });
on(elSheetSet, "click", function(e){ if(e.target === elSheetSet) hide(elSheetSet); });
on($("btnSetSound"), "click", function(){
  store.sound = !store.sound;
  paintSound(); save(); openSettings();
  if(store.sound){ unlockAudio(); beep(880, 0.08, "sine", 0.06); if(S.mode === "play") bgmStart(); }
  else bgmStop();
});
on($("btnSetBook"), "click", function(){ hide(elSheetSet); openBook(); });

/* 하단 탭 */
if(elTabbar){
  on(elTabbar, "click", function(e){
    var t = e.target;
    while(t && t !== elTabbar && !(t.getAttribute && t.getAttribute("data-tab"))) t = t.parentNode;
    if(!t || t === elTabbar) return;
    var tab = t.getAttribute("data-tab");
    if(tab === "book"){ openBook(); }
    else if(tab === "journey"){ openJourney(); }
    else { goLobby(); }
  });
}
/* 여정 노드 — 누르면 정보 카드만 띄운다(바로 시작하지 않는다) */
on(elJNodes, "click", function(e){
  var t = e.target;
  while(t && t !== elJNodes && !(t.getAttribute && t.getAttribute("data-stg"))) t = t.parentNode;
  if(!t || t === elJNodes) return;
  var n = parseInt(t.getAttribute("data-stg"), 10);
  if(isNaN(n)) return;
  unlockAudio();
  showJCard(n);
});
on($("btnJStart"), "click", function(){
  unlockAudio();
  if(V.jSel) startStage(V.jSel, V.jTier);
});
/* 여정 카드의 3단계 알약 */
on($("jCard"), "click", function(e){
  var el = e.target, box = $("jCard");
  while(el && el !== box && !(el.getAttribute && el.getAttribute("data-tier"))) el = el.parentNode;
  if(!el || el === box) return;
  var t = parseInt(el.getAttribute("data-tier"), 10);
  if(isNaN(t) || !V.jSel) return;
  unlockAudio();
  V.jTier = t;
  paintJCard(V.jSel, t);
});
on(elJMap, "click", function(e){
  if(e.target === elJMap) hideJCard();
});

on(elBookBody, "click", function(e){
  var t = e.target;
  while(t && t !== elBookBody && !(t.getAttribute && t.getAttribute("data-say"))) t = t.parentNode;
  if(!t || t === elBookBody) return;
  sayEn(t.getAttribute("data-say"));
});

on($("btnNextStage"), "click", function(){
  var n = parseInt($("btnNextStage").getAttribute("data-next"), 10);
  var t = parseInt($("btnNextStage").getAttribute("data-tier"), 10);
  unlockAudio();
  startStage(isNaN(n) ? S.stage : n, isNaN(t) ? 1 : t);
});
on($("btnAgain"), "click", function(){ unlockAudio(); startStage(S.stage, S.tier || 1); });
on($("btnResume"), "click", function(){ unlockAudio(); closePause(); });
on($("btnQuit"), "click", function(){ hide(elSheetPause); endRun("over"); });
on($("btnPause"), "click", openPause);
on($("btnPauseBook"), "click", function(){ openBook(); });
on($("btnPauseStages"), "click", function(){ hide(elSheetPause); S.mode = "over"; bgmStop(); openJourney(); });
on($("btnClearStages"), "click", function(){ hide(elSheetClear); openJourney(); });
on($("btnOverStages"), "click", function(){ hide(elSheetOver); openJourney(); });
on($("btnClearHome"), "click", function(){ goLobby(); });
on($("btnOverHome"), "click", function(){ goLobby(); });
on($("btnSound"), "click", function(){
  store.sound = !store.sound;
  paintSound(); save();
  if(store.sound){
    unlockAudio();
    beep(880, 0.08, "sine", 0.06);
    if(S.mode === "play") bgmStart();
  } else {
    bgmStop();
  }
});
on(window, "resize", function(){
  fitApp(); layout();
  if(V.cur === "journey") buildJourney();
});
on(window, "orientationchange", function(){ setTimeout(function(){ fitApp(); layout(); if(V.cur === "journey") buildJourney(); }, 120); });
if(document.addEventListener){
  document.addEventListener("visibilitychange", function(){
    if(document.hidden){
      bgmStop();
      if(S.mode === "play" && S.rows.length) openPause();
    } else if(S.mode === "play"){
      bgmStart();
    }
  }, false);
}

/* ══════════ 15. 호스트 ══════════ */
if(window.pickle && window.pickle.widget){
  window.pickle.widget.oncommand = function(cmd){
    var parts = String(cmd || "").trim().split(/\s+/);
    var c = parts[0];
    if(c === "start" || c === "restart"){
      var n = parseInt(parts[1], 10);
      startStage(isNaN(n) ? store.lastStage : n);
    } else if(c === "stage" || c === "level"){
      var arg = parts[1] || "", s2 = NaN;
      if(/무한|inf|surv|endless/i.test(arg)) s2 = STAGES_TOTAL;
      else if(/final/i.test(arg)) s2 = LAST_LEVEL;
      else if(/^mix/i.test(arg)){
        var mi = parseInt(parts[2], 10);
        s2 = (mi >= 1 && mi <= 5) ? 6*mi : NaN;
      } else s2 = parseInt(arg, 10);
      if(isNaN(s2) || s2 < 1 || s2 > STAGES_TOTAL) throw new Error("1~" + STAGES_TOTAL + " 사이의 스테이지를 입력하세요.");
      startStage(s2);
    } else if(c === "stages" || c === "journey" || c === "map"){
      openJourney();
    } else if(c === "home" || c === "lobby"){
      goLobby();
    } else if(c === "pause"){
      openPause();
    } else if(c === "resume"){
      closePause();
    } else if(c === "sound"){
      store.sound = !/off|mute|꺼/i.test(parts[1] || "");
      paintSound(); save();
      if(!store.sound) bgmStop();
      else if(S.mode === "play") bgmStart();
    } else if(c === "book"){
      openBook();
    } else if(c === "stop"){
      endRun("over");
    }
  };
}

/* ══════════ 16. 시작 ══════════ */
window.__ui = {
  enterGame: function(){ setView("game"); paintSky(); },
  blocked: function(n, t){
    try{ toast(tierNeedDesc(n, t || 1), true); }catch(e){}
    paintLobby();
  },
  afterRun: function(){
    V.stage = Math.max(1, Math.min(STAGES_TOTAL, store.lastStage || 1));
    V.tier = defaultTier(V.stage);
    paintLobby();
    if(V.cur !== "game") setView("game");
  },
  paint: function(){ paintLobby(); }
};
(function boot(){
  var s;
  fitApp();
  try{
    if(window.visualViewport && window.visualViewport.addEventListener){
      window.visualViewport.addEventListener("resize", fitApp);
      window.visualViewport.addEventListener("scroll", fitApp);
    }
  }catch(e){}
  var pb = $("pPauseBadge"); if(pb) pb.innerHTML = mascotSVG();
  var sb = $("pSetBadge");   if(sb) sb.innerHTML = mascotSVG();
  s = $("btnSound"); if(s) s.innerHTML = ICON.sound;
  s = $("btnPause"); if(s) s.innerHTML = ICON.pause;
  s = $("btnClear"); if(s) s.innerHTML = ICON.undo;
  s = $("btnFire");  if(s) s.innerHTML = ICON.rocket + "<span>발사</span>";
  s = $("scoreIcon"); if(s) s.innerHTML = ICON.coin;
  s = $("overIcon"); if(s) s.innerHTML = ICON.skull;
  s = $("tabIcoBook"); if(s) s.innerHTML = IC_BOOK;
  s = $("tabIcoHome"); if(s) s.innerHTML = IC_HOUSE;
  s = $("tabIcoJourney"); if(s) s.innerHTML = IC_FLAG;
  s = $("btnStagePrev"); if(s) s.innerHTML = IC_LEFT;
  s = $("btnStageNext"); if(s) s.innerHTML = IC_RIGHT;
  s = $("boardSeasonIco"); if(s) s.innerHTML = IC_PLANE;

  paintSound(); paintHearts(); paintScore(); paintCombo(); paintSpeed();
  S.stage = Math.max(1, Math.min(STAGES_TOTAL, store.lastStage || 1));
  S.goal = stageMeta(S.stage).goal;
  S.poolBudget = 14;
  V.stage = S.stage;
  V.tier = defaultTier(S.stage);
  setView("lobby");
  paintLobby();
  paintStage();
  elSlots.className = "slots";
  renderSlots();
  layout();
})();

try{ window.requestAnimationFrame(frame); }catch(e){}

/* 테스트 훅 */
window.__EM100 = {
  S:S, DATA:DATA, PATTERNS:PATTERNS, OPENER:OPENER, store:store, GOAL:GOAL, ICON:ICON, CONF:CONF,
  STAGES_TOTAL:STAGES_TOTAL, LAST_LEVEL:LAST_LEVEL, LEVEL_IDS:LEVEL_IDS, ALL_IDS:ALL_IDS,
  STAGES:STAGES, MIX_EVERY:MIX_EVERY, PAT_STAGES:PAT_STAGES,
  GOAL_PAT:GOAL_PAT, GOAL_MIX:GOAL_MIX, GOAL_FINAL:GOAL_FINAL,
  stageMeta:stageMeta, unlockedMax:unlockedMax, stageLocked:stageLocked, needStageOf:needStageOf, paintSky:paintSky, chapterOf:chapterOf,
  tierLocked:tierLocked, tierDone:tierDone, tierKey:tierKey, tierNeed:tierNeed, tierCount:tierCount,
  tierGoal:tierGoal, tierHint:tierHint, tierMixTo:tierMixTo, tierOpen:tierOpen, defaultTier:defaultTier,
  tierNeedShort:tierNeedShort, tierNeedDesc:tierNeedDesc, nextStageTier:nextStageTier,
  totalStars:totalStars, MAX_STARS:MAX_STARS, tierPills:tierPills, selectTier:selectTier, paintJCard:paintJCard, needStage2:needStage2, needStage3:needStage3,
  sayEn:sayEn, speak:speak,
  stageLine:stageLine, stageSub:stageSub, stageTagText:stageTagText, btnLabel:btnLabel,
  isInfStage:isInfStage, stageHint:stageHint, boardTitleOf:boardTitleOf, PAT_KO:PAT_KO,
  MAX_ROWS:MAX_ROWS, SLOT_MAX:SLOT_MAX, MAX_HEARTS:MAX_HEARTS,
  isBoss:isBoss, buildPool:buildPool, norm:norm, sameSentence:sameSentence, patternsOf:patternsOf,
  countPatterns:countPatterns, levelLabel:levelLabel, stageIds:stageIds, refillQueue:refillQueue,
  queueFor:queueFor, requeueAt:REQUEUE_AT, OPENSET:OPENSET, CONF_PAT:CONF_PAT, confGroup:confGroup,
  builtText:builtText,
  nextSentence:nextSentence, requeue:requeue, queue:function(){ return S.q; },
  tapBlock:tapBlock, removeSlot:removeSlot, fire:fire, clearSlots:clearSlots, selectTarget:selectTarget,
  update:update, startStage:startStage, spawnRow:spawnRow, targetRow:targetRow, setTargetRow:setTargetRow,
  hitRow:hitRow, wrongRow:wrongRow, crashRow:crashRow, stageClear:stageClear, endRun:endRun,
  openBook:openBook, closeBook:closeBook, openPause:openPause, closePause:closePause, renderStages:renderStages,
  removeRow:removeRow, setTargetRow:setTargetRow, travelRank:travelRank, TRAVEL_RANKS:TRAVEL_RANKS,
  openJourney:openJourney, buildJourney:buildJourney, buildBook:buildBook, paintLobby:paintLobby,
  clearedStages:clearedStages, setView:setView, views:V, mascotSVG:mascotSVG, chestSVG:chestSVG,
  travelRank:travelRank, TRAVEL_RANKS:TRAVEL_RANKS,
  patternCount:patternCount, stepLobby:stepLobby, showJCard:showJCard, hideJCard:hideJCard, exampleOf:exampleOf,
  save:save, trapCount:trapCount, prunePool:prunePool, dropOneTrap:dropOneTrap, freezePool:freezePool, paceOf:paceOf, accelOf:accelOf, spawnGap:spawnGap, fallSpeed:fallSpeed,
  multOf:multOf, layout:layout, fitPool:fitPool, paintRows:paintRows, fitRowText:fitRowText,
  bgm:{ B:BGM, start:bgmStart, stop:bgmStop, tick:bgmTick, audio:function(){ return AC; } },
  reported:function(){
    return { mode:S.mode, stage:S.stage, clears:S.clears, score:S.score, hearts:S.hearts,
      combo:S.combo, rows:S.rows.length, target:S.target, slots:S.slots.length,
      pool:S.blocks.length, accel:accelOf(S.combo), view:V.cur };
  }
};
