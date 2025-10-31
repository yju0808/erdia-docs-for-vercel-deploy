# 시스템 아키텍처 (Architecture)

## 🏗️ 전체 아키텍처 개요

erdia-docs는 **Next.js App Router + Fumadocs** 기반의 정적 문서 사이트입니다.  
MDX 파일로 작성된 콘텐츠를 빌드 타임에 처리하여 최적화된 React 페이지로 변환합니다.

### 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Client)                       │
│  - React 19 Hydration                                    │
│  - Search UI (Client Component)                          │
│  - Interactive Navigation                                │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP Request
                   ↓
┌─────────────────────────────────────────────────────────┐
│              Next.js Server (App Router)                 │
│  ┌─────────────────────────────────────────────┐        │
│  │ Server Components (RSC)                      │        │
│  │  - layout.tsx (Root, Docs)                  │        │
│  │  - page.tsx (Dynamic Routes)                │        │
│  │  - Server-side Rendering                    │        │
│  └─────────────────────────────────────────────┘        │
│  ┌─────────────────────────────────────────────┐        │
│  │ API Routes                                   │        │
│  │  - /api/search (Search Index)               │        │
│  │  - /llms-full.txt (LLM Export)              │        │
│  │  - /og/docs/[...slug] (OG Images)           │        │
│  └─────────────────────────────────────────────┘        │
└──────────────────┬──────────────────────────────────────┘
                   │ Source Loader
                   ↓
┌─────────────────────────────────────────────────────────┐
│              Fumadocs Source (lib/source.ts)             │
│  - Page Tree Generator                                   │
│  - Metadata Extractor                                    │
│  - Search Index Builder                                  │
└──────────────────┬──────────────────────────────────────┘
                   │ Compile Time
                   ↓
┌─────────────────────────────────────────────────────────┐
│         MDX Compilation (fumadocs-mdx)                   │
│  - MDX → React Component                                 │
│  - Frontmatter Parsing                                   │
│  - Code Highlighting                                     │
│  - Component Injection                                   │
└──────────────────┬──────────────────────────────────────┘
                   │ Source Files
                   ↓
┌─────────────────────────────────────────────────────────┐
│              Content Source (content/docs/)              │
│  - *.mdx (Markdown + JSX)                                │
│  - meta.json (Sidebar Config)                            │
│  - Static Assets                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 디렉토리 구조 상세

### `/app` - Next.js App Router

App Router는 파일 시스템 기반 라우팅을 사용합니다.

```
app/
├── layout.tsx              # 전역 레이아웃 (HTML, Body, Provider)
├── global.css              # Tailwind 지시어 및 전역 스타일
│
├── (home)/                 # 라우트 그룹 (URL에 영향 없음)
│   ├── layout.tsx         # 홈 전용 레이아웃
│   └── page.tsx           # 홈페이지 (현재 리다이렉트로 미사용)
│
├── docs/                   # 문서 섹션
│   ├── layout.tsx         # DocsLayout (사이드바, TOC)
│   └── [[...slug]]/       # 옵셔널 catch-all 라우트
│       └── page.tsx       # 동적 문서 페이지
│
├── api/                    # API 라우트 핸들러
│   └── search/
│       └── route.ts       # GET /api/search
│
├── llms-full.txt/          # 특수 라우트
│   └── route.ts           # GET /llms-full.txt
│
└── og/                     # Open Graph 이미지
    └── docs/
        └── [...slug]/
            └── route.tsx  # 동적 이미지 생성
```

#### 라우트 그룹 `(home)`
- 괄호로 감싼 폴더는 URL 경로에 포함되지 않음
- 레이아웃을 분리하기 위한 조직 도구
- 현재는 루트 리다이렉트로 인해 실질적으로 미사용

#### Catch-all 라우트 `[[...slug]]`
- **이중 대괄호**: 옵셔널 (slug가 없어도 매칭)
- `/docs` → `slug = undefined`
- `/docs/getting-started` → `slug = ['getting-started']`
- `/docs/guides/ai-chat` → `slug = ['guides', 'ai-chat']`

---

### `/content` - MDX 콘텐츠

```
content/
└── docs/
    ├── index.mdx           # /docs 메인 페이지
    ├── features.mdx        # /docs/features
    ├── getting-started.mdx # /docs/getting-started
    ├── meta.json           # 사이드바 구조 정의
    │
    ├── guides/
    │   ├── index.mdx       # /docs/guides
    │   ├── ai-chat.mdx     # /docs/guides/ai-chat
    │   ├── canvas.mdx
    │   └── meta.json
    │
    └── tips/
        └── tips/           # 중첩 구조
            ├── erd-best-practices.mdx
            └── meta.json
```

