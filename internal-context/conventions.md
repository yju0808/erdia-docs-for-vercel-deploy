# 코딩 컨벤션 (Conventions)

## 📋 개요

이 문서는 erdia-docs 프로젝트의 코딩 스타일, 네이밍 규칙, 파일 구조 패턴을 정의합니다.  
일관성 있는 코드베이스를 유지하기 위해 모든 기여자는 이 규칙을 따라야 합니다.

---

## 🗂️ 파일 및 폴더 네이밍

### 일반 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase, `.tsx` | `DocsLayout.tsx` |
| 일반 TypeScript | kebab-case, `.ts` | `layout.shared.tsx` |
| Next.js 라우트 | kebab-case, `page.tsx`, `layout.tsx` | `app/docs/layout.tsx` |
| MDX 콘텐츠 | kebab-case, `.mdx` | `getting-started.mdx` |
| 설정 파일 | kebab-case 또는 점 접두사 | `next.config.mjs`, `.eslintrc` |
| 폴더 | kebab-case | `content/docs/guides/` |

### Next.js App Router 특수 파일

```
app/
├── layout.tsx       # 레이아웃 (공유 UI)
├── page.tsx         # 페이지 (라우트 엔드포인트)
├── loading.tsx      # 로딩 UI
├── error.tsx        # 에러 바운더리
├── not-found.tsx    # 404 페이지
├── route.ts         # API 라우트 핸들러
└── template.tsx     # 리렌더링 레이아웃
```

**중요**: 이 파일명은 Next.js 규칙이므로 변경 불가

### 라우트 그룹 및 동적 라우트

```
(group-name)/        # 라우트 그룹 (URL 제외)
[param]/             # 동적 세그먼트
[...slug]/           # Catch-all 세그먼트
[[...slug]]/         # 옵셔널 Catch-all
```

---

## � 패키지 매니저

### Yarn 사용 필수

이 프로젝트는 **Yarn**을 표준 패키지 매니저로 사용합니다.

```bash
# ✅ 올바른 사용
yarn install
yarn add package-name
yarn remove package-name
yarn build
yarn dev

# ❌ 사용 금지 (특별한 이유가 없는 한)
npm install
npm install package-name
npm uninstall package-name
npm run build
```

**Yarn을 사용하는 이유:**
- 일관된 의존성 버전 관리 (`yarn.lock`)
- 더 빠른 설치 속도
- 워크스페이스 지원 (모노레포 대비)
- 프로젝트 전체의 통일성 유지

**예외 상황:**
- 특정 라이브러리가 npm 전용 스크립트를 요구하는 경우
- CI/CD 파이프라인의 특별한 제약이 있는 경우

이러한 경우에도 팀과 논의 후 문서화하여 사용하세요.

---

## �💻 TypeScript 코딩 스타일

### 기본 원칙

- **Strict 모드**: `tsconfig.json`에서 `"strict": true` 사용
- **명시적 타입**: `any` 사용 금지, 타입 추론 활용
- **함수형 프로그래밍**: 가능한 순수 함수 작성
- **불변성**: 객체/배열 직접 수정 금지

### 변수 및 함수 네이밍

```typescript
// ✅ 좋은 예
const userName = 'John';                    // camelCase
const MAX_RETRY_COUNT = 3;                  // 상수는 UPPER_SNAKE_CASE
function fetchUserData() { }                // camelCase
const handleClick = () => { };              // 이벤트 핸들러는 handle* 접두사

// ❌ 나쁜 예
const UserName = 'John';                    // PascalCase는 클래스/컴포넌트용
const max_retry_count = 3;                  // snake_case 금지
function FetchUserData() { }                // 함수는 camelCase
```

### 타입 및 인터페이스

```typescript
// ✅ 타입 정의
type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string }>;
};

// ✅ 인터페이스 정의
interface User {
  id: string;
  name: string;
  email?: string;  // 옵셔널 속성
}

// 타입 vs 인터페이스 선택 가이드
// - Union/Intersection 타입: type 사용
// - 확장 가능한 객체: interface 사용
// - 프로젝트 내 일관성 유지

// ✅ Union 타입
type Status = 'idle' | 'loading' | 'success' | 'error';

// ✅ 제네릭
function identity<T>(value: T): T {
  return value;
}
```

### Import 순서

