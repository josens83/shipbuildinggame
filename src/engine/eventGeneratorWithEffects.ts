import type { GameEvent } from '../types';

/**
 * 게임 스토어와 연동되는 이벤트 생성기
 */
export class EventGeneratorWithEffects {
  /**
   * 재무 이벤트: 정부 지원금
   */
  static createGovernmentSubsidyEvent(currentDate: Date, increaseCash: (amount: number) => void): GameEvent {
    return {
      id: `EVENT_SUBSIDY_${Date.now()}`,
      type: 'FINANCE',
      title: '정부 조선업 지원금',
      description: '정부가 조선업 경쟁력 강화를 위한 지원금을 지급합니다. 지원금을 받으시겠습니까?',
      date: currentDate,
      choices: [
        {
          text: '지원금 수령 (+$5M)',
          effect: () => {
            increaseCash(5);
          },
        },
        {
          text: '사양 (평판 +5)',
          effect: () => {
            // 평판 증가는 나중에 구현
          },
        },
      ],
    };
  }

  /**
   * 생산 이벤트: 설비 투자
   */
  static createEquipmentInvestmentEvent(
    currentDate: Date,
    increaseDockEfficiency: () => void,
    decreaseCash: (amount: number) => void
  ): GameEvent {
    return {
      id: `EVENT_EQUIPMENT_${Date.now()}`,
      type: 'PRODUCTION',
      title: '최신 용접 설비 도입 기회',
      description: '최신 자동화 용접 설비를 도입하면 모든 도크의 생산 효율이 10% 향상됩니다. 비용은 $10M입니다.',
      date: currentDate,
      choices: [
        {
          text: '설비 구매 (-$10M, 효율 +10%)',
          effect: () => {
            decreaseCash(10);
            increaseDockEfficiency();
          },
        },
        {
          text: '나중에',
          effect: () => {
            // 아무 효과 없음
          },
        },
      ],
    };
  }

  /**
   * 시장 이벤트: 특별 발주
   */
  static createSpecialOrderEvent(
    currentDate: Date,
    generateSpecialBid: () => void
  ): GameEvent {
    return {
      id: `EVENT_SPECIAL_ORDER_${Date.now()}`,
      type: 'MARKET',
      title: 'VIP 고객 특별 발주',
      description: '세계적인 해운사가 귀사에 특별 관심을 보이고 있습니다. 프리미엄 가격의 선박 발주를 받을 수 있습니다.',
      date: currentDate,
      choices: [
        {
          text: '특별 입찰 참여',
          effect: () => {
            generateSpecialBid();
          },
        },
        {
          text: '거절',
          effect: () => {
            // 아무 효과 없음
          },
        },
      ],
    };
  }

  /**
   * 생산 이벤트: 근로자 파업
   */
  static createLaborStrikeEvent(
    currentDate: Date,
    decreaseMorale: () => void,
    increaseMorale: () => void,
    decreaseCash: (amount: number) => void
  ): GameEvent {
    return {
      id: `EVENT_STRIKE_${Date.now()}`,
      type: 'PRODUCTION',
      title: '근로자 파업 발생',
      description: '임금 인상을 요구하는 근로자들이 파업을 시작했습니다. 어떻게 대응하시겠습니까?',
      date: currentDate,
      choices: [
        {
          text: '임금 인상 수용 (-$2M, 사기 +10)',
          effect: () => {
            decreaseCash(2);
            increaseMorale();
          },
        },
        {
          text: '협상 시도 (사기 -5)',
          effect: () => {
            decreaseMorale();
          },
        },
      ],
    };
  }

  /**
   * 재무 이벤트: 금리 변동
   */
  static createInterestRateEvent(currentDate: Date): GameEvent {
    const isIncrease = Math.random() > 0.5;

    return {
      id: `EVENT_INTEREST_${Date.now()}`,
      type: 'FINANCE',
      title: isIncrease ? '금리 인상' : '금리 인하',
      description: isIncrease
        ? '중앙은행이 기준금리를 인상했습니다. 대출 이자 부담이 증가합니다.'
        : '중앙은행이 기준금리를 인하했습니다. 대출 이자 부담이 감소합니다.',
      date: currentDate,
      // 선택지 없음 - 자동 적용
    };
  }

  /**
   * 계약 이벤트: 품질 클레임
   */
  static createQualityClaimEvent(
    currentDate: Date,
    decreaseCash: (amount: number) => void,
    decreaseReputation: () => void
  ): GameEvent {
    return {
      id: `EVENT_CLAIM_${Date.now()}`,
      type: 'CONTRACT',
      title: '품질 클레임 발생',
      description: '인도한 선박에서 품질 문제가 발견되었습니다. 고객사가 배상을 요구하고 있습니다.',
      date: currentDate,
      choices: [
        {
          text: '전액 배상 (-$3M)',
          effect: () => {
            decreaseCash(3);
          },
        },
        {
          text: '부분 배상 (-$1M, 평판 -10)',
          effect: () => {
            decreaseCash(1);
            decreaseReputation();
          },
        },
      ],
    };
  }

  /**
   * 시장 이벤트: 경쟁사 부도
   */
  static createCompetitorBankruptcyEvent(
    currentDate: Date,
    increaseMarketShare: () => void
  ): GameEvent {
    return {
      id: `EVENT_COMPETITOR_${Date.now()}`,
      type: 'MARKET',
      title: '경쟁사 부도',
      description: '주요 경쟁 조선소가 부도 처리되었습니다. 시장 점유율을 확대할 기회입니다!',
      date: currentDate,
      choices: [
        {
          text: '적극 영업 활동 (시장 점유율 +5%)',
          effect: () => {
            increaseMarketShare();
          },
        },
        {
          text: '현상 유지',
          effect: () => {
            // 아무 효과 없음
          },
        },
      ],
    };
  }
}
