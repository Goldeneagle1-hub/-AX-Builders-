import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CopilotProvider } from './context/CopilotContext';
import { Header } from './components/layout/Header';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { CopilotPage } from './pages/CopilotPage';
import { StatsPage } from './pages/StatsPage';
import { HistoryPage } from './pages/HistoryPage';
import { OrdinancesPage } from './pages/OrdinancesPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CopilotProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF6EE]">
          {/* Top Portal Header + Desktop Full-Width Nav Bar */}
          <Header />

          {/* Main Full-Width Portal Workspace */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<CopilotPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/ordinances" element={<OrdinancesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Mobile Fixed Safe Area 4-Tab Bar */}
          <MobileTabBar />
        </div>
      </CopilotProvider>
    </BrowserRouter>
  );
};
