import React from 'react';

interface DolhareubangLogoProps {
  size?: number;
  className?: string;
}

/**
 * 제주 돌하르방 스케치 캐릭터 SVG 로고
 * 손그림 펜화 느낌의 굵기 변화와 친근한 표정, 감귤 포인트 적용
 */
export const DolhareubangLogo: React.FC<DolhareubangLogoProps> = ({
  size = 40,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="제주 돌하르방 로고"
    >
      {/* Warm Cream Circular Sketch Backdrop */}
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="#FFFDF8"
        stroke="#E86F1A"
        strokeWidth="2"
        strokeDasharray="4 2"
      />

      {/* Dolhareubang Hat (벙거지) */}
      <path
        d="M18 22 C19 13, 25 10, 32 10 C39 10, 45 13, 46 22 Z"
        fill="#E6DEC8"
        stroke="#2E2A26"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hat Brim (모자 챙 - 스케치 이중선) */}
      <path
        d="M13 23 C22 20, 42 20, 51 23"
        stroke="#2E2A26"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M15 24.5 C24 22.5, 40 22.5, 49 24.5"
        stroke="#2E2A26"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Face & Body (현무암 질감의 둥근 실루엣) */}
      <path
        d="M19 24 C17 31, 16 42, 18 52 C22 55, 42 55, 46 52 C48 42, 47 31, 45 24"
        fill="#EFE9DA"
        stroke="#2E2A26"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sketchy Basalt Pores (현무암 구멍 스케치 점) */}
      <circle cx="21" cy="30" r="0.9" fill="#8C8273" />
      <circle cx="43" cy="29" r="1" fill="#8C8273" />
      <circle cx="20" cy="46" r="1.1" fill="#8C8273" />
      <circle cx="44" cy="45" r="0.9" fill="#8C8273" />

      {/* Big Friendly Dolhareubang Eyes */}
      <circle
        cx="25.5"
        cy="31.5"
        r="3.2"
        fill="#FFFFFF"
        stroke="#2E2A26"
        strokeWidth="1.8"
      />
      <circle cx="26" cy="31.5" r="1.4" fill="#2E2A26" />

      <circle
        cx="38.5"
        cy="31.5"
        r="3.2"
        fill="#FFFFFF"
        stroke="#2E2A26"
        strokeWidth="1.8"
      />
      <circle cx="38" cy="31.5" r="1.4" fill="#2E2A26" />

      {/* Rosy Tangerine Cheeks */}
      <ellipse cx="21.5" cy="36" rx="2.4" ry="1.4" fill="#E86F1A" opacity="0.35" />
      <ellipse cx="42.5" cy="36" rx="2.4" ry="1.4" fill="#E86F1A" opacity="0.35" />

      {/* Characteristic Round Nose (주먹코) */}
      <path
        d="M29 33 C28 37, 29 39.5, 32 39.5 C35 39.5, 36 37, 35 33"
        fill="#E6DEC8"
        stroke="#2E2A26"
        strokeWidth="1.9"
        strokeLinecap="round"
      />

      {/* Gentle Smile */}
      <path
        d="M27.5 42.5 Q32 45.5 36.5 42.5"
        stroke="#2E2A26"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cute Tangerine Badge/Scarf Accent on Chest */}
      <path
        d="M23 48 Q32 52 41 48"
        stroke="#E86F1A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tiny Tangerine Icon on Hat */}
      <circle cx="43" cy="15" r="3.2" fill="#E86F1A" stroke="#2E2A26" strokeWidth="1.2" />
      <path d="M43 11.8 Q44.5 10 46 11" stroke="#3F7D4C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
