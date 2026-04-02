'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Check, MapPin, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { PAGE_TREE, type PageTreeNode } from '@/lib/utils/page-context';
import { cn } from '@/lib/utils';

interface PageTreePickerProps {
  value: string;
  onChange: (key: string) => void;
  currentPageKey?: string;
}

function TreeNode({
  node,
  value,
  currentPageKey,
  onSelect,
  defaultOpen,
}: {
  node: PageTreeNode;
  value: string;
  currentPageKey?: string;
  onSelect: (key: string) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = value === node.key;
  const isCurrent = currentPageKey === node.key;
  const isChildSelected = hasChildren && node.children!.some((c) => value === c.key);
  const isChildCurrent = hasChildren && node.children!.some((c) => currentPageKey === c.key);

  if (!hasChildren) {
    return (
      <button
        type="button"
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-left transition-colors',
          isSelected ? 'bg-accent font-medium' : 'hover:bg-muted/50',
        )}
        onClick={() => onSelect(node.key)}
      >
        <span className="w-4 h-4 shrink-0" />
        <span className="flex-1 truncate">{node.label}</span>
        {isSelected && <Check className="h-3.5 w-3.5 text-brand-blue shrink-0" />}
        {isCurrent && !isSelected && (
          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 shrink-0">
            현재
          </Badge>
        )}
      </button>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              'w-full flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium text-left transition-colors',
              (isSelected || isChildSelected) ? 'text-brand-blue' : 'hover:bg-muted/50',
            )}
          >
            {open
              ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            }
            <span className="flex-1 truncate">{node.label}</span>
            {(isCurrent || isChildCurrent) && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 shrink-0">
                현재
              </Badge>
            )}
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="ml-2 pl-2 border-l border-border/50 space-y-0.5 mt-0.5 mb-1">
          {node.children!.map((child) => (
            <TreeNode
              key={child.key}
              node={child}
              value={value}
              currentPageKey={currentPageKey}
              onSelect={onSelect}
              defaultOpen={false}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PageTreePicker({ value, onChange, currentPageKey }: PageTreePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  // 현재 선택값이 속한 카테고리를 기본 펼침
  const expandedCategory = value.includes(' > ') ? value.split(' > ')[0] : value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between h-9 text-sm font-normal"
          type="button"
        >
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {value}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <div className="space-y-0.5 max-h-64 overflow-y-auto">
          {PAGE_TREE.map((node) => (
            <TreeNode
              key={node.key}
              node={node}
              value={value}
              currentPageKey={currentPageKey}
              onSelect={handleSelect}
              defaultOpen={node.key === expandedCategory}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
