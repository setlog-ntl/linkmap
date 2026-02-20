'use client';

import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, ServiceRecommendation, AiFeatureSlug } from '@/types';

interface UseAiChatOptions {
  projectId: string;
  featureSlug?: AiFeatureSlug;
  context?: {
    services?: string[];
    env_count?: number;
    connections_count?: number;
  };
}

function parseRecommendations(text: string): ServiceRecommendation[] {
  const regex = /```json:recommendations\s*\n([\s\S]*?)```/g;
  const results: ServiceRecommendation[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        results.push(...parsed);
      }
    } catch {
      // skip malformed
    }
  }
  return results;
}

function stripRecommendationBlocks(text: string): string {
  return text.replace(/```json:recommendations\s*\n[\s\S]*?```/g, '').trim();
}

export function useAiChat({ projectId, featureSlug = 'overview_chat', context }: UseAiChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setStreamingText('');
    setError(null);
    setIsStreaming(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          project_id: projectId,
          feature_slug: featureSlug,
          context,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError(parsed.error);
              continue;
            }
            if (parsed.chunk) {
              fullText += parsed.chunk;
              setStreamingText(fullText);
            }
          } catch {
            // skip
          }
        }
      }

      // Parse recommendations from full text
      const recommendations = parseRecommendations(fullText);
      const cleanContent = stripRecommendationBlocks(fullText);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: cleanContent || fullText,
        recommendations: recommendations.length > 0 ? recommendations : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText('');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Streaming failed';
      setError(msg);
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, projectId, featureSlug, context]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    if (streamingText) {
      const recommendations = parseRecommendations(streamingText);
      const cleanContent = stripRecommendationBlocks(streamingText);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: cleanContent || streamingText,
          recommendations: recommendations.length > 0 ? recommendations : undefined,
        },
      ]);
      setStreamingText('');
    }
    setIsStreaming(false);
  }, [streamingText]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStreamingText('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    streamingText,
    isStreaming,
    error,
    sendMessage,
    stop,
    reset,
  };
}
