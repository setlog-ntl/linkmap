// ---------------------------------------------------------------------------
// MCP config file parser
// Supports: Claude Desktop, Claude Code (.mcp.json), Cursor
// All share the same core structure: { mcpServers: { [name]: { command, args, env } } }
// ---------------------------------------------------------------------------

interface ParsedMcpServer {
  slug: string;
  name: string;
  transport: 'stdio' | 'sse' | 'streamable-http';
  command: string | null;
  args: string[];
  url: string | null;
  env_vars: Array<{ key_name: string; value: string }>;
}

type ConfigFormat = 'claude-desktop' | 'claude-code' | 'cursor' | 'unknown';

interface ParseSuccess {
  success: true;
  format: ConfigFormat;
  servers: ParsedMcpServer[];
}

interface ParseError {
  success: false;
  error: string;
}

export type ParseResult = ParseSuccess | ParseError;

export function parseMcpConfig(content: string): ParseResult {
  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(content.trim());
  } catch {
    return { success: false, error: 'JSON 파싱에 실패했습니다. 올바른 MCP 설정 파일인지 확인해주세요.' };
  }

  // All three formats use mcpServers key
  const mcpServers = parsed.mcpServers as Record<string, Record<string, unknown>> | undefined;

  if (!mcpServers || typeof mcpServers !== 'object') {
    return { success: false, error: 'mcpServers 키를 찾을 수 없습니다. Claude Desktop, Claude Code, 또는 Cursor MCP 설정 파일을 사용해주세요.' };
  }

  const format = detectFormat(parsed);
  const servers: ParsedMcpServer[] = [];

  for (const [name, config] of Object.entries(mcpServers)) {
    if (!config || typeof config !== 'object') continue;

    const server = parseServerEntry(name, config);
    servers.push(server);
  }

  if (servers.length === 0) {
    return { success: false, error: 'MCP 서버 설정을 찾을 수 없습니다.' };
  }

  return { success: true, format, servers };
}

function detectFormat(parsed: Record<string, unknown>): ConfigFormat {
  // Claude Desktop has additional keys like globalShortcut, etc.
  if ('globalShortcut' in parsed || 'allowedDirectories' in parsed) {
    return 'claude-desktop';
  }
  // Cursor sometimes has 'cursor' key
  if ('cursor' in parsed) {
    return 'cursor';
  }
  // Default to claude-code format
  return 'claude-code';
}

function parseServerEntry(name: string, config: Record<string, unknown>): ParsedMcpServer {
  const command = typeof config.command === 'string' ? config.command : null;
  const args = Array.isArray(config.args) ? config.args.map(String) : [];
  const url = typeof config.url === 'string' ? config.url : null;

  // Detect transport from config
  let transport: 'stdio' | 'sse' | 'streamable-http' = 'stdio';
  if (url) {
    transport = 'sse';
  }
  if (typeof config.transport === 'string') {
    const t = config.transport as string;
    if (t === 'sse' || t === 'streamable-http') transport = t;
  }

  // Extract env vars
  const envObj = (config.env ?? {}) as Record<string, string>;
  const env_vars = Object.entries(envObj)
    .filter(([, v]) => typeof v === 'string')
    .map(([key_name, value]) => ({ key_name, value }));

  // Derive slug from name (kebab-case)
  const slug = deriveSlug(name, args);

  return {
    slug,
    name,
    transport,
    command,
    args,
    url,
    env_vars,
  };
}

/** Derive a catalog-matchable slug from the server name and args */
function deriveSlug(name: string, args: string[]): string {
  // Try to extract package name from args (e.g., "-y @supabase/mcp-server" → "supabase-mcp")
  const pkgArg = args.find((a) => a.includes('mcp') || a.startsWith('@'));
  if (pkgArg) {
    // @supabase/mcp-server → supabase-mcp
    const cleaned = pkgArg
      .replace(/^@/, '')
      .replace(/\//g, '-')
      .replace(/^-y\s*/, '');

    if (cleaned.includes('mcp')) {
      // Normalize: "modelcontextprotocol-server-github" → "github-mcp"
      const parts = cleaned.split('-').filter((p) => p !== 'server' && p !== 'mcp' && p !== 'modelcontextprotocol' && p !== 'anthropic' && p !== 'ai');
      if (parts.length > 0) {
        return `${parts.join('-')}-mcp`;
      }
    }
  }

  // Fallback: use the name directly
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
