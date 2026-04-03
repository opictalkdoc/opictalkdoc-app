import type { PatternSet } from "@/lib/types/patterns";

export const routinePatterns: PatternSet = {
  questionType: "routine",
  label: "루틴",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "내 일상/루틴을 소개하며 자연스럽게 시작하는 패턴",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "rout_1_01",
          template: "I usually start my day by [동사].",
          translation: "전 보통 [~]하면서 하루를 시작해요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "I usually start my day by drinking a glass of warm water.",
              highlight: "drinking a glass of warm water",
            },
            {
              topic: "헬스클럽",
              sentence:
                "I usually start my day by doing some stretching at the gym.",
              highlight: "doing some stretching at the gym",
            },
            {
              topic: "인터넷",
              sentence:
                "I usually start my day by checking the news on my phone.",
              highlight: "checking the news on my phone",
            },
          ],
        },
        {
          id: "rout_1_02",
          template:
            "Let me tell you about my daily routine when it comes to [주제].",
          translation:
            "[주제]와 관련된 제 일상 루틴을 말해볼게요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "Let me tell you about my daily routine when it comes to cooking.",
              highlight: "cooking",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Let me tell you about my daily routine when it comes to working out.",
              highlight: "working out",
            },
            {
              topic: "음악",
              sentence:
                "Let me tell you about my daily routine when it comes to listening to music.",
              highlight: "listening to music",
            },
          ],
        },
        {
          id: "rout_1_03",
          template:
            "I have a pretty regular routine for [주제], so let me walk you through it.",
          translation:
            "[주제]에 대해 꽤 규칙적인 루틴이 있어서, 하나씩 알려드릴게요.",
          examples: [
            {
              topic: "직장",
              sentence:
                "I have a pretty regular routine for my mornings at work, so let me walk you through it.",
              highlight: "my mornings at work",
            },
            {
              topic: "자전거",
              sentence:
                "I have a pretty regular routine for riding my bike, so let me walk you through it.",
              highlight: "riding my bike",
            },
            {
              topic: "자유시간",
              sentence:
                "I have a pretty regular routine for weekends, so let me walk you through it.",
              highlight: "weekends",
            },
          ],
        },
        {
          id: "rout_1_04",
          template:
            "Whenever I [동사], I always follow the same routine.",
          translation:
            "[~]할 때마다, 전 항상 같은 루틴을 따라요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "Whenever I cook at home, I always follow the same routine.",
              highlight: "cook at home",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Whenever I go to the gym, I always follow the same routine.",
              highlight: "go to the gym",
            },
            {
              topic: "여행",
              sentence:
                "Whenever I travel, I always follow the same routine.",
              highlight: "travel",
            },
          ],
        },
        {
          id: "rout_1_05",
          template:
            "On a typical day, the first thing I do is [동사].",
          translation:
            "평범한 하루에, 제가 가장 먼저 하는 건 [~]이에요.",
          examples: [
            {
              topic: "집",
              sentence:
                "On a typical day, the first thing I do is open the windows to get some fresh air.",
              highlight: "open the windows to get some fresh air",
            },
            {
              topic: "직장",
              sentence:
                "On a typical day, the first thing I do is check my emails at the office.",
              highlight: "check my emails at the office",
            },
            {
              topic: "건강식품",
              sentence:
                "On a typical day, the first thing I do is have a healthy smoothie.",
              highlight: "have a healthy smoothie",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "시간 순서대로 구체적인 행동을 나열하는 패턴",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "rout_2_01",
          template: "First, I [동사], and then I [동사].",
          translation: "먼저 [~]하고, 그다음에 [~]해요.",
          examples: [
            {
              topic: "집",
              sentence:
                "First, I take a shower, and then I have breakfast.",
              highlight: "take a shower, ... have breakfast",
            },
            {
              topic: "헬스클럽",
              sentence:
                "First, I warm up, and then I do weight training.",
              highlight: "warm up, ... do weight training",
            },
            {
              topic: "음식",
              sentence:
                "First, I wash the ingredients, and then I start cooking.",
              highlight: "wash the ingredients, ... start cooking",
            },
          ],
        },
        {
          id: "rout_2_02",
          template: "After that, I usually spend about [시간] [동사].",
          translation: "그 다음에, 전 보통 [시간] 정도 [~]해요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "After that, I usually spend about 30 minutes running on the treadmill.",
              highlight: "30 minutes running on the treadmill",
            },
            {
              topic: "인터넷",
              sentence:
                "After that, I usually spend about an hour browsing the internet.",
              highlight: "an hour browsing the internet",
            },
            {
              topic: "음식",
              sentence:
                "After that, I usually spend about 20 minutes preparing the side dishes.",
              highlight: "20 minutes preparing the side dishes",
            },
          ],
        },
        {
          id: "rout_2_03",
          template: "Once I'm done with that, I move on to [동사].",
          translation: "그게 끝나면, [~]하는 걸로 넘어가요.",
          examples: [
            {
              topic: "직장",
              sentence:
                "Once I'm done with that, I move on to getting dressed for work.",
              highlight: "getting dressed for work",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Once I'm done with that, I move on to doing some cool-down stretches.",
              highlight: "doing some cool-down stretches",
            },
            {
              topic: "자전거",
              sentence:
                "Once I'm done with that, I move on to cleaning my bike.",
              highlight: "cleaning my bike",
            },
          ],
        },
        {
          id: "rout_2_04",
          template: "While I'm [동사], I also like to [동사].",
          translation: "[~]하는 동안, 전 [~]하는 것도 좋아해요.",
          examples: [
            {
              topic: "교통",
              sentence:
                "While I'm commuting, I also like to listen to podcasts.",
              highlight: "commuting, ... listen to podcasts",
            },
            {
              topic: "음식",
              sentence:
                "While I'm cooking, I also like to play some music.",
              highlight: "cooking, ... play some music",
            },
            {
              topic: "자전거",
              sentence:
                "While I'm riding my bike, I also like to enjoy the scenery.",
              highlight: "riding my bike, ... enjoy the scenery",
            },
          ],
        },
        {
          id: "rout_2_05",
          template:
            "The next step is to [동사], which usually takes about [시간].",
          translation:
            "다음 단계는 [~]하는 건데, 보통 [시간] 정도 걸려요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "The next step is to have breakfast, which usually takes about 15 minutes.",
              highlight: "have breakfast, ... 15 minutes",
            },
            {
              topic: "미용실",
              sentence:
                "The next step is to style my hair, which usually takes about 10 minutes.",
              highlight: "style my hair, ... 10 minutes",
            },
            {
              topic: "헬스클럽",
              sentence:
                "The next step is to do some core exercises, which usually takes about 20 minutes.",
              highlight: "do some core exercises, ... 20 minutes",
            },
          ],
        },
        {
          id: "rout_2_06",
          template: "By the time I finish [동사], it's usually around [시간].",
          translation:
            "[~]을 끝낼 때쯤이면, 보통 [시간]쯤이에요.",
          examples: [
            {
              topic: "직장",
              sentence:
                "By the time I finish getting ready for work, it's usually around 8 AM.",
              highlight: "getting ready for work, ... 8 AM",
            },
            {
              topic: "헬스클럽",
              sentence:
                "By the time I finish my workout, it's usually around 7 PM.",
              highlight: "my workout, ... 7 PM",
            },
            {
              topic: "음식",
              sentence:
                "By the time I finish cooking dinner, it's usually around 8 PM.",
              highlight: "cooking dinner, ... 8 PM",
            },
          ],
        },
        {
          id: "rout_2_07",
          template: "I try to [동사] at least [빈도].",
          translation: "전 최소 [빈도]는 [~]하려고 노력해요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "I try to go to the gym at least three times a week.",
              highlight: "go to the gym, ... three times a week",
            },
            {
              topic: "인터넷",
              sentence:
                "I try to read the news online at least 30 minutes a day.",
              highlight: "read the news online, ... 30 minutes a day",
            },
            {
              topic: "음식",
              sentence:
                "I try to cook at home at least four days a week.",
              highlight: "cook at home, ... four days a week",
            },
          ],
        },
        {
          id: "rout_2_08",
          template:
            "On weekdays, I tend to [동사], but on weekends, I usually [동사].",
          translation:
            "평일에는 [~]하는 편인데, 주말에는 보통 [~]해요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "On weekdays, I tend to eat quickly, but on weekends, I usually cook something nice.",
              highlight: "eat quickly, ... cook something nice",
            },
            {
              topic: "헬스클럽",
              sentence:
                "On weekdays, I tend to exercise at home, but on weekends, I usually go to the gym.",
              highlight: "exercise at home, ... go to the gym",
            },
            {
              topic: "자유시간",
              sentence:
                "On weekdays, I tend to watch TV after work, but on weekends, I usually go out with friends.",
              highlight: "watch TV after work, ... go out with friends",
            },
          ],
        },
        {
          id: "rout_2_09",
          template: "I make it a point to [동사] every single day.",
          translation: "전 매일 빠짐없이 [~]하는 걸 원칙으로 해요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "I make it a point to drink plenty of water every single day.",
              highlight: "drink plenty of water",
            },
            {
              topic: "재활용",
              sentence:
                "I make it a point to sort my recyclables every single day.",
              highlight: "sort my recyclables",
            },
            {
              topic: "음악",
              sentence:
                "I make it a point to listen to music every single day.",
              highlight: "listen to music",
            },
          ],
        },
        {
          id: "rout_2_10",
          template:
            "Before I [동사], I always make sure to [동사].",
          translation:
            "[~]하기 전에, 전 항상 [~]하는 걸 꼭 확인해요.",
          examples: [
            {
              topic: "날씨",
              sentence:
                "Before I leave home, I always make sure to check the weather.",
              highlight: "leave home, ... check the weather",
            },
            {
              topic: "전화기",
              sentence:
                "Before I go to bed, I always make sure to charge my phone.",
              highlight: "go to bed, ... charge my phone",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Before I start exercising, I always make sure to warm up properly.",
              highlight: "start exercising, ... warm up properly",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "이 루틴이 나에게 주는 의미와 감정을 표현하는 패턴",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "rout_3_01",
          template:
            "This routine really helps me feel more [형용사] throughout the day.",
          translation:
            "이 루틴 덕분에 하루 종일 더 [활기차게/편안하게] 지낼 수 있어요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "This routine really helps me feel more energetic throughout the day.",
              highlight: "energetic",
            },
            {
              topic: "음악",
              sentence:
                "This routine really helps me feel more calm throughout the day.",
              highlight: "calm",
            },
            {
              topic: "집",
              sentence:
                "This routine really helps me feel more organized throughout the day.",
              highlight: "organized",
            },
          ],
        },
        {
          id: "rout_3_02",
          template:
            "I honestly enjoy every minute of it because it's my personal time.",
          translation:
            "솔직히 매 순간이 다 좋아요. 제 개인적인 시간이거든요.",
          examples: [
            {
              topic: "자유시간",
              sentence:
                "I honestly enjoy every minute of reading because it's my personal time.",
              highlight: "reading",
            },
            {
              topic: "자전거",
              sentence:
                "I honestly enjoy every minute of my bike ride because it's my personal time.",
              highlight: "my bike ride",
            },
            {
              topic: "음식",
              sentence:
                "I honestly enjoy every minute of cooking because it's my personal time.",
              highlight: "cooking",
            },
          ],
        },
        {
          id: "rout_3_03",
          template:
            "Without this routine, I think my day would feel incomplete.",
          translation:
            "이 루틴이 없으면, 하루가 허전할 것 같아요.",
          examples: [
            {
              topic: "건강식품",
              sentence:
                "Without my morning smoothie, I think my day would feel incomplete.",
              highlight: "my morning smoothie",
            },
            {
              topic: "헬스클럽",
              sentence:
                "Without my evening workout, I think my day would feel incomplete.",
              highlight: "my evening workout",
            },
            {
              topic: "음악",
              sentence:
                "Without listening to music, I think my day would feel incomplete.",
              highlight: "listening to music",
            },
          ],
        },
        {
          id: "rout_3_04",
          template:
            "It gives me a sense of [명사], which I really appreciate.",
          translation:
            "그건 제게 [성취감/안정감]을 주는데, 정말 고마운 일이에요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "It gives me a sense of accomplishment, which I really appreciate.",
              highlight: "accomplishment",
            },
            {
              topic: "음악",
              sentence:
                "It gives me a sense of inner peace, which I really appreciate.",
              highlight: "inner peace",
            },
            {
              topic: "집",
              sentence:
                "It gives me a sense of control, which I really appreciate.",
              highlight: "control",
            },
          ],
        },
        {
          id: "rout_3_05",
          template:
            "I feel like this is the best way to [동사].",
          translation:
            "이게 [~]하는 가장 좋은 방법이라고 느껴요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "I feel like this is the best way to manage my stress.",
              highlight: "manage my stress",
            },
            {
              topic: "건강식품",
              sentence:
                "I feel like this is the best way to stay healthy.",
              highlight: "stay healthy",
            },
            {
              topic: "직장",
              sentence:
                "I feel like this is the best way to stay productive at work.",
              highlight: "stay productive at work",
            },
          ],
        },
        {
          id: "rout_3_06",
          template:
            "I've been doing this for [기간], and I never get tired of it.",
          translation:
            "[기간] 동안 이걸 해왔는데, 전혀 질리지 않아요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "I've been doing this for about two years, and I never get tired of it.",
              highlight: "about two years",
            },
            {
              topic: "자전거",
              sentence:
                "I've been doing this for over a year, and I never get tired of it.",
              highlight: "over a year",
            },
            {
              topic: "음식",
              sentence:
                "I've been doing this for a few months, and I never get tired of it.",
              highlight: "a few months",
            },
          ],
        },
        {
          id: "rout_3_07",
          template:
            "If I skip this routine, I feel like something is missing.",
          translation:
            "이 루틴을 빼먹으면, 뭔가 빠진 것 같은 기분이 들어요.",
          examples: [
            {
              topic: "건강식품",
              sentence:
                "If I skip my morning health drink, I feel like something is missing.",
              highlight: "my morning health drink",
            },
            {
              topic: "헬스클럽",
              sentence:
                "If I skip my workout, I feel like something is missing.",
              highlight: "my workout",
            },
            {
              topic: "인터넷",
              sentence:
                "If I skip reading the news online, I feel like something is missing.",
              highlight: "reading the news online",
            },
          ],
        },
        {
          id: "rout_3_08",
          template:
            "It might sound simple, but it really makes a big difference in my life.",
          translation:
            "단순해 보일 수 있지만, 제 삶에 정말 큰 차이를 만들어줘요.",
          examples: [
            {
              topic: "자전거",
              sentence:
                "Riding my bike might sound simple, but it really makes a big difference in my life.",
              highlight: "Riding my bike",
            },
            {
              topic: "재활용",
              sentence:
                "Sorting recyclables might sound simple, but it really makes a big difference in my life.",
              highlight: "Sorting recyclables",
            },
            {
              topic: "건강",
              sentence:
                "Stretching every morning might sound simple, but it really makes a big difference in my life.",
              highlight: "Stretching every morning",
            },
          ],
        },
        {
          id: "rout_3_09",
          template:
            "My friends always say that I'm so consistent about [동사].",
          translation:
            "제 친구들은 제가 [~]하는 데 정말 꾸준하다고 항상 말해요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "My friends always say that I'm so consistent about going to the gym.",
              highlight: "going to the gym",
            },
            {
              topic: "건강식품",
              sentence:
                "My friends always say that I'm so consistent about eating healthy.",
              highlight: "eating healthy",
            },
            {
              topic: "자전거",
              sentence:
                "My friends always say that I'm so consistent about riding my bike to work.",
              highlight: "riding my bike to work",
            },
          ],
        },
        {
          id: "rout_3_10",
          template:
            "This has become such an important part of who I am.",
          translation:
            "이건 제가 어떤 사람인지를 보여주는 아주 중요한 부분이 되었어요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "Working out has become such an important part of who I am.",
              highlight: "Working out",
            },
            {
              topic: "음식",
              sentence:
                "Cooking has become such an important part of who I am.",
              highlight: "Cooking",
            },
            {
              topic: "음악",
              sentence:
                "Playing music has become such an important part of who I am.",
              highlight: "Playing music",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "루틴을 정리하며 깔끔하게 끝내는 패턴",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "rout_4_01",
          template:
            "So, that's pretty much what my routine looks like for [주제].",
          translation:
            "그래서, 이게 [주제]에 대한 제 루틴의 대략적인 모습이에요.",
          examples: [
            {
              topic: "집",
              sentence:
                "So, that's pretty much what my routine looks like for my mornings at home.",
              highlight: "my mornings at home",
            },
            {
              topic: "헬스클럽",
              sentence:
                "So, that's pretty much what my routine looks like for working out.",
              highlight: "working out",
            },
            {
              topic: "음식",
              sentence:
                "So, that's pretty much what my routine looks like for cooking dinner.",
              highlight: "cooking dinner",
            },
          ],
        },
        {
          id: "rout_4_02",
          template:
            "I plan to keep this routine going because it works really well for me.",
          translation:
            "이 루틴을 계속 유지할 생각이에요. 저한테 정말 잘 맞거든요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "I plan to keep this exercise routine going because it works really well for me.",
              highlight: "this exercise routine",
            },
            {
              topic: "건강식품",
              sentence:
                "I plan to keep this healthy eating routine going because it works really well for me.",
              highlight: "this healthy eating routine",
            },
            {
              topic: "자전거",
              sentence:
                "I plan to keep this cycling routine going because it works really well for me.",
              highlight: "this cycling routine",
            },
          ],
        },
        {
          id: "rout_4_03",
          template:
            "I would definitely recommend this routine to anyone who wants to [동사].",
          translation:
            "[~]하고 싶은 분이라면 이 루틴을 꼭 추천하고 싶어요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "I would definitely recommend this routine to anyone who wants to stay healthy.",
              highlight: "stay healthy",
            },
            {
              topic: "직장",
              sentence:
                "I would definitely recommend this routine to anyone who wants to be more productive.",
              highlight: "be more productive",
            },
            {
              topic: "자유시간",
              sentence:
                "I would definitely recommend this routine to anyone who wants to reduce stress.",
              highlight: "reduce stress",
            },
          ],
        },
        {
          id: "rout_4_04",
          template:
            "All in all, I'm really happy with this routine, and I hope I can stick with it.",
          translation:
            "전반적으로, 전 이 루틴에 정말 만족하고, 계속 유지할 수 있길 바라요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "All in all, I'm really happy with my workout routine, and I hope I can stick with it.",
              highlight: "my workout routine",
            },
            {
              topic: "음식",
              sentence:
                "All in all, I'm really happy with my meal routine, and I hope I can stick with it.",
              highlight: "my meal routine",
            },
            {
              topic: "건강",
              sentence:
                "All in all, I'm really happy with my sleep routine, and I hope I can stick with it.",
              highlight: "my sleep routine",
            },
          ],
        },
        {
          id: "rout_4_05",
          template:
            "That's basically how I spend my time on [주제]. It keeps me going every day.",
          translation:
            "이게 기본적으로 제가 [주제]에 시간을 보내는 방식이에요. 매일 저를 움직이게 해주죠.",
          examples: [
            {
              topic: "건강",
              sentence:
                "That's basically how I spend my time on self-care. It keeps me going every day.",
              highlight: "self-care",
            },
            {
              topic: "자유시간",
              sentence:
                "That's basically how I spend my time on my hobbies. It keeps me going every day.",
              highlight: "my hobbies",
            },
            {
              topic: "헬스클럽",
              sentence:
                "That's basically how I spend my time on fitness. It keeps me going every day.",
              highlight: "fitness",
            },
          ],
        },
      ],
    },
  ],
};
