import type { PatternSet } from "@/lib/types/patterns";

export const rp12Patterns: PatternSet = {
  questionType: "rp_12",
  label: "대안제시",
  phases: [
    {
      phase: 1,
      title: "도입부 패턴",
      description:
        "문제 상황을 설명하며 전화를 시작하는 문장들",
      color: "green",
      emoji: "🟢",
      patterns: [
        {
          id: "rp12_1_01",
          template:
            "Hi, I'm calling because I have a problem with [주제].",
          translation:
            "안녕하세요, [주제]에 문제가 있어서 전화 드렸어요.",
          examples: [
            {
              topic: "예약",
              sentence:
                "Hi, I'm calling because I have a problem with my reservation.",
              highlight: "my reservation",
            },
            {
              topic: "전화기",
              sentence:
                "Hi, I'm calling because I have a problem with my phone.",
              highlight: "my phone",
            },
            {
              topic: "호텔",
              sentence:
                "Hi, I'm calling because I have a problem with my hotel room.",
              highlight: "my hotel room",
            },
          ],
        },
        {
          id: "rp12_1_02",
          template:
            "Hello, something went wrong with [주제] and I need your help.",
          translation:
            "안녕하세요, [주제]에 문제가 생겼는데 도움이 필요해요.",
          examples: [
            {
              topic: "기차표",
              sentence:
                "Hello, something went wrong with my ticket booking and I need your help.",
              highlight: "my ticket booking",
            },
            {
              topic: "자동차 고장",
              sentence:
                "Hello, something went wrong with my car engine and I need your help.",
              highlight: "my car engine",
            },
            {
              topic: "인터넷",
              sentence:
                "Hello, something went wrong with my internet connection and I need your help.",
              highlight: "my internet connection",
            },
          ],
        },
        {
          id: "rp12_1_03",
          template:
            "Hi, I'm sorry to bother you, but I'm having an issue with [주제].",
          translation:
            "안녕하세요, 번거롭게 해서 죄송한데 [주제]에 문제가 있어요.",
          examples: [
            {
              topic: "병원",
              sentence:
                "Hi, I'm sorry to bother you, but I'm having an issue with my prescription.",
              highlight: "my prescription",
            },
            {
              topic: "호텔(날씨)",
              sentence:
                "Hi, I'm sorry to bother you, but I'm having an issue with the outdoor event due to rain.",
              highlight: "the outdoor event due to rain",
            },
            {
              topic: "스피커 테스트",
              sentence:
                "Hi, I'm sorry to bother you, but I'm having an issue with the speaker system.",
              highlight: "the speaker system",
            },
          ],
        },
        {
          id: "rp12_1_04",
          template:
            "I recently [동사했는데], and unfortunately there's a problem I need to discuss.",
          translation:
            "최근에 [~했는데], 안타깝게도 논의해야 할 문제가 있어요.",
          examples: [
            {
              topic: "가전제품",
              sentence:
                "I recently bought a washing machine, and unfortunately there's a problem I need to discuss.",
              highlight: "bought a washing machine",
            },
            {
              topic: "여행(공항)",
              sentence:
                "I recently booked a flight, and unfortunately there's a problem I need to discuss.",
              highlight: "booked a flight",
            },
            {
              topic: "부동산",
              sentence:
                "I recently moved into a new apartment, and unfortunately there's a problem I need to discuss.",
              highlight: "moved into a new apartment",
            },
          ],
        },
        {
          id: "rp12_1_05",
          template:
            "Hi, I hope you can help me. I ran into a problem with [주제].",
          translation:
            "안녕하세요, 도와주실 수 있으면 좋겠어요. [주제]에서 문제가 생겼어요.",
          examples: [
            {
              topic: "가구",
              sentence:
                "Hi, I hope you can help me. I ran into a problem with the furniture I ordered.",
              highlight: "the furniture I ordered",
            },
            {
              topic: "렌터카",
              sentence:
                "Hi, I hope you can help me. I ran into a problem with my car rental.",
              highlight: "my car rental",
            },
            {
              topic: "옷 구매",
              sentence:
                "Hi, I hope you can help me. I ran into a problem with the clothes I bought online.",
              highlight: "the clothes I bought online",
            },
          ],
        },
      ],
    },
    {
      phase: 2,
      title: "전개 패턴",
      description:
        "문제를 구체적으로 설명하고, 대안이나 해결책을 제시하는 핵심 문장들",
      color: "blue",
      emoji: "🔵",
      patterns: [
        {
          id: "rp12_2_01",
          template:
            "The problem is that [문제 설명]. Is there any way to fix this?",
          translation:
            "문제는 [문제 설명]이에요. 이걸 해결할 방법이 있을까요?",
          examples: [
            {
              topic: "옷 구매",
              sentence:
                "The problem is that I received the wrong size. Is there any way to fix this?",
              highlight: "I received the wrong size",
            },
            {
              topic: "호텔",
              sentence:
                "The problem is that the air conditioner isn't working. Is there any way to fix this?",
              highlight: "the air conditioner isn't working",
            },
            {
              topic: "전화기",
              sentence:
                "The problem is that the screen is cracked. Is there any way to fix this?",
              highlight: "the screen is cracked",
            },
          ],
        },
        {
          id: "rp12_2_02",
          template:
            "Would it be possible to [대안]? That would really help.",
          translation:
            "[대안]이 가능할까요? 그러면 정말 도움이 될 거예요.",
          examples: [
            {
              topic: "옷 구매",
              sentence:
                "Would it be possible to exchange it for a different size? That would really help.",
              highlight: "exchange it for a different size",
            },
            {
              topic: "예약",
              sentence:
                "Would it be possible to reschedule to next week? That would really help.",
              highlight: "reschedule to next week",
            },
            {
              topic: "호텔",
              sentence:
                "Would it be possible to upgrade to a bigger room? That would really help.",
              highlight: "upgrade to a bigger room",
            },
          ],
        },
        {
          id: "rp12_2_03",
          template:
            "Instead of [원래 계획], could we [대안]?",
          translation:
            "[원래 계획] 대신에, [대안]으로 할 수 있을까요?",
          examples: [
            {
              topic: "가전제품",
              sentence:
                "Instead of a refund, could we exchange it for a different model?",
              highlight: "exchange it for a different model",
            },
            {
              topic: "병원예약",
              sentence:
                "Instead of canceling, could we move it to a different date?",
              highlight: "move it to a different date",
            },
            {
              topic: "기차표",
              sentence:
                "Instead of waiting, could we take an earlier train?",
              highlight: "take an earlier train",
            },
          ],
        },
        {
          id: "rp12_2_04",
          template:
            "I understand the situation, but could you help me find another option?",
          translation:
            "상황은 이해하는데, 다른 옵션을 찾는 걸 도와주실 수 있나요?",
          examples: [
            {
              topic: "호텔",
              sentence:
                "I understand the room is fully booked, but could you help me find another option?",
              highlight: "the room is fully booked",
            },
            {
              topic: "여행(공항)",
              sentence:
                "I understand the flight is canceled, but could you help me find another option?",
              highlight: "the flight is canceled",
            },
            {
              topic: "공연",
              sentence:
                "I understand the show is sold out, but could you help me find another option?",
              highlight: "the show is sold out",
            },
          ],
        },
        {
          id: "rp12_2_05",
          template:
            "What I'd like to suggest is [대안]. Would that work for you?",
          translation:
            "제가 제안하고 싶은 건 [대안]이에요. 가능할까요?",
          examples: [
            {
              topic: "약속",
              sentence:
                "What I'd like to suggest is meeting online instead. Would that work for you?",
              highlight: "meeting online instead",
            },
            {
              topic: "상점문의",
              sentence:
                "What I'd like to suggest is getting a store credit. Would that work for you?",
              highlight: "getting a store credit",
            },
            {
              topic: "호텔(날씨)",
              sentence:
                "What I'd like to suggest is holding the event indoors. Would that work for you?",
              highlight: "holding the event indoors",
            },
          ],
        },
        {
          id: "rp12_2_06",
          template:
            "Since [상황], I think [대안] might be a good solution.",
          translation:
            "[상황]이니까, [대안]이 좋은 해결책이 될 것 같아요.",
          examples: [
            {
              topic: "날씨",
              sentence:
                "Since it's going to rain, I think moving the picnic indoors might be a good solution.",
              highlight: "moving the picnic indoors",
            },
            {
              topic: "병원",
              sentence:
                "Since I can't make it in the morning, I think the afternoon session might be a good solution.",
              highlight: "the afternoon session",
            },
            {
              topic: "가전제품",
              sentence:
                "Since it's out of stock, I think ordering a similar model might be a good solution.",
              highlight: "ordering a similar model",
            },
          ],
        },
        {
          id: "rp12_2_07",
          template:
            "I was hoping you could [요청]. If not, I'm open to other suggestions.",
          translation:
            "[요청]해주실 수 있으면 좋겠는데요. 안 되면 다른 제안도 괜찮아요.",
          examples: [
            {
              topic: "옷 구매",
              sentence:
                "I was hoping you could give me a full refund. If not, I'm open to other suggestions.",
              highlight: "give me a full refund",
            },
            {
              topic: "전화기",
              sentence:
                "I was hoping you could repair it for free. If not, I'm open to other suggestions.",
              highlight: "repair it for free",
            },
            {
              topic: "가구",
              sentence:
                "I was hoping you could send a replacement right away. If not, I'm open to other suggestions.",
              highlight: "send a replacement right away",
            },
          ],
        },
        {
          id: "rp12_2_08",
          template:
            "How about [대안]? I think that could work for both of us.",
          translation:
            "[대안]은 어떨까요? 서로한테 다 괜찮을 것 같아요.",
          examples: [
            {
              topic: "병원예약",
              sentence:
                "How about rescheduling to Wednesday? I think that could work for both of us.",
              highlight: "rescheduling to Wednesday",
            },
            {
              topic: "약속",
              sentence:
                "How about meeting at a different location? I think that could work for both of us.",
              highlight: "meeting at a different location",
            },
            {
              topic: "자동차 고장",
              sentence:
                "How about using a loaner car while mine is being fixed? I think that could work for both of us.",
              highlight: "using a loaner car while mine is being fixed",
            },
          ],
        },
        {
          id: "rp12_2_09",
          template:
            "If [문제 상황] is not possible, then maybe we could try [대안].",
          translation:
            "만약 [문제 상황]이 불가능하다면, [대안]을 시도해볼 수도 있을 것 같아요.",
          examples: [
            {
              topic: "가전제품",
              sentence:
                "If getting a cash refund is not possible, then maybe we could try a store voucher.",
              highlight: "a store voucher",
            },
            {
              topic: "공연",
              sentence:
                "If front-row seats are not possible, then maybe we could try the second row.",
              highlight: "the second row",
            },
            {
              topic: "기차표",
              sentence:
                "If the morning train is not possible, then maybe we could try the afternoon one.",
              highlight: "the afternoon one",
            },
          ],
        },
        {
          id: "rp12_2_10",
          template:
            "Could you check if there's any way to [해결 방안]? I'd really appreciate it.",
          translation:
            "[해결 방안]할 수 있는 방법이 있는지 확인해주실 수 있나요? 정말 감사하겠어요.",
          examples: [
            {
              topic: "호텔",
              sentence:
                "Could you check if there's any way to move me to a different room? I'd really appreciate it.",
              highlight: "move me to a different room",
            },
            {
              topic: "자동차 고장",
              sentence:
                "Could you check if there's any way to speed up the repair? I'd really appreciate it.",
              highlight: "speed up the repair",
            },
            {
              topic: "렌터카",
              sentence:
                "Could you check if there's any way to apply a discount? I'd really appreciate it.",
              highlight: "apply a discount",
            },
          ],
        },
      ],
    },
    {
      phase: 3,
      title: "감정/리액션 패턴",
      description:
        "문제 해결 과정에서 감정을 표현하고 상대방의 도움에 반응하는 문장들",
      color: "orange",
      emoji: "🟠",
      patterns: [
        {
          id: "rp12_3_01",
          template:
            "I understand, and I really appreciate you looking into this for me.",
          translation:
            "이해해요, 이 문제를 알아봐주셔서 정말 감사합니다.",
          examples: [
            {
              topic: "자동차 고장",
              sentence:
                "I understand it takes time, and I really appreciate you looking into the repair for me.",
              highlight: "the repair",
            },
            {
              topic: "가구",
              sentence:
                "I understand it's complicated, and I really appreciate you looking into the delivery issue for me.",
              highlight: "the delivery issue",
            },
            {
              topic: "옷 구매",
              sentence:
                "I understand the policy, and I really appreciate you looking into the refund for me.",
              highlight: "the refund",
            },
          ],
        },
        {
          id: "rp12_3_02",
          template:
            "That's a relief! I was really worried about [걱정했던 것].",
          translation:
            "다행이에요! [걱정했던 것] 때문에 정말 걱정했거든요.",
          examples: [
            {
              topic: "예약",
              sentence:
                "That's a relief! I was really worried about missing the event.",
              highlight: "missing the event",
            },
            {
              topic: "전화기",
              sentence:
                "That's a relief! I was really worried about not getting a replacement.",
              highlight: "not getting a replacement",
            },
            {
              topic: "은행",
              sentence:
                "That's a relief! I was really worried about losing my money.",
              highlight: "losing my money",
            },
          ],
        },
        {
          id: "rp12_3_03",
          template:
            "I know it's not your fault, but this situation is really frustrating for me.",
          translation:
            "당신 잘못이 아닌 건 알지만, 이 상황이 정말 답답해요.",
          examples: [
            {
              topic: "가구",
              sentence:
                "I know it's not your fault, but waiting two more weeks is really frustrating for me.",
              highlight: "waiting two more weeks",
            },
            {
              topic: "인터넷",
              sentence:
                "I know it's not your fault, but having no internet for three days is really frustrating for me.",
              highlight: "having no internet for three days",
            },
            {
              topic: "예약",
              sentence:
                "I know it's not your fault, but losing my reservation is really frustrating for me.",
              highlight: "losing my reservation",
            },
          ],
        },
        {
          id: "rp12_3_04",
          template:
            "Thank you for being so understanding. That really means a lot to me.",
          translation:
            "이해해주셔서 감사합니다. 정말 큰 의미예요.",
          examples: [
            {
              topic: "옷 구매",
              sentence:
                "Thank you for agreeing to the exchange. That really means a lot to me.",
              highlight: "agreeing to the exchange",
            },
            {
              topic: "병원예약",
              sentence:
                "Thank you for extending the appointment time. That really means a lot to me.",
              highlight: "extending the appointment time",
            },
            {
              topic: "렌터카",
              sentence:
                "Thank you for offering the discount. That really means a lot to me.",
              highlight: "offering the discount",
            },
          ],
        },
        {
          id: "rp12_3_05",
          template:
            "I'm glad we could work this out. You've been very patient with me.",
          translation:
            "이걸 해결할 수 있어서 다행이에요. 정말 인내심 있게 대해주셨어요.",
          examples: [
            {
              topic: "가전제품",
              sentence:
                "I'm glad we could work out the exchange. You've been very patient with me.",
              highlight: "the exchange",
            },
            {
              topic: "전화기",
              sentence:
                "I'm glad we could work out the refund. You've been very patient with me.",
              highlight: "the refund",
            },
            {
              topic: "병원예약",
              sentence:
                "I'm glad we could work out the new schedule. You've been very patient with me.",
              highlight: "the new schedule",
            },
          ],
        },
        {
          id: "rp12_3_06",
          template:
            "Honestly, I was a bit stressed about this, but now I feel much better.",
          translation:
            "솔직히 이 일 때문에 좀 스트레스 받았는데, 지금은 훨씬 나아졌어요.",
          examples: [
            {
              topic: "전화기",
              sentence:
                "Honestly, I was a bit stressed about the broken screen, but now I feel much better.",
              highlight: "the broken screen",
            },
            {
              topic: "여행(공항)",
              sentence:
                "Honestly, I was a bit stressed about the canceled flight, but now I feel much better.",
              highlight: "the canceled flight",
            },
            {
              topic: "가전제품",
              sentence:
                "Honestly, I was a bit stressed about the defective product, but now I feel much better.",
              highlight: "the defective product",
            },
          ],
        },
        {
          id: "rp12_3_07",
          template:
            "That solution works perfectly for me. I really didn't expect such a quick response.",
          translation:
            "그 해결책이 딱 좋아요. 이렇게 빠른 대응은 기대하지 못했어요.",
          examples: [
            {
              topic: "옷 구매",
              sentence:
                "Same-day exchange works perfectly for me. I really didn't expect such a quick response.",
              highlight: "Same-day exchange",
            },
            {
              topic: "가전제품",
              sentence:
                "An immediate refund works perfectly for me. I really didn't expect such a quick response.",
              highlight: "An immediate refund",
            },
            {
              topic: "가구",
              sentence:
                "Free express shipping works perfectly for me. I really didn't expect such a quick response.",
              highlight: "Free express shipping",
            },
          ],
        },
        {
          id: "rp12_3_08",
          template:
            "I really hope this won't happen again, but I'm glad you could help me today.",
          translation:
            "이런 일이 다시 안 생기면 좋겠지만, 오늘 도와주셔서 기쁩니다.",
          examples: [
            {
              topic: "가구",
              sentence:
                "I really hope the wrong delivery won't happen again, but I'm glad you could help me today.",
              highlight: "the wrong delivery",
            },
            {
              topic: "은행",
              sentence:
                "I really hope the double charge won't happen again, but I'm glad you could help me today.",
              highlight: "the double charge",
            },
            {
              topic: "예약",
              sentence:
                "I really hope the booking error won't happen again, but I'm glad you could help me today.",
              highlight: "the booking error",
            },
          ],
        },
        {
          id: "rp12_3_09",
          template:
            "I'm so thankful you found a solution. This was really important to me.",
          translation:
            "해결책을 찾아주셔서 정말 감사해요. 이건 저한테 정말 중요한 일이었어요.",
          examples: [
            {
              topic: "여행(공항)",
              sentence:
                "I'm so thankful you found an alternative flight. This trip was really important to me.",
              highlight: "an alternative flight",
            },
            {
              topic: "생일파티",
              sentence:
                "I'm so thankful you found a replacement cake. This birthday party was really important to me.",
              highlight: "a replacement cake",
            },
            {
              topic: "호텔(날씨)",
              sentence:
                "I'm so thankful you found a new venue. This event was really important to me.",
              highlight: "a new venue",
            },
          ],
        },
        {
          id: "rp12_3_10",
          template:
            "Your service has been excellent. I'll definitely come back again.",
          translation:
            "서비스가 정말 훌륭했어요. 꼭 다시 올게요.",
          examples: [
            {
              topic: "상점문의",
              sentence:
                "Your customer service has been excellent. I'll definitely shop here again.",
              highlight: "shop here",
            },
            {
              topic: "호텔",
              sentence:
                "Your hotel service has been excellent. I'll definitely stay here again.",
              highlight: "stay here",
            },
            {
              topic: "음식점",
              sentence:
                "Your restaurant service has been excellent. I'll definitely eat here again.",
              highlight: "eat here",
            },
          ],
        },
      ],
    },
    {
      phase: 4,
      title: "마무리 패턴",
      description:
        "문제 해결 후 감사를 표현하며 자연스럽게 대화를 마무리하는 문장들",
      color: "red",
      emoji: "🔴",
      patterns: [
        {
          id: "rp12_4_01",
          template:
            "I'm glad we were able to solve this. Thanks again for everything!",
          translation:
            "이걸 해결할 수 있어서 기쁩니다. 모든 것에 다시 한번 감사드려요!",
          examples: [
            {
              topic: "옷 구매",
              sentence:
                "I'm glad we were able to solve the exchange issue. Thanks again for everything!",
              highlight: "the exchange issue",
            },
            {
              topic: "예약",
              sentence:
                "I'm glad we were able to solve the booking problem. Thanks again for everything!",
              highlight: "the booking problem",
            },
            {
              topic: "자동차 고장",
              sentence:
                "I'm glad we were able to solve the repair issue. Thanks again for everything!",
              highlight: "the repair issue",
            },
          ],
        },
        {
          id: "rp12_4_02",
          template:
            "Thank you for your help. I feel much better about the situation now.",
          translation:
            "도와주셔서 감사합니다. 이제 상황이 훨씬 나아진 것 같아요.",
          examples: [
            {
              topic: "가전제품",
              sentence:
                "Thank you for processing the refund. I feel much better about the situation now.",
              highlight: "processing the refund",
            },
            {
              topic: "가구",
              sentence:
                "Thank you for arranging the re-delivery. I feel much better about the situation now.",
              highlight: "arranging the re-delivery",
            },
            {
              topic: "전화기",
              sentence:
                "Thank you for resolving the issue so quickly. I feel much better about the situation now.",
              highlight: "resolving the issue so quickly",
            },
          ],
        },
        {
          id: "rp12_4_03",
          template:
            "You've been really helpful. I'll keep your advice in mind for next time.",
          translation:
            "정말 도움이 많이 되셨어요. 다음에는 조언을 참고할게요.",
          examples: [
            {
              topic: "렌터카",
              sentence:
                "You've been really helpful. I'll keep your advice about insurance in mind for next time.",
              highlight: "about insurance",
            },
            {
              topic: "가전제품",
              sentence:
                "You've been really helpful. I'll keep your advice about the warranty in mind for next time.",
              highlight: "about the warranty",
            },
            {
              topic: "호텔",
              sentence:
                "You've been really helpful. I'll keep your advice about early booking in mind for next time.",
              highlight: "about early booking",
            },
          ],
        },
        {
          id: "rp12_4_04",
          template:
            "Everything is settled now. I appreciate your patience and support.",
          translation:
            "이제 다 해결됐어요. 인내심과 도움에 감사드립니다.",
          examples: [
            {
              topic: "은행",
              sentence:
                "The payment issue is settled now. I appreciate your patience and support.",
              highlight: "The payment issue",
            },
            {
              topic: "옷 구매",
              sentence:
                "The exchange is settled now. I appreciate your patience and support.",
              highlight: "The exchange",
            },
            {
              topic: "병원예약",
              sentence:
                "The schedule change is settled now. I appreciate your patience and support.",
              highlight: "The schedule change",
            },
          ],
        },
        {
          id: "rp12_4_05",
          template:
            "Thanks so much for going above and beyond. Have a great day!",
          translation:
            "기대 이상으로 도와주셔서 정말 감사해요. 좋은 하루 보내세요!",
          examples: [
            {
              topic: "상점문의",
              sentence:
                "Thanks so much for going above and beyond with the customer service. Have a great day!",
              highlight: "the customer service",
            },
            {
              topic: "자동차 고장",
              sentence:
                "Thanks so much for going above and beyond with the repair. Have a great day!",
              highlight: "the repair",
            },
            {
              topic: "가구",
              sentence:
                "Thanks so much for going above and beyond with the delivery. Have a great day!",
              highlight: "the delivery",
            },
          ],
        },
      ],
    },
  ],
};
