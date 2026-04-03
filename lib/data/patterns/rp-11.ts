import type { PatternSet } from "@/lib/types/patterns";

export const rp11Patterns: PatternSet = {
  questionType: "rp_11",
  label: "질문하기",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "전화를 걸며 자연스럽게 인사하고 용건을 밝히는 시작 문장들",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "rp11_1_01",
          template:
            "Hi, I'm calling because I have a question about [주제].",
          translation:
            "안녕하세요, [주제]에 대해 질문이 있어서 전화 드렸어요.",
          examples: [
            {
              topic: "공연",
              sentence:
                "Hi, I'm calling because I have a question about concert tickets.",
              highlight: "concert tickets",
            },
            {
              topic: "호텔",
              sentence:
                "Hi, I'm calling because I have a question about room availability.",
              highlight: "room availability",
            },
            {
              topic: "렌터카",
              sentence:
                "Hi, I'm calling because I have a question about car rental rates.",
              highlight: "car rental rates",
            },
          ],
        },
        {
          id: "rp11_1_02",
          template:
            "Hello, I'd like to ask about [주제]. Do you have a moment?",
          translation:
            "안녕하세요, [주제]에 대해 여쭤보고 싶은데요. 잠깐 시간 되실까요?",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "Hello, I'd like to ask about gym membership. Do you have a moment?",
              highlight: "gym membership",
            },
            {
              topic: "병원예약",
              sentence:
                "Hello, I'd like to ask about making an appointment. Do you have a moment?",
              highlight: "making an appointment",
            },
            {
              topic: "기차표",
              sentence:
                "Hello, I'd like to ask about train schedules. Do you have a moment?",
              highlight: "train schedules",
            },
          ],
        },
        {
          id: "rp11_1_03",
          template:
            "Hi there, I saw your [광고/웹사이트] and I have a few questions about [주제].",
          translation:
            "안녕하세요, [광고/웹사이트]를 보고 [주제]에 대해 몇 가지 질문이 있어요.",
          examples: [
            {
              topic: "가구",
              sentence:
                "Hi there, I saw your ad and I have a few questions about the sofa set.",
              highlight: "the sofa set",
            },
            {
              topic: "여행(공항)",
              sentence:
                "Hi there, I saw your website and I have a few questions about flight schedules.",
              highlight: "flight schedules",
            },
            {
              topic: "상점문의",
              sentence:
                "Hi there, I saw your flyer and I have a few questions about your store hours.",
              highlight: "your store hours",
            },
          ],
        },
        {
          id: "rp11_1_04",
          template:
            "Good morning/afternoon. I'm interested in [주제] and would like to get some information.",
          translation:
            "좋은 아침/오후예요. [주제]에 관심이 있어서 정보를 좀 얻고 싶어요.",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "Good morning. I'm interested in your domestic tour packages and would like to get some information.",
              highlight: "your domestic tour packages",
            },
            {
              topic: "미용실",
              sentence:
                "Good afternoon. I'm interested in hair treatment services and would like to get some information.",
              highlight: "hair treatment services",
            },
            {
              topic: "약국",
              sentence:
                "Good morning. I'm interested in over-the-counter vitamins and would like to get some information.",
              highlight: "over-the-counter vitamins",
            },
          ],
        },
        {
          id: "rp11_1_05",
          template:
            "Hi, my name is [이름] and I'm calling to inquire about [주제].",
          translation:
            "안녕하세요, 저는 [이름]이고 [주제]에 대해 문의하려고 전화했어요.",
          examples: [
            {
              topic: "예약",
              sentence:
                "Hi, my name is Minjun and I'm calling to inquire about restaurant reservations.",
              highlight: "restaurant reservations",
            },
            {
              topic: "자전거",
              sentence:
                "Hi, my name is Minjun and I'm calling to inquire about bike rentals.",
              highlight: "bike rentals",
            },
            {
              topic: "은행",
              sentence:
                "Hi, my name is Minjun and I'm calling to inquire about opening a savings account.",
              highlight: "opening a savings account",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "구체적인 정보를 요청하는 핵심 질문 패턴들 — 가격, 시간, 장소, 방법 등을 묻는 문장",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "rp11_2_01",
          template: "Could you tell me how much [주제] costs?",
          translation: "[주제]가 얼마인지 알려주실 수 있나요?",
          examples: [
            {
              topic: "공연",
              sentence:
                "Could you tell me how much a concert ticket costs?",
              highlight: "a concert ticket",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Could you tell me how much the monthly membership costs?",
              highlight: "the monthly membership",
            },
            {
              topic: "렌터카",
              sentence:
                "Could you tell me how much a weekend rental costs?",
              highlight: "a weekend rental",
            },
          ],
        },
        {
          id: "rp11_2_02",
          template: "What time does [대상] start/open?",
          translation: "[대상]이 몇 시에 시작하나요/여나요?",
          examples: [
            {
              topic: "영화",
              sentence: "What time does the evening showing start?",
              highlight: "the evening showing",
            },
            {
              topic: "상점문의",
              sentence: "What time does the store open on weekends?",
              highlight: "the store",
            },
            {
              topic: "약국",
              sentence: "What time does the pharmacy open?",
              highlight: "the pharmacy",
            },
          ],
        },
        {
          id: "rp11_2_03",
          template:
            "Is it possible to [동사]? I'd really appreciate it.",
          translation:
            "[~하는 것]이 가능한가요? 정말 감사하겠습니다.",
          examples: [
            {
              topic: "호텔",
              sentence:
                "Is it possible to book a room for this weekend? I'd really appreciate it.",
              highlight: "book a room for this weekend",
            },
            {
              topic: "병원예약",
              sentence:
                "Is it possible to move my appointment to next Monday? I'd really appreciate it.",
              highlight: "move my appointment to next Monday",
            },
            {
              topic: "기차표",
              sentence:
                "Is it possible to change the departure time? I'd really appreciate it.",
              highlight: "change the departure time",
            },
          ],
        },
        {
          id: "rp11_2_04",
          template:
            "I was wondering if you could tell me about [주제].",
          translation:
            "[주제]에 대해 알려주실 수 있는지 궁금합니다.",
          examples: [
            {
              topic: "여행(공항)",
              sentence:
                "I was wondering if you could tell me about baggage allowance.",
              highlight: "baggage allowance",
            },
            {
              topic: "부동산",
              sentence:
                "I was wondering if you could tell me about available apartments in the area.",
              highlight: "available apartments in the area",
            },
            {
              topic: "미용실",
              sentence:
                "I was wondering if you could tell me about your pricing for hair coloring.",
              highlight: "your pricing for hair coloring",
            },
          ],
        },
        {
          id: "rp11_2_05",
          template: "Do you have any [명사] available?",
          translation: "이용 가능한 [명사]가 있나요?",
          examples: [
            {
              topic: "호텔",
              sentence:
                "Do you have any rooms available for next Friday?",
              highlight: "rooms available for next Friday",
            },
            {
              topic: "공연",
              sentence:
                "Do you have any seats available in the front row?",
              highlight: "seats available in the front row",
            },
            {
              topic: "렌터카",
              sentence:
                "Do you have any SUVs available for rent this weekend?",
              highlight: "SUVs available for rent this weekend",
            },
          ],
        },
        {
          id: "rp11_2_06",
          template:
            "How long does it take to [동사]?",
          translation: "[~하는 데] 얼마나 걸리나요?",
          examples: [
            {
              topic: "여행(공항)",
              sentence: "How long does it take to get to the airport by bus?",
              highlight: "get to the airport by bus",
            },
            {
              topic: "은행",
              sentence: "How long does it take to open a new account?",
              highlight: "open a new account",
            },
            {
              topic: "병원",
              sentence:
                "How long does it take to get the test results?",
              highlight: "get the test results",
            },
          ],
        },
        {
          id: "rp11_2_07",
          template: "Can you explain what's included in [명사]?",
          translation: "[명사]에 뭐가 포함되어 있는지 설명해주실 수 있나요?",
          examples: [
            {
              topic: "해외여행",
              sentence:
                "Can you explain what's included in the travel package?",
              highlight: "the travel package",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Can you explain what's included in the premium membership?",
              highlight: "the premium membership",
            },
            {
              topic: "음식점",
              sentence:
                "Can you explain what's included in the lunch set?",
              highlight: "the lunch set",
            },
          ],
        },
        {
          id: "rp11_2_08",
          template:
            "Are there any special requirements for [주제]?",
          translation: "[주제]에 대한 특별한 요구사항이 있나요?",
          examples: [
            {
              topic: "기차표",
              sentence:
                "Are there any special requirements for booking a reserved seat?",
              highlight: "booking a reserved seat",
            },
            {
              topic: "예약",
              sentence:
                "Are there any special requirements for booking a private room?",
              highlight: "booking a private room",
            },
            {
              topic: "병원예약",
              sentence:
                "Are there any special requirements for a first-time visit?",
              highlight: "a first-time visit",
            },
          ],
        },
        {
          id: "rp11_2_09",
          template:
            "What kind of [명사] do you offer/have?",
          translation: "어떤 종류의 [명사]를 제공하시나요/가지고 계신가요?",
          examples: [
            {
              topic: "음식점",
              sentence: "What kind of menu options do you have?",
              highlight: "menu options",
            },
            {
              topic: "가전제품",
              sentence: "What kind of warranty plans do you offer?",
              highlight: "warranty plans",
            },
            {
              topic: "상점문의",
              sentence: "What kind of delivery services do you offer?",
              highlight: "delivery services",
            },
          ],
        },
        {
          id: "rp11_2_10",
          template:
            "Would it be okay if I [동사]? I just want to make sure.",
          translation:
            "제가 [~해도] 괜찮을까요? 확인하고 싶어서요.",
          examples: [
            {
              topic: "호텔",
              sentence:
                "Would it be okay if I check in a bit early? I just want to make sure.",
              highlight: "check in a bit early",
            },
            {
              topic: "음식점",
              sentence:
                "Would it be okay if I bring my own cake? I just want to make sure.",
              highlight: "bring my own cake",
            },
            {
              topic: "공연",
              sentence:
                "Would it be okay if I bring a small child? I just want to make sure.",
              highlight: "bring a small child",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "상대방의 답변에 자연스럽게 반응하고, 추가 질문을 이어가는 문장들",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "rp11_3_01",
          template:
            "That sounds great! One more thing — could you also tell me about [추가 주제]?",
          translation:
            "좋네요! 한 가지 더 — [추가 주제]에 대해서도 알려주실 수 있나요?",
          examples: [
            {
              topic: "공연",
              sentence:
                "That sounds great! One more thing — could you also tell me about the seating arrangement?",
              highlight: "the seating arrangement",
            },
            {
              topic: "호텔",
              sentence:
                "That sounds great! One more thing — could you also tell me about breakfast options?",
              highlight: "breakfast options",
            },
            {
              topic: "렌터카",
              sentence:
                "That sounds great! One more thing — could you also tell me about the insurance policy?",
              highlight: "the insurance policy",
            },
          ],
        },
        {
          id: "rp11_3_02",
          template:
            "Oh, that's good to know. By the way, is there a [명사] nearby?",
          translation:
            "오, 그건 알아두면 좋겠네요. 그런데 근처에 [명사]가 있나요?",
          examples: [
            {
              topic: "영화",
              sentence:
                "Oh, that's good to know. By the way, is there a parking lot nearby?",
              highlight: "a parking lot",
            },
            {
              topic: "호텔",
              sentence:
                "Oh, that's good to know. By the way, is there a convenience store nearby?",
              highlight: "a convenience store",
            },
            {
              topic: "병원",
              sentence:
                "Oh, that's good to know. By the way, is there a pharmacy nearby?",
              highlight: "a pharmacy",
            },
          ],
        },
        {
          id: "rp11_3_03",
          template:
            "That would be perfect. I was also wondering if [추가 질문].",
          translation:
            "그거 딱 좋겠네요. [추가 질문]도 궁금한데요.",
          examples: [
            {
              topic: "해외여행",
              sentence:
                "That would be perfect. I was also wondering if you provide a tour guide.",
              highlight: "you provide a tour guide",
            },
            {
              topic: "헬스클럽",
              sentence:
                "That would be perfect. I was also wondering if there's a free trial period.",
              highlight: "there's a free trial period",
            },
            {
              topic: "렌터카",
              sentence:
                "That would be perfect. I was also wondering if insurance is included.",
              highlight: "insurance is included",
            },
          ],
        },
        {
          id: "rp11_3_04",
          template:
            "I see. That's really helpful. Could I also ask about [추가 주제]?",
          translation:
            "알겠습니다. 정말 도움이 되네요. [추가 주제]에 대해서도 여쭤봐도 될까요?",
          examples: [
            {
              topic: "은행",
              sentence:
                "I see. That's really helpful. Could I also ask about payment methods?",
              highlight: "payment methods",
            },
            {
              topic: "기차표",
              sentence:
                "I see. That's really helpful. Could I also ask about the cancellation policy?",
              highlight: "the cancellation policy",
            },
            {
              topic: "공연",
              sentence:
                "I see. That's really helpful. Could I also ask about group discounts?",
              highlight: "group discounts",
            },
          ],
        },
        {
          id: "rp11_3_05",
          template:
            "Wow, that's better than I expected! I'm really interested now.",
          translation:
            "와, 기대했던 것보다 좋네요! 이제 진짜 관심이 생겨요.",
          examples: [
            {
              topic: "호텔",
              sentence:
                "Wow, that's cheaper than I expected! I'm really interested now.",
              highlight: "cheaper than I expected",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Wow, that's more convenient than I expected! I'm really interested now.",
              highlight: "more convenient than I expected",
            },
            {
              topic: "부동산",
              sentence:
                "Wow, that's bigger than I expected! I'm really interested now.",
              highlight: "bigger than I expected",
            },
          ],
        },
        {
          id: "rp11_3_06",
          template:
            "Actually, I have one more question. What happens if [상황]?",
          translation:
            "사실 질문이 하나 더 있어요. 만약 [상황]이면 어떻게 되나요?",
          examples: [
            {
              topic: "예약",
              sentence:
                "Actually, I have one more question. What happens if I need to cancel?",
              highlight: "I need to cancel",
            },
            {
              topic: "호텔(날씨)",
              sentence:
                "Actually, I have one more question. What happens if it rains that day?",
              highlight: "it rains that day",
            },
            {
              topic: "병원예약",
              sentence:
                "Actually, I have one more question. What happens if I arrive late?",
              highlight: "I arrive late",
            },
          ],
        },
        {
          id: "rp11_3_07",
          template:
            "Oh really? That's exactly what I was looking for.",
          translation:
            "정말요? 그게 딱 제가 찾고 있던 거예요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "Oh really? A beginner class on weekends — that's exactly what I was looking for.",
              highlight: "A beginner class on weekends",
            },
            {
              topic: "호텔",
              sentence:
                "Oh really? A room with an ocean view — that's exactly what I was looking for.",
              highlight: "A room with an ocean view",
            },
            {
              topic: "음식점",
              sentence:
                "Oh really? A private dining room — that's exactly what I was looking for.",
              highlight: "A private dining room",
            },
          ],
        },
        {
          id: "rp11_3_08",
          template:
            "I appreciate the information. Just to confirm, [확인 내용], right?",
          translation:
            "정보 감사합니다. 확인만 할게요, [확인 내용] 맞죠?",
          examples: [
            {
              topic: "공연",
              sentence:
                "I appreciate the information. Just to confirm, it starts at 7 PM, right?",
              highlight: "it starts at 7 PM",
            },
            {
              topic: "병원",
              sentence:
                "I appreciate the information. Just to confirm, it's on the 3rd floor, right?",
              highlight: "it's on the 3rd floor",
            },
            {
              topic: "여행(공항)",
              sentence:
                "I appreciate the information. Just to confirm, it's 50 dollars per person, right?",
              highlight: "it's 50 dollars per person",
            },
          ],
        },
        {
          id: "rp11_3_09",
          template:
            "That's very reasonable. I think I'll go ahead and [동사].",
          translation:
            "그거 아주 합리적이네요. [~하려고] 해요.",
          examples: [
            {
              topic: "예약",
              sentence:
                "That's very reasonable. I think I'll go ahead and make a reservation.",
              highlight: "make a reservation",
            },
            {
              topic: "헬스클럽",
              sentence:
                "That's very reasonable. I think I'll go ahead and sign up.",
              highlight: "sign up",
            },
            {
              topic: "공연",
              sentence:
                "That's very reasonable. I think I'll go ahead and buy two tickets.",
              highlight: "buy two tickets",
            },
          ],
        },
        {
          id: "rp11_3_10",
          template:
            "That makes sense. Can I also check if [추가 확인]?",
          translation:
            "그렇군요. [추가 확인]도 확인할 수 있을까요?",
          examples: [
            {
              topic: "호텔",
              sentence:
                "That makes sense. Can I also check if there's shuttle service?",
              highlight: "there's shuttle service",
            },
            {
              topic: "음식점",
              sentence:
                "That makes sense. Can I also check if you have vegetarian options?",
              highlight: "you have vegetarian options",
            },
            {
              topic: "영화",
              sentence:
                "That makes sense. Can I also check if students get a discount?",
              highlight: "students get a discount",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "감사를 표현하며 전화를 자연스럽게 마무리하는 문장들",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "rp11_4_01",
          template:
            "Thank you so much for all the information. You've been really helpful.",
          translation:
            "모든 정보 정말 감사합니다. 큰 도움이 되었어요.",
          examples: [
            {
              topic: "공연",
              sentence:
                "Thank you so much for all the information about the concert. You've been really helpful.",
              highlight: "the concert",
            },
            {
              topic: "해외여행",
              sentence:
                "Thank you so much for all the information about the tour. You've been really helpful.",
              highlight: "the tour",
            },
            {
              topic: "병원예약",
              sentence:
                "Thank you so much for all the information about the appointment. You've been really helpful.",
              highlight: "the appointment",
            },
          ],
        },
        {
          id: "rp11_4_02",
          template:
            "I really appreciate your help. I'll definitely consider [주제].",
          translation:
            "도움 정말 감사해요. [주제]를 꼭 고려해볼게요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "I really appreciate your help. I'll definitely consider signing up for the membership.",
              highlight: "signing up for the membership",
            },
            {
              topic: "국내여행",
              sentence:
                "I really appreciate your help. I'll definitely consider booking the tour.",
              highlight: "booking the tour",
            },
            {
              topic: "미용실",
              sentence:
                "I really appreciate your help. I'll definitely consider trying the new treatment.",
              highlight: "trying the new treatment",
            },
          ],
        },
        {
          id: "rp11_4_03",
          template:
            "Thanks for your time. I'll call back if I have more questions.",
          translation:
            "시간 내주셔서 감사해요. 질문이 더 있으면 다시 전화할게요.",
          examples: [
            {
              topic: "호텔",
              sentence:
                "Thanks for your time. I'll call back once I decide on the dates.",
              highlight: "I decide on the dates",
            },
            {
              topic: "가전제품",
              sentence:
                "Thanks for your time. I'll call back after I check the warranty.",
              highlight: "I check the warranty",
            },
            {
              topic: "예약",
              sentence:
                "Thanks for your time. I'll call back to confirm the reservation.",
              highlight: "confirm the reservation",
            },
          ],
        },
        {
          id: "rp11_4_04",
          template:
            "You've answered all my questions. Thanks again for your help!",
          translation:
            "궁금했던 거 다 답변해주셨어요. 도움 주셔서 다시 한번 감사합니다!",
          examples: [
            {
              topic: "공연",
              sentence:
                "You've answered all my questions about the show. Thanks again for your help!",
              highlight: "the show",
            },
            {
              topic: "렌터카",
              sentence:
                "You've answered all my questions about the rental. Thanks again for your help!",
              highlight: "the rental",
            },
            {
              topic: "약국",
              sentence:
                "You've answered all my questions about the medication. Thanks again for your help!",
              highlight: "the medication",
            },
          ],
        },
        {
          id: "rp11_4_05",
          template:
            "Great, I think I have all the information I need. Have a nice day!",
          translation:
            "좋아요, 필요한 정보는 다 얻은 것 같아요. 좋은 하루 보내세요!",
          examples: [
            {
              topic: "예약",
              sentence:
                "Great, I think I have all the information I need to make a reservation. Have a nice day!",
              highlight: "make a reservation",
            },
            {
              topic: "쇼핑",
              sentence:
                "Great, I think I have all the information I need to place an order. Have a nice day!",
              highlight: "place an order",
            },
            {
              topic: "은행",
              sentence:
                "Great, I think I have all the information I need to open an account. Have a nice day!",
              highlight: "open an account",
            },
          ],
        },
      ],
    },
  ],
};
