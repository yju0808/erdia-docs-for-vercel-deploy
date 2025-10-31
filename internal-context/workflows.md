# 개발 워크플로우 (Workflows)

## 🚀 시작하기

### 필수 요구사항

- **Node.js**: v18.x 이상 권장
- **패키지 매니저**: Yarn (프로젝트에서 사용 중)
- **에디터**: VS Code 권장 (TypeScript 지원)

### 초기 설정

```bash
# 1. 저장소 클론
git clone <repository-url>
cd erdia-docs

# 2. 의존성 설치
yarn install

# 3. 개발 서버 시작
yarn dev
```

개발 서버가 시작되면 http://localhost:3000 에서 확인 가능합니다.

---

## 📜 NPM Scripts

### 주요 명령어

| 명령어 | 설명 | 용도 |
|-------|------|------|
| `yarn dev` | 개발 서버 시작 | 로컬 개발 |
| `yarn build` | 프로덕션 빌드 | 배포 전 빌드 |
| `yarn start` | 빌드된 앱 실행 | 프로덕션 미리보기 |
| `yarn lint` | ESLint 실행 | 코드 품질 검사 |
| `yarn postinstall` | Fumadocs MDX 컴파일 | 의존성 설치 후 자동 실행 |

### 명령어 상세

#### `yarn dev`
```bash
yarn dev
# 또는
next dev
```

- Hot Module Replacement (HMR) 활성화
- `.mdx` 파일 변경 시 자동 리로드
- Turbopack 사용 가능 (Next.js 14+): `next dev --turbo`

**개발 중 확인사항**:
- 터미널에서 컴파일 에러 확인
- 브라우저 콘솔에서 런타임 에러 확인
- Fumadocs MDX 컴파일 로그 모니터링

#### `yarn build`
```bash
yarn build
# 또는
next build
```

**빌드 프로세스**:
1. TypeScript 타입 체크
2. MDX 파일 컴파일 (.source/ 생성)
3. 페이지 프리렌더링 (SSG)
4. 정적 에셋 최적화
5. `.next/` 디렉토리에 출력

**빌드 출력 예시**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    0 B            87.5 kB
├ ○ /docs                                1.23 kB        92.1 kB
├ ○ /docs/getting-started                2.45 kB        93.8 kB
└ ƒ /api/search                          0 B            87.5 kB

○  (Static)   SSG
ƒ  (Dynamic)  Server-rendered on demand
```

#### `yarn start`
```bash
yarn start
# 또는
next start
```

- **주의**: `yarn build` 후에만 실행 가능
- 프로덕션 환경 시뮬레이션
- 성능 테스트 및 최종 검증용

#### `yarn lint`
```bash
yarn lint
# 또는
eslint .
```

**체크 항목**:
- TypeScript 타입 에러
- React Hooks 규칙 위반
- Next.js 특정 규칙 (예: `<Image>` 사용)
- 미사용 변수/임포트

**자동 수정**:
```bash
yarn lint --fix
```

#### `yarn postinstall`
```bash
# 자동 실행됨 (package.json에 정의)
fumadocs-mdx
```

- `content/docs/` 스캔
- MDX → `.source/` 컴파일
- 검색 인덱스 생성 준비

---

## 🔄 개발 워크플로우

### 일반적인 작업 흐름

```
1. 브랜치 생성
   ↓
2. content/docs/ 에서 MDX 작성 또는 수정
   ↓
3. yarn dev로 실시간 확인
   ↓
4. 커밋 전 yarn lint 실행
   ↓
5. 로컬에서 yarn build 테스트
   ↓
6. 커밋 및 푸시
   ↓
7. PR 생성 및 리뷰
   ↓
8. 배포 (자동 CI/CD)
```

### 새 문서 페이지 추가

```bash
# 1. MDX 파일 생성
touch content/docs/new-feature.mdx

# 2. Frontmatter 작성
cat > content/docs/new-feature.mdx << 'EOF'
---
title: 새로운 기능
description: 이 기능은 이렇게 사용합니다
---

# 새로운 기능

내용 작성...
EOF

# 3. (옵션) meta.json 업데이트
# content/docs/meta.json에 "new-feature" 추가

# 4. 개발 서버에서 확인
yarn dev
# 브라우저: http://localhost:3000/docs/new-feature

# 5. 빌드 테스트
yarn build
```

### 사이드바 구조 변경

```bash
# content/docs/meta.json 편집
vim content/docs/meta.json

# 예시:
{
  "title": "문서",
  "pages": [
    "index",
    "getting-started",
    {
      "type": "separator",
      "title": "가이드"
    },
    "guides"
  ]
}

# 변경 사항 확인
yarn dev
```

---

## 🧪 테스트 및 검증

### 빌드 전 체크리스트

```bash
# 1. 타입 체크
yarn tsc --noEmit

# 2. Lint 검사
yarn lint

# 3. 프로덕션 빌드
yarn build

# 4. 빌드된 앱 실행
yarn start

# 5. 주요 페이지 수동 테스트
# - /docs
# - /docs/getting-started
# - /api/search?q=test
```

### 일반적인 에러와 해결법

#### 에러: `Module not found: Can't resolve '@/.source'`
**원인**: MDX 컴파일 미완료
**해결**:
```bash
yarn postinstall  # 또는
fumadocs-mdx
```

