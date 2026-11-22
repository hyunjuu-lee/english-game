/* ══════════ 1. 데이터 ══════════ */
var RAW = [
  /* 패턴 1 · I'm trying to ~ */
  ["나 지금 자려고 하는 중이야","I'm trying to sleep.","I'm trying to|sleep",1,1,1],
  ["와이파이 연결하려고 하는 중이야","I'm trying to connect to the Wi-Fi.","I'm trying to|connect to|the Wi-Fi",1,2,2],
  ["금요일 밤 자리 예약하려고 하는 중이야","I'm trying to book a table for Friday night.","I'm trying to|book a table|for Friday night",1,3,3],
  ["이 호텔에서 이틀 더 묵으려고 하는 중이야","I'm trying to stay two more nights at this hotel.","I'm trying to|stay two more nights|at this hotel",1,4,4],
  ["다음 주 발표 자료를 오늘 안에 끝내려고 하는 중이야","I'm trying to finish my presentation for next week today.","I'm trying to|finish my presentation|for next week|today",1,5,5],
  ["공항까지 택시 잡으려고 하는 중이야","I'm trying to get a taxi to the airport.","I'm trying to|get a taxi|to the airport",1,2,151],
  ["이 화면에서 좌석 고르려고 하는 중이야","I'm trying to pick a seat on this screen.","I'm trying to|pick a seat|on this screen",1,2,152],
  ["내일 진료 예약 잡으려고 하는 중이야","I'm trying to make an appointment for tomorrow.","I'm trying to|make an appointment|for tomorrow",1,2,153],
  ["옷장에 옷 정리하려고 하는 중이야","I'm trying to put my clothes away in the closet.","I'm trying to|put my clothes away|in the closet",1,2,154],
  ["이 신발 환불받으려고 하는 중이야","I'm trying to get a refund for these shoes.","I'm trying to|get a refund|for these shoes",1,2,155],
  /* 패턴 2 · I'm supposed to ~ */
  ["한 시에 친구 만나기로 되어 있어","I'm supposed to meet a friend at one.","I'm supposed to|meet a friend|at one",2,1,6],
  ["오늘 일찍 퇴근하기로 되어 있어","I'm supposed to leave work early today.","I'm supposed to|leave work|early today",2,2,7],
  ["이번 주에 호텔 예약하기로 되어 있어","I'm supposed to book the hotel this week.","I'm supposed to|book the hotel|this week",2,3,8],
  ["너랑 일곱 시에 저녁 먹기로 되어 있잖아","I'm supposed to have dinner with you at seven.","I'm supposed to|have dinner|with you|at seven",2,4,9],
  ["다음 주 월요일까지 이 보고서를 다 끝내기로 되어 있어","I'm supposed to finish this whole report by next Monday.","I'm supposed to|finish this whole report|by next Monday",2,5,10],
  ["세 시에 화상 회의 들어가기로 되어 있어","I'm supposed to join a video call at three.","I'm supposed to|join a video call|at three",2,2,156],
  ["이번 주말에 부모님 댁에 가기로 되어 있어","I'm supposed to visit my parents this weekend.","I'm supposed to|visit my parents|this weekend",2,2,157],
  ["오늘 밤에 약 먹기로 되어 있어","I'm supposed to take my medicine tonight.","I'm supposed to|take my medicine|tonight",2,2,158],
  ["금요일까지 항공권 결제하기로 되어 있어","I'm supposed to pay for the ticket by Friday.","I'm supposed to|pay for the ticket|by Friday",2,2,159],
  ["내일 아침에 호텔 셔틀 타기로 되어 있어","I'm supposed to take the hotel shuttle tomorrow morning.","I'm supposed to|take the hotel shuttle|tomorrow morning",2,2,160],
  /* 패턴 3 · I was about to ~ */
  ["막 나가려던 참이었어","I was about to leave.","I was about to|leave",3,1,11],
  ["너한테 막 전화하려던 참이었어","I was about to call you.","I was about to|call you",3,2,12],
  ["네가 전화했을 때 막 주문하려던 참이었어","I was about to order when you called.","I was about to|order|when you called",3,3,13],
  ["막 호텔에 짐 맡기려던 참이었어","I was about to leave my bags at the hotel.","I was about to|leave my bags|at the hotel",3,4,14],
  ["막 불 끄고 자려던 참이었어","I was about to turn off the light and go to bed.","I was about to|turn off the light|and go to bed",3,5,15],
  ["막 계산하려던 참이었어","I was about to pay.","I was about to|pay",3,1,161],
  ["막 이메일 답장 쓰려던 참이었어","I was about to reply to your email.","I was about to|reply to your email",3,1,162],
  ["막 우산 챙기려던 참이었어","I was about to grab my umbrella.","I was about to|grab my umbrella",3,1,163],
  ["막 세탁물 찾으러 가려던 참이었어","I was about to pick up my laundry.","I was about to|pick up my laundry",3,1,164],
  ["막 운동하러 가려던 참이었어","I was about to head to the gym.","I was about to|head to the gym",3,1,165],
  /* 패턴 4 · I'm here to ~ */
  ["체크인하러 왔어요","I'm here to check in.","I'm here to|check in",4,1,16],
  ["짐 찾으러 왔어요","I'm here to pick up my bag.","I'm here to|pick up|my bag",4,2,17],
  ["예약 확인하러 왔어요","I'm here to check my booking.","I'm here to|check|my booking",4,3,18],
  ["친구랑 저녁 먹으러 왔어요","I'm here to have dinner with a friend.","I'm here to|have dinner|with a friend",4,4,19],
  ["어제 산 노트북 교환하러 왔어요","I'm here to exchange the laptop I bought yesterday.","I'm here to|exchange the laptop|I bought yesterday",4,5,20],
  ["커피 원두 사러 왔어요","I'm here to buy coffee beans.","I'm here to|buy coffee beans",4,1,166],
  ["와인 시음하러 왔어요","I'm here to join the wine tasting.","I'm here to|join the wine tasting",4,1,167],
  ["항공권 다시 출력하러 왔어요","I'm here to print my ticket again.","I'm here to|print my ticket again",4,1,168],
  ["보증금 돌려받으러 왔어요","I'm here to get my deposit back.","I'm here to|get my deposit back",4,1,169],
  ["짐 맡기러 왔어요","I'm here to leave my luggage.","I'm here to|leave my luggage",4,1,170],
  /* 패턴 5 · I've been ~ing */
  ["아까부터 너 찾고 있었어","I've been looking for you.","I've been|looking|for you",5,1,21],
  ["한 시간째 기다리고 있어","I've been waiting for an hour.","I've been|waiting|for an hour",5,2,22],
  ["이번 주 내내 야근하고 있었어","I've been working late every night this week.","I've been|working late|every night|this week",5,3,23],
  ["하루 종일 여행 짐 싸고 있었어","I've been packing for the trip all day.","I've been|packing for the trip|all day",5,4,24],
  ["일주일 내내 로마 맛집만 찾아보고 있었어","I've been looking for restaurants in Rome all week.","I've been|looking for restaurants|in Rome|all week",5,5,25],
  ["아침부터 이사 준비하고 있어","I've been getting ready to move since morning.","I've been|getting ready|to move|since morning",5,3,171],
  ["요즘 영어 회화 연습하고 있어","I've been practicing English every day.","I've been|practicing English|every day",5,2,172],
  ["이틀째 두통이 계속되고 있어","I've been having headaches for two days.","I've been|having headaches|for two days",5,2,173],
  ["아까부터 한 시간째 너 기다리고 있어","I've been waiting for you for an hour.","I've been|waiting for you|for an hour.",5,2,174],
  ["요즘은 집에서만 밥 해 먹고 있어","I've been cooking at home a lot lately.","I've been|cooking at home|a lot lately",5,2,175],
  /* 패턴 6 · Let me ~ */
  ["내가 확인해 볼게","Let me check.","Let me|check",6,1,26],
  ["네 가방 들어 줄게","Let me carry your bag.","Let me|carry your bag",6,2,27],
  ["문 잡고 있을게","Let me hold the door for you.","Let me|hold the door|for you",6,3,28],
  ["내가 택시 불러 줄게","Let me call you a taxi.","Let me|call you|a taxi",6,2,29],
  ["내가 우리 자리 잡을 수 있는지 볼게","Let me see if I can get us a table.","Let me|see|if I can|get us a table",6,5,30],
  ["내가 메일로 파일 보내 줄게","Let me send you the file by email.","Let me|send you|the file|by email",6,3,176],
  ["내가 둘이 사진 찍어 줄게","Let me take a photo of you two.","Let me|take a photo|of you two",6,2,177],
  ["오늘 저녁 내가 계산할게","Let me pay for dinner tonight.","Let me|pay for dinner|tonight",6,2,178],
  ["내가 길 찾아볼게","Let me look up the address.","Let me|look up the address",6,1,179],
  ["내가 물 채워 줄게","Let me refill your glass.","Let me|refill your glass",6,1,180],
  /* 패턴 7 · Can I get ~? */
  ["아이스 아메리카노 한 잔 주세요","Can I get an iced Americano?","Can I get|an iced|Americano?",7,1,31],
  ["물 한 잔 더 주실래요","Can I get more water?","Can I get|more water?",7,2,32],
  ["메뉴판 좀 주실래요","Can I get the menu first?","Can I get|the menu|first",7,3,33],
  ["와이파이 비번 알려 주실래요","Can I get the Wi-Fi password?","Can I get|the Wi-Fi password?",7,4,34],
  ["이거 포장해서 봉투 하나 같이 주실래요","Can I get this to go with a bag?","Can I get|this to go|with a bag?",7,5,35],
  ["우유 대신 두유로 주실래요","Can I get soy milk instead?","Can I get|soy milk|instead?",7,2,181],
  ["포크 하나 더 주실래요","Can I get an extra fork?","Can I get|an extra fork?",7,1,182],
  ["계산서 좀 주실래요","Can I get the bill, please?","Can I get|the bill|please?",7,2,183],
  ["방 두 개로 나눠 주실래요","Can I get two separate rooms?","Can I get|two separate rooms?",7,1,184],
  ["따뜻한 물 한 잔 주실래요","Can I get a cup of hot water?","Can I get|a cup of|hot water?",7,2,185],
  /* 패턴 8 · Can you ~? */
  ["창문 좀 열어 줄래?","Can you open the window?","Can you|open|the window?",8,1,36],
  ["천천히 말해 줄래?","Can you say that slowly?","Can you|say that|slowly?",8,2,37],
  ["사진 좀 찍어 줄래?","Can you take a picture of us?","Can you|take a picture|of us?",8,3,38],
  ["이 주소로 가 줄래?","Can you take me to this address?","Can you|take me|to this address?",8,4,39],
  ["내일 아침 일곱 시에 깨워 줄래?","Can you wake me up at seven tomorrow?","Can you|wake me up|at seven|tomorrow?",8,5,40],
  ["여기서 세워 줄래","Can you pull over here?","Can you|pull over here?",8,1,186],
  ["이거 영어로 번역해 줄래","Can you translate this for me?","Can you|translate this|for me?",8,2,187],
  ["이 상자 좀 같이 들어 줄래","Can you help me lift this box?","Can you|help me|lift this box?",8,2,188],
  ["영수증 다시 찍어 줄래","Can you print the receipt again?","Can you|print|the receipt again?",8,2,189],
  ["내일 아홉 시로 예약 바꿔 줄래","Can you change my booking to nine?","Can you|change my booking|to nine?",8,2,190],
  /* 패턴 9 · Do you mind ~ing? */
  ["창문 좀 닫아 주실래요","Do you mind closing the window?","Do you mind|closing|the window?",9,1,41],
  ["음악 좀 줄여 주실래요","Do you mind turning down the music?","Do you mind|turning down|the music?",9,2,42],
  ["내 가방 좀 봐 주실래요","Do you mind watching my bag?","Do you mind|watching|my bag?",9,3,43],
  ["방을 조용한 쪽으로 바꿔 주실래요","Do you mind changing my room to a quieter one?","Do you mind|changing my room|to a quieter one?",9,4,44],
  ["앉을 수 있게 자리 좀 비켜 주실래요","Do you mind moving over a little so I can sit?","Do you mind|moving over|a little|so I can sit?",9,5,45],
  ["내가 창문 좀 열어도 될까요","Do you mind if I open the window?","Do you mind|if I|open the window?",9,1,191],
  ["내가 여기 앉아도 될까요","Do you mind if I sit here?","Do you mind|if I|sit here?",9,1,192],
  ["내가 먼저 주문해도 될까요","Do you mind if I order first?","Do you mind|if I|order first?",9,1,193],
  ["계산을 따로따로 해 주실래요","Do you mind splitting the bill?","Do you mind|splitting the bill?",9,1,194],
  ["내가 이 충전기 좀 써도 될까요","Do you mind if I use this charger?","Do you mind|if I|use this charger?",9,2,195],
  /* 패턴 10 · I'm not sure if ~ */
  ["이게 내 사이즈인지 잘 모르겠어","I'm not sure if this is my size.","I'm not sure|if this is|my size.",10,1,46],
  ["문 잠갔는지 기억이 안 나","I'm not sure if I locked the door.","I'm not sure|if I locked|the door.",10,2,47],
  ["예약이 제대로 된 건지 잘 모르겠어","I'm not sure if the booking went through.","I'm not sure|if the booking|went through.",10,3,48],
  ["여기서 현금 받는지 잘 모르겠어","I'm not sure if they take cash here.","I'm not sure|if they take cash|here.",10,4,49],
  ["이게 내가 예약한 방인지 잘 모르겠어","I'm not sure if this room is the one I booked.","I'm not sure|if this room|is the one|I booked",10,3,50],
  ["이 버스가 시내 가는지 잘 모르겠어","I'm not sure if this bus goes downtown.","I'm not sure|if this bus|goes downtown",10,2,196],
  ["우리 팀이 그 회의에 초대됐는지 잘 모르겠어","I'm not sure if our team was invited.","I'm not sure|if our team|was invited",10,2,197],
  ["이 약을 식후에 먹는 건지 잘 모르겠어","I'm not sure if I take this after meals.","I'm not sure|if I take this|after meals",10,2,198],
  ["이 표가 오늘 날짜인지 잘 모르겠어","I'm not sure if this ticket is for today.","I'm not sure|if this ticket|is for today",10,2,199],
  ["이 주소가 맞는지 잘 모르겠어","I'm not sure if I got the address right.","I'm not sure|if I got|the address right",10,2,200],
  /* 패턴 11 · I don't think ~ */
  ["이거 내가 시킨 게 아닌 것 같은데","I don't think I ordered this.","I don't think|I ordered|this.",11,1,51],
  ["오늘 문 닫은 것 같아","I don't think it's open today.","I don't think|it's open|today.",11,2,52],
  ["저 사람 여기서 일하는 것 같지 않아","I don't think he works here.","I don't think|he works|here.",11,3,53],
  ["이거 내 가방 아닌 것 같아","I don't think that bag is mine.","I don't think|that bag is|mine",11,2,54],
  ["이 가격이면 이 정도 서비스는 아닌 것 같아","I don't think the service was worth this price.","I don't think|the service was|worth this price.",11,5,55],
  ["우리 게이트가 여기가 아닌 것 같아","I don't think this is our gate.","I don't think|this is|our gate",11,2,201],
  ["그 사람이 내 말을 이해한 것 같지 않아","I don't think he understood me.","I don't think|he understood|me",11,2,202],
  ["오늘 안에 다 끝낼 수 있을 것 같지 않아","I don't think I can finish it today.","I don't think|I can finish it|today",11,2,203],
  ["이 요금이 맞는 것 같지 않아","I don't think the fare is right.","I don't think|the fare|is right",11,2,204],
  ["그 집이 그렇게 비싼 것 같지 않아","I don't think that place is that expensive.","I don't think|that place is|that expensive",11,2,205],
  /* 패턴 12 · I think you should ~ */
  ["좀 쉬는 게 좋을 것 같아","I think you should get some rest.","I think you should|get some rest.",12,1,56],
  ["택시 타는 게 좋을 것 같아","I think you should take a taxi.","I think you should|take a taxi.",12,2,57],
  ["의사한테 가 보는 게 좋을 것 같아","I think you should see a doctor.","I think you should|see a doctor.",12,3,58],
  ["다시 한 번 물어보는 게 좋을 것 같아","I think you should ask them again.","I think you should|ask them again.",12,4,59],
  ["이 가격이면 다른 데 알아보는 게 좋을 것 같아","I think you should check other places for this price.","I think you should|check other places|for this price.",12,5,60],
  ["그냥 솔직하게 말하는 게 좋을 것 같아","I think you should tell them the truth.","I think you should|tell them|the truth",12,2,206],
  ["오늘은 일찍 자는 게 좋을 것 같아","I think you should go to bed early.","I think you should|go|to bed early",12,2,207],
  ["이건 반품하는 게 좋을 것 같아","I think you should return this.","I think you should|return this",12,1,208],
  ["다음엔 온라인으로 예약하는 게 좋을 것 같아","I think you should book online next time.","I think you should|book|online next time",12,2,209],
  ["회의 전에 자료를 한 번 더 보는 게 좋을 것 같아","I think you should read the file once more.","I think you should|read the file|once more",12,2,210],
  /* 패턴 13 · It feels like ~ */
  ["오늘 여름 같아","It feels like summer today.","It feels like|summer|today.",13,1,61],
  ["다시 겨울이 온 것 같아","It feels like winter again.","It feels like|winter|again.",13,2,62],
  ["휴가 온 것 같아","It feels like I'm on vacation.","It feels like|I'm on|vacation.",13,3,63],
  ["여기가 다른 나라 같아","It feels like a different country here.","It feels like|a different country|here.",13,4,64],
  ["이번 주가 하루 만에 지나간 것 같아","It feels like the week went by in a day.","It feels like|the week|went by|in a day.",13,5,65],
  ["여기는 시간이 멈춘 것 같아","It feels like time stopped here.","It feels like|time stopped|here",13,2,211],
  ["일주일 내내 월요일인 것 같아","It feels like it's Monday every day.","It feels like|it's Monday|every day",13,2,212],
  ["이 방은 좀 추운 것 같아","It feels like this room is too cold.","It feels like|this room is|too cold",13,2,213],
  ["어제 일이 꿈 같아","It feels like yesterday was a dream.","It feels like|yesterday|was a dream",13,2,214],
  ["이 재킷은 너무 큰 것 같아","It feels like this jacket is too big.","It feels like|this jacket|is too big",13,2,215],
  /* 패턴 14 · It looks like ~ */
  ["비 올 것 같아","It looks like rain.","It looks like|rain.",14,1,66],
  ["밖에서 보니 괜찮아 보여","It looks like a nice place from outside.","It looks like|a nice place|from outside.",14,2,67],
  ["안에 사람 많아 보여","It looks like it's crowded inside.","It looks like|it's crowded|inside.",14,3,68],
  ["예약이 안 된 것 같아","It looks like something went wrong.","It looks like|something|went wrong.",14,4,69],
  ["오늘은 문 닫은 것 같아","It looks like they're closed today.","It looks like|they're closed|today.",14,5,70],
  ["비행기가 연착된 것 같아","It looks like the flight is delayed.","It looks like|the flight|is delayed",14,2,216],
  ["택시가 벌써 도착한 것 같아","It looks like the taxi is already here.","It looks like|the taxi|is already here",14,2,217],
  ["더 싼 데가 있는 것 같아","It looks like there's a cheaper place.","It looks like|there's a|cheaper place",14,2,218],
  ["다들 아직 자는 것 같아","It looks like everyone is still asleep.","It looks like|everyone is|still asleep",14,2,219],
  ["저 다리 건너면 시내인 것 같아","It looks like downtown is over that bridge.","It looks like|downtown is|over that bridge",14,2,220],
  /* 패턴 15 · It sounds like ~ */
  ["좋은 생각인 것 같아","It sounds like a good idea.","It sounds like|a good idea.",15,1,71],
  ["재미있을 것 같아","It sounds like fun.","It sounds like|fun.",15,2,72],
  ["너 피곤한 것 같아","It sounds like you're tired.","It sounds like|you're|tired.",15,3,73],
  ["다들 만족한 것 같아","It sounds like everyone was happy.","It sounds like|everyone|was happy.",15,4,74],
  ["그 식당 괜찮은 것 같아","It sounds like that restaurant is really good.","It sounds like|that restaurant|is really good.",15,5,75],
  ["너 오늘 기분이 좋은 것 같아","It sounds like you're in a good mood.","It sounds like|you're in|a good mood",15,2,221],
  ["회의가 길어질 것 같아","It sounds like the meeting will run long.","It sounds like|the meeting|will run long",15,2,222],
  ["그 와인바가 시끄러운 것 같아","It sounds like that wine bar is noisy.","It sounds like|that wine bar|is noisy",15,2,223],
  ["비행기가 또 취소된 것 같아","It sounds like the flight got canceled again.","It sounds like|the flight|got canceled again",15,2,224],
  ["다들 그 소식을 이미 아는 것 같아","It sounds like they already know.","It sounds like|they already|know",15,2,225],
  /* 패턴 16 · There is / There are ~ */
  ["문제가 하나 있어","There is a problem.","There is|a problem.",16,1,76],
  ["근처에 좋은 카페가 있어","There is a nice cafe nearby.","There is|a nice cafe|nearby.",16,2,77],
  ["이 근처에 와인바가 하나 있어","There is a wine bar around here.","There is|a wine bar|around here.",16,3,78],
  ["이 호텔에 사우나가 있어","There is a sauna in this hotel.","There is|a sauna|in this hotel.",16,4,79],
  ["내일 예약할 수 있는 자리가 몇 개 있어","There are a few tables open tomorrow.","There are|a few tables|open|tomorrow.",16,5,80],
  ["이 근처에 작은 가게가 두 개 있어","There are two small stores near here.","There are|two small stores|near here",16,2,226],
  ["지하에 세탁실이 있어","There is a laundry room downstairs.","There is|a laundry room|downstairs",16,2,227],
  ["공항까지 가는 버스가 있어","There is a bus to the airport.","There is|a bus|to the airport",16,2,228],
  ["손님이 세 분 더 와","There are three more guests coming.","There are|three more guests|coming",16,2,229],
  ["메뉴에 채식 요리가 몇 개 있어","There are a few vegetarian dishes.","There are|a few|vegetarian dishes",16,2,230],
  /* 패턴 17 · I'd like to ~ */
  ["지금 주문하고 싶어요","I'd like to order now.","I'd like to|order|now.",17,1,81],
  ["방을 바꾸고 싶어요","I'd like to change my room.","I'd like to|change|my room.",17,2,82],
  ["내일 아침에 체크아웃하고 싶어요","I'd like to check out tomorrow morning.","I'd like to|check out|tomorrow morning.",17,3,83],
  ["창가 자리로 예약하고 싶어요","I'd like to book a table by the window.","I'd like to|book a table|by the window.",17,4,84],
  ["이거 취소하고 싶어요","I'd like to cancel this.","I'd like to|cancel|this.",17,5,85],
  ["메뉴판 좀 보고 싶어요","I'd like to see the menu.","I'd like to|see|the menu.",17,1,231],
  ["이걸로 한번 해볼게요","I'd like to try this one.","I'd like to|try|this one.",17,2,232],
  ["내일 투어 참여하고 싶어요","I'd like to join the tour tomorrow.","I'd like to|join the tour|tomorrow",17,2,233],
  ["카드로 결제하고 싶어요","I'd like to pay by card.","I'd like to|pay by card",17,1,234],
  ["조식 시간을 알고 싶어요","I'd like to know the breakfast hours.","I'd like to|know the|breakfast hours",17,2,235],
  /* 패턴 18 · I need you to ~ */
  ["여기다 사인해 줬으면 해","I need you to sign here.","I need you to|sign|here.",18,1,86],
  ["잠깐만 기다려 줬으면 해","I need you to wait a minute.","I need you to|wait a minute.",18,2,87],
  ["이거 좀 확인해 줬으면 해","I need you to check this.","I need you to|check|this.",18,2,88],
  ["그거 나한테 보내 줬으면 해","I need you to send it to me.","I need you to|send it|to me.",18,2,89],
  ["지금 나한테 말해 줬으면 해","I need you to tell me now.","I need you to|tell me|now.",18,1,90],
  ["이거 좀 도와줬으면 해","I need you to help me with this.","I need you to|help me|with this.",18,2,236],
  ["내 짐 좀 방으로 올려 줬으면 해","I need you to bring my bags up.","I need you to|bring my bags up.",18,2,237],
  ["택시 한 대 불러 주셨으면 해요","I need you to call a taxi for me.","I need you to|call a taxi|for me.",18,2,238],
  ["방 청소 좀 해 주셨으면 해요","I need you to clean the room.","I need you to|clean|the room.",18,1,239],
  ["여기서 내려 주셨으면 해요","I need you to drop me off here.","I need you to|drop me off|here.",18,2,240],
  /* 패턴 19 · I just wanted to ~ */
  ["그냥 인사하려고","I just wanted to say hi.","I just wanted to|say|hi.",19,1,91],
  ["그냥 뭐 하나 물어보려고","I just wanted to ask you something.","I just wanted to|ask you|something.",19,2,92],
  ["그냥 하나만 확인하려고","I just wanted to check one thing.","I just wanted to|check|one thing.",19,3,93],
  ["그냥 지금 말해 주려고","I just wanted to tell you now.","I just wanted to|tell you|now.",19,4,94],
  ["그냥 이 사진 보여 주려고","I just wanted to show you this photo.","I just wanted to|show you|this photo.",19,5,95],
  ["그냥 감사하다고 말씀드리려고요","I just wanted to say thank you.","I just wanted to|say|thank you.",19,2,241],
  ["그냥 제 예약만 확인하려고요","I just wanted to check my booking.","I just wanted to|check|my booking.",19,2,242],
  ["그냥 메뉴판 좀 보려고요","I just wanted to see the menu.","I just wanted to|see|the menu.",19,2,243],
  ["그냥 조식 좀 여쭤보려고요","I just wanted to ask about breakfast.","I just wanted to|ask about|breakfast.",19,1,244],
  ["그냥 이거 한번 해 보려고요","I just wanted to try this one.","I just wanted to|try|this one.",19,2,245],
  /* 패턴 20 · I was wondering if ~ */
  ["혹시 방 있나 해서요","I was wondering if you have a room.","I was wondering if|you have|a room.",20,1,96],
  ["혹시 자리 있나 해서요","I was wondering if there's a table.","I was wondering if|there's a table",20,1,97],
  ["혹시 내일 시간 되나 해서요","I was wondering if you have time tomorrow.","I was wondering if|you have|time|tomorrow.",20,3,98],
  ["혹시 이것도 되나 해서요","I was wondering if this works too.","I was wondering if|this works|too.",20,4,99],
  ["혹시 늦게 도착해도 괜찮은지 해서요","I was wondering if it's okay to arrive late.","I was wondering if|it's okay|to arrive late.",20,5,100],
  ["혹시 예약을 오늘로 옮길 수 있는지 해서요","I was wondering if I can move my booking to today.","I was wondering if|I can move|my booking|to today",20,3,246],
  ["혹시 이 근처에 약국이 있는지 해서요","I was wondering if there's a pharmacy nearby.","I was wondering if|there's a pharmacy|nearby",20,2,247],
  ["혹시 짐을 좀 맡길 수 있는지 해서요","I was wondering if I can leave my bags here.","I was wondering if|I can leave|my bags here",20,2,248],
  ["혹시 이 요금에 세금이 포함되는지 해서요","I was wondering if the price includes tax.","I was wondering if|the price|includes tax",20,2,249],
  ["혹시 이 쿠폰을 여기서 쓸 수 있는지 해서요","I was wondering if I can use this coupon here.","I was wondering if|I can use|this coupon here",20,2,250],
  /* 패턴 21 · The thing is, ~ */
  ["실은 오늘 좀 바빠","The thing is I'm busy today.","The thing is|I'm busy|today.",21,1,101],
  ["문제는 내일 못 간다는 거야","The thing is I can't go tomorrow.","The thing is|I can't go|tomorrow.",21,2,102],
  ["실은 그 식당 예약이 안 돼","The thing is that place is fully booked.","The thing is|that place is|fully booked.",21,3,103],
  ["문제는 내가 그날 출장이라는 거야","The thing is I'm on a business trip that day.","The thing is|I'm on|a business trip|that day.",21,4,104],
  ["실은 이번 주말에 이미 다른 약속이 있어","The thing is I already have plans this weekend.","The thing is|I already have|plans|this weekend.",21,5,105],
  ["문제는 내일 비행기가 아침 여섯 시라는 거야","The thing is my flight is at six tomorrow.","The thing is|my flight is|at six tomorrow",21,2,251],
  ["실은 그날 회사에 꼭 있어야 해","The thing is I have to be at work that day.","The thing is|I have to be|at work that day",21,2,252],
  ["문제는 내가 그 식당을 못 찾겠다는 거야","The thing is I can't find the restaurant.","The thing is|I can't find|the restaurant",21,2,253],
  ["실은 예약을 이미 취소했어","The thing is I already canceled it.","The thing is|I already|canceled it",21,2,254],
  ["문제는 이 카드가 안 된다는 거야","The thing is this card doesn't work.","The thing is|this card|doesn't work",21,2,255],
  /* 패턴 22 · As far as I know, ~ */
  ["내가 알기론 여기 일곱 시에 열어","As far as I know it opens at seven.","As far as I know|it opens|at seven.",22,1,106],
  ["내가 알기론 걔 이번 주에 없어","As far as I know he's away this week.","As far as I know|he's away|this week.",22,2,107],
  ["내가 알기론 이번 주는 예약이 다 찼어","As far as I know this week is fully booked.","As far as I know|this week is|fully booked.",22,3,108],
  ["내가 알기론 그 가게는 월요일마다 쉬어","As far as I know that place closes on Mondays.","As far as I know|that place|closes on Mondays.",22,4,109],
  ["내가 알기론 아직 아무것도 결정된 게 없어","As far as I know nothing has been decided yet.","As far as I know|nothing|has been decided|yet.",22,5,110],
  ["내가 알기론 이 버스는 거기 안 가","As far as I know this bus doesn't go there.","As far as I know|this bus|doesn't go there",22,2,256],
  ["내가 알기론 보증금은 환불돼","As far as I know the deposit is refundable.","As far as I know|the deposit|is refundable",22,2,257],
  ["내가 알기론 그 팀은 아직 답을 안 줬어","As far as I know they haven't replied yet.","As far as I know|they haven't|replied yet",22,2,258],
  ["내가 알기론 주차는 무료야","As far as I know parking is free.","As far as I know|parking is free",22,1,259],
  ["내가 알기론 이 건물엔 엘리베이터가 없어","As far as I know there's no elevator.","As far as I know|there's no elevator",22,1,260],
  /* 패턴 23 · You don't have to ~ */
  ["걱정할 필요 없어","You don't have to worry.","You don't have to|worry.",23,1,111],
  ["일찍 올 필요 없어","You don't have to come early.","You don't have to|come early.",23,2,112],
  ["나 기다릴 필요 없어","You don't have to wait for me.","You don't have to|wait|for me.",23,3,113],
  ["오늘 다 할 필요 없어","You don't have to finish it today.","You don't have to|finish it|today.",23,4,114],
  ["내가 다 준비했으니까 봉투 챙길 필요 없어","You don't have to bring a bag for it.","You don't have to|bring a bag|for it.",23,5,115],
  ["벌써 나갈 필요 없어","You don't have to leave yet.","You don't have to|leave|yet",23,2,261],
  ["다 설명할 필요 없어","You don't have to explain everything.","You don't have to|explain everything",23,1,262],
  ["지금 결정할 필요 없어","You don't have to decide now.","You don't have to|decide|now",23,2,263],
  ["택시 탈 필요 없어","You don't have to take a taxi.","You don't have to|take a taxi",23,1,264],
  ["사과할 필요 없어","You don't have to say sorry.","You don't have to|say sorry",23,1,265],
  /* 패턴 24 · You might want to ~ */
  ["다시 확인해 보는 게 좋을 거야","You might want to check again.","You might want to|check again.",24,1,116],
  ["우산 챙기는 게 좋을 거야","You might want to take an umbrella.","You might want to|take|an umbrella.",24,2,117],
  ["미리 예약하는 게 좋을 거야","You might want to book ahead.","You might want to|book|ahead.",24,3,118],
  ["택시 타고 가는 게 좋을 거야","You might want to take a taxi there.","You might want to|take a taxi|there.",24,4,119],
  ["다음엔 좀 더 일찍 오는 게 좋을 거야","You might want to come a little earlier next time.","You might want to|come a little earlier|next time.",24,5,120],
  ["여권 챙기는 게 좋을 거야","You might want to bring your passport.","You might want to|bring|your passport",24,2,266],
  ["짐을 줄이는 게 좋을 거야","You might want to pack less.","You might want to|pack less",24,1,267],
  ["호텔에 미리 전화하는 게 좋을 거야","You might want to call the hotel first.","You might want to|call the hotel|first",24,2,268],
  ["환전을 미리 하는 게 좋을 거야","You might want to change money in advance.","You might want to|change money|in advance",24,2,269],
  ["이 주소를 저장하는 게 좋을 거야","You might want to save this address.","You might want to|save|this address",24,2,270],
  /* 패턴 25 · It depends on ~ */
  ["상황에 따라 달라","It depends on the situation.","It depends on|the situation.",25,1,121],
  ["날씨에 따라 달라","It depends on the weather.","It depends on|the weather.",25,2,122],
  ["요일에 따라 달라","It depends on the day.","It depends on|the day.",25,3,123],
  ["몇 명 오는지에 따라 달라","It depends on how many people come.","It depends on|how many people|come.",25,4,124],
  ["얼마나 걸리는지에 따라 달라","It depends on how long it takes.","It depends on|how long|it takes.",25,5,125],
  ["예산에 따라 달라","It depends on the budget.","It depends on|the budget",25,1,271],
  ["어디서 먹는지에 따라 달라","It depends on where we eat.","It depends on|where we eat",25,1,272],
  ["몇 시에 출발하는지에 따라 달라","It depends on what time we leave.","It depends on|what time|we leave",25,2,273],
  ["호텔이 어디 있는지에 따라 달라","It depends on where the hotel is.","It depends on|where the hotel is",25,1,274],
  ["그날 기분에 따라 달라","It depends on my mood.","It depends on|my mood",25,1,275],
  /* 패턴 26 · I'll let you know ~ */
  ["나중에 알려줄게","I'll let you know later.","I'll let you know|later.",26,1,126],
  ["내일 알려줄게","I'll let you know tomorrow.","I'll let you know|tomorrow.",26,2,127],
  ["결정되면 알려줄게","I'll let you know when it's decided.","I'll let you know|when it's decided.",26,3,128],
  ["예약되면 바로 알려줄게","I'll let you know as soon as it's booked.","I'll let you know|as soon as|it's booked.",26,4,129],
  ["내일 아침에 정확한 시간 알려줄게","I'll let you know the exact time tomorrow morning.","I'll let you know|the exact time|tomorrow morning.",26,5,130],
  ["도착하면 알려줄게","I'll let you know when I arrive.","I'll let you know|when I arrive",26,1,276],
  ["뭐가 문제인지 알려줄게","I'll let you know what the problem is.","I'll let you know|what the problem is",26,1,277],
  ["누구랑 같이 가는지 알려줄게","I'll let you know who's coming.","I'll let you know|who's coming",26,1,278],
  ["나가기 전에 알려줄게","I'll let you know before I leave.","I'll let you know|before I leave",26,1,279],
  ["보증금이 얼마인지 알려줄게","I'll let you know how much the deposit is.","I'll let you know|how much|the deposit is",26,2,280],
  /* 패턴 27 · I didn't mean to ~ */
  ["일부러 그런 건 아니야","I didn't mean to do that.","I didn't mean to|do that.",27,1,131],
  ["널 기다리게 하려던 건 아니었어","I didn't mean to keep you waiting.","I didn't mean to|keep you|waiting.",27,2,132],
  ["네 잔을 엎으려던 건 아니었어","I didn't mean to knock over your glass.","I didn't mean to|knock over|your glass.",27,3,133],
  ["예약을 취소하려던 건 아니었어","I didn't mean to cancel the booking.","I didn't mean to|cancel|the booking.",27,4,134],
  ["너한테 그렇게 말하려던 건 아니었어","I didn't mean to say it like that.","I didn't mean to|say it|like that.",27,5,135],
  ["너를 빼먹으려던 건 아니었어","I didn't mean to leave you out.","I didn't mean to|leave you out",27,1,281],
  ["이렇게 일찍 나가려던 건 아니었어","I didn't mean to leave so early.","I didn't mean to|leave so early",27,1,282],
  ["네 문자를 무시하려던 건 아니었어","I didn't mean to ignore your message.","I didn't mean to|ignore your message",27,1,283],
  ["이렇게 많이 시키려던 건 아니었어","I didn't mean to order so much.","I didn't mean to|order so much",27,1,284],
  ["네 시간을 뺏으려던 건 아니었어","I didn't mean to take up your time.","I didn't mean to|take up|your time",27,2,285],
  /* 패턴 28 · I can't wait to ~ */
  ["빨리 만나고 싶어","I can't wait to see you.","I can't wait to|see you.",28,1,136],
  ["여행이 너무 기대돼","I can't wait to travel.","I can't wait to|travel.",28,2,137],
  ["로마 가는 게 너무 기대돼","I can't wait to go to Rome.","I can't wait to|go to Rome.",28,3,138],
  ["이번 주말 와인 자리가 기대돼","I can't wait to try that wine bar.","I can't wait to|try|that wine bar.",28,4,139],
  ["다음 달 부산 여행이 너무 기대돼","I can't wait to go to Busan next month.","I can't wait to|go to Busan|next month.",28,5,140],
  ["이번 주 일찍 끝내고 싶어","I can't wait to finish this week.","I can't wait to|finish this week",28,1,286],
  ["새로 산 자전거 타 보고 싶어","I can't wait to ride my new bike.","I can't wait to|ride my new bike",28,1,287],
  ["사진 다 보고 싶어","I can't wait to see the photos.","I can't wait to|see the photos",28,1,288],
  ["주말에 푹 자고 싶어","I can't wait to sleep in this weekend.","I can't wait to|sleep in|this weekend",28,2,289],
  ["와인 한 잔 마시고 싶어","I can't wait to have a glass of wine.","I can't wait to|have a glass|of wine",28,2,290],
  /* 패턴 29 · That's why ~ */
  ["그래서 내가 일찍 나간 거야","That's why I left early.","That's why|I left|early.",29,1,141],
  ["그래서 내가 택시를 탄 거야","That's why I took a taxi.","That's why|I took|a taxi.",29,2,142],
  ["그래서 내가 미리 예약해 둔 거야","That's why I booked it in advance.","That's why|I booked it|in advance.",29,3,143],
  ["그래서 내가 이 근처 호텔을 고른 거야","That's why I picked a hotel near here.","That's why|I picked|a hotel near here.",29,4,144],
  ["그래서 내가 오늘은 아무 일정도 안 잡은 거야","That's why I didn't make any plans today.","That's why|I didn't make|any plans|today.",29,5,145],
  ["그래서 내가 우산을 챙긴 거야","That's why I brought an umbrella.","That's why|I brought|an umbrella",29,2,291],
  ["그래서 내가 영어를 계속 연습하는 거야","That's why I keep practicing English.","That's why|I keep|practicing English",29,2,292],
  ["그래서 내가 이 집을 좋아하는 거야","That's why I like this place.","That's why|I like|this place",29,2,293],
  ["그래서 내가 어제 일찍 잤던 거야","That's why I went to bed early.","That's why|I went|to bed early",29,2,294],
  ["그래서 내가 여행 날짜를 바꾼 거야","That's why I changed the dates.","That's why|I changed|the dates",29,2,295],
  /* 패턴 30 · That's what I mean. */
  ["바로 그거야","That's what I mean.","That's what|I mean.",30,1,146],
  ["내가 말한 게 그거야","That's what I said.","That's what|I said.",30,2,147],
  ["그게 내가 원한 거야","That's what I wanted.","That's what|I wanted.",30,3,148],
  ["그게 내가 걱정했던 거야","That's what I was worried about.","That's what|I was|worried about.",30,4,149],
  ["내가 찾던 게 바로 그거야","That's what I was looking for.","That's what|I was|looking for.",30,5,150],
  ["그게 내가 기다리던 거야","That's what I've been waiting for.","That's what|I've been|waiting for",30,2,296],
  ["그게 내가 마시고 싶었던 거야","That's what I wanted to drink.","That's what|I wanted|to drink",30,2,297],
  ["그게 내가 물어본 거야","That's what I asked.","That's what|I asked",30,1,298],
  ["그게 내가 추천한 거야","That's what I recommended.","That's what|I recommended",30,1,299],
  ["그게 내가 다시 보내야 하는 거야","That's what I have to send again.","That's what|I have to|send again",30,2,300]
];

