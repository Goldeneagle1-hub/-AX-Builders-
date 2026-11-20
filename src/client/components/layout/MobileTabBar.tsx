import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileEdit, BarChart3, Clock, Scale } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';

export const MobileTabBar: React.FC = () => {
  const { savedComplaints, citedOrdinanceIds } = useCopilot();
  const userSavedCount = savedComplaints.filter((c) => c.source === 'user').length;

  const tabs = [
    {
      to: '/write',
      label: '작성',
      icon: FileEdit,
      badge: null,
    },
    {
      to: '/stats',
      label: '통계',
      icon: BarChart3,
      badge: `${savedComplaints.length}`,
    },
    {
      to: '/history',
      label: '이력',
      icon: Clock,
      badge: userSavedCount > 0 ? `${userSavedCount}` : null,
    },
    {
      to: '/ordinances',
      label: '조례검색',
      icon: Scale,
      badge: citedOrdinanceIds.length > 0 ? `${citedOrdinanceIds.length}` : null,
    },
  ];

  return (
    <nav
      className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-t border-[#E2E8F0] shadow-[0_-6px_20px_-6px_rgba(46,42,38,0.12)] mobile-bottom-tabs pb-[env(safe-area-inset-bottom)]"
      aria-label="하단 네비게이션 탭"
    >
      <div className="grid grid-cols-4 h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-[44px] relative transition-colors ${
                  isActive
                    ? 'text-[#E86F1A] font-semibold'
                    : 'text-[#475569] hover:text-[#2E2A26]'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#E86F1A] text-white font-mono-num leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
