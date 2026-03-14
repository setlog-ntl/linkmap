import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeKeySchema } from '@/lib/validations/analyze';
import { unauthorizedError, notFoundError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { maskValue } from '@/lib/crypto';
import { parseEnvContent } from '@/lib/utils/parse-env';
import { analyzeApiKeyValue, analyzeEnvContent } from '@/lib/utils/api-key-pattern-matcher';
import {
  buildEnvKeyServiceMap,
  buildEnvPrefixServiceMap,
} from '@/lib/utils/env-service-matcher';
import type { Service } from '@/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = analyzeKeySchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, value, content, key_name } = parsed.data;

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  // Get catalog services for name-based matching
  const { data: catalogServices = [] } = await supabase
    .from('services')
    .select('id, name, required_env_vars');

  const exactMap = buildEnvKeyServiceMap(catalogServices as Service[]);
  const prefixMap = buildEnvPrefixServiceMap(catalogServices as Service[]);

  // Get existing env vars to detect duplicates
  const { data: existingVars = [] } = await supabase
    .from('environment_variables')
    .select('key_name, service_id')
    .eq('project_id', project_id)
    .is('deleted_at', null);

  const existingKeySet = new Set((existingVars ?? []).map((v) => v.key_name));

  // Get existing project services
  const { data: existingProjectServices = [] } = await supabase
    .from('project_services')
    .select('service_id')
    .eq('project_id', project_id);

  const registeredServiceIds = new Set((existingProjectServices ?? []).map((s) => s.service_id));

  interface AnalysisResultItem {
    key_name: string;
    value_preview: string;
    analysis: {
      serviceId: string;
      serviceName: string;
      confidence: string;
      matchedPattern: string;
      suggestedKeyName?: string;
    }[];
    best_match: {
      serviceId: string;
      serviceName: string;
      confidence: string;
    } | null;
    already_exists: boolean;
    service_already_registered: boolean;
  }

  const results: AnalysisResultItem[] = [];

  if (value) {
    // 단일 키 값 분석
    const matches = analyzeApiKeyValue(value);
    const suggestedKey = key_name || matches[0]?.suggestedKeyName || 'API_KEY';
    results.push({
      key_name: suggestedKey,
      value_preview: maskValue(value),
      analysis: matches,
      best_match: matches.length > 0 ? {
        serviceId: matches[0].serviceId,
        serviceName: matches[0].serviceName,
        confidence: matches[0].confidence,
      } : null,
      already_exists: existingKeySet.has(suggestedKey),
      service_already_registered: matches.length > 0 ? registeredServiceIds.has(matches[0].serviceId) : false,
    });
  } else if (content) {
    // .env 대량 분석
    const entries = parseEnvContent(content);
    const analyzed = analyzeEnvContent(entries, exactMap, prefixMap);

    for (const item of analyzed) {
      const allMatches = [
        ...(item.nameMatch ? [{
          serviceId: item.nameMatch.serviceId,
          serviceName: item.nameMatch.serviceName,
          confidence: 'high' as const,
          matchedPattern: `key-name: ${item.keyName}`,
          suggestedKeyName: item.keyName,
        }] : []),
        ...item.valueMatches.filter((vm) => vm.serviceId !== item.nameMatch?.serviceId),
      ];

      results.push({
        key_name: item.keyName,
        value_preview: maskValue(item.value),
        analysis: allMatches,
        best_match: item.bestMatch ? {
          serviceId: item.bestMatch.serviceId,
          serviceName: item.bestMatch.serviceName,
          confidence: item.bestMatch.confidence,
        } : null,
        already_exists: existingKeySet.has(item.keyName),
        service_already_registered: item.bestMatch ? registeredServiceIds.has(item.bestMatch.serviceId) : false,
      });
    }
  }

  const summary = {
    total: results.length,
    matched: results.filter((r) => r.best_match).length,
    already_exists: results.filter((r) => r.already_exists).length,
    new_services: results.filter((r) => r.best_match && !r.service_already_registered).length,
  };

  await logAudit(user.id, {
    action: 'env_var.sync_services',
    resourceType: 'project',
    resourceId: project_id,
    details: { type: 'analyze', summary },
  });

  return NextResponse.json({ results, summary });
}
