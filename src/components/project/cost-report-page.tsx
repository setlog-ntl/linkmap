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
import { cn } from '@/lib/utils';
import {
  useGenerateCostReport,
  useProjectCostSummary,
  useExchangeRate,
} from '@/lib/queries/costs';
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

// ─── Types & Constants ────────────────────────────────────────────────────────

type Currency = 'USD' | 'KRW';

const CHART_COLORS = [
  '#4F7BE0', '#34C07A', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#EC4899', '#F97316',
];

const LOADING_STEPS = [
  '📊 프로젝트 비용 데이터 수집 중...',
  '🔍 서비스별 비용 구조 분석 중...',
  '🤖 AI가 절감 기회와 대안을 탐색 중...',
  '✨ CEO/CFO 전문 리포트 생성 중...',
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
  } catch { /* storage full */ }
  return generatedAt;
}

function loadCurrency(): Currency {
  try { return (localStorage.getItem('cost-report-currency') as Currency) ?? 'USD'; }
  catch { return 'USD'; }
}

// ─── Derived data helpers ─────────────────────────────────────────────────────

function getCategoryData(services: CostReportService[]) {
  const map = new Map<string, number>();
  for (const s of services) map.set(s.category, (map.get(s.category) ?? 0) + s.monthlyCost);
  return Array.from(map.entries())
    .map(([cat, cost]) => ({ name: CATEGORY_KO[cat] ?? cat, cost: +cost.toFixed(2) }))
    .sort((a, b) => b.cost - a.cost);
}

function getProjectionData(monthly: number, maxSaving: number) {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      month: d.toLocaleDateString('ko-KR', { month: 'short' }),
      '현재 추세': +(monthly * Math.pow(1.015, i)).toFixed(2),
      '최적화 후': +(Math.max(0, monthly - maxSaving * Math.min(i / 3, 1)) * Math.pow(1.008, i)).toFixed(2),
    };
  });
}

