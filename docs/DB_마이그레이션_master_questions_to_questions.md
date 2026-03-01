# DB 마이그레이션 가이드: master_questions → questions

> master_questions(구 510행) → questions(신 471행) 전환을 위한 분석 문서
> 모든 모듈(시험후기, 스크립트, 모의고사, 튜터링)이 이 문서를 기준으로 전환 작업을 진행한다.

---

## 1. 테이블 구조 비교

### master_questions (구 — 14컬럼)

| 컬럼 | 타입 | Nullable | 비고 |
|------|------|----------|------|
| **id** | integer | NO | PK (auto-increment, 내부용) |
| **question_id** | text | NO | UNIQUE — 실질적 식별자 (`COM_PHO_RP_C1_10`) |
| survey_type | ENUM | NO | 선택형 / 공통형 / 시스템 |
| topic_category | ENUM | NO | 일반 / 롤플레이 / 어드밴스 / 시스템 |
| topic | text | NO | 주제명 |
| question_title | text | YES | 질문 짧은 제목 |
| question_english | text | NO | 영문 질문 |
| question_korean | text | NO | 한글 질문 |
| answer_type | ENUM | YES | 10종 응답 타입 |
| audio_url | text | YES | 음성 URL |
| audio_generated_at | timestamptz | YES | 음성 생성일 |
| audio_voice | text | YES | 음성 보이스 정보 |
| created_at | timestamptz | YES | |
| updated_at | timestamptz | YES | |

### questions (신 — 14컬럼)

| 컬럼 | 타입 | Nullable | 비고 |
|------|------|----------|------|
| **id** | text | NO | PK — 직접 식별자 (`APL_ADV_COM_Q14_01`) |
| category | text | NO | 일반 / 롤플레이 / 어드밴스 / 시스템 |
| sub_category | text | NO | 신규: -, Q11, Q12, Q13, Q14, Q15 |
| topic | text | NO | 주제명 |
| survey_type | text | NO | 선택형 / 공통형 / 시스템 |
| question_english | text | NO | 영문 질문 |
| question_korean | text | NO | 한글 질문 |
| question_short | text | NO | 질문 짧은 제목 |
| question_type_kor | text | NO | 신규: 한글 응답 타입 (묘사, 루틴, ...) |
| question_type_eng | text | NO | 10종 응답 타입 (영문 약칭) |
| tag | text | NO | 신규: Int / Adv |
| created_at | timestamptz | NO | |
| updated_at | timestamptz | NO | |
| audio_url | text | YES | 음성 URL |

---

## 2. 컬럼 매핑표

### 동일 컬럼 (이름·의미 모두 동일)

| 컬럼 | 비고 |
|------|------|
| `topic` | 주제명 — 값도 동일 |
| `survey_type` | 값 동일 (선택형/공통형/시스템), 타입만 ENUM→text |
| `question_english` | 영문 질문 |
| `question_korean` | 한글 질문 |
| `audio_url` | 음성 URL |
| `created_at` | 생성일 |
| `updated_at` | 수정일 |

### 이름 변경 컬럼

| 구 (master_questions) | 신 (questions) | 값 변환 |
|-----------------------|----------------|---------|
| `question_id` (text, UNIQUE) | `id` (text, PK) | ID 체계 자체가 다름 (아래 참조) |
| `topic_category` (ENUM) | `category` (text) | 값 동일: 일반/롤플레이/어드밴스/시스템 |
| `question_title` | `question_short` | 동일 역할 |
| `answer_type` (ENUM) | `question_type_eng` (text) | **값이 다름** (아래 참조) |

### 삭제된 컬럼 (구에만 존재)

| 컬럼 | 이유 |
|------|------|
| `id` (integer) | 신 DB는 text PK 직접 사용, auto-increment 불필요 |
| `audio_generated_at` | 일회성 생성 정보, 불필요 |
| `audio_voice` | 일회성 생성 정보, 불필요 |

### 신규 컬럼 (신에만 존재)

| 컬럼 | 용도 | 값 예시 |
|------|------|---------|
| `sub_category` | 롤플레이/어드밴스 세부 분류 | -, Q11, Q12, Q13, Q14, Q15 |
| `question_type_kor` | 응답 타입 한글 레이블 | 묘사, 루틴, 비교, 질문하기, ... |
| `tag` | 난이도 태그 | Int, Adv |

---

## 3. answer_type 값 매핑 (중요)

answer_type의 **값 자체가 변경**되었다. 코드에서 이 값을 직접 비교하는 곳이 많으므로 주의.

| 구 (master_questions.answer_type) | 신 (questions.question_type_eng) |
|-----------------------------------|----------------------------------|
| `description` | `description` |
| `routine` | `routine` |
| `comparison` | `comparison` |
| `past_experience_memorable` | `past_special` |
| `past_experience_recent` | `past_recent` |
| `past_experience_childhood` | `past_childhood` |
| `roleplay_11` | `rp_11` |
| `roleplay_12` | `rp_12` |
| `advanced_14` | `adv_14` |
| `advanced_15` | `adv_15` |

---

## 4. ID 체계 비교

두 테이블의 ID 체계가 **완전히 다르다**. 1:1 매핑 불가.

| 구 (question_id) | 신 (id) | 비고 |
|-------------------|---------|------|
| `SEL_TV_N_C4_05` | `TV_GEN_SEL_DESC_01` | 같은 질문이라도 ID가 다름 |
| `COM_PHO_RP_C1_10` | `PHN_RP_COM_Q11_01` | 토픽코드+구조 자체가 다름 |

**ID 체계 규칙:**
- 구: `{선택/공통}_{토픽약어}_{카테고리}_{콤보}_{번호}`
- 신: `{토픽코드}_{카테고리}_{서베이}_{타입}_{번호}`

