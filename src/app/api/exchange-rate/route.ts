import { NextResponse } from 'next/server';

/**
 * USD → KRW 환율 조회
 * - 무료 API: open.er-api.com (하루 1회 업데이트, 1500 req/month 무료)
 * - Next.js fetch 캐시로 24시간 서버 캐싱
 */
export const dynamic = 'force-dynamic';

const FALLBACK_RATE = 1350;

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 86400 }, // 24시간 캐시
    });

    if (!res.ok) {
      return NextResponse.json({ rate: FALLBACK_RATE, updatedAt: null, fallback: true });
    }

    const data = (await res.json()) as {
      result: string;
      rates: Record<string, number>;
      time_last_update_utc: string;
    };

    if (data.result !== 'success' || !data.rates?.KRW) {
      return NextResponse.json({ rate: FALLBACK_RATE, updatedAt: null, fallback: true });
    }

    return NextResponse.json({
      rate: data.rates.KRW,
      updatedAt: data.time_last_update_utc,
      fallback: false,
    });
  } catch {
    return NextResponse.json({ rate: FALLBACK_RATE, updatedAt: null, fallback: true });
  }
}