// ─── SVG donut (HTML export) ──────────────────────────────────────────────────

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
  currency: Currency = 'USD',
  exchangeRate: number = 1350,
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
  const currSymbol = currency === 'KRW' ? '₩' : '$';

  const fmtH = (usd: number): string => {
    if (currency === 'KRW') return `₩${Math.round(usd * exchangeRate).toLocaleString('ko-KR')}`;
    return `$${usd.toFixed(2)}`;
  };
  const fmtHBig = (usd: number): string => {
    if (currency === 'KRW') {
      const krw = Math.round(usd * exchangeRate);
      return krw >= 10000 ? `₩${(krw / 10000).toFixed(1)}만` : `₩${krw.toLocaleString('ko-KR')}`;
    }
    return usd >= 1000 ? `$${(usd / 1000).toFixed(1)}k` : `$${usd.toFixed(0)}`;
  };

  const priColor: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#22c55e' };
  const priLabel: Record<string, string> = { high: '긴급', medium: '중요', low: '권장' };
  const priBg: Record<string, string> = {
    high: 'background:#fee2e2;color:#991b1b',
    medium: 'background:#fef3c7;color:#92400e',
    low: 'background:#d1fae5;color:#065f46',
  };
  const tlLabel: Record<string, string> = { immediate: '즉시 실행', '1_3_months': '1~3개월', '3_plus_months': '3개월 이상' };
  const tlColor: Record<string, string> = { immediate: '#EF4444', '1_3_months': '#F59E0B', '3_plus_months': '#22c55e' };
  const statusLabel: Record<string, string> = { optimal: '✅ 적정', review: '⚠️ 검토', high_cost: '🔴 비용 높음' };
  const statusBg: Record<string, string> = {
    optimal: 'background:#d1fae5;color:#065f46',
    review: 'background:#fef3c7;color:#92400e',
    high_cost: 'background:#fee2e2;color:#991b1b',
  };

  const timelineHTML = (['immediate', '1_3_months', '3_plus_months'] as const).map(tl => {
    const items = report.actionItems.filter(a => a.timeline === tl);
    if (!items.length) return '';
    return `<div style="flex:1;min-width:0">
      <div style="font-size:12px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px">
        <span style="width:12px;height:12px;border-radius:50%;background:${tlColor[tl]};display:inline-block;box-shadow:0 0 0 3px ${tlColor[tl]}22"></span>
        ${tlLabel[tl]}
      </div>
      ${items.map(item => `<div style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:10px;font-size:12px;color:#374151;box-shadow:0 1px 3px rgba(0,0,0,.06)">
        <div style="line-height:1.6">${item.action}</div>
        ${item.expectedMonthlySaving ? `<div style="color:#16a34a;font-size:11px;margin-top:8px;font-weight:600;padding:2px 10px;background:#f0fdf4;border-radius:20px;display:inline-block">${currSymbol} 절감 ${fmtH(item.expectedMonthlySaving)}/월</div>` : ''}
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
@keyframes gradient { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans KR',sans-serif;background:#f8fafc;color:#111827;font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased}
.page{max-width:1100px;margin:0 auto;padding:0 0 80px}
.section{padding:0 40px;margin-bottom:40px}
h2{font-size:15px;font-weight:800;color:#111827;margin-bottom:18px;display:flex;align-items:center;gap:8px}
h2::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,#e5e7eb,transparent);margin-left:8px}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#f9fafb;padding:11px 14px;text-align:left;font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #e5e7eb}
td{padding:11px 14px;border-bottom:1px solid #f3f4f6;color:#374151;vertical-align:top}
tr:nth-child(even) td{background:#fafafa}
tr:last-child td{border-bottom:none}
.card{background:white;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.num{font-variant-numeric:tabular-nums}
@media print{body{background:white}.page{padding:0} .no-print{display:none}}
</style>
</head>
<body>

<!-- ▶ HERO HEADER -->
<div style="background:linear-gradient(135deg,#1e3a8a 0%,#4F7BE0 35%,#34C07A 65%,#06b6d4 100%);background-size:300% 300%;padding:40px;margin-bottom:40px;position:relative;overflow:hidden">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><defs><pattern id=%22g%22 width=%2230%22 height=%2230%22 patternUnits=%22userSpaceOnUse%22><circle cx=%2215%22 cy=%2215%22 r=%221%22 fill=%22rgba(255,255,255,.08)%22/></pattern></defs><rect fill=%22url(%23g)%22 width=%22100%25%22 height=%22100%25%22/></svg>');opacity:.5"></div>
  <div style="position:relative;z-index:1;display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px">✦ Linkmap AI · 비용 분석 리포트</div>
      <div style="font-size:28px;font-weight:900;color:white;line-height:1.2;margin-bottom:8px">${report.headline}</div>
      <div style="font-size:13px;color:rgba(255,255,255,.8);max-width:640px;line-height:1.7">${report.totalInsight}</div>
    </div>
    <div style="text-align:right;flex-shrink:0;margin-left:24px">
      <div style="font-size:11px;color:rgba(255,255,255,.6)">생성일시</div>
      <div style="font-size:12px;color:white;font-weight:600;margin-top:2px">${gAt}</div>
      ${currency === 'KRW' ? `<div style="margin-top:8px;background:rgba(255,255,255,.15);border-radius:20px;padding:3px 10px;font-size:10px;color:white;font-weight:700">환율 ₩${exchangeRate.toLocaleString('ko-KR')}/USD</div>` : ''}
    </div>
  </div>
</div>

<!-- ▶ KEY METRICS -->
<div class="section">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:40px">
    <div style="background:linear-gradient(135deg,#4F7BE0,#3b5fc2);border-radius:14px;padding:22px;color:white;box-shadow:0 4px 14px rgba(79,123,224,.35)">
      <div style="font-size:20px;margin-bottom:6px">💰</div>
      <div style="font-size:10px;font-weight:700;opacity:.8;text-transform:uppercase;letter-spacing:.08em">월 총 비용</div>
      <div class="num" style="font-size:26px;font-weight:900;margin-top:4px;letter-spacing:-.5px">${fmtHBig(total)}</div>
      <div style="font-size:10px;opacity:.65;margin-top:4px">${currency}/월</div>
    </div>
    <div class="card" style="padding:22px">
      <div style="font-size:20px;margin-bottom:6px">📅</div>
      <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.08em">연간 예상 비용</div>
      <div class="num" style="font-size:26px;font-weight:900;margin-top:4px;color:#111827;letter-spacing:-.5px">${fmtHBig(yearly)}</div>
      <div style="font-size:10px;color:#9ca3af;margin-top:4px">${currency}/년</div>
    </div>
    <div style="background:linear-gradient(135deg,#34C07A,#059669);border-radius:14px;padding:22px;color:white;box-shadow:0 4px 14px rgba(52,192,122,.35)">
      <div style="font-size:20px;margin-bottom:6px">🎯</div>
      <div style="font-size:10px;font-weight:700;opacity:.8;text-transform:uppercase;letter-spacing:.08em">최대 절감 가능</div>
      <div class="num" style="font-size:26px;font-weight:900;margin-top:4px;letter-spacing:-.5px">${fmtHBig(maxSaving)}</div>
      <div style="font-size:10px;opacity:.65;margin-top:4px">${currency}/월</div>
    </div>
    <div style="background:${(budgetPct ?? 0) > 100 ? 'linear-gradient(135deg,#EF4444,#dc2626)' : 'white'};border:1px solid #e5e7eb;border-radius:14px;padding:22px;color:${(budgetPct ?? 0) > 100 ? 'white' : '#111827'};box-shadow:${(budgetPct ?? 0) > 100 ? '0 4px 14px rgba(239,68,68,.35)' : '0 2px 8px rgba(0,0,0,.06)'}">
      <div style="font-size:20px;margin-bottom:6px">⚡</div>
      <div style="font-size:10px;font-weight:700;opacity:${(budgetPct ?? 0) > 100 ? '.8' : '1'};color:${(budgetPct ?? 0) > 100 ? 'white' : '#6b7280'};text-transform:uppercase;letter-spacing:.08em">예산 소진율</div>
      <div class="num" style="font-size:26px;font-weight:900;margin-top:4px;letter-spacing:-.5px">${budget ? `${budgetPct ?? 0}%` : 'N/A'}</div>
      <div style="font-size:10px;opacity:${(budgetPct ?? 0) > 100 ? '.65' : '1'};color:${(budgetPct ?? 0) > 100 ? 'white' : '#9ca3af'};margin-top:4px">${budget ? `${fmtH(budget)} 예산` : '예산 미설정'}</div>
    </div>
  </div>
</div>

<!-- ▶ CHARTS ROW -->
<div class="section">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:16px">
    <div class="card" style="padding:24px">
      <h2>서비스별 비용 분포</h2>
      <div style="display:flex;align-items:center;gap:20px">
        ${svgDonut(donutData, 160)}
        <div style="flex:1">
          ${report.services.map((s, i) => `
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <span style="display:flex;align-items:center;gap:8px;font-size:12px">
              <span style="width:10px;height:10px;border-radius:50%;background:${CHART_COLORS[i % 8]};display:inline-block;flex-shrink:0"></span>
              <span style="color:#374151">${s.name}</span>
            </span>
            <span style="font-size:12px;font-weight:700;color:#111827" class="num">${fmtH(s.monthlyCost)}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card" style="padding:24px">
      <h2>카테고리별 월 비용</h2>
      ${catData.map((c, i) => `
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
          <span style="color:#374151;font-weight:500">${c.name}</span>
          <span class="num" style="font-weight:700;color:#111827">${fmtH(c.cost)}</span>
        </div>
        <div style="background:#f1f5f9;border-radius:6px;height:8px;overflow:hidden">
          <div style="height:100%;border-radius:6px;background:${CHART_COLORS[i % 8]};width:${Math.round((c.cost / maxCat) * 100)}%;transition:width .3s"></div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</div>

<!-- ▶ SERVICE TABLE -->
<div class="section">
  <h2>서비스별 상세 분석</h2>
  <div class="card">
    <table>
      <thead><tr>
        <th>서비스명</th><th>카테고리</th>
        <th style="text-align:right">월 비용</th><th style="text-align:right">비중</th>
        <th>상태</th><th>인사이트</th>
      </tr></thead>
      <tbody>
        ${report.services.map(s => `<tr>
          <td><strong>${s.name}</strong></td>
          <td><span style="font-size:10px;background:#f1f5f9;padding:2px 8px;border-radius:20px;color:#475569">${CATEGORY_KO[s.category] ?? s.category}</span></td>
          <td style="text-align:right;font-weight:800;color:#111827" class="num">${fmtH(s.monthlyCost)}</td>
          <td style="text-align:right;font-size:12px;color:#6b7280">${s.percentage.toFixed(1)}%</td>
          <td><span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;${statusBg[s.status]}">${statusLabel[s.status]}</span></td>
          <td style="color:#6b7280;font-size:11px;max-width:220px">${s.insight}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>

<!-- ▶ OPTIMIZATIONS -->
<div class="section">
  <h2>💡 비용 최적화 기회</h2>
  ${report.optimizations.sort((a, b) => b.estimatedMonthlySaving - a.estimatedMonthlySaving).map(opt => {
    const pct = total > 0 ? Math.round((opt.estimatedMonthlySaving / total) * 100) : 0;
    return `<div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:18px;margin-bottom:14px;border-left:4px solid ${priColor[opt.priority]};box-shadow:0 1px 4px rgba(0,0,0,.06)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px">
        <strong style="font-size:13px;color:#111827;line-height:1.4">${opt.title}</strong>
        <span style="padding:3px 12px;border-radius:20px;font-size:10px;font-weight:700;flex-shrink:0;${priBg[opt.priority]}">${priLabel[opt.priority]}</span>
      </div>
      <p style="font-size:12px;color:#6b7280;margin-bottom:12px;line-height:1.6">${opt.description}</p>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="background:#f0fdf4;color:#15803d;font-size:12px;font-weight:700;padding:4px 14px;border-radius:20px;border:1px solid #bbf7d0" class="num">절감 ${fmtH(opt.estimatedMonthlySaving)}/월</span>
        <div style="flex:1;background:#f1f5f9;border-radius:20px;height:6px;overflow:hidden;max-width:120px">
          <div style="height:100%;border-radius:20px;background:linear-gradient(90deg,#34C07A,#4F7BE0);width:${Math.min(pct * 3, 100)}%"></div>
        </div>
        <span style="font-size:10px;color:#9ca3af">비용 대비 ${pct}%</span>
      </div>
    </div>`;
  }).join('')}
</div>

${report.alternatives.length > 0 ? `<!-- ▶ ALTERNATIVES -->
<div class="section">
  <h2>🔄 대안 서비스 제안</h2>
  <div class="card">
    <table>
      <thead><tr>
        <th>현재 서비스</th><th>추천 대안</th>
        <th style="text-align:right">대안 월 비용</th><th style="text-align:right">예상 절감</th><th>전환 근거</th>
      </tr></thead>
      <tbody>
        ${report.alternatives.map(alt => `<tr>
          <td style="font-weight:500">${alt.currentServiceName}</td>
          <td style="color:#4F7BE0;font-weight:700">${alt.alternativeName}</td>
          <td style="text-align:right" class="num">${fmtH(alt.alternativeMonthlyCost)}</td>
          <td style="text-align:right"><span style="background:#f0fdf4;color:#15803d;font-weight:700;padding:2px 10px;border-radius:20px;font-size:11px" class="num">${fmtH(alt.monthlySaving)}/월</span></td>
          <td style="color:#6b7280;font-size:11px;max-width:200px">${alt.rationale}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>` : ''}

<!-- ▶ ACTION TIMELINE -->
<div class="section">
  <h2>⚡ 실행 계획</h2>
  <div style="display:flex;gap:20px">${timelineHTML}</div>
</div>

${report.trends.length > 0 ? `<!-- ▶ TRENDS -->
<div class="section">
  <h2>📈 시장 트렌드</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
    ${report.trends.map(t => `<div class="card" style="padding:18px;border-top:3px solid ${t.impact === 'positive' ? '#34C07A' : t.impact === 'negative' ? '#EF4444' : '#94a3b8'}">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:${t.impact === 'positive' ? '#15803d' : t.impact === 'negative' ? '#dc2626' : '#475569'}">
        ${t.impact === 'positive' ? '↑' : t.impact === 'negative' ? '↓' : '—'} ${t.title}
      </div>
      <p style="font-size:11px;color:#6b7280;line-height:1.7">${t.description}</p>
    </div>`).join('')}
  </div>
</div>` : ''}

<!-- ▶ FOOTER -->
<div style="margin:0 40px;padding-top:24px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#9ca3af">
  <span>생성: ${gAt} · 통화: ${currency}${currency === 'KRW' ? ` (₩${exchangeRate.toLocaleString('ko-KR')}/USD)` : ''} · Powered by Linkmap AI</span>
  <span>본 리포트는 AI 분석 기반이며 참고용입니다. 실제 비용과 다를 수 있습니다.</span>
</div>

</body>
</html>`;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton({ step }: { step: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-brand-blue/10 via-background to-brand-green/10 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        <div className="flex items-center gap-3 mb-5">
          <Sparkles className="h-5 w-5 text-brand-blue animate-pulse" />
          <p className="text-sm font-semibold">{step}</p>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <Skeleton className="h-52 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, extra }: {
  icon: React.ElementType;
  title: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-blue/10">
        <Icon className="h-3.5 w-3.5 text-brand-blue" />
      </div>
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      {extra}
      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CostReportPageProps {
  projectId: string;
  /** 데모 모드: 리포트 생성 버튼 숨김, API 호출 차단 */
  isDemo?: boolean;
  /** 데모/초기 리포트 데이터 (localStorage 불필요 시) */
  initialReport?: { report: CostReportResult; generatedAt: string };
  /** 뒤로가기 링크 (기본값: /project/${projectId}/costs) */
  backHref?: string;
}

export function CostReportPage({ projectId, isDemo = false, initialReport, backHref }: CostReportPageProps) {
  const [report, setReport] = useState<CostReportResult | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currency, setCurrency] = useState<Currency>('USD');

  const { data: costSummary } = useProjectCostSummary(projectId);
  const { data: exchangeRateData } = useExchangeRate();
  const mutation = useGenerateCostReport(projectId);

  const rate = exchangeRateData?.rate ?? 1350;

  // Currency formatters (closure over currency + rate)
  const fmt = (usd: number): string => {
    if (currency === 'KRW') return `₩${Math.round(usd * rate).toLocaleString('ko-KR')}`;
    return `$${usd.toFixed(2)}`;
  };
  const fmtBig = (usd: number): string => {
    if (currency === 'KRW') {
      const krw = Math.round(usd * rate);
      return krw >= 10000000 ? `₩${(krw / 10000000).toFixed(1)}천만` :
             krw >= 10000 ? `₩${(krw / 10000).toFixed(0)}만` :
             `₩${krw.toLocaleString('ko-KR')}`;
    }
    if (usd >= 1000) return `$${(usd / 1000).toFixed(1)}k`;
    return `$${usd.toFixed(0)}`;
  };
  const fmtAxis = (usd: number): string => {
    if (currency === 'KRW') {
      const krw = Math.round(usd * rate);
      return krw >= 10000 ? `₩${Math.round(krw / 10000)}만` : `₩${krw.toLocaleString('ko-KR')}`;
    }
    return usd >= 1000 ? `$${(usd / 1000).toFixed(1)}k` : `$${usd.toFixed(0)}`;
  };

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

  // Load from storage or auto-generate on mount
  useEffect(() => {
    setCurrency(loadCurrency());
    if (initialReport) {
      setReport(initialReport.report);
      setGeneratedAt(initialReport.generatedAt);
      return;
    }
    const stored = loadStoredReport(projectId);
    if (stored) {
      setReport(stored.report);
      setGeneratedAt(stored.generatedAt);
    } else if (!isDemo) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist currency preference
  useEffect(() => {
    try { localStorage.setItem('cost-report-currency', currency); } catch { /* ignore */ }
  }, [currency]);

  // Loading step animation
  useEffect(() => {
    if (!mutation.isPending) return;
    const id = setInterval(() => setLoadingStep(p => (p + 1) % LOADING_STEPS.length), 1500);
    return () => clearInterval(id);
  }, [mutation.isPending]);

  const handleDownload = useCallback(() => {
    if (!report) return;
    const at = generatedAt ?? new Date().toISOString();
    const html = generateHTMLReport(report, costSummary, at, currency, rate);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-report-${new Date(at).toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('HTML 리포트 다운로드 완료');
  }, [report, costSummary, generatedAt, currency, rate]);

  // ── Chart data (converted to display currency) ────────────────────────────
  const rawServices = report?.services ?? [];
  const maxSaving = report ? Math.max(...report.optimizations.map(o => o.estimatedMonthlySaving), 0) : 0;
  const totalOptSaving = report ? report.optimizations.reduce((s, o) => s + o.estimatedMonthlySaving, 0) : 0;

  const toDisplay = (usd: number) => currency === 'KRW' ? Math.round(usd * rate) : usd;

  const chartServices = rawServices.map(s => ({ ...s, displayCost: toDisplay(s.monthlyCost) }));
  const rawCategoryData = getCategoryData(rawServices);
  const chartCategoryData = rawCategoryData.map(c => ({ ...c, cost: toDisplay(c.cost) }));
  const rawProjectionData = report && costSummary
    ? getProjectionData(costSummary.totalMonthlyCost, maxSaving)
    : [];
  const chartProjectionData = rawProjectionData.map(d => ({
    month: d.month,
    '현재 추세': toDisplay(d['현재 추세']),
    '최적화 후': toDisplay(d['최적화 후']),
  }));
  const chartServiceRank = [...chartServices].sort((a, b) => b.displayCost - a.displayCost);

  const statusCounts = report ? {
    optimal: report.services.filter(s => s.status === 'optimal').length,
    review: report.services.filter(s => s.status === 'review').length,
    high_cost: report.services.filter(s => s.status === 'high_cost').length,
  } : null;

  const totalMonthly = costSummary?.totalMonthlyCost ?? 0;
  const budgetPct = costSummary?.budgetUsagePercent ?? null;

  // Inline tooltip renderer using current fmt
  const ChartTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: { value: number; name: string; color: string }[];
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border bg-background/95 backdrop-blur-sm px-3 py-2.5 shadow-lg text-xs">
        {label && <p className="font-semibold mb-1.5 text-foreground">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}: <strong>{fmt(typeof p.value === 'number' ? (currency === 'KRW' ? p.value / rate : p.value) : 0)}</strong>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href={backHref ?? `/project/${projectId}/costs`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            비용 관리
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <h1 className="flex items-center gap-2 text-base font-bold">
            <Sparkles className="h-4 w-4 text-brand-blue" />
            AI 비용 분석 리포트
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Currency tab */}
          <div className="flex items-center rounded-lg border p-0.5 bg-muted/50 gap-0.5">
            {(['USD', 'KRW'] as Currency[]).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={cn(
                  'px-3 py-1 text-xs rounded-md font-semibold transition-all',
                  currency === c
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {c === 'USD' ? '$ USD' : '₩ KRW'}
              </button>
            ))}
          </div>

          {generatedAt && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              최근 생성: {new Date(generatedAt).toLocaleString('ko-KR')}
            </span>
          )}
          {report && (
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" />
              HTML 다운로드
            </Button>
          )}
          {!isDemo && (
            <Button
              size="sm"
              className="gap-1.5 h-8 text-xs bg-gradient-to-r from-brand-blue to-brand-green hover:opacity-90"
              onClick={handleGenerate}
              disabled={mutation.isPending}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${mutation.isPending ? 'animate-spin' : ''}`} />
              {mutation.isPending ? '생성 중...' : '재생성'}
            </Button>
          )}
        </div>
      </div>

      {/* KRW 환율 표시 */}
      {currency === 'KRW' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
          <span className="font-semibold">₩ 원화 표시 중</span>
          <span className="text-amber-600/70 dark:text-amber-500/70">
            적용 환율 ₩{rate.toLocaleString('ko-KR')}/USD
            {exchangeRateData?.fallback ? ' (기본값)' : ''}
          </span>
        </div>
      )}

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {mutation.isPending && <LoadingSkeleton step={LOADING_STEPS[loadingStep]} />}

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      {mutation.isError && !report && (
        <div className="rounded-2xl border bg-card p-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-sm text-destructive text-center font-medium">
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

      {/* ── Report Content ───────────────────────────────────────────────────── */}
      {report && (
        <>
          {/* ① Hero: Executive Summary */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-brand-blue to-brand-green opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,.15),transparent_60%)]" />
            <div className="relative px-6 py-6">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">AI 분석 요약</p>
              <p className="text-xl font-extrabold text-white leading-snug">{report.headline}</p>
              <p className="mt-2.5 text-sm text-white/80 leading-relaxed max-w-2xl">{report.totalInsight}</p>
            </div>
          </div>

          {/* ② KPI 메트릭 카드 */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              {
                icon: DollarSign,
                label: '월 총 비용',
                value: fmtBig(totalMonthly),
                sub: `${currency}/월`,
                grad: 'from-blue-600 to-brand-blue',
                white: true,
              },
              {
                icon: BarChart3,
                label: '연간 예상',
                value: fmtBig(costSummary?.totalYearlyCost ?? totalMonthly * 12),
                sub: `${currency}/년`,
                grad: null,
                white: false,
              },
              {
                icon: Target,
                label: '최대 절감',
                value: fmtBig(maxSaving),
                sub: `${currency}/월`,
                grad: 'from-green-500 to-emerald-600',
                white: true,
              },
              {
                icon: Zap,
                label: '예산 소진율',
                value: costSummary?.monthlyBudget ? `${budgetPct ?? 0}%` : 'N/A',
                sub: costSummary?.monthlyBudget ? `${fmt(costSummary.monthlyBudget)} 예산` : '예산 미설정',
                grad: (budgetPct ?? 0) > 100 ? 'from-red-500 to-orange-500' : null,
                white: (budgetPct ?? 0) > 100,
              },
              {
                icon: CheckCircle,
                label: '서비스 현황',
                value: `${report.services.length}개`,
                sub: `적정 ${statusCounts?.optimal ?? 0} · 검토 ${statusCounts?.review ?? 0} · 위험 ${statusCounts?.high_cost ?? 0}`,
                grad: null,
                white: false,
              },
            ].map(({ icon: Icon, label, value, sub, grad, white }) => (
              <Card key={label} className={cn(
                'border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5',
                grad ? `bg-gradient-to-br ${grad} text-white` : '',
              )}>
                <CardContent className="p-4">
                  <Icon className={cn('h-4 w-4 mb-2', white ? 'opacity-70' : 'text-muted-foreground')} />
                  <p className={cn('text-[10px] font-bold uppercase tracking-wide', white ? 'opacity-75' : 'text-muted-foreground')}>{label}</p>
                  <p className={cn('text-2xl font-extrabold mt-0.5 tracking-tight', white ? '' : 'text-foreground')}>{value}</p>
                  <p className={cn('text-[10px] mt-0.5', white ? 'opacity-60' : 'text-muted-foreground')}>{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ③ 차트 Row 1: 도넛 + 카테고리 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">서비스별 비용 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartServices}
                        dataKey="displayCost"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={98}
                        paddingAngle={2}
                        strokeWidth={2}
                        stroke="hsl(var(--background))"
                      >
                        {chartServices.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const p = payload[0];
                          const usd = rawServices.find(s => s.name === p.name)?.monthlyCost ?? 0;
                          return (
                            <div className="rounded-xl border bg-background/95 backdrop-blur-sm px-3 py-2.5 shadow-lg text-xs">
                              <p className="font-bold text-foreground">{p.name}</p>
                              <p className="text-muted-foreground mt-0.5">{fmt(usd)}</p>
                            </div>
                          );
                        }}
                      />
                      <Legend formatter={v => <span className="text-xs">{v}</span>} iconSize={9} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">카테고리별 월 비용</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartCategoryData} layout="vertical" margin={{ left: 4, right: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 10 }}
                        tickFormatter={fmtAxis}
                      />
                      <YAxis type="category" dataKey="name" width={68} tick={{ fontSize: 10 }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          const raw = rawCategoryData.find(c => c.name === label)?.cost ?? 0;
                          return (
                            <div className="rounded-xl border bg-background/95 backdrop-blur-sm px-3 py-2.5 shadow-lg text-xs">
                              <p className="font-bold text-foreground">{label}</p>
                              <p className="text-muted-foreground">{fmt(raw)}/월</p>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="cost" name="월 비용" radius={[0, 5, 5, 0]}>
                        {chartCategoryData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ④ 차트 Row 2: 서비스 순위 + 상태 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">서비스 비용 순위</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartServiceRank} layout="vertical" margin={{ left: 4, right: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={fmtAxis} tick={{ fontSize: 10 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={76}
                        tick={{ fontSize: 10 }}
                        tickFormatter={v => v.length > 10 ? v.slice(0, 10) + '…' : v}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          const raw = rawServices.find(s => s.name === label)?.monthlyCost ?? 0;
                          return (
                            <div className="rounded-xl border bg-background/95 px-3 py-2.5 shadow-lg text-xs">
                              <p className="font-bold">{label}</p>
                              <p>{fmt(raw)}/월</p>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="displayCost" name="월 비용" radius={[0, 5, 5, 0]}>
                        {chartServiceRank.map((s, i) => (
                          <Cell
                            key={i}
                            fill={
                              s.status === 'high_cost' ? '#EF4444' :
                              s.status === 'review' ? '#F59E0B' : '#34C07A'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-3">
                  {[['#34C07A', '적정'], ['#F59E0B', '검토 필요'], ['#EF4444', '비용 높음']].map(([c, l]) => (
                    <span key={l} className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-sm" style={{ background: c }} />{l}
                    </span>
                  ))}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
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
                        <span className="text-xs font-bold">{count}개 ({pct}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {costSummary?.monthlyBudget && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium">예산 소진율</span>
                      <span className={cn('text-xs font-extrabold', (budgetPct ?? 0) > 100 ? 'text-destructive' : 'text-foreground')}>
                        {budgetPct ?? 0}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={cn(
                          'h-3 rounded-full transition-all duration-700',
                          (budgetPct ?? 0) > 100 ? 'bg-destructive' :
                          (budgetPct ?? 0) > 80 ? 'bg-yellow-500' : 'bg-brand-blue',
                        )}
                        style={{ width: `${Math.min(budgetPct ?? 0, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {fmt(totalMonthly)} / {fmt(costSummary.monthlyBudget)} 예산
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ⑤ 12개월 비용 시나리오 */}
          {chartProjectionData.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">12개월 비용 시나리오 분석</CardTitle>
                <p className="text-xs text-muted-foreground">
                  현재 추세(+1.5%/월 SaaS 인상) vs 최적화 실행 후 — {currency === 'KRW' ? `환율 ₩${rate.toLocaleString('ko-KR')}/USD 적용` : 'USD 기준'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartProjectionData} margin={{ right: 16 }}>
                      <defs>
                        <linearGradient id="gTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gOpt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34C07A" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#34C07A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 10 }} width={currency === 'KRW' ? 68 : 48} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend formatter={v => <span className="text-xs">{v}</span>} />
                      <Area type="monotone" dataKey="현재 추세" stroke="#EF4444" fill="url(#gTrend)" strokeWidth={2.5} />
                      <Area type="monotone" dataKey="최적화 후" stroke="#34C07A" fill="url(#gOpt)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ⑥ 최적화 기회 */}
          {report.optimizations.length > 0 && (
            <div>
              <SectionHeader
                icon={Target}
                title="비용 최적화 기회"
                extra={
                  <Badge variant="secondary" className="ml-1 text-xs font-bold text-green-700 bg-green-100 dark:bg-green-950/50">
                    총 절감 {fmt(totalOptSaving)}/월
                  </Badge>
                }
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {([...report.optimizations] as CostReportOptimization[])
                  .sort((a, b) => b.estimatedMonthlySaving - a.estimatedMonthlySaving)
                  .map((opt, i) => {
                    const savingPct = totalMonthly > 0
                      ? Math.round((opt.estimatedMonthlySaving / totalMonthly) * 100)
                      : 0;
                    const borderMap = {
                      high: 'border-l-destructive bg-destructive/5 dark:bg-destructive/10',
                      medium: 'border-l-orange-400 bg-orange-50 dark:bg-orange-950/20',
                      low: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
                    };
                    const badgeMap = {
                      high: <Badge variant="destructive" className="text-[10px] h-5 px-2">긴급</Badge>,
                      medium: <Badge className="text-[10px] h-5 px-2 bg-orange-500 hover:bg-orange-600">중요</Badge>,
                      low: <Badge variant="outline" className="text-[10px] h-5 px-2 text-green-600 border-green-500">권장</Badge>,
                    };
                    return (
                      <div key={i} className={cn('rounded-xl border-l-4 p-4 transition-all hover:shadow-sm', borderMap[opt.priority])}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-bold leading-snug">{opt.title}</p>
                          {badgeMap[opt.priority]}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{opt.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                            {fmt(opt.estimatedMonthlySaving)}/월 절감
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {opt.effort === 'immediate' ? '즉시' : opt.effort === 'short_term' ? '단기' : '장기'}
                          </span>
                        </div>
                        {savingPct > 0 && (
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-gradient-to-r from-green-400 to-brand-blue"
                              style={{ width: `${Math.min(savingPct * 4, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ⑦ 대안 서비스 */}
          {report.alternatives.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  대안 서비스 제안
                  <Badge variant="outline" className="text-[10px]">{report.alternatives.length}건</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        {['현재 서비스', '추천 대안', '대안 월 비용', '월 절감액', '전환 근거'].map(h => (
                          <th key={h} className={cn('px-4 py-2.5 text-left font-semibold text-muted-foreground', h.includes('비용') || h.includes('절감') ? 'text-right' : '')}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.alternatives.map((alt, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium">{alt.currentServiceName}</td>
                          <td className="px-4 py-3 text-brand-blue font-bold">{alt.alternativeName}</td>
                          <td className="px-4 py-3 text-right">{fmt(alt.alternativeMonthlyCost)}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">
                              {fmt(alt.monthlySaving)}/월
                            </span>
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
              <SectionHeader icon={Zap} title="실행 계획" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {([
                  { tl: 'immediate', label: '즉시 실행', dot: 'bg-red-500', ring: 'ring-red-100 dark:ring-red-900/30' },
                  { tl: '1_3_months', label: '1~3개월', dot: 'bg-yellow-500', ring: 'ring-yellow-100 dark:ring-yellow-900/30' },
                  { tl: '3_plus_months', label: '3개월 이상', dot: 'bg-green-500', ring: 'ring-green-100 dark:ring-green-900/30' },
                ] as const).map(({ tl, label, dot, ring }) => {
                  const items = report.actionItems.filter(a => a.timeline === tl);
                  if (!items.length) return null;
                  return (
                    <div key={tl}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn('w-3 h-3 rounded-full ring-4', dot, ring)} />
                        <p className="text-xs font-extrabold">{label}</p>
                      </div>
                      <div className="space-y-2">
                        {items.map((item, i) => (
                          <div key={i} className="rounded-xl border bg-card p-3 hover:shadow-sm transition-all">
                            <p className="text-xs text-foreground leading-relaxed">{item.action}</p>
                            {item.expectedMonthlySaving != null && item.expectedMonthlySaving > 0 && (
                              <p className="mt-1.5 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full inline-block">
                                {fmt(item.expectedMonthlySaving)}/월 절감 예상
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
              <SectionHeader icon={TrendingUp} title="SaaS 시장 트렌드" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {report.trends.map((trend, i) => {
                  const Icon = trend.impact === 'positive' ? TrendingUp : trend.impact === 'negative' ? TrendingDown : Minus;
                  const borderColor = trend.impact === 'positive' ? 'border-t-green-400' : trend.impact === 'negative' ? 'border-t-red-400' : 'border-t-muted-foreground/30';
                  const iconClass = trend.impact === 'positive' ? 'text-green-500' : trend.impact === 'negative' ? 'text-red-500' : 'text-muted-foreground';
                  return (
                    <div key={i} className={cn('rounded-xl border bg-card p-4 border-t-4', borderColor)}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={cn('h-3.5 w-3.5', iconClass)} />
                        <p className="text-xs font-bold leading-snug">{trend.title}</p>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{trend.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t text-[10px] text-muted-foreground">
            <span>
              생성: {generatedAt ? new Date(generatedAt).toLocaleString('ko-KR') : '-'}
              {currency === 'KRW' ? ` · 환율 ₩${rate.toLocaleString('ko-KR')}/USD` : ''}
            </span>
            <span>AI 분석 결과는 참고용이며 실제 비용과 다를 수 있습니다.</span>
          </div>
        </>
      )}
    </div>
  );
}
