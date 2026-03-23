-- ============================================
-- 드릴 카탈로그 전면 업데이트 — 설계 문서 기반
-- name_ko 한국어 + training_method 상세 + success_criteria 상세
-- ============================================

-- Tier 1 (→IL)
UPDATE tutoring_drill_catalog SET
  name_ko = '문장 만들기',
  training_method = '{"rounds": 3, "description": "SVO 구조로 완전한 문장 만들기. 단어 나열이 아닌 주어+동사+목적어 문장을 만드는 연습.", "template": "I [동사] [목적어].\nI usually [동사] [빈도].\nI like it because [이유].", "target_expressions": ["I like ~", "I usually ~", "There is ~", "I want to ~", "I have ~"]}'::jsonb,
  success_criteria = '{"metric": "30초 답변 내 완전한 문장 수", "threshold": "3개 이상", "measurement": "gpt_count"}'::jsonb
WHERE code = 'sentence_formation';

UPDATE tutoring_drill_catalog SET
  name_ko = '기본 거래',
  training_method = '{"rounds": 3, "description": "질문이 묻는 것에 대해 관련 있는 대답을 하는 연습. 질문을 듣고 핵심 키워드를 파악한 후 직접 대답한다.", "target_expressions": ["Yes, I ~", "No, I do not ~", "I think ~", "In my opinion ~"]}'::jsonb,
  success_criteria = '{"metric": "과제 충족률", "threshold": "50% 이상", "measurement": "gpt_count"}'::jsonb
WHERE code = 'basic_transaction';

UPDATE tutoring_drill_catalog SET
  name_ko = '필수 패턴 장착',
  training_method = '{"rounds": 3, "description": "어떤 질문이든 쓸 수 있는 만능 패턴 5개를 장착하는 연습. 패턴을 외우고 주제를 바꿔가며 반복한다.", "template": "I like [주제].\nI usually [동사] [빈도].\nThere is [장소/사물] near my house.\nI want to [하고 싶은 것].\nI have [소유물].", "target_expressions": ["I like ~", "I usually ~", "There is ~", "I want to ~", "I have ~"]}'::jsonb,
  success_criteria = '{"metric": "만능 패턴 사용 수", "threshold": "5개 중 3개 이상 사용", "measurement": "keyword_match"}'::jsonb
WHERE code = 'essential_patterns';

UPDATE tutoring_drill_catalog SET
  name_ko = '기초 어휘 확장',
  training_method = '{"rounds": 3, "description": "주제별 핵심 어휘를 교체하며 반복 연습. 같은 틀에 다른 어휘를 끼워넣는 바꿔 끼기 훈련.", "target_expressions": ["comfortable", "convenient", "spacious", "delicious", "interesting", "relaxing", "exciting", "beautiful", "crowded", "affordable"]}'::jsonb,
  success_criteria = '{"metric": "주제별 핵심 어휘 사용", "threshold": "10개 중 5개 이상", "measurement": "keyword_match"}'::jsonb
WHERE code = 'basic_vocabulary';

UPDATE tutoring_drill_catalog SET
  name_ko = '발음 명료도',
  training_method = '{"rounds": 3, "description": "핵심 단어를 또박또박 발음하는 연습. 빠르게 말하기보다 정확하게 전달하는 것이 목표."}'::jsonb,
  success_criteria = '{"metric": "발음 정확도 점수", "threshold": "60점 이상", "measurement": "speech_meta"}'::jsonb
WHERE code = 'pronunciation_clarity';

-- Tier 2 (→IM1~IM2)
UPDATE tutoring_drill_catalog SET
  name_ko = '발화량 확보',
  training_method = '{"rounds": 3, "description": "30초 이상 끊기지 않고 말하는 연습. 침묵 없이 이어서 말하는 지속력을 키운다."}'::jsonb,
  success_criteria = '{"metric": "연속 발화 시간", "threshold": "40초 이상", "measurement": "speech_meta"}'::jsonb
WHERE code = 'speech_volume';

UPDATE tutoring_drill_catalog SET
  name_ko = '주제 유지',
  training_method = '{"rounds": 3, "description": "질문에서 벗어나지 않고 관련된 내용만 말하는 연습. 주제 이탈을 스스로 인지하고 교정한다."}'::jsonb,
  success_criteria = '{"metric": "관련 없는 문장 수", "threshold": "1개 이하", "measurement": "gpt_count"}'::jsonb
WHERE code = 'topic_maintenance';

