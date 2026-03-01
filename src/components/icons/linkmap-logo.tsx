'use client';

import { useTheme } from 'next-themes';

const DARK_LOGO_SRC = '/img/linkmap-logo-dark.svg';
const LIGHT_LOGO_SRC = '/img/linkmap-logo-light.png';

interface LinkmapLogoProps {
  size?: number;
  className?: string;
}

export function LinkmapLogo({ size = 32, className }: LinkmapLogoProps) {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <img
      src={isDark ? DARK_LOGO_SRC : LIGHT_LOGO_SRC}
      alt="Linkmap"
      width={size}
      height={size}
      className={className}
      aria-label="Linkmap"
    />
  );
}
