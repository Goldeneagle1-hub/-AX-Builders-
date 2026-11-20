import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  JejuCity,
  SixW,
  RewriteCandidate,
  FollowUpQuestion,
  WeatherInfo,
  FacilityMatch,
  OrdinanceMatch,
  RoutingInfo,
  FollowUpGuide,
  SavedComplaint,
} from '@shared/types';
import {
  DEMO_PRESET_1,
  DEMO_PRESET_2,
  INITIAL_DEMO_COMPLAINTS,
  DemoPreset,
} from '@shared/presets';

const STORAGE_KEY = 'jeju_civil_copilot_v1';
const FONT_STORAGE_KEY = 'jeju_civil_copilot_font_v1';
const EVIDENCE_LOG_STORAGE_KEY = 'jeju_civil_copilot_logs_v1';

export interface EvidenceLogItem {
  id: string;
  occurredAt: string;
  note: string;
}

export interface CopilotState {
  step: number; // 1 ~ 4
  setStep: (s: number) => void;
  step1Tab: 'chat' | 'direct' | 'preset';
  setStep1Tab: (tab: 'chat' | 'direct' | 'preset') => void;

  // Chatbot State
  chatMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  setChatMessages: React.Dispatch<
    React.SetStateAction<Array<{ role: 'user' | 'assistant'; content: string }>>
  >;

  // Direct Input State
  city: JejuCity;
  setCity: (c: JejuCity) => void;
  district: string;
  setDistrict: (d: string) => void;
  occurredAt: string;
  setOccurredAt: (t: string) => void;
  text: string;
  setText: (t: string) => void;
  gps: { lat: number; lng: number } | null;
  setGps: (g: { lat: number; lng: number } | null) => void;
  photoBase64: string | null;
  setPhotoBase64: (p: string | null) => void;
  photoMimeType: string | null;
  setPhotoMimeType: (m: string | null) => void;
  photoPreviewUrl: string | null;
  setPhotoPreviewUrl: (url: string | null) => void;
  photoNotice: string | null;
  setPhotoNotice: (n: string | null) => void;

  // Citations
  citedOrdinanceIds: string[];
  addCitedOrdinance: (id: string) => void;
  removeCitedOrdinance: (id: string) => void;

  // Follow-up answers
  followUpAnswers: Record<string, string>;
  setFollowUpAnswer: (id: string, ans: string) => void;

  // Downstream Results
  intakeResult: {
    sixW: SixW;
    photoObservations: string[];
    rewriteCandidates: RewriteCandidate[];
    followUpQuestions: FollowUpQuestion[];
  } | null;
  setIntakeResult: React.Dispatch<
    React.SetStateAction<{
      sixW: SixW;
      photoObservations: string[];
      rewriteCandidates: RewriteCandidate[];
      followUpQuestions: FollowUpQuestion[];
    } | null>
  >;

  groundResult: {
    weather: WeatherInfo;
    facilities: FacilityMatch[];
    ordinanceMatches: OrdinanceMatch[];
    routing: RoutingInfo;
  } | null;
  setGroundResult: React.Dispatch<
    React.SetStateAction<{
      weather: WeatherInfo;
      facilities: FacilityMatch[];
      ordinanceMatches: OrdinanceMatch[];
      routing: RoutingInfo;
    } | null>
  >;

  draftResult: {
    draft: string;
    rewrites: RewriteCandidate[];
    followUpGuide: FollowUpGuide;
  } | null;
  setDraftResult: React.Dispatch<
    React.SetStateAction<{
      draft: string;
      rewrites: RewriteCandidate[];
      followUpGuide: FollowUpGuide;
    } | null>
  >;

  editedDraft: string;
  setEditedDraft: (d: string) => void;

  // Stale state tracking (Needs regeneration flags)
  needsRegen: {
    step2: boolean;
    step3: boolean;
    step4: boolean;
  };
  markInputsDirty: () => void;
  clearDirtyFlags: () => void;

  // Presets and Reset
  loadPreset: (presetId: 'preset-daejeong-odor' | 'preset-ildo-complex') => void;
  resetAll: () => void;

  // History & Stats
  savedComplaints: SavedComplaint[];
  saveDraftToHistory: (title?: string) => string;
  deleteSavedComplaint: (id: string) => void;
  importComplaints: (items: SavedComplaint[]) => number;

  // Accessibility: Large Font Mode
  largeFont: boolean;
  toggleLargeFont: () => void;

  // Repeating Evidence Log
  evidenceLogs: EvidenceLogItem[];
  addEvidenceLog: (occurredAt: string, note: string) => void;
  deleteEvidenceLog: (id: string) => void;
}

const CopilotContext = createContext<CopilotState | null>(null);

