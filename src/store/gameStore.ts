import { create } from 'zustand';
import type { GameState, Dock, FinancialStatement, ContractStatus } from '../types';
import { INITIAL_CUSTOMERS } from '../data/customers';
import { BidGenerator } from '../engine/bidGenerator';
import { SaveManager } from '../utils/saveManager';

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

    // 월이 바뀌면 재무 업데이트
    if (oldDate.getMonth() !== newDate.getMonth()) {
      get().updateFinancials();
    }

    // 7일마다 새로운 입찰 생성 (입찰이 3개 미만일 때)
    const dayOfMonth = newDate.getDate();
    if (dayOfMonth % 7 === 0 && state.availableBids.length < 3) {
      get().generateBids();
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
}));
