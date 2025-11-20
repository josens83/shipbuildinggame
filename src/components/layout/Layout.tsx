import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import EventNotification from '../common/EventNotification';
import ToastContainer from '../common/Toast';
import ConfirmDialog, { useDialog } from '../common/ConfirmDialog';
import Tutorial from '../tutorial/Tutorial';
import GameOver from '../GameOver';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import {
  Anchor,
  LayoutDashboard,
  Briefcase,
  DollarSign,
  Factory,
  FlaskConical,
  Globe,
  Award,
  BarChart3,
  Clock,
  Play,
  Pause,
  FastForward,
  Save,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { format } from 'date-fns';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const {
    companyName,
    currentDate,
    gameSpeed,
    financials,
    reputation,
    activeEvent,
    advanceTime,
    setGameSpeed,
    saveGame,
    closeEvent,
    handleEventChoice,
    startTutorial,
  } = useGameStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Dialog hook
  const { success: successDialog, alert: alertDialog } = useDialog();

  const navItems = [
    { path: '/', label: '대시보드', icon: LayoutDashboard },
    { path: '/sales', label: '영업', icon: Briefcase },
    { path: '/finance', label: '재무', icon: DollarSign },
    { path: '/production', label: '생산', icon: Factory },
    { path: '/research', label: '연구개발', icon: FlaskConical },
    { path: '/market', label: '시장분석', icon: Globe },
    { path: '/achievements', label: '업적', icon: Award },
    { path: '/statistics', label: '통계', icon: BarChart3 },
    { path: '/settings', label: '설정', icon: Settings },
  ];

  // 자동 시간 진행
  useEffect(() => {
    if (gameSpeed === 1) return; // 일시정지 상태

    const interval = gameSpeed === 2 ? 2000 : 1000; // 2x: 2초마다, 3x: 1초마다
    const timer = setInterval(() => {
      advanceTime(1); // 1일 진행
    }, interval);

    return () => clearInterval(timer);
  }, [gameSpeed, advanceTime]);

  const handleTimeAdvance = () => {
    advanceTime(1); // 수동으로 1일 진행
  };

  const toggleGameSpeed = () => {
    // 1 -> 2 -> 3 -> 1 순환
    const nextSpeed = gameSpeed === 3 ? 1 : ((gameSpeed + 1) as 1 | 2 | 3);
    setGameSpeed(nextSpeed);
  };

  const handleSave = async () => {
    const success = saveGame();
    if (success) {
      await successDialog('저장 완료', '게임이 저장되었습니다!');
    } else {
      await alertDialog('저장 실패', '저장에 실패했습니다.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000); // 백만 단위
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* 사이드바 */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* 로고 */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Anchor className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="font-bold text-white">{companyName}</h1>
              <p className="text-xs text-gray-400">Shipyard Tycoon</p>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 하단 정보 */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <div className="text-xs text-gray-400">
            <div className="flex justify-between mb-1">
              <span>평판</span>
              <span className="text-white">{reputation}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${reputation}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-gray-400">
            <div className="flex justify-between">
              <span>현금</span>
              <span className="text-green-400 font-semibold">
                {formatCurrency(financials.cash)}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 날짜 및 시간 제어 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">
                  {format(currentDate, 'yyyy년 MM월 dd일')}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTimeAdvance}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-xs text-white"
                  title="수동으로 1일 진행"
                >
                  +1일
                </button>

                <button
                  onClick={toggleGameSpeed}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title={`속도: ${gameSpeed}x (클릭하여 변경)`}
                >
                  {gameSpeed === 1 ? (
                    <Pause className="w-4 h-4 text-gray-400" />
                  ) : gameSpeed === 2 ? (
                    <Play className="w-4 h-4 text-green-400" />
                  ) : (
                    <FastForward className="w-4 h-4 text-blue-400" />
                  )}
                </button>

                <span className="text-sm text-gray-400">
                  {gameSpeed === 1 ? '일시정지' : `${gameSpeed}x 속도`}
                </span>
              </div>
            </div>

            {/* 빠른 정보 */}
            <div className="flex items-center space-x-6 text-sm">
              <button
                onClick={startTutorial}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
                title="도움말"
              >
                <HelpCircle className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-semibold">도움말</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition-colors"
                title="게임 저장"
              >
                <Save className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-semibold">저장</span>
              </button>

              <div>
                <span className="text-gray-400">순이익: </span>
                <span
                  className={`font-semibold ${
                    financials.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatCurrency(financials.netIncome)}
                </span>
              </div>

              <div>
                <span className="text-gray-400">부채비율: </span>
                <span className="font-semibold text-white">
                  {financials.debtToEquityRatio.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* 이벤트 알림 */}
      {activeEvent && (
        <EventNotification
          event={activeEvent}
          onClose={closeEvent}
          onChoice={handleEventChoice}
        />
      )}

      {/* 튜토리얼 */}
      <Tutorial />

      {/* 게임 종료 */}
      <GameOver />

      {/* 토스트 알림 */}
      <ToastContainer />

      {/* 확인 다이얼로그 */}
      <ConfirmDialog />
    </div>
  );
}
