import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { DifficultyLevel, FreeTierQuality, VendorLockInRisk } from '@/types';

// --- Difficulty Badge ---
const difficultyConfig: Record<DifficultyLevel, { label: string; className: string }> = {
  beginner: {
    label: '초급',
    className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  },
  intermediate: {
    label: '중급',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  },
  advanced: {
    label: '고급',
    className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  },
};

export function DifficultyBadge({ level }: { level?: DifficultyLevel }) {
  if (!level) return null;
  const config = difficultyConfig[level];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

// --- GitHub Stars Badge ---
function formatStars(n: number): string {
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function GithubStarsBadge({ stars }: { stars?: number | null }) {
  if (stars == null) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {formatStars(stars)}
    </span>
  );
}

// --- Free Tier Badge ---
const freeTierConfig: Record<FreeTierQuality, { label: string; className: string }> = {
  excellent: {
    label: '무료 우수',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  good: {
    label: '무료 양호',
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  },
  limited: {
    label: '무료 제한',
    className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  },
  none: {
    label: '유료만',
    className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700',
  },
};

export function FreeTierBadge({ quality }: { quality?: FreeTierQuality }) {
  if (!quality) return null;
  const config = freeTierConfig[quality];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

// --- Cost Estimate Badge ---
export function CostEstimateBadge({ estimate }: { estimate?: Record<string, string> }) {
  if (!estimate || Object.keys(estimate).length === 0) return null;
  const values = Object.values(estimate);
  const summary = values.length === 1 ? values[0] : `${values[0]}~${values[values.length - 1]}`;
  return (
    <span className="text-xs text-muted-foreground">
      월 {summary}
    </span>
  );
}

// --- Vendor Lock-In Badge ---
const lockInConfig: Record<VendorLockInRisk, { label: string; className: string }> = {
  low: {
    label: '종속성 낮음',
    className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  },
  medium: {
    label: '종속성 중간',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  },
  high: {
    label: '종속성 높음',
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  },
};

export function VendorLockInBadge({ risk }: { risk?: VendorLockInRisk }) {
  if (!risk) return null;
  const config = lockInConfig[risk];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
