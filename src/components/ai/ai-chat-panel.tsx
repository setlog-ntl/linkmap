'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Bot, Sparkles, Send, Square, RotateCcw, X, User, GripHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiChat } from '@/lib/hooks/use-ai-chat';
import { RecommendationCards } from './recommendation-cards';
import { QuickActionButtons } from './quick-action-buttons';
import { useLocaleStore } from '@/stores/locale-store';
import { useAiChatStore } from '@/stores/ai-chat-store';
import { t } from '@/lib/i18n';
import type { DashboardResponse } from '@/types';
import type { ServiceRecommendation } from '@/types';

const PANEL_WIDTH = 400;
const PANEL_MAX_HEIGHT = 500;

interface AiChatPanelProps {
  data: DashboardResponse;
}

export function AiChatPanel({ data }: AiChatPanelProps) {
  const params = useParams();
  const projectId = params.id as string;
  const { locale } = useLocaleStore();
  const { isOpen, position, open, close, setPosition } = useAiChatStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

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
    streamingText,
    isStreaming,
    error,
    sendMessage,
    stop,
    reset,
  } = useAiChat({ projectId, context });

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Set default position on first open
  useEffect(() => {
    if (isOpen && !position) {
      setPosition({
        x: window.innerWidth - PANEL_WIDTH - 24,
        y: window.innerHeight - PANEL_MAX_HEIGHT - 24,
      });
    }
  }, [isOpen, position, setPosition]);

  const clampPosition = useCallback((x: number, y: number) => ({
    x: Math.max(0, Math.min(x, window.innerWidth - PANEL_WIDTH)),
    y: Math.max(0, Math.min(y, window.innerHeight - 100)),
  }), []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!position) return;
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [position]);

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

  const pos = position ?? { x: window.innerWidth - PANEL_WIDTH - 24, y: window.innerHeight - PANEL_MAX_HEIGHT - 24 };

  return (
    <div
      ref={panelRef}
      className="fixed z-50 flex flex-col bg-background border border-violet-500/20 rounded-xl shadow-2xl overflow-hidden"
      style={{
        left: pos.x,
        top: pos.y,
        width: PANEL_WIDTH,
        maxHeight: PANEL_MAX_HEIGHT,
      }}
    >
      {/* Draggable header */}
      <div
        className="flex items-center justify-between py-2.5 px-3 border-b bg-gradient-to-r from-violet-500/5 to-purple-500/5 select-none"
        style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <Bot className="h-4 w-4 text-violet-500" />
          <span className="font-medium text-sm">{t(locale, 'ai.chat.title')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={reset}
            title={t(locale, 'ai.chat.clearChat')}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={close}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4" style={{ maxHeight: PANEL_MAX_HEIGHT - 110 }}>
        <div className="space-y-3">
          {messages.length === 0 && !streamingText && (
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
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="shrink-0 h-6 w-6 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-violet-500" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3 py-2'
                : 'bg-muted rounded-2xl rounded-bl-sm px-3 py-2'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <RecommendationCards
                    recommendations={msg.recommendations}
                    onCardClick={handleCardClick}
                  />
                )}
              </div>
              {msg.role === 'user' && (
                <div className="shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {streamingText && (
            <div className="flex gap-2 justify-start">
              <div className="shrink-0 h-6 w-6 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-violet-500" />
              </div>
              <div className="max-w-[85%] bg-muted rounded-2xl rounded-bl-sm px-3 py-2">
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
                  <ReactMarkdown>{streamingText}</ReactMarkdown>
                  <span className="inline-block w-1.5 h-4 bg-violet-500 animate-pulse ml-0.5" />
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isStreaming && !streamingText && (
            <div className="flex gap-2 justify-start">
              <div className="shrink-0 h-6 w-6 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-violet-500" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2">
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
      <div className="p-3 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t(locale, 'ai.chat.inputPlaceholder')}
          disabled={isStreaming}
          className="text-sm"
        />
        {isStreaming ? (
          <Button
            size="icon"
            variant="outline"
            onClick={stop}
            className="shrink-0"
            title={t(locale, 'ai.chat.stopStreaming')}
          >
            <Square className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 bg-violet-600 hover:bg-violet-700"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
