'use client';

import { useState } from 'react';
import {
  Plug, Plus, Upload, Download, Sparkles, Power, PowerOff,
  ExternalLink, MoreHorizontal, Trash2, Settings2, Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProjectMcpConfigs, useUpdateMcpConfig, useDeleteMcpConfig, useMcpRecommendations, useCreateMcpConfig } from '@/lib/queries/mcp';
import { McpImportDialog } from './mcp-import-dialog';
import { McpSetupWizard } from './mcp-setup-wizard';
import { McpExportPanel } from './mcp-export-panel';
import type { ProjectMcpConfig, McpServer } from '@/types';

const TRANSPORT_LABEL: Record<string, { label: string; color: string }> = {
  stdio: { label: 'stdio', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  sse: { label: 'SSE', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  'streamable-http': { label: 'HTTP', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

interface McpContentProps {
  projectId: string;
}

export function McpContent({ projectId }: McpContentProps) {
  const { data: configs, isLoading } = useProjectMcpConfigs(projectId);
  const { data: recommendations } = useMcpRecommendations(projectId);
  const updateConfig = useUpdateMcpConfig(projectId);
  const deleteConfig = useDeleteMcpConfig(projectId);
  const createConfig = useCreateMcpConfig(projectId);

  const [importOpen, setImportOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardServer, setWizardServer] = useState<McpServer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleToggle = (config: ProjectMcpConfig) => {
    updateConfig.mutate(
      { id: config.id, enabled: !config.enabled },
      {
        onSuccess: () => toast.success(config.enabled ? 'MCP 연결 비활성화됨' : 'MCP 연결 활성화됨'),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteConfig.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success('MCP 설정이 삭제되었습니다');
        setDeleteTarget(null);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleAddRecommendation = (mcpServer: McpServer) => {
    setWizardServer(mcpServer);
    setWizardOpen(true);
  };

  const handleQuickAdd = (mcpServer: McpServer) => {
    createConfig.mutate(
      {
        project_id: projectId,
        mcp_server_id: mcpServer.id,
        transport: mcpServer.transport,
        command: mcpServer.command ?? undefined,
        args: mcpServer.default_args,
        service_links: mcpServer.related_service_ids.map((sid) => ({ service_id: sid })),
      },
      {
        onSuccess: () => toast.success(`${mcpServer.name} 추가 완료`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  const hasConfigs = configs && configs.length > 0;
  const filteredRecommendations = (recommendations ?? []).filter(
    (r) => !configs?.some((c) => c.mcp_server_id === r.mcp_server.id)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">MCP 연결</h2>
          <p className="text-sm text-muted-foreground">
            AI 코딩 도구(Claude, Cursor 등)가 서비스에 직접 접근할 수 있도록 MCP 서버를 관리합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            가져오기
          </Button>
          <Button size="sm" onClick={() => { setWizardServer(null); setWizardOpen(true); }}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            MCP 추가
          </Button>
        </div>
      </div>

      {/* Section 1: Current MCP Configs */}
      {hasConfigs ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {configs.map((config) => (
            <McpConfigCard
              key={config.id}
              config={config}
              onToggle={() => handleToggle(config)}
              onDelete={() => setDeleteTarget(config.id)}
              onEdit={() => { setWizardServer(config.mcp_server ?? null); setWizardOpen(true); }}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plug className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium mb-1">AI 코딩 도구를 연결해보세요</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              MCP 서버를 추가하면 Claude Code, Cursor 등에서 프로젝트 서비스를 직접 조회하고 관리할 수 있습니다
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setImportOpen(true)}>
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                설정 파일 업로드
              </Button>
              <Button onClick={() => { setWizardServer(null); setWizardOpen(true); }}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                MCP 서버 추가
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Recommendations */}
      {filteredRecommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <h3 className="text-base font-medium">추천 MCP 서버</h3>
            <Badge variant="secondary" className="text-xs">{filteredRecommendations.length}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecommendations.slice(0, 6).map((rec) => (
              <Card key={rec.mcp_server.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Plug className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-sm">{rec.mcp_server.name}</span>
                    </div>
                    {rec.mcp_server.is_official && (
                      <Badge variant="secondary" className="text-[10px] px-1.5">공식</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {rec.mcp_server.description_ko ?? rec.mcp_server.description}
                  </p>
                  <div className="flex gap-2">
                    {rec.mcp_server.required_env_vars.length === 0 ? (
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleQuickAdd(rec.mcp_server)}>
                        <Check className="mr-1 h-3 w-3" />
                        바로 추가
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleAddRecommendation(rec.mcp_server)}>
                        <Plus className="mr-1 h-3 w-3" />
                        설정 후 추가
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Export */}
      {hasConfigs && <McpExportPanel projectId={projectId} />}

      {/* Dialogs */}
      <McpImportDialog
        projectId={projectId}
        open={importOpen}
        onOpenChange={setImportOpen}
      />

      <McpSetupWizard
        projectId={projectId}
        preselectedServer={wizardServer}
        open={wizardOpen}
        onOpenChange={setWizardOpen}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>MCP 설정 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 MCP 서버 설정을 삭제하시겠습니까? 연결된 환경변수도 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── MCP Config Card ─── */

interface McpConfigCardProps {
  config: ProjectMcpConfig;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

function McpConfigCard({ config, onToggle, onDelete, onEdit }: McpConfigCardProps) {
  const name = config.mcp_server?.name ?? config.custom_name ?? 'Custom MCP';
  const description = config.mcp_server?.description_ko ?? config.mcp_server?.description ?? config.notes;
  const transport = TRANSPORT_LABEL[config.transport] ?? TRANSPORT_LABEL.stdio;
  const docsUrl = config.mcp_server?.docs_url;

  return (
    <Card className={!config.enabled ? 'opacity-60' : undefined}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Plug className="h-4 w-4 shrink-0 text-purple-500" />
            <CardTitle className="text-sm truncate">{name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`text-[10px] px-1.5 ${transport.color}`}>
              {transport.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Settings2 className="mr-2 h-3.5 w-3.5" />
                  설정 편집
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggle}>
                  {config.enabled ? (
                    <><PowerOff className="mr-2 h-3.5 w-3.5" />비활성화</>
                  ) : (
                    <><Power className="mr-2 h-3.5 w-3.5" />활성화</>
                  )}
                </DropdownMenuItem>
                {docsUrl && (
                  <DropdownMenuItem asChild>
                    <a href={docsUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      문서 보기
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {description && (
          <CardDescription className="text-xs line-clamp-2 mt-1">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={config.enabled ? 'default' : 'secondary'} className="text-[10px]">
            {config.enabled ? '활성' : '비활성'}
          </Badge>
          {config.mcp_server?.is_official && (
            <Badge variant="outline" className="text-[10px]">공식</Badge>
          )}
          {config.environment !== 'all' && (
            <Badge variant="outline" className="text-[10px]">{config.environment}</Badge>
          )}
        </div>
        {config.command && (
          <div className="mt-2 rounded bg-muted px-2 py-1">
            <code className="text-[10px] text-muted-foreground font-mono truncate block">
              {config.command} {config.args?.join(' ')}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
