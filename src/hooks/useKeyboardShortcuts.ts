import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useToast } from '../components/common/Toast';

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = () => {
  const {
    gameSpeed,
    setGameSpeed,
    saveToSlot,
  } = useGameStore();

  const { success, info } = useToast();

  // Quick save to slot 0
  const handleQuickSave = useCallback(() => {
    const saved = saveToSlot(0);
    if (saved) {
      success('빠른 저장', '슬롯 1에 저장되었습니다');
    }
  }, [saveToSlot, success]);

  // Toggle pause (1 = paused, 2 = normal speed)
  const handleTogglePause = useCallback(() => {
    if (gameSpeed === 1) {
      setGameSpeed(2);
      info('재개', '게임이 재개되었습니다');
    } else {
      setGameSpeed(1);
      info('일시정지', '게임이 일시정지되었습니다');
    }
  }, [gameSpeed, setGameSpeed, info]);

  // Set game speed
  const handleSetSpeed = useCallback((speed: 1 | 2 | 3) => {
    setGameSpeed(speed);
    info('속도 변경', `게임 속도: ${speed}x`);
  }, [setGameSpeed, info]);

  useEffect(() => {
    const shortcuts: ShortcutAction[] = [
      {
        key: ' ', // Space
        description: '일시정지/재개',
        action: handleTogglePause,
      },
      {
        key: '1',
        description: '속도 1x',
        action: () => handleSetSpeed(1),
      },
      {
        key: '2',
        description: '속도 2x',
        action: () => handleSetSpeed(2),
      },
      {
        key: '3',
        description: '속도 3x',
        action: () => handleSetSpeed(3),
      },
      {
        key: 's',
        ctrl: true,
        description: '빠른 저장',
        action: handleQuickSave,
      },
    ];

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key === shortcut.key ||
                        event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePause, handleSetSpeed, handleQuickSave]);
};

// Helper to get all shortcut descriptions for display
export const getShortcutDescriptions = () => [
  { key: 'Space', description: '일시정지/재개' },
  { key: '1', description: '속도 1x' },
  { key: '2', description: '속도 2x' },
  { key: '3', description: '속도 3x' },
  { key: 'Ctrl + S', description: '빠른 저장' },
];
