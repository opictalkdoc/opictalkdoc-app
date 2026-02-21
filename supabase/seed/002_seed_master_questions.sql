-- ============================================================
-- 002_seed_master_questions.sql
-- 510개 master_questions 시드 데이터 삽입
-- 소리담 프로덕션 DB에서 2026-02-20 추출
--
-- 실행 방법:
--   CSV 파일(master_questions.csv)을 먼저 Supabase Storage에 업로드하거나,
--   아래 COPY 명령을 psql에서 실행
-- ============================================================

-- 시퀀스 초기화 (기존 데이터 제거 후 삽입)
TRUNCATE master_questions RESTART IDENTITY CASCADE;

-- CSV 파일에서 데이터 로드 (psql 클라이언트에서 실행)
-- \copy master_questions(id, question_id, survey_type, topic_category, topic, question_title, question_english, question_korean, answer_type, audio_url, audio_generated_at, audio_voice) FROM 'master_questions.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- 시퀀스를 마지막 id 이후로 재설정
-- SELECT setval('master_questions_id_seq', (SELECT MAX(id) FROM master_questions));
