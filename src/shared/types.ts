export type AppMode = 'demo' | 'live';

export type JejuCity = '제주시' | '서귀포시';

export interface SixW {
  who: string;
  when: string;
  where: string;
  what: string;
  how: string;
  why: string;
}

export interface RewriteCandidate {
  original: string;
  refined: string;
  reason: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  placeholder?: string;
  answer?: string;
}

export interface WeatherInfo {
  status: 'verified' | 'demo' | 'unavailable' | 'needs_review';
  isModelReference: boolean;
  isGpsBased: boolean;
  locationName: string;
  coordinates: { lat: number; lng: number };
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: number; // deg
  precipitation: number; // mm
  weatherCode: number;
  weatherDescription: string;
  baseTime: string; // ISO
  queriedAt: string; // ISO
  source: string;
  queryMode?: 'realtime' | 'historical';
  matchedTargetTime?: string;
}

export interface FacilityMatch {
  id: string;
  category: '단속CCTV' | '보호구역' | '클린하우스' | '공영주차장' | '빗물받이' | '상권특성';
  name: string;
  distanceMeter: number;
  radiusMeter: number;
  address: string;
  source: string;
  updatedAt: string;
  status: 'verified' | 'demo' | 'unavailable' | 'needs_review';
  details?: string;
}

export interface OrdinanceItem {
  id: string;
  topic: string; // 16 topics: 악취, 가축분뇨, 폐기물, 소음, 식품위생, 불법 주정차, 도로점용, 가로등, 보호구역, 옥외광고물, 관광진흥, 전통시장, 하수도, 수도급수, 공중화장실, 해안쓰레기
  title: string;
  article: string;
  contentSummary: string;
  effectiveDate: string;
  elisUrl: string;
  issuingAuthority: '제주특별자치도';
  keywords: string[];
}

export interface OrdinanceMatch {
  ordinance: OrdinanceItem;
  relevanceReason: string;
  isDirectlyCited: boolean;
  status: 'verified' | 'demo' | 'needs_review';
}

export interface RoutingChannel {
  name: string;
  url: string;
  description: string;
  isPrimary?: boolean;
}

export interface SingleIssueRouting {
  issueTitle: string;
  category: string;
  recommendedDepartment: string; // 1차 접수 추천
  cooperatingDepartments: string[]; // 협조 부서
  practicalTeam: string; // 실무팀
  jurisdictionReason: string; // 판단 이유
  hierarchy: {
    province: string; // 제주특별자치도 본청
    city: string; // 행정시 (제주시/서귀포시)
    community: string; // 읍·면·동 주민센터
  };
  channels: RoutingChannel[];
  checklist: string[];
  isNeedsReview?: boolean;
}

export interface RoutingInfo {
  isCompound: boolean;
  issues: SingleIssueRouting[];
  primaryChannel: RoutingChannel;
  disclaimer: string;
}

export interface FollowUpGuide {
  responseDeadlines: string;
  evidenceTips: string[];
  officialDisclaimer: string;
  channels: RoutingChannel[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
  meta?: {
    mode: AppMode;
    warnings?: string[];
  };
}

export interface SavedComplaint {
  id: string;
  title: string;
  city: JejuCity;
  district: string;
  category: string;
  occurredAt: string;
  savedAt: string;
  source: 'demo' | 'user';
  draftContent: string;
  rewrites: RewriteCandidate[];
  summary: string;
}