UPDATE tutoring_drill_catalog SET
  name_ko = '기본 연결어',
  training_method = '{"rounds": 3, "description": "and, so, but, because 4개 기본 연결어를 자연스럽게 사용하는 연습.", "target_expressions": ["and", "so", "but", "because", "also", "then"]}'::jsonb,
  success_criteria = '{"metric": "연결어 종류 수", "threshold": "3종 이상", "measurement": "keyword_match"}'::jsonb
WHERE code = 'basic_connectors';

UPDATE tutoring_drill_catalog SET
  name_ko = '4줄 만능 틀',
  training_method = '{"rounds": 3, "description": "강지완식 4줄 만능 틀을 장착하는 연습. 어떤 질문이든 4줄로 답할 수 있다.", "template": "① 핵심 답변: I [동사] [주제].\n② 이유/배경: Because [이유]. / The reason is [배경].\n③ 구체적 예시: For example, [경험/사례].\n④ 마무리: That is why I [재확인]. / So, [요약]."}'::jsonb,
  success_criteria = '{"metric": "4줄 구조 완성", "threshold": "도입-이유-예시-마무리 4요소 포함", "measurement": "gpt_count"}'::jsonb
WHERE code = 'frame_4line';

UPDATE tutoring_drill_catalog SET
  name_ko = '망설임 감소',
  training_method = '{"rounds": 3, "description": "3초 이상 긴 침묵을 줄이는 연습. 막힐 때 필러 표현으로 시간을 버는 전략.", "target_expressions": ["Well, let me think...", "That is a good question.", "Actually,", "You know,"]}'::jsonb,
  success_criteria = '{"metric": "3초 이상 침묵 횟수", "threshold": "2회 이하", "measurement": "speech_meta"}'::jsonb
WHERE code = 'hesitation_reduction';

UPDATE tutoring_drill_catalog SET
  name_ko = '질문 대응',
  training_method = '{"rounds": 3, "description": "질문이 묻는 것에 대해 먼저 한 문장으로 직답하고, 그 뒤에 설명을 붙이는 연습.", "template": "① 직답: Yes/No + 핵심 1문장\n② 이유: Because [이유]\n③ 예시: For example, [구체적 경험]"}'::jsonb,
  success_criteria = '{"metric": "질문 의도에 대한 직답 포함 여부", "threshold": "첫 2문장 내 직답 포함", "measurement": "gpt_count"}'::jsonb
WHERE code = 'question_response';

UPDATE tutoring_drill_catalog SET
  name_ko = '소과제 체크리스트',
  training_method = '{"rounds": 3, "description": "multi-part 질문에서 하위 항목을 빠짐없이 답변하는 연습. 강지완: 질문이 3개 있으면 반드시 3개 다 대답해.", "template": "① 질문 듣기 → 하위 항목 수 파악\n② 항목별 답변 (First, ~ / Second, ~ / Lastly, ~)\n③ 누락 자가 점검"}'::jsonb,
  success_criteria = '{"metric": "하위 항목 답변 비율", "threshold": "2/3 이상 항목 답변", "measurement": "gpt_count"}'::jsonb
WHERE code = 'multi_part_checklist';

-- Tier 3 (→IM3~IH) — 강지완 메소드 핵심
UPDATE tutoring_drill_catalog SET
  name_ko = '골격 문단 (Skeleton Paragraph)',
  training_method = '{"rounds": 3, "description": "강지완 핵심 전략: Topic Sentence → Support x3 → Concluding의 Skeleton Paragraph 구조로 말하는 연습. IM→IH의 결정적 차이는 문단 구조의 존재 여부.", "template": "① Topic: There are a few things I want to tell you about [주제].\n② Support 1: First of all, [내용]. Moreover, [디테일].\n③ Support 2: On top of that, [내용]. As a result, [결과].\n④ Support 3: Last but not least, [내용].\n⑤ Concluding: That is pretty much everything about [주제].", "target_expressions": ["There are a few things", "First of all", "On top of that", "Last but not least", "That is pretty much everything"]}'::jsonb,
  success_criteria = '{"metric": "Skeleton Paragraph 구조 형성", "threshold": "3회 중 2회에서 Topic-Support-Concluding 구조 확인", "measurement": "gpt_count"}'::jsonb
WHERE code = 'skeleton_paragraph';

