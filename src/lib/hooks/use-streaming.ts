'use client';

import { useState, useCallback, useRef } from 'react';

interface UseStreamingOptions {
  onChunk?: (chunk: string) => void;
  onDone?: (fullText: string) => void;
  onError?: (error: string) => void;
}

export function useStreaming(options: UseStreamingOptions = {}) {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async (url: string, body: Record<string, unknown>) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setText('');
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
              options.onError?.(parsed.error);
              continue;
            }
            if (parsed.chunk) {
              fullText += parsed.chunk;
              setText(fullText);
              options.onChunk?.(parsed.chunk);
            }
          } catch {
            // skip
          }
        }
      }

      options.onDone?.(fullText);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Streaming failed';
      setError(msg);
      options.onError?.(msg);
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [options]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setText('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return { text, isStreaming, error, start, stop, reset };
}
