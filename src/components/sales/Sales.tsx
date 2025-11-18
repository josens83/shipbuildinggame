import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Briefcase } from 'lucide-react';
import { format } from 'date-fns';

export default function Sales() {
  const {
    availableBids,
    contracts,
    customers,
    bidOnContract,
    signContract,
    generateBids,
  } = useGameStore();

  const [selectedBid, setSelectedBid] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);

  // useEffect 제거 - 이제 게임 시작 시 자동 생성됨

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000);
  };

  const pendingContracts = contracts.filter((c) => c.status === 'NEGOTIATING');
  const signedContracts = contracts.filter(
    (c) => c.status === 'SIGNED' || c.status === 'IN_PRODUCTION'
  );

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || 'Unknown';
  };

  const handleBidSubmit = (contractId: string) => {
    if (bidAmount > 0) {
      bidOnContract(contractId, bidAmount);
      setSelectedBid(null);
      setBidAmount(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Briefcase className="w-8 h-8 mr-3 text-blue-400" />
          영업 관리
        </h1>
        <p className="text-gray-400">계약을 체결하고 수주를 관리하세요</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">입찰 가능</p>
          <p className="text-3xl font-bold text-white">{availableBids.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">협상 중</p>
          <p className="text-3xl font-bold text-yellow-400">{pendingContracts.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">진행 중</p>
          <p className="text-3xl font-bold text-green-400">{signedContracts.length}</p>
        </div>
      </div>

      {/* 입찰 가능한 계약 */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">입찰 기회</h2>
        {availableBids.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">현재 입찰 가능한 계약이 없습니다</p>
            <button onClick={generateBids} className="btn-primary mt-4">
              새 입찰 기회 찾기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {availableBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {bid.shipSpec.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      고객: {getCustomerName(bid.customerId)}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                    입찰 가능
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">선박 종류</p>
                    <p className="text-sm text-white">{bid.shipSpec.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">크기</p>
                    <p className="text-sm text-white">
                      {bid.shipSpec.length}m × {bid.shipSpec.width}m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">예상 금액</p>
                    <p className="text-sm text-white">
                      {formatCurrency(bid.contractPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">납기일</p>
                    <p className="text-sm text-white">
                      {bid.deliveryDate
                        ? format(new Date(bid.deliveryDate), 'yyyy-MM-dd')
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedBid === bid.id ? (
                  <div className="bg-gray-800 p-4 rounded mt-3">
                    <label className="block text-sm text-gray-400 mb-2">
                      입찰 금액 (백만 달러)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={bidAmount || ''}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="input-field flex-1"
                        placeholder={bid.contractPrice.toString()}
                        min={0}
                      />
                      <button
                        onClick={() => handleBidSubmit(bid.id)}
                        className="btn-primary"
                      >
                        제출
                      </button>
                      <button
                        onClick={() => setSelectedBid(null)}
                        className="btn-secondary"
                      >
                        취소
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      권장 금액: {formatCurrency(bid.contractPrice * 0.95)} -{' '}
                      {formatCurrency(bid.contractPrice * 1.05)}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedBid(bid.id);
                      setBidAmount(bid.contractPrice);
                    }}
                    className="btn-primary w-full mt-3"
                  >
                    입찰하기
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 협상 중인 계약 */}
      {pendingContracts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">협상 중인 계약</h2>
          <div className="space-y-4">
            {pendingContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-gray-700/50 p-4 rounded-lg border border-yellow-700"
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
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">
                    협상 중
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">입찰 금액</p>
                    <p className="text-sm text-white">
                      {formatCurrency(contract.contractPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">예상 이익률</p>
                    <p className="text-sm text-green-400">
                      {(contract.profitMargin * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">납기</p>
                    <p className="text-sm text-white">
                      {contract.shipSpec.estimatedDays}일
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => signContract(contract.id)}
                  className="btn-primary w-full"
                >
                  계약 체결
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 진행 중인 계약 */}
      {signedContracts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">진행 중인 계약</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm text-gray-400">선박</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">고객</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">금액</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">진행률</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">상태</th>
                </tr>
              </thead>
              <tbody>
                {signedContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-gray-700/50">
                    <td className="py-3 px-4 text-sm text-white">
                      {contract.shipSpec.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {getCustomerName(contract.customerId)}
                    </td>
                    <td className="py-3 px-4 text-sm text-white">
                      {formatCurrency(contract.contractPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${contract.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {contract.progress.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          contract.status === 'IN_PRODUCTION'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {contract.status === 'IN_PRODUCTION' ? '생산 중' : '대기'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
