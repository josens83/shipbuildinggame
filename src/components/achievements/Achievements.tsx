import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ALL_ACHIEVEMENTS, getAchievementsByCategory } from '../../data/achievements';
import type { AchievementCategory, AchievementRarity } from '../../types';
import { Trophy, Lock, Award, TrendingUp, DollarSign, Users, FlaskConical, Globe, Star } from 'lucide-react';

const CATEGORY_ICONS: Record<AchievementCategory, any> = {
  MILESTONE: Trophy,
  PRODUCTION: TrendingUp,
  FINANCIAL: DollarSign,
  REPUTATION: Users,
  RESEARCH: FlaskConical,
  MARKET: Globe,
  SPECIAL: Star,
};

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  MILESTONE: '이정표',
  PRODUCTION: '생산',
  FINANCIAL: '재무',
  REPUTATION: '평판',
  RESEARCH: '연구',
  MARKET: '시장',
  SPECIAL: '특수',
};

const RARITY_COLORS: Record<AchievementRarity, string> = {
  COMMON: 'gray',
  UNCOMMON: 'green',
  RARE: 'blue',
  EPIC: 'purple',
  LEGENDARY: 'yellow',
};

const RARITY_LABELS: Record<AchievementRarity, string> = {
  COMMON: '일반',
  UNCOMMON: '희귀',
  RARE: '레어',
  EPIC: '에픽',
  LEGENDARY: '전설',
};

export default function Achievements() {
  const { achievements } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'ALL'>('ALL');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = ALL_ACHIEVEMENTS.length;
  const completionRate = ((unlockedCount / totalCount) * 100).toFixed(1);

  const filteredAchievements =
    selectedCategory === 'ALL'
      ? ALL_ACHIEVEMENTS
      : getAchievementsByCategory(selectedCategory);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Award className="w-8 h-8 text-yellow-400" />
          <span>업적</span>
        </h1>
        <p className="text-gray-400 mt-1">달성한 업적을 확인하세요</p>
      </div>

      {/* 진행도 */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border border-yellow-500/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">전체 진행도</h2>
          <span className="text-2xl font-bold text-yellow-400">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-sm text-gray-300">
          {unlockedCount} / {totalCount} 업적 달성
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          전체
        </button>
        {(Object.keys(CATEGORY_LABELS) as AchievementCategory[]).map(category => {
          const Icon = CATEGORY_ICONS[category];
          const count = achievements.filter(
            a =>
              a.unlocked &&
              ALL_ACHIEVEMENTS.find(ach => ach.id === a.achievementId && ach.category === category)
          ).length;
          const total = getAchievementsByCategory(category).length;

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedCategory === category
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{CATEGORY_LABELS[category]}</span>
              <span className="text-xs opacity-70">
                ({count}/{total})
              </span>
            </button>
          );
        })}
      </div>

      {/* 업적 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const progress = achievements.find(a => a.achievementId === achievement.id);
          const isUnlocked = progress?.unlocked || false;
          const color = RARITY_COLORS[achievement.rarity];

          return (
            <div
              key={achievement.id}
              className={`rounded-lg p-4 border-2 transition-all ${
                isUnlocked
                  ? `bg-${color}-900/20 border-${color}-500/50`
                  : 'bg-gray-800 border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${isUnlocked ? `bg-${color}-500/20` : 'bg-gray-700'}`}>
                  {isUnlocked ? (
                    <Trophy className={`w-6 h-6 text-${color}-400`} />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    isUnlocked
                      ? `bg-${color}-500/20 text-${color}-400`
                      : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {RARITY_LABELS[achievement.rarity]}
                </span>
              </div>

              <h3 className={`font-semibold mb-2 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                {achievement.hidden && !isUnlocked ? '???' : achievement.name}
              </h3>

              <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                {achievement.hidden && !isUnlocked
                  ? '숨겨진 업적입니다. 조건을 만족하면 잠금 해제됩니다.'
                  : achievement.description}
              </p>

              {achievement.reward && isUnlocked && (
                <div className="border-t border-gray-700 pt-3 space-y-1">
                  <p className="text-xs text-gray-500 mb-1">보상:</p>
                  {achievement.reward.cash && (
                    <div className="text-sm text-green-400">
                      + ${(achievement.reward.cash / 1_000_000).toFixed(1)}M
                    </div>
                  )}
                  {achievement.reward.reputation && (
                    <div className="text-sm text-blue-400">
                      + {achievement.reward.reputation} 평판
                    </div>
                  )}
                </div>
              )}

              {isUnlocked && progress?.unlockedAt && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    달성: {new Date(progress.unlockedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
