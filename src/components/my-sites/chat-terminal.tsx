'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Loader2,
  Check,
  Rocket,
  FileText,
  FilePlus2,
  Sparkles,
  ChevronDown,
  Wand2,
  Palette,
  Plus,
  Type,
  ImageIcon,
  LayoutGrid,
  RotateCcw,
  Moon,
  Zap,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocaleStore } from '@/stores/locale-store';
import { t, type Locale } from '@/lib/i18n';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CodeBlock {
  filePath: string;
  code: string;
  lang: string;
  isNew: boolean;
}

interface ChatTerminalProps {
  fileContent: string;
  filePath: string | null;
  allFiles: string[];
  onApplyCode: (code: string) => void;
  onApplyFiles: (blocks: CodeBlock[]) => Promise<void>;
}

function extractCodeBlocks(text: string, currentFilePath: string | null, allFiles: string[]): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const multiPattern = /📄\s*([^\n]+)\n```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = multiPattern.exec(text)) !== null) {
    const filePath = match[1].trim();
    const lang = match[2] || 'html';
    const code = match[3].trim();
    const isNew = !allFiles.includes(filePath);
    blocks.push({ filePath, code, lang, isNew });
  }

  if (blocks.length === 0) {
    const singlePattern = /```(\w*)\n([\s\S]*?)```/g;
    let singleMatch;
    while ((singleMatch = singlePattern.exec(text)) !== null) {
      const lang = singleMatch[1] || 'html';
      const code = singleMatch[2].trim();
      if (code && currentFilePath) {
        blocks.push({ filePath: currentFilePath, code, lang, isNew: false });
      }
    }
  }

  return blocks;
}

function hasCodeBlock(content: string): boolean {
  return /```[\w]*\n[\s\S]*?```/.test(content);
}

interface SuggestionChip {
  icon: React.ReactNode;
  labelKey: string;
  promptKey: string;
}

const SUGGESTIONS: SuggestionChip[] = [
  {
    icon: <Palette className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionChangeColors',
    promptKey: 'chatTerminal.promptChangeColors',
  },
  {
    icon: <Plus className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionAddPage',
    promptKey: 'chatTerminal.promptAddPage',
  },
  {
    icon: <Type className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionChangeFont',
    promptKey: 'chatTerminal.promptChangeFont',
  },
  {
    icon: <ImageIcon className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionAddImage',
    promptKey: 'chatTerminal.promptAddImage',
  },
  {
    icon: <LayoutGrid className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionImproveLayout',
    promptKey: 'chatTerminal.promptImproveLayout',
  },
  {
    icon: <Wand2 className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionFullRedesign',
    promptKey: 'chatTerminal.promptFullRedesign',
  },
  {
    icon: <Moon className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionDarkMode',
    promptKey: 'chatTerminal.promptDarkMode',
  },
  {
    icon: <Zap className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionAnimations',
    promptKey: 'chatTerminal.promptAnimations',
  },
  {
    icon: <Globe className="h-3.5 w-3.5" />,
    labelKey: 'chatTerminal.suggestionSeo',
    promptKey: 'chatTerminal.promptSeo',
  },
];

export function ChatTerminal({
  fileContent,
  filePath,
  allFiles,
  onApplyCode,
  onApplyFiles,
}: ChatTerminalProps) {
  const { locale } = useLocaleStore();
  const loc = locale as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applyingIndex, setApplyingIndex] = useState<number | null>(null);
  const [applyingAll, setApplyingAll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // textarea 높이 초기화
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch('/api/oneclick/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          fileContent,
          filePath,
          allFiles,
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
          content: `${t(loc, 'chatTerminal.errorPrefix')}${err instanceof Error ? err.message : t(loc, 'chatTerminal.unknownError')}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, fileContent, filePath, allFiles, loc]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleApplySingle = (content: string) => {
    const blocks = extractCodeBlocks(content, filePath, allFiles);
    if (blocks.length === 1 && !blocks[0].isNew && blocks[0].filePath === filePath) {
      onApplyCode(blocks[0].code);
    }
  };

  const handleApplyAll = useCallback(
    async (content: string) => {
      const blocks = extractCodeBlocks(content, filePath, allFiles);
      if (blocks.length === 0) return;
      setApplyingAll(true);
      try {
        await onApplyFiles(blocks);
      } finally {
        setApplyingAll(false);
      }
    },
    [filePath, allFiles, onApplyFiles]
  );

  const handleApplyOne = useCallback(
    async (content: string, index: number) => {
      const blocks = extractCodeBlocks(content, filePath, allFiles);
      const block = blocks[index];
      if (!block) return;
      setApplyingIndex(index);
      try {
        if (!block.isNew && block.filePath === filePath) {
          onApplyCode(block.code);
        } else {
          await onApplyFiles([block]);
        }
      } finally {
        setApplyingIndex(null);
      }
    },
    [filePath, allFiles, onApplyCode, onApplyFiles]
  );

  const handleSuggestionClick = (suggestion: SuggestionChip) => {
    const prompt = t(loc, suggestion.promptKey);
    sendMessage(prompt);
  };

  // textarea 자동 높이 조절
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // 어시스턴트 메시지 렌더링
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderAssistantMessage = (msg: ChatMessage, _msgIndex: number) => {
    const blocks = extractCodeBlocks(msg.content, filePath, allFiles);
    const hasBlocks = blocks.length > 0;
    const isMulti = blocks.length > 1 || (blocks.length === 1 && blocks[0].isNew);

    const textParts = msg.content
      .replace(/📄\s*[^\n]+\n```\w*\n[\s\S]*?```/g, '')
      .replace(/```\w*\n[\s\S]*?```/g, '')
      .trim();

    return (
      <div className="flex gap-2.5 items-start">
        {/* AI 아바타 */}
        <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* 설명 텍스트 */}
          {textParts && (
            <div className="bg-muted/60 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {textParts}
            </div>
          )}

          {/* 코드블록들 */}
          {blocks.map((block, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden shadow-sm">
              {/* 파일 헤더 */}
              <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b">
                <div className="flex items-center gap-2 text-xs">
                  {block.isNew ? (
                    <FilePlus2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className="font-mono font-medium">{block.filePath}</span>
                  {block.isNew && (
                    <Badge className="text-[10px] px-1.5 py-0 h-4 bg-emerald-500 text-white">
                      {t(loc, 'chatTerminal.newFile')}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                  onClick={() => handleApplyOne(msg.content, i)}
                  disabled={applyingIndex === i || applyingAll}
                >
                  {applyingIndex === i ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {t(loc, 'chatTerminal.apply')}
                </Button>
              </div>
              {/* 코드 미리보기 */}
              <pre className="px-3 py-2 text-[11px] text-muted-foreground overflow-x-auto max-h-28 font-mono leading-relaxed">
                {block.code.split('\n').slice(0, 6).join('\n')}
                {block.code.split('\n').length > 6 && (
                  <span className="text-muted-foreground/50">
                    {`\n... ${t(loc, 'chatTerminal.linesTotal').replace('{count}', String(block.code.split('\n').length))}`}
                  </span>
                )}
              </pre>
            </div>
          ))}

          {/* 액션 버튼 */}
          {hasBlocks && (
            <div className="flex gap-2 flex-wrap">
              {!isMulti && !blocks[0].isNew && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                  onClick={() => handleApplySingle(msg.content)}
                >
                  <Check className="h-3 w-3 mr-1.5" />
                  {t(loc, 'chatTerminal.applyCode')}
                </Button>
              )}
              <Button
                size="sm"
                className="h-8 text-xs rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 shadow-sm"
                onClick={() => handleApplyAll(msg.content)}
                disabled={applyingAll}
              >
                {applyingAll ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                ) : (
                  <Rocket className="h-3 w-3 mr-1.5" />
                )}
                {applyingAll
                  ? t(loc, 'chatTerminal.applyingAll')
                  : t(loc, 'chatTerminal.applyAllDeploy')}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ===== 플로팅 열기 버튼 (닫혀있을 때) ===== */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">
            {t(loc, 'chatTerminal.aiHelper')}
          </span>
          {messages.length > 0 && (
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* ===== 챗 패널 ===== */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 left-0 md:left-auto md:right-4 md:bottom-4 z-50 md:w-[420px] flex flex-col bg-background border rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[75vh] md:max-h-[600px] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-violet-500/5 to-blue-500/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">
                  {t(loc, 'chatTerminal.title')}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {t(loc, 'chatTerminal.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => setMessages([])}
                  title={t(loc, 'chatTerminal.clearChat')}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
            {/* 빈 상태: 환영 메시지 + 추천 */}
            {messages.length === 0 && (
              <div className="space-y-4 py-2">
                <div className="flex gap-2.5 items-start">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-muted/60 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm leading-relaxed">
                    {t(loc, 'chatTerminal.welcome')}
                  </div>
                </div>

                {/* 추천 칩 */}
                <div className="pl-9">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">
                    {t(loc, 'chatTerminal.trySuggestions')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/80 hover:bg-muted text-foreground/80 hover:text-foreground transition-colors border border-transparent hover:border-border disabled:opacity-50"
                      >
                        {s.icon}
                        {t(loc, s.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 메시지 목록 */}
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'user' ? (
                  /* 사용자 메시지 - 오른쪽 정렬 */
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-3.5 py-2.5 text-sm max-w-[85%] break-words">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  /* AI 응답 */
                  hasCodeBlock(msg.content)
                    ? renderAssistantMessage(msg, i)
                    : (
                      <div className="flex gap-2.5 items-start">
                        <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                          <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="bg-muted/60 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words max-w-[85%]">
                          {msg.content}
                        </div>
                      </div>
                    )
                )}
              </div>
            ))}

            {/* 로딩 표시 */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/60 rounded-2xl rounded-tl-md px-3.5 py-2.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>
                      {t(loc, 'chatTerminal.analyzing')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t px-3 py-3 bg-background">
            {/* 현재 편집 중인 파일 표시 */}
            {filePath && (
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">
                  {t(loc, 'chatTerminal.editing')}
                  <span className="font-mono">{filePath.split('/').pop()}</span>
                </span>
              </div>
            )}
            <div className="flex items-end gap-2 bg-muted/40 rounded-2xl px-3 py-2 border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t(loc, 'chatTerminal.placeholder')}
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50 resize-none min-h-[24px] max-h-[120px] py-0.5 leading-relaxed"
              />
              <Button
                size="icon"
                className="h-8 w-8 rounded-full shrink-0 bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600 shadow-sm disabled:opacity-40"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/60 text-center mt-1.5">
              {t(loc, 'chatTerminal.inputHint')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
