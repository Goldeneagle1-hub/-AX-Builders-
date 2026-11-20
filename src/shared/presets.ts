import { JejuCity, SavedComplaint, SixW, RewriteCandidate, FollowUpQuestion } from './types.js';

export interface DemoPreset {
  id: 'preset-daejeong-odor' | 'preset-ildo-complex';
  title: string;
  badge: string;
  city: JejuCity;
  district: string;
  gps: { lat: number; lng: number };
  occurredAt: string;
  text: string;
  photoUrl: string;
  photoDescription: string;
  photoConsentNotice: string;
  category: string;
  expectedSixW: SixW;
  expectedObservations: string[];
  expectedRewrites: RewriteCandidate[];
  expectedQuestions: FollowUpQuestion[];
}

export const DEMO_PRESET_1: DemoPreset = {
  id: 'preset-daejeong-odor',
  title: '서귀포시 대정읍 숙박업소 인근 악취 민원',
  badge: '환경·악취 단일 민원',
  city: '서귀포시',
  district: '대정읍',
  gps: { lat: 33.2264, lng: 126.2512 },
  occurredAt: '2026-11-19T07:30',
  text: '대정읍 하모리에서 게스트하우스를 운영 중입니다. 매일 아침과 저녁만 되면 인근 양돈 축사 쪽에서 참을 수 없는 분뇨 냄새와 악취가 넘어와 손님들이 창문도 못 열고 환불 요청까지 하고 있습니다. 서귀포시청은 도대체 단속을 하는 건지 마는 건지 모르겠는데 당장 현장 점검하고 배출허용기준 위반 여부 조사해주세요.',
  photoUrl: '/assets/preset1-odor.svg',
  photoDescription: '시연용 예시 이미지 (건물 외벽, 원거리 환기 배관 및 도로 풍경 - 실제 사건 증빙 아님)',
  photoConsentNotice: '현장 확인 참고용 시연 이미지입니다. 실제 민원 시 인근 축사 배출구 또는 외벽 사진을 첨부할 수 있습니다.',
  category: '악취·환경',
  expectedSixW: {
    who: '대정읍 하모리 게스트하우스 운영 소상공인(민원인) 및 투숙객',
    when: '매일 아침 및 저녁 시간대 반복 발생 (최근 2026년 11월 19일 07:30 확인)',
    where: '제주특별자치도 서귀포시 대정읍 하모리 숙박시설 밀집 지역 (위도 33.2264, 경도 126.2512)',
    what: '인근 양돈 배출시설 추정 분뇨 악취 유입으로 인한 환기 곤란, 투숙객 환불 요청 등 영업 피해',
    how: '풍향 및 기류에 따라 인근 시설에서 발생하는 악취가 상업·주거 구역으로 확산 유입',
    why: '축사 악취방지시설 미가동 의심 및 배출허용기준 초과 운영 가능성',
  },
  expectedObservations: [
    '다세대·숙박시설 외벽 및 창호 구조물 확인 (실내 환기 창문 위치 식별)',
    '원거리 도로변 및 환기 덕트 추정 설비 육안 관찰 (사진만으로 악취 물질 유무 및 위법성은 단정할 수 없음)',
    '인근 지목 및 농경지 경계 도로 시각적 확인',
  ],
  expectedRewrites: [
    {
      original: '서귀포시청은 도대체 단속을 하는 건지 마는 건지 모르겠는데 당장 현장 점검하고',
      refined: '숙박업소 투숙객 환불 및 정상 영업 피해가 심각하오니, 관할 부서에서 조속히 현장 악취 포집 및 점검을 실시하여 주시기 바랍니다.',
      reason: '행정기관에 대한 비난 표현을 지양하고, 구체적인 영업 피해 사실과 조속한 현장 점검 요청 목적을 명확히 함',
    },
    {
      original: '참을 수 없는 분뇨 냄새와 악취가 넘어와',
      refined: '반복적으로 유입되는 고농도 가축분뇨 추정 악취로 인해',
      reason: '주관적 감정 표현을 객관적인 피해 현황 기술로 순화',
    },
  ],
  expectedQuestions: [
    {
      id: 'q1',
      question: '악취가 가장 극심하게 체감되는 특정 풍향(예: 북서풍, 남동풍)이나 날씨 조건이 있습니까?',
      placeholder: '예: 흐리거나 북서풍이 부는 아침 시간대에 특히 심함',
      answer: '흐리고 북서풍이 부는 오전 7~9시 사이에 가장 심하게 체감됨',
    },
    {
      id: 'q2',
      question: '투숙객 환불 또는 예약 취소 등 영업 피해를 입증할 수 있는 객관적 기록(예약 내역 등)이 구비되어 있습니까?',
      placeholder: '예: 11월 중 환불 영수증 3건 및 고객 후기 보관 중',
      answer: '최근 2주간 악취로 인한 고객 항의 4건 및 환불 영수증 2건 보관 중',
    },
  ],
};

