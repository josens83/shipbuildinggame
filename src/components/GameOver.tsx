import { useGameStore } from '../store/gameStore';
import { Trophy, Skull, Ship, DollarSign, Star, TrendingUp, Calendar, RotateCcw } from 'lucide-react';
import type { GameEndReason } from '../types';

const REASON_INFO: Record<GameEndReason, { title: string; description: string; isVictory: boolean }> = {
  VICTORY_REPUTATION: {
    title: '명성 달성!',
    description: '당신의 조선소는 세계 최고의 명성을 얻었습니다. 전설적인 조선소로 역사에 남게 됩니다!',
    isVictory: true,
  },
  VICTORY_MARKET_SHARE: {
    title: '시장 지배!',
    description: '당신은 전 세계 조선 시장의 40% 이상을 점유하며 시장을 지배하게 되었습니다!',
    isVictory: true,
  },
  VICTORY_SHIPS_BUILT: {
    title: '건조왕!',
    description: '100척 이상의 선박을 건조하며 전설적인 생산 능력을 입증했습니다!',
    isVictory: true,
  },
  VICTORY_WEALTH: {
    title: '부의 제국!',
    description: '막대한 자산을 축적하고 부채를 최소화하며 금융 제국을 건설했습니다!',
    isVictory: true,
  },
  BANKRUPTCY_CASH: {
    title: '자금 고갈',
    description: '현금이 바닥났고 더 이상 대출을 받을 수 없습니다. 조선소는 문을 닫게 됩니다.',
    isVictory: false,
  },
  BANKRUPTCY_DEBT: {
    title: '과도한 부채',
    description: '부채비율이 너무 높아져 은행에서 더 이상 신용을 제공하지 않습니다.',
    isVictory: false,
  },
  BANKRUPTCY_REPUTATION: {
    title: '신뢰 상실',
    description: '평판이 너무 낮아져 더 이상 어떤 선사도 계약을 맺으려 하지 않습니다.',
    isVictory: false,
  },
};

export default function GameOver() {
  const { gameEnd, resetGame, companyName } = useGameStore();

  if (!gameEnd.isEnded || !gameEnd.reason) return null;

  const reasonInfo = REASON_INFO[gameEnd.reason];
  const isVictory = reasonInfo.isVictory;
  const stats = gameEnd.finalStats;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000);
  };

  const handleNewGame = () => {
    resetGame();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-700">
        {/* 헤더 */}
        <div
          className={`p-8 text-center ${
            isVictory
              ? 'bg-gradient-to-r from-yellow-600 to-amber-600'
              : 'bg-gradient-to-r from-red-800 to-red-900'
          }`}
        >
          <div className="flex justify-center mb-4">
            {isVictory ? (
              <Trophy className="w-20 h-20 text-yellow-300" />
            ) : (
              <Skull className="w-20 h-20 text-red-300" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isVictory ? '축하합니다!' : '게임 오버'}
          </h1>
          <p className="text-xl text-white/90">{reasonInfo.title}</p>
        </div>

        {/* 설명 */}
        <div className="p-6 border-b border-gray-700">
          <p className="text-gray-300 text-center">{reasonInfo.description}</p>
        </div>

        {/* 통계 */}
        {stats && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 text-center">
              {companyName}의 최종 기록
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <Ship className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">건조 선박</p>
                  <p className="text-xl font-bold text-white">{stats.totalShipsBuilt}척</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">총 매출</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">최종 평판</p>
                  <p className="text-xl font-bold text-white">{stats.finalReputation}/100</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">시장 점유율</p>
                  <p className="text-xl font-bold text-white">{stats.finalMarketShare.toFixed(1)}%</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3 col-span-2">
                <Calendar className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-sm text-gray-400">플레이 기간</p>
                  <p className="text-xl font-bold text-white">
                    {Math.floor(stats.playTime / 365)}년 {stats.playTime % 365}일
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="p-6 bg-gray-800 border-t border-gray-700">
          <button
            onClick={handleNewGame}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isVictory
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            새 게임 시작
          </button>
        </div>
      </div>
    </div>
  );
}