#### `meta.json` 역할
- 사이드바 네비게이션 순서 제어
- 페이지 제목 오버라이드
- 아이콘 추가 가능

**예시**:
```json
{
  "title": "가이드",
  "pages": ["ai-chat", "canvas", "export"]
}
```

---

### `/lib` - 공통 라이브러리

```
lib/
├── source.ts              # Fumadocs 소스 로더 설정
└── layout.shared.tsx      # 공유 레이아웃 옵션
```

#### `source.ts` - 핵심 로직

```typescript
// Fumadocs 소스 로더 생성
export const source = loader({
  baseUrl: '/docs',                    // 모든 페이지 기본 경로
  source: docs.toFumadocsSource(),    // MDX → Fumadocs 형식 변환
  plugins: [lucideIconsPlugin()],     // Lucide 아이콘 플러그인
});
```

**주요 메서드**:
- `source.getPage(slug)`: 특정 페이지 메타데이터 + 콘텐츠
- `source.getPages()`: 모든 페이지 배열
- `source.pageTree`: 사이드바 트리 구조

---

## 🔄 데이터 흐름 상세

### 1. 빌드 타임 처리

```
[개발자 작성]
content/docs/guides/ai-chat.mdx
    ↓
[fumadocs-mdx 컴파일]
1. Frontmatter 파싱 (title, description 등)
2. MDX → React 컴포넌트 변환
3. 코드 블록 하이라이팅
4. 자동 TOC 생성
    ↓
[중간 출력]
.source/
└── {hash}.json  # 컴파일된 메타데이터 및 콘텐츠
    ↓
[lib/source.ts 로드]
loader() 함수가 .source/ 읽어서 인메모리 구조 생성
    ↓
[Next.js 빌드]
각 페이지를 정적 HTML로 프리렌더링
```

### 2. 런타임 페이지 렌더링

```
[사용자 요청]
GET /docs/guides/ai-chat
    ↓
[Next.js 라우터]
app/docs/[[...slug]]/page.tsx 매칭
slug = ['guides', 'ai-chat']
    ↓
[Server Component 실행]
const page = source.getPage(['guides', 'ai-chat']);
    ↓
[콘텐츠 렌더링]
<DocsPage>
  <DocsTitle>{page.data.title}</DocsTitle>
  <DocsBody>
    <MDX components={getMDXComponents()} />
  </DocsBody>
</DocsPage>
    ↓
[클라이언트 전송]
서버에서 렌더링된 HTML + 최소 JavaScript
```

### 3. 검색 인덱스 생성

```
[빌드 타임]
source.getPages() → 모든 페이지 메타데이터
    ↓
[Fumadocs + Orama]
createFromSource(source) 호출
→ 제목, 설명, 본문 텍스트 추출
→ Orama 검색 인덱스 생성
    ↓
[런타임]
GET /api/search?query=ERD
→ Orama 검색 실행
→ JSON 응답 반환
```

---

## 🧩 컴포넌트 계층 구조

### 레이아웃 계층

```
RootLayout (app/layout.tsx)
└── <html lang="ko">
    └── <body>
        └── <RootProvider>  # Fumadocs UI Provider
            │
            ├── HomeLayout (app/(home)/layout.tsx)
            │   └── HomePage (현재 미사용)
            │
            └── DocsLayout (app/docs/layout.tsx)
                ├── Sidebar (자동 생성)
                ├── Main Content
                │   └── DocsPage (app/docs/[[...slug]]/page.tsx)
                │       ├── DocsTitle
                │       ├── DocsDescription
                │       └── DocsBody
                │           └── <MDX />
                └── TOC (우측)
```

### 컴포넌트 소유권

| 컴포넌트 | 제공자 | 커스터마이징 |
|---------|--------|-------------|
| `RootProvider` | fumadocs-ui | props로 테마 설정 |
| `DocsLayout` | fumadocs-ui | `baseOptions()`로 커스터마이징 |
| `DocsPage` | fumadocs-ui | `full` prop으로 전체 너비 모드 |
| `DocsTitle` | fumadocs-ui | children으로 제목 전달 |
| `DocsBody` | fumadocs-ui | MDX 컴포넌트 래핑 |
| `MDX` | fumadocs-mdx | `getMDXComponents()`로 커스터마이징 |

---

## ⚙️ 설정 파일 해부

### `next.config.mjs`

