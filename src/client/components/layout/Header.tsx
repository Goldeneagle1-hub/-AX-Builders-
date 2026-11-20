import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Info, RefreshCw, Type, FileEdit, BarChart3, Clock, Scale } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { DolhareubangLogo } from './DolhareubangLogo';

export const Header: React.FC = () => {
  const location = useLocation();
  const { resetAll, largeFont, toggleLargeFont, savedComplaints, citedOrdinanceIds } = useCopilot();
  const [appMode, setAppMode] = useState<'demo' | 'live' | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.mode === 'live' || json?.data?.mode === 'demo') {
          setAppMode(json.data.mode);
        }
      })
      .catch(() => {
        // Keep null if unreachable
      });
  }, []);

  const userSavedCount = savedComplaints.filter((c) => c.source === 'user').length;

  const navItems = [
    { to: '/', label: '새 민원 작성', icon: FileEdit, badge: null },
    { to: '/stats', label: '동네별 민원 통계', icon: BarChart3, badge: `${savedComplaints.length}건` },
    { to: '/history', label: '민원 이력', icon: Clock, badge: userSavedCount > 0 ? `${userSavedCount}건` : null },
    { to: '/ordinances', label: '조례·법령 검색', icon: Scale, badge: citedOrdinanceIds.length > 0 ? `인용 ${citedOrdinanceIds.length}` : null },
  ];

  return (
    <header className="no-print bg-[#FFFDF9]/90 backdrop-blur-md shadow-[0_4px_20px_-8px_rgba(46,42,38,0.12)] sticky top-0 z-20">
      {/* Row 1: Brand Logo & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-3 group">
          <DolhareubangLogo size={40} className="shrink-0 transition-transform group-hover:scale-105" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-extrabold text-[#2E2A26] tracking-tight leading-none">
                제주민원메이트
              </h1>
              <span className="hidden sm:inline text-[11px] font-mono-num text-[#786D5F] bg-[#F3EDE0] px-2 py-0.5 rounded-full border border-[#E6DEC8]">
                Jeju Minwon Mate
              </span>
            </div>
            <p className="text-[11px] text-[#786D5F] mt-0.5">
              소상공인·도민 생활·영업 피해 AI 민원 포털
            </p>
          </div>
        </NavLink>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <button
            type="button"
            onClick={toggleLargeFont}
            aria-pressed={largeFont}
            className={`min-h-[36px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
              largeFont
                ? 'bg-[#E86F1A] border-[#E86F1A] text-white'
                : 'bg-[#FFFDF9] border-[#E6DEC8] text-[#5C5348] hover:bg-[#F3EDE0]'
            }`}
            title="어르신 및 소상공인용 큰 글씨 모드 전환"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{largeFont ? '큰 글씨 켜짐' : '큰 글씨'}</span>
          </button>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#F3EDE0] border border-[#E6DEC8] text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                appMode === 'live'
                  ? 'bg-emerald-600'
                  : appMode === 'demo'
                  ? 'bg-[#E86F1A]'
                  : 'bg-slate-400'
              }`}
            ></span>
            <span className="text-[#2E2A26] font-medium text-[11px]">
              {appMode === 'live'
                ? '실연동 모드'
                : appMode === 'demo'
                ? '시연 모드'
                : '연결 확인중'}
            </span>
          </div>

          {location.pathname === '/' && (
            <button
              onClick={() => {
                if (window.confirm('작성 중인 모든 입력값을 초기화하시겠습니까?')) {
                  resetAll();
                }
              }}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-xs text-[#5C5348] hover:text-[#2E2A26] hover:bg-[#F3EDE0] rounded-lg transition-colors cursor-pointer"
              title="새로 작성하기"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Desktop Full-Width Portal Navigation Strip (SEMAS Style) */}
      <nav
        className="hidden lg:block bg-gradient-to-r from-[#2E2A26] via-[#3A342E] to-[#2E2A26] text-white border-t border-b border-[#1F1C18]"
        aria-label="상단 포털 메뉴"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-5 py-3 text-sm font-semibold flex items-center space-x-2 border-b-3 transition-all ${
                      isActive
                        ? 'border-[#E86F1A] bg-white/10 text-white'
                        : 'border-transparent text-[#E6DEC8] hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#F59E0B]" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E86F1A] text-white font-mono-num">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="text-[11px] text-[#D5CCB6]">
            공식 접수 대행 아님 · 작성 보조 전용 포털
          </div>
        </div>
      </nav>

      {/* Row 3: Memory Notice Banner */}
      <div className="bg-[#FDF4E7] border-b border-[#E6DEC8] px-4 py-1 text-center text-[11px] text-[#8C430E] flex items-center justify-center space-x-1.5">
        <Info className="w-3.5 h-3.5 text-[#E86F1A] shrink-0" />
        <span>
          임시 미디어(녹음·사진) 및 정밀 GPS는 메모리에만 임시 보관되며 새로고침 시 초기화됩니다. 최종본은 [이력에 저장]을 눌러 보관하세요.
        </span>
      </div>
    </header>
  );
};