/* 원어민 필수 회화 패턴 30 — widgets/english-patterns-30 과 같은 번호·문구·의미를 쓴다.
   도감·스테이지 목록·앞머리 함정·패턴 해금 계산이 모두 이 번호를 기준으로 돈다. */
var PATTERNS = ["",
  "I'm trying to ~",
  "I'm supposed to ~",
  "I was about to ~",
  "I'm here to ~",
  "I've been ~ing",
  "Let me ~",
  "Can I get ~?",
  "Can you ~?",
  "Do you mind ~ing / if I ~?",
  "I'm not sure if ~",
  "I don't think ~",
  "I think you should ~",
  "It feels like ~",
  "It looks like ~",
  "It sounds like ~",
  "There is / There are ~",
  "I'd like to ~",
  "I need you to ~",
  "I just wanted to ~",
  "I was wondering if ~",
  "The thing is, ~",
  "As far as I know, ~",
  "You don't have to ~",
  "You might want to ~",
  "It depends on ~",
  "I'll let you know ~",
  "I didn't mean to ~",
  "I can't wait to ~",
  "That's why ~",
  "That's what I mean."
];

/* 스테이지 37개 — 패턴 1~30을 하나씩 도는 개별 레벨 + 5패턴마다 MIX + FINAL MIX + 무한 서바이벌.
   Lv.1~5 = 패턴 1~5 → Lv.6 MIX 1(패턴 1~5) → Lv.7~11 = 패턴 6~10 → Lv.12 MIX 2(1~10) → …
   Lv.31~35 = 패턴 26~30 → Lv.36 FINAL MIX(1~30) → Lv.37 무한 서바이벌. 전 스테이지 자유 플레이. */
