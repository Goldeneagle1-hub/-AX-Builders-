import React, { useState, useRef } from 'react';
import {
  Clock,
  Search,
  Copy,
  Trash2,
  Eye,
  CheckCircle,
  X,
  MapPin,
  Calendar,
  Download,
  Upload,
} from 'lucide-react';
import { useCopilot } from '../context/CopilotContext';
import { SavedComplaint } from '@shared/types';

export const HistoryPage: React.FC = () => {
  const { savedComplaints, deleteSavedComplaint, importComplaints } = useCopilot();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<SavedComplaint | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filtered = savedComplaints.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.draftContent.toLowerCase().includes(q)
    );
  });

  const handleCopyDraft = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('민원서 전문이 클립보드에 복사되었습니다.');
    } catch (e) {
      showToast('클립보드 복사 실패');
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`'${title}' 민원 서식을 삭제하시겠습니까? (삭제 시 통계에서도 즉시 제외됩니다)`)) {
      deleteSavedComplaint(id);
      showToast('민원 서식이 삭제되었습니다.');
      if (selectedComplaint?.id === id) {
        setSelectedComplaint(null);
      }
    }
  };

  const handleExportJson = () => {
    const userOnly = savedComplaints.filter((c) => c.source === 'user');
    const targetData = userOnly.length > 0 ? userOnly : savedComplaints;
    const blob = new Blob([JSON.stringify(targetData, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.href = url;
    link.download = `제주민원이력_백업_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`민원 이력 ${targetData.length}건이 JSON 파일로 백업되었습니다.`);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '[]'));
        if (!Array.isArray(parsed)) {
          throw new Error('올바른 민원 이력 백업 파일 형식이 아닙니다.');
        }
        const added = importComplaints(parsed);
        showToast(
          added > 0
            ? `백업 파일에서 새로운 민원 ${added}건을 복원했습니다.`
            : '새로 추가할 민원 항목이 없습니다 (이미 존재하는 이력).'
        );
      } catch (err: any) {
        showToast(err.message || '백업 파일 복원에 실패했습니다.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#2E2A26] text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header, Backup/Restore & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#2E2A26]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                민원 작성 및 보관 이력 ({filtered.length}건)
              </h3>
              <p className="text-[11px] text-slate-500">
                시연 예시 및 브라우저에 저장된 내 민원 서식 보관함
              </p>
            </div>
          </div>

          {/* JSON Backup & Restore Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="min-h-[40px] px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#2E2A26] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>이력 백업 (.json)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[40px] px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#2E2A26] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>백업 복원</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportJson}
              className="hidden"
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 읍·면·동, 키워드 검색..."
            className="w-full min-h-[44px] text-base sm:text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2E2A26] focus:outline-none"
          />
        </div>
      </div>

      {/* Complaint Cards List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-[#2E2A26]/30 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.source === 'user'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.source === 'user' ? '내 작성 건' : '시연 데이터'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E86F1A]/10 text-[#E86F1A]">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(item)}
                    className="min-h-[44px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>전문 보기</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyDraft(item.draftContent)}
                    className="min-h-[44px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    title="전문 복사"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">복사</span>
                  </button>

                  {item.source === 'user' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="min-h-[44px] px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                      title="내 작성 건 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">삭제</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Meta information row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    제주특별자치도 {item.city} {item.district}
                  </span>
                </div>
                <div className="flex items-center space-x-1 font-mono-num">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>발생: {item.occurredAt}</span>
                </div>
                <div className="flex items-center space-x-1 font-mono-num text-[11px] text-slate-400">
                  <span>저장일시: {item.savedAt.slice(0, 16).replace('T', ' ')}</span>
                </div>
              </div>

              {/* Summary line */}
              <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {item.summary || item.draftContent.slice(0, 120)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">검색된 민원 이력이 없습니다.</p>
          <p>새 민원 작성 화면에서 초안을 완성한 뒤 [이력에 저장]을 눌러보세요.</p>
        </div>
      )}

      {/* Full Draft Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedComplaint.title}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedComplaint.city} {selectedComplaint.district} (
                  {selectedComplaint.occurredAt})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50/60">
              {selectedComplaint.draftContent}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-white">
              <span className="text-[11px] text-slate-400">
                출처: {selectedComplaint.source === 'user' ? '사용자 직접 저장본' : '시연 예시 데이터'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleCopyDraft(selectedComplaint.draftContent)}
                  className="min-h-[44px] px-4 py-2 bg-[#2E2A26] hover:bg-[#1F1C18] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>전체 복사</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
