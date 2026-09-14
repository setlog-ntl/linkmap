import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Download,
  ExternalLink,
  Gift,
  Rocket,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PromptCopyBlock } from '@/components/resources/prompt-copy-block';
import { ResourcesAdminBar } from '@/components/resources/resources-admin-bar';
import {
  RESOURCE_CATEGORIES,
  type FreeResource,
} from '@/data/resources/free-resources';

function formatDateKR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function ResourceDetail({ resource }: { resource: FreeResource }) {
  const category = RESOURCE_CATEGORIES[resource.category];
  const primaryLink = resource.links.find((l) => l.primary);
  const secondaryLinks = resource.links.filter((l) => !l.primary);
  // 원클릭 배포 안내 문구는 primary 링크가 /sites/new 계열(템플릿 배포)일 때만 — 설정 안내서 같은 자료에는 맞지 않는다
  const showDeployCopy = primaryLink?.href.startsWith('/sites/new') ?? false;

  return (
    <article className="mx-auto max-w-3xl py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" prefetch={false} className="transition-colors hover:text-foreground">
          홈
        </Link>
        <span>/</span>
        <Link href="/resources" prefetch={false} className="transition-colors hover:text-foreground">
          무료배포 자료
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">자료 {resource.order}번</span>
      </nav>

      {/* 관리자에게만 보이는 편집 진입점 (클라이언트에서 판정 — ISR 캐시에 섞이지 않음) */}
      <ResourcesAdminBar editHref={`/admin/resources/${resource.id}`} />

      {/* Header */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className="bg-brand-green/15 text-brand-green">
            <Gift className="mr-1 h-3 w-3" />
            무료배포 자료 {resource.order}번
          </Badge>
          <Badge variant="outline" className="border-brand-blue/30 text-brand-blue">
            {category.label}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight break-keep md:text-3xl">
          {resource.title}
        </h1>
        <p className="mt-3 text-muted-foreground break-keep">{resource.description}</p>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {formatDateKR(resource.updatedAt ?? resource.publishedAt)} 공개
        </p>
      </header>

      {/* Linkmap 히어로 CTA */}
      <section className="mb-8 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-6 text-center md:p-8">
        <h2 className="text-xl font-bold tracking-tight break-keep md:text-2xl">
          {resource.hero.headline}{' '}
          <span className="text-brand-blue">{resource.hero.highlight}</span>{' '}
          {resource.hero.sub}
        </h2>
        {showDeployCopy && (
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground break-keep">
            이 자료의 도구도 Linkmap으로 만들어 배포했습니다. 템플릿을 고르면 클릭 한 번으로 내 도구에 URL이 생깁니다.
          </p>
        )}
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {primaryLink &&
            (primaryLink.external ? (
              // 정적 배포본(/downloads/*.html) 같은 외부 대상은 새 탭 — Next Link는 라우트가 아닌 경로에 RSC 요청을 보낸다
              <Button asChild size="lg">
                <a href={primaryLink.href} target="_blank" rel="noopener noreferrer">
                  <Rocket className="mr-2 h-4 w-4" />
                  {primaryLink.label}
                </a>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href={primaryLink.href} prefetch={false}>
                  <Rocket className="mr-2 h-4 w-4" />
                  {primaryLink.label}
                </Link>
              </Button>
            ))}
          {secondaryLinks.map((link) => (
            <Button key={link.href} asChild size="lg" variant="outline">
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </a>
            </Button>
          ))}
        </div>
        {showDeployCopy && (
          <p className="mt-4 text-xs text-muted-foreground">
            무료 플랜 · Google 계정만 있으면 OK · <span className="font-semibold text-brand-green">무료 3개까지 배포</span>
          </p>
        )}
      </section>

      {/* 지시문 블록 */}
      <div className="space-y-6">
        {resource.prompts.map((block) => (
          <PromptCopyBlock key={block.id} block={block} />
        ))}
      </div>

      {/* 오프라인 배포본 — 파일이 등록된 자료만 */}
      {resource.downloadHref && (
        <section className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-bold tracking-tight">HTML 파일로 내려받기</h2>
            <p className="mt-1 text-sm text-muted-foreground break-keep">
              인터넷이 막힌 회사 PC에서도 열리는 단일 HTML 파일입니다. 동료에게 파일 하나로 전달하세요.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href={resource.downloadHref} download>
              <Download className="mr-2 h-4 w-4" />
              내려받기
            </a>
          </Button>
        </section>
      )}

      {/* 마무리 */}
      <section className="mt-8 rounded-xl border border-border bg-muted/40 p-6 text-center">
        <p className="text-sm text-muted-foreground break-keep">{resource.closing}</p>
        <Button asChild className="mt-4">
          <Link href="/sites/new" prefetch={false}>
            무료로 시작하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      <div className="mt-10 border-t border-border pt-6">
        <Link
          href="/resources"
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          무료배포 자료 전체 보기
        </Link>
      </div>
    </article>
  );
}
