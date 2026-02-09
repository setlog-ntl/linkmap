#!/usr/bin/env node

/**
 * SetLog MCP Server
 *
 * Provides tools for Claude Code / Cursor to interact with SetLog:
 * - list_services: List available services from the catalog
 * - get_env_vars: Get environment variable names for a project
 * - get_checklist: Get setup checklist for a service
 *
 * Usage:
 *   Set SETLOG_API_URL and SETLOG_API_TOKEN environment variables
 *   then run this server via MCP configuration.
 */

const API_URL = process.env.SETLOG_API_URL || 'https://setlog-three.vercel.app';
const API_TOKEN = process.env.SETLOG_API_TOKEN || '';

interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
}

const tools: Tool[] = [
  {
    name: 'list_services',
    description: 'List all available services from the SetLog catalog. Returns service names, categories, and descriptions.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (auth, database, deploy, etc.)',
        },
      },
    },
  },
  {
    name: 'get_project_services',
    description: 'Get services connected to a specific project.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The project UUID',
        },
      },
      required: ['project_id'],
    },
  },
  {
    name: 'get_env_vars',
    description: 'Get environment variable names (not values) for a project. Helps identify what needs to be configured.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The project UUID',
        },
        environment: {
          type: 'string',
          description: 'Environment: development, staging, or production',
        },
      },
      required: ['project_id'],
    },
  },
];

async function fetchAPI(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function handleToolCall(name: string, args: Record<string, string>) {
  switch (name) {
    case 'list_services': {
      const data = await fetchAPI(`/api/services${args.category ? `?category=${args.category}` : ''}`);
      return JSON.stringify(data, null, 2);
    }
    case 'get_project_services': {
      const data = await fetchAPI(`/api/projects/${args.project_id}/services`);
      return JSON.stringify(data, null, 2);
    }
    case 'get_env_vars': {
      const env = args.environment || 'development';
      const data = await fetchAPI(`/api/projects/${args.project_id}/env?environment=${env}`);
      return JSON.stringify(data, null, 2);
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

// MCP stdio protocol handler
process.stdin.setEncoding('utf-8');
let buffer = '';

process.stdin.on('data', async (chunk: string) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const message = JSON.parse(line);
      await handleMessage(message);
    } catch (e) {
      // Skip invalid JSON
    }
  }
});

async function handleMessage(message: { id?: number; method: string; params?: Record<string, unknown> }) {
  const { id, method, params } = message;

  switch (method) {
    case 'initialize':
      respond(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'setlog-mcp', version: '0.1.0' },
      });
      break;

    case 'tools/list':
      respond(id, { tools });
      break;

    case 'tools/call': {
      const { name, arguments: args } = params as { name: string; arguments: Record<string, string> };
      try {
        const result = await handleToolCall(name, args || {});
        respond(id, { content: [{ type: 'text', text: result }] });
      } catch (e) {
        respond(id, { content: [{ type: 'text', text: `Error: ${(e as Error).message}` }], isError: true });
      }
      break;
    }

    default:
      respond(id, { error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

function respond(id: number | undefined, result: unknown) {
  const response = JSON.stringify({ jsonrpc: '2.0', id, result });
  process.stdout.write(response + '\n');
}

console.error('SetLog MCP Server started');
