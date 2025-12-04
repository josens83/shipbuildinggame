// 캐릭터 대화 다이얼로그 컴포넌트

import { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { useDialogStore } from '../../store/dialogStore';
import { getCharacterEmoji } from '../../data/characters';
import type { CharacterDialog, ChoiceDialog } from '../../types/dialog';

interface CharacterDialogProps {
  dialog: CharacterDialog | ChoiceDialog;
}

export default function CharacterDialogComponent({ dialog }: CharacterDialogProps) {
  const { closeDialog, advanceDialog } = useDialogStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  const character = 'character' in dialog ? dialog.character : undefined;
  const emotion = 'emotion' in dialog ? dialog.emotion : 'neutral';
  const message = dialog.message || '';
  const choices = dialog.choices;
  const typewriter = 'typewriter' in dialog ? dialog.typewriter : true;

  // 타자기 효과
  useEffect(() => {
    if (!typewriter) {
      setDisplayedText(message);
      setShowChoices(true);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    setShowChoices(false);

    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        setShowChoices(true);
      }
    }, 30); // 30ms per character

    return () => clearInterval(timer);
  }, [message, typewriter]);

  // 텍스트 스킵
  const handleSkipText = () => {
    if (isTyping) {
      setDisplayedText(message);
      setIsTyping(false);
      setShowChoices(true);
    }
  };

  const handleChoice = (choiceId: string) => {
    advanceDialog(choiceId);
  };

  const handleContinue = () => {
    if (isTyping) {
      handleSkipText();
      return;
    }
    advanceDialog();
  };

  const handleClose = () => {
    if (dialog.onClose) {
      dialog.onClose();
    }
    closeDialog(dialog.id);
  };

  const characterEmoji = character
    ? getCharacterEmoji(character.id, emotion || 'neutral')
    : '👤';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4 pb-8">
      <div className="w-full max-w-3xl animate-slide-up">
        {/* 캐릭터 정보 */}
        {character && (
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-lg"
              style={{ backgroundColor: character.color + '40', borderColor: character.color, borderWidth: 2 }}
            >
              {characterEmoji}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{character.nameKo}</h3>
              <p className="text-sm text-gray-400">
                {character.title}
                {character.company && ` • ${character.company}`}
              </p>
            </div>
          </div>
        )}

        {/* 대화 박스 */}
        <div
          className="bg-gray-800 rounded-xl border-2 shadow-2xl overflow-hidden"
          style={{ borderColor: character?.color || '#3B82F6' }}
        >
          {/* 제목 (있는 경우) */}
          {dialog.title && (
            <div
              className="px-6 py-3 border-b border-gray-700"
              style={{ backgroundColor: (character?.color || '#3B82F6') + '20' }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{dialog.title}</h2>
                {dialog.dismissible !== false && (
                  <button
                    onClick={handleClose}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 메시지 */}
          <div
            className="p-6 min-h-[120px] cursor-pointer"
            onClick={handleSkipText}
          >
            <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-line">
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>

          {/* 선택지 또는 계속 버튼 */}
          <div className="px-6 pb-6">
            {showChoices && choices && choices.length > 0 ? (
              <div className="space-y-2">
                {choices.map((choice, index) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    disabled={choice.disabled}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      choice.disabled
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-600 text-white hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <span>{choice.text}</span>
                        {choice.consequence && (
                          <p className="text-xs text-gray-400 mt-1">{choice.consequence}</p>
                        )}
                        {choice.disabled && choice.disabledReason && (
                          <p className="text-xs text-red-400 mt-1">{choice.disabledReason}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {isTyping ? '스킵' : '계속'}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 클릭 힌트 */}
        {isTyping && (
          <p className="text-center text-gray-500 text-sm mt-2">
            화면을 클릭하여 스킵
          </p>
        )}
      </div>
    </div>
  );
}
