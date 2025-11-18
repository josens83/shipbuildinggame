import type { Competitor } from '../types';

/**
 * 게임 내 경쟁 조선소들
 * 실제 글로벌 조선소들을 참고하여 제작
 */
export const INITIAL_COMPETITORS: Competitor[] = [
  {
    id: 'COMP_HYUNDAI',
    name: 'Hyundai Heavy Industries',
    country: '대한민국',
    founded: 1972,
    reputation: 95,
    marketShare: 18,
    technology: 92,
    financialStrength: 88,
    totalDocks: 12,
    activeContracts: 28,
    shipsBuiltThisYear: 42,
    aggressiveness: 0.85,
    rndFocus: 0.8,
    expansionRate: 0.6,
    specialization: ['CONTAINER', 'LNG_CARRIER', 'OFFSHORE'],
  },
  {
    id: 'COMP_SAMSUNG',
    name: 'Samsung Heavy Industries',
    country: '대한민국',
    founded: 1974,
    reputation: 93,
    marketShare: 15,
    technology: 95,
    financialStrength: 90,
    totalDocks: 10,
    activeContracts: 24,
    shipsBuiltThisYear: 38,
    aggressiveness: 0.8,
    rndFocus: 0.9,
    expansionRate: 0.5,
    specialization: ['LNG_CARRIER', 'OFFSHORE', 'TANKER'],
  },
  {
    id: 'COMP_DSME',
    name: 'Daewoo Shipbuilding',
    country: '대한민국',
    founded: 1973,
    reputation: 88,
    marketShare: 12,
    technology: 87,
    financialStrength: 75,
    totalDocks: 9,
    activeContracts: 22,
    shipsBuiltThisYear: 35,
    aggressiveness: 0.75,
    rndFocus: 0.7,
    expansionRate: 0.4,
    specialization: ['LNG_CARRIER', 'TANKER', 'BULK_CARRIER'],
  },
  {
    id: 'COMP_IMABARI',
    name: 'Imabari Shipbuilding',
    country: '일본',
    founded: 1901,
    reputation: 90,
    marketShare: 10,
    technology: 85,
    financialStrength: 92,
    totalDocks: 15,
    activeContracts: 45,
    shipsBuiltThisYear: 68,
    aggressiveness: 0.7,
    rndFocus: 0.65,
    expansionRate: 0.7,
    specialization: ['BULK_CARRIER', 'CONTAINER', 'TANKER'],
  },
  {
    id: 'COMP_CSSC',
    name: 'China State Shipbuilding',
    country: '중국',
    founded: 1999,
    reputation: 82,
    marketShare: 22,
    technology: 78,
    financialStrength: 95,
    totalDocks: 25,
    activeContracts: 85,
    shipsBuiltThisYear: 125,
    aggressiveness: 0.9,
    rndFocus: 0.6,
    expansionRate: 0.9,
    specialization: ['CONTAINER', 'BULK_CARRIER', 'TANKER'],
  },
  {
    id: 'COMP_CSIC',
    name: 'China Shipbuilding Industry',
    country: '중국',
    founded: 1999,
    reputation: 80,
    marketShare: 16,
    technology: 75,
    financialStrength: 93,
    totalDocks: 20,
    activeContracts: 72,
    shipsBuiltThisYear: 98,
    aggressiveness: 0.85,
    rndFocus: 0.55,
    expansionRate: 0.85,
    specialization: ['BULK_CARRIER', 'CONTAINER', 'NAVY'],
  },
  {
    id: 'COMP_FINCANTIERI',
    name: 'Fincantieri',
    country: '이탈리아',
    founded: 1959,
    reputation: 91,
    marketShare: 5,
    technology: 90,
    financialStrength: 85,
    totalDocks: 8,
    activeContracts: 18,
    shipsBuiltThisYear: 22,
    aggressiveness: 0.6,
    rndFocus: 0.75,
    expansionRate: 0.4,
    specialization: ['CRUISE', 'NAVY', 'OFFSHORE'],
  },
  {
    id: 'COMP_MEYER',
    name: 'Meyer Werft',
    country: '독일',
    founded: 1795,
    reputation: 94,
    marketShare: 3,
    technology: 93,
    financialStrength: 88,
    totalDocks: 4,
    activeContracts: 12,
    shipsBuiltThisYear: 8,
    aggressiveness: 0.5,
    rndFocus: 0.85,
    expansionRate: 0.3,
    specialization: ['CRUISE'],
  },
];

/**
 * 경쟁사 ID로 경쟁사 찾기
 */
export function getCompetitorById(id: string): Competitor | undefined {
  return INITIAL_COMPETITORS.find(c => c.id === id);
}

/**
 * 특정 선종에 특화된 경쟁사 필터링
 */
export function getCompetitorsBySpecialization(shipType: string): Competitor[] {
  return INITIAL_COMPETITORS.filter(c =>
    c.specialization.includes(shipType as any)
  );
}

/**
 * 시장 점유율 상위 경쟁사
 */
export function getTopCompetitorsByMarketShare(limit: number = 5): Competitor[] {
  return [...INITIAL_COMPETITORS]
    .sort((a, b) => b.marketShare - a.marketShare)
    .slice(0, limit);
}
