'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Chrome, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SubNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: SubNavItem[] = [
  { href: '/guides/auth', label: '개요', icon: Shield },
  { href: '/guides/auth/google', label: '구글 로그인', icon: Chrome },
  { href: '/guides/auth/kakao', label: '카카오 로그인', icon: MessageCircle },
];

export function AuthSubNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none [mask-image:linear-gradient(to_right,black_85%,transparent)] md:[mask-image:none]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