var GOAL_PAT = 10, GOAL_MIX = 15, GOAL_FINAL = 20;   /* 스테이지 종류별 목표 문장 수 */
var MIX_EVERY = 5;                                   /* 몇 패턴마다 MIX 스테이지를 끼우는지 */
var PAT_STAGES = 35;                                 /* 패턴·MIX 스테이지 = Lv.1~35 */
var STAGES = (function(){
  var list = [], n, block, pos, p, mix, total = PATTERNS.length - 1;
  for(n=1;n<=PAT_STAGES;n++){
    block = Math.floor((n-1)/6); pos = (n-1)%6;
    if(pos === 5){
      mix = block + 1;
      list.push({ n:n, kind:"mix", mix:mix, p:0, from:1, to:MIX_EVERY*mix,
                  goal:Math.min(GOAL_MIX, 10*MIX_EVERY*mix) });
    } else {
      p = block*MIX_EVERY + pos + 1;
      /* 패턴마다 10문장 — Lv.1도 패턴 1의 10문장을 전부 푼다 */
      list.push({ n:n, kind:"pat", mix:0, p:p, from:p, to:p, goal:Math.min(GOAL_PAT, 10*p) });
    }
  }
  list.push({ n:PAT_STAGES+1, kind:"final", mix:0, p:0, from:1, to:total, goal:Math.min(GOAL_FINAL, 10*total) });
  list.push({ n:PAT_STAGES+2, kind:"inf",   mix:0, p:0, from:1, to:total, goal:0 });
  return list;
})();
var STAGES_TOTAL = STAGES.length;    /* 37 */
var LAST_LEVEL = STAGES_TOTAL - 1;   /* 36 — 마지막으로 클리어하는 스테이지, 37은 무한 서바이벌 */
var GOAL = GOAL_PAT;                 /* 기본 목표 — 실제 목표는 stageMeta(n).goal */

/* 스테이지 한 칸의 정보 — 종류(pat/mix/final/inf)·패턴 범위·목표 문장 수 */
function stageMeta(n){
  return STAGES[Math.max(1, Math.min(STAGES_TOTAL, n || 1)) - 1];
}
function isInfStage(n){ return stageMeta(n).kind === "inf"; }
function isBoss(n){ return isInfStage(n); }

/* ── 순차 해금 ──
   기본은 Lv.1만 열려 있고, 해금된 최대 단계를 깨면 그 다음 단계가 열린다.
   이미 클리어 기록(stageDone)이 있으면 '가장 높이 깬 단계 + 1'까지 자동으로 열린다. */
function unlockedMax(){
  var n = 1, k, v;
  for(k in store.stageDone){
    if(!store.stageDone.hasOwnProperty(k) || !store.stageDone[k]) continue;
    v = +k;
    if(isNaN(v)) continue;
    if(v + 1 > n) n = v + 1;
  }
  return Math.min(STAGES_TOTAL, Math.max(1, n));
}
function stageLocked(n){ return (n || 1) > unlockedMax(); }
function needStageOf(n){ return Math.max(1, (n || 1) - 1); }

/* ── 레벨별 3단계(티어) ──
   패턴 스테이지는 같은 패턴을 난이도만 올려 세 번 도전한다.
     Lv.N-1  그 패턴 집중 · 10문장
     Lv.N-2  Lv.N+4까지 깬 패턴을 섞어 12문장 (Lv.N-1 + Lv.N+4 클리어 시 해금)
     Lv.N-3  Lv.N+9까지 깬 패턴을 섞어 15문장 (Lv.N-2 + Lv.N+9 클리어 시 해금) */
var TIER_GOAL = [0, 10, 12, 15];
function needStage2(n){ return Math.min(LAST_LEVEL, (n || 1) + 4); }
function needStage3(n){ return Math.min(LAST_LEVEL, (n || 1) + 9); }
function tierNeed(n, t){ return (t <= 2) ? needStage2(n) : needStage3(n); }
function tierKey(n, t){ return (t > 1) ? (n + "-" + t) : String(n); }
function tierDone(n, t){ return !!store.stageDone[tierKey(n, t)]; }
function tierLocked(n, t){
  t = Math.max(1, Math.min(3, t || 1));
  if(stageLocked(n)) return true;
  if(t === 1) return false;
  if(tierDone(n, t)) return false;          /* 이미 깬 단계는 언제든 다시 할 수 있다 */
  if(!tierDone(n, t - 1)) return true;
  return !store.stageDone[String(tierNeed(n, t))];
}
var TIER_NAMES = ["", "Easy", "Normal", "Hard"];
/* 레벨 표기 — 패턴이면 Lv.N Easy, MIX/FINAL이면 Lv.N */
function lvStageLabel(n){
  var m = stageMeta(n);
  return (m && m.kind === "pat") ? ("Lv." + n + " Easy") : ("Lv." + n);
}
/* 잠긴 이유 — 시작 버튼에 들어갈 짧은 말 */
function tierNeedShort(n, t){
  t = Math.max(1, Math.min(3, t || 1));
  if(stageLocked(n)) return lvStageLabel(needStageOf(n)) + " 완료 후 열려요";
  if(!tierDone(n, t - 1)) return TIER_NAMES[t - 1] + " 완료 후 열려요";
  return lvStageLabel(tierNeed(n, t)) + " 완료 후 열려요";
}
/* 잠긴 이유 — 보드 아래 한 줄 */
function tierNeedDesc(n, t){
  t = Math.max(1, Math.min(3, t || 1));
  if(stageLocked(n)) return lvStageLabel(needStageOf(n)) + " 완료 후 열려요";
  if(!tierDone(n, t - 1)) return TIER_NAMES[t - 1] + " · " + lvStageLabel(tierNeed(n, t)) + " 완료 후 열려요";
  return lvStageLabel(tierNeed(n, t)) + " 완료 후 열려요";
}
/* 깬 단계 수 = 별 개수 */
function tierCount(n){ var c = 0, i; for(i=1;i<=3;i++) if(tierDone(n, i)) c++; return c; }
var MAX_STARS = 90;              /* 패턴 30개 x 3단계 — 한 단계 깰 때마다 별 1개 */
function totalStars(){
  var i, s = 0;
  for(i=0;i<STAGES.length;i++){
    if(STAGES[i].kind !== "pat") continue;
    s += tierCount(STAGES[i].n);
  }
  return s;
}
function tierGoal(n, t){
  var m = stageMeta(n);
  if(m.kind !== "pat") return m.goal;
  return TIER_GOAL[Math.max(1, Math.min(3, t || 1))];
}
/* 이 패턴에서 지금 열려 있는 가장 높은 단계 */
function tierOpen(n){ var t = 0, i; for(i=1;i<=3;i++) if(!tierLocked(n, i)) t = i; return t || 1; }
/* 홈 카드가 처음 골라 줄 단계 — 아직 안 깬, 가장 높은 열린 단계 */
function defaultTier(n){
  var t;
  if(stageMeta(n).kind !== "pat") return 1;
  for(t=1;t<=3;t++) if(!tierDone(n, t) && !tierLocked(n, t)) return t;
  for(t=3;t>=1;t--) if(!tierLocked(n, t)) return t;
  return 1;
}
/* 2·3단계가 섞어 내는 마지막 패턴 */
function tierMixTo(n, t){ return stageMeta(tierNeed(n, t)).to; }
function tierHint(n, t){
  var m = stageMeta(n);
  if(m.kind !== "pat") return stageHint(n);
  t = Math.max(1, Math.min(3, t || 1));
  if(t === 1) return TIER_GOAL[1] + "문장";
  return "복습 포함 · " + TIER_GOAL[t] + "문장";
}
/* 클리어한 뒤 이어서 할 단계 — 같은 레벨의 다음 단계가 열렸으면 그것부터 */
function nextStageTier(n, t){
  var t2;
  if(stageMeta(n).kind === "pat")
    for(t2 = (t || 1) + 1; t2 <= 3; t2++) if(!tierLocked(n, t2)) return { n:n, t:t2 };
  var n2 = Math.min(STAGES_TOTAL, (n || 1) + 1);
  return { n:n2, t:defaultTier(n2) };
}

/* 원문 데이터 — ko 한국어 / en 영어 / chunks 조립 조각 / p 패턴번호 / lv 난이도 티어 */
var DATA = [];
(function(){
  for(var i=0;i<RAW.length;i++){
    var r = RAW[i];
    DATA.push({ id:(r[5] || (i+1)), idx:i, ko:r[0], en:r[1], chunks:r[2].split("|"), p:r[3], lv:r[4] });
  }
})();

/* 단계별 30문장 목록 · 전체 문장 목록 */
var LEVEL_IDS = {}, ALL_IDS = [];
(function(){
  var i, lv;
  for(i=0;i<DATA.length;i++) ALL_IDS.push(i);
  for(lv=1;lv<=LAST_LEVEL;lv++) LEVEL_IDS[lv] = [];
  for(i=0;i<DATA.length;i++) if(LEVEL_IDS[DATA[i].lv]) LEVEL_IDS[DATA[i].lv].push(i);
})();
/* 그 단계에 나오는 패턴 종류 수 — 새 구조에서는 어느 단계든 30 */
function countPatterns(n){
  var m = stageMeta(n);
  return m.kind === "inf" ? PATTERNS.length - 1 : (m.to - m.from + 1);
}
/* 함정으로 쓸 수 있는 패턴: 그 단계까지 배운 문장의 패턴(무한전은 전체) */
function patternsOf(stage){
  var set = {}, m = stageMeta(stage || 1), i, to = m.to;
  if(m.kind === "inf"){ for(i=1;i<PATTERNS.length;i++) set[i] = 1; return set; }
  if(m.kind === "pat" && (S.tier || 1) > 1) to = Math.max(to, tierMixTo(m.n, S.tier));
  for(i=1;i<=to;i++) set[i] = 1;
  return set;
}

/* 같은 패턴의 다른 청크 → 진짜 헷갈리는 함정 */
var BANK = {};
(function(){
  for(var i=0;i<DATA.length;i++){
    var d = DATA[i];
    if(!BANK[d.p]) BANK[d.p] = [];
    for(var j=0;j<d.chunks.length;j++) BANK[d.p].push(d.chunks[j]);
  }
})();

/* 조이 님이 자주 헷갈리는 짝 (패턴을 여는 첫 청크는 OPENER가 따로 맡는다) */
var CONF = {
  "my":["your"],
  "your":["my"],
  "our":["my"],
  "this":["that"],
  "that":["this"],
  "here":["there"],
  "there":["here"],
  "at":["for"],
  "for":["at"],
  "to":["for"],
  "in":["on"],
  "on":["in"],
  "is":["was", "are"],
  "was":["were"],
  "are":["is"],
  "it's":["it was"],
  "i'm":["i was"],
  "i'd":["i'll"],
  "i'll":["i'd"],
  "take":["bring"],
  "bring":["take"],
  "hold":["carry"],
  "carry":["hold"],
  "leave":["stay"],
  "stay":["leave"],
  "get":["take"],
  "go":["come"],
  "come":["go"],
  "say":["tell", "said"],
  "tell":["say"],
  "said":["say"],
  "look":["see"],
  "see":["look"],
  "watch":["see"],
  "open":["close"],
  "close":["open"],
  "opens":["closes"],
  "closes":["opens"],
  "want":["wanted"],
  "wanted":["want"],
  "need":["have"],
  "have":["had"],
  "has":["have"],
  "check":["checking"],
  "checking":["check"],
  "wait":["waiting"],
  "waiting":["wait"],
  "sit":["sitting"],
  "meet":["meeting"],
  "eat":["eating"],
  "sleep":["sleeping"],
  "order":["ordered"],
  "ordered":["order"],
  "ask":["asked"],
  "asked":["ask"],
  "help":["helping"],
  "mind":["matter"],
  "can":["could"],
  "could":["can"],
  "do":["make"],
  "make":["do"],
  "did":["do"],
  "mean":["meant"],
  "meant":["mean"],
  "worry":["worried"],
  "worried":["worry"],
  "book":["booked"],
  "booked":["book"],
  "cancel":["cancelled"],
  "change":["changing"],
  "changing":["change"],
  "moving":["move"],
  "move":["moving"],
  "closing":["opening"],
  "turning":["closing"],
  "sign":["signed"],
  "signed":["sign"],
  "share":["show"],
  "sounds":["looks", "feels"],
  "looks":["sounds", "feels"],
  "feels":["looks", "sounds"],
  "depends":["depend"],
  "depend":["depends"],
  "wondering":["asking"],
  "decided":["decide"],
  "decide":["decided"],
  "finish":["finished"],
  "finished":["finish"],
  "coming":["going"],
  "going":["coming"],
  "early":["late"],
  "late":["early"],
  "ahead":["before"],
  "before":["ahead"],
  "soon":["later"],
  "later":["soon"],
  "exact":["right"],
  "already":["yet"],
  "yet":["already"],
  "nothing":["anything"],
  "anything":["nothing"],
  "something":["anything"],
  "everything":["anything"],
  "everyone":["someone"],
  "someone":["everyone"],
  "fully":["really"],
  "really":["fully"],
  "many":["much"],
  "much":["many"],
  "week":["weekend"],
  "weekend":["week"],
  "month":["week"],
  "trip":["travel"],
  "travel":["trip"],
  "table":["seat"],
  "seat":["table"],
  "tables":["seats"],
  "room":["seat"],
  "days":["nights"],
  "nights":["days"],
  "presentation":["meeting"],
  "meeting":["presentation"],
  "report":["presentation"],
  "restaurants":["places"],
  "restaurant":["place"],
  "places":["restaurants"],
  "wine":["beer"],
  "cafe":["bar"],
  "bar":["cafe"],
  "nice":["good"],
  "good":["nice"],
  "crowded":["empty"],
  "empty":["crowded"],
  "tasty":["spicy"],
  "summer":["winter"],
  "winter":["summer"],
  "vacation":["business"],
  "business":["vacation"],
  "country":["city"],
  "city":["country"],
  "day":["week"],
  "hour":["day"],
  "ill":["sick"],
  "sick":["ill"],
  "worth":["really"],
  "service":["price"],
  "price":["service"],
  "picked":["chose"],
  "chose":["picked"],
  "bought":["sold"],
  "sold":["bought"],
  "exchange":["return"],
  "return":["exchange"],
  "suit":["bag"],
  "umbrella":["jacket"],
  "jacket":["umbrella"],
  "taxi":["bus"],
  "bus":["taxi"],
  "doctor":["dentist"],
  "rest":["room"],
  "safe":["sure"],
  "sure":["safe"],
  "had":["have"],
  "were":["was"],
  /* v43 — 새 문장(패턴당 10문장)의 동사·명사 혼동형 */
  "send":["show"], "sent":["send"], "prepare":["practice"],
  "translate":["print"], "print":["send"], "redo":["do"],
  "refund":["return"], "join":["come"], "reply":["answer"],
  "grab":["hold"], "head":["go"], "pack":["take"], "save":["keep"],
  "explain":["say"], "decide":["think"], "ignore":["miss"],
  "refill":["fill"], "pull":["stop"], "split":["share"],
  "splitting":["sharing"], "throwing":["taking"], "waiting":["standing"],
  "invited":["asked"], "delayed":["late"], "canceled":["closed"],
  "asleep":["sleeping"], "noisy":["quiet"], "quiet":["noisy"],
  "expensive":["cheap"], "cheap":["expensive"], "deposit":["price"],
  "luggage":["bag"], "laundry":["luggage"], "gym":["home"],
  "pharmacy":["hospital"], "coupon":["ticket"], "receipt":["bill"],
  "bill":["receipt"], "fork":["spoon"], "tax":["tip"],
  "slides":["files"], "numbers":["money"], "address":["phone"],
  "mood":["weather"], "passport":["ticket"], "gate":["door"],
  "fare":["price"], "flight":["train"], "downtown":["home"],
  "bridge":["road"], "morning":["evening"], "tonight":["tomorrow"],
  "screen":["page"], "medicine":["vitamin"], "shuttle":["taxi"],
  "appointment":["reservation"], "budget":["price"], "photos":["pictures"],
  "bike":["car"], "umbrella":["jacket"]
};

var FILL = ["can", "was", "is", "are", "take", "leave", "for", "at", "hold", "carry", "make", "do", "get", "bring", "stay", "here", "there", "your", "our", "that", "it", "could", "should", "need", "want", "took", "left", "held", "carried", "went", "came", "saw", "told", "did", "made", "has", "had", "been", "wondering", "depends", "meant", "mean", "sounds", "looks", "feels", "sign", "book", "booked", "closes", "open", "nothing", "anything", "already", "yet", "soon", "with", "without", "until", "by", "many", "much", "if", "when", "worry", "worried", "chose", "picked", "finish", "send", "prepare", "print", "translate", "join", "pull", "refill", "pack", "save", "explain", "decide", "ignore", "split", "return", "refund", "deposit", "luggage", "laundry", "gym", "pharmacy", "coupon", "receipt", "bill", "fork", "tax", "slides", "numbers", "address", "mood", "passport", "gate", "fare", "flight", "downtown", "bridge", "morning", "tonight", "screen", "medicine", "shuttle", "appointment", "budget"];

