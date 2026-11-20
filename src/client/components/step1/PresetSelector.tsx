import React from 'react';
import { Sparkles, MapPin, Wind, AlertTriangle, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { DEMO_PRESET_1, DEMO_PRESET_2 } from '@shared/presets';

export const PresetSelector: React.FC = () => {
  const { loadPreset } = useCopilot();

  return (
    <div className="space-y-4">
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
        <p className="font-semibold text-slate-800 mb-1">
          💡 외부 API 키 없이도 4단계 전체 동작을 즉시 검증할 수 있는 공식 시연 프리셋입니다.
        </p>
        <p>
          선택 시 텍스트, 시연용 사진 예시, 정밀 GPS 좌표가 채워지며, 조례 매핑·관할 분리·민원서 생성까지 원클릭으로 이어집니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preset 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-[#2E2A26] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                {DEMO_PRESET_1.badge}
              </span>
              <span className="text-[11px] font-mono-num text-slate-400">
                GPS 33.2264, 126.2512
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-[#2E2A26]" />
              <span>{DEMO_PRESET_1.title}</span>
            </h3>

            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>제주특별자치도 서귀포시 대정읍 하모리 일대</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              "{DEMO_PRESET_1.text}"
            </p>

            {/* Photo preview indicator */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-100/60 p-2 rounded">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{DEMO_PRESET_1.photoDescription}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadPreset('preset-daejeong-odor')}
            className="mt-4 w-full min-h-[44px] py-2.5 px-4 bg-[#2E2A26] hover:bg-[#1F1C18] text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <span>시연 ① 불러오기 및 직접 입력 전환</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Preset 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-[#E86F1A] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                {DEMO_PRESET_2.badge}
              </span>
              <span className="text-[11px] font-mono-num text-slate-400">
                GPS 33.5132, 126.5269
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-[#E86F1A]" />
              <span>{DEMO_PRESET_2.title}</span>
            </h3>

            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>제주특별자치도 제주시 일도1동 중앙로 상가 입구</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              "{DEMO_PRESET_2.text}"
            </p>

            {/* Photo preview indicator */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-100/60 p-2 rounded">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{DEMO_PRESET_2.photoDescription}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadPreset('preset-ildo-complex')}
            className="mt-4 w-full min-h-[44px] py-2.5 px-4 bg-[#E86F1A] hover:bg-[#D05E12] text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <span>시연 ② 불러오기 및 직접 입력 전환</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
