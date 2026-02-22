-- ============================================================
-- 003_submissions.sql
-- OPIcTalkDoc Step 1: 시험후기 모듈 (3테이블 + RLS + RPC)
-- 생성일: 2026-02-22
-- ============================================================

-- ── M-1 결정: custom_mode_questions → submission_combos 통합 ──

DROP FUNCTION IF EXISTS find_similar_questions_by_frequency(TEXT, TEXT, INT);
DROP TABLE IF EXISTS custom_mode_questions;

-- ============================================================
-- submissions (후기 마스터)
-- ============================================================

CREATE TABLE submissions (
  id                    SERIAL PRIMARY KEY,
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Step 1: 시험 기본 정보
  exam_date             DATE NOT NULL,
  achieved_level        TEXT CHECK (achieved_level IN ('AL','IH','IM3','IM2','IM1','IL','NH')),

  -- Step 1: 설문 — 시험 배경 (4개)
  exam_purpose          TEXT NOT NULL CHECK (exam_purpose IN ('employment','promotion','job_change','graduation','self_development')),
  study_methods         TEXT[] NOT NULL,
  prep_duration         TEXT NOT NULL CHECK (prep_duration IN ('under_1w','1_2w','3_4w','1_2m','3m_plus')),
  attempt_count         TEXT NOT NULL CHECK (attempt_count IN ('first','2nd','3rd','4th','5th_plus')),

  -- Step 1: 설문 — 체감 후기 (3개)
  perceived_difficulty  TEXT NOT NULL CHECK (perceived_difficulty IN ('easy','normal','hard')),
  time_sufficiency      TEXT NOT NULL CHECK (time_sufficiency IN ('sufficient','adequate','insufficient')),
  actual_duration       TEXT NOT NULL CHECK (actual_duration IN ('under_20','20_25','25_30','30_35','35_40')),

  -- Step 3: 자유 후기
  one_line_review       VARCHAR(100),
  tips                  VARCHAR(300),

  -- 상태 관리
  status                TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','complete')),
  step_completed        SMALLINT NOT NULL DEFAULT 1,
  submitted_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_exam_date ON submissions(exam_date);

-- updated_at 트리거 (기존 update_updated_at() 함수 재사용)
CREATE TRIGGER trigger_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- submission_questions (14개 질문 기록)
-- ============================================================

CREATE TABLE submission_questions (
  id                  SERIAL PRIMARY KEY,
  submission_id       INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  question_number     SMALLINT NOT NULL CHECK (question_number BETWEEN 2 AND 15),
  combo_type          TEXT NOT NULL CHECK (combo_type IN ('general_1','general_2','general_3','roleplay','advance')),
  topic               TEXT NOT NULL,
  master_question_id  TEXT REFERENCES master_questions(question_id),
  custom_question_text TEXT,
  is_not_remembered   BOOLEAN DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_sq_submission_id ON submission_questions(submission_id);
CREATE INDEX idx_sq_master_question_id ON submission_questions(master_question_id);

-- ============================================================
-- submission_combos (통합 콤보 — custom_mode_questions 대체)
-- ============================================================

CREATE TABLE submission_combos (
  id              SERIAL PRIMARY KEY,
  submission_id   INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  combo_type      TEXT NOT NULL CHECK (combo_type IN ('general_1','general_2','general_3','roleplay','advance')),
  topic           TEXT NOT NULL,
  question_ids    TEXT[] NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_sc_submission_id ON submission_combos(submission_id);

-- ============================================================
-- RLS 정책
-- ============================================================

-- submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 본인 INSERT
CREATE POLICY "submissions_insert_own"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 본인 SELECT + complete 상태 전체 SELECT (M-4)
CREATE POLICY "submissions_select"
  ON submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR status = 'complete');

-- 본인 UPDATE
CREATE POLICY "submissions_update_own"
  ON submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 본인 DELETE
CREATE POLICY "submissions_delete_own"
  ON submissions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- submission_questions
ALTER TABLE submission_questions ENABLE ROW LEVEL SECURITY;

-- submission 소유자 기반 INSERT
CREATE POLICY "sq_insert_own"
  ON submission_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = submission_id AND s.user_id = auth.uid()
    )
  );

-- 본인 소유 + complete 전체 SELECT
CREATE POLICY "sq_select"
  ON submission_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = submission_id AND (s.user_id = auth.uid() OR s.status = 'complete')
    )
  );

-- submission 소유자 DELETE
CREATE POLICY "sq_delete_own"
  ON submission_questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = submission_id AND s.user_id = auth.uid()
    )
  );

-- submission_combos
ALTER TABLE submission_combos ENABLE ROW LEVEL SECURITY;

-- 인증 사용자: 전체 SELECT
CREATE POLICY "sc_select_authenticated"
  ON submission_combos FOR SELECT
  TO authenticated
  USING (true);

-- 비인증(anon): advance만 SELECT (빈도분석 미로그인 접근)
CREATE POLICY "sc_select_anon"
  ON submission_combos FOR SELECT
  TO anon
  USING (combo_type = 'advance');

-- submission 소유자 INSERT
CREATE POLICY "sc_insert_own"
  ON submission_combos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = submission_id AND s.user_id = auth.uid()
    )
  );

-- submission 소유자 DELETE
CREATE POLICY "sc_delete_own"
  ON submission_combos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = submission_id AND s.user_id = auth.uid()
    )
  );

-- ============================================================
-- increment_script_credits RPC (크레딧 보상용 - SECURITY DEFINER)
-- ============================================================

CREATE OR REPLACE FUNCTION increment_script_credits(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE user_credits
  SET script_credits = script_credits + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
