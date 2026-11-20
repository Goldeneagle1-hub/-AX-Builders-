import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CopilotProvider } from './context/CopilotContext';
import { Header } from './components/layout/Header';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { HomePortalPage } from './pages/HomePortalPage';
import { CopilotPage } from './pages/CopilotPage';
import { StatsPage } from './pages/StatsPage';
import { HistoryPage } from './pages/HistoryPage';
import { OrdinancesPage } from './pages/OrdinancesPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CopilotProvider>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
          {/* Top Portal Header + Desktop Full-Width Nav Bar */}
          <Header />

          {/* Main Full-Width Portal Workspace */}
          <main className="flex-1 p-3 sm:p-5 lg:p-6 pb-20 lg:pb-4 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<HomePortalPage />} />
              <Route path="/write" element={<CopilotPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/ordinances" element={<OrdinancesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Subtle Small Footer Notice */}
          <footer className="no-print pb-16 lg:pb-3 pt-1 px-4 text-center text-[11px] text-slate-500">
            공식 접수 대행 아님 · 작성 보조 전용 포털 | 임시 미디어(녹음·사진) 및 정밀 GPS는 메모리에만 보관되며 새로고침 시 초기화됩니다.
          </footer>

          {/* Mobile Fixed Safe Area 4-Tab Bar */}
          <MobileTabBar />
        </div>
      </CopilotProvider>
    </BrowserRouter>
  );
};
