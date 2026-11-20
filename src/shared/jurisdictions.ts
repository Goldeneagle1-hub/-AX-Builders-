import { JejuCity, SingleIssueRouting, RoutingChannel } from './types.js';

export const JEJU_DISTRICTS: Record<JejuCity, string[]> = {
  제주시: [
    '일도1동', '일도2동', '이도1동', '이도2동', '삼도1동', '삼도2동',
    '용담1동', '용담2동', '건입동', '화북동', '삼양동', '봉개동',
    '아라동', '오라동', '연동', '노형동', '외도동', '이호동', '도두동',
    '한림읍', '애월읍', '구좌읍', '조천읍', '한경면', '추자면', '우도면',
  ],
  서귀포시: [
    '송산동', '정방동', '중앙동', '천지동', '효돈동', '영천동',
    '동홍동', '서홍동', '대륜동', '대천동', '중문동', '예래동',
    '대정읍', '남원읍', '성산읍', '안덕면', '표선면',
  ],
};

export const OFFICIAL_CHANNELS: Record<string, RoutingChannel> = {
  sinmungo: {
    name: '국민신문고',
    url: 'https://www.epeople.go.kr',
    description: '행정기관 민원 접수·처리 및 복합 민원 범정부 통합 창구',
    isPrimary: true,
  },
  safety: {
    name: '안전신문고',
    url: 'https://www.safetyreport.go.kr',
    description: '불법 주정차 5대 금지구역, 도로 파손, 생활안전 위해요소 전용 신고',
  },
  jejuPortal: {
    name: '제주도청 민원안내',
    url: 'https://www.jeju.go.kr/portal/open/civil.htm',
    description: '제주특별자치도 120만덕콜센터(064-120) 및 온라인 민원 접수',
  },
};

export interface JurisdictionRule {
  category: string;
  keywords: string[];
  departmentTemplate: (city: JejuCity) => {
    primaryDepartment: string;
    cooperatingDepartments: string[];
    practicalTeam: string;
    hierarchy: {
      province: string;
      city: string;
      community: (district: string) => string;
    };
    channels: RoutingChannel[];
    jurisdictionReason: string;
    checklist: string[];
  };
}

