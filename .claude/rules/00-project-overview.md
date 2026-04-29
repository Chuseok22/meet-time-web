# Project Overview

## Purpose

- 이 프로젝트의 목적: 미팅 시간 조율 웹 서비스
- 해결하려는 문제: 여러 참여자 간 가능한 미팅 시간 탐색 및 확정
- 주요 사용자 또는 시스템 소비자: 일반 웹 사용자

## Primary Stack

- Language: TypeScript (strict)
- Framework: React 19 + Vite 6
- Runtime: Node.js 22.12.0
- Database / storage: 서버 API (REST)
- Infra / deployment: Docker + Nginx, GitHub Actions CI/CD

## Important directories

- src/app/: 앱 진입점, 전역 Provider, Router
- src/assets/: 정적 에셋 (이미지, 아이콘, 폰트)
- src/features/: 도메인별 기능 모듈 (api / components / hooks / pages / services / types / utils / constants)
- src/shared/: 도메인 비종속 공통 코드 (apiClient, queryClient, 공통 컴포넌트 등)
- src/styles/: 글로벌 스타일, CSS 디자인 토큰

## Main commands

- install: `npm install`
- lint: `npm run lint`
- typecheck: `npx tsc -b --noEmit`
- build: `npm run build`
- unit-test: (미도입)
- integration-test: (미도입)
- e2e-test: (미도입)
- run-dev: `npm run dev`
- run-prod-like: `npm run preview`

## Project-specific constraints

- 반드시 지켜야 하는 제약:
  - 스타일은 CSS Modules만 사용 (`.module.css`)
  - API 요청은 TanStack Query (React Query v5) 경유
  - 컴포넌트 → Hook → Service → API → apiClient 계층 순서 준수
  - 에러는 서버 약속 에러 코드 사용
- 사용 금지 기술 / 패턴:
  - `any` 타입
  - styled-components, emotion, tailwind
  - 컴포넌트에서 apiClient 직접 호출
  - CSS 인라인 스타일 (동적 애니메이션 값 예외)
- 현재 프로젝트에서 중요하게 보는 품질 기준:
  - TypeScript strict 준수
  - 계층 의존 방향 단방향 유지

## Change policy

- 어떤 변경은 허용되고 어떤 변경은 금지되는지: 기능 추가, 버그 수정, 리팩터링 허용
- 지금 레포에서 수정해도 되는 범위: src/ 전체, 설정 파일
- 절대 건드리면 안 되는 영역: .env, .env.production (CI에서 생성)
