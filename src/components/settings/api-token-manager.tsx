'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiTokenScope } from '@/types/core';

interface ApiTokenListItem {
  id: string;
  name: string;
  scopes: ApiTokenScope[];
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const SCOPE_LABELS: Record<ApiTokenScope, string> = {
  read: '읽기',
  write: '쓰기',
  admin: '관리',
};

const SCOPE_COLORS: Record<ApiTokenScope, string> = {
  read: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  write: 'bg-green-500/10 text-green-700 dark:text-green-300',
  admin: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};

export function ApiTokenManager() {
  const queryClient = useQueryClient();

  const { data: tokens = [], isLoading } = useQuery<ApiTokenListItem[]>({
    queryKey: ['api-tokens'],
    queryFn: async () => {
      const res = await fetch('/api/tokens');
      if (!res.ok) throw new Error('Failed to fetch tokens');
      const data = await res.json();
      return data.tokens;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tokens?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete token');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-tokens'] });
      toast.success('토큰이 삭제되었습니다');
    },
    onError: () => toast.error('토큰 삭제에 실패했습니다'),
  });

  if (isLoading) {
    return <div className="h-32 rounded-xl border border-border bg-card animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <CreateTokenDialog />
      </div>

      {tokens.length === 0 ? (
        <EmptyState
          icon={Key}
          title="API 토큰이 없습니다"
          description="MCP 서버 연동이나 CLI 사용을 위해 API 토큰을 생성하세요."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
          {tokens.map((token) => (
            <div key={token.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Key className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-[14px] font-medium truncate">{token.name}</p>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {token.scopes?.map((scope) => (
                    <Badge key={scope} variant="secondary" className={`text-[10px] px-1.5 py-0 ${SCOPE_COLORS[scope]}`}>
                      {SCOPE_LABELS[scope]}
                    </Badge>
                  ))}
                  <span className="text-[11px] text-muted-foreground">
                    생성: {new Date(token.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  {token.last_used_at && (
                    <span className="text-[11px] text-muted-foreground">
                      마지막 사용: {new Date(token.last_used_at).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                  {token.expires_at && (
                    <span className={`text-[11px] ${new Date(token.expires_at) < new Date() ? 'text-destructive' : 'text-muted-foreground'}`}>
                      만료: {new Date(token.expires_at).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </div>
              </div>
              <ConfirmDialog
                title="토큰 삭제"
                description={`"${token.name}" 토큰을 삭제하시겠습니까? 이 토큰을 사용하는 모든 연동이 중단됩니다.`}
                confirmLabel="삭제"
                cancelLabel="취소"
                variant="destructive"
                onConfirm={() => deleteMutation.mutateAsync(token.id)}
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateTokenDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('90');
  const [scopes, setScopes] = useState<ApiTokenScope[]>(['read', 'write']);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [creating, setCreating] = useState(false);

  const toggleScope = (scope: ApiTokenScope) => {
    setScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

  const handleCreate = async () => {
    if (!name.trim() || scopes.length === 0) return;
    setCreating(true);
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          expires_in_days: expiry === 'never' ? undefined : Number(expiry),
          scopes,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || '토큰 생성에 실패했습니다');
        return;
      }
      const data = await res.json();
      setCreatedToken(data.token);
      queryClient.invalidateQueries({ queryKey: ['api-tokens'] });
      toast.success('토큰이 생성되었습니다');
    } catch {
      toast.error('토큰 생성에 실패했습니다');
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = () => {
    if (!createdToken) return;
    navigator.clipboard.writeText(createdToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setExpiry('90');
    setScopes(['read', 'write']);
    setCreatedToken(null);
    setShowToken(false);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => v ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          토큰 생성
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API 토큰 생성</DialogTitle>
          <DialogDescription>
            MCP 서버, CLI 등 외부 도구 연동에 사용할 API 토큰을 생성합니다.
          </DialogDescription>
        </DialogHeader>

        {createdToken ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                토큰이 생성되었습니다. 이 토큰은 다시 표시되지 않으니 반드시 복사하세요.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted p-2 rounded font-mono break-all">
                  {showToken ? createdToken : '•'.repeat(40)}
                </code>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setShowToken(!showToken)}>
                  {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy}>
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>확인</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-name">토큰 이름</Label>
              <Input
                id="token-name"
                placeholder="예: MCP Server"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>권한 (scopes)</Label>
              <div className="flex gap-2">
                {(['read', 'write', 'admin'] as const).map((scope) => (
                  <Button
                    key={scope}
                    type="button"
                    size="sm"
                    variant={scopes.includes(scope) ? 'default' : 'outline'}
                    className="text-xs"
                    onClick={() => toggleScope(scope)}
                  >
                    {SCOPE_LABELS[scope]}
                  </Button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                MCP 서버에는 읽기 + 쓰기 권한을 권장합니다.
              </p>
            </div>

            <div className="space-y-2">
              <Label>만료</Label>
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30일</SelectItem>
                  <SelectItem value="90">90일</SelectItem>
                  <SelectItem value="180">180일</SelectItem>
                  <SelectItem value="365">365일</SelectItem>
                  <SelectItem value="never">만료 없음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>취소</Button>
              <Button onClick={handleCreate} disabled={creating || !name.trim() || scopes.length === 0}>
                {creating ? '생성 중...' : '생성'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
