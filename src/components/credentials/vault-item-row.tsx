'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Eye, EyeOff, Loader2, Pencil, Trash2 } from 'lucide-react';
import { kindMeta } from './vault-shared';
import type { RevealedValue, ServiceCredential, VaultItem } from '@/types';

const MASK = '••••••••••••';

interface VaultItemRowProps {
  item: VaultItem;
  revealed?: RevealedValue;
  isDecrypting: boolean;
  onToggleReveal: (item: VaultItem) => void;
  onCopy: (item: VaultItem, which: 'value' | 'username' | 'password') => void;
  onEdit: (item: VaultItem) => void;
  onDelete: (item: VaultItem) => void;
}

export function VaultItemRow({
  item,
  revealed,
  isDecrypting,
  onToggleReveal,
  onCopy,
  onEdit,
  onDelete,
}: VaultItemRowProps) {
  const meta = kindMeta[item.kind];
  const Icon = meta.icon;
  const isRevealed = revealed !== undefined;
  const isEnvNonSecret = item.kind === 'env' && !(item.raw as { is_secret?: boolean }).is_secret;
  const cred = item.kind === 'credential' ? (item.raw as ServiceCredential) : null;
  const hasPassword = cred ? !!cred.encrypted_password : false;

  return (
    <div className="rounded-lg border bg-card p-2.5 shadow-sm">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {/* 제목 + 배지 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="gap-1 text-[10px]">
              <Icon className={`h-2.5 w-2.5 ${meta.tone}`} />
              {meta.label}
            </Badge>
            <span className="truncate font-medium text-sm">{item.title}</span>
            {item.subtitle && (
              <Badge variant="outline" className="text-[10px]">{item.subtitle}</Badge>
            )}
            {isEnvNonSecret && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">공개</Badge>
            )}
          </div>

          {/* 값 영역 */}
          {item.kind === 'credential' ? (
            <div className="mt-1.5 space-y-1 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-7 shrink-0 text-muted-foreground">ID</span>
                <span className={`truncate ${isRevealed ? '' : 'select-none text-muted-foreground'}`}>
                  {isRevealed && revealed.kind === 'credential' ? revealed.username || '—' : MASK}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-7 shrink-0 text-muted-foreground">PW</span>
                <span className={`truncate ${isRevealed ? '' : 'select-none text-muted-foreground'}`}>
                  {!hasPassword
                    ? '비밀번호 없음'
                    : isRevealed && revealed.kind === 'credential'
                      ? revealed.password || '—'
                      : MASK}
                </span>
              </div>
            </div>
          ) : (
            <pre
              className={`mt-1.5 max-h-40 overflow-auto rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs whitespace-pre-wrap break-all ${isRevealed ? '' : 'select-none text-muted-foreground'}`}
            >
              {isRevealed && (revealed.kind === 'env' || revealed.kind === 'note') ? revealed.value : MASK}
            </pre>
          )}
        </div>

        {/* 액션 */}
        <div className="flex shrink-0 flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onToggleReveal(item)}
            disabled={isDecrypting}
            title={isRevealed ? '숨기기' : '보기'}
          >
            {isDecrypting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isRevealed ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </Button>

          {item.kind === 'credential' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" title="복사">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onCopy(item, 'username')}>아이디 복사</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(item, 'password')} disabled={!hasPassword}>
                  비밀번호 복사
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onCopy(item, 'value')}
              title="복사"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(item)} title="수정">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(item)}
            title="삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
