import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getResearchById } from '../../data/research';
import type { ResearchCategory, Research as ResearchType } from '../../types';
import {
  FlaskConical,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Shield,
  Zap,
  Boxes,
  Award,
  Bot,
} from 'lucide-react';
import { useDialog } from '../common/ConfirmDialog';

const CATEGORY_ICONS: Record<ResearchCategory, any> = {
  PRODUCTION: TrendingUp,
  QUALITY: Award,
  COST: DollarSign,
  SPEED: Zap,
  SAFETY: Shield,
  AUTOMATION: Bot,
};

const CATEGORY_COLORS: Record<ResearchCategory, string> = {
  PRODUCTION: 'blue',
  QUALITY: 'purple',
  COST: 'green',
  SPEED: 'yellow',
  SAFETY: 'red',
  AUTOMATION: 'indigo',
};

const CATEGORY_LABELS: Record<ResearchCategory, string> = {
  PRODUCTION: '생산 효율',
  QUALITY: '품질 관리',
  COST: '원가 절감',
  SPEED: '건조 속도',
  SAFETY: '안전 관리',
  AUTOMATION: '자동화',
};

export default function Research() {
  const {
    researchProjects,
    reputation,
    getAvailableResearch,
    startResearch,
    canStartResearch,
  } = useGameStore();

  const { warning } = useDialog();

  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory | 'ALL'>('ALL');
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);

  const availableResearch = getAvailableResearch();
  const inProgressProjects = researchProjects.filter(p => p.status === 'IN_PROGRESS');
  const completedProjects = researchProjects.filter(p => p.status === 'COMPLETED');

  const filteredResearch = selectedCategory === 'ALL'
    ? availableResearch
    : availableResearch.filter(r => r.category === selectedCategory);

  const formatCurrency = (amount: number) => {
    return `$${amount}M`;
  };

  const handleStartResearch = async (researchId: string) => {
    const result = canStartResearch(researchId);
    if (!result.canStart) {
      await warning('연구 시작 불가', result.reason || '연구를 시작할 수 없습니다.');
      return;
    }

    const success = startResearch(researchId);
    if (success) {
      setSelectedResearch(null);
    }
  };

  const renderEffects = (research: ResearchType) => {
    const effects = [];
    if (research.effects.dockEfficiency) {
      effects.push(`도크 효율 +${research.effects.dockEfficiency}%`);
    }
    if (research.effects.costReduction) {
      effects.push(`원가 절감 +${research.effects.costReduction}%`);
    }
    if (research.effects.buildSpeedBonus) {
      effects.push(`건조 속도 +${research.effects.buildSpeedBonus}%`);
    }
    if (research.effects.qualityBonus) {
      effects.push(`품질 +${research.effects.qualityBonus}%`);
    }
    if (research.effects.workerSafety) {
      effects.push(`안전도 +${research.effects.workerSafety}%`);
    }
    if (research.effects.reputationBonus) {
      effects.push(`평판 +${research.effects.reputationBonus}`);
    }
    return effects;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FlaskConical className="w-8 h-8 text-purple-400" />
            <span>기술 연구 개발</span>
          </h1>
          <p className="text-gray-400 mt-1">신기술을 연구하여 경쟁력을 향상시키세요</p>
        </div>
      </div>

      {/* 진행 중인 연구 */}
      {inProgressProjects.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/30">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            <span>진행 중인 연구 ({inProgressProjects.length})</span>
          </h2>
          <div className="space-y-4">
            {inProgressProjects.map(project => {
              const research = getResearchById(project.researchId);
              if (!research) return null;

              const Icon = CATEGORY_ICONS[research.category];
              const color = CATEGORY_COLORS[research.category];

              return (
                <div key={project.researchId} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
                        <Icon className={`w-5 h-5 text-${color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{research.name}</h3>
                        <p className="text-sm text-gray-400">{research.description}</p>
                      </div>
                    </div>
                    <span className="text-sm text-purple-400 font-semibold">
                      {project.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          전체
        </button>
        {(Object.keys(CATEGORY_LABELS) as ResearchCategory[]).map(category => {
          const Icon = CATEGORY_ICONS[category];
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{CATEGORY_LABELS[category]}</span>
            </button>
          );
        })}
      </div>

      {/* 사용 가능한 연구 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Boxes className="w-5 h-5 text-blue-400" />
          <span>사용 가능한 연구 ({filteredResearch.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResearch.map(research => {
            const Icon = CATEGORY_ICONS[research.category];
            const color = CATEGORY_COLORS[research.category];
            const effects = renderEffects(research);
            const canStart = canStartResearch(research.id);

            return (
              <div
                key={research.id}
                className={`bg-gray-800 rounded-lg p-4 border transition-all cursor-pointer ${
                  selectedResearch === research.id
                    ? `border-${color}-500`
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedResearch(research.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${color}-400`} />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded bg-${color}-500/20 text-${color}-400`}>
                    {CATEGORY_LABELS[research.category]}
                  </span>
                </div>

                <h3 className="font-semibold text-white mb-2">{research.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{research.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>비용</span>
                    </span>
                    <span className="text-white font-semibold">{formatCurrency(research.cost)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>기간</span>
                    </span>
                    <span className="text-white">{research.duration}일</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>필요 평판</span>
                    </span>
                    <span
                      className={
                        reputation >= research.requiredReputation ? 'text-green-400' : 'text-red-400'
                      }
                    >
                      {research.requiredReputation}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-3 mb-4">
                  <p className="text-xs text-gray-500 mb-2">연구 효과:</p>
                  <div className="space-y-1">
                    {effects.map((effect, idx) => (
                      <div key={idx} className="text-sm text-green-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleStartResearch(research.id);
                  }}
                  disabled={!canStart.canStart}
                  className={`w-full py-2 rounded-lg transition-colors text-sm font-semibold ${
                    canStart.canStart
                      ? `bg-${color}-600 hover:bg-${color}-500 text-white`
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  title={!canStart.canStart ? canStart.reason : undefined}
                >
                  {canStart.canStart ? '연구 시작' : canStart.reason}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 완료된 연구 */}
      {completedProjects.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span>완료된 연구 ({completedProjects.length})</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {completedProjects.map(project => {
              const research = getResearchById(project.researchId);
              if (!research) return null;

              const Icon = CATEGORY_ICONS[research.category];

              return (
                <div
                  key={project.researchId}
                  className="bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3"
                >
                  <Icon className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-white">{research.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
