// 미니게임 컨트롤러 컴포넌트
// 미니게임 상태 관리 및 게임 렌더링

import { useCallback } from 'react';
import { useMiniGameStore } from '../../store/miniGameStore';
import { useDialogStore } from '../../store/dialogStore';
import { useGameStore } from '../../store/gameStore';
import WeldingGame from './WeldingGame';
import InspectionGame from './InspectionGame';
import AssemblyGame from './AssemblyGame';
import CrisisGame from './CrisisGame';
import type { MiniGameType, MiniGameReward } from '../../types/dialog';

export default function MiniGameController() {
  const {
    isPlaying,
    gameType,
    resetGame,
  } = useMiniGameStore();

  const {
    endMiniGame,
    showToast,
  } = useDialogStore();

  const {
    increaseCash,
    increaseReputation,
    increaseDockEfficiency,
  } = useGameStore();

  // 미니게임 완료 처리
  const handleGameComplete = useCallback(() => {
    const result = useMiniGameStore.getState().endGame();

    // 보상 적용
    applyRewards(result.rewards);

    // 결과 다이얼로그 표시
    endMiniGame(result);

    // 토스트 알림
    showToast({
      title: `미니게임 완료! 등급: ${result.grade}`,
      message: `점수: ${result.score}/${result.maxScore}`,
      toastType: result.grade === 'F' ? 'error' : 'success',
      autoClose: 3000,
    });
  }, [endMiniGame, showToast]);

  // 미니게임 취소 처리
  const handleGameCancel = useCallback(() => {
    resetGame();
    showToast({
      title: '미니게임 취소',
      message: '미니게임이 취소되었습니다.',
      toastType: 'info',
      autoClose: 2000,
    });
  }, [resetGame, showToast]);

  // 보상 적용
  const applyRewards = useCallback((rewards: MiniGameReward[]) => {
    rewards.forEach((reward) => {
      switch (reward.type) {
        case 'cash':
          increaseCash(reward.value / 1000000); // 백만 단위로 변환
          break;
        case 'reputation':
          increaseReputation(reward.value);
          break;
        case 'efficiency':
          increaseDockEfficiency();
          break;
        case 'quality':
          // TODO: 품질 보너스 적용
          break;
        case 'speed':
          // TODO: 생산 속도 보너스 적용
          break;
      }
    });
  }, [increaseCash, increaseReputation, increaseDockEfficiency]);

  // 게임이 플레이 중이 아니면 렌더링 하지 않음
  if (!isPlaying || !gameType) {
    return null;
  }

  // 게임 타입에 따라 적절한 게임 컴포넌트 렌더링
  const renderGame = () => {
    switch (gameType) {
      case 'welding':
        return (
          <WeldingGame
            onComplete={handleGameComplete}
            onCancel={handleGameCancel}
          />
        );
      case 'inspection':
        return (
          <InspectionGame
            onComplete={handleGameComplete}
            onCancel={handleGameCancel}
          />
        );
      case 'assembly':
        return (
          <AssemblyGame
            onComplete={handleGameComplete}
            onCancel={handleGameCancel}
          />
        );
      case 'crisis':
        return (
          <CrisisGame
            onComplete={handleGameComplete}
            onCancel={handleGameCancel}
          />
        );
      default:
        return null;
    }
  };

  return renderGame();
}

// 미니게임 시작 헬퍼 함수
export function useMiniGameLauncher() {
  const { startGame } = useMiniGameStore();
  const { showDialog, closeDialog } = useDialogStore();

  const launchMiniGame = useCallback((
    type: MiniGameType,
    options?: {
      contractId?: string;
      dockId?: string;
      difficulty?: 'easy' | 'normal' | 'hard' | 'expert';
    }
  ) => {
    // 인트로 다이얼로그 표시
    const dialogId = showDialog({
      type: 'minigame-intro',
      priority: 'high',
      backdrop: true,
      gameType: type,
      title: getMiniGameTitle(type),
      message: getMiniGameDescription(type),
      onConfirm: () => {
        closeDialog(dialogId);
        startGame(type, options);
      },
      onClose: () => {
        closeDialog(dialogId);
      },
    });
  }, [showDialog, closeDialog, startGame]);

  return { launchMiniGame };
}

// 헬퍼 함수
function getMiniGameTitle(type: MiniGameType): string {
  const titles: Record<MiniGameType, string> = {
    welding: '용접 타이밍 게임',
    inspection: '품질 검사 게임',
    assembly: '블록 조립 퍼즐',
    crisis: '위기 대응 게임',
  };
  return titles[type];
}

function getMiniGameDescription(type: MiniGameType): string {
  const descriptions: Record<MiniGameType, string> = {
    welding: '정확한 타이밍에 버튼을 눌러 완벽한 용접을 완성하세요!\n\n게이지가 녹색 영역에 있을 때 클릭하면 점수를 얻습니다.',
    inspection: '선박의 결함을 찾아 품질을 높이세요!\n\n화면에서 결함을 클릭하여 찾아내세요.',
    assembly: '블록을 합쳐 높은 점수를 만드세요!\n\n화살표 키로 블록을 이동합니다.',
    crisis: '빠르게 발생하는 문제들을 해결하세요!\n\n위기가 나타나면 빠르게 클릭하세요.',
  };
  return descriptions[type];
}
