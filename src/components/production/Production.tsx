import { useGameStore } from '../../store/gameStore';
import { Factory, Users, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import type { DockSize } from '../../types';

export default function Production() {
  const {
    docks,
    contracts,
    workforce,
    customers,
    assignContractToDock,
    buildDock,
    hireWorkers,
    fireWorkers,
  } = useGameStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000);
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || 'Unknown';
  };

  const signedContracts = contracts.filter((c) => c.status === 'SIGNED');
  const inProductionContracts = contracts.filter((c) => c.status === 'IN_PRODUCTION');

  const totalWorkforce =
    workforce.welders +
    workforce.fitters +
    workforce.painters +
    workforce.electricians +
    workforce.engineers;

  const occupiedDocks = docks.filter((d) => d.status === 'OCCUPIED').length;
  const availableDocks = docks.filter((d) => d.status === 'AVAILABLE');

  // 도크 크기가 선박 요구사항과 호환되는지 확인
  const isDockCompatible = (dockSize: DockSize, requiredSize: DockSize): boolean => {
    const sizeOrder: DockSize[] = ['SMALL', 'MEDIUM', 'LARGE', 'MEGA'];
    return sizeOrder.indexOf(dockSize) >= sizeOrder.indexOf(requiredSize);
  };

  // 특정 계약에 호환되는 도크 목록 가져오기
  const getCompatibleDocks = (requiredSize: DockSize) => {
    return availableDocks.filter((d) => isDockCompatible(d.size, requiredSize));
  };

  // 도크 크기 한글 표시
  const getDockSizeLabel = (size: DockSize): string => {
    const labels: Record<DockSize, string> = {
      SMALL: '소형',
      MEDIUM: '중형',
      LARGE: '대형',
      MEGA: '초대형',
    };
    return labels[size];
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Factory className="w-8 h-8 mr-3 text-orange-400" />
          생산 관리
        </h1>
        <p className="text-gray-400">도크와 인력을 관리하고 생산을 최적화하세요</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">총 도크</p>
          <p className="text-3xl font-bold text-white">{docks.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            가동 중: {occupiedDocks}개
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-400 mb-1">가동률</p>
          <p className="text-3xl font-bold text-blue-400">
            {((occupiedDocks / docks.length) * 100).toFixed(0)}%
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-400 mb-1">총 인력</p>
          <p className="text-3xl font-bold text-white">{totalWorkforce}</p>
          <p className="text-xs text-gray-500 mt-1">
            숙련도: {workforce.skillLevel}/100
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-400 mb-1">생산 중</p>
          <p className="text-3xl font-bold text-green-400">
            {inProductionContracts.length}척
          </p>
        </div>
      </div>

      {/* 도크 관리 */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Factory className="w-5 h-5 mr-2 text-blue-400" />
            도크 현황
          </h2>
          <button
            onClick={() => buildDock('MEDIUM')}
            className="btn-primary text-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            도크 건설
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docks.map((dock) => {
            const contract =
              dock.currentContractId &&
              contracts.find((c) => c.id === dock.currentContractId);

            return (
              <div
                key={dock.id}
                className={`p-4 rounded-lg border-2 ${
                  dock.status === 'AVAILABLE'
                    ? 'bg-gray-700/30 border-gray-600'
                    : dock.status === 'OCCUPIED'
                    ? 'bg-blue-900/20 border-blue-700'
                    : 'bg-yellow-900/20 border-yellow-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{dock.name}</h3>
                    <p className="text-sm text-gray-400">
                      {dock.size} ({dock.maxLength}m × {dock.maxWidth}m)
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      dock.status === 'AVAILABLE'
                        ? 'bg-green-500/20 text-green-400'
                        : dock.status === 'OCCUPIED'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {dock.status === 'AVAILABLE'
                      ? '가용'
                      : dock.status === 'OCCUPIED'
                      ? '사용 중'
                      : '정비'}
                  </span>
                </div>

                {contract ? (
                  <div className="bg-gray-800/50 p-3 rounded">
                    <p className="text-sm font-medium text-white mb-1">
                      {contract.shipSpec.name}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      {getCustomerName(contract.customerId)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${contract.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {contract.progress.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {contract.currentPhase}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500">대기 중</p>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">효율:</span>
                    <span className="text-white ml-1">
                      {(dock.efficiency * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">상태:</span>
                    <span className="text-white ml-1">{dock.condition}/100</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 도크 건설 옵션 */}
        <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">새 도크 건설</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => buildDock('SMALL')}
              className="btn-secondary text-xs py-2"
            >
              소형 - $20M
            </button>
            <button
              onClick={() => buildDock('MEDIUM')}
              className="btn-secondary text-xs py-2"
            >
              중형 - $50M
            </button>
            <button
              onClick={() => buildDock('LARGE')}
              className="btn-secondary text-xs py-2"
            >
              대형 - $100M
            </button>
            <button
              onClick={() => buildDock('MEGA')}
              className="btn-secondary text-xs py-2"
            >
              초대형 - $200M
            </button>
          </div>
        </div>
      </div>

      {/* 대기 중인 계약 - 도크 배정 */}
      {signedContracts.length > 0 && (
        <div className="card border-2 border-yellow-600/50">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">도크 배정 대기</h2>
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-sm">
              {signedContracts.length}건
            </span>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            아래 계약을 도크에 배정하면 생산이 시작됩니다. 버튼을 클릭하여 배정하세요.
          </p>

          <div className="space-y-4">
            {signedContracts.map((contract) => {
              const compatibleDocks = getCompatibleDocks(contract.shipSpec.requiredDockSize);

              return (
                <div
                  key={contract.id}
                  className="bg-gray-800 p-4 rounded-lg border-2 border-dashed border-yellow-600/50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {contract.shipSpec.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        고객: {getCustomerName(contract.customerId)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {getDockSizeLabel(contract.shipSpec.requiredDockSize)} 도크 필요
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        생산 기간: {Math.round(contract.shipSpec.estimatedDays / 30)}개월
                      </p>
                    </div>
                  </div>

                  {compatibleDocks.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-green-400 mb-2">
                        호환 가능한 도크 {compatibleDocks.length}개
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {compatibleDocks.map((dock) => (
                          <button
                            key={dock.id}
                            onClick={() => assignContractToDock(contract.id, dock.id)}
                            className="flex items-center justify-between px-4 py-3 bg-green-600 hover:bg-green-500 rounded-lg transition-colors text-white"
                          >
                            <div className="text-left">
                              <p className="font-semibold">{dock.name}</p>
                              <p className="text-xs text-green-200">
                                {getDockSizeLabel(dock.size)} · 효율 {(dock.efficiency * 100).toFixed(0)}%
                              </p>
                            </div>
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                      <p className="text-sm text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {availableDocks.length === 0
                          ? '모든 도크가 사용 중입니다'
                          : `${getDockSizeLabel(contract.shipSpec.requiredDockSize)} 이상의 가용 도크가 없습니다`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        새 도크를 건설하거나 기존 작업이 완료될 때까지 기다리세요.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 인력 관리 */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-green-400" />
          인력 관리
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">현재 인력</h3>
            <div className="space-y-3">
              {[
                { name: '용접공', key: 'welders', count: workforce.welders },
                { name: '조립공', key: 'fitters', count: workforce.fitters },
                { name: '도장공', key: 'painters', count: workforce.painters },
                { name: '전기공', key: 'electricians', count: workforce.electricians },
                { name: '엔지니어', key: 'engineers', count: workforce.engineers },
              ].map((worker) => (
                <div
                  key={worker.key}
                  className="flex items-center justify-between bg-gray-700/50 p-3 rounded"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{worker.name}</p>
                    <p className="text-xs text-gray-400">{worker.count}명</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => hireWorkers(worker.key, 10)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => fireWorkers(worker.key, 10)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                      disabled={worker.count < 10}
                    >
                      -10
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">인력 통계</h3>
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded">
                <p className="text-sm text-gray-400 mb-1">총 인원</p>
                <p className="text-2xl font-bold text-white">{totalWorkforce}명</p>
              </div>

              <div className="bg-gray-700/50 p-4 rounded">
                <p className="text-sm text-gray-400 mb-2">평균 숙련도</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${workforce.skillLevel}%` }}
                    />
                  </div>
                  <span className="text-sm text-white">{workforce.skillLevel}/100</span>
                </div>
              </div>

              <div className="bg-gray-700/50 p-4 rounded">
                <p className="text-sm text-gray-400 mb-2">직원 사기</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        workforce.morale >= 70
                          ? 'bg-green-500'
                          : workforce.morale >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${workforce.morale}%` }}
                    />
                  </div>
                  <span className="text-sm text-white">{workforce.morale}/100</span>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 p-4 rounded">
                <p className="text-sm text-gray-400 mb-1">월 인건비</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(workforce.monthlyCost)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  1인당 약 ${((workforce.monthlyCost * 1000000) / totalWorkforce).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
