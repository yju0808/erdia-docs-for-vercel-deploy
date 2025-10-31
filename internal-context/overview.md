# 프로젝트 개요 (Overview)

## 🎯 프로젝트 정보

### 기본 정보
- **프로젝트명**: erdia-docs
- **유형**: Documentation Website
- **목적**: Erdia 제품의 공식 문서 사이트
- **대상 사용자**: Erdia 플랫폼 사용자 (개발자, 데이터 엔지니어, 학생, 기획자)

### Erdia란?
Erdia는 AI 기반의 차세대 ERD(Entity-Relationship Diagram) 디자인 플랫폼입니다.  
자연어 대화로 데이터베이스 설계를 시작하고, 인터랙티브한 캔버스에서 실시간 수정이 가능하며,  
다양한 데이터베이스 엔진에 맞는 SQL을 즉시 내보낼 수 있는 서비스입니다.

---

## 🛠️ 기술 스택

### Core Framework
- **Next.js 16.0.0**: React 기반 풀스택 프레임워크
  - App Router 사용 (Pages Router 아님)
  - React 19.2.0 사용
  - Server Components 및 Server Actions 활용

### Documentation Framework
- **Fumadocs 16.0.3**: Next.js 기반 문서화 프레임워크
  - `fumadocs-core`: 핵심 기능 (라우팅, 검색, 메타데이터)
  - `fumadocs-ui`: UI 컴포넌트 (레이아웃, 페이지, 네비게이션)
  - `fumadocs-mdx`: MDX 파일 처리 및 컴파일

### Content & Styling
- **MDX**: Markdown + JSX 하이브리드 콘텐츠 형식
- **Tailwind CSS 4.1.15**: 유틸리티 기반 CSS 프레임워크
- **Noto Sans KR**: 한국어 최적화 웹폰트

### Development Tools
- **TypeScript 5.9.3**: 타입 안전성 보장
- **ESLint 9**: 코드 품질 및 일관성 검사
- **PostCSS 8.5.6**: CSS 후처리

---

## 📁 프로젝트 구조 개요

```
erdia-docs/
├── app/                    # Next.js App Router 디렉토리
│   ├── layout.tsx         # 루트 레이아웃 (한국어, 폰트 설정)
│   ├── global.css         # 전역 스타일
│   ├── (home)/            # 홈페이지 라우트 그룹
│   ├── docs/              # 문서 페이지
│   │   ├── layout.tsx    # 문서 레이아웃 (사이드바, TOC)
│   │   └── [[...slug]]/  # 동적 catch-all 라우트
│   ├── api/               # API 라우트
│   │   └── search/       # 문서 검색 API
│   ├── og/                # Open Graph 이미지 생성
│   └── llms-full.txt/    # LLM용 전체 문서 텍스트
│
├── content/               # MDX 콘텐츠 소스
│   └── docs/             # 문서 MDX 파일들
│       ├── index.mdx     # 메인 문서 페이지
│       ├── guides/       # 가이드 섹션
│       ├── tips/         # 팁 섹션
│       └── updates/      # 업데이트 노트
│
├── lib/                   # 공통 라이브러리
│   ├── source.ts         # Fumadocs 소스 로더 설정
│   └── layout.shared.tsx # 공유 레이아웃 옵션
│
├── internal-context/      # 내부 지식 문서 (이 폴더)
├── etc/                   # 기타 문서
├── next.config.mjs       # Next.js 설정
├── source.config.ts      # Fumadocs MDX 설정
└── tsconfig.json         # TypeScript 설정
```

---

## 🔑 핵심 설계 결정

### 1. Fumadocs 선택 이유
- **이유**: Next.js App Router와 완벽한 통합
- **장점**: 
  - MDX 기반 콘텐츠 관리
  - 자동 검색 인덱싱
  - 한국어 지원
  - 커스터마이징 가능한 UI 컴포넌트
- **트레이드오프**: 프레임워크 종속성 증가, 학습 곡선

### 2. App Router 사용
- **이유**: Next.js 13+ 권장 방식, 미래 지향적
- **장점**:
  - Server Components로 성능 최적화
  - 향상된 라우팅 패턴 (라우트 그룹, 병렬 라우트)
  - 스트리밍 및 Suspense 지원
- **트레이드오프**: Pages Router 대비 생태계가 성숙 중

