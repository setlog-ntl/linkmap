'use client';

import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

export function ProfileCard({ config }: Props) {
  const initials = config.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center text-center gap-2">
      {config.avatarUrl ? (
        <img
          src={config.avatarUrl}
          alt={config.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover"
        />
      ) : (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white"
          style={{ backgroundColor: config.accentColor }}
          aria-label={config.name}
        >
          {initials}
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
        {config.name}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {config.title}
      </p>
      {config.company && (
        <p className="text-base text-gray-500">{config.company}</p>
      )}
    </div>
  );
}
