import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Difficulty } from '../types';
import { Anchor, Save, Trash2, Play, Plus, FolderOpen } from 'lucide-react';
import { SaveManager } from '../utils/saveManager';
import type { SaveSlotInfo } from '../utils/saveManager';
import {
  DIFFICULTY_NAMES,
  DIFFICULTY_DESCRIPTIONS,
  DIFFICULTY_COLORS,
  getDifficultySettings,
} from '../utils/difficultySettings';
import { format } from 'date-fns';
import { useDialog } from './common/ConfirmDialog';

export default function StartScreen() {
  const [companyName, setCompanyName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');
  const [activeTab, setActiveTab] = useState<'load' | 'new'>('new');
  const [slots, setSlots] = useState<SaveSlotInfo[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const startGame = useGameStore((state) => state.startGame);
  const loadFromSlot = useGameStore((state) => state.loadFromSlot);
  const { alert: alertDialog, confirm } = useDialog();

  useEffect(() => {
    refreshSlots();
  }, []);

  const refreshSlots = () => {
    const savedSlots = SaveManager.getAllSlots();
    setSlots(savedSlots.sort((a, b) => b.slotId - a.slotId));
    if (savedSlots.length > 0) {
      setActiveTab('load');
    }
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      startGame(companyName.trim(), difficulty);
    }
  };

  const handleLoadSlot = async (slotId: number) => {
    const success = loadFromSlot(slotId);
    if (!success) {
      await alertDialog('불러오기 실패', '저장된 게임을 불러오는데 실패했습니다.');
    }
  };

  const handleDeleteSlot = async (slotId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await confirm('저장 데이터 삭제', '이 저장 데이터를 삭제하시겠습니까?');
    if (confirmed) {
      SaveManager.deleteSlot(slotId);
      refreshSlots();
      setSelectedSlot(null);
    }
  };

  const settings = getDifficultySettings(difficulty);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000);
  };

  const getDifficultyLabel = (diff: string): string => {
    const labels: Record<string, string> = {
      EASY: '쉬움',
      NORMAL: '보통',
      HARD: '어려움',
      EXPERT: '전문가',
    };
    return labels[diff] || diff;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Anchor className="w-20 h-20 text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Shipyard Tycoon</h1>
          <p className="text-xl text-gray-300">조선소 경영 시뮬레이션</p>
        </div>

        {/* 탭 선택 */}
        <div className="flex mb-4 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('load')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'load'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            저장된 게임 ({slots.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'new'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            새 게임
          </button>
        </div>

        {/* 저장된 게임 목록 */}
        {activeTab === 'load' && (
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">저장된 게임</h2>

            {slots.length === 0 ? (
              <div className="text-center py-8">
                <Save className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">저장된 게임이 없습니다</p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 btn-primary"
                >
                  새 게임 시작
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {slots.map((slot) => (
                  <div
                    key={slot.slotId}
                    onClick={() => setSelectedSlot(slot.slotId === selectedSlot ? null : slot.slotId)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSlot === slot.slotId
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                            슬롯 {slot.slotId + 1}
                          </span>
                          <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                            {getDifficultyLabel(slot.difficulty)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white text-lg">{slot.companyName}</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                          <p className="text-gray-400">
                            게임 날짜: <span className="text-gray-300">{format(new Date(slot.currentDate), 'yyyy.MM.dd')}</span>
                          </p>
                          <p className="text-gray-400">
                            건조 선박: <span className="text-gray-300">{slot.totalShipsBuilt}척</span>
                          </p>
                          <p className="text-gray-400">
                            현금: <span className="text-green-400">{formatCurrency(slot.cash)}</span>
                          </p>
                          <p className="text-gray-400">
                            평판: <span className="text-yellow-400">{slot.reputation}/100</span>
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          저장: {format(new Date(slot.savedAt), 'yyyy.MM.dd HH:mm')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSlot(slot.slotId, e)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {selectedSlot === slot.slotId && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <button
                          onClick={() => handleLoadSlot(slot.slotId)}
                          className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          이 게임 불러오기
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 새 게임 */}
        {activeTab === 'new' && (
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">새 게임 시작</h2>
            <form onSubmit={handleStart} className="space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                  회사 이름
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-field w-full text-lg"
                  placeholder="당신의 조선소 이름을 입력하세요"
                  maxLength={50}
                  required
                />
              </div>

              {/* 난이도 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">난이도 선택</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['EASY', 'NORMAL', 'HARD', 'EXPERT'] as Difficulty[]).map((diff) => {
                    const color = DIFFICULTY_COLORS[diff];
                    const isSelected = difficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? `border-${color}-500 bg-${color}-900/30`
                            : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                        }`}
                      >
                        <div className={`font-semibold ${isSelected ? `text-${color}-400` : 'text-white'}`}>
                          {DIFFICULTY_NAMES[diff]}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {DIFFICULTY_DESCRIPTIONS[diff]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">초기 조건 ({DIFFICULTY_NAMES[difficulty]})</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 초기 자금: ${(settings.initialCash / 1_000_000).toFixed(0)}M</li>
                  <li>• 초기 부채: ${(settings.initialDebt / 1_000_000).toFixed(0)}M</li>
                  <li>• 시작 도크: {settings.initialDocks}개</li>
                  <li>• 시작 평판: {settings.initialReputation}/100</li>
                  <li>• 대출 이자율: {(settings.loanInterestRate * 100).toFixed(1)}%</li>
                </ul>
              </div>

              <div className="bg-blue-900/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">게임 특징</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 실제 조선업 시뮬레이션</li>
                  <li>• 영업, 재무, 생산 통합 관리</li>
                  <li>• 다양한 선박 종류 (컨테이너선, LNG선 등)</li>
                  <li>• 실시간 재무제표 관리</li>
                </ul>
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-lg py-3"
                disabled={!companyName.trim()}
              >
                게임 시작
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Inspired by Football Manager</p>
          <p className="mt-1">© 2025 Shipyard Tycoon</p>
        </div>
      </div>
    </div>
  );
}
