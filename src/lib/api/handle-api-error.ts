import { toast } from 'sonner';

interface ApiErrorBody {
  error?: string;
  code?: string;
  upgradeUrl?: string;
  current?: number;
  max?: number;
}

/**
 * API 응답 에러를 파싱하고 공통 처리 (QUOTA_EXCEEDED, PRO_REQUIRED 등)
 * @returns true면 공통 에러가 처리됨, false면 호출자가 직접 처리 필요
 */
export function handleApiError(
  body: ApiErrorBody,
  options?: { navigate?: (url: string) => void },
): boolean {
  const navigate = options?.navigate;

  if (body.code === 'QUOTA_EXCEEDED') {
    toast.error(body.error || '한도를 초과했습니다', {
      action: navigate
        ? { label: 'Pro 플랜 보기', onClick: () => navigate('/pricing') }
        : undefined,
    });
    return true;
  }

  if (body.code === 'PRO_REQUIRED') {
    toast.error(body.error || 'Pro 플랜에서 사용할 수 있는 기능입니다', {
      action: navigate
        ? { label: '업그레이드', onClick: () => navigate(body.upgradeUrl || '/pricing') }
        : undefined,
    });
    return true;
  }

  return false;
}

/**
 * fetch 응답에서 에러를 추출하고 공통 처리
 * @returns 에러 본문 (공통 처리 여부와 관계없이 반환)
 */
export async function parseAndHandleApiError(
  res: Response,
  options?: { navigate?: (url: string) => void },
): Promise<ApiErrorBody> {
  const body: ApiErrorBody = await res.json().catch(() => ({ error: 'Unknown error' }));
  handleApiError(body, options);
  return body;
}
