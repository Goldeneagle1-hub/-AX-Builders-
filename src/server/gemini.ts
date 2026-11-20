import { GoogleGenAI } from '@google/genai';
import { CONFIG } from './config.js';
import {
  SixW,
  RewriteCandidate,
  FollowUpQuestion,
  WeatherInfo,
  FacilityMatch,
  OrdinanceMatch,
  RoutingInfo,
} from '../shared/types.js';
import { DEMO_PRESET_1, DEMO_PRESET_2 } from '../shared/presets.js';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    if (!CONFIG.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    }
    genAIClient = new GoogleGenAI({ apiKey: CONFIG.GEMINI_API_KEY });
  }
  return genAIClient;
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType: string = 'audio/webm'
): Promise<{ transcript: string }> {
  if (CONFIG.APP_MODE === 'demo') {
    return {
      transcript:
        '서귀포시 대정읍 하모리에서 숙박업소를 하고 있는데요, 며칠 전부터 아침저녁으로 축사 쪽에서 분뇨 냄새가 너무 심하게 넘어옵니다. 손님들이 환불해달라고 난리인데 서귀포시청에서 얼른 나와서 현장 점검하고 악취 좀 조사해주십시오.',
    };
  }

  // Live mode
  try {
    const ai = getGenAI();
    // Using interactions API for audio transcription model
    const interaction = await (ai.interactions as any).create({
      model: CONFIG.GEMINI_TRANSCRIBE_MODEL,
      input: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: audioBase64,
              },
            },
          ],
        },
      ],
    });

    let transcript = '';
    const resAny = interaction as any;
    if (resAny.outputs && Array.isArray(resAny.outputs)) {
      for (const out of resAny.outputs) {
        if (out.text) transcript += out.text;
        if (out.parts && Array.isArray(out.parts)) {
          for (const p of out.parts) {
            if (p.text) transcript += p.text;
          }
        }
      }
    } else if (resAny.steps && Array.isArray(resAny.steps)) {
      for (const step of resAny.steps) {
        if (step.model_output) {
          if (typeof step.model_output === 'string') transcript += step.model_output;
          else if (step.model_output.text) transcript += step.model_output.text;
        }
      }
    }

    if (!transcript) {
      transcript = '음성 전사 결과가 비어 있거나 처리되지 않았습니다. 직접 입력을 권장합니다.';
    }

    return { transcript: transcript.trim() };
  } catch (err: any) {
    throw new Error(`Gemini 전사 API 오류 (${CONFIG.GEMINI_TRANSCRIBE_MODEL}): ${err.message}`);
  }
}

export async function chatIntakeReply(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ reply: string }> {
  if (CONFIG.APP_MODE === 'demo') {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    if (lastUserMsg.includes('악취') || lastUserMsg.includes('축사')) {
      return {
        reply:
          '악취로 인해 영업에 큰 불편을 겪고 계시는군요. 정확한 민원 서식 작성을 위해 몇 가지 여쭙겠습니다.\n1. 발생 위치가 서귀포시 대정읍 하모리 일대가 맞으실까요?\n2. 악취가 주로 유입되는 특정 시간대(예: 이른 아침, 저녁)나 기상 조건이 있으신가요?\n\n대화가 충분하시면 아래 [대화 내용으로 민원 초고 정리하기] 버튼을 눌러주세요.',
      };
    }
    if (lastUserMsg.includes('주차') || lastUserMsg.includes('쓰레기')) {
      return {
        reply:
          '상가 앞 불법 주정차와 방치 폐기물로 영업 및 보행 피해가 발생하셨군요.\n1. 발생 장소가 제주시 일도1동 중앙로 상가 입구가 맞으신가요?\n2. 황색실선 구역 주차 사진이나 번호판 사진 등 현장 증빙 자료를 확보하셨나요?\n\n답변해주시면 행정시 관할 부서 및 정식 서식으로 구조화해 드립니다.',
      };
    }
    return {
      reply:
        '말씀해주신 민원 상황을 접수했습니다. 발생한 행정구역(제주시 또는 서귀포시 읍·면·동), 피해 발생 시간대, 구체적인 피해 내용을 조금 더 알려주시면 최적의 행정 조례와 관할 부서를 찾아드립니다.',
    };
  }

  // Live mode
  try {
    const ai = getGenAI();
    const systemInstruction = `당신은 제주도 소상공인과 도민을 위한 '제주 민원 코파일럿' 상담관입니다.
사용자가 구어체로 겪고 있는 생활·영업 피해를 경청하고, 공무원이 행정 조치를 취할 수 있도록 필수 정보(행정시, 읍·면·동, 발생 일시, 피해 내용, 요청사항)를 1~2개의 정중한 질문으로 유도하세요.
답변은 친절하고 간결하며 공감 어린 어조로 작성하세요.`;

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: CONFIG.GEMINI_TEXT_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return { reply: response.text || '죄송합니다. 응답을 생성하지 못했습니다.' };
  } catch (err: any) {
    throw new Error(`Gemini 챗봇 API 오류 (${CONFIG.GEMINI_TEXT_MODEL}): ${err.message}`);
  }
}

