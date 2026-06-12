/**
 * Linkmap API 클라이언트
 *
 * MCP 서버에서 Linkmap 웹 API를 호출하기 위한 유틸리티.
 */

const API_URL = process.env.LINKMAP_API_URL || 'https://www.linkmap.biz';
const API_TOKEN = process.env.LINKMAP_API_TOKEN || '';

export async function fetchAPI<T = unknown>(
  path: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options?.method || 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Linkmap API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export function getApiUrl(): string {
  return API_URL;
}

export function hasApiToken(): boolean {
  return API_TOKEN.length > 0;
}