UPDATE tutoring_drill_catalog SET
  name_ko = '연결어 다양성',
  training_method = '{"rounds": 3, "description": "강지완 9대 연결어를 답변에 자연스럽게 끼워넣는 바꿔 끼기 연습. and, so만 쓰던 습관에서 벗어난다.", "target_expressions": ["First of all", "On top of that", "Last but not least", "However", "On the other hand", "As a result", "Therefore", "Moreover", "In addition"]}'::jsonb,
  success_criteria = '{"metric": "답변 내 고유 연결어 종류 수", "threshold": "3회 중 2회에서 4종 이상", "measurement": "keyword_match"}'::jsonb
WHERE code = 'connector_diversity';

UPDATE tutoring_drill_catalog SET
  name_ko = '시제 시도',
  training_method = '{"rounds": 3, "description": "같은 에피소드를 과거/현재/미래 시제로 바꿔 말하는 연습. 시제 전환을 의식적으로 시도한다.", "target_expressions": ["I used to ~", "I went to ~", "These days, I ~", "I am planning to ~", "In the future, I want to ~"]}'::jsonb,
  success_criteria = '{"metric": "답변 내 시제 전환 횟수", "threshold": "시제 전환 2회 이상 (오류 허용)", "measurement": "gpt_count"}'::jsonb
WHERE code = 'tense_attempt';

UPDATE tutoring_drill_catalog SET
  name_ko = '마무리 문장',
  training_method = '{"rounds": 3, "description": "답변을 명확히 끝내는 Concluding Sentence를 장착하는 연습.", "template": "마무리 패턴:\n- That is pretty much everything about [주제].\n- So, that is why I [재확인].\n- Overall, I really enjoy [주제].\n- Those are the main reasons why I [결론].", "target_expressions": ["That is pretty much everything", "So, that is why", "Overall,", "Those are the main reasons"]}'::jsonb,
  success_criteria = '{"metric": "마무리 문장 포함 여부", "threshold": "3회 중 2회에서 마무리 문장 포함", "measurement": "gpt_count"}'::jsonb
WHERE code = 'paragraph_closure';

UPDATE tutoring_drill_catalog SET
  name_ko = '디테일 추가',
  training_method = '{"rounds": 3, "description": "본론에 5감(시각/청각/촉각/미각/후각), 감정, 빈도 등 구체적 디테일을 추가하는 바꿔 끼기 연습.", "target_expressions": ["It looks ~", "It sounds ~", "It feels ~", "I feel ~ when", "usually / sometimes / every day", "about ~ times a week"]}'::jsonb,
  success_criteria = '{"metric": "본론당 디테일 수", "threshold": "본론당 구체적 디테일 2개 이상", "measurement": "gpt_count"}'::jsonb
WHERE code = 'description_depth';

UPDATE tutoring_drill_catalog SET
  name_ko = '시제 다양성',
  training_method = '{"rounds": 3, "description": "하나의 주제에 대해 과거/현재/미래 중 2개 이상 시제를 사용하는 바꿔 끼기 연습.", "target_expressions": ["When I was young, I used to ~", "These days, I usually ~", "In the future, I am planning to ~", "Last week, I went to ~", "Nowadays, I prefer ~"]}'::jsonb,
  success_criteria = '{"metric": "사용 시제 수", "threshold": "2개 이상 시제 사용", "measurement": "gpt_count"}'::jsonb
WHERE code = 'time_frame_variety';

UPDATE tutoring_drill_catalog SET
  name_ko = '과거 서술',
  training_method = '{"rounds": 3, "description": "과거 에피소드를 배경→사건→결과→소감 구조로 말하는 연습.", "template": "① 배경: Last [시간], I was at [장소].\n② 사건: Suddenly, [무슨 일이 벌어졌다].\n③ 결과: So, I [어떻게 대응했다].\n④ 소감: After that, I felt [감정]. It was a ~ experience."}'::jsonb,
  success_criteria = '{"metric": "과거 에피소드 구조 완성", "threshold": "배경-사건-결과-소감 4요소 중 3개 이상", "measurement": "gpt_count"}'::jsonb
WHERE code = 'past_narrative';

UPDATE tutoring_drill_catalog SET
  name_ko = '문장 완성도',
  training_method = '{"rounds": 3, "description": "미완성 문장(주어만 있고 동사 없음, 문장 중간에 끊김)을 인지하고 교정하는 연습."}'::jsonb,
  success_criteria = '{"metric": "미완성 문장 수", "threshold": "미완성 문장 1개 이하", "measurement": "gpt_count"}'::jsonb
WHERE code = 'sentence_completion';

