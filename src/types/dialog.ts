// 통합 대화 시스템 타입 정의

// ============================================
// 캐릭터 시스템
// ============================================

export type CharacterRole =
  | 'secretary'    // 비서 (튜토리얼, 알림 담당)
  | 'competitor'   // 경쟁사 CEO
  | 'customer'     // 고객사 담당자
  | 'worker'       // 직원 (노조 대표 등)
  | 'government'   // 정부 관계자
  | 'investor';    // 투자자

export type Emotion =
  | 'neutral'
  | 'happy'
  | 'excited'
  | 'worried'
  | 'angry'
  | 'sad'
  | 'surprised'
  | 'thinking';

export interface Character {
  id: string;
  name: string;
  nameKo: string;           // 한글 이름
  role: CharacterRole;
  title: string;            // 직함
  company?: string;         // 소속 회사
  avatar: string;           // 기본 아바타 (이모지 또는 이미지 경로)
  color: string;            // 테마 색상
  personality: string;      // 성격 설명
}

// ============================================
// 다이얼로그 타입
// ============================================

export type DialogType =
  | 'alert'           // 단순 알림
  | 'confirm'         // 확인/취소
  | 'success'         // 성공 알림
  | 'warning'         // 경고 알림
  | 'error'           // 에러 알림
  | 'toast'           // 토스트 (자동 소멸)
  | 'event'           // 게임 이벤트
  | 'story'           // 스토리 대화
  | 'character'       // 캐릭터 대화
  | 'tutorial'        // 튜토리얼
  | 'quest'           // 퀘스트 알림
  | 'achievement'     // 업적 달성
  | 'minigame-intro'  // 미니게임 시작
  | 'minigame-result' // 미니게임 결과
  | 'choice';         // 다중 선택

export type DialogPriority = 'low' | 'normal' | 'high' | 'critical';

// 기본 다이얼로그 인터페이스
export interface BaseDialog {
  id: string;
  type: DialogType;
  priority: DialogPriority;
  timestamp: number;

  // 공통 필드
  title?: string;
  message?: string;

  // 표시 옵션
  dismissible?: boolean;      // X 버튼으로 닫기 가능
  autoClose?: number;         // 자동 닫힘 시간 (ms)
  backdrop?: boolean;         // 배경 딤 처리
  position?: 'center' | 'top' | 'bottom' | 'bottom-right';