export const DEMO_PRESET_2: DemoPreset = {
  id: 'preset-ildo-complex',
  title: '제주시 일도1동 상가 앞 불법 주정차·쓰레기 방치 민원',
  badge: '교통 + 환경 복합 민원',
  city: '제주시',
  district: '일도1동',
  gps: { lat: 33.5132, lng: 126.5269 },
  occurredAt: '2026-11-19T10:15',
  text: '제주시 일도1동 중앙로 상가 입구입니다. 매일 점심 저녁 시간마다 불법 주정차 차량들이 황색실선 구역에 줄지어 주차해서 손님들 출입로가 완전히 막히고 납품 트럭도 못 들어옵니다. 게다가 상가 코너 화단 앞에는 종량제 봉투도 안 쓴 불법 쓰레기 박스들이 며칠째 쌓여 있어서 냄새나고 미관을 다 해치고 있습니다. 제주시청 공무원들 나와서 차들 싹 다 견인하고 쓰레기 치워주세요.',
  photoUrl: '/assets/preset2-parking.svg',
  photoDescription: '시연용 예시 이미지 (상가 진입로 노면 황색실선, 주차 차량 및 종량제 미규격 박스 적치 - 실제 사건 증빙 아님)',
  photoConsentNotice: '현장 확인 참고용 시연 이미지입니다. 실제 민원 시 차량 번호판 및 적치물 전경 사진을 첨부할 수 있습니다.',
  category: '불법주정차·교통',
  expectedSixW: {
    who: '제주시 일도1동 중앙로 상가 점주 및 방문 고객, 보행자',
    when: '2026년 11월 19일 10:15경 (매일 점심·저녁 상업시간대 상습 반복)',
    where: '제주특별자치도 제주시 일도1동 중앙로 상가 진입로 및 코너 화단 앞 (위도 33.5132, 경도 126.5269)',
    what: '상가 주출입구 황색실선 불법 주정차로 인한 통행로 차단 및 미규격 생활폐기물 무단 적치 방치',
    how: '방문 차량의 황색실선 상습 무단 주차 및 인근 유동인구·사업장의 미규격 폐기물 무단 투기 누적',
    why: '인근 주차 공간 부족 및 단속 CCTV 사각지대 존재, 클린하우스 배출 수칙 미준수',
  },
  expectedObservations: [
    '상가 건물 주출입로 노면 황색실선 구역에 정차된 차량 2대 식별 (교통방해 요소 관찰)',
    '상가 코너 노면에 종량제 봉투가 아닌 종이박스 및 비닐 묶음 적치물 3개 관찰',
    '보행자 인도 및 납품 차량 진입 공간 협소 상태 육안 확인',
  ],
  expectedRewrites: [
    {
      original: '제주시청 공무원들 나와서 차들 싹 다 견인하고 쓰레기 치워주세요.',
      refined: '보행자 안전 통행과 소상공인 영업 정상화를 위해 관할 부서의 불법 주정차 단속(계도 및 견인)과 방치 폐기물의 신속한 수거 조치를 요청드립니다.',
      reason: '감정적이고 명령조의 표현을 정중하고 구체적인 행정 조치(단속 및 수거) 요청으로 순화',
    },
    {
      original: '손님들 출입로가 완전히 막히고 납품 트럭도 못 들어옵니다',
      refined: '상가 주진입로 차단으로 고객 보행 안전 위협 및 납품 차량 진입 불가 피해가 가중되고 있습니다',
      reason: '피해 사실을 명확하고 설득력 있는 행정 용어로 정리',
    },
  ],
  expectedQuestions: [
    {
      id: 'q1',
      question: '불법 주정차 차량에 대해 1분 이상 간격을 둔 동일 각도 안전신문고 신고용 사진을 확보하셨습니까?',
      placeholder: '예: 정면 번호판 및 황색실선 포함 사진 2장 촬영 완료',
      answer: '차량 번호판 및 상가 입구 황색실선 표시가 식별되는 사진 2장 확보함',
    },
    {
      id: 'q2',
      question: '방치 폐기물 내에 배출자 신원을 확인할 수 있는 택배 송장이나 영수증 등이 포함되어 있습니까?',
      placeholder: '예: 미확인 상태이며 추가 확인 예정',
      answer: '미확인 상태이나 상가 주변 방범 CCTV 확인을 요청할 계획임',
    },
  ],
};

