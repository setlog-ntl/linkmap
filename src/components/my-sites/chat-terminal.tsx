'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Terminal,
  Send,
  ChevronUp,
  ChevronDown,
  Loader2,
  Check,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/stores/locale-store';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatTerminalProps {
  fileContent: string;
  filePath: string | null;
  onApplyCode: (code: string) => void;
}

function extractCodeBlock(text: string): string | null {
  // 코드 블록 추출 (```html, ```css, ```js 등)
  const match = text.match(/```[\w]*\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

export function ChatTerminal({ fileContent, filePath, onApplyCode }: ChatTerminalProps) {
  const { locale } = useLocaleStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/oneclick/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          fileContent,
          filePath,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '요청 실패');
      }

      const { reply } = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ ${err instanceof Error ? err.message : '오류 발생'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, fileContent, filePath]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleApply = (content: string) => {
    const code = extractCodeBlock(content);
    if (code) {
      onApplyCode(code);
    }
  };

  const hasCodeBlock = (content: string) => /```[\w]*\n[\s\S]*?```/.test(content);

  const terminalHeight = isExpanded ? 'h-[60vh]' : 'h-72';

  return (
    <div className="border-t bg-background flex flex-col">
      {/* 토글 바 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-1.5 hover:bg-muted/50 transition-colors text-xs"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" />
          <span className="font-medium">
            {locale === 'ko' ? 'AI 코드 어시스턴트' : 'AI Code Assistant'}
          </span>
          {messages.length > 0 && (
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
              {messages.length}
            </span>
          )}
        </div>
        {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>

      {/* 챗 영역 */}
      {isOpen && (
        <div className={`${terminalHeight} flex flex-col border-t transition-all`}>
          {/* 헤더 */}
          <div className="flex items-center justify-between px-3 py-1 bg-zinc-900 text-zinc-400 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span>
                {filePath ? `~/edit/${filePath.split('/').pop()}` : '~/edit'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto bg-zinc-950 px-3 py-2 font-mono text-sm space-y-3">
            {messages.length === 0 && (
              <div className="text-zinc-600 text-xs space-y-1 py-4">
                <p>
                  {locale === 'ko'
                    ? '💡 현재 파일의 코드를 AI에게 수정 요청할 수 있습니다.'
                    : '💡 Ask AI to modify the code in your current file.'}
                </p>
                <p className="text-zinc-700">
                  {locale === 'ko'
                    ? '예: "배경색을 파란색으로 바꿔줘", "헤더에 로고 추가해줘"'
                    : 'e.g., "Change background to blue", "Add a logo to the header"'}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="space-y-1">
                {msg.role === 'user' ? (
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 shrink-0 select-none">$</span>
                    <span className="text-zinc-200 break-all">{msg.content}</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-zinc-300 whitespace-pre-wrap break-all text-xs leading-relaxed pl-4 border-l-2 border-zinc-800">
                      {msg.content}
                    </div>
                    {hasCodeBlock(msg.content) && (
                      <button
                        onClick={() => handleApply(msg.content)}
                        className="flex items-center gap-1.5 ml-4 px-2 py-1 rounded text-[11px] font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                      >
                        <Check className="h-3 w-3" />
                        {locale === 'ko' ? '코드 적용' : 'Apply Code'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>{locale === 'ko' ? '생각하는 중...' : 'Thinking...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border-t border-zinc-800">
            <span className="text-green-400 font-mono text-sm select-none">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                locale === 'ko'
                  ? '코드 수정 요청을 입력하세요...'
                  : 'Type a code modification request...'
              }
              disabled={isLoading}
              className="flex-1 bg-transparent text-zinc-200 font-mono text-sm placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
