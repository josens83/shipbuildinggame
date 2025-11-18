import { useGameStore } from '../../store/gameStore';
import type { Competitor } from '../../types';
import {
  Globe,
  TrendingUp,
  Award,
  Factory,
  DollarSign,
  Users,
  Ship,
  Target,
} from 'lucide-react';

export default function Market() {
  const { competitors, marketShare, reputation } = useGameStore();

  // 시장 점유율 상위 경쟁사
  const topCompetitors = [...competitors]
    .sort((a, b) => b.marketShare - a.marketShare)
    .slice(0, 10);

  // 평판 상위 경쟁사
  const topByReputation = [...competitors]
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 5);

  // 기술력 상위 경쟁사
  const topByTech = [...competitors]
    .sort((a, b) => b.technology - a.technology)
    .slice(0, 5);

  const getTechColor = (value: number) => {
    if (value >= 90) return 'text-purple-400';
    if (value >= 80) return 'text-blue-400';
    if (value >= 70) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getReputationColor = (value: number) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 80) return 'text-blue-400';
    if (value >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const renderCompetitorCard = (competitor: Competitor) => (
    <div
      key={competitor.id}
      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{competitor.name}</h3>
          <p className="text-sm text-gray-400">{competitor.country}</p>
          <p className="text-xs text-gray-500">설립: {competitor.founded}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">
            {competitor.marketShare.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">시장점유율</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs text-gray-400 mb-1">평판</div>
          <div className={`font-semibold ${getReputationColor(competitor.reputation)}`}>
            {competitor.reputation}/100
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">기술력</div>
          <div className={`font-semibold ${getTechColor(competitor.technology)}`}>
            {competitor.technology}/100
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">재무건전성</div>
          <div className="font-semibold text-green-400">
            {competitor.financialStrength}/100
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">총 도크</div>
          <div className="font-semibold text-white">{competitor.totalDocks}개</div>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">활성 계약</span>
          <span className="text-white font-semibold">{competitor.activeContracts}건</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">올해 건조</span>
          <span className="text-white font-semibold">{competitor.shipsBuiltThisYear}척</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-600">
        <div className="text-xs text-gray-400 mb-2">전문 분야</div>
        <div className="flex flex-wrap gap-1">
          {competitor.specialization.map(type => (
            <span
              key={type}
              className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-600">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-gray-500">공격성</div>
            <div className="text-red-400 font-semibold">
              {(competitor.aggressiveness * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-gray-500">R&D 집중</div>
            <div className="text-purple-400 font-semibold">
              {(competitor.rndFocus * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-gray-500">확장 속도</div>
            <div className="text-green-400 font-semibold">
              {(competitor.expansionRate * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Globe className="w-8 h-8 text-blue-400" />
          <span>글로벌 시장 분석</span>
        </h1>
        <p className="text-gray-400 mt-1">경쟁사 현황 및 시장 동향</p>
      </div>

      {/* 플레이어 회사 현황 */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-500/30">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-400" />
          <span>우리 회사 현황</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">시장 점유율</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{marketShare.toFixed(2)}%</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">평판</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{reputation}/100</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Factory className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">순위</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {[...topCompetitors, { marketShare }]
                .sort((a, b) => b.marketShare - a.marketShare)
                .findIndex(c => c.marketShare === marketShare) + 1}
              위
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">경쟁사 수</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{competitors.length}개</div>
          </div>
        </div>
      </div>

      {/* 시장 점유율 차트 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <span>시장 점유율 상위 10</span>
        </h2>
        <div className="space-y-3">
          {topCompetitors.map((competitor, index) => (
            <div key={competitor.id} className="flex items-center space-x-3">
              <div className="w-6 text-center text-gray-400 font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">{competitor.name}</span>
                  <span className="text-blue-400 font-semibold">
                    {competitor.marketShare.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${competitor.marketShare * 3}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 경쟁사 상세 정보 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Ship className="w-5 h-5 text-purple-400" />
          <span>주요 경쟁사 상세 정보</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCompetitors.map(renderCompetitorCard)}
        </div>
      </div>

      {/* 평판 및 기술력 랭킹 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 평판 랭킹 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-green-400" />
            <span>평판 Top 5</span>
          </h3>
          <div className="space-y-3">
            {topByReputation.map((competitor, index) => (
              <div key={competitor.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-semibold w-6">{index + 1}</span>
                  <span className="text-white">{competitor.name}</span>
                </div>
                <span className={`font-semibold ${getReputationColor(competitor.reputation)}`}>
                  {competitor.reputation}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 기술력 랭킹 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span>기술력 Top 5</span>
          </h3>
          <div className="space-y-3">
            {topByTech.map((competitor, index) => (
              <div key={competitor.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-semibold w-6">{index + 1}</span>
                  <span className="text-white">{competitor.name}</span>
                </div>
                <span className={`font-semibold ${getTechColor(competitor.technology)}`}>
                  {competitor.technology}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
