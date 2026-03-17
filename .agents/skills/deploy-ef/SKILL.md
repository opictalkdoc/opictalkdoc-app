---
name: deploy-ef
description: Supabase Edge Function 배포. EF 배포, 함수 배포, deploy edge function, supabase deploy 요청 시 사용. 프로젝트의 Edge Function을 Supabase에 배포하는 전체 플로우를 처리한다.
argument-hint: [함수명|all]
allowed-tools: Bash, Read, Glob
disable-model-invocation: true
---

# Edge Function 배포 스킬

## 배포 설정
- **프로젝트**: `rwdsyqnrrpwkureqfxwb`
- **작업 디렉토리**: `C:/Users/js777/Desktop/opictalkdoc`
- **토큰 환경변수**: `SUPABASE_ACCESS_TOKEN` (bashrc에 설정됨)

## JWT 검증 비활성화 필수 함수
아래 함수는 반드시 `--no-verify-jwt` 플래그를 붙여야 한다:
- `mock-test-eval-judge`
- `mock-test-eval-coach`
- `mock-test-report`
- `admin-trigger-eval`

## 실행 절차

### 인자가 특정 함수명인 경우
1. `supabase/functions/$0/` 디렉토리 존재 확인
2. JWT 비활성화 대상인지 확인
3. 배포 명령 실행

### 인자가 "all"인 경우
1. `supabase/functions/` 아래 모든 함수 디렉토리 나열 (`_shared` 제외)
2. 각 함수를 순차 배포 (JWT 비활성화 대상은 자동 적용)

### 배포 명령 템플릿

일반 함수:
```bash
cd C:/Users/js777/Desktop/opictalkdoc && SUPABASE_ACCESS_TOKEN=sbp_92d17e1a6d55b906b31878a97fec2a62ccab5964 npx supabase functions deploy {함수명} --project-ref rwdsyqnrrpwkureqfxwb
```

JWT 비활성화 함수:
```bash
cd C:/Users/js777/Desktop/opictalkdoc && SUPABASE_ACCESS_TOKEN=sbp_92d17e1a6d55b906b31878a97fec2a62ccab5964 npx supabase functions deploy {함수명} --project-ref rwdsyqnrrpwkureqfxwb --no-verify-jwt
```

## 출력
- 각 함수의 배포 성공/실패 상태를 보고
- 실패 시 에러 메시지 포함
