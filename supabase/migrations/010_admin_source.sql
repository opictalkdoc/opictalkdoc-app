-- 010: submissions에 source 컬럼 추가 (관리자 기출 일괄 입력용)

-- source 컬럼: 'user' = 사용자 직접 제출, 'admin' = 관리자 일괄 입력
ALTER TABLE submissions
  ADD COLUMN source TEXT NOT NULL DEFAULT 'user'
  CHECK (source IN ('user', 'admin'));

-- 관리자 데이터 필터링용 인덱스
CREATE INDEX idx_submissions_source ON submissions(source);
