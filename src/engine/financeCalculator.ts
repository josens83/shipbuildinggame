import type { FinancialStatement, Contract, WorkforcePool, Dock } from '../types';

export class FinanceCalculator {
  /**
   * 월별 운영 비용 계산
   */
  static calculateMonthlyOperatingCosts(
    workforce: WorkforcePool,
    docks: Dock[]
  ): number {
    const laborCost = workforce.monthlyCost;
    const maintenanceCost = docks.reduce((sum, d) => sum + d.maintenanceCost, 0);
    const overheadCost = (laborCost + maintenanceCost) * 0.3; // 간접비 30%

    return laborCost + maintenanceCost + overheadCost;
  }

  /**
   * 계약별 예상 원가 계산
   */
  static calculateContractCost(contract: Contract): number {
    const shipCost = contract.shipSpec.estimatedCost;

    // 재료비: 60%
    const materialCost = shipCost * 0.6;

    // 직접 인건비: 25%
    const directLaborCost = shipCost * 0.25;

    // 간접비: 15%
    const overheadCost = shipCost * 0.15;

    return materialCost + directLaborCost + overheadCost;
  }

  /**
   * 계약별 예상 이익 계산
   */
  static calculateContractProfit(contract: Contract): number {
    const revenue = contract.contractPrice;
    const cost = this.calculateContractCost(contract);
    return revenue - cost;
  }

  /**
   * 재무비율 계산
   */
  static calculateFinancialRatios(financials: FinancialStatement): {
    debtToEquityRatio: number;
    currentRatio: number;
    returnOnEquity: number;
    profitMargin: number;
    debtServiceCoverageRatio: number;
  } {
    const debtToEquityRatio = financials.equity > 0
      ? financials.totalLiabilities / financials.equity
      : 0;

    const currentAssets = financials.cash + financials.accountsReceivable + financials.inventory;
    const currentLiabilities = financials.accountsPayable + financials.shortTermDebt;
    const currentRatio = currentLiabilities > 0
      ? currentAssets / currentLiabilities
      : 1;

    const returnOnEquity = financials.equity > 0
      ? (financials.netIncome / financials.equity) * 100
      : 0;

    const profitMargin = financials.revenue > 0
      ? (financials.netIncome / financials.revenue) * 100
      : 0;

    const debtServiceCoverageRatio = financials.interestExpense > 0
      ? financials.operatingIncome / financials.interestExpense
      : 0;

    return {
      debtToEquityRatio,
      currentRatio,
      returnOnEquity,
      profitMargin,
      debtServiceCoverageRatio,
    };
  }

  /**
   * 현금 흐름 예측
   */
  static projectCashFlow(
    currentCash: number,
    monthlyOperatingCosts: number,
    expectedRevenue: number,
    months: number
  ): number[] {
    const cashFlow: number[] = [currentCash];

    for (let i = 1; i <= months; i++) {
      const lastCash = cashFlow[i - 1];
      const monthlyRevenue = expectedRevenue / months;
      const newCash = lastCash + monthlyRevenue - monthlyOperatingCosts;
      cashFlow.push(newCash);
    }

    return cashFlow;
  }

  /**
   * 신용 건전성 평가
   */
  static evaluateCreditHealth(financials: FinancialStatement): {
    score: number;
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
    concerns: string[];
  } {
    const ratios = this.calculateFinancialRatios(financials);
    const concerns: string[] = [];
    let score = 100;

    // 부채비율 평가
    if (ratios.debtToEquityRatio > 2) {
      score -= 20;
      concerns.push('부채비율이 너무 높습니다 (>200%)');
    } else if (ratios.debtToEquityRatio > 1.5) {
      score -= 10;
      concerns.push('부채비율이 높습니다 (>150%)');
    }

    // 유동비율 평가
    if (ratios.currentRatio < 1) {
      score -= 25;
      concerns.push('유동비율이 1 미만입니다 (유동성 위기)');
    } else if (ratios.currentRatio < 1.5) {
      score -= 10;
      concerns.push('유동비율이 낮습니다');
    }

    // 현금 보유 평가
    if (financials.cash < 0) {
      score -= 30;
      concerns.push('현금이 부족합니다');
    }

    // ROE 평가
    if (ratios.returnOnEquity < 0) {
      score -= 15;
      concerns.push('적자 상태입니다');
    } else if (ratios.returnOnEquity < 5) {
      score -= 5;
      concerns.push('수익성이 낮습니다');
    }

    let rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
    if (score >= 90) rating = 'Excellent';
    else if (score >= 75) rating = 'Good';
    else if (score >= 60) rating = 'Fair';
    else if (score >= 40) rating = 'Poor';
    else rating = 'Critical';

    return { score, rating, concerns };
  }

  /**
   * 손익분기점 분석
   */
  static calculateBreakEvenAnalysis(
    fixedCosts: number,
    variableCostPerShip: number,
    pricePerShip: number
  ): {
    breakEvenUnits: number;
    breakEvenRevenue: number;
    contributionMargin: number;
  } {
    const contributionMargin = pricePerShip - variableCostPerShip;
    const breakEvenUnits = contributionMargin > 0
      ? fixedCosts / contributionMargin
      : 0;
    const breakEvenRevenue = breakEvenUnits * pricePerShip;

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
    };
  }

  /**
   * 투자 수익률 계산 (ROI)
   */
  static calculateROI(investment: number, returns: number): number {
    return investment > 0 ? ((returns - investment) / investment) * 100 : 0;
  }

  /**
   * 순현재가치 (NPV) 계산
   */
  static calculateNPV(
    initialInvestment: number,
    cashFlows: number[],
    discountRate: number
  ): number {
    let npv = -initialInvestment;

    cashFlows.forEach((cashFlow, index) => {
      const period = index + 1;
      npv += cashFlow / Math.pow(1 + discountRate, period);
    });

    return npv;
  }
}
