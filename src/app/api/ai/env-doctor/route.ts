import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';
import { envDoctorSchema } from '@/lib/validations/ai-env';
import { resolveOpenAIKey } from '@/lib/ai/resolve-key';
import { callOpenAIWithTools, type ToolDefinition } from '@/lib/ai/openai';
import { logAudit } from '@/lib/audit';
import { services as serviceCatalog } from '@/data/seed/services';

const tools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_service_env_requirements',
      description: 'Get required environment variables for a service by its slug',
      parameters: {
        type: 'object',
        properties: { service_slug: { type: 'string' } },
        required: ['service_slug'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_env_var_pattern',
      description: 'Check if an env var key follows standard naming conventions',
      parameters: {
        type: 'object',
        properties: { key_name: { type: 'string' } },
        required: ['key_name'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_project_services',
      description: 'Get list of all services connected to this project',
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
    const parsed = envDoctorSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { project_id } = parsed.data;

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();

    if (!project) return unauthorizedError();

    const { apiKey } = await resolveOpenAIKey();

    // Load project data for tool execution
    const { data: rawEnvVars } = await supabase
      .from('environment_variables')
      .select('key_name, is_secret, description, environment, service_id')
      .eq('project_id', project_id);
    const envVars = rawEnvVars || [];

    const { data: rawProjectServices } = await supabase
      .from('project_services')
      .select('service_id, services(slug, name, category)')
      .eq('project_id', project_id);
    const projectServices = rawProjectServices || [];

    // Tool executor — responds to AI function calls
    const toolExecutor = async (name: string, args: Record<string, unknown>): Promise<string> => {
      switch (name) {
        case 'get_service_env_requirements': {
          const slug = args.service_slug as string;
          const service = serviceCatalog.find((s) => s.slug === slug);
          if (!service) return JSON.stringify({ error: `Service ${slug} not found` });
          return JSON.stringify({
            slug: service.slug,
            name: service.name,
            required_env_vars: service.required_env_vars.map((v) => ({
              name: v.name,
              public: v.public,
              description: v.description,
            })),
          });
        }
        case 'check_env_var_pattern': {
          const keyName = args.key_name as string;
          const issues: string[] = [];
          if (keyName !== keyName.toUpperCase()) issues.push('Not uppercase');
          if (/[^A-Z0-9_]/.test(keyName)) issues.push('Contains invalid characters');
          if (keyName.startsWith('NEXT_PUBLIC_') && envVars.find((v) => v.key_name === keyName)?.is_secret) {
            issues.push('NEXT_PUBLIC_ prefix with is_secret=true — value will be exposed');
          }
          const secretPatterns = ['SECRET', 'KEY', 'TOKEN', 'PASSWORD', 'PRIVATE'];
          const looksSecret = secretPatterns.some((p) => keyName.includes(p));
          const envVar = envVars.find((v) => v.key_name === keyName);
          if (looksSecret && envVar && !envVar.is_secret) {
            issues.push('Looks like a secret but is_secret=false');
          }
          return JSON.stringify({ key_name: keyName, valid: issues.length === 0, issues });
        }
        case 'get_project_services': {
          const svcInfo = (ps: typeof projectServices[number]) => {
            const svc = ps.services as unknown as { slug: string; name: string; category: string } | null;
            return { service_id: ps.service_id, slug: svc?.slug, name: svc?.name, category: svc?.category };
          };
          return JSON.stringify(projectServices.map(svcInfo));
        }
        default:
          return JSON.stringify({ error: `Unknown tool: ${name}` });
      }
    };

    // Build env var summary (NO decrypted values)
    const envSummary = envVars.map((v) => ({
      key_name: v.key_name,
      is_secret: v.is_secret,
      environment: v.environment,
      has_service: !!v.service_id,
      description: v.description || '',
    }));

    const systemPrompt = `당신은 DevOps 환경변수 전문가입니다. 프로젝트의 환경변수 설정을 진단합니다.

프로젝트 환경변수 (값은 보안상 제공하지 않음):
${JSON.stringify(envSummary)}

진단 항목:
1. 연결된 서비스에 필요한 환경변수가 누락되었는지 확인
2. 서비스에 연결되지 않은 고아 변수 식별
3. 보안 미설정 (secret이어야 하는 변수가 non-secret)
4. 네이밍 컨벤션 위반

도구를 사용하여 서비스 요구사항을 조회하고, 각 변수의 패턴을 확인하세요.

최종 응답은 아래 형식의 JSON으로 하세요:
{
  "issues": [
    { "severity": "high|medium|low", "category": "missing|orphan|security|naming", "key_name": "변수명", "message": "설명", "fix": "수정 제안" }
  ],
  "summary": "요약 (한국어 1~2문장)"
}`;

    const { content, usage } = await callOpenAIWithTools(
      apiKey,
      [{ role: 'user', content: '이 프로젝트의 환경변수를 진단해주세요.' }],
      systemPrompt,
      tools,
      toolExecutor,
      { model: 'gpt-4o', temperature: 0.2, max_tokens: 4096 },
    );

    logAudit(user.id, {
      action: 'ai.env_doctor',
      resourceType: 'project',
      resourceId: project_id,
      details: { env_count: envVars.length, tokens: usage.total_tokens },
    });

    // Parse the JSON from AI response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { issues: [], summary: content };
      return Response.json(result);
    } catch {
      return Response.json({ issues: [], summary: content });
    }
  } catch (err) {
    return serverError(err instanceof Error ? err.message : '환경변수 진단 실패');
  }
}