/* 패턴별 앞머리 청크 — 함정으로 섞어 '앞머리 고르기'를 시험한다 */
var OPENER = ["",
  "I'm trying to",
  "I'm supposed to",
  "I was about to",
  "I'm here to",
  "I've been",
  "Let me",
  "Can I get",
  "Can you",
  "Do you mind",
  "I'm not sure",
  "I don't think",
  "I think you should",
  "It feels like",
  "It looks like",
  "It sounds like",
  "There is",
  "I'd like to",
  "I need you to",
  "I just wanted to",
  "I was wondering if",
  "The thing is",
  "As far as I know",
  "You don't have to",
  "You might want to",
  "It depends on",
  "I'll let you know",
  "I didn't mean to",
  "I can't wait to",
  "That's why",
  "That's what"
];

/* 16번 There is / There are — 문장과 반대쪽 앞머리를 먼저 깔아 준다 */
var SIBLING = {
  1:  ["I tried to", "I'm supposed to"],
  2:  ["I'm supposed to", "I was supposed to"],
  3:  ["I'm about to", "I was about to"],
  4:  ["I was here to", "I'm trying to"],
  5:  ["I've tried to", "I'm trying to"],
  6:  ["Let's", "I'll"],
  7:  ["Could I get", "Can you"],
  8:  ["Could you", "Can I get"],
  9:  ["Do you mind if I", "Would you mind"],
  10: ["I wasn't sure", "I don't think"],
  11: ["I thought", "I'm not sure"],
  12: ["I think you could", "You don't have to"],
  13: ["It felt like", "It looks like"],
  16: ["There are", "There was"],
  17: ["I'd love to", "I wanted to"],
  18: ["I needed you to", "I want you to"],
  20: ["I'm wondering if", "Do you know if"]
};

/* 조이 님이 실제로 헷갈렸던 앞머리 그룹 — 그룹에 속한 패턴의 문장이 나오면 같은 그룹의
   다른 앞머리를 단어판에 먼저 깔아 '앞머리 구분'을 실전으로 훈련한다. */
var CONF_PAT = [
  { pats:[4, 1, 5],        openers:["I'm here to", "I'm here", "I'm trying to", "I've been"] },
  { pats:[9, 20],          openers:["Do you mind if I", "Do you mind", "I was wondering if", "Do you know if"] },
  { pats:[10, 11],         openers:["I'm not sure", "I don't think", "I think", "Are you sure"] },
  { pats:[2, 3],           openers:["I was supposed to", "I was about to", "I'm going to"] },
  { pats:[7, 8, 6, 17],    openers:["Can I get", "Can you", "Could you", "Let me", "I'd like to"] }
];
function confGroup(p){
  for(var i=0;i<CONF_PAT.length;i++) if(CONF_PAT[i].pats.indexOf(p) >= 0) return CONF_PAT[i].openers;
  return null;
}

/* 단어판 색 구분용 — 앞머리 칩(.pat). 정답·함정 오프너가 모두 같은 색이라 정답 스포일러는 없다. */
var OPENSET = {};
(function(){
  var i, j, g;
  for(i=1;i<OPENER.length;i++) OPENSET[norm(OPENER[i])] = 1;
  OPENSET[norm("There are")] = 1;   /* 16번 패턴은 There is / There are 둘 다 앞머리 */
  for(i=0;i<CONF_PAT.length;i++){
    g = CONF_PAT[i].openers;
    for(j=0;j<g.length;j++) OPENSET[norm(g[j])] = 1;
  }
})();

