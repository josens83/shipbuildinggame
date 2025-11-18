// 게임 핵심 타입 정의

export type ShipType =
  | 'CONTAINER'     // 컨테이너선
  | 'BULK_CARRIER'  // 벌크선
  | 'TANKER'        // 유조선
  | 'LNG_CARRIER'   // LNG선
  | 'LPG_CARRIER'   // LPG선
  | 'RORO'          // 자동차운반선
  | 'CRUISE'        // 크루즈선
  | 'NAVY'          // 군함
  | 'OFFSHORE';     // 해양플랜트

export type DockSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'MEGA';

export type ContractStatus =
  | 'BIDDING'       // 입찰 중
  | 'NEGOTIATING'   // 협상 중
  | 'SIGNED'        // 계약 체결
  | 'IN_PRODUCTION' // 생산 중
  | 'COMPLETED'     // 완료
  | 'DELIVERED'     // 인도
  | 'CANCELLED';    // 취소

export type ProductionPhase =
  | 'STEEL_CUTTING'    // 강재 절단
  | 'BLOCK_ASSEMBLY'   // 블록 조립
  | 'PRE_ERECTION'     // 사전 탑재
  | 'ERECTION'         // 탑재
  | 'OUTFITTING'       // 의장
  | 'PAINTING'         // 도장
  | 'SEA_TRIAL'        // 시운전
  | 'DELIVERY';        // 인도

export interface ShipSpecification {
  id: string;
  type: ShipType;
  name: string;
  length: number;        // 길이 (m)
  width: number;         // 폭 (m)
  deadweight: number;    // 재화중량톤 (DWT)
  capacity?: number;     // 용량 (TEU for containers, m³ for tankers)
  estimatedCost: number; // 예상 건조 비용 (백만 달러)
  estimatedDays: number; // 예상 건조 기간 (일)
  requiredDockSize: DockSize;
  complexity: number;    // 복잡도 (1-10)
}

export interface Customer {
  id: string;
  name: string;
  country: string;
  reputation: number;    // 0-100
  creditRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B';
  relationshipScore: number; // 0-100
  totalOrders: number;
  defaultRisk: number;   // 0-1 (부도 위험)
}

export interface Contract {
  id: string;
  customerId: string;
  shipSpec: ShipSpecification;
  status: ContractStatus;

  // 계약 조건
  contractPrice: number;      // 계약 금액 (백만 달러)
  downPayment: number;        // 계약금 (%)
  progressPayments: number[]; // 중도금 비율들
  finalPayment: number;       // 잔금 (%)

  // 일정
  contractDate?: Date;
  deliveryDate?: Date;
  penaltyPerDay: number;      // 지연 페널티 (일당)

  // 생산 관련
  assignedDockId?: string;
  currentPhase?: ProductionPhase;
  progress: number;           // 0-100

  // 재무
  totalCostIncurred: number;  // 실제 발생 비용
  profitMargin: number;       // 예상 이익률
}

export interface Dock {
  id: string;
  name: string;
  size: DockSize;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  currentContractId?: string;

  // 생산 능력
  maxLength: number;
  maxWidth: number;
  efficiency: number;         // 0-1 (생산 효율)

  // 유지보수
  maintenanceCost: number;    // 월 유지비 (백만 달러)
  lastMaintenance?: Date;
  condition: number;          // 0-100 (상태)
}

export interface WorkforcePool {
  welders: number;            // 용접공
  fitters: number;            // 조립공
  painters: number;           // 도장공
  electricians: number;       // 전기공
  engineers: number;          // 엔지니어

  // 효율성
  skillLevel: number;         // 0-100 평균 숙련도
  morale: number;             // 0-100 사기

  // 비용
  monthlyCost: number;        // 월 인건비 (백만 달러)
}

export interface FinancialStatement {
  // 손익계산서 (Income Statement)
  revenue: number;            // 매출
  costOfGoodsSold: number;    // 매출원가
  grossProfit: number;        // 매출총이익
  operatingExpenses: number;  // 영업비용
  operatingIncome: number;    // 영업이익
  interestExpense: number;    // 이자비용
  netIncome: number;          // 순이익

  // 재무상태표 (Balance Sheet)
  cash: number;               // 현금
  accountsReceivable: number; // 매출채권
  inventory: number;          // 재고자산
  fixedAssets: number;        // 고정자산
  totalAssets: number;        // 총자산

  accountsPayable: number;    // 매입채무
  shortTermDebt: number;      // 단기부채
  longTermDebt: number;       // 장기부채
  totalLiabilities: number;   // 총부채
  equity: number;             // 자본

  // 현금흐름표 (Cash Flow Statement)
  operatingCashFlow: number;  // 영업활동 현금흐름
  investingCashFlow: number;  // 투자활동 현금흐름
  financingCashFlow: number;  // 재무활동 현금흐름

