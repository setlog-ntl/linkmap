export interface ParsedEnvVar {
  key: string;
  value: string;
}

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