UPDATE tutoring_drill_catalog SET
  name_ko = '논리 흐름',
  training_method = '{"rounds": 3, "description": "문장 간 인과/순서 관계를 명확히 하는 연습. 강지완: 그냥 나열하지 마. First, 다음에 Moreover, 다음에 As a result — 이 순서가 이유가 있어야 해.", "template": "① First of all, [첫 번째 포인트].\n② Moreover, [추가/심화 — 첫 번째와 관련].\n③ As a result, [결과 — 앞 내용의 인과]."}'::jsonb,
  success_criteria = '{"metric": "문장 간 논리 관계", "threshold": "3회 중 2회에서 인과/순서 관계 명확", "measurement": "gpt_count"}'::jsonb
WHERE code = 'thought_progression';

UPDATE tutoring_drill_catalog SET
  name_ko = '시제 프레임 유지',
  training_method = '{"rounds": 3, "description": "시작한 시제를 끝까지 유지하는 연습. went 쓰다가 go로 돌아가는 습관을 교정한다. 강지완: 시제 바꿔 끼기의 다음 단계. 바꿨으면 유지해야 해.", "target_expressions": ["과거 유지: went, had, was, did, enjoyed", "현재 유지: go, have, am, do, enjoy"]}'::jsonb,
  success_criteria = '{"metric": "시제 프레임 유지", "threshold": "시작한 시제를 끝까지 유지 (2회 중 2회)", "measurement": "gpt_count"}'::jsonb
WHERE code = 'timeframe_sustain';

UPDATE tutoring_drill_catalog SET
  name_ko = '이유 체인',
  training_method = '{"rounds": 3, "description": "왜-왜-예시 3단 공식으로 논증력을 키우는 연습. 강지완: 채점관이 why를 물으면 because + for example이 무조건 나와야 해.", "template": "① 주장: I think [의견].\n② 이유: Because [이유].\n③ 근거: For example, [구체적 사례]."}'::jsonb,
  success_criteria = '{"metric": "why-chain 단계", "threshold": "이유→근거→예시 2단계 이상", "measurement": "gpt_count"}'::jsonb
WHERE code = 'reason_chain';

-- Tier 4 (→AL)
UPDATE tutoring_drill_catalog SET
  name_ko = '시제 정확성',
  training_method = '{"rounds": 3, "description": "went/go 혼동을 제거하고 일관된 시제를 유지하는 자기 교정 연습. 강지완 AL 4대 감점 중 하나.", "target_expressions": ["went (not go)", "had (not have)", "was (not is)", "did (not do)", "enjoyed (not enjoy)"]}'::jsonb,
  success_criteria = '{"metric": "시제 오류 수", "threshold": "2분 답변에서 시제 오류 2개 이하", "measurement": "gpt_count"}'::jsonb
WHERE code = 'tense_accuracy';

UPDATE tutoring_drill_catalog SET
  name_ko = '문단 지속',
  training_method = '{"rounds": 3, "description": "2분 전체를 문단 구조로 유지하는 연습. 후반부에서 문장 나열로 퇴행하지 않는다. 강지완: IH는 문단을 시작할 수 있고, AL은 문단을 끝까지 유지할 수 있다."}'::jsonb,
  success_criteria = '{"metric": "후반부 문단 붕괴", "threshold": "후반부(60초 이후) 문단 붕괴 0회", "measurement": "gpt_count"}'::jsonb
WHERE code = 'paragraph_sustain';

UPDATE tutoring_drill_catalog SET
  name_ko = '어휘 업그레이드',
  training_method = '{"rounds": 3, "description": "기본 어휘를 고급 어휘로 1:1 치환하는 바꿔 끼기 연습. 강지완 어휘 치환법.", "target_expressions": ["good → excellent/outstanding", "like → prefer/enjoy", "a lot → significantly/considerably", "bad → terrible/dreadful", "big → spacious/enormous", "happy → delighted/thrilled", "nice → pleasant/wonderful"]}'::jsonb,
  success_criteria = '{"metric": "반복 어휘 비율", "threshold": "반복 어휘 비율 15% 이하", "measurement": "gpt_count"}'::jsonb
WHERE code = 'vocabulary_upgrade';

UPDATE tutoring_drill_catalog SET
  name_ko = '돌발 대처',
  training_method = '{"rounds": 3, "description": "롤플레이 돌발 상황에서 3단 공식으로 대처하는 연습. 강지완 돌발 대처 3단 공식.", "template": "① 상황 인식 + 사과: I am sorry, but [상황 설명].\n② 해결책 제시: I think the best way to handle this is [해결책].\n③ 대안 + 후속 조치: If that does not work, [대안]. After that, I would [후속]."}'::jsonb,
  success_criteria = '{"metric": "해결책+대안+후속조치", "threshold": "3요소 모두 포함", "measurement": "gpt_count"}'::jsonb