/* 판정용 정규화 — 소문자, 아포스트로피/따옴표 통일, 문장부호 제거, 공백 정리 */
function norm(t){
  return String(t == null ? "" : t)
    .replace(/[\u2018\u2019\u02bc]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .toLowerCase()
    .replace(/[.,?!;:"']/g, "")
    .replace(/\s+/g, " ")
    .replace(/^ | $/g, "");
}
/* 정답 판정은 청크 개수·배열이 아니라 '담은 청크를 이어 붙인 문장'과 정답 문장의 문자열 비교.
   청크를 어떻게 끊어 담았든 완성된 문장이 같으면 정답이다. */
function sameSentence(made, en){
  return norm(made.join(" ")) === norm(en);
}
function makeRng(seed){
  var s = (seed>>>0) || 1;
  return function(){ s = (s*1664525 + 1013904223)>>>0; return s/4294967296; };
}
function shuffled(arr,rng){
  var a = arr.slice(), r = rng || Math.random;
  for(var i=a.length-1;i>0;i--){
    var j = Math.floor(r()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t;
  }
  return a;
}

/* 문장 하나의 단어 풀: 정답 청크 100% 먼저 → 남는 칸만 함정
   want = 함정 개수(정답 청크 수와 무관) */
function buildPool(d, trapN, stage){
  var want = trapN || 10;
  var lv = stage || d.lv || 1;
  var pset = patternsOf(lv);
  var rng = makeRng(d.id*7919 + 101);
  var seen = {}, i, j;
  /* 0) 정답 청크는 무조건 먼저 전부 확보 — 어떤 함정도 정답을 밀어내지 못한다 */
  for(i=0;i<d.chunks.length;i++) seen[norm(d.chunks[i])] = 1;

  /* ① 앞머리 청크 함정 2~4개 (해금된 패턴들) */
  var openN = 2 + (lv >= 3 ? 1 : 0) + (lv >= 5 ? 1 : 0);
  var opSet = {}, opCnt = 0;
  for(i=1;i<OPENER.length;i++) if(pset[i]) opSet[OPENER[i]] = 1;
  /* 헷갈림 그룹 앞머리도 '앞머리 함정'으로 센다 — 단어판 앞머리 칩이 단계별 2~4개를 넘지 않게 */
  for(i=0;i<CONF_PAT.length;i++){
    var gop = CONF_PAT[i].openers;
    for(j=0;j<gop.length;j++) opSet[gop[j]] = 1;
  }
  for(i=0;i<OPENER.length;i++) if(SIBLING[i]) opSet[SIBLING[i]] = 1;

  var traps = [];
  function push(c){
    if(!c) return;
    var k = norm(c);
    if(!k || seen[k]) return;
    var isOp = !!opSet[c];
    if(isOp && opCnt >= openN) return;          /* 앞머리 함정은 openN개까지 */
    seen[k] = 1;
    traps.push(c);
    if(isOp) opCnt++;
  }
  var ops = [];
  for(i=1;i<OPENER.length;i++) if(pset[i]) ops.push(OPENER[i]);
  /* 이 문장 패턴의 앞머리는 반드시 함정으로 넣는다 — 'I'm here' vs 'I'm here to' 같은 진짜 함정 */
  if(pset[d.p] && OPENER[d.p]) push(OPENER[d.p]);
  /* There is 문장에는 There are, There are 문장에는 There is 를 먼저 깐다 */
  if(SIBLING[d.p]){
    var sb = SIBLING[d.p];
    if(typeof sb === "string") push(sb);
    else for(var sbi=0;sbi<sb.length;sbi++) push(sb[sbi]);
  }
  /* ①-b 조이 님이 헷갈렸던 그룹의 앞머리를 먼저 채운다 — 이 문장의 앞머리와 비슷하게 생긴
     것들('I'm here to' vs 'I'm here' / 'Do you mind' vs 'Do you mind if I' …)이 2~4개 깔린다.
     비슷한 순서로 넣는다: 앞부분이 겹치거나('I'm here to' → 'I'm here'), 쓰인 단어가 겹치는 것부터. */
  var grp = confGroup(d.p);
  if(grp){
    var own = norm(d.chunks[0] || ""), gs = shuffled(grp, makeRng(d.id*313 + 11));
    var score = function(t){
      var n = norm(t), ow = own.split(" "), tw = n.split(" "), sc = 0, a, b2;
      if(n.indexOf(own) === 0 || own.indexOf(n) === 0) sc += 1000;
      for(a=0;a<ow.length;a++) for(b2=0;b2<tw.length;b2++) if(ow[a] === tw[b2]) sc += 10;
      return sc;
    };
    gs.sort(function(x, y){ return score(y) - score(x); });
    for(i=0;i<gs.length && opCnt<openN;i++) push(gs[i]);
  }
  ops = shuffled(ops, rng);
  for(i=0;i<ops.length && opCnt<openN;i++) push(ops[i]);

  /* ② 단어 혼동형 — 두 번째 청크부터 */
  var conf = [];
  for(i=1;i<d.chunks.length;i++){
    var words = d.chunks[i].split(" ");
    var alts = CONF[words[0].toLowerCase()];
    if(alts && alts.length){
      for(j=0;j<alts.length;j++){
        var rest = words.slice(1).join(" ");
        conf.push(alts[j] + (rest ? " " + rest : ""));
      }
    }
  }
  conf = shuffled(conf, rng);
  var confCap = traps.length + 2;
  for(i=0;i<conf.length && traps.length<confCap;i++) push(conf[i]);

  /* ③ 같은 패턴의 다른 청크 */
  var same = shuffled(BANK[d.p] || [], rng);
  for(i=0;i<same.length && traps.length<want;i++) push(same[i]);

  /* ④ 해금 패턴의 청크(앞머리 고르기) */
  if(traps.length < want){
    var wide = [];
    for(i=1;i<PATTERNS.length;i++) if(pset[i] && BANK[i]) wide = wide.concat(BANK[i]);
    wide = shuffled(wide, rng);
    for(i=0;i<wide.length && traps.length<want;i++) push(wide[i]);
  }

  /* ⑤ 이웃 패턴 */
  if(traps.length < want){
    var near = [], np = [d.p-1, d.p+1, d.p+2];
    for(i=0;i<np.length;i++) if(pset[np[i]] && BANK[np[i]]) near = near.concat(BANK[np[i]]);
    near = shuffled(near, rng);
    for(i=0;i<near.length && traps.length<want;i++) push(near[i]);
  }

  /* ⑥ 최후 채움 */
  var fill = shuffled(FILL, rng);
  for(i=0;i<fill.length && traps.length<want;i++) push(fill[i]);

  /* ⑦ 최종 확인: 혹시라도 빠진 정답 청크가 있으면 맨 앞에 복구 */
  var out = d.chunks.slice();
  for(i=0;i<d.chunks.length;i++){
    var need = norm(d.chunks[i]), has = false;
    for(j=0;j<out.length;j++) if(norm(out[j]) === need) has = true;
    if(!has) out.unshift(d.chunks[i]);
  }
  var all = out.concat(traps);
  all.sort(function(a, b){
    var pa = OPENSET[norm(a)] ? 0 : 1, pb = OPENSET[norm(b)] ? 0 : 1;
    if(pa !== pb) return pa - pb;
    var la = norm(a), lb = norm(b);
    return la < lb ? -1 : (la > lb ? 1 : 0);
  });
  return all;
}

/* ══════════ 2. 저장 ══════════ */
var KEY = "em100.arcade.v6";
var OLD_KEY = "em100.arcade.v5";    /* 5단계 시절 키 — 최고 기록·푼 문장만 이어받는다 */
var OLD2_KEY = "em100.arcade.v4";   /* 100문장 시절 키 */
var store = { best:0, bestCombo:0, cleared:{}, sound:true, maxStage:1, lastStage:1, lastTier:1,
  stageDone:{}, stageBest:{}, stageCombo:{}, stageStars:{}, stageProg:{}, bestSurv:0 };
function cleanStore(o){
  if(!o || typeof o !== "object") return null;
  var k = {};
  k.best = +o.best || 0;
  k.bestCombo = +o.bestCombo || 0;
  k.cleared = (o.cleared && typeof o.cleared === "object") ? o.cleared : {};
  k.sound = o.sound !== false;
  k.maxStage = Math.min(STAGES_TOTAL, Math.max(1, +o.maxStage || 1));
  k.lastStage = Math.min(STAGES_TOTAL, Math.max(1, +o.lastStage || 1));
  k.lastTier = Math.max(1, Math.min(3, +o.lastTier || 1));
  k.stageDone = (o.stageDone && typeof o.stageDone === "object") ? o.stageDone : {};
  k.stageProg = (o.stageProg && typeof o.stageProg === "object") ? o.stageProg : {};
  k.stageCombo = (o.stageCombo && typeof o.stageCombo === "object") ? o.stageCombo : {};
  k.stageStars = (o.stageStars && typeof o.stageStars === "object") ? o.stageStars : {};
  k.stageBest = (o.stageBest && typeof o.stageBest === "object") ? o.stageBest : {};
  k.bestSurv = +o.bestSurv || 0;
  return k;
}
(function(){
  try{
    var raw = localStorage.getItem(KEY);
    if(raw){
      var o = cleanStore(JSON.parse(raw));
      if(o) store = o;
    } else {
      /* 5단계 시절(v5) 저장값: 문장 150개와 '푼 문장' 기록은 그대로라 이어받는다.
         스테이지 번호 체계가 통째로 바뀌었으니 클리어 배지·단계별 최고점은 넘기지 않는다. */
      var old = localStorage.getItem(OLD_KEY) || localStorage.getItem(OLD2_KEY);
      if(old){
        var v5 = JSON.parse(old);
        if(v5 && typeof v5 === "object"){
          store.best = +v5.best || 0;
          store.bestCombo = +v5.bestCombo || 0;
          store.sound = v5.sound !== false;
          store.bestSurv = +v5.bestSurv || 0;
          if(v5.cleared && typeof v5.cleared === "object") store.cleared = v5.cleared;
          store.maxStage = 1; store.lastStage = 1;
        }
      }
    }
  }catch(e){}
  try{
    var w = window.pickle && window.pickle.widget;
    if(w && w.state && typeof w.state === "object" && w.state.cleared){
      var has = false;
      try{ has = !!localStorage.getItem(KEY); }catch(e2){}
      if(!has){
        var s2 = cleanStore(w.state);
        if(s2){ s2.lastStage = s2.maxStage; store = s2; }
      }
    }
  }catch(e){}
})();
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){}
  try{
    var w = window.pickle && window.pickle.widget;
    if(w && w.save) w.save(store);
  }catch(e){}
}
function clearedCount(){
  var n = 0, k;
  for(k in store.cleared) if(store.cleared.hasOwnProperty(k) && store.cleared[k]) n++;
  return n;
}

/* ══════════ 3. 상태 ══════════ */
var MAX_ROWS = 6;        /* 동시에 떠 있는 줄 상한 */
var SLOT_MAX = 7;        /* 조립 바에 담을 수 있는 칩 최대 수 — 빈 칸은 그리지 않는다 */
var MAX_HEARTS = 3;
var PITCH_ROWS = 5;      /* 낙하 구역에 보이는 줄 수(설계값) */
var BLAST_MS = 130;      /* 레이저가 명중해 폭발하기까지(ms) */

var S = {
  mode:"idle",            /* idle | play | paused | over */
  lock:false,
  stage:1, tier:1, goal:GOAL, clears:0, clearedIds:{},
  score:0, combo:0, maxCombo:0, mult:1,
  hearts:3,
  rows:[], uid:0, target:0,
  slots:[], blocks:[], blockEls:[],
  laneH:0, laneW:0, R:42, pitch:52, v:0, accel:1, spawnT:0,
  q:[], run:0, lastId:0
};

/* ══════════ 4. DOM ══════════ */
function $(id){ return document.getElementById(id); }
var elApp = $("app"), elHud = $("hud"), elHud2 = $("hud2");
var elSky = $("sky"), elLane = $("lane");
var elFx = $("fx"), elToast = $("toast"), elFlash = $("flash");
var elDeck = $("deck"), elSlots = $("slots"), elPool = $("pool"), elFire = $("btnFire");
var elBuilt = $("builtLine");
var elHearts = $("hearts"), elScore = $("scoreEl"), elCombo = $("comboEl");
var elStageTag = $("stageTag"), elBossTag = $("bossTag"), elSpd = $("spdTag");
var elGoal = $("goalBar"), elGoalFill = $("goalFill"), elGoalTxt = $("goalTxt");
var elStars = $("clStars"), elOverIcon = $("overIcon"), elStartLogo = $("startLogo"), elScoreIcon = $("scoreIcon");
var elSheetStart = $("sheetStart"), elSheetPause = $("sheetPause");
var elSheetClear = $("sheetClear"), elSheetOver = $("sheetOver");
var elStageSheet = $("stageSheet"), elStageBody = $("stageBody"), elStageCnt = $("stageCnt");
var elBook = $("book"), elBookBody = $("bookBody"), elBookCnt = $("bookCnt");

/* ══════════ 4b. 아이콘 — 인라인 컬러 그라디언트 SVG(외부 CDN 없음) ══════════ */
var ICON = (function(){
  function lg(id, stops, x2, y2){
    var t = '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (x2 === undefined ? 0 : x2) + '" y2="' + (y2 === undefined ? 1 : y2) + '">', i;
    for(i=0;i<stops.length;i++) t += '<stop offset="' + stops[i][0] + '" stop-color="' + stops[i][1] + '"/>';
    return t + '</linearGradient>';
  }
  function rg(id, stops, cx, cy, r){
    var t = '<radialGradient id="' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">', i;
    for(i=0;i<stops.length;i++) t += '<stop offset="' + stops[i][0] + '" stop-color="' + stops[i][1] + '"/>';
    return t + '</radialGradient>';
  }
  function ic(defs, body, vb){
    return '<svg viewBox="' + (vb || "0 0 24 24") + '">' + (defs ? "<defs>" + defs + "</defs>" : "") + body + "</svg>";
  }
  var GOLD  = [["0","#fff3a8"],["0.45","#ffc93d"],["1","#e08a0a"]];
  var FIRE  = [["0","#ffd93d"],["0.55","#ff8a1f"],["1","#ff3d2e"]];
  var BLUE  = [["0","#9fd0ff"],["0.5","#4c8dff"],["1","#2a3fb0"]];
  var RED   = [["0","#ffb0bb"],["0.45","#ff4d68"],["1","#a80f2a"]];
  var STEEL = [["0","#e6eeff"],["1","#93a7d4"]];
  var I = {};

  I.logo = ic(
    lg("emLg1", [["0","#7aa6ff"],["1","#23319c"]]) +
    lg("emLg2", [["0","#fff6b8"],["0.5","#ffc93d"],["1","#ff8a1f"]]),
    '<rect x="2" y="2" width="44" height="44" rx="13" fill="url(#emLg1)" stroke="#9dc0ff" stroke-width="1.6"/>' +
    '<rect x="7" y="6" width="34" height="16" rx="8" fill="#ffffff" opacity=".14"/>' +
    '<path d="M27 8.4 15.6 23.6c-.5.7 0 1.6.9 1.6h6.4l-1.9 11.7c-.1.9 1.1 1.4 1.7.6l11.6-15.4c.5-.7 0-1.6-.9-1.6h-6.5l2-11c.2-.9-.9-1.4-1.6-.6z" fill="url(#emLg2)" stroke="#a35b00" stroke-width="1" stroke-linejoin="round"/>' +
    '<circle cx="11.5" cy="12.4" r="1.8" fill="#ffe98a"/><circle cx="36.5" cy="12.4" r="1.8" fill="#ffe98a"/>' +
    '<circle cx="11.5" cy="12.4" r=".8" fill="#fffdf0"/><circle cx="36.5" cy="12.4" r=".8" fill="#fffdf0"/>',
    "0 0 48 48");

  I.bolt = ic(lg("emBolt", GOLD),
    '<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" fill="url(#emBolt)" stroke="#a35b00" stroke-width=".9" stroke-linejoin="round"/>' +
    '<path d="M12.2 4.6 8.2 9.9h2.2l-.5 3.4 3.1-4.4h-2.1z" fill="#fffbdc" opacity=".6"/>');

  I.heart = ic(rg("emHeart", [["0","#ffc2cb"],["0.45","#ff4d68"],["1","#a80f2a"]], ".38", ".3", ".8"),
    '<path d="M12 20.6S3.6 15.1 3.6 9.6A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.4 2.8c0 5.5-8.4 10.8-8.4 10.8z" fill="url(#emHeart)" stroke="#7d0a1f" stroke-width=".8"/>' +
    '<path d="M7.4 7.6a2.8 2.8 0 0 1 2.6-.5" stroke="#ffe0e5" stroke-width="1.5" stroke-linecap="round" fill="none" opacity=".85"/>');
  I.heartOff = ic("",
    '<path d="M12 20.6S3.6 15.1 3.6 9.6A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.4 2.8c0 5.5-8.4 10.8-8.4 10.8z" fill="#232c46" stroke="#3d4a6b" stroke-width=".9"/>');

  I.coin = ic(lg("emCoin", [["0","#ffe98a"],["1","#e08c07"]]),
    '<circle cx="12" cy="12" r="9.4" fill="url(#emCoin)" stroke="#a86c04" stroke-width="1"/>' +
    '<circle cx="12" cy="12" r="6.4" fill="#fff6c9" opacity=".32"/>' +
    '<path d="m12 6.6 1.7 3.4 3.7.5-2.7 2.6.7 3.7L12 15.1l-3.4 1.7.7-3.7-2.7-2.6 3.7-.5z" fill="#fffbe0" opacity=".95"/>');

  I.flame = ic(lg("emFlame", [["0","#ff3d2e"],["0.55","#ff8a1f"],["1","#ffd93d"]], 0, 0),
    '<path d="M13.6 1.8c.6 3.4-1.3 5.2-2.7 6.9C9.4 10.6 7.6 12.4 7.6 15.3a5.9 5.9 0 0 0 11.8.2c0-5.2-3.6-8.4-5.8-13.7z" fill="url(#emFlame)" stroke="#b33a00" stroke-width=".7"/>' +
    '<path d="M12.6 12.6c.4 1.7-.6 2.7-1.3 3.6-.5.7-.8 1.3-.8 2.1a2.8 2.8 0 0 0 5.6.1c0-2.5-1.8-4-3.5-5.8z" fill="#fff3a8" opacity=".85"/>');
  I.boss = ic(lg("emBoss", [["0","#ff9a3d"],["0.5","#e01b36"],["1","#6d0b2a"]]),
    '<path d="M13.6 1.8c.6 3.4-1.3 5.2-2.7 6.9C9.4 10.6 7.6 12.4 7.6 15.3a5.9 5.9 0 0 0 11.8.2c0-5.2-3.6-8.4-5.8-13.7z" fill="url(#emBoss)" stroke="#4d0a1c" stroke-width=".8"/>' +
    '<path d="M12.7 11.6c.5 1.9-.7 3-1.4 4-.5.7-.8 1.3-.8 2.1a2.9 2.9 0 0 0 5.8.1c0-2.7-2-4.4-3.6-6.2z" fill="#fff0b0" opacity=".9"/>' +
    '<path d="M9.2 6.6 7.6 4.2l-.4 3.1M14.8 6.6l1.6-2.4.4 3.1" stroke="#ff9a3d" stroke-width="1.2" stroke-linecap="round" fill="none"/>');

  I.rocket = ic(lg("emRkBody", [["0","#fdfeff"],["0.5","#cfdcf2"],["1","#8b9dc2"]]) +
    lg("emRkFire", [["0","#fff3a8"],["0.55","#ffab2e"],["1","#ff4d2e"]]),
    '<path d="M12 22.8c-1.9-2.4-2.7-4.5-2.5-7.1h5c.2 2.6-.6 4.7-2.5 7.1z" fill="url(#emRkFire)" stroke="#c2450f" stroke-width=".5" stroke-linejoin="round"/>' +
    '<path d="M8.6 11.8 5 16.6l3.8-1.4z" fill="#ff9f3d" stroke="#c26a10" stroke-width=".6" stroke-linejoin="round"/>' +
    '<path d="M15.4 11.8 19 16.6l-3.8-1.4z" fill="#ff9f3d" stroke="#c26a10" stroke-width=".6" stroke-linejoin="round"/>' +
    '<path d="M12 1.6c2.9 2.2 4.6 5.4 4.6 9.2 0 1.6-.2 3-.6 4.4H8c-.4-1.4-.6-2.8-.6-4.4C7.4 7 9.1 3.8 12 1.6z" fill="url(#emRkBody)" stroke="#5c6d94" stroke-width=".8"/>' +
    '<circle cx="12" cy="9.2" r="2.1" fill="#28406b" stroke="#8fd8ff" stroke-width="1.1"/>');

  I.trophy = ic(lg("emTrophy", GOLD),
    '<path d="M7.2 3h9.6v4.4c0 2.6-1.7 4.8-4.8 4.8s-4.8-2.2-4.8-4.8z" fill="url(#emTrophy)" stroke="#a86500" stroke-width=".7"/>' +
    '<path d="M7.2 4.2H4.6c0 2.9 1.1 4.6 3.1 5.1M16.8 4.2h2.6c0 2.9-1.1 4.6-3.1 5.1" stroke="#e0a020" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
    '<path d="m12 5.2 1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="#fffbe0" opacity=".9"/>' +
    '<path d="M10.8 12.2h2.4v3H10.8z" fill="#c98c14"/>' +
    '<path d="M7.4 15.2h9.2v3H7.4z" fill="url(#emTrophy)" stroke="#a86500" stroke-width=".7"/>' +
    '<path d="M9 18.2h6l.7 2.4H8.3z" fill="#c98c14"/>');

  I.crown = ic(lg("emCrown", [["0","#ffe98a"],["1","#f0a416"]]),
    '<path d="M3.4 7.4 7 10.8 12 4l5 6.8 3.6-3.4-1.6 10.4H5z" fill="url(#emCrown)" stroke="#a35b00" stroke-width=".8" stroke-linejoin="round"/>' +
    '<path d="M5.6 15.2h12.8" stroke="#b37700" stroke-width="1.1"/>' +
    '<circle cx="3.4" cy="6.2" r="1.5" fill="#ffe98a" stroke="#a35b00" stroke-width=".6"/>' +
    '<circle cx="20.6" cy="6.2" r="1.5" fill="#ffe98a" stroke="#a35b00" stroke-width=".6"/>' +
    '<circle cx="12" cy="3.2" r="1.6" fill="#ffe98a" stroke="#a35b00" stroke-width=".6"/>');

  I.book = ic(lg("emBook", [["0","#7db8ff"],["1","#3a5cd0"]]),
    '<path d="M4 4.6A2.6 2.6 0 0 1 6.6 2H19v16.4H6.6A2.6 2.6 0 0 0 4 21z" fill="url(#emBook)" stroke="#24356f" stroke-width=".8"/>' +
    '<path d="M4 18.6A2.6 2.6 0 0 1 6.6 16H19v2.6z" fill="#2b4bb0"/>' +
    '<path d="M8 6.4h7M8 9.6h5" stroke="#eaf3ff" stroke-width="1.3" stroke-linecap="round"/>');

  I.map = ic(lg("emMap", [["0","#8ff0cf"],["1","#2aa9a0"]]),
    '<path d="M3 5.6 9 3.2v15.4L3 20.8z" fill="#61d5a8" stroke="#1c7a6a" stroke-width=".7" stroke-linejoin="round"/>' +
    '<path d="M9 3.2l6 2.4v15.4L9 18.6z" fill="url(#emMap)" stroke="#1c7a6a" stroke-width=".7" stroke-linejoin="round"/>' +
    '<path d="M15 5.6l6-2.4v15.4l-6 2.2z" fill="#8fe9c9" stroke="#1c7a6a" stroke-width=".7" stroke-linejoin="round"/>' +
    '<circle cx="12" cy="9.6" r="1.8" fill="#ffffff" stroke="#1c7a6a" stroke-width=".5"/>');

  I.pause = ic(lg("emPz", STEEL),
    '<rect x="6.4" y="4.4" width="4.2" height="15.2" rx="1.9" fill="url(#emPz)" stroke="#5a6c96" stroke-width=".6"/>' +
    '<rect x="13.4" y="4.4" width="4.2" height="15.2" rx="1.9" fill="url(#emPz)" stroke="#5a6c96" stroke-width=".6"/>');
  I.play = ic(lg("emPl", [["0","#9dfbc4"],["1","#1f9e5e"]]),
    '<circle cx="12" cy="12" r="9.6" fill="url(#emPl)" stroke="#17804c" stroke-width=".8"/>' +
    '<path d="M9.8 7.4 16.6 12l-6.8 4.6z" fill="#ffffff" opacity=".96"/>');

  I.sound = ic(lg("emSpk", STEEL),
    '<path d="M3 9.2h3.2L11 5v14l-4.8-4.2H3z" fill="url(#emSpk)" stroke="#5a6c96" stroke-width=".7" stroke-linejoin="round"/>' +
    '<path d="M14.2 8.8a4.8 4.8 0 0 1 0 6.4" stroke="#bfd3ff" stroke-width="1.8" stroke-linecap="round" fill="none"/>' +
    '<path d="M17.2 5.8a9 9 0 0 1 0 12.4" stroke="#8ea8dc" stroke-width="1.6" stroke-linecap="round" fill="none"/>');
  I.mute = ic(lg("emSpk2", STEEL),
    '<path d="M3 9.2h3.2L11 5v14l-4.8-4.2H3z" fill="url(#emSpk2)" stroke="#5a6c96" stroke-width=".7" stroke-linejoin="round"/>' +
    '<path d="m15.2 9.4 5.4 5.4m0-5.4-5.4 5.4" stroke="#ff6b7d" stroke-width="1.9" stroke-linecap="round"/>');

  I.undo = ic(lg("emUndo", [["0","#a6e8ff"],["1","#3f7de0"]]),
    '<path d="M11.6 6.4a6.6 6.6 0 1 1-6.3 8.1" fill="none" stroke="url(#emUndo)" stroke-width="2.7" stroke-linecap="round"/>' +
    '<path d="M11.6 2.4 5.8 6.4l5.8 3.9z" fill="#6fb9ff" stroke="#2f65c0" stroke-width=".7" stroke-linejoin="round"/>');

  I.close = ic(lg("emCl", [["0","#525d80"],["1","#232b42"]]),
    '<circle cx="12" cy="12" r="9.4" fill="url(#emCl)" stroke="#5c6a90" stroke-width=".8"/>' +
    '<path d="m8.8 8.8 6.4 6.4m0-6.4-6.4 6.4" stroke="#e3ebff" stroke-width="2" stroke-linecap="round"/>');

  I.lock = ic(lg("emLock", [["0","#5f6b8f"],["1","#2f3852"]]),
    '<path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8" stroke="#7787ad" stroke-width="2.1" fill="none" stroke-linecap="round"/>' +
    '<rect x="4.4" y="10" width="15.2" height="11.2" rx="3.2" fill="url(#emLock)" stroke="#1e253a" stroke-width=".8"/>' +
    '<circle cx="12" cy="14.4" r="1.7" fill="#ccd9f2"/>' +
    '<path d="M12 15.8v2.4" stroke="#ccd9f2" stroke-width="1.7" stroke-linecap="round"/>');

  I.check = ic(lg("emChk", [["0","#9dfbc4"],["1","#1f9e5e"]]),
    '<circle cx="12" cy="12" r="9.4" fill="url(#emChk)" stroke="#17804c" stroke-width=".8"/>' +
    '<path d="m7.8 12.4 2.9 2.9 5.5-6" stroke="#ffffff" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');

  I.star = ic(lg("emStar", [["0","#fff3b0"],["0.5","#ffd23f"],["1","#f0921a"]]),
    '<path d="m12 2.4 2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.4l-5.9 3.2 1.2-6.6L2.4 9.4l6.7-.9z" fill="url(#emStar)" stroke="#a35b00" stroke-width=".8" stroke-linejoin="round"/>' +
    '<path d="m12 5.6 1.9 4 4.3.6-3.1 2.9.8 4.2-3.9-2.1-3.9 2.1.8-4.2-3.1-2.9 4.3-.6z" fill="#fffbe0" opacity=".45"/>');
  I.starOff = ic("",
    '<path d="m12 2.4 2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.4l-5.9 3.2 1.2-6.6L2.4 9.4l6.7-.9z" fill="#E8EDF3" stroke="#C7D1DE" stroke-width=".9" stroke-linejoin="round"/>');

  I.skull = ic(lg("emBone", [["0","#fffaf0"],["0.6","#efe4cc"],["1","#c9b894"]]),
    '<path d="M12 2.4c-4.5 0-7.8 3.3-7.8 7.6 0 2.4 1 4.2 2.5 5.3v2.5c0 .8.6 1.4 1.4 1.4h7.8c.8 0 1.4-.6 1.4-1.4v-2.5c1.5-1.1 2.5-2.9 2.5-5.3 0-4.3-3.3-7.6-7.8-7.6z" fill="url(#emBone)" stroke="#9c8b6a" stroke-width=".7" stroke-linejoin="round"/>' +
    '<ellipse cx="9" cy="10.2" rx="2.2" ry="2.5" fill="#241f18"/>' +
    '<ellipse cx="15" cy="10.2" rx="2.2" ry="2.5" fill="#241f18"/>' +
    '<path d="M12 13.2 10.4 16h3.2z" fill="#241f18"/>' +
    '<path d="M9.4 18.4v2.2M12 18.4v2.2M14.6 18.4v2.2" stroke="#9c8b6a" stroke-width="1.1" stroke-linecap="round"/>');

  I.bomb = ic(lg("emBomb", [["0","#5b6480"],["1","#171c2d"]]) + lg("emFuse", FIRE, 0, 0),
    '<path d="M15.4 5.8c.5-1.5 1.7-2.4 3.3-2.4" stroke="#c9a06a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    '<circle cx="19.6" cy="3.4" r="2.3" fill="url(#emFuse)"/>' +
    '<circle cx="11" cy="14" r="7.6" fill="url(#emBomb)" stroke="#0a0f1e" stroke-width=".8"/>' +
    '<path d="M8.8 10.6a3.6 3.6 0 0 1 3-1.6" stroke="#9fb0d8" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".7"/>');

  /* 난이도 배지 */
  I.lv1 = ic(lg("emLeaf", [["0","#39d07a"],["1","#b9f77a"]]),
    '<path d="M12 21.6v-8.4" stroke="#2aa65e" stroke-width="2.1" stroke-linecap="round"/>' +
    '<path d="M11.6 13.2C8.4 13.2 5 11.3 4.2 7c4-.6 7.4 1.7 7.4 6.2z" fill="url(#emLeaf)" stroke="#1f8a4d" stroke-width=".6" stroke-linejoin="round"/>' +
    '<path d="M12.4 11.4c0-4 3-6.4 7-6.2-.6 4-3.4 6.2-7 6.2z" fill="url(#emLeaf)" stroke="#1f8a4d" stroke-width=".6" stroke-linejoin="round"/>');
  I.lv2 = ic(lg("emSh", [["0","#a6d4ff"],["1","#2b6dd6"]]),
    '<path d="M12 2.4 20 5.6v6c0 4.7-3.4 8.6-8 10-4.6-1.4-8-5.3-8-10v-6z" fill="url(#emSh)" stroke="#1b4c9e" stroke-width=".8" stroke-linejoin="round"/>' +
    '<path d="m8.2 11.7 2.8 2.8 4.8-5" stroke="#eaf6ff" stroke-width="2.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');
  I.lv3 = I.bolt;
  I.lv4 = ic(lg("emDia", [["0","#d6faff"],["0.45","#7fd2ff"],["1","#9a6bff"]]),
    '<path d="M12 2.4 21.2 9.4 12 21.6 2.8 9.4z" fill="url(#emDia)" stroke="#3a63b8" stroke-width=".8" stroke-linejoin="round"/>' +
    '<path d="M12 2.4 8 9.4h8z" fill="#eafcff" opacity=".72"/>' +
    '<path d="M2.8 9.4 12 21.6 21.2 9.4z" fill="#5f9dff" opacity=".26"/>');
  I.lv5 = I.trophy;
  I.lv6 = I.boss;
  return I;
})();
function setBtn(el, icon, label){
  if(!el) return;
  el.innerHTML = (icon || "") + "<span>" + esc(label) + "</span>";
}

function esc(t){
  return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function on(el, type, fn){
  if(!el || !el.addEventListener) return;
  el.addEventListener(type, fn, false);
}
var TAP = (typeof window !== "undefined" && window.PointerEvent) ? "pointerdown" : "click";

/* ══════════ 5. 사운드(BGM + 효과음) ══════════ */
var AC = null;
function ctx(){
  if(AC){
    if(AC.state === "suspended"){ try{ AC.resume(); }catch(e){} }
    return AC;
  }
  var C = window.AudioContext || window.webkitAudioContext;
  if(!C) return null;
  try{ AC = new C(); }catch(e){ AC = null; }
  return AC;
}
/* iOS: 첫 터치 안에서 무음 버퍼를 재생해 오디오 세션을 연다 */
function unlockAudio(){
  var a = ctx(); if(!a) return null;
  try{ if(a.state !== "running" && a.resume) a.resume(); }catch(e){}
  /* iOS Safari: 제스처 안에서 1샘플 무음 버퍼를 한 번 재생해야 오디오 세션이 열린다 */
  try{
    var b = a.createBuffer(1, 1, a.sampleRate || 44100);
    var s = a.createBufferSource();
    s.buffer = b; s.connect(a.destination);
    if(s.start) s.start(0);
  }catch(e){}
  return a;
}
/* 터치·복귀마다 오디오가 잠겼으면 다시 깨운다 — 쉬었다 와도 iOS 소리가 살아난다 */
(function(){
  if(typeof document === "undefined" || !document.addEventListener) return;
  var wasHidden = false;
  function resetAudio(){
    try{ bgmStop(); }catch(e){}
    if(AC){
      try{ if(AC.close) AC.close(); }catch(e){}
      AC = null;
    }
    BGM.master = null;
  }
  function wake(){
    /* iOS: 원어민 음성이 나오는 동안 오디오를 깨우려 하면 오디오 세션을 다시 잡느라
       탭 처리가 밀린다 — 말하는 중이면 건드리지 않고, 끝나면 sayDone 이 되살린다 */
    if(isSpeaking()) return;
    /* 이미 소리가 나고 있으면 할 일이 없다(탭마다 무음 버퍼를 만들지 않는다) */
    if(!wasHidden && AC && AC.state === "running"){
      if(store.sound && S.mode === "play" && !BGM.on){ try{ bgmStart(); }catch(e){} }
      return;
    }
    /* 'interrupted'(iOS 음성·전화가 오디오를 잠깐 가져간 상태)는 다시 만들지 않고 resume 만 —
       매번 새로 만들면 BGM 이 처음부터 다시 쌓이며 끊긴다 */
    if(wasHidden || (AC && AC.state === "closed")){
      wasHidden = false;
      resetAudio();
    }
    var a = unlockAudio();
    if(a && a.resume && a.state !== "running"){
      try{
        var p = a.resume();
        if(p && p.then) p.then(function(){
          if(store.sound && S.mode === "play" && !BGM.on){ try{ bgmStart(); }catch(e){} }
          if(BGM.on && BGM.master && AC){
            try{ BGM.master.gain.value = BGM.duck; BGM.next = AC.currentTime + 0.05; }catch(e){}
          }
        });
      }catch(e){}
    }
    if(store.sound && S.mode === "play" && !BGM.on){ try{ bgmStart(); }catch(e){} }
  }
  var evs = ["pointerdown","touchstart","click","keydown"], i;
  for(i=0;i<evs.length;i++) document.addEventListener(evs[i], wake, true);
  document.addEventListener("visibilitychange", function(){
    if(document.hidden){
      wasHidden = true;
      try{ bgmStop(); }catch(e){}
    }
  });
  if(typeof window !== "undefined" && window.addEventListener){
    window.addEventListener("pagehide", function(){ wasHidden = true; try{ bgmStop(); }catch(e){} });
  }
})();
function beep(f, dur, type, vol, to){
  if(!store.sound) return;
  var a = ctx(); if(!a) return;
  try{
    var o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime;
    o.type = type || "sine";
    o.frequency.setValueAtTime(f, t0);
    if(to) o.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.09, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }catch(e){}
}
function noise(dur, vol){
  if(!store.sound) return;
  var a = ctx(); if(!a) return;
  try{
    var n = Math.max(1, Math.floor(a.sampleRate * dur)), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for(var i=0;i<n;i++) d[i] = (Math.random()*2 - 1) * (1 - i/n);
    var src = a.createBufferSource(); src.buffer = buf;
    var g = a.createGain(); g.gain.value = vol || 0.05;
    var f = a.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 900;
    src.connect(f); f.connect(g); g.connect(a.destination);
    src.start(0);
  }catch(e){}
}
function sfxTap(n){ beep(520 + Math.min(4, n)*70, 0.06, "sine", 0.08); }
function sfxPop(){
  beep(720, 0.08, "triangle", 0.11, 1180);
  setTimeout(function(){ beep(1180, 0.10, "triangle", 0.08, 1560); }, 55);
  noise(0.16, 0.05);
}
function sfxBad(){ beep(240, 0.16, "square", 0.07, 130); }
function sfxLaser(){
  beep(1500, 0.10, "sawtooth", 0.05, 420);
  noise(0.10, 0.028);
}
function sfxCombo(){
  beep(660, 0.09, "sine", 0.09, 860);
  setTimeout(function(){ beep(990, 0.10, "sine", 0.08, 1200); }, 70);
  setTimeout(function(){ beep(1320, 0.12, "sine", 0.07, 1500); }, 150);
}
function sfxOver(){ beep(420, 0.5, "sine", 0.09, 110); }
function paintSound(){
  var b = $("btnSound");
  if(b){ b.innerHTML = store.sound ? ICON.sound : ICON.mute; b.className = "icon3" + (store.sound ? "" : " off"); }
}

/* ── BGM: Web Audio 신스 루프(외부 파일 없음) ── */
var NOTE = {
  C3:130.81, G2:98.00, A2:110.00, F2:87.31,
  F3:174.61, G3:196.00, A3:220.00, B3:246.94,
  C4:261.63, D4:293.66, E4:329.63, G4:392.00, A4:440.00,
  C5:523.25, D5:587.33, E5:659.25, G5:783.99
};
/* 4마디 진행: C - G - Am - F (밝고 경쾌) */
var CHORDS = [
  { bass:NOTE.C3, tones:[NOTE.C4, NOTE.E4, NOTE.G4] },
  { bass:NOTE.G2, tones:[NOTE.B3, NOTE.D4, NOTE.G4] },
  { bass:NOTE.A2, tones:[NOTE.A3, NOTE.C4, NOTE.E4] },
  { bass:NOTE.F2, tones:[NOTE.F3, NOTE.A3, NOTE.C4] }
];
var ARP = [0,1,2,3,0,2,1,2];      /* 3 = 한 옥타브 위 */
var LEAD = [
     NOTE.C5,0,NOTE.E5,0,NOTE.G5,0,NOTE.E5,0,
     NOTE.D5,0,NOTE.A4,0,NOTE.G4,0,NOTE.A4,0,
     NOTE.A4,0,NOTE.C5,0,NOTE.E5,0,NOTE.C5,0,
     NOTE.G4,0,NOTE.A4,0,NOTE.C5,0,NOTE.D5,0
];
var BGM = { on:false, master:null, timer:0, next:0, step:0, bpm:116, duck:0.95 };

function bgmVoice(freq, t, dur, type, vol, cutoff){
  var a = AC; if(!a || !BGM.master) return;
  try{
    var o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    if(cutoff){
      var f = a.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(cutoff, t);
      g.connect(f); f.connect(BGM.master);
    } else {
      g.connect(BGM.master);
    }
    o.start(t); o.stop(t + dur + 0.04);
  }catch(e){}
}
function bgmKick(t){
  var a = AC; if(!a || !BGM.master) return;
  try{
    var o = a.createOscillator(), g = a.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.13);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.13, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
    o.connect(g); g.connect(BGM.master);
    o.start(t); o.stop(t + 0.2);
  }catch(e){}
}
function bgmHat(t){
  var a = AC; if(!a || !BGM.master) return;
  try{
    var n = Math.floor((a.sampleRate || 44100) * 0.03);
    var buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for(var i=0;i<n;i++) d[i] = (Math.random()*2 - 1) * (1 - i/n);
    var s = a.createBufferSource(); s.buffer = buf;
    var f = a.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 6800;
    var g = a.createGain();
    g.gain.setValueAtTime(0.022, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(BGM.master);
    s.start(t);
  }catch(e){}
}
function bgmStep(step, t){
  var bar = Math.floor(step / 8) % 4, s = step % 8;
  var ch = CHORDS[bar];
  if(s === 0 || s === 4) bgmVoice(ch.bass, t, 0.26, "triangle", 0.11, 0);
  var idx = ARP[s];
  var freq = ch.tones[idx % 3] * (idx === 3 ? 2 : 1);
  bgmVoice(freq, t, 0.14, "square", 0.05, 2600);
  var lead = LEAD[step % 32];
  if(lead) bgmVoice(lead, t, 0.17, "triangle", 0.055, 5200);
  if(s === 0 || s === 4) bgmKick(t);
  if(s % 2 === 1) bgmHat(t);
}
function bgmAlive(){ return !!(BGM.on && AC && store.sound); }
function bgmStart(){
  if(!store.sound) return;
  var a = ctx(); if(!a) return;
  if(BGM.on) return;
  try{
    if(!BGM.master){
      BGM.master = a.createGain();
      BGM.master.gain.value = 0.0001;
      BGM.master.connect(a.destination);
    }
  }catch(e){ return; }
  BGM.on = true;
  try{
    var now = a.currentTime;
    var g = BGM.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(0.0001, g.value || 0.0001), now);
    g.exponentialRampToValueAtTime(BGM.duck, now + 0.7);
  }catch(e){}
  BGM.step = 0;
  BGM.next = a.currentTime + 0.08;
  if(BGM.timer) clearInterval(BGM.timer);
  BGM.timer = setInterval(bgmTick, 40);
  bgmTick();
}
function bgmStop(){
  if(!BGM.on) return;
  BGM.on = false;
  if(BGM.timer){ clearInterval(BGM.timer); BGM.timer = 0; }
  var a = AC;
  if(a && BGM.master){
    try{
      var now = a.currentTime, g = BGM.master.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(Math.max(0.0001, g.value || 0.0001), now);
      g.exponentialRampToValueAtTime(0.0001, now + 0.22);
    }catch(e){}
  }
}
function bgmTick(){
  var a = AC;
  if(!BGM.on || !a) return;
  BGM.bpm = 116 + Math.min(16, Math.floor(S.combo * 0.5)) + (S.danger ? 28 : 0);
  var spb = 60 / BGM.bpm / 2;        /* 8분음표 길이 */
  if(BGM.next < a.currentTime - 0.12) BGM.next = a.currentTime + 0.02;
  var horizon = a.currentTime + 0.30;
  var guard = 0;
  while(BGM.next < horizon && guard++ < 32){
    bgmStep(BGM.step, BGM.next);
    BGM.next += spb;
    BGM.step = (BGM.step + 1) % 32;
  }
}

/* ══════════ 6. HUD ══════════ */
function paintHearts(hit){
  var h = "", i;
  for(i=0;i<MAX_HEARTS;i++) h += (i < S.hearts) ? ICON.heart : ICON.heartOff;
  elHearts.innerHTML = h;
  if(hit && elHearts.children && elHearts.children[hit-1]){
    var c = elHearts.children[hit-1];
    if(c.classList){
      c.classList.add("pop");
      setTimeout(function(){ c.classList.remove("pop"); }, 220);
    }
  }
}
function paintScore(){ elScore.textContent = String(S.score); }
function paintCombo(){
  var c = S.combo, cls = "combo";
  if(c >= 10) cls += " fever";
  else if(c >= 6) cls += " m3";
  else if(c >= 3) cls += " m2";
  elCombo.className = cls;
  if(c >= 10) elCombo.innerHTML = ICON.flame + "<b>FEVER ×" + S.mult + "</b>";
  else if(c > 0) elCombo.innerHTML = "<b>×" + S.mult + "</b><i>" + c + " COMBO</i>";
  else elCombo.innerHTML = "<b>×1</b>";
  if(c > 0 && elCombo.animate){
    try{ elCombo.animate([{transform:"scale(1.26)"},{transform:"scale(.94)"},{transform:"scale(1)"}],
      {duration:260, easing:"cubic-bezier(.34,1.56,.64,1)"}); }catch(e){}
  }
}
function paintSpeed(){
  var a = accelOf(S.combo);
  if(a >= 1.06){
    elSpd.style.display = "";
    elSpd.innerHTML = ICON.bolt + "×" + a.toFixed(1);
  } else {
    elSpd.style.display = "none";
  }
}
/* 스테이지 이름 — 목록 카드·클리어 시트에 그대로 쓰는 한 줄 */
function stageLine(n){
  var m = stageMeta(n);
  if(m.kind === "pat")   return "Lv." + m.n + " · " + PATTERNS[m.p];
  if(m.kind === "mix")   return "MIX " + m.mix + " · 패턴 1~" + m.to + " 총복습";
  if(m.kind === "final") return "FINAL MIX · 패턴 1~" + m.to + " 총복습";
  return "Lv." + m.n + " · 무한 서바이벌";
}
/* 카드 둘째 줄 — 무엇을 얼마나 푸는지 */
function stageSub(n){
  var m = stageMeta(n);
  if(m.kind === "pat")
    return m.p === 1 ? ("패턴 1 집중 · " + m.goal + "문장")
                     : ("패턴 " + m.p + " 집중 + 복습 · " + m.goal + "문장");
  if(m.kind === "mix")   return m.goal + "문장 · 골고루 섞어서";
  if(m.kind === "final") return m.goal + "문장 · 패턴 30종 총동원";
  return "300문장 · 끝없이";
}
/* HUD 태그 — 좁은 자리라 짧게 */
function stageTagText(n, t){
  var m = stageMeta(n);
  if(m.kind === "pat")   return "Lv." + m.n + " " + (TIER_NAMES[t || 1] || "Easy");
  if(m.kind === "mix")   return "MIX " + m.mix;
  if(m.kind === "final") return "FINAL";
  return "무한전";
}
/* 버튼 라벨 — 줄바꿈이 생기지 않게 짧게 */
function btnLabel(n, t){
  var m = stageMeta(n);
  if(m.kind === "pat")   return "Lv." + m.n + " " + (TIER_NAMES[t || 1] || "Easy");
  if(m.kind === "mix")   return "MIX " + m.mix;
  if(m.kind === "final") return "FINAL MIX";
  return "무한전";
}
function levelLabel(n){ return stageLine(n); }
function paintStage(){
  var inf = isInfStage(S.stage);
  elStageTag.textContent = stageTagText(S.stage, S.tier);
  if(elBossTag) elBossTag.style.display = inf ? "" : "none";
  if(elGoal) elGoal.className = inf ? "goal inf" : "goal";
  if(inf){
    elGoalFill.style.width = "100%";
    elGoalTxt.innerHTML = "생존 <b>" + S.clears + "</b>";
  } else {
    var g = S.goal || 1;
    elGoalFill.style.width = Math.min(100, Math.round(S.clears / g * 100)) + "%";
    elGoalTxt.innerHTML = "<b>" + S.clears + "</b> / " + g;
  }
}

/* ══════════ 7. 연출 ══════════ */
function toast(msg, blue){
  elToast.textContent = msg;
  elToast.className = "toast" + (blue ? " blue" : "") + " show";
  clearTimeout(toast._t);
  toast._t = setTimeout(function(){ elToast.className = "toast" + (blue ? " blue" : ""); }, 900);
}
/* 조립 바 → 타겟 줄로 날아가는 레이저 빔 (0.13초 만에 명중) */
function laserFromBar(rect){
  if(!rect || !elSlots || !document.createElement) return;
  var bar = null;
  try{ bar = elSlots.getBoundingClientRect ? elSlots.getBoundingClientRect() : null; }catch(e){ bar = null; }
  if(!bar || !bar.width) return;
  var sx = bar.left + bar.width/2, sy = bar.top + 2;
  var px = rect.left + rect.width/2, py = rect.top + rect.height/2;
  var dx = px - sx, dy = py - sy;
  var len = Math.sqrt(dx*dx + dy*dy);
  if(!(len > 1)) return;
  var ang = Math.atan2(dy, dx)*180/Math.PI;
  var rot = "rotate(" + ang.toFixed(2) + "deg)";
  var b = document.createElement("div");
  b.className = "beam";
  b.style.left = sx + "px";
  b.style.top = (sy - 3) + "px";
  b.style.width = Math.round(len) + "px";
  b.style.transform = rot + " scaleX(0)";
  document.body.appendChild(b);
  if(b.animate){
    try{
      b.animate([
        {opacity:0, transform:rot + " scaleX(0)"},
        {opacity:1, offset:.26, transform:rot + " scaleX(1)"},
        {opacity:1, offset:.62, transform:rot + " scaleX(1)"},
        {opacity:0, transform:rot + " scaleX(1)"}
      ], {duration:250, easing:"cubic-bezier(.2,.85,.25,1)"});
    }catch(e){}
  } else {
    b.style.opacity = "1";
  }
  setTimeout(function(){ if(b.parentNode) b.parentNode.removeChild(b); }, 320);
}
function flash(){
  try{
    var f = elFlash;
    if(f.animate) f.animate([{opacity:0},{opacity:.32},{opacity:0}], {duration:260, easing:"ease-out"});
    else { f.style.opacity = ".4"; setTimeout(function(){ f.style.opacity = "0"; }, 140); }
  }catch(e){}
}
function burst(cx, cy){
  var pal = ["#ffd93d","#ff7aa2","#5ad2ff","#7cf7c2","#c39bff","#ffffff","#ffa64d"];
  var n = 8 + Math.min(8, (S.combo || 0)), i;
  for(i=0;i<n;i++){
    var d = document.createElement("div");
    var kind = i % 4, sz = 7 + Math.random()*9;
    d.className = "dot k" + kind;
    d.style.width = sz + "px";
    d.style.height = (kind === 1 ? sz*0.55 : sz) + "px";
    d.style.left = (cx - sz/2) + "px";
    d.style.top = (cy - sz/2) + "px";
    d.style.background = pal[(i*3 + (S.combo||0)) % pal.length];
    if(kind === 0) d.style.borderRadius = "50%";
    if(kind === 1) d.style.borderRadius = "2px";
    if(kind === 2) d.style.clipPath = "polygon(50% 0,63% 36%,100% 38%,70% 60%,82% 100%,50% 76%,18% 100%,30% 60%,0 38%,37% 36%)";
    if(kind === 3) d.style.clipPath = "polygon(50% 0,100% 100%,0 100%)";
    elFx.appendChild(d);
    var ang = Math.random()*Math.PI*2, dist = 46 + Math.random()*120;
    var dx = Math.cos(ang)*dist, dy = Math.sin(ang)*dist - 22;
    var rt = (Math.random()*720 - 360).toFixed(0) + "deg";
    if(d.animate){
      d.animate(
        [{transform:"translate(0,0) rotate(0deg) scale(.5)", opacity:1, offset:0},
         {transform:"translate(" + (dx*.55).toFixed(0) + "px," + (dy*.62).toFixed(0) + "px) rotate(" + rt + ") scale(1.15)", opacity:1, offset:.38},
         {transform:"translate(" + dx.toFixed(0) + "px," + (dy + 46).toFixed(0) + "px) rotate(" + rt + ") scale(.3)", opacity:0}],
        {duration: 620 + Math.random()*320, easing:"cubic-bezier(.16,.72,.32,1)"}
      );
    }
    (function(node){ setTimeout(function(){ if(node.parentNode) node.parentNode.removeChild(node); }, 1000); })(d);
  }
  var ring = document.createElement("div");
  ring.className = "ring";
  var R = 30;
  ring.style.width = (R*2) + "px"; ring.style.height = (R*2) + "px";
  ring.style.left = (cx - R) + "px"; ring.style.top = (cy - R) + "px";
  elFx.appendChild(ring);
  if(ring.animate){
    ring.animate([{transform:"scale(.35)", opacity:.95},{transform:"scale(2.5)", opacity:0}],
      {duration:520, easing:"cubic-bezier(.16,.7,.3,1)"});
  }
  setTimeout(function(){ if(ring.parentNode) ring.parentNode.removeChild(ring); }, 700);
  var pop = document.createElement("div");
  pop.className = "hitstar";
  pop.style.left = cx + "px"; pop.style.top = cy + "px";
  elFx.appendChild(pop);
  if(pop.animate){
    pop.animate([{transform:"translate(-50%,-50%) scale(.2) rotate(-25deg)", opacity:1},
                 {transform:"translate(-50%,-50%) scale(1.5) rotate(8deg)", opacity:.85, offset:.4},
                 {transform:"translate(-50%,-50%) scale(.6) rotate(0deg)", opacity:0}],
      {duration:420, easing:"cubic-bezier(.2,.9,.3,1)"});
  }
  setTimeout(function(){ if(pop.parentNode) pop.parentNode.removeChild(pop); }, 460);
}
function floatText(txt, cx, cy, bad){
  var d = document.createElement("div");
  d.className = "plus" + (bad ? " bad" : "");
  d.textContent = txt;
  d.style.left = cx + "px"; d.style.top = cy + "px";
  elFx.appendChild(d);
  if(d.animate){
    d.animate([{transform:"translate(-50%,-50%) scale(.7)", opacity:0},
               {transform:"translate(-50%,-118%) scale(1)", opacity:1, offset:.35},
               {transform:"translate(-50%,-190%) scale(1)", opacity:0}],
      {duration:760, easing:"cubic-bezier(.2,.8,.3,1)"});
  }
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 820);
}
function shakeEl(el){
  if(!el || !el.animate) return;
  try{
    el.animate([{transform:el.style.transform + " translateX(0)"},{transform:el.style.transform + " translateX(-6px)"},
      {transform:el.style.transform + " translateX(5px)"},{transform:el.style.transform + " translateX(-2px)"},
      {transform:el.style.transform + " translateX(0)"}],
      {duration:240, easing:"ease-out"});
  }catch(e){}
}

/* ══════════ 8. 배치·렌더 ══════════ */
function layout(){
  var h = (elLane && elLane.clientHeight) || 0;
  var w = (elLane && elLane.clientWidth) || 0;
  if(h > 0) S.laneH = h;
  if(w > 0) S.laneW = w;
  if(!S.laneH) S.laneH = 240;
  if(!S.laneW) S.laneW = 320;
  S.pitch = Math.max(34, Math.floor((S.laneH - 2) / PITCH_ROWS));
  S.R = Math.min(48, Math.max(28, S.pitch - 6));
  var rf = S.R >= 46 ? 15.5 : (S.R >= 40 ? 14 : (S.R >= 34 ? 12.5 : 11.5));
  for(var i=0;i<S.rows.length;i++){
    applyRowSize(S.rows[i]);
  }
  S.fontSize = rf;
  paintRows();
}
function applyRowSize(r){
  if(!r || !r.el) return;
  r.el.style.height = S.R + "px";
  r.el.style.fontSize = S.fontSize + "px";
  r.el.style.borderRadius = Math.max(9, Math.round(S.R*0.3)) + "px";
  fitRowText(r);
}
/* 글자 폭 어림값 — 한글은 글자 크기만큼, 영문은 0.56배 */
function koEstWidth(txt, fs){
  var w = 0, i, c;
  txt = String(txt || "");
  for(i=0;i<txt.length;i++){
    c = txt.charCodeAt(i);
    if(c === 32) w += fs*0.30;
    else if((c >= 0xAC00 && c <= 0xD7A3) || (c >= 0x3130 && c <= 0x318F) || (c >= 0x1100 && c <= 0x11FF)) w += fs*0.98;
    else w += fs*0.56;
  }
  return w * 0.985;
}
/* 폰트를 단계적으로 줄이고, 그래도 넘치면 두 줄로 감싼다 */
function fitRowText(r){
  if(!r || !r.el || !r.koEl) return;
  var avail = Math.max(96, (S.laneW || 340) - 60);
  var txt = r.koEl.textContent || "";
  var fs = S.fontSize || 14, min = 10;
  if(r.el.classList && r.el.classList.remove) r.el.classList.remove("twoline");
  while(fs > min && koEstWidth(txt, fs) > avail) fs -= 0.5;
  r.el.style.fontSize = fs + "px";
  if(koEstWidth(txt, fs) > avail && r.el.classList && r.el.classList.add) r.el.classList.add("twoline");
}
/* 단어판이 화면을 넘지 않게: 4~3열 컴팩트 배치 + 글자 축소 */
function fitPool(){
  if(!elPool) return;
  var cap = S.poolCap || elPool.clientHeight || 0;
  if(!cap) return;
  var sizes = [12.5, 12, 11.5, 11, 10.5, 10, 9.5, 9, 8.5];
  for(var i=0;i<sizes.length;i++){
    var fs = sizes[i];
    var pad = Math.max(4, Math.round(fs * 0.52));
    for(var j=0;j<S.blockEls.length;j++){
      var b = S.blockEls[j];
      b.style.fontSize = fs + "px";
      b.style.padding = pad + "px " + (pad + 3) + "px";
      b.style.borderRadius = Math.max(8, Math.round(fs * 0.8)) + "px";
    }
    if(elPool.scrollHeight <= elPool.clientHeight + 1) break;
  }
}
/* 단어판 높이를 스테이지 시작 시점에 고정 — 문장이 바뀌어도 낙하 구역이 흔들리지 않는다 */
function freezePool(){
  if(!elPool) return;
  var appH = (elApp && elApp.clientHeight) || 0;
  /* 지난 스테이지에서 박아 둔 height 가 남아 있으면 offsetHeight 가 '잘린 높이'로 나와
     단어판이 영영 그 높이에 갇힌다 — 먼저 풀어 두고 잰다. */
  elPool.style.height = "auto";
  var h = elPool.offsetHeight || 0;
  var maxH = appH ? Math.max(108, Math.round(appH*0.29)) : 200;
  var minH = 96;
  if(!S.poolCap) S.poolCap = Math.min(maxH, Math.max(minH, h));
  if(appH && S.poolCap > maxH) S.poolCap = maxH;
  elPool.style.height = S.poolCap + "px";
  fitPool();
}
/* 화면 높이를 넘는 칩은 overflow:hidden 에 가려 눌리지도 않는다.
   넘치면 '정답이 아닌 칩'을 뒤에서부터 덜어내 단어판을 항상 다 보이게 만든다. */
function dropOneTrap(row){
  if(!row || !row.d) return false;
  var need = {}, i, k, cut = -1, ch = row.d.chunks;
  for(i=0;i<ch.length;i++){ k = norm(ch[i]); need[k] = (need[k] || 0) + 1; }
  for(i=S.blocks.length-1;i>=0;i--){
    k = norm(S.blocks[i]);
    if(need[k] > 0){ need[k]--; continue; }     /* 정답 칩은 세기만 하고 지나간다 */
    cut = i; break;
  }
  if(cut < 0) return false;
  S.blocks.splice(cut, 1);
  return true;
}
function prunePool(row){
  if(!elPool || !row || !row.d || !S.blocks.length) return;
  var guard = 0, changed = false;
  while(guard++ < 24){
    if(elPool.scrollHeight <= elPool.clientHeight + 1) break;
    if(!dropOneTrap(row)) break;
    changed = true;
    renderPool();
  }
  if(changed) row.pool = S.blocks.slice();
}
function renderPool(){
  var i;
  elPool.innerHTML = "";
  S.blockEls = [];
  var prevPat = false;
  for(i=0;i<S.blocks.length;i++){
    var t = S.blocks[i];
    var isP = !!OPENSET[norm(t)];
    if(!isP && prevPat){
      var sep = document.createElement("span");
      sep.className = "poolSep";
      elPool.appendChild(sep);
    }
    prevPat = isP;
    var b = document.createElement("button");
    /* 패턴 앞머리 칩은 .pat 으로 눈에 띄게 — 정답·함정 오프너가 같은 색이라 스포일러는 없다 */
    b.className = isP ? "blk pat" : "blk";
    b.textContent = t;
    b.setAttribute("data-i", String(i));
    elPool.appendChild(b);
    S.blockEls.push(b);
  }
  fitPool();
}
function renderSlots(){
  var i, h = "", s;
  /* 빈 칸은 그리지 않는다 — 담은 칩만 왼쪽부터 차곡차곡 (몇 칸을 채워야 하는지 알 수 없게) */
  for(i=0;i<S.slots.length;i++){
    s = S.slots[i];
    h += '<div class="slot filled" data-pos="' + i + '">' + esc(s.t) + "</div>";
  }
  if(!S.slots.length) h = '<span class="hint">단어를 순서대로 눌러요</span>';
  elSlots.innerHTML = h;
  if(elFire) elFire.className = S.slots.length ? "fire" : "fire dim";
  if(elBuilt) elBuilt.textContent = builtText();
}
/* 슬롯에 담은 청크를 그대로 이어 붙인 문장 = 발사할 때 판정하는 문자열 */
function builtText(){
  var out = [], i;
  for(i=0;i<S.slots.length;i++) out.push(S.slots[i].t);
  return out.join(" ");
}
function targetRow(){
  if(!S.rows.length) return null;
  for(var i=0;i<S.rows.length;i++) if(S.rows[i].uid === S.target) return S.rows[i];
  return S.rows[0];
}
function ensurePool(row){
  if(!row.pool) row.pool = buildPool(row.d, trapCount(row.d), S.stage);
  return row.pool;
}
function setTargetRow(row, keepSlots){
  S.target = row ? row.uid : 0;
  if(!keepSlots) S.slots = [];
  if(!row){
    S.blocks = [];
    elSlots.className = "slots";
    renderSlots(); renderPool(); paintRows();
    return;
  }
  ensurePool(row);
  S.blocks = row.pool;
  elSlots.className = "slots";
  renderSlots(); renderPool(); prunePool(row);
  paintRows();
}
function isEasyPat(){
  var m = stageMeta(S.stage);
  return !!(m && m.kind === "pat" && (S.tier || 1) === 1);
}
function autoFillEasy(row){
  if(!isEasyPat() || !row || !row.d || !row.d.chunks || row.d.chunks.length < 2) return;
  if(S.slots && S.slots.length) return;
  var head = norm(row.d.chunks[0]), idx = -1, k;
  for(k=0;k<S.blocks.length;k++){
    if(norm(S.blocks[k]) === head){ idx = k; break; }
  }
  if(idx >= 0){
    S.slots = [{ i: idx, t: S.blocks[idx] }];
    renderSlots();
    renderPoolUsed();
  }
}
function paintRows(){
  var t = targetRow(), i, r, cls, w, maxX;
  for(i=0;i<S.rows.length;i++){
    r = S.rows[i];
    w = (r.el && r.el.offsetWidth) ? r.el.offsetWidth : 0;
    if(w && S.laneW){
      maxX = Math.max(0, S.laneW - w - 6);
      if((r.x || 0) > maxX) r.x = maxX;
      if((r.x || 0) < 0) r.x = 0;
    }
    r.el.style.transform = "translate3d(" + (r.x || 0) + "px," + Math.round(r.y) + "px,0)";
    cls = "row tone" + (r.uid % 3);
    if(r.isBoss) cls += " bossrow";
    if(t && r.uid === t.uid) cls += " target";
    if(r.y + S.R >= S.laneH - S.R*0.72) cls += " danger";
    if(r.el.className !== cls) r.el.className = cls;
  }
}

/* ══════════ 9. 출제 — 난이도 단계 큐 ══════════ */
function patternCount(p){
  var n = 0;
  for(var i=0;i<DATA.length;i++) if(DATA[i].p === p) n++;
  return n;
}
function countKeys(o){
  var n = 0, k;
  for(k in o) if(o.hasOwnProperty(k) && o[k]) n++;
  return n;
}
/* 스테이지 문장 풀 — 패턴 레벨은 그 패턴 + 앞 패턴(복습 후보), MIX는 범위 안 패턴 전부 */
function stageIds(stage){
  var m = stageMeta(stage), out = [], i;
  if(m.kind === "inf") return ALL_IDS.slice();
  for(i=0;i<DATA.length;i++){
    if(m.kind === "pat" ? DATA[i].p <= m.p : (DATA[i].p >= m.from && DATA[i].p <= m.to)) out.push(i);
  }
  return out;
}
/* 그 단계의 30문장을 세 웨이브로 나눠 큐에 넣는다. 웨이브마다 패턴 번호를 3으로 나눈 나머지가
   같은 문장들(1·4·7…, 2·5·8…, 3·6·9…)을 모아 섞으므로, 초반·중반·후반 어느 구간을 봐도
   패턴 1~30이 골고루 섞여 나온다(특정 레벨이 몇몇 패턴에 갇히지 않는다). */
function queueFor(stage, run, tier){
  var m = stageMeta(stage), rng = makeRng((stage || 1)*7717 + (run || 0)*137 + 3), i;
  var goal = m.goal || 0, out = [];
  if(m.kind === "inf") return shuffled(ALL_IDS.slice(), rng);   /* 무한전 = 300문장 전체 */

  if(m.kind === "pat" && (tier || 1) > 1){
    /* 2·3단계 — 그 패턴 5문장 + 해금 기준까지 깬 패턴(1~to)을 섞는다 */
    var tt = Math.max(2, Math.min(3, tier || 2)), to = tierMixTo(stage, tt);
    var mine = [], others = [], goalT = TIER_GOAL[tt];
    for(i=0;i<DATA.length;i++){
      if(DATA[i].p === m.p) mine.push(i);
      else if(DATA[i].p <= to) others.push(i);
    }
    mine = shuffled(mine, rng).slice(0, 5);
    others = shuffled(others, makeRng((stage || 1)*613 + tt*97 + (run || 0)*31 + 5)).slice(0, Math.max(0, goalT - mine.length));
    return shuffled(mine.concat(others), makeRng((stage || 1)*89 + tt*211 + (run || 0)*17 + 9));
  }

  if(m.kind === "pat"){
    /* 그 패턴 5문장을 모두 넣고, 남는 자리는 앞 패턴 복습으로 번갈아 채운다 */
    var own = [], prev = [];
    for(i=0;i<DATA.length;i++){
      if(DATA[i].p === m.p) own.push(i);
      else if(DATA[i].p < m.p) prev.push(i);
    }
    own = shuffled(own, rng);
    prev = shuffled(prev, makeRng((stage || 1)*911 + (run || 0)*53 + 7)).slice(0, Math.max(0, goal - own.length));
    var oi = 0, ri = 0;
    for(i=0;i<goal;i++){
      if(i % 2 === 0 && oi < own.length) out.push(own[oi++]);
      else if(ri < prev.length) out.push(prev[ri++]);
      else if(oi < own.length) out.push(own[oi++]);
    }
    return out;
  }

  /* MIX · FINAL MIX — 패턴마다 한 문장씩 먼저 뽑아 최대한 골고루 섞고, 남는 자리는 무작위로 채운다 */
  var cand = stageIds(stage), byPat = {}, pats = [];
  for(i=0;i<cand.length;i++){
    var p = DATA[cand[i]].p;
    if(!byPat[p]){ byPat[p] = []; pats.push(p); }
    byPat[p].push(cand[i]);
  }
  pats = shuffled(pats, makeRng((stage || 1)*29 + (run || 0)*13 + 3));
  var picked = {};
  for(i=0;i<pats.length && out.length<goal;i++){
    var one = shuffled(byPat[pats[i]], makeRng((stage || 1)*53 + pats[i]*17 + (run || 0)*7 + 5))[0];
    picked[one] = 1; out.push(one);
  }
  var rest = shuffled(cand.filter(function(x){ return !picked[x]; }), rng);
  for(i=0;i<rest.length && out.length<goal;i++) out.push(rest[i]);
  return shuffled(out, makeRng((stage || 1)*1231 + (run || 0)*97 + 11));
}
/* 30문장을 한 번씩 → 30/30이면 그 단계 문장을 전부 푼 것 */
function refillQueue(){
  var ids = queueFor(S.stage, S.run, S.tier), out = [], i;
  if(isInfStage(S.stage)){ S.q = ids; return; }
  for(i=0;i<ids.length;i++) if(!S.clearedIds[String(DATA[ids[i]].id)]) out.push(ids[i]);
  S.q = out.length ? out : ids;   /* 남은 문장이 없으면(이론상 목표 달성) 그대로 다시 */
}
/* 지금 화면에 떠 있는 문장인가 */
function onScreenId(id){
  for(var i=0;i<S.rows.length;i++){
    var r = S.rows[i];
    if(r && !r.dead && r.d && r.d.id === id) return true;
  }
  return false;
}
function queueHas(idx){
  for(var i=0;i<S.q.length;i++) if(S.q[i] === idx) return true;
  return false;
}
function nextSentence(){
  var idx, guard = 0;
  if(!S.q || !S.q.length) refillQueue();
  idx = S.q.shift();
  /* 화면에 이미 같은 문장이 떠 있으면 뒤로 미루고 다음 문장을 꺼낸다 */
  while(guard++ < 600 && idx !== undefined && DATA[idx] && onScreenId(DATA[idx].id)){
    S.q.push(idx);
    if(!S.q.length){ refillQueue(); if(!S.q.length) break; }
    idx = S.q.shift();
  }
  if(idx === undefined){ refillQueue(); idx = S.q.shift(); }
  if(idx === undefined) idx = 0;
  S.lastId = DATA[idx].id;
  return idx;
}
/* 바닥에 닿아 놓친 문장은 큐 맨 뒤로 미루지 않고 곧바로 다시 출제한다 — 최대 3줄 뒤에 재등장.
   하트가 남아 있는 한 무한전에서도 반드시 다시 나오고, 일반 단계에서는 못 푼 문장을 끝까지 풀고
   넘어갈 수 있다(목표 30문장 = 그 단계 30문장을 한 번씩 다 깨는 것). */
var REQUEUE_AT = 3;
function requeue(d){
  if(!d) return;
  if(S.clearedIds[String(d.id)]) return;        /* 이미 푼 문장은 다시 넣지 않는다 */
  if(onScreenId(d.id)) return;                 /* 화면에 같은 문장이 떠 있으면 중복 삽입 금지 */
  if(queueHas(d.idx)) return;                  /* 대기열에 이미 있으면 다시 넣지 않는다 */
  var at = Math.min(REQUEUE_AT, S.q.length);
  S.q.splice(at, 0, d.idx);
}
/* 함정 수: 단계가 오를수록 늘고, 단어판이 화면에 다 들어가도록 상한 */
function trapCount(d){
  var n = stageMeta(S.stage).n;
  var want = isInfStage(S.stage) ? 12 : Math.min(12, 8 + Math.floor((n - 1)/8) + ((S.tier || 1) - 1));
  var nn = d ? d.chunks.length : 3;
  var budget = S.poolBudget || 14;
  var maxTraps = Math.max(3, budget - nn);
  return Math.min(want, maxTraps);
}
/* 새 줄 스폰 간격(ms) — 스테이지가 오를수록 조금씩 당겨지고 MIX는 한 단계 더 빠르다.
   무한전은 푼 문장이 늘수록 8.5초에서 2.8초까지 빨라진다. */
function paceOf(stage, clears){
  if(isInfStage(stage)) return Math.max(2800, 8500 - (clears || 0)*80);
  var m = stageMeta(stage || 1);
  var base = 9600 - (m.n - 1)*110;
  if(m.kind === "mix" || m.kind === "final") base -= 250;
  base = Math.max(5400, Math.round(base));
  var spdDiv = (m.kind === "pat" && (S.tier || 1) === 1) ? 1.25 : ((S.tier || 1) === 3 ? 1.35 : ((S.tier || 1) === 2 ? 1.2 : 1));
  if(spdDiv > 1) base = Math.round(base / spdDiv);
  if(!isInfStage(stage) && (clears || 0) >= Math.max(1, tierGoal(stage, S.tier || 1) - 2)){
    base = Math.round(base / 1.3);
  }
  return base;
}
function accelOf(combo){ return 1 + Math.min(0.5, Math.max(0, combo)*0.022); }
function spawnGap(){ return paceOf(S.stage, S.clears) / accelOf(S.combo); }
function fallSpeed(){ return S.pitch / spawnGap(); }
function multOf(c){ return c >= 10 ? 4 : c >= 6 ? 3 : c >= 3 ? 2 : 1; }

/* ══════════ 10. 게임 진행 ══════════ */
function clearRows(){
  for(var i=0;i<S.rows.length;i++){
    var el = S.rows[i].el;
    if(el && el.parentNode) el.parentNode.removeChild(el);
  }
  S.rows = [];
  S.target = 0;
  S.blocks = [];
  S.slots = [];
}
function startStage(stage, tier){
  var n = Math.max(1, Math.min(STAGES_TOTAL, stage || 1));
  var m = stageMeta(n);
  var t = (m.kind === "pat") ? Math.max(1, Math.min(3, tier || 1)) : 1;
  if(tierLocked(n, t)){
    try{ if(window.__ui) window.__ui.blocked(n, t); }catch(e){}
    return false;
  }
  S.mode = "play"; S.lock = false;
  S.stage = n; store.lastStage = n; S.tier = t; store.lastTier = t;
  S.goal = tierGoal(n, t); S.clears = 0; S.clearedIds = {};
  S.score = 0; S.combo = 0; S.maxCombo = 0; S.mult = 1;
  S.hearts = MAX_HEARTS;
  S.run++; S.q = []; S.lastId = 0;
  S.spawnT = 0; S.accel = 1; S.poolCap = 0;
  hideSheets();
  if(window.__ui) window.__ui.enterGame();
  clearRows();
  elSlots.className = "slots";
  renderSlots();
  layout();
  paintHearts(); paintScore(); paintCombo(); paintSpeed(); paintStage();
  save();
  if(m.kind === "inf")        setTimeout(function(){ toast("무한 모드 · 300문장 랜덤", true); }, 260);
  else if(m.kind === "final") setTimeout(function(){ toast("FINAL MIX · 패턴 1~30 총동원", true); }, 260);
  else if(m.kind === "mix")   setTimeout(function(){ toast("MIX " + m.mix + " · 패턴 1~" + m.to + " 총복습", true); }, 260);
  if(m.kind === "pat" && t > 1) setTimeout(function(){ toast(stageTagText(n, t) + " · 패턴 1~" + tierMixTo(n, t) + " 복습", true); }, 260);
  bgmStart();
  seedRows();
  S.spawnT = 0;
  freezePool();
  layout();
}
/* 시작할 때 이미 2~3줄이 쌓인 상태로 출발 — 아케이드 손맛 */
function seedRows(){
  var n = Math.min(2, Math.max(1, Math.floor(S.laneH / S.pitch) - 2), MAX_ROWS);
  var bottom = Math.round(S.laneH * 0.30);
  if(bottom > S.laneH - S.R - S.pitch) bottom = Math.max(0, S.laneH - S.R - S.pitch);
  var i, r;
  for(i=0;i<n;i++) spawnRow();
  for(i=0;i<S.rows.length;i++){
    r = S.rows[i];
    r.y = bottom - i*S.pitch;
    r.el.style.transform = "translate3d(0," + Math.round(r.y) + "px,0)";
  }
  paintRows();
}
function spawnRow(){
  if(S.rows.length >= MAX_ROWS) return null;
  var d = DATA[nextSentence()];
  var uid = ++S.uid;
  var el = document.createElement("div");
  el.className = "row";
  el.setAttribute("data-uid", String(uid));
  var glow = document.createElement("i");
  glow.className = "glow";
  var ko = document.createElement("span");
  ko.className = "ko";
  ko.textContent = d.ko;
  var bob = document.createElement("span");
  bob.className = "bob";
  bob.appendChild(ko);
  el.appendChild(glow);
  el.appendChild(bob);
  /* 등장 연출: 에너지가 모이며 캡슐이 나타난다(위치 transform과 분리된 scale 사용) */
  try{ el.style.animation = "rowIn .34s cubic-bezier(.2,.9,.25,1)"; }catch(e){}
  var cLen = (d.chunks && d.chunks.length) ? d.chunks.length : 3;
  var spd = cLen <= 2 ? 1.18 : (cLen >= 4 || (d.lv && d.lv >= 4)) ? 0.78 : 1.0;
  var row = { uid:uid, d:d, el:el, koEl:ko, y:-S.R, x:0, spd:spd, isBoss:(uid % 5 === 0), pool:null };
  applyRowSize(row);
  elLane.appendChild(el);
  var rw = el.offsetWidth || 180;
  var maxX = Math.max(0, (S.laneW || elLane.clientWidth || 340) - rw - 6);
  var lanes = [0.04, 0.94, 0.48, 0.16, 0.82];
  var ratio = lanes[(uid - 1) % lanes.length];
  row.x = Math.round(maxX * ratio);
  el.style.transform = "translate3d(" + row.x + "px," + (-S.R) + "px,0)";
  S.rows.push(row);
  if(!S.target) setTargetRow(row, true);
  paintRows();
  return row;
}
function removeRow(row){
  var i;
  for(i=0;i<S.rows.length;i++){
    if(S.rows[i].uid === row.uid){ S.rows.splice(i,1); return; }
  }
}
function boomRow(row){
  var el = row.el;
  el.className = "row boom";
  if(el.animate){
    try{
      el.animate([{opacity:1, transform:el.style.transform + " scale(1)"},
                  {opacity:0, transform:el.style.transform + " scale(1.14)"}],
        {duration:300, easing:"cubic-bezier(.2,.9,.3,1)", fill:"forwards"});
    }catch(e){}
  }
  setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 330);
}
function hitRow(row){
  S.lock = true;
  row.dead = true;         /* 이미 명중한 줄 — 바닥 충돌로 두 번 처리되지 않게 */
  var done = false;
  try{
    var urgency = Math.max(0, Math.min(1, (row.y + S.R) / Math.max(1, S.laneH)));
    var base = 100 + Math.round(urgency*140);
    S.combo++;
    if(S.combo > S.maxCombo) S.maxCombo = S.combo;
    S.mult = multOf(S.combo);
    var savedDanger = !!(row && S.laneH && (row.y + S.R >= S.laneH * 0.72));
    var gain = base * S.mult + (savedDanger ? 200 : 0);
    S.score += gain;
    S.clearedIds[String(row.d.id)] = 1;
    S.clears = countKeys(S.clearedIds);
    store.cleared[String(row.d.id)] = 1;
    if(S.score > store.best) store.best = S.score;
    if(S.maxCombo > store.bestCombo) store.bestCombo = S.maxCombo;
    paintScore(); paintCombo(); paintSpeed(); paintStage();
    /* 정답 조립 — 그 문장을 원어민 발음으로 한 번 들려준다(소리 꺼짐·음성 API 없음은 조용히 통과) */
    try{ if(typeof sayEn === "function" && store.voice !== false) sayEn(row.d.en); }catch(e){}

    var cx = (row.x || 0) + ((row.el && row.el.offsetWidth) ? row.el.offsetWidth/2 : S.laneW/2);
    var cy = row.y + S.R/2;
    var box = null;
    try{ box = row.el.getBoundingClientRect ? row.el.getBoundingClientRect() : null; }catch(e){ box = null; }
    try{ laserFromBar(box); }catch(e){}
    try{ sfxLaser(); }catch(e){}
    elSlots.className = "slots ok";
    var gainTxt = "+" + gain + (S.mult > 1 ? " ×" + S.mult : "");
    /* 빔이 닿는 순간 폭발 — 그 전에 줄이 사라지지 않게 살짝 늦춘다 */
    setTimeout(function(){
      try{ burst(cx, cy); if(S.mult >= 2) shakeScreen(S.mult >= 3 ? 2 : 1); }catch(e){}
      try{ floatText(savedDanger ? ("SAVE! +" + gain) : gainTxt, cx, cy); }catch(e){}
      try{ flash(); sfxPop(); }catch(e){}
      try{ boomRow(row); }catch(e){}
      removeRow(row);
      /* 화면에 줄이 0개가 되면 타겟이 없어져 단어판이 통째로 빈다 —
         다음 스폰 타이머를 기다리지 않고 바로 한 줄 채운다. */
      if(!done && S.mode === "play" && !S.rows.length){ try{ spawnRow(); }catch(e){} }
      setTargetRow(S.rows[0] || null);
      if(!done) S.lock = false;
    }, BLAST_MS);

    var healed = false;
    var boss = (S.clears > 0 && S.clears % 5 === 0);
    var bossHealed = false;
    if(S.combo % 5 === 0 && S.hearts < MAX_HEARTS){
      S.hearts++; healed = true;
    }
    if(boss && S.hearts < MAX_HEARTS){
      S.hearts++; bossHealed = true;
    } else if(boss){
      S.score += 150; paintScore();
    }
    if(healed || bossHealed) paintHearts(S.hearts);

    if(!done && !isInfStage(S.stage) && S.clears === S.goal - 2){
      setTimeout(function(){ if(S.mode === "play") toast("마지막 2문장 · 빨라져요!", true); }, 350);
    }
    if(bossHealed){
      try{ sfxCombo(); }catch(e){}
      try{ goldPulse(); heartPulse(); }catch(e){}
      toast("보스 처치! 하트 +1", true);
    } else if(S.combo % 5 === 0){
      try{ sfxCombo(); }catch(e){}
      try{ if(healed) heartPulse(); else goldPulse(); }catch(e){}
      toast(healed ? (S.combo + "콤보 · 하트 +1 회복!") : (S.combo + "콤보 · FEVER ×" + S.mult), true);
    } else if(boss){
      try{ sfxCombo(); }catch(e){}
      toast("보스 처치 · 보너스 +150점!", true);
    }
    save();
    done = !isInfStage(S.stage) && S.clears >= (S.goal || 1);
  } finally {
    setTimeout(function(){
      S.lock = false;
      if(done && S.mode === "play") stageClear();
    }, done ? 420 : BLAST_MS + 80);
  }
}
/* ── 어는 조각이 틀렸는지 알려주는 오답 피드백 ──
   담은 칩을 정답 문장과 앞에서부터 단어 단위로 대조해, 맞은 앞부분(.ok)은 남기고
   처음 어긋난 칩(.bad)부터 버린다. 그래서 틀린 조각만 골라 고쳐 쏘면 된다. */
