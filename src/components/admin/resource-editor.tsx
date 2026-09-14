'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RESOURCE_CATEGORIES } from '@/data/resources/free-resources';
import {
  useAdminResource,
  useAdminResources,
  useCreateResource,
  useUpdateResource,
} from '@/lib/queries/admin-resources';
import {
  createResourceSchema,
  RESOURCE_CATEGORY_VALUES,
  type CreateResourceInput,
} from '@/lib/validations/resource';
import type { FreeResourceRow, ResourceCategory, ResourceHero } from '@/types';

// ---------------------------------------------------------------------------
// 폼 상태 — 입력 중에는 전부 문자열/불리언으로 들고, 저장 시 formToInput()으로 변환한다.
// ---------------------------------------------------------------------------

interface PromptForm {
  id: string;
  title: string;
  description: string;
  body: string;
  note: string;
}

interface LinkForm {
  label: string;
  description: string;
  href: string;
  external: boolean;
  primary: boolean;
}

interface ResourceForm {
  slug: string;
  sort_order: string;
  title: string;
  description: string;
  category: ResourceCategory;
  published_at: string;
  /** 쉼표 구분 */
  tags: string;
  hero: ResourceHero;
  youtube_video_id: string;
  youtube_title: string;
  prompts: PromptForm[];
  links: LinkForm[];
  download_href: string;
  closing: string;
  is_published: boolean;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 새 자료의 시작점 — 기존 자료(엑셀 취합기)와 같은 구성.
 * 히어로·마무리·배포 CTA는 Linkmap 공통 문구를 미리 채워 두어 자료마다 다시 쓰지 않게 한다.
 */
function templateForm(): ResourceForm {
  return {
    slug: '',
    sort_order: '',
    title: '',
    description: '',
    category: 'prompt',
    published_at: today(),
    tags: '',
    hero: { headline: '코드 몰라도,', highlight: '3분 만에', sub: '나만의 도구를 배포합니다' },
    youtube_video_id: '',
    youtube_title: '',
    prompts: [
      { id: 'build', title: '직접 만들고 싶다면 — 복사용 지시문', description: '', body: '', note: '' },
    ],
    links: [
      {
        label: '나만의 템플릿으로 배포하기',
        description: '템플릿을 고르고 클릭 한 번이면 내 도구에 URL이 생깁니다. 무료 3개까지.',
        href: '/sites/new',
        external: false,
        primary: true,
      },
    ],
    download_href: '',
    closing: '다 만들었다면 Linkmap에 올려 URL 하나로 어디서든 여세요.',
    is_published: false,
  };
}

function rowToForm(row: FreeResourceRow): ResourceForm {
  return {
    slug: row.slug,
    sort_order: String(row.sort_order),
    title: row.title,
    description: row.description,
    category: row.category,
    published_at: row.published_at,
    tags: row.tags.join(', '),
    hero: { ...row.hero },
    youtube_video_id: row.youtube_video_id ?? '',
    youtube_title: row.youtube_title,
    prompts: row.prompts.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      body: p.body,
      note: p.note ?? '',
    })),
    links: row.links.map((l) => ({
      label: l.label,
      description: l.description,
      href: l.href,
      external: l.external,
      primary: l.primary ?? false,
    })),
    download_href: row.download_href ?? '',
    closing: row.closing,
    is_published: row.is_published,
  };
}

/** 기존 자료를 템플릿으로 — 고유값(slug·영상·발행 상태·공개일)만 비운다 */
function duplicateForm(row: FreeResourceRow): ResourceForm {
  const base = rowToForm(row);
  return {
    ...base,
    slug: '',
    sort_order: String(row.sort_order + 1),
    title: `${row.title} (복제)`,
    published_at: today(),
    youtube_video_id: '',
    youtube_title: '',
    download_href: '',
    is_published: false,
  };
}

