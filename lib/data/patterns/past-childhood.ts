import type { PatternSet } from "@/lib/types/patterns";

export const pastChildhoodPatterns: PatternSet = {
  questionType: "past_childhood",
  label: "경험·처음",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "어릴 때 경험을 회상하며 시작하는 패턴",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "pchd_1_01",
          template:
            "When I was young, I used to [동사] all the time.",
          translation:
            "어렸을 때, 전 항상 [~]하곤 했어요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "When I was young, I used to play outside all the time.",
              highlight: "play outside",
            },
            {
              topic: "텔레비전",
              sentence:
                "When I was young, I used to watch cartoons all the time.",
              highlight: "watch cartoons",
            },
            {
              topic: "자전거",
              sentence:
                "When I was young, I used to ride my bike all the time.",
              highlight: "ride my bike",
            },
          ],
        },
        {
          id: "pchd_1_02",
          template:
            "I remember when I first started [동사]. It was a long time ago.",
          translation:
            "처음으로 [~]를 시작했을 때가 기억나요. 아주 오래전이었죠.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "I remember when I first started exercising. It was a long time ago.",
              highlight: "exercising",
            },
            {
              topic: "음악",
              sentence:
                "I remember when I first started playing the piano. It was a long time ago.",
              highlight: "playing the piano",
            },
            {
              topic: "음식",
              sentence:
                "I remember when I first started cooking. It was a long time ago.",
              highlight: "cooking",
            },
          ],
        },
        {
          id: "pchd_1_03",
          template:
            "Growing up, [주제] was a big part of my childhood.",
          translation:
            "자라면서, [주제]는 제 어린 시절의 큰 부분이었어요.",
          examples: [
            {
              topic: "자전거",
              sentence:
                "Growing up, riding my bike was a big part of my childhood.",
              highlight: "riding my bike",
            },
            {
              topic: "국내여행",
              sentence:
                "Growing up, family trips around Korea were a big part of my childhood.",
              highlight: "family trips around Korea",
            },
            {
              topic: "텔레비전",
              sentence:
                "Growing up, watching TV was a big part of my childhood.",
              highlight: "watching TV",
            },
          ],
        },
        {
          id: "pchd_1_04",
          template:
            "I have a lot of fond memories of [동사] when I was a kid.",
          translation:
            "어렸을 때 [~]했던 좋은 추억이 많아요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "I have a lot of fond memories of playing in the park when I was a kid.",
              highlight: "playing in the park",
            },
            {
              topic: "친척집",
              sentence:
                "I have a lot of fond memories of visiting my relatives when I was a kid.",
              highlight: "visiting my relatives",
            },
            {
              topic: "국내여행",
              sentence:
                "I have a lot of fond memories of going on road trips when I was a kid.",
              highlight: "going on road trips",
            },
          ],
        },
        {
          id: "pchd_1_05",
          template:
            "If I think back to my childhood, the first thing that comes to mind is [주제].",
          translation:
            "어린 시절을 돌이켜보면, 가장 먼저 떠오르는 건 [주제]예요.",
          examples: [
            {
              topic: "휴일",
              sentence:
                "If I think back to my childhood, the first thing that comes to mind is spending holidays with family.",
              highlight: "spending holidays with family",
            },
            {
              topic: "자전거",
              sentence:
                "If I think back to my childhood, the first thing that comes to mind is riding my bike around the neighborhood.",
              highlight: "riding my bike around the neighborhood",
            },
            {
              topic: "가족/친구",
              sentence:
                "If I think back to my childhood, the first thing that comes to mind is spending time with my parents.",
              highlight: "spending time with my parents",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "어릴 때 했던 구체적인 행동과 상황을 묘사하는 패턴",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "pchd_2_01",
          template:
            "Every weekend, my [가족/친구] and I would [동사] together.",
          translation:
            "매 주말마다, [가족/친구]과 함께 [~]하곤 했어요.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "Every weekend, my family and I would go hiking together.",
              highlight: "my family, ... go hiking",
            },
            {
              topic: "자유시간",
              sentence:
                "Every weekend, my friends and I would play soccer together.",
              highlight: "my friends, ... play soccer",
            },
            {
              topic: "국내여행",
              sentence:
                "Every weekend, my dad and I would go on day trips together.",
              highlight: "my dad, ... go on day trips",
            },
          ],
        },
        {
          id: "pchd_2_02",
          template:
            "I remember spending hours [동사] without getting bored.",
          translation:
            "지루하지 않고 몇 시간이고 [~]했던 게 기억나요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "I remember spending hours building Lego sets without getting bored.",
              highlight: "building Lego sets",
            },
            {
              topic: "음악",
              sentence:
                "I remember spending hours listening to music without getting bored.",
              highlight: "listening to music",
            },
            {
              topic: "텔레비전",
              sentence:
                "I remember spending hours watching animated shows without getting bored.",
              highlight: "watching animated shows",
            },
          ],
        },
        {
          id: "pchd_2_03",
          template:
            "At that time, my favorite thing to do was [동사].",
          translation:
            "그때, 제가 가장 좋아했던 건 [~]하는 거였어요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "At that time, my favorite thing to do was play hide-and-seek with my friends.",
              highlight: "play hide-and-seek with my friends",
            },
            {
              topic: "영화",
              sentence:
                "At that time, my favorite thing to do was watch animated movies.",
              highlight: "watch animated movies",
            },
            {
              topic: "음식",
              sentence:
                "At that time, my favorite thing to do was eat my mom's homemade food.",
              highlight: "eat my mom's homemade food",
            },
          ],
        },
        {
          id: "pchd_2_04",
          template:
            "I still clearly remember the day when I [동사] for the first time.",
          translation:
            "처음으로 [~]했던 날이 아직도 선명하게 기억나요.",
          examples: [
            {
              topic: "자전거",
              sentence:
                "I still clearly remember the day when I rode a bicycle for the first time.",
              highlight: "rode a bicycle",
            },
            {
              topic: "해외여행",
              sentence:
                "I still clearly remember the day when I traveled abroad for the first time.",
              highlight: "traveled abroad",
            },
            {
              topic: "여행(공항)",
              sentence:
                "I still clearly remember the day when I flew on a plane for the first time.",
              highlight: "flew on a plane",
            },
          ],
        },
        {
          id: "pchd_2_05",
          template:
            "Back in those days, we didn't have [명사], so we used to [동사] instead.",
          translation:
            "그 시절에는 [명사]가 없었기 때문에, 대신 [~]하곤 했어요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "Back in those days, we didn't have smartphones, so we used to play board games instead.",
              highlight: "smartphones, ... play board games",
            },
            {
              topic: "인터넷",
              sentence:
                "Back in those days, we didn't have the internet, so we used to go to the library instead.",
              highlight: "the internet, ... go to the library",
            },
            {
              topic: "음식점",
              sentence:
                "Back in those days, we didn't have food delivery apps, so we used to eat at home instead.",
              highlight: "food delivery apps, ... eat at home",
            },
          ],
        },
        {
          id: "pchd_2_06",
          template:
            "My [사람] taught me how to [동사] when I was around [나이].",
          translation:
            "[사람]이 제가 [나이]쯤 되었을 때 [~]하는 법을 가르쳐줬어요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "My mom taught me how to cook simple dishes when I was around ten.",
              highlight: "My mom, ... cook simple dishes, ... ten",
            },
            {
              topic: "자전거",
              sentence:
                "My dad taught me how to ride a bike when I was around six.",
              highlight: "My dad, ... ride a bike, ... six",
            },
            {
              topic: "헬스클럽",
              sentence:
                "My uncle taught me how to swim when I was around eight.",
              highlight: "My uncle, ... swim, ... eight",
            },
          ],
        },
        {
          id: "pchd_2_07",
          template:
            "During summer/winter vacation, I would always [동사].",
          translation:
            "여름/겨울 방학 동안, 전 항상 [~]하곤 했어요.",
          examples: [
            {
              topic: "친척집",
              sentence:
                "During summer vacation, I would always visit my grandparents in the countryside.",
              highlight: "visit my grandparents in the countryside",
            },
            {
              topic: "집에서 보내는 휴가",
              sentence:
                "During summer vacation, I would always stay home and play games.",
              highlight: "stay home and play games",
            },
            {
              topic: "국내여행",
              sentence:
                "During winter vacation, I would always go on a family trip.",
              highlight: "go on a family trip",
            },
          ],
        },
        {
          id: "pchd_2_08",
          template:
            "One thing I loved about being a kid was that I could [동사] whenever I wanted.",
          translation:
            "어린 시절에 좋았던 한 가지는 원할 때마다 [~]할 수 있었다는 거예요.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "One thing I loved about being a kid was that I could play with my friends whenever I wanted.",
              highlight: "play with my friends",
            },
            {
              topic: "자유시간",
              sentence:
                "One thing I loved about being a kid was that I could take a nap whenever I wanted.",
              highlight: "take a nap",
            },
            {
              topic: "음식",
              sentence:
                "One thing I loved about being a kid was that I could eat snacks whenever I wanted.",
              highlight: "eat snacks",
            },
          ],
        },
        {
          id: "pchd_2_09",
          template:
            "I used to [동사] almost every day after school.",
          translation:
            "학교 끝나고 거의 매일 [~]하곤 했어요.",
          examples: [
            {
              topic: "자전거",
              sentence:
                "I used to ride my bike almost every day after school.",
              highlight: "ride my bike",
            },
            {
              topic: "텔레비전",
              sentence:
                "I used to watch TV almost every day after school.",
              highlight: "watch TV",
            },
            {
              topic: "음악",
              sentence:
                "I used to practice the piano almost every day after school.",
              highlight: "practice the piano",
            },
          ],
        },
        {
          id: "pchd_2_10",
          template:
            "It was such a simple time, and all I cared about was [동사].",
          translation:
            "정말 단순한 시절이었고, 제가 신경 쓴 건 오직 [~]하는 것뿐이었어요.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "It was such a simple time, and all I cared about was having fun with my friends.",
              highlight: "having fun with my friends",
            },
            {
              topic: "음식",
              sentence:
                "It was such a simple time, and all I cared about was eating my favorite snacks.",
              highlight: "eating my favorite snacks",
            },
            {
              topic: "텔레비전",
              sentence:
                "It was such a simple time, and all I cared about was watching my favorite TV shows.",
              highlight: "watching my favorite TV shows",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "그때의 감정과 지금 돌이켜보는 느낌을 표현하는 패턴",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "pchd_3_01",
          template:
            "Looking back, those were some of the happiest moments of my life.",
          translation:
            "돌이켜보면, 그 시절이 제 인생에서 가장 행복했던 순간들이었어요.",
          examples: [
            {
              topic: "국내여행",
              sentence:
                "Looking back, those family trips were some of the happiest moments of my life.",
              highlight: "those family trips",
            },
            {
              topic: "휴일",
              sentence:
                "Looking back, those holiday celebrations were some of the happiest moments of my life.",
              highlight: "those holiday celebrations",
            },
            {
              topic: "자유시간",
              sentence:
                "Looking back, those carefree playtime moments were some of the happiest moments of my life.",
              highlight: "those carefree playtime moments",
            },
          ],
        },
        {
          id: "pchd_3_02",
          template:
            "I really miss those days, especially the feeling of [감정/상황].",
          translation:
            "그 시절이 정말 그리워요, 특히 [감정/상황]의 느낌이요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "I really miss those days, especially the feeling of having no worries at all.",
              highlight: "having no worries at all",
            },
            {
              topic: "집에서 보내는 휴가",
              sentence:
                "I really miss those days, especially the feeling of staying home with nothing to do.",
              highlight: "staying home with nothing to do",
            },
            {
              topic: "가족/친구",
              sentence:
                "I really miss those days, especially the feeling of hanging out with my childhood friends.",
              highlight: "hanging out with my childhood friends",
            },
          ],
        },
        {
          id: "pchd_3_03",
          template:
            "That experience taught me [교훈], and I'm grateful for it.",
          translation:
            "그 경험이 제게 [교훈]을 가르쳐줬고, 감사하게 생각해요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "That experience taught me the importance of teamwork, and I'm grateful for it.",
              highlight: "the importance of teamwork",
            },
            {
              topic: "자전거",
              sentence:
                "That experience taught me how to be patient, and I'm grateful for it.",
              highlight: "how to be patient",
            },
            {
              topic: "가족/친구",
              sentence:
                "That experience taught me to appreciate small things, and I'm grateful for it.",
              highlight: "to appreciate small things",
            },
          ],
        },
        {
          id: "pchd_3_04",
          template:
            "Whenever I think about it, it brings a smile to my face.",
          translation:
            "생각만 하면, 절로 미소가 지어져요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "Whenever I think about playing with my friends back then, it brings a smile to my face.",
              highlight: "playing with my friends back then",
            },
            {
              topic: "친척집",
              sentence:
                "Whenever I think about visiting my grandma's house, it brings a smile to my face.",
              highlight: "visiting my grandma's house",
            },
            {
              topic: "국내여행",
              sentence:
                "Whenever I think about our family road trips, it brings a smile to my face.",
              highlight: "our family road trips",
            },
          ],
        },
        {
          id: "pchd_3_05",
          template:
            "I think those experiences shaped who I am today.",
          translation:
            "그 경험들이 지금의 저를 만들었다고 생각해요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "I think playing sports as a kid shaped who I am today.",
              highlight: "playing sports as a kid",
            },
            {
              topic: "음악",
              sentence:
                "I think learning music as a child shaped who I am today.",
              highlight: "learning music as a child",
            },
            {
              topic: "가족/친구",
              sentence:
                "I think spending time with my family shaped who I am today.",
              highlight: "spending time with my family",
            },
          ],
        },
        {
          id: "pchd_3_06",
          template:
            "Even now, I sometimes wish I could go back to those carefree days.",
          translation:
            "지금도 가끔, 그 걱정 없던 시절로 돌아갈 수 있으면 좋겠다는 생각이 들어요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "Even now, I sometimes wish I could go back to those carefree school days.",
              highlight: "those carefree school days",
            },
            {
              topic: "휴일",
              sentence:
                "Even now, I sometimes wish I could go back to those carefree holiday breaks.",
              highlight: "those carefree holiday breaks",
            },
            {
              topic: "집",
              sentence:
                "Even now, I sometimes wish I could go back to those carefree childhood days at home.",
              highlight: "those carefree childhood days at home",
            },
          ],
        },
        {
          id: "pchd_3_07",
          template:
            "It was a really precious time, and I wouldn't trade it for anything.",
          translation:
            "정말 소중한 시간이었고, 그 무엇과도 바꾸지 않을 거예요.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "The time I spent with my family was a really precious time, and I wouldn't trade it for anything.",
              highlight: "The time I spent with my family",
            },
            {
              topic: "자유시간",
              sentence:
                "My childhood friendships were a really precious time, and I wouldn't trade them for anything.",
              highlight: "My childhood friendships",
            },
            {
              topic: "자전거",
              sentence:
                "Those days riding bikes outside were a really precious time, and I wouldn't trade them for anything.",
              highlight: "Those days riding bikes outside",
            },
          ],
        },
        {
          id: "pchd_3_08",
          template:
            "I didn't realize how special it was at the time, but now I truly appreciate it.",
          translation:
            "그때는 얼마나 특별한지 몰랐는데, 지금은 정말 감사하게 느껴요.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "I didn't realize how special my parents' love was at the time, but now I truly appreciate it.",
              highlight: "my parents' love",
            },
            {
              topic: "자유시간",
              sentence:
                "I didn't realize how special having free time was at the time, but now I truly appreciate it.",
              highlight: "having free time",
            },
            {
              topic: "집",
              sentence:
                "I didn't realize how special my childhood home was at the time, but now I truly appreciate it.",
              highlight: "my childhood home",
            },
          ],
        },
        {
          id: "pchd_3_09",
          template:
            "It's one of my most cherished memories from childhood.",
          translation:
            "그건 제 어린 시절 가장 소중한 기억 중 하나예요.",
          examples: [
            {
              topic: "생일파티",
              sentence:
                "My birthday parties are one of my most cherished memories from childhood.",
              highlight: "My birthday parties",
            },
            {
              topic: "국내여행",
              sentence:
                "Going on family trips is one of my most cherished memories from childhood.",
              highlight: "Going on family trips",
            },
            {
              topic: "친척집",
              sentence:
                "Staying at my grandma's house is one of my most cherished memories from childhood.",
              highlight: "Staying at my grandma's house",
            },
          ],
        },
        {
          id: "pchd_3_10",
          template:
            "I hope kids these days can have the same kind of wonderful experiences I had.",
          translation:
            "요즘 아이들도 제가 가졌던 것과 같은 멋진 경험을 했으면 좋겠어요.",
          examples: [
            {
              topic: "자전거",
              sentence:
                "I hope kids these days can have the same kind of wonderful experiences riding bikes outside like I had.",
              highlight: "riding bikes outside",
            },
            {
              topic: "가족/친구",
              sentence:
                "I hope kids these days can have the same kind of wonderful experiences with their families like I had.",
              highlight: "with their families",
            },
            {
              topic: "지형",
              sentence:
                "I hope kids these days can have the same kind of wonderful experiences in nature like I had.",
              highlight: "in nature",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "과거 경험을 정리하며 끝내는 패턴",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "pchd_4_01",
          template:
            "So, that's what I remember most about [주제] from my childhood.",
          translation:
            "그래서, 그게 제 어린 시절 [주제]에 대해 가장 기억나는 거예요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "So, that's what I remember most about playing with friends from my childhood.",
              highlight: "playing with friends",
            },
            {
              topic: "국내여행",
              sentence:
                "So, that's what I remember most about family trips from my childhood.",
              highlight: "family trips",
            },
            {
              topic: "휴일",
              sentence:
                "So, that's what I remember most about holiday breaks from my childhood.",
              highlight: "holiday breaks",
            },
          ],
        },
        {
          id: "pchd_4_02",
          template:
            "Those childhood memories will always hold a special place in my heart.",
          translation:
            "그 어린 시절의 추억들은 항상 제 마음속에 특별한 자리를 차지할 거예요.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "Those childhood memories with my family will always hold a special place in my heart.",
              highlight: "with my family",
            },
            {
              topic: "자유시간",
              sentence:
                "Those childhood memories with my best friends will always hold a special place in my heart.",
              highlight: "with my best friends",
            },
            {
              topic: "집",
              sentence:
                "Those childhood memories of my old house will always hold a special place in my heart.",
              highlight: "of my old house",
            },
          ],
        },
        {
          id: "pchd_4_03",
          template:
            "I would love to relive those moments if I could.",
          translation:
            "가능하다면, 그 순간들을 다시 경험하고 싶어요.",
          examples: [
            {
              topic: "집에서 보내는 휴가",
              sentence:
                "I would love to relive those lazy summer days at home if I could.",
              highlight: "those lazy summer days at home",
            },
            {
              topic: "생일파티",
              sentence:
                "I would love to relive those birthday parties if I could.",
              highlight: "those birthday parties",
            },
            {
              topic: "국내여행",
              sentence:
                "I would love to relive those family road trips if I could.",
              highlight: "those family road trips",
            },
          ],
        },
        {
          id: "pchd_4_04",
          template:
            "Even though it was a long time ago, I still remember it like it was yesterday.",
          translation:
            "아주 오래전 일이지만, 마치 어제 일처럼 기억나요.",
          examples: [
            {
              topic: "자전거",
              sentence:
                "Even though learning to ride a bike was a long time ago, I still remember it like it was yesterday.",
              highlight: "learning to ride a bike",
            },
            {
              topic: "해외여행",
              sentence:
                "Even though my first trip abroad was a long time ago, I still remember it like it was yesterday.",
              highlight: "my first trip abroad",
            },
            {
              topic: "휴일",
              sentence:
                "Even though that holiday celebration was a long time ago, I still remember it like it was yesterday.",
              highlight: "that holiday celebration",
            },
          ],
        },
        {
          id: "pchd_4_05",
          template:
            "Anyway, those are my favorite memories from when I was young. They mean a lot to me.",
          translation:
            "어쨌든, 그게 제가 어렸을 때 가장 좋아하는 추억들이에요. 저한테 큰 의미가 있죠.",
          examples: [
            {
              topic: "가족/친구",
              sentence:
                "Anyway, those are my favorite memories of spending time with family. They mean a lot to me.",
              highlight: "spending time with family",
            },
            {
              topic: "자유시간",
              sentence:
                "Anyway, those are my favorite memories from my school days. They mean a lot to me.",
              highlight: "my school days",
            },
            {
              topic: "친척집",
              sentence:
                "Anyway, those are my favorite memories from visiting my relatives. They mean a lot to me.",
              highlight: "visiting my relatives",
            },
          ],
        },
      ],
    },
  ],
};
