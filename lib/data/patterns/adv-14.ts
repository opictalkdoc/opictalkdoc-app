import type { PatternSet } from "@/lib/types/patterns";

export const adv14Patterns: PatternSet = {
  questionType: "adv_14",
  label: "비교·변화",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "비교 주제를 소개하고 과거와 현재의 차이를 자연스럽게 꺼내는 시작 문장들",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "adv14_1_01",
          template:
            "Compared to the past, [주제] has changed a lot these days.",
          translation:
            "과거와 비교하면, [주제]가 요즘 많이 변했어요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "Compared to the past, the way people shop has changed a lot these days.",
              highlight: "the way people shop",
            },
            {
              topic: "교통",
              sentence:
                "Compared to the past, transportation has changed a lot these days.",
              highlight: "transportation",
            },
            {
              topic: "음악",
              sentence:
                "Compared to the past, the way people listen to music has changed a lot these days.",
              highlight: "the way people listen to music",
            },
          ],
        },
        {
          id: "adv14_1_02",
          template:
            "When I think about [주제], there are some clear differences between the past and now.",
          translation:
            "[주제]에 대해 생각해보면, 과거와 지금 사이에 분명한 차이가 있어요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "When I think about technology, there are some clear differences between the past and now.",
              highlight: "technology",
            },
            {
              topic: "음식",
              sentence:
                "When I think about eating habits, there are some clear differences between the past and now.",
              highlight: "eating habits",
            },
            {
              topic: "전화기",
              sentence:
                "When I think about phones, there are some clear differences between the past and now.",
              highlight: "phones",
            },
          ],
        },
        {
          id: "adv14_1_03",
          template:
            "These days, [주제] is very different from what it used to be.",
          translation:
            "요즘 [주제]는 예전과 아주 달라요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "These days, online shopping is very different from what it used to be.",
              highlight: "online shopping",
            },
            {
              topic: "헬스클럽",
              sentence:
                "These days, working out at a gym is very different from what it used to be.",
              highlight: "working out at a gym",
            },
            {
              topic: "자유시간",
              sentence:
                "These days, how people spend their free time is very different from what it used to be.",
              highlight: "how people spend their free time",
            },
          ],
        },
        {
          id: "adv14_1_04",
          template:
            "I'd like to talk about how [주제] has changed over the years.",
          translation:
            "[주제]가 세월이 지나면서 어떻게 변했는지 이야기해볼게요.",
          examples: [
            {
              topic: "집",
              sentence:
                "I'd like to talk about how housing has changed over the years.",
              highlight: "housing",
            },
            {
              topic: "교통",
              sentence:
                "I'd like to talk about how transportation has changed over the years.",
              highlight: "transportation",
            },
            {
              topic: "직장",
              sentence:
                "I'd like to talk about how working culture has changed over the years.",
              highlight: "working culture",
            },
          ],
        },
        {
          id: "adv14_1_05",
          template:
            "If you compare [A] and [B], you can see a big difference.",
          translation:
            "[A]와 [B]를 비교하면, 큰 차이를 볼 수 있어요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "If you compare offline shopping and online shopping, you can see a big difference.",
              highlight: "offline shopping and online shopping",
            },
            {
              topic: "텔레비전",
              sentence:
                "If you compare traditional TV and streaming services, you can see a big difference.",
              highlight: "traditional TV and streaming services",
            },
            {
              topic: "음식",
              sentence:
                "If you compare home cooking and eating out, you can see a big difference.",
              highlight: "home cooking and eating out",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "구체적인 비교 분석과 변화의 원인, 장단점을 설명하는 핵심 문장들",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "adv14_2_01",
          template:
            "In the past, people used to [과거 행동], but now they [현재 행동].",
          translation:
            "과거에는 사람들이 [과거 행동]했지만, 지금은 [현재 행동]해요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "In the past, people used to go to department stores, but now they shop online.",
              highlight: "go to department stores, ... shop online",
            },
            {
              topic: "전화기",
              sentence:
                "In the past, people used to use landline phones, but now they use smartphones.",
              highlight: "use landline phones, ... use smartphones",
            },
            {
              topic: "음악",
              sentence:
                "In the past, people used to buy CDs, but now they use streaming services.",
              highlight: "buy CDs, ... use streaming services",
            },
          ],
        },
        {
          id: "adv14_2_02",
          template:
            "One major advantage of [현재] over [과거] is that [장점].",
          translation:
            "[과거]와 비교해 [현재]의 큰 장점 중 하나는 [장점]이에요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "One major advantage of online shopping over offline shopping is that you can compare prices easily.",
              highlight: "online shopping, ... offline shopping, ... you can compare prices easily",
            },
            {
              topic: "직장",
              sentence:
                "One major advantage of remote work over office work is that you save commuting time.",
              highlight: "remote work, ... office work, ... you save commuting time",
            },
            {
              topic: "텔레비전",
              sentence:
                "One major advantage of streaming over cable TV is that you can watch anything anytime.",
              highlight: "streaming, ... cable TV, ... you can watch anything anytime",
            },
          ],
        },
        {
          id: "adv14_2_03",
          template:
            "However, there are also some downsides. For example, [단점].",
          translation:
            "하지만 단점도 있어요. 예를 들어, [단점]이에요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "However, there are also some downsides. For example, you can't try on clothes before buying.",
              highlight: "you can't try on clothes before buying",
            },
            {
              topic: "기술",
              sentence:
                "However, there are also some downsides. For example, people spend too much time on their phones.",
              highlight: "people spend too much time on their phones",
            },
            {
              topic: "음식",
              sentence:
                "However, there are also some downsides. For example, delivery food creates a lot of plastic waste.",
              highlight: "delivery food creates a lot of plastic waste",
            },
          ],
        },
        {
          id: "adv14_2_04",
          template:
            "The biggest change I've noticed is [변화 내용].",
          translation:
            "제가 느낀 가장 큰 변화는 [변화 내용]이에요.",
          examples: [
            {
              topic: "교통",
              sentence:
                "The biggest change I've noticed is that public transportation has become much more convenient.",
              highlight: "public transportation has become much more convenient",
            },
            {
              topic: "쇼핑",
              sentence:
                "The biggest change I've noticed is that most people prefer shopping with their phones.",
              highlight: "most people prefer shopping with their phones",
            },
            {
              topic: "건강식품",
              sentence:
                "The biggest change I've noticed is that healthy food has become more popular.",
              highlight: "healthy food has become more popular",
            },
          ],
        },
        {
          id: "adv14_2_05",
          template:
            "On the other hand, [반대 관점] is also worth considering.",
          translation:
            "반면에, [반대 관점]도 고려할 가치가 있어요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "On the other hand, the risk of losing personal data is also worth considering.",
              highlight: "the risk of losing personal data",
            },
            {
              topic: "집",
              sentence:
                "On the other hand, the high cost of living in big cities is also worth considering.",
              highlight: "the high cost of living in big cities",
            },
            {
              topic: "인터넷",
              sentence:
                "On the other hand, the lack of social interaction in online classes is also worth considering.",
              highlight: "the lack of social interaction in online classes",
            },
          ],
        },
        {
          id: "adv14_2_06",
          template:
            "This change happened mainly because [원인].",
          translation:
            "이런 변화가 일어난 건 주로 [원인] 때문이에요.",
          examples: [
            {
              topic: "전화기",
              sentence:
                "This change happened mainly because smartphone technology developed so fast.",
              highlight: "smartphone technology developed so fast",
            },
            {
              topic: "음식",
              sentence:
                "This change happened mainly because people's lifestyles became busier.",
              highlight: "people's lifestyles became busier",
            },
            {
              topic: "재활용",
              sentence:
                "This change happened mainly because people became more aware of environmental issues.",
              highlight: "people became more aware of environmental issues",
            },
          ],
        },
        {
          id: "adv14_2_07",
          template:
            "While [과거] had its charm, [현재] is definitely more [형용사].",
          translation:
            "[과거]도 나름의 매력이 있었지만, [현재]가 확실히 더 [형용사]해요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "While going to stores had its charm, online shopping is definitely more convenient.",
              highlight: "going to stores, ... online shopping, ... more convenient",
            },
            {
              topic: "여행",
              sentence:
                "While package tours had their charm, independent travel is definitely more flexible.",
              highlight: "package tours, ... independent travel, ... more flexible",
            },
            {
              topic: "전화기",
              sentence:
                "While handwritten letters had their charm, digital messaging is definitely more efficient.",
              highlight: "handwritten letters, ... digital messaging, ... more efficient",
            },
          ],
        },
        {
          id: "adv14_2_08",
          template:
            "Another thing that has changed is [변화]. This is because [이유].",
          translation:
            "또 변한 건 [변화]이에요. 이건 [이유] 때문이에요.",
          examples: [
            {
              topic: "집",
              sentence:
                "Another thing that has changed is apartment design. This is because people now need home offices.",
              highlight: "apartment design, ... people now need home offices",
            },
            {
              topic: "음식",
              sentence:
                "Another thing that has changed is how often people eat out. This is because delivery apps are so easy to use.",
              highlight: "how often people eat out, ... delivery apps are so easy to use",
            },
            {
              topic: "자유시간",
              sentence:
                "Another thing that has changed is how people enjoy hobbies. This is because there are many online platforms now.",
              highlight: "how people enjoy hobbies, ... many online platforms now",
            },
          ],
        },
        {
          id: "adv14_2_09",
          template:
            "Back in the day, [과거 상황]. Nowadays, [현재 상황].",
          translation:
            "옛날에는 [과거 상황]이었어요. 요즘에는 [현재 상황]이에요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "Back in the day, students only learned from textbooks. Nowadays, they use tablets and online resources.",
              highlight: "only learned from textbooks, ... use tablets and online resources",
            },
            {
              topic: "쇼핑",
              sentence:
                "Back in the day, people had to visit stores in person. Nowadays, everything can be ordered with one click.",
              highlight: "visit stores in person, ... ordered with one click",
            },
            {
              topic: "텔레비전",
              sentence:
                "Back in the day, people mostly watched TV at home. Nowadays, they watch content on their phones anywhere.",
              highlight: "watched TV at home, ... watch content on their phones anywhere",
            },
          ],
        },
        {
          id: "adv14_2_10",
          template:
            "Both [A] and [B] have their pros and cons, but overall I think [결론].",
          translation:
            "[A]와 [B] 모두 장단점이 있지만, 전체적으로 [결론]이라고 생각해요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "Both online and offline shopping have their pros and cons, but overall I think online is more practical.",
              highlight: "online is more practical",
            },
            {
              topic: "인터넷",
              sentence:
                "Both online and in-person classes have their pros and cons, but overall I think a mix of both is best.",
              highlight: "a mix of both is best",
            },
            {
              topic: "직장",
              sentence:
                "Both remote and office work have their pros and cons, but overall I think flexibility matters most.",
              highlight: "flexibility matters most",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "비교 결과에 대한 나의 의견, 선호, 감정을 진솔하게 표현하는 문장들",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "adv14_3_01",
          template:
            "Personally, I prefer [선택] because [이유].",
          translation:
            "개인적으로 저는 [선택]을 더 좋아해요. 왜냐하면 [이유] 때문이에요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "Personally, I prefer online shopping because I can compare prices easily.",
              highlight: "online shopping, ... compare prices easily",
            },
            {
              topic: "음악",
              sentence:
                "Personally, I prefer streaming music because I can listen to any song instantly.",
              highlight: "streaming music, ... listen to any song instantly",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Personally, I prefer going to the gym because it keeps me motivated.",
              highlight: "going to the gym, ... keeps me motivated",
            },
          ],
        },
        {
          id: "adv14_3_02",
          template:
            "In my opinion, the change has been mostly positive because [이유].",
          translation:
            "제 생각에는 이 변화가 대체로 긍정적이에요. 왜냐하면 [이유] 때문이에요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "In my opinion, the change has been mostly positive because technology makes our lives easier.",
              highlight: "technology makes our lives easier",
            },
            {
              topic: "교통",
              sentence:
                "In my opinion, the change has been mostly positive because public transit is now much faster.",
              highlight: "public transit is now much faster",
            },
            {
              topic: "병원",
              sentence:
                "In my opinion, the change has been mostly positive because we have better access to healthcare.",
              highlight: "we have better access to healthcare",
            },
          ],
        },
        {
          id: "adv14_3_03",
          template:
            "I sometimes miss the old days when [과거 모습], but I also enjoy [현재 장점].",
          translation:
            "[과거 모습]이던 옛날이 그리울 때도 있지만, [현재 장점]도 즐기고 있어요.",
          examples: [
            {
              topic: "전화기",
              sentence:
                "I sometimes miss the old days when people talked face to face, but I also enjoy the convenience of messaging.",
              highlight: "people talked face to face, ... the convenience of messaging",
            },
            {
              topic: "여행",
              sentence:
                "I sometimes miss the old days when travel was simpler, but I also enjoy all the options we have now.",
              highlight: "travel was simpler, ... all the options we have now",
            },
            {
              topic: "음악",
              sentence:
                "I sometimes miss the old days when I collected CDs, but I also enjoy streaming millions of songs.",
              highlight: "I collected CDs, ... streaming millions of songs",
            },
          ],
        },
        {
          id: "adv14_3_04",
          template:
            "I think this is a positive/negative trend because [이유].",
          translation:
            "이건 긍정적인/부정적인 트렌드라고 생각해요. 왜냐하면 [이유] 때문이에요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "I think this is a positive trend because more people are taking care of their health.",
              highlight: "more people are taking care of their health",
            },
            {
              topic: "기술",
              sentence:
                "I think this is a negative trend because people are becoming too dependent on their phones.",
              highlight: "people are becoming too dependent on their phones",
            },
            {
              topic: "재활용",
              sentence:
                "I think this is a positive trend because people are using less plastic than before.",
              highlight: "people are using less plastic than before",
            },
          ],
        },
        {
          id: "adv14_3_05",
          template:
            "What surprises me the most is [놀라운 변화].",
          translation:
            "가장 놀라운 건 [놀라운 변화]이에요.",
          examples: [
            {
              topic: "쇼핑",
              sentence:
                "What surprises me the most is how fast same-day delivery has become normal.",
              highlight: "how fast same-day delivery has become normal",
            },
            {
              topic: "인터넷",
              sentence:
                "What surprises me the most is how many people take online courses now.",
              highlight: "how many people take online courses now",
            },
            {
              topic: "건강식품",
              sentence:
                "What surprises me the most is how popular plant-based food has become.",
              highlight: "how popular plant-based food has become",
            },
          ],
        },
        {
          id: "adv14_3_06",
          template:
            "I have to admit, I was skeptical at first, but now I think [결론].",
          translation:
            "솔직히 처음엔 반신반의했는데, 지금은 [결론]이라고 생각해요.",
          examples: [
            {
              topic: "직장",
              sentence:
                "I have to admit, I was skeptical at first, but now I think remote work is actually very productive.",
              highlight: "remote work is actually very productive",
            },
            {
              topic: "기술",
              sentence:
                "I have to admit, I was skeptical at first, but now I think e-books are really convenient.",
              highlight: "e-books are really convenient",
            },
            {
              topic: "쇼핑",
              sentence:
                "I have to admit, I was skeptical at first, but now I think self-service stores are pretty efficient.",
              highlight: "self-service stores are pretty efficient",
            },
          ],
        },
        {
          id: "adv14_3_07",
          template:
            "I feel like [감정/의견] about this change, especially when it comes to [구체적 측면].",
          translation:
            "이 변화에 대해 [감정/의견]을 느껴요, 특히 [구체적 측면]에 관해서요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "I feel pretty optimistic about this change, especially when it comes to eco-friendly packaging.",
              highlight: "pretty optimistic, ... eco-friendly packaging",
            },
            {
              topic: "인터넷",
              sentence:
                "I feel a bit concerned about this change, especially when it comes to children's screen time.",
              highlight: "a bit concerned, ... children's screen time",
            },
            {
              topic: "직장",
              sentence:
                "I feel quite positive about this change, especially when it comes to work-life balance.",
              highlight: "quite positive, ... work-life balance",
            },
          ],
        },
        {
          id: "adv14_3_08",
          template:
            "Honestly, I think [과거/현재] was/is better in terms of [측면].",
          translation:
            "솔직히, [측면]에 있어서는 [과거/현재]가 더 나았다고/낫다고 생각해요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "Honestly, I think the past was better in terms of food quality.",
              highlight: "the past, ... food quality",
            },
            {
              topic: "기술",
              sentence:
                "Honestly, I think now is better in terms of convenience.",
              highlight: "now, ... convenience",
            },
            {
              topic: "가족/친구",
              sentence:
                "Honestly, I think the past was better in terms of personal relationships.",
              highlight: "the past, ... personal relationships",
            },
          ],
        },
        {
          id: "adv14_3_09",
          template:
            "I believe this change reflects [사회적 변화].",
          translation:
            "이 변화가 [사회적 변화]를 반영한다고 생각해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "I believe this change reflects how much people value convenience today.",
              highlight: "how much people value convenience today",
            },
            {
              topic: "건강",
              sentence:
                "I believe this change reflects growing awareness about mental health.",
              highlight: "growing awareness about mental health",
            },
            {
              topic: "재활용",
              sentence:
                "I believe this change reflects people's concern about the environment.",
              highlight: "people's concern about the environment",
            },
          ],
        },
        {
          id: "adv14_3_10",
          template:
            "Looking at both sides, I'd say [종합 의견].",
          translation:
            "양쪽을 다 보면, [종합 의견]이라고 말할 수 있어요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "Looking at both sides, I'd say technology has brought more good than harm.",
              highlight: "technology has brought more good than harm",
            },
            {
              topic: "집",
              sentence:
                "Looking at both sides, I'd say city life is more stressful but also more exciting.",
              highlight: "city life is more stressful but also more exciting",
            },
            {
              topic: "인터넷",
              sentence:
                "Looking at both sides, I'd say modern education is more diverse and accessible.",
              highlight: "modern education is more diverse and accessible",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "비교 분석을 깔끔하게 정리하며 답변을 마무리하는 문장들",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "adv14_4_01",
          template:
            "That's why I think [결론]. Things have really changed over time.",
          translation:
            "그래서 [결론]이라고 생각해요. 시간이 지나면서 정말 많이 변했어요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "That's why I think technology has made life better. Things have really changed over time.",
              highlight: "technology has made life better",
            },
            {
              topic: "쇼핑",
              sentence:
                "That's why I think online shopping is here to stay. Things have really changed over time.",
              highlight: "online shopping is here to stay",
            },
            {
              topic: "전화기",
              sentence:
                "That's why I think communication is much easier now. Things have really changed over time.",
              highlight: "communication is much easier now",
            },
          ],
        },
        {
          id: "adv14_4_02",
          template:
            "In the future, I think [미래 전망] will continue to change.",
          translation:
            "앞으로 [미래 전망]은 계속 변할 거라고 생각해요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "In the future, I think the way we learn will continue to change.",
              highlight: "the way we learn",
            },
            {
              topic: "직장",
              sentence:
                "In the future, I think work culture will continue to change.",
              highlight: "work culture",
            },
            {
              topic: "여행",
              sentence:
                "In the future, I think how people travel will continue to change.",
              highlight: "how people travel",
            },
          ],
        },
        {
          id: "adv14_4_03",
          template:
            "All in all, I think we need to find a balance between [A] and [B].",
          translation:
            "결론적으로, [A]와 [B] 사이에서 균형을 찾아야 한다고 생각해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "All in all, I think we need to find a balance between using technology and spending time offline.",
              highlight: "using technology and spending time offline",
            },
            {
              topic: "음식",
              sentence:
                "All in all, I think we need to find a balance between convenience and healthy eating.",
              highlight: "convenience and healthy eating",
            },
            {
              topic: "직장",
              sentence:
                "All in all, I think we need to find a balance between work and personal life.",
              highlight: "work and personal life",
            },
          ],
        },
        {
          id: "adv14_4_04",
          template:
            "So that's how I see the changes in [주제]. It's been quite an evolution.",
          translation:
            "[주제]의 변화에 대한 제 생각이에요. 꽤 많은 진화가 있었죠.",
          examples: [
            {
              topic: "교통",
              sentence:
                "So that's how I see the changes in transportation. It's been quite an evolution.",
              highlight: "transportation",
            },
            {
              topic: "쇼핑",
              sentence:
                "So that's how I see the changes in shopping. It's been quite an evolution.",
              highlight: "shopping",
            },
            {
              topic: "자유시간",
              sentence:
                "So that's how I see the changes in leisure activities. It's been quite an evolution.",
              highlight: "leisure activities",
            },
          ],
        },
        {
          id: "adv14_4_05",
          template:
            "Overall, change is inevitable, and I think we just need to adapt to [변화].",
          translation:
            "전체적으로 변화는 피할 수 없고, 우리는 [변화]에 적응하면 된다고 생각해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "Overall, change is inevitable, and I think we just need to adapt to new technology.",
              highlight: "new technology",
            },
            {
              topic: "패션",
              sentence:
                "Overall, change is inevitable, and I think we just need to adapt to the new lifestyle.",
              highlight: "the new lifestyle",
            },
            {
              topic: "재활용",
              sentence:
                "Overall, change is inevitable, and I think we just need to adapt to eco-friendly habits.",
              highlight: "eco-friendly habits",
            },
          ],
        },
      ],
    },
  ],
};
