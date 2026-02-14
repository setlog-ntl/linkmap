'use client';

import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: '홈' },
  { id: 'about', label: '소개' },
  { id: 'projects', label: '프로젝트' },
  { id: 'experience', label: '경력' },
  { id: 'contact', label: '연락처' },
];

export function NavHeader() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-gray-950/80 dark:bg-gray-950/80 border-b border-gray-800/50">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-center gap-1">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              active === id
                ? 'text-white bg-gray-800'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
