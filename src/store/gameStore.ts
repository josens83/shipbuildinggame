import { create } from 'zustand';
import type { GameState, Dock, FinancialStatement, ContractStatus, GameEvent, ResearchProject, Research, Competitor } from '../types';
import { INITIAL_CUSTOMERS } from '../data/customers';
import { INITIAL_COMPETITORS } from '../data/competitors';
import { BidGenerator } from '../engine/bidGenerator';
import { SaveManager } from '../utils/saveManager';
import { EventGenerator } from '../engine/eventGenerator';
import { AVAILABLE_RESEARCH, getResearchById } from '../data/research';
import { CompetitorAI } from '../engine/competitorAI';

interface GameActions {
  // 게임 제어
  startGame: (companyName: string) => void;
  loadGame: () => boolean;
  saveGame: () => boolean;
  pauseGame: () => void;
  advanceTime: (days: number) => void;
  setGameSpeed: (speed: 1 | 2 | 3) => void;

  // 영업
  generateBids: () => void;
  bidOnContract: (contractId: string, bidAmount: number) => void;
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
  currentDate: new Date(2025, 0, 1), // 2025년 1월 1일
  gameSpeed: 1,

  financials: INITIAL_FINANCIALS,
  creditLine: 100_000_000, // 신용한도 1억 달러
  creditUsed: 0,

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

  // 액션들
  startGame: (companyName: string) => {
    set({ companyName });
    // 게임 시작 시 초기 입찰 생성
    get().generateBids();
    // 자동 저장 시작 (1분마다)
    SaveManager.enableAutoSave(() => get(), 60000);
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

  saveGame: () => {
    return SaveManager.saveGame(get());
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

    // 월이 바뀌면 재무 및 경쟁사 업데이트
    if (oldDate.getMonth() !== newDate.getMonth()) {
      get().updateFinancials();
      get().updateCompetitors();
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
  },

  bidOnContract: (contractId: string, bidAmount: number) => {
    const state = get();
    const contract = state.availableBids.find(c => c.id === contractId);

    if (contract) {
      // 입찰 로직 (나중에 확률 기반으로 확장)
      const updatedContract = {
        ...contract,
        contractPrice: bidAmount,
        status: 'NEGOTIATING' as ContractStatus,
      };

      set({
        availableBids: state.availableBids.filter(c => c.id !== contractId),
        contracts: [...state.contracts, updatedContract],
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
}));
