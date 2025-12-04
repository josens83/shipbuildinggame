// 용접 타이밍 게임 컴포넌트

import { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, Timer, Target, Star, X } from 'lucide-react';
import { useMiniGameStore } from '../../store/miniGameStore';
import { useDialogStore } from '../../store/dialogStore';

interface WeldingGameProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function WeldingGame({ onComplete, onCancel }: WeldingGameProps) {
  const {
    score,
    maxScore,
    timeRemaining,
    combo,
    addScore,
    increaseCombo,
    resetCombo,
    tick,
    endGame,
  } = useMiniGameStore();

  const { showToast } = useDialogStore();

  // 게임 상태
  const [gaugePosition, setGaugePosition] = useState(0);
  const [gaugeDirection, setGaugeDirection] = useState(1);
  const [targetZone, setTargetZone] = useState({ start: 40, end: 60 });
  const [isWelding, setIsWelding] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastResult, setLastResult] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  const gaugeSpeed = useRef(2);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<number | undefined>(undefined);

  // 게임 루프
  useEffect(() => {
    const gameLoop = () => {
      setGaugePosition((prev) => {
        let newPos = prev + gaugeDirection * gaugeSpeed.current;

        // 바운스
        if (newPos >= 100) {
          newPos = 100;
          setGaugeDirection(-1);
        } else if (newPos <= 0) {
          newPos = 0;
          setGaugeDirection(1);
        }

        return newPos;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gaugeDirection]);

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

  // 시간 종료 체크
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleGameEnd();
    }
  }, [timeRemaining]);

  // 스파크 효과
  const createSparks = useCallback((x: number, y: number, count: number) => {
    const newSparks = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 50,
      y: y + (Math.random() - 0.5) * 50,
    }));
    setSparks((prev) => [...prev, ...newSparks]);

    // 스파크 제거
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.find((ns) => ns.id === s.id)));
    }, 500);
  }, []);

  // 용접 시도
  const handleWeld = useCallback(() => {
    if (isWelding) return;

    setIsWelding(true);
    setAttempts((prev) => prev + 1);

    const perfectStart = (targetZone.start + targetZone.end) / 2 - 5;
    const perfectEnd = (targetZone.start + targetZone.end) / 2 + 5;

    let result: 'perfect' | 'good' | 'miss';
    let points = 0;

    if (gaugePosition >= perfectStart && gaugePosition <= perfectEnd) {
      // Perfect!
      result = 'perfect';
      points = 15;
      increaseCombo();
      createSparks(50, 50, 20);
      showToast({
        title: 'PERFECT! ⚡',
        toastType: 'success',
        autoClose: 1000,
      });
    } else if (gaugePosition >= targetZone.start && gaugePosition <= targetZone.end) {
      // Good
      result = 'good';
      points = 10;
      increaseCombo();
      createSparks(50, 50, 10);
    } else {
      // Miss
      result = 'miss';
      points = 0;
      resetCombo();
    }

    setLastResult(result);
    addScore(points);

    // 타겟 존 이동 (난이도 증가)
    if (attempts > 0 && attempts % 3 === 0) {
      gaugeSpeed.current = Math.min(5, gaugeSpeed.current + 0.3);
      const zoneSize = Math.max(10, 20 - Math.floor(attempts / 3) * 2);
      const zoneStart = Math.random() * (100 - zoneSize);
      setTargetZone({ start: zoneStart, end: zoneStart + zoneSize });
    }

    setTimeout(() => {
      setIsWelding(false);
      setLastResult(null);
    }, 300);
  }, [gaugePosition, targetZone, isWelding, attempts, addScore, increaseCombo, resetCombo, createSparks, showToast]);

  // 키보드 입력
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleWeld();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleWeld]);

  // 게임 종료
  const handleGameEnd = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    endGame();
    onComplete();
  };

  const handleCancel = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onCancel();
  };

  // 게이지 색상
  const getGaugeColor = () => {
    if (gaugePosition >= targetZone.start && gaugePosition <= targetZone.end) {
      const perfectStart = (targetZone.start + targetZone.end) / 2 - 5;
      const perfectEnd = (targetZone.start + targetZone.end) / 2 + 5;
      if (gaugePosition >= perfectStart && gaugePosition <= perfectEnd) {
        return 'bg-yellow-400';
      }
      return 'bg-green-400';
    }
    return 'bg-blue-400';
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Zap className="w-8 h-8 text-yellow-400" />
          <div>
            <h2 className="text-xl font-bold text-white">용접 타이밍</h2>
            <p className="text-sm text-gray-400">정확한 타이밍에 클릭하세요!</p>
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
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">{score}</span>
            <span className="text-gray-400">/ {maxScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            <span className="text-white">콤보: </span>
            <span className="text-orange-400 font-bold">{combo}x</span>
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
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* 용접 시각화 */}
        <div className="relative w-64 h-64 mb-8">
          {/* 철판 */}
          <div className="absolute inset-0 bg-gray-700 rounded-lg border-4 border-gray-600">
            {/* 용접선 */}
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-500 transform -translate-y-1/2">
              {/* 용접 진행 */}
              <div
                className="absolute top-0 left-0 h-full bg-orange-500 transition-all"
                style={{ width: `${(score / maxScore) * 100}%` }}
              />
            </div>

            {/* 용접 토치 */}
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-75 ${
                isWelding ? 'scale-110' : ''
              }`}
              style={{ left: `${4 + (score / maxScore) * 88}%` }}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <Zap className={`w-6 h-6 ${isWelding ? 'text-yellow-400' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>

          {/* 스파크 효과 */}
          {sparks.map((spark) => (
            <div
              key={spark.id}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${spark.x}%`,
                top: `${spark.y}%`,
              }}
            />
          ))}

          {/* 결과 표시 */}
          {lastResult && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-4xl font-bold animate-bounce ${
                  lastResult === 'perfect'
                    ? 'text-yellow-400'
                    : lastResult === 'good'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {lastResult === 'perfect' ? 'PERFECT!' : lastResult === 'good' ? 'GOOD!' : 'MISS!'}
              </span>
            </div>
          )}
        </div>

        {/* 타이밍 게이지 */}
        <div className="w-full max-w-md">
          <div className="relative h-12 bg-gray-700 rounded-full overflow-hidden">
            {/* 타겟 존 */}
            <div
              className="absolute top-0 h-full bg-green-600/30"
              style={{
                left: `${targetZone.start}%`,
                width: `${targetZone.end - targetZone.start}%`,
              }}
            />

            {/* 퍼펙트 존 */}
            <div
              className="absolute top-0 h-full bg-yellow-400/40"
              style={{
                left: `${(targetZone.start + targetZone.end) / 2 - 5}%`,
                width: '10%',
              }}
            />

            {/* 게이지 인디케이터 */}
            <div
              className={`absolute top-0 w-2 h-full ${getGaugeColor()} transition-colors`}
              style={{ left: `${gaugePosition}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0</span>
            <span className="text-green-400">타겟</span>
            <span>100</span>
          </div>
        </div>

        {/* 클릭 버튼 */}
        <button
          onClick={handleWeld}
          disabled={isWelding}
          className={`mt-8 px-12 py-4 text-xl font-bold rounded-xl transition-all ${
            isWelding
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 hover:scale-105 active:scale-95'
          }`}
        >
          ⚡ 용접! (SPACE)
        </button>

        <p className="mt-4 text-gray-500 text-sm">
          스페이스바 또는 버튼을 눌러 용접하세요
        </p>
      </div>
    </div>
  );
}
