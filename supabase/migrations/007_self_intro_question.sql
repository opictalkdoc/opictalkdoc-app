-- ============================================================
-- 007_self_intro_question.sql
-- 자기소개(Q1) 자동 포함 지원
-- - submission_questions.question_number: 2~15 → 1~15
-- - submission_questions.combo_type: 'self_intro' 추가
-- ============================================================

-- question_number 제약 변경 (1번 허용)
ALTER TABLE submission_questions
  DROP CONSTRAINT submission_questions_question_number_check;
ALTER TABLE submission_questions
  ADD CONSTRAINT submission_questions_question_number_check
  CHECK (question_number BETWEEN 1 AND 15);

-- combo_type 제약 변경 ('self_intro' 추가)
ALTER TABLE submission_questions
  DROP CONSTRAINT submission_questions_combo_type_check;
ALTER TABLE submission_questions
  ADD CONSTRAINT submission_questions_combo_type_check
  CHECK (combo_type IN ('self_intro','general_1','general_2','general_3','roleplay','advance'));