  // 콜백
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// 선택지
export interface DialogChoice {
  id: string;
  text: string;
  icon?: string;
  disabled?: boolean;
  disabledReason?: string;
  effect?: () => void;
  consequence?: string;       // 선택 결과 미리보기
}

// 알림 다이얼로그
export interface AlertDialog extends BaseDialog {
  type: 'alert' | 'success' | 'warning' | 'error';
  confirmText?: string;
}

// 확인 다이얼로그
export interface ConfirmDialog extends BaseDialog {
  type: 'confirm';
  confirmText?: string;
  cancelText?: string;
}

// 토스트 다이얼로그
export interface ToastDialog extends BaseDialog {
  type: 'toast' | 'achievement';
  toastType?: 'success' | 'error' | 'info' | 'achievement';
  icon?: string;
}

// 캐릭터 대화 다이얼로그
export interface CharacterDialog extends BaseDialog {
  type: 'character' | 'story';
  character: Character;
  emotion?: Emotion;
  choices?: DialogChoice[];
  nextDialogId?: string;      // 다음 대화 ID
  typewriter?: boolean;       // 타자기 효과
}

// 이벤트 다이얼로그
export interface EventDialog extends BaseDialog {
  type: 'event';
  eventType: 'MARKET' | 'FINANCE' | 'PRODUCTION' | 'CONTRACT' | 'RANDOM';
  choices?: DialogChoice[];
  icon?: string;
}

// 튜토리얼 다이얼로그
export interface TutorialDialog extends BaseDialog {
  type: 'tutorial';
  step: number;
  totalSteps: number;
  character?: Character;
  action?: string;            // 사용자가 해야 할 동작
  highlightElement?: string;  // 강조할 요소 selector
  canSkip?: boolean;
  canGoBack?: boolean;
}

// 퀘스트 다이얼로그
export interface QuestDialog extends BaseDialog {
  type: 'quest';
  questId: string;
  questType: 'main' | 'side' | 'daily';
  status: 'new' | 'progress' | 'complete' | 'failed';
  rewards?: QuestReward[];
  character?: Character;
}

// 미니게임 다이얼로그
export interface MiniGameDialog extends BaseDialog {
  type: 'minigame-intro' | 'minigame-result';
  gameType: MiniGameType;
  score?: number;
  maxScore?: number;
  grade?: 'S' | 'A' | 'B' | 'C' | 'F';
  rewards?: MiniGameReward[];
}

// 다중 선택 다이얼로그
export interface ChoiceDialog extends BaseDialog {
  type: 'choice';
  choices: DialogChoice[];
  character?: Character;
  minChoices?: number;
  maxChoices?: number;
}

// 통합 다이얼로그 유니온 타입
export type Dialog =
  | AlertDialog
  | ConfirmDialog
  | ToastDialog
  | CharacterDialog
  | EventDialog
  | TutorialDialog
  | QuestDialog
  | MiniGameDialog
  | ChoiceDialog;

// ============================================
// 퀘스트 시스템
// ============================================

export type QuestCategory =
  | 'production'    // 생산 관련
  | 'finance'       // 재무 관련
  | 'reputation'    // 평판 관련
  | 'research'      // 연구 관련
  | 'expansion'     // 확장 관련
  | 'market'        // 시장 관련
  | 'story';        // 스토리 관련

export interface QuestObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface QuestReward {
  type: 'cash' | 'reputation' | 'research' | 'unlock' | 'achievement';
  amount?: number;
  itemId?: string;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  type: 'main' | 'side' | 'daily';

  // 진행
  objectives: QuestObjective[];
  status: 'locked' | 'available' | 'active' | 'completed' | 'failed';

  // 요구사항
  prerequisites?: string[];   // 선행 퀘스트 ID
  requiredReputation?: number;
  requiredDate?: Date;

  // 보상
  rewards: QuestReward[];

  // 스토리
  startDialogId?: string;
  completeDialogId?: string;
  character?: Character;

  // 시간 제한
  timeLimit?: number;         // 일 단위
  expiresAt?: Date;
}

// ============================================
// 미니게임 시스템
// ============================================

export type MiniGameType =
  | 'welding'       // 용접 타이밍 게임
  | 'inspection'    // 품질 검사 게임
  | 'assembly'      // 블록 조립 퍼즐
  | 'crisis';       // 위기 대응 게임

export type MiniGameDifficulty = 'easy' | 'normal' | 'hard' | 'expert';

export interface MiniGameReward {
  type: 'efficiency' | 'quality' | 'speed' | 'reputation' | 'cash';
  value: number;
  description: string;
}

export interface MiniGameConfig {
  type: MiniGameType;
  difficulty: MiniGameDifficulty;
  timeLimit: number;          // 초 단위
  targetScore: number;

  // 연결된 계약 (선택적)
  contractId?: string;
  dockId?: string;
}

export interface MiniGameResult {
  type: MiniGameType;
  score: number;
  maxScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  timeTaken: number;
  rewards: MiniGameReward[];
  bonusApplied: boolean;
}

// ============================================
// 스토리 시스템
// ============================================

export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  order: number;

  // 진행
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  quests: string[];           // 퀘스트 ID 배열

  // 조건
  prerequisites?: string[];   // 선행 챕터 ID
  requiredDate?: Date;

  // 보상
  completionRewards?: QuestReward[];
}

export interface StoryProgress {
  currentChapter: string;
  completedChapters: string[];
  currentQuest?: string;
  completedQuests: string[];
  activeQuests: string[];

  // 선택 기록
  choiceHistory: {
    dialogId: string;
    choiceId: string;
    timestamp: Date;
  }[];

  // 캐릭터 호감도
  characterAffinity: Record<string, number>;
}

// ============================================
// 오프라인 수익 시스템
// ============================================

export interface OfflineProgress {
  lastOnlineTime: Date;
  offlineDuration: number;    // 밀리초

