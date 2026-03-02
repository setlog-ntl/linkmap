'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Sparkles, RefreshCw, Download, AlertCircle,
  TrendingUp, TrendingDown, Minus, DollarSign, Target,
  BarChart3, Zap, CheckCircle, AlertTriangle, XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGenerateCostReport, useProjectCostSummary } from '@/lib/queries/costs';
import { toast } from 'sonner';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';
import type { ProjectCostSummary } from '@/types';
import type {
  CostReportResult,
  CostReportService,
  CostReportOptimization,
} from '@/lib/validations/ai-cost-report';

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  '#4F7BE0', '#34C07A', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#EC4899', '#F97316',
];

const LOADING_STEPS = [
  '📊 프로젝트 비용 데이터 수집 중...',
  '🔍 서비스별 비용 분석 중...',
  '🤖 AI가 절감 기회를 탐색하는 중...',
  '✨ CEO/CFO 리포트 생성 중...',
];

const CATEGORY_KO: Record<string, string> = {
  database: '데이터베이스', auth: '인증', storage: '스토리지',
  email: '이메일', ai: 'AI/ML', monitoring: '모니터링',
  ci_cd: 'CI/CD', cloud_provider: '클라우드', communication: '커뮤니케이션',
  payment: '결제', analytics: '분석', hosting: '호스팅',
  deploy: '배포', testing: '테스팅', cache: '캐시',
  queue: '메시지큐', other: '기타',
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

interface StoredReport { report: CostReportResult; generatedAt: string; }

function loadStoredReport(projectId: string): StoredReport | null {
  try {
    const raw = localStorage.getItem(`cost-report:${projectId}`);
    return raw ? (JSON.parse(raw) as StoredReport) : null;
  } catch { return null; }
}

function saveStoredReport(projectId: string, report: CostReportResult): string {
  const generatedAt = new Date().toISOString();
  try {
    localStorage.setItem(`cost-report:${projectId}`, JSON.stringify({ report, generatedAt }));
  } catch { /* storage full — ignore */ }
  return generatedAt;
}

// ─── Derived data ─────────────────────────────────────────────────────────────

function getCategoryData(services: CostReportService[]) {
  const map = new Map<string, number>();
  for (const s of services) map.set(s.category, (map.get(s.category) ?? 0) + s.monthlyCost);
  return Array.from(map.entries())
    .map(([category, cost]) => ({ name: CATEGORY_KO[category] ?? category, cost: +cost.toFixed(2) }))
    .sort((a, b) => b.cost - a.cost);
}

function getProjectionData(monthly: number, maxSaving: number) {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = d.toLocaleDateString('ko-KR', { month: 'short' });
    const withTrend = +(monthly * Math.pow(1.015, i)).toFixed(0);
    const optimized = +(Math.max(0, monthly - maxSaving * Math.min(i / 3, 1)) * Math.pow(1.008, i)).toFixed(0);
    return { month: label, '현재 추세': withTrend, '최적화 후': optimized };
  });
}

// ─── SVG donut (for HTML export) ─────────────────────────────────────────────

