-- ============================================================
-- 026_tutoring_v2.sql
-- 튜터링 V2 마이그레이션: V1 DROP + V2 CREATE + Seed
-- ============================================================

-- ============================================================
-- 1. V1 DROP (7테이블)
-- ============================================================
DROP TABLE IF EXISTS tutoring_attempts CASCADE;
DROP TABLE IF EXISTS tutoring_review_schedule CASCADE;
DROP TABLE IF EXISTS tutoring_skill_history CASCADE;
DROP TABLE IF EXISTS tutoring_training_sessions CASCADE;
DROP TABLE IF EXISTS tutoring_prescriptions CASCADE;
DROP TABLE IF EXISTS tutoring_sessions CASCADE;
-- Storage 버킷은 유지 (tutoring-recordings)

-- ============================================================
-- 2. V2 CREATE (7테이블)
-- ============================================================

-- 2-1. tutoring_drill_catalog (33행 seed)
CREATE TABLE tutoring_drill_catalog (
  code TEXT PRIMARY KEY,
  name_ko TEXT NOT NULL,
  category TEXT NOT NULL,
  tier INTEGER NOT NULL,
  approach TEXT NOT NULL,
  training_method JSONB NOT NULL DEFAULT '{}',
  success_criteria JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2-2. tutoring_wp_tier_matrix (144행 seed)
CREATE TABLE tutoring_wp_tier_matrix (
  id SERIAL PRIMARY KEY,
  wp_code TEXT NOT NULL,
  tier INTEGER NOT NULL,
  relevance NUMERIC(3,2) NOT NULL DEFAULT 0,
  gate_flag BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(wp_code, tier)
);

-- 2-3. tutoring_wp_drill_mapping (~50행 seed)
CREATE TABLE tutoring_wp_drill_mapping (
  id SERIAL PRIMARY KEY,
  wp_code TEXT NOT NULL,
  tier INTEGER NOT NULL,
  drill_code TEXT NOT NULL REFERENCES tutoring_drill_catalog(code),
  UNIQUE(wp_code, tier, drill_code)
);

-- 2-4. tutoring_sessions_v2
CREATE TABLE tutoring_sessions_v2 (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  mock_session_id UUID REFERENCES mock_test_sessions(id),
  current_tier INTEGER NOT NULL,
  current_grade TEXT NOT NULL,
  target_grade TEXT,
  bottleneck_results JSONB,
  diagnosis_text JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2-5. tutoring_prescriptions_v2
CREATE TABLE tutoring_prescriptions_v2 (
  id TEXT PRIMARY KEY ,
  session_id TEXT NOT NULL REFERENCES tutoring_sessions_v2(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL,
  wp_code TEXT NOT NULL,
  drill_code TEXT NOT NULL REFERENCES tutoring_drill_catalog(code),
  prescription_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2-6. tutoring_training_v2
CREATE TABLE tutoring_training_v2 (
  id TEXT PRIMARY KEY ,
  prescription_id TEXT NOT NULL REFERENCES tutoring_prescriptions_v2(id) ON DELETE CASCADE,
  approach TEXT NOT NULL,
  current_screen INTEGER NOT NULL DEFAULT 0,
  rounds_completed INTEGER NOT NULL DEFAULT 0,
  max_rounds INTEGER NOT NULL DEFAULT 3,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2-7. tutoring_attempts_v2
CREATE TABLE tutoring_attempts_v2 (
  id TEXT PRIMARY KEY ,
  training_id TEXT NOT NULL REFERENCES tutoring_training_v2(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  transcript TEXT,
  audio_url TEXT,
  duration_sec NUMERIC(6,1),
  word_count INTEGER,
  wpm NUMERIC(5,1),
  evaluation JSONB,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. 인덱스
-- ============================================================
CREATE INDEX idx_tutoring_sessions_v2_user ON tutoring_sessions_v2(user_id);
CREATE INDEX idx_tutoring_sessions_v2_mock ON tutoring_sessions_v2(mock_session_id);
CREATE INDEX idx_tutoring_prescriptions_v2_session ON tutoring_prescriptions_v2(session_id);
CREATE INDEX idx_tutoring_training_v2_prescription ON tutoring_training_v2(prescription_id);
CREATE INDEX idx_tutoring_attempts_v2_training ON tutoring_attempts_v2(training_id);
CREATE INDEX idx_tutoring_wp_tier_matrix_wp ON tutoring_wp_tier_matrix(wp_code);

-- ============================================================
-- 4. RLS
-- ============================================================

-- RLS 활성화
ALTER TABLE tutoring_drill_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_wp_tier_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_wp_drill_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_sessions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_prescriptions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_training_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_attempts_v2 ENABLE ROW LEVEL SECURITY;

-- 참조 테이블: 전체 SELECT
CREATE POLICY "참조 테이블 전체 조회" ON tutoring_drill_catalog FOR SELECT USING (true);
CREATE POLICY "참조 테이블 전체 조회" ON tutoring_wp_tier_matrix FOR SELECT USING (true);
CREATE POLICY "참조 테이블 전체 조회" ON tutoring_wp_drill_mapping FOR SELECT USING (true);

-- sessions_v2: 본인 CRUD
CREATE POLICY "본인 세션 조회" ON tutoring_sessions_v2 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "본인 세션 생성" ON tutoring_sessions_v2 FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 세션 수정" ON tutoring_sessions_v2 FOR UPDATE USING (auth.uid() = user_id);

-- prescriptions_v2: 본인 세션의 처방만
CREATE POLICY "본인 처방 조회" ON tutoring_prescriptions_v2 FOR SELECT
  USING (EXISTS (SELECT 1 FROM tutoring_sessions_v2 s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "본인 처방 생성" ON tutoring_prescriptions_v2 FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM tutoring_sessions_v2 s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "본인 처방 수정" ON tutoring_prescriptions_v2 FOR UPDATE
  USING (EXISTS (SELECT 1 FROM tutoring_sessions_v2 s WHERE s.id = session_id AND s.user_id = auth.uid()));

-- training_v2: 본인 처방의 훈련만
CREATE POLICY "본인 훈련 조회" ON tutoring_training_v2 FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM tutoring_prescriptions_v2 p
    JOIN tutoring_sessions_v2 s ON s.id = p.session_id
    WHERE p.id = prescription_id AND s.user_id = auth.uid()
  ));
CREATE POLICY "본인 훈련 생성" ON tutoring_training_v2 FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM tutoring_prescriptions_v2 p
    JOIN tutoring_sessions_v2 s ON s.id = p.session_id
    WHERE p.id = prescription_id AND s.user_id = auth.uid()
  ));
CREATE POLICY "본인 훈련 수정" ON tutoring_training_v2 FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM tutoring_prescriptions_v2 p
    JOIN tutoring_sessions_v2 s ON s.id = p.session_id
    WHERE p.id = prescription_id AND s.user_id = auth.uid()
  ));

-- attempts_v2: 본인 훈련의 시도만
CREATE POLICY "본인 시도 조회" ON tutoring_attempts_v2 FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM tutoring_training_v2 t
    JOIN tutoring_prescriptions_v2 p ON p.id = t.prescription_id
    JOIN tutoring_sessions_v2 s ON s.id = p.session_id
    WHERE t.id = training_id AND s.user_id = auth.uid()
  ));
CREATE POLICY "본인 시도 생성" ON tutoring_attempts_v2 FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM tutoring_training_v2 t
    JOIN tutoring_prescriptions_v2 p ON p.id = t.prescription_id
    JOIN tutoring_sessions_v2 s ON s.id = p.session_id
    WHERE t.id = training_id AND s.user_id = auth.uid()
  ));

