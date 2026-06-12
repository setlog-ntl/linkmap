'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Copy, ExternalLink, Terminal } from 'lucide-react';

interface McpSetupGuideProps {
  projectId: string;
  projectName: string;
}

export function McpSetupGuide({ projectId, projectName }: McpSetupGuideProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 px-2"
      onClick={() => copyToClipboard(text, field)}
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  const claudeCodeConfig = `{
  "mcpServers": {
    "linkmap": {
      "command": "npx",
      "args": ["-y", "@linkmap/mcp-server@latest"],
      "env": {
        "LINKMAP_API_TOKEN": "stl_your_token_here"
      }
    }
  }
}`;

  const cursorConfig = `{
  "mcpServers": {
    "linkmap": {
      "command": "npx",
      "args": ["-y", "@linkmap/mcp-server@latest"],
      "env": {
        "LINKMAP_API_TOKEN": "stl_your_token_here"
      }
    }
  }
}`;

  const syncCommand = `"이 프로젝트의 서비스를 Linkmap 프로젝트 ${projectId}에 동기화해줘"`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">MCP 연동</CardTitle>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          AI 코딩 도구(Claude Code, Cursor)에서 프로젝트 서비스를 자동 감지하고 동기화할 수 있습니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 프로젝트 ID */}
        <div className="flex items-center gap-2 rounded-md bg-muted p-3">
          <span className="text-sm font-medium">프로젝트 ID:</span>
          <code className="text-sm font-mono text-brand-blue">{projectId}</code>
          <CopyButton text={projectId} field="project-id" />
        </div>

        {/* 설치 가이드 탭 */}
        <Tabs defaultValue="claude-code">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
            <TabsTrigger value="cursor">Cursor</TabsTrigger>
            <TabsTrigger value="other">기타</TabsTrigger>
          </TabsList>

          <TabsContent value="claude-code" className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">1. 프로젝트 루트에 <code className="text-xs bg-muted px-1 py-0.5 rounded">.mcp.json</code> 생성</p>
              <div className="relative">
                <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                  {claudeCodeConfig}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={claudeCodeConfig} field="claude-config" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">2. API 토큰 발급</p>
              <p className="text-sm text-muted-foreground">
                설정 &gt; 개발자 페이지에서 토큰을 생성하고 <code className="text-xs bg-muted px-1 py-0.5 rounded">LINKMAP_API_TOKEN</code>에 입력하세요.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/settings/developer" target="_blank" rel="noopener noreferrer">
                  토큰 발급 <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">3. 서비스 동기화 실행</p>
              <p className="text-sm text-muted-foreground">
                Claude Code에서 다음과 같이 요청하세요:
              </p>
              <div className="relative">
                <pre className="rounded-md bg-muted p-3 text-xs">
                  {syncCommand}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={syncCommand} field="sync-command" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cursor" className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">1. <code className="text-xs bg-muted px-1 py-0.5 rounded">.cursor/mcp.json</code> 생성 (프로젝트별) 또는 <code className="text-xs bg-muted px-1 py-0.5 rounded">~/.cursor/mcp.json</code> (전역)</p>
              <div className="relative">
                <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                  {cursorConfig}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={cursorConfig} field="cursor-config" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">2. API 토큰 발급 후 설정에 입력</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/settings/developer" target="_blank" rel="noopener noreferrer">
                  토큰 발급 <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">3. Cursor에서 &quot;서비스 동기화&quot; 요청</p>
              <p className="text-sm text-muted-foreground">
                Cursor Composer에서 Linkmap MCP 도구를 사용하여 서비스를 동기화합니다.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Windsurf, Cline 등 MCP를 지원하는 모든 AI 코딩 도구에서 사용할 수 있습니다.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">stdio MCP 서버 연결</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>명령어: <code className="text-xs bg-muted px-1 py-0.5 rounded">npx @linkmap/mcp-server@latest</code></li>
                <li>환경변수: <code className="text-xs bg-muted px-1 py-0.5 rounded">LINKMAP_API_TOKEN=stl_xxx</code></li>
                <li>프로토콜: JSON-RPC 2.0 (stdio)</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* 사용 가능한 MCP 도구 */}
        <div className="space-y-2 pt-2 border-t">
          <p className="text-sm font-medium">사용 가능한 MCP 도구</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div><code className="bg-muted px-1 py-0.5 rounded">detect_services</code> — 서비스 자동 감지</div>
            <div><code className="bg-muted px-1 py-0.5 rounded">sync_project_services</code> — 서비스 동기화</div>
            <div><code className="bg-muted px-1 py-0.5 rounded">list_services</code> — 카탈로그 조회</div>
            <div><code className="bg-muted px-1 py-0.5 rounded">get_env_vars</code> — 환경변수 조회</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
