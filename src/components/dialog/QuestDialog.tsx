// 퀘스트 다이얼로그 컴포넌트

import { Scroll, CheckCircle, Star, Gift, X, ChevronRight } from 'lucide-react';
import { useDialogStore } from '../../store/dialogStore';
import type { QuestDialog, QuestReward } from '../../types/dialog';
import { getQuestById } from '../../data/quests';

interface QuestDialogProps {
  dialog: QuestDialog;
}

export default function QuestDialogComponent({ dialog }: QuestDialogProps) {
  const { closeDialog, startQuest } = useDialogStore();

  const quest = getQuestById(dialog.questId);
  const isNewQuest = dialog.status === 'new';
  const isComplete = dialog.status === 'complete';

  const handleClose = () => {
    if (dialog.onClose) {
      dialog.onClose();
    }
    closeDialog(dialog.id);
  };

  const handleAccept = () => {
    if (quest) {
      startQuest(quest.id);
    }
    handleClose();
  };

  const getQuestTypeLabel = () => {
    switch (dialog.questType) {
      case 'main':
        return { text: '메인 퀘스트', color: 'bg-yellow-600' };
      case 'side':
        return { text: '사이드 퀘스트', color: 'bg-blue-600' };
      case 'daily':
        return { text: '일일 퀘스트', color: 'bg-green-600' };
      default:
        return { text: '퀘스트', color: 'bg-gray-600' };
    }
  };

  const getStatusColor = () => {
    switch (dialog.status) {
      case 'new':
        return 'border-yellow-500';
      case 'progress':
        return 'border-blue-500';
      case 'complete':
        return 'border-green-500';
      case 'failed':
        return 'border-red-500';
      default:
        return 'border-gray-500';
    }
  };

  const questType = getQuestTypeLabel();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border-2 ${getStatusColor()}`}>
        {/* 헤더 */}
        <div className="bg-gray-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${questType.color}`}>
                {questType.text}
              </span>
              {isComplete && (
                <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-green-600">
                  완료!
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <Scroll className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{dialog.title || quest?.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {quest?.description || dialog.message}
              </p>
            </div>
          </div>
        </div>

        {/* 목표 */}
        {quest && (
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              목표
            </h3>
            <div className="space-y-2">
              {quest.objectives.map((objective) => (
                <div
                  key={objective.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    objective.completed ? 'bg-green-900/30' : 'bg-gray-700/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    objective.completed ? 'bg-green-500' : 'bg-gray-600'
                  }`}>
                    {objective.completed ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : (
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${objective.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                      {objective.description}
                    </p>
                  </div>
                  <span className={`text-sm font-mono ${
                    objective.completed ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {objective.current}/{objective.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 보상 */}
        {dialog.rewards && dialog.rewards.length > 0 && (
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-yellow-400" />
              보상
            </h3>
            <div className="flex flex-wrap gap-2">
              {dialog.rewards.map((reward, index) => (
                <RewardBadge key={index} reward={reward} />
              ))}
            </div>
          </div>
        )}

        {/* 캐릭터 메시지 */}
        {dialog.character && dialog.message && (
          <div className="p-4 bg-gray-900/50">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: dialog.character.color + '40' }}
              >
                {dialog.character.avatar}
              </div>
              <div className="flex-1 bg-gray-700 rounded-lg p-3">
                <p className="text-sm font-semibold text-white mb-1">
                  {dialog.character.nameKo}
                </p>
                <p className="text-sm text-gray-300">{dialog.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="p-4 bg-gray-900">
          {isNewQuest ? (
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                나중에
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
              >
                수락하기
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : isComplete ? (
            <button
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Star className="w-5 h-5" />
              보상 받기
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 보상 뱃지 컴포넌트
function RewardBadge({ reward }: { reward: QuestReward }) {
  const getRewardIcon = () => {
    switch (reward.type) {
      case 'cash':
        return '💰';
      case 'reputation':
        return '⭐';
      case 'research':
        return '🔬';
      case 'unlock':
        return '🔓';
      case 'achievement':
        return '🏆';
      default:
        return '🎁';
    }
  };

  const getRewardColor = () => {
    switch (reward.type) {
      case 'cash':
        return 'bg-green-900/50 border-green-600 text-green-400';
      case 'reputation':
        return 'bg-yellow-900/50 border-yellow-600 text-yellow-400';
      case 'research':
        return 'bg-blue-900/50 border-blue-600 text-blue-400';
      case 'unlock':
        return 'bg-purple-900/50 border-purple-600 text-purple-400';
      case 'achievement':
        return 'bg-amber-900/50 border-amber-600 text-amber-400';
      default:
        return 'bg-gray-700 border-gray-600 text-gray-400';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getRewardColor()}`}>
      <span>{getRewardIcon()}</span>
      <span className="text-sm font-medium">{reward.description}</span>
    </div>
  );
}
