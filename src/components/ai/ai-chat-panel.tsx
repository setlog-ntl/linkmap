'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Bot, Sparkles, Send, Square, RotateCcw, X, User, GripHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { IconTooltip } from '@/components/ui/icon-tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiChat } from '@/lib/hooks/use-ai-chat';
import { RecommendationCards } from './recommendation-cards';
import { QuickActionButtons } from './quick-action-buttons';
import { useLocaleStore } from '@/stores/locale-store';
import {
  useAiChatStore,
  PANEL_MIN_WIDTH,
  PANEL_MIN_HEIGHT,
  PANEL_DEFAULT_WIDTH,
  PANEL_DEFAULT_HEIGHT,
  PANEL_MAX_WIDTH,
  PANEL_MAX_HEIGHT_LIMIT,
} from '@/stores/ai-chat-store';
import { t } from '@/lib/i18n';
import type { DashboardResponse } from '@/types';
import type { ServiceRecommendation } from '@/types';

const HEADER_HEIGHT = 44;
const INPUT_HEIGHT = 56;

const THINKING_PHRASES: Record<string, string[]> = {
  ko: [
    '프로젝트 구조를 분석하고 있어요...',
    '연결된 서비스 정보를 확인 중이에요...',
    '최적의 답변을 준비하고 있어요...',
    '관련 문서를 참고하고 있어요...',
    '인사이트를 정리하고 있어요...',
    '서비스 간 연결을 파악하고 있어요...',
  ],
  en: [
    'Analyzing your project structure...',
    'Reviewing connected services...',
    'Preparing the best answer...',
    'Consulting relevant documentation...',
    'Organizing insights for you...',
    'Mapping service connections...',
  ],
};

const PHRASE_INTERVAL = 2800;

interface AiChatPanelProps {
  data: DashboardResponse;
}

