'use client';

import { SERVICE_BRANDS, getServiceIconUrl } from '@/lib/constants/service-brands';

interface ServiceIconProps {
  serviceId: string;
  size?: number;
  className?: string;
}

export function ServiceIcon({ serviceId, size = 20, className }: ServiceIconProps) {
  const brand = SERVICE_BRANDS[serviceId];

  if (!brand) {
    return <span className={className}>⚙️</span>;
  }

  const svgUrl = getServiceIconUrl(serviceId)!;

  // 다색 SVG는 img 태그로 원본 색상 그대로 렌더링
  if (brand.multiColor) {
    return (
      <span
        role="img"
        aria-label={serviceId}
        className={`inline-block shrink-0 ${className ?? ''}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={svgUrl}
          alt={serviceId}
          width={size}
          height={size}
          style={{ width: size, height: size }}
        />
      </span>
    );
  }

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
          backgroundColor: brand.color,
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
          backgroundColor: brand.darkColor,
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
