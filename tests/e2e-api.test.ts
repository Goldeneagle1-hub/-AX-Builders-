import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('End-to-End API Routes Verification (Live on Port 3000)', () => {
  it('serves SPA HTML on root /', async () => {
    const res = await fetch(`${BASE_URL}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('제주 민원 코파일럿');
  });

  it('GET /api/health returns server mode and status', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.status).toBe('ok');
    expect(['demo', 'live']).toContain(json.data.mode);
  });

  it('POST /api/chat-intake returns conversational guidance', async () => {
    const res = await fetch(`${BASE_URL}/api/chat-intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: '하모리 축사 악취 때문에 손님들이 환불을 요구합니다' }],
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.reply).toBeDefined();
    expect(json.data.reply.length).toBeGreaterThan(10);
    expect(json.meta.mode).toBe('demo');
  });

  it('POST /api/chat-summarize extracts structured location and draft', async () => {
    const res = await fetch(`${BASE_URL}/api/chat-summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: '서귀포시 대정읍 하모리에서 숙박업소를 운영 중인데 매일 아침 악취가 심합니다.' },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.city).toBe('서귀포시');
    expect(json.data.district).toBe('대정읍');
  });

  it('POST /api/intake processes Preset 1 (Daejeong Odor) without asserting odor solely from photo', async () => {
    const res = await fetch(`${BASE_URL}/api/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '대정읍 하모리 숙박업소 인근 축사 악취 단속 요청',
        city: '서귀포시',
        district: '대정읍',
        occurredAt: '2026-11-19T07:30',
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    const data = json.data;

    expect(data.sixW.where).toContain('대정읍');
    expect(data.photoObservations.length).toBeGreaterThan(0);
    // Strict requirement: Never assert odor solely from photo!
    const photoText = data.photoObservations.join(' ');
    expect(photoText).toContain('사진만으로 악취 물질 유무 및 위법성은 단정할 수 없음');
    expect(data.rewriteCandidates.length).toBeGreaterThan(0);
  });

  it('POST /api/ground-and-route matches Open-Meteo weather, facilities, and Jeju ordinances', async () => {
    const res = await fetch(`${BASE_URL}/api/ground-and-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sixW: {
          who: '게스트하우스 운영자',
          when: '오전 7시 30분',
          where: '서귀포시 대정읍 하모리',
          what: '인근 양돈 축사 악취 유입',
          how: '북서풍 타고 확산',
          why: '배출기준 위반 추정',
        },
        district: '대정읍',
        city: '서귀포시',
        gps: { lat: 33.2264, lng: 126.2512 },
        citedOrdinanceIds: ['ord-odor-01'],
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    const data = json.data;

    // Weather
    expect(data.weather).toBeDefined();
    expect(data.weather.temperature).toBeDefined();
    expect(data.weather.windDirection).toBeDefined();
    expect(data.weather.isModelReference).toBe(true);

    // Facilities
    expect(data.facilities.length).toBeGreaterThan(0);
    expect(data.facilities[0].category).toBeDefined();

    // Ordinances
    expect(data.ordinanceMatches.length).toBeGreaterThan(0);
    expect(data.ordinanceMatches[0].ordinance.title).toContain('악취');

    // Routing
    expect(data.routing.issues[0].recommendedDepartment).toContain('서귀포시 기후환경과');
    expect(data.routing.issues[0].practicalTeam).toContain('환경지도팀');
  });

  it('POST /api/ground-and-route splits Preset 2 (Ildo 1-dong) into compound issues (Parking + Waste)', async () => {
    const res = await fetch(`${BASE_URL}/api/ground-and-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sixW: {
          who: '상가 점주',
          when: '오전 10시 15분',
          where: '제주시 일도1동 중앙로 상가 입구',
          what: '황색실선 불법주정차 및 종량제 미규격 쓰레기 방치',
          how: '차량 무단주차 및 폐기물 무단투기',
          why: '단속 부재',
        },
        district: '일도1동',
        city: '제주시',
        gps: { lat: 33.5132, lng: 126.5269 },
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    const data = json.data;

    // Must be compound
    expect(data.routing.isCompound).toBe(true);
    expect(data.routing.issues.length).toBe(2);

    const categories = data.routing.issues.map((i: any) => i.category);
    expect(categories).toContain('불법주정차·교통');
    expect(categories).toContain('폐기물·쓰레기');
  });

  it('POST /api/draft creates structured complaint, rewrites, and follow-up guidance', async () => {
    const res = await fetch(`${BASE_URL}/api/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sixW: {
          who: '대정읍 하모리 게스트하우스 운영자',
          when: '2026년 11월 19일 07:30',
          where: '제주특별자치도 서귀포시 대정읍 하모리',
          what: '양돈 배출시설 추정 가축분뇨 악취 유입',
          how: '기류에 따른 상가 유입',
          why: '악취방지설비 미가동 의심',
        },
        district: '대정읍',
        city: '서귀포시',
        grounds: {
          weather: {
            status: 'demo',
            isModelReference: true,
            isGpsBased: true,
            locationName: '서귀포시 대정읍',
            coordinates: { lat: 33.2264, lng: 126.2512 },
            temperature: 17.5,
            humidity: 78,
            windSpeed: 14.4,
            windDirection: 315,
            precipitation: 0,
            weatherCode: 3,
            weatherDescription: '흐림',
            baseTime: '2026-11-19T07:00:00Z',
            queriedAt: '2026-11-19T07:30:00Z',
            source: 'Open-Meteo',
          },
          facilities: [],
          ordinances: [],
        },
        routing: {
          isCompound: false,
          issues: [
            {
              issueTitle: '악취 환경 민원',
              category: '악취·환경',
              recommendedDepartment: '서귀포시 기후환경과',
              cooperatingDepartments: ['서귀포시 축산과'],
              practicalTeam: '환경지도팀',
              jurisdictionReason: '악취방지법 및 조례 규정',
              hierarchy: {
                province: '제주도 본청',
                city: '서귀포시',
                community: '대정읍',
              },
              channels: [],
              checklist: ['포집검사 요청'],
            },
          ],
          primaryChannel: {
            name: '국민신문고',
            url: 'https://www.epeople.go.kr',
            description: '정부 포털',
          },
          disclaimer: '보조 안내',
        },
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    const data = json.data;

    expect(data.draft).toContain('행 정 민 원 신 청 서');
    expect(data.draft).toContain('서귀포시 대정읍');
    expect(data.rewrites.length).toBeGreaterThan(0);
    expect(data.followUpGuide.responseDeadlines).toContain('7일');
    expect(data.followUpGuide.evidenceTips.length).toBe(3);
    expect(data.followUpGuide.officialDisclaimer).toContain('공식 접수를 대행하거나 처리 결과를 보장하지 않습니다');
  });

  it('POST /api/transcribe returns speech transcription in demo mode', async () => {
    const res = await fetch(`${BASE_URL}/api/transcribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        mimeType: 'audio/webm',
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.transcript).toContain('대정읍');
  });

  it('POST /api/transcribe rejects unsupported MIME types with 415', async () => {
    const res = await fetch(`${BASE_URL}/api/transcribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64: 'AAAA',
        mimeType: 'application/x-executable',
      }),
    });
    expect(res.status).toBe(415);
    const json = await res.json();
    expect(json.error.code).toBe('UNSUPPORTED_MEDIA_TYPE');
  });
});
