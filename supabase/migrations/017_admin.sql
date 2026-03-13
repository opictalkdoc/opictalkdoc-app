-- 017_admin.sql: 관리자 시스템 인프라
-- 1) admin_audit_log 테이블
-- 2) 주요 테이블 RLS에 admin 조건 추가

-- ══════════════════════════════════════════════
-- 1. admin_audit_log 테이블
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id         BIGSERIAL PRIMARY KEY,
  admin_id   UUID NOT NULL REFERENCES auth.users(id),
  action     TEXT NOT NULL,                -- 'credit_adjust', 'prompt_update', 'eval_retrigger' 등
  target_type TEXT,                        -- 'user', 'order', 'prompt', 'mock_session' 등
  target_id  TEXT,                         -- 대상 ID (UUID or numeric)
  details    JSONB DEFAULT '{}'::jsonb,    -- 변경 상세 (before/after, reason 등)
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_action ON admin_audit_log(action);
CREATE INDEX idx_audit_log_created_at ON admin_audit_log(created_at DESC);

-- RLS
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- admin만 조회 가능
CREATE POLICY "admin_audit_log_select"
  ON admin_audit_log FOR SELECT
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- INSERT는 service_role만 (Server Actions에서 service client 사용)
-- anon/authenticated는 INSERT 불가 (정책 없음 = 거부)

-- ══════════════════════════════════════════════
-- 2. 기존 테이블 RLS에 admin SELECT 조건 추가
-- ══════════════════════════════════════════════

-- user_credits: 기존 "본인만 조회" + admin 조회
DROP POLICY IF EXISTS "user_credits_select_own" ON user_credits;
CREATE POLICY "user_credits_select_own"
  ON user_credits FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- orders: 기존 "본인만 조회" + admin 조회
DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- submissions: 기존 "본인 CRUD + complete 전체 SELECT" + admin 조회
DROP POLICY IF EXISTS "submissions_select" ON submissions;
CREATE POLICY "submissions_select"
  ON submissions FOR SELECT
  USING (
    auth.uid() = user_id
    OR status = 'complete'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- mock_test_sessions: 기존 "본인만" + admin 조회
DROP POLICY IF EXISTS "mock_sessions_select_own" ON mock_test_sessions;
CREATE POLICY "mock_sessions_select_own"
  ON mock_test_sessions FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- mock_test_reports: 기존 "본인만" + admin 조회
DROP POLICY IF EXISTS "mock_reports_select_own" ON mock_test_reports;
CREATE POLICY "mock_reports_select_own"
  ON mock_test_reports FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- mock_test_answers: 기존 "본인만" + admin 조회 (session 조인 — user_id 없음)
DROP POLICY IF EXISTS "mock_answers_select_own" ON mock_test_answers;
CREATE POLICY "mock_answers_select_own"
  ON mock_test_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mock_test_sessions s
      WHERE s.session_id = mock_test_answers.session_id
        AND s.user_id = auth.uid()
    )
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- ══════════════════════════════════════════════
-- 3. DAU 카운트 RPC (service_role 전용)
-- ══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_dau_count(target_date DATE)
RETURNS TABLE(count BIGINT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::BIGINT
  FROM auth.users
  WHERE last_sign_in_at::date = target_date;
$$;
