import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SCENARIO_PRESETS, type PlanScenario, type AnnualTarget } from '../../types';
import {
  X,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Ship,
  Users,
  Percent,
  Factory,
} from 'lucide-react';

export default function AnnualPlanDialog() {
  const {
    showAnnualPlanDialog,
    pendingPlanYear,
    closeAnnualPlanDialog,
    createAnnualPlan,
    getPlanForYear,
    financials,
    contracts,
    docks,
    workforce,
  } = useGameStore();

  const [selectedScenario, setSelectedScenario] = useState<PlanScenario>('BASE');
  const [targets, setTargets] = useState<Partial<AnnualTarget>>({
    orderAmount: 500,
    orderCount: 5,
    productionCount: 4,
    deliveryCount: 3,
    revenueTarget: 400,
    profitTarget: 60,
    cashFlowTarget: 50,
    shipTypeTargets: [],
  });

  // 기존 계획이 있으면 로드
  useEffect(() => {
    if (pendingPlanYear) {
      const existingPlan = getPlanForYear(pendingPlanYear);
      if (existingPlan) {
        setSelectedScenario(existingPlan.scenario);
        setTargets(existingPlan.target);
      } else {
        // 전년도 실적 기반으로 목표 제안
        const prevYear = getPlanForYear(pendingPlanYear - 1);
        if (prevYear) {
          setTargets({
            orderAmount: Math.round(prevYear.actual.orderAmount * 1.1),
            orderCount: Math.round(prevYear.actual.orderCount * 1.1),
            productionCount: Math.round(prevYear.actual.productionCount * 1.1),
            deliveryCount: Math.round(prevYear.actual.deliveryCount * 1.1),
            revenueTarget: Math.round(prevYear.actual.revenue * 1.1),
            profitTarget: Math.round(prevYear.actual.profit * 1.1),
            cashFlowTarget: Math.round(prevYear.actual.cashFlow * 1.1),
            shipTypeTargets: [],
          });
        }
      }
    }
  }, [pendingPlanYear, getPlanForYear]);

  if (!showAnnualPlanDialog || !pendingPlanYear) return null;

  const config = SCENARIO_PRESETS[selectedScenario];

  // 현재 생산 능력 계산
  const availableDocks = docks.filter(d => d.status === 'AVAILABLE').length;
  const totalWorkers = workforce.welders + workforce.fitters + workforce.painters +
                       workforce.electricians + workforce.engineers;
  const activeContracts = contracts.filter(c =>
    c.status === 'IN_PRODUCTION' || c.status === 'SIGNED'
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000);
  };

  const handleSubmit = () => {
    createAnnualPlan(pendingPlanYear, selectedScenario, targets);
  };

  const scenarios: { key: PlanScenario; icon: React.ReactNode; color: string }[] = [
    { key: 'OPTIMISTIC', icon: <TrendingUp className="w-5 h-5" />, color: 'green' },
    { key: 'BASE', icon: <BarChart3 className="w-5 h-5" />, color: 'blue' },
    { key: 'CONSERVATIVE', icon: <TrendingDown className="w-5 h-5" />, color: 'yellow' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-gray-700">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">{pendingPlanYear}년 사업계획</h2>
              <p className="text-sm text-gray-400">연간 목표와 시나리오를 설정하세요</p>
            </div>
          </div>
          <button
            onClick={closeAnnualPlanDialog}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 현재 상태 요약 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">현금</span>
              </div>
              <p className="text-lg font-bold text-white">{formatCurrency(financials.cash)}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Factory className="w-4 h-4" />
                <span className="text-xs">가용 도크</span>
              </div>
              <p className="text-lg font-bold text-white">{availableDocks} / {docks.length}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">총 인력</span>
              </div>
              <p className="text-lg font-bold text-white">{totalWorkers}명</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Ship className="w-4 h-4" />
                <span className="text-xs">진행 중 계약</span>
              </div>
              <p className="text-lg font-bold text-white">{activeContracts}건</p>
            </div>
          </div>

          {/* 시나리오 선택 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">시나리오 선택</h3>
            <div className="grid grid-cols-3 gap-4">
              {scenarios.map(({ key, icon, color }) => {
                const preset = SCENARIO_PRESETS[key];
                const isSelected = selectedScenario === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? `border-${color}-500 bg-${color}-500/20`
                        : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-${color}-400`}>{icon}</span>
                      <span className="font-semibold text-white">{preset.name}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{preset.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>목표 시수</span>
                        <span className="text-white">{preset.targetManHoursPerGT} MH/GT</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>목표 이익률</span>
                        <span className="text-white">{(preset.targetProfitMargin * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>외주 비율</span>
                        <span className="text-white">{(preset.outsourcingRatio * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 관리지표 */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-400" />
              관리지표 ({config.name})
            </h3>
            <div className="grid grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-400">{config.targetManHoursPerGT}</p>
                <p className="text-xs text-gray-400">MH/GT</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{(config.targetProfitMargin * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-400">목표 이익률</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{(config.fixedCostRatio * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-400">고정비 비율</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">{(config.outsourcingRatio * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-400">외주 비율</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${config.workforceChangeRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {config.workforceChangeRate >= 0 ? '+' : ''}{(config.workforceChangeRate * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-400">인력 증감</p>
              </div>
            </div>
          </div>

          {/* 연간 목표 입력 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">연간 목표 설정</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* 수주 목표 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-400 border-b border-gray-700 pb-2">수주 목표</h4>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">수주 금액 (백만 달러)</label>
                  <input
                    type="number"
                    value={targets.orderAmount || 0}
                    onChange={(e) => setTargets({ ...targets, orderAmount: Number(e.target.value) })}
                    className="input-field w-full"
                    min={0}
                    step={100}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">수주 척수</label>
                  <input
                    type="number"
                    value={targets.orderCount || 0}
                    onChange={(e) => setTargets({ ...targets, orderCount: Number(e.target.value) })}
                    className="input-field w-full"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">생산 척수</label>
                  <input
                    type="number"
                    value={targets.productionCount || 0}
                    onChange={(e) => setTargets({ ...targets, productionCount: Number(e.target.value) })}
                    className="input-field w-full"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">인도 척수</label>
                  <input
                    type="number"
                    value={targets.deliveryCount || 0}
                    onChange={(e) => setTargets({ ...targets, deliveryCount: Number(e.target.value) })}
                    className="input-field w-full"
                    min={0}
                  />
                </div>
              </div>

              {/* 재무 목표 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-400 border-b border-gray-700 pb-2">재무 목표</h4>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">매출 목표 (백만 달러)</label>
                  <input
                    type="number"
                    value={targets.revenueTarget || 0}
                    onChange={(e) => setTargets({ ...targets, revenueTarget: Number(e.target.value) })}
                    className="input-field w-full"
                    min={0}
                    step={100}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">이익 목표 (백만 달러)</label>
                  <input
                    type="number"
                    value={targets.profitTarget || 0}
                    onChange={(e) => setTargets({ ...targets, profitTarget: Number(e.target.value) })}
                    className="input-field w-full"
                    min={0}
                    step={10}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">현금흐름 목표 (백만 달러)</label>
                  <input
                    type="number"
                    value={targets.cashFlowTarget || 0}
                    onChange={(e) => setTargets({ ...targets, cashFlowTarget: Number(e.target.value) })}
                    className="input-field w-full"
                    step={10}
                  />
                </div>

                {/* 예상 지표 */}
                <div className="bg-gray-700/50 p-3 rounded-lg mt-4">
                  <p className="text-xs text-gray-400 mb-2">예상 이익률</p>
                  <p className={`text-lg font-bold ${
                    ((targets.profitTarget || 0) / (targets.revenueTarget || 1)) >= config.targetProfitMargin
                      ? 'text-green-400'
                      : 'text-yellow-400'
                  }`}>
                    {(((targets.profitTarget || 0) / (targets.revenueTarget || 1)) * 100).toFixed(1)}%
                    <span className="text-xs text-gray-400 ml-2">
                      (목표: {(config.targetProfitMargin * 100).toFixed(0)}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800 sticky bottom-0">
          <button
            onClick={closeAnnualPlanDialog}
            className="btn-secondary"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            계획 확정
          </button>
        </div>
      </div>
    </div>
  );
}