#### 에러: `Error: Cannot find module 'next/dist/...'`
**원인**: Next.js 버전 불일치 또는 손상된 node_modules
**해결**:
```bash
rm -rf node_modules .next
yarn install
```

#### 에러: MDX 파일 변경이 반영되지 않음
**원인**: 캐시 문제
**해결**:
```bash
rm -rf .next .source
yarn dev
```

#### 경고: `Image with src "/image.png" is missing required "alt" property`
**원인**: 접근성 문제
**해결**: MDX에서 이미지 사용 시 alt 속성 추가
```mdx
![ERD 예시](/erd-example.png)
```

---

## 🚢 배포 프로세스

### 배포 환경 설정

<!-- TODO: 실제 배포 환경으로 업데이트 -->

#### Vercel 배포 (권장)
```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 연결
vercel link

# 4. 배포
vercel --prod
```

#### 정적 내보내기 (Static Export)
```bash
# next.config.mjs에 추가:
# output: 'export'

yarn build
# 결과물: out/ 디렉토리
# 정적 호스팅 서비스에 배포 가능
```

### CI/CD 파이프라인

<!-- TODO: GitHub Actions 또는 다른 CI/CD 설정 시 업데이트 -->

**예상 워크플로우**:
```yaml
# .github/workflows/deploy.yml (예시)
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn build
      - run: yarn lint
      # 배포 단계...
```

---

## 🔍 디버깅 가이드

### Next.js 디버그 모드

```bash
# 상세한 빌드 로그
NODE_OPTIONS='--inspect' yarn dev

# 프로덕션 소스맵 활성화
# next.config.mjs:
# productionBrowserSourceMaps: true
```

### Fumadocs 디버깅

```typescript
// lib/source.ts에 로깅 추가
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// 모든 페이지 출력
console.log(source.getPages().map(p => p.url));
```

### MDX 컴파일 에러 추적

```bash
# fumadocs-mdx 직접 실행 (상세 로그)
DEBUG=fumadocs:* fumadocs-mdx

# 특정 MDX 파일 검증
npx @mdx-js/mdx content/docs/your-file.mdx
```

---

## 🛠️ 유지보수 작업

### 의존성 업데이트

```bash
# 최신 버전 확인
yarn outdated

# 안전 업데이트 (patch, minor)
yarn upgrade

# 메이저 업데이트 (주의 필요)
yarn upgrade-interactive --latest
```

**주의사항**:
- Next.js 메이저 업데이트 시 마이그레이션 가이드 확인
- Fumadocs 버전은 `fumadocs-core`, `fumadocs-ui`, `fumadocs-mdx` 동기화 필요

### 캐시 정리

```bash
# 모든 빌드 아티팩트 삭제
rm -rf .next .source

# 의존성 재설치
rm -rf node_modules yarn.lock
yarn install

# Yarn 캐시 정리
yarn cache clean
```

### 파일 시스템 확인

```bash
# 깨진 심볼릭 링크 찾기
find . -type l ! -exec test -e {} \; -print

# 큰 파일 찾기 (100MB 이상)
find . -type f -size +100M

# MDX 파일 통계
find content/docs -name "*.mdx" | wc -l
```

---

## 📊 성능 모니터링

### 빌드 성능 분석

```bash
# 빌드 시간 측정
time yarn build

# 번들 크기 분석 (next-bundle-analyzer 필요)
ANALYZE=true yarn build
```

### 런타임 성능 측정

- **Lighthouse**: Chrome DevTools → Lighthouse 탭
- **Web Vitals**: https://web.dev/vitals/

**체크 항목**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

---

## 🔐 보안 체크

```bash
# 의존성 취약점 검사
yarn audit

# 자동 수정 (가능한 경우)
yarn audit fix

# npm-check-updates로 안전 버전 확인
npx npm-check-updates
```

---

## 📝 Git 워크플로우

### 브랜치 전략

<!-- TODO: 실제 브랜치 전략으로 업데이트 -->

```
main          # 프로덕션 브랜치
  ↓
develop       # 개발 브랜치 (선택적)
  ↓
feature/*     # 기능 브랜치
docs/*        # 문서 업데이트 브랜치
hotfix/*      # 긴급 수정 브랜치
```

### 커밋 메시지 규칙

```bash
# 권장 형식
<type>: <subject>

# 예시:
docs: Add AI chat guide
fix: Correct typo in getting-started
feat: Add new FAQ section
chore: Update dependencies
```

---

## 🆘 문제 해결 체크리스트

문제 발생 시 순차적으로 확인:

- [ ] `yarn install` 재실행
- [ ] `.next/` 및 `.source/` 삭제 후 재빌드
- [ ] `node_modules/` 삭제 후 재설치
- [ ] Node.js 버전 확인 (v18+ 필요)
- [ ] 터미널 에러 로그 확인
- [ ] 브라우저 콘솔 에러 확인
- [ ] `next.config.mjs` 문법 에러 확인
- [ ] TypeScript 타입 에러 확인 (`yarn tsc --noEmit`)
- [ ] GitHub Issues에서 유사 문제 검색

---

## 📚 추가 리소스

- [Next.js Troubleshooting](https://nextjs.org/docs/messages)
- [Fumadocs GitHub Issues](https://github.com/fuma-nama/fumadocs/issues)
- [MDX 문법 가이드](https://mdxjs.com/docs/)

---

**마지막 업데이트**: 2025-10-31  
**문서 작성자**: AI Agent (Initial Setup)
