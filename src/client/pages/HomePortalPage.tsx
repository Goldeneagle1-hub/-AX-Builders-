import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Type,
  CloudSun,
  Scale,
  ShieldCheck,
  MapPin,
  Wind,
  AlertTriangle,
} from 'lucide-react';
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
        <svg viewBox="0 0 130 90" className="w-20 h-16 mx-auto drop-shadow-xs" fill="none">
          <rect x="20" y="18" width="58" height="42" rx="7" fill="#FFFFFF" opacity="0.96" />
          <circle cx="38" cy="39" r="9" fill="#E86F1A" />
          <path d="M54 34 H69 M54 44 H65" stroke="#2E2A26" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="92" cy="30" r="11" fill="#FDE68A" />
          <path d="M78 68 C78 52, 106 52, 106 68" fill="#2E2A26" />
          <rect x="8" y="70" width="114" height="6" rx="3" fill="#2E2A26" opacity="0.22" />
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
        <svg viewBox="0 0 130 90" className="w-20 h-16 mx-auto drop-shadow-xs" fill="none">
          <circle cx="56" cy="44" r="24" fill="#FFFFFF" opacity="0.94" />
          <path d="M56 44 L56 20 A24 24 0 0 1 78 53 Z" fill="#E86F1A" />
          <rect x="82" y="26" width="9" height="30" rx="2.5" fill="#2E2A26" />
          <rect x="95" y="16" width="9" height="40" rx="2.5" fill="#FFFFFF" />
          <path d="M26 58 L46 42 L62 49 L92 22" stroke="#2E2A26" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="70" width="114" height="6" rx="3" fill="#2E2A26" opacity="0.22" />
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
        <svg viewBox="0 0 130 90" className="w-20 h-16 mx-auto drop-shadow-xs" fill="none">
          <rect x="30" y="14" width="52" height="54" rx="5" fill="#FFFFFF" opacity="0.96" />
          <path d="M40 28 H72 M40 38 H72 M40 48 H60" stroke="#2E2A26" strokeWidth="3" strokeLinecap="round" />
          <circle cx="84" cy="52" r="14" fill="#2E2A26" />
          <path d="M77 52 L82 57 L92 47" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="72" width="114" height="6" rx="3" fill="#2E2A26" opacity="0.22" />
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
        <svg viewBox="0 0 130 90" className="w-20 h-16 mx-auto drop-shadow-xs" fill="none">
          <path d="M65 16 V62 M40 28 H90" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M40 28 L30 48 H50 Z" fill="#FDE68A" />
          <path d="M90 28 L80 48 H100 Z" fill="#FFFFFF" />
          <rect x="48" y="62" width="34" height="8" rx="3" fill="#2E2A26" />
          <rect x="8" y="72" width="114" height="6" rx="3" fill="#2E2A26" opacity="0.22" />
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
    <div className="space-y-6 pb-8">
      {/* Top-Left Brand Title Row (Clean inline title, no sticky top bar) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-3">
          <DolhareubangLogo size={46} className="shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2E2A26] tracking-tight leading-none">
                제주민원메이트
              </h1>
              <span className="text-[11px] font-mono-num text-[#786D5F] bg-[#F3EDE0] px-2 py-0.5 rounded-full border border-[#E6DEC8]">
                Jeju Minwon Mate
              </span>
            </div>
            <p className="text-xs text-[#5C5348] mt-1">
              사진 한 장과 일상 말투로 완성하는 데이터·조례 기반 제주 맞춤형 AI 민원 해결사
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleLargeFont}
          aria-pressed={largeFont}
          className={`min-h-[36px] px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 ${
            largeFont
              ? 'bg-[#E86F1A] border-[#E86F1A] text-white'
              : 'bg-[#FFFDF9] border-[#E6DEC8] text-[#5C5348] hover:bg-[#F3EDE0]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>{largeFont ? '큰 글씨 켜짐' : '큰 글씨 모드'}</span>
        </button>
      </div>

      {/* Compact 4-Column + Right Map Portal */}
      <section className="rounded-2xl overflow-hidden border border-[#DFD5BC] shadow-[0_14px_38px_-14px_rgba(46,42,38,0.2)] bg-[#FFFDF9]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 8 cols: Compact 4-Column Vertical Color Infographic Menu */}
          <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4">
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
                className={`${col.bg} group relative flex flex-col justify-between p-4 sm:p-5 min-h-[240px] lg:min-h-[310px] text-center text-white transition-all border-b sm:border-b-0 sm:border-r border-white/25 last:border-r-0 cursor-pointer hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-inset focus:ring-white/80`}
              >
                <div className="flex justify-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-[10px] font-mono-num font-semibold">
                    {col.badge}
                  </span>
                </div>

                <div className="space-y-1.5 my-auto py-2">
                  <h2 className="text-base sm:text-lg font-extrabold tracking-tight drop-shadow-xs group-hover:scale-105 transition-transform">
                    {col.title}
                  </h2>
                  <div className="text-[11px] font-semibold opacity-95">{col.sub}</div>
                  <p className="text-[11px] opacity-90 whitespace-pre-line leading-snug pt-1 hidden sm:block">
                    {col.desc}
                  </p>
                  <div className="pt-2 inline-flex items-center space-x-1 text-[11px] font-bold bg-white/20 group-hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                    <span>바로가기</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <div className="pt-1">{col.illustration}</div>
              </div>
            ))}
          </div>

          {/* Right 4 cols: Interactive Jeju Jurisdiction Map & Call-Center Bar */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-b from-[#F7F3EA] to-[#EAE2D3] border-t lg:border-t-0 lg:border-l border-[#DFD5BC]">
            <div className="p-4 flex-1 flex flex-col items-center justify-center gap-2">
              <div className="text-center">
                <h3 className="text-sm font-extrabold text-[#2E2A26]">
                  제주특별자치도 관할 바로 선택
                </h3>
                <p className="text-[11px] text-[#786D5F]">
                  행정시 클릭 시 민원 작성 화면으로 이동합니다
                </p>
              </div>

              <div className="relative w-full max-w-[240px] h-32 flex items-center justify-center">
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

                <button
                  type="button"
                  onClick={() => handleCitySelect('제주시')}
                  className={`absolute top-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-md text-[11px] font-bold shadow-sm whitespace-nowrap transition-all cursor-pointer ${
                    city === '제주시'
                      ? 'bg-[#E86F1A] text-white ring-2 ring-[#E86F1A]/40 scale-105'
                      : 'bg-white text-[#2E2A26] border border-[#D5CCB6] hover:bg-[#FAF6EE]'
                  }`}
                >
                  제주시 (26개 읍·면·동)
                </button>

                <button
                  type="button"
                  onClick={() => handleCitySelect('서귀포시')}
                  className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-md text-[11px] font-bold shadow-sm whitespace-nowrap transition-all cursor-pointer ${
                    city === '서귀포시'
                      ? 'bg-[#E86F1A] text-white ring-2 ring-[#E86F1A]/40 scale-105'
                      : 'bg-white text-[#2E2A26] border border-[#D5CCB6] hover:bg-[#FAF6EE]'
                  }`}
                >
                  서귀포시 (17개 읍·면·동)
                </button>
              </div>
            </div>

            <div className="bg-[#2E2A26] text-white px-3.5 py-3 grid grid-cols-3 items-center text-center divide-x divide-white/15">
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

      {/* Below Portal: Service Overview (3 Key Features) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-[#2E2A26]">
            제주민원메이트는 어떻게 민원 해결을 돕나요?
          </h2>
          <span className="text-[11px] text-[#786D5F] font-mono-num hidden sm:inline">
            소요시간 20분 → 2분 단축
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#FFFDF9] border border-[#E6DEC8] rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-[#E86F1A]/15 text-[#E86F1A] flex items-center justify-center">
                <CloudSun className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-[#2E2A26]">객관적 기상·시설 자동 결합</h3>
            </div>
            <p className="text-xs text-[#5C5348] leading-relaxed">
              사라지기 쉬운 악취·주정차 현장 상황을 Open-Meteo 풍향·습도 데이터 및 인근 공영주차장·클린하우스·단속 CCTV 정보와 자동으로 연결합니다.
            </p>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E6DEC8] rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-[#2E2A26]/10 text-[#2E2A26] flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-[#2E2A26]">제주 16대 조례·3계층 관할 분리</h3>
            </div>
            <p className="text-xs text-[#5C5348] leading-relaxed">
              검증된 ELIS 자치법규 DB 안에서만 조례를 인용해 AI 환각을 차단하고, 도 본청·행정시·읍면동 중 정확한 소관 부서(복합 민원은 자동 분리)를 안내합니다.
            </p>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E6DEC8] rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600/15 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-[#2E2A26]">순화 가드레일·국민신문고 연동</h3>
            </div>
            <p className="text-xs text-[#5C5348] leading-relaxed">
              감정적·비방성 표현을 행정 표준 공문서 어조로 순화하고 민감정보를 비식별화한 뒤, 클립보드 자동 복사 후 국민신문고로 바로 연결합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Below Portal: Real Case Showcase (Clickable Demo Scenarios) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-[#2E2A26] flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-[#E86F1A]" />
            <span>주요 민원 해결 사례 (클릭 시 4단계 시연 바로 체험)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Case 1 */}
          <div className="bg-[#FFFDF9] border border-[#E6DEC8] rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  사례 ① · 환경·악취 단일 민원
                </span>
                <span className="text-[11px] text-[#786D5F] flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-[#E86F1A]" />
                  <span>서귀포시 대정읍 하모리</span>
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#2E2A26] flex items-center space-x-1.5">
                <Wind className="w-4 h-4 text-[#E86F1A] shrink-0" />
                <span>숙박업소 인근 양돈 축사 악취 유입 및 투숙객 환불 피해</span>
              </h3>

              <p className="text-xs text-[#5C5348] leading-relaxed bg-[#FAF6EE] p-3 rounded-lg border border-[#E6DEC8]">
                <strong>해결 과정:</strong> 원거리 사진만으로 악취를 단정하지 않고, 조회 시점 <strong>북서풍 기상 데이터 + 제주 악취방지 조례 + 서귀포시 기후환경과(환경지도팀)</strong> 현장 포집 요청 공문서를 2분 만에 완성합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                loadPreset('preset-daejeong-odor');
                navigate('/write');
              }}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#2E2A26] hover:bg-[#1F1C18] text-white text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>사례 ① 대정읍 악취 시연 바로 체험하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Case 2 */}
          <div className="bg-[#FFFDF9] border border-[#E6DEC8] rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[11px] font-bold">
                  사례 ② · 교통 + 폐기물 복합 민원
                </span>
                <span className="text-[11px] text-[#786D5F] flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-[#E86F1A]" />
                  <span>제주시 일도1동 중앙로</span>
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#2E2A26] flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-[#E86F1A] shrink-0" />
                <span>상가 진입로 황색실선 불법 주정차 및 미규격 쓰레기 방치</span>
              </h3>

              <p className="text-xs text-[#5C5348] leading-relaxed bg-[#FAF6EE] p-3 rounded-lg border border-[#E6DEC8]">
                <strong>해결 과정:</strong> 성격이 다른 2개 사안을 <strong>제주시 교통행정과(주정차)와 생활환경과(폐기물)로 자동 분리</strong>하고, 인근 동문공영주차장·단속 CCTV 정보를 근거로 첨부합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                loadPreset('preset-ildo-complex');
                navigate('/write');
              }}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#E86F1A] hover:bg-[#CF5C0E] text-white text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>사례 ② 일도1동 복합 민원 바로 체험하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
