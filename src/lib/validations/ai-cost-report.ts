import { z } from 'zod';

export const costReportSchema = z.object({
  project_id: z.string().uuid(),
});

export type CostReportInput = z.infer<typeof costReportSchema>;

// ─── Structured report types ─────────────────────────────────────────────────

export interface CostReportService {
  name: string;
  category: string;
  monthlyCost: number;
  percentage: number;
  status: 'optimal' | 'review' | 'high_cost';
  insight: string;
}

export interface CostReportOptimization {
  title: string;
  description: string;
  estimatedMonthlySaving: number;
  priority: 'high' | 'medium' | 'low';
  effort: 'immediate' | 'short_term' | 'long_term';
}

export interface CostReportAlternative {
  currentServiceName: string;
  alternativeName: string;
  alternativeMonthlyCost: number;
  monthlySaving: number;
  rationale: string;
}

export interface CostReportTrend {
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface CostReportAction {
  action: string;
  timeline: 'immediate' | '1_3_months' | '3_plus_months';
  expectedMonthlySaving: number | null;
}

export interface CostReportResult {
  headline: string;
  totalInsight: string;
  services: CostReportService[];
  optimizations: CostReportOptimization[];
  alternatives: CostReportAlternative[];
  trends: CostReportTrend[];
  actionItems: CostReportAction[];
}

// ─── OpenAI Structured Outputs JSON Schema ────────────────────────────────────

export const COST_REPORT_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  properties: {
    headline: { type: 'string' },
    totalInsight: { type: 'string' },
    services: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          category: { type: 'string' },
          monthlyCost: { type: 'number' },
          percentage: { type: 'number' },
          status: { type: 'string', enum: ['optimal', 'review', 'high_cost'] },
          insight: { type: 'string' },
        },
        required: ['name', 'category', 'monthlyCost', 'percentage', 'status', 'insight'],
        additionalProperties: false,
      },
    },
    optimizations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          estimatedMonthlySaving: { type: 'number' },
          priority: { type: 'string', enum: ['high', 'medium', 'low'] },
          effort: { type: 'string', enum: ['immediate', 'short_term', 'long_term'] },
        },
        required: ['title', 'description', 'estimatedMonthlySaving', 'priority', 'effort'],
        additionalProperties: false,
      },
    },
    alternatives: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          currentServiceName: { type: 'string' },
          alternativeName: { type: 'string' },
          alternativeMonthlyCost: { type: 'number' },
          monthlySaving: { type: 'number' },
          rationale: { type: 'string' },
        },
        required: ['currentServiceName', 'alternativeName', 'alternativeMonthlyCost', 'monthlySaving', 'rationale'],
        additionalProperties: false,
      },
    },
    trends: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          impact: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
        },
        required: ['title', 'description', 'impact'],
        additionalProperties: false,
      },
    },
    actionItems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          action: { type: 'string' },
          timeline: { type: 'string', enum: ['immediate', '1_3_months', '3_plus_months'] },
          expectedMonthlySaving: { type: ['number', 'null'] },
        },
        required: ['action', 'timeline', 'expectedMonthlySaving'],
        additionalProperties: false,
      },
    },
  },
  required: ['headline', 'totalInsight', 'services', 'optimizations', 'alternatives', 'trends', 'actionItems'],
  additionalProperties: false,
};