---

## 5. FK 참조 관계

master_questions를 FK로 참조하는 테이블:

| 테이블 | FK 컬럼 | FK 이름 | 현재 데이터 |
|--------|---------|---------|------------|
| `submission_questions` | `master_question_id` | `submission_questions_master_question_id_fkey` | **0건** |
| `scripts` | `question_id` | `scripts_question_id_fkey` | **7건** |

### 기존 데이터 영향

- **submissions 계열 (0건)**: 데이터 없음 → FK 변경만 하면 됨
- **scripts (7건)**: 테스트 데이터 → 삭제 후 FK 변경 (구 question_id 값이 신 DB에 없으므로 매핑 불가)

---

## 6. 코드에서 조회/참조 방식 변경 가이드

### Supabase 쿼리 변경

```typescript
// ── 구 (master_questions) ──
supabase.from("master_questions")
  .select("question_id, question_title, question_english, question_korean, answer_type, topic, topic_category, survey_type")
  .eq("topic_category", "일반")

// ── 신 (questions) ──
supabase.from("questions")
  .select("id, question_short, question_english, question_korean, question_type_eng, topic, category, survey_type")
  .eq("category", "일반")
```

### JOIN 쿼리 변경

```typescript
// ── 구 ──
supabase.from("submission_questions")
  .select("*, master_questions(question_id, question_title, question_english, question_korean, answer_type, topic)")

// ── 신 ──
supabase.from("submission_questions")
  .select("*, questions(id, question_short, question_english, question_korean, question_type_eng, topic)")
```

### TypeScript 타입 변경

```typescript
// ── 구 ──
interface MasterQuestion {
  question_id: string;
  question_title: string;
  question_english: string;
  question_korean: string;
  answer_type: AnswerType;
  topic: string;
  topic_category: string;
  survey_type: string;
}

// ── 신 ──
interface Question {
  id: string;
  question_short: string;
  question_english: string;
  question_korean: string;
  question_type_eng: string;
  question_type_kor: string;
  topic: string;
  category: string;
  sub_category: string;
  survey_type: string;
  tag: string;
  audio_url: string | null;
}
```

### answer_type 상수 변경

```typescript
// ── 구 ──
const ANSWER_TYPE_ORDER = [
  'description', 'routine', 'comparison',
  'past_experience_recent', 'past_experience_memorable', 'past_experience_childhood',
  'roleplay_11', 'roleplay_12', 'advanced_14', 'advanced_15'
];

// ── 신 ──
const QUESTION_TYPE_ORDER = [
  'description', 'routine', 'comparison',
  'past_recent', 'past_special', 'past_childhood',
  'rp_11', 'rp_12', 'adv_14', 'adv_15'
];
```

---

## 7. 모듈별 영향 범위

### 시험후기 (reviews)

| 파일 | 변경 내용 |
|------|---------|
| `lib/actions/reviews.ts` | 모든 master_questions 쿼리 → questions 변경 (7개 함수) |
| `lib/queries/master-questions.ts` | 테이블명 + 컬럼명 전체 변경 (4개 함수) |
| `lib/types/reviews.ts` | 타입 인터페이스 + ANSWER_TYPE 상수 변경 |
| `components/reviews/*.tsx` | 필드명 참조 변경 (question_id→id, answer_type→question_type_eng 등) |

### 스크립트 (scripts)

| 파일 | 변경 내용 |
|------|---------|
| `lib/actions/scripts.ts` | master_questions 쿼리 → questions |
| `lib/types/scripts.ts` | question_id 참조 변경 |
| `supabase/functions/scripts/index.ts` | master_questions 조회 → questions |

### 모의고사 / 튜터링 (미구현)

- 구현 시 처음부터 questions 테이블 사용

---

## 8. DB 마이그레이션 SQL 순서

```sql
-- 1) 기존 테스트 데이터 정리 (scripts 7건)
DELETE FROM shadowing_evaluations;
DELETE FROM shadowing_sessions;
DELETE FROM script_packages;
DELETE FROM scripts;

-- 2) FK 제거
ALTER TABLE submission_questions DROP CONSTRAINT submission_questions_master_question_id_fkey;
ALTER TABLE scripts DROP CONSTRAINT scripts_question_id_fkey;

-- 3) FK 재설정 → questions 테이블
ALTER TABLE submission_questions
  ADD CONSTRAINT submission_questions_question_id_fkey
  FOREIGN KEY (master_question_id) REFERENCES questions(id);

ALTER TABLE scripts
  ADD CONSTRAINT scripts_question_id_fkey
  FOREIGN KEY (question_id) REFERENCES questions(id);

-- 4) (선택) master_questions 테이블 보존 또는 삭제
-- DROP TABLE master_questions CASCADE;  -- 필요 시
```

---

## 9. 체크리스트

- [ ] scripts 테이블 테스트 데이터 7건 삭제
- [ ] FK 제약조건 변경 (submission_questions, scripts → questions)
- [ ] `lib/queries/master-questions.ts` → 테이블명 + 컬럼명 변경
- [ ] `lib/actions/reviews.ts` → 쿼리 변경 (7개 함수)
- [ ] `lib/actions/scripts.ts` → 쿼리 변경
- [ ] `lib/types/reviews.ts` → 타입 + ANSWER_TYPE 상수 변경
- [ ] `components/reviews/*.tsx` → 필드명 참조 변경
- [ ] `supabase/functions/scripts/index.ts` → 쿼리 변경
- [ ] script_specs 테이블 question_type 값 확인 (answer_type → question_type_eng 매핑)
- [ ] 빌드 테스트
- [ ] 프로덕션 테스트 (후기 제출 + 스크립트 생성 + 쉐도잉)

---

*최종 업데이트: 2026-03-01*
