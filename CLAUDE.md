# CLAUDE.md - OPIcTalkDoc 프로젝트

## 🔄 자동 업데이트 규칙

**IMPORTANT**: 의미 있는 작업이 완료될 때마다, 이 CLAUDE.md의 아래 섹션들을 최신 상태로 업데이트한다.

**업데이트 대상:**
- `📅 개발 이력` — 완료된 작업 내역 추가 (날짜 + 요약)
- `🔮 현재 상태 & 다음 단계` — 현재 상태와 다음 작업 갱신
- `📚 프로젝트 문서 체계` — 문서가 추가/변경되면 반영

**업데이트 시점:**
- Phase나 Step이 완료되었을 때
- DB 테이블이 생성/변경되었을 때
- 새로운 모듈이 구현되었을 때
- 문서가 추가/삭제/이름변경 되었을 때
- 프로젝트 구조에 큰 변화가 있을 때

**업데이트하지 않는 경우:**
- 단순 버그 수정, 사소한 스타일 변경
- 대화만 하고 코드 변경이 없을 때

**함께 업데이트할 문서:**
- `오픽톡닥_개발계획서.md`의 "현재 진행 상태" 섹션도 같이 갱신

---

## 🌏 Language Instruction

**IMPORTANT**: 모든 설명과 응답은 반드시 **한국어**로 작성하세요.
- 코드 주석: 한국어
- 커밋 메시지: 한국어 (예: `feat: 로그인 기능 추가`)
- 문서 작성: 한국어
- 사용자와의 대화: 한국어

영어는 오직 다음 경우에만 사용:
- 코드 자체 (변수명, 함수명 등)
- 기술 용어가 영어가 더 명확한 경우

## 🎯 Project Overview

**OPIcTalkDoc** - AI 기반 OPIc 영어 말하기 학습 플랫폼
- 도메인: https://opictalkdoc.com
- 소리담(soridam) 베타의 최종 버전 기능을 이관하여 구축하는 프로젝트
- 소리담 소스코드: `C:\Users\js777\Desktop\soridam`

## 📚 프로젝트 문서 체계

> **이 섹션이 프로젝트 문서의 전체 지도다. 어떤 문서가 무슨 역할인지 여기서 파악한다.**

### 문서 구조도

```
오픽톡닥_개발계획서.md  ← 마스터 실행 가이드 (무엇을, 어떤 순서로, 어떻게)
    │
    ├── 참조 → 소리담_기능_분석.md     ← 이관 요약 + 분석결과 인덱스
    │              │
    │              └── 참조 → 소리담_분석_결과.md  ← 상세 레퍼런스 (스키마, API, 타입, 플로우)
    │
    ├── 참조 → 오픽톡닥_런칭_마스터플랜.md  ← 사업/행정/결제 (PG사 계약, 브랜드)
    │
    ├── 참조 → 오픽톡닥_아토믹_디자인_시스템.md  ← UI 디자인 시스템
    │
    └── 참조 → 오픽톡닥_로고_에셋_가이드.md  ← 로고/브랜드 에셋
```

### 문서별 상세 역할

| 문서 | 크기 | 역할 | 핵심 내용 | 언제 보는가 |
|------|------|------|----------|------------|
| **오픽톡닥_개발계획서.md** | ~12KB | 마스터 실행 가이드 | Phase 1~5 개발 순서, 모듈별 할 일 (페이지/DB/API), 각 단계에서 어떤 문서의 몇 번 섹션을 참조할지 | **항상 — "다음에 뭘 하지?" 여기서 확인** |
| **소리담_기능_분석.md** | ~4KB | 이관 요약 + 인덱스 | 이관/미이관/신규 기능 목록, 분석결과 15개 섹션 인덱스 (§번호로 빠른 탐색) | 분석결과에서 어느 섹션을 봐야 하는지 찾을 때 |
| **소리담_분석_결과.md** | ~60KB | 상세 레퍼런스 | 소리담 코드 레벨 분석 — DB 스키마, Edge Function, TypeScript 타입, 데이터 플로우, master_questions 핵심 코어 | **실제 코드 작성 시 — 구현 디테일이 필요할 때** |
| **오픽톡닥_런칭_마스터플랜.md** | ~14KB | 사업/행정/결제 | 브랜드(톡닥이 AI 주치의), 결제(포트원, KG이니시스, 카카오페이), PG사 계약 현황, 사업자 정보 | 결제 연동, PG사 계약 확인 시 |
| **오픽톡닥_아토믹_디자인_시스템.md** | ~53KB | UI 디자인 시스템 | 아토믹 디자인 원칙, 컴포넌트 설계, 디자인 토큰 | UI 컴포넌트 구현 시 |
| **오픽톡닥_로고_에셋_가이드.md** | ~9KB | 로고/브랜드 에셋 | 로고 사용 가이드, 에셋 파일 경로 | 디자인 작업 시 |

### 문서 사용 시나리오

