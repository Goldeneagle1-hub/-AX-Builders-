import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Volume2, CheckCircle2 } from 'lucide-react';

interface AudioRecorderProps {
  onTranscribeComplete: (text: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscribeComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptDraft, setTranscriptDraft] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('이 브라우저는 음성 녹음을 지원하지 않습니다. 텍스트 직접 입력을 이용해주세요.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        clearInterval(timerRef.current);
        const finalBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        stream.getTracks().forEach((track) => track.stop());
        await handleTranscribe(finalBlob);
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? '마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용하거나 직접 텍스트로 입력해주세요.'
          : err.message || '마이크 접근에 실패했습니다.'
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    setErrorMessage(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: blob.type || 'audio/webm',
          }),
        });

        const json = await res.json();
        if (json.data && json.data.transcript) {
          setTranscriptDraft(json.data.transcript);
          setShowEditModal(true);
        } else {
          throw new Error(json.error?.message || '전사 결과를 가져오지 못했습니다.');
        }
      };
    } catch (err: any) {
      setErrorMessage(err.message || '음성 전사 처리 중 오류가 발생했습니다.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const applyTranscript = () => {
    if (transcriptDraft.trim()) {
      onTranscribeComplete(transcriptDraft.trim());
      setShowEditModal(false);
      setTranscriptDraft('');
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-[#2E2A26]" />
          <span className="font-semibold text-slate-800">현장 구어체 음성 녹음 (선택)</span>
          {isRecording && (
            <span className="inline-flex items-center space-x-1 text-red-600 font-mono-num font-bold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span>
                {Math.floor(recordingSeconds / 60)}:
                {(recordingSeconds % 60).toString().padStart(2, '0')} 녹음 중
              </span>
            </span>
          )}
        </div>

        <div>
          {!isRecording ? (
            <button
              type="button"
              disabled={isTranscribing}
              onClick={startRecording}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5 font-medium transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4 text-red-600" />
              <span>{isTranscribing ? '전사 변환 중...' : '음성 녹음 시작'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="min-h-[44px] px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1.5 font-semibold transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>녹음 완료 및 전사하기</span>
            </button>
          )}
        </div>
      </div>

      {isTranscribing && (
        <div className="mt-2.5 flex items-center space-x-2 text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin text-[#2E2A26]" />
          <span>음성을 텍스트로 변환 중입니다 (Interactions API / 시연 전사)...</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-2 text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* Transcript Review Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                전사문 검토 및 편집 (민원 본문에 반영 전)
              </h3>
            </div>
            <p className="text-slate-600 text-xs">
              인식된 음성 텍스트를 검토하고 잘못된 단어를 수정한 뒤 본문에 반영해주세요.
            </p>
            <textarea
              rows={4}
              value={transcriptDraft}
              onChange={(e) => setTranscriptDraft(e.target.value)}
              className="w-full text-base sm:text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E2A26] focus:outline-none"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={applyTranscript}
                className="px-4 py-2 bg-[#2E2A26] hover:bg-[#1F1C18] text-white rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>본문에 반영하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
