'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  GitBranch,
  Globe,
  Loader2,
  Lock,
  Rocket,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useOneclickRepos,
  useAnalyzeRepo,
  type OneclickRepo,
  type RepoAnalyzeResult,
} from '@/lib/queries/oneclick';

interface RepoImportStepProps {
  accountId?: string | null;
  isDeploying: boolean;
  onBack: () => void;
  onDeploy: (input: { owner: string; repo: string; publishDir: string; linkOnly: boolean }) => void;
}

export function RepoImportStep({ accountId, isDeploying, onBack, onDeploy }: RepoImportStepProps) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<OneclickRepo | null>(null);
  const [result, setResult] = useState<RepoAnalyzeResult | null>(null);
  const [publishDir, setPublishDir] = useState<string>('.');
  const analyzeSeq = useRef(0);

  const { data, isLoading, error } = useOneclickRepos(page, accountId);
  const analyze = useAnalyzeRepo();

  const repos = useMemo(() => {
    const list = data?.repos ?? [];
    if (!filter.trim()) return list;
    const q = filter.trim().toLowerCase();
    return list.filter((r) => r.full_name.toLowerCase().includes(q));
  }, [data, filter]);

  const handleSelect = useCallback(async (repo: OneclickRepo) => {
    setSelected(repo);
    setResult(null);
    // 다른 저장소를 연달아 고르면 늦게 도착한 응답이 현재 화면에 붙을 수 있다.
    // 승인 화면과 실제 배포 대상이 어긋나면 안 되므로 마지막 요청 결과만 반영한다.
    const requestId = ++analyzeSeq.current;
    try {
      const analysis = await analyze.mutateAsync({
        owner: repo.owner,
        repo: repo.name,
        ...(accountId ? { github_service_account_id: accountId } : {}),
      });
      if (requestId !== analyzeSeq.current) return;
      setResult(analysis);
      setPublishDir(analysis.analysis.publish_dir);
    } catch (err) {
      if (requestId !== analyzeSeq.current) return;
      toast.error(err instanceof Error ? err.message : '저장소를 확인하지 못했습니다');
      setSelected(null);
    }
  }, [analyze, accountId]);

  const analysis = result?.analysis;
  const canDeploy = !!analysis?.deployable && !isDeploying;

  // 서버가 커밋할 내용과 동일하게, 현재 고른 폴더를 반영한 YAML을 보여준다
  const previewWorkflow = useMemo(() => {
    if (!result?.workflow || !analysis) return '';
    return result.workflow.content.replace(
      /(\n\s+path:\s)(.+)/,
      (_match, prefix: string) => `${prefix}${publishDir}`,
    );
  }, [result, analysis, publishDir]);

  // 선택 화면 — 저장소를 고르기 전
  if (!selected) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          템플릿 고르기로 돌아가기
        </button>

        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold">내 GitHub 저장소 가져오기</h2>
          <p className="text-sm text-muted-foreground">
            이미 만들어둔 저장소를 골라 인터넷에 공개할 수 있어요. 저장소 내용은 그대로 두고
            배포 설정 파일 1개만 추가합니다.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="저장소 이름으로 찾기"
            className="pl-9"
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            저장소를 불러오는 중...
          </div>
        )}

        {error && (
          <Card className="p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : '저장소 목록을 불러오지 못했습니다'}
          </Card>
        )}

        {!isLoading && repos.length === 0 && !error && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            표시할 저장소가 없어요. 다른 검색어를 써보거나 GitHub에서 저장소를 먼저 만들어주세요.
          </Card>
        )}

        <div className="space-y-2">
          {repos.map((repo) => (
            <Card
              key={repo.full_name}
              role="button"
              tabIndex={0}
              onClick={() => void handleSelect(repo)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  void handleSelect(repo);
                }
              }}
              className="p-3 cursor-pointer hover:border-brand-blue/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm truncate">{repo.name}</span>
                    {repo.private && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{repo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {data?.has_next && (
          <Button variant="outline" className="w-full" onClick={() => setPage((p) => p + 1)}>
            더 보기
          </Button>
        )}
        {page > 1 && (
          <Button variant="ghost" className="w-full" onClick={() => setPage((p) => Math.max(1, p - 1))}>
            이전 목록
          </Button>
        )}
      </div>
    );
  }

  // 동의 화면 — 무엇이 저장소에 추가되는지 전부 보여준다
  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => { setSelected(null); setResult(null); }}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        다른 저장소 고르기
      </button>

      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          {selected.full_name}
        </h2>
      </div>

      {analyze.isPending && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          저장소를 확인하는 중...
        </div>
      )}

      {/* 배포 불가 */}
      {result && !analysis?.deployable && (
        <Card className="p-4 border-destructive/40 space-y-2">
          <div className="flex items-center gap-2 text-destructive text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            지금은 배포할 수 없어요
          </div>
          <p className="text-sm text-muted-foreground">{result.message}</p>
        </Card>
      )}

      {/* 배포 가능 — 커밋될 내용 공개 */}
      {result && analysis?.deployable && (
        <>
          <Card className="p-4 space-y-3">
            <p className="text-sm font-medium">
              {analysis.can_link_only
                ? '이미 배포 설정이 있어서 아무것도 커밋하지 않아요'
                : `${selected.full_name}에 딱 1개의 파일을 추가합니다`}
            </p>

            {!analysis.can_link_only && result.workflow && (
              <Collapsible>
                <CollapsibleTrigger className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <code className="font-mono">{result.workflow.path}</code>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {/* 폴더를 바꾸면 실제 커밋될 내용도 바뀐다 — 검토한 것과 커밋되는 것이 어긋나지 않게 함께 갱신한다 */}
                  <pre className="mt-2 p-3 bg-muted rounded-lg text-[11px] leading-relaxed overflow-x-auto font-mono">
                    {previewWorkflow}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}

            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {/* 가장 결과가 큰 행위 — 저장소 내용이 전 세계에 공개된다 */}
              {!analysis.pages_enabled && (
                <li className="flex items-start gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-brand-blue shrink-0 mt-0.5" />
                  <span>
                    GitHub Pages를 켭니다 — <b>{analysis.publish_dir === '.' ? '저장소' : analysis.publish_dir} 내용이 누구나 볼 수 있게 공개</b>돼요
                    <br />
                    <code className="font-mono">https://{analysis.owner}.github.io/{analysis.repo}</code>
                  </span>
                </li>
              )}
              <li className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-brand-green shrink-0 mt-0.5" />
                기존 파일은 수정하지 않습니다
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-brand-green shrink-0 mt-0.5" />
                저장소를 삭제하지 않습니다 — Linkmap에서 지워도 저장소는 그대로 남아요
              </li>
              {analysis.needs_build_type_switch && (
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-brand-green shrink-0 mt-0.5" />
                  Pages 빌드 방식을 Actions로 전환합니다
                </li>
              )}
              {/* link_only에서는 커밋도 Actions 활성화도 일어나지 않는다 */}
              {analysis.is_fork && !analysis.can_link_only && (
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-brand-green shrink-0 mt-0.5" />
                  포크한 저장소라 GitHub Actions를 활성화합니다
                </li>
              )}
            </ul>

            {analysis.warnings.length > 0 && (
              <div className="pt-1 space-y-1">
                {analysis.warnings.map((w) => (
                  <p key={w} className="text-xs text-amber-600 dark:text-amber-500 flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {w}
                  </p>
                ))}
              </div>
            )}
          </Card>

          {/* 공개 폴더 선택 — 후보가 여럿일 때만. link_only는 커밋을 안 하므로 선택이 무의미하다 */}
          {analysis.publish_dir_candidates.length > 1 && !analysis.can_link_only && (
            <Card className="p-4 space-y-2">
              <p className="text-sm font-medium">공개할 폴더</p>
              <div className="flex flex-wrap gap-2">
                {analysis.publish_dir_candidates.map((dir) => (
                  <Button
                    key={dir}
                    type="button"
                    variant={publishDir === dir ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPublishDir(dir)}
                  >
                    {dir === '.' ? '저장소 루트' : dir}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          <Button
            type="button"
            className="w-full"
            disabled={!canDeploy}
            onClick={() =>
              onDeploy({
                owner: analysis.owner,
                repo: analysis.repo,
                publishDir,
                linkOnly: analysis.can_link_only,
              })
            }
          >
            {isDeploying ? (
              <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />배포 중...</>
            ) : analysis.can_link_only ? (
              <><Rocket className="h-4 w-4 mr-1.5" />연결하고 배포하기</>
            ) : (
              <><Rocket className="h-4 w-4 mr-1.5" />1개 파일 커밋하고 배포</>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
