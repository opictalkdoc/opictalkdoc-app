import type { PatternSet } from "@/lib/types/patterns";

export const pastSpecialPatterns: PatternSet = {
  questionType: "past_special",
  label: "경험·특별",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "기억에 남는 특별한 경험을 소개하며 시작하는 패턴",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "pspc_1_01",
          template:
            "One of the most memorable experiences I've ever had was when I [동사].",
          translation:
            "제가 겪었던 가장 기억에 남는 경험 중 하나는 [~]했을 때예요.",
          examples: [
            {
              topic: "해외여행",
              sentence:
                "One of the most memorable experiences I've ever had was when I traveled to Japan.",
              highlight: "traveled to Japan",
            },
            {
              topic: "공연",
              sentence:
                "One of the most memorable experiences I've ever had was when I went to a live concert.",
              highlight: "went to a live concert",
            },
            {
              topic: "회사면접",
              sentence:
                "One of the most memorable experiences I've ever had was when I got my first job offer.",
              highlight: "got my first job offer",
            },
          ],
        },
        {
          id: "pspc_1_02",
          template:
            "I'll never forget the time when I [동사]. It was truly special.",
          translation:
            "[~]했을 때를 절대 잊지 못할 거예요. 정말 특별했거든요.",
          examples: [
            {
              topic: "생일파티",
              sentence:
                "I'll never forget the time when I threw a surprise party for my friend. It was truly special.",
              highlight: "threw a surprise party for my friend",
            },
            {
              topic: "직장",
              sentence:
                "I'll never forget the time when I got promoted at work. It was truly special.",
              highlight: "got promoted at work",
            },
            {
              topic: "해외여행",
              sentence:
                "I'll never forget the time when I saw the Northern Lights. It was truly special.",
              highlight: "saw the Northern Lights",
            },
          ],
        },
        {
          id: "pspc_1_03",
          template:
            "I remember one time when something really [형용사] happened to me.",
          translation:
            "정말 [놀라운/재미있는] 일이 저한테 있었던 적이 있어요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "I remember one time when something really surprising happened to me during a trip.",
              highlight: "surprising",
            },
            {
              topic: "모임",
              sentence:
                "I remember one time when something really funny happened to me at a gathering.",
              highlight: "funny",
            },
            {
              topic: "공연",
              sentence:
                "I remember one time when something really touching happened to me at a show.",
              highlight: "touching",
            },
          ],
        },
        {
          id: "pspc_1_04",
          template:
            "There was this one experience that completely changed the way I think about [주제].",
          translation:
            "[주제]에 대한 제 생각을 완전히 바꿔놓은 경험이 하나 있었어요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "There was this one experience that completely changed the way I think about traveling.",
              highlight: "traveling",
            },
            {
              topic: "건강",
              sentence:
                "There was this one experience that completely changed the way I think about health.",
              highlight: "health",
            },
            {
              topic: "외국 국가",
              sentence:
                "There was this one experience that completely changed the way I think about foreign cultures.",
              highlight: "foreign cultures",
            },
          ],
        },
        {
          id: "pspc_1_05",
          template:
            "If I had to pick the most unforgettable moment related to [주제], it would definitely be [사건].",
          translation:
            "[주제]와 관련해서 가장 잊을 수 없는 순간을 꼽으라면, 단연 [사건]이에요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "If I had to pick the most unforgettable moment related to fitness, it would definitely be finishing my first marathon.",
              highlight: "finishing my first marathon",
            },
            {
              topic: "음악",
              sentence:
                "If I had to pick the most unforgettable moment related to music, it would definitely be my first live performance.",
              highlight: "my first live performance",
            },
            {
              topic: "직장",
              sentence:
                "If I had to pick the most unforgettable moment related to work, it would definitely be my first big presentation.",
              highlight: "my first big presentation",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "그때 무슨 일이 있었는지 구체적으로 묘사하는 패턴",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "pspc_2_01",
          template:
            "It happened when I was [나이/상황], and I was with [사람].",
          translation:
            "그건 제가 [나이/상황]일 때 있었던 일이고, [사람]과 함께였어요.",
          examples: [
            {
              topic: "해외여행",
              sentence:
                "It happened when I was on vacation abroad, and I was with my family.",
              highlight: "on vacation abroad, ... my family",
            },
            {
              topic: "직장",
              sentence:
                "It happened when I was a new employee, and I was with my team.",
              highlight: "a new employee, ... my team",
            },
            {
              topic: "모임",
              sentence:
                "It happened when I was at a friends' gathering, and I was with my old classmates.",
              highlight: "at a friends' gathering, ... my old classmates",
            },
          ],
        },
        {
          id: "pspc_2_02",
          template:
            "At first, everything seemed normal, but then [사건] happened.",
          translation:
            "처음에는 다 평범해 보였는데, 그런데 [사건]이 일어났어요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "At first, everything seemed normal, but then we got lost in the middle of nowhere.",
              highlight: "we got lost in the middle of nowhere",
            },
            {
              topic: "날씨",
              sentence:
                "At first, everything seemed normal, but then a huge storm hit.",
              highlight: "a huge storm hit",
            },
            {
              topic: "파티",
              sentence:
                "At first, everything seemed normal, but then a famous singer showed up.",
              highlight: "a famous singer showed up",
            },
          ],
        },
        {
          id: "pspc_2_03",
          template:
            "I was so [감정] that I didn't know what to do at first.",
          translation:
            "너무 [놀라서/감동해서] 처음에 뭘 해야 할지 몰랐어요.",
          examples: [
            {
              topic: "생일파티",
              sentence:
                "I was so shocked that I didn't know what to do at first.",
              highlight: "shocked",
            },
            {
              topic: "회사면접",
              sentence:
                "I was so happy that I didn't know what to do at first.",
              highlight: "happy",
            },
            {
              topic: "자동차 고장",
              sentence:
                "I was so scared that I didn't know what to do at first.",
              highlight: "scared",
            },
          ],
        },
        {
          id: "pspc_2_04",
          template:
            "What made it even more special was that [추가 상황].",
          translation:
            "그걸 더 특별하게 만들었던 건 [추가 상황]이었어요.",
          examples: [
            {
              topic: "생일파티",
              sentence:
                "What made it even more special was that all my old friends came to celebrate.",
              highlight: "all my old friends came to celebrate",
            },
            {
              topic: "국내여행",
              sentence:
                "What made it even more special was that the weather was absolutely perfect.",
              highlight: "the weather was absolutely perfect",
            },
            {
              topic: "공연",
              sentence:
                "What made it even more special was that the singer sang my favorite song.",
              highlight: "the singer sang my favorite song",
            },
          ],
        },
        {
          id: "pspc_2_05",
          template:
            "The most impressive part was when [구체적 사건].",
          translation:
            "가장 인상적이었던 부분은 [구체적 사건]이었어요.",
          examples: [
            {
              topic: "지형(여행)",
              sentence:
                "The most impressive part was when we reached the top of the mountain and saw the sunrise.",
              highlight: "we reached the top of the mountain and saw the sunrise",
            },
            {
              topic: "공연",
              sentence:
                "The most impressive part was when the entire audience started singing along.",
              highlight: "the entire audience started singing along",
            },
            {
              topic: "음식",
              sentence:
                "The most impressive part was when everyone loved the dish I made.",
              highlight: "everyone loved the dish I made",
            },
          ],
        },
        {
          id: "pspc_2_06",
          template:
            "I couldn't believe my eyes when I saw [장면].",
          translation:
            "[장면]을 봤을 때 제 눈을 의심했어요.",
          examples: [
            {
              topic: "지형",
              sentence:
                "I couldn't believe my eyes when I saw the beautiful sunset over the ocean.",
              highlight: "the beautiful sunset over the ocean",
            },
            {
              topic: "생일파티",
              sentence:
                "I couldn't believe my eyes when I saw everyone waiting for me at the party.",
              highlight: "everyone waiting for me at the party",
            },
            {
              topic: "헬스클럽",
              sentence:
                "I couldn't believe my eyes when I saw my race finish time on the screen.",
              highlight: "my race finish time on the screen",
            },
          ],
        },
        {
          id: "pspc_2_07",
          template:
            "We ended up [동사], which was totally unexpected.",
          translation:
            "결국 [~]하게 되었는데, 완전히 예상 밖이었어요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "We ended up staying an extra day, which was totally unexpected.",
              highlight: "staying an extra day",
            },
            {
              topic: "음식점",
              sentence:
                "We ended up trying a completely new restaurant, which was totally unexpected.",
              highlight: "trying a completely new restaurant",
            },
            {
              topic: "모임",
              sentence:
                "We ended up talking until midnight, which was totally unexpected.",
              highlight: "talking until midnight",
            },
          ],
        },
        {
          id: "pspc_2_08",
          template:
            "The whole experience lasted about [시간], but it felt like [시간].",
          translation:
            "전체 경험은 약 [시간] 동안이었지만, [시간]처럼 느껴졌어요.",
          examples: [
            {
              topic: "공연",
              sentence:
                "The whole experience lasted about two hours, but it felt like it was over in a flash.",
              highlight: "two hours, ... over in a flash",
            },
            {
              topic: "회사면접",
              sentence:
                "The whole experience lasted about one hour, but it felt like an eternity.",
              highlight: "one hour, ... an eternity",
            },
            {
              topic: "해외여행",
              sentence:
                "The whole experience lasted about a week, but it felt like just one day.",
              highlight: "a week, ... just one day",
            },
          ],
        },
        {
          id: "pspc_2_09",
          template:
            "Everyone around me was [감정], and the atmosphere was absolutely [형용사].",
          translation:
            "주변 사람들 모두 [감정]이었고, 분위기가 정말 [형용사]했어요.",
          examples: [
            {
              topic: "파티",
              sentence:
                "Everyone around me was excited, and the atmosphere was absolutely electric.",
              highlight: "excited, ... electric",
            },
            {
              topic: "기념모임",
              sentence:
                "Everyone around me was emotional, and the atmosphere was absolutely heartwarming.",
              highlight: "emotional, ... heartwarming",
            },
            {
              topic: "공연",
              sentence:
                "Everyone around me was cheering, and the atmosphere was absolutely thrilling.",
              highlight: "cheering, ... thrilling",
            },
          ],
        },
        {
          id: "pspc_2_10",
          template:
            "After it was all over, I just sat there and [동사] for a while.",
          translation:
            "다 끝나고 나서, 전 그냥 거기 앉아 한동안 [~]했어요.",
          examples: [
            {
              topic: "공연",
              sentence:
                "After it was all over, I just sat there and replayed the whole thing in my head for a while.",
              highlight: "replayed the whole thing in my head",
            },
            {
              topic: "기념모임",
              sentence:
                "After it was all over, I just sat there and looked at the photos for a while.",
              highlight: "looked at the photos",
            },
            {
              topic: "해외여행",
              sentence:
                "After it was all over, I just sat there and took in the view for a while.",
              highlight: "took in the view",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "그 경험이 나에게 준 감정과 교훈을 표현하는 패턴",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "pspc_3_01",
          template:
            "That experience made me realize how important it is to [동사].",
          translation:
            "그 경험을 통해 [~]하는 것이 얼마나 중요한지 깨달았어요.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "That experience made me realize how important it is to spend time with family.",
              highlight: "spend time with family",
            },
            {
              topic: "건강",
              sentence:
                "That experience made me realize how important it is to take care of my health.",
              highlight: "take care of my health",
            },
            {
              topic: "해외여행",
              sentence:
                "That experience made me realize how important it is to try new things.",
              highlight: "try new things",
            },
          ],
        },
        {
          id: "pspc_3_02",
          template:
            "I was deeply moved by the whole experience.",
          translation:
            "전체 경험에 깊이 감동받았어요.",
          examples: [
            {
              topic: "기념모임",
              sentence:
                "I was deeply moved by the whole celebration experience.",
              highlight: "celebration experience",
            },
            {
              topic: "우리나라 방문",
              sentence:
                "I was deeply moved by the whole experience of showing my country to a foreign friend.",
              highlight: "showing my country to a foreign friend",
            },
            {
              topic: "국내여행",
              sentence:
                "I was deeply moved by the whole trip to the countryside.",
              highlight: "trip to the countryside",
            },
          ],
        },
        {
          id: "pspc_3_03",
          template:
            "It was one of those moments that I will treasure forever.",
          translation:
            "영원히 간직할 순간 중 하나였어요.",
          examples: [
            {
              topic: "지형",
              sentence:
                "Watching the sunset by the sea was one of those moments that I will treasure forever.",
              highlight: "Watching the sunset by the sea",
            },
            {
              topic: "휴일식사",
              sentence:
                "Having a holiday dinner with my whole family was one of those moments that I will treasure forever.",
              highlight: "Having a holiday dinner with my whole family",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Finishing my first marathon was one of those moments that I will treasure forever.",
              highlight: "Finishing my first marathon",
            },
          ],
        },
        {
          id: "pspc_3_04",
          template:
            "Ever since that day, I've become a completely different person when it comes to [주제].",
          translation:
            "그날 이후로, [주제]에 관해서는 완전히 다른 사람이 되었어요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "Ever since that day, I've become a completely different person when it comes to taking care of my health.",
              highlight: "taking care of my health",
            },
            {
              topic: "가족/친구",
              sentence:
                "Ever since that day, I've become a completely different person when it comes to appreciating my friends.",
              highlight: "appreciating my friends",
            },
            {
              topic: "여행",
              sentence:
                "Ever since that day, I've become a completely different person when it comes to planning trips.",
              highlight: "planning trips",
            },
          ],
        },
        {
          id: "pspc_3_05",
          template:
            "I still get emotional whenever I think about that moment.",
          translation:
            "그 순간을 생각할 때마다 아직도 감정이 북받쳐요.",
          examples: [
            {
              topic: "기념모임",
              sentence:
                "I still get emotional whenever I think about that anniversary celebration.",
              highlight: "that anniversary celebration",
            },
            {
              topic: "가족/친구",
              sentence:
                "I still get emotional whenever I think about saying goodbye to my friends.",
              highlight: "saying goodbye to my friends",
            },
            {
              topic: "직장",
              sentence:
                "I still get emotional whenever I think about the moment I achieved my career goal.",
              highlight: "the moment I achieved my career goal",
            },
          ],
        },
        {
          id: "pspc_3_06",
          template:
            "If I hadn't gone through that experience, I wouldn't be who I am today.",
          translation:
            "그 경험을 겪지 않았다면, 지금의 내가 아니었을 거예요.",
          examples: [
            {
              topic: "외국 국가",
              sentence:
                "If I hadn't gone through that experience living abroad, I wouldn't be who I am today.",
              highlight: "living abroad",
            },
            {
              topic: "자동차 고장",
              sentence:
                "If I hadn't gone through that car breakdown experience, I wouldn't be who I am today.",
              highlight: "car breakdown experience",
            },
            {
              topic: "회사면접",
              sentence:
                "If I hadn't gone through that tough interview, I wouldn't be who I am today.",
              highlight: "tough interview",
            },
          ],
        },
        {
          id: "pspc_3_07",
          template:
            "It taught me a valuable lesson about [교훈].",
          translation:
            "그건 [교훈]에 대한 소중한 교훈을 가르쳐줬어요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "It taught me a valuable lesson about patience and flexibility.",
              highlight: "patience and flexibility",
            },
            {
              topic: "가족/친구",
              sentence:
                "It taught me a valuable lesson about true friendship.",
              highlight: "true friendship",
            },
            {
              topic: "직장",
              sentence:
                "It taught me a valuable lesson about being prepared.",
              highlight: "being prepared",
            },
          ],
        },
        {
          id: "pspc_3_08",
          template:
            "I felt so proud of myself for [동사].",
          translation:
            "[~]한 제 자신이 너무 자랑스러웠어요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "I felt so proud of myself for completing the entire workout program.",
              highlight: "completing the entire workout program",
            },
            {
              topic: "직장",
              sentence:
                "I felt so proud of myself for finishing the project on time.",
              highlight: "finishing the project on time",
            },
            {
              topic: "음식",
              sentence:
                "I felt so proud of myself for cooking a full meal by myself.",
              highlight: "cooking a full meal by myself",
            },
          ],
        },
        {
          id: "pspc_3_09",
          template:
            "That moment reminded me of why I love [주제] so much.",
          translation:
            "그 순간이 제가 왜 [주제]를 그토록 좋아하는지 다시 한번 일깨워줬어요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "That moment reminded me of why I love traveling so much.",
              highlight: "traveling",
            },
            {
              topic: "음악",
              sentence:
                "That moment reminded me of why I love live music so much.",
              highlight: "live music",
            },
            {
              topic: "음식",
              sentence:
                "That moment reminded me of why I love cooking so much.",
              highlight: "cooking",
            },
          ],
        },
        {
          id: "pspc_3_10",
          template:
            "I kept telling everyone about it for weeks because I was so excited.",
          translation:
            "너무 신나서 몇 주 동안 모든 사람에게 그 얘기를 했어요.",
          examples: [
            {
              topic: "공연",
              sentence:
                "I kept telling everyone about the concert for weeks because I was so excited.",
              highlight: "the concert",
            },
            {
              topic: "해외여행",
              sentence:
                "I kept telling everyone about the trip for weeks because I was so excited.",
              highlight: "the trip",
            },
            {
              topic: "생일파티",
              sentence:
                "I kept telling everyone about the surprise party for weeks because I was so excited.",
              highlight: "the surprise party",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "경험을 정리하며 끝내는 패턴",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "pspc_4_01",
          template:
            "So, that's the story of one of the most memorable experiences in my life.",
          translation:
            "그래서, 이게 제 인생에서 가장 기억에 남는 경험 중 하나의 이야기예요.",
          examples: [
            {
              topic: "해외여행",
              sentence:
                "So, that's the story of my most memorable trip. I still think about it often.",
              highlight: "my most memorable trip",
            },
            {
              topic: "헬스클럽",
              sentence:
                "So, that's the story of the most memorable competition I've been in.",
              highlight: "the most memorable competition",
            },
            {
              topic: "모임",
              sentence:
                "So, that's the story of one of the most memorable gatherings in my life.",
              highlight: "the most memorable gatherings",
            },
          ],
        },
        {
          id: "pspc_4_02",
          template:
            "If I ever get the chance, I would love to experience something like that again.",
          translation:
            "기회가 된다면, 그런 경험을 다시 해보고 싶어요.",
          examples: [
            {
              topic: "해외여행",
              sentence:
                "If I ever get the chance, I would love to travel there again.",
              highlight: "travel there again",
            },
            {
              topic: "공연",
              sentence:
                "If I ever get the chance, I would love to see that performer live again.",
              highlight: "see that performer live again",
            },
            {
              topic: "파티",
              sentence:
                "If I ever get the chance, I would love to throw a party like that again.",
              highlight: "throw a party like that again",
            },
          ],
        },
        {
          id: "pspc_4_03",
          template:
            "It's definitely a day I will never forget, no matter how much time passes.",
          translation:
            "아무리 시간이 지나도 절대 잊지 못할 날이에요.",
          examples: [
            {
              topic: "기념모임",
              sentence:
                "That celebration day is definitely a day I will never forget, no matter how much time passes.",
              highlight: "That celebration day",
            },
            {
              topic: "회사면접",
              sentence:
                "The day I got my dream job is definitely a day I will never forget, no matter how much time passes.",
              highlight: "The day I got my dream job",
            },
            {
              topic: "헬스클럽",
              sentence:
                "The day I finished the marathon is definitely a day I will never forget, no matter how much time passes.",
              highlight: "The day I finished the marathon",
            },
          ],
        },
        {
          id: "pspc_4_04",
          template:
            "I hope everyone gets to have a moment like that at least once in their life.",
          translation:
            "모든 사람이 인생에서 적어도 한 번은 그런 순간을 가졌으면 좋겠어요.",
          examples: [
            {
              topic: "공연",
              sentence:
                "I hope everyone gets to have a deeply moving concert experience like that at least once in their life.",
              highlight: "a deeply moving concert experience",
            },
            {
              topic: "직장",
              sentence:
                "I hope everyone gets to have that feeling of achievement at work at least once in their life.",
              highlight: "that feeling of achievement at work",
            },
            {
              topic: "해외여행",
              sentence:
                "I hope everyone gets to have an amazing travel experience like that at least once in their life.",
              highlight: "an amazing travel experience",
            },
          ],
        },
        {
          id: "pspc_4_05",
          template:
            "Anyway, that's my story. I feel lucky that I got to experience it.",
          translation:
            "어쨌든, 그게 제 이야기예요. 그 경험을 할 수 있었던 게 행운이었다고 느껴요.",
          examples: [
            {
              topic: "공연",
              sentence:
                "Anyway, that's my concert story. I feel lucky that I got to experience it.",
              highlight: "my concert story",
            },
            {
              topic: "해외여행",
              sentence:
                "Anyway, that's my travel story. I feel lucky that I got to experience it.",
              highlight: "my travel story",
            },
            {
              topic: "기념모임",
              sentence:
                "Anyway, that's my celebration story. I feel lucky that I got to experience it.",
              highlight: "my celebration story",
            },
          ],
        },
      ],
    },
  ],
};
