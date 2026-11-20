import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Camera,
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
  HelpCircle,
  Scale,
  CheckCircle,
} from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { JEJU_DISTRICTS } from '@shared/jurisdictions';
import { JEJU_ORDINANCE_CATALOG } from '@shared/ordinances';
import { JejuCity, OrdinanceItem } from '@shared/types';
import { AudioRecorder } from './AudioRecorder';

export const DirectInput: React.FC = () => {
  const {
    city,
    setCity,
    district,
    setDistrict,
    occurredAt,
    setOccurredAt,
    text,
    setText,
    gps,
    setGps,
    photoPreviewUrl,
    setPhotoPreviewUrl,
    photoBase64,
    setPhotoBase64,
    setPhotoMimeType,
    photoNotice,
    setPhotoNotice,
    citedOrdinanceIds,
    removeCitedOrdinance,
    followUpAnswers,
    setFollowUpAnswer,
    intakeResult,
    setIntakeResult,
    setStep,
    markInputsDirty,
  } = useCopilot();

  const [isLoadingIntake, setIsLoadingIntake] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(true);

  // Available districts for chosen city
  const districtList = JEJU_DISTRICTS[city] || [];

  // GPS Request Handler
  const handleRequestGps = () => {
    setGpsMessage(null);
    if (!navigator.geolocation) {
      setGpsMessage('이 브라우저는 Geolocation을 지원하지 않습니다. 수동 입력을 이용해주세요.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        setGps({ lat, lng });

        // Boundary check for Jeju Island (approx lat 33.1~33.6, lng 126.1~126.98)
        if (lat >= 33.1 && lat <= 33.6 && lng >= 126.1 && lng <= 127.0) {
          // Mt Hallasan divide approx lat 33.36
          if (lat < 33.36) {
            setCity('서귀포시');
            setGpsMessage(`서귀포시 권역 좌표 확인 (${lat}, ${lng}) - 행정시를 서귀포시로 추천 설정했습니다.`);
          } else {
            setCity('제주시');
            setGpsMessage(`제주시 권역 좌표 확인 (${lat}, ${lng}) - 행정시를 제주시로 추천 설정했습니다.`);
          }
        } else {
          setGpsMessage(`좌표 (${lat}, ${lng}) 확인됨. 제주도 관할 경계 외 좌표이므로 수동 선택을 유지합니다.`);
        }
        markInputsDirty();
      },
      (err) => {
        setGpsLoading(false);
        setGpsMessage(
          err.code === 1
            ? '위치 권한이 거부되었습니다. 아래에서 위·경도를 직접 입력하시거나 행정시/읍·면·동을 선택해주세요.'
            : '위치 확인에 실패했습니다. 수동 입력을 이용해주세요.'
        );
      },
      { timeout: 7000 }
    );
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('사진 크기는 5MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreviewUrl(result);
      setPhotoBase64(result.split(',')[1]);
      setPhotoMimeType(file.type || 'image/jpeg');
      setPhotoNotice('현장 사진이 등록되었습니다. 임시 메모리에만 보관됩니다.');
      markInputsDirty();
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreviewUrl(null);
    setPhotoBase64(null);
    setPhotoMimeType(null);
    setPhotoNotice(null);
    markInputsDirty();
  };

  // Run Step 1 Structuring
  const handleRunIntake = async () => {
    if (!text.trim() || text.trim().length < 2) {
      setErrorMessage('민원 내용을 최소 2글자 이상 입력해주세요.');
      return;
    }

    setIsLoadingIntake(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          city,
          district,
          occurredAt,
          photoBase64: consentChecked && photoBase64 ? photoBase64 : undefined,
          photoMimeType: photoBase64 ? 'image/jpeg' : undefined,
          followUpAnswers,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setIntakeResult(json.data);
      } else {
        throw new Error(json.error?.message || '구조화 분석에 실패했습니다.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '민원 분석 처리 중 통신 오류가 발생했습니다.');
    } finally {
      setIsLoadingIntake(false);
    }
  };

  // Cited ordinances list
  const citedOrdinances = JEJU_ORDINANCE_CATALOG.filter((ord: OrdinanceItem) =>
    citedOrdinanceIds.includes(ord.id)
  );

  return (
    <div className="space-y-5">
      {/* 1. Location & Occurrence Time */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#2E2A26]" />
          <span>발생 위치 및 일시</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              행정시
            </label>
            <select
              value={city}
              onChange={(e) => {
                const nextCity = e.target.value as JejuCity;
                setCity(nextCity);
                setDistrict(JEJU_DISTRICTS[nextCity][0]);
                markInputsDirty();
              }}
              className="w-full min-h-[44px] text-base sm:text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E2A26] focus:outline-none"
            >
              <option value="제주시">제주시</option>
              <option value="서귀포시">서귀포시</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              읍·면·동
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                markInputsDirty();
              }}
              className="w-full min-h-[44px] text-base sm:text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E2A26] focus:outline-none"
            >
              {districtList.map((d: string) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Occurred At */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              발생 일시 (한국 표준시)
            </label>
            <input
              type="datetime-local"
              value={occurredAt}
              onChange={(e) => {
                setOccurredAt(e.target.value);
                markInputsDirty();
              }}
              className="w-full min-h-[44px] text-base sm:text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E2A26] focus:outline-none font-mono-num"
            />
          </div>
        </div>

        {/* GPS Location Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={gpsLoading}
              onClick={handleRequestGps}
              className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2E2A26]" />
              <span>{gpsLoading ? '위치 수신 중...' : '현재 위치(GPS) 가져오기'}</span>
            </button>

            {gps && (
              <span className="font-mono-num text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                위도: {gps.lat}, 경도: {gps.lng}
              </span>
            )}
          </div>

          {/* Manual Coords Input */}
          <div className="flex items-center space-x-1 text-[11px] text-slate-500">
            <span>수동 좌표:</span>
            <input
              type="number"
              step="0.0001"
              placeholder="위도 (33.xx)"
              value={gps?.lat || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setGps({ lat: val || 0, lng: gps?.lng || 126.5 });
                markInputsDirty();
              }}
              className="w-20 px-1.5 py-1 border border-slate-200 rounded font-mono-num text-[11px]"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="경도 (126.xx)"
              value={gps?.lng || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setGps({ lat: gps?.lat || 33.3, lng: val || 0 });
                markInputsDirty();
              }}
              className="w-20 px-1.5 py-1 border border-slate-200 rounded font-mono-num text-[11px]"
            />
          </div>
        </div>

        {gpsMessage && (
          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            {gpsMessage}
          </div>
        )}
      </div>

      {/* 2. Audio Voice Recorder (Multimodal) */}
      <AudioRecorder
        onTranscribeComplete={(transcriptText) => {
          setText(text ? `${text}\n${transcriptText}` : transcriptText);
          markInputsDirty();
        }}
      />

      {/* 3. Colloquial Complaint Text Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-[#2E2A26]" />
            <span>민원 본문 입력 (구어체로 편안하게 작성)</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono-num">
            {text.length}자 입력됨
          </span>
        </div>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            markInputsDirty();
          }}
          placeholder="예: 매일 아침 양돈 축사 쪽에서 악취가 넘어와 숙박 손님들이 환불을 요구하고 있습니다. 제주시청에서 나와서 악취 배출 기준 점검하고 단속해주세요."
          className="w-full text-base sm:text-xs p-3.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E2A26] focus:outline-none leading-relaxed"
        />
      </div>

      {/* 4. Photo Evidence (Multimodal) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <Camera className="w-4 h-4 text-[#2E2A26]" />
            <span>현장 입증 사진 (선택 사항)</span>
          </label>
          <span className="text-[11px] text-slate-500">최대 5MB, JPG·PNG·SVG</span>
        </div>

        {!photoPreviewUrl ? (
          <div>
            <label className="border-2 border-dashed border-slate-300 hover:border-[#2E2A26] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-slate-50/50 hover:bg-slate-50">
              <Camera className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">
                사진 선택 또는 카메라 촬영
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                현장 도로 상황, 간판, 적치물 등 시각적 사실 파악용
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center space-x-3">
              <img
                src={photoPreviewUrl}
                alt="현장 사진 미리보기"
                className="w-24 h-20 object-cover rounded border border-slate-200 shrink-0 bg-white"
              />
              <div className="flex-1 min-w-0 text-xs">
                <p className="font-semibold text-slate-800">현장 이미지 첨부됨</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {photoNotice || '브라우저 메모리 임시 보관 중'}
                </p>
                <label className="mt-1.5 flex items-center space-x-1.5 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="rounded text-[#2E2A26]"
                  />
                  <span>AI 분석을 위해 이미지 전송에 동의합니다.</span>
                </label>
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="사진 제거"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Ordinance Citations Banner (if any) */}
      {citedOrdinances.length > 0 && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-sky-900">
              <Scale className="w-4 h-4 text-[#2E2A26]" />
              <span>직접 인용한 제주 자치법규 ({citedOrdinances.length}건)</span>
            </div>
            <NavLink
              to="/ordinances"
              className="text-[11px] text-sky-700 hover:underline font-medium"
            >
              + 조례 추가 검색
            </NavLink>
          </div>

          <div className="space-y-1.5">
            {citedOrdinances.map((ord: OrdinanceItem) => (
              <div
                key={ord.id}
                className="bg-white border border-sky-100 p-2.5 rounded-lg flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">{ord.title}</div>
                  <div className="text-[11px] text-slate-500">{ord.article}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCitedOrdinance(ord.id)}
                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  title="인용 취소"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. AI Intake Analysis Button */}
      {errorMessage && (
        <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        disabled={isLoadingIntake}
        onClick={handleRunIntake}
        className="w-full min-h-[48px] py-3 px-5 bg-[#2E2A26] hover:bg-[#1F1C18] disabled:bg-slate-300 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
      >
        {isLoadingIntake ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5 text-amber-300" />
        )}
        <span>
          {isLoadingIntake
            ? '상황 분석 및 육하원칙 구조화 중...'
            : 'AI 육하원칙 구조화 및 누락 확인 실행'}
        </span>
      </button>

      {/* 7. Structuring Results Section */}
      {intakeResult && (
        <div className="bg-white border-2 border-[#2E2A26]/30 rounded-xl p-5 space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                STEP 1 구조화 결과 및 육하원칙 진단
              </h4>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
              분석 완료
            </span>
          </div>

          {/* 6W Infographic Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {[
              { tag: '01 WHO', label: '누가 (신청인/피해자)', val: intakeResult.sixW.who },
              { tag: '02 WHEN', label: '언제 (발생일시)', val: intakeResult.sixW.when },
              { tag: '03 WHERE', label: '어디서 (발생위치)', val: intakeResult.sixW.where },
              { tag: '04 WHAT', label: '무엇을 (피해현황)', val: intakeResult.sixW.what },
              { tag: '05 HOW', label: '어떻게 (발생경위)', val: intakeResult.sixW.how },
              { tag: '06 WHY', label: '왜 (원인 및 배경)', val: intakeResult.sixW.why },
            ].map((item) => (
              <div
                key={item.tag}
                className="p-3 rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#F8FAFC] border border-[#E2E8F0] shadow-[0_2px_8px_-2px_rgba(46,42,38,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-num text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E86F1A]/15 text-[#C9580C]">
                    {item.tag}
                  </span>
                  <span className="font-bold text-[#2E2A26] text-[11px]">{item.label}</span>
                </div>
                <p className="text-[#334155] text-xs leading-relaxed pt-0.5">{item.val}</p>
              </div>
            ))}
          </div>

          {/* Photo Observations */}
          {intakeResult.photoObservations && intakeResult.photoObservations.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                <span>현장 사진 육안 관찰 사실 (객관적 물리 사실만 기술)</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                {intakeResult.photoObservations.map((obs, i) => (
                  <li key={i}>{obs}</li>
                ))}
              </ul>
              <p className="text-[10px] text-slate-400 italic">
                * 사진만으로 악취 존재, 위법성, 특정인의 고의를 단정하지 않으며, 현장 공무원의 실사 조사를 요청하는 기초 자료로 활용됩니다.
              </p>
            </div>
          )}

          {/* Rewrite Candidates Preview */}
          {intakeResult.rewriteCandidates && intakeResult.rewriteCandidates.length > 0 && (
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs space-y-2">
              <div className="font-bold text-amber-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E86F1A]" />
                <span>표현 순화 제안 (감정적 문장 개선 후보)</span>
              </div>
              {intakeResult.rewriteCandidates.map((rw, i) => (
                <div key={i} className="text-[11px] bg-white p-2 rounded border border-amber-100 space-y-1">
                  <div className="text-red-700 line-through">원문: "{rw.original}"</div>
                  <div className="text-slate-800 font-semibold">순화: "{rw.refined}"</div>
                  <div className="text-slate-500 text-[10px]">이유: {rw.reason}</div>
                </div>
              ))}
            </div>
          )}

          {/* Follow-up Questions */}
          {intakeResult.followUpQuestions && intakeResult.followUpQuestions.length > 0 && (
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs space-y-3">
              <div className="font-bold text-blue-900 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#2E2A26]" />
                <span>행정 처리를 돕는 보완 질문 (입력 시 다음 단계에 반영)</span>
              </div>
              {intakeResult.followUpQuestions.map((q) => (
                <div key={q.id} className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-800">
                    {q.question}
                  </label>
                  <input
                    type="text"
                    placeholder={q.placeholder || '추가 정보를 입력해주세요...'}
                    value={followUpAnswers[q.id] || ''}
                    onChange={(e) => setFollowUpAnswer(q.id, e.target.value)}
                    className="w-full text-base sm:text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#2E2A26] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Advance to Step 2 Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="min-h-[44px] px-6 py-2.5 bg-[#E86F1A] hover:bg-[#D05E12] text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>STEP 2: 기상·시설·자치법규 근거 매칭으로 이동</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