-- ============================================================
-- 5. Seed 데이터
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 5-1. 드릴 카탈로그 (33행)
-- ────────────────────────────────────────────────────────────

-- Tier 1 (5개)
INSERT INTO tutoring_drill_catalog (code, name_ko, category, tier, approach, training_method, success_criteria) VALUES
('sentence_formation', 'Sentence Formation', 'structure', 1, 'frame_install',
  '{"description": "SVO 구조로 완전한 문장 만들기", "template": "I [동사] [목적어]. I usually [동사] [빈도]. I like it because [이유].", "rounds": 3}',
  '{"metric": "완전한 문장 수", "threshold": "3개+/30초", "measurement": "gpt_count"}'),
('basic_transaction', 'Basic Transaction', 'task', 1, 'pattern_drill',
  '{"description": "질문 이해 → 관련 대답", "rounds": 3}',
  '{"metric": "과제 충족률", "threshold": "50%+", "measurement": "gpt_count"}'),
('essential_patterns', 'Essential Patterns', 'content', 1, 'frame_install',
  '{"description": "I like~, I usually~, There is~ 장착", "target_expressions": ["I like ~", "I usually ~", "There is ~", "I want to ~", "I think ~"], "rounds": 3}',
  '{"metric": "만능 패턴 사용 수", "threshold": "5개", "measurement": "keyword_match"}'),
