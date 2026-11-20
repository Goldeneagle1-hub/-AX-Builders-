import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Info, RefreshCw } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { DolhareubangLogo } from './DolhareubangLogo';

export const Header: React.FC = () => {
  const location = useLocation();
  const { resetAll } = useCopilot();
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

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return '제주 민원 코파일럿 작성';
      case '/stats':
        return '동네별 민원 통계 현황';
      case '/history':
        return '민원 작성 및 보관 이력';
      case '/ordinances':
        return '제주 자치법규·조례 카탈로그';
      default:
        return '제주 민원 코파일럿';
    }
  };

  return (
    <header className="no-print bg-[#FFFDF9] border-b border-[#E6DEC8] sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Mobile Brand & Page Context */}
        <div className="flex items-center space-x-3">
          <div className="lg:hidden flex items-center">
            <DolhareubangLogo size={34} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2E2A26] leading-tight">
              {getPageTitle()}
            </h2>
            <div className="flex items-center space-x-2 text-[11px] text-[#786D5F] mt-0.5">
              <span>제주 소상공인·도민 행정지원</span>
              <span className="text-[#D5CCB6]">•</span>
              <span className="hidden sm:inline">3계층 관할 안내 (도청/시청/주민센터)</span>
            </div>
          </div>
        </div>

        {/* Right: Mode Badge & Quick Action */}
        <div className="flex items-center space-x-3">
          {/* Mode Badge */}
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
                ? '실연동 모드 (Live)'
                : appMode === 'demo'
                ? '시연 모드 (Demo)'
                : '모드 확인 중...'}
            </span>
          </div>

          {location.pathname === '/' && (
            <button
              onClick={() => {
                if (window.confirm('작성 중인 모든 입력값을 초기화하시겠습니까?')) {
                  resetAll();
                }
              }}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 text-xs text-[#5C5348] hover:text-[#2E2A26] hover:bg-[#F3EDE0] rounded-md transition-colors cursor-pointer"
              title="새로 작성하기"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* Memory Notice Banner */}
      <div className="bg-[#FDF4E7] border-t border-[#E6DEC8] px-4 py-1.5 text-center text-[11px] text-[#8C430E] flex items-center justify-center space-x-1.5">
        <Info className="w-3.5 h-3.5 text-[#E86F1A] shrink-0" />
        <span>
          임시 미디어(녹음·사진) 및 정밀 GPS는 메모리에만 임시 보관되며, 페이지 새로고침 시 초기화됩니다. 최종본은 [이력에 저장]을 눌러 보관하세요.
        </span>
      </div>
    </header>
  );
};
