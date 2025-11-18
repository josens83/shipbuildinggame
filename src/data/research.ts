import type { Research } from '../types';

/**
 * 게임에서 사용 가능한 모든 연구 기술
 */
export const AVAILABLE_RESEARCH: Research[] = [
  // ===== 생산 효율 연구 =====
  {
    id: 'RESEARCH_WELDING_AUTO',
    name: '자동 용접 시스템',
    category: 'PRODUCTION',
    description: '로봇 용접 시스템을 도입하여 생산 효율을 향상시킵니다.',
    cost: 10,
    duration: 60,
    requiredReputation: 40,
    effects: {
      dockEfficiency: 10, // +10% 효율
    },
  },
  {
    id: 'RESEARCH_BLOCK_ASSEMBLY',
    name: '블록 조립 자동화',
    category: 'AUTOMATION',
    description: '대형 블록 조립 공정을 자동화하여 속도를 높입니다.',
    cost: 15,
    duration: 90,
    requiredReputation: 50,
    prerequisiteIds: ['RESEARCH_WELDING_AUTO'],
    effects: {
      dockEfficiency: 15,
      buildSpeedBonus: 10,
    },
  },
  {
    id: 'RESEARCH_LEAN_MANUFACTURING',
    name: '린 생산 시스템',
    category: 'PRODUCTION',
    description: '낭비를 제거하고 효율적인 생산 프로세스를 구축합니다.',
    cost: 8,
    duration: 45,
    requiredReputation: 35,
    effects: {
      costReduction: 8,
      dockEfficiency: 5,
    },
  },

  // ===== 품질 관리 연구 =====
  {
    id: 'RESEARCH_QUALITY_CONTROL',
    name: '통합 품질 관리 시스템',
    category: 'QUALITY',
    description: 'ISO 9001 기반의 통합 품질 관리 시스템을 구축합니다.',
    cost: 12,
    duration: 60,
    requiredReputation: 45,
    effects: {
      qualityBonus: 15,
      reputationBonus: 5,
    },
  },
  {
    id: 'RESEARCH_NDT',
    name: '비파괴 검사 기술',
    category: 'QUALITY',
    description: '초음파 및 X-ray 검사 장비로 용접 품질을 향상시킵니다.',
    cost: 10,
    duration: 50,
    requiredReputation: 40,
    effects: {
      qualityBonus: 20,
      reputationBonus: 3,
    },
  },
  {
    id: 'RESEARCH_DIGITAL_TWIN',
    name: '디지털 트윈 시스템',
    category: 'QUALITY',
    description: '디지털 트윈 기술로 설계부터 건조까지 사전 검증합니다.',
    cost: 25,
    duration: 120,
    requiredReputation: 65,
    prerequisiteIds: ['RESEARCH_QUALITY_CONTROL'],
    effects: {
      qualityBonus: 25,
      costReduction: 10,
      buildSpeedBonus: 15,
    },
  },

  // ===== 원가 절감 연구 =====
  {
    id: 'RESEARCH_MATERIAL_OPTIMIZATION',
    name: '자재 최적화',
    category: 'COST',
    description: '강재 절단 최적화로 자재 낭비를 줄입니다.',
    cost: 7,
    duration: 40,
    requiredReputation: 30,
    effects: {
      costReduction: 10,
    },
  },
  {
    id: 'RESEARCH_ENERGY_EFFICIENCY',
    name: '에너지 효율화',
    category: 'COST',
    description: '친환경 에너지 시스템으로 운영 비용을 절감합니다.',
    cost: 15,
    duration: 70,
    requiredReputation: 45,
    effects: {
      costReduction: 12,
    },
  },
  {
    id: 'RESEARCH_SUPPLY_CHAIN',
    name: '공급망 통합 시스템',
    category: 'COST',
    description: 'JIT(Just-In-Time) 방식으로 재고 비용을 최소화합니다.',
    cost: 10,
    duration: 55,
    requiredReputation: 40,
    effects: {
      costReduction: 15,
    },
  },

  // ===== 건조 속도 연구 =====
  {
    id: 'RESEARCH_MODULAR_CONSTRUCTION',
    name: '모듈러 건조 공법',
    category: 'SPEED',
    description: '사전 제작 모듈로 건조 기간을 단축합니다.',
    cost: 18,
    duration: 80,
    requiredReputation: 50,
    effects: {
      buildSpeedBonus: 20,
      dockEfficiency: 10,
    },
  },
  {
    id: 'RESEARCH_PARALLEL_PROCESSING',
    name: '병렬 공정 시스템',
    category: 'SPEED',
    description: '여러 블록을 동시에 제작하여 시간을 절약합니다.',
    cost: 12,
    duration: 65,
    requiredReputation: 45,
    effects: {
      buildSpeedBonus: 15,
    },
  },

  // ===== 안전 관리 연구 =====
  {
    id: 'RESEARCH_SAFETY_SYSTEM',
    name: '스마트 안전 관리',
    category: 'SAFETY',
    description: 'IoT 센서 기반 실시간 안전 모니터링 시스템입니다.',
    cost: 8,
    duration: 50,
    requiredReputation: 35,
    effects: {
      workerSafety: 20,
      reputationBonus: 3,
    },
  },
  {
    id: 'RESEARCH_ERGONOMICS',
    name: '인간공학 작업환경',
    category: 'SAFETY',
    description: '작업자 중심의 환경 개선으로 생산성과 안전을 향상시킵니다.',
    cost: 10,
    duration: 60,
    requiredReputation: 40,
    prerequisiteIds: ['RESEARCH_SAFETY_SYSTEM'],
    effects: {
      workerSafety: 15,
      dockEfficiency: 8,
    },
  },

  // ===== 고급 자동화 연구 =====
  {
    id: 'RESEARCH_AI_PLANNING',
    name: 'AI 생산 계획',
    category: 'AUTOMATION',
    description: 'AI 기반 최적 생산 스케줄링 시스템입니다.',
    cost: 20,
    duration: 100,
    requiredReputation: 60,
    prerequisiteIds: ['RESEARCH_LEAN_MANUFACTURING'],
    effects: {
      dockEfficiency: 20,
      buildSpeedBonus: 15,
      costReduction: 10,
    },
  },
  {
    id: 'RESEARCH_SMART_FACTORY',
    name: '스마트 팩토리',
    category: 'AUTOMATION',
    description: '완전 통합된 스마트 조선소 시스템을 구축합니다.',
    cost: 50,
    duration: 180,
    requiredReputation: 75,
    prerequisiteIds: ['RESEARCH_AI_PLANNING', 'RESEARCH_DIGITAL_TWIN'],
    effects: {
      dockEfficiency: 30,
      buildSpeedBonus: 25,
      costReduction: 20,
      qualityBonus: 20,
      reputationBonus: 10,
    },
  },
];

/**
 * ID로 연구 찾기
 */
export function getResearchById(id: string): Research | undefined {
  return AVAILABLE_RESEARCH.find(r => r.id === id);
}

/**
 * 카테고리별 연구 필터링
 */
export function getResearchByCategory(category: Research['category']): Research[] {
  return AVAILABLE_RESEARCH.filter(r => r.category === category);
}
