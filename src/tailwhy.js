/* ══════════ 패턴 훈련 — 왜 틀렸는지 ══════════
   1) 같은 뜻의 다른 말(book / make an appointment 등)은 "다른 말도 맞아요"로 반 점(+5) — 이 문장의 말로 외우게 안내
   2) 그 밖에 틀리면 단어 단위로 비교해서 어디가 달랐는지 보여 준다(바뀐 단어 · 빠진 단어 · 더 쓴 단어) */
var TW_SAME = [   /* [이 문장에 나오는 말, 같은 뜻으로 받아 줄 말, 짧은 설명] */
  ["make an appointment", "book an appointment", "둘 다 '예약을 잡다'예요"],
  ["make a reservation", "book a reservation", "둘 다 '예약하다'예요"],
  ["book a table", "reserve a table", "둘 다 '자리를 예약하다'예요"],
  ["book a table", "make a reservation", "둘 다 '자리를 예약하다'예요"],
  ["get a taxi", "take a taxi", "get은 '잡다', take는 '타다' 느낌이에요"],
  ["get a taxi", "catch a taxi", "둘 다 '택시를 잡다'예요"],
  ["take a taxi", "get a taxi", "take는 '타다', get은 '잡다' 느낌이에요"],
  ["could", "can", "could가 조금 더 공손해요"],
  ["can", "could", "could가 조금 더 공손해요"],
  ["would like", "want", "would like가 더 공손해요"],
  ["want", "would like", "want가 더 직접적이에요"],
  ["going to", "gonna", "gonna는 말할 때 줄인 형태예요"],
  ["i will", "i'll", "I'll은 I will의 줄임말이에요"],
  ["i'll", "i will", "I'll은 I will의 줄임말이에요"],
  ["do not", "don't", "don't는 do not의 줄임말이에요"],
  ["don't", "do not", "don't는 do not의 줄임말이에요"],
  ["it is", "it's", "it's는 it is의 줄임말이에요"],
  ["it's", "it is", "it's는 it is의 줄임말이에요"],
  ["is not", "isn't", "isn't는 is not의 줄임말이에요"],
  ["isn't", "is not", "isn't는 is not의 줄임말이에요"],
  ["finish", "complete", "finish가 더 자주 쓰는 말이에요"],
  ["pick up", "get", "pick up은 '데리러/가지러 가다'예요"],
  ["call", "phone", "call이 더 자주 쓰는 말이에요"],
  ["help me", "assist me", "help가 더 자주 쓰는 말이에요"],
  ["shop", "store", "둘 다 '가게'예요"],
  ["store", "shop", "둘 다 '가게'예요"],
  ["movie", "film", "movie가 미국식으로 더 흔해요"],
  ["trash", "garbage", "둘 다 '쓰레기'예요"],
  ["cell phone", "phone", "phone만 써도 통해요"]
];
function twNorm(s){ return " " + tailKey(s) + " "; }
/* 입력이 정답과 '같은 뜻 다른 말' 하나 차이인지 — 맞으면 [정답 쪽 말, 입력 쪽 말, 설명] */
function twSame(typed, ans){
  var a = twNorm(ans), t = twNorm(typed), i, x;
  for(i=0;i<TW_SAME.length;i++){
    x = TW_SAME[i];
    var from = " " + x[0].replace(/'/g, "") + " ", to = " " + x[1].replace(/'/g, "") + " ";
    if(a.indexOf(from) < 0) continue;
    if(a.replace(from, to) === t) return x;
  }
  return null;
}
/* 단어 단위 비교(LCS) — 정답 쪽 표시 html 과 내 답 쪽 표시 html */
function twDiff(typed, ans){
  var A = tailWords(ans), T = tailWords(typed), n = A.length, m = T.length, i, j;
  var Ak = A.map(function(w){ return w.replace(/'/g, ""); }), Tk = T.map(function(w){ return w.replace(/'/g, ""); });
  var L = []; for(i=0;i<=n;i++){ L.push([]); for(j=0;j<=m;j++) L[i].push(0); }
  for(i=n-1;i>=0;i--) for(j=m-1;j>=0;j--) L[i][j] = Ak[i] === Tk[j] ? L[i+1][j+1] + 1 : Math.max(L[i+1][j], L[i][j+1]);
  var ah = [], th = [], wrong = [], miss = [], extra = [];
  i = 0; j = 0;
  while(i < n || j < m){
    if(i < n && j < m && Ak[i] === Tk[j]){ ah.push(esc(A[i])); th.push(esc(T[j])); i++; j++; }
    else if(j < m && (i >= n || L[i][j+1] >= L[i+1][j])){
      /* 내가 더 썼거나 바꿔 쓴 단어 */
      if(i < n && L[i+1][j+1] === L[i][j] - 0 && L[i+1][j] === L[i][j+1]){ ah.push('<u class="twFix">' + esc(A[i]) + '</u>'); th.push('<s class="twBad">' + esc(T[j]) + '</s>'); wrong.push([T[j], A[i]]); i++; j++; }
      else { th.push('<s class="twBad">' + esc(T[j]) + '</s>'); extra.push(T[j]); j++; }
    } else {
      ah.push('<u class="twFix">' + esc(A[i]) + '</u>'); miss.push(A[i]); i++;
    }
  }
  var why = [];
  for(i=0;i<Math.min(2, wrong.length);i++) why.push("‘" + wrong[i][0] + "’ 대신 ‘" + wrong[i][1] + "’");
  if(miss.length) why.push("‘" + miss.slice(0, 3).join(" ") + "’ 빠짐");
  if(extra.length) why.push("‘" + extra.slice(0, 3).join(" ") + "’ 은 없는 말");
  return { ans:ah.join(" "), mine:th.join(" "), why:why.join(" · ") };
}
var _tailSubmitWhy = tailSubmit;
tailSubmit = function(){
  if(!TL.on || TL.phase === "done" || !TL.cur) return _tailSubmitWhy.apply(this, arguments);
  var inp = $("tInput"), typed = String(inp.value || ""), q = TL.cur;
  if(!typed.trim()) return _tailSubmitWhy.apply(this, arguments);
  var exact = tailKey(typed) === tailKey(q.tail);
  var same = exact ? null : twSame(typed, q.tail);
  if(same){
    /* 같은 뜻 다른 말 — 정답 처리 후 반 점으로 낮추고 상자는 올리지 않는다 */
    var st = tailStore(), b0 = st[q.id] ? (st[q.id].b || 0) : 0, sc0 = TL.score;
    inp.value = q.tail; TL.twSame = true;
    var r = _tailSubmitWhy.apply(this, arguments);
    inp.value = typed; TL.twSame = false;
    if(st[q.id]) st[q.id].b = b0;
    var got = TL.score - sc0; if(got > 5) TL.score -= (got - 5);
    var full = '<b>' + esc(q.head) + '</b> ' + esc(q.en.slice(q.head.length).replace(/^\s+/, ""));
    $("tSent").innerHTML = full + ' <em>+5</em><span class="twWhy"><b>' + esc(same[1]) + '</b>도 맞는 말이에요. ' + esc(same[2]) + '.<br>이 문장은 <b>' + esc(same[0]) + '</b>로 외워요.</span>';
    $("tTip").textContent = "다른 말도 정답! 이 문장의 말로 한 번 더 외워 봐요";
    try{ tailPaintHud(); }catch(e){}
    try{ if(typeof paintTailMarks === "function") paintTailMarks(false); }catch(e){}
    save();
    return r;
  }
  var r2 = _tailSubmitWhy.apply(this, arguments);
  if(!exact && TL.phase === "done" && $("tInput").className.indexOf("bad") >= 0){
    var df = twDiff(typed, q.tail);
    $("tSent").innerHTML = '<span class="twRow"><em>정답</em><b>' + esc(q.head) + '</b> ' + df.ans + '</span>' +
      '<span class="twRow mine"><em>내 답</em>' + df.mine + '</span>' + (df.why ? '<span class="twWhy">' + esc(df.why) + '</span>' : "");
  }
  return r2;
};
