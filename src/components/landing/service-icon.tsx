'use client';

// Verified icon URLs via jsdelivr CDN (all tested and confirmed working)
// CSS mask-image technique: SVG as mask shape, backgroundColor as brand color
const CDN = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons';

export const SERVICE_ICONS: Record<string, { slug: string; color: string; darkColor: string }> = {
  github:     { slug: 'github',      color: '#181717', darkColor: '#e6edf3' },
  nextjs:     { slug: 'nextdotjs',   color: '#000000', darkColor: '#ffffff' },
  vercel:     { slug: 'vercel',      color: '#000000', darkColor: '#ffffff' },
  sentry:     { slug: 'sentry',      color: '#362D59', darkColor: '#b4a7d6' },
  posthog:    { slug: 'posthog',     color: '#F54E00', darkColor: '#F54E00' },
  supabase:   { slug: 'supabase',    color: '#3ECF8E', darkColor: '#3ECF8E' },
  clerk:      { slug: 'clerk',       color: '#6C47FF', darkColor: '#8B6FFF' },
  s3:         { slug: 'amazons3',    color: '#569A31', darkColor: '#7BC74D' },
  stripe:     { slug: 'stripe',      color: '#635BFF', darkColor: '#7A73FF' },
  openai:     { slug: 'openai',      color: '#412991', darkColor: '#A78BFA' },
  resend:     { slug: 'resend',      color: '#000000', darkColor: '#ffffff' },
  cloudinary: { slug: 'cloudinary',  color: '#3448C5', darkColor: '#6B7FE0' },
  backend:    { slug: 'fastapi',     color: '#009688', darkColor: '#4DB6AC' },
};

interface ServiceIconProps {
  serviceId: string;
  size?: number;
  className?: string;
}

export function ServiceIcon({ serviceId, size = 20, className }: ServiceIconProps) {
  const icon = SERVICE_ICONS[serviceId];

  if (!icon) {
    return <span className={className}>⚙️</span>;
  }

  const svgUrl = `${CDN}/${icon.slug}.svg`;

  return (
    <span
      role="img"
      aria-label={serviceId}
      className={`inline-block shrink-0 ${className ?? ''}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Light mode */}
      <span
        className="block dark:hidden"
        style={{
          width: size,
          height: size,
          backgroundColor: icon.color,
          WebkitMaskImage: `url(${svgUrl})`,
          maskImage: `url(${svgUrl})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
      {/* Dark mode */}
      <span
        className="hidden dark:block"
        style={{
          width: size,
          height: size,
          backgroundColor: icon.darkColor,
          WebkitMaskImage: `url(${svgUrl})`,
          maskImage: `url(${svgUrl})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    </span>
  );
}
