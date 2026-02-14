'use client';

import {
  Instagram,
  Youtube,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import type { SocialItem } from '@/lib/config';
import type { ThemePreset } from '@/lib/themes';

const socialIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
};

interface Props {
  socials: SocialItem[];
  theme: ThemePreset;
}

export function SocialBar({ socials, theme }: Props) {
  return (
    <div className="flex items-center gap-4">
      {socials.map((social, i) => {
        const Icon = socialIcons[social.platform] || Globe;
        return (
          <a
            key={i}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="transition-colors duration-200 hover:opacity-100 opacity-70"
            style={{ color: theme.text }}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}
