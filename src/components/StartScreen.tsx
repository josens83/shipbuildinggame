import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Anchor, Save } from 'lucide-react';
import { SaveManager } from '../utils/saveManager';

export default function StartScreen() {
  const [companyName, setCompanyName] = useState('');
  const [hasSave, setHasSave] = useState(false);
  const [saveInfo, setSaveInfo] = useState<{ companyName: string; savedAt: string } | null>(null);

  const startGame = useGameStore((state) => state.startGame);
  const loadGame = useGameStore((state) => state.loadGame);

  useEffect(() => {
    const savedGame = SaveManager.hasSavedGame();
    setHasSave(savedGame);
    if (savedGame) {
      setSaveInfo(SaveManager.getSaveInfo());
    }
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      startGame(companyName.trim());
    }
  };

  const handleLoad = () => {
    const success = loadGame();
    if (!success) {
      alert('저장된 게임을 불러오는데 실패했습니다.');
    }
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

        {/* 저장된 게임 불러오기 */}
        {hasSave && saveInfo && (
          <div className="card mb-4 bg-green-900/20 border-2 border-green-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Save className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">저장된 게임 발견</h3>
                </div>
                <p className="text-sm text-gray-300">
                  회사: <span className="font-semibold text-white">{saveInfo.companyName}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  저장 시간: {new Date(saveInfo.savedAt).toLocaleString('ko-KR')}
                </p>
              </div>
              <button
                onClick={handleLoad}
                className="btn-primary ml-4"
                type="button"
              >
                불러오기
              </button>
            </div>
          </div>
        )}

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

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">게임 정보</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 초기 자금: $50,000,000</li>
                <li>• 시작 도크: 2개 (중형 1개, 소형 1개)</li>
                <li>• 초기 인력: 330명</li>
                <li>• 목표: 세계 최고의 조선소 건설</li>
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

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Inspired by Football Manager</p>
          <p className="mt-1">© 2025 Shipyard Tycoon</p>
        </div>
      </div>
    </div>
  );
}
