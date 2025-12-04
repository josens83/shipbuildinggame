// 품질 검사 게임 컴포넌트 (틀린 그림 찾기)

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Timer, Star, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMiniGameStore } from '../../store/miniGameStore';
import { useDialogStore } from '../../store/dialogStore';

interface InspectionGameProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface Defect {
  id: number;
  x: number;
  y: number;
  found: boolean;
  type: 'crack' | 'rust' | 'dent' | 'misalign';
}

export default function InspectionGame({ onComplete, onCancel }: InspectionGameProps) {
  const {
    score,
    timeRemaining,
    addScore,
    increaseCombo,
    resetCombo,
    tick,
    endGame,
  } = useMiniGameStore();

  const { showToast } = useDialogStore();

  // 게임 상태
  const [defects, setDefects] = useState<Defect[]>([]);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [clickFeedback, setClickFeedback] = useState<{ x: number; y: number; type: 'correct' | 'wrong' } | null>(null);

  const timerRef = useRef<number | undefined>(undefined);
  const gridRef = useRef<HTMLDivElement>(null);

  // 결함 생성
  useEffect(() => {
    const defectTypes: Array<'crack' | 'rust' | 'dent' | 'misalign'> = ['crack', 'rust', 'dent', 'misalign'];
    const numDefects = 8;
    const newDefects: Defect[] = [];

    for (let i = 0; i < numDefects; i++) {
      newDefects.push({
        id: i,
        x: 10 + Math.random() * 80, // 10% ~ 90%
        y: 10 + Math.random() * 80,
        found: false,
        type: defectTypes[Math.floor(Math.random() * defectTypes.length)],
      });
    }

    setDefects(newDefects);
  }, []);

  // 타이머
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      tick(100);
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [tick]);

  // 시간 종료 또는 모든 결함 찾기
  useEffect(() => {
    if (timeRemaining <= 0 || (defects.length > 0 && foundCount === defects.length)) {
      handleGameEnd();
    }
  }, [timeRemaining, foundCount, defects.length]);

  // 클릭 처리
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 결함 체크 (근처 클릭 허용)
    const clickRadius = 8; // 8% 반경
    const foundDefect = defects.find(
      (d) =>
        !d.found &&
        Math.abs(d.x - x) < clickRadius &&
        Math.abs(d.y - y) < clickRadius
    );

    if (foundDefect) {
      // 결함 발견!
      setDefects((prev) =>
        prev.map((d) => (d.id === foundDefect.id ? { ...d, found: true } : d))
      );
      setFoundCount((prev) => prev + 1);
      addScore(Math.floor(100 / defects.length));
      increaseCombo();
      setClickFeedback({ x, y, type: 'correct' });

      showToast({
        title: `결함 발견! (${foundCount + 1}/${defects.length})`,
        toastType: 'success',
        autoClose: 1000,
      });
    } else {
      // 틀린 클릭
      setWrongClicks((prev) => prev + 1);
      resetCombo();
      setClickFeedback({ x, y, type: 'wrong' });
    }

    setTimeout(() => setClickFeedback(null), 300);
  }, [defects, foundCount, addScore, increaseCombo, resetCombo, showToast]);

  // 게임 종료
  const handleGameEnd = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    endGame();
    onComplete();
  };

  const handleCancel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onCancel();
  };

  // 결함 아이콘
  const getDefectIcon = (type: string) => {
    switch (type) {
      case 'crack':
        return '⚡';
      case 'rust':
        return '🔶';
      case 'dent':
        return '⭕';
      case 'misalign':
        return '↗️';
      default:
        return '❌';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Search className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">품질 검사</h2>
            <p className="text-sm text-gray-400">선체의 결함을 모두 찾으세요!</p>
          </div>
        </div>

        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* 게임 정보 */}
      <div className="bg-gray-800/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white font-bold">{foundCount}</span>
            <span className="text-gray-400">/ {defects.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-white">오답: </span>
            <span className="text-red-400 font-bold">{wrongClicks}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">{score}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-400" />
          <span className={`font-mono font-bold ${timeRemaining <= 10 ? 'text-red-400' : 'text-white'}`}>
            {Math.ceil(timeRemaining)}s
          </span>
        </div>
      </div>

      {/* 게임 영역 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          ref={gridRef}
          onClick={handleClick}
          className="relative w-full max-w-2xl aspect-[4/3] bg-gray-700 rounded-xl overflow-hidden cursor-crosshair border-4 border-gray-600"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #374151 25%, transparent 25%),
              linear-gradient(-45deg, #374151 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #374151 75%),
              linear-gradient(-45deg, transparent 75%, #374151 75%)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
          }}
        >
          {/* 선체 구조 라인 */}
          <div className="absolute inset-0">
            {/* 수평 라인 */}
            {[20, 40, 60, 80].map((y) => (
              <div
                key={`h-${y}`}
                className="absolute left-0 right-0 h-0.5 bg-gray-500/50"
                style={{ top: `${y}%` }}
              />
            ))}
            {/* 수직 라인 */}
            {[25, 50, 75].map((x) => (
              <div
                key={`v-${x}`}
                className="absolute top-0 bottom-0 w-0.5 bg-gray-500/50"
                style={{ left: `${x}%` }}
              />
            ))}
          </div>

          {/* 결함들 */}
          {defects.map((defect) => (
            <div
              key={defect.id}
              className={`absolute w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                defect.found
                  ? 'opacity-100 scale-125'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                left: `calc(${defect.x}% - 16px)`,
                top: `calc(${defect.y}% - 16px)`,
              }}
            >
              {defect.found ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <span className="text-2xl filter blur-[1px] hover:blur-0">
                  {getDefectIcon(defect.type)}
                </span>
              )}
            </div>
          ))}

          {/* 클릭 피드백 */}
          {clickFeedback && (
            <div
              className={`absolute w-8 h-8 rounded-full animate-ping ${
                clickFeedback.type === 'correct' ? 'bg-green-500/50' : 'bg-red-500/50'
              }`}
              style={{
                left: `calc(${clickFeedback.x}% - 16px)`,
                top: `calc(${clickFeedback.y}% - 16px)`,
              }}
            />
          )}

          {/* 안내 텍스트 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white text-sm">클릭하여 결함을 찾으세요</p>
          </div>
        </div>
      </div>

      {/* 결함 범례 */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span className="text-gray-400">균열</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔶</span>
            <span className="text-gray-400">부식</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⭕</span>
            <span className="text-gray-400">찌그러짐</span>
          </div>
          <div className="flex items-center gap-2">
            <span>↗️</span>
            <span className="text-gray-400">정렬 불량</span>
          </div>
        </div>
      </div>
    </div>
  );
}