export const CopilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<number>(1);
  const [step1Tab, setStep1Tab] = useState<'chat' | 'direct' | 'preset'>('chat');

  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([
    {
      role: 'assistant',
      content:
        '안녕하세요! 제주민원메이트입니다. 서귀포시나 제주시에서 겪고 계신 악취, 불법주차, 폐기물, 소음 등 생활·영업 피해를 편안하게 말씀해 주시면, 법규 근거를 찾고 정식 민원 서식 작성을 도와드립니다.',
    },
  ]);

  const [city, setCity] = useState<JejuCity>('제주시');
  const [district, setDistrict] = useState<string>('일도1동');
  const [occurredAt, setOccurredAt] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [text, setText] = useState<string>('');
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);

  const [citedOrdinanceIds, setCitedOrdinanceIds] = useState<string[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});

  const [intakeResult, setIntakeResult] = useState<{
    sixW: SixW;
    photoObservations: string[];
    rewriteCandidates: RewriteCandidate[];
    followUpQuestions: FollowUpQuestion[];
  } | null>(null);

  const [groundResult, setGroundResult] = useState<{
    weather: WeatherInfo;
    facilities: FacilityMatch[];
    ordinanceMatches: OrdinanceMatch[];
    routing: RoutingInfo;
  } | null>(null);

  const [draftResult, setDraftResult] = useState<{
    draft: string;
    rewrites: RewriteCandidate[];
    followUpGuide: FollowUpGuide;
  } | null>(null);

  const [editedDraft, setEditedDraft] = useState<string>('');
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  // Large Font Mode (Accessibility)
  const [largeFont, setLargeFont] = useState<boolean>(() => {
    try {
      return localStorage.getItem(FONT_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('large-font', largeFont);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, String(largeFont));
    } catch {
      // ignore storage errors
    }
  }, [largeFont]);

  const toggleLargeFont = () => setLargeFont((prev) => !prev);

  // Repeating Evidence Log
  const [evidenceLogs, setEvidenceLogs] = useState<EvidenceLogItem[]>(() => {
    try {
      const stored = localStorage.getItem(EVIDENCE_LOG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(EVIDENCE_LOG_STORAGE_KEY, JSON.stringify(evidenceLogs));
    } catch {
      // ignore storage errors
    }
  }, [evidenceLogs]);

  const addEvidenceLog = (logOccurredAt: string, note: string) => {
    const trimmed = note.trim();
    if (!trimmed) return;
    setEvidenceLogs((prev) => [
      { id: `ev-${Date.now()}`, occurredAt: logOccurredAt || new Date().toISOString().slice(0, 16), note: trimmed },
      ...prev,
    ]);
  };

  const deleteEvidenceLog = (id: string) => {
    setEvidenceLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const [needsRegen, setNeedsRegen] = useState<{
    step2: boolean;
    step3: boolean;
    step4: boolean;
  }>({
    step2: false,
    step3: false,
    step4: false,
  });

  // LocalStorage Saved Complaints
  const [savedComplaints, setSavedComplaints] = useState<SavedComplaint[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved complaints from localStorage', e);
    }
    return INITIAL_DEMO_COMPLAINTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedComplaints));
    } catch (e) {
      console.error('Failed to save complaints to localStorage', e);
    }
  }, [savedComplaints]);

  const markInputsDirty = () => {
    if (intakeResult || groundResult || draftResult) {
      setNeedsRegen({
        step2: true,
        step3: true,
        step4: true,
      });
    }
  };

  const clearDirtyFlags = () => {
    setNeedsRegen({
      step2: false,
      step3: false,
      step4: false,
    });
  };

  const addCitedOrdinance = (id: string) => {
    if (!citedOrdinanceIds.includes(id)) {
      setCitedOrdinanceIds((prev) => [...prev, id]);
      markInputsDirty();
    }
  };

  const removeCitedOrdinance = (id: string) => {
    setCitedOrdinanceIds((prev) => prev.filter((item) => item !== id));
    markInputsDirty();
  };

  const setFollowUpAnswer = (id: string, ans: string) => {
    setFollowUpAnswers((prev) => ({ ...prev, [id]: ans }));
    markInputsDirty();
  };

  const loadPreset = (presetId: 'preset-daejeong-odor' | 'preset-ildo-complex') => {
    const preset: DemoPreset =
      presetId === 'preset-daejeong-odor' ? DEMO_PRESET_1 : DEMO_PRESET_2;

    setCity(preset.city);
    setDistrict(preset.district);
    setOccurredAt(preset.occurredAt);
    setText(preset.text);
    setGps(preset.gps);
    setPhotoPreviewUrl(preset.photoUrl);
    setPhotoNotice(preset.photoConsentNotice);
    setPhotoBase64(null); // Local asset URL used for demo

    // Set sample questions prefilled
    const answers: Record<string, string> = {};
    for (const q of preset.expectedQuestions) {
      if (q.answer) answers[q.id] = q.answer;
    }
    setFollowUpAnswers(answers);

    // Switch to direct input tab
    setStep1Tab('direct');
    setStep(1);

    // Clear previous downstream
    setIntakeResult(null);
    setGroundResult(null);
    setDraftResult(null);
    setEditedDraft('');
    setCurrentDraftId(null);
    clearDirtyFlags();
  };

  const resetAll = () => {
    setStep(1);
    setStep1Tab('chat');
    setText('');
    setGps(null);
    setPhotoBase64(null);
    setPhotoMimeType(null);
    setPhotoPreviewUrl(null);
    setPhotoNotice(null);
    setCitedOrdinanceIds([]);
    setFollowUpAnswers({});
    setIntakeResult(null);
    setGroundResult(null);
    setDraftResult(null);
    setEditedDraft('');
    setCurrentDraftId(null);
    clearDirtyFlags();
    setChatMessages([
      {
        role: 'assistant',
        content:
          '안녕하세요! 제주민원메이트입니다. 서귀포시나 제주시에서 겪고 계신 악취, 불법주차, 폐기물, 소음 등 생활·영업 피해를 편안하게 말씀해 주시면, 법규 근거를 찾고 정식 민원 서식 작성을 도와드립니다.',
      },
    ]);
  };

  const saveDraftToHistory = (titleOverride?: string): string => {
    const defaultTitle =
      titleOverride ||
      (groundResult?.routing.isCompound
        ? `[복합민원] ${city} ${district} 상가 앞 불법주정차 및 폐기물 방치 정비 요청`
        : `[생활민원] ${city} ${district} ${text.slice(0, 25)} 관련 조치 요청`);

    // Match by session draft ID so editing & re-saving the same draft updates it cleanly without duplicates
    const existingIndex = currentDraftId
      ? savedComplaints.findIndex((c) => c.id === currentDraftId && c.source === 'user')
      : -1;

    const now = new Date().toISOString();
    const id = existingIndex >= 0 ? savedComplaints[existingIndex].id : `user-comp-${Date.now()}`;
    setCurrentDraftId(id);

    const newComplaint: SavedComplaint = {
      id,
      title: defaultTitle,
      city,
      district,
      category: groundResult?.routing.issues[0]?.category || '생활환경',
      occurredAt,
      savedAt: now,
      source: 'user',
      draftContent: editedDraft || draftResult?.draft || '',
      rewrites: draftResult?.rewrites || [],
      summary: `${city} ${district} 민원 서식 (사용자 검토 및 수정본)`,
    };

    if (existingIndex >= 0) {
      setSavedComplaints((prev) => {
        const next = [...prev];
        next[existingIndex] = newComplaint;
        return next;
      });
    } else {
      setSavedComplaints((prev) => [newComplaint, ...prev]);
    }

    return id;
  };

  const deleteSavedComplaint = (id: string) => {
    if (id === currentDraftId) {
      setCurrentDraftId(null);
    }
    setSavedComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  const importComplaints = (items: SavedComplaint[]): number => {
    let addedCount = 0;
    setSavedComplaints((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newOnes: SavedComplaint[] = [];
      for (const item of items) {
        if (item && typeof item.id === 'string' && typeof item.title === 'string' && !existingIds.has(item.id)) {
          existingIds.add(item.id);
          newOnes.push({
            ...item,
            source: item.source === 'demo' ? 'demo' : 'user',
          });
          addedCount += 1;
        }
      }
      return [...newOnes, ...prev];
    });
    return addedCount;
  };

  return (
    <CopilotContext.Provider
      value={{
        step,
        setStep,
        step1Tab,
        setStep1Tab,
        chatMessages,
        setChatMessages,
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
        photoBase64,
        setPhotoBase64,
        photoMimeType,
        setPhotoMimeType,
        photoPreviewUrl,
        setPhotoPreviewUrl,
        photoNotice,
        setPhotoNotice,
        citedOrdinanceIds,
        addCitedOrdinance,
        removeCitedOrdinance,
        followUpAnswers,
        setFollowUpAnswer,
        intakeResult,
        setIntakeResult,
        groundResult,
        setGroundResult,
        draftResult,
        setDraftResult,
        editedDraft,
        setEditedDraft,
        needsRegen,
        markInputsDirty,
        clearDirtyFlags,
        loadPreset,
        resetAll,
        savedComplaints,
        saveDraftToHistory,
        deleteSavedComplaint,
        importComplaints,
        largeFont,
        toggleLargeFont,
        evidenceLogs,
        addEvidenceLog,
        deleteEvidenceLog,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export function useCopilot(): CopilotState {
  const ctx = useContext(CopilotContext);
  if (!ctx) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return ctx;
}
