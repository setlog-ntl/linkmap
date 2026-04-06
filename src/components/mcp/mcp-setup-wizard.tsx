'use client';

import { useState, useEffect } from 'react';
import { Plug, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useMcpServers, useCreateMcpConfig } from '@/lib/queries/mcp';
import type { McpServer } from '@/types';

interface McpSetupWizardProps {
  projectId: string;
  preselectedServer: McpServer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'select' | 'configure' | 'confirm';

export function McpSetupWizard({ projectId, preselectedServer, open, onOpenChange }: McpSetupWizardProps) {
  const [step, setStep] = useState<Step>('select');
  const [search, setSearch] = useState('');
  const [selectedServer, setSelectedServer] = useState<McpServer | null>(null);
  const [envValues, setEnvValues] = useState<Record<string, string>>({});
  const [environment, setEnvironment] = useState('all');
  const [notes, setNotes] = useState('');

  // Custom server fields
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCommand, setCustomCommand] = useState('npx');
  const [customArgs, setCustomArgs] = useState('');
  const [customTransport, setCustomTransport] = useState<'stdio' | 'sse' | 'streamable-http'>('stdio');
  const [customUrl, setCustomUrl] = useState('');

  const { data: mcpServers, isLoading } = useMcpServers(search || undefined);
  const createConfig = useCreateMcpConfig(projectId);

  // Reset on open with preselected server
  useEffect(() => {
    if (open) {
      if (preselectedServer) {
        setSelectedServer(preselectedServer);
        setStep('configure');
        setIsCustom(false);
      } else {
        setStep('select');
        setSelectedServer(null);
        setIsCustom(false);
      }
      setEnvValues({});
      setNotes('');
      setSearch('');
    }
  }, [open, preselectedServer]);

  const handleSelectServer = (server: McpServer) => {
    setSelectedServer(server);
    setIsCustom(false);
    setStep('configure');
  };

  const handleSelectCustom = () => {
    setSelectedServer(null);
    setIsCustom(true);
    setStep('configure');
  };

  const handleSubmit = () => {
    const envVarsArray = isCustom
      ? []
      : (selectedServer?.required_env_vars ?? [])
          .filter((ev) => envValues[ev.name]?.trim())
          .map((ev) => ({
            key_name: ev.name,
            value: envValues[ev.name],
            description: ev.description_ko ?? ev.description,
          }));

    const serviceLinks = isCustom
      ? []
      : (selectedServer?.related_service_ids ?? []).map((sid) => ({ service_id: sid }));

    createConfig.mutate(
      {
        project_id: projectId,
        mcp_server_id: isCustom ? undefined : selectedServer?.id,
        custom_name: isCustom ? customName : undefined,
        transport: isCustom ? customTransport : selectedServer?.transport ?? 'stdio',
        command: isCustom ? customCommand : selectedServer?.command ?? undefined,
        args: isCustom ? customArgs.split(/\s+/).filter(Boolean) : selectedServer?.default_args ?? [],
        url: isCustom && customTransport !== 'stdio' ? customUrl : undefined,
        environment,
        notes: notes || undefined,
        env_vars: envVarsArray,
        service_links: serviceLinks,
      },
      {
        onSuccess: () => {
          toast.success('MCP 서버가 추가되었습니다');
          onOpenChange(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            {step === 'select' && 'MCP 서버 선택'}
            {step === 'configure' && (isCustom ? '커스텀 MCP 설정' : `${selectedServer?.name ?? ''} 설정`)}
            {step === 'confirm' && '확인'}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Select */}
        {step === 'select' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="MCP 서버 검색..."
                className="pl-9"
              />
            </div>
            <div className="space-y-1.5 max-h-[350px] overflow-y-auto">
              {/* Custom option */}
              <button
                onClick={handleSelectCustom}
                className="w-full text-left rounded-md border border-dashed p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">커스텀 MCP 서버</p>
                    <p className="text-xs text-muted-foreground">직접 command와 args를 입력합니다</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>

              {isLoading ? (
                <div className="text-center py-8 text-sm text-muted-foreground">로딩 중...</div>
              ) : (
                (mcpServers ?? []).map((server) => (
                  <button
                    key={server.id}
                    onClick={() => handleSelectServer(server)}
                    className="w-full text-left rounded-md border p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{server.name}</span>
                          {server.is_official && (
                            <Badge variant="secondary" className="text-[10px] px-1.5">공식</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {server.description_ko ?? server.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 'configure' && (
          <div className="space-y-4">
            {isCustom ? (
              <>
                <div className="space-y-2">
                  <Label>이름</Label>
                  <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="My MCP Server" />
                </div>
                <div className="space-y-2">
                  <Label>전송 방식</Label>
                  <Select value={customTransport} onValueChange={(v) => setCustomTransport(v as typeof customTransport)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stdio">stdio</SelectItem>
                      <SelectItem value="sse">SSE</SelectItem>
                      <SelectItem value="streamable-http">Streamable HTTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {customTransport === 'stdio' ? (
                  <>
                    <div className="space-y-2">
                      <Label>Command</Label>
                      <Input value={customCommand} onChange={(e) => setCustomCommand(e.target.value)} placeholder="npx" />
                    </div>
                    <div className="space-y-2">
                      <Label>Args (공백으로 구분)</Label>
                      <Input value={customArgs} onChange={(e) => setCustomArgs(e.target.value)} placeholder="-y @my/mcp-server" />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="https://mcp.example.com/sse" />
                  </div>
                )}
              </>
            ) : selectedServer ? (
              <>
                {/* Server info card */}
                <div className="rounded-md border p-3 bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Plug className="h-3.5 w-3.5 text-purple-500" />
                    <span className="font-medium text-sm">{selectedServer.name}</span>
                  </div>
                  {selectedServer.command && (
                    <code className="text-[10px] text-muted-foreground font-mono">
                      {selectedServer.command} {selectedServer.default_args.join(' ')}
                    </code>
                  )}
                </div>

                {/* Env vars */}
                {selectedServer.required_env_vars.length > 0 && (
                  <div className="space-y-3">
                    <Label>환경변수</Label>
                    {selectedServer.required_env_vars.map((ev) => (
                      <div key={ev.name} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs font-mono">{ev.name}</Label>
                          {ev.optional && <Badge variant="outline" className="text-[10px]">선택</Badge>}
                        </div>
                        <Input
                          type="password"
                          value={envValues[ev.name] ?? ''}
                          onChange={(e) => setEnvValues((prev) => ({ ...prev, [ev.name]: e.target.value }))}
                          placeholder={ev.description_ko ?? ev.description}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : null}

            {/* Common fields */}
            <div className="space-y-2">
              <Label>환경</Label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="development">개발</SelectItem>
                  <SelectItem value="staging">스테이징</SelectItem>
                  <SelectItem value="production">프로덕션</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>메모 (선택)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="이 MCP 서버 설정에 대한 메모..."
                className="min-h-[60px]"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'configure' && !preselectedServer && (
            <Button variant="outline" onClick={() => setStep('select')}>
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              뒤로
            </Button>
          )}
          {step === 'configure' && (
            <Button onClick={handleSubmit} disabled={createConfig.isPending}>
              {createConfig.isPending ? '추가 중...' : 'MCP 서버 추가'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
