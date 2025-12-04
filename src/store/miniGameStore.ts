// 미니게임 스토어

import { create } from 'zustand';
import type { MiniGameType, MiniGameDifficulty, MiniGameResult, MiniGameReward } from '../types/dialog';

// 미니게임 상태
interface MiniGameState {
  // 현재 게임 상태
  isPlaying: boolean;
  gameType: MiniGameType | null;
  difficulty: MiniGameDifficulty;

  // 게임 데이터
  score: number;
  maxScore: number;
  timeRemaining: number;
  timeLimit: number;
  combo: number;
  maxCombo: number;

  // 연결된 계약 (보너스 적용용)
  contractId: string | null;
  dockId: string | null;

  // 게임별 데이터
  gameData: Record<string, any>;

  // 결과
  lastResult: MiniGameResult | null;
}

interface MiniGameActions {
  // 게임 시작/종료
  startGame: (type: MiniGameType, options?: {
    difficulty?: MiniGameDifficulty;
    contractId?: string;
    dockId?: string;
    timeLimit?: number;
  }) => void;
  endGame: () => MiniGameResult;
  resetGame: () => void;

  // 점수 관리
  addScore: (points: number) => void;
  increaseCombo: () => void;
  resetCombo: () => void;

  // 시간 관리
  tick: (deltaMs: number) => void;
  setTimeRemaining: (time: number) => void;

  // 게임 데이터
  setGameData: (key: string, value: any) => void;
  getGameData: (key: string) => any;

  // 결과 계산
  calculateGrade: (score: number, maxScore: number) => 'S' | 'A' | 'B' | 'C' | 'F';
  calculateRewards: (grade: string, gameType: MiniGameType) => MiniGameReward[];
}

const INITIAL_STATE: MiniGameState = {
  isPlaying: false,
  gameType: null,
  difficulty: 'normal',

  score: 0,
  maxScore: 100,
  timeRemaining: 60,
  timeLimit: 60,
  combo: 0,
  maxCombo: 0,

  contractId: null,
  dockId: null,

  gameData: {},

  lastResult: null,
};

