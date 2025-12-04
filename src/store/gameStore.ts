import { create } from 'zustand';
import type { GameState, Dock, FinancialStatement, ContractStatus, GameEvent, ResearchProject, Research, Competitor, Difficulty, TutorialProgress, GameSettings, GameEndState, GameEndReason, AnnualPlan, PlanScenario, AnnualTarget, AnnualActual, ShipType, CorporateBond, StockIssuance, BidResult } from '../types';
import { SCENARIO_PRESETS } from '../types';
import { INITIAL_CUSTOMERS } from '../data/customers';
import { INITIAL_COMPETITORS } from '../data/competitors';
import { BidGenerator } from '../engine/bidGenerator';
import { SaveManager } from '../utils/saveManager';
import { EventGenerator } from '../engine/eventGenerator';
import { AVAILABLE_RESEARCH, getResearchById } from '../data/research';
import { CompetitorAI } from '../engine/competitorAI';
import { getDifficultySettings } from '../utils/difficultySettings';
import { ALL_ACHIEVEMENTS, getAchievementById } from '../data/achievements';
import { TUTORIAL_STEPS } from '../data/tutorial';
import { useToastStore } from '../components/common/Toast';

interface GameActions {
  // 게임 제어
  startGame: (companyName: string, difficulty?: import('../types').Difficulty) => void;
  loadGame: () => boolean;
  loadFromSlot: (slotId: number) => boolean;
  saveGame: () => boolean;
  saveToSlot: (slotId: number) => boolean;
  pauseGame: () => void;
  advanceTime: (days: number) => void;
  setGameSpeed: (speed: 1 | 2 | 3) => void;

  // 영업
  generateBids: () => void;
  bidOnContract: (contractId: string, bidAmount: number, useBroker?: boolean, brokerCommission?: number) => void;
  signContract: (contractId: string) => void;
  cancelContract: (contractId: string) => void;

  // 생산
  assignContractToDock: (contractId: string, dockId: string) => void;
  updateProduction: () => void;

  // 재무
  takeLoan: (amount: number) => void;
  repayLoan: (amount: number) => void;
  updateFinancials: () => void;

  // 인력
  hireWorkers: (type: string, amount: number) => void;
  fireWorkers: (type: string, amount: number) => void;

  // 도크
  buildDock: (size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'MEGA') => void;
  upgradeDock: (dockId: string) => void;

  // 이벤트
  triggerEvent: (event: GameEvent) => void;
  closeEvent: () => void;
  handleEventChoice: (choiceIndex: number) => void;

  // 이벤트 효과 헬퍼
  increaseCash: (amount: number) => void;
  decreaseCash: (amount: number) => void;
  increaseReputation: (amount: number) => void;
  decreaseReputation: (amount: number) => void;
  increaseMarketShare: (amount: number) => void;
  increaseDockEfficiency: () => void;
  increaseMorale: () => void;
  decreaseMorale: () => void;

  // 연구 개발
  startResearch: (researchId: string) => boolean;
  updateResearch: () => void;
  getAvailableResearch: () => Research[];
  getCompletedResearch: () => string[];
  canStartResearch: (researchId: string) => { canStart: boolean; reason?: string };

  // 경쟁사
  updateCompetitors: () => void;
  getTopCompetitors: (limit?: number) => Competitor[];

  // 업적
  checkAchievements: () => void;
  getUnlockedAchievements: () => string[];
  getAchievementProgress: (achievementId: string) => import('../types').AchievementProgress | undefined;

  // 통계
  recordMonthlyStatistics: () => void;
  getStatisticsByPeriod: (months: number) => import('../types').MonthlyStatistics[];

  // 튜토리얼
  startTutorial: () => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
  getTutorialProgress: () => TutorialProgress;

  // 설정
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetSettings: () => void;
  getSettings: () => GameSettings;

  // 게임 종료
  checkGameEnd: () => void;
  resetGame: () => void;

  // 연간 사업계획
  annualPlans: AnnualPlan[];
  showAnnualPlanDialog: boolean;
  pendingPlanYear: number | null;
  createAnnualPlan: (year: number, scenario: PlanScenario, targets: Partial<AnnualTarget>) => void;
  updateAnnualPlan: (year: number, updates: Partial<AnnualPlan>) => void;
  getActivePlan: () => AnnualPlan | undefined;
  getPlanForYear: (year: number) => AnnualPlan | undefined;
  updatePlanActuals: () => void;
  openAnnualPlanDialog: (year: number) => void;
  closeAnnualPlanDialog: () => void;

  // 입찰 시스템
  processBidResults: () => void;
  checkBidExpirations: () => void;

  // 재무 확장 (회사채, 유상증자)
  issueCorporateBond: (principal: number, interestRate: number, years: number, frequency: 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL') => boolean;
  repayCorporateBond: (bondId: string) => boolean;
  issueStock: (shares: number, pricePerShare: number, type: 'RIGHTS_OFFERING' | 'PRIVATE_PLACEMENT') => boolean;
  processBondInterest: () => void;
  updateSharePrice: () => void;
}

const INITIAL_FINANCIALS: FinancialStatement = {
  revenue: 0,
  costOfGoodsSold: 0,
  grossProfit: 0,
  operatingExpenses: 0,
  operatingIncome: 0,
  interestExpense: 0,
  netIncome: 0,

  cash: 50_000_000, // 시작 자금: 5천만 달러
  accountsReceivable: 0,
  inventory: 0,
  fixedAssets: 100_000_000, // 초기 자산 (도크 등)
  totalAssets: 150_000_000,

  accountsPayable: 0,
  shortTermDebt: 0,
  longTermDebt: 50_000_000, // 초기 대출
  totalLiabilities: 50_000_000,
  equity: 100_000_000,

  operatingCashFlow: 0,
  investingCashFlow: 0,
  financingCashFlow: 0,

  debtToEquityRatio: 0.5,
  currentRatio: 1.0,
  returnOnEquity: 0,
};

const INITIAL_DOCKS: Dock[] = [
  {
    id: 'DOCK_1',
    name: 'Dock #1',
    size: 'MEDIUM',
    status: 'AVAILABLE',
    maxLength: 300,
    maxWidth: 50,
    efficiency: 0.8,
    maintenanceCost: 0.5, // 월 50만 달러
    condition: 80,
  },
  {
    id: 'DOCK_2',
    name: 'Dock #2',
    size: 'SMALL',
    status: 'AVAILABLE',
    maxLength: 200,
    maxWidth: 35,
    efficiency: 0.75,
    maintenanceCost: 0.3,
    condition: 85,
  },
];

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // 초기 상태
  companyName: '',
  difficulty: 'NORMAL' as Difficulty,
  currentDate: new Date(2025, 0, 1), // 2025년 1월 1일
  gameSpeed: 1,

