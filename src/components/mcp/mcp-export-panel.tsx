'use client';

import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface McpExportPanelProps {
  projectId: string;
}

type ExportFormat = 'claude-code' | 'claude-desktop' | 'cursor';

const FORMAT_OPTIONS: { value: ExportFormat; label: string; filename: string }[] = [
  { value: 'claude-code', label: 'Claude Code (.mcp.json)', filename: '.mcp.json' },
  { value: 'claude-desktop', label: 'Claude Desktop', filename: 'claude_desktop_config.json' },
  { value: 'cursor', label: 'Cursor', filename: 'mcp.json' },
];

export function McpExportPanel({ projectId }: McpExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('claude-code');
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mcp/export?project_id=${projectId}&format=${format}`);
      if (!res.ok) throw new Error('내보내기 실패');
      const data = await res.json();
      setPreview(JSON.stringify(data, null, 2));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '내보내기 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!preview) return;
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    toast.success('클립보드에 복사됨');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!preview) return;
    const opt = FORMAT_OPTIONS.find((o) => o.value === format);
    const blob = new Blob([preview], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = opt?.filename ?? 'mcp.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Download className="h-4 w-4" />
          MCP 설정 내보내기
        </CardTitle>
        <CardDescription className="text-xs">
          AI 코딩 도구에서 바로 사용할 수 있는 설정 파일을 생성합니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Select value={format} onValueChange={(v) => { setFormat(v as ExportFormat); setPreview(null); }}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMAT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
            {loading ? '생성 중...' : '생성'}
          </Button>
        </div>

        {preview && (
          <>
            <div className="relative rounded-md border bg-muted">
              <pre className="p-3 text-xs font-mono overflow-x-auto max-h-[250px]">{preview}</pre>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleDownload}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                다운로드
              </Button>
              <Badge variant="secondary" className="text-xs">
                환경변수 값은 보안을 위해 미포함
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
