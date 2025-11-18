import { useGameStore } from '../../store/gameStore';
import { FinanceCalculator } from '../../engine/financeCalculator';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  AlertCircle,
} from 'lucide-react';

export default function Finance() {
  const { financials, takeLoan, repayLoan, creditLine, creditUsed, workforce, docks } =
    useGameStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000);
  };

  const ratios = FinanceCalculator.calculateFinancialRatios(financials);
  const creditHealth = FinanceCalculator.evaluateCreditHealth(financials);
  const monthlyOperatingCosts = FinanceCalculator.calculateMonthlyOperatingCosts(
    workforce,
    docks
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <DollarSign className="w-8 h-8 mr-3 text-green-400" />
          재무 관리
        </h1>
        <p className="text-gray-400">회사의 재무 상태를 관리하고 분석하세요</p>
      </div>

      {/* 신용 건전성 */}
      <div
        className={`card border-2 ${
          creditHealth.rating === 'Excellent' || creditHealth.rating === 'Good'
            ? 'border-green-700'
            : creditHealth.rating === 'Fair'
            ? 'border-yellow-700'
            : 'border-red-700'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">신용 건전성</h2>
            <p className="text-sm text-gray-400">회사의 재무 건전성 평가</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{creditHealth.score}</p>
            <p
              className={`text-sm font-semibold ${
                creditHealth.rating === 'Excellent' || creditHealth.rating === 'Good'
                  ? 'text-green-400'
                  : creditHealth.rating === 'Fair'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {creditHealth.rating}
            </p>
          </div>
        </div>

        {creditHealth.concerns.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-400 mb-1">주의사항</p>
                <ul className="text-xs text-yellow-200 space-y-1">
                  {creditHealth.concerns.map((concern, i) => (
                    <li key={i}>• {concern}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 재무 비율 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">부채비율</p>
          <p className="text-2xl font-bold text-white">
            {ratios.debtToEquityRatio.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">낮을수록 좋음 (&lt;1.5)</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-400 mb-1">유동비율</p>
          <p className="text-2xl font-bold text-white">{ratios.currentRatio.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">높을수록 좋음 (&gt;1.5)</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-400 mb-1">자기자본이익률 (ROE)</p>
          <p
            className={`text-2xl font-bold ${
              ratios.returnOnEquity >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {ratios.returnOnEquity.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">높을수록 좋음 (&gt;15%)</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-400 mb-1">영업이익률</p>
          <p
            className={`text-2xl font-bold ${
              ratios.profitMargin >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {ratios.profitMargin.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">높을수록 좋음 (&gt;10%)</p>
        </div>
      </div>

      {/* 손익계산서 */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          손익계산서 (Income Statement)
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
            <span className="text-gray-300">매출</span>
            <span className="text-lg font-semibold text-white">
              {formatCurrency(financials.revenue)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm pl-4">매출원가</span>
            <span className="text-sm text-gray-300">
              -{formatCurrency(financials.costOfGoodsSold)}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
            <span className="text-gray-300 font-medium">매출총이익</span>
            <span className="text-lg font-semibold text-green-400">
              {formatCurrency(financials.grossProfit)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm pl-4">영업비용</span>
            <span className="text-sm text-gray-300">
              -{formatCurrency(financials.operatingExpenses)}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
            <span className="text-gray-300 font-medium">영업이익</span>
            <span
              className={`text-lg font-semibold ${
                financials.operatingIncome >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(financials.operatingIncome)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm pl-4">이자비용</span>
            <span className="text-sm text-gray-300">
              -{formatCurrency(financials.interestExpense)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t-2 border-gray-600">
            <span className="text-white font-bold text-lg">순이익</span>
            <span
              className={`text-2xl font-bold ${
                financials.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(financials.netIncome)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 재무상태표 */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-purple-400" />
            재무상태표 (Balance Sheet)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">자산 (Assets)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">현금</span>
                  <span className="text-white">{formatCurrency(financials.cash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">매출채권</span>
                  <span className="text-white">
                    {formatCurrency(financials.accountsReceivable)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">재고자산</span>
                  <span className="text-white">{formatCurrency(financials.inventory)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">고정자산</span>
                  <span className="text-white">
                    {formatCurrency(financials.fixedAssets)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700 font-semibold">
                  <span className="text-white">총자산</span>
                  <span className="text-white">
                    {formatCurrency(financials.totalAssets)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">부채 (Liabilities)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">매입채무</span>
                  <span className="text-white">
                    {formatCurrency(financials.accountsPayable)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">단기부채</span>
                  <span className="text-white">
                    {formatCurrency(financials.shortTermDebt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">장기부채</span>
                  <span className="text-white">
                    {formatCurrency(financials.longTermDebt)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700 font-semibold">
                  <span className="text-white">총부채</span>
                  <span className="text-white">
                    {formatCurrency(financials.totalLiabilities)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t-2 border-gray-600">
              <div className="flex justify-between font-bold">
                <span className="text-white">자본 (Equity)</span>
                <span className="text-green-400">{formatCurrency(financials.equity)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 현금흐름 & 대출 */}
        <div className="space-y-6">
          {/* 현금흐름표 */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">현금흐름표 (Cash Flow)</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">영업활동</span>
                <span
                  className={
                    financials.operatingCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                  }
                >
                  {formatCurrency(financials.operatingCashFlow)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">투자활동</span>
                <span
                  className={
                    financials.investingCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                  }
                >
                  {formatCurrency(financials.investingCashFlow)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">재무활동</span>
                <span
                  className={
                    financials.financingCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                  }
                >
                  {formatCurrency(financials.financingCashFlow)}
                </span>
              </div>
            </div>
          </div>

          {/* 대출 관리 */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-yellow-400" />
              대출 관리
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">신용한도 사용</span>
                  <span className="text-white">
                    {formatCurrency(creditUsed)} / {formatCurrency(creditLine)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (creditUsed / creditLine) * 100 > 80
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${(creditUsed / creditLine) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => takeLoan(10)}
                  className="btn-secondary text-sm py-2"
                  disabled={creditUsed >= creditLine}
                >
                  $10M 대출
                </button>
                <button
                  onClick={() => repayLoan(10)}
                  className="btn-secondary text-sm py-2"
                  disabled={financials.cash < 10 || creditUsed === 0}
                >
                  $10M 상환
                </button>
              </div>

              <div className="bg-gray-700/50 p-3 rounded">
                <p className="text-xs text-gray-400 mb-1">월 이자 비용</p>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(financials.interestExpense)}
                </p>
              </div>
            </div>
          </div>

          {/* 월간 운영 비용 */}
          <div className="card">
            <h2 className="text-lg font-bold text-white mb-3">월간 운영 비용</h2>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">
                {formatCurrency(monthlyOperatingCosts)}
              </p>
              <p className="text-xs text-gray-400 mt-1">인건비 + 유지비 + 간접비</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