// Initial 8 demo complaints for /stats and /history
export const INITIAL_DEMO_COMPLAINTS: SavedComplaint[] = [
  {
    id: 'demo-comp-01',
    title: '서귀포시 대정읍 숙박업소 인근 양돈 축사 악취 단속 요청',
    city: '서귀포시',
    district: '대정읍',
    category: '악취·환경',
    occurredAt: '2026-11-19 07:30',
    savedAt: '2026-11-19T07:45:00.000Z',
    source: 'demo',
    draftContent: `[민원서 초안]
제목: 서귀포시 대정읍 하모리 숙박상권 인근 가축분뇨 악취 합동 포집 점검 요청
발생위치: 제주특별자치도 서귀포시 대정읍 하모리 일대
사실관계: 매일 오전·저녁 시간대 북서풍을 타고 가축분뇨 추정 악취가 유입되어 게스트하우스 투숙객 환불 및 영업 피해 발생.
요청사항: 서귀포시 기후환경과 환경지도팀 현장 악취포집 및 배출허용기준 위반 여부 조사 및 행정지도 요청.`,
    rewrites: DEMO_PRESET_1.expectedRewrites,
    summary: '축사 분뇨 악취로 인한 숙박시설 영업 피해 및 현장 포집 검사 요청 건',
  },
  {
    id: 'demo-comp-02',
    title: '제주시 일도1동 상가 진입로 황색실선 불법주정차 및 폐기물 방치 정비 요청',
    city: '제주시',
    district: '일도1동',
    category: '불법주정차·교통',
    occurredAt: '2026-11-19 10:15',
    savedAt: '2026-11-19T10:30:00.000Z',
    source: 'demo',
    draftContent: `[민원서 초안 - 복합민원 1]
제목: 일도1동 중앙로 상가 앞 황색실선 상습 불법 주정차 단속 및 규제봉 설치 요청
발생위치: 제주특별자치도 제주시 일도1동 1145-1 일대
사실관계: 점심·저녁 시간 상가 주출입구 황색실선에 차량 2~3대가 상습 주차하여 고객 통행 및 납품 불가.
요청사항: 제주시 교통행정과 이동식 단속차량 순찰 강화 및 차선 분리 규제봉 설치 검토.`,
    rewrites: DEMO_PRESET_2.expectedRewrites,
    summary: '상가 진입로 불법주정차 단속 및 미규격 쓰레기 신속 수거 복합 민원 건',
  },
  {
    id: 'demo-comp-03',
    title: '제주시 연동 누웨마루거리 상가 골목 심야 확성기 및 버스킹 소음 규제 요청',
    city: '제주시',
    district: '연동',
    category: '악취·환경',
    occurredAt: '2026-11-18 22:40',
    savedAt: '2026-11-18T23:00:00.000Z',
    source: 'demo',
    draftContent: '심야 시간대 기준치 초과 확성기 소음으로 인한 인근 소상공인 및 거주민 수면 방해 및 소음측정 요청',
    rewrites: [],
    summary: '연동 상업거리 야간 생활소음 기준 초과 점검 요청 건',
  },
  {
    id: 'demo-comp-04',
    title: '제주시 노형동 드림타워 인근 보도블록 침하 및 빗물받이 파손 보수',
    city: '제주시',
    district: '노형동',
    category: '도로·보도시설',
    occurredAt: '2026-11-17 14:20',
    savedAt: '2026-11-17T15:00:00.000Z',
    source: 'demo',
    draftContent: '보행자 통행량이 많은 인도 구간의 빗물받이 덮개 파손 및 단차로 인한 낙상 위험 긴급 정비 요청',
    rewrites: [],
    summary: '노형동 번화가 보도블록 파손 긴급 보수 건',
  },
  {
    id: 'demo-comp-05',
    title: '서귀포시 서홍동 클린하우스 재활용 요일제 위반 및 무단투기 단속',
    city: '서귀포시',
    district: '서홍동',
    category: '폐기물·쓰레기',
    occurredAt: '2026-11-16 19:10',
    savedAt: '2026-11-16T19:35:00.000Z',
    source: 'demo',
    draftContent: '클린하우스 주변에 비규격 비닐봉지 무단 투기 및 고정형 CCTV를 활용한 과태료 부과 요청',
    rewrites: [],
    summary: '서홍동 주거지 클린하우스 무단투기 과태료 부과 및 단속 요청',
  },
  {
    id: 'demo-comp-06',
    title: '제주시 한림읍 협재포구 인근 해안폐기물 및 폐그물 긴급 수거',
    city: '제주시',
    district: '한림읍',
    category: '폐기물·쓰레기',
    occurredAt: '2026-11-15 11:00',
    savedAt: '2026-11-15T11:40:00.000Z',
    source: 'demo',
    draftContent: '조류에 의해 밀려든 폐어망 및 스티로폼 부표가 해안 산책로에 방치되어 관광 미관 훼손 및 환경지킴이 투입 요청',
    rewrites: [],
    summary: '한림읍 해안도로 폐어망 및 해양쓰레기 수거 요청',
  },
  {
    id: 'demo-comp-07',
    title: '서귀포시 성산읍 성산일출봉 진입로 어린이보호구역 횡단보도 도색 퇴색',
    city: '서귀포시',
    district: '성산읍',
    category: '도로·보도시설',
    occurredAt: '2026-11-14 16:30',
    savedAt: '2026-11-14T17:10:00.000Z',
    source: 'demo',
    draftContent: '초등학교 통학로이자 관광객 렌터카 통행이 많은 보호구역 노면 표시 및 횡단보도 긴급 재도색 요청',
    rewrites: [],
    summary: '성산읍 스쿨존 노면표시 및 과속방지시설 정비 요청',
  },
  {
    id: 'demo-comp-08',
    title: '제주시 조천읍 함덕해변 상가 불법 옥외 에어라이트 및 입간판 정비',
    city: '제주시',
    district: '조천읍',
    category: '도로·보도시설',
    occurredAt: '2026-11-13 18:50',
    savedAt: '2026-11-13T19:20:00.000Z',
    source: 'demo',
    draftContent: '인도 폭이 좁은 구간에 무단 설치된 풍선형 에어라이트 전선으로 인한 보행자 전도 위험 정비 요청',
    rewrites: [],
    summary: '조천읍 함덕 관광상가 보도 침범 에어라이트 철거 계도 요청',
  },
];
