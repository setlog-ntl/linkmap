import { normalizeEnvKey, ENV_KEY_REGEX } from '@/lib/utils/env-key';

export interface ParsedEnvVar {
  key: string;
  value: string;
}

export type EnvFormat = 'dotenv' | 'json' | 'docker-compose';

/**
 * Parse a single KEY=VALUE line.
 * If multi-line text is given, only the first non-empty, non-comment line is processed.
 * Returns { key, value } or null if the line doesn't contain '='.
 */
export function parseEnvLine(text: string): ParsedEnvVar | null {
  // Multi-line input: take only the first valid line
  const firstLine = text.split('\n').find((l) => {
    const s = l.trim();
    return s && !s.startsWith('#');
  });
  const trimmed = (firstLine ?? '').trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) return null;

  const rawKey = trimmed.substring(0, eqIndex).trim();
  let value = trimmed.substring(eqIndex + 1).trim();

  // Remove surrounding quotes
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  const key = normalizeEnvKey(rawKey);

  return { key, value };
}

/**
 * Detect the format of env content.
 */
export function detectEnvFormat(content: string): EnvFormat {
  const trimmed = content.trim();
  // JSON: starts with { or [
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }
  // Docker Compose: contains "environment:" line or lines starting with "- KEY=VALUE"
  const lines = trimmed.split('\n').map((l) => l.trim());
  const hasEnvironmentKey = lines.some((l) => l === 'environment:');
  const hasDashKV = lines.filter((l) => /^-\s+\w+=/.test(l)).length >= 1;
  if (hasEnvironmentKey || (hasDashKV && !lines.some((l) => /^\w+=/.test(l)))) {
    return 'docker-compose';
  }
  return 'dotenv';
}

/**
 * Parse Vercel-style JSON content.
 * Supports: { "KEY": "value", ... } or [{ "key": "KEY", "value": "value" }, ...]
 */
function parseJsonContent(content: string): ParsedEnvVar[] {
  try {
    const data: unknown = JSON.parse(content.trim());
    const vars: ParsedEnvVar[] = [];

    if (Array.isArray(data)) {
      // Array of { key: string, value: string } objects
      for (const item of data) {
        if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
          const obj = item as { key: string; value: string };
          const key = normalizeEnvKey(String(obj.key));
          if (ENV_KEY_REGEX.test(key)) {
            vars.push({ key, value: String(obj.value) });
          }
        }
      }
    } else if (data && typeof data === 'object') {
      // Object with key-value pairs
      for (const [rawKey, rawValue] of Object.entries(data as Record<string, unknown>)) {
        const key = normalizeEnvKey(rawKey);
        if (ENV_KEY_REGEX.test(key)) {
          vars.push({ key, value: String(rawValue) });
        }
      }
    }

    return vars;
  } catch {
    return [];
  }
}

/**
 * Parse Docker Compose environment block.
 * Supports:
 *   environment:
 *     - KEY=VALUE
 *     - KEY2=VALUE2
 * Also handles bare "- KEY=VALUE" lines without the environment: header.
 */
function parseDockerComposeContent(content: string): ParsedEnvVar[] {
  const lines = content.split('\n');
  const vars: ParsedEnvVar[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip "environment:" header, comments, blanks
    if (!trimmed || trimmed === 'environment:' || trimmed.startsWith('#')) continue;

    // Match "- KEY=VALUE" pattern
    const dashMatch = trimmed.match(/^-\s+(.+)$/);
    if (dashMatch) {
      const parsed = parseEnvLine(dashMatch[1]);
      if (parsed && ENV_KEY_REGEX.test(parsed.key)) {
        vars.push(parsed);
      }
    }
  }

  return vars;
}

/**
 * Parse multi-line env content into an array of { key, value }.
 * Supports .env, Vercel JSON, and Docker Compose formats.
 * Skips blank lines and comments.
 */
export function parseEnvContent(content: string): ParsedEnvVar[] {
  if (!content.trim()) return [];

  const format = detectEnvFormat(content);

  if (format === 'json') {
    return parseJsonContent(content);
  }

  if (format === 'docker-compose') {
    return parseDockerComposeContent(content);
  }

  // Default: .env format
  const lines = content.split('\n');
  const vars: ParsedEnvVar[] = [];

  for (const line of lines) {
    const parsed = parseEnvLine(line);
    if (parsed && ENV_KEY_REGEX.test(parsed.key)) {
      vars.push(parsed);
    }
  }

  return vars;
}
