import React, { useState } from 'react';
import { Check, Sparkles, AlertCircle } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { JEJU_DISTRICTS } from '@shared/jurisdictions';

export const InfographicHero: React.FC = () => {
  const {
    step,
    setStep,
    setStep1Tab,
    city,
    setCity,
    district,
    setDistrict,
    text,
    occurredAt,
    photoBase64,
    followUpAnswers,
    intakeResult,
    setIntakeResult,
    groundResult,
    draftResult,
    loadPreset,
    markInputsDirty,
  } = useCopilot();

  const [portalNotice, setPortalNotice] = useState<string | null>(null);
  const [quickLoading, setQuickLoading] = useState(false);

  const showNotice = (msg: string) => {
    setPortalNotice(msg);
    setTimeout(() => setPortalNotice(null), 3500);
  };

  const handleColumnClick = async (targetNum: number) => {
    setPortalNotice(null);

    if (targetNum === 1) {
      setStep(1);
      return;
    }

    if (targetNum === 2) {
      if (intakeResult) {
        setStep(2);
        return;
      }
      if (text.trim().length >= 2) {
        // Auto-run Step 1 intake and advance to Step 2
        setQuickLoading(true);
        try {
          const res = await fetch('/api/intake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              city,
              district,
              occurredAt,
              photoBase64: photoBase64 || undefined,
              followUpAnswers,
            }),
          });
          const json = await res.json();
          if (json.data) {
            setIntakeResult(json.data);
            setStep(2);
          } else {
            showNotice(json.error?.message || '상황 구조화 후 이동할 수 있습니다.');
          }
        } catch {
          showNotice('네트워크 오류가 발생했습니다. STEP 1에서 다시 시도해 주세요.');
        } finally {
          setQuickLoading(false);
        }
        return;
      }
      setStep(1);
      setStep1Tab('direct');
      showNotice('STEP 1에서 민원 내용을 입력하거나 시연 프리셋 ①·②를 먼저 선택해 주세요.');
      return;
    }

    if (targetNum === 3) {
      if (groundResult) {
        setStep(3);
      } else if (intakeResult) {
        setStep(2);
        showNotice('STEP 2에서 기상·시설·조례 근거를 먼저 매칭해 주세요.');
      } else {
        setStep(1);
        showNotice('먼저 STEP 1 상황 구조화를 완료해 주세요.');
      }
      return;
    }

    if (targetNum === 4) {
      if (draftResult || groundResult) {
        setStep(4);
      } else if (intakeResult) {
        setStep(2);
        showNotice('STEP 2 근거 매칭 및 STEP 3 관할 확인 후 민원서가 생성됩니다.');
      } else {
        setStep(1);
        showNotice('먼저 STEP 1 상황 구조화를 완료해 주세요.');
      }
    }
  };

  const handleSelectCityOnMap = (targetCity: '제주시' | '서귀포시') => {
    setCity(targetCity);
    setDistrict(JEJU_DISTRICTS[targetCity][0]);
    markInputsDirty();
    setStep(1);
    setStep1Tab('direct');
    showNotice(`관할 행정시가 '${targetCity}'(${JEJU_DISTRICTS[targetCity][0]})로 설정되었습니다.`);
  };

  const getStepStatus = (num: number): 'active' | 'done' | 'ready' => {
    if (step === num) return 'active';
    if (num === 1 && intakeResult) return 'done';
    if (num === 2 && groundResult) return 'done';
    if (num === 3 && groundResult) return 'done';
    if (num === 4 && draftResult) return 'done';
    return 'ready';
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
    <div className="no-print space-y-2.5">
      <section className="rounded-2xl overflow-hidden border border-[#DFD5BC] shadow-[0_12px_32px_-12px_rgba(46,42,38,0.18)] bg-[#FFFFFF]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 8 cols: Interactive 4-Column Vertical Infographic Portal */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4">
            {columns.map((col) => {
              const status = getStepStatus(col.num);
              const isActive = status === 'active';
              const isDone = status === 'done';
              return (
                <div
                  key={col.num}
                  className={`${col.bg} relative flex flex-col justify-between p-4 min-h-[210px] sm:min-h-[250px] text-center text-white transition-all border-r border-white/20 last:border-r-0 ${
                    isActive ? 'ring-4 ring-inset ring-white/90 brightness-105' : 'hover:brightness-105'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between text-[10px] font-mono-num font-bold">
                    <span className="opacity-85">0{col.num}</span>
                    {isActive ? (
                      <span className="px-1.5 py-0.5 rounded bg-black/30 text-white">진행 중</span>
                    ) : isDone ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-700/80 text-white">
                        <Check className="w-2.5 h-2.5" /> 완료
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-white/20 text-white/90">클릭 이동</span>
                    )}
                  </div>

                  {/* Main Clickable Area */}
                  <button
                    type="button"
                    disabled={quickLoading}
                    onClick={() => handleColumnClick(col.num)}
                    className="flex-1 flex flex-col justify-between pt-1 cursor-pointer text-center focus:outline-none"
                  >
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-extrabold tracking-tight drop-shadow-2xs">
                        {col.title}
                      </h3>
                      <div className="text-[11px] font-semibold opacity-95">{col.sub}</div>
                      <p className="text-[10px] opacity-90 whitespace-pre-line leading-snug pt-0.5 hidden sm:block">
                        {col.desc}
                      </p>
                    </div>

                    <div className="pt-2">{col.illustration}</div>
                  </button>

                  {/* Quick Preset Triggers right inside Column 1 */}
                  {col.num === 1 && (
                    <div className="pt-2 border-t border-white/25 flex items-center justify-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadPreset('preset-daejeong-odor');
                          showNotice('시연 ①(서귀포시 대정읍 악취) 데이터를 불러왔습니다.');
                        }}
                        className="px-2 py-1 rounded bg-black/25 hover:bg-black/40 text-white font-semibold flex items-center gap-0.5 cursor-pointer"
                        title="대정읍 악취 시연 불러오기"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        <span>시연①</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadPreset('preset-ildo-complex');
                          showNotice('시연 ②(제주시 일도1동 복합민원) 데이터를 불러왔습니다.');
                        }}
                        className="px-2 py-1 rounded bg-black/25 hover:bg-black/40 text-white font-semibold flex items-center gap-0.5 cursor-pointer"
                        title="일도1동 복합민원 시연 불러오기"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        <span>시연②</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right 4 cols: Interactive Jeju Jurisdiction Map & Call-Center Strip */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-b from-[#F5F1E8] to-[#EAE2D3] border-t lg:border-t-0 lg:border-l border-[#DFD5BC]">
            <div className="p-4 flex-1 flex flex-col items-center justify-center relative">
              <div className="text-center mb-1.5">
                <h4 className="text-xs font-extrabold text-[#2E2A26]">
                  제주특별자치도 관할 선택
                </h4>
                <p className="text-[10px] text-[#475569]">
                  현재 선택: <strong className="text-[#E86F1A]">{city} {district}</strong> (클릭하여 전환)
                </p>
              </div>

              {/* Interactive Jeju Island SVG Silhouette */}
              <div className="relative w-full max-w-[240px] h-32 flex items-center justify-center">
                <svg viewBox="0 0 220 110" className="w-full h-full" fill="none">
                  <path
                    d="M20 62 C18 42, 52 24, 110 22 C168 20, 202 38, 200 58 C198 78, 160 92, 110 92 C58 92, 22 80, 20 62 Z"
                    fill="#DFD5C0"
                    stroke="#B8AC96"
                    strokeWidth="2"
                  />
                  <path
                    d="M35 56 Q110 48 185 56"
                    stroke="#9C907B"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </svg>

                {/* Interactive Jeju City Button */}
                <button
                  type="button"
                  onClick={() => handleSelectCityOnMap('제주시')}
                  className={`absolute top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-[10px] font-bold shadow-sm whitespace-nowrap transition-all cursor-pointer ${
                    city === '제주시'
                      ? 'bg-[#E86F1A] text-white ring-2 ring-[#E86F1A]/40 scale-105'
                      : 'bg-white text-[#2E2A26] border border-[#D5CCB6] hover:bg-[#F8FAFC]'
                  }`}
                >
                  제주시 (26개 읍·면·동)
                </button>

                {/* Interactive Seogwipo City Button */}
                <button
                  type="button"
                  onClick={() => handleSelectCityOnMap('서귀포시')}
                  className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-[10px] font-bold shadow-sm whitespace-nowrap transition-all cursor-pointer ${
                    city === '서귀포시'
                      ? 'bg-[#E86F1A] text-white ring-2 ring-[#E86F1A]/40 scale-105'
                      : 'bg-white text-[#2E2A26] border border-[#D5CCB6] hover:bg-[#F8FAFC]'
                  }`}
                >
                  서귀포시 (17개 읍·면·동)
                </button>
              </div>
            </div>

            {/* Dark Contact / Call-Center Footer Bar */}
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

      {/* Portal Feedback Notice */}
      {portalNotice && (
        <div className="p-2.5 rounded-xl bg-[#FDF4E7] border border-[#E86F1A]/40 text-xs text-[#8C430E] font-medium flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-[#E86F1A] shrink-0" />
          <span>{portalNotice}</span>
        </div>
      )}
    </div>
  );
};
