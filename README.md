# 🚢 Shipyard Tycoon - 조선소 경영 시뮬레이션 게임

**Football Manager** 스타일의 깊이있는 조선소 경영 게임입니다. 영업, 재무, 생산을 통합 관리하며 세계 최고의 조선소를 건설하세요!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 주요 기능

### 🎯 핵심 게임플레이

- **영업 시스템**: 실제 선박 수주 프로세스 시뮬레이션
  - 입찰 경쟁 시스템
  - 고객사 관계 관리 (14개 글로벌 선사)
  - 계약 협상 및 체결

- **재무 관리**: 실시간 재무제표 시스템
  - 손익계산서 (Income Statement)
  - 재무상태표 (Balance Sheet)
  - 현금흐름표 (Cash Flow Statement)
  - 재무 비율 분석 (ROE, 부채비율, 유동비율 등)
  - 신용 건전성 평가

- **생산 시스템**: 도크 및 인력 관리
  - 다중 도크 운영 (소형/중형/대형/초대형)
  - 생산 진척도 관리
  - 인력 배치 및 숙련도 관리
  - 5가지 직종 (용접공, 조립공, 도장공, 전기공, 엔지니어)

### 📊 게임 요소

- **11종류의 선박**: 컨테이너선, 벌크선, 유조선, LNG선, 크루즈선 등
- **실시간 경영**: 시간 흐름에 따른 동적 게임 진행
- **경제 시뮬레이션**: 현실적인 원가 계산 및 수익성 분석
- **전략적 의사결정**: 자원 배분, 투자, 대출 관리

## 🛠️ 기술 스택

### Frontend
- **React 18.3** + **TypeScript 5.7**
- **Vite** - 빠른 빌드 도구
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Zustand** - 경량 상태 관리
- **React Router** - 페이지 라우팅
- **Recharts** - 데이터 시각화
- **Lucide React** - 아이콘
- **date-fns** - 날짜 처리

### 게임 엔진
- 자체 개발 시뮬레이션 엔진
- 입찰 생성 시스템
- 재무 계산 엔진
- 생산 스케줄링

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

\`\`\`bash
# 레포지토리 클론
git clone https://github.com/josens83/shipbuildinggame.git
cd shipbuildinggame

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
\`\`\`

개발 서버가 실행되면 브라우저에서 \`http://localhost:5173\`으로 접속하세요.

### 빌드

\`\`\`bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
\`\`\`

### 📱 모바일 앱 빌드

이 게임은 **Capacitor**를 사용하여 iOS와 Android 네이티브 앱으로 빌드할 수 있습니다.

\`\`\`bash
# 모바일 빌드 및 동기화
npm run build:mobile

# Android Studio 열기
npm run android

# Xcode 열기 (macOS만 가능)
npm run ios
\`\`\`

**요구사항:**
- Android: Android Studio 설치 필요
- iOS: macOS + Xcode 설치 필요

**빌드 후:**
1. Android Studio 또는 Xcode에서 프로젝트 열기
2. 에뮬레이터 또는 실제 기기에서 실행
3. 앱 스토어 배포를 위한 서명 및 빌드

## 🎮 게임 플레이 가이드

### 1. 게임 시작
- 회사 이름을 입력하고 게임을 시작합니다
- 초기 자금: \$50,000,000
- 초기 도크: 2개 (중형 1개, 소형 1개)
- 초기 인력: 330명

### 2. 영업 (Sales)
1. **입찰 기회 확인**: 다양한 선박 발주 입찰 확인
2. **입찰 제출**: 경쟁력 있는 가격으로 입찰
3. **계약 체결**: 협상을 통해 최종 계약
4. **계약 관리**: 진행 중인 계약 모니터링

### 3. 재무 (Finance)
- **재무제표 분석**: 회사의 재무 상태 실시간 확인
- **대출 관리**: 필요시 대출 (신용한도: \$100M)
- **현금 흐름 관리**: 수입과 지출 균형 유지
- **재무 비율 모니터링**: 건전성 지표 확인

### 4. 생산 (Production)
- **도크 배정**: 체결된 계약을 도크에 할당
- **생산 모니터링**: 건조 진척도 확인
- **인력 관리**: 필요에 따라 인력 채용/해고
- **도크 확장**: 신규 도크 건설 (성장 전략)

## 📁 프로젝트 구조

\`\`\`
src/
├── components/          # UI 컴포넌트
│   ├── layout/         # 레이아웃 (헤더, 사이드바)
│   ├── sales/          # 영업 관련 컴포넌트
│   ├── finance/        # 재무 관련 컴포넌트
│   ├── production/     # 생산 관련 컴포넌트
│   ├── Dashboard.tsx   # 메인 대시보드
│   └── StartScreen.tsx # 시작 화면
├── store/              # Zustand 상태 관리
│   └── gameStore.ts    # 게임 상태 스토어
├── types/              # TypeScript 타입 정의
│   └── index.ts        # 게임 타입들
├── utils/              # 유틸리티 함수
├── engine/             # 게임 엔진 로직
│   ├── bidGenerator.ts      # 입찰 생성
│   └── financeCalculator.ts # 재무 계산
├── data/               # 게임 데이터
│   ├── ships.ts        # 선박 스펙
│   └── customers.ts    # 고객사 데이터
├── App.tsx             # 메인 앱
└── main.tsx            # 엔트리 포인트
\`\`\`

## 🎯 개발 로드맵

### ✅ Phase 1: 핵심 게임플레이 (완료)
- [x] 입찰 자동 생성 시스템
- [x] 시간 자동 진행 (1x/2x/3x 속도)
- [x] 로컬 저장/불러오기 (LocalStorage)
- [x] 자동 저장 (1분마다)
- [x] 게임 이벤트 시스템 기반
- [x] 월별 재무 업데이트
- [x] 주간 입찰 생성

### ✅ Phase 2: 모바일 지원 (완료)
- [x] Capacitor 통합 (iOS/Android 앱 변환)
- [x] 모바일 빌드 스크립트
- [ ] 반응형 UI 최적화
- [ ] 터치 인터페이스 개선

### Phase 3: 게임 확장 (진행 예정)
- [ ] 이벤트 시스템 완성 (시장, 재무, 생산)
- [ ] 랜덤 이벤트 발생 및 선택지
- [ ] 기술 연구 개발 시스템
- [ ] 경쟁사 AI
- [ ] 글로벌 시장 확장

### Phase 4: 고급 기능
- [x] 저장/불러오기
- [ ] 클라우드 저장 (Firebase)
- [ ] 난이도 설정
- [ ] 업적 시스템
- [ ] 통계 및 분석 대시보드
- [ ] 멀티플레이어 모드

### Phase 5: 수익화
- [ ] 프리미엄 DLC (새로운 선박 종류)
- [ ] 스킨/테마 팩
- [ ] 인앱 구매 시스템
- [ ] 광고 통합 (선택적)
- [ ] 크로스 플랫폼 동기화

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🤝 기여

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

## 🙏 감사의 말

- **Football Manager** - 게임 컨셉 영감
- 실제 조선업 프로세스를 참고하여 제작되었습니다

---

**즐거운 게임 되세요! 🚢⚓**