```typescript
// 1. React 및 Next.js
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

// 2. 외부 라이브러리
import { DocsPage, DocsBody } from 'fumadocs-ui/page';

// 3. 내부 모듈 (절대 경로)
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

// 4. 타입 임포트 (별도 그룹화 가능)
import type { PageProps } from '@/types';

// 5. 스타일 (가장 마지막)
import './styles.css';
```

### 코드 포매팅

```typescript
// ✅ 화살표 함수 (단일 표현식)
const add = (a: number, b: number) => a + b;

// ✅ 화살표 함수 (블록)
const processData = (data: string[]) => {
  const filtered = data.filter(Boolean);
  return filtered.map(item => item.trim());
};

// ✅ async/await (try-catch 사용)
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

// ✅ 객체 및 배열 구조 분해
const { title, description } = page.data;
const [first, ...rest] = items;

// ✅ 옵셔널 체이닝 및 Nullish 병합
const userName = user?.profile?.name ?? 'Anonymous';
```

---

## ⚛️ React 컴포넌트 패턴

### Server Components (기본)

```tsx
// app/docs/[[...slug]]/page.tsx
// ✅ Server Component (async 가능)
export default async function Page(props: PageProps) {
  const params = await props.params;  // Next.js 15+ async params
  const page = source.getPage(params.slug);
  
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
```

### Client Components

```tsx
// components/SearchDialog.tsx
'use client';  // ✅ 최상단에 명시

import { useState } from 'react';

export function SearchDialog() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // 클라이언트 전용 로직
    console.log('Searching for:', query);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

### Props 타입 정의

```tsx
// ✅ 명시적 Props 타입
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ✅ Next.js 페이지 Props (헬퍼 타입 사용)
type PageProps<T extends string = '/'> = {
  params: Promise<Record<string, string | string[]>>;
  searchParams: Promise<Record<string, string>>;
};

// 또는 Fumadocs 타입 활용
import type { InferPageType } from 'fumadocs-core/source';

type PageData = InferPageType<typeof source>;
```

### 컴포넌트 구조 순서

```tsx
// 1. Imports
import { ... } from '...';

// 2. Types
type MyComponentProps = { ... };

// 3. 컴포넌트
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 3-1. Hooks
  const [state, setState] = useState();
  
  // 3-2. 계산된 값
  const computedValue = useMemo(() => ..., []);
  
  // 3-3. 이벤트 핸들러
  const handleClick = () => { ... };
  
  // 3-4. Effects
  useEffect(() => { ... }, []);
  
  // 3-5. JSX 반환
  return <div>...</div>;
}

// 4. 하위 컴포넌트 (동일 파일 내)
function SubComponent() { ... }

// 5. Exports
export { SubComponent };
```

---

## 🎨 스타일링 규칙

### Tailwind CSS 사용

```tsx
// ✅ Tailwind 클래스 순서 (권장)
<div className="
  flex items-center justify-between  // Layout
  w-full max-w-4xl                   // Sizing
  p-4 space-x-2                      // Spacing
  bg-white border border-gray-200    // Background & Border
  rounded-lg shadow-md               // Effects
  hover:shadow-lg                    // States
  dark:bg-gray-800                   // Dark mode
">
  ...
</div>

// ✅ 조건부 클래스
import { cn } from '@/lib/utils';  // 유틸리티 함수 (필요 시 추가)

<button className={cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
  Click
</button>
```

### 글로벌 스타일

```css
/* app/global.css */

/* 1. Tailwind 지시어 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 2. 커스텀 CSS 변수 */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
  }
}

/* 3. 커스텀 컴포넌트 클래스 */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }
}
```

---

## 📝 MDX 작성 규칙

### Frontmatter 필수 필드

```mdx
---
title: 페이지 제목 (필수)
description: 페이지 설명 (필수, SEO 최적화)
---

# {title과 동일한 제목}

본문 내용...
```

### 코드 블록

````mdx
```typescript
// ✅ 언어 지정 필수
const greeting = 'Hello, World!';
```

```bash
# ✅ 주석으로 설명 추가
yarn install
```
````

### 컴포넌트 사용

```mdx
import { Card, Cards } from 'fumadocs-ui/components/card';

## 섹션 제목

<Cards>
  <Card title="제목" description="설명" href="/link" />
</Cards>
```

---

## 🗄️ 파일 구조 패턴

### 기능별 그룹화

```
lib/
├── source.ts          # Fumadocs 소스 로더
├── layout.shared.tsx  # 공유 레이아웃 옵션
└── utils/             # 유틸리티 함수 (필요 시 추가)
    ├── cn.ts          # 클래스명 병합
    └── date.ts        # 날짜 포매팅