  financials: INITIAL_FINANCIALS,
  creditLine: 100_000_000, // 신용한도 1억 달러
  creditUsed: 0,
  corporateBonds: [],
  stockIssuances: [],
  totalShares: 1_000_000, // 초기 발행 주식 수 (100만주)
  sharePrice: 100, // 초기 주가 $100

  docks: INITIAL_DOCKS,
  workforce: {
    welders: 100,
    fitters: 80,
    painters: 50,
    electricians: 60,
    engineers: 40,
    skillLevel: 70,
    morale: 75,
    monthlyCost: 2.5, // 월 250만 달러
  },

  contracts: [],
  customers: [...INITIAL_CUSTOMERS],
  availableBids: [],

  totalShipsBuilt: 0,
  totalRevenue: 0,
  reputation: 50,
  marketShare: 0,

  // 이벤트
  events: [],
  activeEvent: null,

  // 연구 개발
  researchProjects: [],
  activeResearchCount: 1, // 초기에는 1개만 동시 연구 가능

  // 경쟁사
  competitors: [...INITIAL_COMPETITORS],

  // 업적
  achievements: ALL_ACHIEVEMENTS.map(a => ({
    achievementId: a.id,
    unlocked: false,
  })),

  // 통계
  statistics: [],

  // 튜토리얼
  tutorial: {
    currentStep: 0,
    completed: false,
    skipped: false,
    completedSteps: [],
  } as TutorialProgress,
  showTutorial: false,

  // 설정
  settings: {
    autoSaveEnabled: true,
    autoSaveInterval: 60000, // 1분
    showEventNotifications: true,
    showAchievementNotifications: true,
    soundEnabled: false,
    musicVolume: 50,
    sfxVolume: 50,
  } as GameSettings,

  // 게임 종료
  gameEnd: {
    isEnded: false,
  } as GameEndState,

  // 연간 사업계획
  annualPlans: [] as AnnualPlan[],
  showAnnualPlanDialog: false,
  pendingPlanYear: null as number | null,

  // 액션들
  startGame: (companyName: string, difficulty: Difficulty = 'NORMAL') => {
    const settings = getDifficultySettings(difficulty);
    const state = get();

    // 난이도에 따른 초기 도크 설정
    const initialDocks: Dock[] = [];
    for (let i = 0; i < settings.initialDocks; i++) {
      initialDocks.push({
        id: `DOCK_${i + 1}`,
        name: `Dock #${i + 1}`,
        size: i === 0 ? 'MEDIUM' : 'SMALL',
        status: 'AVAILABLE',
        maxLength: i === 0 ? 300 : 200,
        maxWidth: i === 0 ? 50 : 30,
        efficiency: 0.8,
        maintenanceCost: i === 0 ? 1.0 : 0.5,
        condition: 100,
      });
    }

    // 난이도에 따른 재무 설정
    const totalAssets = settings.initialCash + 100_000_000; // 고정자산 1억
    set({
      companyName,
      difficulty,
      docks: initialDocks,
      reputation: settings.initialReputation,
      marketShare: settings.initialMarketShare,
      financials: {
        ...state.financials,
        cash: settings.initialCash,
        totalAssets,
        longTermDebt: settings.initialDebt,
        totalLiabilities: settings.initialDebt,
        equity: settings.initialEquity,
        debtToEquityRatio: settings.initialDebt / settings.initialEquity,
      },
    });

    // 게임 시작 시 초기 입찰 생성
    get().generateBids();
    // 자동 저장 시작 (1분마다)
    SaveManager.enableAutoSave(() => get(), 60000);
    // 초기 업적 체크 (난이도 업적 등)
    get().checkAchievements();
    // 새 게임 시작 시 튜토리얼 시작 (이전에 완료하거나 건너뛰지 않은 경우)
    const tutorialState = get().tutorial;
    if (!tutorialState.completed && !tutorialState.skipped) {
      get().startTutorial();
    }
  },

  loadGame: () => {
    const savedData = SaveManager.loadGame();
    if (savedData) {
      set(savedData as Partial<GameState & GameActions>);
      // 자동 저장 재시작
      SaveManager.enableAutoSave(() => get(), 60000);
      return true;
    }
    return false;
  },

  loadFromSlot: (slotId: number) => {
    const savedData = SaveManager.loadFromSlot(slotId);
    if (savedData) {
      set(savedData as Partial<GameState & GameActions>);
      // 자동 저장 재시작
      SaveManager.enableAutoSave(() => get(), 60000);
      return true;
    }
    return false;
  },

  saveGame: () => {
    return SaveManager.saveGame(get());
  },

  saveToSlot: (slotId: number) => {
    return SaveManager.saveToSlot(get(), slotId);
  },

  pauseGame: () => {
    set({ gameSpeed: 1 });
  },

  setGameSpeed: (speed: 1 | 2 | 3) => {
    set({ gameSpeed: speed });
  },

  generateBids: () => {
    const state = get();
    const newBids = BidGenerator.generateBids(state.customers, state.currentDate, 3);
    set({ availableBids: [...state.availableBids, ...newBids] });
  },

  advanceTime: (days: number) => {
    const state = get();
    const oldDate = new Date(state.currentDate);
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() + days);

    set({ currentDate: newDate });

    // 시간이 지나면 자동으로 업데이트
    get().updateProduction();
    get().updateResearch(); // 연구 진행도 업데이트

    // 입찰 관련 처리
    get().checkBidExpirations(); // 만료된 입찰 처리
    get().processBidResults();   // 대기 중인 입찰 결과 처리

    // 월이 바뀌면 재무 및 경쟁사 업데이트
    if (oldDate.getMonth() !== newDate.getMonth()) {
      get().updateFinancials();
      get().updateCompetitors();
      get().recordMonthlyStatistics();
      get().updatePlanActuals(); // 연간 계획 실적 업데이트
      get().processBondInterest(); // 회사채 이자 처리
      get().updateSharePrice();    // 주가 업데이트
    }

    // 연도가 바뀌면 새로운 사업계획 다이얼로그 표시
    if (oldDate.getFullYear() !== newDate.getFullYear()) {
      const newYear = newDate.getFullYear();
      const existingPlan = get().getPlanForYear(newYear);
      if (!existingPlan) {
        get().openAnnualPlanDialog(newYear);
      }
    }

    // 7일마다 새로운 입찰 생성 (입찰이 3개 미만일 때)
    const dayOfMonth = newDate.getDate();
    if (dayOfMonth % 7 === 0 && state.availableBids.length < 3) {
      get().generateBids();
    }

    // 랜덤 이벤트 발생 (활성 이벤트가 없을 때만)
    if (!state.activeEvent) {
      const randomEvent = EventGenerator.generateRandomEvent(newDate);
      if (randomEvent) {
        get().triggerEvent(randomEvent);
      }
    }

    // 업적 체크
    get().checkAchievements();