function slotWordList(t){
  var w = norm(t).split(" "), out = [], i;
  for(i=0;i<w.length;i++) if(w[i]) out.push(w[i]);
  return out;
}
function matchPrefix(slots, en){
  var target = slotWordList(en), pos = 0, i, j, w;
  for(i=0;i<slots.length;i++){
    w = slotWordList(slots[i].t);
    if(!w.length) return i;
    for(j=0;j<w.length;j++){
      if(target[pos] !== w[j]) return i;
      pos++;
    }
  }
  return slots.length;
}
function wrongRow(row){
  S.lock = true;
  sfxBad(); shakeEl(row.el);
  if(row && !row.dead && S.laneH){
    row.y = Math.min(S.laneH - S.R - 6, row.y + Math.round(S.laneH * 0.10));
    if(row.el) row.el.style.transform = "translate3d(" + Math.round(row.x || 0) + "px," + Math.round(row.y) + "px,0)";
  }
  S.combo = 0; S.mult = 1; S.accel = 1;
  paintCombo(); paintSpeed();
  var keep = matchPrefix(S.slots, row.d ? row.d.en : "");
  var kids = elSlots.children || [], i, el;
  elSlots.className = "slots check";
  for(i=0;i<kids.length;i++){
    el = kids[i];
    if(!el.classList) continue;
    if(i < keep) el.classList.add("ok");
    else if(i === keep) el.classList.add("bad");
    else el.classList.add("na");
  }
  if(keep >= S.slots.length){
    elBuilt.innerHTML = '<span class="hintIn ok">여기까지 맞아요</span> · 빠진 단어가 있어요';
    toast("빠진 단어가 있어요");
  } else if(keep === 0){
    elBuilt.innerHTML = '<span class="hintIn bad">첫 단어</span>부터 다시 골라요';
    toast("첫 단어부터 달라요");
  } else {
    elBuilt.innerHTML = '<span class="hintIn ok">' + keep + '개 맞음</span> · <span class="hintIn bad">' +
      esc(S.slots[keep].t) + '</span>부터 달라요';
    toast("빨간 단어부터 고쳐요");
  }
  setTimeout(function(){
    if(S.mode !== "play") return;
    if(keep < S.slots.length) S.slots = S.slots.slice(0, keep);   /* 맞은 앞부분만 남긴다 */
    elSlots.className = "slots";
    renderSlots();
    /* 남긴 조각은 초록으로 유지 — 다음 탭까지 어디까지 맞았는지 보인다 */
    var kids2 = elSlots.children || [], k2;
    for(k2=0;k2<kids2.length;k2++) if(kids2[k2].classList && k2 < keep) kids2[k2].classList.add("ok");
    if(keep > 0) elBuilt.innerHTML = '<span class="hintIn ok">' + keep + '개 맞음</span> · 이어서 골라요';
    renderPoolUsed();      /* 방금 쓴 단어 블록을 다시 고를 수 있게 used 해제 */
    S.lock = false;
  }, 900);
}
function crashRow(row){
  if(row && row.dead) return;
  S.hearts--; paintHearts();
  S.combo = 0; S.mult = 1; S.accel = 1;
  paintCombo(); paintSpeed();
  sfxBad();
  try{ shakeScreen(2); }catch(e){}
  var cx = S.laneW/2, cy = row.y + S.R/2;
  floatText("바닥", cx, cy, true);
  toast("줄이 바닥에 닿았어요 · 하트 -1");
  boomRow(row);
  removeRow(row);
  requeue(row.d);
  if(S.target === row.uid) setTargetRow(S.rows[0] || null);
  if(S.hearts <= 0){
    S.lock = true;
    var lostRow = row;                     /* 어느 문장에서 끝났는지 결과 화면으로 넘긴다 */
    setTimeout(function(){ endRun("over", lostRow); }, 420);
  }
}
function slotHas(i){
  for(var k=0;k<S.slots.length;k++) if(S.slots[k].i === i) return true;
  return false;
}
function tapBlock(i){
  if(S.mode !== "play" || S.lock) return;
  var row = targetRow();
  if(!row || !S.blocks.length || i < 0 || i >= S.blocks.length) return;
  if(S.slots.length >= SLOT_MAX){ toast("칩은 7개까지 담을 수 있어요"); return; }
  if(slotHas(i)) return;
  S.slots.push({ i:i, t:S.blocks[i] });
  var el = S.blockEls[i];
  if(el && el.classList) el.classList.add("used");
  sfxTap(S.slots.length);
  renderSlots();
}
function removeSlot(pos){
  if(S.mode !== "play" || S.lock) return;
  if(S.slots.length <= pos) return;
  S.slots.splice(pos, 1);
  beep(420, 0.05, "sine", 0.035, 320);
  renderSlots();
  renderPoolUsed();
}
function renderPoolUsed(){
  for(var i=0;i<S.blockEls.length;i++){
    var el = S.blockEls[i];
    if(!el || !el.classList) continue;
    if(slotHas(i)) el.classList.add("used");
    else el.classList.remove("used");
  }
}
/* [발사] — 유저가 직접 눌러야만 판정한다 */
function fire(){
  if(S.mode !== "play" || S.lock) return false;
  var row = targetRow();
  if(!row) return false;
  if(!S.slots.length){ toast("블록을 담아주세요"); beep(300, 0.08, "sine", 0.03); return false; }
  /* 청크 개수·배열이 아니라 '담은 청크를 이어 붙인 문장'과 정답 문장을 비교한다.
     예: ["I'm here to", "check in"] → "I'm here to check in" = 정답 문장 → 통과 */
  var made = [], i;
  for(i=0;i<S.slots.length;i++) made.push(S.slots[i].t);
  if(sameSentence(made, row.d.en)){ hitRow(row); return true; }
  for(i=0;i<S.rows.length;i++){
    var r = S.rows[i];
    if(r && !r.dead && sameSentence(made, r.d.en)){ hitRow(r); return true; }
  }
  wrongRow(row);
  return false;
}
function selectTarget(uid){
  if(S.mode !== "play" || S.lock) return;
  for(var i=0;i<S.rows.length;i++){
    if(S.rows[i].uid === uid){
      if(S.rows[i].uid === S.target) return;
      setTargetRow(S.rows[i]);
      beep(760, 0.06, "sine", 0.04, 900);
      return;
    }
  }
}
function clearSlots(){
  if(S.mode !== "play" || S.lock) return;
  S.slots = [];
  elSlots.className = "slots";
  renderSlots();
  renderPoolUsed();
  beep(360, 0.06, "sine", 0.04, 260);
}

