import React from 'react';
import {
  GitBranch,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  ShieldAlert,
  Building,
} from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';

export const Step3View: React.FC = () => {
  const { groundResult, setStep } = useCopilot();

  const routing = groundResult?.routing;

  if (!routing) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
        관할 라우팅 데이터가 없습니다. STEP 2에서 근거 매칭을 먼저 완료해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Disclaimer Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {routing.disclaimer}
          <span className="block font-semibold mt-0.5 text-amber-950">
            * 본 서비스는 공식 접수를 대행하지 않으며, 아래 권장 채널의 공식 웹사이트를 통해 직접 접수하셔야 합니다.
          </span>
        </p>
      </div>

      {/* Compound Complaint Banner if applicable */}
      {routing.isCompound && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-[#2E2A26]" />
            <span className="font-bold">
              복합 민원 감지: 서로 다른 관할 소관 2개 사안으로 자동 분리 추천되었습니다.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-200/70 text-blue-900 text-[11px] font-bold">
            이슈별 2건 분리
          </span>
        </div>
      )}

      {/* Issues Cards / Tables */}
      <div className="space-y-4">
        {routing.issues.map((issue, idx) => (
          <div
            key={idx}
            className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-[#2E2A26]/30 transition-all"
          >
            {/* Issue Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#2E2A26] text-white flex items-center justify-center font-bold text-xs font-mono-num">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  {issue.issueTitle}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E86F1A]/10 text-[#E86F1A]">
                {issue.category}
              </span>
            </div>

            {/* 1st Recommendation & Practical Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-[#2E2A26] block">
                  1차 접수 추천 부서
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  {issue.recommendedDepartment}
                </div>
                <div className="text-slate-600 text-[11px]">
                  실무팀: <span className="font-semibold text-slate-800">{issue.practicalTeam}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-600 block">
                  협조 가능 부서 및 기관
                </span>
                <ul className="text-slate-700 text-[11px] list-disc list-inside space-y-0.5">
                  {issue.cooperatingDepartments.map((dept, i) => (
                    <li key={i}>{dept}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3-Tier Hierarchy Infographic Flow Diagram */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2E2A26] flex items-center space-x-1.5">
                <Building className="w-4 h-4 text-[#E86F1A]" />
                <span>제주특별자치도 3계층 행정 분장 인포그래픽</span>
              </span>

              <div className="grid grid-cols-1 lg:grid-cols-11 gap-2 items-stretch text-xs">
                {/* Province */}
                <div className="lg:col-span-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="inline-block font-mono-num text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E2E8F0] text-[#334155]">
                    TIER 01 · 도 본청
                  </div>
                  <div className="font-bold text-[#2E2A26] text-[11px]">총괄 정책·광역</div>
                  <div className="text-[#334155] text-[11px] leading-snug">
                    {issue.hierarchy.province}
                  </div>
                </div>

                <div className="flex items-center justify-center text-[#E86F1A] font-bold text-sm lg:col-span-1">
                  <span className="lg:hidden">↓</span>
                  <span className="hidden lg:inline">→</span>
                </div>

                {/* City (Primary Execution) */}
                <div className="lg:col-span-3 p-3 rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#FDF2E4] border-2 border-[#E86F1A]/50 shadow-xs space-y-1">
                  <div className="inline-block font-mono-num text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E86F1A] text-white">
                    TIER 02 · 행정시 (핵심)
                  </div>
                  <div className="font-bold text-[#2E2A26] text-[11px]">지도·점검·단속 집행</div>
                  <div className="text-[#2E2A26] text-[11px] font-semibold leading-snug">
                    {issue.hierarchy.city}
                  </div>
                </div>

                <div className="flex items-center justify-center text-[#E86F1A] font-bold text-sm lg:col-span-1">
                  <span className="lg:hidden">↓</span>
                  <span className="hidden lg:inline">→</span>
                </div>

                {/* Community */}
                <div className="lg:col-span-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="inline-block font-mono-num text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E2E8F0] text-[#334155]">
                    TIER 03 · 읍·면·동
                  </div>
                  <div className="font-bold text-[#2E2A26] text-[11px]">주민센터 초동 확인</div>
                  <div className="text-[#334155] text-[11px] leading-snug">
                    {issue.hierarchy.community}
                  </div>
                </div>
              </div>
            </div>

            {/* Jurisdiction Reason */}
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-[11px]">
                관할 판단 이유:
              </span>
              <p className="leading-relaxed">{issue.jurisdictionReason}</p>
            </div>

            {/* Pre-filing Checklist */}
            <div className="text-xs space-y-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/60">
              <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>공식 접수 전 필수 체크리스트</span>
              </span>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {issue.checklist.map((chk, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <span>{chk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Channel Guidance (Text only in Step 3; clickable buttons appear after Step 4 completion) */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-medium">
                권장 접수 채널:{' '}
                <strong className="text-[#2E2A26]">
                  {issue.channels.map((ch) => ch.name).join(' · ')}
                </strong>
              </span>
              <span className="text-[11px] text-slate-500">
                * 최종 민원서 완성 후(STEP 4) 바로 접수 버튼이 활성화됩니다.
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>STEP 2로 돌아가기</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(4)}
          className="min-h-[44px] px-6 py-2.5 bg-[#2E2A26] hover:bg-[#1F1C18] text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
        >
          <span>STEP 4: 민원서 초안 생성 및 후속 가이드로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
