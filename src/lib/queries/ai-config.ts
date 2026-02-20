import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type {
  AiAssistantConfig, AiPersona, AiProvider, AiGuardrails,
  AiPromptTemplate, AiUsageLog, AiUsageSummary,
  AiFeaturePersona, AiFeatureQna,
} from '@/types';
import type {
  CreatePersonaInput, UpdatePersonaInput,
  UpdateProviderInput, UpdateGuardrailsInput,
  CreateTemplateInput, UpdateTemplateInput,
  UpdateGlobalConfigInput, PlaygroundInput,
} from '@/lib/validations/ai-config';
import type { AiFeaturePersonaUpdateInput, CreateFeatureQnaInput, UpdateFeatureQnaInput } from '@/lib/validations/ai-chat';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `요청 실패 (${res.status})`);
  }
  return res.json();
}

// ============================================
// Global Config
// ============================================
export function useAiGlobalConfig() {
  return useQuery({
    queryKey: queryKeys.aiConfig.global,
    queryFn: () => apiFetch<{ config: AiAssistantConfig | null }>('/api/admin/ai-config'),
    select: (data) => data.config,
  });
}

export function useUpdateAiGlobalConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateGlobalConfigInput) =>
      apiFetch<{ config: AiAssistantConfig }>('/api/admin/ai-config', {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.global }),
  });
}

// ============================================
// Personas
// ============================================
export function useAiPersonas() {
  return useQuery({
    queryKey: queryKeys.aiConfig.personas,
    queryFn: () => apiFetch<{ personas: AiPersona[] }>('/api/admin/ai-personas'),
    select: (data) => data.personas,
  });
}

export function useCreateAiPersona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePersonaInput) =>
      apiFetch<{ persona: AiPersona }>('/api/admin/ai-personas', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.personas }),
  });
}

export function useUpdateAiPersona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdatePersonaInput & { id: string }) =>
      apiFetch<{ persona: AiPersona }>(`/api/admin/ai-personas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.personas }),
  });
}

export function useDeleteAiPersona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/admin/ai-personas/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.personas }),
  });
}

// ============================================
// Providers
// ============================================
export function useAiProviders() {
  return useQuery({
    queryKey: queryKeys.aiConfig.providers,
    queryFn: () => apiFetch<{ providers: AiProvider[] }>('/api/admin/ai-providers'),
    select: (data) => data.providers,
  });
}

export function useUpdateAiProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, ...input }: UpdateProviderInput & { slug: string }) =>
      apiFetch<{ provider: AiProvider }>('/api/admin/ai-providers', {
        method: 'PUT',
        body: JSON.stringify({ slug, ...input }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.providers }),
  });
}

// ============================================
// Guardrails
// ============================================
export function useAiGuardrails() {
  return useQuery({
    queryKey: queryKeys.aiConfig.guardrails,
    queryFn: () => apiFetch<{ guardrails: AiGuardrails | null }>('/api/admin/ai-guardrails'),
    select: (data) => data.guardrails,
  });
}

export function useUpdateAiGuardrails() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateGuardrailsInput) =>
      apiFetch<{ guardrails: AiGuardrails }>('/api/admin/ai-guardrails', {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.guardrails }),
  });
}

// ============================================
// Templates
// ============================================
export function useAiTemplates() {
  return useQuery({
    queryKey: queryKeys.aiConfig.templates,
    queryFn: () => apiFetch<{ templates: AiPromptTemplate[] }>('/api/admin/ai-templates'),
    select: (data) => data.templates,
  });
}

export function useCreateAiTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTemplateInput) =>
      apiFetch<{ template: AiPromptTemplate }>('/api/admin/ai-templates', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.templates }),
  });
}

export function useUpdateAiTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateTemplateInput & { id: string }) =>
      apiFetch<{ template: AiPromptTemplate }>(`/api/admin/ai-templates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.templates }),
  });
}

export function useDeleteAiTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/admin/ai-templates/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.templates }),
  });
}

// ============================================
// Usage
// ============================================
export function useAiUsage(period?: string) {
  return useQuery({
    queryKey: queryKeys.aiConfig.usage(period),
    queryFn: () =>
      apiFetch<{ summary: AiUsageSummary; logs: AiUsageLog[] }>(
        `/api/admin/ai-usage?period=${period || 'today'}`
      ),
  });
}

// ============================================
// Playground
// ============================================
export function useAiPlayground() {
  return useMutation({
    mutationFn: (input: PlaygroundInput) =>
      apiFetch<{
        reply: string;
        usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
        response_time_ms: number;
      }>('/api/admin/ai-playground', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  });
}

// ============================================
// Feature Personas (Admin)
// ============================================
export function useAiFeaturePersonas() {
  return useQuery({
    queryKey: queryKeys.aiConfig.featurePersonas,
    queryFn: () => apiFetch<{ features: AiFeaturePersona[] }>('/api/admin/ai-feature-personas'),
    select: (data) => data.features,
  });
}

export function useUpdateAiFeaturePersona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AiFeaturePersonaUpdateInput) =>
      apiFetch<{ feature: AiFeaturePersona }>('/api/admin/ai-feature-personas', {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.featurePersonas }),
  });
}

// ============================================
// Feature Q&A (Admin)
// ============================================
export function useAiFeatureQna(slug: string) {
  return useQuery({
    queryKey: queryKeys.aiConfig.featureQna(slug),
    queryFn: () =>
      apiFetch<{ qna: AiFeatureQna[] }>(`/api/admin/ai-feature-qna?feature_slug=${slug}`),
    select: (data) => data.qna,
    enabled: !!slug,
  });
}

export function useCreateAiFeatureQna() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFeatureQnaInput) =>
      apiFetch<{ qna: AiFeatureQna }>('/api/admin/ai-feature-qna', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, variables) =>
      qc.invalidateQueries({ queryKey: queryKeys.aiConfig.featureQna(variables.feature_slug) }),
  });
}

export function useUpdateAiFeatureQna(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateFeatureQnaInput & { id: string }) =>
      apiFetch<{ qna: AiFeatureQna }>(`/api/admin/ai-feature-qna/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.featureQna(slug) }),
  });
}

export function useDeleteAiFeatureQna(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/admin/ai-feature-qna/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.aiConfig.featureQna(slug) }),
  });
}
