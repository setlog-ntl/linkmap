'use client';

import {
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Facebook,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import type { SocialItem } from '@/lib/config';

const socialIcons: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  facebook: Facebook,
};

interface Props {
  socials: SocialItem[];
  accentColor: string;
}

export function SocialLinks({ socials, accentColor }: Props) {
  return (
    <div className="flex items-center justify-center gap-4">
      {socials.map((social, i) => {
        const Icon = socialIcons[social.platform] || Globe;
        return (
          <a
            key={i}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 transition-all duration-200 hover:scale-110"
            style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}
