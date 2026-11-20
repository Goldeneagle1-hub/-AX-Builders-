import React from 'react';
import { Bot, Edit3, Sparkles } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { ChatIntake } from './ChatIntake';
import { DirectInput } from './DirectInput';
import { PresetSelector } from './PresetSelector';

export const Step1View: React.FC = () => {
  const { step1Tab, setStep1Tab } = useCopilot();

  const tabs = [
    { id: 'chat' as const, label: 'AI 챗봇 상담 (추천)', icon: Bot },
    { id: 'direct' as const, label: '직접 입력·사진', icon: Edit3 },
    { id: 'preset' as const, label: '시연 프리셋 (2종)', icon: Sparkles },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-2 pt-2 gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = step1Tab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStep1Tab(tab.id)}
              className={`min-h-[44px] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg flex items-center space-x-1.5 transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-[#2E2A26] text-[#2E2A26] bg-slate-50/80'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-1 sm:p-2">
        {step1Tab === 'chat' && <ChatIntake />}
        {step1Tab === 'direct' && <DirectInput />}
        {step1Tab === 'preset' && <PresetSelector />}
      </div>
    </div>
  );
};
