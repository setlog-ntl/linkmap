import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, configurationError } from '@/lib/api/errors';
import { aiCommandSchema } from '@/lib/validations/ai-command';
import { resolveOpenAIKey, AIKeyNotConfiguredError } from '@/lib/ai/resolve-key';
import { callOpenAIWithTools, type ToolDefinition } from '@/lib/ai/openai';
import { logAudit } from '@/lib/audit';
import { services as serviceCatalog } from '@/data/seed/services';

const tools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'add_service',
      description: 'Add a service to the project by slug',
      parameters: {
        type: 'object',
        properties: { slug: { type: 'string', description: 'Service slug from catalog' } },
        required: ['slug'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'remove_service',
      description: 'Remove a service from the project by slug',
      parameters: {
        type: 'object',
        properties: { slug: { type: 'string', description: 'Service slug to remove' } },
        required: ['slug'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navigate_to',
      description: 'Navigate to a specific page in the app',
      parameters: {
        type: 'object',
        properties: {
          page: { type: 'string', description: 'Page name: overview, service-map, integrations, env, monitoring, settings, dashboard, services' },
        },
        required: ['page'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_catalog',
      description: 'Search the service catalog by keyword',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string', description: 'Search keyword' } },
        required: ['query'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_services',
      description: 'List all services currently in the project',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  try {
    const body = await request.json();
    const parsed = aiCommandSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { command, project_id } = parsed.data;
    const { apiKey } = await resolveOpenAIKey();

    // Load project services if project context exists
    let projectServices: Array<{ service_id: string; slug: string; name: string }> = [];
    if (project_id) {
      const { data: ps } = await supabase
        .from('project_services')
        .select('service_id, services(slug, name)')
        .eq('project_id', project_id);
      projectServices = (ps || []).map((p) => {
        const svc = p.services as unknown as { slug: string; name: string } | null;
        return {
          service_id: p.service_id,
          slug: svc?.slug || '',
          name: svc?.name || '',
        };
      });
    }

    const actions: Array<{ action: string; data: Record<string, unknown> }> = [];

    const toolExecutor = async (name: string, args: Record<string, unknown>): Promise<string> => {
      switch (name) {
        case 'add_service': {
          const slug = args.slug as string;
          const service = serviceCatalog.find((s) => s.slug === slug);
          if (!service) return JSON.stringify({ error: `서비스 '${slug}'를 찾을 수 없습니다` });
          if (!project_id) return JSON.stringify({ error: '프로젝트 컨텍스트가 없습니다' });
          // Actually add the service
          const { error } = await supabase
            .from('project_services')
            .insert({ project_id, service_id: service.id, user_id: user.id });
          if (error?.code === '23505') return JSON.stringify({ result: `${service.name}은 이미 추가되어 있습니다` });
          if (error) return JSON.stringify({ error: error.message });
          actions.push({ action: 'add_service', data: { slug, name: service.name } });
          return JSON.stringify({ result: `${service.name}을(를) 프로젝트에 추가했습니다` });
        }
        case 'remove_service': {
          const slug = args.slug as string;
          const ps = projectServices.find((p) => p.slug === slug);
          if (!ps) return JSON.stringify({ error: `프로젝트에 '${slug}' 서비스가 없습니다` });
          if (!project_id) return JSON.stringify({ error: '프로젝트 컨텍스트가 없습니다' });
          await supabase.from('project_services').delete().eq('project_id', project_id).eq('service_id', ps.service_id);
          actions.push({ action: 'remove_service', data: { slug, name: ps.name } });
          return JSON.stringify({ result: `${ps.name}을(를) 프로젝트에서 제거했습니다` });
        }
        case 'navigate_to': {
          const page = args.page as string;
          const path = project_id ? `/project/${project_id}/${page === 'overview' ? '' : page}` : `/${page}`;
          actions.push({ action: 'navigate', data: { path } });
          return JSON.stringify({ result: `${page} 페이지로 이동합니다`, path });
        }
        case 'search_catalog': {
          const query = (args.query as string).toLowerCase();
          const results = serviceCatalog
            .filter((s) =>
              s.name.toLowerCase().includes(query) ||
              s.slug.toLowerCase().includes(query) ||
              s.category.toLowerCase().includes(query) ||
              s.tags?.some((t) => t.toLowerCase().includes(query))
            )
            .slice(0, 5)
            .map((s) => ({ slug: s.slug, name: s.name, category: s.category }));
          return JSON.stringify({ results });
        }
        case 'list_services': {
          return JSON.stringify({ services: projectServices });
        }
        default:
          return JSON.stringify({ error: `Unknown tool: ${name}` });
      }
    };

    const catalogSlugs = serviceCatalog.map((s) => `${s.slug}(${s.name})`).join(', ');

    const systemPrompt = `당신은 인프라 관리 AI 어시스턴트입니다. 사용자의 자연어 명령을 이해하고 적절한 도구를 호출합니다.

사용 가능한 서비스: ${catalogSlugs}

현재 프로젝트 서비스: ${projectServices.map((p) => p.name).join(', ') || '없음'}

규칙:
1. 사용자가 서비스 추가를 요청하면 add_service 호출
2. 페이지 이동 요청 시 navigate_to 호출
3. 한국어로 간결하게 응답
4. 도구 호출 결과를 자연스럽게 설명`;

    const { content } = await callOpenAIWithTools(
      apiKey,
      [{ role: 'user', content: command }],
      systemPrompt,
      tools,
      toolExecutor,
      { model: 'gpt-4o-mini', temperature: 0.2, max_tokens: 1024 },
      3,
    );

    logAudit(user.id, {
      action: 'ai.command',
      resourceType: 'ai',
      details: { command: command.slice(0, 100), actions },
    });

    return Response.json({ message: content, actions });
  } catch (err) {
    if (err instanceof AIKeyNotConfiguredError) {
      return configurationError(err.message, 'ai_key_not_configured');
    }
    return serverError(err instanceof Error ? err.message : '명령 처리 실패');
  }
}
