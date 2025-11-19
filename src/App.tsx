import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import Sales from './components/sales/Sales';
import Finance from './components/finance/Finance';
import Production from './components/production/Production';
import Research from './components/research/Research';
import Market from './components/market/Market';
import Achievements from './components/achievements/Achievements';
import Statistics from './components/statistics/Statistics';
import Settings from './components/settings/Settings';
import StartScreen from './components/StartScreen';

function App() {
  const companyName = useGameStore((state) => state.companyName);

  // 게임이 시작되지 않았으면 시작 화면 표시
  if (!companyName) {
    return <StartScreen />;
  }

  return (
    <Router>
      <Layout>
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
      </Layout>
    </Router>
  );
}

export default App;
