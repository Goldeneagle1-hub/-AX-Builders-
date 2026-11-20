import { Router, Request, Response } from 'express';
import { CONFIG } from '../config.js';
import {
  TranscribeRequestSchema,
  ChatIntakeRequestSchema,
  ChatSummarizeRequestSchema,
  IntakeRequestSchema,
  GroundAndRouteRequestSchema,
  DraftRequestSchema,
} from '../../shared/schemas.js';
import {
  transcribeAudio,
  chatIntakeReply,
  chatSummarizeToDraft,
  processIntake,
  generateDraftContent,
} from '../gemini.js';
import { fetchWeather } from '../weather.js';
import { matchFacilities } from '../../shared/facilities.js';
import { JEJU_ORDINANCE_CATALOG } from '../../shared/ordinances.js';
import { resolveJurisdiction, OFFICIAL_CHANNELS } from '../../shared/jurisdictions.js';
import { OrdinanceMatch } from '../../shared/types.js';

export const apiRouter = Router();

// Standard response helper
function successResponse<T>(res: Response, data: T, warnings: string[] = []) {
  return res.status(200).json({
    data,
    meta: {
      mode: CONFIG.APP_MODE,
      warnings,
    },
  });
}

function errorResponse(
  res: Response,
  code: string,
  message: string,
  status: number = 400,
  retryable: boolean = false
) {
  return res.status(status).json({
    error: {
      code,
      message,
      retryable,
    },
  });
}

// 0. GET /api/health (Mode & Readiness indicator)
apiRouter.get('/health', (_req: Request, res: Response) => {
  return successResponse(res, {
    status: 'ok',
    mode: CONFIG.APP_MODE,
    hasGeminiKey: Boolean(CONFIG.GEMINI_API_KEY),
  });
});

// 1. POST /api/transcribe
apiRouter.post('/transcribe', async (req: Request, res: Response) => {
  try {
    const parsed = TranscribeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return errorResponse(res, 'INVALID_INPUT', parsed.error.issues[0]?.message || '잘못된 입력입니다.', 400);
    }

    const { audioBase64, mimeType } = parsed.data;
    // Check payload size (e.g. 15MB limit)
    if (audioBase64.length > 20 * 1024 * 1024) {
      return errorResponse(res, 'PAYLOAD_TOO_LARGE', '오디오 파일이 너무 큽니다 (최대 15MB).', 413);
    }

    const result = await transcribeAudio(audioBase64, mimeType);
    return successResponse(res, result);
  } catch (err: any) {
    return errorResponse(res, 'TRANSCRIBE_FAILED', err.message || '전사에 실패했습니다.', 500, true);
  }
});

// 2. POST /api/chat-intake
apiRouter.post('/chat-intake', async (req: Request, res: Response) => {
  try {
    const parsed = ChatIntakeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return errorResponse(res, 'INVALID_INPUT', parsed.error.issues[0]?.message || '잘못된 입력입니다.', 400);
    }

    const result = await chatIntakeReply(parsed.data.messages);
    return successResponse(res, result);
  } catch (err: any) {
    return errorResponse(res, 'CHAT_FAILED', err.message || '챗봇 응답에 실패했습니다.', 500, true);
  }
});

// 3. POST /api/chat-summarize
apiRouter.post('/chat-summarize', async (req: Request, res: Response) => {
  try {
    const parsed = ChatSummarizeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return errorResponse(res, 'INVALID_INPUT', parsed.error.issues[0]?.message || '잘못된 입력입니다.', 400);
    }

    const result = await chatSummarizeToDraft(parsed.data.messages);
    return successResponse(res, result);
  } catch (err: any) {
    return errorResponse(res, 'SUMMARIZE_FAILED', err.message || '초안 정리에 실패했습니다.', 500, true);
  }
});

// 4. POST /api/intake
apiRouter.post('/intake', async (req: Request, res: Response) => {
  try {
    const parsed = IntakeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return errorResponse(res, 'INVALID_INPUT', parsed.error.issues[0]?.message || '잘못된 입력입니다.', 400);
    }

    const { text, city, district, occurredAt, photoBase64, photoMimeType, followUpAnswers } = parsed.data;

    if (photoBase64 && photoBase64.length > 7 * 1024 * 1024) {
      return errorResponse(res, 'PAYLOAD_TOO_LARGE', '사진 파일이 너무 큽니다 (최대 5MB).', 413);
    }

    const result = await processIntake(
      text,
      city,
      district,
      occurredAt,
      photoBase64,
      photoMimeType,
      followUpAnswers
    );

    return successResponse(res, result);
  } catch (err: any) {
    return errorResponse(res, 'INTAKE_FAILED', err.message || '민원 구조화 처리에 실패했습니다.', 500, true);
  }
});