export const JURISDICTION_RULES: JurisdictionRule[] = [
  {
    category: '악취·환경',
    keywords: ['악취', '축사', '양돈장', '가축분뇨', '하수악취', '퇴비냄새'],
    departmentTemplate: (city) => ({
      primaryDepartment: `${city} 기후환경과`,
      cooperatingDepartments: [
        `${city} 축산과 (축사 시설 인허가·관리)`,
        '제주특별자치도 환경보전국 (광역 악취관리지역 총괄)',
      ],
      practicalTeam: '환경지도팀 (악취 포집 및 배출허용기준 단속)',
      hierarchy: {
        province: '제주특별자치도 환경보전국 생활환경과 (광역 환경정책 및 악취관리지역 지정)',
        city: `${city} 청정환경국 기후환경과 (지도점검 및 행정처분 집행)`,
        community: (district) => `${district} 주민센터 맞춤형복지·생활환경담당 (현장 1차 확인)`,
      },
      channels: [OFFICIAL_CHANNELS.sinmungo, OFFICIAL_CHANNELS.jejuPortal],
      jurisdictionReason: '악취배출시설 및 가축분뇨 배출시설 지도점검과 행정처분 권한은 행정시(제주시/서귀포시) 기후환경과에 속합니다.',
      checklist: [
        '악취 발생 집중 시간대 및 풍향 기록 여부',
        '인근 가축분뇨 배출시설 또는 퇴비장 특정 가능 여부',
        '숙박업·상가 등 영업 피해 발생 내역 (예: 고객 환불, 예약 취소 등)',
        '관할 부서 현장 합동 포집 검사 요청 명시',
      ],
    }),
  },
  {
    category: '불법주정차·교통',
    keywords: ['주정차', '불법주차', '주차위반', '통행방해', '황색실선', '소화전주차'],
    departmentTemplate: (city) => ({
      primaryDepartment: `${city} 교통행정과`,
      cooperatingDepartments: [
        '제주특별자치도 자치경찰단 (교통단속 및 견인조치 협조)',
        `${city} 도시재생과 (도로 보행환경 개선)`,
      ],
      practicalTeam: '교통지도팀 (주정차 고정형·이동형 CCTV 단속 및 현장출동)',
      hierarchy: {
        province: '제주특별자치도 자치경찰단 교통안전과 (단속 권한 지원 및 순찰)',
        city: `${city} 안전교통국 교통행정과 (주정차 단속 및 과태료 부과)`,
        community: (district) => `${district} 주민센터 건설·교통담당 (계도 안내문 부착)`,
      },
      channels: [OFFICIAL_CHANNELS.safety, OFFICIAL_CHANNELS.sinmungo],
      jurisdictionReason: '도로교통법 및 조례에 따른 주정차 위반 단속 및 과태료 부과는 행정시 교통행정과 및 자치경찰단 관할입니다.',
      checklist: [
        '차량 번호판과 주변 도로상황(황색실선, 횡단보도, 상가 출입구)이 함께 찍힌 동일 각도 사진 2장(1분 이상 간격 권장)',
        '정확한 발생 주소 및 상가 진입 방해 실태 기록',
        '즉시 견인 또는 상습 불법주차 방지 봉(볼라드) 설치 요청 여부',
      ],
    }),
  },
  {
    category: '폐기물·쓰레기',
    keywords: ['쓰레기', '폐기물', '클린하우스', '무단투기', '종량제', '오물'],
    departmentTemplate: (city) => ({
      primaryDepartment: `${city} 생활환경과`,
      cooperatingDepartments: [
        '제주특별자치도 자치경찰단 환경조사과 (무단투기 과태료 수사)',
      ],
      practicalTeam: '환경미화팀 / 폐기물지도팀 (불법투기 폐기물 수거 및 경고장 발송)',
      hierarchy: {
        province: '제주특별자치도 환경보전국 자원순환과 (도 전체 자원순환 인프라)',
        city: `${city} 청정환경국 생활환경과 (클린하우스 관리 및 과태료 부과)`,
        community: (district) => `${district} 주민센터 생활환경담당 (현장 기동 수거반 운영)`,
      },
      channels: [OFFICIAL_CHANNELS.sinmungo, OFFICIAL_CHANNELS.jejuPortal],
      jurisdictionReason: '생활폐기물 수거, 클린하우스 위생관리 및 무단투기 단속은 행정시 생활환경과 및 읍·면·동 생활환경담당 관할입니다.',
      checklist: [
        '방치된 폐기물의 종류(일반쓰레기, 대형폐기물, 건축자재 등) 사진 확보',
        '무단투기 행위자 식별 가능 단서(CCTV 유무, 택배송장 등) 확인',
        '상가 앞 영업 방해 및 악취 발생 상태 기술',
        '즉시 수거 및 클린하우스 방범용 CCTV 점검 요청',
      ],
    }),
  },
  {
    category: '도로·보도시설',
    keywords: ['도로점용', '보도블록', '포트홀', '적치물', '가로등', '보안등', '싱크홀'],
    departmentTemplate: (city) => ({
      primaryDepartment: `${city} 건설과`,
      cooperatingDepartments: [
        `${city} 도시재생과 (보행로 정비)`,
        '제주특별자치도 도로관리과 (지방도 및 평화로 등 광역도로 관리)',
      ],
      practicalTeam: '도로보수팀 / 가로등관리팀 (노면 긴급 보수 및 조명등 교체)',
      hierarchy: {
        province: '제주특별자치도 도로관리사업소 (국지도·지방도 관리)',
        city: `${city} 안전교통국 건설과 (시도·도시계획도로 유지보수)`,
        community: (district) => `${district} 주민센터 건설담당 (현장 초동 확인)`,
      },
      channels: [OFFICIAL_CHANNELS.safety, OFFICIAL_CHANNELS.sinmungo],
      jurisdictionReason: '도시계획도로, 이면도로 보도블록 파손, 포트홀 및 가로등 수리는 행정시 건설과 소관입니다.',
      checklist: [
        '파손 위치 및 보행/차량 안전 위해 정도 사진',
        '가로등/보안등 관리번호(표찰 번호) 유무 확인',
        '보행자 낙상 위험 또는 상가 접근성 피해 내역',
      ],
    }),
  },
  {
    category: '식품·공중위생',
    keywords: ['위생', '음식점', '식품', '소음', '공중화장실', '숙박업'],
    departmentTemplate: (city) => ({
      primaryDepartment: `${city} 위생관리과`,
      cooperatingDepartments: [
        `${city} 관광진흥과 (미신고 불법숙박 점검)`,
      ],
      practicalTeam: '식품위생팀 / 공중위생팀 (영업소 위생지도점검)',
      hierarchy: {
        province: '제주특별자치도 보건복지여성국 보건위생과 (광역 위생정책)',
        city: `${city} 청정환경국 위생관리과 (업소 인허가 및 행정처분)`,
        community: (district) => `${district} 주민센터 주민복지담당`,
      },
      channels: [OFFICIAL_CHANNELS.sinmungo, OFFICIAL_CHANNELS.jejuPortal],
      jurisdictionReason: '식품접객업소 및 공중위생업소의 위생 불량, 소음 및 불법영업 행정처분은 행정시 위생관리과 소관입니다.',
      checklist: [
        '해당 영업소 상호명 및 정확한 소재지',
        '위생 위반 또는 소음 발생 구체적 일시 및 정황',
        '영업 지도점검 및 개선명령 조치 요청',
      ],
    }),
  },
];

