'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, EyeOff, Pencil, Trash2, Copy, MoreHorizontal, UserCheck, ExternalLink } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';
import type { ServiceCredential, CredentialPurpose } from '@/types';

const purposeLabels: Record<CredentialPurpose, string> = {
  admin: '관리자',
  demo: '데모',
  deploy: '배포',
  monitoring: '모니터링',
  api: 'API',
  other: '기타',
};

const purposeColors: Record<CredentialPurpose, string> = {
  admin: 'bg-red-500/10 text-red-700 border-red-300 dark:text-red-400',
  demo: 'bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-400',
  deploy: 'bg-green-500/10 text-green-700 border-green-300 dark:text-green-400',
  monitoring: 'bg-yellow-500/10 text-yellow-700 border-yellow-300 dark:text-yellow-400',
  api: 'bg-purple-500/10 text-purple-700 border-purple-300 dark:text-purple-400',
  other: 'bg-gray-500/10 text-gray-700 border-gray-300 dark:text-gray-400',
};

const envLabels: Record<string, string> = {
  development: 'DEV',
  staging: 'STG',
  production: 'PROD',
  all: '전체',
};

interface CredentialsTableProps {
  credentials: ServiceCredential[];
  serviceNameMap: Map<string, string>;
  decryptedData: Record<string, { username?: string; password?: string }>;
  showValues: Record<string, boolean>;
  isDecrypting: boolean;
  onToggleShow: (id: string) => void;
  onEdit: (cred: ServiceCredential) => void;
  onDelete: (id: string) => void;
}

export function CredentialsTable({
  credentials,
  serviceNameMap,
  decryptedData,
  showValues,
  isDecrypting,
  onToggleShow,
  onEdit,
  onDelete,
}: CredentialsTableProps) {
  const maskValue = () => '\u2022'.repeat(12);

  const handleCopyUsername = (id: string) => {
    const data = decryptedData[id];
    if (data?.username) {
      navigator.clipboard.writeText(data.username);
      toast.success('아이디가 복사되었습니다');
    } else {
      toast.error('먼저 값을 표시한 후 복사하세요');
    }
  };

  const handleCopyPassword = (id: string) => {
    const data = decryptedData[id];
    if (data?.password) {
      navigator.clipboard.writeText(data.password);
      toast.success('비밀번호가 복사되었습니다');
    } else {
      toast.error('비밀번호가 없거나 먼저 값을 표시하세요');
    }
  };

  if (credentials.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={UserCheck}
            title="등록된 계정 정보가 없습니다"
            description="서비스에서 사용하는 관리자, 데모 계정 등의 아이디/비밀번호를 안전하게 관리하세요."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header row - hidden on mobile */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_160px_120px_100px_80px_60px] gap-4 px-4 py-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
          <div>라벨 / 아이디</div>
          <div>비밀번호</div>
          <div>용도</div>
          <div>서비스</div>
          <div>환경</div>
          <div></div>
        </div>

        <div className="divide-y">
          {credentials.map((cred) => {
            const isShowing = showValues[cred.id];
            const data = decryptedData[cred.id];

            return (
              <div
                key={cred.id}
                className="flex flex-col sm:grid sm:grid-cols-[1fr_160px_120px_100px_80px_60px] gap-2 sm:gap-4 p-3 sm:p-4 sm:items-center hover:bg-muted/30 transition-colors"
              >
                {/* Label + Username */}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{cred.label}</span>
                    {cred.website_url && (
                      <a
                        href={cred.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <code className="text-xs text-muted-foreground font-mono truncate">
                      {isShowing && data?.username ? data.username : maskValue()}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => onToggleShow(cred.id)}
                      disabled={isDecrypting}
                      title={isShowing ? '숨기기' : '표시'}
                    >
                      {isShowing ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                {/* Password */}
                <div className="flex items-center gap-1 min-w-0">
                  {cred.encrypted_password ? (
                    <>
                      <code className="text-xs text-muted-foreground font-mono truncate">
                        {isShowing && data?.password ? data.password : maskValue()}
                      </code>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>

                {/* Purpose */}
                <div>
                  <Badge variant="outline" className={`text-[10px] ${purposeColors[cred.purpose]}`}>
                    {purposeLabels[cred.purpose]}
                  </Badge>
                </div>

                {/* Service */}
                <div className="min-w-0">
                  {cred.service_id && serviceNameMap.has(cred.service_id) ? (
                    <Badge variant="outline" className="text-[10px] truncate max-w-full">
                      {serviceNameMap.get(cred.service_id)}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>

                {/* Environment */}
                <div>
                  <Badge variant="secondary" className="text-[10px]">
                    {envLabels[cred.environment] || cred.environment}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(cred)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyUsername(cred.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        아이디 복사
                      </DropdownMenuItem>
                      {cred.encrypted_password && (
                        <DropdownMenuItem onClick={() => handleCopyPassword(cred.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          비밀번호 복사
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(cred.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
