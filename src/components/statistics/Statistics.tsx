import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Ship,
  Users,
  FlaskConical,
  BarChart3,
} from 'lucide-react';

export default function Statistics() {
  const { getStatisticsByPeriod } = useGameStore();
  const [period, setPeriod] = useState(12); // 기본 12개월

  const statistics = getStatisticsByPeriod(period);

  // 데이터가 충분하지 않으면 안내 메시지
  if (statistics.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">통계 데이터 없음</h2>
          <p className="text-gray-400">게임을 진행하면 월별 통계가 기록됩니다.</p>
        </div>
      </div>
    );
  }

  // 차트 데이터 포맷
  const chartData = statistics.map(stat => ({
    name: `${stat.year}-${String(stat.month).padStart(2, '0')}`,
    현금: Math.round(stat.cash / 1_000_000),
    매출: Math.round(stat.revenue / 1_000_000),
    순이익: Math.round(stat.netIncome / 1_000_000),
    자산: Math.round(stat.totalAssets / 1_000_000),
    부채: Math.round(stat.totalLiabilities / 1_000_000),
    자본: Math.round(stat.equity / 1_000_000),
    평판: stat.reputation,
    시장점유율: stat.marketShare.toFixed(1),
    완성선박: stat.shipsCompleted,
    생산중: stat.shipsInProduction,
    도크수: stat.dockCount,
    인력: stat.totalWorkers,
    사기: stat.averageMorale,
    연구완료: stat.researchCompleted,
  }));

  const formatCurrency = (value: number) => `$${value}M`;
  const formatPercent = (value: number) => `${value}%`;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <span>통계 및 분석</span>
          </h1>
          <p className="text-gray-400 mt-1">회사 성과를 시간별로 확인하세요</p>
        </div>

        {/* 기간 선택 */}
        <div className="flex space-x-2">
          {[6, 12, 24, 0].map(months => (
            <button
              key={months}
              onClick={() => setPeriod(months)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === months
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {months === 0 ? '전체' : `${months}개월`}
            </button>
          ))}
        </div>
      </div>

      {/* 재무 차트 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          <span>재무 현황</span>
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
              formatter={formatCurrency}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="현금"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="매출"
              stackId="2"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="순이익"
              stackId="3"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 자산 & 부채 차트 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <span>자산 & 부채</span>
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
              formatter={formatCurrency}
            />
            <Legend />
            <Line type="monotone" dataKey="자산" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="부채" stroke="#EF4444" strokeWidth={2} />
            <Line type="monotone" dataKey="자본" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 생산 차트 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Ship className="w-5 h-5 text-purple-400" />
          <span>생산 현황</span>
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="완성선박" fill="#10B981" />
            <Bar dataKey="생산중" fill="#F59E0B" />
            <Bar dataKey="도크수" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 평판 & 시장 점유율 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <span>평판 추이</span>
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="평판" stroke="#F59E0B" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>시장 점유율</span>
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={formatPercent} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => `${value}%`}
              />
              <Area
                type="monotone"
                dataKey="시장점유율"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 인력 & 연구 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>인력 & 사기</span>
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="인력" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="사기" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <span>연구 개발</span>
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="연구완료" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 요약 통계 */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
        <h2 className="text-lg font-semibold text-white mb-4">기간 요약</h2>
        {statistics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">평균 매출</p>
              <p className="text-xl font-bold text-white">
                $
                {(
                  statistics.reduce((sum, s) => sum + s.revenue, 0) /
                  statistics.length /
                  1_000_000
                ).toFixed(1)}
                M
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">총 완성 선박</p>
              <p className="text-xl font-bold text-white">
                {statistics[statistics.length - 1].shipsCompleted}척
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">최고 평판</p>
              <p className="text-xl font-bold text-white">
                {Math.max(...statistics.map(s => s.reputation))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">현재 시장 점유율</p>
              <p className="text-xl font-bold text-white">
                {statistics[statistics.length - 1].marketShare.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
