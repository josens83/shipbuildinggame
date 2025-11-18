import type { Difficulty } from '../types';

/**
 * 난이도별 게임 설정
 */
export interface DifficultySettings {
  // 초기 자금
  initialCash: number;
  initialDebt: number;
  initialEquity: number;

  // 초기 자원
  initialDocks: number;
  initialReputation: number;
  initialMarketShare: number;

  // 게임 난이도 조정자
  competitorAggressiveness: number; // 경쟁사 공격성 배율
  eventFrequency: number; // 이벤트 발생 확률 배율
  researchCostMultiplier: number; // 연구 비용 배율
  loanInterestRate: number; // 대출 이자율 (연)

  // 게임플레이 조정
  bidSuccessBonus: number; // 입찰 성공률 보너스
  profitMarginBonus: number; // 이익률 보너스
  workerCostMultiplier: number; // 인건비 배율
}

/**
 * 난이도별 세팅 값
 */
const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultySettings> = {
  EASY: {
    initialCash: 100_000_000, // 1억 달러
    initialDebt: 30_000_000, // 3천만 달러
    initialEquity: 150_000_000, // 1.5억 달러
    initialDocks: 3,
    initialReputation: 60,
    initialMarketShare: 2,
    competitorAggressiveness: 0.7, // 경쟁사 70% 공격성
    eventFrequency: 0.5, // 이벤트 절반만 발생
    researchCostMultiplier: 0.8, // 연구 비용 20% 할인
    loanInterestRate: 0.04, // 연 4%
    bidSuccessBonus: 10, // +10% 입찰 성공률
    profitMarginBonus: 0.05, // +5% 이익률
    workerCostMultiplier: 0.9, // 인건비 10% 할인
  },
  NORMAL: {
    initialCash: 50_000_000, // 5천만 달러
    initialDebt: 50_000_000, // 5천만 달러
    initialEquity: 100_000_000, // 1억 달러
    initialDocks: 2,
    initialReputation: 50,
    initialMarketShare: 0,
    competitorAggressiveness: 1.0, // 기본
    eventFrequency: 1.0, // 기본
    researchCostMultiplier: 1.0, // 기본
    loanInterestRate: 0.06, // 연 6%
    bidSuccessBonus: 0,
    profitMarginBonus: 0,
    workerCostMultiplier: 1.0,
  },
  HARD: {
    initialCash: 30_000_000, // 3천만 달러
    initialDebt: 70_000_000, // 7천만 달러
    initialEquity: 80_000_000, // 8천만 달러
    initialDocks: 2,
    initialReputation: 40,
    initialMarketShare: 0,
    competitorAggressiveness: 1.3, // 경쟁사 130% 공격성
    eventFrequency: 1.5, // 이벤트 50% 더 자주
    researchCostMultiplier: 1.2, // 연구 비용 20% 증가
    loanInterestRate: 0.08, // 연 8%
    bidSuccessBonus: -5, // -5% 입찰 성공률
    profitMarginBonus: -0.05, // -5% 이익률
    workerCostMultiplier: 1.1, // 인건비 10% 증가
  },
  EXPERT: {
    initialCash: 20_000_000, // 2천만 달러
    initialDebt: 80_000_000, // 8천만 달러
    initialEquity: 60_000_000, // 6천만 달러
    initialDocks: 1,
    initialReputation: 30,
    initialMarketShare: 0,
    competitorAggressiveness: 1.5, // 경쟁사 150% 공격성
    eventFrequency: 2.0, // 이벤트 2배 빈도
    researchCostMultiplier: 1.5, // 연구 비용 50% 증가
    loanInterestRate: 0.10, // 연 10%
    bidSuccessBonus: -10, // -10% 입찰 성공률
    profitMarginBonus: -0.10, // -10% 이익률
    workerCostMultiplier: 1.2, // 인건비 20% 증가
  },
};

/**
 * 난이도 설정 가져오기
 */
export function getDifficultySettings(difficulty: Difficulty): DifficultySettings {
  return DIFFICULTY_CONFIGS[difficulty];
}

/**
 * 난이도 설명
 */
export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  EASY: '초보자를 위한 쉬운 모드입니다. 충분한 자금과 낮은 경쟁 강도로 게임을 배울 수 있습니다.',
  NORMAL: '표준 난이도입니다. 현실적인 도전과 균형잡힌 게임플레이를 제공합니다.',
  HARD: '숙련된 플레이어를 위한 어려운 모드입니다. 제한된 자금과 강한 경쟁이 기다립니다.',
  EXPERT: '전문가만을 위한 극한의 도전입니다. 최소한의 자원으로 치열한 시장에서 살아남으세요.',
};

/**
 * 난이도 색상
 */
export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: 'green',
  NORMAL: 'blue',
  HARD: 'orange',
  EXPERT: 'red',
};

/**
 * 난이도 이름 (한글)
 */
export const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  EASY: '쉬움',
  NORMAL: '보통',
  HARD: '어려움',
  EXPERT: '전문가',
};
