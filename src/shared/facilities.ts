import { FacilityMatch } from './types.js';

export interface FacilityCatalogEntry extends FacilityMatch {
  lat: number;
  lng: number;
  districtKey: string;
}

export const JEJU_FACILITY_CATALOG: FacilityCatalogEntry[] = [
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
    lat: 33.2269,
    lng: 126.2518,
    districtKey: '대정읍',
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
    lat: 33.2254,
    lng: 126.2521,
    districtKey: '대정읍',
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
    lat: 33.2261,
    lng: 126.2508,
    districtKey: '대정읍',
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
    lat: 33.2256,
    lng: 126.2505,
    districtKey: '대정읍',
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
    lat: 33.5135,
    lng: 126.5266,
    districtKey: '일도1동',
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
    lat: 33.5138,
    lng: 126.5273,
    districtKey: '일도1동',
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
    lat: 33.5121,
    lng: 126.5255,
    districtKey: '일도1동',
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
    lat: 33.5128,
    lng: 126.5276,
    districtKey: '일도1동',
  },

  // 제주시 연동 일대
  {
    id: 'fac-yeondong-commercial-1',
    category: '상권특성',
    name: '연동 누웨마루거리 중심상권',
    distanceMeter: 90,
    radiusMeter: 350,
    address: '제주특별자치도 제주시 연동 273-10 일대',
    source: '소상공인시장진흥공단 상권정보시스템',
    updatedAt: '2024-02-01',
    status: 'verified',
    details: '야간 보행자·음식점 밀집 구역 (소음·주정차 민원 빈발)',
    lat: 33.4892,
    lng: 126.4906,
    districtKey: '연동',
  },
  {
    id: 'fac-yeondong-cctv-1',
    category: '단속CCTV',
    name: '연동 신제주로터리 주정차 무인단속 CCTV',
    distanceMeter: 130,
    radiusMeter: 300,
    address: '제주특별자치도 제주시 연동 262-1',
    source: '공공데이터포털 (제주시 불법주정차 무인단속카메라 현황)',
    updatedAt: '2024-05-18',
    status: 'verified',
    details: '상습 정체 구간 고정형 단속 카메라 운영',
    lat: 33.4899,
    lng: 126.4914,
    districtKey: '연동',
  },

  // 제주시 노형동 일대
  {
    id: 'fac-nohyeong-drain-1',
    category: '빗물받이',
    name: '노형오거리 인근 보행로 우수받이 및 배수시설',
    distanceMeter: 80,
    radiusMeter: 250,
    address: '제주특별자치도 제주시 노형동 915 일대',
    source: '제주특별자치도 상하수도본부 하수관망 지리정보',
    updatedAt: '2024-01-15',
    status: 'verified',
    details: '집중호우 및 보도블록 침하 점검 대상 구역',
    lat: 33.4856,
    lng: 126.4816,
    districtKey: '노형동',
  },

  // 제주시 한림읍·애월읍·조천읍
  {
    id: 'fac-hallim-cleanhouse-1',
    category: '클린하우스',
    name: '한림읍 협재리 해안변 재활용도움센터',
    distanceMeter: 110,
    radiusMeter: 400,
    address: '제주특별자치도 제주시 한림읍 협재리 2497-1',
    source: '제주데이터허브 (제주특별자치도 클린하우스 공간정보)',
    updatedAt: '2024-04-10',
    status: 'verified',
    details: '해수욕장 관광객 및 해양폐기물 임시 집하 연계 거점',
    lat: 33.3941,
    lng: 126.2398,
    districtKey: '한림읍',
  },
  {
    id: 'fac-aewol-cctv-1',
    category: '단속CCTV',
    name: '애월읍 애월해안로 주정차·방범 CCTV',
    distanceMeter: 150,
    radiusMeter: 350,
    address: '제주특별자치도 제주시 애월읍 애월리 2540',
    source: '공공데이터포털 (제주시 고정형 CCTV 통합데이터)',
    updatedAt: '2024-03-22',
    status: 'verified',
    details: '카페거리 및 해안도로 불법 주정차 계도 구역',
    lat: 33.4628,
    lng: 126.3106,
    districtKey: '애월읍',
  },
  {
    id: 'fac-jocheon-commercial-1',
    category: '상권특성',
    name: '조천읍 함덕해수욕장 상가 밀집구역',
    distanceMeter: 100,
    radiusMeter: 400,
    address: '제주특별자치도 제주시 조천읍 함덕리 1008',
    source: '소상공인시장진흥공단 상권정보시스템',
    updatedAt: '2024-02-01',
    status: 'verified',
    details: '해변 상가 및 옥외광고물·보도 적치물 집중 점검 구역',
    lat: 33.5432,
    lng: 126.6695,
    districtKey: '조천읍',
  },

  // 서귀포시 성산읍·서홍동
  {
    id: 'fac-seongsan-protect-1',
    category: '보호구역',
    name: '성산읍 성산초등학교 어린이보호구역',
    distanceMeter: 160,
    radiusMeter: 350,
    address: '제주특별자치도 서귀포시 성산읍 성산리 172',
    source: '도로교통공단 안전운전 통합민원 어린이보호구역 GIS',
    updatedAt: '2024-01-20',
    status: 'verified',
    details: '관광객 통행량 집중 구간, 시속 30km 제한 및 노면 표시 관리',
    lat: 33.4618,
    lng: 126.9325,
    districtKey: '성산읍',
  },
  {
    id: 'fac-seohong-cleanhouse-1',
    category: '클린하우스',
    name: '서귀포시 서홍동 주거지 거점 클린하우스',
    distanceMeter: 90,
    radiusMeter: 300,
    address: '제주특별자치도 서귀포시 서홍동 412-3',
    source: '제주데이터허브 (제주특별자치도 클린하우스 공간정보)',
    updatedAt: '2024-04-10',
    status: 'verified',
    details: '무단투기 감시 CCTV 및 요일별 배출 안내 시스템 운영',
    lat: 33.2554,
    lng: 126.5558,
    districtKey: '서홍동',
  },
];

/**
 * 두 위·경도 좌표 간의 직선 거리(미터)를 Haversine 공식으로 계산
 */
export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Helper to query facilities based on GPS (Haversine) or district name
export function matchFacilities(
  district: string,
  gps?: { lat: number; lng: number }
): FacilityMatch[] {
  // 1. GPS가 있는 경우 실제 Haversine 거리 계산 (반경 1,500m 이내 우선 매칭)
  if (gps && Number.isFinite(gps.lat) && Number.isFinite(gps.lng)) {
    const withinRadius = JEJU_FACILITY_CATALOG.map((entry) => {
      const dist = haversineMeters(gps.lat, gps.lng, entry.lat, entry.lng);
      return {
        ...entry,
        distanceMeter: dist,
      };
    })
      .filter((entry) => entry.distanceMeter <= 1500)
      .sort((a, b) => a.distanceMeter - b.distanceMeter);

    if (withinRadius.length > 0) {
      return withinRadius.slice(0, 5);
    }
  }

  // 2. GPS 미입력 또는 반경 외인 경우 읍·면·동 명칭으로 매칭
  const normDistrict = district.trim();
  if (!normDistrict) return [];

  const byDistrict = JEJU_FACILITY_CATALOG.filter(
    (f) => normDistrict.includes(f.districtKey) || f.districtKey.includes(normDistrict)
  );
  if (byDistrict.length > 0) {
    return byDistrict;
  }

  return [];
}
