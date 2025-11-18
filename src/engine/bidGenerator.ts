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

    // 납기일 계산
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(deliveryDate.getDate() + shipSpec.estimatedDays);

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
    yourReputation: number
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

    // 종합 점수 (가격 60%, 평판 40%)
    const totalScore = priceScore * 0.6 + reputationScore * 0.4;

    // 경쟁사 랜덤 요소 (운)
    const luck = 0.8 + Math.random() * 0.4;

    return totalScore * luck;
  }

  /**
   * 입찰 성공 여부 결정
   */
  static determineBidSuccess(competitiveness: number): boolean {
    // 경쟁력이 70점 이상이면 성공 확률 높음
    const threshold = 50 + Math.random() * 30; // 50-80 사이
    return competitiveness >= threshold;
  }
}
