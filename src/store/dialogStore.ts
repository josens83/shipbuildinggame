// 통합 다이얼로그 스토어

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Dialog,
  DialogState,
  DialogActions,
  ToastDialog,
  DialogPriority,
  MiniGameResult,
  StoryProgress,
  OfflineProgress,
  CharacterDialog,
  CreateDialogInput,
  CreateToastInput,
} from '../types/dialog';
import { getCharacterById } from '../data/characters';
import { TUTORIAL_DIALOGS } from '../data/tutorialDialogs';
import { STORY_DIALOGS } from '../data/storyDialogs';

// 고유 ID 생성기
const generateId = () => `dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 초기 스토리 진행 상태
const INITIAL_STORY_PROGRESS: StoryProgress = {
  currentChapter: 'chapter_1',
  completedChapters: [],
  completedQuests: [],
  activeQuests: [],
  choiceHistory: [],
  characterAffinity: {},
};

// 초기 상태
const INITIAL_STATE: DialogState = {
  dialogs: [],
  toasts: [],

  tutorialActive: false,
  tutorialStep: 0,
  tutorialCompleted: false,
  tutorialSkipped: false,

  storyProgress: INITIAL_STORY_PROGRESS,

  activeQuests: [],
  completedQuests: [],

  activeMiniGame: null,
  miniGameHistory: [],

  offlineProgress: null,
};

export const useDialogStore = create<DialogState & DialogActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ============================================
      // 다이얼로그 기본 조작
      // ============================================

      showDialog: (dialogData: CreateDialogInput) => {
        const id = generateId();
        const dialog = {
          ...dialogData,
          id,
          timestamp: Date.now(),
          priority: dialogData.priority || 'normal',
        } as Dialog;

        set((state) => {
          // 우선순위에 따라 정렬 (critical > high > normal > low)
          const priorityOrder: Record<DialogPriority, number> = {
            critical: 4,
            high: 3,
            normal: 2,
            low: 1,
          };

          const newDialogs = [...state.dialogs, dialog].sort(
            (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
          );

          return { dialogs: newDialogs };
        });

        return id;
      },

      closeDialog: (id) => {
        set((state) => {
          const dialog = state.dialogs.find((d) => d.id === id);
          if (dialog?.onClose) {
            dialog.onClose();
          }
          return {
            dialogs: state.dialogs.filter((d) => d.id !== id),
          };
        });
      },

      closeAllDialogs: () => {
        set({ dialogs: [] });
      },

      // ============================================
      // 토스트
      // ============================================

      showToast: (toastData: CreateToastInput) => {
        const id = generateId();
        const toast: ToastDialog = {
          id,
          type: 'toast',
          title: toastData.title,
          message: toastData.message,
          toastType: toastData.toastType,
          timestamp: Date.now(),
          priority: toastData.priority || 'low',
          position: 'bottom-right',
          autoClose: toastData.autoClose || 4000,
        };

        set((state) => ({
          toasts: [...state.toasts, toast].slice(-5), // 최대 5개
        }));

        // 자동 제거
        if (toast.autoClose) {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.autoClose);
        }

        return id;
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      // ============================================
      // 캐릭터 대화
      // ============================================

      showCharacterDialog: (characterId, dialogId) => {
        const character = getCharacterById(characterId);
        const dialogData = STORY_DIALOGS[dialogId];

        if (!character || !dialogData) {
          console.error(`Character or dialog not found: ${characterId}, ${dialogId}`);
          return;
        }

        const dialog: CharacterDialog = {
          id: generateId(),
          type: 'character',
          timestamp: Date.now(),
          priority: 'high',
          backdrop: true,
          character,
          emotion: dialogData.emotion || 'neutral',
          title: dialogData.title,
          message: dialogData.message,
          choices: dialogData.choices,
          nextDialogId: dialogData.nextDialogId,
          typewriter: true,
        };

        set((state) => ({
          dialogs: [...state.dialogs, dialog],
        }));
      },

      advanceDialog: (choiceId) => {
        const state = get();
        const currentDialog = state.dialogs.find(
          (d) => d.type === 'character' || d.type === 'story'
        ) as CharacterDialog | undefined;

        if (!currentDialog) return;

        // 선택 기록
        if (choiceId) {
          set((state) => ({
            storyProgress: {
              ...state.storyProgress,
              choiceHistory: [
                ...state.storyProgress.choiceHistory,
                {
                  dialogId: currentDialog.id,
                  choiceId,
                  timestamp: new Date(),
                },
              ],
            },
          }));

          // 선택지 효과 실행
          const choice = currentDialog.choices?.find((c) => c.id === choiceId);
          if (choice?.effect) {
            choice.effect();
          }
        }

        // 현재 대화 닫기
        get().closeDialog(currentDialog.id);

        // 다음 대화가 있으면 표시
        if (currentDialog.nextDialogId) {
          const nextDialog = STORY_DIALOGS[currentDialog.nextDialogId];
          if (nextDialog && currentDialog.character) {
            get().showCharacterDialog(currentDialog.character.id, currentDialog.nextDialogId);
          }
        }
      },

      // ============================================
      // 튜토리얼
      // ============================================

      startTutorial: () => {
        set({
          tutorialActive: true,
          tutorialStep: 0,
          tutorialCompleted: false,
          tutorialSkipped: false,
        });

        // 첫 번째 튜토리얼 대화 표시
        const firstTutorial = TUTORIAL_DIALOGS[0];
        if (firstTutorial) {
          get().showDialog({
            type: 'tutorial',
            priority: 'high',
            backdrop: true,
            step: 0,
            totalSteps: TUTORIAL_DIALOGS.length,
            title: firstTutorial.title,
            message: firstTutorial.content,
            action: firstTutorial.action,
            canSkip: true,
            canGoBack: false,
          });
        }
      },

      nextTutorialStep: () => {
        const state = get();
        const nextStep = state.tutorialStep + 1;

        if (nextStep >= TUTORIAL_DIALOGS.length) {
          get().completeTutorial();
          return;
        }

        // 현재 튜토리얼 대화 닫기
        const currentTutorialDialog = state.dialogs.find((d) => d.type === 'tutorial');
        if (currentTutorialDialog) {
          get().closeDialog(currentTutorialDialog.id);
        }

        set({ tutorialStep: nextStep });

        // 다음 튜토리얼 대화 표시
        const nextTutorial = TUTORIAL_DIALOGS[nextStep];
        if (nextTutorial) {
          get().showDialog({
            type: 'tutorial',
            priority: 'high',
            backdrop: true,
            step: nextStep,
            totalSteps: TUTORIAL_DIALOGS.length,
            title: nextTutorial.title,
            message: nextTutorial.content,
            action: nextTutorial.action,
            canSkip: true,
            canGoBack: nextStep > 0,
          });
        }
      },

      prevTutorialStep: () => {
        const state = get();
        if (state.tutorialStep <= 0) return;

        const prevStep = state.tutorialStep - 1;

        // 현재 튜토리얼 대화 닫기
        const currentTutorialDialog = state.dialogs.find((d) => d.type === 'tutorial');
        if (currentTutorialDialog) {
          get().closeDialog(currentTutorialDialog.id);
        }

        set({ tutorialStep: prevStep });

        // 이전 튜토리얼 대화 표시
        const prevTutorial = TUTORIAL_DIALOGS[prevStep];
        if (prevTutorial) {
          get().showDialog({
            type: 'tutorial',
            priority: 'high',
            backdrop: true,
            step: prevStep,
            totalSteps: TUTORIAL_DIALOGS.length,
            title: prevTutorial.title,
            message: prevTutorial.content,
            action: prevTutorial.action,
            canSkip: true,
            canGoBack: prevStep > 0,
          });
        }
      },

      skipTutorial: () => {
        // 모든 튜토리얼 대화 닫기
        set((state) => ({
          dialogs: state.dialogs.filter((d) => d.type !== 'tutorial'),
          tutorialActive: false,
          tutorialSkipped: true,
        }));
      },

      completeTutorial: () => {
        // 모든 튜토리얼 대화 닫기
        set((state) => ({
          dialogs: state.dialogs.filter((d) => d.type !== 'tutorial'),
          tutorialActive: false,
          tutorialCompleted: true,
        }));

        // 완료 토스트
        get().showToast({
          title: '튜토리얼 완료!',
          message: '이제 본격적으로 조선소를 경영해보세요.',
          toastType: 'success',
          autoClose: 5000,
        });
      },

      // ============================================
      // 퀘스트
      // ============================================

      startQuest: (questId) => {
        // 퀘스트 데이터는 별도 파일에서 가져옴
        // 여기서는 상태만 업데이트
        set((state) => ({
          storyProgress: {
            ...state.storyProgress,
            activeQuests: [...state.storyProgress.activeQuests, questId],
            currentQuest: questId,
          },
        }));
      },

      updateQuestProgress: (questId, objectiveId, progress) => {
        set((state) => ({
          activeQuests: state.activeQuests.map((quest) => {
            if (quest.id !== questId) return quest;

            const updatedObjectives = quest.objectives.map((obj) => {
              if (obj.id !== objectiveId) return obj;
              const newCurrent = Math.min(progress, obj.target);
              return {
                ...obj,
                current: newCurrent,
                completed: newCurrent >= obj.target,
              };
            });

            // 모든 목표 완료 체크
            const allCompleted = updatedObjectives.every((obj) => obj.completed);

            return {
              ...quest,
              objectives: updatedObjectives,
              status: allCompleted ? 'completed' : quest.status,
            };
          }),
        }));
      },

      completeQuest: (questId) => {
        const state = get();
        const quest = state.activeQuests.find((q) => q.id === questId);

        if (!quest) return;

        // 보상 지급 (gameStore와 연동 필요)
        // TODO: 보상 로직 추가

        set((state) => ({
          activeQuests: state.activeQuests.filter((q) => q.id !== questId),
          completedQuests: [...state.completedQuests, questId],
          storyProgress: {
            ...state.storyProgress,
            completedQuests: [...state.storyProgress.completedQuests, questId],
            activeQuests: state.storyProgress.activeQuests.filter((id) => id !== questId),
          },
        }));

        // 완료 대화 표시
        if (quest.completeDialogId) {
          get().showCharacterDialog(
            quest.character?.id || 'secretary_kim',
            quest.completeDialogId
          );
        }
      },

      failQuest: (questId) => {
        set((state) => ({
          activeQuests: state.activeQuests.map((q) =>
            q.id === questId ? { ...q, status: 'failed' as const } : q
          ),
        }));
      },

      // ============================================
      // 미니게임
      // ============================================

      startMiniGame: (config) => {
        set({ activeMiniGame: config });

        // 인트로 대화 표시
        get().showDialog({
          type: 'minigame-intro',
          priority: 'high',
          backdrop: true,
          gameType: config.type,
          title: getMiniGameTitle(config.type),
          message: getMiniGameDescription(config.type),
        });
      },

      endMiniGame: (result) => {
        set((state) => ({
          activeMiniGame: null,
          miniGameHistory: [...state.miniGameHistory, result],
        }));

        // 결과 대화 표시
        get().showDialog({
          type: 'minigame-result',
          priority: 'high',
          backdrop: true,
          gameType: result.type,
          score: result.score,
          maxScore: result.maxScore,
          grade: result.grade,
          rewards: result.rewards,
          title: result.grade === 'F' ? '실패...' : '완료!',
          message: getMiniGameResultMessage(result),
        });
      },

      // ============================================
      // 오프라인 진행
      // ============================================

      calculateOfflineProgress: () => {
        const now = new Date();
        const lastOnline = get().offlineProgress?.lastOnlineTime || now;
        const offlineDuration = now.getTime() - new Date(lastOnline).getTime();

        // 최소 1분 이상 오프라인이었을 때만 보상
        if (offlineDuration < 60000) {
          return {
            lastOnlineTime: now,
            offlineDuration: 0,
            passiveIncome: 0,
            autoProductionProgress: {},
            autoResearchProgress: {},
            missedEvents: [],
          };
        }

        // TODO: 실제 오프라인 수익 계산 로직
        const hours = offlineDuration / (1000 * 60 * 60);
        const passiveIncome = Math.floor(hours * 100000); // 시간당 10만 달러

        const progress: OfflineProgress = {
          lastOnlineTime: now,
          offlineDuration,
          passiveIncome,
          autoProductionProgress: {},
          autoResearchProgress: {},
          missedEvents: [],
          welcomeBackBonus: hours >= 4 ? { type: 'cash', amount: 500000 } : undefined,
        };

        set({ offlineProgress: progress });
        return progress;
      },

      claimOfflineRewards: () => {
        const progress = get().offlineProgress;
        if (!progress || progress.passiveIncome === 0) return;

        // TODO: gameStore와 연동하여 보상 지급

        // 환영 메시지
        get().showDialog({
          type: 'character',
          priority: 'high',
          backdrop: true,
          character: getCharacterById('secretary_kim')!,
          emotion: 'happy',
          title: '다시 오셨군요!',
          message: `${Math.floor(progress.offlineDuration / 3600000)}시간 동안 조선소가 잘 운영되었습니다.\n\n💰 오프라인 수익: $${(progress.passiveIncome / 1000000).toFixed(2)}M`,
        });

        set({ offlineProgress: null });
      },

      // ============================================
      // 유틸리티 (Promise 기반)
      // ============================================

      alert: (title, message) => {
        return new Promise<void>((resolve) => {
          get().showDialog({
            type: 'alert',
            priority: 'high',
            backdrop: true,
            title,
            message,
            confirmText: '확인',
            onConfirm: () => {
              resolve();
            },
            onClose: () => {
              resolve();
            },
          });
        });
      },

      confirm: (title, message) => {
        return new Promise<boolean>((resolve) => {
          get().showDialog({
            type: 'confirm',
            priority: 'high',
            backdrop: true,
            title,
            message,
            confirmText: '확인',
            cancelText: '취소',
            onConfirm: () => {
              resolve(true);
            },
            onCancel: () => {
              resolve(false);
            },
            onClose: () => {
              resolve(false);
            },
          });
        });
      },

      success: (title, message) => {
        return new Promise<void>((resolve) => {
          get().showDialog({
            type: 'success',
            priority: 'normal',
            backdrop: true,
            title,
            message,
            confirmText: '확인',
            onConfirm: () => {
              resolve();
            },
            onClose: () => {
              resolve();
            },
          });
        });
      },

      warning: (title, message) => {
        return new Promise<void>((resolve) => {
          get().showDialog({
            type: 'warning',
            priority: 'high',
            backdrop: true,
            title,
            message,
            confirmText: '확인',
            onConfirm: () => {
              resolve();
            },
            onClose: () => {
              resolve();
            },
          });
        });
      },
    }),
    {
      name: 'shipyard-dialog-store',
      partialize: (state) => ({
        tutorialCompleted: state.tutorialCompleted,
        tutorialSkipped: state.tutorialSkipped,
        storyProgress: state.storyProgress,
        completedQuests: state.completedQuests,
        miniGameHistory: state.miniGameHistory,
        offlineProgress: state.offlineProgress,
      }),
    }
  )
);

// ============================================
// 헬퍼 함수
// ============================================

function getMiniGameTitle(type: string): string {
  const titles: Record<string, string> = {
    welding: '용접 타이밍 게임',
    inspection: '품질 검사 게임',
    assembly: '블록 조립 퍼즐',
    crisis: '위기 대응 게임',
  };
  return titles[type] || '미니게임';
}

function getMiniGameDescription(type: string): string {
  const descriptions: Record<string, string> = {
    welding: '정확한 타이밍에 버튼을 눌러 완벽한 용접을 완성하세요!',
    inspection: '선박의 결함을 찾아 품질을 높이세요!',
    assembly: '블록을 올바른 위치에 배치하여 선박을 조립하세요!',
    crisis: '빠르게 발생하는 문제들을 해결하세요!',
  };
  return descriptions[type] || '미니게임을 시작합니다.';
}

function getMiniGameResultMessage(result: MiniGameResult): string {
  const gradeMessages: Record<string, string> = {
    S: '완벽합니다! 최고의 실력이에요!',
    A: '훌륭합니다! 거의 완벽해요!',
    B: '좋습니다! 조금만 더 노력하면 됩니다.',
    C: '괜찮습니다. 연습이 필요해요.',
    F: '아쉽습니다. 다시 도전해보세요.',
  };

  let message = gradeMessages[result.grade] + '\n\n';
  message += `점수: ${result.score}/${result.maxScore}\n`;
  message += `등급: ${result.grade}\n`;

  if (result.rewards.length > 0) {
    message += '\n보상:\n';
    result.rewards.forEach((reward) => {
      message += `• ${reward.description}\n`;
    });
  }

  return message;
}

// 편의용 훅
export const useDialog = () => {
  const store = useDialogStore();
  return {
    alert: store.alert,
    confirm: store.confirm,
    success: store.success,
    warning: store.warning,
    showToast: store.showToast,
    showDialog: store.showDialog,
    closeDialog: store.closeDialog,
  };
};