```javascript
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();  // Fumadocs MDX 플러그인

const config = {
  reactStrictMode: true,       // React Strict Mode 활성화
  async redirects() {
    return [
      {
        source: '/',           // 루트 경로
        destination: '/docs',  // 문서 페이지로 리다이렉트
        permanent: true,       // 301 리다이렉트
      },
    ];
  },
};

export default withMDX(config);  // MDX 설정 주입
```

**`createMDX()` 역할**:
- Webpack 설정에 MDX 로더 추가
- `.mdx` 파일을 React 컴포넌트로 처리
- `source.config.ts`와 연동

### `source.config.ts`

```typescript
export const docs = defineDocs({
  dir: 'content/docs',  // MDX 파일 위치
  docs: {
    schema: frontmatterSchema,  // Frontmatter 검증 스키마
    postprocess: {
      includeProcessedMarkdown: true,  // 처리된 마크다운 포함
    },
  },
  meta: {
    schema: metaSchema,  // meta.json 검증 스키마
  },
});
```

**스키마 확장 가능**:
```typescript
// 커스텀 frontmatter 필드 추가 예시
import { z } from 'zod';

const customSchema = frontmatterSchema.extend({
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
```

### `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],          // 절대 경로 임포트 (@/lib/source)
      "@/.source": [".source"]  // 빌드 출력 참조
    },
    "jsx": "react-jsx",        // React 19 새 JSX 변환
    // ...
  }
}
```

---

## 🔌 플러그인 및 확장

### Lucide Icons Plugin

```typescript
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

export const source = loader({
  plugins: [lucideIconsPlugin()],
});
```

**기능**: MDX에서 Lucide 아이콘을 직접 사용 가능
```mdx
<Icon name="check" />
```

### 추가 가능한 플러그인
<!-- TODO: 필요 시 플러그인 추가 -->
- [PLACEHOLDER: 구문 강조 테마 커스터마이징]
- [PLACEHOLDER: 이미지 최적화 플러그인]
- [PLACEHOLDER: 자동 링크 검증]

---

## 🗂️ 파일 시스템 라우팅 규칙

### Next.js App Router 규칙

| 파일명 | 용도 | 예시 |
|-------|------|------|
| `layout.tsx` | 공유 UI 레이아웃 | `app/docs/layout.tsx` |
| `page.tsx` | 라우트 페이지 | `app/docs/[[...slug]]/page.tsx` |
| `route.ts` | API 핸들러 | `app/api/search/route.ts` |
| `loading.tsx` | 로딩 UI | (미사용) |
| `error.tsx` | 에러 처리 | (미사용) |
| `not-found.tsx` | 404 페이지 | (미사용) |

### 특수 폴더 규칙

| 패턴 | 의미 | 예시 |
|------|------|------|
| `(folder)` | 라우트 그룹 (URL 제외) | `(home)` |
| `[param]` | 동적 세그먼트 | `[slug]` |
| `[...param]` | Catch-all | `[...slug]` |
| `[[...param]]` | 옵셔널 Catch-all | `[[...slug]]` |

---

## 🔐 보안 고려사항

### 현재 보안 설정
- **React Strict Mode**: 활성화 (개발 시 부작용 감지)
- **CSP**: 미설정 (정적 사이트로 필요성 낮음)
- **인증**: 없음 (공개 문서)

### 주의사항
- MDX 파일에서 사용자 입력을 렌더링하지 않음
- 환경 변수 노출 없음 (빌드 시점에만 사용)

---

## 📊 성능 최적화

### Server Components 활용
- 대부분의 페이지는 Server Component
- 클라이언트 JavaScript 최소화
- 검색 UI만 Client Component

### 코드 스플리팅
- 페이지별 자동 분리
- 동적 import로 추가 최적화 가능

### 이미지 최적화
<!-- TODO: Next.js Image 컴포넌트 사용 확인 -->
- [PLACEHOLDER: content/docs 내 이미지 사용 현황]
- [PLACEHOLDER: Next/Image 적용 여부]

---

## 🧪 테스트 가능 지점

<!-- 향후 테스트 추가 시 참고 -->

### 단위 테스트
- `lib/source.ts`: 소스 로더 함수
- `mdx-components.tsx`: 커스텀 컴포넌트

### 통합 테스트
- `/api/search`: 검색 API 응답
- `/llms-full.txt`: 전체 텍스트 생성

### E2E 테스트
- 페이지 네비게이션
- 검색 기능
- 반응형 레이아웃

---

**참고 자료**:
- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- [Fumadocs 아키텍처](https://fumadocs.dev/docs/headless/architecture)
- [MDX 작동 원리](https://mdxjs.com/docs/what-is-mdx/)

---

**마지막 업데이트**: 2025-10-31  
**문서 작성자**: AI Agent (Initial Setup)
