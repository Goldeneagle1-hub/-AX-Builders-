import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Type } from 'lucide-react';
import { useCopilot } from '../context/CopilotContext';
import { JEJU_DISTRICTS } from '@shared/jurisdictions';
import { DolhareubangLogo } from '../components/layout/DolhareubangLogo';

export const HomePortalPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    city,
    setCity,
    setDistrict,
    setStep,
    setStep1Tab,
    loadPreset,
    savedComplaints,
    citedOrdinanceIds,
    markInputsDirty,
    largeFont,
    toggleLargeFont,
  } = useCopilot();

  const userSavedCount = savedComplaints.filter((c) => c.source === 'user').length;

  const portalColumns = [
    {
      to: '/write',
      title: '새 민원 작성',
      sub: '(AI 챗봇·음성·사진)',
      desc: '구어체·음성·사진으로\n4단계 공문서 자동 완성',
      badge: '4단계 작성',
      bg: 'bg-gradient-to-b from-[#7EB299] to-[#568E73]',
      illustration: (
        <svg viewBox="0 0 130 100" className="w-28 h-24 mx-auto drop-shadow-sm" fill="none">
          <rect x="20" y="24" width="58" height="44" rx="7" fill="#FFFFFF" opacity="0.96" />
          <circle cx="38" cy="46" r="9" fill="#E86F1A" />
          <path d="M54 40 H69 M54 50 H65" stroke="#2E2A26" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="92" cy="36" r="12" fill="#FDE68A" />
          <path d="M78 74 C78 58, 106 58, 106 74" fill="#2E2A26" />
          <rect x="8" y="76" width="114" height="7" rx="3.5" fill="#2E2A26" opacity="0.22" />
        </svg>
      ),
    },
    {
      to: '/stats',
      title: '동네별 민원 통계',
      sub: '(B2G 현황판·기상)',
      desc: '읍면동 반복 민원 주의 및\n시간대·풍향 상관관계 분석',
      badge: `누적 ${savedComplaints.length}건`,
      bg: 'bg-gradient-to-b from-[#F0B81D] to-[#D69606]',
      illustration: (
        <svg viewBox="0 0 130 100" className="w-28 h-24 mx-auto drop-shadow-sm" fill="none">
          <circle cx="56" cy="50" r="26" fill="#FFFFFF" opacity="0.94" />
          <path d="M56 50 L56 24 A26 26 0 0 1 80 60 Z" fill="#E86F1A" />
          <rect x="82" y="30" width="9" height="32" rx="2.5" fill="#2E2A26" />
          <rect x="95" y="20" width="9" height="42" rx="2.5" fill="#FFFFFF" />
          <path d="M26 64 L46 48 L62 55 L92 26" stroke="#2E2A26" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="76" width="114" height="7" rx="3.5" fill="#2E2A26" opacity="0.22" />
        </svg>
      ),
    },
    {
      to: '/history',
      title: '민원 이력',
      sub: '(보관·복사·백업)',
      desc: '작성한 민원서 전문 조회,\nJSON 백업 및 복원 관리',
      badge: userSavedCount > 0 ? `내 작성 ${userSavedCount}건` : '이력 조회',
      bg: 'bg-gradient-to-b from-[#55A5CB] to-[#367FA3]',
      illustration: (
        <svg viewBox="0 0 130 100" className="w-28 h-24 mx-auto drop-shadow-sm" fill="none">
          <rect x="30" y="18" width="52" height="58" rx="5" fill="#FFFFFF" opacity="0.96" />
          <path d="M40 32 H72 M40 42 H72 M40 52 H60" stroke="#2E2A26" strokeWidth="3" strokeLinecap="round" />
          <circle cx="84" cy="58" r="15" fill="#2E2A26" />
          <path d="M77 58 L82 63 L92 53" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="78" width="114" height="7" rx="3.5" fill="#2E2A26" opacity="0.22" />
        </svg>
      ),
    },
    {
      to: '/ordinances',
      title: '조례·법령 검색',
      sub: '(16대 분야·관할표)',
      desc: '제주특별자치도 조례 검색 및\n민원 작성 즉시 인용 연동',
      badge: citedOrdinanceIds.length > 0 ? `인용 ${citedOrdinanceIds.length}건` : '16대 조례',
      bg: 'bg-gradient-to-b from-[#E57D4C] to-[#C85522]',
      illustration: (
        <svg viewBox="0 0 130 100" className="w-28 h-24 mx-auto drop-shadow-sm" fill="none">
          <path d="M65 20 V68 M40 32 H90" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M40 32 L30 52 H50 Z" fill="#FDE68A" />
          <path d="M90 32 L80 52 H100 Z" fill="#FFFFFF" />
          <rect x="48" y="68" width="34" height="8" rx="3" fill="#2E2A26" />
          <rect x="8" y="78" width="114" height="7" rx="3.5" fill="#2E2A26" opacity="0.22" />
        </svg>
      ),
    },
  ];

  const handleCitySelect = (targetCity: '제주시' | '서귀포시') => {
    setCity(targetCity);
    setDistrict(JEJU_DISTRICTS[targetCity][0]);
    markInputsDirty();
    setStep(1);
    setStep1Tab('direct');
    navigate('/write');
  };

  return (
    <div className="min-h-[calc(100vh-84px)] flex flex-col justify-center">
      {/* Full-Viewport SEMAS-Style 4-Column + Right Map Portal */}
      <section className="rounded-2xl overflow-hidden border border-[#DFD5BC] shadow-[0_18px_45px_-15px_rgba(46,42,38,0.22)] bg-[#FFFDF9] flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
          {/* Left 8 cols: 4 Full-Height Vertical Color Infographic Menu Columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {portalColumns.map((col) => (
              <div
                key={col.to}
                onClick={() => navigate(col.to)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(col.to);
                  }
                }}
                className={`${col.bg} group relative flex flex-col justify-between p-6 min-h-[260px] lg:min-h-[460px] text-center text-white transition-all border-b sm:border-b-0 sm:border-r border-white/25 last:border-r-0 cursor-pointer hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-inset focus:ring-white/80`}
              >
                {/* Top Status Pill */}
                <div className="flex justify-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-[11px] font-mono-num font-semibold backdrop-blur-xs">
                    {col.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-2 my-auto py-4">
                  <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight drop-shadow-xs group-hover:scale-105 transition-transform">
                    {col.title}
                  </h2>
                  <div className="text-xs font-semibold opacity-95">{col.sub}</div>
                  <p className="text-xs opacity-90 whitespace-pre-line leading-relaxed pt-2">
                    {col.desc}
                  </p>

                  <div className="pt-3 inline-flex items-center space-x-1 text-xs font-bold bg-white/20 group-hover:bg-white/30 px-3.5 py-1.5 rounded-full transition-colors">
                    <span>바로가기</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom Illustration */}
                <div className="pt-2">{col.illustration}</div>
              </div>
            ))}
          </div>

          {/* Right 4 cols: Brand Header + Interactive Jeju Jurisdiction Map + Quick Demo Presets + Call-Center Bar */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-b from-[#F7F3EA] to-[#EAE2D3] border-t lg:border-t-0 lg:border-l border-[#DFD5BC]">
            {/* Compact Integrated Brand Strip */}
            <div className="px-5 py-3.5 border-b border-[#DFD5BC] bg-[#FFFDF9]/75 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <DolhareubangLogo size={36} className="shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-sm font-extrabold text-[#2E2A26] tracking-tight truncate">
                    제주민원메이트
                  </h1>
                  <p className="text-[10px] text-[#786D5F] font-mono-num truncate">
                    Jeju Minwon Mate
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleLargeFont}
                aria-pressed={largeFont}
                className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer shrink-0 ${
                  largeFont
                    ? 'bg-[#E86F1A] border-[#E86F1A] text-white'
                    : 'bg-white border-[#E6DEC8] text-[#5C5348] hover:bg-[#F3EDE0]'
                }`}
              >
                <Type className="w-3 h-3" />
                <span>{largeFont ? '큰 글씨' : '글자크기'}</span>
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col items-center justify-between gap-3">
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-[#2E2A26]">
                  제주특별자치도 민원 관할 지도
                </h3>
                <p className="text-xs text-[#786D5F]">
                  행정시를 선택하면 바로 민원 작성 화면으로 이동합니다
                </p>
              </div>

              {/* Interactive Jeju Island SVG Silhouette */}
              <div className="relative w-full max-w-[280px] h-44 flex items-center justify-center my-auto">
                <svg viewBox="0 0 220 110" className="w-full h-full drop-shadow-xs" fill="none">
                  <path
                    d="M20 62 C18 42, 52 24, 110 22 C168 20, 202 38, 200 58 C198 78, 160 92, 110 92 C58 92, 22 80, 20 62 Z"
                    fill="#DFD5C0"
                    stroke="#B8AC96"
                    strokeWidth="2.2"
                  />
                  <path
                    d="M35 56 Q110 48 185 56"
                    stroke="#9C907B"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </svg>

                {/* Jeju City Button */}
                <button
                  type="button"
                  onClick={() => handleCitySelect('제주시')}
                  className={`absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg text-xs font-bold shadow-md whitespace-nowrap transition-all cursor-pointer ${
                    city === '제주시'
                      ? 'bg-[#E86F1A] text-white ring-2 ring-[#E86F1A]/40 scale-105'
                      : 'bg-white text-[#2E2A26] border border-[#D5CCB6] hover:bg-[#FAF6EE]'
                  }`}
                >
                  제주시 (26개 읍·면·동)
                </button>

                {/* Seogwipo City Button */}
                <button
                  type="button"
                  onClick={() => handleCitySelect('서귀포시')}
                  className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg text-xs font-bold shadow-md whitespace-nowrap transition-all cursor-pointer ${
                    city === '서귀포시'
                      ? 'bg-[#E86F1A] text-white ring-2 ring-[#E86F1A]/40 scale-105'
                      : 'bg-white text-[#2E2A26] border border-[#D5CCB6] hover:bg-[#FAF6EE]'
                  }`}
                >
                  서귀포시 (17개 읍·면·동)
                </button>
              </div>

              {/* Quick Demo Preset Launchers */}
              <div className="w-full bg-white/80 border border-[#DFD5BC] rounded-xl p-3 space-y-2">
                <div className="text-[11px] font-bold text-[#2E2A26] flex items-center justify-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E86F1A]" />
                  <span>대표 시나리오 원클릭 바로 시연</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loadPreset('preset-daejeong-odor');
                      navigate('/write');
                    }}
                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#2E2A26] hover:bg-[#1F1C18] text-white text-[11px] font-semibold cursor-pointer"
                  >
                    시연① 대정읍 악취
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loadPreset('preset-ildo-complex');
                      navigate('/write');
                    }}
                    className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#E86F1A] hover:bg-[#CF5C0E] text-white text-[11px] font-semibold cursor-pointer"
                  >
                    시연② 일도1동 복합
                  </button>
                </div>
              </div>
            </div>

            {/* Dark Contact / Call-Center Footer Bar */}
            <div className="bg-[#2E2A26] text-white px-4 py-4 grid grid-cols-3 items-center text-center divide-x divide-white/15">
              <div className="text-xs leading-tight text-[#D5CCB6] pr-2">
                <div className="font-semibold text-white">평일</div>
                <div className="font-mono-num text-[11px] mt-0.5">09:00~18:00</div>
              </div>
              <div className="px-2">
                <div className="text-[10px] text-[#D5CCB6]">제주도 콜센터</div>
                <div className="text-base sm:text-lg font-extrabold text-[#F59E0B] font-mono-num tracking-tight">
                  064-120
                </div>
              </div>
              <div className="pl-2">
                <div className="text-[10px] text-[#D5CCB6]">정부민원안내</div>
                <div className="text-base sm:text-lg font-extrabold text-[#F59E0B] font-mono-num tracking-tight">
                  110
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
