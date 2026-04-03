import type { PatternSet } from "@/lib/types/patterns";

export const descriptionPatterns: PatternSet = {
  questionType: "description",
  label: "묘사",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "질문을 듣고 당황하지 않고, 자연스럽게 주제를 던지며 시간을 버는 마법의 문장들",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "desc_1_01",
          template:
            "When it comes to [주제], I'd have to say my favorite is [구체적 대상].",
          translation:
            "[주제]에 대해 말하자면, 제가 가장 좋아하는 건 [구체적 대상]이에요.",
          examples: [
            { topic: "음악", sentence: "When it comes to music, I'd have to say my favorite is K-pop.", highlight: "music, ... K-pop" },
            { topic: "음식점", sentence: "When it comes to restaurants, I'd have to say my favorite is the one near my office.", highlight: "restaurants, ... the one near my office" },
            { topic: "국내여행", sentence: "When it comes to domestic travel, I'd have to say my favorite is Jeju Island.", highlight: "domestic travel, ... Jeju Island" },
          ],
        },
        {
          id: "desc_1_02",
          template: "I'm going to tell you about [대상]. It's a place/thing I really love.",
          translation: "[대상]에 대해 말해볼게요. 제가 정말 좋아하는 곳/것이거든요.",
          examples: [
            { topic: "헬스클럽", sentence: "I'm going to tell you about my gym. It's a place I really love.", highlight: "my gym" },
            { topic: "집", sentence: "I'm going to tell you about my house. It's a place I really love.", highlight: "my house" },
            { topic: "영화", sentence: "I'm going to tell you about movies. It's a thing I really love.", highlight: "movies" },
          ],
        },
        {
          id: "desc_1_03",
          template: "Actually, there are many [주제] in my country, but I usually go to [대상].",
          translation: "사실 우리나라엔 많은 [주제]가 있지만, 전 주로 [대상]에 가요.",
          examples: [
            { topic: "해외여행", sentence: "Actually, there are many travel options, but I usually go to Japan.", highlight: "travel options, ... Japan" },
            { topic: "공연", sentence: "Actually, there are many concerts in my country, but I usually go to K-pop shows.", highlight: "concerts, ... K-pop shows" },
            { topic: "쇼핑", sentence: "Actually, there are many shopping malls in my country, but I usually go to Gangnam.", highlight: "shopping malls, ... Gangnam" },
          ],
        },
        {
          id: "desc_1_04",
          template: "Let me tell you about my favorite [대상]. It is located in [장소].",
          translation: "제가 가장 좋아하는 [대상]을 말해볼게요. 거긴 [장소]에 위치해 있어요.",
          examples: [
            { topic: "음식점", sentence: "Let me tell you about my favorite restaurant. It is located in Hongdae.", highlight: "restaurant, ... Hongdae" },
            { topic: "헬스클럽", sentence: "Let me tell you about my favorite gym. It is located near my apartment.", highlight: "gym, ... near my apartment" },
            { topic: "직장", sentence: "Let me tell you about my workplace. It is located in Seoul.", highlight: "workplace, ... Seoul" },
          ],
        },
        {
          id: "desc_1_05",
          template: "I frequently visit/use [대상] whenever I have free time.",
          translation: "전 시간 날 때마다 [대상]을 자주 방문해요/사용해요.",
          examples: [
            { topic: "자유시간", sentence: "I frequently visit cafes whenever I have free time.", highlight: "cafes" },
            { topic: "인터넷", sentence: "I frequently use the internet whenever I have free time.", highlight: "the internet" },
            { topic: "텔레비전", sentence: "I frequently watch TV whenever I have free time.", highlight: "watch TV" },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 및 핵심 묘사 패턴",
      description: "본격적으로 외관, 시설, 분위기, 그리고 거기서 내가 주로 하는 행동을 묘사하는 템플릿",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "desc_2_01",
          template: "The first thing you notice is that it is very [형용사].",
          translation: "딱 처음 보면 거기가 아주 [넓은/아늑한/현대적인 등]하다는 걸 알 수 있어요.",
          examples: [
            { topic: "집", sentence: "The first thing you notice is that it is very cozy.", highlight: "cozy" },
            { topic: "헬스클럽", sentence: "The first thing you notice is that it is very spacious.", highlight: "spacious" },
            { topic: "호텔", sentence: "The first thing you notice is that it is very modern.", highlight: "modern" },
          ],
        },
        {
          id: "desc_2_02",
          template: "It has a great atmosphere, so many people visit there to [동사].",
          translation: "분위기가 엄청 좋아서, 많은 사람들이 [~하러] 거길 찾아요.",
          examples: [
            { topic: "음식점", sentence: "It has a great atmosphere, so many people visit there to enjoy Korean food.", highlight: "enjoy Korean food" },
            { topic: "공연", sentence: "It has a great atmosphere, so many people visit there to enjoy live music.", highlight: "enjoy live music" },
            { topic: "지형", sentence: "It has a great atmosphere, so many people visit there to take pictures.", highlight: "take pictures" },
          ],
        },
        {
          id: "desc_2_03",
          template: "What I like most about this [대상] is [명사/동명사].",
          translation: "이 [대상]에서 제가 가장 좋아하는 점은 [~라는 것]이에요.",
          examples: [
            { topic: "집", sentence: "What I like most about this house is the view from the window.", highlight: "the view from the window" },
            { topic: "직장", sentence: "What I like most about this company is the flexible work hours.", highlight: "the flexible work hours" },
            { topic: "가전제품", sentence: "What I like most about this appliance is its convenience.", highlight: "its convenience" },
          ],
        },
        {
          id: "desc_2_04",
          template: "Inside the [장소], you can see [명사] everywhere.",
          translation: "[장소] 안에 들어가면, 어디서나 [~]을 볼 수 있어요.",
          examples: [
            { topic: "쇼핑", sentence: "Inside the shopping mall, you can see various brands everywhere.", highlight: "various brands" },
            { topic: "호텔", sentence: "Inside the hotel, you can see beautiful decorations everywhere.", highlight: "beautiful decorations" },
            { topic: "헬스클럽", sentence: "Inside the gym, you can see exercise equipment everywhere.", highlight: "exercise equipment" },
          ],
        },
        {
          id: "desc_2_05",
          template: "They offer a wide variety of [명사].",
          translation: "거긴 아주 다양한 [메뉴/서비스/시설 등]을 제공해요.",
          examples: [
            { topic: "음식점", sentence: "They offer a wide variety of Korean dishes.", highlight: "Korean dishes" },
            { topic: "헬스클럽", sentence: "They offer a wide variety of fitness programs.", highlight: "fitness programs" },
            { topic: "호텔", sentence: "They offer a wide variety of room types.", highlight: "room types" },
          ],
        },
        {
          id: "desc_2_06",
          template: "As for the exterior/interior, it looks very [형용사].",
          translation: "외관/내부에 대해 말하자면, 굉장히 [깔끔해/전통적이어] 보여요.",
          examples: [
            { topic: "집", sentence: "As for the interior, it looks very clean and organized.", highlight: "clean and organized" },
            { topic: "미용실", sentence: "As for the interior, it looks very stylish.", highlight: "stylish" },
            { topic: "은행", sentence: "As for the exterior, it looks very modern.", highlight: "modern" },
          ],
        },
        {
          id: "desc_2_07",
          template: "It takes about [숫자] minutes to get there from my house.",
          translation: "우리 집에서 거기까지 가는 데 한 [숫자]분 정도 걸려요.",
          examples: [
            { topic: "직장", sentence: "It takes about 30 minutes to get there from my house.", highlight: "30 minutes" },
            { topic: "헬스클럽", sentence: "It takes about 10 minutes to get there from my house.", highlight: "10 minutes" },
            { topic: "병원", sentence: "It takes about 15 minutes to get there from my house.", highlight: "15 minutes" },
          ],
        },
        {
          id: "desc_2_08",
          template: "I usually go there with [사람].",
          translation: "전 보통 거길 [친구들/가족]이랑 같이 가요.",
          examples: [
            { topic: "영화", sentence: "I usually go there with my friends.", highlight: "my friends" },
            { topic: "가족/친구", sentence: "I usually go there with my family.", highlight: "my family" },
            { topic: "모임", sentence: "I usually go there with my coworkers.", highlight: "my coworkers" },
          ],
        },
        {
          id: "desc_2_09",
          template: "Whenever I am there, I normally [동사].",
          translation: "거기 갈 때마다, 전 보통 [~해요].",
          examples: [
            { topic: "자유시간", sentence: "Whenever I am there, I normally read a book and drink coffee.", highlight: "read a book and drink coffee" },
            { topic: "헬스클럽", sentence: "Whenever I am there, I normally do weight training for an hour.", highlight: "do weight training for an hour" },
            { topic: "국내여행", sentence: "Whenever I am there, I normally try the local food.", highlight: "try the local food" },
          ],
        },
        {
          id: "desc_2_10",
          template: "It is fully equipped with [명사].",
          translation: "거긴 [~]이 아주 잘 갖춰져 있어요.",
          examples: [
            { topic: "헬스클럽", sentence: "It is fully equipped with modern exercise machines.", highlight: "modern exercise machines" },
            { topic: "집", sentence: "It is fully equipped with the latest home appliances.", highlight: "the latest home appliances" },
            { topic: "호텔", sentence: "It is fully equipped with comfortable furniture and free Wi-Fi.", highlight: "comfortable furniture and free Wi-Fi" },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정 및 리액션 패턴",
      description: "OPIc 채점관이 AL/IH를 줄 때 가장 중요하게 보는 '나의 감정과 이유'를 덧붙이는 치트키 문장들",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "desc_3_01",
          template: "I really love this [대상] because it helps me relieve my stress.",
          translation: "제가 이 [대상]을 정말 좋아하는 이유는 제 스트레스를 풀어주기 때문이에요.",
          examples: [
            { topic: "음악", sentence: "I really love music because it helps me relieve my stress.", highlight: "music" },
            { topic: "자전거", sentence: "I really love cycling because it helps me relieve my stress.", highlight: "cycling" },
            { topic: "영화", sentence: "I really love watching movies because it helps me relieve my stress.", highlight: "watching movies" },
          ],
        },
        {
          id: "desc_3_02",
          template: "The staff/people at [장소] are always kind and welcoming.",
          translation: "[장소]의 직원들/사람들은 항상 친절하고 반갑게 맞아줘요.",
          examples: [
            { topic: "미용실", sentence: "The staff at the hair salon are always kind and welcoming.", highlight: "the hair salon" },
            { topic: "병원", sentence: "The staff at the hospital are always kind and welcoming.", highlight: "the hospital" },
            { topic: "음식점", sentence: "The people at the restaurant are always kind and welcoming.", highlight: "the restaurant" },
          ],
        },
        {
          id: "desc_3_03",
          template: "It makes me feel [감정] whenever I use/visit it.",
          translation: "그걸 사용할/방문할 때마다 전 [편안한/활기찬] 기분이 들어요.",
          examples: [
            { topic: "건강", sentence: "It makes me feel energetic whenever I work out.", highlight: "energetic" },
            { topic: "음악", sentence: "It makes me feel relaxed whenever I listen to music.", highlight: "relaxed" },
            { topic: "국내여행", sentence: "It makes me feel refreshed whenever I travel.", highlight: "refreshed" },
          ],
        },
        {
          id: "desc_3_04",
          template: "To be honest, I can't imagine my life without [대상].",
          translation: "솔직히 말해서, [대상] 없는 제 삶은 상상할 수가 없네요.",
          examples: [
            { topic: "인터넷", sentence: "To be honest, I can't imagine my life without the internet.", highlight: "the internet" },
            { topic: "전화기", sentence: "To be honest, I can't imagine my life without my smartphone.", highlight: "my smartphone" },
            { topic: "음악", sentence: "To be honest, I can't imagine my life without music.", highlight: "music" },
          ],
        },
        {
          id: "desc_3_05",
          template: "[대상] is totally worth the time and money.",
          translation: "[대상]은 시간과 돈을 투자할 가치가 충분해요.",
          examples: [
            { topic: "헬스클럽", sentence: "The gym membership is totally worth the time and money.", highlight: "The gym membership" },
            { topic: "해외여행", sentence: "Traveling abroad is totally worth the time and money.", highlight: "Traveling abroad" },
            { topic: "공연", sentence: "Going to concerts is totally worth the time and money.", highlight: "Going to concerts" },
          ],
        },
        {
          id: "desc_3_06",
          template: "For these reasons, [대상] has become a huge part of my daily routine.",
          translation: "이런 이유들 때문에, [대상]은 제 일상생활의 아주 큰 부분이 되었어요.",
          examples: [
            { topic: "건강", sentence: "For these reasons, working out has become a huge part of my daily routine.", highlight: "working out" },
            { topic: "음식", sentence: "For these reasons, cooking has become a huge part of my daily routine.", highlight: "cooking" },
            { topic: "인터넷", sentence: "For these reasons, browsing the internet has become a huge part of my daily routine.", highlight: "browsing the internet" },
          ],
        },
        {
          id: "desc_3_07",
          template: "I feel so refreshed after I finish [동명사].",
          translation: "[~을] 끝내고 나면 기분이 정말 상쾌해져요.",
          examples: [
            { topic: "건강", sentence: "I feel so refreshed after I finish exercising.", highlight: "exercising" },
            { topic: "쇼핑", sentence: "I feel so refreshed after I finish shopping.", highlight: "shopping" },
            { topic: "자전거", sentence: "I feel so refreshed after I finish cycling.", highlight: "cycling" },
          ],
        },
        {
          id: "desc_3_08",
          template: "[대상] is the perfect place/way to take a break from my busy life.",
          translation: "[대상]은 제 바쁜 일상 속에서 휴식을 취하기에 완벽한 곳/방법이에요.",
          examples: [
            { topic: "국내여행", sentence: "Traveling is the perfect way to take a break from my busy life.", highlight: "Traveling" },
            { topic: "자유시간", sentence: "Going to a cafe is the perfect way to take a break from my busy life.", highlight: "Going to a cafe" },
            { topic: "집에서 보내는 휴가", sentence: "Staying home is the perfect way to take a break from my busy life.", highlight: "Staying home" },
          ],
        },
        {
          id: "desc_3_09",
          template: "I was really impressed by its [명사].",
          translation: "전 그것의 [퀄리티/서비스]에 정말 깊은 인상을 받았어요.",
          examples: [
            { topic: "음식점", sentence: "I was really impressed by its food quality.", highlight: "food quality" },
            { topic: "호텔", sentence: "I was really impressed by its customer service.", highlight: "customer service" },
            { topic: "가전제품", sentence: "I was really impressed by its performance.", highlight: "performance" },
          ],
        },
        {
          id: "desc_3_10",
          template: "[대상] totally fits my personal taste.",
          translation: "[대상]은 완전 제 개인적인 취향에 딱 맞아요.",
          examples: [
            { topic: "패션", sentence: "This brand's style totally fits my personal taste.", highlight: "This brand's style" },
            { topic: "음악", sentence: "This genre of music totally fits my personal taste.", highlight: "This genre of music" },
            { topic: "가구", sentence: "This kind of furniture totally fits my personal taste.", highlight: "This kind of furniture" },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description: "말문이 막혀서 정적이 흐르기 전에, '내 답변은 여기까지야'라고 깔끔하게 치고 빠지는 문장들",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "desc_4_01",
          template: "So, this is everything I can say about [대상].",
          translation: "그래서, 이게 제가 [대상]에 대해 말할 수 있는 전부예요.",
          examples: [
            { topic: "집", sentence: "So, this is everything I can say about my house.", highlight: "my house" },
            { topic: "음식점", sentence: "So, this is everything I can say about my favorite restaurant.", highlight: "my favorite restaurant" },
            { topic: "직장", sentence: "So, this is everything I can say about my workplace.", highlight: "my workplace" },
          ],
        },
        {
          id: "desc_4_02",
          template: "Overall, I highly recommend this [대상] to everyone.",
          translation: "전반적으로, 전 이 [대상]을 모두에게 강력히 추천해요.",
          examples: [
            { topic: "음식점", sentence: "Overall, I highly recommend this restaurant to everyone.", highlight: "restaurant" },
            { topic: "헬스클럽", sentence: "Overall, I highly recommend this gym to everyone.", highlight: "gym" },
            { topic: "가전제품", sentence: "Overall, I highly recommend this product to everyone.", highlight: "product" },
          ],
        },
        {
          id: "desc_4_03",
          template: "If you have a chance, you should definitely check it out.",
          translation: "기회가 된다면, 꼭 한 번 가보세요/써보세요.",
          examples: [
            { topic: "국내여행", sentence: "If you have a chance, you should definitely visit Busan.", highlight: "visit Busan" },
            { topic: "공연", sentence: "If you have a chance, you should definitely see a K-pop concert.", highlight: "see a K-pop concert" },
            { topic: "음식", sentence: "If you have a chance, you should definitely try Korean BBQ.", highlight: "try Korean BBQ" },
          ],
        },
        {
          id: "desc_4_04",
          template: "To sum up, [대상] is my absolute favorite.",
          translation: "요약하자면, [대상]은 제 최애예요.",
          examples: [
            { topic: "음악", sentence: "To sum up, K-pop is my absolute favorite.", highlight: "K-pop" },
            { topic: "음식", sentence: "To sum up, Korean BBQ is my absolute favorite.", highlight: "Korean BBQ" },
            { topic: "영화", sentence: "To sum up, action movies are my absolute favorite.", highlight: "action movies" },
          ],
        },
        {
          id: "desc_4_05",
          template: "I'm looking forward to going/using there again soon.",
          translation: "조만간 또 거기 가길/그걸 쓰길 기대하고 있어요.",
          examples: [
            { topic: "해외여행", sentence: "I'm looking forward to traveling abroad again soon.", highlight: "traveling abroad" },
            { topic: "공연", sentence: "I'm looking forward to going to a concert again soon.", highlight: "going to a concert" },
            { topic: "헬스클럽", sentence: "I'm looking forward to going to the gym again soon.", highlight: "going to the gym" },
          ],
        },
      ],
    },
  ],
};
