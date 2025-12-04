// 블록 조립 퍼즐 게임 (2048 스타일)

import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Timer, Star, X } from 'lucide-react';
import { useMiniGameStore } from '../../store/miniGameStore';

interface AssemblyGameProps {
  onComplete: () => void;
  onCancel: () => void;
}

type Cell = number | null;
type Grid = Cell[][];

export default function AssemblyGame({ onComplete, onCancel }: AssemblyGameProps) {
  const {
    score,
    timeRemaining,
    combo,
    addScore,
    increaseCombo,
    resetCombo,
    tick,
    endGame,
    setGameData,
  } = useMiniGameStore();

  // 4x4 그리드
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());
  const [mergedCells, setMergedCells] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [highestBlock, setHighestBlock] = useState(2);

  const timerRef = useRef<number | undefined>(undefined);

  // 빈 그리드 생성
  function createEmptyGrid(): Grid {
    return Array(4).fill(null).map(() => Array(4).fill(null));
  }

  // 랜덤 위치에 블록 추가
  const addRandomBlock = useCallback((currentGrid: Grid): Grid => {
    const emptyCells: [number, number][] = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === null) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) return currentGrid;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map((r) => [...r]);
    newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;

    return newGrid;
  }, []);

  // 초기화
  useEffect(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomBlock(newGrid);
    newGrid = addRandomBlock(newGrid);
    setGrid(newGrid);
  }, [addRandomBlock]);

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
    if (timeRemaining <= 0 || gameOver) {
      handleGameEnd();
    }
  }, [timeRemaining, gameOver]);

  // 이동 가능 여부 체크
  const canMove = useCallback((currentGrid: Grid): boolean => {
    // 빈 셀이 있으면 이동 가능
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === null) return true;
      }
    }

    // 인접한 같은 값이 있으면 이동 가능
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const val = currentGrid[i][j];
        if (
          (i < 3 && currentGrid[i + 1][j] === val) ||
          (j < 3 && currentGrid[i][j + 1] === val)
        ) {
          return true;
        }
      }
    }

    return false;
  }, []);

  // 한 줄 이동 및 병합
  const moveLine = (line: Cell[]): { newLine: Cell[]; score: number; merged: number[] } => {
    // null 제거
    const filtered = line.filter((x) => x !== null) as number[];
    const newLine: Cell[] = [];
    const merged: number[] = [];
    let lineScore = 0;
    let i = 0;

    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        // 병합
        const mergedValue = filtered[i] * 2;
        newLine.push(mergedValue);
        merged.push(newLine.length - 1);
        lineScore += mergedValue;
        i += 2;
      } else {
        newLine.push(filtered[i]);
        i++;
      }
    }

    // 나머지를 null로 채우기
    while (newLine.length < 4) {
      newLine.push(null);
    }

    return { newLine, score: lineScore, merged };
  };

  // 그리드 이동
  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    let newGrid = grid.map((r) => [...r]);
    let totalScore = 0;
    const allMerged: string[] = [];
    let moved = false;

    const processLine = (line: Cell[], rowOrCol: number, isRow: boolean) => {
      const { newLine, score, merged } = moveLine(line);
      totalScore += score;

      merged.forEach((idx) => {
        const key = isRow
          ? `${rowOrCol}-${direction === 'left' ? idx : 3 - idx}`
          : `${direction === 'up' ? idx : 3 - idx}-${rowOrCol}`;
        allMerged.push(key);
      });

      // 이동 여부 체크
      for (let i = 0; i < 4; i++) {
        if (line[i] !== newLine[i]) moved = true;
      }

      return newLine;
    };

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        newGrid[i] = processLine(newGrid[i], i, true);
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const reversed = [...newGrid[i]].reverse();
        const processed = processLine(reversed, i, true);
        newGrid[i] = processed.reverse();
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const col = newGrid.map((row) => row[j]);
        const processed = processLine(col, j, false);
        for (let i = 0; i < 4; i++) {
          newGrid[i][j] = processed[i];
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const col = newGrid.map((row) => row[j]).reverse();
        const processed = processLine(col, j, false);
        for (let i = 0; i < 4; i++) {
          newGrid[i][j] = processed[3 - i];
        }
      }
    }

    if (moved) {
      newGrid = addRandomBlock(newGrid);
      setGrid(newGrid);
      setMergedCells(new Set(allMerged));

      if (totalScore > 0) {
        addScore(Math.floor(totalScore / 10));
        increaseCombo();

        // 최고 블록 업데이트
        const max = Math.max(...newGrid.flat().filter((x) => x !== null) as number[]);
        if (max > highestBlock) {
          setHighestBlock(max);
        }
      } else {
        resetCombo();
      }

      // 병합 애니메이션 후 초기화
      setTimeout(() => setMergedCells(new Set()), 150);

      // 게임 오버 체크
      if (!canMove(newGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, addRandomBlock, addScore, increaseCombo, resetCombo, canMove, highestBlock]);

  // 키보드 입력
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, gameOver]);

  // 게임 종료
  const handleGameEnd = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameData('highestBlock', highestBlock);
    endGame();
    onComplete();
  };

  const handleCancel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onCancel();
  };

  // 블록 색상
  const getBlockColor = (value: number | null): string => {
    if (value === null) return 'bg-gray-700';

    const colors: Record<number, string> = {
      2: 'bg-blue-500',
      4: 'bg-blue-600',
      8: 'bg-green-500',
      16: 'bg-green-600',
      32: 'bg-yellow-500',
      64: 'bg-yellow-600',
      128: 'bg-orange-500',
      256: 'bg-orange-600',
      512: 'bg-red-500',
      1024: 'bg-red-600',
      2048: 'bg-purple-500',
    };

    return colors[value] || 'bg-purple-600';
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Gamepad2 className="w-8 h-8 text-green-400" />
          <div>
            <h2 className="text-xl font-bold text-white">블록 조립</h2>
            <p className="text-sm text-gray-400">같은 블록을 합쳐 높은 점수를 만드세요!</p>
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
            <span className="text-gray-400">최고 블록:</span>
            <span className={`font-bold ${getBlockColor(highestBlock).replace('bg-', 'text-')}`}>
              {highestBlock}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">콤보:</span>
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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          {/* 그리드 */}
          <div className="grid grid-cols-4 gap-2 p-4 bg-gray-800 rounded-xl">
            {grid.map((row, i) =>
              row.map((cell, j) => {
                const key = `${i}-${j}`;
                const isMerged = mergedCells.has(key);

                return (
                  <div
                    key={key}
                    className={`w-20 h-20 rounded-lg flex items-center justify-center transition-all duration-150 ${getBlockColor(
                      cell
                    )} ${isMerged ? 'scale-110' : ''}`}
                  >
                    {cell !== null && (
                      <span
                        className={`font-bold ${
                          cell >= 100 ? 'text-2xl' : 'text-3xl'
                        } text-white`}
                      >
                        {cell}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 게임 오버 오버레이 */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-4">게임 오버!</p>
                <p className="text-gray-400">더 이상 이동할 수 없습니다</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 조작 안내 */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center gap-4">
          <div className="grid grid-cols-3 gap-1 text-center">
            <div />
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-white text-sm">
              ↑
            </div>
            <div />
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-white text-sm">
              ←
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-white text-sm">
              ↓
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-white text-sm">
              →
            </div>
          </div>
          <p className="text-gray-400 text-sm">화살표 키 또는 WASD로 이동</p>
        </div>
      </div>
    </div>
  );
}
