import type { PatternSet } from "@/lib/types/patterns";

export const adv15Patterns: PatternSet = {
  questionType: "adv_15",
  label: "사회이슈",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "사회적 이슈나 트렌드를 소개하며 자연스럽게 말문을 여는 시작 문장들",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "adv15_1_01",
          template:
            "These days, people talk a lot about [이슈]. I think it's a very important topic.",
          translation:
            "요즘 사람들이 [이슈]에 대해 많이 이야기해요. 아주 중요한 주제라고 생각해요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "These days, people talk a lot about recycling. I think it's a very important topic.",
              highlight: "recycling",
            },
            {
              topic: "건강",
              sentence:
                "These days, people talk a lot about mental health. I think it's a very important topic.",
              highlight: "mental health",
            },
            {
              topic: "기술",
              sentence:
                "These days, people talk a lot about artificial intelligence. I think it's a very important topic.",
              highlight: "artificial intelligence",
            },
          ],
        },
        {
          id: "adv15_1_02",
          template:
            "One of the biggest issues in our society today is [이슈].",
          translation:
            "오늘날 우리 사회의 가장 큰 이슈 중 하나는 [이슈]예요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "One of the biggest issues in our society today is plastic pollution.",
              highlight: "plastic pollution",
            },
            {
              topic: "산업",
              sentence:
                "One of the biggest issues in our society today is youth unemployment.",
              highlight: "youth unemployment",
            },
            {
              topic: "인터넷",
              sentence:
                "One of the biggest issues in our society today is online privacy.",
              highlight: "online privacy",
            },
          ],
        },
        {
          id: "adv15_1_03",
          template:
            "I've been thinking about [이슈] lately, and I'd like to share my thoughts.",
          translation:
            "최근에 [이슈]에 대해 생각해봤는데, 제 생각을 나누고 싶어요.",
          examples: [
            {
              topic: "직장",
              sentence:
                "I've been thinking about work-life balance lately, and I'd like to share my thoughts.",
              highlight: "work-life balance",
            },
            {
              topic: "인터넷",
              sentence:
                "I've been thinking about social media addiction lately, and I'd like to share my thoughts.",
              highlight: "social media addiction",
            },
            {
              topic: "부동산",
              sentence:
                "I've been thinking about housing prices lately, and I'd like to share my thoughts.",
              highlight: "housing prices",
            },
          ],
        },
        {
          id: "adv15_1_04",
          template:
            "There has been a lot of discussion about [이슈] in recent years.",
          translation:
            "최근 몇 년간 [이슈]에 대한 논의가 많았어요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "There has been a lot of discussion about single-use plastics in recent years.",
              highlight: "single-use plastics",
            },
            {
              topic: "건강식품",
              sentence:
                "There has been a lot of discussion about healthy eating in recent years.",
              highlight: "healthy eating",
            },
            {
              topic: "기술",
              sentence:
                "There has been a lot of discussion about data privacy in recent years.",
              highlight: "data privacy",
            },
          ],
        },
        {
          id: "adv15_1_05",
          template:
            "I believe [이슈] is something that affects everyone in our daily lives.",
          translation:
            "[이슈]는 우리 모두의 일상에 영향을 미치는 것이라고 생각해요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "I believe rising food prices is something that affects everyone in our daily lives.",
              highlight: "rising food prices",
            },
            {
              topic: "교통",
              sentence:
                "I believe traffic congestion is something that affects everyone in our daily lives.",
              highlight: "traffic congestion",
            },
            {
              topic: "기술",
              sentence:
                "I believe smartphone overuse is something that affects everyone in our daily lives.",
              highlight: "smartphone overuse",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "구체적인 예시, 원인, 현상을 분석하며 논점을 전개하는 핵심 문장들",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "adv15_2_01",
          template:
            "Many people [행동/현상] because of [원인].",
          translation:
            "많은 사람들이 [원인] 때문에 [행동/현상]을 해요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "Many people skip breakfast because of their busy schedules.",
              highlight: "skip breakfast, ... their busy schedules",
            },
            {
              topic: "재활용",
              sentence:
                "Many people use reusable bags because of growing environmental awareness.",
              highlight: "use reusable bags, ... growing environmental awareness",
            },
            {
              topic: "기술",
              sentence:
                "Many people work from home because of advancements in technology.",
              highlight: "work from home, ... advancements in technology",
            },
          ],
        },
        {
          id: "adv15_2_02",
          template:
            "One clear example of this is [예시]. It shows how [영향].",
          translation:
            "이에 대한 분명한 예시는 [예시]예요. [영향]을 보여주죠.",
          examples: [
            {
              topic: "음식",
              sentence:
                "One clear example of this is the growth of food delivery apps. It shows how people prefer convenience over cooking.",
              highlight: "the growth of food delivery apps, ... people prefer convenience over cooking",
            },
            {
              topic: "인터넷",
              sentence:
                "One clear example of this is the rise of online learning platforms. It shows how education is becoming more accessible.",
              highlight: "the rise of online learning platforms, ... education is becoming more accessible",
            },
            {
              topic: "재활용",
              sentence:
                "One clear example of this is the ban on plastic straws. It shows how small changes can make a big impact.",
              highlight: "the ban on plastic straws, ... small changes can make a big impact",
            },
          ],
        },
        {
          id: "adv15_2_03",
          template:
            "According to what I've seen/heard, [현상] is becoming more common.",
          translation:
            "제가 보고/들은 바로는, [현상]이 점점 더 흔해지고 있어요.",
          examples: [
            {
              topic: "헬스클럽",
              sentence:
                "According to what I've seen, going to the gym regularly is becoming more common.",
              highlight: "going to the gym regularly",
            },
            {
              topic: "쇼핑",
              sentence:
                "According to what I've heard, buying secondhand items is becoming more common.",
              highlight: "buying secondhand items",
            },
            {
              topic: "직장",
              sentence:
                "According to what I've seen, flexible working hours is becoming more common.",
              highlight: "flexible working hours",
            },
          ],
        },
        {
          id: "adv15_2_04",
          template:
            "The main reason for this is [원인]. It has led to [결과].",
          translation:
            "이것의 주된 이유는 [원인]이에요. 그로 인해 [결과]가 생겼어요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "The main reason for this is the increase in single-person households. It has led to a boom in convenience stores.",
              highlight: "the increase in single-person households, ... a boom in convenience stores",
            },
            {
              topic: "인터넷",
              sentence:
                "The main reason for this is social media influence. It has led to new trends spreading very quickly.",
              highlight: "social media influence, ... new trends spreading very quickly",
            },
            {
              topic: "산업",
              sentence:
                "The main reason for this is global inflation. It has led to people being more careful with spending.",
              highlight: "global inflation, ... people being more careful with spending",
            },
          ],
        },
        {
          id: "adv15_2_05",
          template:
            "This trend is especially noticeable among [대상 그룹].",
          translation:
            "이 트렌드는 특히 [대상 그룹]에서 두드러져요.",
          examples: [
            {
              topic: "인터넷",
              sentence:
                "This trend is especially noticeable among young people in their 20s.",
              highlight: "young people in their 20s",
            },
            {
              topic: "건강",
              sentence:
                "This trend is especially noticeable among office workers.",
              highlight: "office workers",
            },
            {
              topic: "재활용",
              sentence:
                "This trend is especially noticeable among parents with young children.",
              highlight: "parents with young children",
            },
          ],
        },
        {
          id: "adv15_2_06",
          template:
            "Because of [원인], more and more people are starting to [행동].",
          translation:
            "[원인] 때문에, 점점 더 많은 사람들이 [행동]을 시작하고 있어요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "Because of climate change concerns, more and more people are starting to use public transportation.",
              highlight: "climate change concerns, ... use public transportation",
            },
            {
              topic: "건강",
              sentence:
                "Because of health awareness, more and more people are starting to exercise regularly.",
              highlight: "health awareness, ... exercise regularly",
            },
            {
              topic: "산업",
              sentence:
                "Because of rising costs, more and more people are starting to cook at home.",
              highlight: "rising costs, ... cook at home",
            },
          ],
        },
        {
          id: "adv15_2_07",
          template:
            "For instance, in my everyday life, I can see [구체적 예시].",
          translation:
            "예를 들어, 제 일상에서도 [구체적 예시]를 볼 수 있어요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "For instance, in my everyday life, I can see many cafes offering discounts for using tumblers.",
              highlight: "many cafes offering discounts for using tumblers",
            },
            {
              topic: "기술",
              sentence:
                "For instance, in my everyday life, I can see almost everyone paying with their phone.",
              highlight: "almost everyone paying with their phone",
            },
            {
              topic: "건강",
              sentence:
                "For instance, in my everyday life, I can see a lot more people jogging in the park.",
              highlight: "a lot more people jogging in the park",
            },
          ],
        },
        {
          id: "adv15_2_08",
          template:
            "Some people argue that [주장], while others believe [반대 의견].",
          translation:
            "어떤 사람들은 [주장]이라고 하고, 다른 사람들은 [반대 의견]이라고 생각해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "Some people argue that AI will create more jobs, while others believe it will replace many workers.",
              highlight: "AI will create more jobs, ... it will replace many workers",
            },
            {
              topic: "인터넷",
              sentence:
                "Some people argue that online classes are effective, while others believe face-to-face learning is better.",
              highlight: "online classes are effective, ... face-to-face learning is better",
            },
            {
              topic: "기술산업 보고서",
              sentence:
                "Some people argue that social media connects people, while others believe it makes us lonelier.",
              highlight: "social media connects people, ... it makes us lonelier",
            },
          ],
        },
        {
          id: "adv15_2_09",
          template:
            "This issue has both positive and negative sides. On the positive side, [장점].",
          translation:
            "이 이슈에는 긍정적인 면과 부정적인 면이 모두 있어요. 긍정적인 면은 [장점]이에요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "This issue has both positive and negative sides. On the positive side, technology makes information accessible to everyone.",
              highlight: "technology makes information accessible to everyone",
            },
            {
              topic: "산업",
              sentence:
                "This issue has both positive and negative sides. On the positive side, cities offer more job opportunities.",
              highlight: "cities offer more job opportunities",
            },
            {
              topic: "외국 국가",
              sentence:
                "This issue has both positive and negative sides. On the positive side, we can experience different cultures easily.",
              highlight: "we can experience different cultures easily",
            },
          ],
        },
        {
          id: "adv15_2_10",
          template:
            "If we look at [국가/사회], we can see that [현상/사실].",
          translation:
            "[국가/사회]를 보면, [현상/사실]을 알 수 있어요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "If we look at Korean society, we can see that recycling has become a big part of daily life.",
              highlight: "Korean society, ... recycling has become a big part of daily life",
            },
            {
              topic: "건강식품",
              sentence:
                "If we look at our country, we can see that more people are choosing organic food.",
              highlight: "our country, ... more people are choosing organic food",
            },
            {
              topic: "기술",
              sentence:
                "If we look at big cities, we can see that cashless payment is now the norm.",
              highlight: "big cities, ... cashless payment is now the norm",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "이슈에 대한 나의 견해, 우려, 희망을 진솔하게 표현하는 문장들",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "adv15_3_01",
          template:
            "Personally, I'm concerned about [우려 사항] because [이유].",
          translation:
            "개인적으로 [우려 사항]이 걱정돼요. 왜냐하면 [이유] 때문이에요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "Personally, I'm concerned about air pollution because it directly affects our health.",
              highlight: "air pollution, ... it directly affects our health",
            },
            {
              topic: "인터넷",
              sentence:
                "Personally, I'm concerned about data privacy because companies collect so much personal information.",
              highlight: "data privacy, ... companies collect so much personal information",
            },
            {
              topic: "산업",
              sentence:
                "Personally, I'm concerned about job security because automation is replacing many positions.",
              highlight: "job security, ... automation is replacing many positions",
            },
          ],
        },
        {
          id: "adv15_3_02",
          template:
            "I strongly believe that [나의 의견]. It's something we can't ignore.",
          translation:
            "저는 [나의 의견]이라고 강하게 믿어요. 무시할 수 없는 일이에요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "I strongly believe that we should reduce plastic use. It's something we can't ignore.",
              highlight: "we should reduce plastic use",
            },
            {
              topic: "산업",
              sentence:
                "I strongly believe that education should be more affordable. It's something we can't ignore.",
              highlight: "education should be more affordable",
            },
            {
              topic: "건강",
              sentence:
                "I strongly believe that mental health support should be more accessible. It's something we can't ignore.",
              highlight: "mental health support should be more accessible",
            },
          ],
        },
        {
          id: "adv15_3_03",
          template:
            "However, some people worry that [우려]. I can understand their point of view.",
          translation:
            "하지만 어떤 사람들은 [우려]를 걱정해요. 그 관점도 이해할 수 있어요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "However, some people worry that too much technology makes us lazy. I can understand their point of view.",
              highlight: "too much technology makes us lazy",
            },
            {
              topic: "외국 국가",
              sentence:
                "However, some people worry that globalization threatens local culture. I can understand their point of view.",
              highlight: "globalization threatens local culture",
            },
            {
              topic: "기술산업 보고서",
              sentence:
                "However, some people worry that robots will take all the jobs. I can understand their point of view.",
              highlight: "robots will take all the jobs",
            },
          ],
        },
        {
          id: "adv15_3_04",
          template:
            "I think everyone has a responsibility to [행동] in order to [목적].",
          translation:
            "[목적]을 위해 모두가 [행동]할 책임이 있다고 생각해요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "I think everyone has a responsibility to reduce waste in order to protect the environment.",
              highlight: "reduce waste, ... protect the environment",
            },
            {
              topic: "가족/친구",
              sentence:
                "I think everyone has a responsibility to help each other in order to build a better community.",
              highlight: "help each other, ... build a better community",
            },
            {
              topic: "건강",
              sentence:
                "I think everyone has a responsibility to stay informed in order to make healthier choices.",
              highlight: "stay informed, ... make healthier choices",
            },
          ],
        },
        {
          id: "adv15_3_05",
          template:
            "What worries me the most is [가장 큰 우려]. We really need to address this.",
          translation:
            "가장 걱정되는 건 [가장 큰 우려]예요. 정말 이 문제를 다뤄야 해요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "What worries me the most is that future generations will suffer from pollution. We really need to address this.",
              highlight: "future generations will suffer from pollution",
            },
            {
              topic: "산업",
              sentence:
                "What worries me the most is the widening gap between rich and poor. We really need to address this.",
              highlight: "the widening gap between rich and poor",
            },
            {
              topic: "건강",
              sentence:
                "What worries me the most is the pressure people face from excessive stress. We really need to address this.",
              highlight: "the pressure people face from excessive stress",
            },
          ],
        },
        {
          id: "adv15_3_06",
          template:
            "I'm hopeful that [긍정적 전망] will happen in the near future.",
          translation:
            "가까운 미래에 [긍정적 전망]이 실현될 거라고 희망적으로 생각해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "I'm hopeful that clean energy will become more affordable in the near future.",
              highlight: "clean energy will become more affordable",
            },
            {
              topic: "건강",
              sentence:
                "I'm hopeful that better healthcare for everyone will happen in the near future.",
              highlight: "better healthcare for everyone",
            },
            {
              topic: "산업",
              sentence:
                "I'm hopeful that equal access to quality education will happen in the near future.",
              highlight: "equal access to quality education",
            },
          ],
        },
        {
          id: "adv15_3_07",
          template:
            "From my own experience, I've seen how [경험/관찰]. That's why I feel strongly about this.",
          translation:
            "제 경험으로 보면, [경험/관찰]을 봤어요. 그래서 이 문제에 대해 강하게 느끼는 거예요.",
          examples: [
            {
              topic: "건강",
              sentence:
                "From my own experience, I've seen how stress affects people's health. That's why I feel strongly about this.",
              highlight: "stress affects people's health",
            },
            {
              topic: "재활용",
              sentence:
                "From my own experience, I've seen how much trash is produced every day. That's why I feel strongly about this.",
              highlight: "how much trash is produced every day",
            },
            {
              topic: "산업",
              sentence:
                "From my own experience, I've seen how hard it is for young people to find jobs. That's why I feel strongly about this.",
              highlight: "how hard it is for young people to find jobs",
            },
          ],
        },
        {
          id: "adv15_3_08",
          template:
            "I think the government/companies should [조치] to solve this problem.",
          translation:
            "이 문제를 해결하려면 정부/기업이 [조치]를 해야 한다고 생각해요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "I think the government should invest more in renewable energy to solve this problem.",
              highlight: "invest more in renewable energy",
            },
            {
              topic: "산업",
              sentence:
                "I think companies should create more internship programs to solve this problem.",
              highlight: "create more internship programs",
            },
            {
              topic: "건강",
              sentence:
                "I think the government should provide free mental health services to solve this problem.",
              highlight: "provide free mental health services",
            },
          ],
        },
        {
          id: "adv15_3_09",
          template:
            "Even though it's not an easy problem, I believe small changes can make a big difference.",
          translation:
            "쉬운 문제는 아니지만, 작은 변화가 큰 차이를 만들 수 있다고 생각해요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "Even though pollution is not an easy problem, I believe using less plastic can make a big difference.",
              highlight: "pollution, ... using less plastic",
            },
            {
              topic: "건강",
              sentence:
                "Even though staying healthy is not easy, I believe walking 30 minutes a day can make a big difference.",
              highlight: "staying healthy, ... walking 30 minutes a day",
            },
            {
              topic: "건강식품",
              sentence:
                "Even though eating healthy is not easy, I believe cutting processed food can make a big difference.",
              highlight: "eating healthy, ... cutting processed food",
            },
          ],
        },
        {
          id: "adv15_3_10",
          template:
            "I think awareness is the first step. Once people understand [사실], they'll start to act.",
          translation:
            "인식이 첫 번째 단계라고 생각해요. 사람들이 [사실]을 이해하면 행동하기 시작할 거예요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "I think awareness is the first step. Once people understand the impact of waste, they'll start to act.",
              highlight: "the impact of waste",
            },
            {
              topic: "건강",
              sentence:
                "I think awareness is the first step. Once people understand the risks of a sedentary lifestyle, they'll start to act.",
              highlight: "the risks of a sedentary lifestyle",
            },
            {
              topic: "패션",
              sentence:
                "I think awareness is the first step. Once people understand the true cost of fast fashion, they'll start to act.",
              highlight: "the true cost of fast fashion",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "의견을 정리하고 미래 전망이나 다짐으로 깔끔하게 마무리하는 문장들",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "adv15_4_01",
          template:
            "That's why I think [이슈] is such an important topic for all of us.",
          translation:
            "그래서 [이슈]가 우리 모두에게 정말 중요한 주제라고 생각해요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "That's why I think environmental protection is such an important topic for all of us.",
              highlight: "environmental protection",
            },
            {
              topic: "건강",
              sentence:
                "That's why I think mental health awareness is such an important topic for all of us.",
              highlight: "mental health awareness",
            },
            {
              topic: "기술",
              sentence:
                "That's why I think digital literacy is such an important topic for all of us.",
              highlight: "digital literacy",
            },
          ],
        },
        {
          id: "adv15_4_02",
          template:
            "I believe [트렌드/이슈] will continue to grow, and we need to be prepared.",
          translation:
            "[트렌드/이슈]는 계속 커질 거고, 우리는 준비해야 한다고 생각해요.",
          examples: [
            {
              topic: "기술",
              sentence:
                "I believe the use of AI will continue to grow, and we need to be prepared.",
              highlight: "the use of AI",
            },
            {
              topic: "재활용",
              sentence:
                "I believe the demand for eco-friendly products will continue to grow, and we need to be prepared.",
              highlight: "the demand for eco-friendly products",
            },
            {
              topic: "인터넷",
              sentence:
                "I believe remote work will continue to grow, and we need to be prepared.",
              highlight: "remote work",
            },
          ],
        },
        {
          id: "adv15_4_03",
          template:
            "In conclusion, if we all work together, I'm sure we can [긍정적 결과].",
          translation:
            "결론적으로, 우리 모두 함께 노력하면 [긍정적 결과]할 수 있을 거라 확신해요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "In conclusion, if we all work together, I'm sure we can create a cleaner world.",
              highlight: "create a cleaner world",
            },
            {
              topic: "가족/친구",
              sentence:
                "In conclusion, if we all work together, I'm sure we can build a better society.",
              highlight: "build a better society",
            },
            {
              topic: "건강",
              sentence:
                "In conclusion, if we all work together, I'm sure we can promote healthier lifestyles.",
              highlight: "promote healthier lifestyles",
            },
          ],
        },
        {
          id: "adv15_4_04",
          template:
            "So those are my thoughts on [이슈]. I hope things get better over time.",
          translation:
            "[이슈]에 대한 제 생각이었어요. 시간이 지나면서 나아지면 좋겠어요.",
          examples: [
            {
              topic: "음식",
              sentence:
                "So those are my thoughts on rising prices. I hope things get better over time.",
              highlight: "rising prices",
            },
            {
              topic: "재활용",
              sentence:
                "So those are my thoughts on pollution. I hope things get better over time.",
              highlight: "pollution",
            },
            {
              topic: "산업",
              sentence:
                "So those are my thoughts on the job market. I hope things get better over time.",
              highlight: "the job market",
            },
          ],
        },
        {
          id: "adv15_4_05",
          template:
            "As for me, I'll try my best to [나의 다짐] from now on.",
          translation:
            "저도 앞으로 [나의 다짐]을 위해 최선을 다할게요.",
          examples: [
            {
              topic: "재활용",
              sentence:
                "As for me, I'll try my best to reduce waste and use eco-friendly products from now on.",
              highlight: "reduce waste and use eco-friendly products",
            },
            {
              topic: "건강",
              sentence:
                "As for me, I'll try my best to take better care of my health from now on.",
              highlight: "take better care of my health",
            },
            {
              topic: "건강식품",
              sentence:
                "As for me, I'll try my best to eat more natural food from now on.",
              highlight: "eat more natural food",
            },
          ],
        },
      ],
    },
  ],
};
