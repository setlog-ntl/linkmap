import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, serverError } from '@/lib/api/errors';

function normalizeUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase();
}

// 매칭에 필요한 최소 컬럼만 조회
const MATCH_COLUMNS = 'id, name, slug, category, description, description_ko, icon_url, icon_emoji, website_url, docs_url, is_custom, user_id, created_at' as const;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorizedError();

    // 내 커스텀 서비스 조회
    const { data: customServices, error: customErr } = await supabase
      .from('services')
      .select(MATCH_COLUMNS)
      .eq('is_custom', true)
      .eq('user_id', user.id);

    if (customErr) return serverError(customErr.message);
    if (!customServices || customServices.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    // 글로벌 서비스 조회
    const { data: globalServices, error: globalErr } = await supabase
      .from('services')
      .select(MATCH_COLUMNS)
      .eq('is_custom', false);

    if (globalErr) return serverError(globalErr.message);
    if (!globalServices || globalServices.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    // JS에서 매칭: 이름(대소문자 무시) 또는 website_url 일치
    const matches: { customService: (typeof customServices)[number]; globalService: (typeof globalServices)[number] }[] = [];

    for (const custom of customServices) {
      const customNameLower = custom.name.toLowerCase().trim();
      const customUrl = custom.website_url ? normalizeUrl(custom.website_url) : null;

      for (const global of globalServices) {
        const globalNameLower = global.name.toLowerCase().trim();
        const globalUrl = global.website_url ? normalizeUrl(global.website_url) : null;

        const nameMatch = customNameLower === globalNameLower;
        const urlMatch = customUrl && globalUrl && customUrl === globalUrl;

        if (nameMatch || urlMatch) {
          matches.push({ customService: custom, globalService: global });
          break; // 커스텀 서비스당 첫 매칭만
        }
      }
    }

    return NextResponse.json({ matches });
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류';
    return serverError(`매칭 조회 실패: ${message}`);
  }
}