**"다음 개발 단계가 뭐지?"**
→ `오픽톡닥_개발계획서.md`의 "현재 진행 상태" 섹션 확인

**"모의고사 DB를 어떻게 설계하지?"**
→ `오픽톡닥_개발계획서.md` Step 3 → "📖 분석결과 §7 참조" → `소리담_분석_결과.md` 섹션 7

**"분석결과에서 뭘 봐야 하지?"**
→ `소리담_기능_분석.md`의 "분석 결과 문서 안내" 인덱스 테이블

**"PG사 계약 상태가 어떻게 되지?"**
→ `오픽톡닥_런칭_마스터플랜.md` §4

### 핵심 개념 (반드시 기억)

- **master_questions (510개)**: 시스템 전체의 SSOT. 모든 모듈이 이 테이블에서 시작됨
- **answer_type (10가지)**: 평가 체크박스, AI 튜터 진단, 스크립트 전략이 모두 이 값으로 분기
- **custom_mode_questions**: DB 트리거로 자동 생성되는 콤보 데이터, 모의고사 출제에 사용
- **이관 순서**: 데이터랩 → 스크립트 → 모의고사 → AI 튜터 → 내 스크립트 → 쉐도잉
- **모든 모듈 이관 절차**: DB → RLS → Edge Function → 타입 → API → 상태관리 → UI → 테스트

## 🏗️ 기술 스택

| 영역 | 기술 |
|------|------|
| **프레임워크** | Next.js (App Router) |
| **언어** | TypeScript (strict mode) |
| **스타일링** | Tailwind CSS |
| **상태관리** | Zustand |
| **데이터 페칭** | TanStack React Query |
| **폼** | React Hook Form + Zod |
| **백엔드** | Supabase Edge Functions (Deno) |
| **DB** | Supabase PostgreSQL + RLS |
| **인증** | Supabase Auth |
| **배포** | Vercel (프론트) + Supabase (백엔드) |

## 🔑 인프라 정보

### GitHub
- **계정**: opictalkdoc
- **저장소**: `opictalkdoc/opictalkdoc-app`
- **URL**: https://github.com/opictalkdoc/opictalkdoc-app

### Supabase
- **Project ID**: `rwdsyqnrrpwkureqfxwb`
- **Project URL**: `https://rwdsyqnrrpwkureqfxwb.supabase.co`
- **Region**: Northeast Asia (Seoul)
- **DB Password**: `opictalkdoc2026!!`
- **DB Host (Pooler)**: `aws-1-ap-northeast-2.pooler.supabase.com`
- **DB Port**: `6543` (Transaction) / `5432` (Session)
- **DB User**: `postgres.rwdsyqnrrpwkureqfxwb`

### Vercel
- **팀**: OPIcTalkDoc (Pro)
- **프로젝트**: opictalkdoc-app
- **도메인**: opictalkdoc.com, www.opictalkdoc.com
- **자동 배포**: main 브랜치 푸시 시 자동 배포

### DNS (Spaceship)
- **A 레코드**: `@` → `216.198.79.1`
- **CNAME**: `www` → `cname.vercel-dns.com`

### 테스트 계정 (심사/검수용)
- **ID**: `test@opictalkdoc.com`
- **PW**: `Test1234@@`
- **URL**: https://opictalkdoc.com/login
- **용도**: 카카오페이, PG사, 통신판매업 심사 등 외부 검수용

## 📁 프로젝트 구조

```
opictalkdoc/
├── CLAUDE.md              # 프로젝트 가이드 (이 파일)
├── .gitignore
├── README.md
└── frontend/              # Next.js 앱
    ├── app/               # App Router 페이지
    ├── lib/
    │   ├── supabase.ts        # 브라우저 클라이언트
    │   └── supabase-server.ts # 서버 클라이언트
    ├── middleware.ts       # 인증 세션 관리
    ├── .env.local         # 환경변수 (git 제외)
    ├── package.json
    └── tsconfig.json
```

## 🚀 Essential Commands

```bash
# 개발 서버
cd frontend && npm run dev

# 빌드
cd frontend && npm run build

# Git 커밋 & 배포 (main 푸시 = 프로덕션 자동 배포)
git add -A && git commit -m "feat: 기능 설명" && git push origin main
```

## ⚠️ Environment Variables (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rwdsyqnrrpwkureqfxwb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚨 Critical Development Workflow

1. **코드 수정** - 필요한 변경사항 구현
2. **사용자가 요청한 경우에만**:
   - `npm run build` 실행하여 빌드 테스트
   - `npx tsc --noEmit` 타입 체크
3. **사용자가 커밋/푸시 요청한 경우에만**:
   - Git 커밋 & 푸시

### ⛔ 자동 실행 금지 항목 (사용자 요청 시에만!)
- ❌ `npm run build`
- ❌ `npx tsc --noEmit`
- ❌ `git commit`
- ❌ `git push`

## 📝 Git Commit Convention (한국어)

```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드/설정 변경
style: 코드 포맷팅
perf: 성능 개선
```

## 📋 Git 설정

