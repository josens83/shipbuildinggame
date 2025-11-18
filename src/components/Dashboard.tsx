import { useGameStore } from '../store/gameStore';
import {
  TrendingUp,
  TrendingDown,
  Ship,
  DollarSign,
  Users,
  Factory,
  AlertCircle,
} from 'lucide-react';
import { FinanceCalculator } from '../engine/financeCalculator';

export default function Dashboard() {
  const {
    companyName,
    financials,
    contracts,
    docks,
    workforce,
    totalShipsBuilt,
    reputation,
    marketShare,
  } = useGameStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000);
  };

  const activeContracts = contracts.filter(
    (c) => c.status === 'IN_PRODUCTION' || c.status === 'SIGNED'
  );
  const availableDocks = docks.filter((d) => d.status === 'AVAILABLE').length;

  const creditHealth = FinanceCalculator.evaluateCreditHealth(financials);

  const totalWorkforce =
    workforce.welders +
    workforce.fitters +
    workforce.painters +
    workforce.electricians +
    workforce.engineers;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{companyName} 대시보드</h1>
        <p className="text-gray-400">회사 전체 현황을 한눈에 확인하세요</p>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 현금 */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">현금 보유</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(financials.cash)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                신용한도 사용: {((financials.longTermDebt / 100) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* 순이익 */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">순이익</p>
              <p
                className={`text-2xl font-bold ${
                  financials.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatCurrency(financials.netIncome)}
              </p>
              <div className="flex items-center mt-1">
                {financials.netIncome >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className="text-xs text-gray-500">전월 대비</span>
              </div>
            </div>
            <div
              className={`p-3 rounded-lg ${
                financials.netIncome >= 0
                  ? 'bg-green-500/10'
                  : 'bg-red-500/10'
              }`}
            >
              {financials.netIncome >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* 활성 계약 */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">활성 계약</p>
              <p className="text-2xl font-bold text-white">{activeContracts.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                완료: {totalShipsBuilt}척
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Ship className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* 평판 */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">회사 평판</p>
              <p className="text-2xl font-bold text-white">{reputation}/100</p>
              <p className="text-xs text-gray-500 mt-1">
                시장점유율: {marketShare.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 신용 건전성 경고 */}
      {creditHealth.rating !== 'Excellent' && creditHealth.rating !== 'Good' && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">
                재무 건전성 경고 ({creditHealth.rating})
              </h3>
              <ul className="text-sm text-yellow-200 space-y-1">
                {creditHealth.concerns.map((concern, i) => (
                  <li key={i}>• {concern}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 생산 현황 */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Factory className="w-5 h-5 mr-2 text-blue-400" />
            생산 현황
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">도크 가동률</span>
                <span className="text-white">
                  {docks.length - availableDocks}/{docks.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${((docks.length - availableDocks) / docks.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                진행 중인 프로젝트
              </h3>
              {activeContracts.length === 0 ? (
                <p className="text-sm text-gray-500">진행 중인 프로젝트가 없습니다</p>
              ) : (
                <div className="space-y-3">
                  {activeContracts.slice(0, 3).map((contract) => (
                    <div key={contract.id} className="bg-gray-700/50 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {contract.shipSpec.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {contract.currentPhase || '준비 중'}
                          </p>
                        </div>
                        <span className="text-xs text-blue-400">
                          {contract.progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${contract.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 인력 현황 */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-400" />
            인력 현황
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">총 인원</span>
              <span className="text-xl font-bold text-white">{totalWorkforce}명</span>
            </div>

            <div className="border-t border-gray-700 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">용접공</span>
                <span className="text-white">{workforce.welders}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">조립공</span>
                <span className="text-white">{workforce.fitters}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">도장공</span>
                <span className="text-white">{workforce.painters}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">전기공</span>
                <span className="text-white">{workforce.electricians}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">엔지니어</span>
                <span className="text-white">{workforce.engineers}명</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">평균 숙련도</span>
                <span className="text-white">{workforce.skillLevel}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${workforce.skillLevel}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">월 인건비</span>
              <span className="text-white">{formatCurrency(workforce.monthlyCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">빠른 액션</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="btn-primary">
            새 입찰 확인
          </button>
          <button className="btn-secondary">
            재무제표 보기
          </button>
          <button className="btn-secondary">
            생산 관리
          </button>
          <button className="btn-secondary">
            도크 건설
          </button>
        </div>
      </div>
    </div>
  );
}