/* ══════════ 11. 종료 ══════════ */
function recordStage(){
  var m = stageMeta(S.stage);
  var k = (m.kind === "pat") ? tierKey(S.stage, S.tier || 1) : String(S.stage);
  if(S.score > (+store.stageBest[k] || 0)) store.stageBest[k] = S.score;
  if(S.score > store.best) store.best = S.score;
  if(S.maxCombo > store.bestCombo) store.bestCombo = S.maxCombo;
  if(!store.stageCombo) store.stageCombo = {};
  if(!store.stageStars) store.stageStars = {};
  if(S.maxCombo > (+store.stageCombo[k] || 0)) store.stageCombo[k] = S.maxCombo;
  if(!isInfStage(S.stage)){
    if(S.clears >= (S.goal || 1)){
      store.stageDone[k] = 1;
      if(m.kind !== "pat"){   /* 패턴 스테이지의 별은 '깬 단계 수'로 센다 */
        var st = Math.max(1, Math.min(3, S.hearts || 1));
        if(st > (+store.stageStars[k] || 0)) store.stageStars[k] = st;
      }
    }
    var pr = Math.min(1, (S.clears || 0) / (S.goal || 1));
    if(!(store.stageProg[k] >= pr)) store.stageProg[k] = pr;
    if(!store.stageProgN) store.stageProgN = {};
    var sPr = Math.min(S.goal || 0, S.clears || 0);   /* 이 단계에서 가장 멀리 간 문장 수 */
    if(!(store.stageProgN[k] >= sPr)) store.stageProgN[k] = sPr;
  }
}
function stageClear(){
  S.mode = "over"; S.lock = true;
  bgmStop();
  var wasNew = !tierDone(S.stage, S.tier || 1);
  recordStage();
  save();
  sfxCombo();
  paintStars(stageMeta(S.stage).kind === "pat" ? (S.tier || 1) : S.hearts);
  if(S.stage >= LAST_LEVEL){
    $("clearTitle").textContent = "모든 레벨 완료!";
    $("clearLead").textContent = "이제 무한 모드가 열렸어요";
  } else {
    $("clearTitle").textContent = btnLabel(S.stage, S.tier || 1) + " 클리어!";
    $("clearLead").textContent = "다음 레벨이 열렸어요";
  }
  $("clScore").textContent = String(S.score);
  $("clCombo").textContent = String(S.maxCombo);
  if($("clGoal")) $("clGoal").textContent = S.clears + "/" + S.goal;
  $("clNew").innerHTML = wasNew ? '<div class="new">첫 완료</div>' : "";
  var nx2 = nextStageTier(S.stage, S.tier || 1);
  var nb = $("btnNextStage");
  setBtn(nb, ICON.rocket, btnLabel(nx2.n, nx2.t) + " 시작");
  nb.setAttribute("data-next", String(nx2.n));
  nb.setAttribute("data-tier", String(nx2.t));
  show(elSheetClear);
  if(window.__ui) window.__ui.afterRun();
  try{
    var w = window.pickle && window.pickle.widget;
    if(w && w.signal) w.signal("영어 타임어택: " + btnLabel(S.stage, S.tier || 1) + " 클리어 · " + S.score + "점");
  }catch(e){}
}
function endRun(kind, lostRow){
  if(S.mode === "over") return;
  S.mode = "over"; S.lock = true;
  bgmStop();
  var inf = isInfStage(S.stage), rec = false;
  if(inf){
    if(S.clears > (+store.bestSurv || 0)){ store.bestSurv = S.clears; rec = true; }
    if(S.score > (+store.stageBest[String(S.stage)] || 0)) store.stageBest[String(S.stage)] = S.score;
    if(S.score > store.best) store.best = S.score;
    if(S.maxCombo > store.bestCombo) store.bestCombo = S.maxCombo;
  } else {
    recordStage();
    rec = S.score > 0 && S.score >= store.best;
  }
  save();
  sfxOver();
  $("overTitle").textContent = inf ? "무한전 종료" : "게임 오버";
  $("overLead").textContent = inf
    ? ("생존 " + S.clears + "문장 · 최고 " + store.bestSurv + "문장")
    : "여기까지예요. 바로 다시 갈 수 있어요.";
  $("ovScore").textContent = String(S.score);
  $("ovCombo").textContent = String(S.maxCombo);
  var kOv = (stageMeta(S.stage).kind === "pat") ? tierKey(S.stage, S.tier || 1) : String(S.stage);
  var ovBest = inf ? 0 : (+(store.stageBest && store.stageBest[kOv]) || 0);
  $("ovCleared").textContent = inf ? ("생존 " + S.clears) : ovBest.toLocaleString();
  if($("ovBestLbl")) $("ovBestLbl").textContent = inf ? "생존" : "최고 점수";
  /* 어디까지 갔는지 · 어느 문장에서 놓쳤는지 */
  if($("ovBar")) $("ovBar").style.width = inf ? "100%" : (Math.round(Math.min(1, (S.clears || 0) / Math.max(1, S.goal || 1)) * 100) + "%");
  if($("ovGoalTxt")) $("ovGoalTxt").textContent = inf ? ("생존 " + S.clears + "문장") : ((S.clears || 0) + " / " + (S.goal || 0) + "문장");
  var mb = $("ovMissed");
  if(mb){
    if(lostRow && lostRow.d){
      mb.innerHTML = '<em>놓친 문장</em><b>' + esc(lostRow.d.ko) + '</b><i>' + esc(lostRow.d.en) + '</i>';
      show(mb);
    } else {
      mb.innerHTML = "";
      hide(mb);
    }
  }
  $("newRec").innerHTML = rec ? ('<div class="new">' + (inf ? "NEW SURVIVAL" : "NEW RECORD") + "</div>") : "";
  show(elSheetOver);
  if(window.__ui) window.__ui.afterRun();
  try{
    var w = window.pickle && window.pickle.widget;
    if(w && w.signal) w.signal("영어 타임어택: " + btnLabel(S.stage, S.tier || 1) + " · " + S.clears + "/" + (inf ? "∞" : S.goal) + " · " + S.score + "점");
  }catch(e){}
}

