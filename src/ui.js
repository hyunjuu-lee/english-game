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
  try{ document.body.classList.toggle("zt", name !== "game" && name !== "journey" && name !== "book"); }catch(e){}
  try{ if(typeof applyZone === "function") applyZone(parseInt(($("btnStart") || {getAttribute:function(){return "";}}).getAttribute("data-stage"), 10) || store.lastStage); }catch(e){}
  hide($("viewTail"));
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
/* ── 조이 캐릭터 — 설정에서 고를 수 있다(store.avatar). 기본은 찹쌀떡 판다.
   공통 클래스: pBody(몸 전체 움직임) · pEye(깜빡임) · pRays(햇살 회전) · pWing(날개) · pLeaf(잎) */
var CHAR_ORDER = ["panda","pandaBig","star","sun","bird","peach","cloud","bubble"];
var CHAR_NAME = { panda:"찹쌀떡 판다", pandaBig:"큰눈 판다", star:"별똥별", sun:"해님", bird:"아기새", peach:"복숭아", cloud:"구름", bubble:"말풍선" };
function charSVG(id, u){
  var g = function(a, b){ return '<radialGradient id="' + u + '" cx=".42" cy=".35" r=".8"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></radialGradient>'; };
  var eyes = function(x1, x2, y, rx, ry){ return '<ellipse class="pEye" cx="' + x1 + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#2B1A2A"/><ellipse class="pEye" cx="' + x2 + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#2B1A2A"/>'; };
  var cheek = function(x1, x2, y){ return '<ellipse cx="' + x1 + '" cy="' + y + '" rx="9" ry="6" fill="#FF9FA8" opacity=".75"/><ellipse cx="' + x2 + '" cy="' + y + '" rx="9" ry="6" fill="#FF9FA8" opacity=".75"/>'; };
  var vb = "0 0 200 200", d = "", b = "";
  if(id === "pandaBig"){
    vb = "8 30 184 184"; d = g("#FFFFFF", "#E9ECF2");
    b = '<ellipse cx="46" cy="66" rx="20" ry="20" fill="#2E2A33"/><ellipse cx="154" cy="66" rx="20" ry="20" fill="#2E2A33"/>' +
        '<ellipse cx="100" cy="118" rx="78" ry="66" fill="url(#' + u + ')"/>' +
        '<path d="M70 96c10-6 24 0 26 14 2 16-8 30-20 30-12 0-18-12-16-24 1-10 4-16 10-20z" fill="#2E2A33"/><path d="M130 96c-10-6-24 0-26 14-2 16 8 30 20 30 12 0 18-12 16-24-1-10-4-16-10-20z" fill="#2E2A33"/>' +
        '<g class="pEye"><circle cx="80" cy="116" r="9" fill="#fff"/><circle cx="81" cy="117" r="6" fill="#1E1A22"/><circle cx="83" cy="114" r="2.2" fill="#fff"/></g>' +
        '<g class="pEye"><circle cx="120" cy="116" r="9" fill="#fff"/><circle cx="119" cy="117" r="6" fill="#1E1A22"/><circle cx="121" cy="114" r="2.2" fill="#fff"/></g>' +
        '<ellipse cx="100" cy="140" rx="6" ry="4.2" fill="#2E2A33"/>' + cheek(56, 144, 146);
  } else if(id === "star"){
    d = '<linearGradient id="' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE98A"/><stop offset="1" stop-color="#FFC23D"/></linearGradient>';
    b = '<path d="M100 18c6 0 10 4 13 10l15 31 34 5c13 2 17 15 8 24l-25 24 6 34c2 13-11 21-22 15l-30-16-30 16c-11 6-24-2-22-15l6-34-25-24c-9-9-5-22 8-24l34-5 15-31c3-6 7-10 13-10z" fill="url(#' + u + ')"/>' +
        cheek(70, 130, 112) + eyes(84, 116, 98, 7, 10);
  } else if(id === "sun"){
    d = g("#FFE7A8", "#FF9D5C");
    var r = "", a; for(a=0;a<360;a+=30) r += '<rect x="96" y="8" width="8" height="26" rx="4" fill="#FFC36B" transform="rotate(' + a + ' 100 100)"/>';
    b = '<g class="pRays">' + r + '</g><circle cx="100" cy="100" r="56" fill="url(#' + u + ')"/>' + cheek(70, 130, 112) + eyes(84, 116, 96, 7, 10);
  } else if(id === "bird"){
    d = '<linearGradient id="' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD8FF"/><stop offset="1" stop-color="#4FA8F5"/></linearGradient>';
    b = '<path d="M100 40c38 0 64 28 64 66 0 34-28 58-64 58s-64-24-64-58c0-38 26-66 64-66z" fill="url(#' + u + ')"/>' +
        '<path d="M100 120c22 0 40 10 40 26 0 12-18 18-40 18s-40-6-40-18c0-16 18-26 40-26z" fill="#E8F6FF"/>' +
        '<path d="M150 108l22 6-22 8z" fill="#FFB84D"/><path class="pWing" d="M44 110c-14 4-22 18-18 30 10-2 22-10 26-22z" fill="#3B8EE0"/>' +
        '<path d="M92 40c-4-14 4-22 12-20-4 6-2 12 2 18z" fill="#4FA8F5"/>' + cheek(74, 126, 112) + eyes(86, 114, 96, 7, 10);
  } else if(id === "peach"){
    d = g("#FFD7C2", "#FF8C7A");
    b = '<path d="M100 50c-10-14-40-16-54 8-16 26-8 70 18 92 16 14 30 18 36 18s20-4 36-18c26-22 34-66 18-92-14-24-44-22-54-8z" fill="url(#' + u + ')"/>' +
        '<path d="M100 52c4 30 2 70-6 110" stroke="#F27A6A" stroke-width="4" fill="none" opacity=".45"/>' +
        '<path class="pLeaf" d="M104 46c10-20 34-24 42-16-10 14-26 20-42 16z" fill="#4FCF9C"/>' + cheek(68, 132, 120) + eyes(80, 120, 104, 7, 10);
  } else if(id === "cloud"){
    d = '<linearGradient id="' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE8FF"/></linearGradient>';
    b = '<path d="M56 150c-24 0-40-16-40-36s16-34 36-34c4-24 24-40 48-40 26 0 46 18 50 42 20 2 34 16 34 34 0 20-16 34-38 34z" fill="url(#' + u + ')" stroke="#C9D8F5" stroke-width="2"/>' +
        cheek(72, 136, 128) + eyes(88, 120, 112, 7, 10);
  } else if(id === "bubble"){
    vb = "150 170 720 700";
    d = '<linearGradient id="' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFE4D8"/></linearGradient>';
    b = '<path d="M512 196c-190 0-336 120-336 282 0 92 47 172 122 224l-22 104c-4 19 17 33 33 22l124-80c25 5 52 8 79 8 190 0 336-120 336-278S702 196 512 196z" fill="url(#' + u + ')" stroke="#FFC9B5" stroke-width="10"/>' +
        '<circle cx="350" cy="520" r="30" fill="#FFB3B3" opacity=".75"/><circle cx="674" cy="520" r="30" fill="#FFB3B3" opacity=".75"/>' +
        '<ellipse class="pEye" cx="418" cy="450" rx="32" ry="48" fill="#2B1A2A"/><ellipse class="pEye" cx="606" cy="450" rx="32" ry="48" fill="#2B1A2A"/>';
  } else {
    id = "panda"; vb = "8 26 184 184"; d = g("#FFFFFF", "#E9ECF2");
    b = '<g class="pEarL"><ellipse cx="50" cy="66" rx="17" ry="15" fill="#2E2A33"/></g>' +
        '<g class="pEarR"><ellipse cx="150" cy="66" rx="17" ry="15" fill="#2E2A33"/></g>' +
        '<path d="M100 56c52 0 86 30 86 72 0 34-34 52-86 52s-86-18-86-52c0-42 34-72 86-72z" fill="url(#' + u + ')"/>' +
        '<ellipse cx="72" cy="120" rx="17" ry="14" fill="#2E2A33" transform="rotate(-25 72 120)"/>' +
        '<ellipse cx="128" cy="120" rx="17" ry="14" fill="#2E2A33" transform="rotate(25 128 120)"/>' +
        '<ellipse class="pEye" cx="74" cy="119" rx="4.8" ry="5.8" fill="#FFFFFF"/>' +
        '<ellipse class="pEye" cx="126" cy="119" rx="4.8" ry="5.8" fill="#FFFFFF"/>' +
        '<ellipse cx="100" cy="136" rx="6" ry="4" fill="#2E2A33"/>' + cheek(50, 150, 142);
  }
  return '<svg class="mascot joy c-' + id + '" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg"><defs>' + d + '</defs><g class="pBody">' + b + '</g></svg>';
}
function mascotSVG(id){
  /* 조이 캐릭터(기본 찹쌀떡 판다) — 입 없음, 눈 깜빡임·움직임은 CSS(.mascot.joy) */
  var c = id || (store && store.avatar) || "panda";
  if(CHAR_ORDER.indexOf(c) < 0) c = "panda";
  return charSVG(c, "m" + (++MG_SEQ));
}
/* 화면에 이미 그려진 캐릭터를 모두 지금 고른 캐릭터로 바꾼다 */
function repaintMascots(){
  try{
    var list = document.querySelectorAll("svg.mascot"), i;
    for(i=0;i<list.length;i++){
      var s = list[i];
      if(s.closest && s.closest(".charPick")) continue;
      var w = document.createElement("span"); w.innerHTML = mascotSVG();
      if(s.parentNode) s.parentNode.replaceChild(w.firstChild, s);
    }
  }catch(e){}
}
/* 자물쇠 — 회색 글리프(서리 발판 안 · 레벨 띠 · 난이도 버튼 · 시작 버튼 공통) */
function lockSVG(){
  return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M8.4 10.6V8.4a3.6 3.6 0 0 1 7.2 0v2.2" fill="none" stroke="#9AA7B4" stroke-width="2.2" stroke-linecap="round"/>' +
    '<rect x="5.6" y="10.2" width="12.8" height="9.8" rx="3" fill="#B3BFCA"/>' +
    '<circle cx="12" cy="14.4" r="1.5" fill="#FFFFFF"/>' +
    '<rect x="11.3" y="14.6" width="1.4" height="2.8" rx=".7" fill="#FFFFFF"/>' +
    '</svg>';
}

/* ══════════ 12b-2. 스테이지 게임판 배경 — 6개 챕터 테마 ══════════ */
/* 1~6 라군 · 7~12 오션 · 13~18 바이올렛 · 19~24 선셋 · 25~30 에메랄드 · 31~37 오로라 */
/* 챕터 — 전체 레벨을 6구간으로 고르게 나눈다(레벨 수가 늘어도 그대로) */
function chapterOf(n){ return Math.max(1, Math.min(6, Math.ceil((n || 1) * 6 / STAGES_TOTAL))); }
function chapterSpan(c){ var a = 0, b = 0, k; for(k=1;k<=STAGES_TOTAL;k++){ if(chapterOf(k) === c){ if(!a) a = k; b = k; } } return [a, b]; }
function artClouds(op){
  return '<svg class="artTop" viewBox="0 0 120 20" preserveAspectRatio="xMidYMin meet" height="26%">' +
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
  return '<svg class="artTop" viewBox="0 0 120 40" preserveAspectRatio="xMaxYMin meet" height="34%">' +
    '<circle cx="100" cy="14" r="9" fill="#FFF6E3" opacity=".9"/>' +
    '<circle cx="100" cy="14" r="15" fill="#FFF1D8" opacity=".28"/></svg>';
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
var IC_CK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.6 4.6L19 7.4"/></svg>';
var IC_HOUSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></svg>';
var IC_FLAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>';
var IC_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/></svg>';
var IC_GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>';
var IC_LEFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var IC_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
var IC_TIER_STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.9l2.75 5.6 6.15.9-4.45 4.33 1.05 6.12L12 16.97l-5.5 2.88 1.05-6.12L3.1 9.4l6.15-.9z" fill="currentColor"/></svg>';
var IC_PLANE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5l19-7-5 13-3.5-5.5z"/><path d="M13 14l8.5-7.5"/></svg>';
/* 보물상자 — 블루 톤 두 단계 + 민트 잠금쇠, 외곽선 없음 */
function chestSVG(){
  return '<span class="jChest"><svg viewBox="0 0 64 56" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="32" cy="51.5" rx="22" ry="3.6" fill="#0B3D7A" opacity=".12"/>' +
    '<path d="M9 28h46v16.5a4.5 4.5 0 0 1-4.5 4.5h-37A4.5 4.5 0 0 1 9 44.5z" fill="#1F6FE0"/>' +
    '<path d="M9 40h46v4.5a4.5 4.5 0 0 1-4.5 4.5h-37A4.5 4.5 0 0 1 9 44.5z" fill="#1858B8"/>' +
    '<path d="M9 28C9 19.2 19.3 12.5 32 12.5S55 19.2 55 28z" fill="#3B8BFF"/>' +
    '<path d="M17 22.5c3.4-3 8.4-4.8 13.6-5" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".45"/>' +
    '<rect x="7.5" y="26" width="49" height="5" rx="2.5" fill="#1858B8"/>' +
    '<rect x="26.5" y="25" width="11" height="14" rx="3" fill="#3CECC0"/>' +
    '<rect x="26.5" y="34" width="11" height="5" rx="2.5" fill="#14C89A"/>' +
    '<circle cx="32" cy="31" r="1.9" fill="#04372A"/>' +
    '</svg></span>';
}
/* 왕관 — 오렌지 톤 두 단계 */
function crownSVG(){
  return '<span class="jCrown"><svg viewBox="0 0 56 44" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M6 13l10.5 7L28 6l11.5 14L50 13l-4.5 21h-35z" fill="#FF9A2E"/>' +
    '<path d="M8.6 28h38.8l-1.9 6h-35z" fill="#F07A00"/>' +
    '<circle cx="28" cy="20.5" r="3" fill="#FFF1D6"/>' +
    '<circle cx="6" cy="12" r="2.8" fill="#FFB866"/><circle cx="50" cy="12" r="2.8" fill="#FFB866"/><circle cx="28" cy="5.2" r="3" fill="#FFB866"/>' +
    '</svg></span>';
}

/* ── 소프트 아이콘 세트 — 외곽선·광택 그라디언트 없이, 같은 색 두 톤 + 작은 하이라이트로 통일 ── */
(function(){
  function sv(b){ return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' + b + '</svg>'; }
  function ln(b, w){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round">' + b + '</svg>'; }
  var HEART = "M12 20.4s-7.8-4.8-7.8-10.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 7.8 2.8c0 5.8-7.8 10.6-7.8 10.6z";
  var STAR = "M12 2.9l2.75 5.6 6.15.9-4.45 4.33 1.05 6.12L12 16.97l-5.5 2.88 1.05-6.12L3.1 9.4l6.15-.9z";
  ICON.heart = sv('<path d="' + HEART + '" fill="#FF4D63"/><path d="M12 20.4s-7.8-4.8-7.8-10.6c0-.5.1-1 .2-1.4C6 13.6 12 17.2 12 17.2s6-3.6 7.6-8.8c.1.4.2.9.2 1.4 0 5.8-7.8 10.6-7.8 10.6z" fill="#E0304A"/><ellipse cx="8.4" cy="9.4" rx="1.6" ry="1.1" transform="rotate(-35 8.4 9.4)" fill="#FFFFFF" opacity=".7"/>');
  ICON.heartOff = sv('<path d="' + HEART + '" fill="#DCE3EA"/>');
  ICON.star = sv('<path d="' + STAR + '" fill="#FFC43D"/><path d="M12 16.97l-5.5 2.88 1.05-6.12L3.1 9.4 12 12.6z" fill="#F5A915"/><circle cx="10.2" cy="8.6" r="1" fill="#FFFFFF" opacity=".75"/>');
  ICON.starOff = sv('<path d="' + STAR + '" fill="#D5DDE5"/>');
  ICON.coin = sv('<circle cx="12" cy="12" r="9" fill="#FFC43D"/><path d="M21 12a9 9 0 0 1-18 0 9 7.4 0 0 0 18 0z" fill="#F5A915"/><circle cx="12" cy="11.2" r="5.6" fill="#FFD875"/><path d="M12 7.9l1.05 2.15 2.35.33-1.7 1.66.4 2.34L12 13.27l-2.1 1.1.4-2.34-1.7-1.66 2.35-.33z" fill="#E08E00"/>');
  ICON.flame = sv('<path d="M13.5 2.5c.6 3.3-1.3 5-2.7 6.7-1.4 1.8-3.1 3.5-3.1 6.3a5.6 5.6 0 0 0 11.2.2c0-5-3.3-8.1-5.4-13.2z" fill="#FF6A3D"/><path d="M12.6 12c.5 1.8-.6 2.8-1.2 3.7-.4.6-.7 1.2-.7 1.9a2.5 2.5 0 0 0 5 .1c0-2.4-1.7-3.8-3.1-5.7z" fill="#FFC43D"/>');
  ICON.boss = ICON.flame;
  ICON.bolt = sv('<path d="M13.4 2.5L4.8 13.6h6l-1.2 7.9 8.6-11.1h-6z" fill="#FFC43D"/><path d="M10.8 13.6h-6L13.4 2.5l-1.6 6.1z" fill="#FFD875"/>');
  ICON.rocket = sv('<path d="M12 22c-1.7-2-2.4-3.9-2.2-6.2h4.4c.2 2.3-.5 4.2-2.2 6.2z" fill="#FFC43D"/>' +
    '<path d="M8.7 11.6 5.2 16.2l3.7-1.3zM15.3 11.6l3.5 4.6-3.7-1.3z" fill="#FF6A3D"/>' +
    '<path d="M12 2c2.8 2.1 4.4 5.2 4.4 8.8 0 1.5-.2 2.9-.6 4.2H8.2c-.4-1.3-.6-2.7-.6-4.2C7.6 7.2 9.2 4.1 12 2z" fill="#FFFFFF"/>' +
    '<path d="M12 2c2.8 2.1 4.4 5.2 4.4 8.8 0 1.5-.2 2.9-.6 4.2H12z" fill="#E6ECF4"/>' +
    '<circle cx="12" cy="9.2" r="2.1" fill="#3CECC0"/><circle cx="12" cy="9.2" r="1" fill="#0D9F71"/>');
  ICON.trophy = sv('<path d="M7.2 3.5h9.6v4.6c0 2.7-2.1 4.7-4.8 4.7s-4.8-2-4.8-4.7z" fill="#FFC43D"/><path d="M12 12.8c2.7 0 4.8-2 4.8-4.7V3.5H12z" fill="#F5A915"/><path d="M7.2 5H4.6c0 2.8 1.2 4.4 3 4.8M16.8 5h2.6c0 2.8-1.2 4.4-3 4.8" fill="none" stroke="#F5A915" stroke-width="1.8" stroke-linecap="round"/><path d="M10.8 12.6h2.4v3.6h-2.4zM8 17h8l.6 3.5H7.4z" fill="#E08E00"/>');
  ICON.crown = sv('<path d="M3.5 7.5 7.5 11 12 4.5l4.5 6.5 4-3.5-1.8 10.5H5.3z" fill="#FFC43D"/><path d="M4.6 15h14.8l-.7 3H5.3z" fill="#F5A915"/>');
  ICON.book = sv('<path d="M5 4.2h10.4a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" fill="#2EDDB0"/><path d="M8 14h10.4v6H8a3 3 0 0 1 0-6z" fill="#F4FFFB"/><path d="M8 14h10.4v1.4H8z" fill="#14C89A"/><path d="M9 7.6h5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>');
  ICON.skull = sv('<path d="' + HEART + '" fill="#FF4D63"/><path d="M12.6 7.6l-1.8 3.6 2.6 1.6-1.6 3.6" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>');
  ICON.check = sv('<circle cx="12" cy="12" r="9" fill="#2EDDB0"/><path d="M7.7 12.2l2.9 2.9 5.7-6" fill="none" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>');
  ICON.lock = lockSVG();
  ICON.sound = ln('<path d="M4 9.5v5h3.6L12 18.5v-13L7.6 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>');
  ICON.mute = ln('<path d="M4 9.5v5h3.6L12 18.5v-13L7.6 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>');
  ICON.pause = ln('<path d="M9 6v12M15 6v12"/>', 2.6);
  ICON.play = sv('<path d="M7 4.6v14.8c0 .8.9 1.3 1.6.8l11-7.4c.6-.4.6-1.2 0-1.6l-11-7.4C7.9 3.3 7 3.8 7 4.6z" fill="currentColor"/>');
  ICON.undo = ln('<path d="M9 7L5 11l4 4"/><path d="M5 11h9a5 5 0 0 1 0 10h-2"/>');
  ICON.close = ln('<path d="M6 6l12 12M18 6L6 18"/>', 2.4);
  ICON.map = IC_FLAG;
})();

/* ── 탭 아이콘 (B안 · 듀오톤) — 꺼진 탭은 회색 두 톤, 고른 탭은 민트 두 톤 + 포인트 색 ── */
function tabDuo(on, kind){
  var a = on ? "#2EDDB0" : "#C9D3DC", b = on ? "#14C89A" : "#B3BFCA";
  var s = '<svg class="' + (on ? "tOn" : "tOff") + '" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">';
  if(kind === "book"){
    s += '<path d="M5 5.6A2.6 2.6 0 0 1 7.6 3H19v15.6H7.6A2.6 2.6 0 0 0 5 21.2z" fill="' + a + '"/>' +
         '<path d="M5 21.2a2.6 2.6 0 0 1 2.6-2.6H19V21H7.6z" fill="' + b + '"/>' +
         '<path d="M7.6 18.6H19v1.6H7.6z" fill="#FFFFFF" opacity=".85"/>' +
         '<path d="M13 3v6.4l2-1.5 2 1.5V3z" fill="' + (on ? "#FF6A4D" : "#B3BFCA") + '"/>' +
         '<path d="M8 7h3" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>';
  } else if(kind === "home"){
    s += '<path d="M12 3.4 4.3 9.7a2 2 0 0 0-.8 1.6v8.2A1.5 1.5 0 0 0 5 21h14a1.5 1.5 0 0 0 1.5-1.5v-8.2a2 2 0 0 0-.8-1.6z" fill="' + a + '"/>' +
         '<path d="M3.5 15.2V19.5A1.5 1.5 0 0 0 5 21h14a1.5 1.5 0 0 0 1.5-1.5v-4.3z" fill="' + b + '"/>' +
         '<rect x="9.6" y="13.4" width="4.8" height="7.6" rx="2.2" fill="' + (on ? "#FFC43D" : "#FFFFFF") + '"/>';
  } else {
    s += '<ellipse cx="12" cy="19.6" rx="8.4" ry="2.6" fill="' + a + '"/>' +
         '<ellipse cx="12" cy="19.2" rx="5.2" ry="1.4" fill="#FFFFFF" opacity=".6"/>' +
         '<rect x="7.6" y="3.6" width="2" height="16" rx="1" fill="' + b + '"/>' +
         '<path d="M9.6 4.2h8.2c.7 0 1.1.8.7 1.4l-1.8 2.6 1.8 2.6c.4.6 0 1.4-.7 1.4H9.6z" fill="' + (on ? "#FF6A4D" : "#B3BFCA") + '"/>' +
         '<path d="M9.6 4.2h8.2c.7 0 1.1.8.7 1.4l-.6.9H9.6z" fill="' + (on ? "#FF8E76" : "#C9D3DC") + '"/>';
  }
  return s + '</svg>';
}
function tabIcon(kind){ return tabDuo(false, kind) + tabDuo(true, kind); }

/* ── 여정 풍경 조각 — 로비 일러스트와 같은 톤의 구름·민트 언덕 ── */
var CLOUD_SVG = '<svg viewBox="0 0 100 44" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
  '<g fill="#FFFFFF"><ellipse cx="26" cy="29" rx="23" ry="14"/><ellipse cx="50" cy="20" rx="25" ry="16"/>' +
  '<ellipse cx="74" cy="29" rx="20" ry="13"/></g></svg>';
function cloudSVG(){ return CLOUD_SVG; }
/* ══════════ 12c. 홈 로비 ══════════ */
/* 영어 발음 — 도감 문장 탭과 '정답 조립' 순간에 한 번씩 읽어 준다.
   소리를 꺼 두었으면 조용히 지나가고, 음성 API가 없는 곳에서도 죽지 않는다. */
/* 발음 — iOS 에서 음성이 오디오 세션을 잠깐 가져가므로
   (1) 말하는 동안 BGM 을 살짝 낮추고 (2) 끝나면 오디오를 resume·복귀시키고
   (3) 명중 연출이 먼저 나가도록 조금 늦게 말한다. 음성 목록은 한 번만 찾는다. */
var SAY = { voice:null, looked:false, timer:0, guard:0, active:false, until:0 };
/* 앱이 직접 기록하는 '원어민 음성 재생 중' — 발화 예약 순간부터 끝날 때까지.
   이 동안엔 탭이 오디오를 깨우지 않아 음성이 끊기지 않고, 탭은 화면 처리만 해서 바로 반응한다. */
function voiceBusy(){
  if(SAY.active && Date.now() > SAY.until) SAY.active = false;   /* onend 가 안 와도 시간이 지나면 풀린다 */
  return SAY.active;
}
function sayVoice(sy){
  if(SAY.voice || !sy || !sy.getVoices) return SAY.voice;
  try{
    var vs = sy.getVoices(), i;
    for(i=0;i<vs.length;i++){ if(/en[-_]US/i.test(vs[i].lang) && /samantha|ava|allison|google us/i.test(vs[i].name)){ SAY.voice = vs[i]; break; } }
    if(!SAY.voice) for(i=0;i<vs.length;i++){ if(/en[-_]US/i.test(vs[i].lang)){ SAY.voice = vs[i]; break; } }
  }catch(e){}
  return SAY.voice;
}
try{ if(window.speechSynthesis && "onvoiceschanged" in window.speechSynthesis) window.speechSynthesis.onvoiceschanged = function(){ SAY.voice = null; sayVoice(window.speechSynthesis); }; }catch(e){}
function bgmLevel(v, t){
  try{
    if(!AC || !BGM.master) return;
    var now = AC.currentTime, g = BGM.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(0.0001, g.value || 0.0001), now);
    g.linearRampToValueAtTime(Math.max(0.0001, v), now + (t || 0.15));
  }catch(e){}
}
function sayDone(){
  if(SAY.guard){ clearTimeout(SAY.guard); SAY.guard = 0; }
  SAY.active = false;
  /* 음성이 끝난 뒤 한 번만 오디오를 되살리고, BGM 은 지금 시점부터 이어 간다 */
  var tries = [40, 250, 700, 1500], ti;
  for(ti=0;ti<tries.length;ti++) setTimeout(function(){
    if(isSpeaking()) return;
    try{ if(AC && AC.state !== "running" && AC.resume) AC.resume(); }catch(e){}
    try{ if(window.__kickAudio) window.__kickAudio(); }catch(e){}
    try{ if(store.sound && S.mode === "play" && !BGM.on) bgmStart(); }catch(e){}
    try{ if(BGM.on && AC && BGM.next < AC.currentTime) BGM.next = AC.currentTime + 0.06; }catch(e){}
  }, tries[ti]);
}
/* 음성 엔진 미리 깨우기 — 게임 시작(터치) 때 한 번, 들리지 않는 짧은 발화로 초기화해 둔다 */
function warmSpeech(){
  if(SAY.warm || !store.sound) return;
  try{
    var sy = window.speechSynthesis;
    if(!sy || typeof SpeechSynthesisUtterance === "undefined") return;
    var u = new SpeechSynthesisUtterance(" ");
    u.volume = 0; u.rate = 1; u.lang = "en-US";
    var v = sayVoice(sy); if(v) u.voice = v;
    sy.speak(u);
    SAY.warm = true;
  }catch(e){}
}
/* ── 원어민 발음 파일 ──
   문장마다 미리 만든 mp3(audio/<해시>.mp3)를 Web Audio 로 재생한다. 효과음·BGM 과 같은 통로라
   iOS 에서도 서로 끊거나 막지 않는다. 파일이 없는 문장만 기기 음성(speechSynthesis)으로 읽는다. */
var VOICE_FILES = __VOICE_FILES__;
var VX = { buf:{}, wait:{}, src:null, next:null, curEnd:0 };
function voiceNorm(s){ return String(s || "").replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').trim(); }
function voiceKey(txt){ return VOICE_FILES[voiceNorm(txt)] || ""; }
function voiceLoad(txt, cb){
  var k = voiceKey(txt);
  if(!k){ if(cb) cb(null); return; }
  if(VX.buf[k]){ if(cb) cb(VX.buf[k]); return; }
  if(VX.wait[k]){ if(cb) VX.wait[k].push(cb); return; }
  VX.wait[k] = cb ? [cb] : [];
  function done(b){ var l = VX.wait[k] || []; delete VX.wait[k]; if(b) VX.buf[k] = b; for(var i=0;i<l.length;i++) try{ l[i](b); }catch(e){} }
  try{
    var a = ctx(); if(!a || !window.fetch){ done(null); return; }
    fetch("audio/" + k + ".mp3").then(function(res){ if(!res.ok) throw 0; return res.arrayBuffer(); })
      .then(function(ab){
        var pr = a.decodeAudioData(ab, function(b){ done(b); }, function(){ done(null); });
        if(pr && pr.catch) pr.catch(function(){});
      }).catch(function(){ done(null); });
  }catch(e){ done(null); }
}
window.__voicePre = function(txt){ try{ voiceLoad(txt); }catch(e){} };
window.__voiceState = function(){ return { files:Object.keys(VOICE_FILES).length, loaded:Object.keys(VX.buf).length, playing:!!VX.src, queued:!!VX.next, plays:VX.plays||0 }; };
function voicePlay(b){
  var a = ctx(); if(!a || !b) return false;
  try{
    if(a.state !== "running" && a.resume) a.resume();
    var now = a.currentTime, at = now + 0.02;
    /* 앞 문장이 아직 나오는 중이면 끊지 않고 끝난 직후에 이어서 — 기다리는 건 최신 한 문장만 */
    if(VX.src && VX.curEnd > now){
      at = VX.curEnd + 0.08;
      if(at - now > 1.8) return false;                 /* 너무 밀리면 이번 문장은 건너뛴다 */
      if(VX.next){ VX.next._drop = true; try{ VX.next.stop(); }catch(e){} VX.next = null; }
    }
    var s = a.createBufferSource(); s.buffer = b;
    s.connect(a.destination);
    s.start(at);
    VX.plays = (VX.plays || 0) + 1;
    var end = at + b.duration;
    if(at > now + 0.05){
      VX.next = s;
      setTimeout(function(){ if(VX.next === s){ VX.next = null; VX.src = s; VX.curEnd = end; } }, Math.max(0, (at - now) * 1000));
    } else { VX.src = s; VX.curEnd = end; }
    try{ if(BGM.on) bgmLevel(BGM.duck * 0.4, 0.12); }catch(e){}   /* 말하는 동안 BGM 만 살짝 낮춘다 */
    s.onended = function(){
      if(s._drop) return;
      if(VX.src === s){
        VX.src = null;
        if(!VX.next){ try{ if(BGM.on) bgmLevel(BGM.duck, 0.35); }catch(e){} }
      }
    };
    return true;
  }catch(e){ return false; }
}
function sayEn(txt){
  if(!store.sound) return;
  txt = String(txt || "");
  if(!txt) return;
  if(voiceKey(txt)){
    window.__voiceAsked = txt;
    var t0 = Date.now();
    voiceLoad(txt, function(b){
      if(!b) return;                                   /* 못 받으면 조용히 넘어간다(기기 음성과 섞지 않는다) */
      if(Date.now() - t0 > 1500) return;               /* 너무 늦게 받았으면 지난 문장이라 건너뛴다 */
      var wait = Math.max(0, 160 - (Date.now() - t0)); /* 명중 효과음이 먼저 들리도록 아주 살짝 늦게 */
      if(wait) setTimeout(function(){ voicePlay(b); }, wait); else voicePlay(b);
    });
    return;
  }
  var sy = window.speechSynthesis;
  if(!sy || typeof SpeechSynthesisUtterance === "undefined") return;
  /* 콤보로 빠르게 맞힐 때 음성을 끊고 다시 시작하면 iOS 가 매번 오디오를 가져가 버벅인다 —
     아직 말하는 중이면 이번 문장은 건너뛴다 */
  if(voiceBusy()) return;
  if(SAY.timer){ clearTimeout(SAY.timer); SAY.timer = 0; }
  /* 예약 순간부터 '재생 중' — 연출 뒤 실제로 말하기 전에 눌린 탭도 오디오를 깨우지 않게 */
  SAY.active = true;
  SAY.until = Date.now() + 320 + 900 + txt.length * 90;
  SAY.timer = setTimeout(function(){
    SAY.timer = 0;
    try{
      var u = new SpeechSynthesisUtterance(txt);
      u.lang = "en-US"; u.rate = 0.92; u.volume = 1;
      var v = sayVoice(sy); if(v) u.voice = v;
      u.onend = sayDone; u.onerror = sayDone;
      if(SAY.guard) clearTimeout(SAY.guard);
      SAY.guard = setTimeout(sayDone, 600 + txt.length * 110);   /* onend 가 안 오는 기기 대비 */
      /* 앞 발화가 멈춘 채 큐에 남아 있으면(iOS 백그라운드 복귀 등) 새 발화가 영영 안 나온다 — 비우고 말한다 */
      try{ if(sy.speaking || sy.pending || sy.paused) sy.cancel(); }catch(e){}
      try{ if(sy.resume) sy.resume(); }catch(e){}
      sy.speak(u);
    }catch(e){ sayDone(); }
  }, 320);
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
  "그래서 ~한 거야", "바로 그거야",
  "몇 시에 ~?", "어디서 ~할 수 있어요?", "~에 어떻게 가요?", "~ 얼마나 걸려요?",
  "~ 얼마예요?", "뭐 추천하세요?", "어느 게 ~예요?", "~ 언제 해요?",
  "우리 ~할까요?", "~ 알려주시겠어요?"
];
function boardKoOf(n){
  var m = stageMeta(n);
  if(m.kind === "pat")   return PAT_KO[m.p] || "";
  if(m.kind === "mix")   return "지금까지 배운 패턴 섞어 풀기";
  if(m.kind === "final") return "패턴 " + m.to + "개 전부";
  return "놓치지 않고 오래 버티기";
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
  if(m.kind === "pat")   return m.goal + "문장";
  if(m.kind === "mix")   return "패턴 1~" + m.to + " · " + m.goal + "문장";
  if(m.kind === "final") return "패턴 1~" + m.to + " · " + m.goal + "문장";
  return DATA.length + "문장 · 끝없이";
}
function boardTitleOf(n){
  var m = stageMeta(n);
  if(m.kind === "pat")   return PATTERNS[m.p];
  if(m.kind === "mix")   return "패턴 1~" + m.to + " 총복습";
  if(m.kind === "final") return "총복습";
  return "무한 모드";
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
         '<b>' + TIER_NAMES[t] + '</b></button>';
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
    lv.className = "lvChip" + (m.kind === "pat" ? "" : " " + m.kind) + (lk ? " lock" : "");
  }
  var dn = $("lobbyDone");
  if(dn){
    if(tierDone(n, tier)){ dn.innerHTML = IC_CK + "완료"; show(dn); }
    else hide(dn);
  }
  var t = $("lobbyTitle"); if(t) t.textContent = boardTitleOf(n);
  var bk = $("lobbyKo");   if(bk) bk.textContent = boardKoOf(n);
  var s = $("lobbySub");
  if(s){
    /* 잠겼을 때 시작 버튼과 같은 말이면 반복하지 않는다 */
    var nd = lk ? tierNeedDesc(n, tier) : "";
    s.textContent = lk ? (nd !== tierNeedShort(n, tier) ? nd : "") : ((m.kind === "pat" && tier === 1) ? "" : tierHint(n, tier));
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
    else bl.textContent = "시작하기";
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
  try{ if(typeof paintTailEntry === "function") paintTailEntry(); }catch(e){}
  /* 예문 말풍선 — 그 패턴의 가장 짧은 문장, 누르면 원어민 발음 */
  var egBtn = $("lobbyEg");
  if(egBtn){
    egBtn.className = "egBubble" + (ex ? "" : " hide");
    V.egEn = ex ? ex.en : "";
    var ea = $("lobbyEgAva"); if(ea && ea.innerHTML === "") ea.innerHTML = mascotSVG();
    var ep = $("lobbyEgPlay"); if(ep && ep.innerHTML === "") ep.innerHTML = ICON.sound;
  }
  /* 기록 한 줄 — 기록이 없으면 숨긴다 */
  var rec = $("lobbyRec");
  if(rec){
    var hasRec = (+(store.stageBest && store.stageBest[kk]) || 0) > 0;
    rec.className = "boardRec" + (hasRec ? "" : " hide");
  }
  /* 난이도 세그먼트 — Easy · Normal · Hard (패턴 레벨만) */
  var lt = $("lobbyTiers");
  if(lt){
    lt.innerHTML = tierPills(n, tier);
    lt.className = "lobbyTiers" + (m.kind === "pat" ? "" : " hide");
  }
  /* 레벨 진행 띠 — 앞뒤 레벨을 한눈에, 눌러서 바로 이동 */
  var strip = $("lvStrip");
  if(strip){
    var a0 = Math.max(1, Math.min(STAGES_TOTAL - 4, n - 2)), sh2 = "", k2, cls2, inner;
    for(k2=a0;k2<a0+5;k2++){
      var dn2 = !!store.stageDone[String(k2)], lk2 = stageLocked(k2);
      cls2 = "lvDot" + (k2 === n ? " now" : "") + (dn2 ? " done" : "") + (lk2 ? " lock" : "");
      inner = (dn2 && k2 !== n) ? IC_CK : ((lk2 && k2 !== n) ? lockSVG() : String(k2));
      sh2 += '<button class="' + cls2 + '" data-go="' + k2 + '" aria-label="Lv.' + k2 + '">' + inner + '</button>';
    }
    strip.innerHTML = '<span class="lvLine"></span>' + sh2;
  }
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
      '<path d="' + d + '" fill="none" stroke="#CDEFE2" stroke-width="36" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="#FFFFFF" stroke-width="26" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="#8EE8CC" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 12"/>';
  }

  /* 여정 하늘 풍경 — 홈 로비와 같은 민트 톤(햇살·구름·부드러운 언덕).
     언덕은 가장자리가 번지는 민트 덩어리로 깔아 길·노드를 가리지 않는다. */
  if(elJDeco){
    elJDeco.innerHTML = journeyScenery(W, H, jx, jy, gap);
    elJMap.style.background = journeySky(H, jy, gap);
    if(elJScroll && elJScroll.style) elJScroll.style.background = ZONES[1].bot;
  }

  /* 노드 */
  var out = "", kind, done;
  for(i=0;i<n;i++){
    m = STAGES[i];
    kind = m.kind;
    done = !!store.stageDone[String(m.n)];
    var lk = stageLocked(m.n);
    var cls = "jNode kind-" + kind + " zone" + chapterOf(m.n) + (done ? " done" : "") + (lk ? " lock" : "") + (m.n === (store.lastStage || 1) ? " now" : "");
    out += '<button class="' + cls + '" data-stg="' + m.n + '" aria-label="' + esc(stageLine(m.n)) +
           '" style="left:' + jx[i].toFixed(1) + 'px;top:' + jy[i].toFixed(1) + 'px">';
    out += '<span class="jBase"></span>';
    if(kind === "mix" || kind === "final"){
      out += chestSVG();
      out += '<span class="jNo">' + m.n + '</span>';
      out += '<span class="jCap">' + (kind === "mix" ? ("복습 " + m.mix) : "총복습") + '</span>';
    } else if(kind === "inf"){
      out += '<span class="jPod gold"></span><span class="jNum">' + m.n + '</span>';
      out += crownSVG();
      out += '<span class="jCap">무한 모드</span>';
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
      out += '<span class="jMascot">' + mascotSVG() + '</span>';
    }
    out += '</button>';
  }
  elJNodes.innerHTML = out;
  if(elJCount) elJCount.textContent = clearedStages() + " / " + STAGES_TOTAL;
  V.jBuilt = true;
  if(V.jSel) paintJSelect();
}
/* ── 지도 풍경 — 레벨 6개씩 묶인 챕터마다 게임판 테마로 배경이 바뀐다 ──
   라군 · 바다 · 보랏빛 숲 · 노을 · 에메랄드 숲 · 오로라 — 구간 경계는 chapterOf 가 정한다 */
var ZONES = [null,
  { name:"라군",       top:"#BFEFF2", bot:"#DDF8F0", ink:"#0E7C74" },
  { name:"바다",       top:"#BCD9FF", bot:"#D6EAFF", ink:"#1D5FC0" },
  { name:"보랏빛 숲",  top:"#D9CCFF", bot:"#E9E2FF", ink:"#6A4FD8" },
  { name:"노을",       top:"#FFC9AE", bot:"#FFE3D2", ink:"#C2542B" },
  { name:"에메랄드 숲", top:"#A9EACB", bot:"#CFF5E2", ink:"#118A5C" },
  { name:"오로라",     top:"#172253", bot:"#34468F", ink:"#FFFFFF" }
];
function zoneRange(c, jy, gap, H){
  var sp = chapterSpan(c), first = sp[0] - 1, last = sp[1] - 1;
  var yBot = (c === 1) ? H : jy[first] + gap / 2;
  var yTop = (c === 6) ? 0 : jy[last] - gap / 2;
  return { top:yTop, bot:yBot };
}
function journeySky(H, jy, gap){
  var st = [], c, r, z;
  for(c=6;c>=1;c--){
    z = ZONES[c]; r = zoneRange(c, jy, gap, H);
    st.push(z.top + " " + (Math.max(0, r.top + (c === 6 ? 0 : 50)) / H * 100).toFixed(2) + "%");
    st.push(z.bot + " " + (Math.min(H, r.bot - (c === 1 ? 0 : 50)) / H * 100).toFixed(2) + "%");
  }
  return "linear-gradient(180deg," + st.join(",") + ")";
}
function decoSVG(kind, w, h, x, y, rot, extraCls, extraStyle){
  var b = "", vb = "0 0 100 100";
  if(kind === "cloud"){ vb = "0 0 100 44"; b = '<path d="M14 40h70a14 14 0 0 0 0-28 22 22 0 0 0-40-6 16 16 0 0 0-30 34z" fill="#FFFFFF" opacity=".9"/>'; }
  else if(kind === "cloudL"){ vb = "0 0 100 44"; b = '<path d="M14 40h70a14 14 0 0 0 0-28 22 22 0 0 0-40-6 16 16 0 0 0-30 34z" fill="#F4EFFF" opacity=".85"/>'; }
  else if(kind === "palm"){ vb = "0 0 100 96";
    b = '<ellipse cx="50" cy="84" rx="48" ry="11" fill="#8FE3EC"/><ellipse cx="50" cy="80" rx="38" ry="9" fill="#FCE3A6"/>' +
        '<path d="M46 80 C44 62 48 44 58 30" stroke="#B9814A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<g fill="#25C083"><ellipse cx="44" cy="28" rx="18" ry="6" transform="rotate(20 44 28)"/><ellipse cx="72" cy="28" rx="18" ry="6" transform="rotate(-20 72 28)"/>' +
        '<ellipse cx="50" cy="20" rx="16" ry="5.5" transform="rotate(-35 50 20)"/><ellipse cx="68" cy="18" rx="16" ry="5.5" transform="rotate(35 68 18)"/></g>' +
        '<circle cx="58" cy="32" r="4" fill="#8A5A2B"/>'; }
  else if(kind === "isle"){ vb = "0 0 100 40"; b = '<ellipse cx="50" cy="28" rx="48" ry="10" fill="#8FE3EC"/><ellipse cx="50" cy="24" rx="34" ry="8" fill="#FCE3A6"/><circle cx="42" cy="17" r="7" fill="#2CC98C"/><circle cx="54" cy="15" r="9" fill="#22B07A"/>'; }
  else if(kind === "wave"){ vb = "0 0 60 16"; b = '<path d="M2 10 q7-8 14 0 t14 0 t14 0 t14 0" stroke="#FFFFFF" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/>'; }
  else if(kind === "boat"){ vb = "0 0 60 60"; b = '<path d="M8 42h44l-7 9H15z" fill="#FF7A55"/><path d="M8 42h44l-1.5 2H9.5z" fill="#FFB199"/><rect x="29" y="10" width="2.5" height="32" rx="1.2" fill="#8A5A2B"/><path d="M31.5 12 L50 38 H31.5z" fill="#FFFFFF"/><path d="M29 16 L14 38 H29z" fill="#FFE59A"/>' +
        '<path d="M4 54 q6-5 12 0 t12 0 t12 0 t12 0 t12 0" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity=".8"/>'; }
  else if(kind === "fish"){ vb = "0 0 40 20"; b = '<path d="M4 10 C10 2 24 2 30 10 C24 18 10 18 4 10z" fill="#FFB547"/><path d="M30 10 L38 4 V16z" fill="#FF9A2E"/><circle cx="11" cy="9" r="1.8" fill="#1B2A4A"/>'; }
  else if(kind === "crystal"){ vb = "0 0 50 70"; b = '<path d="M25 2 L38 22 L30 66 L20 66 L12 22z" fill="#B79CFF"/><path d="M25 2 L38 22 L25 26z" fill="#D9CCFF"/><path d="M25 26 L38 22 L30 66 L25 66z" fill="#8F74F5"/>' +
        '<path d="M8 40 L16 50 L12 68 L5 68 L2 50z" fill="#C9B6FF"/><path d="M44 36 L49 46 L46 68 L41 68 L39 46z" fill="#A58BFA"/>'; }
  else if(kind === "shroom"){ vb = "0 0 60 60"; b = '<rect x="24" y="30" width="12" height="24" rx="5" fill="#FFF2E6"/><path d="M6 32 A24 20 0 0 1 54 32z" fill="#C39BFF"/><path d="M6 32 A24 20 0 0 1 54 32 Q30 26 6 32z" fill="#AD82FF"/><circle cx="20" cy="22" r="3.5" fill="#FFFFFF"/><circle cx="36" cy="18" r="4.5" fill="#FFFFFF"/><circle cx="44" cy="27" r="2.8" fill="#FFFFFF"/>'; }
  else if(kind === "spark"){ vb = "0 0 20 20"; b = '<path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0z" fill="#FFFFFF" opacity=".95"/>'; }
  else if(kind === "sun"){ vb = "0 0 100 100"; b = '<circle cx="50" cy="50" r="46" fill="#FFD0A8" opacity=".6"/><circle cx="50" cy="50" r="32" fill="#FFB070"/><circle cx="44" cy="42" r="12" fill="#FFC98F"/>'; }
  else if(kind === "bird"){ vb = "0 0 30 12"; b = '<path d="M2 9 q6-7 12 0 q6-7 12 0" stroke="#B8604A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; }
  else if(kind === "dune"){ vb = "0 0 120 50"; b = '<path d="M0 50 C20 18 50 10 70 22 C88 32 104 26 120 30 V50z" fill="#FFB892"/><path d="M0 50 C30 34 60 30 120 42 V50z" fill="#FFA47C"/><path d="M84 28 v-14 M84 18 l-5 -4 M84 20 l5 -4" stroke="#E0784F" stroke-width="2.4" stroke-linecap="round"/>'; }
  else if(kind === "tree"){ vb = "0 0 60 70"; b = '<rect x="26" y="40" width="8" height="26" rx="3" fill="#9C6B3E"/><circle cx="30" cy="30" r="22" fill="#2FC98A"/><circle cx="22" cy="24" r="10" fill="#4BDCA0"/><circle cx="38" cy="38" r="12" fill="#22B077"/>'; }
  else if(kind === "pine"){ vb = "0 0 50 70"; b = '<rect x="22" y="54" width="6" height="14" rx="2" fill="#8A5A2B"/><path d="M25 2 L44 34 H6z" fill="#1FB27A"/><path d="M25 18 L48 56 H2z" fill="#14995F"/><path d="M25 2 L44 34 H25z" fill="#18A06B"/>'; }
  else if(kind === "flower"){ vb = "0 0 50 30"; b = '<path d="M10 28 v-10 M25 28 v-14 M40 28 v-9" stroke="#1E9B68" stroke-width="2.2"/><circle cx="10" cy="16" r="5" fill="#FF8FB1"/><circle cx="25" cy="12" r="6" fill="#FFD166"/><circle cx="40" cy="17" r="5" fill="#FF9F7A"/><circle cx="25" cy="12" r="2.2" fill="#FF9F2E"/>'; }
  else if(kind === "moon"){ vb = "0 0 60 60"; b = '<circle cx="30" cy="30" r="28" fill="#FFF4C7" opacity=".18"/><circle cx="30" cy="30" r="18" fill="#FFF1C2"/><circle cx="24" cy="26" r="3.5" fill="#F3DE9C"/><circle cx="35" cy="35" r="2.5" fill="#F3DE9C"/>'; }
  else if(kind === "star"){ vb = "0 0 10 10"; b = '<circle cx="5" cy="5" r="2" fill="#FFFFFF"/>'; }
  return '<span class="deco' + (extraCls ? " " + extraCls : "") + '" style="left:' + Math.round(x) + 'px;top:' + Math.round(y) + 'px;width:' + w + 'px;height:' + h + 'px' +
         (rot ? ';transform:rotate(' + rot + 'deg)' : '') + (extraStyle ? ";" + extraStyle : "") + '"><svg viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' + b + '</svg></span>';
}
var ZONE_DECO = [null,
  [["palm",86,82],["isle",90,36],["wave",54,14],["cloud",84,37],["wave",46,12],["isle",70,28]],
  [["boat",62,62],["wave",56,15],["fish",38,19],["cloud",80,35],["wave",48,13],["fish",30,15]],
  [["crystal",46,64],["shroom",54,54],["cloudL",82,36],["spark",18,18],["shroom",40,40],["spark",14,14]],
  [["dune",120,50],["bird",30,12],["cloud",76,33],["bird",24,10],["dune",96,40]],
  [["tree",58,68],["pine",46,64],["flower",50,30],["tree",46,54],["pine",38,54],["flower",44,26]],
  [["moon",64,64],["spark",16,16],["spark",12,12],["spark",18,18]]
];
function pathXAt(y, jx, jy){
  var i, best = 0, bd = 1e9;
  for(i=0;i<jy.length;i++){ var d = Math.abs(jy[i] - y); if(d < bd){ bd = d; best = i; } }
  return jx[best];
}
function journeyScenery(W, H, jx, jy, gap){
  var out = "", rng = makeRng(5021), c, r, z, k, list, it, y, px, x, w, h, sideLeft;
  for(c=1;c<=6;c++){
    z = ZONES[c]; r = zoneRange(c, jy, gap, H); list = ZONE_DECO[c];
    /* 오로라 띠와 별 — 밤하늘 구역 */
    if(c === 6){
      out += '<span class="deco" style="left:0;top:' + Math.round(r.top + 40) + 'px;width:' + W + 'px;height:160px">' +
        '<svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="aurG" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#6FF7C8" stop-opacity=".0"/><stop offset=".3" stop-color="#6FF7C8" stop-opacity=".55"/>' +
        '<stop offset=".7" stop-color="#9C8BFF" stop-opacity=".5"/><stop offset="1" stop-color="#9C8BFF" stop-opacity="0"/></linearGradient></defs>' +
        '<path d="M0 90 C80 30 150 120 230 60 C300 10 350 70 400 40 L400 70 C350 100 300 40 230 90 C150 150 80 60 0 120z" fill="url(#aurG)"/></svg></span>';
      for(k=0;k<34;k++){
        var sz = 3 + Math.round(rng()*4);
        out += decoSVG("star", sz, sz, rng()*(W - 8), r.top + 10 + rng()*(r.bot - r.top - 30), 0, "tw", "animation-delay:" + (rng()*3).toFixed(2) + "s");
      }
    }
    for(k=0;k<list.length;k++){
      it = list[k]; w = it[1]; h = it[2];
      y = r.top + 30 + (k + rng()*0.6) * ((r.bot - r.top - 90) / list.length);
      px = pathXAt(y + h/2, jx, jy);
      sideLeft = px > W / 2;
      x = sideLeft ? (6 + rng()*Math.max(4, W*0.30 - w)) : (W*0.66 + rng()*Math.max(4, W*0.34 - w - 6));
      out += decoSVG(it[0], w, h, x, y, (it[0] === "spark" || it[0] === "bird") ? Math.round(rng()*20 - 10) : 0);
    }
    /* 챕터 이름표 — 구역이 시작되는 아래쪽 */
    var ly = r.bot - (c === 1 ? 150 : 70), lpx = pathXAt(ly, jx, jy), lx = lpx > W/2 ? 12 : W - 132;
    out += '<span class="zoneTag z' + c + '" style="left:' + Math.round(lx) + 'px;top:' + Math.round(ly) + 'px">' +
           '<b>' + chapterSpan(c)[0] + '~' + chapterSpan(c)[1] + '</b>' + z.name + '</span>';
  }
  return out;
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
/* 영어 난이도 이름 뒤 조사 — 발음 기준(이지·하드 → 는, 노멀 → 은) */
var TIER_JOSA = ["", "는", "은", "는"];
function tierNoteOf(n){
  var m = stageMeta(n), t;
  if(m.kind !== "pat" || stageLocked(n)) return "";
  for(t=2;t<=3;t++){
    if(tierLocked(n, t)) return TIER_NAMES[t] + TIER_JOSA[t] + " " + tierNeedShort(n, t);
  }
  return "";
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
  if(mt) mt.textContent = (m.kind === "inf") ? (DATA.length + "문장 · 끝없이") : tierHint(n, t);
  var tp = $("jCardTiers"); if(tp) tp.innerHTML = tierPills(n, t);
  var tn = $("jCardTierNote"); if(tn) tn.textContent = tierNoteOf(n);
  dn = $("jCardDone");
  if(dn){
    if(tierDone(n, t)){ dn.innerHTML = IC_CK + "완료"; show(dn); }
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
  /* 캐릭터는 고른 노드의 숫자판 위로 옮겨 간다 — 잠긴 노드로는 가지 않는다 */
  if(sel && mas && sel.appendChild && !(sel.classList && sel.classList.contains("lock"))){
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
  $("btnSetSound").innerHTML = (store.sound ? ICON.mute : ICON.sound) + "<span>" + (store.sound ? "소리 끄기" : "소리 켜기") + "</span>";
  var bv = $("btnSetVoice");
  if(bv) bv.textContent = (store.voice !== false) ? "정답 발음 끄기" : "정답 발음 켜기";
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
  if(S.mode !== "play"){ if(S.typing) try{ blankEnd(); }catch(e){} return; }
  if(S.typing) dt *= 0.3;   /* 빈칸을 치는 동안은 30% 속도로 */
  var lh = (elLane && elLane.clientHeight) || 0;
  if(!S.typing && lh > 0 && Math.abs(lh - S.laneH) > 3) layout();
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
on($("lobbyEg"), "click", function(e){
  if(e && e.stopPropagation) e.stopPropagation();
  if(V.egEn){ unlockAudio(); sayEn(V.egEn); }
});
/* 홈 카드 좌우 밀기 — 왼쪽으로 밀면 다음 레벨, 오른쪽으로 밀면 이전 레벨 */
(function(){
  var card = $("boardCard"), sx = 0, sy = 0, on2 = false;
  if(!card || !card.addEventListener) return;
  card.addEventListener("touchstart", function(e){
    var t = e.touches && e.touches[0]; if(!t) return;
    sx = t.clientX; sy = t.clientY; on2 = true;
  }, { passive:true });
  card.addEventListener("touchend", function(e){
    if(!on2) return; on2 = false;
    var t = e.changedTouches && e.changedTouches[0]; if(!t) return;
    var dx = t.clientX - sx, dy = t.clientY - sy;
    if(Math.abs(dx) < 48 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
    var before = V.stage;
    stepLobby(dx < 0 ? 1 : -1);
    if(V.stage !== before && card.classList){
      card.classList.remove("swL", "swR");
      void card.offsetWidth;
      card.classList.add(dx < 0 ? "swL" : "swR");
    }
  }, { passive:true });
})();
on($("lvStrip"), "click", function(e){
  var el = e.target, box = $("lvStrip");
  while(el && el !== box && !(el.getAttribute && el.getAttribute("data-go"))) el = el.parentNode;
  if(!el || el === box) return;
  var k = parseInt(el.getAttribute("data-go"), 10);
  if(isNaN(k)) return;
  unlockAudio();
  stepLobby(k - (V.stage || 1));
});
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
  enterGame: function(){ setView("game"); paintSky(); warmSpeech(); },
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
/* ── iOS 무음 스위치 대응 ──
   iOS Safari 는 벨소리/무음 스위치가 무음이면 Web Audio 를 통째로 묵음 처리한다.
   (1) audioSession 을 'playback' 으로, (2) 첫 제스처에서 무음 <audio> 를 반복 재생해
   오디오 세션을 '재생' 범주로 바꾸면 무음 모드에서도 효과음·BGM·발음이 나온다. */
(function(){
  var SILENT = "data:audio/wav;base64,UklGRvQHAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YdAHAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==";
  var el = null, started = false;
  function setSession(){
    try{ if(navigator.audioSession && navigator.audioSession.type !== "playback") navigator.audioSession.type = "playback"; }catch(e){}
  }
  function kick(){
    try{ warmSpeech(); }catch(e){}                            /* 음성 엔진도 제스처 안에서 깨워 둔다 */
    if(isSpeaking()) return;                                  /* 음성 재생 중엔 오디오 세션을 건드리지 않는다 */
    if(started && el && !el.paused && AC && AC.state === "running") return;   /* 이미 소리가 나는 중 */
    setSession();
    if(!store.sound) return;
    try{
      if(!el){
        el = document.createElement("audio");
        el.setAttribute("playsinline", "");
        el.setAttribute("x-webkit-airplay", "deny");
        el.preload = "auto";
        el.loop = true;
        el.src = SILENT;
        el.volume = 0.01;
      }
      if(el.paused){
        var pr = el.play();
        if(pr && pr.then) pr.then(function(){ started = true; }, function(){});
      }
    }catch(e){}
    try{ if(!AC || AC.state !== "running") unlockAudio(); }catch(e){}
  }
  setSession();
  var evs = ["pointerdown","touchend","click","keydown"], i;
  for(i=0;i<evs.length;i++) document.addEventListener(evs[i], kick, true);
  document.addEventListener("visibilitychange", function(){
    if(document.hidden){ try{ if(el) el.pause(); }catch(e){} SAY.warm = false; }
  });
  window.__silentAudio = function(){ return { el:!!el, started:started }; };
  window.__kickAudio = function(){ setSession(); try{ if(store.sound && el && el.paused){ var pr = el.play(); if(pr && pr.catch) pr.catch(function(){}); } }catch(e){} };
})();

/* ── 자동 업데이트 ──
   즐겨찾기 주소 그대로 열어도 새 버전이 뜨게 한다. 열 때·다시 돌아올 때 같은 주소를
   캐시 없이 받아 빌드 번호를 비교하고, 다르면 한 번만 새로고침한다(같은 주소라 기록은 그대로). */
var BUILD_ID = "__BUILD_ID__";
(function(){
  if(typeof window === "undefined" || !window.fetch || !window.location) return;
  if(!/^https?:$/.test(location.protocol)) return;          /* 로컬 파일로 열면 건너뛴다 */
  var checking = false;
  function check(){
    if(checking) return;
    checking = true;
    var url = location.pathname + (location.search ? location.search + "&" : "?") + "_v=" + Date.now();
    fetch(url, { cache:"no-store" }).then(function(r){ return r.ok ? r.text() : ""; }).then(function(t){
      checking = false;
      var m = /BUILD_ID = "([0-9a-f]{10})"/.exec(t || "");
      if(!m || m[1] === BUILD_ID) return;
      var key = "em100.reloadFor";
      try{ if(sessionStorage.getItem(key) === m[1]) return; sessionStorage.setItem(key, m[1]); }catch(e){}
      if(typeof S !== "undefined" && S.mode === "play") return;   /* 게임 중엔 끊지 않는다 — 다음에 열 때 */
      location.reload();
    }, function(){ checking = false; });
  }
  setTimeout(check, 800);
  document.addEventListener("visibilitychange", function(){ if(!document.hidden) check(); });
})();

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
  s = $("btnFire");  if(s) s.innerHTML = ICON.rocket + "<span>쏘기</span>";
  s = $("scoreIcon"); if(s) s.innerHTML = ICON.coin;
  s = $("overIcon"); if(s) s.innerHTML = ICON.skull;
  s = $("tabIcoBook"); if(s) s.innerHTML = tabIcon("book");
  s = $("tabIcoHome"); if(s) s.innerHTML = tabIcon("home");
  s = $("tabIcoJourney"); if(s) s.innerHTML = tabIcon("flag");
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

/* ── 홈 테마: 지금 보고 있는 레벨의 챕터 색으로 홈 배경·버튼 색이 바뀐다 ── */
var ZTHEME = [null,
  { s:["#3FC3CF","#2FB0BF","#2398AA"], h:["#9BEDEA","#6FD9D9","#4FC4C8","#38B0B8","#2A97A6","#21889A"], sun:"#FFF3C4", acc:"#0E8C8A" },
  { s:["#6FA2FF","#5287F2","#3B69DA"], h:["#A8C9FF","#86B1FF","#6A99F5","#5486EC","#3F6FDB","#3461CC"], sun:"#FFF3C4", acc:"#2A63D6" },
  { s:["#A88CFF","#8C6CEE","#7254DA"], h:["#D2C2FF","#BCA6FF","#A68AF6","#9274EC","#7B5CDD","#6C4FCF"], sun:"#FFE9F4", acc:"#6A4FD8" },
  { s:["#FF9C6A","#FF8466","#F06E88"], h:["#FF9E8A","#F98593","#E8709A","#D466A6","#B45FB8","#9F5CC8"], sun:"#FFE7C2", acc:"#E0614A" },
  { s:["#3FCB98","#2BB886","#1D9E70"], h:["#94EBC6","#72DFB4","#4FCF9C","#3BBF8A","#26A877","#1C966A"], sun:"#FFF6C9", acc:"#118A5C" },
  { s:["#34479A","#1F2A6B","#141B47"], h:["#3A4FA8","#33469A","#2B3B88","#253378","#1D2865","#182157"], sun:"#FFE9A8", acc:"#4B5BD8" }
];
/* 상단 상태바·화면 바깥 색을 지금 화면 맨 위 색에 맞춘다 */
function setTopColor(col){
  try{
    /* theme-color 는 넣지 않는다 — iOS 홈 화면 앱은 이 값을 켤 때 한 번 읽어 상태바 색으로 고정해 버려서
       투명 상태바(black-translucent)를 덮는다 */
    document.documentElement.style.backgroundColor = col;
    document.body.style.backgroundColor = col;
  }catch(e){}
}
function applyZone(stage){
  var c = 1;
  try{ c = chapterOf(stage || store.lastStage || 1); }catch(e){}
  var z = ZTHEME[c] || ZTHEME[1], b = document.body && document.body.style;
  if(!b || !b.setProperty) return;
  b.setProperty("--zs1", z.s[0]); b.setProperty("--zs2", z.s[1]); b.setProperty("--zs3", z.s[2]);
  b.setProperty("--zh1", z.h[0]); b.setProperty("--zh1b", z.h[1]); b.setProperty("--zh2", z.h[2]);
  b.setProperty("--zh2b", z.h[3]); b.setProperty("--zh3", z.h[4]); b.setProperty("--zh3b", z.h[5]);
  b.setProperty("--zsun", z.sun); b.setProperty("--zacc", z.acc);
  document.body.setAttribute("data-zone", String(c));
  setTopColor(z.s[0]);
  try{ var hl = $("lobbyRank"); if(hl && ZONES[c]) hl.setAttribute("data-zone", ZONES[c].name); }catch(e){}
}
var _paintLobbyZ = paintLobby;
paintLobby = function(){
  var r = _paintLobbyZ.apply(this, arguments);
  var st = parseInt(($("btnStart") || {}).getAttribute ? $("btnStart").getAttribute("data-stage") : "", 10);
  applyZone(isNaN(st) ? store.lastStage : st);
  return r;
};
try{ document.body.classList.add("zt"); applyZone(store.lastStage); }catch(e){}
window.__zt = function(s){ applyZone(s); };

