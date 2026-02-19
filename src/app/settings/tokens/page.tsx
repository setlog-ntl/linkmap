'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Key, Plus, Trash2, Copy, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { SettingsNav } from '@/components/settings/settings-nav';

interface ApiToken {
  id: string;
  name: string;
  token?: string;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newlyCreatedToken, setNewlyCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadTokens = useCallback(async () => {
    try {
      const res = await fetch('/api/tokens');
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const handleCreate = async () => {
    if (!newTokenName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTokenName }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || '토큰 생성에 실패했습니다');
        return;
      }
      const data = await res.json();
      setNewlyCreatedToken(data.token);
      setNewTokenName('');
      setShowCreateForm(false);
      loadTokens();
      toast.success('API 토큰이 생성되었습니다');
    } catch {
      toast.error('토큰 생성에 실패했습니다');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 API 토큰을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/tokens?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('토큰이 삭제되었습니다');
        loadTokens();
      }
    } catch {
      toast.error('삭제에 실패했습니다');
    }
  };

  const handleCopy = async (token: string) => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container py-8 max-w-2xl">
        <SettingsNav />
        <Skeleton className="h-12 w-48 mb-6" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <SettingsNav />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Key className="h-6 w-6" />
            API 토큰
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            MCP 서버와 CLI 도구에서 사용할 API 토큰을 관리합니다
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
          <Plus className="h-4 w-4 mr-1" />
          새 토큰
        </Button>
      </div>

      {/* Newly created token warning */}
      {newlyCreatedToken && (
        <Card className="mb-6 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium">
                  토큰이 생성되었습니다. 이 토큰은 다시 표시되지 않으니 안전한 곳에 저장하세요.
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-background px-3 py-2 rounded border flex-1 break-all">
                    {newlyCreatedToken}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handleCopy(newlyCreatedToken)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">새 API 토큰 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="token-name">토큰 이름</Label>
                <Input
                  id="token-name"
                  placeholder="예: My CLI Token"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreate} disabled={creating || !newTokenName.trim()}>
                {creating ? '생성 중...' : '생성'}
              </Button>
              <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token list */}
      <Card>
        <CardHeader>
          <CardTitle>활성 토큰</CardTitle>
          <CardDescription>현재 발급된 API 토큰 목록입니다</CardDescription>
        </CardHeader>
        <CardContent>
          {tokens.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">발급된 API 토큰이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token) => (
                <div key={token.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{token.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>생성: {new Date(token.created_at).toLocaleDateString('ko-KR')}</span>
                      {token.last_used_at && (
                        <span>최근 사용: {new Date(token.last_used_at).toLocaleDateString('ko-KR')}</span>
                      )}
                      {token.expires_at && (
                        <Badge variant={new Date(token.expires_at) < new Date() ? 'destructive' : 'outline'}>
                          {new Date(token.expires_at) < new Date() ? '만료됨' : `만료: ${new Date(token.expires_at).toLocaleDateString('ko-KR')}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(token.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