function formToInput(form: ResourceForm): CreateResourceInput {
  return {
    slug: form.slug.trim(),
    sort_order: Number(form.sort_order),
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    published_at: form.published_at,
    tags: form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    hero: {
      headline: form.hero.headline.trim(),
      highlight: form.hero.highlight.trim(),
      sub: form.hero.sub.trim(),
    },
    youtube_video_id: form.youtube_video_id.trim() || null,
    youtube_title: form.youtube_title.trim(),
    prompts: form.prompts.map((p) => ({
      id: p.id.trim(),
      title: p.title.trim(),
      description: p.description.trim(),
      body: p.body,
      note: p.note.trim() || undefined,
    })),
    links: form.links.map((l) => ({
      label: l.label.trim(),
      description: l.description.trim(),
      href: l.href.trim(),
      external: l.external,
      primary: l.primary || undefined,
    })),
    download_href: form.download_href.trim() || null,
    closing: form.closing.trim(),
    is_published: form.is_published,
  };
}

/** 유튜브 URL을 붙여 넣어도 ID만 남긴다 (watch?v= · youtu.be · shorts · embed) */
function extractYoutubeVideoId(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1);
    const v = url.searchParams.get('v');
    if (v) return v;
    const pathId = url.pathname.match(/\/(?:shorts|embed|live)\/([^/?]+)/);
    if (pathId) return pathId[1];
  } catch {
    // URL 형식이 아니면 사용자가 ID를 직접 입력한 것으로 본다
  }
  return trimmed;
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

interface ResourceEditorProps {
  /** 편집 대상. 없으면 새 자료 */
  resourceId?: string;
  /** 새 자료의 시작점으로 복제할 기존 자료 */
  templateId?: string;
}

type EditorMode = 'create' | 'duplicate' | 'edit';

/** 다음 배포자료 번호 제안 — 목록을 못 읽었으면 비워 두고 관리자가 채운다 */
function nextSortOrder(resources: FreeResourceRow[] | undefined): string {
  if (!resources) return '';
  return String(resources.reduce((max, r) => Math.max(max, r.sort_order), 0) + 1);
}

/**
 * 원본(편집 대상 또는 복제 템플릿)을 읽어 폼 초깃값을 만든 뒤 폼을 마운트한다.
 * 폼은 초깃값을 useState로 한 번만 받으므로 이후 refetch가 입력 중인 값을 덮지 않는다.
 */
export default function ResourceEditor({ resourceId, templateId }: ResourceEditorProps) {
  const sourceId = resourceId ?? templateId ?? null;
  const sourceQuery = useAdminResource(sourceId);
  const listQuery = useAdminResources();

  const waitingForSource = sourceId !== null && sourceQuery.isLoading;
  const waitingForList = sourceId === null && listQuery.isLoading;

  if (waitingForSource || waitingForList) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (sourceId !== null && (sourceQuery.isError || !sourceQuery.data)) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6 text-sm">
          <p className="text-destructive">자료를 불러오지 못했습니다. 삭제되었거나 주소가 잘못되었을 수 있습니다.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/resources" prefetch={false}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              목록으로
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (resourceId && sourceQuery.data) {
    return (
      <ResourceEditorForm
        key={resourceId}
        mode="edit"
        resourceId={resourceId}
        source={sourceQuery.data}
        initialForm={rowToForm(sourceQuery.data)}
      />
    );
  }

  if (templateId && sourceQuery.data) {
    return (
      <ResourceEditorForm
        key={`from-${templateId}`}
        mode="duplicate"
        source={sourceQuery.data}
        initialForm={duplicateForm(sourceQuery.data)}
      />
    );
  }

  return (
    <ResourceEditorForm
      key="new"
      mode="create"
      initialForm={{ ...templateForm(), sort_order: nextSortOrder(listQuery.data) }}
    />
  );
}

interface ResourceEditorFormProps {
  mode: EditorMode;
  /** 편집 모드에서만 */
  resourceId?: string;
  /** 편집·복제 모드의 원본 — 제목 표시·공개 페이지 링크에 쓴다 */
  source?: FreeResourceRow;
  initialForm: ResourceForm;
}

