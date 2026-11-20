import React from 'react';

interface DolhareubangLogoProps {
  size?: number;
  className?: string;
}

/**
 * 제주민원메이트 세련된 글로시·입체 돌하르방 엠블럼 로고
 * 돌하르방 모티브를 유지하면서 입체 그라데이션, 스페큘러 하이라이트, 감귤 포인트를 적용
 */
export const DolhareubangLogo: React.FC<DolhareubangLogoProps> = ({
  size = 44,
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="제주민원메이트 돌하르방 로고"
    >
      <defs>
        {/* Outer Warm Tangerine-Gold Rim Gradient */}
        <linearGradient id={`rim-${uid}`} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F58D3D" />
          <stop offset="55%" stopColor="#E86F1A" />
          <stop offset="100%" stopColor="#C4530A" />
        </linearGradient>

        {/* Inner Crisp Bright White Polished Backdrop */}
        <radialGradient id={`bg-${uid}`} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </radialGradient>

        {/* Sculpted Basalt Stone Body Gradient */}
        <linearGradient id={`stone-${uid}`} x1="20" y1="12" x2="46" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#574F47" />
          <stop offset="50%" stopColor="#3B352F" />
          <stop offset="100%" stopColor="#24201C" />
        </linearGradient>

        {/* Hat & Nose Highlight Stone Gradient */}
        <linearGradient id={`stoneLight-${uid}`} x1="22" y1="10" x2="42" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6D645B" />
          <stop offset="100%" stopColor="#3A342E" />
        </linearGradient>

        {/* Glossy Tangerine Accent Gradient */}
        <linearGradient id={`tangerine-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9E44" />
          <stop offset="60%" stopColor="#E86F1A" />
          <stop offset="100%" stopColor="#C95508" />
        </linearGradient>

        {/* Top Specular Glass Sheen */}
        <linearGradient id={`gloss-${uid}`} x1="32" y1="4" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Subtle Drop Shadow for Emblem */}
        <filter id={`shadow-${uid}`} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2E2A26" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Outer Polished Badge Ring */}
      <circle cx="32" cy="32" r="30" fill={`url(#rim-${uid})`} filter={`url(#shadow-${uid})`} />
      <circle cx="32" cy="32" r="27.2" fill={`url(#bg-${uid})`} stroke="#FFFFFF" strokeWidth="1.2" />

      {/* Soft Shadow beneath Dolhareubang */}
      <ellipse cx="32" cy="53.5" rx="14" ry="2.6" fill="#2E2A26" opacity="0.14" />

      {/* Dolhareubang Body & Face (Sculpted Silhouette) */}
      <path
        d="M20 24.5 C18 32, 17.5 42.5, 19.2 51.2 C23.5 54, 40.5 54, 44.8 51.2 C46.5 42.5, 46 32, 44 24.5 Z"
        fill={`url(#stone-${uid})`}
        stroke="#24201C"
        strokeWidth="1.2"
      />

      {/* Subtle Stone Rim Highlight on Left Cheek */}
      <path
        d="M21 26.5 C19.5 33, 19.2 42, 20.5 49.5"
        stroke="#8B8075"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Dolhareubang Hat (벙거지) */}
      <path
        d="M19 22 C20 13.5, 25.5 10.5, 32 10.5 C38.5 10.5, 44 13.5, 45 22 Z"
        fill={`url(#stoneLight-${uid})`}
        stroke="#24201C"
        strokeWidth="1.2"
      />
      {/* Sleek Hat Brim */}
      <path
        d="M13.5 23.2 C22.5 20.4, 41.5 20.4, 50.5 23.2 C42 25.2, 22 25.2, 13.5 23.2 Z"
        fill="#2E2A26"
        stroke="#1F1C18"
        strokeWidth="1"
      />
      <path
        d="M16.5 22.3 C24 20.6, 40 20.6, 47.5 22.3"
        stroke="#9B8F83"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Refined Basalt Pores */}
      <circle cx="22.5" cy="39.5" r="0.8" fill="#7D7267" opacity="0.7" />
      <circle cx="42" cy="39" r="0.9" fill="#7D7267" opacity="0.6" />
      <circle cx="24" cy="44" r="0.7" fill="#7D7267" opacity="0.5" />

      {/* Friendly Expressive Eyes with Specular Dot */}
      <circle cx="26" cy="31.5" r="3.2" fill="#FFFFFF" stroke="#1F1C18" strokeWidth="1.1" />
      <circle cx="26.3" cy="31.5" r="1.5" fill="#1F1C18" />
      <circle cx="27" cy="30.8" r="0.55" fill="#FFFFFF" />

      <circle cx="38" cy="31.5" r="3.2" fill="#FFFFFF" stroke="#1F1C18" strokeWidth="1.1" />
      <circle cx="37.7" cy="31.5" r="1.5" fill="#1F1C18" />
      <circle cx="38.4" cy="30.8" r="0.55" fill="#FFFFFF" />

      {/* Sculpted Characteristic Round Nose (주먹코) */}
      <path
        d="M29.4 33 C28.6 36.8, 29.6 39.2, 32 39.2 C34.4 39.2, 35.4 36.8, 34.6 33 Z"
        fill="#5C534A"
        stroke="#24201C"
        strokeWidth="1"
      />
      <path
        d="M30.6 34 C30.4 35.8, 30.8 37.2, 31.8 37.5"
        stroke="#9A8E82"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Warm Gentle Smile */}
      <path
        d="M28 42.2 Q32 45 36 42.2"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Glossy Tangerine Scarf / Collar Accent */}
      <path
        d="M22.2 47.8 Q32 52.2 41.8 47.8"
        stroke={`url(#tangerine-${uid})`}
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 47.5 Q32 50.8 40 47.5"
        stroke="#FFD1A3"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Glossy Tangerine Jewel on Hat */}
      <circle cx="42.8" cy="15.2" r="3.4" fill={`url(#tangerine-${uid})`} stroke="#24201C" strokeWidth="0.9" />
      <circle cx="41.8" cy="14" r="1" fill="#FFFFFF" opacity="0.75" />
      <path d="M43 11.8 Q44.8 9.8 46.6 10.8" stroke="#4D8B55" strokeWidth="1.5" strokeLinecap="round" />

      {/* Top Glass Gloss Arc across the Entire Emblem */}
      <path
        d="M11 26 C14 12, 23 6, 32 6 C41 6, 50 12, 53 26 C44 21, 20 21, 11 26 Z"
        fill={`url(#gloss-${uid})`}
        pointerEvents="none"
      />
    </svg>
  );
};