  // 수익
  passiveIncome: number;
  autoProductionProgress: Record<string, number>;  // contractId -> progress
  autoResearchProgress: Record<string, number>;    // researchId -> progress

  // 이벤트
  missedEvents: string[];

  // 보너스
  welcomeBackBonus?: {
    type: string;
    amount: number;
  };
}

// ============================================
// 다이얼로그 스토어 상태
// ============================================

export interface DialogState {
  // 현재 표시 중인 다이얼로그들
  dialogs: Dialog[];

  // 토스트 (별도 관리 - 여러 개 동시 표시)
  toasts: ToastDialog[];

  // 튜토리얼 상태
  tutorialActive: boolean;
  tutorialStep: number;
  tutorialCompleted: boolean;
  tutorialSkipped: boolean;

  // 스토리 진행
  storyProgress: StoryProgress;

  // 퀘스트 상태
  activeQuests: Quest[];
  completedQuests: string[];

  // 미니게임 상태
  activeMiniGame: MiniGameConfig | null;
  miniGameHistory: MiniGameResult[];

  // 오프라인 진행
  offlineProgress: OfflineProgress | null;
}

// 다이얼로그 생성용 타입 (모든 가능한 필드 포함)
export interface CreateDialogInput {
  type: DialogType;
  priority?: DialogPriority;

  // 공통 필드
  title?: string;
  message?: string;
  dismissible?: boolean;
  autoClose?: number;
  backdrop?: boolean;
  position?: 'center' | 'top' | 'bottom' | 'bottom-right';

  // 콜백
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;

  // AlertDialog / ConfirmDialog
  confirmText?: string;
  cancelText?: string;

  // ToastDialog
  toastType?: 'success' | 'error' | 'info' | 'achievement';
  icon?: string;

  // CharacterDialog
  character?: Character;
  emotion?: Emotion;
  choices?: DialogChoice[];
  nextDialogId?: string;
  typewriter?: boolean;

  // EventDialog
  eventType?: 'MARKET' | 'FINANCE' | 'PRODUCTION' | 'CONTRACT' | 'RANDOM';

  // TutorialDialog
  step?: number;
  totalSteps?: number;
  action?: string;
  highlightElement?: string;
  canSkip?: boolean;
  canGoBack?: boolean;

  // QuestDialog
  questId?: string;
  questType?: 'main' | 'side' | 'daily';
  status?: 'new' | 'progress' | 'complete' | 'failed';
  rewards?: QuestReward[] | MiniGameReward[];

  // MiniGameDialog
  gameType?: MiniGameType;
  score?: number;
  maxScore?: number;
  grade?: 'S' | 'A' | 'B' | 'C' | 'F';

  // ChoiceDialog
  minChoices?: number;
  maxChoices?: number;
}

// 토스트 생성용 타입
export interface CreateToastInput {
  title: string;
  message?: string;
  toastType?: 'success' | 'error' | 'info' | 'achievement';
  autoClose?: number;
  priority?: DialogPriority;
}

export interface DialogActions {
  // 다이얼로그 표시/숨기기
  showDialog: (dialog: CreateDialogInput) => string;
  closeDialog: (id: string) => void;
  closeAllDialogs: () => void;

  // 토스트
  showToast: (toast: CreateToastInput) => string;
  removeToast: (id: string) => void;

  // 캐릭터 대화
  showCharacterDialog: (characterId: string, dialogId: string) => void;
  advanceDialog: (choiceId?: string) => void;

  // 튜토리얼
  startTutorial: () => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;

  // 퀘스트
  startQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, objectiveId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;

  // 미니게임
  startMiniGame: (config: MiniGameConfig) => void;
  endMiniGame: (result: MiniGameResult) => void;

  // 오프라인
  calculateOfflineProgress: () => OfflineProgress;
  claimOfflineRewards: () => void;

  // 유틸리티
  alert: (title: string, message: string) => Promise<void>;
  confirm: (title: string, message: string) => Promise<boolean>;
  success: (title: string, message: string) => Promise<void>;
  warning: (title: string, message: string) => Promise<void>;
}
