import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Search,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Tag,
  Building,
  Table as TableIcon,
  Sparkles,
} from 'lucide-react';
import { useCopilot } from '../context/CopilotContext';
import {
  JEJU_ORDINANCE_CATALOG,
  TOP_RECOMMENDED_KEYWORDS,
} from '@shared/ordinances';
import { JURISDICTION_RULES, OFFICIAL_CHANNELS } from '@shared/jurisdictions';

export const OrdinancesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    citedOrdinanceIds,
    addCitedOrdinance,
    setStep1Tab,
    setStep,
  } = useCopilot();

  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('전체');
  const [activeTab, setActiveTab] = useState<'catalog' | 'mapping'>('catalog');

  // Distinct topics list (16 topics)
  const topicList = useMemo(() => {
    const set = new Set(JEJU_ORDINANCE_CATALOG.map((o) => o.topic));
    return ['전체', ...Array.from(set)];
  }, []);

  // Filtered catalog
  const filteredOrdinances = useMemo(() => {
    return JEJU_ORDINANCE_CATALOG.filter((ord) => {
      if (topicFilter !== '전체' && ord.topic !== topicFilter) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inTitle = ord.title.toLowerCase().includes(q);
      const inArticle = ord.article.toLowerCase().includes(q);
      const inSummary = ord.contentSummary.toLowerCase().includes(q);
      const inKeywords = ord.keywords.some((k) => k.toLowerCase().includes(q));

      return inTitle || inArticle || inSummary || inKeywords;
    });
  }, [searchQuery, topicFilter]);

  const handleCiteAndNavigate = (id: string) => {
    addCitedOrdinance(id);
    setStep(1);
    setStep1Tab('direct');
    navigate('/');
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-[#2E2A26]" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              제주특별자치도 자치법규·조례 카탈로그 (16대 생활분야)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            자치법규정보시스템(ELIS) 기반 검증 조례 및 제주도 3계층 행정 분장 매핑표
          </p>
        </div>

        {/* View Switcher: Catalog vs Jurisdiction Table */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-white text-[#2E2A26] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            조례 검색 ({filteredOrdinances.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mapping')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'mapping'
                ? 'bg-white text-[#2E2A26] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            관할 매핑표
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Recommended Search Keyword Chips */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-[#E86F1A]" />
              <span>추천 검색 키워드 10종:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TOP_RECOMMENDED_KEYWORDS.map((kw, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSearchQuery(kw)}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-white border border-slate-200 hover:border-[#2E2A26] text-slate-700 hover:text-[#2E2A26] transition-colors cursor-pointer"
                >
                  #{kw}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar & Topic Filter */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="조례명, 조항, 요약, 키워드 다중 검색..."
                className="w-full min-h-[44px] text-base sm:text-xs pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2E2A26] focus:outline-none"
              />
            </div>

            {/* Topic Filter */}
            <div className="w-full sm:w-auto">
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="w-full sm:w-48 min-h-[44px] text-base sm:text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2E2A26] focus:outline-none"
              >
                {topicList.map((t) => (
                  <option key={t} value={t}>
                    주제: {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ordinance Cards List */}
          {filteredOrdinances.length > 0 ? (
            <div className="space-y-3">
              {filteredOrdinances.map((ord) => {
                const isCited = citedOrdinanceIds.includes(ord.id);
                return (
                  <div
                    key={ord.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-[#2E2A26]/30 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E86F1A]/10 text-[#E86F1A]">
                            {ord.topic}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono-num">
                            시행: {ord.effectiveDate}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {ord.title}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a
                          href={ord.elisUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[44px] px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                          title="자치법규정보시스템 원문"
                        >
                          <span>ELIS 법령전문</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {isCited ? (
                          <span className="min-h-[44px] px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>인용 완료됨</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCiteAndNavigate(ord.id)}
                            className="min-h-[44px] px-4 py-2 rounded-lg bg-[#2E2A26] hover:bg-[#1F1C18] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>민원 작성에 인용하기</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Article & Content Summary */}
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-800 text-xs">
                        {ord.article}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {ord.contentSummary}
                      </p>
                    </div>

                    {/* Keywords */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {ord.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              일치하는 조례 조항이 없습니다. 검색어를 변경하거나 필터를 초기화해주세요.
            </div>
          )}
        </>
      ) : (
        /* Jurisdiction Mapping Reference Table (Mobile: Cards / Desktop: Table) */
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b pb-2.5">
            <Building className="w-4 h-4 text-[#2E2A26]" />
            <h3 className="font-bold text-slate-900 text-sm">
              제주특별자치도 생활민원 분야별 3계층 관할 안내표
            </h3>
          </div>

          <div className="space-y-3">
            {JURISDICTION_RULES.map((rule) => {
              const sample = rule.departmentTemplate('제주시');
              return (
                <div
                  key={rule.category}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {rule.category}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      실무팀: <strong className="text-slate-800">{sample.practicalTeam}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 block">도 본청</span>
                      <span className="text-[11px] text-slate-800 font-medium">
                        {sample.hierarchy.province}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-[#2E2A26] block">행정시 (1차)</span>
                      <span className="text-[11px] text-slate-900 font-bold">
                        {sample.primaryDepartment}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 block">주민센터</span>
                      <span className="text-[11px] text-slate-800">
                        {sample.hierarchy.community('관할')}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100">
                    <strong>판단 근거:</strong> {sample.jurisdictionReason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