('basic_vocabulary', 'Basic Vocabulary', 'content', 1, 'swap_drill',
  '{"description": "주제별 핵심 어휘 교체 연습", "rounds": 3}',
  '{"metric": "주제별 핵심 어휘", "threshold": "10개+", "measurement": "gpt_count"}'),
('pronunciation_clarity', 'Pronunciation Clarity', 'delivery', 1, 'pattern_drill',
  '{"description": "발음 명료도 향상", "rounds": 3}',
  '{"metric": "accuracy_score", "threshold": "60+", "measurement": "speech_meta"}');

-- Tier 2 (7개)
INSERT INTO tutoring_drill_catalog (code, name_ko, category, tier, approach, training_method, success_criteria) VALUES
('speech_volume', 'Speech Volume', 'delivery', 2, 'timed_pressure',
  '{"description": "30초 이상 끊기지 않고 말하기", "rounds": 3}',
  '{"metric": "연속 발화 시간", "threshold": "40초+", "measurement": "speech_meta"}'),
('topic_maintenance', 'Topic Maintenance', 'structure', 2, 'self_correction',
  '{"description": "질문에서 벗어나지 않기", "rounds": 3}',
  '{"metric": "관련 없는 문장 수", "threshold": "1개 이하", "measurement": "gpt_count"}'),
('basic_connectors', 'Basic Connectors', 'structure', 2, 'pattern_drill',
  '{"description": "and, so, but, because 자연스러운 사용", "target_expressions": ["and", "so", "but", "because"], "rounds": 3}',
  '{"metric": "연결어 종류 수", "threshold": "3종+", "measurement": "keyword_match"}'),
('frame_4line', 'Frame 4-Line', 'structure', 2, 'frame_install',
  '{"description": "4줄 만능 틀 장착", "template": "① I [핵심답변]. ② Because [이유]. ③ For example, [예시]. ④ That''s why [마무리].", "rounds": 3}',
  '{"metric": "4줄 구조 완성", "threshold": "3회 중 2회", "measurement": "gpt_count"}'),
('hesitation_reduction', 'Hesitation Reduction', 'delivery', 2, 'timed_pressure',
  '{"description": "3초 이상 침묵 줄이기", "rounds": 3}',
  '{"metric": "3초+ 침묵 횟수", "threshold": "2회 이하", "measurement": "speech_meta"}'),
('question_response', 'Question Response', 'task', 2, 'pattern_drill',
  '{"description": "질문 의도 파악 → 직답", "rounds": 3}',
  '{"metric": "질문 의도 파악", "threshold": "직답 포함", "measurement": "gpt_count"}'),
('multi_part_checklist', 'Multi-Part Checklist', 'task', 2, 'pattern_drill',
  '{"description": "multi-part 질문 하위 항목 모두 답변", "rounds": 3}',
  '{"metric": "하위 항목 답변 비율", "threshold": "2/3+", "measurement": "gpt_count"}');

-- Tier 3 (11개)
INSERT INTO tutoring_drill_catalog (code, name_ko, category, tier, approach, training_method, success_criteria) VALUES
('skeleton_paragraph', 'Skeleton Paragraph', 'structure', 3, 'frame_install',
  '{"description": "Skeleton Paragraph 구조 장착", "template": "① There are a few things I want to tell you about [주제]. ② First of all, [내용]. Moreover, [디테일]. ③ On top of that, [내용]. As a result, [결과]. ④ Last but not least, [내용]. ⑤ That is pretty much everything about [주제].", "rounds": 3}',
  '{"metric": "Skeleton 구조 형성", "threshold": "3회 중 2회", "measurement": "gpt_count"}'),
('connector_diversity', 'Connector Diversity', 'structure', 3, 'swap_drill',
  '{"description": "9대 연결어 바꿔 끼기", "target_expressions": ["First of all", "On top of that", "Last but not least", "However", "On the other hand", "As a result", "Therefore", "Moreover", "In addition"], "rounds": 3}',
  '{"metric": "고유 연결어 종류", "threshold": "4종+", "measurement": "keyword_match"}'),
