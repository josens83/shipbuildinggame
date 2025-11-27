// 통합 다이얼로그 매니저 컴포넌트

import { useDialogStore } from '../../store/dialogStore';
import type { Dialog } from '../../types/dialog';

// 개별 다이얼로그 컴포넌트들
import AlertDialogComponent from './AlertDialog';
import ConfirmDialogComponent from './ConfirmDialogComponent';
import CharacterDialogComponent from './CharacterDialog';
import TutorialDialogComponent from './TutorialDialog';
import EventDialogComponent from './EventDialog';
import ToastContainerComponent from './ToastContainer';
import MiniGameDialogComponent from './MiniGameDialog';
import QuestDialogComponent from './QuestDialog';

export default function DialogManager() {
  const { dialogs, toasts } = useDialogStore();

  // 가장 우선순위가 높은 다이얼로그를 렌더링
  const renderDialog = (dialog: Dialog) => {
    const key = dialog.id;

    switch (dialog.type) {
      case 'alert':
      case 'success':
      case 'warning':
      case 'error':
        return <AlertDialogComponent key={key} dialog={dialog} />;

      case 'confirm':
        return <ConfirmDialogComponent key={key} dialog={dialog} />;

      case 'character':
      case 'story':
        return <CharacterDialogComponent key={key} dialog={dialog} />;

      case 'tutorial':
        return <TutorialDialogComponent key={key} dialog={dialog} />;

      case 'event':
        return <EventDialogComponent key={key} dialog={dialog} />;

      case 'minigame-intro':
      case 'minigame-result':
        return <MiniGameDialogComponent key={key} dialog={dialog} />;

      case 'quest':
        return <QuestDialogComponent key={key} dialog={dialog} />;

      case 'choice':
        // choice는 CharacterDialog와 유사하게 처리
        return <CharacterDialogComponent key={key} dialog={dialog} />;

      default:
        console.warn(`Unknown dialog type: ${(dialog as Dialog).type}`);
        return null;
    }
  };

  return (
    <>
      {/* 메인 다이얼로그 (한 번에 하나만 표시, 가장 우선순위 높은 것) */}
      {dialogs.length > 0 && renderDialog(dialogs[0])}

      {/* 토스트는 항상 표시 (여러 개 가능) */}
      <ToastContainerComponent toasts={toasts} />
    </>
  );
}
