'use client';

import { useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MfaTotpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MfaTotpInput({ value, onChange, disabled, className }: MfaTotpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!/^\d?$/.test(char)) return;
      const next = digits.slice();
      next[index] = char;
      const newValue = next.join('').replace(/\s/g, '');
      onChange(newValue);

      if (char && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, onChange],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (pasted) {
        onChange(pasted);
        const focusIdx = Math.min(pasted.length, 5);
        inputRefs.current[focusIdx]?.focus();
      }
    },
    [onChange],
  );

  return (
    <div className={cn('flex flex-wrap gap-1.5 md:gap-2 justify-center', className)}>
      {digits.map((digit, i) => (
        <Input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit.trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          className="h-11 w-9 md:h-12 md:w-10 text-center text-lg font-mono bg-muted border-border"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