WHERE code = 'complication_handling';

UPDATE tutoring_drill_catalog SET
  name_ko = '사회적 관점',
  training_method = '{"rounds": 3, "description": "찬반 양측 관점을 제시하고 자기 입장을 밝히는 연습.", "template": "① 양측 인정: Some people think [찬성]. On the other hand, others believe [반대].\n② 자기 입장: Personally, I think [자기 의견].\n③ 근거: The reason is [이유]. For example, [예시]."}'::jsonb,
  success_criteria = '{"metric": "양측 관점 + 자기 입장", "threshold": "양측 관점 제시 + 자기 입장 명시", "measurement": "gpt_count"}'::jsonb
WHERE code = 'social_perspective';

UPDATE tutoring_drill_catalog SET
  name_ko = '비교 틀',
  training_method = '{"rounds": 3, "description": "명확한 대비 구조를 만드는 바꿔 끼기 연습. 대비 연결어를 활용한다.", "target_expressions": ["In the past, ~ but now ~", "compared to ~", "while ~ on the other hand ~", "unlike ~", "the biggest difference is"]}'::jsonb,
  success_criteria = '{"metric": "대비 구조", "threshold": "명확한 before/after 또는 A vs B 구조", "measurement": "gpt_count"}'::jsonb
WHERE code = 'comparison_frame';

UPDATE tutoring_drill_catalog SET
  name_ko = '주어-동사 일치',
  training_method = '{"rounds": 3, "description": "주어-동사 일치 오류를 인지하고 교정하는 자기 교정 연습. 강지완 AL 4대 감점 중 하나.", "target_expressions": ["he/she goes (not go)", "it makes (not make)", "there are (not is)", "people think (not thinks)"]}'::jsonb,
  success_criteria = '{"metric": "agreement 오류 수", "threshold": "1개 이하", "measurement": "gpt_count"}'::jsonb
WHERE code = 'agreement_accuracy';

UPDATE tutoring_drill_catalog SET
  name_ko = '전치사 정확성',
  training_method = '{"rounds": 3, "description": "전치사 오류를 인지하고 교정하는 자기 교정 연습. 강지완 AL 4대 감점 중 하나.", "target_expressions": ["interested in (not at)", "good at (not in)", "depend on (not of)", "listen to (not at)", "consist of (not with)"]}'::jsonb,
  success_criteria = '{"metric": "전치사 오류 수", "threshold": "2개 이하", "measurement": "gpt_count"}'::jsonb
WHERE code = 'preposition_accuracy';

UPDATE tutoring_drill_catalog SET
  name_ko = '필러 감소',
  training_method = '{"rounds": 3, "description": "um, uh, you know 등 무의미 필러를 줄이는 연습. 필러 대신 짧은 침묵이나 전환 표현을 사용한다.", "target_expressions": ["Well, (대체)", "Actually, (대체)", "Let me think... (대체)"]}'::jsonb,
  success_criteria = '{"metric": "필러 비율", "threshold": "5% 이하", "measurement": "speech_meta"}'::jsonb
WHERE code = 'filler_reduction';

UPDATE tutoring_drill_catalog SET
  name_ko = '협상 표현',
  training_method = '{"rounds": 3, "description": "롤플레이에서 협상/요청/대안 제시 표현을 암기하는 패턴 반복 연습.", "target_expressions": ["Would it be possible to ~?", "I was wondering if ~", "Could you please ~?", "How about ~?", "What if we ~?", "I would like to suggest ~"]}'::jsonb,
  success_criteria = '{"metric": "협상 표현 사용 수", "threshold": "3종 이상 사용", "measurement": "keyword_match"}'::jsonb
WHERE code = 'negotiation_expressions';

UPDATE tutoring_drill_catalog SET
  name_ko = '해결책 제안',
  training_method = '{"rounds": 3, "description": "문제 상황에서 해결책+대안+후속조치 3요소를 모두 제시하는 연습. 강지완: 문제 설명만 하고 끝내면 안 돼. 무조건 솔루션을 3개 말해.", "template": "① 해결책: I think the best solution would be [해결책].\n② 대안: If that does not work, [대안].\n③ 후속조치: After that, I would [후속]."}'::jsonb,
  success_criteria = '{"metric": "해결책+대안+후속조치 3요소", "threshold": "3요소 모두 포함", "measurement": "gpt_count"}'::jsonb
WHERE code = 'solution_proposal';
