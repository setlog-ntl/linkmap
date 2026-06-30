import { redirect } from 'next/navigation';

/**
 * 보안 메모는 통합 "비밀키 관리" 허브로 흡수되었다.
 * 기존 딥링크/북마크 보존을 위해 허브의 보안메모 탭으로 리다이렉트한다.
 */
export default async function SecureNotesRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/project/${id}/credentials?type=note`);
}