```bash
# 이 저장소 전용 설정
git config user.email "opictalkdoc@gmail.com"
git config user.name "opictalkdoc"

# 원격 저장소 (인증 포함)
origin: https://opictalkdoc@github.com/opictalkdoc/opictalkdoc-app.git
```

## 📅 개발 이력

### 2026-02-18 - 프로젝트 초기 세팅
- GitHub 저장소 생성 (`opictalkdoc/opictalkdoc-app`)
- Supabase 프로젝트 생성 (Seoul 리전)
- Next.js + TypeScript + Tailwind CSS 프로젝트 초기화
- 핵심 패키지 설치 (Supabase, Zustand, React Query, Hook Form, Zod)
- Supabase 클라이언트 설정 (브라우저/서버)
- 인증 미들웨어 추가
- Vercel 배포 연결 + 환경변수 설정
- opictalkdoc.com 도메인 DNS 연결 완료

### 2026-02-19 - Phase 1~2 완료 + 소리담 분석
- Phase 1 (인증): 로그인/회원가입/OAuth/프로필 완료
- Phase 2 (공개 페이지): 랜딩/요금제/이용약관/개인정보/환불규정/사업자정보 완료
- 소리담 코드 레벨 상세 분석 완료 (master_questions 핵심 코어 파악)
- 프로젝트 문서 체계 정리 (개발계획서, 기능분석, 분석결과)

### 2026-02-20 - 네비게이션 재구성 + 시험후기 + 몰입형 레이아웃 + DB Step 0
- 네비게이션 메뉴 전면 재구성: 대시보드 | 시험후기 | 스크립트 | 모의고사 | 튜터링
- 시험후기 페이지 UI 셸 구현 (/reviews, 3탭: 빈도 분석 / 후기 제출 / 시험 후기)
- 모바일 반응형 수정 (마이페이지, 풋터, 랜딩, 전략 가이드, 요금제)
- 마이페이지 저장 버튼 세로 깨짐 수정 (shrink-0)
- 모듈별 탭 구조 확정 (시험후기/스크립트/모의고사/튜터링 각각 내부 탭)
- **몰입형 레이아웃 시스템 구축**: (immersive) 레이아웃 + ImmersiveHeader 컴포넌트
- **허브 페이지 3개**: 스크립트(/scripts), 모의고사(/mock-exam), 튜터링(/tutoring) 탭 UI
- **몰입형 페이지 4개**: 모의고사 세션, 스크립트 생성, 쉐도잉, 튜터링 훈련 (UI 셸)
- **DB Step 0 완료**: master_questions + custom_mode_questions 테이블 생성 (ENUM, RLS, 트리거, RPC)
- **시드 데이터 510개 삽입**: 소리담 프로덕션에서 추출 → 오픽톡닥 DB 로드 완료
- **Storage 버킷 생성**: audio-recordings (공개 읽기, 인증 업로드)

## 🔮 현재 상태 & 다음 단계

**현재**: Phase 3 (핵심 모듈 이관) — Step 0 DB 설계 완료, Step 1 대기
**다음 작업**: Step 1 — 시험후기 모듈 이관 (submissions 테이블 + Edge Function + 프론트 연결)

### 네비게이션 구조 (확정)
```
대시보드 | 시험후기 | 스크립트 | 모의고사 | 튜터링
```

### 레이아웃 구조 (확정)
- **(dashboard)**: 탐색/허브 페이지 — Navbar + Footer 포함
- **(immersive)**: 활동/몰입 페이지 — ImmersiveHeader만, Navbar/Footer 없음

### 모듈별 내부 탭 구조 (확정)
- **시험후기** (/reviews): 빈도 분석 | 후기 제출 | 시험 후기
- **스크립트** (/scripts): 스크립트 생성 | 내 스크립트 | 쉐도잉 훈련
- **모의고사** (/mock-exam): 응시 | 결과 | 나의 이력
- **튜터링** (/tutoring): 진단 | 처방 | 훈련

### DB 현황
- **master_questions**: 510행 (시드 로드 완료)
- **custom_mode_questions**: 0행 (DB 트리거로 자동 생성 예정)
- **Storage**: audio-recordings 버킷 (공개, RLS 설정 완료)

### Supabase DB 접속
```bash
export PGPASSWORD=$(printf '%s' 'opictalkdoc2026!!')
PGCLIENTENCODING='UTF8' "/c/Program Files/PostgreSQL/16/bin/psql" \
  -h aws-1-ap-northeast-2.pooler.supabase.com \
  -p 6543 \
  -U postgres.rwdsyqnrrpwkureqfxwb \
  -d postgres \
  --set=sslmode=require \
  -c "SQL문"
```

> 상세 진행 상황은 `오픽톡닥_개발계획서.md`의 "현재 진행 상태" 참조

---
*최종 업데이트: 2026-02-20*
*상태: Phase 3 Step 0 완료 — DB 코어 테이블 + 시드 + 버킷 완료, Step 1 시험후기 이관 대기*
