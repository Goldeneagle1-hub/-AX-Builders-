import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileEdit, BarChart3, Clock, Scale, ShieldAlert } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { DolhareubangLogo } from './DolhareubangLogo';

export const Sidebar: React.FC = () => {
  const { savedComplaints, citedOrdinanceIds } = useCopilot();
  const userSavedCount = savedComplaints.filter((c) => c.source === 'user').length;

  const navItems = [
    {
      to: '/',
      label: '새 민원 작성',
      icon: FileEdit,
      badge: null,
    },
    {
      to: '/stats',
      label: '동네별 민원 통계',
      icon: BarChart3,
      badge: `${savedComplaints.length}건`,
    },
    {
      to: '/history',
      label: '민원 이력',
      icon: Clock,
      badge: userSavedCount > 0 ? `내 작성 ${userSavedCount}건` : null,
    },
    {
      to: '/ordinances',
      label: '조례·법령 검색',
      icon: Scale,
      badge: citedOrdinanceIds.length > 0 ? `인용 ${citedOrdinanceIds.length}` : null,
    },
  ];

  return (
    <aside className="no-print hidden lg:flex flex-col w-64 bg-[#F3EDE0] text-[#2E2A26] shrink-0 min-h-screen border-r border-[#E6DEC8] select-none">
      {/* Brand Header with Dolhareubang Sketch Logo */}
      <div className="p-5 border-b border-[#E6DEC8] bg-[#FAF6EE]/70">
        <div className="flex items-center space-x-3">
          <DolhareubangLogo size={44} className="shrink-0 drop-shadow-xs" />
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none text-[#2E2A26]">
              제주민원메이트
            </h1>
            <p className="text-[11px] text-[#786D5F] mt-1 font-mono-num">
              Jeju Minwon Mate
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menus */}
      <nav className="flex-1 p-3 space-y-1.5" aria-label="사이드바 메뉴">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E86F1A] text-white font-semibold shadow-xs'
                    : 'text-[#3A332C] hover:bg-[#E6DEC8]/60 hover:text-[#2E2A26]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-[#786D5F]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-mono-num font-medium ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-[#E6DEC8] text-[#2E2A26]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Guide Note Box */}
      <div className="p-4 m-3 rounded-lg bg-[#FFFDF9] border border-[#E6DEC8] text-xs text-[#5C5348] space-y-2">
        <div className="flex items-center space-x-1.5 text-[#C9580C] font-semibold text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>공식 접수 대행 아님</span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#5C5348]">
          본 도구는 소상공인과 도민의 민원 작성·정리를 보조합니다. 공식 접수는 국민신문고 또는 안전신문고를 통해 직접 제출됩니다.
        </p>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#E6DEC8] text-[11px] text-[#786D5F] flex items-center justify-between font-mono-num px-4">
        <span>제주 AX Builders</span>
        <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>v1.0 Ready</span>
        </span>
      </div>
    </aside>
  );
};
