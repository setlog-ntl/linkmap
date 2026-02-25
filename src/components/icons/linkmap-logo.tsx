interface LinkmapLogoProps {
  size?: number;
  className?: string;
}

export function LinkmapLogo({ size = 32, className }: LinkmapLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Linkmap"
    >
      <defs>
        {/* 메인 그라디언트: brand-blue → brand-green */}
        <linearGradient
          id="lm-grad-main"
          x1="0" y1="0" x2="32" y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* 연결선용 그라디언트 (반투명) */}
        <linearGradient
          id="lm-grad-edge"
          x1="0" y1="0" x2="32" y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
        </linearGradient>

        {/* 중앙 노드 내부 광택 */}
        <radialGradient
          id="lm-grad-center"
          cx="40%" cy="35%" r="60%"
        >
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* 중앙 노드 미세 발광 */}
        <filter id="lm-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── 연결선 (중앙 → 위성 5개) ── */}
      {/* 12시 */}
      <line x1="16" y1="16" x2="16" y2="3.5"
        stroke="url(#lm-grad-edge)" strokeWidth="1.5" strokeLinecap="round" />
      {/* 2시 */}
      <line x1="16" y1="16" x2="26.5" y2="7.5"
        stroke="url(#lm-grad-edge)" strokeWidth="1.5" strokeLinecap="round" />
      {/* 5시 */}
      <line x1="16" y1="16" x2="26.5" y2="24.5"
        stroke="url(#lm-grad-edge)" strokeWidth="1.5" strokeLinecap="round" />
      {/* 7시 */}
      <line x1="16" y1="16" x2="5.5" y2="24.5"
        stroke="url(#lm-grad-edge)" strokeWidth="1.5" strokeLinecap="round" />
      {/* 10시 */}
      <line x1="16" y1="16" x2="5.5" y2="7.5"
        stroke="url(#lm-grad-edge)" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── 위성 노드 ── */}
      <circle cx="16"   cy="3.5"  r="2.4" fill="url(#lm-grad-main)" opacity="0.80" />
      <circle cx="26.5" cy="7.5"  r="2.0" fill="url(#lm-grad-main)" opacity="0.70" />
      <circle cx="26.5" cy="24.5" r="2.6" fill="url(#lm-grad-main)" opacity="0.85" />
      <circle cx="5.5"  cy="24.5" r="2.0" fill="url(#lm-grad-main)" opacity="0.75" />
      <circle cx="5.5"  cy="7.5"  r="2.2" fill="url(#lm-grad-main)" opacity="0.65" />

      {/* ── 중앙 허브 노드 ── */}
      <circle cx="16" cy="16" r="5.8"
        fill="url(#lm-grad-main)"
        filter="url(#lm-glow)"
      />
      {/* 광택 오버레이 */}
      <circle cx="16" cy="16" r="5.8"
        fill="url(#lm-grad-center)"
      />
    </svg>
  );
}