('tense_attempt', 'Tense Attempt', 'accuracy', 3, 'swap_drill',
  '{"description": "시제 바꿔 끼기 연습", "rounds": 3}',
  '{"metric": "시제 전환 횟수", "threshold": "2회+", "measurement": "gpt_count"}'),
('paragraph_closure', 'Paragraph Closure', 'structure', 3, 'frame_install',
  '{"description": "마무리 문장 장착", "template": "That is pretty much everything about ~. / Those are the main things I wanted to tell you.", "rounds": 3}',
  '{"metric": "마무리 문장 포함", "threshold": "80%+", "measurement": "gpt_count"}'),
('description_depth', 'Description Depth', 'content', 3, 'swap_drill',
  '{"description": "5감+감정+빈도 디테일 추가", "rounds": 3}',
  '{"metric": "본론당 디테일 수", "threshold": "2개+", "measurement": "gpt_count"}'),
('time_frame_variety', 'Time Frame Variety', 'accuracy', 3, 'swap_drill',
  '{"description": "과거/현재/미래 바꿔 말하기", "rounds": 3}',
  '{"metric": "사용 시제 수", "threshold": "2개+", "measurement": "gpt_count"}'),
('past_narrative', 'Past Narrative', 'content', 3, 'frame_install',
  '{"description": "과거 에피소드 구조 (배경→사건→결과→소감)", "template": "배경: One day, ~ / 사건: Suddenly, ~ / 결과: As a result, ~ / 소감: I felt ~", "rounds": 3}',
  '{"metric": "과거 에피소드 구조 완성", "threshold": "4요소 중 3+", "measurement": "gpt_count"}'),
('sentence_completion', 'Sentence Completion', 'accuracy', 3, 'self_correction',
  '{"description": "미완성 문장 인지 및 교정", "rounds": 3}',
  '{"metric": "미완성 문장 수", "threshold": "1개 이하", "measurement": "gpt_count"}'),
('thought_progression', 'Thought Progression', 'structure', 3, 'frame_install',
  '{"description": "문장 간 인과·순서 관계 명확화", "rounds": 3}',
  '{"metric": "논리 흐름", "threshold": "3회 중 2회 명확", "measurement": "gpt_count"}'),
('timeframe_sustain', 'Timeframe Sustain', 'accuracy', 3, 'swap_drill',
  '{"description": "시작한 시제 프레임 끝까지 유지", "rounds": 3}',
  '{"metric": "시제 프레임 유지", "threshold": "2회 중 2회", "measurement": "gpt_count"}'),
('reason_chain', 'Reason Chain', 'content', 3, 'swap_drill',
  '{"description": "왜-왜-예시 3단 공식", "rounds": 3}',
  '{"metric": "why-chain 단계", "threshold": "2단계+", "measurement": "gpt_count"}');

-- Tier 4 (10개) -- 원래 11개에서 solution_proposal 포함 = 10+1
INSERT INTO tutoring_drill_catalog (code, name_ko, category, tier, approach, training_method, success_criteria) VALUES
('tense_accuracy', 'Tense Accuracy', 'accuracy', 4, 'self_correction',
  '{"description": "시제 오류 인지 및 고정", "rounds": 3}',
  '{"metric": "시제 오류 수", "threshold": "2개 이하/2분", "measurement": "gpt_count"}'),
('paragraph_sustain', 'Paragraph Sustain', 'structure', 4, 'timed_pressure',
  '{"description": "2분 전체 문단 구조 유지", "rounds": 3}',
  '{"metric": "후반부 문단 붕괴", "threshold": "0회", "measurement": "gpt_count"}'),
('vocabulary_upgrade', 'Vocabulary Upgrade', 'content', 4, 'swap_drill',
  '{"description": "기본→고급 어휘 1:1 치환", "target_expressions": ["excellent", "prefer", "significantly", "magnificent", "outstanding"], "rounds": 3}',
  '{"metric": "반복 어휘 비율", "threshold": "15% 이하", "measurement": "gpt_count"}'),
