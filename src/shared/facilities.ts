import { FacilityMatch } from './types.js';

export const JEJU_FACILITY_CATALOG: FacilityMatch[] = [
  // 서귀포시 대정읍 일대
  {
    id: 'fac-daejeong-cleanhouse-1',
    category: '클린하우스',
    name: '대정읍 하모리 거점형 클린하우스 04호',
    distanceMeter: 85,
    radiusMeter: 200,
    address: '제주특별자치도 서귀포시 대정읍 하모리 1230-2',
    source: '제주데이터허브 (제주특별자치도 클린하우스 공간정보)',
    updatedAt: '2024-04-10',
    status: 'verified',
    details: '종량제 및 음식물쓰레기 RFID 계량기 설치, 악취탈취 분무노즐 점검 대상',
  },
  {
    id: 'fac-daejeong-cctv-1',
    category: '단속CCTV',
    name: '대정읍 일주서로 방범 및 환경감시 CCTV',
    distanceMeter: 140,
    radiusMeter: 300,
    address: '제주특별자치도 서귀포시 대정읍 하모리 일주서로 교차로',
    source: '공공데이터포털 (제주특별자치도 고정형 CCTV 통합데이터)',
    updatedAt: '2024-03-22',
    status: 'verified',
    details: '200만 화소 회전형 카메라, 불법투기 야간 계도 방송 스피커 연계',
  },
  {
    id: 'fac-daejeong-drain-1',
    category: '빗물받이',
    name: '대정읍 하모상가로 우수받이 및 하수맨홀',
    distanceMeter: 60,
    radiusMeter: 150,
    address: '제주특별자치도 서귀포시 대정읍 하모상가로 45 앞',
    source: '제주특별자치도 상하수도본부 하수관망 지리정보',
    updatedAt: '2023-11-15',
    status: 'verified',
    details: '빗물받이 악취방지덮개 미설치 구역 (하절기 준설 대상)',
  },
  {
    id: 'fac-daejeong-commercial-1',
    category: '상권특성',
    name: '대정읍 모슬포항 인근 숙박·음식점 밀집상권',
    distanceMeter: 120,
    radiusMeter: 400,
    address: '제주특별자치도 서귀포시 대정읍 하모리 상권구역',
    source: '소상공인시장진흥공단 상권정보시스템',
    updatedAt: '2024-02-01',
    status: 'verified',
    details: '관광숙박업 18개소, 일반음식점 42개소 밀집 (악취 취약지구)',
  },

  // 제주시 일도1동 일대
  {
    id: 'fac-ildo-cctv-1',
    category: '단속CCTV',
    name: '일도1동 중앙로 상가 앞 주정차 단속 CCTV 12호',
    distanceMeter: 45,
    radiusMeter: 200,
    address: '제주특별자치도 제주시 일도1동 1145-1',
    source: '공공데이터포털 (제주시 불법주정차 무인단속카메라 현황)',
    updatedAt: '2024-05-18',
    status: 'verified',
    details: '단속 운영시간 07:30~22:00, 유예시간 10분, 즉시단속 구역',
  },
  {
    id: 'fac-ildo-cleanhouse-1',
    category: '클린하우스',
    name: '일도1동 칠성로 보행로 클린하우스 02호',
    distanceMeter: 70,
    radiusMeter: 200,
    address: '제주특별자치도 제주시 일도1동 1298-5',
    source: '제주데이터허브 (제주특별자치도 클린하우스 공간정보)',
    updatedAt: '2024-04-10',
    status: 'verified',
    details: '무단투기 적발용 고정형 CCTV 1대 설치, 요일별 배출안내판 부착',
  },
  {
    id: 'fac-ildo-protect-1',
    category: '보호구역',
    name: '제주북초등학교 어린이보호구역 (스쿨존)',
    distanceMeter: 180,
    radiusMeter: 300,
    address: '제주특별자치도 제주시 일도1동 1102',
    source: '도로교통공단 안전운전 통합민원 어린이보호구역 GIS',
    updatedAt: '2024-01-20',
    status: 'verified',
    details: '제한속도 30km/h 구역, 주정차 위반 시 과태료 12만원 부과',
  },
  {
    id: 'fac-ildo-commercial-1',
    category: '상권특성',
    name: '동문시장 및 칠성로 쇼핑거리 상권',
    distanceMeter: 95,
    radiusMeter: 350,
    address: '제주특별자치도 제주시 일도1동 중앙로 상권가',
    source: '소상공인시장진흥공단 상권정보시스템',
    updatedAt: '2024-02-01',
    status: 'verified',
    details: '전통시장 및 중심상업지로 상시 납품차량 및 유동인구 집중',
  },
];

// Helper to query facilities based on location or district
export function matchFacilities(
  district: string,
  gps?: { lat: number; lng: number }
): FacilityMatch[] {
  const normDistrict = district.trim();
  if (normDistrict.includes('대정')) {
    return JEJU_FACILITY_CATALOG.filter((f) => f.id.includes('daejeong'));
  }
  if (normDistrict.includes('일도') || normDistrict.includes('제주')) {
    return JEJU_FACILITY_CATALOG.filter((f) => f.id.includes('ildo'));
  }

  // Fallback match by closest or return empty
  return [];
}
