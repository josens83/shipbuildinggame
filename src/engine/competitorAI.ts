import type { Competitor, Contract, ShipSpecification } from '../types';

/**
 * 경쟁사 AI 엔진
 * 경쟁사의 입찰 참여, 가격 결정, 성장 시뮬레이션
 */
export class CompetitorAI {
  /**
   * 경쟁사가 특정 입찰에 참여할지 결정
   */
  static shouldParticipateInBid(
    competitor: Competitor,
    shipSpec: ShipSpecification
  ): boolean {
    // 전문 분야인 경우 80% 확률로 참여
    if (competitor.specialization.includes(shipSpec.type)) {
      return Math.random() < 0.8;
    }

    // 비전문 분야는 공격성에 따라 결정
    return Math.random() < competitor.aggressiveness * 0.5;
  }

  /**
   * 경쟁사의 입찰 가격 계산
   */
  static calculateBidPrice(
    competitor: Competitor,
    shipSpec: ShipSpecification,
    playerBidPrice?: number
  ): number {
    const baseCost = shipSpec.estimatedCost;

    // 전문 분야 여부에 따른 원가 효율
    const isSpecialized = competitor.specialization.includes(shipSpec.type);
    const costEfficiency = isSpecialized ? 0.85 : 0.95;

    // 기술력에 따른 원가 절감 (기술력 100 = 추가 10% 절감)
    const techBonus = 1 - (competitor.technology / 100) * 0.1;

    // 실제 원가 계산
    const actualCost = baseCost * costEfficiency * techBonus;

    // 이익률 결정 (공격성이 높을수록 낮은 이익률)
    const baseMargin = 1.15; // 기본 15% 이익
    const aggressivenessDiscount = competitor.aggressiveness * 0.1; // 최대 10% 할인
    const margin = baseMargin - aggressivenessDiscount;

    let bidPrice = actualCost * margin;

    // 플레이어 입찰가가 있고 공격성이 높으면 플레이어보다 살짝 낮게 입찰
    if (playerBidPrice && Math.random() < competitor.aggressiveness) {
      const undercutAmount = playerBidPrice * (0.02 + Math.random() * 0.03); // 2-5% 언더컷
      bidPrice = Math.min(bidPrice, playerBidPrice - undercutAmount);
    }

    return Math.round(bidPrice * 100) / 100;
  }

  /**
   * 경쟁사 간 입찰 경쟁 시뮬레이션
   * 반환: 입찰에 성공한 경쟁사 ID (또는 null)
   */
  static simulateBidCompetition(
    competitors: Competitor[],
    contract: Contract
  ): string | null {
    const participants: Array<{ competitorId: string; bidPrice: number; score: number }> = [];

    // 각 경쟁사의 입찰 참여 여부 및 가격 결정
    for (const competitor of competitors) {
      if (this.shouldParticipateInBid(competitor, contract.shipSpec)) {
        const bidPrice = this.calculateBidPrice(competitor, contract.shipSpec);

        // 입찰 점수 계산 (낮은 가격 + 높은 평판)
        const priceScore = (contract.shipSpec.estimatedCost * 1.2 - bidPrice) * 10;
        const reputationScore = competitor.reputation * 2;
        const techScore = competitor.technology;
        const totalScore = priceScore + reputationScore + techScore;

        participants.push({
          competitorId: competitor.id,
          bidPrice,
          score: totalScore,
        });
      }
    }

    // 참여자가 없으면 null 반환
    if (participants.length === 0) {
      return null;
    }

    // 점수가 가장 높은 경쟁사 선택 (확률적 요소 추가)
    participants.sort((a, b) => b.score - a.score);

    // 1위가 70% 확률로 낙찰, 2위가 20%, 3위가 10%
    const rand = Math.random();
    if (rand < 0.7 && participants[0]) {
      return participants[0].competitorId;
    } else if (rand < 0.9 && participants[1]) {
      return participants[1].competitorId;
    } else if (participants[2]) {
      return participants[2].competitorId;
    }

    return participants[0]?.competitorId || null;
  }

  /**
   * 경쟁사 성장 시뮬레이션 (월별 업데이트)
   */
  static updateCompetitorGrowth(competitor: Competitor): Competitor {
    const updated = { ...competitor };

    // 연구 집중도에 따른 기술력 향상 (연간 최대 5%)
    if (Math.random() < competitor.rndFocus / 12) {
      updated.technology = Math.min(100, competitor.technology + 0.4);
    }

    // 확장 속도에 따른 도크 증가 (연간 최대 20% 증가)
    if (Math.random() < competitor.expansionRate / 12) {
      updated.totalDocks += 1;
    }

    // 활성 계약 수 변동 (랜덤)
    const contractChange = Math.floor((Math.random() - 0.5) * 6);
    updated.activeContracts = Math.max(
      0,
      Math.min(competitor.totalDocks * 3, competitor.activeContracts + contractChange)
    );

    // 평판 변동 (성과에 따라)
    const performanceRatio = competitor.activeContracts / (competitor.totalDocks * 2);
    if (performanceRatio > 1.2) {
      updated.reputation = Math.min(100, competitor.reputation + 0.2);
    } else if (performanceRatio < 0.5) {
      updated.reputation = Math.max(0, competitor.reputation - 0.2);
    }

    // 시장 점유율 조정 (미세한 변동)
    const marketChange = (Math.random() - 0.5) * 0.3;
    updated.marketShare = Math.max(0, Math.min(30, competitor.marketShare + marketChange));

    // 연간 건조 선박 수 누적
    if (Math.random() < 0.08) {
      // 월별 약 8% 확률로 선박 완성
      updated.shipsBuiltThisYear += 1;
    }

    return updated;
  }

  /**
   * 경쟁사가 계약 수주 시 상태 업데이트
   */
  static updateCompetitorOnContractWon(competitor: Competitor): Competitor {
    return {
      ...competitor,
      activeContracts: competitor.activeContracts + 1,
      reputation: Math.min(100, competitor.reputation + 0.1),
    };
  }

  /**
   * 전체 시장 점유율 정규화 (플레이어 포함)
   * 모든 조선소의 시장 점유율 합이 100이 되도록 조정
   */
  static normalizeMarketShare(
    competitors: Competitor[],
    playerMarketShare: number
  ): { competitors: Competitor[]; playerMarketShare: number } {
    const totalMarketShare =
      competitors.reduce((sum, c) => sum + c.marketShare, 0) + playerMarketShare;

    if (totalMarketShare === 0) {
      return { competitors, playerMarketShare };
    }

    const factor = 100 / totalMarketShare;

    return {
      competitors: competitors.map(c => ({
        ...c,
        marketShare: c.marketShare * factor,
      })),
      playerMarketShare: playerMarketShare * factor,
    };
  }
}
