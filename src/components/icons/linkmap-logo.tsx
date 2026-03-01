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

  const gradMain   = `${uid}-grad-main`;
  const gradEdge   = `${uid}-grad-edge`;
  const gradCenter = `${uid}-grad-center`;
  const filtGlow   = `${uid}-glow`;

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
        {/* 메인 그라디언트: brand-blue → brand-green */}
        <linearGradient
          id={gradMain}
          x1="0" y1="0" x2="32" y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* 연결선용 그라디언트 (반투명) */}
        <linearGradient
          id={gradEdge}
          x1="0" y1="0" x2="32" y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
        </linearGradient>

        {/* 중앙 노드 내부 광택 */}
        <radialGradient
          id={gradCenter}
          cx="38%" cy="32%" r="60%"
        >
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* 중앙 노드 발광 — 부드럽게 */}
        <filter id={filtGlow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── 연결선 (중앙 → 위성 5개) ── */}
      <line x1="16" y1="16" x2="16"   y2="4.5"  stroke={`url(#${gradEdge})`} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="16" x2="25.5" y2="8.5"  stroke={`url(#${gradEdge})`} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="16" x2="25.5" y2="23.5" stroke={`url(#${gradEdge})`} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="16" x2="6.5"  y2="23.5" stroke={`url(#${gradEdge})`} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="16" x2="6.5"  y2="8.5"  stroke={`url(#${gradEdge})`} strokeWidth="1.2" strokeLinecap="round" />

      {/* ── 위성 노드 (균일하고 가볍게) ── */}
      <circle cx="16"   cy="4.5"  r="2.0" fill={`url(#${gradMain})`} opacity="0.80" />
      <circle cx="25.5" cy="8.5"  r="1.8" fill={`url(#${gradMain})`} opacity="0.72" />
      <circle cx="25.5" cy="23.5" r="2.1" fill={`url(#${gradMain})`} opacity="0.85" />
      <circle cx="6.5"  cy="23.5" r="1.8" fill={`url(#${gradMain})`} opacity="0.75" />
      <circle cx="6.5"  cy="8.5"  r="2.0" fill={`url(#${gradMain})`} opacity="0.68" />

      {/* ── 중앙 허브 노드 (축소) ── */}
      <circle cx="16" cy="16" r="4.0"
        fill={`url(#${gradMain})`}
        filter={`url(#${filtGlow})`}
      />
      {/* 광택 오버레이 */}
      <circle cx="16" cy="16" r="4.0"
        fill={`url(#${gradCenter})`}
      />
    </svg>
  );
}
