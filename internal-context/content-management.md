# 콘텐츠 관리 (Content Management)

## 📝 개요

erdia-docs는 **MDX(Markdown + JSX)** 기반으로 문서 콘텐츠를 관리합니다.  
Fumadocs는 파일 시스템 기반으로 자동으로 페이지를 생성하며, `meta.json`으로 사이드바 네비게이션을 제어합니다.

---

## 📂 콘텐츠 디렉토리 구조

### 기본 구조

```
content/
└── docs/
    ├── index.mdx              # /docs 메인 페이지
    ├── getting-started.mdx    # /docs/getting-started
    ├── features.mdx           # /docs/features
    ├── faq.mdx               # /docs/faq
    ├── meta.json             # 루트 사이드바 구조
    │
    ├── guides/               # /docs/guides/*
    │   ├── index.mdx         # /docs/guides
    │   ├── ai-chat.mdx       # /docs/guides/ai-chat
    │   ├── canvas.mdx        # /docs/guides/canvas
    │   ├── export.mdx        # /docs/guides/export
    │   └── meta.json         # 가이드 섹션 구조
    │
    ├── tips/                 # /docs/tips/*
    │   └── tips/
    │       ├── ai-shopping-mall-tutorial.mdx
    │       ├── erd-best-practices.mdx
    │       └── meta.json
    │
    └── updates/              # /docs/updates/*
        └── updates/
            ├── update-v1-2-0.mdx
            └── meta.json
```

### 디렉토리 → URL 매핑

| 파일 경로 | URL |
|----------|-----|
| `content/docs/index.mdx` | `/docs` |
| `content/docs/getting-started.mdx` | `/docs/getting-started` |
| `content/docs/guides/index.mdx` | `/docs/guides` |
| `content/docs/guides/ai-chat.mdx` | `/docs/guides/ai-chat` |
| `content/docs/tips/tips/erd-best-practices.mdx` | `/docs/tips/tips/erd-best-practices` |

---

## 📄 MDX 파일 작성 규칙

### 기본 템플릿

```mdx
---
title: 페이지 제목
description: 페이지 설명 (SEO 및 메타데이터)
---

# {title과 동일}

페이지 본문을 여기에 작성합니다.

## 섹션 제목

- 리스트 아이템
- 또 다른 아이템

```typescript
// 코드 예시
const example = 'Hello, World!';
```

## 다음 섹션

본문 계속...
```

### Frontmatter 필수 필드

| 필드 | 필수 여부 | 설명 | 예시 |
|-----|----------|------|------|
| `title` | ✅ 필수 | 페이지 제목 (SEO, 브라우저 탭) | `"시작하기"` |
| `description` | ✅ 필수 | 페이지 설명 (SEO, OG 태그) | `"Erdia 사용법 안내"` |

### Frontmatter 옵셔널 필드

```yaml
---
title: 고급 기능
description: 고급 사용자를 위한 팁
icon: Zap              # Lucide 아이콘 이름 (사이드바용)
full: true             # 전체 너비 레이아웃 (TOC 숨김)
---
```

**사용 가능한 필드 (Fumadocs 기본)**:
- `icon`: Lucide 아이콘 (예: `Home`, `Book`, `Zap`)
- `full`: 전체 너비 모드 (`true`/`false`)
- 기타 커스텀 필드는 `source.config.ts`에서 스키마 확장 가능

---

## 🗂️ meta.json 구조

### 역할
`meta.json`은 사이드바 네비게이션의 **순서와 구조**를 정의합니다.

### 기본 구조

```json
{
  "title": "섹션 제목",
  "pages": [
    "page-1",
    "page-2",
    "subfolder"
  ]
}
```

### 실제 예시 (content/docs/meta.json)

```json
{
  "title": "문서",
  "pages": [
    "index",
    "getting-started",
    "features",
    "---가이드---",     // 구분선 (텍스트 레이블)
    "guides",
    "---업데이트---",
    "updates",
    "---팁---",
    "tips",
    "---참고---",
    "pricing",
    "faq",
    "glossary"
  ]
}
```

### 고급 설정

```json
{
  "title": "가이드",
  "pages": [
    "index",
    {
      "type": "page",
      "title": "AI 채팅",        // 제목 오버라이드
      "url": "/docs/guides/ai-chat",
      "icon": "MessageSquare"   // 아이콘 추가
    },
    {
      "type": "separator",      // 구분선
      "title": "고급 가이드"
    },
    "advanced-guide",
    {
      "type": "folder",         // 중첩 폴더
      "title": "고급",
      "pages": ["topic-1", "topic-2"]
    }
  ]
}
```