export function AiChatPanel({ data }: AiChatPanelProps) {
  const params = useParams();
  const projectId = params.id as string;
  const { locale } = useLocaleStore();
  const { isOpen, position, size, isMaximized, open, close, setPosition, setSize, toggleMaximize } = useAiChatStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Thinking phrase cycling
  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = THINKING_PHRASES[locale] || THINKING_PHRASES.ko;

  const context = useMemo(() => {
    const allServices = data.layers?.flatMap((l) => l.services) || [];
    return {
      services: allServices.map((s) => s.name || s.slug),
      env_count: data.metrics?.totalEnvVars || 0,
      connections_count: data.connections?.length || 0,
    };
  }, [data]);

  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    stop,
    reset,
  } = useAiChat({ projectId, context });

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Cycle thinking phrases
  useEffect(() => {
    if (!isStreaming) {
      setPhraseIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, PHRASE_INTERVAL);
    return () => clearInterval(interval);
  }, [isStreaming, phrases.length]);

  // Set default position and size on first open
  useEffect(() => {
    if (isOpen && !position) {
      setPosition({
        x: window.innerWidth - PANEL_DEFAULT_WIDTH - 24,
        y: window.innerHeight - PANEL_DEFAULT_HEIGHT - 24,
      });
    }
    if (isOpen && !size) {
      setSize({
        width: PANEL_DEFAULT_WIDTH,
        height: PANEL_DEFAULT_HEIGHT,
      });
    }
  }, [isOpen, position, size, setPosition, setSize]);

  // Computed dimensions
  const panelWidth = isMaximized ? window.innerWidth - 48 : (size?.width ?? PANEL_DEFAULT_WIDTH);
  const panelHeight = isMaximized ? window.innerHeight - 48 : (size?.height ?? PANEL_DEFAULT_HEIGHT);
  const panelX = isMaximized ? 24 : (position?.x ?? window.innerWidth - PANEL_DEFAULT_WIDTH - 24);
  const panelY = isMaximized ? 24 : (position?.y ?? window.innerHeight - PANEL_DEFAULT_HEIGHT - 24);
  const messagesMaxHeight = panelHeight - HEADER_HEIGHT - INPUT_HEIGHT;

  const clampPosition = useCallback((x: number, y: number) => ({
    x: Math.max(0, Math.min(x, window.innerWidth - (size?.width ?? PANEL_DEFAULT_WIDTH))),
    y: Math.max(0, Math.min(y, window.innerHeight - 100)),
  }), [size]);

  // --- Drag handlers ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!position || isMaximized) return;
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [position, isMaximized]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const clamped = clampPosition(
      e.clientX - offset.current.x,
      e.clientY - offset.current.y,
    );
    setPosition(clamped);
  }, [clampPosition, setPosition]);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // --- Resize handlers ---
  const handleResizePointerDown = useCallback((e: React.PointerEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    resizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: size?.width ?? PANEL_DEFAULT_WIDTH,
      h: size?.height ?? PANEL_DEFAULT_HEIGHT,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [size, isMaximized]);

  const handleResizePointerMove = useCallback((e: React.PointerEvent) => {
    if (!resizing.current) return;
    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;
    const newWidth = Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, resizeStart.current.w + dx));
    const newHeight = Math.max(PANEL_MIN_HEIGHT, Math.min(PANEL_MAX_HEIGHT_LIMIT, resizeStart.current.h + dy));
    setSize({ width: newWidth, height: newHeight });
  }, [setSize]);

  const handleResizePointerUp = useCallback(() => {
    resizing.current = false;
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCardClick = (rec: ServiceRecommendation) => {
    sendMessage(`${rec.name}에 대해 더 자세히 알려줘. 설정 방법과 프로젝트와의 연동도 설명해줘.`);
  };

  const handleQuickAction = (promptText: string) => {
    sendMessage(promptText);
  };

  // Floating button (closed state)
  if (!isOpen) {
    return (
      <Button
        onClick={open}
        className="fixed bottom-6 right-6 z-50 gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg"
      >
        <Sparkles className="h-4 w-4" />
        {t(locale, 'ai.chat.open')}
      </Button>
    );
  }

  return (
    <div
      ref={panelRef}
      className="fixed z-50 flex flex-col bg-background border border-violet-500/20 rounded-xl shadow-2xl overflow-hidden transition-shadow hover:shadow-violet-500/10"
      style={{
        left: panelX,
        top: panelY,
        width: panelWidth,
        height: panelHeight,
      }}
    >
      {/* Draggable header */}
      <div
        className="flex items-center justify-between py-2.5 px-3 border-b bg-gradient-to-r from-violet-500/5 to-purple-500/5 select-none shrink-0"
        style={{ cursor: isMaximized ? 'default' : (dragging.current ? 'grabbing' : 'grab'), height: HEADER_HEIGHT }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-2">
          {!isMaximized && <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground" />}
          <Bot className="h-4 w-4 text-violet-500" />
          <span className="font-medium text-sm">{t(locale, 'ai.chat.title')}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <IconTooltip label={t(locale, 'ai.chat.clearChat')}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={reset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </IconTooltip>
          <IconTooltip label={isMaximized ? '복원' : '최대화'}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggleMaximize}
            >
              {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
          </IconTooltip>
          <IconTooltip label="닫기">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={close}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </IconTooltip>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 px-4 py-3" style={{ height: messagesMaxHeight }}>
        <div className="space-y-4">
          {messages.length === 0 && !isStreaming && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <Bot className="h-8 w-8 text-violet-500/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t(locale, 'ai.chat.placeholder')}
                </p>
              </div>
              <QuickActionButtons featureSlug="overview_chat" onAction={handleQuickAction} />
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${
                msg.role === 'assistant' && i === messages.length - 1
                  ? 'animate-ai-reveal'
                  : ''
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="shrink-0 h-6 w-6 rounded-full bg-violet-500/10 flex items-center justify-center mt-1">
                  <Bot className="h-3.5 w-3.5 text-violet-500" />
                </div>
              )}
              <div className={`min-w-0 ${msg.role === 'user'
                ? 'max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3.5 py-2.5'
                : 'max-w-[92%] bg-muted/60 rounded-2xl rounded-bl-sm px-4 py-3'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="ai-message-content prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                )}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <RecommendationCards
                    recommendations={msg.recommendations}
                    onCardClick={handleCardClick}
                  />
                )}
              </div>
              {msg.role === 'user' && (
                <div className="shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {isStreaming && (
            <div className="flex gap-2.5 justify-start animate-ai-fade-in">
              <div className="shrink-0 h-6 w-6 rounded-full bg-violet-500/10 flex items-center justify-center mt-1">
                <Bot className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
              </div>
              <div className="bg-muted/60 rounded-2xl rounded-bl-sm px-4 py-3 space-y-2 max-w-[85%]">
                <p
                  key={phraseIndex}
                  className="text-sm text-muted-foreground animate-ai-fade-in"
                >
                  {phrases[phraseIndex]}
                </p>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-3 border-t flex gap-2 shrink-0" style={{ height: INPUT_HEIGHT }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t(locale, 'ai.chat.inputPlaceholder')}
          disabled={isStreaming}
          className="text-sm"
        />
        {isStreaming ? (
          <IconTooltip label={t(locale, 'ai.chat.stopStreaming')}>
            <Button
              size="icon"
              variant="outline"
              onClick={stop}
              className="shrink-0"
            >
              <Square className="h-3.5 w-3.5" />
            </Button>
          </IconTooltip>
        ) : (
          <IconTooltip label="전송">
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0 bg-violet-600 hover:bg-violet-700"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </IconTooltip>
        )}
      </div>

      {/* Resize handle (bottom-right corner) */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        >
          <svg
            className="w-3 h-3 absolute bottom-0.5 right-0.5 text-muted-foreground/40 group-hover:text-violet-500 transition-colors"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M10 2L2 10M10 6L6 10M10 10L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
