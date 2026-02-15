'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { User, LayoutDashboard, GitBranch, Cloud } from 'lucide-react';

const ease = [0.21, 0.47, 0.32, 0.98] as const;

function Node({
  icon: Icon,
  label,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-sm border">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <span className="text-xs sm:text-sm font-medium text-center leading-tight">{label}</span>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={`w-8 h-4 sm:w-12 sm:h-5 text-muted-foreground/60 shrink-0 ${className ?? ''}`}
      viewBox="0 0 48 20"
      fill="none"
    >
      <path
        d="M0 10h40m0 0-8-6m8 6-8 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      className={`h-8 w-4 sm:h-10 sm:w-5 text-muted-foreground/60 mx-auto ${className ?? ''}`}
      viewBox="0 0 20 40"
      fill="none"
    >
      <path
        d="M10 0v32m0 0-6-8m6 8 6-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TwoLayerDiagram() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12 },
    },
  };

  const item = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Layer 1 - App Login */}
      <motion.div variants={item}>
        <div className="rounded-xl border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-4 sm:p-6">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3 tracking-wide uppercase">
            Layer 1 — 앱 로그인
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <Node
              icon={User}
              label="사용자"
              className="text-blue-700 dark:text-blue-300 [&_div:first-child]:bg-blue-100 dark:[&_div:first-child]:bg-blue-900/40 [&_div:first-child]:border-blue-200 dark:[&_div:first-child]:border-blue-800"
            />
            <Arrow />
            <Node
              icon={LayoutDashboard}
              label="Linkmap"
              className="text-blue-700 dark:text-blue-300 [&_div:first-child]:bg-blue-100 dark:[&_div:first-child]:bg-blue-900/40 [&_div:first-child]:border-blue-200 dark:[&_div:first-child]:border-blue-800"
            />
          </div>
          <p className="text-xs text-blue-600/80 dark:text-blue-400/80 text-center mt-3">
            &quot;내가 Linkmap에 들어가는 것&quot; — Supabase Auth 담당
          </p>
        </div>
      </motion.div>

      {/* Separator */}
      <motion.div variants={item} className="flex justify-center">
        <ArrowDown />
      </motion.div>

      {/* Layer 2 - Service Integration */}
      <motion.div variants={item}>
        <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 sm:p-6">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3 tracking-wide uppercase">
            Layer 2 — 서비스 연동
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <Node
              icon={LayoutDashboard}
              label="프로젝트"
              className="text-emerald-700 dark:text-emerald-300 [&_div:first-child]:bg-emerald-100 dark:[&_div:first-child]:bg-emerald-900/40 [&_div:first-child]:border-emerald-200 dark:[&_div:first-child]:border-emerald-800"
            />
            <Arrow />
            <Node
              icon={GitBranch}
              label="GitHub"
              className="text-emerald-700 dark:text-emerald-300 [&_div:first-child]:bg-emerald-100 dark:[&_div:first-child]:bg-emerald-900/40 [&_div:first-child]:border-emerald-200 dark:[&_div:first-child]:border-emerald-800"
            />
            <Node
              icon={Cloud}
              label="Vercel"
              className="text-emerald-700 dark:text-emerald-300 [&_div:first-child]:bg-emerald-100 dark:[&_div:first-child]:bg-emerald-900/40 [&_div:first-child]:border-emerald-200 dark:[&_div:first-child]:border-emerald-800"
            />
          </div>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 text-center mt-3">
            &quot;프로젝트가 외부 서비스와 연결되는 것&quot; — OAuth / API Key
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
