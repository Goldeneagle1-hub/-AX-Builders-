import React from 'react';
import { Camera, CloudSun, Building2, FileCheck2, ArrowRight, Sparkles } from 'lucide-react';
import { DolhareubangLogo } from './DolhareubangLogo';

export const InfographicHero: React.FC = () => {
  const highlights = [
    { label: '제주 자치법규', value: '16대 분야', sub: 'ELIS 검증 매칭' },
    { label: '행정 관할', value: '3계층 · 43개', sub: '도청·시·읍면동' },
    { label: '작성 단축', value: '20분 → 2분', sub: '공문서 자동 정제' },
  ];

  return (
    <section className="no-print relative overflow-hidden rounded-2xl border border-[#E6DEC8] bg-gradient-to-br from-[#FFFDF9] via-[#FAF4E8] to-[#F2E9D8] p-4 sm:p-5 shadow-[0_10px_30px_-10px_rgba(46,42,38,0.12),inset_0_1px_0_rgba(255,255,255,0.95)]">
      {/* Decorative subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#C8BCA4 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Emblem + Headline + Infographic Flow */}
        <div className="flex items-start sm:items-center gap-3.5">
          <DolhareubangLogo size={54} className="shrink-0" />
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#E86F1A]/15 text-[#C9580C] text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>DATA-DRIVEN JEJU CIVIC INFOGRAPHIC FLOW</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#2E2A26] tracking-tight">
              사진 한 장·일상 말투로 완성하는 제주 맞춤형 AI 민원 해결사
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#5C5348] font-medium pt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/80 border border-[#E6DEC8]">
                <Camera className="w-3 h-3 text-[#E86F1A]" /> 현장·음성 입력
              </span>
              <ArrowRight className="w-3 h-3 text-[#A89B87]" />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/80 border border-[#E6DEC8]">
                <CloudSun className="w-3 h-3 text-[#E86F1A]" /> 기상·시설·조례
              </span>
              <ArrowRight className="w-3 h-3 text-[#A89B87]" />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/80 border border-[#E6DEC8]">
                <Building2 className="w-3 h-3 text-[#E86F1A]" /> 3계층 관할 분리
              </span>
              <ArrowRight className="w-3 h-3 text-[#A89B87]" />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/80 border border-[#E6DEC8]">
                <FileCheck2 className="w-3 h-3 text-[#E86F1A]" /> 공문서·접수연동
              </span>
            </div>
          </div>
        </div>

        {/* Right: Infographic Stat Callout Tiles */}
        <div className="grid grid-cols-3 gap-2 shrink-0">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-xl bg-white/90 border border-[#E6DEC8] px-3 py-2 text-center shadow-[0_2px_8px_-2px_rgba(46,42,38,0.06),inset_0_1px_0_rgba(255,255,255,1)]"
            >
              <div className="text-[10px] font-semibold text-[#786D5F]">{h.label}</div>
              <div className="text-xs sm:text-sm font-extrabold text-[#E86F1A] font-mono-num mt-0.5">
                {h.value}
              </div>
              <div className="text-[9px] text-[#8C8070] hidden sm:block">{h.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
