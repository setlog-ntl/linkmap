import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { encrypt, decrypt, maskValue } from './index';

describe('crypto', () => {
  const TEST_KEY = 'a'.repeat(64); // 32 bytes in hex

  beforeEach(() => {
    vi.stubEnv('ENCRYPTION_KEY', TEST_KEY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('encrypt', () => {
    it('should encrypt plaintext and return iv:authTag:data format', () => {
      const result = encrypt('hello world');
      const parts = result.split(':');
      expect(parts).toHaveLength(3);
      // IV = 16 bytes = 32 hex chars
      expect(parts[0]).toHaveLength(32);
      // Auth tag = 16 bytes = 32 hex chars
      expect(parts[1]).toHaveLength(32);
      // Encrypted data should be non-empty hex
      expect(parts[2].length).toBeGreaterThan(0);
    });

    it('should produce different ciphertexts for the same plaintext (random IV)', () => {
      const a = encrypt('same text');
      const b = encrypt('same text');
      expect(a).not.toBe(b);
    });

    it('should throw if ENCRYPTION_KEY is not set', () => {
      vi.stubEnv('ENCRYPTION_KEY', '');
      expect(() => encrypt('test')).toThrow();
    });
  });

  describe('decrypt', () => {
    it('should decrypt what encrypt produces', () => {
      const plaintext = 'sk-proj-abc123XYZ';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });

    it('should handle unicode text', () => {
      const plaintext = '한글 테스트 🔑';
      const encrypted = encrypt(plaintext);
      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it('should handle empty string', () => {
      const encrypted = encrypt('');
      expect(decrypt(encrypted)).toBe('');
    });

    it('should throw on invalid format', () => {
      expect(() => decrypt('invalid')).toThrow('Invalid encrypted data format');
    });

    it('should throw on tampered ciphertext', () => {
      const encrypted = encrypt('secret');
      const parts = encrypted.split(':');
      // Tamper with encrypted data
      parts[2] = 'ff' + parts[2].slice(2);
      expect(() => decrypt(parts.join(':'))).toThrow();
    });
  });

  describe('maskValue', () => {
    it('should mask values longer than 4 chars', () => {
      expect(maskValue('sk-proj-abc123')).toBe('sk-p••••••••••');
    });

    it('should fully mask values of 4 chars or less', () => {
      expect(maskValue('abc')).toBe('••••');
      expect(maskValue('abcd')).toBe('••••');
    });

    it('should cap dots at 20', () => {
      const long = 'a'.repeat(30);
      const masked = maskValue(long);
      expect(masked).toBe('aaaa' + '•'.repeat(20));
    });
  });
});