  // 재무 비율
  debtToEquityRatio: number;  // 부채비율
  currentRatio: number;       // 유동비율
  returnOnEquity: number;     // ROE
}

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'EXPERT';

export interface GameState {
  // 메타 정보
  companyName: string;
  difficulty: Difficulty;
  currentDate: Date;
  gameSpeed: 1 | 2 | 3;       // 게임 속도

  // 재무
  financials: FinancialStatement;
  creditLine: number;         // 신용한도
  creditUsed: number;         // 사용 중인 신용

  // 자원
  docks: Dock[];
  workforce: WorkforcePool;

  // 영업
  contracts: Contract[];
  customers: Customer[];
  availableBids: Contract[];  // 현재 입찰 가능한 계약들

  // 통계
  totalShipsBuilt: number;
  totalRevenue: number;
  reputation: number;         // 0-100 회사 평판
  marketShare: number;        // 0-100 시장 점유율

  // 이벤트
  events: GameEvent[];        // 발생한 이벤트 기록
  activeEvent: GameEvent | null;  // 현재 표시 중인 이벤트

  // 연구 개발
  researchProjects: ResearchProject[];  // 진행 중/완료된 연구들
  activeResearchCount: number;          // 동시 진행 가능한 연구 수

  // 경쟁사
  competitors: Competitor[];            // 경쟁 조선소들

  // 업적
  achievements: AchievementProgress[];  // 업적 진행도
}

// 이벤트 타입
export interface GameEvent {
  id: string;
  type: 'CONTRACT' | 'FINANCE' | 'PRODUCTION' | 'MARKET' | 'RANDOM';
  title: string;
  description: string;
  date: Date;
  choices?: {
    text: string;
    effect: () => void;
  }[];
}

// 기술 연구 타입
export type ResearchCategory =
  | 'PRODUCTION'     // 생산 효율
  | 'QUALITY'        // 품질 관리
  | 'COST'           // 원가 절감
  | 'SPEED'          // 건조 속도
  | 'SAFETY'         // 안전 관리
  | 'AUTOMATION';    // 자동화

export type ResearchStatus =
  | 'AVAILABLE'      // 연구 가능
  | 'IN_PROGRESS'    // 연구 중
  | 'COMPLETED';     // 완료

export interface Research {
  id: string;
  name: string;
  category: ResearchCategory;
  description: string;

  // 연구 요구사항
  cost: number;              // 연구 비용 (백만 달러)
  duration: number;          // 연구 기간 (일)
  requiredReputation: number; // 필요 평판
  prerequisiteIds?: string[];  // 선행 연구 ID

  // 효과
  effects: {
    dockEfficiency?: number;     // 도크 효율 증가 (%)
    costReduction?: number;      // 원가 절감 (%)
    buildSpeedBonus?: number;    // 건조 속도 증가 (%)
    qualityBonus?: number;       // 품질 보너스 (%)
    workerSafety?: number;       // 안전도 증가 (%)
    reputationBonus?: number;    // 평판 보너스
  };
}

export interface ResearchProject {
  researchId: string;
  status: ResearchStatus;
  startDate?: Date;
  progress: number;            // 0-100
  completionDate?: Date;
}

// 경쟁사 타입
export interface Competitor {
  id: string;
  name: string;
  country: string;
  founded: number;             // 설립 연도

  // 역량
  reputation: number;          // 0-100 평판
  marketShare: number;         // 0-100 시장 점유율
  technology: number;          // 0-100 기술력
  financialStrength: number;   // 0-100 재무 건전성

  // 생산 능력
  totalDocks: number;
  activeContracts: number;
  shipsBuiltThisYear: number;

  // AI 특성
  aggressiveness: number;      // 0-1 공격성 (입찰 경쟁력)
  rndFocus: number;            // 0-1 연구 집중도
  expansionRate: number;       // 0-1 확장 속도

  // 전문 분야
  specialization: ShipType[];  // 주력 선종
}

// 업적 타입
export type AchievementCategory =
  | 'MILESTONE'    // 이정표
  | 'PRODUCTION'   // 생산
  | 'FINANCIAL'    // 재무
  | 'REPUTATION'   // 평판
  | 'RESEARCH'     // 연구
  | 'MARKET'       // 시장
  | 'SPECIAL';     // 특수

export type AchievementRarity =
  | 'COMMON'       // 일반
  | 'UNCOMMON'     // 희귀
  | 'RARE'         // 레어
  | 'EPIC'         // 에픽
  | 'LEGENDARY';   // 전설

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;

  // 달성 조건
  condition: (state: GameState) => boolean;

  // 보상 (선택적)
  reward?: {
    cash?: number;
    reputation?: number;
    message?: string;
  };

  // 숨김 여부 (달성 전까지 ???로 표시)
  hidden?: boolean;
}

export interface AchievementProgress {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: Date;
}
