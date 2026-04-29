# Meet Time Web — Project Rules

프로젝트 전용 규칙. 전역 `~/.claude/CLAUDE.md` 보다 우선 적용.

---

## Stack

- **Language**: TypeScript (strict)
- **Framework**: React 19 + Vite 6
- **Styling**: CSS Modules (`.module.css`)
- **Server state**: TanStack Query (React Query v5)
- **Runtime**: Node.js 22 (CI 기준)

---

## Folder Structure

```
src/
├── app/              # 앱 진입점, 전역 Provider, Router 설정
├── assets/           # 정적 에셋 (이미지, 폰트, 아이콘)
├── features/         # 도메인별 기능 모듈
│   └── {domain}/
│       ├── api/          # apiClient 래퍼 함수 (HTTP 요청만)
│       ├── components/   # 해당 도메인 전용 컴포넌트
│       ├── constants/    # 도메인 상수
│       ├── hooks/        # React Query 래퍼 훅
│       ├── pages/        # 라우트 단위 페이지 컴포넌트
│       ├── services/     # 비즈니스 로직
│       ├── types/        # 타입 정의
│       └── utils/        # 순수 유틸 함수
├── shared/           # 도메인 비종속 공통 코드
│   ├── api/          # apiClient (HTTP + 인증 + 에러 처리)
│   ├── components/   # 공통 UI 컴포넌트
│   ├── constants/    # 전역 상수 (에러 코드 등)
│   ├── hooks/        # 공통 훅
│   ├── lib/          # 서드파티 초기화 (queryClient 등)
│   ├── types/        # 공통 타입
│   └── utils/        # 공통 유틸
└── styles/           # 글로벌 스타일, 디자인 토큰
```

---

## Layer Architecture

각 feature 내부 의존 방향은 단방향으로 유지한다.

```
Page / Component
    ↓ useQuery / useMutation
Hook  (React Query 래퍼 — 캐시 키, 로딩/에러 상태 노출)
    ↓ service 호출
Service  (비즈니스 로직 — 데이터 가공, 유효성 검사)
    ↓ api 함수 호출
API  (apiClient 래퍼 — 엔드포인트별 요청 함수)
    ↓
apiClient  (shared/api — Axios 인스턴스, 인터셉터, 에러 처리)
    ↓
Backend REST API
```

### 계층별 책임 원칙

- **Page/Component**: UI 렌더링과 사용자 이벤트만 처리. 비즈니스 로직 금지.
- **Hook**: `useQuery` / `useMutation` 래핑, queryKey 정의, 로딩·에러 상태 반환.
- **Service**: 복수 API 조합, 데이터 변환, 도메인 유효성 검사. 순수 함수 지향.
- **API**: `apiClient.get/post/put/delete` 호출만. 로직 금지.
- **apiClient**: 인증 토큰 주입, 응답 인터셉터, 서버 에러 코드 파싱 담당.

---

## CSS 규칙

- 스타일은 반드시 **CSS Modules** (`.module.css`) 사용.
- `styled-components`, `emotion`, `tailwind` 등 다른 스타일 방식 금지.
- 디자인 토큰은 `src/styles/tokens.css` CSS 변수 사용.
- 전역 스타일은 `src/styles/global.css` 에서만 작성.
- 컴포넌트 스타일 파일명: `ComponentName.module.css`.

---

## Error Handling

- 서버 에러 코드는 사전에 약속된 코드 체계를 따른다.
- `apiClient` 응답 인터셉터에서 에러 코드를 파싱해 커스텀 에러로 변환.
- 공통 에러 코드 상수는 `shared/constants/errorCodes.ts` 에 정의.
- React Query의 `onError` / `throwOnError` 활용해 컴포넌트 계층에서 처리.
- UI에 에러 코드 원문 직접 노출 금지 — 사용자 친화적 메시지로 변환.

```ts
// 에러 코드 예시 (shared/constants/errorCodes.ts)
export const ERROR_CODES = {
  UNAUTHORIZED: 'AUTH_001',
  TOKEN_EXPIRED: 'AUTH_002',
  NOT_FOUND: 'COMMON_404',
} as const
```

---

## React Query 규칙

- `queryClient` 인스턴스는 `shared/lib/queryClient.ts` 에서 생성 및 export.
- queryKey는 배열 + 상수로 관리 (`['meetings', id]` 형태).
- 서버 상태는 React Query로만 관리. Zustand/Context에 서버 상태 중복 저장 금지.
- mutation 성공 후 관련 query 무효화 (`queryClient.invalidateQueries`) 책임은 Hook이 담당.

---

## Naming

- 컴포넌트 파일: `PascalCase.tsx`
- 훅 파일: `useCamelCase.ts`
- 서비스/API/유틸 파일: `camelCase.ts`
- CSS 모듈 파일: `PascalCase.module.css` (컴포넌트와 같은 이름)
- 타입 파일: `camelCase.types.ts` 또는 `types.ts`

---

## Hard Rules

- `any` 사용 금지.
- `console.log` 최종 코드에 남기지 않는다.
- 컴포넌트에서 직접 `apiClient` 호출 금지 — Hook → Service → API 경유.
- CSS 인라인 스타일 (`style={{}}`) 금지 (애니메이션 동적 값 예외).
- git commit, push, PR 생성 금지 (개발자가 직접 수행).
