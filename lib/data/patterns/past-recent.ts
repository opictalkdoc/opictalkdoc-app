import type { PatternSet } from "@/lib/types/patterns";

export const pastRecentPatterns: PatternSet = {
  questionType: "past_recent",
  label: "경험·최근",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "최근에 있었던 일을 소개하며 시작하는 패턴",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "prec_1_01",
          template: "Recently, I [동사], and it was really [형용사].",
          translation:
            "최근에 [~]했는데, 정말 [좋았어요/재미있었어요].",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "Recently, I went on a trip to Jeju Island, and it was really refreshing.",
              highlight: "went on a trip to Jeju Island, ... refreshing",
            },
            {
              topic: "영화",
              sentence:
                "Recently, I watched a new movie, and it was really impressive.",
              highlight: "watched a new movie, ... impressive",
            },
            {
              topic: "음식점",
              sentence:
                "Recently, I tried a new restaurant, and it was really delicious.",
              highlight: "tried a new restaurant, ... delicious",
            },
          ],
        },
        {
          id: "prec_1_02",
          template:
            "A few days ago, I had a chance to [동사], and I really enjoyed it.",
          translation:
            "며칠 전에 [~]할 기회가 있었는데, 정말 즐거웠어요.",
          examples: [
            {
              topic: "공연",
              sentence:
                "A few days ago, I had a chance to see a musical, and I really enjoyed it.",
              highlight: "see a musical",
            },
            {
              topic: "음식",
              sentence:
                "A few days ago, I had a chance to take a cooking class, and I really enjoyed it.",
              highlight: "take a cooking class",
            },
            {
              topic: "헬스클럽",
              sentence:
                "A few days ago, I had a chance to try rock climbing, and I really enjoyed it.",
              highlight: "try rock climbing",
            },
          ],
        },
        {
          id: "prec_1_03",
          template:
            "Last week, something interesting happened when I was [동사].",
          translation:
            "지난주에, [~]하고 있었을 때 재미있는 일이 있었어요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "Last week, something interesting happened when I was shopping at the mall.",
              highlight: "shopping at the mall",
            },
            {
              topic: "자전거",
              sentence:
                "Last week, something interesting happened when I was riding my bike in the park.",
              highlight: "riding my bike in the park",
            },
            {
              topic: "약국",
              sentence:
                "Last week, something interesting happened when I was picking up medicine at the pharmacy.",
              highlight: "picking up medicine at the pharmacy",
            },
          ],
        },
        {
          id: "prec_1_04",
          template:
            "Just the other day, I decided to [동사], and it turned out great.",
          translation:
            "바로 얼마 전에 [~]하기로 했는데, 결과가 정말 좋았어요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "Just the other day, I decided to cook a new recipe, and it turned out great.",
              highlight: "cook a new recipe",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Just the other day, I decided to try yoga at the gym, and it turned out great.",
              highlight: "try yoga at the gym",
            },
            {
              topic: "집",
              sentence:
                "Just the other day, I decided to reorganize my room, and it turned out great.",
              highlight: "reorganize my room",
            },
          ],
        },
        {
          id: "prec_1_05",
          template:
            "Not too long ago, I had an experience related to [주제] that I'd like to share.",
          translation:
            "얼마 전에 [주제]와 관련된 경험이 있었는데, 공유하고 싶어요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "Not too long ago, I had an experience related to online shopping that I'd like to share.",
              highlight: "online shopping",
            },
            {
              topic: "건강",
              sentence:
                "Not too long ago, I had an experience related to health that I'd like to share.",
              highlight: "health",
            },
            {
              topic: "여행",
              sentence:
                "Not too long ago, I had an experience related to traveling that I'd like to share.",
              highlight: "traveling",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "최근 경험의 구체적인 과정을 묘사하는 패턴",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "prec_2_01",
          template:
            "So, what happened was, I [동사], and then [사건].",
          translation:
            "그래서 무슨 일이 있었냐면, [~]했는데, 그다음에 [사건]이 있었어요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "So, what happened was, I ordered something online, and then it arrived broken.",
              highlight: "ordered something online, ... it arrived broken",
            },
            {
              topic: "음식점",
              sentence:
                "So, what happened was, I went to a new restaurant, and then I discovered the best pasta ever.",
              highlight: "went to a new restaurant, ... discovered the best pasta ever",
            },
            {
              topic: "교통",
              sentence:
                "So, what happened was, I missed my bus, and then I had to take a taxi.",
              highlight: "missed my bus, ... had to take a taxi",
            },
          ],
        },
        {
          id: "prec_2_02",
          template:
            "I was a little nervous at first, but once I started [동사], it was totally fine.",
          translation:
            "처음엔 좀 긴장했는데, [~]를 시작하니까 완전 괜찮았어요.",
          examples: [
            {
              topic: "회사면접",
              sentence:
                "I was a little nervous at first, but once I started answering questions, it was totally fine.",
              highlight: "answering questions",
            },
            {
              topic: "헬스클럽",
              sentence:
                "I was a little nervous at first, but once I started climbing, it was totally fine.",
              highlight: "climbing",
            },
            {
              topic: "병원",
              sentence:
                "I was a little nervous at first, but once I started talking to the doctor, it was totally fine.",
              highlight: "talking to the doctor",
            },
          ],
        },
        {
          id: "prec_2_03",
          template:
            "The best part was when [구체적 사건].",
          translation:
            "가장 좋았던 부분은 [구체적 사건]이었어요.",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "The best part was when we found a hidden beach with nobody around.",
              highlight: "we found a hidden beach with nobody around",
            },
            {
              topic: "파티",
              sentence:
                "The best part was when they brought out the surprise cake.",
              highlight: "they brought out the surprise cake",
            },
            {
              topic: "공연",
              sentence:
                "The best part was when my favorite song was performed live.",
              highlight: "my favorite song was performed live",
            },
          ],
        },
        {
          id: "prec_2_04",
          template:
            "I was with [사람], and we both agreed that [의견].",
          translation:
            "[사람]과 함께였는데, 우리 둘 다 [의견]이라는 데 동의했어요.",
          examples: [
            {
              topic: "영화",
              sentence:
                "I was with my friend, and we both agreed that the movie was amazing.",
              highlight: "my friend, ... the movie was amazing",
            },
            {
              topic: "음식점",
              sentence:
                "I was with my coworker, and we both agreed that the food was excellent.",
              highlight: "my coworker, ... the food was excellent",
            },
            {
              topic: "호텔",
              sentence:
                "I was with my family, and we both agreed that the hotel had a great view.",
              highlight: "my family, ... the hotel had a great view",
            },
          ],
        },
        {
          id: "prec_2_05",
          template:
            "It took about [시간], but it was totally worth it.",
          translation:
            "약 [시간]이 걸렸지만, 완전히 그만한 가치가 있었어요.",
          examples: [
            {
              topic: "지형(여행)",
              sentence:
                "It took about three hours to reach the top, but it was totally worth it.",
              highlight: "three hours to reach the top",
            },
            {
              topic: "음식",
              sentence:
                "It took about two hours to prepare everything, but it was totally worth it.",
              highlight: "two hours to prepare everything",
            },
            {
              topic: "집",
              sentence:
                "It took about a whole weekend to finish cleaning, but it was totally worth it.",
              highlight: "a whole weekend to finish cleaning",
            },
          ],
        },
        {
          id: "prec_2_06",
          template:
            "I didn't expect it to be so [형용사], but I was pleasantly surprised.",
          translation:
            "그렇게 [~]할 줄 몰랐는데, 기분 좋게 놀랐어요.",
          examples: [
            {
              topic: "음식점",
              sentence:
                "I didn't expect the food to be so tasty, but I was pleasantly surprised.",
              highlight: "tasty",
            },
            {
              topic: "영화",
              sentence:
                "I didn't expect the movie to be so fascinating, but I was pleasantly surprised.",
              highlight: "fascinating",
            },
            {
              topic: "헬스클럽",
              sentence:
                "I didn't expect the class to be so fun, but I was pleasantly surprised.",
              highlight: "fun",
            },
          ],
        },
        {
          id: "prec_2_07",
          template:
            "One thing that really stood out to me was [명사/상황].",
          translation:
            "제게 정말 눈에 띄었던 한 가지는 [명사/상황]이었어요.",
          examples: [
            {
              topic: "상점문의",
              sentence:
                "One thing that really stood out to me was the outstanding customer service at the store.",
              highlight: "the outstanding customer service at the store",
            },
            {
              topic: "호텔",
              sentence:
                "One thing that really stood out to me was the breathtaking view from the hotel room.",
              highlight: "the breathtaking view from the hotel room",
            },
            {
              topic: "모임",
              sentence:
                "One thing that really stood out to me was how friendly everyone was at the gathering.",
              highlight: "how friendly everyone was at the gathering",
            },
          ],
        },
        {
          id: "prec_2_08",
          template:
            "While I was there, I also got to [동사], which was a nice bonus.",
          translation:
            "거기 있는 동안, [~]도 할 수 있었는데, 좋은 보너스였어요.",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "While I was there, I also got to try local street food, which was a nice bonus.",
              highlight: "try local street food",
            },
            {
              topic: "공연",
              sentence:
                "While I was there, I also got to meet the performer in person, which was a nice bonus.",
              highlight: "meet the performer in person",
            },
            {
              topic: "음식점",
              sentence:
                "While I was there, I also got to enjoy live acoustic music, which was a nice bonus.",
              highlight: "enjoy live acoustic music",
            },
          ],
        },
        {
          id: "prec_2_09",
          template:
            "At that moment, I thought to myself, '[생각].'",
          translation:
            "그 순간, '[ 생각]'이라고 속으로 생각했어요.",
          examples: [
            {
              topic: "지형",
              sentence:
                "At that moment, I thought to myself, 'This is exactly what I needed.'",
              highlight: "This is exactly what I needed",
            },
            {
              topic: "직장",
              sentence:
                "At that moment, I thought to myself, 'All the hard work finally paid off.'",
              highlight: "All the hard work finally paid off",
            },
            {
              topic: "해외여행",
              sentence:
                "At that moment, I thought to myself, 'I'm so lucky to be here.'",
              highlight: "I'm so lucky to be here",
            },
          ],
        },
        {
          id: "prec_2_10",
          template:
            "By the end of the day, I had [동사], and I felt really [형용사].",
          translation:
            "하루가 끝날 무렵, [~]를 마쳤고, 정말 [~]한 기분이었어요.",
          examples: [
            {
              topic: "지형(여행)",
              sentence:
                "By the end of the day, I had climbed the entire trail, and I felt really accomplished.",
              highlight: "climbed the entire trail, ... accomplished",
            },
            {
              topic: "쇼핑",
              sentence:
                "By the end of the day, I had bought everything I needed, and I felt really satisfied.",
              highlight: "bought everything I needed, ... satisfied",
            },
            {
              topic: "집",
              sentence:
                "By the end of the day, I had cleaned the whole apartment, and I felt really refreshed.",
              highlight: "cleaned the whole apartment, ... refreshed",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "최근 경험에 대한 감정과 평가를 표현하는 패턴",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "prec_3_01",
          template:
            "Overall, I had a really great time, and I'm so glad I did it.",
          translation:
            "전반적으로 정말 좋은 시간을 보냈고, 그렇게 해서 정말 다행이에요.",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "Overall, I had a really great time on the trip, and I'm so glad I went.",
              highlight: "on the trip",
            },
            {
              topic: "공연",
              sentence:
                "Overall, I had a really great time at the show, and I'm so glad I attended.",
              highlight: "at the show",
            },
            {
              topic: "모임",
              sentence:
                "Overall, I had a really great time at the gathering, and I'm so glad I joined.",
              highlight: "at the gathering",
            },
          ],
        },
        {
          id: "prec_3_02",
          template:
            "It was such a nice change from my usual routine.",
          translation:
            "평소 루틴에서 벗어나 정말 좋은 변화였어요.",
          examples: [
            {
              topic: "집에서 휴가",
              sentence:
                "Staying home on vacation was such a nice change from my usual routine.",
              highlight: "Staying home on vacation",
            },
            {
              topic: "음식",
              sentence:
                "Taking a cooking class was such a nice change from my usual routine.",
              highlight: "Taking a cooking class",
            },
            {
              topic: "국내여행",
              sentence:
                "Taking a day trip to the coast was such a nice change from my usual routine.",
              highlight: "Taking a day trip to the coast",
            },
          ],
        },
        {
          id: "prec_3_03",
          template:
            "I was a bit disappointed that [아쉬운 점], but overall it was still enjoyable.",
          translation:
            "[아쉬운 점]이 좀 아쉬웠지만, 전반적으로는 여전히 즐거웠어요.",
          examples: [
            {
              topic: "날씨",
              sentence:
                "I was a bit disappointed that the weather wasn't great, but overall it was still enjoyable.",
              highlight: "the weather wasn't great",
            },
            {
              topic: "음식점",
              sentence:
                "I was a bit disappointed that we had to wait in line for so long, but overall it was still enjoyable.",
              highlight: "we had to wait in line for so long",
            },
            {
              topic: "호텔",
              sentence:
                "I was a bit disappointed that the room was a bit small, but overall it was still enjoyable.",
              highlight: "the room was a bit small",
            },
          ],
        },
        {
          id: "prec_3_04",
          template:
            "It really made me appreciate [명사] even more.",
          translation:
            "덕분에 [명사]를 더 감사하게 느끼게 되었어요.",
          examples: [
            {
              topic: "지형",
              sentence:
                "It really made me appreciate nature even more.",
              highlight: "nature",
            },
            {
              topic: "집",
              sentence:
                "It really made me appreciate my home even more.",
              highlight: "my home",
            },
            {
              topic: "건강",
              sentence:
                "It really made me appreciate my health even more.",
              highlight: "my health",
            },
          ],
        },
        {
          id: "prec_3_05",
          template:
            "After the experience, I couldn't stop thinking about [생각].",
          translation:
            "그 경험 후에, [생각]에 대해 계속 생각하게 되었어요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "After the experience, I couldn't stop thinking about going back there.",
              highlight: "going back there",
            },
            {
              topic: "헬스클럽",
              sentence:
                "After the experience, I couldn't stop thinking about how much I've improved.",
              highlight: "how much I've improved",
            },
            {
              topic: "가족/친구",
              sentence:
                "After the experience, I couldn't stop thinking about how lucky I am to have great friends.",
              highlight: "how lucky I am to have great friends",
            },
          ],
        },
        {
          id: "prec_3_06",
          template:
            "I immediately told my [사람] about it because it was so [형용사].",
          translation:
            "너무 [~]해서 바로 [사람]에게 말했어요.",
          examples: [
            {
              topic: "음식점",
              sentence:
                "I immediately told my friends about it because the food was so amazing.",
              highlight: "my friends, ... amazing",
            },
            {
              topic: "쇼핑",
              sentence:
                "I immediately told my sister about it because the deal was so good.",
              highlight: "my sister, ... good",
            },
            {
              topic: "호텔",
              sentence:
                "I immediately told my coworkers about it because the place was so wonderful.",
              highlight: "my coworkers, ... wonderful",
            },
          ],
        },
        {
          id: "prec_3_07",
          template:
            "It was exactly what I needed to recharge my batteries.",
          translation:
            "에너지를 재충전하기에 딱 필요했던 거였어요.",
          examples: [
            {
              topic: "집에서 보내는 휴가",
              sentence:
                "That staycation was exactly what I needed to recharge my batteries.",
              highlight: "That staycation",
            },
            {
              topic: "집에서 휴가",
              sentence:
                "Spending the day at home doing nothing was exactly what I needed to recharge my batteries.",
              highlight: "Spending the day at home doing nothing",
            },
            {
              topic: "지형",
              sentence:
                "Spending time in nature was exactly what I needed to recharge my batteries.",
              highlight: "Spending time in nature",
            },
          ],
        },
        {
          id: "prec_3_08",
          template:
            "The only thing I regret is that I didn't [동사] sooner.",
          translation:
            "유일하게 아쉬운 건 더 일찍 [~]하지 않았다는 거예요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "The only thing I regret is that I didn't start working out sooner.",
              highlight: "start working out",
            },
            {
              topic: "해외여행",
              sentence:
                "The only thing I regret is that I didn't visit there sooner.",
              highlight: "visit there",
            },
            {
              topic: "음악",
              sentence:
                "The only thing I regret is that I didn't pick up this hobby sooner.",
              highlight: "pick up this hobby",
            },
          ],
        },
        {
          id: "prec_3_09",
          template:
            "It gave me a lot of motivation to [동사] from now on.",
          translation:
            "앞으로 [~]하겠다는 동기부여가 많이 되었어요.",
          examples: [
            {
              topic: "건강식품",
              sentence:
                "It gave me a lot of motivation to eat healthier from now on.",
              highlight: "eat healthier",
            },
            {
              topic: "직장",
              sentence:
                "It gave me a lot of motivation to work harder from now on.",
              highlight: "work harder",
            },
            {
              topic: "헬스클럽",
              sentence:
                "It gave me a lot of motivation to exercise more regularly from now on.",
              highlight: "exercise more regularly",
            },
          ],
        },
        {
          id: "prec_3_10",
          template:
            "I'm already looking forward to doing it again next time.",
          translation:
            "벌써 다음에 또 하는 걸 기대하고 있어요.",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "I'm already looking forward to going on another trip next time.",
              highlight: "going on another trip",
            },
            {
              topic: "음식점",
              sentence:
                "I'm already looking forward to visiting that restaurant again next time.",
              highlight: "visiting that restaurant",
            },
            {
              topic: "공연",
              sentence:
                "I'm already looking forward to seeing another show next time.",
              highlight: "seeing another show",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "최근 경험을 정리하며 끝내는 패턴",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "prec_4_01",
          template:
            "So, that's what happened to me recently regarding [주제].",
          translation:
            "그래서, 그게 최근에 [주제]와 관련해서 저한테 있었던 일이에요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "So, that's what happened to me recently regarding shopping.",
              highlight: "shopping",
            },
            {
              topic: "여행",
              sentence:
                "So, that's what happened to me recently regarding traveling.",
              highlight: "traveling",
            },
            {
              topic: "건강",
              sentence:
                "So, that's what happened to me recently regarding my health.",
              highlight: "my health",
            },
          ],
        },
        {
          id: "prec_4_02",
          template:
            "It was a great experience, and I would highly recommend it to anyone.",
          translation:
            "정말 좋은 경험이었고, 누구에게나 강력히 추천하고 싶어요.",
          examples: [
            {
              topic: "음식점",
              sentence:
                "It was a great dining experience, and I would highly recommend the restaurant to anyone.",
              highlight: "the restaurant",
            },
            {
              topic: "해외여행",
              sentence:
                "It was a great travel experience, and I would highly recommend the destination to anyone.",
              highlight: "the destination",
            },
            {
              topic: "헬스클럽",
              sentence:
                "It was a great fitness experience, and I would highly recommend the gym to anyone.",
              highlight: "the gym",
            },
          ],
        },
        {
          id: "prec_4_03",
          template:
            "Next time, I plan to [동사] because I want to make it even better.",
          translation:
            "다음에는 더 좋게 만들고 싶어서 [~]할 계획이에요.",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "Next time, I plan to stay longer because I want to make it even better.",
              highlight: "stay longer",
            },
            {
              topic: "음식",
              sentence:
                "Next time, I plan to try a different recipe because I want to make it even better.",
              highlight: "try a different recipe",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Next time, I plan to push myself harder because I want to make it even better.",
              highlight: "push myself harder",
            },
          ],
        },
        {
          id: "prec_4_04",
          template:
            "All in all, it was a [형용사] experience that I won't forget anytime soon.",
          translation:
            "전반적으로, 당분간 잊지 못할 [형용사] 경험이었어요.",
          examples: [
            {
              topic: "해외여행",
              sentence:
                "All in all, it was a wonderful experience that I won't forget anytime soon.",
              highlight: "wonderful",
            },
            {
              topic: "모임",
              sentence:
                "All in all, it was a heartwarming experience that I won't forget anytime soon.",
              highlight: "heartwarming",
            },
            {
              topic: "회사면접",
              sentence:
                "All in all, it was an eye-opening experience that I won't forget anytime soon.",
              highlight: "eye-opening",
            },
          ],
        },
        {
          id: "prec_4_05",
          template:
            "That's pretty much what happened. I hope I get to do something like that again soon.",
          translation:
            "대략 이런 일이 있었어요. 곧 또 그런 걸 할 수 있으면 좋겠어요.",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "That's pretty much what happened on the trip. I hope I get to go again soon.",
              highlight: "the trip",
            },
            {
              topic: "공연",
              sentence:
                "That's pretty much what happened at the concert. I hope I get to see them again soon.",
              highlight: "the concert",
            },
            {
              topic: "주말초대",
              sentence:
                "That's pretty much what happened at the weekend gathering. I hope I get to see everyone again soon.",
              highlight: "the weekend gathering",
            },
          ],
        },
      ],
    },
  ],
};