function ResourceEditorForm({ mode, resourceId, source, initialForm }: ResourceEditorFormProps) {
  const router = useRouter();
  const create = useCreateResource();
  const update = useUpdateResource();

  const [form, setForm] = useState<ResourceForm>(initialForm);
  const isPending = create.isPending || update.isPending;

  const patch = (partial: Partial<ResourceForm>) => setForm((prev) => ({ ...prev, ...partial }));
  const patchHero = (partial: Partial<ResourceHero>) =>
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, ...partial } }));

  const patchPrompt = (index: number, partial: Partial<PromptForm>) =>
    setForm((prev) => ({
      ...prev,
      prompts: prev.prompts.map((p, i) => (i === index ? { ...p, ...partial } : p)),
    }));
  const addPrompt = () =>
    setForm((prev) => ({
      ...prev,
      prompts: [
        ...prev.prompts,
        { id: `block-${prev.prompts.length + 1}`, title: '', description: '', body: '', note: '' },
      ],
    }));
  const removePrompt = (index: number) =>
    setForm((prev) => ({ ...prev, prompts: prev.prompts.filter((_, i) => i !== index) }));

  const patchLink = (index: number, partial: Partial<LinkForm>) =>
    setForm((prev) => ({
      ...prev,
      links: prev.links.map((l, i) => (i === index ? { ...l, ...partial } : l)),
    }));
  const addLink = () =>
    setForm((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        { label: '', description: '', href: '', external: true, primary: false },
      ],
    }));
  const removeLink = (index: number) =>
    setForm((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));

  const handleSave = async () => {
    const parsed = createResourceSchema.safeParse(formToInput(form));
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const where = issue?.path.length ? `${issue.path.join('.')}: ` : '';
      toast.error(`${where}${issue?.message ?? '입력값을 확인하세요'}`);
      return;
    }

    try {
      if (resourceId) {
        await update.mutateAsync({ id: resourceId, ...parsed.data });
        toast.success('자료를 저장했습니다 — 1분 내 공개 페이지에 반영됩니다');
      } else {
        await create.mutateAsync(parsed.data);
        toast.success(
          parsed.data.is_published
            ? '자료를 추가하고 발행했습니다 — 1분 내 공개 페이지에 반영됩니다'
            : '자료를 비공개로 추가했습니다. 목록에서 공개 스위치를 켜면 발행됩니다'
        );
      }
      router.push('/admin/resources');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장에 실패했습니다');
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 바 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/resources"
            prefetch={false}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            자료 목록
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {mode === 'edit' && '자료 편집'}
            {mode === 'duplicate' && '기존 자료를 템플릿으로 새 자료 만들기'}
            {mode === 'create' && '새 자료 추가'}
          </h1>
          {mode === 'duplicate' && source && (
            <p className="mt-1 text-sm text-muted-foreground break-keep">
              「{source.title}」의 구성을 복사했습니다. slug·제목·본문을 새 자료에 맞게 바꾸세요.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === 'edit' && source?.is_published && (
            <Button asChild variant="outline">
              <a href={`/resources/${source.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-4 w-4" />
                공개 페이지
              </a>
            </Button>
          )}
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            저장
          </Button>
        </div>
      </div>

      {/* 발행 */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">공개 페이지에 발행</p>
            <p className="text-sm text-muted-foreground break-keep">
              끄면 /resources · sitemap · llms.txt 어디에도 노출되지 않습니다. 본문을 다 채운 뒤 켜세요.
            </p>
          </div>
          <Switch
            checked={form.is_published}
            onCheckedChange={(v) => patch({ is_published: v })}
            aria-label="공개 페이지에 발행"
          />
        </CardContent>
      </Card>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>허브 카드와 상세 상단, 검색 메타에 그대로 쓰입니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="slug">slug (URL 경로)</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => patch({ slug: e.target.value.toLowerCase() })}
              placeholder="excel-merger-prompt"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              /resources/<span className="font-mono">{form.slug || '…'}</span> — 영문 소문자·숫자·하이픈. 발행 후 바꾸면 기존 링크가 끊어집니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sort_order">자료 번호</Label>
              <Input
                id="sort_order"
                type="number"
                min={1}
                value={form.sort_order}
                onChange={(e) => patch({ sort_order: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="published_at">공개일</Label>
              <Input
                id="published_at"
                type="date"
                value={form.published_at}
                onChange={(e) => patch({ published_at: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>자료 유형</Label>
            <Select
              value={form.category}
              onValueChange={(v) => patch({ category: v as ResourceCategory })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_CATEGORY_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {RESOURCE_CATEGORIES[value].label} — {RESOURCE_CATEGORIES[value].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">태그 (쉼표 구분, 최대 10개)</Label>
            <Input
              id="tags"
              value={form.tags}
              onChange={(e) => patch({ tags: e.target.value })}
              placeholder="엑셀 취합, 클로드, 사무직 자동화"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="엑셀 취합기 — 클로드 지시문 전문"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="description">한 줄 설명 (카드·메타 공용)</Label>
            <Textarea
              id="description"
              rows={2}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 히어로 */}
      <Card>
        <CardHeader>
          <CardTitle>히어로 문구</CardTitle>
          <CardDescription>
            상세 상단 CTA 제목. 「{form.hero.headline || '…'}{' '}
            <span className="text-brand-blue">{form.hero.highlight || '…'}</span>{' '}
            {form.hero.sub || '…'}」 순으로 한 줄에 표시됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="hero-headline">첫 줄</Label>
            <Input
              id="hero-headline"
              value={form.hero.headline}
              onChange={(e) => patchHero({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hero-highlight">강조 (파란색)</Label>
            <Input
              id="hero-highlight"
              value={form.hero.highlight}
              onChange={(e) => patchHero({ highlight: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hero-sub">마무리</Label>
            <Input
              id="hero-sub"
              value={form.hero.sub}
              onChange={(e) => patchHero({ sub: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 유튜브 */}
      <Card>
        <CardHeader>
          <CardTitle>유튜브 연결</CardTitle>
          <CardDescription>
            영상 발행 전에는 ID를 비워 두세요 — 허브 카드에 「영상 준비 중」으로 표시됩니다. 발행 후 ID(또는 URL)를 넣으면 유튜브 버튼과 썸네일로 바뀝니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <div className="space-y-1.5">
            <Label htmlFor="youtube_video_id">영상 ID 또는 URL</Label>
            <Input
              id="youtube_video_id"
              value={form.youtube_video_id}
              onChange={(e) => patch({ youtube_video_id: e.target.value })}
              onBlur={(e) => patch({ youtube_video_id: extractYoutubeVideoId(e.target.value) })}
              placeholder="ytTX-OmHspY"
              className="font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="youtube_title">영상 제목 (예정 포함)</Label>
            <Input
              id="youtube_title"
              value={form.youtube_title}
              onChange={(e) => patch({ youtube_title: e.target.value })}
              placeholder="버튼 툴팁·썸네일 alt·스크린리더 라벨에 쓰입니다"
            />
          </div>
        </CardContent>
      </Card>

      {/* 지시문 블록 */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>복사용 지시문 블록</CardTitle>
            <CardDescription>
              방문자가 「복사」 버튼으로 그대로 클립보드에 담는 본문. 블록 순서대로 상세에 표시됩니다.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addPrompt} disabled={form.prompts.length >= 10}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            블록 추가
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.prompts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              블록이 없습니다. 「도구」 유형처럼 지시문이 없는 자료라면 비워 두어도 됩니다.
            </p>
          )}
          {form.prompts.map((block, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-muted-foreground">블록 {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removePrompt(index)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  삭제
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_3fr]">
                <div className="space-y-1.5">
                  <Label htmlFor={`prompt-id-${index}`}>블록 ID</Label>
                  <Input
                    id={`prompt-id-${index}`}
                    value={block.id}
                    onChange={(e) => patchPrompt(index, { id: e.target.value.toLowerCase() })}
                    placeholder="build"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`prompt-title-${index}`}>블록 제목</Label>
                  <Input
                    id={`prompt-title-${index}`}
                    value={block.title}
                    onChange={(e) => patchPrompt(index, { title: e.target.value })}
                    placeholder="직접 만들고 싶다면 — 복사용 지시문"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`prompt-desc-${index}`}>안내 문구</Label>
                <Input
                  id={`prompt-desc-${index}`}
                  value={block.description}
                  onChange={(e) => patchPrompt(index, { description: e.target.value })}
                  placeholder="클로드에 아래를 그대로 붙여넣으세요."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`prompt-body-${index}`}>복사용 본문</Label>
                <Textarea
                  id={`prompt-body-${index}`}
                  rows={10}
                  value={block.body}
                  onChange={(e) => patchPrompt(index, { body: e.target.value })}
                  className="font-mono text-[13px]"
                  placeholder="줄바꿈·공백이 그대로 복사됩니다."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`prompt-note-${index}`}>덧붙이는 말 (선택)</Label>
                <Input
                  id={`prompt-note-${index}`}
                  value={block.note}
                  onChange={(e) => patchPrompt(index, { note: e.target.value })}
                  placeholder="잠시 기다리면 HTML 파일이 하나 나옵니다."
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 바로가기 */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>바로가기 링크</CardTitle>
            <CardDescription>
              히어로 아래 버튼. 「강조」 하나가 큰 버튼(Rocket)으로, 나머지는 외곽선 버튼으로 표시됩니다.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addLink} disabled={form.links.length >= 6}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            링크 추가
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.links.map((link, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium text-muted-foreground">링크 {index + 1}</span>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={link.primary}
                      onCheckedChange={(v) => patchLink(index, { primary: v })}
                      aria-label="강조 버튼"
                    />
                    강조
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={link.external}
                      onCheckedChange={(v) => patchLink(index, { external: v })}
                      aria-label="새 탭으로 열기"
                    />
                    새 탭(외부)
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeLink(index)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    삭제
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`link-label-${index}`}>라벨</Label>
                  <Input
                    id={`link-label-${index}`}
                    value={link.label}
                    onChange={(e) => patchLink(index, { label: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`link-href-${index}`}>주소</Label>
                  <Input
                    id={`link-href-${index}`}
                    value={link.href}
                    onChange={(e) => patchLink(index, { href: e.target.value })}
                    placeholder="/sites/new?template=… 또는 https://…"
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`link-desc-${index}`}>설명</Label>
                <Input
                  id={`link-desc-${index}`}
                  value={link.description}
                  onChange={(e) => patchLink(index, { description: e.target.value })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 배포본·마무리 */}
      <Card>
        <CardHeader>
          <CardTitle>오프라인 배포본 · 마무리</CardTitle>
          <CardDescription>
            배포본 HTML은 저장소 <span className="font-mono">public/downloads/</span> 아래에 두고 경로만 적습니다. 비워 두면 내려받기 섹션이 숨겨집니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="download_href">배포본 경로 (선택)</Label>
            <Input
              id="download_href"
              value={form.download_href}
              onChange={(e) => patch({ download_href: e.target.value })}
              placeholder="/downloads/excel-merger-prompt.html"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              <span className="font-mono">/resources/</span> 아래에는 두지 마세요 — 정적 파일이 자료 페이지 라우트를 가립니다.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="closing">마무리 문구</Label>
            <Textarea
              id="closing"
              rows={2}
              value={form.closing}
              onChange={(e) => patch({ closing: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending} size="lg">
          {isPending ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-4 w-4" />
          )}
          {mode === 'edit' ? '변경 저장' : '자료 추가'}
        </Button>
      </div>
    </div>
  );
}
