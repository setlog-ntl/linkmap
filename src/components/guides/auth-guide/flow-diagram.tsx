'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export interface FlowNode {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  colorScheme?: 'blue' | 'emerald' | 'neutral';
  className?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  neutral: {
    bg: 'bg-muted',
    border: 'border-border',
    text: 'text-foreground',
    icon: 'text-muted-foreground',
  },
};

function FlowArrow() {
  return (
    <svg
      className="w-6 h-4 sm:w-8 sm:h-5 text-muted-foreground/50 shrink-0"
      viewBox="0 0 32 20"
      fill="none"
    >
      <path
        d="M0 10h24m0 0-6-5m6 5-6 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlowArrowDown() {
  return (
    <svg
      className="h-6 w-4 sm:h-8 sm:w-5 text-muted-foreground/50 mx-auto shrink-0"
      viewBox="0 0 20 32"
      fill="none"
    >
      <path
        d="M10 0v24m0 0-5-6m5 6 5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlowDiagram({ nodes, colorScheme = 'neutral', className }: FlowDiagramProps) {
  const prefersReducedMotion = useReducedMotion();
  const colors = colorMap[colorScheme];

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 },
    },
  };

  const item = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
      };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-center justify-center gap-2 sm:gap-3">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <div key={i} className="contents">
              {i > 0 && <FlowArrow />}
              <motion.div variants={item} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border ${colors.bg} ${colors.border}`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.icon}`} />
                </div>
                <span className={`text-xs font-medium ${colors.text}`}>{node.label}</span>
                {node.sublabel && (
                  <span className="text-[10px] text-muted-foreground">{node.sublabel}</span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex sm:hidden flex-col items-center gap-1">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <div key={i} className="contents">
              {i > 0 && <FlowArrowDown />}
              <motion.div variants={item} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colors.bg} ${colors.border}`}
                >
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div>
                  <span className={`text-sm font-medium ${colors.text}`}>{node.label}</span>
                  {node.sublabel && (
                    <span className="text-xs text-muted-foreground block">{node.sublabel}</span>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
