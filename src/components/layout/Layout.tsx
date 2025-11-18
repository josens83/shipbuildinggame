import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import {
  Anchor,
  LayoutDashboard,
  Briefcase,
  DollarSign,
  Factory,
  Clock,
  Play,
  Pause,
  FastForward,
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
    advanceTime,
  } = useGameStore();

  const navItems = [
    { path: '/', label: '대시보드', icon: LayoutDashboard },
    { path: '/sales', label: '영업', icon: Briefcase },
    { path: '/finance', label: '재무', icon: DollarSign },
    { path: '/production', label: '생산', icon: Factory },
  ];

  const handleTimeAdvance = () => {
    advanceTime(1); // 1일 진행
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
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="1일 진행"
                >
                  {gameSpeed === 1 ? (
                    <Play className="w-4 h-4 text-white" />
                  ) : gameSpeed === 2 ? (
                    <FastForward className="w-4 h-4 text-white" />
                  ) : (
                    <Pause className="w-4 h-4 text-white" />
                  )}
                </button>

                <span className="text-sm text-gray-400">속도: {gameSpeed}x</span>
              </div>
            </div>

            {/* 빠른 정보 */}
            <div className="flex items-center space-x-6 text-sm">
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
    </div>
  );
}
