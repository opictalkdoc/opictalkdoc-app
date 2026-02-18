# CLAUDE.md - OPIcTalkDoc 프로젝트

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
- 소리담(soridam) 베타에서 필요한 기능만 선별하여 새로 구축하는 프로젝트

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

### Vercel
- **팀**: OPIcTalkDoc (Pro)
- **프로젝트**: opictalkdoc-app
- **도메인**: opictalkdoc.com, www.opictalkdoc.com
- **자동 배포**: main 브랜치 푸시 시 자동 배포

### DNS (Spaceship)
- **A 레코드**: `@` → `216.198.79.1`
- **CNAME**: `www` → `cname.vercel-dns.com`

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

## 🔮 다음 단계 (미정)

- [ ] 모듈 선택 (모의고사, AI훈련소, 쉐도잉 등)
- [ ] DB 테이블 설계
- [ ] 로그인/회원가입 구현
- [ ] 핵심 모듈 개발

---
*최종 업데이트: 2026-02-18*
*상태: 초기 세팅 완료*
