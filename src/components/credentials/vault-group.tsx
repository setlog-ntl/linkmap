'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Boxes } from 'lucide-react';
import { VaultItemRow } from './vault-item-row';
import { kindMeta } from './vault-shared';
import type { VaultGroupData } from '@/lib/mappers/vault';
import type { RevealedValue, VaultItem, VaultKind } from '@/types';

interface VaultGroupProps {
  group: VaultGroupData;
  revealedMap: Record<string, RevealedValue>;
  decryptingKey: string | null;
  onToggleReveal: (item: VaultItem) => void;
  onCopy: (item: VaultItem, which: 'value' | 'username' | 'password') => void;
  onEdit: (item: VaultItem) => void;
  onDelete: (item: VaultItem) => void;
  onAddForService?: (serviceId: string | null) => void;
}

const COUNT_ORDER: VaultKind[] = ['env', 'credential', 'note'];

export function VaultGroup({
  group,
  revealedMap,
  decryptingKey,
  onToggleReveal,
  onCopy,
  onEdit,
  onDelete,
  onAddForService,
}: VaultGroupProps) {
  return (
    <Collapsible defaultOpen className="rounded-lg border bg-card">
      <div className="flex items-center gap-2 px-3 py-2">
        <CollapsibleTrigger className="group flex min-w-0 flex-1 items-center gap-2 text-left">
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
          <Boxes className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-semibold">{group.serviceName}</span>
          <div className="flex items-center gap-1">
            {COUNT_ORDER.filter((k) => group.counts[k] > 0).map((k) => (
              <Badge key={k} variant="secondary" className="text-[10px]">
                {kindMeta[k].label} {group.counts[k]}
              </Badge>
            ))}
          </div>
        </CollapsibleTrigger>
        {onAddForService && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            title={`${group.serviceName}에 추가`}
            onClick={() => onAddForService(group.serviceId)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <CollapsibleContent>
        <div className="space-y-2 border-t p-2.5">
          {group.items.map((item) => (
            <VaultItemRow
              key={item.key}
              item={item}
              revealed={revealedMap[item.key]}
              isDecrypting={decryptingKey === item.key}
              onToggleReveal={onToggleReveal}
              onCopy={onCopy}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
