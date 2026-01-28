````md
# allo

> Vite + React + TypeScript

---

## 🛠 기술 스택

- **Runtime**: Node.js v22.22
- **Package Manager**: pnpm
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Lint**: ESLint

---

## 🚀 설치 및 실행

### 1. Node.js 버전 확인

```bash
node -v
# v22.22 이상 권장
```
````

### 2. 패키지 설치

```bash
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

### 4. 빌드

```bash
pnpm build
```

### 5. 빌드 결과 미리보기

```bash
pnpm preview
```

---

## 📁 프로젝트 구조

```bash
allo/
├─ public/              # 정적 파일 (index.html, favicon 등)
├─ src/
│  ├─ assets/           # 이미지, 아이콘, 폰트 등
│  ├─ components/       # 재사용 컴포넌트
│  │  └─ ui/            # shadcn/ui 컴포넌트
│  │     └─ Button.tsx
│  ├─ layouts/          # 화면 별 레이아웃 구조
│  │     └─ MainLayout.tsx
│  ├─ pages/            # 라우팅 단위 페이지
│  │  └─ home/
│  │    └─ index.tsx
│  │    └─ conponents   # 특정 페이지에서 사용하는 컴포넌트 모음
│  ├─ hooks/            # 커스텀 훅
│  │  └─ useAuth.ts
│  ├─ utils/            # 유틸 함수
│  │  └─ formatDate.ts
│  ├─ types/            # TypeScript 타입 정의
│  │  └─ index.d.ts
│  ├─ styles/           # 전역 스타일 / CSS / SCSS
│  │  └─ global.css
│  ├─ App.tsx           # 최상위 컴포넌트
│  └─ main.tsx          # ReactDOM 렌더링 진입점
├─ .gitignore
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
├─ eslint.config.js
```

---

## 🎨 코드 스타일 & 컨벤션

- shadcn UI 컴포넌트는 `src/components/ui`에 위치
- 페이지 컴포넌트는 `src/pages`에 위치
- 비즈니스 로직은 `hooks`와 `utils`로 분리
- 커밋 메시지는 Conventional Commits 스타일 권장
  예: `feat: 로그인 페이지 추가`, `fix: 버튼 클릭 버그 수정`

---

## 🔐 환경 변수 (필요 시)

`.env` 파일을 프로젝트 루트에 생성하고 아래와 같이 설정합니다:

```env
VITE_API_BASE_URL=https://api.example.com
```

---

## 🌍 배포

- 배포 플랫폼: Vercel / Netlify / 기타
- 배포 URL: (추후 추가)

---
