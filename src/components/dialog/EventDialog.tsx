// 이벤트 다이얼로그 컴포넌트

import { useState } from 'react';
import { X, TrendingUp, DollarSign, Factory, Users, Sparkles } from 'lucide-react';
import { useDialogStore } from '../../store/dialogStore';
import type { EventDialog } from '../../types/dialog';

interface EventDialogProps {
  dialog: EventDialog;
}

export default function EventDialogComponent({ dialog }: EventDialogProps) {
  const { closeDialog } = useDialogStore();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (dialog.onClose) {
        dialog.onClose();
      }
      closeDialog(dialog.id);
    }, 300);
  };

  const handleChoice = (choiceId: string) => {
    const choice = dialog.choices?.find(c => c.id === choiceId);
    if (choice?.effect) {
      choice.effect();
    }
    handleClose();
  };

  const getEventIcon = () => {
    switch (dialog.eventType) {
      case 'MARKET':
        return <TrendingUp className="w-8 h-8 text-blue-400" />;
      case 'FINANCE':
        return <DollarSign className="w-8 h-8 text-green-400" />;
      case 'PRODUCTION':
        return <Factory className="w-8 h-8 text-orange-400" />;
      case 'CONTRACT':
        return <Users className="w-8 h-8 text-purple-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getEventColor = () => {
    switch (dialog.eventType) {
      case 'MARKET':
        return 'border-blue-500 bg-blue-900/20';
      case 'FINANCE':
        return 'border-green-500 bg-green-900/20';
      case 'PRODUCTION':
        return 'border-orange-500 bg-orange-900/20';
      case 'CONTRACT':
        return 'border-purple-500 bg-purple-900/20';
      default:
        return 'border-yellow-500 bg-yellow-900/20';
    }
  };

  const getEventTypeName = () => {
    switch (dialog.eventType) {
      case 'MARKET':
        return '시장 이벤트';
      case 'FINANCE':
        return '재무 이벤트';
      case 'PRODUCTION':
        return '생산 이벤트';
      case 'CONTRACT':
        return '고객 이벤트';
      default:
        return '특별 이벤트';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        className={`max-w-lg w-full rounded-xl border-2 shadow-2xl transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-scale-in'
        } ${getEventColor()}`}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between p-6 border-b border-gray-700">
          <div className="flex items-start space-x-4">
            <div className="mt-1">{getEventIcon()}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{dialog.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{getEventTypeName()}</p>
            </div>
          </div>
          {dialog.dismissible !== false && (
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* 본문 */}
        <div className="p-6">
          <p className="text-gray-200 leading-relaxed whitespace-pre-line">
            {dialog.message}
          </p>
        </div>

        {/* 선택지 또는 확인 버튼 */}
        <div className="p-6 pt-0">
          {dialog.choices && dialog.choices.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 mb-3">어떻게 하시겠습니까?</p>
              {dialog.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  disabled={choice.disabled}
                  className={`w-full px-4 py-3 rounded-lg transition-all text-left ${
                    choice.disabled
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white hover:translate-x-1'
                  }`}
                >
                  <span>{choice.text}</span>
                  {choice.consequence && (
                    <p className="text-xs text-gray-400 mt-1">{choice.consequence}</p>
                  )}
                </button>
              ))}
            </div>
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
