import type { Contract, Customer, ShipSpecification } from '../types';
import { SHIP_SPECIFICATIONS } from '../data/ships';

export class BidGenerator {
  private static bidCounter = 0;

  /**
   * 새로운 입찰 기회 생성
   */
  static generateBids(
    customers: Customer[],
    currentDate: Date,
    count: number = 3
  ): Contract[] {
    const bids: Contract[] = [];
    const shipSpecs = Object.values(SHIP_SPECIFICATIONS);

    for (let i = 0; i < count; i++) {
      // 랜덤 고객 선택 (평판이 높을수록 확률 높음)
      const customer = this.selectWeightedCustomer(customers);

      // 고객 선호도에 맞는 선박 선택
      const shipSpec = this.selectShipForCustomer(customer, shipSpecs);

      // 계약 조건 생성
      const bid = this.createBid(customer, shipSpec, currentDate);
      bids.push(bid);
    }

    return bids;
  }

  private static selectWeightedCustomer(customers: Customer[]): Customer {
    const totalWeight = customers.reduce((sum, c) => sum + c.reputation, 0);
    let random = Math.random() * totalWeight;

    for (const customer of customers) {
      random -= customer.reputation;
      if (random <= 0) {
        return customer;
      }
    }

    return customers[0];
  }

  private static selectShipForCustomer(
    customer: Customer,
    shipSpecs: ShipSpecification[]
  ): ShipSpecification {
    // 고객의 신용등급에 따라 선박 크기 선호도 조정
    const creditScore = this.getCreditScore(customer.creditRating);

    // 높은 신용등급 = 큰 선박 선호
    const preferredComplexity = creditScore >= 4 ? [7, 8, 9, 10] : [3, 4, 5, 6];

    const suitableShips = shipSpecs.filter(s =>
      preferredComplexity.includes(s.complexity)
    );

    if (suitableShips.length === 0) {
      return shipSpecs[Math.floor(Math.random() * shipSpecs.length)];
    }

    return suitableShips[Math.floor(Math.random() * suitableShips.length)];
  }

  private static createBid(
    customer: Customer,
    shipSpec: ShipSpecification,
    currentDate: Date
  ): Contract {
    this.bidCounter++;

    // 기본 가격에 변동성 추가 (±10%)
    const priceVariation = 0.9 + Math.random() * 0.2;
    const estimatedPrice = shipSpec.estimatedCost * priceVariation;

    // 납기일 계산 (설계 기간 + 생산 기간)
    // 입찰은 설계 시작 전에 나오므로, 납기일 = 현재 + 설계기간 + 생산기간
    const totalDays = shipSpec.designDays + shipSpec.estimatedDays;
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(deliveryDate.getDate() + totalDays);

    // 입찰 마감일 (14일 ~ 30일 후, 선박 복잡도에 따라 다름)
    const deadlineDays = 14 + Math.floor(shipSpec.complexity * 1.5);
    const bidDeadline = new Date(currentDate);
    bidDeadline.setDate(bidDeadline.getDate() + deadlineDays);

    // 계약 조건 (신용등급에 따라 조정)
    const creditScore = this.getCreditScore(customer.creditRating);
    const downPayment = 10 + (creditScore * 2); // 10-20%

    return {
      id: `BID_${this.bidCounter}`,
      customerId: customer.id,
      shipSpec,
      status: 'BIDDING',
      contractPrice: estimatedPrice,
      downPayment,
      progressPayments: [20, 20, 20], // 중도금 3회
      finalPayment: 30,
      deliveryDate,
      bidDeadline, // 입찰 마감일 추가
      bidResult: 'PENDING', // 입찰 결과 초기값
      penaltyPerDay: estimatedPrice * 0.001, // 일당 0.1%
      progress: 0,
      totalCostIncurred: 0,
      profitMargin: 0.15 + (Math.random() * 0.1), // 15-25% 목표 이익률
    };
  }

  private static getCreditScore(rating: string): number {
    const scores: Record<string, number> = {
      'AAA': 6,
      'AA': 5,
      'A': 4,
      'BBB': 3,
      'BB': 2,
      'B': 1,
    };
    return scores[rating] || 1;
  }

  /**
   * 입찰 경쟁력 계산
   */
  static calculateBidCompetitiveness(
    bid: Contract,
    yourBidAmount: number,
    yourReputation: number,
    useBroker: boolean = false,
    brokerCommission: number = 1.0
  ): number {
    // 시장 평균 가격 대비 내 입찰가
    const priceRatio = yourBidAmount / bid.contractPrice;

    // 가격이 너무 높으면 불리, 너무 낮으면 의심
    let priceScore = 0;
    if (priceRatio < 0.9) {
      priceScore = 30; // 너무 낮음 - 품질 의심
    } else if (priceRatio < 1.0) {
      priceScore = 90; // 약간 낮음 - 최적
    } else if (priceRatio < 1.1) {
      priceScore = 70; // 약간 높음
    } else {
      priceScore = 40; // 너무 높음
    }

    // 평판 점수
    const reputationScore = yourReputation;

    // 브로커 보너스 (커미션이 높을수록 효과 증가)
    const brokerBonus = useBroker ? 15 * (brokerCommission / 1.0) : 0;

    // 종합 점수 (가격 60%, 평판 40%) + 브로커 보너스
    const totalScore = priceScore * 0.6 + reputationScore * 0.4 + brokerBonus;

    // 경쟁사 랜덤 요소 (운)
    const luck = 0.8 + Math.random() * 0.4;

    return totalScore * luck;
  }

  /**
   * 입찰 성공 여부 결정
   * @returns 'WON' | 'LOST' | 'DELAYED'
   */
  static determineBidResult(competitiveness: number): 'WON' | 'LOST' | 'DELAYED' {
    // 경쟁력 점수에 따른 결과
    const roll = Math.random() * 100;

    if (competitiveness >= 80) {
      // 높은 경쟁력: 70% 성공, 20% 지연, 10% 실패
      if (roll < 70) return 'WON';
      if (roll < 90) return 'DELAYED';
      return 'LOST';
    } else if (competitiveness >= 60) {
      // 중간 경쟁력: 50% 성공, 25% 지연, 25% 실패
      if (roll < 50) return 'WON';
      if (roll < 75) return 'DELAYED';
      return 'LOST';
    } else if (competitiveness >= 40) {
      // 낮은 경쟁력: 30% 성공, 30% 지연, 40% 실패
      if (roll < 30) return 'WON';
      if (roll < 60) return 'DELAYED';
      return 'LOST';
    } else {
      // 매우 낮은 경쟁력: 10% 성공, 20% 지연, 70% 실패
      if (roll < 10) return 'WON';
      if (roll < 30) return 'DELAYED';
      return 'LOST';
    }
  }

  /**
   * 입찰 성공 여부 결정 (레거시 - 하위 호환용)
   */
  static determineBidSuccess(competitiveness: number): boolean {
    return this.determineBidResult(competitiveness) === 'WON';
  }
}