### 구분선 단축 표기

```json
{
  "pages": [
    "page-1",
    "---구분선 레이블---",  // 자동으로 separator로 변환
    "page-2"
  ]
}
```

---

## 🧩 MDX에서 컴포넌트 사용

### Fumadocs 기본 컴포넌트

#### Card 컴포넌트

```mdx
import { Card, Cards } from 'fumadocs-ui/components/card';

<Cards>
  <Card 
    title="제목" 
    description="설명" 
    href="/docs/link" 
    icon="Zap"
  />
  <Card 
    title="다른 카드" 
    description="또 다른 설명" 
    href="/docs/another" 
  />
</Cards>
```

**렌더링 결과**: 그리드 레이아웃의 클릭 가능한 카드

#### Callout (정보 상자)

```mdx
import { Callout } from 'fumadocs-ui/components/callout';

<Callout type="info">
  유용한 정보를 여기에 작성합니다.
</Callout>

<Callout type="warning">
  주의해야 할 사항입니다.
</Callout>

<Callout type="error">
  오류 메시지나 경고입니다.
</Callout>
```

**타입**: `info`, `warning`, `error`, `tip`

#### Tabs

```mdx
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

<Tabs items={['npm', 'yarn', 'pnpm']}>
  <Tab value="npm">
    ```bash
    npm install package-name
    ```
  </Tab>
  <Tab value="yarn">
    ```bash
    yarn add package-name
    ```
  </Tab>
  <Tab value="pnpm">
    ```bash
    pnpm add package-name
    ```
  </Tab>
</Tabs>
```

#### Accordion

```mdx
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

<Accordions>
  <Accordion title="질문 1">
    답변 내용...
  </Accordion>
  <Accordion title="질문 2">
    또 다른 답변...
  </Accordion>
</Accordions>
```

### 커스텀 컴포넌트 추가

```tsx
// mdx-components.tsx
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

// 커스텀 컴포넌트 정의
function CustomAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500">
      ⚠️ {children}
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    CustomAlert,  // MDX에서 <CustomAlert> 사용 가능
    ...components,
  };
}
```

**MDX에서 사용**:
```mdx
<CustomAlert>
  이것은 커스텀 경고 메시지입니다!
</CustomAlert>
```

---

## 🎨 마크다운 확장 문법

### 코드 블록

````mdx
```typescript title="example.ts" {3-5}
// 파일명과 하이라이트 라인 지정
const greeting = 'Hello';

function greet() {
  console.log(greeting);  // 이 부분이 하이라이트됨
}
```
````

**지원 속성**:
- `title="파일명"`: 코드 블록 상단에 파일명 표시
- `{3-5}`: 3~5번 라인 하이라이트
- `showLineNumbers`: 라인 번호 표시

### 링크

```mdx
[내부 링크](/docs/getting-started)
[외부 링크](https://example.com)
[이메일](mailto:hello@erdia.app)
```

**상대 경로 링크**:
```mdx
[같은 폴더](./another-page)
[상위 폴더](../overview)
```

### 이미지

```mdx
![대체 텍스트](/images/screenshot.png)

![큰 이미지](https://example.com/image.png "이미지 제목")
```

**정적 이미지 위치**: `/public/images/`

### 테이블

```mdx
| 기능 | 설명 | 지원 여부 |
|------|------|----------|
| AI 채팅 | 자연어로 ERD 생성 | ✅ |
| 캔버스 | 드래그 앤 드롭 편집 | ✅ |
| 내보내기 | SQL 스크립트 생성 | ✅ |
```

### 인용구

```mdx
> Erdia는 데이터베이스 설계를 혁신합니다.
>
> — Erdia 팀
```

---

## 🔍 검색 최적화

### 검색에 포함되는 내용
- Frontmatter `title`
- Frontmatter `description`
- 본문 텍스트 (헤딩, 문단)
- 코드 블록 내 주석

### 검색에서 제외하려면
```mdx
---
title: 내부 문서
searchable: false  # 커스텀 필드 (스키마 확장 필요)
---
```

**참고**: 기본적으로 모든 페이지가 검색 인덱싱됨

---

## 📐 콘텐츠 조직 전략

### 계층 구조 설계

