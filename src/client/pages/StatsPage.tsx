import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  Filter,
  Info,
  TrendingUp,
  FileCheck,
  Building,
  Clock,
  Sparkles,
  AlertTriangle,
  Wind,
} from 'lucide-react';
import { useCopilot } from '../context/CopilotContext';

export const StatsPage: React.FC = () => {
  const { savedComplaints } = useCopilot();

  const [cityFilter, setCityFilter] = useState<'전체' | '제주시' | '서귀포시'>('전체');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [sourceFilter, setSourceFilter] = useState<'전체' | 'demo' | 'user'>('전체');

  // Filtered complaints
  const filtered = useMemo(() => {
    return savedComplaints.filter((item) => {
      if (cityFilter !== '전체' && item.city !== cityFilter) return false;
      if (categoryFilter !== '전체' && !item.category.includes(categoryFilter)) return false;
      if (sourceFilter !== '전체' && item.source !== sourceFilter) return false;
      return true;
    });
  }, [savedComplaints, cityFilter, categoryFilter, sourceFilter]);

  // Aggregate by Category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of filtered) {
      const cat = item.category || '기타';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  // Aggregate by District (Top Eup/Myeon/Dong)
  const districtCounts = useMemo(() => {
    const counts: Record<string, { count: number; city: string; categories: Record<string, number> }> = {};
    for (const item of filtered) {
      const dist = item.district || '미지정';
      if (!counts[dist]) {
        counts[dist] = { count: 0, city: item.city, categories: {} };
      }
      counts[dist].count += 1;
      const cat = item.category || '기타';
      counts[dist].categories[cat] = (counts[dist].categories[cat] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1].count - a[1].count);
  }, [filtered]);

  // Time-of-day distribution & weather correlation (B2G Insight)
  const timeStats = useMemo(() => {
    let morning = 0; // 06 ~ 11
    let afternoon = 0; // 12 ~ 17
    let night = 0; // 18 ~ 05
    let odorMorningNight = 0;

    for (const item of filtered) {
      const timeMatch = item.occurredAt.match(/(\d{2}):\d{2}/);
      const hour = timeMatch ? parseInt(timeMatch[1], 10) : 12;
      if (hour >= 6 && hour < 12) {
        morning += 1;
      } else if (hour >= 12 && hour < 18) {
        afternoon += 1;
      } else {
        night += 1;
      }
      if (item.category.includes('악취') && (hour < 10 || hour >= 18)) {
        odorMorningNight += 1;
      }
    }

    return {
      buckets: [
        { label: '오전 (06~12시)', count: morning, color: 'bg-[#E86F1A]' },
        { label: '주간 (12~18시)', count: afternoon, color: 'bg-[#2E2A26]' },
        { label: '야간·심야 (18~06시)', count: night, color: 'bg-amber-700' },
      ],
      odorMorningNight,
    };
  }, [filtered]);

  // KPIs
  const totalCount = filtered.length;
  const userSavedCount = filtered.filter((c) => c.source === 'user').length;
  const topCategory = categoryCounts[0] ? `${categoryCounts[0][0]} (${categoryCounts[0][1]}건)` : '-';
  const topDistrict = districtCounts[0] ? `${districtCounts[0][0]} (${districtCounts[0][1].count}건)` : '-';

  const maxDistrictCount = districtCounts[0]?.[1]?.count || 1;
  const repeatHotspotCount = districtCounts.filter(([, info]) => info.count >= 2).length;

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-12">
      {/* Official Disclaimer Notice */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold text-slate-900">
            [데이터 안내] 이 브라우저의 예시·저장 기록이며 제주 전체 공식 통계가 아닙니다.
          </span>{' '}
          표본이 작을 때는 특정 읍·면·동의 전반적 현상으로 일반화하지 마시고, 반복되는 소상공인 피해 유형을 분석하는 정책 참고용으로만 활용하십시오.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 font-bold text-slate-800">
          <Filter className="w-4 h-4 text-[#2E2A26]" />
          <span>통계 필터 조건</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* City */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value as any)}
            className="min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2E2A26] focus:outline-none"
          >
            <option value="전체">행정시: 전체</option>
            <option value="제주시">제주시</option>
            <option value="서귀포시">서귀포시</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2E2A26] focus:outline-none"
          >
            <option value="전체">분야: 전체</option>
            <option value="악취">악취·환경</option>
            <option value="주정차">불법주정차·교통</option>
            <option value="폐기물">폐기물·쓰레기</option>
            <option value="도로">도로·보도시설</option>
            <option value="위생">식품·공중위생</option>
          </select>

          {/* Source */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2E2A26] focus:outline-none"
          >
            <option value="전체">출처: 전체</option>
            <option value="demo">초기 시연 데이터</option>
            <option value="user">내 저장 기록</option>
          </select>
        </div>
      </div>

      {/* 4 KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>총 접수 건수</span>
            <FileCheck className="w-4 h-4 text-[#2E2A26]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono-num">
            {totalCount} <span className="text-xs font-normal text-slate-500">건</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">시연 및 로컬 저장 합산</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>최다 발생 분야</span>
            <TrendingUp className="w-4 h-4 text-[#E86F1A]" />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {topCategory}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">환경 및 교통 민원 비중 높음</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>최다 빈도 읍·면·동</span>
            <Building className="w-4 h-4 text-[#2E2A26]" />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {topDistrict}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">숙박·상업 밀집지 중심</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>사용자 직접 저장</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono-num">
            {userSavedCount} <span className="text-xs font-normal text-slate-500">건</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">브라우저 로컬 저장소 보관</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Bar Chart: District breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2.5">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#2E2A26]" />
              <h3 className="font-bold text-slate-900 text-sm">
                읍·면·동별 반복 민원 건수 및 주요 유형
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono-num">
              상위 {districtCounts.length}개 지역
            </span>
          </div>

          <div className="space-y-3">
            {districtCounts.map(([distName, info], idx) => {
              const pct = Math.round((info.count / maxDistrictCount) * 100);
              const mainCats = Object.keys(info.categories).join(', ');
              const isRepeatHotspot = info.count >= 2;
              return (
                <div key={distName} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono-num shrink-0 ${
                          idx === 0
                            ? 'bg-[#E86F1A] text-white'
                            : idx === 1
                            ? 'bg-[#2E2A26] text-white'
                            : 'bg-[#E6DEC8] text-[#5C5348]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate">
                        {info.city} {distName}
                      </span>
                      {isRepeatHotspot && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#E86F1A]/15 text-[#C9580C] text-[10px] font-bold shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          <span>반복 민원 주의</span>
                        </span>
                      )}
                    </div>
                    <span className="text-slate-500 font-mono-num text-[11px] shrink-0">
                      {info.count}건 ({mainCats})
                    </span>
                  </div>
                  <div className="w-full bg-[#F3EDE0] rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isRepeatHotspot
                          ? 'bg-gradient-to-r from-[#E86F1A] to-[#F59245]'
                          : 'bg-gradient-to-r from-[#2E2A26] to-[#574F47]'
                      }`}
                      style={{ width: `${Math.max(pct, 12)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Category Share Breakdown with SVG Donut Infographic */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2.5">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-[#E86F1A]" />
              <h3 className="font-bold text-slate-900 text-sm">
                분야별 민원 비중 인포그래픽
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono-num">
              {categoryCounts.length}개 분야
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F3EDE0" strokeWidth="14" />
                {(() => {
                  const palette = ['#E86F1A', '#2E2A26', '#C98A2C', '#5B7A5E', '#8C7A6B'];
                  const circumference = 2 * Math.PI * 38;
                  let offset = 0;
                  return categoryCounts.map(([catName, count], i) => {
                    const ratio = count / (totalCount || 1);
                    const dash = ratio * circumference;
                    const seg = (
                      <circle
                        key={catName}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke={palette[i % palette.length]}
                        strokeWidth="14"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += dash;
                    return seg;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-[#786D5F] font-semibold">총 누적</span>
                <span className="text-lg font-extrabold text-[#2E2A26] font-mono-num leading-none">
                  {totalCount}건
                </span>
              </div>
            </div>

            {/* Category Legend Bars */}
            <div className="flex-1 w-full space-y-2.5">
              {categoryCounts.map(([catName, count], i) => {
                const palette = ['bg-[#E86F1A]', 'bg-[#2E2A26]', 'bg-[#C98A2C]', 'bg-[#5B7A5E]', 'bg-[#8C7A6B]'];
                const pct = Math.round((count / (totalCount || 1)) * 100);
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2.5 h-2.5 rounded-xs ${palette[i % palette.length]}`} />
                        <span className="font-semibold text-slate-800">{catName}</span>
                      </div>
                      <span className="text-slate-500 font-mono-num text-[11px]">
                        {count}건 ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#F3EDE0] rounded-full h-2 overflow-hidden">
                      <div
                        className={`${palette[i % palette.length]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct, 10)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* B2G Time & Weather Correlation Report */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-[#E86F1A]" />
            <h3 className="font-bold text-slate-900 text-sm">
              B2G 시간대·기상 조건 상관관계 리포트
            </h3>
          </div>
          {repeatHotspotCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#E86F1A]/15 text-[#C9580C] text-[11px] font-bold">
              반복 발생 주의 구역 {repeatHotspotCount}곳 감지
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <div className="space-y-2.5">
            {timeStats.buckets.map((b) => {
              const pct = Math.round((b.count / (totalCount || 1)) * 100);
              return (
                <div key={b.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{b.label}</span>
                    <span className="font-mono-num text-[11px] text-slate-500">
                      {b.count}건 ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${b.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${b.count > 0 ? Math.max(pct, 8) : 0}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-[#FAF6EE] border border-[#E6DEC8] rounded-xl text-xs space-y-1.5 text-[#2E2A26]">
            <div className="font-bold text-[#C9580C] text-[11px]">
              기상·시간대 교차 분석 인사이트
            </div>
            <p className="text-[11px] leading-relaxed text-[#5C5348]">
              • 전체 악취·환경 민원 중 <strong className="text-[#2E2A26] font-mono-num">{timeStats.odorMorningNight}건</strong>이 대기가 정체되는 이른 아침(06~10시) 또는 야간(18시 이후) 시간대에 집중되었습니다.
            </p>
            <p className="text-[11px] leading-relaxed text-[#5C5348]">
              • 북서풍·저풍속 기상 조건과 겹치는 시간대에 서부권(대정읍·한림읍) 현장 포집 점검 및 원도심(일도1동·연동) 상업시간대 합동 순찰 배치가 권장됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Review Brief */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 border-b pb-2.5">
          <Sparkles className="w-4 h-4 text-[#2E2A26]" />
          <h3 className="font-bold text-slate-900 text-sm">
            제주 소상공인 생활민원 정책 검토 브리프
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 text-[11px]">
              1. 대정읍·한림읍 등 서부권 악취·환경 이슈
            </div>
            <p className="text-slate-600 text-[11px]">
              주거·숙박시설과 인접한 축산 배출시설 간의 풍향 영향 갈등이 반복됩니다. 악취관리지역 정기 실태조사와 기상(풍향·풍속) 연계 현장 포집 검사의 행정 정례화가 권장됩니다.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 text-[11px]">
              2. 일도1동·연동 등 원도심 상가 진입로 복합 민원
            </div>
            <p className="text-slate-600 text-[11px]">
              점심·저녁 상업시간대 황색실선 불법주차와 미규격 생활폐기물 방치가 동시에 일어나는 복합 민원이 집중됩니다. 교통행정과와 생활환경과의 유기적 합동 계도가 요구됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