    // 게임 종료 조건 체크
    get().checkGameEnd();
  },

  bidOnContract: (contractId: string, bidAmount: number, useBroker: boolean = false, brokerCommission: number = 1.0) => {
    const state = get();
    const contract = state.availableBids.find(c => c.id === contractId);

    if (contract) {
      // 입찰 경쟁력 계산
      const competitiveness = BidGenerator.calculateBidCompetitiveness(
        contract,
        bidAmount,
        state.reputation,
        useBroker,
        brokerCommission
      );

      // 입찰 결과 결정
      const bidResultRaw = BidGenerator.determineBidResult(competitiveness);
      const bidResult: BidResult = bidResultRaw === 'DELAYED' ? 'PENDING' : bidResultRaw;

      // 브로커 비용 처리 (입찰 시 선불)
      let brokerCost = 0;
      if (useBroker) {
        brokerCost = bidAmount * (brokerCommission / 100);
      }

      // 계약 상태 결정
      let newStatus: ContractStatus = 'NEGOTIATING';
      if (bidResult === 'LOST') {
        newStatus = 'CANCELLED';
      }

      const updatedContract = {
        ...contract,
        contractPrice: bidAmount,
        bidAmount: bidAmount,
        status: newStatus,
        bidResult: bidResult,
        usedBroker: useBroker,
        brokerCommission: useBroker ? brokerCommission : undefined,
      };

      // 토스트 알림
      const { addToast } = useToastStore.getState();
      if (bidResult === 'WON') {
        addToast({
          type: 'success',
          title: '입찰 성공!',
          message: `${contract.shipSpec.name} 입찰에 성공했습니다. 계약 체결을 진행하세요.`,
          duration: 5000,
        });
      } else if (bidResult === 'LOST') {
        addToast({
          type: 'error',
          title: '입찰 실패',
          message: `${contract.shipSpec.name} 입찰에서 탈락했습니다.`,
          duration: 5000,
        });
      } else {
        addToast({
          type: 'info',
          title: '입찰 결과 대기 중',
          message: `${contract.shipSpec.name} 입찰 결과가 곧 발표됩니다.`,
          duration: 5000,
        });
      }

      set({
        availableBids: state.availableBids.filter(c => c.id !== contractId),
        contracts: bidResult !== 'LOST' ? [...state.contracts, updatedContract] : state.contracts,
        financials: {
          ...state.financials,
          cash: state.financials.cash - brokerCost, // 브로커 비용 차감
        },
      });
    }
  },

  signContract: (contractId: string) => {
    const state = get();
    const contract = state.contracts.find(c => c.id === contractId);

    if (contract && contract.status === 'NEGOTIATING') {
      const downPaymentAmount = contract.contractPrice * (contract.downPayment / 100);

      set({
        contracts: state.contracts.map(c =>
          c.id === contractId
            ? { ...c, status: 'SIGNED' as ContractStatus, contractDate: new Date(state.currentDate) }
            : c
        ),
        financials: {
          ...state.financials,
          cash: state.financials.cash + downPaymentAmount,
          accountsReceivable: state.financials.accountsReceivable + (contract.contractPrice - downPaymentAmount),
        },
      });
    }
  },

  cancelContract: (contractId: string) => {
    const state = get();
    set({
      contracts: state.contracts.filter(c => c.id !== contractId),
    });
  },

  assignContractToDock: (contractId: string, dockId: string) => {
    const state = get();
    const contract = state.contracts.find(c => c.id === contractId);
    const dock = state.docks.find(d => d.id === dockId);

    if (contract && dock && dock.status === 'AVAILABLE') {
      set({
        contracts: state.contracts.map(c =>
          c.id === contractId
            ? { ...c, assignedDockId: dockId, status: 'IN_PRODUCTION' as ContractStatus, currentPhase: 'STEEL_CUTTING' }
            : c
        ),
        docks: state.docks.map(d =>
          d.id === dockId
            ? { ...d, status: 'OCCUPIED', currentContractId: contractId }
            : d
        ),
      });
    }
  },

  updateProduction: () => {
    const state = get();

    state.contracts.forEach(contract => {
      if (contract.status === 'IN_PRODUCTION' && contract.assignedDockId) {
        const dock = state.docks.find(d => d.id === contract.assignedDockId);
        if (dock) {
          // 생산 진척도 계산 (단순화)
          const dailyProgress = (100 / contract.shipSpec.estimatedDays) * dock.efficiency;
          const newProgress = Math.min(100, contract.progress + dailyProgress);

          set({
            contracts: state.contracts.map(c =>
              c.id === contract.id
                ? { ...c, progress: newProgress }
                : c
            ),
          });

          // 완료 확인
          if (newProgress >= 100) {
            set({
              contracts: state.contracts.map(c =>
                c.id === contract.id
                  ? { ...c, status: 'COMPLETED' as ContractStatus }
                  : c
              ),
              docks: state.docks.map(d =>
                d.id === contract.assignedDockId
                  ? { ...d, status: 'AVAILABLE', currentContractId: undefined }
                  : d
              ),
              totalShipsBuilt: state.totalShipsBuilt + 1,
            });
          }
        }
      }
    });
  },

  updateFinancials: () => {
    const state = get();

    // 월말 비용 계산
    const monthlyExpenses =
      state.workforce.monthlyCost +
      state.docks.reduce((sum, d) => sum + d.maintenanceCost, 0);

    const interestRate = 0.05 / 12; // 월 이자율
    const monthlyInterest = state.financials.longTermDebt * interestRate;

    // 재무제표 업데이트 (단순화)
    set({
      financials: {
        ...state.financials,
        operatingExpenses: monthlyExpenses,
        interestExpense: monthlyInterest,
        cash: state.financials.cash - monthlyExpenses - monthlyInterest,
      },
    });
  },

  takeLoan: (amount: number) => {
    const state = get();
    if (state.creditUsed + amount <= state.creditLine) {
      set({
        financials: {
          ...state.financials,
          cash: state.financials.cash + amount,
          longTermDebt: state.financials.longTermDebt + amount,
        },
        creditUsed: state.creditUsed + amount,
      });
    }
  },

  repayLoan: (amount: number) => {
    const state = get();
    if (state.financials.cash >= amount) {
      set({
        financials: {
          ...state.financials,
          cash: state.financials.cash - amount,
          longTermDebt: state.financials.longTermDebt - amount,
        },
        creditUsed: Math.max(0, state.creditUsed - amount),
      });
    }
  },

  hireWorkers: (type: string, amount: number) => {
    const state = get();
    const costPerWorker = 0.025; // 월 2.5만 달러 per worker

    set({
      workforce: {
        ...state.workforce,
        [type]: (state.workforce as any)[type] + amount,
        monthlyCost: state.workforce.monthlyCost + (amount * costPerWorker),
      },
    });
  },

  fireWorkers: (type: string, amount: number) => {
    const state = get();
    const costPerWorker = 0.025;

    set({
      workforce: {
        ...state.workforce,
        [type]: Math.max(0, (state.workforce as any)[type] - amount),
        monthlyCost: Math.max(0, state.workforce.monthlyCost - (amount * costPerWorker)),
      },
    });
  },

  buildDock: (size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'MEGA') => {
    const state = get();

    const dockCosts = {
      SMALL: 20_000_000,
      MEDIUM: 50_000_000,
      LARGE: 100_000_000,
      MEGA: 200_000_000,
    };

    const cost = dockCosts[size];

    if (state.financials.cash >= cost) {
      const newDock: Dock = {
        id: `DOCK_${state.docks.length + 1}`,
        name: `Dock #${state.docks.length + 1}`,
        size,
        status: 'AVAILABLE',
        maxLength: size === 'SMALL' ? 200 : size === 'MEDIUM' ? 300 : size === 'LARGE' ? 400 : 500,
        maxWidth: size === 'SMALL' ? 35 : size === 'MEDIUM' ? 50 : size === 'LARGE' ? 65 : 80,
        efficiency: 0.8,
        maintenanceCost: cost / 100_000_000, // 비용의 1% per month
        condition: 100,
      };

      set({
        docks: [...state.docks, newDock],
        financials: {
          ...state.financials,
          cash: state.financials.cash - cost,
          fixedAssets: state.financials.fixedAssets + cost,
        },
      });
    }
  },

  upgradeDock: (_dockId: string) => {
    // 나중에 구현
  },

  // 이벤트 액션
  triggerEvent: (event: GameEvent) => {
    const state = get();
    set({
      activeEvent: event,
      events: [...state.events, event],
    });
  },

  closeEvent: () => {
    set({ activeEvent: null });
  },

  handleEventChoice: (choiceIndex: number) => {
    const state = get();
    if (state.activeEvent && state.activeEvent.choices) {
      const choice = state.activeEvent.choices[choiceIndex];
      if (choice && choice.effect) {
        choice.effect();
      }
    }
    set({ activeEvent: null });
  },

  // 이벤트 효과 헬퍼 함수들
  increaseCash: (amount: number) => {
    const state = get();
    set({
      financials: {
        ...state.financials,
        cash: state.financials.cash + amount,
      },
    });
  },

  decreaseCash: (amount: number) => {
    const state = get();
    set({
      financials: {
        ...state.financials,
        cash: state.financials.cash - amount,
      },
    });
  },

  increaseReputation: (amount: number) => {
    const state = get();
    set({ reputation: Math.min(100, state.reputation + amount) });
  },

  decreaseReputation: (amount: number) => {
    const state = get();
    set({ reputation: Math.max(0, state.reputation - amount) });
  },

  increaseMarketShare: (amount: number) => {
    const state = get();
    set({ marketShare: Math.min(100, state.marketShare + amount) });
  },

  increaseDockEfficiency: () => {
    const state = get();
    set({
      docks: state.docks.map(dock => ({
        ...dock,
        efficiency: Math.min(1, dock.efficiency + 0.1),
      })),
    });
  },

  increaseMorale: () => {
    const state = get();
    set({
      workforce: {
        ...state.workforce,
        morale: Math.min(100, state.workforce.morale + 10),
      },
    });
  },

  decreaseMorale: () => {
    const state = get();
    set({
      workforce: {
        ...state.workforce,
        morale: Math.max(0, state.workforce.morale - 5),
      },
    });
  },

  // 연구 개발 액션들
  getCompletedResearch: () => {
    const state = get();
    return state.researchProjects
      .filter(p => p.status === 'COMPLETED')
      .map(p => p.researchId);
  },

  canStartResearch: (researchId: string) => {
    const state = get();
    const research = getResearchById(researchId);

    if (!research) {
      return { canStart: false, reason: '연구를 찾을 수 없습니다.' };
    }

    // 이미 완료했거나 진행 중인지 확인
    const existingProject = state.researchProjects.find(p => p.researchId === researchId);
    if (existingProject) {
      if (existingProject.status === 'COMPLETED') {
        return { canStart: false, reason: '이미 완료된 연구입니다.' };
      }
      if (existingProject.status === 'IN_PROGRESS') {
        return { canStart: false, reason: '이미 진행 중인 연구입니다.' };
      }
    }

    // 동시 연구 한도 확인
    const activeResearchCount = state.researchProjects.filter(p => p.status === 'IN_PROGRESS').length;
    if (activeResearchCount >= state.activeResearchCount) {
      return { canStart: false, reason: `동시에 ${state.activeResearchCount}개까지만 연구할 수 있습니다.` };
    }

    // 자금 확인
    if (state.financials.cash < research.cost) {
      return { canStart: false, reason: '자금이 부족합니다.' };
    }

    // 평판 확인
    if (state.reputation < research.requiredReputation) {
      return { canStart: false, reason: `평판이 ${research.requiredReputation} 이상 필요합니다.` };
    }

    // 선행 연구 확인
    if (research.prerequisiteIds && research.prerequisiteIds.length > 0) {
      const completedResearch = state.researchProjects
        .filter(p => p.status === 'COMPLETED')
        .map(p => p.researchId);

      const missingPrerequisites = research.prerequisiteIds.filter(
        id => !completedResearch.includes(id)
      );

      if (missingPrerequisites.length > 0) {
        return { canStart: false, reason: '선행 연구를 먼저 완료해야 합니다.' };
      }
    }

    return { canStart: true };
  },

  getAvailableResearch: () => {
    const state = get();
    const completedIds = state.researchProjects
      .filter(p => p.status === 'COMPLETED')
      .map(p => p.researchId);

    const inProgressIds = state.researchProjects
      .filter(p => p.status === 'IN_PROGRESS')
      .map(p => p.researchId);

    return AVAILABLE_RESEARCH.filter(research => {
      // 이미 완료했거나 진행 중이면 제외
      if (completedIds.includes(research.id) || inProgressIds.includes(research.id)) {
        return false;
      }

      // 선행 연구 확인
      if (research.prerequisiteIds && research.prerequisiteIds.length > 0) {
        const hasAllPrerequisites = research.prerequisiteIds.every(
          id => completedIds.includes(id)
        );
        if (!hasAllPrerequisites) {
          return false;
        }
      }

      return true;
    });
  },

  startResearch: (researchId: string) => {
    const state = get();
    const canStart = get().canStartResearch(researchId);

    if (!canStart.canStart) {
      return false;
    }

    const research = getResearchById(researchId);
    if (!research) {
      return false;
    }

    const newProject: ResearchProject = {
      researchId,
      status: 'IN_PROGRESS',
      startDate: new Date(state.currentDate),
      progress: 0,
    };

    set({
      researchProjects: [...state.researchProjects, newProject],
      financials: {
        ...state.financials,
        cash: state.financials.cash - research.cost,
      },
    });

    return true;
  },

  updateResearch: () => {
    const state = get();
    const updatedProjects = state.researchProjects.map(project => {
      if (project.status !== 'IN_PROGRESS') {
        return project;
      }

      const research = getResearchById(project.researchId);
      if (!research) {
        return project;
      }

      // 일일 진행률 계산 (duration 일 동안 100% 완료)
      const dailyProgress = 100 / research.duration;
      const newProgress = Math.min(100, project.progress + dailyProgress);

      // 완료 확인
      if (newProgress >= 100) {
        // 연구 효과 적용
        const effects = research.effects;

        // 도크 효율 증가
        if (effects.dockEfficiency) {
          const updatedDocks = state.docks.map(dock => ({
            ...dock,
            efficiency: Math.min(1, dock.efficiency + (effects.dockEfficiency || 0) / 100),
          }));
          set({ docks: updatedDocks });
        }

        // 평판 보너스
        if (effects.reputationBonus) {
          set({ reputation: Math.min(100, state.reputation + effects.reputationBonus) });
        }

        return {
          ...project,
          status: 'COMPLETED' as const,
          progress: 100,
          completionDate: new Date(state.currentDate),
        };
      }

      return {
        ...project,
        progress: newProgress,
      };
    });

    set({ researchProjects: updatedProjects });
  },

  // 경쟁사 액션들
  updateCompetitors: () => {
    const state = get();
    const updatedCompetitors = state.competitors.map(competitor =>
      CompetitorAI.updateCompetitorGrowth(competitor)
    );

    // 시장 점유율 정규화
    const normalized = CompetitorAI.normalizeMarketShare(
      updatedCompetitors,
      state.marketShare
    );

    set({
      competitors: normalized.competitors,
      marketShare: normalized.playerMarketShare,
    });
  },

  getTopCompetitors: (limit: number = 5) => {
    const state = get();
    return [...state.competitors]
      .sort((a, b) => b.marketShare - a.marketShare)
      .slice(0, limit);
  },

  // 업적 액션들
  checkAchievements: () => {
    const state = get();
    const newlyUnlocked: string[] = [];

    const updatedAchievements = state.achievements.map(progress => {
      if (progress.unlocked) return progress;

      const achievement = getAchievementById(progress.achievementId);
      if (!achievement) return progress;

      // 조건 체크
      if (achievement.condition(state)) {
        newlyUnlocked.push(achievement.id);

        // 보상 지급
        if (achievement.reward) {
          if (achievement.reward.cash) {
            set({
              financials: {
                ...state.financials,
                cash: state.financials.cash + achievement.reward.cash,
              },
            });
          }
          if (achievement.reward.reputation) {
            set({
              reputation: Math.min(100, state.reputation + achievement.reward.reputation),
            });
          }
        }

        // 언락
        return {
          ...progress,
          unlocked: true,
          unlockedAt: new Date(state.currentDate),
        };
      }

      return progress;
    });

    if (newlyUnlocked.length > 0) {
      set({ achievements: updatedAchievements });

      // 토스트 알림 표시
      const { addToast } = useToastStore.getState();
      newlyUnlocked.forEach(achievementId => {
        const achievement = getAchievementById(achievementId);
        if (achievement) {
          let rewardText = '';
          if (achievement.reward) {
            const rewards = [];
            if (achievement.reward.cash) {
              rewards.push(`+$${(achievement.reward.cash / 1_000_000).toFixed(1)}M`);
            }
            if (achievement.reward.reputation) {
              rewards.push(`+${achievement.reward.reputation} 평판`);
            }
            if (rewards.length > 0) {
              rewardText = ` (${rewards.join(', ')})`;
            }
          }
          addToast({
            type: 'achievement',
            title: `업적 달성: ${achievement.name}`,
            message: achievement.description + rewardText,
            duration: 5000,
          });
        }
      });
    }
  },

  getUnlockedAchievements: () => {
    const state = get();
    return state.achievements.filter(a => a.unlocked).map(a => a.achievementId);
  },

  getAchievementProgress: (achievementId: string) => {
    const state = get();
    return state.achievements.find(a => a.achievementId === achievementId);
  },

  // 통계 액션들
  recordMonthlyStatistics: () => {
    const state = get();
    const currentDate = new Date(state.currentDate);

    const totalWorkers =
      state.workforce.welders +
      state.workforce.fitters +
      state.workforce.painters +
      state.workforce.electricians +
      state.workforce.engineers;

    const avgDockEfficiency =
      state.docks.length > 0
        ? state.docks.reduce((sum, d) => sum + d.efficiency, 0) / state.docks.length
        : 0;

    const shipsInProduction = state.contracts.filter(
      c => c.status === 'IN_PRODUCTION'
    ).length;

    const researchCompleted = state.researchProjects.filter(
      p => p.status === 'COMPLETED'
    ).length;

    const activeResearch = state.researchProjects.filter(
      p => p.status === 'IN_PROGRESS'
    ).length;

    const monthlyData: import('../types').MonthlyStatistics = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      date: new Date(currentDate),

      // 재무
      revenue: state.financials.revenue,
      netIncome: state.financials.netIncome,
      cash: state.financials.cash,
      totalAssets: state.financials.totalAssets,
      totalLiabilities: state.financials.totalLiabilities,
      equity: state.financials.equity,

      // 생산
      shipsCompleted: state.totalShipsBuilt,
      shipsInProduction,
      dockCount: state.docks.length,
      averageDockEfficiency: avgDockEfficiency,

      // 인력
      totalWorkers,
      averageSkillLevel: state.workforce.skillLevel,
      averageMorale: state.workforce.morale,

      // 시장
      reputation: state.reputation,
      marketShare: state.marketShare,
      activeContracts: state.contracts.filter(c => c.status !== 'CANCELLED' && c.status !== 'COMPLETED').length,

      // 연구
      researchCompleted,
      activeResearch,
    };

    set({
      statistics: [...state.statistics, monthlyData],
    });
  },

  getStatisticsByPeriod: (months: number) => {
    const state = get();
    if (months <= 0) return state.statistics;
    return state.statistics.slice(-months);
  },

  // 튜토리얼 액션
  startTutorial: () => {
    set({
      showTutorial: true,
      tutorial: {
        currentStep: 0,
        completed: false,
        skipped: false,
        completedSteps: [],
      },
    });
  },

  nextTutorialStep: () => {
    const state = get();
    const currentStep = state.tutorial.currentStep;
    const totalSteps = TUTORIAL_STEPS.length;

    if (currentStep < totalSteps - 1) {
      const currentStepId = TUTORIAL_STEPS[currentStep].id;
      set({
        tutorial: {
          ...state.tutorial,
          currentStep: currentStep + 1,
          completedSteps: [...state.tutorial.completedSteps, currentStepId],
        },
      });
    } else {
      // 마지막 단계 완료
      get().completeTutorial();
    }
  },

  prevTutorialStep: () => {
    const state = get();
    const currentStep = state.tutorial.currentStep;

    if (currentStep > 0) {
      set({
        tutorial: {
          ...state.tutorial,
          currentStep: currentStep - 1,
        },
      });
    }
  },

  skipTutorial: () => {
    set({
      showTutorial: false,
      tutorial: {
        currentStep: 0,
        completed: false,
        skipped: true,
        completedSteps: [],
      },
    });
  },

  completeTutorial: () => {
    const state = get();
    const allStepIds = TUTORIAL_STEPS.map(s => s.id);
    set({
      showTutorial: false,
      tutorial: {
        ...state.tutorial,
        completed: true,
        completedSteps: allStepIds,
      },
    });
  },

  resetTutorial: () => {
    set({
      tutorial: {
        currentStep: 0,
        completed: false,
        skipped: false,
        completedSteps: [],
      },
    });
  },

  getTutorialProgress: () => {
    return get().tutorial;
  },

  // 설정 액션
  updateSettings: (newSettings: Partial<GameSettings>) => {
    const state = get();
    const updatedSettings = { ...state.settings, ...newSettings };

    // 자동 저장 설정 변경 시 타이머 업데이트
    if (newSettings.autoSaveEnabled !== undefined || newSettings.autoSaveInterval !== undefined) {
      if (updatedSettings.autoSaveEnabled) {
        SaveManager.enableAutoSave(() => get(), updatedSettings.autoSaveInterval);
      } else {
        SaveManager.disableAutoSave();
      }
    }

    set({ settings: updatedSettings });
  },

  resetSettings: () => {
    const defaultSettings: GameSettings = {
      autoSaveEnabled: true,
      autoSaveInterval: 60000,
      showEventNotifications: true,
      showAchievementNotifications: true,
      soundEnabled: false,
      musicVolume: 50,
      sfxVolume: 50,
    };
    set({ settings: defaultSettings });
  },

  getSettings: () => {
    return get().settings;
  },

  // 게임 종료 체크
  checkGameEnd: () => {
    const state = get();

    // 이미 종료된 경우 체크하지 않음
    if (state.gameEnd.isEnded) return;

    let reason: GameEndReason | undefined;

    // 승리 조건 체크
    if (state.reputation >= 95 && state.totalShipsBuilt >= 50) {
      reason = 'VICTORY_REPUTATION';
    } else if (state.marketShare >= 40) {
      reason = 'VICTORY_MARKET_SHARE';
    } else if (state.totalShipsBuilt >= 100) {
      reason = 'VICTORY_SHIPS_BUILT';
    } else if (state.financials.totalAssets >= 500_000_000 && state.financials.longTermDebt < 50_000_000) {
      reason = 'VICTORY_WEALTH';
    }

    // 파산 조건 체크
    if (!reason) {
      if (state.financials.cash < 0 && state.financials.longTermDebt >= state.creditLine) {
        reason = 'BANKRUPTCY_CASH';
      } else if (state.financials.debtToEquityRatio > 5) {
        reason = 'BANKRUPTCY_DEBT';
      } else if (state.reputation <= 5) {
        reason = 'BANKRUPTCY_REPUTATION';
      }
    }

    if (reason) {
      const startDate = new Date(2025, 0, 1);
      const playTime = Math.floor((state.currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      set({
        gameEnd: {
          isEnded: true,
          reason,
          endDate: new Date(state.currentDate),
          finalStats: {
            totalShipsBuilt: state.totalShipsBuilt,
            totalRevenue: state.totalRevenue,
            finalCash: state.financials.cash,
            finalReputation: state.reputation,
            finalMarketShare: state.marketShare,
            playTime,
          },
        },
      });
    }
  },

  resetGame: () => {
    // 전체 게임 상태 초기화
    set({
      companyName: '',
      difficulty: 'NORMAL' as Difficulty,
      currentDate: new Date(2025, 0, 1),
      gameSpeed: 1,
      financials: INITIAL_FINANCIALS,
      creditLine: 100_000_000,
      creditUsed: 0,
      docks: INITIAL_DOCKS,
      workforce: {
        welders: 100,
        fitters: 80,
        painters: 60,
        electricians: 40,
        engineers: 50,
        morale: 70,
        skillLevel: 60,
        monthlyCost: 3.0,
      },
      contracts: [],
      customers: [...INITIAL_CUSTOMERS],
      availableBids: [],
      totalShipsBuilt: 0,
      totalRevenue: 0,
      reputation: 50,
      marketShare: 5,
      events: [],
      activeEvent: null,
      researchProjects: [],
      activeResearchCount: 1,
      competitors: [...INITIAL_COMPETITORS],
      achievements: ALL_ACHIEVEMENTS.map(a => ({
        achievementId: a.id,
        unlocked: false,
      })),
      statistics: [],
      tutorial: {
        currentStep: 0,
        completed: false,
        skipped: false,
        completedSteps: [],
      },
      showTutorial: false,
      gameEnd: {
        isEnded: false,
      },
      // 연간 사업계획 초기화
      annualPlans: [],
      showAnnualPlanDialog: false,
      pendingPlanYear: null,
    });
  },

  // 연간 사업계획 액션들
  createAnnualPlan: (year: number, scenario: PlanScenario, targets: Partial<AnnualTarget>) => {
    const state = get();
    const scenarioConfig = SCENARIO_PRESETS[scenario];

    // 기본 목표값 설정
    const defaultTarget: AnnualTarget = {
      orderAmount: 500, // 5억 달러
      orderCount: 5,
      shipTypeTargets: [],
      productionCount: 4,
      deliveryCount: 3,
      revenueTarget: 400,
      profitTarget: 60,
      cashFlowTarget: 50,
    };

    // 기본 실적값 초기화
    const initialActual: AnnualActual = {
      orderAmount: 0,
      orderCount: 0,
      shipTypeActuals: [],
      productionCount: 0,
      deliveryCount: 0,
      revenue: 0,
      profit: 0,
      cashFlow: 0,
      actualManHoursPerGT: 0,
      actualFixedCostRatio: 0,
      actualProfitMargin: 0,
    };

    const newPlan: AnnualPlan = {
      year,
      scenario,
      scenarioConfig,
      target: { ...defaultTarget, ...targets },
      actual: initialActual,
      createdAt: new Date(state.currentDate),
      isActive: true,
    };

    // 기존 해당 연도 계획이 있으면 비활성화
    const updatedPlans = state.annualPlans.map(plan =>
      plan.year === year ? { ...plan, isActive: false } : plan
    );

    set({
      annualPlans: [...updatedPlans, newPlan],
      showAnnualPlanDialog: false,
      pendingPlanYear: null,
    });
  },

  updateAnnualPlan: (year: number, updates: Partial<AnnualPlan>) => {
    const state = get();
    set({
      annualPlans: state.annualPlans.map(plan =>
        plan.year === year && plan.isActive
          ? { ...plan, ...updates }
          : plan
      ),
    });
  },

  getActivePlan: () => {
    const state = get();
    const currentYear = state.currentDate.getFullYear();
    return state.annualPlans.find(plan => plan.year === currentYear && plan.isActive);
  },

  getPlanForYear: (year: number) => {
    const state = get();
    return state.annualPlans.find(plan => plan.year === year && plan.isActive);
  },

  updatePlanActuals: () => {
    const state = get();
    const currentYear = state.currentDate.getFullYear();
    const activePlan = state.annualPlans.find(plan => plan.year === currentYear && plan.isActive);

    if (!activePlan) return;

    // 현재 연도의 계약들 집계
    const yearContracts = state.contracts.filter(c => {
      const contractDate = c.contractDate ? new Date(c.contractDate) : null;
      return contractDate && contractDate.getFullYear() === currentYear;
    });

    // 수주 실적 계산
    const orderAmount = yearContracts.reduce((sum, c) => sum + c.contractPrice, 0);
    const orderCount = yearContracts.length;

    // 선종별 실적
    const shipTypeMap = new Map<ShipType, { count: number; amount: number }>();
    yearContracts.forEach(c => {
      const type = c.shipSpec.type;
      const existing = shipTypeMap.get(type) || { count: 0, amount: 0 };
      shipTypeMap.set(type, {
        count: existing.count + 1,
        amount: existing.amount + c.contractPrice,
      });
    });

    const shipTypeActuals = Array.from(shipTypeMap.entries()).map(([type, data]) => ({
      type,
      count: data.count,
      amount: data.amount,
    }));

    // 생산/인도 실적 (완료된 계약 기준)
    const completedThisYear = state.contracts.filter(c => {
      return c.status === 'COMPLETED' || c.status === 'DELIVERED';
    });
    const deliveryCount = completedThisYear.length;
    const productionCount = state.contracts.filter(c => c.status === 'IN_PRODUCTION').length + deliveryCount;

    // 재무 실적
    const revenue = state.financials.revenue;
    const profit = state.financials.netIncome;
    const cashFlow = state.financials.operatingCashFlow;

    // 효율 지표 계산 (간략화)
    const totalGT = yearContracts.reduce((sum, c) => sum + (c.shipSpec.deadweight / 1000), 0);
    const totalWorkers = state.workforce.welders + state.workforce.fitters +
                        state.workforce.painters + state.workforce.electricians +
                        state.workforce.engineers;
    const workingDays = 250; // 연간 근무일
    const totalManHours = totalWorkers * 8 * workingDays;
    const actualManHoursPerGT = totalGT > 0 ? totalManHours / totalGT : 0;

    const actualProfitMargin = revenue > 0 ? profit / revenue : 0;
    const actualFixedCostRatio = revenue > 0 ? state.financials.operatingExpenses / revenue : 0;

    const updatedActual: AnnualActual = {
      orderAmount,
      orderCount,
      shipTypeActuals,
      productionCount,
      deliveryCount,
      revenue,
      profit,
      cashFlow,
      actualManHoursPerGT,
      actualFixedCostRatio,
      actualProfitMargin,
    };

    set({
      annualPlans: state.annualPlans.map(plan =>
        plan.year === currentYear && plan.isActive
          ? { ...plan, actual: updatedActual }
          : plan
      ),
    });
  },

  openAnnualPlanDialog: (year: number) => {
    set({
      showAnnualPlanDialog: true,
      pendingPlanYear: year,
    });
  },

  closeAnnualPlanDialog: () => {
    set({
      showAnnualPlanDialog: false,
      pendingPlanYear: null,
    });
  },

  // 입찰 시스템 액션들
  checkBidExpirations: () => {
    const state = get();
    const currentDate = new Date(state.currentDate);
    const { addToast } = useToastStore.getState();

    // 만료된 입찰 확인
    const expiredBids = state.availableBids.filter(bid => {
      if (!bid.bidDeadline) return false;
      return new Date(bid.bidDeadline) < currentDate;
    });

    if (expiredBids.length > 0) {
      // 만료된 입찰 알림
      expiredBids.forEach(bid => {
        addToast({
          type: 'warning',
          title: '입찰 마감',
          message: `${bid.shipSpec.name} 입찰이 마감되었습니다.`,
          duration: 4000,
        });
      });

      // 만료된 입찰 제거
      set({
        availableBids: state.availableBids.filter(bid => {
          if (!bid.bidDeadline) return true;
          return new Date(bid.bidDeadline) >= currentDate;
        }),
      });
    }
  },

  processBidResults: () => {
    const state = get();
    const { addToast } = useToastStore.getState();

    // PENDING 상태인 계약들 처리 (일정 확률로 결과 결정)
    const pendingContracts = state.contracts.filter(c =>
      c.status === 'NEGOTIATING' && c.bidResult === 'PENDING'
    );

    if (pendingContracts.length === 0) return;

    // 매일 10% 확률로 결과 발표
    const updatedContracts = state.contracts.map(contract => {
      if (contract.status !== 'NEGOTIATING' || contract.bidResult !== 'PENDING') {
        return contract;
      }

      if (Math.random() < 0.1) {
        // 결과 결정
        const competitiveness = BidGenerator.calculateBidCompetitiveness(
          contract,
          contract.bidAmount || contract.contractPrice,
          state.reputation,
          contract.usedBroker || false,
          contract.brokerCommission || 1.0
        );

        const finalResult = Math.random() < (competitiveness / 100) ? 'WON' : 'LOST';

        if (finalResult === 'WON') {
          addToast({
            type: 'success',
            title: '입찰 성공!',
            message: `${contract.shipSpec.name} 입찰에 최종 선정되었습니다!`,
            duration: 5000,
          });
          return {
            ...contract,
            bidResult: 'WON' as BidResult,
          };
        } else {
          addToast({
            type: 'error',
            title: '입찰 탈락',
            message: `${contract.shipSpec.name} 입찰에서 탈락했습니다.`,
            duration: 5000,
          });
          return {
            ...contract,
            bidResult: 'LOST' as BidResult,
            status: 'CANCELLED' as ContractStatus,
          };
        }
      }

      return contract;
    });

    // 취소된 계약 제거
    set({
      contracts: updatedContracts.filter(c => c.status !== 'CANCELLED'),
    });
  },

  // 재무 확장 액션들
  issueCorporateBond: (principal: number, interestRate: number, years: number, frequency: 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL') => {
    const state = get();
    const currentDate = new Date(state.currentDate);

    // 최소 발행 조건 확인
    if (principal < 10) {
      return false; // 최소 1천만 달러
    }

    // 신용등급에 따른 최대 발행 한도 (자본의 200%)
    const maxBondAmount = state.financials.equity * 2;
    const currentBondTotal = state.corporateBonds
      .filter(b => b.isActive)
      .reduce((sum, b) => sum + b.principal, 0);

    if (currentBondTotal + principal > maxBondAmount) {
      return false;
    }

    const maturityDate = new Date(currentDate);
    maturityDate.setFullYear(maturityDate.getFullYear() + years);

    const newBond: CorporateBond = {
      id: `BOND_${Date.now()}`,
      issueDate: new Date(currentDate),
      maturityDate,
      principal,
      interestRate,
      paymentFrequency: frequency,
      isActive: true,
      totalInterestPaid: 0,
    };

    // 재무제표 업데이트 - 회사채는 장기부채로 처리
    set({
      corporateBonds: [...state.corporateBonds, newBond],
      financials: {
        ...state.financials,
        cash: state.financials.cash + principal, // 현금 증가
        longTermDebt: state.financials.longTermDebt + principal, // 장기부채 증가
        totalLiabilities: state.financials.totalLiabilities + principal,
        debtToEquityRatio: (state.financials.totalLiabilities + principal) / state.financials.equity,
      },
    });

    const { addToast } = useToastStore.getState();
    addToast({
      type: 'success',
      title: '회사채 발행 완료',
      message: `$${principal}M 규모의 회사채가 발행되었습니다. (연 ${(interestRate * 100).toFixed(1)}%, ${years}년 만기)`,
      duration: 5000,
    });

    return true;
  },

  repayCorporateBond: (bondId: string) => {
    const state = get();
    const bond = state.corporateBonds.find(b => b.id === bondId && b.isActive);

    if (!bond || state.financials.cash < bond.principal) {
      return false;
    }

    set({
      corporateBonds: state.corporateBonds.map(b =>
        b.id === bondId ? { ...b, isActive: false } : b
      ),
      financials: {
        ...state.financials,
        cash: state.financials.cash - bond.principal,
        longTermDebt: state.financials.longTermDebt - bond.principal,
        totalLiabilities: state.financials.totalLiabilities - bond.principal,
        debtToEquityRatio: Math.max(0, (state.financials.totalLiabilities - bond.principal) / state.financials.equity),
      },
    });

    const { addToast } = useToastStore.getState();
    addToast({
      type: 'success',
      title: '회사채 상환 완료',
      message: `$${bond.principal}M 규모의 회사채가 상환되었습니다.`,
      duration: 5000,
    });

    return true;
  },

  issueStock: (shares: number, pricePerShare: number, type: 'RIGHTS_OFFERING' | 'PRIVATE_PLACEMENT') => {
    const state = get();

    // 최소 발행 조건
    if (shares < 10000 || pricePerShare <= 0) {
      return false;
    }

    // 유상증자는 기존 주식 수의 50% 이내로 제한
    const maxNewShares = state.totalShares * 0.5;
    if (shares > maxNewShares) {
      return false;
    }

    const totalRaised = (shares * pricePerShare) / 1_000_000; // 백만 달러 단위
    const dilutionEffect = shares / (state.totalShares + shares);

    const newIssuance: StockIssuance = {
      id: `STOCK_${Date.now()}`,
      issueDate: new Date(state.currentDate),
      sharesIssued: shares,
      pricePerShare,
      totalRaised,
      type,
      dilutionEffect,
    };

    // 재무제표 업데이트 - 주식 발행은 자본 증가
    const newTotalShares = state.totalShares + shares;
    set({
      stockIssuances: [...state.stockIssuances, newIssuance],
      totalShares: newTotalShares,
      financials: {
        ...state.financials,
        cash: state.financials.cash + totalRaised, // 현금 증가
        equity: state.financials.equity + totalRaised, // 자본 증가
        totalAssets: state.financials.totalAssets + totalRaised,
        debtToEquityRatio: state.financials.totalLiabilities / (state.financials.equity + totalRaised),
      },
    });

    const { addToast } = useToastStore.getState();
    const typeLabel = type === 'RIGHTS_OFFERING' ? '주주배정' : '제3자배정';
    addToast({
      type: 'success',
      title: '유상증자 완료',
      message: `${typeLabel} 유상증자로 $${totalRaised.toFixed(1)}M을 조달했습니다. (${shares.toLocaleString()}주 @ $${pricePerShare})`,
      duration: 5000,
    });

    return true;
  },

  processBondInterest: () => {
    const state = get();
    const currentDate = new Date(state.currentDate);
    const currentMonth = currentDate.getMonth();

    let totalInterest = 0;

    const updatedBonds = state.corporateBonds.map(bond => {
      if (!bond.isActive) return bond;

      // 이자 지급 주기 확인
      let shouldPayInterest = false;
      if (bond.paymentFrequency === 'QUARTERLY' && currentMonth % 3 === 0) {
        shouldPayInterest = true;
      } else if (bond.paymentFrequency === 'SEMI_ANNUAL' && currentMonth % 6 === 0) {
        shouldPayInterest = true;
      } else if (bond.paymentFrequency === 'ANNUAL' && currentMonth === 0) {
        shouldPayInterest = true;
      }

      if (shouldPayInterest) {
        const periodsPerYear = bond.paymentFrequency === 'QUARTERLY' ? 4 :
                              bond.paymentFrequency === 'SEMI_ANNUAL' ? 2 : 1;
        const interestPayment = (bond.principal * bond.interestRate) / periodsPerYear;
        totalInterest += interestPayment;

        return {
          ...bond,
          totalInterestPaid: bond.totalInterestPaid + interestPayment,
        };
      }

      return bond;
    });

    if (totalInterest > 0) {
      set({
        corporateBonds: updatedBonds,
        financials: {
          ...state.financials,
          cash: state.financials.cash - totalInterest,
          interestExpense: state.financials.interestExpense + totalInterest,
        },
      });

      const { addToast } = useToastStore.getState();
      addToast({
        type: 'info',
        title: '회사채 이자 지급',
        message: `회사채 이자 $${totalInterest.toFixed(2)}M이 지급되었습니다.`,
        duration: 3000,
      });
    }

    // 만기 도래 회사채 확인
    state.corporateBonds.forEach(bond => {
      if (bond.isActive && new Date(bond.maturityDate) <= currentDate) {
        const { addToast } = useToastStore.getState();
        addToast({
          type: 'warning',
          title: '회사채 만기 도래',
          message: `$${bond.principal}M 규모의 회사채가 만기 도래했습니다. 상환이 필요합니다.`,
          duration: 5000,
        });
      }
    });
  },

  updateSharePrice: () => {
    const state = get();

    // 주가 = (자본 / 총 주식 수) * 조정 계수
    // 조정 계수는 평판, 수익성 등을 반영
    const bookValue = (state.financials.equity * 1_000_000) / state.totalShares;

    // PBR (주가순자산비율) 조정 - 평판과 수익성 기반
    const reputationMultiplier = 0.5 + (state.reputation / 100) * 1.0; // 0.5 ~ 1.5
    const profitabilityMultiplier = state.financials.netIncome > 0
      ? 1.0 + (state.financials.returnOnEquity * 2)
      : 0.8;

    const newSharePrice = bookValue * reputationMultiplier * profitabilityMultiplier;

    set({
      sharePrice: Math.max(1, newSharePrice), // 최소 $1
    });
  },
}));
