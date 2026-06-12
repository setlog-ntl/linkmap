#!/usr/bin/env node

/**
 * Linkmap MCP Server v0.3.0
 *
 * SDK 기반 MCP 서버. Claude Code / Cursor에서 Linkmap과 상호작용:
 *
 * Tools:
 *   - list_services: 서비스 카탈로그 조회
 *   - get_project_services: 프로젝트 연결 서비스 조회
 *   - get_env_vars: 프로젝트 환경변수 이름 조회
 *   - search_packages: 패키지 레지스트리 검색
 *   - install_package: 패키지 설치
 *   - export_package: 프로젝트 설정 내보내기
 *   - detect_services: 패키지/환경변수/설정 파일 → 서비스 slug 매핑
 *   - sync_project_services: 감지된 서비스를 Linkmap 프로젝트에 동기화
 *
 * Resources:
 *   - linkmap://catalog/services: 전체 서비스 카탈로그
 *
 * Prompts:
 *   - sync-guide: 서비스 동기화 단계별 안내
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { fetchAPI, hasApiToken } from './lib/api-client.js';
import { NPM_TO_SLUG } from './detection/npm-map.js';
import { CONFIG_FILE_TO_SLUG, CONFIG_DIR_TO_SLUG } from './detection/config-map.js';

// ─── Server 생성 ───────────────────────────────────────────────

const server = new McpServer({
  name: 'linkmap-mcp',
  version: '0.3.0',
});

// ─── 기존 도구들 (6개) ─────────────────────────────────────────

server.tool(
  'list_services',
  'Linkmap 서비스 카탈로그의 모든 서비스를 조회합니다. 카테고리별 필터링이 가능합니다.',
  { category: z.string().optional().describe('카테고리 필터 (auth, database, deploy 등)') },
  async ({ category }) => {
    const query = category ? `?category=${category}` : '';
    const data = await fetchAPI(`/api/services${query}`);
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_project_services',
  '특정 프로젝트에 연결된 서비스 목록을 조회합니다.',
  { project_id: z.string().uuid().describe('프로젝트 UUID') },
  async ({ project_id }) => {
    const data = await fetchAPI(`/api/projects/${project_id}/services`);
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_env_vars',
  '프로젝트의 환경변수 이름을 조회합니다 (값은 포함하지 않음).',
  {
    project_id: z.string().uuid().describe('프로젝트 UUID'),
    environment: z.string().optional().describe('환경: development, staging, production'),
  },
  async ({ project_id, environment }) => {
    const env = environment || 'development';
    const data = await fetchAPI(`/api/projects/${project_id}/env?environment=${env}`);
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'search_packages',
  'Linkmap 패키지 레지스트리에서 서비스 패키지를 검색합니다.',
  {
    query: z.string().optional().describe('검색어 (예: "saas", "ai", "auth")'),
    tag: z.string().optional().describe('태그 필터'),
  },
  async ({ query, tag }) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (tag) params.set('tag', tag);
    const data = await fetchAPI(`/api/packages?${params.toString()}`);
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'install_package',
  '프로젝트에 서비스 패키지를 설치합니다. 패키지의 모든 서비스가 추가되고 환경변수 템플릿이 생성됩니다.',
  {
    project_id: z.string().uuid().describe('설치 대상 프로젝트 UUID'),
    package_slug: z.string().describe('설치할 패키지 slug'),
    version: z.string().optional().describe('특정 버전 (미지정 시 최신)'),
  },
  async ({ project_id, package_slug, version }) => {
    const data = await fetchAPI('/api/packages/install', {
      method: 'POST',
      body: { project_id, package_slug, version: version || undefined },
    });
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'export_package',
  '프로젝트의 서비스 구성을 linkmap.json 패키지 설정으로 내보냅니다.',
  { project_id: z.string().uuid().describe('내보낼 프로젝트 UUID') },
  async ({ project_id }) => {
    const data = await fetchAPI('/api/packages/export', {
      method: 'POST',
      body: { project_id },
    });
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─── 신규 도구: detect_services ────────────────────────────────

server.tool(
  'detect_services',
  `패키지명, 환경변수 키, 설정 파일명을 Linkmap 서비스 slug로 매핑합니다.
sync_project_services 호출 전에 사용하세요.
클라이언트(Claude Code/Cursor)가 프로젝트 파일을 읽어서 발견한 힌트를 전달하면,
Linkmap 카탈로그의 서비스 slug로 변환합니다.`,
  {
    hints: z.array(z.object({
      type: z.enum(['package', 'env_var', 'config_file']).describe('힌트 유형'),
      value: z.string().describe('패키지명, 환경변수 키명, 또는 설정 파일명'),
    })).describe('탐지된 힌트 목록'),
  },
  async ({ hints }) => {
    type Confidence = 'high' | 'medium' | 'none';

    // 1차: 로컬 정적 매핑 테이블로 즉시 매칭
    const results: Array<{ type: string; value: string; slug: string | null; confidence: Confidence; source: string }> = hints.map((hint) => {
      if (hint.type === 'package') {
        const slug = NPM_TO_SLUG[hint.value];
        if (slug) {
          return { type: hint.type, value: hint.value, slug, confidence: 'high' as Confidence, source: 'local_map' };
        }
      }
      if (hint.type === 'config_file') {
        const slug = CONFIG_FILE_TO_SLUG[hint.value] || CONFIG_DIR_TO_SLUG[hint.value];
        if (slug) {
          return { type: hint.type, value: hint.value, slug, confidence: 'high' as Confidence, source: 'local_map' };
        }
      }
      return { type: hint.type, value: hint.value, slug: null, confidence: 'none' as Confidence, source: 'unmatched' };
    });

    // 2차: 매칭 실패한 항목만 서버 API로 추가 매칭 시도
    // 원본 인덱스를 보존하여 응답 병합 시 정확한 위치에 삽입
    const unmatchedWithIndex = results
      .map((r, i) => r.slug === null ? { hint: { type: r.type, value: r.value }, originalIndex: i } : null)
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (unmatchedWithIndex.length > 0 && hasApiToken()) {
      try {
        const apiResult = await fetchAPI<{
          results: Array<{
            type: string;
            value: string;
            slug: string | null;
            service_name: string | null;
            confidence: 'exact' | 'prefix' | 'none';
          }>;
        }>(
          '/api/mcp/detect',
          {
            method: 'POST',
            body: { hints: unmatchedWithIndex.map((u) => u.hint) },
          }
        );

        // 원본 인덱스로 정확하게 병합
        for (let i = 0; i < unmatchedWithIndex.length && i < apiResult.results.length; i++) {
          const serverMatch = apiResult.results[i];
          const idx = unmatchedWithIndex[i].originalIndex;
          if (serverMatch.slug) {
            results[idx].slug = serverMatch.slug;
            results[idx].confidence = serverMatch.confidence === 'exact' ? 'high' : 'medium';
            results[idx].source = 'server_api';
          }
        }
      } catch (err) {
        // 서버 API 실패 시 로컬 매칭 결과만 반환 (의도적 폴백)
        console.error('MCP detect API fallback to local matches:', err);
      }
    }

    const matched = results.filter((r) => r.slug !== null);
    const notFound = results.filter((r) => r.slug === null);

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          matched,
          not_found: notFound,
          summary: `${matched.length}개 매칭, ${notFound.length}개 미매칭`,
        }, null, 2),
      }],
    };
  }
);

// ─── 신규 도구: sync_project_services ──────────────────────────

server.tool(
  'sync_project_services',
  `감지된 서비스를 Linkmap 프로젝트에 동기화합니다.
detect_services로 매핑된 slug 목록을 전달하면,
프로젝트에 이미 연결된 서비스와 비교하여 차분만 추가합니다.

사용 순서:
1. 프로젝트의 package.json, .env 등에서 서비스 힌트 수집
2. detect_services로 slug 매핑
3. 이 도구로 동기화`,
  {
    project_id: z.string().uuid().describe('Linkmap 프로젝트 UUID'),
    detected_services: z.array(z.object({
      slug: z.string().describe('Linkmap 서비스 slug (예: supabase, stripe)'),
      confidence: z.enum(['high', 'medium', 'low']).default('medium').describe('탐지 신뢰도'),
      source: z.string().default('').describe('탐지 출처 (예: "package.json @supabase/supabase-js")'),
      env_vars: z.array(z.string()).optional().describe('관련 환경변수 키 목록'),
    })).describe('동기화할 서비스 목록'),
    create_custom_for_unmatched: z.boolean().default(false)
      .describe('카탈로그에 없는 slug에 대해 커스텀 서비스 자동 생성 여부'),
  },
  async ({ project_id, detected_services, create_custom_for_unmatched }) => {
    const data = await fetchAPI('/api/mcp/sync', {
      method: 'POST',
      body: { project_id, detected_services, create_custom_for_unmatched },
    });
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─── 리소스: 서비스 카탈로그 ───────────────────────────────────

server.resource(
  'service-catalog',
  'linkmap://catalog/services',
  { description: 'Linkmap 전체 서비스 카탈로그 (slug, 카테고리, 설명 포함)' },
  async () => {
    const data = await fetchAPI('/api/services');
    return {
      contents: [{
        uri: 'linkmap://catalog/services',
        mimeType: 'application/json',
        text: JSON.stringify(data, null, 2),
      }],
    };
  }
);

// ─── 리소스: npm 매핑 테이블 ───────────────────────────────────

server.resource(
  'npm-mapping',
  'linkmap://detection/npm-map',
  { description: 'npm 패키지명 → Linkmap 서비스 slug 매핑 테이블' },
  async () => ({
    contents: [{
      uri: 'linkmap://detection/npm-map',
      mimeType: 'application/json',
      text: JSON.stringify(NPM_TO_SLUG, null, 2),
    }],
  })
);

// ─── 프롬프트: 동기화 가이드 ───────────────────────────────────

server.prompt(
  'sync-guide',
  '프로젝트 서비스를 Linkmap에 동기화하는 단계별 가이드',
  { project_id: z.string().optional().describe('Linkmap 프로젝트 UUID (선택)') },
  ({ project_id }) => ({
    messages: [{
      role: 'user' as const,
      content: {
        type: 'text' as const,
        text: `다음 단계로 프로젝트 서비스를 Linkmap에 동기화하세요:

1. **프로젝트 파일 탐색**: package.json의 dependencies와 .env 파일의 환경변수 키를 확인합니다.

2. **서비스 매핑**: detect_services 도구를 호출하여 발견된 패키지명/환경변수 키를 Linkmap 서비스 slug로 변환합니다.
   예시:
   - @supabase/supabase-js → supabase
   - STRIPE_SECRET_KEY → stripe
   - vercel.json → vercel

3. **동기화 실행**: sync_project_services 도구를 호출하여 매핑된 서비스를 프로젝트에 추가합니다.
${project_id ? `\n대상 프로젝트 ID: ${project_id}` : '\n먼저 list_services 또는 get_project_services로 대상 프로젝트를 확인하세요.'}

**참고**: 파일 탐색은 여기서(Claude Code/Cursor) 직접 수행해주세요. MCP 서버는 로컬 파일에 접근할 수 없습니다.
.env 파일의 값(value)은 절대 전송하지 마세요. 키 이름만 사용합니다.`,
      },
    }],
  })
);

// ─── 서버 시작 ─────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Linkmap MCP Server v0.3.0 started');
}

main().catch((err) => {
  console.error('MCP Server failed to start:', err);
  process.exit(1);
});
