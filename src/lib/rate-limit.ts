// TODO: 프로덕션 스케일 시 @upstash/ratelimit 도입 (서버리스 인스턴스 간 공유 불가 한계)

interface SlidingWindowEntry {
  timestamps: number[];
}

const store = new Map<string, SlidingWindowEntry>();

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    // Remove entries with no recent timestamps
    if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < now - 120_000) {
      store.delete(key);
    }
  }
}, 60_000);

/**
 * Sliding Window rate limiter.
 * Unlike fixed window, this prevents burst-at-boundary attacks by counting
 * requests within a true sliding time window.
 *
 * @param key - Unique identifier (prefer `action:userId` or `action:userId:ip` for precision)
 * @param limit - Max requests within the window
 * @param windowMs - Window duration in milliseconds
 * @returns success, remaining count, and resetAt timestamp
 */
export function rateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60_000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Prune timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= limit) {
    // Calculate when the earliest request in window expires
    const resetAt = entry.timestamps[0] + windowMs;
    return { success: false, remaining: 0, resetAt };
  }

  entry.timestamps.push(now);
  const remaining = limit - entry.timestamps.length;
  const resetAt = entry.timestamps[0] + windowMs;

  return { success: true, remaining, resetAt };
}

/**
 * Build a composite rate limit key from user ID and optional IP.
 * Provides more precise limiting by combining identity + origin.
 */
export function rateLimitKey(action: string, userId: string, ip?: string | null): string {
  if (ip) {
    return `${action}:${userId}:${ip}`;
  }
  return `${action}:${userId}`;
}

/**
 * Get standard rate limit response headers.
 * Includes Retry-After (seconds) when limit is exceeded.
 */
export function getRateLimitHeaders(
  remaining: number,
  limit: number = 30,
  resetAt?: number
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
  };

  if (resetAt) {
    headers['X-RateLimit-Reset'] = String(Math.ceil(resetAt / 1000));
  }

  if (remaining <= 0 && resetAt) {
    const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    headers['Retry-After'] = String(retryAfterSec);
  }

  return headers;
}

