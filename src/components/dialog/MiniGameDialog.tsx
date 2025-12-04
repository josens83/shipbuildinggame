// 미니게임 다이얼로그 컴포넌트 (인트로 & 결과)

import { Gamepad2, Trophy, Star, Zap, Target, Play } from 'lucide-react';
import { useDialogStore } from '../../store/dialogStore';
import type { MiniGameDialog } from '../../types/dialog';

interface MiniGameDialogProps {
  dialog: MiniGameDialog;
}

export default function MiniGameDialogComponent({ dialog }: MiniGameDialogProps) {
  const { closeDialog } = useDialogStore();

  const isIntro = dialog.type === 'minigame-intro';
  const isResult = dialog.type === 'minigame-result';

  const handleClose = () => {
    if (dialog.onClose) {
      dialog.onClose();
    }
    closeDialog(dialog.id);
  };

  const handleStart = () => {
    // 미니게임 시작 로직은 별도로 처리
    closeDialog(dialog.id);
    // TODO: 실제 미니게임 화면으로 이동
  };

  const getGameIcon = () => {
    switch (dialog.gameType) {
      case 'welding':
        return <Zap className="w-12 h-12 text-yellow-400" />;
      case 'inspection':
        return <Target className="w-12 h-12 text-blue-400" />;
      case 'assembly':
        return <Gamepad2 className="w-12 h-12 text-green-400" />;
      case 'crisis':
        return <Zap className="w-12 h-12 text-red-400" />;
      default:
        return <Gamepad2 className="w-12 h-12 text-purple-400" />;
    }
  };

  const getGameName = () => {
    switch (dialog.gameType) {
      case 'welding':
        return '용접 타이밍';
      case 'inspection':
        return '품질 검사';
      case 'assembly':
        return '블록 조립';
      case 'crisis':
        return '위기 대응';
      default:
        return '미니게임';
    }
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'S':
        return 'text-yellow-400';
      case 'A':
        return 'text-green-400';
      case 'B':
        return 'text-blue-400';
      case 'C':
        return 'text-gray-400';
      case 'F':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const getGradeBg = (grade?: string) => {
    switch (grade) {
      case 'S':
        return 'from-yellow-600 to-amber-600';
      case 'A':
        return 'from-green-600 to-emerald-600';
      case 'B':
        return 'from-blue-600 to-cyan-600';
      case 'C':
        return 'from-gray-600 to-slate-600';
      case 'F':
        return 'from-red-600 to-rose-600';
      default:
        return 'from-purple-600 to-indigo-600';
    }
  };

  // 인트로 화면
  if (isIntro) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-gray-700">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
            <div className="flex justify-center mb-4">
              {getGameIcon()}
            </div>
            <h2 className="text-2xl font-bold text-white">{getGameName()}</h2>
            <p className="text-purple-200 mt-1">미니게임</p>
          </div>

          {/* 설명 */}
          <div className="p-6">
            <p className="text-gray-300 text-center leading-relaxed">
              {dialog.message}
            </p>

            {/* 게임 규칙 */}
            <div className="mt-6 bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">게임 방법</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                {dialog.gameType === 'welding' && (
                  <>
                    <li>• 게이지가 녹색 영역에 있을 때 클릭하세요</li>
                    <li>• 정확한 타이밍일수록 높은 점수!</li>
                    <li>• 연속 성공으로 콤보 보너스!</li>
                  </>
                )}
                {dialog.gameType === 'inspection' && (
                  <>
                    <li>• 두 이미지에서 다른 부분을 찾으세요</li>
                    <li>• 시간 내에 모든 결함을 찾아야 합니다</li>
                    <li>• 틀린 클릭은 감점!</li>
                  </>
                )}
                {dialog.gameType === 'assembly' && (
                  <>
                    <li>• 블록을 올바른 위치에 배치하세요</li>
                    <li>• 같은 색 블록은 합쳐집니다</li>
                    <li>• 시간 내에 목표 점수를 달성하세요</li>
                  </>
                )}
                {dialog.gameType === 'crisis' && (
                  <>
                    <li>• 발생하는 문제를 빠르게 클릭하세요</li>
                    <li>• 놓치면 피해가 누적됩니다</li>
                    <li>• 빠를수록 높은 점수!</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* 버튼 */}
          <div className="p-6 pt-0 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleStart}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (isResult) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-gray-700">
          {/* 헤더 - 등급에 따른 색상 */}
          <div className={`bg-gradient-to-r ${getGradeBg(dialog.grade)} p-6 text-center`}>
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">{dialog.title}</h2>
            <p className="text-white/80 mt-1">{getGameName()} 완료!</p>
          </div>

          {/* 결과 */}
          <div className="p-6">
            {/* 등급 */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-1">등급</p>
              <span className={`text-7xl font-bold ${getGradeColor(dialog.grade)}`}>
                {dialog.grade}
              </span>
            </div>

            {/* 점수 */}
            <div className="flex justify-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">점수</p>
                <p className="text-2xl font-bold text-white">{dialog.score}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">최대</p>
                <p className="text-2xl font-bold text-gray-500">{dialog.maxScore}</p>
              </div>
            </div>

            {/* 보상 */}
            {dialog.rewards && dialog.rewards.length > 0 && (
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  획득 보상
                </h3>
                <ul className="space-y-1">
                  {dialog.rewards.map((reward, index) => (
                    <li key={index} className="text-sm text-green-400">
                      ✓ {reward.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 메시지 */}
            <p className="text-gray-300 text-center mt-4 leading-relaxed">
              {dialog.message}
            </p>
          </div>

          {/* 버튼 */}
          <div className="p-6 pt-0">
            <button
              onClick={handleClose}
              className={`w-full px-6 py-3 bg-gradient-to-r ${getGradeBg(dialog.grade)} text-white font-semibold rounded-lg transition-opacity hover:opacity-90`}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