('complication_handling', 'Complication Handling', 'task', 4, 'frame_install',
  '{"description": "돌발 대처 3단 공식", "template": "① 상황 인식 + 사과 → ② 해결책 제시 → ③ 대안 + 후속 조치", "rounds": 3}',
  '{"metric": "3요소 포함", "threshold": "해결책+대안+후속조치", "measurement": "gpt_count"}'),
('social_perspective', 'Social Perspective', 'content', 4, 'frame_install',
  '{"description": "찬반 양립 + 근거 제시", "template": "On the one hand, ~ / On the other hand, ~ / Personally, I think ~", "rounds": 3}',
  '{"metric": "양측 관점+자기 입장", "threshold": "3요소 모두", "measurement": "gpt_count"}'),
('comparison_frame', 'Comparison Frame', 'content', 4, 'swap_drill',
  '{"description": "명확한 대비 구조 만들기", "rounds": 3}',
  '{"metric": "대비 구조", "threshold": "명확한 대비 1+", "measurement": "gpt_count"}'),
('agreement_accuracy', 'Agreement Accuracy', 'accuracy', 4, 'self_correction',
  '{"description": "주어-동사 일치 오류 교정", "rounds": 4}',
  '{"metric": "agreement 오류", "threshold": "1개 이하", "measurement": "gpt_count"}'),
('preposition_accuracy', 'Preposition Accuracy', 'accuracy', 4, 'self_correction',
  '{"description": "전치사 오류 교정", "rounds": 4}',
  '{"metric": "전치사 오류", "threshold": "2개 이하", "measurement": "gpt_count"}'),
('filler_reduction', 'Filler Reduction', 'delivery', 4, 'timed_pressure',
  '{"description": "um, uh, you know 줄이기", "rounds": 3}',
  '{"metric": "필러 비율", "threshold": "5% 이하", "measurement": "speech_meta"}'),
('negotiation_expressions', 'Negotiation Expressions', 'task', 4, 'pattern_drill',
  '{"description": "협상/요청/대안 표현 암기", "target_expressions": ["Would it be possible to ~", "I was wondering if ~", "How about we ~"], "rounds": 3}',
  '{"metric": "협상 표현 사용", "threshold": "3종+", "measurement": "keyword_match"}'),
('solution_proposal', 'Solution Proposal', 'task', 4, 'frame_install',
  '{"description": "해결책+대안+후속조치 3요소 제시", "template": "I think the best solution would be ~ / If that doesn''t work, ~ / After that, I would ~", "rounds": 3}',
  '{"metric": "3요소 포함", "threshold": "해결책+대안+후속조치", "measurement": "gpt_count"}');

-- ────────────────────────────────────────────────────────────
-- 5-2. WP-Tier 매트릭스 (144행 = 36코드 × 4Tier)
-- ────────────────────────────────────────────────────────────

-- Structure (S01~S09)
INSERT INTO tutoring_wp_tier_matrix (wp_code, tier, relevance, gate_flag) VALUES
('WP_S01', 1, 1.00, false), ('WP_S01', 2, 0.60, false), ('WP_S01', 3, 0.30, false), ('WP_S01', 4, 0.10, false),
('WP_S02', 1, 0.80, false), ('WP_S02', 2, 1.00, false), ('WP_S02', 3, 0.70, false), ('WP_S02', 4, 0.30, false),
('WP_S03', 1, 0.50, false), ('WP_S03', 2, 1.00, false), ('WP_S03', 3, 0.80, false), ('WP_S03', 4, 0.40, false),
('WP_S04', 1, 0.20, false), ('WP_S04', 2, 0.50, false), ('WP_S04', 3, 1.00, true),  ('WP_S04', 4, 0.70, false),
('WP_S05', 1, 0.10, false), ('WP_S05', 2, 0.30, false), ('WP_S05', 3, 0.60, false), ('WP_S05', 4, 1.00, true),
('WP_S06', 1, 0.30, false), ('WP_S06', 2, 0.60, false), ('WP_S06', 3, 1.00, false), ('WP_S06', 4, 0.50, false),
('WP_S07', 1, 0.70, false), ('WP_S07', 2, 1.00, false), ('WP_S07', 3, 0.50, false), ('WP_S07', 4, 0.20, false),
('WP_S08', 1, 0.30, false), ('WP_S08', 2, 0.50, false), ('WP_S08', 3, 1.00, false), ('WP_S08', 4, 0.40, false),
('WP_S09', 1, 0.20, false), ('WP_S09', 2, 0.50, false), ('WP_S09', 3, 1.00, false), ('WP_S09', 4, 0.60, false);

