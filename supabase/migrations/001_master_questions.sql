-- ============================================================
-- 001_master_questions.sql
-- OPIcTalkDoc Step 0: 핵심 코어 테이블
-- 생성일: 2026-02-20
-- ============================================================

-- ── ENUM 타입 생성 ──

CREATE TYPE survey_type AS ENUM ('선택형', '공통형', '롤플레이', '시스템');

CREATE TYPE topic_category AS ENUM ('일반', '롤플레이', '어드밴스', '시스템');

CREATE TYPE answer_type AS ENUM (
  'description',
  'routine',
  'comparison',
  'past_experience_memorable',
  'past_experience_recent',
  'past_experience_childhood',
  'roleplay_11',
  'roleplay_12',
  'roleplay_13',
  'advanced_14',
  'advanced_15'
);

-- ── master_questions 테이블 ──

CREATE TABLE master_questions (
  id             SERIAL PRIMARY KEY,
  question_id    TEXT UNIQUE NOT NULL,              -- 코드: 'COM_APP_N_C1_01'
  survey_type    survey_type NOT NULL,              -- 선택형 | 공통형 | 롤플레이 | 시스템
  topic_category topic_category NOT NULL,           -- 일반 | 롤플레이 | 어드밴스 | 시스템
  topic          TEXT NOT NULL,                     -- 약속, 은행, 집, 호텔 등
  question_title TEXT,                              -- 질문 한국어 요약 (짧은 설명)
  question_english TEXT NOT NULL,                   -- 영어 질문 원문
  question_korean  TEXT NOT NULL,                   -- 한국어 번역
  answer_type    answer_type,                       -- 10가지 답변 유형 (시스템 문항은 NULL)
  audio_url      TEXT,                              -- TTS 음성 URL
  audio_generated_at TIMESTAMPTZ,                   -- 음성 생성 시각
  audio_voice    TEXT DEFAULT 'Aoede',              -- 음성 엔진 (Aoede, nova 등)
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 인덱스 ──

CREATE INDEX idx_master_questions_answer_type ON master_questions(answer_type);
CREATE INDEX idx_master_questions_topic ON master_questions(topic);
CREATE INDEX idx_master_questions_survey_type ON master_questions(survey_type);
CREATE INDEX idx_master_questions_topic_category ON master_questions(topic_category);

-- ── updated_at 자동 갱신 트리거 ──

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_master_questions_updated_at
  BEFORE UPDATE ON master_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── RLS 정책 ──

ALTER TABLE master_questions ENABLE ROW LEVEL SECURITY;

-- 모든 인증된 사용자가 읽기 가능 (시드 데이터, 수정은 관리자만)
CREATE POLICY "master_questions_select"
  ON master_questions FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- custom_mode_questions 테이블
-- 사용자 시험 후기 → DB 트리거 → 콤보 자동 생성 → 모의고사 출제
-- ============================================================

CREATE TABLE custom_mode_questions (
  id             SERIAL PRIMARY KEY,
  submission_id  INTEGER NOT NULL,                  -- submissions.id 참조 (FK는 submissions 생성 후 추가)
  combo_category TEXT NOT NULL,                     -- '일반콤보1' | '일반콤보2' | '일반콤보3' | '롤플레이' | '어드밴스'
  topic          TEXT NOT NULL,                     -- 주제 (약속, 은행 등)
  question_ids   TEXT[] NOT NULL,                   -- master_questions.question_id 배열
  frequency      INTEGER DEFAULT 1,                 -- 출제 빈도 (같은 콤보 반복 시 증가)
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 인덱스 ──

CREATE INDEX idx_cmq_submission_id ON custom_mode_questions(submission_id);
CREATE INDEX idx_cmq_combo_category ON custom_mode_questions(combo_category);
CREATE INDEX idx_cmq_frequency ON custom_mode_questions(frequency DESC);

-- ── RLS 정책 ──

ALTER TABLE custom_mode_questions ENABLE ROW LEVEL SECURITY;

-- 모든 인증된 사용자가 읽기 가능 (모의고사 출제에서 조회)
CREATE POLICY "cmq_select"
  ON custom_mode_questions FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- find_similar_questions_by_frequency RPC
-- AI 튜터에서 같은 answer_type + 높은 frequency 질문 추천
-- ============================================================

CREATE OR REPLACE FUNCTION find_similar_questions_by_frequency(
  p_answer_type TEXT,
  p_topic TEXT,
  p_limit INT DEFAULT 5
)
RETURNS SETOF master_questions AS $$
  SELECT mq.*
  FROM master_questions mq
  JOIN custom_mode_questions cmq ON mq.question_id = ANY(cmq.question_ids)
  WHERE mq.answer_type::TEXT = p_answer_type
    AND mq.topic != p_topic
  ORDER BY cmq.frequency DESC
  LIMIT p_limit;
$$ LANGUAGE sql STABLE;
