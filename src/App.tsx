import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import Layout from './components/layout/Layout';
import { PageSkeleton } from './components/common/LoadingSpinner';
import StartScreen from './components/StartScreen';

// Lazy load page components for code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const Sales = lazy(() => import('./components/sales/Sales'));
const Finance = lazy(() => import('./components/finance/Finance'));
const Production = lazy(() => import('./components/production/Production'));
const Research = lazy(() => import('./components/research/Research'));
const Market = lazy(() => import('./components/market/Market'));
const Achievements = lazy(() => import('./components/achievements/Achievements'));
const Statistics = lazy(() => import('./components/statistics/Statistics'));
const Settings = lazy(() => import('./components/settings/Settings'));

function App() {
  const companyName = useGameStore((state) => state.companyName);

  // 게임이 시작되지 않았으면 시작 화면 표시
  if (!companyName) {
    return <StartScreen />;
  }

  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/production" element={<Production />} />
            <Route path="/research" element={<Research />} />
            <Route path="/market" element={<Market />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
