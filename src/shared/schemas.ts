import { z } from 'zod';

// Transcribe
export const TranscribeRequestSchema = z.object({
  audioBase64: z.string().min(1, '오디오 데이터가 비어 있습니다.'),
  mimeType: z.string().default('audio/webm'),
});

export const TranscribeResponseDataSchema = z.object({
  transcript: z.string(),
});

// Chat Intake
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

export const ChatIntakeRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1, '대화 메시지가 필요합니다.'),
});

export const ChatIntakeResponseDataSchema = z.object({
  reply: z.string(),
});

// Chat Summarize
export const ChatSummarizeRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1, '대화 기록이 필요합니다.'),
});

export const ChatSummarizeResponseDataSchema = z.object({
  city: z.string().default(''),
  district: z.string().default(''),
  occurredAt: z.string().default(''),
  initialDraft: z.string().default(''),
  unknownFields: z.array(z.string()).default([]),
});

// Intake (STEP 1 Structuring)
export const IntakeRequestSchema = z.object({
  text: z.string().min(2, '민원 내용을 2글자 이상 입력해주세요.'),
  city: z.string().optional().default(''),
  district: z.string().optional().default(''),
  occurredAt: z.string().optional().default(''),
  photoBase64: z.string().optional(),
  photoMimeType: z.string().optional(),
  followUpAnswers: z.record(z.string()).optional(),
});

export const SixWSchema = z.object({
  who: z.string(),
  when: z.string(),
  where: z.string(),
  what: z.string(),
  how: z.string(),
  why: z.string(),
});

export const RewriteCandidateSchema = z.object({
  original: z.string(),
  refined: z.string(),
  reason: z.string(),
});

export const FollowUpQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  placeholder: z.string().optional(),
  answer: z.string().optional(),
});

export const IntakeResponseDataSchema = z.object({
  sixW: SixWSchema,
  photoObservations: z.array(z.string()).default([]),
  rewriteCandidates: z.array(RewriteCandidateSchema).default([]),
  followUpQuestions: z.array(FollowUpQuestionSchema).default([]),
});

// Ground & Route (STEP 2 & 3)
export const GroundAndRouteRequestSchema = z.object({
  sixW: SixWSchema,
  district: z.string(),
  city: z.string(),
  gps: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  citedOrdinanceIds: z.array(z.string()).optional(),
  category: z.string().optional(),
  occurredAt: z.string().optional(),
});

export const WeatherInfoSchema = z.object({
  status: z.enum(['verified', 'demo', 'unavailable', 'needs_review']),
  isModelReference: z.boolean(),
  isGpsBased: z.boolean(),
  locationName: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windDirection: z.number(),
  precipitation: z.number(),
  weatherCode: z.number(),
  weatherDescription: z.string(),
  baseTime: z.string(),
  queriedAt: z.string(),
  source: z.string(),
  queryMode: z.enum(['realtime', 'historical']).optional(),
  matchedTargetTime: z.string().optional(),
});

export const FacilityMatchSchema = z.object({
  id: z.string(),
  category: z.enum(['단속CCTV', '보호구역', '클린하우스', '공영주차장', '빗물받이', '상권특성']),
  name: z.string(),
  distanceMeter: z.number(),
  radiusMeter: z.number(),
  address: z.string(),
  source: z.string(),
  updatedAt: z.string(),
  status: z.enum(['verified', 'demo', 'unavailable', 'needs_review']),
  details: z.string().optional(),
});

export const OrdinanceItemSchema = z.object({
  id: z.string(),
  topic: z.string(),
  title: z.string(),
  article: z.string(),
  contentSummary: z.string(),
  effectiveDate: z.string(),
  elisUrl: z.string(),
  issuingAuthority: z.literal('제주특별자치도'),
  keywords: z.array(z.string()),
});

export const OrdinanceMatchSchema = z.object({
  ordinance: OrdinanceItemSchema,
  relevanceReason: z.string(),
  isDirectlyCited: z.boolean(),
  status: z.enum(['verified', 'demo', 'needs_review']),
});

export const RoutingChannelSchema = z.object({
  name: z.string(),
  url: z.string(),
  description: z.string(),
  isPrimary: z.boolean().optional(),
});

export const SingleIssueRoutingSchema = z.object({
  issueTitle: z.string(),
  category: z.string(),
  recommendedDepartment: z.string(),
  cooperatingDepartments: z.array(z.string()),
  practicalTeam: z.string(),
  jurisdictionReason: z.string(),
  hierarchy: z.object({
    province: z.string(),
    city: z.string(),
    community: z.string(),
  }),
  channels: z.array(RoutingChannelSchema),
  checklist: z.array(z.string()),
  isNeedsReview: z.boolean().optional(),
});

export const RoutingInfoSchema = z.object({
  isCompound: z.boolean(),
  issues: z.array(SingleIssueRoutingSchema),
  primaryChannel: RoutingChannelSchema,
  disclaimer: z.string(),
});

export const GroundAndRouteResponseDataSchema = z.object({
  weather: WeatherInfoSchema,
  facilities: z.array(FacilityMatchSchema),
  ordinanceMatches: z.array(OrdinanceMatchSchema),
  routing: RoutingInfoSchema,
});

// Draft (STEP 4)
export const DraftRequestSchema = z.object({
  sixW: SixWSchema,
  district: z.string(),
  city: z.string(),
  grounds: z.object({
    weather: WeatherInfoSchema.optional(),
    facilities: z.array(FacilityMatchSchema).optional(),
    ordinances: z.array(OrdinanceMatchSchema).optional(),
  }),
  routing: RoutingInfoSchema,
  intakeRewrites: z.array(RewriteCandidateSchema).optional(),
  followUpAnswers: z.record(z.string()).optional(),
  customEdits: z.string().optional(),
});

export const FollowUpGuideSchema = z.object({
  responseDeadlines: z.string(),
  evidenceTips: z.array(z.string()),
  officialDisclaimer: z.string(),
  channels: z.array(RoutingChannelSchema),
});

export const DraftResponseDataSchema = z.object({
  draft: z.string(),
  rewrites: z.array(RewriteCandidateSchema),
  followUpGuide: FollowUpGuideSchema,
});
