'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const ROTATE_KEYS = [
  'landing.heroRotate1',
  'landing.heroRotate2',
  'landing.heroRotate3',
  'landing.heroRotate4',
] as const;

const INTERVAL_MS = 3500;

export function TypewriterHeadline() {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { locale } = useLocaleStore();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATE_KEYS.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const prefix = t(locale, 'landing.heroPrefix');

  if (prefersReducedMotion) {
    return (
      <>
        {prefix} <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-[hsl(220,60%,35%)] to-[#2bee79] bg-clip-text text-transparent">
          {t(locale, ROTATE_KEYS[0])}
        </span>
      </>
    );
  }

  return (
    <>
      {prefix} <br className="hidden sm:block" />
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATE_KEYS[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="inline-block bg-gradient-to-r from-[hsl(220,60%,35%)] to-[#2bee79] bg-clip-text text-transparent"
        >
          {t(locale, ROTATE_KEYS[index])}
        </motion.span>
      </AnimatePresence>
    </>
  );
}
