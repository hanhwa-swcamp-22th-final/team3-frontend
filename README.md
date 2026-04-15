# S.E.T.O (Smart Equipment & Talent Orchestrator)

S.E.T.O는 등급 기반 직원 평가(S/A/B/C) 시스템을 갖춘 HR 및 AI 장비 유지보수 대시보드 프로젝트입니다.

## 🚀 프로젝트 개요
- **프레임워크:** Vue 3 (Composition API, `<script setup>` 문법 사용)
- **빌드 도구:** Vite 7.3.1
- **상태 관리:** Pinia 3.x
- **라우팅:** Vue Router 5.x (중첩 라우트 및 역할 기반 경로 구성)
- **HTTP 클라이언트:** Axios 1.x 및 Fetch API
- **차트:** Chart.js 4.x (애니메이션이 포함된 다양한 데이터 시각화)
- **Node.js 버전:** ^20.19.0 또는 >=22.12.0
- **패키지 매니저:** npm

## 👥 사용자 역할 및 주요 기능
5가지 사용자 역할에 따른 맞춤형 기능을 제공합니다.

### 1. Admin (관리자)
- 장비(Facility) CRUD 및 관리
- 역할별 권한 매트릭스 설정
- 알고리즘 파라미터 및 설정 관리
- 사용자 프로필 관리 및 등급 필터링

### 2. HRM (인사 관리자)
- 인사 대시보드 (등급 분포, 트렌드, 지표 카드)
- 지식 승인 검토 (승인/반려/보류)
- KPI 리포트 (팀별 차트 및 요약)
- 평가 기준 설정 (정량/정성 가중치 설정)
- 승진 대상자 검토 및 비교

### 3. TL (팀 리더)
- 팀 대시보드 및 지표 관리
- 1차 평가 수행 (AI 어시스턴트 지원)
- SCM 주문 상태 및 장비 상태 모니터링
- 공지사항 및 알림 관리
- 지식 허브 및 승인 워크플로우 관리

### 4. DL (부서장)
- 부서/팀 현황 대시보드
- 팀 역량(Capability) 분석 및 레이더 차트 시각화
- 2차 평가 수행
- SCM 주문 개요 및 지식 허브 관리

### 5. Worker (작업자)
- **마이 프로필:** 등급 배지, 스킬 레이더, 마일스톤 타임라인
- **포인트 및 미션:** 포인트 요약, 히스토리, 등급 업그레이드 미션
- **평가 결과:** 정량/정성 점수 및 성장 피드백 확인
- **이의 신청:** 평가 이력 확인 및 카테고리별 이의 신청 폼
- **오늘의 할 일 (SCM):** 작업 카드, 진행률 관리, 시작/종료 모달
- **지식 허브 (KMS):** AI 추천 콘텐츠, 멘토링 매칭, 월간 랭킹
- **기술 갭 분석 (KMS):** AI 분석 리포트 및 맞춤형 학습 추천

## 🛠 시작하기

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
Vite 개발 서버를 실행합니다.
```bash
npm run dev
# 기본 접속 주소: http://localhost:5173
```

### 프로젝트 빌드 및 미리보기
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물 로컬 확인
npm run preview
```

## 📐 아키텍처 및 디자인 가이드
- **디자인 테마:** "Mint & Indigo" (Primary: `#2D1F6E`, Success/S-Tier: `#00BF95`)
- **디자인 토큰:** 모든 스타일링은 `src/assets/styles/variables.css`의 CSS 변수를 사용합니다.
- **컴포넌트 구조:** `src/components/{domain}/{role}/{feature}/` 형식으로 체계적으로 관리됩니다.
- **폰트:** Pretendard(기본 텍스트) 및 Inter(숫자 강조용)가 적용되어 있습니다.
- **애니메이션:** 차트 및 게이지 바에 CSS Transition 및 JS 기반 애니메이션 패턴이 적용되어 있습니다.

## 💻 권장 개발 환경
- **IDE:** VS Code + [Vue Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 확장 프로그램
- **브라우저 확장:** [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

---
이 프로젝트는 **S.E.T.O** 팀의 기술 스택과 아키텍처 가이드라인을 준수하여 개발되었습니다.
