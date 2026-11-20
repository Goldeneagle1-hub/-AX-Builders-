import React, { useState } from 'react';
import { JejuCity } from '@shared/types';

interface RegionDef {
  id: string;
  label: string;
  city: JejuCity;
  district: string;
  path: string;
  labelX: number;
  labelY: number;
}

/**
 * 제주특별자치도 읍·면·동 권역별 인터랙티브 SVG 지도
 * 한라산 분수령 기준으로 북측 제주시(한경·한림·애월·동지역·조천·구좌·우도)와
 * 남측 서귀포시(대정·안덕·동지역·남원·표선·성산)를 실제 지리 배치에 가깝게 분할
 */
const JEJU_REGIONS: RegionDef[] = [
  // 제주시 서부
  {
    id: 'hangyeong',
    label: '한경면',
    city: '제주시',
    district: '한경면',
    path: 'M 20 82 L 48 64 L 54 88 L 36 96 L 18 92 Z',
    labelX: 36,
    labelY: 82,
  },
  {
    id: 'hallim',
    label: '한림읍',
    city: '제주시',
    district: '한림읍',
    path: 'M 48 64 L 82 46 L 88 72 L 54 88 Z',
    labelX: 68,
    labelY: 67,
  },
  {
    id: 'aewol',
    label: '애월읍',
    city: '제주시',
    district: '애월읍',
    path: 'M 82 46 L 122 30 L 128 66 L 88 72 Z',
    labelX: 106,
    labelY: 53,
  },
  // 제주시 동지역 (중심)
  {
    id: 'jeju-dong',
    label: '제주시(동)',
    city: '제주시',
    district: '일도1동',
    path: 'M 122 30 L 164 26 L 162 64 L 128 66 Z',
    labelX: 144,
    labelY: 47,
  },
  // 제주시 동부
  {
    id: 'jocheon',
    label: '조천읍',
    city: '제주시',
    district: '조천읍',
    path: 'M 164 26 L 204 28 L 198 66 L 162 64 Z',
    labelX: 183,
    labelY: 47,
  },
  {
    id: 'gujwa',
    label: '구좌읍',
    city: '제주시',
    district: '구좌읍',
    path: 'M 204 28 L 252 40 L 258 64 L 222 72 L 198 66 Z',
    labelX: 226,
    labelY: 51,
  },
  {
    id: 'udo',
    label: '우도',
    city: '제주시',
    district: '우도면',
    path: 'M 268 42 L 282 44 L 280 56 L 266 54 Z',
    labelX: 274,
    labelY: 37,
  },

  // 서귀포시 서부
  {
    id: 'daejeong',
    label: '대정읍',
    city: '서귀포시',
    district: '대정읍',
    path: 'M 18 92 L 36 96 L 54 88 L 68 118 L 32 126 L 16 110 Z',
    labelX: 42,
    labelY: 110,
  },
  {
    id: 'andeok',
    label: '안덕면',
    city: '서귀포시',
    district: '안덕면',
    path: 'M 54 88 L 88 72 L 106 72 L 106 116 L 68 118 Z',
    labelX: 83,
    labelY: 97,
  },
  // 서귀포시 동지역 (중심)
  {
    id: 'seogwipo-dong',
    label: '서귀포(동)',
    city: '서귀포시',
    district: '서홍동',
    path: 'M 106 72 L 128 66 L 154 66 L 154 114 L 106 116 Z',
    labelX: 130,
    labelY: 94,
  },
  // 서귀포시 동부
  {
    id: 'namwon',
    label: '남원읍',
    city: '서귀포시',
    district: '남원읍',
    path: 'M 154 66 L 198 66 L 196 108 L 154 114 Z',
    labelX: 176,
    labelY: 90,
  },
  {
    id: 'pyoseon',
    label: '표선면',
    city: '서귀포시',
    district: '표선면',
    path: 'M 198 66 L 222 72 L 234 98 L 196 108 Z',
    labelX: 213,
    labelY: 88,
  },
  {
    id: 'seongsan',
    label: '성산읍',
    city: '서귀포시',
    district: '성산읍',
    path: 'M 222 72 L 258 64 L 266 84 L 234 98 Z',
    labelX: 245,
    labelY: 79,
  },
];

interface JejuDetailedMapProps {
  selectedCity: JejuCity;
  selectedDistrict: string;
  onSelectRegion: (city: JejuCity, district: string) => void;
}

export const JejuDetailedMap: React.FC<JejuDetailedMapProps> = ({
  selectedCity,
  selectedDistrict,
  onSelectRegion,
}) => {
  const [hovered, setHovered] = useState<RegionDef | null>(null);

  return (
    <div className="w-full space-y-2">
      {/* Hover / Selected Region Readout */}
      <div className="text-center text-[11px] font-medium text-slate-600 min-h-[18px]">
        {hovered ? (
          <span>
            <strong className="text-[#E86F1A]">
              {hovered.city} {hovered.district}
            </strong>{' '}
            클릭하여 바로 민원 작성
          </span>
        ) : (
          <span>
            현재 선택:{' '}
            <strong className="text-slate-900">
              {selectedCity} {selectedDistrict}
            </strong>
          </span>
        )}
      </div>

      {/* Detailed Eup/Myeon/Dong Interactive SVG Map */}
      <svg
        viewBox="0 12 294 124"
        className="w-full max-w-[310px] mx-auto drop-shadow-xs select-none"
        role="img"
        aria-label="제주특별자치도 읍면동 행정구역 선택 지도"
      >
        {JEJU_REGIONS.map((reg) => {
          const isSelected =
            selectedDistrict === reg.district ||
            (reg.id === 'jeju-dong' && selectedCity === '제주시' && reg.district === selectedDistrict) ||
            (reg.id === 'seogwipo-dong' && selectedCity === '서귀포시' && reg.district === selectedDistrict);
          const isHovered = hovered?.id === reg.id;
          const isJeju = reg.city === '제주시';

          let fill = isJeju ? '#E2E8F0' : '#CBD5E1';
          if (isSelected) fill = '#E86F1A';
          else if (isHovered) fill = '#F59245';

          const textColor = isSelected || isHovered ? '#FFFFFF' : '#1E293B';

          return (
            <g
              key={reg.id}
              onClick={() => onSelectRegion(reg.city, reg.district)}
              onMouseEnter={() => setHovered(reg)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-colors"
            >
              <path
                d={reg.path}
                fill={fill}
                stroke="#FFFFFF"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <text
                x={reg.labelX}
                y={reg.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize={reg.id === 'udo' ? '6.5' : '7.4'}
                fontWeight="700"
                className="pointer-events-none"
              >
                {reg.label}
              </text>
            </g>
          );
        })}

        {/* Hallasan Peak Marker */}
        <circle cx="136" cy="68" r="2.2" fill="#1E293B" opacity="0.6" className="pointer-events-none" />
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600">
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#E2E8F0] border border-slate-300" />
          제주시 권역
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#CBD5E1] border border-slate-300" />
          서귀포시 권역
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#E86F1A]" />
          선택됨
        </span>
      </div>
    </div>
  );
};
