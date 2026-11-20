import React, { useEffect, useState } from 'react';
import {
  CloudSun,
  Building2,
  Scale,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';

export const Step2View: React.FC = () => {
  const {
    city,
    district,
    gps,
    citedOrdinanceIds,
    intakeResult,
    groundResult,
    setGroundResult,
    setStep,
    needsRegen,
    clearDirtyFlags,
  } = useCopilot();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchGrounding = async () => {
    if (!intakeResult) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ground-and-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sixW: intakeResult.sixW,
          district,
          city,
          gps: gps || undefined,
          citedOrdinanceIds,
          category: undefined,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setGroundResult(json.data);
        clearDirtyFlags();
      } else {
        throw new Error(json.error?.message || '근거 데이터 조회 실패');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '기상·시설·조례 데이터 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!groundResult || needsRegen.step2) {
      fetchGrounding();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E2A26]" />
        <p className="text-sm font-bold text-slate-800">
          Open-Meteo 기상, 제주 공공시설 공간정보, 자치법규 매칭 중...
        </p>
        <p className="text-xs text-slate-500">
          실시간 기상 API 및 자치법규정보시스템(ELIS) 카탈로그와 대조 중입니다.
        </p>
      </div>
    );
  }

  const weather = groundResult?.weather;
  const facilities = groundResult?.facilities || [];
  const ordinances = groundResult?.ordinanceMatches || [];

  return (
    <div className="space-y-5">
      {/* Dirty Warning Banner if inputs changed */}
      {needsRegen.step2 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>이전 단계의 위치·내용이 변경되었습니다. 최신 근거를 다시 조회하세요.</span>
          </div>
          <button
            type="button"
            onClick={fetchGrounding}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold cursor-pointer"
          >
            다시 조회
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={fetchGrounding}
            className="px-2.5 py-1 bg-red-600 text-white rounded text-[11px]"
          >
            재시도
          </button>
        </div>
      )}

      {/* 1. Open-Meteo Weather Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2.5">
          <div className="flex items-center space-x-2">
            <CloudSun className="w-5 h-5 text-[#2E2A26]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                기상 데이터 연동 (Open-Meteo)
              </h3>
              <p className="text-[11px] text-slate-500">
                악취 확산 경로 및 야간 노면·시야 상황 파악을 위한 참고 기상
              </p>
            </div>
          </div>
          {weather && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                weather.status === 'verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : weather.status === 'demo'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {weather.status === 'verified'
                ? '실시간 연동'
                : weather.status === 'demo'
                ? '시연 모델값'
                : '조회 불가'}
            </span>
          )}
        </div>

        {weather && weather.status !== 'unavailable' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs text-center">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">기온</span>
                <span className="font-bold text-slate-900 text-sm font-mono-num">
                  {weather.temperature}°C
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">상대습도</span>
                <span className="font-bold text-slate-900 text-sm font-mono-num">
                  {weather.humidity}%
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">풍속</span>
                <span className="font-bold text-slate-900 text-sm font-mono-num">
                  {weather.windSpeed} km/h
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">풍향</span>
                <span className="font-bold text-slate-900 text-sm font-mono-num">
                  {weather.windDirection}°
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-500 block">날씨 상태</span>
                <span className="font-bold text-slate-900 text-sm">
                  {weather.weatherDescription}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50/70 p-2.5 rounded border border-slate-200/60 space-y-0.5">
              <div>
                <span className="font-semibold text-slate-700">적용 위치:</span>{' '}
                {weather.locationName}
              </div>
              <div className="flex flex-wrap gap-x-4">
                <span>
                  <span className="font-semibold text-slate-700">기준 시각:</span>{' '}
                  <span className="font-mono-num">{weather.baseTime}</span>
                </span>
                <span>
                  <span className="font-semibold text-slate-700">조회 시각:</span>{' '}
                  <span className="font-mono-num">{weather.queriedAt.slice(0, 19).replace('T', ' ')}</span>
                </span>
                <span>
                  <span className="font-semibold text-slate-700">출처:</span> {weather.source}
                </span>
              </div>
              <div className="text-slate-400 italic mt-1">
                * 발생 당시 현장 정밀 관측값이 아닌 조회 시점의 기상 수치 예보 모델 기반 참고 데이터입니다.
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 text-slate-500 text-xs text-center rounded-lg">
            기상 데이터를 조회할 수 없습니다. (좌표 미지정 또는 네트워크 제한)
          </div>
        )}
      </div>

      {/* 2. Public Facilities Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2.5">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#2E2A26]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                주변 공공시설 및 지리정보 매칭
              </h3>
              <p className="text-[11px] text-slate-500">
                단속 CCTV, 보호구역, 클린하우스, 상권 특성 공공데이터포털 연계
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono-num">
            {facilities.length}개소 매칭
          </span>
        </div>

        {facilities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E2A26]/10 text-[#2E2A26]">
                    {fac.category}
                  </span>
                  <span className="font-mono-num text-[11px] text-slate-500 font-semibold">
                    약 {fac.distanceMeter}m (반경 {fac.radiusMeter}m)
                  </span>
                </div>
                <div className="font-bold text-slate-900">{fac.name}</div>
                <div className="text-slate-600 text-[11px]">{fac.address}</div>
                {fac.details && (
                  <div className="text-[11px] text-slate-500 bg-white p-1.5 rounded border border-slate-100">
                    {fac.details}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-200/50">
                  <span>출처: {fac.source}</span>
                  <span className="font-mono-num">갱신: {fac.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 text-slate-500 text-xs text-center rounded-lg">
            해당 읍·면·동 반경 내 등록된 공공데이터 시설 검색 결과가 0건입니다.
          </div>
        )}
      </div>

      {/* 3. Jeju Ordinances Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2.5">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-[#2E2A26]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                제주특별자치도 자치법규 근거 (최대 3건 검증)
              </h3>
              <p className="text-[11px] text-slate-500">
                자치법규정보시스템(ELIS) 및 제주도 공포 현행 조례 연계
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono-num">
            {ordinances.length}건 선정
          </span>
        </div>

        {ordinances.length > 0 ? (
          <div className="space-y-3">
            {ordinances.map((item) => {
              const ord = item.ordinance;
              return (
                <div
                  key={ord.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 hover:border-[#2E2A26]/40 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E86F1A]/10 text-[#E86F1A]">
                        {ord.topic}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {ord.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.isDirectlyCited && (
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                          직접 인용
                        </span>
                      )}
                      <a
                        href={ord.elisUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-slate-500 hover:text-[#2E2A26] flex items-center space-x-1"
                      >
                        <span>ELIS 전문</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="font-semibold text-slate-800 text-xs">
                    {ord.article}
                  </div>

                  <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60">
                    {ord.contentSummary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <div className="flex items-center space-x-1 text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>선정 사유: {item.relevanceReason}</span>
                    </div>
                    <span className="font-mono-num">시행일자: {ord.effectiveDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 text-slate-500 text-xs text-center rounded-lg">
            매칭된 자치법규 근거가 부족합니다. 조례 검색 메뉴에서 직접 인용할 수 있습니다.
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>STEP 1으로 돌아가기</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(3)}
          className="min-h-[44px] px-6 py-2.5 bg-[#2E2A26] hover:bg-[#1F1C18] text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
        >
          <span>STEP 3: 관할 부서 및 접수 채널 추천으로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
