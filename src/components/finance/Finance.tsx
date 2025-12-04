import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FinanceCalculator } from '../../engine/financeCalculator';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  AlertCircle,
  Banknote,
  BarChart3,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Finance() {
  const {
    financials,
    takeLoan,
    repayLoan,
    creditLine,
    creditUsed,
    workforce,
    docks,
    corporateBonds,
    stockIssuances,
    totalShares,
    sharePrice,
    issueCorporateBond,
    repayCorporateBond,
    issueStock,
  } = useGameStore();

  // 회사채 발행 상태
  const [bondPrincipal, setBondPrincipal] = useState<number>(50);
  const [bondRate, setBondRate] = useState<number>(5);
  const [bondYears, setBondYears] = useState<number>(3);
  const [bondFrequency, setBondFrequency] = useState<'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'>('SEMI_ANNUAL');

  // 유상증자 상태
  const [stockShares, setStockShares] = useState<number>(100000);
  const [stockPrice, setStockPrice] = useState<number>(Math.round(sharePrice));
  const [stockType, setStockType] = useState<'RIGHTS_OFFERING' | 'PRIVATE_PLACEMENT'>('RIGHTS_OFFERING');

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

      {/* 자본 조달 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 회사채 발행 */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Banknote className="w-5 h-5 mr-2 text-yellow-400" />
            회사채 발행
          </h2>

          <div className="space-y-4">
            {/* 발행 한도 정보 */}
            <div className="bg-gray-700/50 p-3 rounded">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">발행 가능 한도</span>
                <span className="text-white">
                  {formatCurrency(
                    Math.max(0, financials.equity * 2 -
                      corporateBonds.filter(b => b.isActive).reduce((sum, b) => sum + b.principal, 0))
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">자본의 200%까지 발행 가능</p>
            </div>

            {/* 발행 조건 입력 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">발행 금액 ($M)</label>
                <input
                  type="number"
                  value={bondPrincipal}
                  onChange={(e) => setBondPrincipal(Number(e.target.value))}
                  className="input-field w-full"
                  min={10}
                  step={10}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">이자율 (%)</label>
                <input
                  type="number"
                  value={bondRate}
                  onChange={(e) => setBondRate(Number(e.target.value))}
                  className="input-field w-full"
                  min={1}
                  max={15}
                  step={0.5}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">만기 (년)</label>
                <select
                  value={bondYears}
                  onChange={(e) => setBondYears(Number(e.target.value))}
                  className="input-field w-full"
                >
                  <option value={1}>1년</option>
                  <option value={2}>2년</option>
                  <option value={3}>3년</option>
                  <option value={5}>5년</option>
                  <option value={7}>7년</option>
                  <option value={10}>10년</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">이자 지급</label>
                <select
                  value={bondFrequency}
                  onChange={(e) => setBondFrequency(e.target.value as typeof bondFrequency)}
                  className="input-field w-full"
                >
                  <option value="QUARTERLY">분기별</option>
                  <option value="SEMI_ANNUAL">반기별</option>
                  <option value="ANNUAL">연간</option>
                </select>
              </div>
            </div>

            {/* 예상 연간 이자 */}
            <div className="bg-gray-700/30 p-2 rounded text-sm">
              <span className="text-gray-400">예상 연간 이자: </span>
              <span className="text-yellow-400 font-semibold">
                {formatCurrency(bondPrincipal * (bondRate / 100))}
              </span>
            </div>

            <button
              onClick={() => issueCorporateBond(bondPrincipal, bondRate / 100, bondYears, bondFrequency)}
              className="btn-primary w-full"
            >
              회사채 발행
            </button>

            {/* 발행된 회사채 목록 */}
            {corporateBonds.filter(b => b.isActive).length > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">발행된 회사채</h3>
                <div className="space-y-2">
                  {corporateBonds.filter(b => b.isActive).map(bond => (
                    <div key={bond.id} className="bg-gray-700/50 p-3 rounded flex justify-between items-center">
                      <div>
                        <p className="text-sm text-white">${bond.principal}M @ {(bond.interestRate * 100).toFixed(1)}%</p>
                        <p className="text-xs text-gray-400">
                          만기: {format(new Date(bond.maturityDate), 'yyyy-MM-dd')}
                        </p>
                      </div>
                      <button
                        onClick={() => repayCorporateBond(bond.id)}
                        className="btn-secondary text-xs py-1 px-2"
                        disabled={financials.cash < bond.principal}
                      >
                        상환
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 유상증자 */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
            유상증자
          </h2>

          <div className="space-y-4">
            {/* 주식 정보 */}
            <div className="bg-gray-700/50 p-3 rounded">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">총 발행 주식</span>
                  <p className="text-white font-semibold">{totalShares.toLocaleString()}주</p>
                </div>
                <div>
                  <span className="text-gray-400">현재 주가</span>
                  <p className="text-white font-semibold">${sharePrice.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-400">시가총액</span>
                  <p className="text-white font-semibold">
                    {formatCurrency((totalShares * sharePrice) / 1_000_000)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">최대 발행 가능</span>
                  <p className="text-white font-semibold">{(totalShares * 0.5).toLocaleString()}주</p>
                </div>
              </div>
            </div>

            {/* 발행 조건 입력 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">발행 주식 수</label>
                <input
                  type="number"
                  value={stockShares}
                  onChange={(e) => setStockShares(Number(e.target.value))}
                  className="input-field w-full"
                  min={10000}
                  step={10000}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">발행가 ($)</label>
                <input
                  type="number"
                  value={stockPrice}
                  onChange={(e) => setStockPrice(Number(e.target.value))}
                  className="input-field w-full"
                  min={1}
                  step={1}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">증자 유형</label>
                <select
                  value={stockType}
                  onChange={(e) => setStockType(e.target.value as typeof stockType)}
                  className="input-field w-full"
                >
                  <option value="RIGHTS_OFFERING">주주배정 (기존 주주 우선)</option>
                  <option value="PRIVATE_PLACEMENT">제3자배정 (외부 투자자)</option>
                </select>
              </div>
            </div>

            {/* 예상 조달 금액 & 희석률 */}
            <div className="bg-gray-700/30 p-3 rounded space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">예상 조달 금액</span>
                <span className="text-green-400 font-semibold">
                  {formatCurrency((stockShares * stockPrice) / 1_000_000)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">지분 희석률</span>
                <span className="text-yellow-400 font-semibold">
                  {((stockShares / (totalShares + stockShares)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => issueStock(stockShares, stockPrice, stockType)}
              className="btn-primary w-full"
            >
              유상증자 실행
            </button>

            {/* 증자 이력 */}
            {stockIssuances.length > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">증자 이력</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {stockIssuances.map(issuance => (
                    <div key={issuance.id} className="bg-gray-700/50 p-2 rounded">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">
                          {issuance.sharesIssued.toLocaleString()}주 @ ${issuance.pricePerShare}
                        </span>
                        <span className="text-green-400">${issuance.totalRaised.toFixed(1)}M</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {format(new Date(issuance.issueDate), 'yyyy-MM-dd')} •
                        {issuance.type === 'RIGHTS_OFFERING' ? ' 주주배정' : ' 제3자배정'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
