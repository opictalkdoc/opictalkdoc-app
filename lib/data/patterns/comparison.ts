import type { PatternSet } from "@/lib/types/patterns";

export const comparisonPatterns: PatternSet = {
  questionType: "comparison",
  label: "비교",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "과거와 현재를 비교하며 시작하는 패턴",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "comp_1_01",
          template:
            "Things have changed a lot when it comes to [주제] compared to the past.",
          translation:
            "과거와 비교하면 [주제]에 대해 많은 것이 변했어요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "Things have changed a lot when it comes to technology compared to the past.",
              highlight: "technology",
            },
            {
              topic: "쇼핑",
              sentence:
                "Things have changed a lot when it comes to shopping compared to the past.",
              highlight: "shopping",
            },
            {
              topic: "교통",
              sentence:
                "Things have changed a lot when it comes to transportation compared to the past.",
              highlight: "transportation",
            },
          ],
        },
        {
          id: "comp_1_02",
          template:
            "If I compare [주제] now and [주제] in the past, there are some big differences.",
          translation:
            "지금의 [주제]와 과거의 [주제]를 비교하면, 꽤 큰 차이가 있어요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "If I compare traveling now and traveling in the past, there are some big differences.",
              highlight: "traveling now, ... traveling in the past",
            },
            {
              topic: "음악",
              sentence:
                "If I compare music now and music in the past, there are some big differences.",
              highlight: "music now, ... music in the past",
            },
            {
              topic: "전화기",
              sentence:
                "If I compare phones now and phones in the past, there are some big differences.",
              highlight: "phones now, ... phones in the past",
            },
          ],
        },
        {
          id: "comp_1_03",
          template:
            "I've noticed that [주제] has changed quite a bit over the years.",
          translation:
            "몇 년 사이에 [주제]가 꽤 많이 변했다는 걸 느꼈어요.",
          examples: [
            {
              topic: "집",
              sentence:
                "I've noticed that my neighborhood has changed quite a bit over the years.",
              highlight: "my neighborhood",
            },
            {
              topic: "자유시간",
              sentence:
                "I've noticed that my hobbies have changed quite a bit over the years.",
              highlight: "my hobbies",
            },
            {
              topic: "음식",
              sentence:
                "I've noticed that my eating habits have changed quite a bit over the years.",
              highlight: "my eating habits",
            },
          ],
        },
        {
          id: "comp_1_04",
          template:
            "Looking back, I can see a huge difference in how people [동사] nowadays.",
          translation:
            "돌이켜보면, 요즘 사람들이 [~]하는 방식에서 큰 차이를 볼 수 있어요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "Looking back, I can see a huge difference in how people communicate nowadays.",
              highlight: "communicate",
            },
            {
              topic: "쇼핑",
              sentence:
                "Looking back, I can see a huge difference in how people shop nowadays.",
              highlight: "shop",
            },
            {
              topic: "자유시간",
              sentence:
                "Looking back, I can see a huge difference in how people spend their free time nowadays.",
              highlight: "spend their free time",
            },
          ],
        },
        {
          id: "comp_1_05",
          template:
            "There's no doubt that [주제] today is very different from what it used to be.",
          translation:
            "오늘날의 [주제]가 예전과 매우 다르다는 건 의심할 여지가 없어요.",
          examples: [
            {
              topic: "집",
              sentence:
                "There's no doubt that housing today is very different from what it used to be.",
              highlight: "housing",
            },
            {
              topic: "직장",
              sentence:
                "There's no doubt that work today is very different from what it used to be.",
              highlight: "work",
            },
            {
              topic: "영화",
              sentence:
                "There's no doubt that movies today are very different from what they used to be.",
              highlight: "movies",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "구체적인 변화와 차이를 묘사하는 패턴",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "comp_2_01",
          template:
            "In the past, people used to [동사], but these days, they [동사].",
          translation:
            "과거에는 사람들이 [~]했는데, 요즘에는 [~]해요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "In the past, people used to go to department stores, but these days, they shop online.",
              highlight: "go to department stores, ... shop online",
            },
            {
              topic: "전화기",
              sentence:
                "In the past, people used to use landline phones, but these days, they use smartphones.",
              highlight: "use landline phones, ... use smartphones",
            },
            {
              topic: "음악",
              sentence:
                "In the past, people used to buy CDs, but these days, they stream music.",
              highlight: "buy CDs, ... stream music",
            },
          ],
        },
        {
          id: "comp_2_02",
          template:
            "Compared to before, [주제] has become much more [형용사].",
          translation:
            "이전에 비해, [주제]가 훨씬 더 [편리해/다양해]졌어요.",
          examples: [
            {
              topic: "교통",
              sentence:
                "Compared to before, public transportation has become much more convenient.",
              highlight: "public transportation, ... convenient",
            },
            {
              topic: "음식점",
              sentence:
                "Compared to before, food delivery has become much more popular.",
              highlight: "food delivery, ... popular",
            },
            {
              topic: "기술",
              sentence:
                "Compared to before, smartphones have become much more advanced.",
              highlight: "smartphones, ... advanced",
            },
          ],
        },
        {
          id: "comp_2_03",
          template:
            "One of the biggest changes is that [주어] now [동사] instead of [동사].",
          translation:
            "가장 큰 변화 중 하나는 [~] 대신 이제 [~]한다는 거예요.",
          examples: [
            {
              topic: "은행",
              sentence:
                "One of the biggest changes is that people now use mobile banking instead of visiting the bank.",
              highlight: "use mobile banking, ... visiting the bank",
            },
            {
              topic: "영화",
              sentence:
                "One of the biggest changes is that people now watch movies at home instead of going to theaters.",
              highlight: "watch movies at home, ... going to theaters",
            },
            {
              topic: "인터넷",
              sentence:
                "One of the biggest changes is that people now read e-books instead of buying paper books.",
              highlight: "read e-books, ... buying paper books",
            },
          ],
        },
        {
          id: "comp_2_04",
          template:
            "Back then, it was common to [동사], but now it's more common to [동사].",
          translation:
            "그때는 [~]하는 게 흔했지만, 지금은 [~]하는 게 더 흔해요.",
          examples: [
            {
              topic: "여행",
              sentence:
                "Back then, it was common to travel by train, but now it's more common to fly.",
              highlight: "travel by train, ... fly",
            },
            {
              topic: "전화기",
              sentence:
                "Back then, it was common to use flip phones, but now it's more common to use smartphones.",
              highlight: "use flip phones, ... use smartphones",
            },
            {
              topic: "인터넷",
              sentence:
                "Back then, it was common to study at the library, but now it's more common to take online courses.",
              highlight: "study at the library, ... take online courses",
            },
          ],
        },
        {
          id: "comp_2_05",
          template:
            "Another noticeable difference is that [주어] [동사] much more/less than before.",
          translation:
            "또 다른 눈에 띄는 차이는 [~]가 예전보다 훨씬 더/덜 [~]한다는 거예요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "Another noticeable difference is that people exercise much more than before.",
              highlight: "exercise much more",
            },
            {
              topic: "텔레비전",
              sentence:
                "Another noticeable difference is that people watch TV much less than before.",
              highlight: "watch TV much less",
            },
            {
              topic: "음식점",
              sentence:
                "Another noticeable difference is that people eat out much more than before.",
              highlight: "eat out much more",
            },
          ],
        },
        {
          id: "comp_2_06",
          template:
            "When I was younger, I used to [동사], but now I prefer [동사].",
          translation:
            "제가 어렸을 때는 [~]했지만, 지금은 [~]하는 걸 더 좋아해요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "When I was younger, I used to play video games, but now I prefer reading books.",
              highlight: "play video games, ... reading books",
            },
            {
              topic: "음식",
              sentence:
                "When I was younger, I used to eat fast food, but now I prefer home-cooked meals.",
              highlight: "eat fast food, ... home-cooked meals",
            },
            {
              topic: "음악",
              sentence:
                "When I was younger, I used to listen to pop music, but now I prefer jazz.",
              highlight: "listen to pop music, ... jazz",
            },
          ],
        },
        {
          id: "comp_2_07",
          template:
            "The way people [동사] has totally changed thanks to [명사].",
          translation:
            "[명사] 덕분에 사람들이 [~]하는 방식이 완전히 바뀌었어요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "The way people communicate has totally changed thanks to the internet.",
              highlight: "communicate, ... the internet",
            },
            {
              topic: "쇼핑",
              sentence:
                "The way people shop has totally changed thanks to online stores.",
              highlight: "shop, ... online stores",
            },
            {
              topic: "기술",
              sentence:
                "The way people learn has totally changed thanks to online platforms.",
              highlight: "learn, ... online platforms",
            },
          ],
        },
        {
          id: "comp_2_08",
          template:
            "These days, [주제] is much more [형용사] than it was [기간] ago.",
          translation:
            "요즘 [주제]는 [기간] 전보다 훨씬 [~]해요.",
          examples: [
            {
              topic: "음식점",
              sentence:
                "These days, food delivery is much more convenient than it was ten years ago.",
              highlight: "food delivery, ... convenient, ... ten years ago",
            },
            {
              topic: "해외여행",
              sentence:
                "These days, traveling abroad is much more affordable than it was a decade ago.",
              highlight: "traveling abroad, ... affordable, ... a decade ago",
            },
            {
              topic: "패션",
              sentence:
                "These days, fashion trends change much faster than they did five years ago.",
              highlight: "fashion trends, ... change much faster, ... five years ago",
            },
          ],
        },
        {
          id: "comp_2_09",
          template:
            "Unlike in the past, now we can easily [동사] anytime and anywhere.",
          translation:
            "과거와 달리, 이제 우리는 언제 어디서든 쉽게 [~]할 수 있어요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "Unlike in the past, now we can easily buy things online anytime and anywhere.",
              highlight: "buy things online",
            },
            {
              topic: "인터넷",
              sentence:
                "Unlike in the past, now we can easily search for information anytime and anywhere.",
              highlight: "search for information",
            },
            {
              topic: "전화기",
              sentence:
                "Unlike in the past, now we can easily video call our friends anytime and anywhere.",
              highlight: "video call our friends",
            },
          ],
        },
        {
          id: "comp_2_10",
          template:
            "I remember that [주제] used to be [형용사], but it's completely different now.",
          translation:
            "[주제]가 [~]했던 게 기억나는데, 지금은 완전히 달라요.",
          examples: [
            {
              topic: "집",
              sentence:
                "I remember that my neighborhood used to be very quiet, but it's completely different now.",
              highlight: "very quiet",
            },
            {
              topic: "직장",
              sentence:
                "I remember that the office used to be very strict, but it's completely different now.",
              highlight: "very strict",
            },
            {
              topic: "전화기",
              sentence:
                "I remember that phones used to be very simple, but it's completely different now.",
              highlight: "very simple",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "변화에 대한 나의 생각과 감정을 표현하는 패턴",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "comp_3_01",
          template:
            "I think this change is mostly positive because it makes our lives more [형용사].",
          translation:
            "이 변화가 대체로 긍정적이라고 생각해요. 우리 삶을 더 [편리하게/풍요롭게] 만들어주니까요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "I think this change is mostly positive because it makes our lives more convenient.",
              highlight: "convenient",
            },
            {
              topic: "인터넷",
              sentence:
                "I think this change is mostly positive because it makes our lives more connected.",
              highlight: "connected",
            },
            {
              topic: "건강",
              sentence:
                "I think this change is mostly positive because it makes our lives more healthy.",
              highlight: "healthy",
            },
          ],
        },
        {
          id: "comp_3_02",
          template:
            "Personally, I think the new way is better because [이유].",
          translation:
            "개인적으로 새로운 방식이 더 낫다고 생각해요. [이유]이거든요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "Personally, I think online shopping is better because it saves a lot of time.",
              highlight: "it saves a lot of time",
            },
            {
              topic: "전화기",
              sentence:
                "Personally, I think texting is better because it's quicker and easier.",
              highlight: "it's quicker and easier",
            },
            {
              topic: "음악",
              sentence:
                "Personally, I think streaming is better because you can listen to anything you want.",
              highlight: "you can listen to anything you want",
            },
          ],
        },
        {
          id: "comp_3_03",
          template:
            "Sometimes I miss the old days when [과거 상황], though.",
          translation:
            "그래도 가끔은 [과거 상황]이었던 옛날이 그리워요.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "Sometimes I miss the old days when people talked face to face more often, though.",
              highlight: "people talked face to face more often",
            },
            {
              topic: "자유시간",
              sentence:
                "Sometimes I miss the old days when kids played outside all day, though.",
              highlight: "kids played outside all day",
            },
            {
              topic: "음악",
              sentence:
                "Sometimes I miss the old days when people bought physical albums, though.",
              highlight: "people bought physical albums",
            },
          ],
        },
        {
          id: "comp_3_04",
          template:
            "I'm glad that things have improved, especially when it comes to [주제].",
          translation:
            "특히 [주제]에 관해서는, 상황이 좋아져서 기뻐요.",
          examples: [
            {
              topic: "병원",
              sentence:
                "I'm glad that things have improved, especially when it comes to healthcare.",
              highlight: "healthcare",
            },
            {
              topic: "교통",
              sentence:
                "I'm glad that things have improved, especially when it comes to public transportation.",
              highlight: "public transportation",
            },
            {
              topic: "재활용",
              sentence:
                "I'm glad that things have improved, especially when it comes to recycling.",
              highlight: "recycling",
            },
          ],
        },
        {
          id: "comp_3_05",
          template:
            "It's amazing how fast [주제] has changed in just a few years.",
          translation:
            "불과 몇 년 사이에 [주제]가 얼마나 빠르게 변했는지 놀라워요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "It's amazing how fast technology has changed in just a few years.",
              highlight: "technology",
            },
            {
              topic: "음식점",
              sentence:
                "It's amazing how fast the restaurant industry has changed in just a few years.",
              highlight: "the restaurant industry",
            },
            {
              topic: "패션",
              sentence:
                "It's amazing how fast fashion trends have changed in just a few years.",
              highlight: "fashion trends",
            },
          ],
        },
        {
          id: "comp_3_06",
          template:
            "To be honest, I have mixed feelings about this change.",
          translation:
            "솔직히 말해서, 이 변화에 대해 복잡한 감정이 들어요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "To be honest, I have mixed feelings about the rise of social media.",
              highlight: "the rise of social media",
            },
            {
              topic: "직장",
              sentence:
                "To be honest, I have mixed feelings about working from home.",
              highlight: "working from home",
            },
            {
              topic: "기술",
              sentence:
                "To be honest, I have mixed feelings about AI becoming so common.",
              highlight: "AI becoming so common",
            },
          ],
        },
        {
          id: "comp_3_07",
          template:
            "I believe this trend will keep growing because [이유].",
          translation:
            "이 트렌드가 계속 커질 거라고 생각해요. [이유]이니까요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "I believe this trend will keep growing because everything is going digital.",
              highlight: "everything is going digital",
            },
            {
              topic: "건강",
              sentence:
                "I believe this trend will keep growing because people care more about health.",
              highlight: "people care more about health",
            },
            {
              topic: "재활용",
              sentence:
                "I believe this trend will keep growing because environmental awareness is increasing.",
              highlight: "environmental awareness is increasing",
            },
          ],
        },
        {
          id: "comp_3_08",
          template:
            "I feel grateful that we live in a time where [상황].",
          translation:
            "[상황]인 시대에 살고 있어서 감사하게 느껴요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "I feel grateful that we live in a time where information is easily accessible.",
              highlight: "information is easily accessible",
            },
            {
              topic: "병원",
              sentence:
                "I feel grateful that we live in a time where medical technology is so advanced.",
              highlight: "medical technology is so advanced",
            },
            {
              topic: "전화기",
              sentence:
                "I feel grateful that we live in a time where we can connect with anyone in the world.",
              highlight: "we can connect with anyone in the world",
            },
          ],
        },
        {
          id: "comp_3_09",
          template:
            "On the other hand, there are some downsides to this change, such as [단점].",
          translation:
            "반면에, 이 변화에는 [단점] 같은 안 좋은 점도 있어요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "On the other hand, there are some downsides to this change, such as people spending too much time on their phones.",
              highlight: "people spending too much time on their phones",
            },
            {
              topic: "음식점",
              sentence:
                "On the other hand, there are some downsides to this change, such as too much packaging waste.",
              highlight: "too much packaging waste",
            },
            {
              topic: "인터넷",
              sentence:
                "On the other hand, there are some downsides to this change, such as privacy concerns.",
              highlight: "privacy concerns",
            },
          ],
        },
        {
          id: "comp_3_10",
          template:
            "Overall, I think the benefits outweigh the drawbacks.",
          translation:
            "전반적으로, 장점이 단점보다 더 크다고 생각해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "When it comes to technology, I think the benefits outweigh the drawbacks.",
              highlight: "technology",
            },
            {
              topic: "직장",
              sentence:
                "When it comes to remote work, I think the benefits outweigh the drawbacks.",
              highlight: "remote work",
            },
            {
              topic: "쇼핑",
              sentence:
                "When it comes to online shopping, I think the benefits outweigh the drawbacks.",
              highlight: "online shopping",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "변화를 정리하며 끝내는 패턴",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "comp_4_01",
          template:
            "So, that's how [주제] has changed over time. It's quite interesting, actually.",
          translation:
            "이렇게 [주제]가 시간이 지나면서 변해왔어요. 사실 꽤 흥미로운 일이죠.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "So, that's how shopping has changed over time. It's quite interesting, actually.",
              highlight: "shopping",
            },
            {
              topic: "전화기",
              sentence:
                "So, that's how phones have changed over time. It's quite interesting, actually.",
              highlight: "phones",
            },
            {
              topic: "여행",
              sentence:
                "So, that's how traveling has changed over time. It's quite interesting, actually.",
              highlight: "traveling",
            },
          ],
        },
        {
          id: "comp_4_02",
          template:
            "In the end, change is inevitable, and I think we just need to adapt to it.",
          translation:
            "결국 변화는 피할 수 없고, 그저 적응해야 한다고 생각해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "When it comes to new technology, change is inevitable, and I think we just need to adapt to it.",
              highlight: "new technology",
            },
            {
              topic: "직장",
              sentence:
                "When it comes to the work environment, change is inevitable, and I think we just need to adapt to it.",
              highlight: "the work environment",
            },
            {
              topic: "교통",
              sentence:
                "When it comes to the transportation system, change is inevitable, and I think we just need to adapt to it.",
              highlight: "the transportation system",
            },
          ],
        },
        {
          id: "comp_4_03",
          template:
            "I'm really curious to see how [주제] will continue to change in the future.",
          translation:
            "앞으로 [주제]가 어떻게 계속 변할지 정말 궁금해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "I'm really curious to see how technology will continue to change in the future.",
              highlight: "technology",
            },
            {
              topic: "패션",
              sentence:
                "I'm really curious to see how fashion will continue to change in the future.",
              highlight: "fashion",
            },
            {
              topic: "집",
              sentence:
                "I'm really curious to see how housing will continue to change in the future.",
              highlight: "housing",
            },
          ],
        },
        {
          id: "comp_4_04",
          template:
            "All things considered, I believe both the past and the present have their own advantages.",
          translation:
            "모든 걸 고려하면, 과거와 현재 모두 각자의 장점이 있다고 생각해요.",
          examples: [
            {
              topic: "전화기",
              sentence:
                "When it comes to communication, I believe both the past and the present have their own advantages.",
              highlight: "communication",
            },
            {
              topic: "음식",
              sentence:
                "When it comes to food culture, I believe both the past and the present have their own advantages.",
              highlight: "food culture",
            },
            {
              topic: "자유시간",
              sentence:
                "When it comes to leisure activities, I believe both the past and the present have their own advantages.",
              highlight: "leisure activities",
            },
          ],
        },
        {
          id: "comp_4_05",
          template:
            "That's basically the main differences I can think of regarding [주제].",
          translation:
            "이게 [주제]에 대해 제가 떠올릴 수 있는 주요 차이점이에요.",
          examples: [
            {
              topic: "집",
              sentence:
                "That's basically the main differences I can think of regarding daily life.",
              highlight: "daily life",
            },
            {
              topic: "기술",
              sentence:
                "That's basically the main differences I can think of regarding technology.",
              highlight: "technology",
            },
            {
              topic: "패션",
              sentence:
                "That's basically the main differences I can think of regarding fashion.",
              highlight: "fashion",
            },
          ],
        },
      ],
    },
  ],
};