-- Accuracy (A01~A08)
INSERT INTO tutoring_wp_tier_matrix (wp_code, tier, relevance, gate_flag) VALUES
('WP_A01', 1, 0.30, false), ('WP_A01', 2, 0.50, false), ('WP_A01', 3, 0.70, false), ('WP_A01', 4, 1.00, false),
('WP_A02', 1, 0.40, false), ('WP_A02', 2, 0.60, false), ('WP_A02', 3, 1.00, false), ('WP_A02', 4, 0.50, false),
('WP_A03', 1, 0.20, false), ('WP_A03', 2, 0.40, false), ('WP_A03', 3, 0.60, false), ('WP_A03', 4, 1.00, false),
('WP_A04', 1, 0.20, false), ('WP_A04', 2, 0.40, false), ('WP_A04', 3, 0.60, false), ('WP_A04', 4, 1.00, false),
('WP_A05', 1, 0.60, false), ('WP_A05', 2, 0.70, false), ('WP_A05', 3, 1.00, false), ('WP_A05', 4, 0.40, false),
('WP_A06', 1, 1.00, false), ('WP_A06', 2, 0.70, false), ('WP_A06', 3, 0.40, false), ('WP_A06', 4, 0.20, false),
('WP_A07', 1, 0.50, false), ('WP_A07', 2, 1.00, false), ('WP_A07', 3, 0.50, false), ('WP_A07', 4, 0.30, false),
('WP_A08', 1, 0.20, false), ('WP_A08', 2, 0.40, false), ('WP_A08', 3, 1.00, true),  ('WP_A08', 4, 1.00, true);

-- Content (C01~C07)
INSERT INTO tutoring_wp_tier_matrix (wp_code, tier, relevance, gate_flag) VALUES
('WP_C01', 1, 0.40, false), ('WP_C01', 2, 0.60, false), ('WP_C01', 3, 1.00, false), ('WP_C01', 4, 0.50, false),
('WP_C02', 1, 0.20, false), ('WP_C02', 2, 0.40, false), ('WP_C02', 3, 0.60, false), ('WP_C02', 4, 1.00, false),
('WP_C03', 1, 1.00, false), ('WP_C03', 2, 0.60, false), ('WP_C03', 3, 0.40, false), ('WP_C03', 4, 0.80, false),
('WP_C04', 1, 0.10, false), ('WP_C04', 2, 0.30, false), ('WP_C04', 3, 0.50, false), ('WP_C04', 4, 1.00, false),
('WP_C05', 1, 0.40, false), ('WP_C05', 2, 0.60, false), ('WP_C05', 3, 1.00, false), ('WP_C05', 4, 0.50, false),
('WP_C06', 1, 0.30, false), ('WP_C06', 2, 0.50, false), ('WP_C06', 3, 1.00, false), ('WP_C06', 4, 0.40, false),
('WP_C07', 1, 0.30, false), ('WP_C07', 2, 0.50, false), ('WP_C07', 3, 1.00, false), ('WP_C07', 4, 0.60, false);

-- Task (T01~T08)
INSERT INTO tutoring_wp_tier_matrix (wp_code, tier, relevance, gate_flag) VALUES
('WP_T01', 1, 1.00, true),  ('WP_T01', 2, 1.00, true),  ('WP_T01', 3, 0.60, true),  ('WP_T01', 4, 0.40, true),
('WP_T02', 1, 0.60, true),  ('WP_T02', 2, 1.00, true),  ('WP_T02', 3, 0.80, true),  ('WP_T02', 4, 0.60, true),
('WP_T03', 1, 0.10, false), ('WP_T03', 2, 0.30, false), ('WP_T03', 3, 0.60, false), ('WP_T03', 4, 1.00, false),
('WP_T04', 1, 0.10, false), ('WP_T04', 2, 0.20, false), ('WP_T04', 3, 0.50, false), ('WP_T04', 4, 1.00, true),
('WP_T05', 1, 0.10, false), ('WP_T05', 2, 0.20, false), ('WP_T05', 3, 0.40, false), ('WP_T05', 4, 1.00, false),
('WP_T06', 1, 0.50, false), ('WP_T06', 2, 1.00, false), ('WP_T06', 3, 0.50, false), ('WP_T06', 4, 0.30, false),
('WP_T07', 1, 0.10, false), ('WP_T07', 2, 0.20, false), ('WP_T07', 3, 0.50, false), ('WP_T07', 4, 1.00, false),
('WP_T08', 1, 0.10, false), ('WP_T08', 2, 0.20, false), ('WP_T08', 3, 0.40, false), ('WP_T08', 4, 1.00, true);