export const useMiniGameStore = create<MiniGameState & MiniGameActions>((set, get) => ({
  ...INITIAL_STATE,

  startGame: (type, options = {}) => {
    const timeLimit = options.timeLimit || getDefaultTimeLimit(type);
    const maxScore = getDefaultMaxScore(type, options.difficulty || 'normal');

    set({
      isPlaying: true,
      gameType: type,
      difficulty: options.difficulty || 'normal',
      score: 0,
      maxScore,
      timeRemaining: timeLimit,
      timeLimit,
      combo: 0,
      maxCombo: 0,
      contractId: options.contractId || null,
      dockId: options.dockId || null,
      gameData: {},
      lastResult: null,
    });
  },

  endGame: () => {
    const state = get();
    const grade = state.calculateGrade(state.score, state.maxScore);
    const rewards = state.calculateRewards(grade, state.gameType!);

    const result: MiniGameResult = {
      type: state.gameType!,
      score: state.score,
      maxScore: state.maxScore,
      grade,
      timeTaken: state.timeLimit - state.timeRemaining,
      rewards,
      bonusApplied: state.combo >= 5,
    };

    set({
      isPlaying: false,
      lastResult: result,
    });

    return result;
  },

  resetGame: () => {
    set(INITIAL_STATE);
  },

  addScore: (points) => {
    const state = get();
    const comboMultiplier = 1 + (state.combo * 0.1); // 콤보당 10% 보너스
    const actualPoints = Math.floor(points * comboMultiplier);

    set({
      score: Math.min(state.score + actualPoints, state.maxScore),
    });
  },

  increaseCombo: () => {
    set((state) => ({
      combo: state.combo + 1,
      maxCombo: Math.max(state.maxCombo, state.combo + 1),
    }));
  },

  resetCombo: () => {
    set({ combo: 0 });
  },

  tick: (deltaMs) => {
    set((state) => {
      const newTime = Math.max(0, state.timeRemaining - deltaMs / 1000);
      return { timeRemaining: newTime };
    });
  },

  setTimeRemaining: (time) => {
    set({ timeRemaining: time });
  },

  setGameData: (key, value) => {
    set((state) => ({
      gameData: { ...state.gameData, [key]: value },
    }));
  },

  getGameData: (key) => {
    return get().gameData[key];
  },

  calculateGrade: (score, maxScore) => {
    const percentage = (score / maxScore) * 100;

    if (percentage >= 95) return 'S';
    if (percentage >= 80) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 40) return 'C';
    return 'F';
  },

  calculateRewards: (grade, gameType) => {
    const rewards: MiniGameReward[] = [];

    // 기본 보상
    const baseRewards: Record<string, { efficiency: number; quality: number; cash: number }> = {
      S: { efficiency: 10, quality: 10, cash: 1000000 },
      A: { efficiency: 7, quality: 7, cash: 500000 },
      B: { efficiency: 5, quality: 5, cash: 200000 },
      C: { efficiency: 2, quality: 2, cash: 50000 },
      F: { efficiency: 0, quality: 0, cash: 0 },
    };

    const base = baseRewards[grade] || baseRewards.F;

    // 게임 타입별 보상
    switch (gameType) {
      case 'welding':
        if (base.quality > 0) {
          rewards.push({
            type: 'quality',
            value: base.quality,
            description: `품질 +${base.quality}%`,
          });
        }
        break;

      case 'inspection':
        if (base.quality > 0) {
          rewards.push({
            type: 'quality',
            value: base.quality * 1.5,
            description: `품질 +${Math.floor(base.quality * 1.5)}%`,
          });
        }
        break;

      case 'assembly':
        if (base.efficiency > 0) {
          rewards.push({
            type: 'efficiency',
            value: base.efficiency,
            description: `생산 효율 +${base.efficiency}%`,
          });
        }
        if (base.efficiency > 5) {
          rewards.push({
            type: 'speed',
            value: 5,
            description: '건조 속도 +5%',
          });
        }
        break;

      case 'crisis':
        if (base.efficiency > 0) {
          rewards.push({
            type: 'reputation',
            value: Math.floor(base.efficiency / 2),
            description: `평판 +${Math.floor(base.efficiency / 2)}`,
          });
        }
        break;
    }

    // 현금 보상
    if (base.cash > 0) {
      rewards.push({
        type: 'cash',
        value: base.cash,
        description: `+$${(base.cash / 1000000).toFixed(1)}M`,
      });
    }

    return rewards;
  },
}));

// 헬퍼 함수
function getDefaultTimeLimit(type: MiniGameType): number {
  switch (type) {
    case 'welding':
      return 30;
    case 'inspection':
      return 45;
    case 'assembly':
      return 60;
    case 'crisis':
      return 30;
    default:
      return 60;
  }
}

function getDefaultMaxScore(type: MiniGameType, difficulty: MiniGameDifficulty): number {
  const baseScores: Record<MiniGameType, number> = {
    welding: 100,
    inspection: 100,
    assembly: 100,
    crisis: 100,
  };

  const difficultyMultiplier: Record<MiniGameDifficulty, number> = {
    easy: 0.8,
    normal: 1,
    hard: 1.2,
    expert: 1.5,
  };

  return Math.floor(baseScores[type] * difficultyMultiplier[difficulty]);
}

// 편의용 훅
export const useMiniGame = () => {
  const store = useMiniGameStore();
  return {
    isPlaying: store.isPlaying,
    gameType: store.gameType,
    score: store.score,
    maxScore: store.maxScore,
    timeRemaining: store.timeRemaining,
    combo: store.combo,
    startGame: store.startGame,
    endGame: store.endGame,
    addScore: store.addScore,
    increaseCombo: store.increaseCombo,
    resetCombo: store.resetCombo,
  };
};
