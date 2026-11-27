/* ══════════ 게임 연출 강화 ══════════
   - 배경: 떨어지는 빛가루와 속도선(콤보가 오를수록 빨라지고, 피버면 불꽃색)
   - 명중: 캔버스 폭발(불꽃 · 충격파 · 섬광) + 카드 파편 + 큰 점수
   - 콤보 3·5·10·15·20…: 화면 가운데 콤보 배너, 10콤보부터 피버 테두리
   - 오답·바닥 충돌: 붉은 섬광과 붉은 폭발
   캔버스 두 장(배경 · 효과)만 쓰고, 효과 루프는 파티클이 있을 때만 돈다. */
var FX = { dpr:Math.min(2, window.devicePixelRatio || 1), p:[], on:false, bg:[], bgOn:false, w:0, h:0 };
var elSkyFx = $("sky");
var fxCan = document.createElement("canvas"); fxCan.className = "fxCan";
var bgCan = document.createElement("canvas"); bgCan.className = "bgCan";
try{ elFx.appendChild(fxCan); elSkyFx.insertBefore(bgCan, elSkyFx.firstChild ? elSkyFx.firstChild.nextSibling : null); }catch(e){}
var fxc = fxCan.getContext ? fxCan.getContext("2d") : null, bgc = bgCan.getContext ? bgCan.getContext("2d") : null;
function fxSize(){
  var w = elFx.clientWidth || 0, h = elFx.clientHeight || 0;
  if(!w || !h) return false;
  if(w !== FX.w || h !== FX.h){
    FX.w = w; FX.h = h;
    fxCan.width = bgCan.width = Math.round(w * FX.dpr);
    fxCan.height = bgCan.height = Math.round(h * FX.dpr);
    fxCan.style.width = bgCan.style.width = w + "px";
    fxCan.style.height = bgCan.style.height = h + "px";
  }
  return true;
}
function fxPal(){
  if(S.combo >= 10) return ["#FFE066","#FF9F43","#FF6B6B","#FFFFFF","#FFC75F"];
  return ["#FFE066","#FF7AA2","#5AD2FF","#7CF7C2","#C39BFF","#FFFFFF"];
}
function fxLoop(){
  if(!fxc){ FX.on = false; return; }
  var c = fxc, d = FX.dpr, i, q, alive = [];
  c.setTransform(d, 0, 0, d, 0, 0);
  c.clearRect(0, 0, FX.w, FX.h);
  for(i=0;i<FX.p.length;i++){
    q = FX.p[i];
    q.t += 1;
    if(q.t > q.life) continue;
    if(q.t <= 0){ alive.push(q); continue; }
    var k = q.t / q.life;
    c.globalAlpha = Math.max(0, 1 - k * k);
    if(q.kind === "spark"){
      q.vx *= 0.94; q.vy = q.vy * 0.94 + 0.28; q.x += q.vx; q.y += q.vy;
      c.strokeStyle = q.col; c.lineWidth = q.r; c.lineCap = "round";
      c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x - q.vx * 2.4, q.y - q.vy * 2.4); c.stroke();
    } else if(q.kind === "ring"){
      var rr = q.r0 + (q.r1 - q.r0) * (1 - Math.pow(1 - k, 3));
      c.strokeStyle = q.col; c.lineWidth = Math.max(0.5, q.lw * (1 - k));
      c.beginPath(); c.arc(q.x, q.y, rr, 0, Math.PI * 2); c.stroke();
    } else if(q.kind === "glow"){
      var gr = q.r * (0.6 + k * 0.8), g = c.createRadialGradient(q.x, q.y, 0, q.x, q.y, gr);
      g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(0.35, q.col); g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g; c.beginPath(); c.arc(q.x, q.y, gr, 0, Math.PI * 2); c.fill();
    } else if(q.kind === "shard"){
      q.vx *= 0.97; q.vy = q.vy * 0.97 + 0.35; q.x += q.vx; q.y += q.vy; q.a += q.va;
      c.save(); c.translate(q.x, q.y); c.rotate(q.a);
      c.fillStyle = q.col; c.strokeStyle = q.edge; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(q.pts[0], q.pts[1]); c.lineTo(q.pts[2], q.pts[3]); c.lineTo(q.pts[4], q.pts[5]); c.closePath();
      c.fill(); c.stroke(); c.restore();
    } else if(q.kind === "conf"){
      q.vx *= 0.96; q.vy = q.vy * 0.96 + 0.22; q.x += q.vx; q.y += q.vy; q.a += q.va;
      c.save(); c.translate(q.x, q.y); c.rotate(q.a); c.fillStyle = q.col;
      c.fillRect(-q.r, -q.r * 0.45, q.r * 2, q.r * 0.9); c.restore();
    }
    alive.push(q);
  }
  c.globalAlpha = 1;
  FX.p = alive;
  if(alive.length) requestAnimationFrame(fxLoop); else { FX.on = false; c.clearRect(0, 0, FX.w, FX.h); }
}
function fxKick(){ if(!FX.on){ FX.on = true; requestAnimationFrame(fxLoop); } }
function fxBoom(cx, cy, opt){
  if(!fxc || !fxSize()) return;
  opt = opt || {};
  var pal = opt.bad ? ["#FF5A4E","#FF9F43","#FFD1C9","#FFFFFF"] : fxPal();
  var n = opt.bad ? 26 : Math.min(70, 34 + (S.combo || 0) * 3), i, a, v;
  FX.p.push({ kind:"glow", x:cx, y:cy, r:opt.bad ? 60 : 70 + Math.min(40, (S.combo||0) * 4), col:opt.bad ? "rgba(255,80,60,.5)" : (S.combo >= 10 ? "rgba(255,170,60,.55)" : "rgba(90,210,255,.5)"), t:0, life:16 });
  FX.p.push({ kind:"ring", x:cx, y:cy, r0:10, r1:opt.bad ? 70 : 90 + Math.min(60, (S.combo||0) * 5), lw:6, col:opt.bad ? "#FF6B5E" : "#FFFFFF", t:0, life:24 });
  if(!opt.bad && S.combo >= 5) FX.p.push({ kind:"ring", x:cx, y:cy, r0:4, r1:140, lw:3, col:S.combo >= 10 ? "#FFB84D" : "#7CF7C2", t:-4, life:30 });
  for(i=0;i<n;i++){
    a = Math.random() * Math.PI * 2; v = 3 + Math.random() * (opt.bad ? 6 : 9);
    FX.p.push({ kind:"spark", x:cx, y:cy, vx:Math.cos(a) * v, vy:Math.sin(a) * v - 2, r:1.6 + Math.random() * 2.4, col:pal[i % pal.length], t:0, life:26 + Math.random() * 18 });
  }
  if(!opt.bad) for(i=0;i<14;i++){
    a = -Math.PI / 2 + (Math.random() - 0.5) * 2.6; v = 4 + Math.random() * 6;
    FX.p.push({ kind:"conf", x:cx, y:cy, vx:Math.cos(a) * v, vy:Math.sin(a) * v, r:3 + Math.random() * 3, a:Math.random() * 6, va:(Math.random() - 0.5) * 0.5, col:pal[(i + 2) % pal.length], t:0, life:44 + Math.random() * 20 });
  }
  fxKick();
}
/* 줄 카드를 파편으로 깨뜨린다 */
function fxShatter(row, bad){
  if(!fxc || !row || !row.el || !fxSize()) return;
  var w = row.el.offsetWidth || 160, h = row.el.offsetHeight || 44;
  var x0 = (row.x || 0) + 9, y0 = row.y, i, cols = 9, cw = w / cols;
  for(i=0;i<cols * 2;i++){
    var cx = x0 + (i % cols) * cw + cw / 2, cy = y0 + (i < cols ? h * 0.3 : h * 0.72);
    var up = i < cols;
    FX.p.push({ kind:"shard", x:cx, y:cy, vx:(cx - (x0 + w / 2)) * 0.06 + (Math.random() - 0.5) * 3, vy:(up ? -3.5 : -1) - Math.random() * 3,
      a:0, va:(Math.random() - 0.5) * 0.35, col:bad ? "#FFE3DF" : "#FFFFFF", edge:bad ? "#FF6B5E" : (S.combo >= 10 ? "#FFB84D" : "#8FD3FF"),
      pts:[-cw * 0.45, -h * 0.2, cw * 0.45, -h * 0.14 + Math.random() * 4, (Math.random() - 0.5) * cw * 0.8, h * 0.2], t:0, life:34 + Math.random() * 12 });
  }
  fxKick();
}
/* 기존 효과 함수 교체 */
var _burst0 = burst;
burst = function(cx, cy){ if(fxc) fxBoom(cx, cy); else _burst0(cx, cy); };
var _boomRow0 = boomRow;
boomRow = function(row){
  try{ fxShatter(row, !!row.__bad); }catch(e){}
  try{ row.el.style.visibility = "hidden"; }catch(e){}
  _boomRow0(row);
};
/* 큰 점수 */
var _floatText0 = floatText;
floatText = function(txt, cx, cy, bad){
  if(bad) return _floatText0(txt, cx, cy, bad);
  var d = document.createElement("div");
  d.className = "plus2" + (S.combo >= 10 ? " fever" : (S.combo >= 5 ? " hot" : ""));
  d.textContent = txt;
  d.style.left = cx + "px"; d.style.top = cy + "px";
  elFx.appendChild(d);
  if(d.animate){
    d.animate([{transform:"translate(-50%,-50%) scale(.3)", opacity:0},
               {transform:"translate(-50%,-80%) scale(1.35)", opacity:1, offset:.22},
               {transform:"translate(-50%,-110%) scale(1)", opacity:1, offset:.55},
               {transform:"translate(-50%,-170%) scale(.95)", opacity:0}],
      {duration:900, easing:"cubic-bezier(.2,.8,.3,1)"});
  }
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 940);
};
/* 콤보 배너와 피버 */
var COMBO_MARK = { 3:"NICE!", 5:"GREAT!", 10:"FEVER!", 15:"AMAZING!", 20:"UNSTOPPABLE!", 30:"LEGEND!" };
function comboBanner(n){
  var word = COMBO_MARK[n] || (n > 30 && n % 10 === 0 ? "LEGEND!" : "");
  if(!word) return;
  var d = document.createElement("div");
  d.className = "comboBan" + (n >= 10 ? " fever" : "");
  d.innerHTML = "<b>" + n + "</b><span>COMBO</span><i>" + word + "</i>";
  elFx.appendChild(d);
  if(d.animate){
    d.animate([{transform:"translate(-50%,-50%) scale(2.2) rotate(-6deg)", opacity:0},
               {transform:"translate(-50%,-50%) scale(.92) rotate(-3deg)", opacity:1, offset:.18},
               {transform:"translate(-50%,-50%) scale(1) rotate(-3deg)", opacity:1, offset:.7},
               {transform:"translate(-50%,-60%) scale(1.06) rotate(-3deg)", opacity:0}],
      {duration:1100, easing:"cubic-bezier(.2,.9,.25,1)"});
  }
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 1150);
  try{ if(n >= 10) shakeScreen(2); }catch(e){}
}
function paintFever(){ try{ elSkyFx.classList.toggle("fever", S.combo >= 10 && S.mode === "play"); elSkyFx.classList.toggle("hot", S.combo >= 5 && S.combo < 10 && S.mode === "play"); }catch(e){} }
var _hitRow0 = hitRow;
hitRow = function(row){
  var before = S.combo;
  var r = _hitRow0(row);
  if(S.combo > before) comboBanner(S.combo);
  paintFever();
  return r;
};
var _wrongRow0 = wrongRow;
wrongRow = function(row){
  var r = _wrongRow0(row);
  paintFever(); fxRedFlash();
  return r;
};
var _crashRow0 = crashRow;
crashRow = function(row){
  try{ if(row && !row.dead){ row.__bad = true; var w = row.el ? row.el.offsetWidth : 160; fxBoom((row.x || 0) + 9 + w / 2, row.y + S.R / 2, { bad:true }); } }catch(e){}
  var r = _crashRow0(row);
  paintFever(); fxRedFlash();
  return r;
};
function fxRedFlash(){
  var f = document.createElement("div"); f.className = "redFlash"; elSkyFx.appendChild(f);
  if(f.animate) f.animate([{opacity:0},{opacity:1, offset:.2},{opacity:0}], {duration:420, easing:"ease-out"});
  setTimeout(function(){ if(f.parentNode) f.parentNode.removeChild(f); }, 440);
}
/* ── 배경: 떨어지는 빛가루 · 속도선 ── */
function bgSeed(){
  FX.bg = [];
  for(var i=0;i<34;i++) FX.bg.push({ x:Math.random(), y:Math.random(), z:0.3 + Math.random() * 0.7, s:Math.random() < 0.22 });
}
var bgLast = 0;
function bgLoop(ts){
  if(!bgc || (V.cur !== "game" && S.mode !== "play")){ FX.bgOn = false; if(bgc) bgc.clearRect(0, 0, bgCan.width, bgCan.height); return; }
  requestAnimationFrame(bgLoop);
  if(S.mode !== "play" && S.mode !== "count"){ bgLast = ts; return; }
  if(!fxSize()) return;
  var dt = Math.min(50, ts - (bgLast || ts)); bgLast = ts;
  if(S.typing) dt *= 0.3;
  var c = bgc, d = FX.dpr, W = FX.w, H = FX.h, i, q;
  c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, W, H);
  var fever = S.combo >= 10, speed = 0.018 + Math.min(0.05, (S.combo || 0) * 0.004);
  for(i=0;i<FX.bg.length;i++){
    q = FX.bg[i];
    q.y += speed * q.z * dt / 16 * (q.s ? 2.6 : 1);
    if(q.y > 1.05){ q.y = -0.05; q.x = Math.random(); }
    var x = q.x * W, y = q.y * H;
    if(q.s){
      var len = 14 + q.z * 26 + (S.combo || 0) * 1.5;
      var g = c.createLinearGradient(x, y - len, x, y);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, fever ? "rgba(255,200,120,.75)" : "rgba(255,255,255,.55)");
      c.strokeStyle = g; c.lineWidth = 1.4 * q.z; c.beginPath(); c.moveTo(x, y - len); c.lineTo(x, y); c.stroke();
    } else {
      c.globalAlpha = 0.25 + q.z * 0.45;
      c.fillStyle = fever ? "#FFD08A" : "#FFFFFF";
      c.beginPath(); c.arc(x, y, 0.8 + q.z * 1.6, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
    }
  }
}
function bgStart(){ if(!FX.bgOn && bgc){ FX.bgOn = true; bgLast = 0; requestAnimationFrame(bgLoop); } }
var _startStage0 = startStage;
startStage = function(){
  var r = _startStage0.apply(this, arguments);
  bgSeed(); bgStart(); paintFever();
  return r;
};
bgSeed();
window.__fx = { boom:fxBoom, count:function(){ return FX.p.length; }, bgOn:function(){ return FX.bgOn; } };
/* 등장 연출이 끝나면 인라인 animation 을 비워 둔다 — 조준·위험 줄의 반짝임 애니메이션이 살아나게 */
var _spawnRow0 = spawnRow;
spawnRow = function(){
  var row = _spawnRow0.apply(this, arguments);
  if(row && row.el) setTimeout(function(){ try{ row.el.style.animation = ""; }catch(e){} }, 400);
  return row;
};
window.__fxTest = { hit:function(){ var t = targetRow(); if(t) hitRow(t); }, start:function(s, t){ startStage(s, t); }, crash:function(){ var t = targetRow(); if(t) crashRow(t); } };