export function resolveJurisdiction(
  cityInput: string,
  districtInput: string,
  complaintText: string,
  categoryInput?: string
): {
  isCompound: boolean;
  issues: SingleIssueRouting[];
  primaryChannel: RoutingChannel;
  disclaimer: string;
} {
  const city: JejuCity = cityInput.includes('서귀포') ? '서귀포시' : '제주시';
  const district = districtInput.trim() || (city === '서귀포시' ? '대정읍' : '일도1동');

  // Check if compound complaint: specifically if contains both parking AND garbage/waste
  const hasParking = /주정차|불법주차|주차|차량/.test(complaintText);
  const hasWaste = /쓰레기|폐기물|클린하우스|투기|방치/.test(complaintText);
  const hasOdor = /악취|냄새|축사|분뇨|배출/.test(complaintText);

  // If both parking and waste exist, it's a compound complaint! (Preset 2 scenario)
  if (hasParking && hasWaste) {
    const parkingRule = JURISDICTION_RULES.find((r) => r.category === '불법주정차·교통')!;
    const wasteRule = JURISDICTION_RULES.find((r) => r.category === '폐기물·쓰레기')!;

    const pT = parkingRule.departmentTemplate(city);
    const wT = wasteRule.departmentTemplate(city);

    const issue1: SingleIssueRouting = {
      issueTitle: '상가 진입로 불법 주정차 및 통행 방해',
      category: '불법주정차·교통',
      recommendedDepartment: pT.primaryDepartment,
      cooperatingDepartments: pT.cooperatingDepartments,
      practicalTeam: pT.practicalTeam,
      jurisdictionReason: pT.jurisdictionReason,
      hierarchy: {
        province: pT.hierarchy.province,
        city: pT.hierarchy.city,
        community: pT.hierarchy.community(district),
      },
      channels: pT.channels,
      checklist: pT.checklist,
    };

    const issue2: SingleIssueRouting = {
      issueTitle: '상가 앞 생활쓰레기 및 무단 방치 폐기물',
      category: '폐기물·쓰레기',
      recommendedDepartment: wT.primaryDepartment,
      cooperatingDepartments: wT.cooperatingDepartments,
      practicalTeam: wT.practicalTeam,
      jurisdictionReason: wT.jurisdictionReason,
      hierarchy: {
        province: wT.hierarchy.province,
        city: wT.hierarchy.city,
        community: wT.hierarchy.community(district),
      },
      channels: wT.channels,
      checklist: wT.checklist,
    };

    return {
      isCompound: true,
      issues: [issue1, issue2],
      primaryChannel: OFFICIAL_CHANNELS.sinmungo,
      disclaimer: '추천 관할 부서 및 접수 채널은 제주도 자치법규 및 사무분장 기준의 보조 안내이며, 행정기관 사정에 따라 실제 접수 부서가 조정될 수 있습니다.',
    };
  }

  // Single issue matching
  let matchedRule = JURISDICTION_RULES[0]; // default odor/environment
  if (hasOdor) {
    matchedRule = JURISDICTION_RULES.find((r) => r.category === '악취·환경')!;
  } else if (hasParking) {
    matchedRule = JURISDICTION_RULES.find((r) => r.category === '불법주정차·교통')!;
  } else if (hasWaste) {
    matchedRule = JURISDICTION_RULES.find((r) => r.category === '폐기물·쓰레기')!;
  } else if (/가로등|보도|도로|포트홀/.test(complaintText)) {
    matchedRule = JURISDICTION_RULES.find((r) => r.category === '도로·보도시설')!;
  } else if (/위생|식당|음식|소음/.test(complaintText)) {
    matchedRule = JURISDICTION_RULES.find((r) => r.category === '식품·공중위생')!;
  }

  const template = matchedRule.departmentTemplate(city);
  const singleIssue: SingleIssueRouting = {
    issueTitle: matchedRule.category + ' 관련 생활민원',
    category: matchedRule.category,
    recommendedDepartment: template.primaryDepartment,
    cooperatingDepartments: template.cooperatingDepartments,
    practicalTeam: template.practicalTeam,
    jurisdictionReason: template.jurisdictionReason,
    hierarchy: {
      province: template.hierarchy.province,
      city: template.hierarchy.city,
      community: template.hierarchy.community(district),
    },
    channels: template.channels,
    checklist: template.checklist,
  };

  return {
    isCompound: false,
    issues: [singleIssue],
    primaryChannel: template.channels[0] || OFFICIAL_CHANNELS.sinmungo,
    disclaimer: '추천 관할 부서 및 접수 채널은 제주도 자치법규 및 사무분장 기준의 보조 안내이며, 행정기관 사정에 따라 실제 접수 부서가 조정될 수 있습니다.',
  };
}