### 3. 루트 리다이렉트 (`/` → `/docs`)
- **위치**: `next.config.mjs`
- **이유**: 문서 사이트의 주요 콘텐츠가 `/docs`에 있음
- **영향**: 메인 랜딩 페이지 없이 바로 문서로 진입

### 4. 한국어 우선
- **설정**: `<html lang="ko">`, Noto Sans KR 폰트
- **이유**: 주요 사용자층이 한국어 사용자
- **검색 API**: 현재 영어 설정 (`language: 'english'`)
  - <!-- TODO: 한국어 검색 품질 테스트 후 'korean'으로 변경 검토 -->

### 5. LLM 텍스트 엔드포인트
- **경로**: `/llms-full.txt`
- **목적**: AI 모델이 전체 문서를 한 번에 읽을 수 있도록 제공
- **구현**: 모든 페이지를 처리된 마크다운으로 변환 후 결합

---

## 🎨 주요 기능

### 1. 자동 문서 생성
- `content/docs/*.mdx` → 자동으로 페이지 생성
- Frontmatter로 메타데이터 관리
- `meta.json`으로 사이드바 구조 제어

### 2. 풀텍스트 검색
- Fumadocs + Orama 기반
- `/api/search` 엔드포인트
- 클라이언트 사이드 검색 UI

### 3. Open Graph 이미지
- 동적 OG 이미지 생성
- 경로: `/og/docs/[...slug]`
- 각 문서 페이지마다 고유 이미지

### 4. 반응형 레이아웃
- 모바일/태블릿/데스크톱 지원
- 사이드바 자동 토글
- TOC (Table of Contents) 우측 표시

---

## 📊 데이터 흐름

### 콘텐츠 처리 파이프라인

```
MDX 파일 작성 (content/docs/*.mdx)
    ↓
fumadocs-mdx 빌드 시 컴파일
    ↓
.source/ 디렉토리에 중간 출력 생성
    ↓
lib/source.ts가 로드
    ↓
페이지 컴포넌트에서 source.getPage() 호출
    ↓
렌더링 (Server Component)
```

### 검색 인덱싱

```
빌드 시점: MDX → 텍스트 추출 → 검색 인덱스 생성
런타임: 사용자 쿼리 → /api/search → Orama 검색 → 결과 반환
```

---

## 🔗 외부 통합 포인트

### 현재 통합
- **없음**: 현재는 독립적인 정적 문서 사이트

### 잠재적 통합 포인트
<!-- 향후 확장 시 추가 예정 -->
- Erdia 메인 애플리케이션 (https://www.erdia.app)
- Erdia 개발 환경 (https://dev.erdia.app)
- 사용자 인증 시스템 (미구현)
- 피드백/문의 시스템 (이메일: hello@erdia.app)

---

## 📈 성능 및 배포

### 빌드 전략
- **타입**: Static Export 가능 (SSG)
- **최적화**: 
  - Server Components로 클라이언트 번들 최소화
  - 자동 코드 스플리팅
  - 이미지 최적화 (Next.js Image)

### 배포 환경
<!-- TODO: 실제 배포 환경 정보로 업데이트 -->
- [PLACEHOLDER: 배포 플랫폼 (Vercel, Netlify, 자체 호스팅 등)]
- [PLACEHOLDER: 도메인 정보]
- [PLACEHOLDER: CI/CD 파이프라인]

---

## 🚧 알려진 제약사항

1. **검색 언어**: 현재 영어로 설정되어 한국어 검색 정확도 제한적
2. **정적 콘텐츠**: 동적 사용자 데이터나 세션 관리 없음
3. **인증 없음**: 모든 문서가 공개 접근 가능

---

## 📝 향후 개선 방향

<!-- AI 에이전트가 프로젝트 진화에 따라 업데이트 -->

- [ ] 한국어 검색 최적화
- [ ] 다크 모드 테마 커스터마이징
- [ ] 사용자 피드백 수집 기능
- [ ] 문서 버전 관리
- [ ] 다국어 지원 (i18n)

---

## 📚 참고 문서

- [Fumadocs 공식 문서](https://fumadocs.dev/)
- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [MDX 문법 가이드](https://mdxjs.com/)

---

**마지막 업데이트**: 2025-10-31  
**문서 작성자**: AI Agent (Initial Setup)