function svgDonut(data: { value: number; color: string }[], size = 220): string {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return '';
  const cx = size / 2, cy = size / 2, R = size / 2 - 14, r = R * 0.56;
  let angle = -Math.PI / 2;
  const paths = data.map(d => {
    const slice = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + slice), y2 = cy + R * Math.sin(angle + slice);
    const ix1 = cx + r * Math.cos(angle + slice), iy1 = cy + r * Math.sin(angle + slice);
    const ix2 = cx + r * Math.cos(angle), iy2 = cy + r * Math.sin(angle);
    const lg = slice > Math.PI ? 1 : 0;
    const p = `M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 ${lg} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${ix1.toFixed(1)} ${iy1.toFixed(1)} A${r} ${r} 0 ${lg} 0 ${ix2.toFixed(1)} ${iy2.toFixed(1)}Z`;
    angle += slice;
    return `<path d="${p}" fill="${d.color}" stroke="white" stroke-width="2"/>`;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}

// ─── HTML Report Generator ────────────────────────────────────────────────────

function generateHTMLReport(
  report: CostReportResult,
  costSummary: ProjectCostSummary | undefined,
  generatedAt: string,
): string {
  const total = costSummary?.totalMonthlyCost ?? 0;
  const yearly = costSummary?.totalYearlyCost ?? total * 12;
  const budget = costSummary?.monthlyBudget;
  const budgetPct = costSummary?.budgetUsagePercent;
  const maxSaving = Math.max(...report.optimizations.map(o => o.estimatedMonthlySaving), 0);
  const catData = getCategoryData(report.services);
  const maxCat = Math.max(...catData.map(c => c.cost), 1);
  const donutData = report.services.map((s, i) => ({ value: s.monthlyCost, color: CHART_COLORS[i % 8] }));
  const gAt = new Date(generatedAt).toLocaleString('ko-KR');
  const priLabel: Record<string, string> = { high: '긴급', medium: '중요', low: '권장' };
  const priColor: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#22c55e' };
  const tlLabel: Record<string, string> = { immediate: '즉시 실행', '1_3_months': '1~3개월', '3_plus_months': '3개월 이상' };
  const tlColor: Record<string, string> = { immediate: '#EF4444', '1_3_months': '#F59E0B', '3_plus_months': '#22c55e' };
  const statusLabel: Record<string, string> = { optimal: '적정', review: '검토 필요', high_cost: '비용 높음' };
  const statusBg: Record<string, string> = { optimal: '#d1fae5;color:#065f46', review: '#fef3c7;color:#92400e', high_cost: '#fee2e2;color:#991b1b' };

  const timelineHTML = (['immediate', '1_3_months', '3_plus_months'] as const).map(tl => {
    const items = report.actionItems.filter(a => a.timeline === tl);
    if (!items.length) return '';
    return `<div style="flex:1;min-width:0">
      <h3 style="font-size:12px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px">
        <span style="width:10px;height:10px;border-radius:50%;background:${tlColor[tl]};display:inline-block"></span>
        ${tlLabel[tl]}
      </h3>
      ${items.map(item => `<div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;font-size:11px;color:#374151">
        ${item.action}
        ${item.expectedMonthlySaving ? `<div style="color:#16a34a;font-size:10px;margin-top:4px;font-weight:600">예상 절감 $${item.expectedMonthlySaving.toFixed(0)}/월</div>` : ''}
      </div>`).join('')}
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI 비용 분석 리포트 — ${gAt}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;color:#111827;font-size:14px;line-height:1.5}
.page{max-width:1100px;margin:0 auto;padding:40px 24px 80px}
h2{font-size:15px;font-weight:700;color:#111827;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #e5e7eb}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#f9fafb;padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #e5e7eb}
td{padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;vertical-align:top}
tr:last-child td{border-bottom:none}
@media print{body{background:white}.page{padding:20px}}
</style>
</head>
<body>
<div class="page">

<!-- Header -->
<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e5e7eb">
  <div>
    <div style="font-size:26px;font-weight:800;color:#111827">AI 비용 분석 리포트</div>
    <div style="font-size:13px;color:#6b7280;margin-top:4px">생성일시: ${gAt}</div>
  </div>
  <div style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#4F7BE0,#34C07A);color:white;font-size:12px;font-weight:600;padding:6px 16px;border-radius:20px">✦ Linkmap AI 분석</div>
</div>

<!-- Executive Summary -->
<div style="margin-bottom:40px">
  <div style="font-size:22px;font-weight:700;margin-bottom:10px">${report.headline}</div>
  <div style="font-size:13px;color:#374151;line-height:1.8;padding:16px 20px;background:#f3f4f6;border-radius:8px;border-left:4px solid #4F7BE0">${report.totalInsight}</div>
</div>

<!-- Key Metrics -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:40px">
  <div style="background:linear-gradient(135deg,#4F7BE0,#34C07A);border-radius:12px;padding:20px;color:white">
    <div style="font-size:11px;font-weight:600;opacity:.8;text-transform:uppercase;letter-spacing:.05em">월 총 비용</div>
    <div style="font-size:28px;font-weight:800;margin-top:6px">$${total.toFixed(2)}</div>
    <div style="font-size:11px;opacity:.7;margin-top:4px">USD / 월</div>
  </div>
  <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:20px">
    <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">연간 예상 비용</div>
    <div style="font-size:28px;font-weight:800;margin-top:6px;color:#111827">$${yearly.toFixed(0)}</div>
    <div style="font-size:11px;color:#9ca3af;margin-top:4px">USD / 년</div>
  </div>
  <div style="background:linear-gradient(135deg,#34C07A,#06B6D4);border-radius:12px;padding:20px;color:white">
    <div style="font-size:11px;font-weight:600;opacity:.8;text-transform:uppercase;letter-spacing:.05em">최대 절감 가능</div>
    <div style="font-size:28px;font-weight:800;margin-top:6px">$${maxSaving.toFixed(0)}</div>
    <div style="font-size:11px;opacity:.7;margin-top:4px">USD / 월</div>
  </div>
  <div style="background:${(budgetPct ?? 0) > 100 ? 'linear-gradient(135deg,#EF4444,#F97316)' : 'white'};border:1px solid #e5e7eb;border-radius:12px;padding:20px;color:${(budgetPct ?? 0) > 100 ? 'white' : '#111827'}">
    <div style="font-size:11px;font-weight:600;opacity:${(budgetPct ?? 0) > 100 ? '.8' : '1'};color:${(budgetPct ?? 0) > 100 ? 'white' : '#6b7280'};text-transform:uppercase;letter-spacing:.05em">예산 소진율</div>
    <div style="font-size:28px;font-weight:800;margin-top:6px">${budget ? `${budgetPct ?? 0}%` : 'N/A'}</div>
    <div style="font-size:11px;opacity:${(budgetPct ?? 0) > 100 ? '.7' : '1'};color:${(budgetPct ?? 0) > 100 ? 'white' : '#9ca3af'};margin-top:4px">${budget ? `$${budget} 예산 대비` : '예산 미설정'}</div>
  </div>
</div>

<!-- Charts Row -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:40px">
  <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:24px">
    <h2>서비스별 비용 분포</h2>
    <div style="display:flex;align-items:center;gap:20px">
      ${svgDonut(donutData, 160)}
      <div style="flex:1">
        ${report.services.map((s, i) => `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:12px">
          <span style="display:flex;align-items:center;gap:8px">
            <span style="width:10px;height:10px;border-radius:50%;background:${CHART_COLORS[i % 8]};flex-shrink:0;display:inline-block"></span>
            <span style="color:#374151">${s.name}</span>
          </span>
          <strong>$${s.monthlyCost.toFixed(1)}</strong>
        </div>`).join('')}
      </div>
    </div>
  </div>
  <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:24px">
    <h2>카테고리별 월 비용</h2>
    ${catData.map(c => `<div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
        <span style="color:#374151">${c.name}</span>
        <span style="font-weight:600">$${c.cost.toFixed(1)}</span>
      </div>
      <div style="background:#f3f4f6;border-radius:4px;height:8px;overflow:hidden">
        <div style="height:100%;border-radius:4px;background:linear-gradient(90deg,#4F7BE0,#34C07A);width:${Math.round((c.cost / maxCat) * 100)}%"></div>
      </div>
    </div>`).join('')}
  </div>
</div>

<!-- Service Detail Table -->
<div style="margin-bottom:40px">
  <h2>서비스별 상세 분석</h2>
  <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <table>
      <thead><tr>
        <th>서비스명</th><th>카테고리</th>
        <th style="text-align:right">월 비용</th><th style="text-align:right">비중</th>
        <th>상태</th><th>인사이트</th>
      </tr></thead>
      <tbody>
        ${report.services.map(s => `<tr>
          <td><strong>${s.name}</strong></td>
          <td>${CATEGORY_KO[s.category] ?? s.category}</td>
          <td style="text-align:right;font-weight:700">$${s.monthlyCost.toFixed(2)}</td>
          <td style="text-align:right">${s.percentage.toFixed(1)}%</td>
          <td><span style="padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;background:${statusBg[s.status]}">${statusLabel[s.status]}</span></td>
          <td style="color:#6b7280;font-size:11px">${s.insight}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>

<!-- Optimization -->
<div style="margin-bottom:40px">
  <h2>비용 최적화 기회</h2>
  ${report.optimizations.sort((a, b) => b.estimatedMonthlySaving - a.estimatedMonthlySaving).map(opt => `
    <div style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:12px;border-left:4px solid ${priColor[opt.priority]}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px">
        <strong style="font-size:13px">${opt.title}</strong>
        <span style="padding:2px 10px;border-radius:20px;font-size:10px;font-weight:600;background:${opt.priority === 'high' ? '#fee2e2;color:#991b1b' : opt.priority === 'medium' ? '#fef3c7;color:#92400e' : '#d1fae5;color:#065f46'};flex-shrink:0">${priLabel[opt.priority]}</span>
      </div>
      <p style="font-size:12px;color:#6b7280;margin-bottom:8px">${opt.description}</p>
      <span style="background:#d1fae5;color:#065f46;font-size:11px;font-weight:600;padding:3px 12px;border-radius:20px">절감 $${opt.estimatedMonthlySaving.toFixed(0)}/월</span>
    </div>
  `).join('')}
</div>

${report.alternatives.length > 0 ? `<!-- Alternatives -->
<div style="margin-bottom:40px">
  <h2>대안 서비스 제안</h2>
  <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <table>
      <thead><tr><th>현재 서비스</th><th>대안</th><th style="text-align:right">대안 월 비용</th><th style="text-align:right">월 절감</th><th>근거</th></tr></thead>
      <tbody>
        ${report.alternatives.map(alt => `<tr>
          <td>${alt.currentServiceName}</td>
          <td style="color:#4F7BE0;font-weight:600">${alt.alternativeName}</td>
          <td style="text-align:right">$${alt.alternativeMonthlyCost.toFixed(2)}</td>
          <td style="text-align:right;color:#16a34a;font-weight:700">$${alt.monthlySaving.toFixed(0)}</td>
          <td style="color:#6b7280;font-size:11px">${alt.rationale}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>` : ''}

<!-- Action Timeline -->
<div style="margin-bottom:40px">
  <h2>실행 계획</h2>
  <div style="display:flex;gap:20px">${timelineHTML}</div>
</div>

${report.trends.length > 0 ? `<!-- Trends -->
<div style="margin-bottom:40px">
  <h2>시장 트렌드</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
    ${report.trends.map(t => `<div style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:16px">
      <div style="font-size:12px;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px">
        <span style="color:${t.impact === 'positive' ? '#16a34a' : t.impact === 'negative' ? '#dc2626' : '#6b7280'}">${t.impact === 'positive' ? '↑' : t.impact === 'negative' ? '↓' : '—'}</span>
        ${t.title}
      </div>
      <p style="font-size:11px;color:#6b7280;line-height:1.6">${t.description}</p>
    </div>`).join('')}
  </div>
</div>` : ''}

<!-- Footer -->
<div style="margin-top:48px;padding-top:24px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#9ca3af">
  <span>생성일시: ${gAt} | Powered by Linkmap AI</span>
  <span>본 리포트는 AI 분석 기반이며 참고용입니다. 실제 비용과 다를 수 있습니다.</span>
</div>

</div>
</body>
</html>`;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton({ step }: { step: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-gradient-to-r from-brand-blue/10 to-brand-green/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-brand-blue animate-pulse" />
          <p className="text-sm font-medium text-foreground">{step}</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function DollarTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-xs">
      <p className="font-semibold mb-1 text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>${p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CostReportPage({ projectId }: { projectId: string }) {
  const [report, setReport] = useState<CostReportResult | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const { data: costSummary } = useProjectCostSummary(projectId);
  const mutation = useGenerateCostReport(projectId);

  const handleGenerate = useCallback(() => {
    setReport(null);
    setLoadingStep(0);
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        const at = saveStoredReport(projectId, data);
        setReport(data);
        setGeneratedAt(at);
        toast.success('리포트가 생성되었습니다.');
      },
      onError: (err) => {
        if (err.message === 'ai_key_not_configured') {
          toast.error('AI 설정에서 OpenAI API 키를 등록하세요.');
        } else {
          toast.error(err.message || 'AI 리포트 생성에 실패했습니다.');
        }
      },
    });
  }, [projectId, mutation]);

  // Load from localStorage or auto-generate
  useEffect(() => {
    const stored = loadStoredReport(projectId);
    if (stored) {
      setReport(stored.report);
      setGeneratedAt(stored.generatedAt);
    } else {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading step cycling
  useEffect(() => {
    if (!mutation.isPending) return;
    const id = setInterval(() => setLoadingStep(p => (p + 1) % LOADING_STEPS.length), 1500);
    return () => clearInterval(id);
  }, [mutation.isPending]);

  const handleDownload = useCallback(() => {
    if (!report) return;
    const at = generatedAt ?? new Date().toISOString();
    const html = generateHTMLReport(report, costSummary, at);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-report-${new Date(at).toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('HTML 리포트 다운로드 완료');
  }, [report, costSummary, generatedAt]);

  // Derived chart data
  const categoryData = report ? getCategoryData(report.services) : [];
  const maxSaving = report ? Math.max(...report.optimizations.map(o => o.estimatedMonthlySaving), 0) : 0;
  const projectionData = report && costSummary
    ? getProjectionData(costSummary.totalMonthlyCost, maxSaving)
    : [];
  const serviceRankData = report
    ? [...report.services].sort((a, b) => b.monthlyCost - a.monthlyCost)
    : [];

  const statusCounts = report ? {
    optimal: report.services.filter(s => s.status === 'optimal').length,
    review: report.services.filter(s => s.status === 'review').length,
    high_cost: report.services.filter(s => s.status === 'high_cost').length,
  } : null;

  const totalMonthly = costSummary?.totalMonthlyCost ?? 0;
  const budgetPct = costSummary?.budgetUsagePercent ?? null;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href={`/project/${projectId}/costs`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            비용 관리
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <h1 className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-brand-blue" />
            AI 비용 분석 리포트
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {generatedAt && (
            <span className="text-xs text-muted-foreground">
              최근 생성: {new Date(generatedAt).toLocaleString('ko-KR')}
            </span>
          )}
          {report && (
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" />
              HTML 다운로드
            </Button>
          )}
          <Button
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={handleGenerate}
            disabled={mutation.isPending}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${mutation.isPending ? 'animate-spin' : ''}`} />
            {mutation.isPending ? '생성 중...' : '리포트 재생성'}
          </Button>
        </div>
      </div>

      {/* ── Loading ─────────────────────────────────────────────────── */}
      {mutation.isPending && <LoadingSkeleton step={LOADING_STEPS[loadingStep]} />}

      {/* ── Error ───────────────────────────────────────────────────── */}
      {mutation.isError && !report && (
        <div className="rounded-xl border bg-card p-10 flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-sm text-destructive text-center">
            {mutation.error.message === 'ai_key_not_configured'
              ? 'AI 설정에서 OpenAI API 키를 등록하세요.'
              : mutation.error.message || '리포트 생성에 실패했습니다.'}
          </p>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleGenerate}>
            <RefreshCw className="h-3.5 w-3.5" />
            다시 시도
          </Button>
        </div>
      )}

      {/* ── Report Content ───────────────────────────────────────────── */}
      {report && (
        <>
          {/* ① Hero: Executive Summary */}
          <div className="rounded-xl border bg-gradient-to-br from-brand-blue/10 via-background to-brand-green/10 px-6 py-5">
            <p className="text-xl font-bold text-foreground">{report.headline}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{report.totalInsight}</p>
          </div>

          {/* ② KPI 메트릭 카드 (5개) */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Card className="border-0 bg-gradient-to-br from-brand-blue to-brand-green text-white shadow-md">
              <CardContent className="p-4">
                <DollarSign className="h-4 w-4 opacity-70 mb-2" />
                <p className="text-xs font-semibold opacity-80">월 총 비용</p>
                <p className="text-2xl font-extrabold mt-0.5">${totalMonthly.toFixed(2)}</p>
                <p className="text-xs opacity-60 mt-0.5">USD / 월</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <BarChart3 className="h-4 w-4 text-muted-foreground mb-2" />
                <p className="text-xs font-semibold text-muted-foreground">연간 예상 비용</p>
                <p className="text-2xl font-extrabold mt-0.5">${(costSummary?.totalYearlyCost ?? totalMonthly * 12).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">USD / 년</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-md">
              <CardContent className="p-4">
                <Target className="h-4 w-4 opacity-70 mb-2" />
                <p className="text-xs font-semibold opacity-80">최대 절감 가능</p>
                <p className="text-2xl font-extrabold mt-0.5">${maxSaving.toFixed(0)}</p>
                <p className="text-xs opacity-60 mt-0.5">USD / 월</p>
              </CardContent>
            </Card>
            <Card className={budgetPct != null && budgetPct > 100 ? 'border-0 bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md' : ''}>
              <CardContent className="p-4">
                <Zap className={`h-4 w-4 mb-2 ${budgetPct != null && budgetPct > 100 ? 'opacity-70' : 'text-muted-foreground'}`} />
                <p className={`text-xs font-semibold ${budgetPct != null && budgetPct > 100 ? 'opacity-80' : 'text-muted-foreground'}`}>예산 소진율</p>
                <p className="text-2xl font-extrabold mt-0.5">
                  {costSummary?.monthlyBudget ? `${budgetPct ?? 0}%` : 'N/A'}
                </p>
                <p className={`text-xs mt-0.5 ${budgetPct != null && budgetPct > 100 ? 'opacity-60' : 'text-muted-foreground'}`}>
                  {costSummary?.monthlyBudget ? `$${costSummary.monthlyBudget} 예산` : '예산 미설정'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground">서비스 상태</p>
                <p className="text-2xl font-extrabold mt-0.5">{report.services.length}개</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  적정 {statusCounts?.optimal ?? 0} / 검토 {statusCounts?.review ?? 0} / 위험 {statusCounts?.high_cost ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ③ 차트 Row 1: 서비스 도넛 + 카테고리 바 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* 서비스 비용 도넛 차트 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">서비스별 비용 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={report.services}
                        dataKey="monthlyCost"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {report.services.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number | string | undefined) => [`$${Number(v ?? 0).toFixed(2)}`, '월 비용']}
                      />
                      <Legend
                        formatter={(value) => <span className="text-xs">{value}</span>}
                        iconSize={10}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 카테고리별 비용 바 차트 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">카테고리별 월 비용 (USD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 8, right: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        tickFormatter={v => `$${v}`}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={72}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip content={<DollarTooltip />} />
                      <Bar dataKey="cost" name="월 비용" radius={[0, 4, 4, 0]}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ④ 차트 Row 2: 서비스 순위 + 상태 분포 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* 서비스별 비용 순위 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">서비스 비용 순위</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceRankData} layout="vertical" margin={{ left: 8, right: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tickFormatter={v => `$${v}`} tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={80}
                        tick={{ fontSize: 10 }}
                        tickFormatter={v => v.length > 10 ? v.slice(0, 10) + '…' : v}
                      />
                      <Tooltip
                        formatter={(v: number | string | undefined) => [`$${Number(v ?? 0).toFixed(2)}`, '월 비용']}
                      />
                      <Bar dataKey="monthlyCost" name="월 비용" radius={[0, 4, 4, 0]}>
                        {serviceRankData.map((s, i) => (
                          <Cell
                            key={i}
                            fill={
                              s.status === 'high_cost' ? '#EF4444' :
                              s.status === 'review' ? '#F59E0B' :
                              '#34C07A'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500" />적정</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-yellow-500" />검토 필요</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500" />비용 높음</span>
                </p>
              </CardContent>
            </Card>

            {/* 서비스 상태 분포 + 예산 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">서비스 비용 상태 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'optimal', label: '비용 적정', count: statusCounts?.optimal ?? 0, color: 'bg-green-500', icon: CheckCircle, iconClass: 'text-green-500' },
                  { key: 'review', label: '검토 필요', count: statusCounts?.review ?? 0, color: 'bg-yellow-500', icon: AlertTriangle, iconClass: 'text-yellow-500' },
                  { key: 'high_cost', label: '비용 높음', count: statusCounts?.high_cost ?? 0, color: 'bg-red-500', icon: XCircle, iconClass: 'text-red-500' },
                ].map(({ label, count, color, icon: Icon, iconClass }) => {
                  const pct = report.services.length > 0 ? Math.round((count / report.services.length) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-medium">
                          <Icon className={`h-3.5 w-3.5 ${iconClass}`} />
                          {label}
                        </span>
                        <span className="text-xs font-semibold">{count}개 ({pct}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}

                {costSummary?.monthlyBudget && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium">예산 소진율</span>
                      <span className={`text-xs font-bold ${(budgetPct ?? 0) > 100 ? 'text-destructive' : 'text-foreground'}`}>
                        {budgetPct ?? 0}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${(budgetPct ?? 0) > 100 ? 'bg-destructive' : (budgetPct ?? 0) > 80 ? 'bg-yellow-500' : 'bg-brand-blue'}`}
                        style={{ width: `${Math.min(budgetPct ?? 0, 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      ${totalMonthly.toFixed(2)} / ${costSummary.monthlyBudget} 예산
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ⑤ 12개월 비용 예측 (CEO/CFO 시나리오 분석) */}
          {projectionData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">12개월 비용 시나리오 분석</CardTitle>
                <p className="text-xs text-muted-foreground">
                  현재 추세(+1.5%/월 SaaS 인상) vs 최적화 실행 후 절감 시나리오
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData} margin={{ right: 12 }}>
                      <defs>
                        <linearGradient id="gradTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradOpt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34C07A" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#34C07A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize: 11 }} />
                      <Tooltip content={<DollarTooltip />} />
                      <Legend formatter={v => <span className="text-xs">{v}</span>} />
                      <Area
                        type="monotone"
                        dataKey="현재 추세"
                        stroke="#EF4444"
                        fill="url(#gradTrend)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="최적화 후"
                        stroke="#34C07A"
                        fill="url(#gradOpt)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ⑥ 최적화 기회 */}
          {report.optimizations.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-brand-blue" />
                비용 최적화 기회
                <Badge variant="secondary" className="ml-1">
                  총 절감 ${report.optimizations.reduce((s, o) => s + o.estimatedMonthlySaving, 0).toFixed(0)}/월
                </Badge>
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[...report.optimizations]
                  .sort((a, b) => b.estimatedMonthlySaving - a.estimatedMonthlySaving)
                  .map((opt: CostReportOptimization, i) => {
                    const borderMap = {
                      high: 'border-l-destructive bg-destructive/5',
                      medium: 'border-l-orange-400 bg-orange-50 dark:bg-orange-950/20',
                      low: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
                    };
                    const badgeMap = {
                      high: <Badge variant="destructive" className="text-[10px] h-5">긴급</Badge>,
                      medium: <Badge className="text-[10px] h-5 bg-orange-500 hover:bg-orange-600">중요</Badge>,
                      low: <Badge variant="outline" className="text-[10px] h-5 text-green-600 border-green-500">권장</Badge>,
                    };
                    const effortMap = {
                      immediate: '즉시 적용',
                      short_term: '1~3개월',
                      long_term: '3개월 이상',
                    };
                    return (
                      <div key={i} className={`rounded-lg border-l-4 p-4 ${borderMap[opt.priority]}`}>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-sm font-semibold leading-snug">{opt.title}</p>
                          {badgeMap[opt.priority]}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{opt.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                            절감 ${opt.estimatedMonthlySaving.toFixed(0)}/월
                          </span>
                          <span className="text-[11px] text-muted-foreground">{effortMap[opt.effort]}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ⑦ 대안 서비스 */}
          {report.alternatives.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  대안 서비스 제안
                  <Badge variant="outline" className="text-[10px]">
                    {report.alternatives.length}건
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">현재 서비스</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">대안 서비스</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">대안 월 비용</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">월 절감액</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">전환 근거</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.alternatives.map((alt, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">{alt.currentServiceName}</td>
                          <td className="px-4 py-3 text-brand-blue font-semibold">{alt.alternativeName}</td>
                          <td className="px-4 py-3 text-right">${alt.alternativeMonthlyCost.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-bold text-green-600">
                            ${alt.monthlySaving.toFixed(0)}/월
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-xs">{alt.rationale}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ⑧ 실행 계획 타임라인 */}
          {report.actionItems.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-blue" />
                실행 계획
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {([
                  { tl: 'immediate', label: '즉시 실행', dot: 'bg-red-500' },
                  { tl: '1_3_months', label: '1~3개월', dot: 'bg-yellow-500' },
                  { tl: '3_plus_months', label: '3개월 이상', dot: 'bg-green-500' },
                ] as const).map(({ tl, label, dot }) => {
                  const items = report.actionItems.filter(a => a.timeline === tl);
                  if (!items.length) return null;
                  return (
                    <div key={tl}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                        <p className="text-xs font-bold">{label}</p>
                      </div>
                      <div className="space-y-2">
                        {items.map((item, i) => (
                          <div key={i} className="rounded-md border bg-card p-3">
                            <p className="text-xs text-foreground leading-relaxed">{item.action}</p>
                            {item.expectedMonthlySaving != null && item.expectedMonthlySaving > 0 && (
                              <p className="mt-1.5 text-[11px] font-semibold text-green-600">
                                예상 절감 ${item.expectedMonthlySaving.toFixed(0)}/월
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ⑨ 시장 트렌드 */}
          {report.trends.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-blue" />
                SaaS 시장 트렌드
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {report.trends.map((trend, i) => {
                  const Icon = trend.impact === 'positive' ? TrendingUp : trend.impact === 'negative' ? TrendingDown : Minus;
                  const iconClass = trend.impact === 'positive' ? 'text-green-500' : trend.impact === 'negative' ? 'text-red-500' : 'text-muted-foreground';
                  return (
                    <div key={i} className="rounded-lg border bg-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`h-4 w-4 ${iconClass}`} />
                        <p className="text-xs font-semibold leading-snug">{trend.title}</p>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{trend.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t text-[11px] text-muted-foreground">
            <span>생성일시: {generatedAt ? new Date(generatedAt).toLocaleString('ko-KR') : '-'}</span>
            <span>AI 분석 결과는 참고용이며 실제 비용과 다를 수 있습니다.</span>
          </div>
        </>
      )}
    </div>
  );
}
