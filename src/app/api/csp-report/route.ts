import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/csp-report — CSP 위반 리포트 수집 (2026-07-16 레드팀 F-5)
 *
 * 기존 CSP는 report-only인데 수집처가 없어 위반이 어디에도 기록되지 않았다.
 * 이 엔드포인트가 브라우저의 위반 리포트를 받아 Workers 로그로 남긴다.
 * enforce 전환 전, 프로덕션에서 실제 어떤 인라인/외부 리소스가 걸리는지 관찰하는 용도.
 *
 * - 무인증(브라우저가 쿠키 없이 전송) · fire-and-forget(항상 204)
 * - 두 포맷 지원: report-uri(application/csp-report), Reporting API(application/reports+json)
 * - 본문 크기 상한으로 로그 폭주 방지
 */

const MAX_BODY_BYTES = 16 * 1024;

interface NormalizedViolation {
  directive: string;
  blockedUri: string;
  documentUri: string;
  sourceFile?: string;
  line?: number;
}

// report-uri 포맷: { "csp-report": { "violated-directive", "blocked-uri", ... } }
function fromReportUri(obj: Record<string, unknown>): NormalizedViolation | null {
  const r = obj['csp-report'];
  if (!r || typeof r !== 'object') return null;
  const rep = r as Record<string, unknown>;
  return {
    directive: String(rep['effective-directive'] ?? rep['violated-directive'] ?? 'unknown'),
    blockedUri: String(rep['blocked-uri'] ?? 'unknown'),
    documentUri: String(rep['document-uri'] ?? 'unknown'),
    sourceFile: rep['source-file'] ? String(rep['source-file']) : undefined,
    line: typeof rep['line-number'] === 'number' ? rep['line-number'] : undefined,
  };
}

// Reporting API 포맷: [ { "type": "csp-violation", "body": { "effectiveDirective", "blockedURL", ... } } ]
function fromReportingApi(item: Record<string, unknown>): NormalizedViolation | null {
  if (item['type'] !== 'csp-violation') return null;
  const b = item['body'];
  if (!b || typeof b !== 'object') return null;
  const body = b as Record<string, unknown>;
  return {
    directive: String(body['effectiveDirective'] ?? 'unknown'),
    blockedUri: String(body['blockedURL'] ?? 'unknown'),
    documentUri: String(body['documentURL'] ?? 'unknown'),
    sourceFile: body['sourceFile'] ? String(body['sourceFile']) : undefined,
    line: typeof body['lineNumber'] === 'number' ? body['lineNumber'] : undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (!raw || raw.length > MAX_BODY_BYTES) {
      return new NextResponse(null, { status: 204 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const violations: NormalizedViolation[] = [];
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        if (item && typeof item === 'object') {
          const v = fromReportingApi(item as Record<string, unknown>);
          if (v) violations.push(v);
        }
      }
    } else if (parsed && typeof parsed === 'object') {
      const v = fromReportUri(parsed as Record<string, unknown>);
      if (v) violations.push(v);
    }

    // 위반은 로그로만 남긴다(집계는 Workers 로그에서 grep). 값에 시크릿이 없음.
    for (const v of violations) {
      console.warn(
        `[csp-report] directive=${v.directive} blocked=${v.blockedUri} doc=${v.documentUri}` +
          (v.sourceFile ? ` src=${v.sourceFile}:${v.line ?? '?'}` : '')
      );
    }
  } catch (err) {
    console.error('[csp-report] handler error:', err instanceof Error ? err.message : err);
  }

  // 브라우저는 응답 본문을 사용하지 않는다 — 항상 204
  return new NextResponse(null, { status: 204 });
}
