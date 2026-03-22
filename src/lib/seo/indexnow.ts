import { z } from 'zod';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_URL = 'https://www.linkmap.biz';

export const indexNowSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(10000),
});

/**
 * Submit URLs to IndexNow for fast search engine indexing.
 * Requires INDEXNOW_API_KEY environment variable (server-only).
 */
export async function submitUrls(urls: string[]): Promise<{ ok: boolean; status: number; message: string }> {
  const apiKey = process.env.INDEXNOW_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 0, message: 'INDEXNOW_API_KEY 환경변수가 설정되지 않았습니다' };
  }

  const body = {
    host: 'www.linkmap.biz',
    key: apiKey,
    keyLocation: `${SITE_URL}/${apiKey}.txt`,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  return {
    ok: res.ok,
    status: res.status,
    message: res.ok ? `${urls.length}개 URL 제출 완료` : `IndexNow 응답: ${res.status} ${res.statusText}`,
  };
}