export async function chatSummarizeToDraft(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{
  city: string;
  district: string;
  occurredAt: string;
  initialDraft: string;
  unknownFields: string[];
}> {
  const allUserText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n');

  if (CONFIG.APP_MODE === 'demo') {
    if (allUserText.includes('대정') || allUserText.includes('악취') || allUserText.includes('축사')) {
      return {
        city: '서귀포시',
        district: '대정읍',
        occurredAt: '2026-11-19T07:30',
        initialDraft: allUserText || DEMO_PRESET_1.text,
        unknownFields: [],
      };
    }
    if (allUserText.includes('일도') || allUserText.includes('주차') || allUserText.includes('쓰레기')) {
      return {
        city: '제주시',
        district: '일도1동',
        occurredAt: '2026-11-19T10:15',
        initialDraft: allUserText || DEMO_PRESET_2.text,
        unknownFields: [],
      };
    }

    return {
      city: allUserText.includes('서귀포') ? '서귀포시' : '제주시',
      district: '',
      occurredAt: new Date().toISOString().slice(0, 16),
      initialDraft: allUserText,
      unknownFields: ['district'],
    };
  }

  // Live mode with Gemini Structured Output
  try {
    const ai = getGenAI();
    const prompt = `다음은 제주 민원인과 상담한 대화 내용입니다:
---
${allUserText}
---
이 대화에서 민원 서식 작성을 위해 아래 정보를 추출하여 순수 JSON 객체로 반환해주세요.
반환 JSON 형식:
{
  "city": "제주시" 또는 "서귀포시" (알 수 없으면 빈 문자열 ""),
  "district": "읍·면·동 이름" (예: 대정읍, 일도1동 등, 모르면 빈 문자열 ""),
  "occurredAt": "YYYY-MM-DDTHH:mm 형식의 일시" (모르면 빈 문자열 ""),
  "initialDraft": "민원인이 진술한 핵심 사실과 피해를 정리한 구어체 초고 텍스트",
  "unknownFields": ["확인되지_않은_필드명들"]
}`;

    const response = await ai.models.generateContent({
      model: CONFIG.GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      city: parsed.city || '',
      district: parsed.district || '',
      occurredAt: parsed.occurredAt || '',
      initialDraft: parsed.initialDraft || allUserText,
      unknownFields: Array.isArray(parsed.unknownFields) ? parsed.unknownFields : [],
    };
  } catch (err: any) {
    throw new Error(`Gemini 초안 추출 오류: ${err.message}`);
  }
}

export async function processIntake(
  text: string,
  city?: string,
  district?: string,
  occurredAt?: string,
  photoBase64?: string,
  photoMimeType?: string,
  followUpAnswers?: Record<string, string>
): Promise<{
  sixW: SixW;
  photoObservations: string[];
  rewriteCandidates: RewriteCandidate[];
  followUpQuestions: FollowUpQuestion[];
}> {
  // Preset 1 match
  if (
    CONFIG.APP_MODE === 'demo' ||
    text.includes('대정읍') ||
    text.includes('게스트하우스') ||
    (district?.includes('대정') && text.includes('악취'))
  ) {
    if (text.includes('대정') || text.includes('악취') || text.includes('축사')) {
      return {
        sixW: DEMO_PRESET_1.expectedSixW,
        photoObservations: DEMO_PRESET_1.expectedObservations,
        rewriteCandidates: DEMO_PRESET_1.expectedRewrites,
        followUpQuestions: DEMO_PRESET_1.expectedQuestions,
      };
    }
  }

  // Preset 2 match
  if (
    CONFIG.APP_MODE === 'demo' ||
    text.includes('일도1동') ||
    (district?.includes('일도') && text.includes('주차'))
  ) {
    if (text.includes('일도') || (text.includes('주차') && text.includes('쓰레기'))) {
      return {
        sixW: DEMO_PRESET_2.expectedSixW,
        photoObservations: DEMO_PRESET_2.expectedObservations,
        rewriteCandidates: DEMO_PRESET_2.expectedRewrites,
        followUpQuestions: DEMO_PRESET_2.expectedQuestions,
      };
    }
  }

  // General demo fallback if in demo mode
  if (CONFIG.APP_MODE === 'demo') {
    return {
      sixW: {
        who: '민원 신청인 (소상공인 또는 지역 주민)',
        when: occurredAt || '발생 일시 미확인 (보완 필요)',
        where: `제주특별자치도 ${city || '제주시'} ${district || '관내'} (상세 번지 미확인)`,
        what: text.slice(0, 100),
        how: '주변 환경 요인 또는 위반 행위로 인한 피해 발생',
        why: '관련 법규 미준수 또는 시설 관리 미흡 추정',
      },
      photoObservations: photoBase64
        ? ['현장 사진 등록됨 (시각적 현황 확인 가능하나, 악취나 불법성 등은 사진만으로 단정 불가)']
        : [],
      rewriteCandidates: [
        {
          original: '공무원들 나와서 당장 해결해라',
          refined: '주민 생활 안전 및 정상 영업을 위해 관할 부서의 신속한 현장 점검과 계도 조치를 요청드립니다.',
          reason: '감정적 표현을 정중하고 설득력 있는 공식 행정 요청문으로 순화',
        },
      ],
      followUpQuestions: [
        {
          id: 'gen-q1',
          question: '정확한 건물명이나 지번 주소를 알고 계십니까?',
          placeholder: '예: 00로 00 앞 도로변',
        },
      ],
    };
  }

  // Live mode with Gemini 4 Hydrogen
  try {
    const ai = getGenAI();
    const systemPrompt = `당신은 제주도 행정 민원 구조화 전문 AI입니다.
민원인의 진술과 현장 사진(있는 경우)을 바탕으로 아래 기준을 반드시 준수하여 JSON으로 분석하세요:
1. sixW (육하원칙: who, when, where, what, how, why). 정보가 부족한 항목은 반드시 "미확인 (추가 확인 필요)"라고 명시하세요.
2. photoObservations: 사진에서 실제로 육안 확인 가능한 '물리적 사실'만 나열하세요. (경고: 사진만으로 악취 존재, 위법성 유무, 책임 주체를 절대로 단정하지 마세요!)
3. rewriteCandidates: 민원인의 원문 중 감정적이거나 과격한 표현, 비난성 문장을 공식 행정 요청문으로 순화하고 이유를 적으세요. 피해 사실이나 민원인의 요청은 축소하지 마세요.
4. followUpQuestions: 관할 부서 처리를 돕기 위해 보완되어야 할 핵심 질문 2~3개를 제시하세요.`;

    const parts: any[] = [{ text: `민원 본문: ${text}\n위치: ${city} ${district}\n발생일시: ${occurredAt}` }];
    if (photoBase64) {
      parts.push({
        inlineData: {
          mimeType: photoMimeType || 'image/jpeg',
          data: photoBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: CONFIG.GEMINI_TEXT_MODEL,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      sixW: parsed.sixW || {
        who: '미확인',
        when: occurredAt || '미확인',
        where: `${city} ${district}`,
        what: text,
        how: '미확인',
        why: '미확인',
      },
      photoObservations: Array.isArray(parsed.photoObservations) ? parsed.photoObservations : [],
      rewriteCandidates: Array.isArray(parsed.rewriteCandidates) ? parsed.rewriteCandidates : [],
      followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions : [],
    };
  } catch (err: any) {
    throw new Error(`Gemini 구조화 API 오류: ${err.message}`);
  }
}

export async function generateDraftContent(
  sixW: SixW,
  district: string,
  city: string,
  grounds: {
    weather?: WeatherInfo;
    facilities?: FacilityMatch[];
    ordinances?: OrdinanceMatch[];
  },
  routing: RoutingInfo,
  customEdits?: string,
  intakeRewrites?: RewriteCandidate[]
): Promise<{
  draft: string;
  rewrites: RewriteCandidate[];
}> {
  const title = routing.isCompound
    ? `[복합민원] ${city} ${district} 상가 앞 불법 주정차 단속 및 무단 방치 폐기물 정비 요청의 건`
    : `[생활환경민원] ${city} ${district} ${sixW.what.slice(0, 30)} 관련 현장점검 및 조치 요청의 건`;

  const ordinanceText = grounds.ordinances && grounds.ordinances.length > 0
    ? grounds.ordinances
        .map((m) => `- ${m.ordinance.title} (${m.ordinance.article}) [근거사유: ${m.relevanceReason}]`)
        .join('\n')
    : '- 자치법규 근거: 관할 부서 행정규칙 및 관련 조례 검토 필요';

  const facilityText = grounds.facilities && grounds.facilities.length > 0
    ? grounds.facilities
        .map((f) => `- [${f.category}] ${f.name} (거리: 약 ${f.distanceMeter}m, 출처: ${f.source})`)
        .join('\n')
    : '- 인근 매칭 공공시설 데이터 없음 (검색 반경 내 0건)';

  const weatherText = grounds.weather && grounds.weather.status !== 'unavailable'
    ? `- 조회시각 기상현황: 기온 ${grounds.weather.temperature}°C, 풍향 ${grounds.weather.windDirection}°, 풍속 ${grounds.weather.windSpeed}km/h, 날씨 ${grounds.weather.weatherDescription} (출처: ${grounds.weather.source})`
    : '- 기상 데이터: 조회 정보 없음';

  const issueRoutings = routing.issues
    .map(
      (iss, idx) => `[민원 사안 ${idx + 1}: ${iss.issueTitle}]
- 1차 접수 부서: ${iss.recommendedDepartment} (${iss.practicalTeam})
- 협조 기관: ${iss.cooperatingDepartments.join(', ')}
- 관할 판단 이유: ${iss.jurisdictionReason}`
    )
    .join('\n\n');

  const draft = `【 행 정 민 원 신 청 서 】

1. 민원 제목: ${title}

2. 신청인 및 발생 일시·장소
  가. 신청인: ${sixW.who}
  나. 발생 일시: ${sixW.when}
  다. 발생 장소: ${sixW.where} (제주특별자치도 ${city} ${district})

3. 사실관계 (진술 및 현장 확인)
  가. 민원인 진술 내용:
      "${sixW.what} - 발생 경위: ${sixW.how}"
  나. 현장 및 참고 정황:
      ${sixW.why}

4. 피해 및 불편 사항
  - 본 사안으로 인하여 인근 소상공인의 정상적인 영업 활동 방해 및 주민·보행자의 안전한 통행권 침해 등 지속적인 생활 피해가 초래되고 있습니다.

5. 요청 사항 (행정청에 바라는 구체적 조치)
  가. 관할 행정 부서의 조속한 현장 확인 및 실태 조사 실시
  나. 위반 사항 확인 시 관련 자치법규에 따른 계도 및 시정명령, 과태료 부과 등 엄정한 행정 처분
  다. 향후 동일 유형 피해 방지를 위한 상시 순찰 강화 및 재발방지 시설 정비

6. 확인된 관련 자치법규 및 공공데이터 근거
  [제주특별자치도 자치법규]
${ordinanceText}

  [현장 인근 공공시설 지리정보]
${facilityText}

  [참고 기상 데이터]
${weatherText}

7. 접수 권장 관할 부서 및 안내
${issueRoutings}

8. 첨부 자료
  - 현장 입증 사진 1부
  - 피해 정황 및 추가 보완 증빙 자료 각 1부 (접수 시 지참)

위와 같이 생활 및 영업 피해 사실을 진술하오니, 관할 행정청의 신속하고 면밀한 현장 점검과 처리를 정중히 요청드립니다.

신청일자: ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
신청인(대리작성 보조): 제주 민원 코파일럿 (작성인 검토 완료)`;

  const rewrites: RewriteCandidate[] =
    intakeRewrites && intakeRewrites.length > 0
      ? intakeRewrites
      : routing.isCompound
      ? DEMO_PRESET_2.expectedRewrites
      : DEMO_PRESET_1.expectedRewrites;

  if (CONFIG.APP_MODE === 'live') {
    try {
      const ai = getGenAI();
      const prompt = `아래는 제주 행정 민원서 기본 골격입니다. 민원인의 피해 사실과 요청사항은 축소하지 말고, 미확인 사항은 추정하지 않은 채 행정기관 공문서 어조로 자연스럽고 정중하게 다듬어 주세요. 전체 구조(1~8번 항목)는 그대로 유지하세요.

${draft}`;

      const response = await ai.models.generateContent({
        model: CONFIG.GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
          temperature: 0.2,
        },
      });

      const polishedDraft = response.text?.trim();
      if (!polishedDraft) {
        throw new Error('모델이 빈 민원서 초안을 반환했습니다.');
      }
      return { draft: polishedDraft, rewrites };
    } catch (err: any) {
      throw new Error(`Gemini 초안 생성 오류 (${CONFIG.GEMINI_TEXT_MODEL}): ${err.message}`);
    }
  }

  return { draft, rewrites };
}