```
docs/
├── index.mdx              # 메인 랜딩 (개요, 빠른 시작 링크)
├── getting-started.mdx    # 첫 단계 가이드
├── features.mdx           # 기능 설명
│
├── guides/                # 사용 가이드 (기능별)
│   ├── index.mdx         # 가이드 목차
│   ├── ai-chat.mdx
│   ├── canvas.mdx
│   └── export.mdx
│
├── tips/                  # 팁 & 트릭
│   └── tips/
│       ├── best-practices.mdx
│       └── tutorials.mdx
│
├── updates/               # 업데이트 로그
│   └── updates/
│       └── v1-2-0.mdx
│
└── reference/             # 참고 자료
    ├── faq.mdx
    ├── glossary.mdx
    └── pricing.mdx
```

### 네이밍 규칙

| 콘텐츠 유형 | 파일명 패턴 | 예시 |
|------------|------------|------|
| 개념 설명 | 명사형 | `features.mdx` |
| 사용 가이드 | 동사-명사 | `export-sql.mdx` |
| 튜토리얼 | how-to-* | `how-to-create-erd.mdx` |
| 업데이트 노트 | update-v* | `update-v1-2-0.mdx` |
| FAQ | faq.mdx | `faq.mdx` |

---

## ✍️ 콘텐츠 작성 워크플로우

### 1. 새 페이지 추가

```bash
# 1. MDX 파일 생성
touch content/docs/guides/new-guide.mdx

# 2. 기본 구조 작성
cat > content/docs/guides/new-guide.mdx << 'EOF'
---
title: 새 가이드
description: 이 가이드는 X 기능을 설명합니다
---

# 새 가이드

본문 작성...
EOF

# 3. meta.json 업데이트
# content/docs/guides/meta.json에 "new-guide" 추가

# 4. 개발 서버에서 확인
yarn dev
```

### 2. 기존 페이지 수정

```bash
# 1. 파일 열기
code content/docs/guides/ai-chat.mdx

# 2. 내용 수정

# 3. 저장 → 자동 HMR로 브라우저 업데이트

# 4. 커밋 전 빌드 테스트
yarn build
```

### 3. 사이드바 재구성

```bash
# meta.json 편집
code content/docs/meta.json

# 순서 변경, 섹션 추가 등

# 변경사항 확인
yarn dev
```

---

## 🧪 콘텐츠 검증

### MDX 문법 검증

```bash
# MDX 파일 컴파일 테스트
npx @mdx-js/mdx content/docs/your-file.mdx
```

### 링크 체크

<!-- TODO: 링크 검증 도구 추가 시 업데이트 -->
```bash
# 깨진 링크 찾기 (수동 또는 도구 사용)
# 예: markdown-link-check
```

### 이미지 최적화

```bash
# 이미지 압축 (예: imagemin)
# public/images/ 내 파일 최적화
```

---

## 📊 콘텐츠 메트릭

### 추적 가능 항목

- 페이지 수: `find content/docs -name "*.mdx" | wc -l`
- 평균 페이지 길이
- 가장 많이 검색되는 키워드
- 사용자 피드백 (별도 시스템 필요)

---

## 🎯 콘텐츠 품질 가이드

### 작성 원칙

1. **명확성**: 간결하고 이해하기 쉽게
2. **구조화**: 헤딩 계층을 논리적으로 구성
3. **예시 제공**: 코드 블록과 스크린샷 활용
4. **최신성**: 제품 업데이트 시 문서도 함께 갱신
5. **접근성**: 이미지에 alt 텍스트, 명확한 링크 텍스트

### 체크리스트

- [ ] Frontmatter에 `title`, `description` 포함
- [ ] 첫 헤딩이 H1 (`#`)
- [ ] 코드 블록에 언어 지정
- [ ] 이미지에 alt 텍스트
- [ ] 외부 링크는 새 탭에서 열림 (자동)
- [ ] 오타 및 문법 검사
- [ ] 빌드 성공 확인

---

## 🔄 콘텐츠 마이그레이션

### 다른 플랫폼에서 이전

```bash
# Markdown → MDX 변환
# 1. 파일 확장자 변경 (.md → .mdx)
# 2. Frontmatter 형식 확인
# 3. 컴포넌트 임포트 추가 (필요 시)
```

**자동화 스크립트 예시**:
```bash
# 모든 .md 파일을 .mdx로 변경
find content/docs -name "*.md" -exec sh -c 'mv "$0" "${0%.md}.mdx"' {} \;
```

---

## 📚 참고 자료

- [MDX 문법 가이드](https://mdxjs.com/docs/what-is-mdx/)
- [Fumadocs 콘텐츠 설정](https://fumadocs.dev/docs/mdx/collections)
- [Lucide 아이콘 목록](https://lucide.dev/icons/)

---

**마지막 업데이트**: 2025-10-31  
**문서 작성자**: AI Agent (Initial Setup)
