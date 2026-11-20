import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Type, FileEdit, BarChart3, Clock, Scale } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { DolhareubangLogo } from './DolhareubangLogo';

/**
 * 서브페이지(/write, /stats, /history, /ordinances)에서만 노출되는 경량 인라인 이동 헤더
 * 메인 화면(/)에서는 상단바 없이 4열 포털이 화면 전체를 채우도록 null 반환
 */
export const Header: React.FC = () => {
  const location = useLocation();
  const { resetAll, largeFont, toggleLargeFont } = useCopilot();
  const [appMode, setAppMode] = useState<'demo' | 'live' | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.mode === 'live' || json?.data?.mode === 'demo') {
          setAppMode(json.data.mode);
        }
      })
      .catch(() => {});
  }, []);

  if (location.pathname === '/') {
    return null;
  }

  const navItems = [
    { to: '/write', label: '새 민원 작성', icon: FileEdit },
    { to: '/stats', label: '동네별 통계', icon: BarChart3 },
    { to: '/history', label: '민원 이력', icon: Clock },
    { to: '/ordinances', label: '조례·법령 검색', icon: Scale },
  ];

  return (
    <div className="no-print max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4">
      <div className="bg-[#FFFDF9] border border-[#E6DEC8] rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        {/* Left: Back to Home Portal */}
        <div className="flex items-center space-x-3">
          <NavLink
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#2E2A26] hover:text-[#E86F1A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <DolhareubangLogo size={28} />
            <span>제주민원메이트 메인</span>
          </NavLink>

          {/* Compact inline page switcher on desktop */}
          <div className="hidden md:flex items-center space-x-1 pl-3 border-l border-[#E6DEC8]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                      isActive
                        ? 'bg-[#E86F1A] text-white'
                        : 'text-[#5C5348] hover:bg-[#F3EDE0] hover:text-[#2E2A26]'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleLargeFont}
            aria-pressed={largeFont}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
              largeFont
                ? 'bg-[#E86F1A] border-[#E86F1A] text-white'
                : 'bg-white border-[#E6DEC8] text-[#5C5348] hover:bg-[#F3EDE0]'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>{largeFont ? '큰 글씨' : '글자크기'}</span>
          </button>

          {appMode && (
            <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-[#F3EDE0] text-[10px] font-medium text-[#5C5348]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  appMode === 'live' ? 'bg-emerald-600' : 'bg-[#E86F1A]'
                }`}
              />
              <span>{appMode === 'live' ? '실연동' : '시연'}</span>
            </span>
          )}

          {location.pathname === '/write' && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('작성 중인 모든 입력값을 초기화하시겠습니까?')) {
                  resetAll();
                }
              }}
              className="px-2.5 py-1 text-xs text-[#5C5348] hover:text-[#2E2A26] hover:bg-[#F3EDE0] rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">초기화</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
