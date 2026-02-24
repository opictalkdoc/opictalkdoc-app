-- ============================================================
-- 008_add_topic_index.sql
-- 빈도 분석 주제 드릴다운 성능 최적화
-- - submission_questions.topic 컬럼에 인덱스 추가
-- - 기존: Full Table Scan → 인덱스 스캔으로 전환
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_submission_questions_topic
  ON submission_questions(topic);
