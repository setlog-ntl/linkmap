'use client';

import { useId } from 'react';
import { useTheme } from 'next-themes';

const DARK_LOGO_SRC = '/img/linkmap-logo-dark.svg';

interface LinkmapLogoProps {
  size?: number;
  className?: string;
}

export function LinkmapLogo({ size = 32, className }: LinkmapLogoProps) {
  const { resolvedTheme } = useTheme();
  const uid = useId().replace(/:/g, '');

  const isDark = resolvedTheme === 'dark';

  if (isDark) {
    return (
      <img
        src={DARK_LOGO_SRC}
        alt="Linkmap"
        width={size}
        height={size}
        className={className}
        aria-label="Linkmap"
      />
    );
  }

  const gradBg      = `${uid}-grad-bg`;
  const gradPlatform = `${uid}-grad-platform`;
  const filtGlow    = `${uid}-glow`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Linkmap"
      role="img"
    >
      <defs>
        {/* 배경 그라디언트: 하늘색 → 파란색 */}
        <linearGradient
          id={gradBg}
          x1="16" y1="0" x2="16" y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#56C8F0" />
          <stop offset="100%" stopColor="#3070E0" />
        </linearGradient>

        {/* 플랫폼 그라디언트 */}
        <linearGradient
          id={gradPlatform}
          x1="16" y1="22" x2="16" y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>

        {/* 중앙 노드 발광 */}
        <filter id={filtGlow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 둥근 사각형 배경 */}
      <rect x="0" y="0" width="32" height="32" rx="7" fill={`url(#${gradBg})`} />

      {/* 하단 다이아몬드 플랫폼 */}
      <polygon
        points="16,22 24,25 16,28 8,25"
        fill={`url(#${gradPlatform})`}
      />
      <line x1="8" y1="25" x2="24" y2="25" stroke="white" strokeOpacity="0.15" strokeWidth="0.4" />

      {/* 연결선 (중앙 → 위성 5개) */}
      <line x1="16" y1="14" x2="16"   y2="5"    stroke="white" strokeOpacity="0.55" strokeWidth="1.0" strokeLinecap="round" />
      <line x1="16" y1="14" x2="25"   y2="8"    stroke="white" strokeOpacity="0.55" strokeWidth="1.0" strokeLinecap="round" />
      <line x1="16" y1="14" x2="25"   y2="20"   stroke="white" strokeOpacity="0.55" strokeWidth="1.0" strokeLinecap="round" />
      <line x1="16" y1="14" x2="7"    y2="20"   stroke="white" strokeOpacity="0.55" strokeWidth="1.0" strokeLinecap="round" />
      <line x1="16" y1="14" x2="7"    y2="8"    stroke="white" strokeOpacity="0.55" strokeWidth="1.0" strokeLinecap="round" />

      {/* 위성 노드 */}
      <circle cx="16" cy="5"   r="2.0" fill="white" />
      <circle cx="25" cy="8"   r="1.7" fill="white" />
      <circle cx="25" cy="20"  r="2.0" fill="white" />
      <circle cx="7"  cy="20"  r="1.7" fill="white" />
      <circle cx="7"  cy="8"   r="1.9" fill="white" />

      {/* 중앙 허브 노드 */}
      <circle cx="16" cy="14" r="3.8"
        fill="white"
        filter={`url(#${filtGlow})`}
      />
      {/* 중앙 노드 내부 하이라이트 */}
      <circle cx="15.2" cy="13.2" r="1.5"
        fill="white"
        opacity="0.4"
      />
    </svg>
  );
}
