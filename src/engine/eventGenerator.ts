import type { GameEvent } from '../types';

export class EventGenerator {
  private static eventCounter = 0;

  /**
   * 랜덤 이벤트 생성 (확률 기반)
   */
  static generateRandomEvent(currentDate: Date): GameEvent | null {
    // 10% 확률로 이벤트 발생
    if (Math.random() > 0.1) return null;

    const eventTypes = [
      this.createMarketEvent,
      this.createFinanceEvent,
      this.createProductionEvent,
      this.createCustomerEvent,
    ];

    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    return randomType.call(this, currentDate);
  }

  /**
   * 시장 관련 이벤트
   */
  private static createMarketEvent(currentDate: Date): GameEvent {
    this.eventCounter++;

    const events = [
      {
        title: '유가 급등',
        description: '국제 유가가 급등하면서 유조선 수요가 증가하고 있습니다. 향후 6개월간 유조선 계약이 20% 증가할 것으로 예상됩니다.',
      },
      {
        title: '조선 경기 호황',
        description: '글로벌 해운 물동량 증가로 조선 경기가 활황입니다. 새로운 입찰 기회가 증가하고 있습니다.',
      },
      {
        title: '환율 변동',
        description: '달러 환율이 급변동하고 있습니다. 해외 수주 계약 시 환차익/환차손에 주의하세요.',
      },
      {
        title: 'LNG 시장 확대',
        description: '친환경 에너지 수요 증가로 LNG선 발주가 늘고 있습니다. LNG선 시장 진출을 고려해보세요.',
      },
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    return {
      id: `EVENT_MARKET_${this.eventCounter}`,
      type: 'MARKET',
      title: event.title,
      description: event.description,
      date: currentDate,
    };
  }

  /**
   * 재무 관련 이벤트
   */
  private static createFinanceEvent(currentDate: Date): GameEvent {
    this.eventCounter++;

    const events = [
      {
        title: '금리 인하',
        description: '중앙은행이 기준금리를 인하했습니다. 대출 이자 부담이 감소합니다.',
      },
      {
        title: '금리 인상',
        description: '중앙은행이 기준금리를 인상했습니다. 대출 이자 부담이 증가할 예정입니다.',
      },
      {
        title: '정부 지원금',
        description: '조선업 경쟁력 강화를 위한 정부 지원금을 받았습니다. (+$5M)',
      },
      {
        title: '세금 감면',
        description: '조선업 활성화를 위한 세금 감면 혜택을 받았습니다.',
      },
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    return {
      id: `EVENT_FINANCE_${this.eventCounter}`,
      type: 'FINANCE',
      title: event.title,
      description: event.description,
      date: currentDate,
    };
  }

  /**
   * 생산 관련 이벤트
   */
  private static createProductionEvent(currentDate: Date): GameEvent {
    this.eventCounter++;

    const events = [
      {
        title: '근로자 파업',
        description: '임금 협상 결렬로 근로자들이 파업을 진행 중입니다. 생산 효율이 일시적으로 감소합니다.',
      },
      {
        title: '설비 고장',
        description: '주요 생산 설비에 고장이 발생했습니다. 긴급 수리가 필요합니다.',
      },
      {
        title: '기술 혁신',
        description: '새로운 용접 기술을 도입하여 생산 효율이 향상되었습니다! (+10% 효율)',
      },
      {
        title: '품질 인증 획득',
        description: '국제 품질 인증을 획득했습니다. 회사 평판이 상승합니다.',
      },
      {
        title: '안전사고 발생',
        description: '작업장에서 안전사고가 발생했습니다. 안전 교육과 보상이 필요합니다.',
      },
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    return {
      id: `EVENT_PRODUCTION_${this.eventCounter}`,
      type: 'PRODUCTION',
      title: event.title,
      description: event.description,
      date: currentDate,
    };
  }

  /**
   * 고객 관련 이벤트
   */
  private static createCustomerEvent(currentDate: Date): GameEvent {
    this.eventCounter++;

    const events = [
      {
        title: '고객사 추가 발주',
        description: '기존 고객사가 만족하여 추가 선박을 발주하고 싶어합니다.',
      },
      {
        title: '고객사 재무 악화',
        description: '주요 고객사의 재무 상태가 악화되었습니다. 계약 이행에 주의가 필요합니다.',
      },
      {
        title: 'VIP 고객 방문',
        description: '유명 해운사 CEO가 조선소를 방문합니다. 좋은 인상을 남기면 대형 계약 기회가 있습니다.',
      },
      {
        title: '클레임 발생',
        description: '인도한 선박에서 품질 문제가 발견되었습니다. 신속한 대응이 필요합니다.',
      },
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    return {
      id: `EVENT_CUSTOMER_${this.eventCounter}`,
      type: 'CONTRACT',
      title: event.title,
      description: event.description,
      date: currentDate,
    };
  }

  /**
   * 특정 이벤트 생성 (스토리 진행용)
   */
  static createSpecificEvent(
    type: 'CONTRACT' | 'FINANCE' | 'PRODUCTION' | 'MARKET' | 'RANDOM',
    title: string,
    description: string,
    currentDate: Date
  ): GameEvent {
    this.eventCounter++;

    return {
      id: `EVENT_CUSTOM_${this.eventCounter}`,
      type,
      title,
      description,
      date: currentDate,
    };
  }
}
