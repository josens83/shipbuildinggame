// 위기 대응 게임 컴포넌트 (두더지 잡기 스타일)

import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, Timer, Star, X, Shield } from 'lucide-react';
import { useMiniGameStore } from '../../store/miniGameStore';

interface CrisisGameProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface Crisis {
  id: number;
  x: number;
  y: number;
  type: 'fire' | 'leak' | 'electrical' | 'structural';
  severity: 'low' | 'medium' | 'high';
  timeLeft: number;
  maxTime: number;
  active: boolean;
}

const CRISIS_TYPES = {
  fire: { icon: '🔥', name: '화재', color: 'bg-red-500' },
  leak: { icon: '💧', name: '누수', color: 'bg-blue-500' },
  electrical: { icon: '⚡', name: '전기', color: 'bg-yellow-500' },
  structural: { icon: '🔧', name: '구조', color: 'bg-orange-500' },
};

const SEVERITY_SCORES = {
  low: 5,
  medium: 10,
  high: 20,
};

const SEVERITY_TIME = {
  low: 3000,
  medium: 2000,
  high: 1500,
};

export default function CrisisGame({ onComplete, onCancel }: CrisisGameProps) {
  const {
    score,
    timeRemaining,
    combo,
    addScore,
    increaseCombo,
    resetCombo,
    tick,
    endGame,
  } = useMiniGameStore();

  const [crises, setCrises] = useState<Crisis[]>([]);
  const [damage, setDamage] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [, setMissed] = useState(0);
  const [nextCrisisId, setNextCrisisId] = useState(0);

  const timerRef = useRef<number | undefined>(undefined);
  const spawnRef = useRef<number | undefined>(undefined);
  const updateRef = useRef<number | undefined>(undefined);

  // 위기 생성
  const spawnCrisis = useCallback(() => {
    const types: Array<'fire' | 'leak' | 'electrical' | 'structural'> = ['fire', 'leak', 'electrical', 'structural'];

    // 난이도에 따른 가중치 적용
    const severityWeights = [0.5, 0.35, 0.15]; // low, medium, high
    const rand = Math.random();
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (rand > severityWeights[0] + severityWeights[1]) {
      severity = 'high';
    } else if (rand > severityWeights[0]) {
      severity = 'medium';
    }

    const newCrisis: Crisis = {
      id: nextCrisisId,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      type: types[Math.floor(Math.random() * types.length)],
      severity,
      timeLeft: SEVERITY_TIME[severity],
      maxTime: SEVERITY_TIME[severity],
      active: true,
    };

    setNextCrisisId((prev) => prev + 1);
    setCrises((prev) => [...prev, newCrisis]);
  }, [nextCrisisId]);

  // 게임 타이머
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

  // 위기 생성 타이머
  useEffect(() => {
    const baseInterval = 2000;
    const minInterval = 800;

    const scheduleNextCrisis = () => {
      // 시간이 지날수록 더 자주 생성
      const elapsed = 30 - timeRemaining;
      const interval = Math.max(minInterval, baseInterval - elapsed * 50);

      spawnRef.current = window.setTimeout(() => {
        if (timeRemaining > 0) {
          spawnCrisis();
          scheduleNextCrisis();
        }
      }, interval);
    };

    scheduleNextCrisis();

    return () => {
      if (spawnRef.current) {
        clearTimeout(spawnRef.current);
      }
    };
  }, [timeRemaining, spawnCrisis]);

  // 위기 업데이트 (시간 감소)
  useEffect(() => {
    updateRef.current = window.setInterval(() => {
      setCrises((prev) => {
        const updated = prev.map((crisis) => {
          if (!crisis.active) return crisis;

          const newTimeLeft = crisis.timeLeft - 100;

          if (newTimeLeft <= 0) {
            // 위기 놓침
            setDamage((d) => d + (crisis.severity === 'high' ? 15 : crisis.severity === 'medium' ? 10 : 5));
            setMissed((m) => m + 1);
            resetCombo();
            return { ...crisis, active: false };
          }

          return { ...crisis, timeLeft: newTimeLeft };
        });

        // 비활성 위기 정리
        return updated.filter((c) => c.active || Date.now() - (c.maxTime - c.timeLeft) < 500);
      });
    }, 100);

    return () => {
      if (updateRef.current) {
        clearInterval(updateRef.current);
      }
    };
  }, [resetCombo]);

  // 시간 종료 또는 피해 초과 체크
  useEffect(() => {
    if (timeRemaining <= 0 || damage >= 100) {
      handleGameEnd();
    }
  }, [timeRemaining, damage]);

  // 위기 클릭 처리
  const handleCrisisClick = useCallback((crisisId: number) => {
    setCrises((prev) => {
      const crisis = prev.find((c) => c.id === crisisId);
      if (!crisis || !crisis.active) return prev;

      // 점수 계산 (빠를수록 높은 점수)
      const timeBonus = crisis.timeLeft / crisis.maxTime;
      const baseScore = SEVERITY_SCORES[crisis.severity];
      const finalScore = Math.floor(baseScore * (0.5 + timeBonus * 0.5));

      addScore(finalScore);
      increaseCombo();
      setResolved((r) => r + 1);

      return prev.map((c) =>
        c.id === crisisId ? { ...c, active: false } : c
      );
    });
  }, [addScore, increaseCombo]);

  // 게임 종료
  const handleGameEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearTimeout(spawnRef.current);
    if (updateRef.current) clearInterval(updateRef.current);

    endGame();
    onComplete();
  };

  const handleCancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearTimeout(spawnRef.current);
    if (updateRef.current) clearInterval(updateRef.current);

    onCancel();
  };

  // 위기 아이콘 크기 (심각도에 따라)
  const getCrisisSize = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'w-16 h-16';
      case 'medium':
        return 'w-14 h-14';
      default:
        return 'w-12 h-12';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <div>
            <h2 className="text-xl font-bold text-white">위기 대응</h2>
            <p className="text-sm text-gray-400">발생하는 위기를 빠르게 해결하세요!</p>
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
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-white">해결:</span>
            <span className="text-green-400 font-bold">{resolved}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">콤보:</span>
            <span className="text-orange-400 font-bold">{combo}x</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 피해도 */}
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  damage >= 70 ? 'bg-red-500' : damage >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${damage}%` }}
              />
            </div>
            <span className="text-red-400 text-sm font-mono">{damage}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-400" />
            <span className={`font-mono font-bold ${timeRemaining <= 10 ? 'text-red-400' : 'text-white'}`}>
              {Math.ceil(timeRemaining)}s
            </span>
          </div>
        </div>
      </div>

      {/* 게임 영역 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-4xl aspect-[16/9] bg-gray-800 rounded-xl overflow-hidden border-4 border-gray-600"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 40px,
                rgba(75, 85, 99, 0.3) 40px,
                rgba(75, 85, 99, 0.3) 41px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                rgba(75, 85, 99, 0.3) 40px,
                rgba(75, 85, 99, 0.3) 41px
              )
            `,
          }}
        >
          {/* 배경 요소들 - 조선소 느낌 */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-gray-500"
                style={{
                  left: `${15 + i * 20}%`,
                  top: '10%',
                  width: '3px',
                  height: '80%',
                }}
              />
            ))}
          </div>

          {/* 위기들 */}
          {crises.map((crisis) => {
            if (!crisis.active) return null;

            const crisisType = CRISIS_TYPES[crisis.type];
            const timeRatio = crisis.timeLeft / crisis.maxTime;

            return (
              <button
                key={crisis.id}
                onClick={() => handleCrisisClick(crisis.id)}
                className={`absolute ${getCrisisSize(crisis.severity)} rounded-full flex items-center justify-center
                  transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110
                  active:scale-90 cursor-pointer animate-pulse ${crisisType.color}`}
                style={{
                  left: `${crisis.x}%`,
                  top: `${crisis.y}%`,
                  boxShadow: `0 0 ${crisis.severity === 'high' ? '20px' : '10px'} ${
                    crisis.severity === 'high' ? 'rgba(239, 68, 68, 0.8)' :
                    crisis.severity === 'medium' ? 'rgba(234, 179, 8, 0.6)' :
                    'rgba(34, 197, 94, 0.4)'
                  }`,
                }}
              >
                <span className="text-2xl">{crisisType.icon}</span>

                {/* 타이머 링 */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={timeRatio > 0.5 ? '#22c55e' : timeRatio > 0.25 ? '#eab308' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${timeRatio * 283} 283`}
                    className="transition-all duration-100"
                  />
                </svg>
              </button>
            );
          })}

          {/* 피해 오버레이 */}
          {damage > 50 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle, transparent 30%, rgba(239, 68, 68, ${(damage - 50) / 100}) 100%)`,
              }}
            />
          )}

          {/* 게임 오버 오버레이 */}
          {damage >= 100 && (
            <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-2">시설 손상!</p>
                <p className="text-gray-300">피해가 너무 커졌습니다</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 범례 */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center gap-8 text-sm">
          {Object.entries(CRISIS_TYPES).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xl">{value.icon}</span>
              <span className="text-gray-400">{value.name}</span>
            </div>
          ))}
          <div className="border-l border-gray-600 pl-4 flex items-center gap-4">
            <span className="text-gray-400">심각도:</span>
            <span className="text-green-400">낮음</span>
            <span className="text-yellow-400">중간</span>
            <span className="text-red-400">높음</span>
          </div>
        </div>
      </div>
    </div>
  );
}