// 5. POST /api/ground-and-route
apiRouter.post('/ground-and-route', async (req: Request, res: Response) => {
  try {
    const parsed = GroundAndRouteRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return errorResponse(res, 'INVALID_INPUT', parsed.error.issues[0]?.message || '잘못된 입력입니다.', 400);
    }

    const { sixW, district, city, gps, citedOrdinanceIds, category } = parsed.data;
    const warnings: string[] = [];

    // 1. Weather
    const weather = await fetchWeather(gps, city);
    if (weather.status === 'unavailable') {
      warnings.push('기상 데이터 조회에 실패하여 참고 기상 정보가 누락되었습니다.');
    }

    // 2. Facilities
    const facilities = matchFacilities(district, gps);
    if (facilities.length === 0) {
      warnings.push(`${district} 인근 등록된 공개 시설 데이터 검색 결과가 0건입니다.`);
    }

    // 3. Ordinances
    const matches: OrdinanceMatch[] = [];

    // Add directly cited ordinances first
    if (citedOrdinanceIds && citedOrdinanceIds.length > 0) {
      for (const id of citedOrdinanceIds) {
        const ord = JEJU_ORDINANCE_CATALOG.find((o) => o.id === id);
        if (ord) {
          matches.push({
            ordinance: ord,
            relevanceReason: '사용자가 직접 검색하여 인용한 자치법규',
            isDirectlyCited: true,
            status: 'verified',
          });
        }
      }
    }

    // Keyword & category matching for up to 3 verified citations
    const fullText = `${sixW.what} ${sixW.why} ${sixW.how} ${category || ''}`;
    const matchedOrdinances = JEJU_ORDINANCE_CATALOG.filter((ord) => {
      // Don't duplicate already cited
      if (matches.some((m) => m.ordinance.id === ord.id)) return false;

      // Check keywords
      return (
        ord.keywords.some((k) => fullText.includes(k)) ||
        fullText.includes(ord.topic) ||
        (ord.topic === '악취' && (fullText.includes('축사') || fullText.includes('냄새'))) ||
        (ord.topic === '불법 주정차' && fullText.includes('주차')) ||
        (ord.topic === '폐기물' && fullText.includes('쓰레기'))
      );
    });

    for (const ord of matchedOrdinances) {
      if (matches.length >= 3) break;
      matches.push({
        ordinance: ord,
        relevanceReason: `민원 내용의 핵심 키워드('${ord.topic}')와 직접 관련된 조례 조항`,
        isDirectlyCited: false,
        status: 'verified',
      });
    }

    // 4. Jurisdiction Routing
    const routing = resolveJurisdiction(city, district, `${sixW.what} ${sixW.why}`, category);

    return successResponse(
      res,
      {
        weather,
        facilities,
        ordinanceMatches: matches,
        routing,
      },
      warnings
    );
  } catch (err: any) {
    return errorResponse(res, 'GROUND_ROUTE_FAILED', err.message || '근거 및 관할 조회 실패', 500, true);
  }
});

// 6. POST /api/draft
apiRouter.post('/draft', async (req: Request, res: Response) => {
  try {
    const parsed = DraftRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return errorResponse(res, 'INVALID_INPUT', parsed.error.issues[0]?.message || '잘못된 입력입니다.', 400);
    }

    const { sixW, district, city, grounds, routing, customEdits, intakeRewrites } = parsed.data;

    const { draft, rewrites } = await generateDraftContent(
      sixW,
      district,
      city,
      grounds,
      routing,
      customEdits,
      intakeRewrites
    );

    const followUpGuide = {
      responseDeadlines:
        '일반 행정민원: 접수일로부터 7일~14일 이내 처리 및 통지 원칙 (민원 처리에 관한 법률 제9조). 단순 계도·순찰 단속 민원은 접수기관 사정에 따라 7일 내외 처리 (공식 접수기관 안내 확인 필요).',
      evidenceTips: [
        '동일 장소 및 동일 피해 3회 이상 반복 발생 일지(발생 일시, 지속 시간, 풍향/기상) 기록 첨부',
        '단순 계도에 그치지 않도록 소상공인 예약 취소, 손님 환불 영수증, 매출 감소 증빙 등 객관적 영업 피해 자료 구비',
        '단속 부서 현장 출동 시 민원인 입회 및 현장 합동 점검(악취 포집 또는 현장 동행)을 요청하여 행정 실효성 확보',
      ],
      officialDisclaimer:
        '본 서비스는 소상공인과 도민의 민원 작성·접수 보조 도구이며, 공식 접수를 대행하거나 처리 결과를 보장하지 않습니다. 공식 기관 로그인, 실제 민원 제출, 기관 답변 추적은 제공하지 않으므로 실제 제출은 국민신문고 또는 안전신문고 공식 채널을 이용해 주십시오.',
      channels: [
        OFFICIAL_CHANNELS.sinmungo,
        OFFICIAL_CHANNELS.safety,
        OFFICIAL_CHANNELS.jejuPortal,
      ],
    };

    return successResponse(res, {
      draft,
      rewrites,
      followUpGuide,
    });
  } catch (err: any) {
    return errorResponse(res, 'DRAFT_FAILED', err.message || '민원서 초안 생성 실패', 500, true);
  }
});
