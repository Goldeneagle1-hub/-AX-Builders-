import React, { useEffect, useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Download,
  Printer,
  Save,
  CheckCircle,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { detectPII, maskPII } from '../../utils/pii';

export const Step4View: React.FC = () => {
  const {
    intakeResult,
    groundResult,
    draftResult,
    setDraftResult,
    editedDraft,
    setEditedDraft,
    setStep,
    city,
    district,
    occurredAt,
    gps,
    photoPreviewUrl,
    photoNotice,
    saveDraftToHistory,
    needsRegen,
    clearDirtyFlags,
  } = useCopilot();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sinmungoNotice, setSinmungoNotice] = useState(false);

  const piiMatches = useMemo(() => detectPII(editedDraft), [editedDraft]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchDraft = async (forceOverwrite = false) => {
    if (!intakeResult || !groundResult) return;

    if (
      forceOverwrite &&
      editedDraft &&
      draftResult?.draft &&
      editedDraft !== draftResult.draft
    ) {
      const ok = window.confirm(
        '직접 수정하신 민원서 본문이 있습니다. 최신 입력 내용으로 새로 덮어쓰시겠습니까?'
      );
      if (!ok) return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sixW: intakeResult.sixW,
          district,
          city,
          grounds: {
            weather: groundResult.weather,
            facilities: groundResult.facilities,
            ordinances: groundResult.ordinanceMatches,
          },
          routing: groundResult.routing,
          intakeRewrites: intakeResult.rewriteCandidates,
          customEdits: !forceOverwrite && editedDraft ? editedDraft : undefined,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setDraftResult(json.data);
        if (forceOverwrite || !editedDraft) {
          setEditedDraft(json.data.draft);
        }
        clearDirtyFlags();
      } else {
        throw new Error(json.error?.message || '초안 생성 실패');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '민원서 초안 생성 통신 오류');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!draftResult) {
      fetchDraft();
    }
  }, []);

  // Copy All to Clipboard
  const handleCopy = async () => {
    const textToCopy = editedDraft || draftResult?.draft || '';
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('민원서 내용 전체가 클립보드에 복사되었습니다.');
    } catch (e) {
      showToast('클립보드 복사 실패: 직접 선택하여 복사해주세요.');
    }
  };

  // Download .txt file
  const handleDownloadTxt = () => {
    const textToDownload = editedDraft || draftResult?.draft || '';
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `제주민원서_${city}_${district}_${dateStr}.txt`;

    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`${filename} 파일이 다운로드되었습니다.`);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Save to History & Stats
  const handleSaveToHistory = () => {
    if (piiMatches.length > 0) {
      const ok = window.confirm(
        `민원서 본문에 민감정보(${piiMatches.map((m) => m.type).join(', ')})가 포함되어 있습니다. 그대로 이력에 저장하시겠습니까?\n(취소 후 상단의 '민감정보 일괄 비식별화' 버튼을 누르시면 안전하게 가릴 수 있습니다.)`
      );
      if (!ok) return;
    }
    saveDraftToHistory();
    showToast('수정된 민원서가 이력과 동네별 통계에 즉시 저장되었습니다.');
  };

  // Mask PII
  const handleMaskPII = () => {
    const masked = maskPII(editedDraft);
    setEditedDraft(masked);
    showToast('전화번호·차량번호 등 민감정보가 비식별화되었습니다.');
  };

  // Sinmungo Integration (Copy + Open Official Portal + Guide)
  const handleSinmungoSubmit = async () => {
    const textToCopy = editedDraft || draftResult?.draft || '';
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      // Fallback ignored; still open portal and show notice
    }
    setSinmungoNotice(true);
    window.open('https://www.epeople.go.kr', '_blank', 'noopener,noreferrer');
    showToast('민원서 전문 복사 완료! 열린 국민신문고 창에 붙여넣기(Ctrl+V)하세요.');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E2A26]" />
        <p className="text-sm font-bold text-slate-800">
          행정 민원서 초안 및 표현 순화 검토안을 작성 중입니다...
        </p>
      </div>
    );
  }

  const guide = draftResult?.followUpGuide;
  const rewrites = draftResult?.rewrites || [];

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed top-20 right-4 z-50 bg-[#2E2A26] text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Regeneration Guard Banner */}
      {needsRegen.step4 && (
        <div className="no-print p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              앞 단계의 입력(위치·내용·근거)이 변경되었습니다. 최신 내용으로 초안을 다시 생성할 수 있습니다.
            </span>
          </div>
          <button
            type="button"
            onClick={() => fetchDraft(true)}
            className="min-h-[36px] px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>최신 입력으로 다시 생성</span>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="no-print p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => fetchDraft(false)}
            className="px-2.5 py-1 bg-red-600 text-white rounded text-[11px] cursor-pointer"
          >
            재시도
          </button>
        </div>
      )}

      {/* Sinmungo Paste Guide Banner */}
      {sinmungoNotice && (
        <div className="no-print p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <Send className="w-4 h-4 text-[#2E2A26]" />
            <span>국민신문고 접수 연동 안내</span>
          </div>
          <p className="leading-relaxed text-sky-800">
            작성하신 민원서 전문이 클립보드에 복사되었으며 국민신문고(epeople.go.kr) 새 창이 열렸습니다. 로그인 후 <strong>[민원신청]</strong> 화면의 신청내용 입력란에 붙여넣기(Ctrl+V)하시면 바로 접수하실 수 있습니다. (공식 제출 대행 아님)
          </p>
        </div>
      )}

      {/* PII Warning Banner */}
      {piiMatches.length > 0 && (
        <div className="no-print p-3 bg-amber-50/90 border border-amber-300 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              초안에 민감정보(
              <strong>{Array.from(new Set(piiMatches.map((m) => m.type))).join(', ')}</strong>{' '}
              {piiMatches.length}건)가 포함되어 있습니다. 저장·공유 전 비식별화를 권장합니다.
            </span>
          </div>
          <button
            type="button"
            onClick={handleMaskPII}
            className="min-h-[36px] px-3 py-1.5 bg-white border border-amber-400 hover:bg-amber-100 text-amber-900 rounded-lg font-bold cursor-pointer"
          >
            민감정보 일괄 비식별화
          </button>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-[#2E2A26]" />
          <span>민원서 초안 편집 및 활용</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>전체 복사</span>
          </button>

          {/* Download TXT */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.txt 다운로드</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>증빙 대지 인쇄</span>
          </button>

          {/* Save to History */}
          <button
            type="button"
            onClick={handleSaveToHistory}
            className="min-h-[44px] px-4 py-2 bg-[#E86F1A] hover:bg-[#D05E12] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>이력에 저장</span>
          </button>

          {/* Sinmungo Integration Button */}
          <button
            type="button"
            onClick={handleSinmungoSubmit}
            className="min-h-[44px] px-4 py-2 bg-[#2E2A26] hover:bg-[#1F1C18] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>국민신문고 연동 접수</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Editable Draft Editor Container (Screen: textarea, Print: formatted evidence sheet) */}
      <div className="print-container bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="no-print flex items-center justify-between text-xs text-slate-500 pb-2 border-b">
          <span>
            직접 수정 가능한 행정 민원 서식입니다. 오탈자나 추가 증빙 내용을 자유롭게 편집하세요.
          </span>
          <span className="font-mono-num text-[11px]">
            {editedDraft.length} 자
          </span>
        </div>

        {/* Screen Editor */}
        <textarea
          rows={20}
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          className="print:hidden w-full text-base sm:text-xs font-mono leading-relaxed p-4 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2E2A26] focus:outline-none"
        />

        {/* Print-Only Official Document & Evidence Photo Sheet */}
        <div className="hidden print:block space-y-5 text-black">
          <div className="border-b-2 border-black pb-3">
            <h1 className="text-xl font-bold tracking-tight">
              제주특별자치도 행정 민원 신청서 및 현장 증빙 대지
            </h1>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <strong>관할 지역:</strong> 제주특별자치도 {city} {district}
              </div>
              <div>
                <strong>발생 일시:</strong> {occurredAt || '미상'}
              </div>
              <div>
                <strong>위치 좌표(GPS):</strong>{' '}
                {gps ? `${gps.lat}, ${gps.lng}` : '미입력'}
              </div>
              <div>
                <strong>출력 일시:</strong> {new Date().toLocaleString('ko-KR')}
              </div>
            </div>
          </div>

          <div className="whitespace-pre-wrap text-xs leading-relaxed font-sans">
            {editedDraft}
          </div>

          {photoPreviewUrl && (
            <div className="pt-4 border-t border-slate-300 break-inside-avoid space-y-2">
              <h2 className="text-sm font-bold">[별첨] 현장 확인 참고 사진</h2>
              <div className="border border-slate-400 p-2 rounded">
                <img
                  src={photoPreviewUrl}
                  alt="현장 증빙 사진"
                  className="max-h-72 mx-auto object-contain"
                />
                <p className="text-[11px] text-slate-700 mt-2 text-center">
                  {photoNotice || '민원인 첨부 현장 사진'} | 일시: {occurredAt} |{' '}
                  {gps ? `GPS: ${gps.lat}, ${gps.lng}` : '좌표 미입력'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Polite Rewrites Table */}
      {rewrites.length > 0 && (
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b pb-2.5">
            <Sparkles className="w-4 h-4 text-[#E86F1A]" />
            <h3 className="font-bold text-slate-900 text-sm">
              표현 순화 및 행정 어조 대조표
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            불필요한 비난과 단정적 어조는 순화하되, 피해 사실과 행정 조치 요청 목적은 명확히 유지합니다.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2.5 font-bold w-1/3">원문 (작성 진술)</th>
                  <th className="p-2.5 font-bold w-1/3">순화 표현 (권장)</th>
                  <th className="p-2.5 font-bold w-1/3">순화 이유 및 근거</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rewrites.map((rw, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 text-red-700 bg-red-50/30">
                      "{rw.original}"
                    </td>
                    <td className="p-2.5 font-semibold text-slate-900 bg-emerald-50/30">
                      "{rw.refined}"
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">
                      {rw.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Follow-up Response Guide */}
      {guide && (
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b pb-2.5">
            <ShieldAlert className="w-4 h-4 text-[#2E2A26]" />
            <h3 className="font-bold text-slate-900 text-sm">
              접수 후속 대응 가이드 및 답변 기한
            </h3>
          </div>

          {/* Response Deadlines */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800 block text-[11px]">
              법정 민원 처리 기한 기준:
            </span>
            <p className="text-slate-700 leading-relaxed">{guide.responseDeadlines}</p>
          </div>

          {/* Supplementary Evidence Tips (when simple caution occurs) */}
          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs space-y-2">
            <span className="font-bold text-amber-950 block text-[11px]">
              💡 행정기관이 '단순 계도'에 그쳤을 때 보완할 증빙 팁 3가지:
            </span>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              {guide.evidenceTips.map((tip, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-[#E86F1A] font-bold shrink-0">{i + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-slate-100 rounded-lg text-[11px] text-slate-600 leading-relaxed">
            {guide.officialDisclaimer}
          </div>

          {/* Official Channel Links */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-800">
              최종 민원서 접수 바로가기:
            </span>
            <div className="flex flex-wrap gap-2">
              {guide.channels.map((ch, i) => (
                <a
                  key={i}
                  href={ch.url}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] px-4 py-2 bg-[#2E2A26] hover:bg-[#1F1C18] text-white rounded-lg font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <span>{ch.name} 공식 접수</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Return Button */}
      <div className="no-print flex items-center justify-start pt-2">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>STEP 3으로 돌아가기</span>
        </button>
      </div>
    </div>
  );
};
