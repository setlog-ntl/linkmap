import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError } from '@/lib/api/errors';
import type { ProjectCostSummary, ServiceCostEntry } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: project } = await supabase
    .from('projects')
    .select('id, monthly_budget, budget_currency')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  // project_services + service + cost_tier JOIN
  const { data: rows, error } = await supabase
    .from('project_services')
    .select(
      `id, service_id, cost_tier_id, custom_cost_monthly, custom_cost_yearly,
       cost_notes, billing_cycle,
       service:services(id, name, slug),
       cost_tier:service_cost_tiers(id, tier_name, tier_name_ko, price_monthly, price_yearly)`
    )
    .eq('project_id', id)
    .order('created_at');

  if (error) return serverError(error.message);

  interface CostRow {
    id: string;
    service_id: string;
    cost_tier_id: string | null;
    custom_cost_monthly: number | null;
    custom_cost_yearly: number | null;
    cost_notes: string | null;
    billing_cycle: string;
    service: { id: string; name: string; slug: string } | null;
    cost_tier: {
      id: string;
      tier_name: string;
      tier_name_ko: string | null;
      price_monthly: string | null;
      price_yearly: string | null;
    } | null;
  }

  const typedRows = (rows ?? []) as unknown as CostRow[];

  let totalMonthlyCost = 0;
  let totalYearlyCost = 0;

  const services: ServiceCostEntry[] = typedRows.map((row) => {
    let monthlyCost = 0;
    const isCustomCost = row.custom_cost_monthly != null;

    if (row.custom_cost_monthly != null) {
      monthlyCost = row.custom_cost_monthly;
    } else if (row.cost_tier?.price_monthly) {
      const match = row.cost_tier.price_monthly.match(
        /^\$?([\d,]+\.?\d*)$/
      );
      if (match) {
        monthlyCost = parseFloat(match[1].replace(/,/g, ''));
      }
    }

    totalMonthlyCost += monthlyCost;

    const yearlyCost =
      row.custom_cost_yearly != null
        ? row.custom_cost_yearly
        : monthlyCost * 12;
    totalYearlyCost += yearlyCost;

    return {
      projectServiceId: row.id,
      serviceId: row.service_id,
      serviceName: row.service?.name ?? '',
      serviceSlug: row.service?.slug ?? '',
      costTierId: row.cost_tier_id,
      tierName: row.cost_tier?.tier_name ?? null,
      tierNameKo: row.cost_tier?.tier_name_ko ?? null,
      monthlyCost,
      billingCycle: row.billing_cycle,
      costNotes: row.cost_notes,
      isCustomCost,
    };
  });

  const monthlyBudget = project.monthly_budget as number | null;
  const isOverBudget =
    monthlyBudget != null ? totalMonthlyCost > monthlyBudget : false;
  const budgetUsagePercent =
    monthlyBudget != null && monthlyBudget > 0
      ? Math.round((totalMonthlyCost / monthlyBudget) * 100)
      : null;

  const summary: ProjectCostSummary = {
    totalMonthlyCost,
    totalYearlyCost,
    monthlyBudget,
    budgetCurrency: (project.budget_currency as 'USD' | 'KRW') ?? 'USD',
    isOverBudget,
    budgetUsagePercent,
    services,
  };

  return NextResponse.json(summary);
}
