export interface ParsedEnvVar {
  key: string;
  value: string;
}

/**
 * Parse a single KEY=VALUE line.
 * Returns { key, value } or null if the line doesn't contain '='.
 */
export function parseEnvLine(text: string): ParsedEnvVar | null {
  const trimmed = text.trim();
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

  // Normalize key: uppercase + non-alphanumeric → underscore
  const key = rawKey.toUpperCase().replace(/[^A-Z0-9_]/g, '_');

  return { key, value };
}

/**
 * Parse multi-line .env content into an array of { key, value }.
 * Skips blank lines and comments.
 */
export function parseEnvContent(content: string): ParsedEnvVar[] {
  const lines = content.split('\n');
  const vars: ParsedEnvVar[] = [];

  for (const line of lines) {
    const parsed = parseEnvLine(line);
    if (parsed && /^[A-Z][A-Z0-9_]*$/.test(parsed.key)) {
      vars.push(parsed);
    }
  }

  return vars;
}
