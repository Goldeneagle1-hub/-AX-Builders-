import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ArrowRight, Loader2, MessageSquare } from 'lucide-react';
import { useCopilot } from '../../context/CopilotContext';
import { JejuCity } from '@shared/types';

export const ChatIntake: React.FC = () => {
  const {
    chatMessages,
    setChatMessages,
    setCity,
    setDistrict,
    setOccurredAt,
    setText,
    setStep1Tab,
    text: existingText,
    markInputsDirty,
  } = useCopilot();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    '인근 축사에서 심한 가축분뇨 악취가 넘어와 숙박업소 손님들이 환불을 요구하고 있습니다.',
    '상가 진입로 황색실선에 불법 주차가 줄지어 있고 코너에 쓰레기 박스가 방치되어 있습니다.',
    '이면도로 보도블록이 깨져 있고 야간 가로등이 꺼져 있어 보행자 낙상 위험이 큽니다.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSendMessage = async (msgToSend?: string) => {
    const textToSend = msgToSend || inputMessage.trim();
    if (!textToSend || isLoading) return;

    setErrorMsg(null);
    const newMessages = [...chatMessages, { role: 'user' as const, content: textToSend }];
    setChatMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const json = await res.json();
      if (json.data && json.data.reply) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: json.data.reply },
        ]);
      } else {
        throw new Error(json.error?.message || '답변을 생성하지 못했습니다.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '챗봇 상담 통신 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (chatMessages.filter((m) => m.role === 'user').length === 0) {
      setErrorMsg('상담 메시지를 최소 1회 이상 작성해주세요.');
      return;
    }

    if (existingText.trim()) {
      const ok = window.confirm(
        '이미 직접 입력란에 작성 중인 내용이 있습니다. 대화 요약 내용으로 대체하시겠습니까?'
      );
      if (!ok) return;
    }

    setIsSummarizing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/chat-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages }),
      });

      const json = await res.json();
      if (json.data) {
        const { city, district, occurredAt, initialDraft } = json.data;
        if (city && (city === '제주시' || city === '서귀포시')) {
          setCity(city as JejuCity);
        }
        if (district) {
          setDistrict(district);
        }
        if (occurredAt) {
          setOccurredAt(occurredAt);
        }
        if (initialDraft) {
          setText(initialDraft);
        }
        markInputsDirty();
        // Switch to direct input tab
        setStep1Tab('direct');
      } else {
        throw new Error(json.error?.message || '요약에 실패했습니다.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '초고 정리 중 오류가 발생했습니다.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Start Chips */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E86F1A]" />
          <span>빠른 시작 예시 (클릭 시 자동 상담 입력)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left text-xs text-slate-700 transition-colors line-clamp-2 cursor-pointer"
            >
              "{chip}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Window */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[300px] max-h-[440px] overflow-y-auto space-y-3">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#2E2A26] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#2E2A26] text-white rounded-br-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2E2A26]" />
            <span>AI 상담관이 행정 매칭 사항을 검토 중입니다...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {errorMsg && (
        <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Chat Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="겪고 계신 피해 상황이나 위치를 구어체로 자유롭게 말씀해주세요..."
          className="flex-1 min-h-[44px] text-base sm:text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E2A26] focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="min-h-[44px] px-4 py-2.5 bg-[#2E2A26] hover:bg-[#1F1C18] disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">전송</span>
        </button>
      </form>

      {/* Summarize Action Button */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-amber-900">
          <p className="font-semibold">대화가 충분히 진행되었나요?</p>
          <p className="text-[11px] text-amber-700 mt-0.5">
            지금까지의 대화에서 행정시, 읍·면·동, 발생일시, 피해 사실을 자동 추출하여 서식 입력란으로 전환합니다.
          </p>
        </div>
        <button
          type="button"
          disabled={isSummarizing}
          onClick={handleSummarize}
          className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#E86F1A] hover:bg-[#D05E12] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          {isSummarizing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4" />
          )}
          <span>대화 내용으로 민원 초고 정리하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
