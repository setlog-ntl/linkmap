'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import type { ResourcePromptBlock } from '@/data/resources/free-resources';

/**
 * 복사용 지시문 블록.
 * 자료의 핵심 전달 수단이므로 복사 실패를 조용히 넘기지 않고
 * execCommand 폴백까지 시도한 뒤 결과를 버튼 상태로 알린다.
 */
export function PromptCopyBlock({ block }: { block: ResourcePromptBlock }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = block.body;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [block.body]);

  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-7 shadow-sm">
      <h2 className="text-lg font-bold tracking-tight">{block.title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground break-keep">{block.description}</p>

      <div className="relative mt-4">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`${block.title} 복사`}
          className={`absolute right-2.5 top-2.5 z-10 inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors ${
            copied
              ? 'border-brand-green bg-brand-green/20 text-brand-green'
              : 'border-white/25 bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? '복사됨' : '복사'}
        </button>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 pr-20 text-[13px] leading-relaxed text-slate-100 dark:bg-slate-950">
          <code className="font-mono whitespace-pre-wrap break-words">{block.body}</code>
        </pre>
      </div>

      {block.note && (
        <p className="mt-3 text-sm text-muted-foreground break-keep">{block.note}</p>
      )}
    </section>
  );
}