```

### 컴포넌트 폴더 구조 (확장 시)

```
components/
├── ui/                # 재사용 UI 컴포넌트
│   ├── Button.tsx
│   └── Input.tsx
├── layout/            # 레이아웃 컴포넌트
│   ├── Header.tsx
│   └── Footer.tsx
└── features/          # 기능별 컴포넌트
    └── search/
        ├── SearchDialog.tsx
        └── SearchResults.tsx
```

---

## 🚫 금지 사항

### 절대 하지 말아야 할 것

```typescript
// ❌ any 타입 사용
const data: any = fetchData();

// ✅ 대신 unknown 또는 구체적 타입 사용
const data: unknown = fetchData();
// 또는
type ApiResponse = { ... };
const data: ApiResponse = fetchData();

// ❌ console.log 프로덕션 코드에 남기기
console.log('Debug:', data);

// ✅ 개발 환경에서만 로깅
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data);
}

// ❌ 미사용 import
import { useState, useEffect, useMemo } from 'react';  // useMemo 미사용

// ✅ 필요한 것만 import
import { useState, useEffect } from 'react';

// ❌ 매직 넘버/스트링
if (status === 'active') { ... }

// ✅ 상수 정의
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

if (status === STATUS.ACTIVE) { ... }
```

### 보안 관련 금지

```typescript
// ❌ 절대 커밋하지 말 것
const API_KEY = 'sk-1234567890abcdef';
const PASSWORD = 'mypassword123';

// ✅ 환경 변수 사용
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// ❌ 민감 정보 클라이언트 노출
'use client';
const secret = process.env.SECRET_KEY;  // 클라이언트에 노출됨!

// ✅ Server Component에서만 사용
// (Server Component는 'use client' 없음)
const secret = process.env.SECRET_KEY;
```

---

## ✅ 베스트 프랙티스

### 에러 처리

```typescript
// ✅ API 호출 에러 처리
async function fetchPage(slug: string[]) {
  try {
    const page = source.getPage(slug);
    if (!page) {
      notFound();  // Next.js 404 페이지로 리다이렉트
    }
    return page;
  } catch (error) {
    console.error('Failed to fetch page:', error);
    throw new Error('페이지를 불러올 수 없습니다');
  }
}

// ✅ 옵셔널 체이닝으로 안전한 접근
const title = page?.data?.title ?? '제목 없음';
```

### 성능 최적화

```tsx
// ✅ Server Component 우선 사용 (클라이언트 번들 감소)
// app/page.tsx
export default async function Page() {
  const data = await fetchData();  // 서버에서 실행
  return <div>{data}</div>;
}

// ✅ 동적 import (코드 스플리팅)
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});

// ✅ 메모이제이션
import { cache } from 'react';

const getUser = cache(async (id: string) => {
  return await db.user.findUnique({ where: { id } });
});
```

### 타입 안전성

```typescript
// ✅ Zod로 런타임 검증 (필요 시)
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0),
});

type User = z.infer<typeof userSchema>;

// 런타임 검증
const user = userSchema.parse(data);

// ✅ 타입 가드
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

if (isString(data)) {
  // 여기서 data는 string 타입
  console.log(data.toUpperCase());
}
```

---

## 🧪 코드 리뷰 체크리스트

PR 제출 전 자가 점검:

- [ ] TypeScript 컴파일 에러 없음 (`yarn tsc --noEmit`)
- [ ] ESLint 경고/에러 없음 (`yarn lint`)
- [ ] 모든 import가 사용됨
- [ ] `console.log` 제거됨 (디버깅용)
- [ ] 타입에 `any` 사용 안 함
- [ ] 컴포넌트/함수명이 명확함
- [ ] 복잡한 로직에 주석 추가
- [ ] 파일명이 컨벤션 준수
- [ ] MDX frontmatter에 title, description 포함
- [ ] 빌드 성공 확인 (`yarn build`)

---

## 📚 참고 자료

- [TypeScript 스타일 가이드](https://google.github.io/styleguide/tsguide.html)
- [Airbnb React 스타일 가이드](https://github.com/airbnb/javascript/tree/master/react)
- [Next.js 코딩 컨벤션](https://nextjs.org/docs/app/building-your-application/optimizing)

---

**마지막 업데이트**: 2025-10-31  
**문서 작성자**: AI Agent (Initial Setup)
