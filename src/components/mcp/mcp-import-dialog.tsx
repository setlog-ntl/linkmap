'use client';

import { useState } from 'react';
import { Upload, Check, X, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useImportMcpConfig, useCreateMcpConfig } from '@/lib/queries/mcp';

interface McpImportDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedServer {
  slug: string;
  name: string;
  transport: string;
  command: string | null;
  args: string[];
  url: string | null;
  env_vars: Array<{ key_name: string; value: string }>;
  mcp_server_id: string | null;
  catalog_name: string | null;
  matched: boolean;
}

export function McpImportDialog({ projectId, open, onOpenChange }: McpImportDialogProps) {
  const [content, setContent] = useState('');
  const [environment, setEnvironment] = useState('all');
  const [parsedResult, setParsedResult] = useState<{
    format: string;
    servers: ParsedServer[];
    total: number;
    matched: number;
  } | null>(null);

  const importMutation = useImportMcpConfig();
  const createConfig = useCreateMcpConfig(projectId);

  const handleParse = () => {
    if (!content.trim()) return;
    importMutation.mutate(
      { project_id: projectId, content, environment },
      {
        onSuccess: (data) => setParsedResult(data),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleImportAll = async () => {
    if (!parsedResult) return;

    let success = 0;
    for (const server of parsedResult.servers) {
      try {
        await createConfig.mutateAsync({
          project_id: projectId,
          mcp_server_id: server.mcp_server_id,
          custom_name: server.mcp_server_id ? undefined : server.name,
          transport: server.transport as 'stdio' | 'sse' | 'streamable-http',
          command: server.command ?? undefined,
          args: server.args,
          url: server.url ?? undefined,
          environment,
          env_vars: server.env_vars.map((ev) => ({
            key_name: ev.key_name,
            value: ev.value,
          })),
        });
        success++;
      } catch {
        // continue with remaining servers
      }
    }

    toast.success(`${success}/${parsedResult.total}개 MCP 서버 가져오기 완료`);
    handleClose();
  };

  const handleClose = () => {
    setContent('');
    setParsedResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            MCP 설정 가져오기
          </DialogTitle>
          <DialogDescription>
            mcp.json, claude_desktop_config.json, 또는 .cursor/mcp.json 내용을 붙여넣으세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!parsedResult ? (
            <>
              <div className="space-y-2">
                <Label>설정 파일 내용</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='{"mcpServers": { ... }}'
                  className="font-mono text-xs min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label>환경</Label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="development">개발</SelectItem>
                    <SelectItem value="staging">스테이징</SelectItem>
                    <SelectItem value="production">프로덕션</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">{parsedResult.format}</Badge>
                <span>{parsedResult.total}개 서버 감지</span>
                <span className="text-muted-foreground">
                  ({parsedResult.matched}개 카탈로그 매칭)
                </span>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {parsedResult.servers.map((server) => (
                  <div
                    key={server.slug}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{server.catalog_name ?? server.name}</span>
                        {server.matched ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Badge variant="outline" className="text-[10px]">커스텀</Badge>
                        )}
                      </div>
                      {server.command && (
                        <code className="text-[10px] text-muted-foreground font-mono">
                          {server.command} {server.args.join(' ')}
                        </code>
                      )}
                      {server.env_vars.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {server.env_vars.map((ev) => (
                            <Badge key={ev.key_name} variant="secondary" className="text-[10px]">
                              {ev.key_name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!parsedResult ? (
            <Button
              onClick={handleParse}
              disabled={!content.trim() || importMutation.isPending}
            >
              {importMutation.isPending ? '분석 중...' : '분석하기'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setParsedResult(null)}>
                뒤로
              </Button>
              <Button onClick={handleImportAll} disabled={createConfig.isPending}>
                {createConfig.isPending ? '가져오는 중...' : `${parsedResult.total}개 모두 가져오기`}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