-- Delivery (D01~D04)
INSERT INTO tutoring_wp_tier_matrix (wp_code, tier, relevance, gate_flag) VALUES
('WP_D01', 1, 0.60, false), ('WP_D01', 2, 1.00, false), ('WP_D01', 3, 0.50, false), ('WP_D01', 4, 0.30, false),
('WP_D02', 1, 0.50, false), ('WP_D02', 2, 1.00, false), ('WP_D02', 3, 0.50, false), ('WP_D02', 4, 0.30, false),
('WP_D03', 1, 0.20, false), ('WP_D03', 2, 0.40, false), ('WP_D03', 3, 0.60, false), ('WP_D03', 4, 1.00, false),
('WP_D04', 1, 0.60, false), ('WP_D04', 2, 1.00, false), ('WP_D04', 3, 0.50, false), ('WP_D04', 4, 0.30, false);

-- ────────────────────────────────────────────────────────────
-- 5-3. WP-Drill 매핑 (~50행)
-- ────────────────────────────────────────────────────────────
INSERT INTO tutoring_wp_drill_mapping (wp_code, tier, drill_code) VALUES
-- Structure
('WP_S01', 1, 'sentence_formation'),
('WP_S01', 3, 'sentence_completion'),
('WP_S02', 2, 'frame_4line'),
('WP_S02', 3, 'skeleton_paragraph'),
('WP_S03', 2, 'basic_connectors'),
('WP_S03', 3, 'connector_diversity'),
('WP_S04', 3, 'skeleton_paragraph'),
('WP_S04', 4, 'paragraph_sustain'),
('WP_S05', 4, 'paragraph_sustain'),
('WP_S06', 3, 'paragraph_closure'),
('WP_S07', 2, 'topic_maintenance'),
('WP_S08', 3, 'past_narrative'),
('WP_S09', 3, 'thought_progression'),
-- Accuracy
('WP_A01', 4, 'tense_accuracy'),
('WP_A02', 3, 'tense_attempt'),
('WP_A02', 3, 'time_frame_variety'),
('WP_A03', 4, 'agreement_accuracy'),
('WP_A04', 4, 'preposition_accuracy'),
('WP_A05', 3, 'sentence_completion'),
('WP_A06', 1, 'pronunciation_clarity'),
('WP_A07', 2, 'hesitation_reduction'),
('WP_A08', 3, 'timeframe_sustain'),
('WP_A08', 4, 'tense_accuracy'),
-- Content
('WP_C01', 3, 'description_depth'),
('WP_C02', 4, 'vocabulary_upgrade'),
('WP_C03', 4, 'vocabulary_upgrade'),
('WP_C03', 1, 'basic_vocabulary'),
('WP_C04', 4, 'social_perspective'),
('WP_C05', 3, 'description_depth'),
('WP_C06', 3, 'past_narrative'),
('WP_C06', 3, 'description_depth'),
-- WP_C06 → description_depth(T3) 이미 위에 있으므로 UNIQUE 충돌 방지: wp_code+tier+drill_code
('WP_C07', 3, 'reason_chain'),
-- Task
('WP_T01', 2, 'question_response'),
('WP_T01', 1, 'basic_transaction'),
('WP_T02', 2, 'multi_part_checklist'),
('WP_T03', 4, 'comparison_frame'),
('WP_T04', 4, 'complication_handling'),
('WP_T05', 4, 'negotiation_expressions'),
('WP_T06', 2, 'question_response'),
('WP_T07', 4, 'complication_handling'),
('WP_T08', 4, 'solution_proposal'),
-- Delivery
('WP_D01', 2, 'speech_volume'),
('WP_D02', 2, 'hesitation_reduction'),
('WP_D03', 4, 'filler_reduction'),
('WP_D04', 2, 'speech_volume');

-- ============================================================
-- 완료
-- ============================================================
