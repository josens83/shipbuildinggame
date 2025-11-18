import type { Achievement, GameState } from '../types';

/**
 * 게임 내 모든 업적 정의
 */
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // ===== 이정표 업적 =====
  {
    id: 'ACH_FIRST_SHIP',
    name: '첫 출항',
    description: '첫 번째 선박을 성공적으로 건조하세요',
    category: 'MILESTONE',
    rarity: 'COMMON',
    condition: (state: GameState) => state.totalShipsBuilt >= 1,
    reward: {
      cash: 1_000_000,
      reputation: 2,
      message: '축하합니다! 첫 선박을 성공적으로 건조했습니다!',
    },
  },
  {
    id: 'ACH_10_SHIPS',
    name: '베테랑 조선사',
    description: '총 10척의 선박을 건조하세요',
    category: 'MILESTONE',
    rarity: 'UNCOMMON',
    condition: (state: GameState) => state.totalShipsBuilt >= 10,
    reward: {
      cash: 5_000_000,
      reputation: 5,
    },
  },
  {
    id: 'ACH_50_SHIPS',
    name: '조선 거장',
    description: '총 50척의 선박을 건조하세요',
    category: 'MILESTONE',
    rarity: 'RARE',
    condition: (state: GameState) => state.totalShipsBuilt >= 50,
    reward: {
      cash: 25_000_000,
      reputation: 10,
    },
  },
  {
    id: 'ACH_100_SHIPS',
    name: '세기의 조선소',
    description: '총 100척의 선박을 건조하세요',
    category: 'MILESTONE',
    rarity: 'EPIC',
    condition: (state: GameState) => state.totalShipsBuilt >= 100,
    reward: {
      cash: 100_000_000,
      reputation: 20,
    },
  },

  // ===== 생산 업적 =====
  {
    id: 'ACH_FULL_DOCKS',
    name: '풀가동',
    description: '모든 도크를 동시에 가동하세요',
    category: 'PRODUCTION',
    rarity: 'COMMON',
    condition: (state: GameState) => {
      const occupiedDocks = state.docks.filter(d => d.status === 'OCCUPIED').length;
      return occupiedDocks === state.docks.length && state.docks.length > 0;
    },
    reward: {
      reputation: 3,
    },
  },
  {
    id: 'ACH_5_DOCKS',
    name: '대형 조선소',
    description: '도크를 5개 이상 보유하세요',
    category: 'PRODUCTION',
    rarity: 'UNCOMMON',
    condition: (state: GameState) => state.docks.length >= 5,
    reward: {
      cash: 10_000_000,
      reputation: 5,
    },
  },
  {
    id: 'ACH_10_DOCKS',
    name: '메가 야드',
    description: '도크를 10개 이상 보유하세요',
    category: 'PRODUCTION',
    rarity: 'RARE',
    condition: (state: GameState) => state.docks.length >= 10,
    reward: {
      cash: 50_000_000,
      reputation: 10,
    },
  },
  {
    id: 'ACH_HIGH_EFFICIENCY',
    name: '효율의 달인',
    description: '모든 도크의 효율을 90% 이상으로 유지하세요',
    category: 'PRODUCTION',
    rarity: 'EPIC',
    condition: (state: GameState) => {
      return state.docks.length > 0 && state.docks.every(d => d.efficiency >= 0.9);
    },
    reward: {
      reputation: 15,
    },
  },

  // ===== 재무 업적 =====
  {
    id: 'ACH_CASH_100M',
    name: '백만장자',
    description: '현금 1억 달러를 보유하세요',
    category: 'FINANCIAL',
    rarity: 'UNCOMMON',
    condition: (state: GameState) => state.financials.cash >= 100_000_000,
    reward: {
      reputation: 5,
    },
  },
  {
    id: 'ACH_CASH_500M',
    name: '억만장자',
    description: '현금 5억 달러를 보유하세요',
    category: 'FINANCIAL',
    rarity: 'RARE',
    condition: (state: GameState) => state.financials.cash >= 500_000_000,
    reward: {
      reputation: 10,
    },
  },
  {
    id: 'ACH_CASH_1B',
    name: '재벌',
    description: '현금 10억 달러를 보유하세요',
    category: 'FINANCIAL',
    rarity: 'EPIC',
    condition: (state: GameState) => state.financials.cash >= 1_000_000_000,
    reward: {
      reputation: 20,
    },
  },
  {
    id: 'ACH_DEBT_FREE',
    name: '무부채 경영',
    description: '모든 부채를 상환하세요',
    category: 'FINANCIAL',
    rarity: 'UNCOMMON',
    condition: (state: GameState) =>
      state.financials.shortTermDebt === 0 && state.financials.longTermDebt === 0,
    reward: {
      cash: 20_000_000,
      reputation: 10,
    },
  },
  {
    id: 'ACH_PROFITABLE_YEAR',
    name: '흑자의 기쁨',
    description: '순이익 1천만 달러 이상을 달성하세요',
    category: 'FINANCIAL',
    rarity: 'COMMON',
    condition: (state: GameState) => state.financials.netIncome >= 10_000_000,
    reward: {
      reputation: 3,
    },
  },
  {
    id: 'ACH_SUPER_PROFIT',
    name: '슈퍼 이익',
    description: '순이익 1억 달러 이상을 달성하세요',
    category: 'FINANCIAL',
    rarity: 'EPIC',
    condition: (state: GameState) => state.financials.netIncome >= 100_000_000,
    reward: {
      cash: 50_000_000,
      reputation: 15,
    },
  },

  // ===== 평판 업적 =====
  {
    id: 'ACH_REP_70',
    name: '좋은 평판',
    description: '평판 70 이상을 달성하세요',
    category: 'REPUTATION',
    rarity: 'COMMON',
    condition: (state: GameState) => state.reputation >= 70,
    reward: {
      cash: 5_000_000,
    },
  },
  {
    id: 'ACH_REP_90',
    name: '훌륭한 평판',
    description: '평판 90 이상을 달성하세요',
    category: 'REPUTATION',
    rarity: 'RARE',
    condition: (state: GameState) => state.reputation >= 90,
    reward: {
      cash: 20_000_000,
    },
  },
  {
    id: 'ACH_REP_100',
    name: '완벽한 평판',
    description: '평판 100을 달성하세요',
    category: 'REPUTATION',
    rarity: 'LEGENDARY',
    condition: (state: GameState) => state.reputation >= 100,
    reward: {
      cash: 100_000_000,
      reputation: 0,
      message: '당신의 조선소는 세계에서 가장 신뢰받는 회사입니다!',
    },
  },

  // ===== 연구 업적 =====
  {
    id: 'ACH_FIRST_RESEARCH',
    name: '연구의 시작',
    description: '첫 번째 연구를 완료하세요',
    category: 'RESEARCH',
    rarity: 'COMMON',
    condition: (state: GameState) =>
      state.researchProjects.filter(p => p.status === 'COMPLETED').length >= 1,
    reward: {
      reputation: 2,
    },
  },
  {
    id: 'ACH_5_RESEARCH',
    name: '혁신가',
    description: '5개의 연구를 완료하세요',
    category: 'RESEARCH',
    rarity: 'UNCOMMON',
    condition: (state: GameState) =>
      state.researchProjects.filter(p => p.status === 'COMPLETED').length >= 5,
    reward: {
      cash: 10_000_000,
      reputation: 5,
    },
  },
  {
    id: 'ACH_ALL_RESEARCH',
    name: '기술의 정점',
    description: '모든 연구를 완료하세요',
    category: 'RESEARCH',
    rarity: 'LEGENDARY',
    condition: (state: GameState) =>
      state.researchProjects.filter(p => p.status === 'COMPLETED').length >= 16,
    reward: {
      cash: 200_000_000,
      reputation: 30,
      message: '최첨단 기술을 모두 보유한 세계 최고의 조선소입니다!',
    },
  },

  // ===== 시장 업적 =====
  {
    id: 'ACH_MARKET_5',
    name: '시장 진입',
    description: '시장 점유율 5% 이상을 달성하세요',
    category: 'MARKET',
    rarity: 'UNCOMMON',
    condition: (state: GameState) => state.marketShare >= 5,
    reward: {
      cash: 10_000_000,
      reputation: 5,
    },
  },
  {
    id: 'ACH_MARKET_15',
    name: '주요 플레이어',
    description: '시장 점유율 15% 이상을 달성하세요',
    category: 'MARKET',
    rarity: 'RARE',
    condition: (state: GameState) => state.marketShare >= 15,
    reward: {
      cash: 50_000_000,
      reputation: 10,
    },
  },
  {
    id: 'ACH_MARKET_30',
    name: '시장 지배자',
    description: '시장 점유율 30% 이상을 달성하세요',
    category: 'MARKET',
    rarity: 'LEGENDARY',
    condition: (state: GameState) => state.marketShare >= 30,
    reward: {
      cash: 300_000_000,
      reputation: 25,
      message: '글로벌 시장을 지배하는 조선소가 되었습니다!',
    },
  },

  // ===== 특수 업적 =====
  {
    id: 'ACH_HARD_MODE',
    name: '하드코어',
    description: '어려움 난이도에서 게임을 시작하세요',
    category: 'SPECIAL',
    rarity: 'RARE',
    condition: (state: GameState) => state.difficulty === 'HARD',
    reward: {
      reputation: 10,
    },
  },
  {
    id: 'ACH_EXPERT_MODE',
    name: '전설의 시작',
    description: '전문가 난이도에서 게임을 시작하세요',
    category: 'SPECIAL',
    rarity: 'LEGENDARY',
    condition: (state: GameState) => state.difficulty === 'EXPERT',
    reward: {
      reputation: 20,
    },
  },
  {
    id: 'ACH_EXPERT_SURVIVOR',
    name: '불가능을 이루다',
    description: '전문가 난이도에서 평판 80 이상 달성',
    category: 'SPECIAL',
    rarity: 'LEGENDARY',
    condition: (state: GameState) => state.difficulty === 'EXPERT' && state.reputation >= 80,
    reward: {
      cash: 500_000_000,
      reputation: 30,
      message: '당신은 진정한 조선업의 전설입니다!',
    },
    hidden: true,
  },
];

/**
 * ID로 업적 찾기
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * 카테고리별 업적 필터링
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * 희귀도별 업적 필터링
 */
export function getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.rarity === rarity);
}
