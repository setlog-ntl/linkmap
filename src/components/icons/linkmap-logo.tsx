import { cn } from '@/lib/utils';

const DARK_LOGO_SRC = '/img/linkmap-logo-dark.svg';
const LIGHT_LOGO_SRC = '/img/linkmap-logo-light.png';

interface LinkmapLogoProps {
  size?: number;
  className?: string;
}

/**
 * 테마별 로고.
 *
 * useTheme(resolvedTheme)로 src를 고르면 서버(테마 미확정 → 라이트)와
 * 클라이언트(다크) 렌더가 달라 하이드레이션 불일치가 발생한다.
 * 대신 라이트/다크 이미지를 모두 렌더하고 CSS(dark: 클래스)로 토글한다.
 * next-themes가 하이드레이션 전 <html class="dark">를 설정하므로 서버/클라이언트
 * DOM이 동일해 불일치·깜빡임(FOUC)이 없다. display:none 쪽은 접근성 트리에서
 * 제외되어 표시 중인 로고 하나만 "Linkmap"으로 읽힌다.
 */
export function LinkmapLogo({ size = 32, className }: LinkmapLogoProps) {
  return (
    <>
      <img
        src={LIGHT_LOGO_SRC}
        alt="Linkmap"
        width={size}
        height={size}
        className={cn('block dark:hidden', className)}
      />
      <img
        src={DARK_LOGO_SRC}
        alt="Linkmap"
        width={size}
        height={size}
        className={cn('hidden dark:block', className)}
      />
    </>
  );
}
