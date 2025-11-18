import { useState } from 'react';
import { X, AlertTriangle, TrendingUp, DollarSign, Factory, Users } from 'lucide-react';
import type { GameEvent } from '../../types';

interface EventNotificationProps {
  event: GameEvent;
  onClose: () => void;
  onChoice?: (choiceIndex: number) => void;
}

export default function EventNotification({ event, onClose, onChoice }: EventNotificationProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleChoice = (index: number) => {
    if (onChoice) {
      onChoice(index);
    }
    handleClose();
  };

  const getEventIcon = () => {
    switch (event.type) {
      case 'MARKET':
        return <TrendingUp className="w-8 h-8 text-blue-400" />;
      case 'FINANCE':
        return <DollarSign className="w-8 h-8 text-green-400" />;
      case 'PRODUCTION':
        return <Factory className="w-8 h-8 text-orange-400" />;
      case 'CONTRACT':
        return <Users className="w-8 h-8 text-purple-400" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getEventColor = () => {
    switch (event.type) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        className={`max-w-lg w-full rounded-lg border-2 shadow-2xl transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        } ${getEventColor()}`}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between p-6 border-b border-gray-700">
          <div className="flex items-start space-x-4">
            <div className="mt-1">{getEventIcon()}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{event.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {event.type === 'MARKET' && '시장 이벤트'}
                {event.type === 'FINANCE' && '재무 이벤트'}
                {event.type === 'PRODUCTION' && '생산 이벤트'}
                {event.type === 'CONTRACT' && '고객 이벤트'}
                {event.type === 'RANDOM' && '특별 이벤트'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6">
          <p className="text-gray-200 leading-relaxed">{event.description}</p>
        </div>

        {/* 선택지 또는 확인 버튼 */}
        <div className="p-6 pt-0">
          {event.choices && event.choices.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 mb-3">어떻게 하시겠습니까?</p>
              {event.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-left"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          ) : (
            <button onClick={handleClose} className="btn-primary w-full">
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
