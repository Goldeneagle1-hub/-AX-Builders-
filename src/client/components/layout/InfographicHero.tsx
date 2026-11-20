import React from 'react';
import { useCopilot } from '../../context/CopilotContext';

export const InfographicHero: React.FC = () => {
  const { step, setStep, intakeResult, groundResult, draftResult } = useCopilot();

  const canJump = (target: number) => {
    if (target === 1) return true;
    if (target === 2) return !!intakeResult;
    if (target === 3) return !!groundResult;
    if (target === 4) return !!draftResult;
    return false;
  };

  const columns = [
    {
      num: 1,
      title: '상황 구조화',
      sub: '(입력·음성·사진)',
      desc: '구어체·음성·사진으로\n육하원칙 자동 정리',
      bg: 'bg-gradient-to-b from-[#7EB299] to-[#5D947A]',
      illustration: (
        <svg viewBox="0 0 120 90" className="w-24 h-20 mx-auto drop-shadow-xs" fill="none">
          <rect x="20" y="24" width="52" height="38" rx="6" fill="#FFFFFF" opacity="0.95" />
          <circle cx="36" cy="43" r="8" fill="#E86F1A" />
          <path d="M50 38 H64 M50 46 H60" stroke="#2E2A26" strokeWidth="3" strokeLinecap="round" />
          <circle cx="84" cy="34" r="11" fill="#FDE68A" />
          <path d="M72 68 C72 54, 96 54, 96 68" fill="#2E2A26" />
          <rect x="8" y="68" width="104" height="6" rx="3" fill="#2E2A26" opacity="0.2" />
        </svg>
      ),
    },
    {
      num: 2,
      title: '근거 매칭',
      sub: '(기상·시설·조례)',
      desc: '풍향·공영주차장·\n제주 16대 조례 대조',
      bg: 'bg-gradient-to-b from-[#F0B81D] to-[#D99B0A]',
      illustration: (
        <svg viewBox="0 0 120 90" className="w-24 h-20 mx-auto drop-shadow-xs" fill="none">
          <circle cx="52" cy="46" r="24" fill="#FFFFFF" opacity="0.92" />
          <path d="M52 46 L52 22 A24 24 0 0 1 74 54 Z" fill="#E86F1A" />
          <rect x="74" y="28" width="8" height="28" rx="2" fill="#2E2A26" />
          <rect x="86" y="20" width="8" height="36" rx="2" fill="#FFFFFF" />
          <path d="M24 58 L42 44 L56 50 L82 26" stroke="#2E2A26" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="68" width="104" height="6" rx="3" fill="#2E2A26" opacity="0.2" />
        </svg>
      ),
    },
    {
      num: 3,
      title: '관할·채널 안내',
      sub: '(3계층 부서분리)',
      desc: '도 본청·행정시·\n읍면동 복합민원 분리',
      bg: 'bg-gradient-to-b from-[#55A5CB] to-[#3B84A8]',
      illustration: (
        <svg viewBox="0 0 120 90" className="w-24 h-20 mx-auto drop-shadow-xs" fill="none">
          <rect x="44" y="18" width="32" height="14" rx="3" fill="#FFFFFF" />
          <path d="M60 32 V42 M32 42 H88 M32 42 V50 M88 42 V50" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="16" y="50" width="32" height="16" rx="3" fill="#FDE68A" />
          <rect x="72" y="50" width="32" height="16" rx="3" fill="#FFFFFF" />
          <rect x="8" y="70" width="104" height="6" rx="3" fill="#2E2A26" opacity="0.2" />
        </svg>
      ),
    },
    {
      num: 4,
      title: '민원서·접수',
      sub: '(순화·국민신문고)',
      desc: '표현 순화 공문서 및\n국민신문고 바로 연동',
      bg: 'bg-gradient-to-b from-[#E57D4C] to-[#CC5B29]',
      illustration: (
        <svg viewBox="0 0 120 90" className="w-24 h-20 mx-auto drop-shadow-xs" fill="none">
          <rect x="28" y="16" width="46" height="54" rx="4" fill="#FFFFFF" opacity="0.96" />
          <path d="M37 28 H65 M37 37 H65 M37 46 H55" stroke="#2E2A26" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="76" cy="54" r="14" fill="#2E2A26" />
          <path d="M70 54 L74 58 L83 49" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="72" width="104" height="6" rx="3" fill="#2E2A26" opacity="0.2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="no-print rounded-2xl overflow-hidden border border-[#DFD5BC] shadow-[0_12px_32px_-12px_rgba(46,42,38,0.18)] bg-[#FFFDF9]">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left 8 cols: 4 Vertical Color-Blocked Infographic Columns (SEMAS style) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4">
          {columns.map((col) => {
            const isActive = step === col.num;
            const enabled = canJump(col.num);
            return (
              <button
                key={col.num}
                type="button"
                disabled={!enabled}
                onClick={() => enabled && setStep(col.num)}
                className={`${col.bg} relative flex flex-col justify-between p-4 min-h-[195px] sm:min-h-[230px] text-center text-white transition-all border-r border-white/20 last:border-r-0 ${
                  enabled ? 'cursor-pointer hover:brightness-105' : 'cursor-default opacity-90'
                } ${isActive ? 'ring-4 ring-inset ring-white/80' : ''}`}
              >
                {/* Active Pill */}
                {isActive && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/30 text-[9px] font-mono-num font-bold">
                    진행중
                  </span>
                )}

                <div className="pt-2 space-y-1">
                  <div className="text-[11px] font-mono-num font-bold opacity-85">
                    STEP 0{col.num}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight drop-shadow-2xs">
                    {col.title}
                  </h3>
                  <div className="text-[11px] font-semibold opacity-95">{col.sub}</div>
                  <p className="text-[10px] opacity-85 whitespace-pre-line leading-snug pt-1 hidden sm:block">
                    {col.desc}
                  </p>
                </div>

                {/* Bottom Flat Vector Illustration */}
                <div className="pt-2">{col.illustration}</div>
              </button>
            );
          })}
        </div>

        {/* Right 4 cols: Jeju Jurisdiction Map & Dark Call-Center Strip */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-b from-[#F5F1E8] to-[#EAE2D3] border-t lg:border-t-0 lg:border-l border-[#DFD5BC]">
          <div className="p-4 flex-1 flex flex-col items-center justify-center relative">
            <div className="text-center mb-2">
              <h4 className="text-xs font-extrabold text-[#2E2A26]">
                제주특별자치도 관할 안내
              </h4>
              <p className="text-[10px] text-[#786D5F]">(2개 행정시 · 43개 읍면동)</p>
            </div>

            {/* Minimal Jeju Island SVG Silhouette with City Badges */}
            <div className="relative w-full max-w-[230px] h-28 flex items-center justify-center">
              <svg viewBox="0 0 220 110" className="w-full h-full" fill="none">
                {/* Jeju Island Oval Silhouette */}
                <path
                  d="M20 62 C18 42, 52 24, 110 22 C168 20, 202 38, 200 58 C198 78, 160 92, 110 92 C58 92, 22 80, 20 62 Z"
                  fill="#DFD5C0"
                  stroke="#B8AC96"
                  strokeWidth="2"
                />
                {/* Mt. Hallasan ridge line */}
                <path
                  d="M35 56 Q110 48 185 56"
                  stroke="#9C907B"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              </svg>

              {/* Jeju City Badge */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-[#E86F1A] text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
                제주시 (26개 읍·면·동)
              </div>

              {/* Seogwipo City Badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-[#2E2A26] text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
                서귀포시 (17개 읍·면·동)
              </div>
            </div>
          </div>

          {/* Dark Contact / Call-Center Footer Bar (matching reference image bottom-right) */}
          <div className="bg-[#2E2A26] text-white px-3.5 py-2.5 grid grid-cols-3 items-center text-center divide-x divide-white/15">
            <div className="text-[10px] leading-tight text-[#D5CCB6] pr-1">
              <div className="font-semibold text-white">평일</div>
              <div className="font-mono-num">09:00~18:00</div>
            </div>
            <div className="px-1">
              <div className="text-[9px] text-[#D5CCB6]">제주도 콜센터</div>
              <div className="text-sm font-extrabold text-[#F59E0B] font-mono-num tracking-tight">
                064-120
              </div>
            </div>
            <div className="pl-1">
              <div className="text-[9px] text-[#D5CCB6]">정부민원안내</div>
              <div className="text-sm font-extrabold text-[#F59E0B] font-mono-num tracking-tight">
                110
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
