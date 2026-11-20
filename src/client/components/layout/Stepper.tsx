import React from 'react';
import { Check, ChevronRight, AlertCircle } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';

export const Stepper: React.FC = () => {
  const { step, setStep, intakeResult, groundResult, draftResult, needsRegen } = useCopilot();

  const steps = [
    { number: 1, title: '상황 구조화', sub: '대화·사진·6W 분석' },
    { number: 2, title: '근거 매칭', sub: '기상·시설·제주조례' },
    { number: 3, title: '관할 안내', sub: '3계층 부서·접수채널' },
    { number: 4, title: '민원서 초안', sub: '순화·출력·이력저장' },
  ];

  const canNavigateTo = (targetStep: number) => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return !!intakeResult;
    if (targetStep === 3) return !!groundResult;
    if (targetStep === 4) return !!draftResult;
    return false;
  };

  const currentStepObj = steps.find((s) => s.number === step) || steps[0];

  return (
    <div className="no-print bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-3 sm:p-4 mb-5 shadow-xs">
      {/* Mobile Stepper: Compact single line with progress */}
      <div className="lg:hidden flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 rounded-full bg-[#E86F1A] text-white flex items-center justify-center text-xs font-bold font-mono-num">
            {step}
          </span>
          <div>
            <div className="text-xs font-bold text-[#2E2A26] flex items-center space-x-1">
              <span>{currentStepObj.title}</span>
              <span className="text-[#475569] font-mono-num text-[11px] font-normal">
                ({step}/4)
              </span>
            </div>
            <p className="text-[10px] text-[#475569]">{currentStepObj.sub}</p>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center space-x-1.5">
          {steps.map((s) => (
            <button
              key={s.number}
              disabled={!canNavigateTo(s.number)}
              onClick={() => setStep(s.number)}
              aria-label={`Step ${s.number}: ${s.title}`}
              className={`w-6 h-6 rounded-full text-[10px] font-mono-num font-bold transition-all flex items-center justify-center ${
                s.number === step
                  ? 'bg-[#E86F1A] text-white ring-2 ring-[#E86F1A]/30'
                  : canNavigateTo(s.number)
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-[#F1F5F9] text-[#9A8F80] cursor-not-allowed'
              }`}
            >
              {canNavigateTo(s.number) && s.number < step ? (
                <Check className="w-3 h-3 text-emerald-700" />
              ) : (
                s.number
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Stepper: Detailed 4-column flow */}
      <div className="hidden lg:grid grid-cols-4 gap-2">
        {steps.map((s, idx) => {
          const isCurrent = s.number === step;
          const isCompleted = canNavigateTo(s.number) && s.number < step;
          const isAvailable = canNavigateTo(s.number);
          const hasStaleWarning =
            (s.number === 2 && needsRegen.step2) ||
            (s.number === 3 && needsRegen.step3) ||
            (s.number === 4 && needsRegen.step4);

          return (
            <button
              key={s.number}
              disabled={!isAvailable}
              onClick={() => setStep(s.number)}
              className={`flex items-center p-2.5 rounded-lg text-left transition-all relative ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#3F3933] to-[#24201C] text-white shadow-[0_6px_14px_-4px_rgba(46,42,38,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]'
                  : isAvailable
                  ? 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#2E2A26] shadow-2xs'
                  : 'bg-[#F8FAFC]/60 text-[#9A8F80] cursor-not-allowed'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono-num shrink-0 mr-3 ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#F27E2C] to-[#DC6310] text-white shadow-[0_2px_6px_rgba(232,111,26,0.5),inset_0_1px_0_rgba(255,255,255,0.35)]'
                    : isCompleted
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-[#E2E8F0] text-[#334155]'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.number}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`text-xs font-bold truncate ${
                      isCurrent ? 'text-white' : 'text-[#2E2A26]'
                    }`}
                  >
                    {s.title}
                  </span>
                  {hasStaleWarning && (
                    <span
                      title="입력 변경으로 다시 생성 필요"
                      className="w-2 h-2 rounded-full bg-amber-400 shrink-0"
                    ></span>
                  )}
                </div>
                <div
                  className={`text-[11px] truncate ${
                    isCurrent ? 'text-[#E2E8F0]' : 'text-[#475569]'
                  }`}
                >
                  {s.sub}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <ChevronRight
                  className={`w-4 h-4 shrink-0 ml-1 ${
                    isCurrent ? 'text-white/40' : 'text-[#D5CCB6]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
