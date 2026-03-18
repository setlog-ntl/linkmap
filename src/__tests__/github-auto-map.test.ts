import { describe, it, expect } from 'vitest';
import { mapEnvVarToSecretName, autoMapEnvVars } from '@/lib/github/auto-map';

describe('mapEnvVarToSecretName', () => {
  it('passes through valid UPPER_SNAKE_CASE names', () => {
    expect(mapEnvVarToSecretName('DATABASE_URL')).toBe('DATABASE_URL');
    expect(mapEnvVarToSecretName('API_KEY')).toBe('API_KEY');
  });

  it('converts lowercase to uppercase', () => {
    expect(mapEnvVarToSecretName('database_url')).toBe('DATABASE_URL');
    expect(mapEnvVarToSecretName('myApiKey')).toBe('MYAPIKEY');
  });

  it('replaces invalid characters with underscores', () => {
    expect(mapEnvVarToSecretName('my-api-key')).toBe('MY_API_KEY');
    expect(mapEnvVarToSecretName('my.api.key')).toBe('MY_API_KEY');
    expect(mapEnvVarToSecretName('key@special!')).toBe('KEY_SPECIAL_');
  });

  it('strips leading underscores', () => {
    expect(mapEnvVarToSecretName('___MY_KEY')).toBe('MY_KEY');
  });

  it('collapses consecutive underscores', () => {
    expect(mapEnvVarToSecretName('MY___KEY')).toBe('MY_KEY');
  });

  it('prepends underscore for names starting with a number', () => {
    expect(mapEnvVarToSecretName('123_KEY')).toBe('_123_KEY');
  });

  it('prefixes GITHUB_ reserved names with LM_', () => {
    expect(mapEnvVarToSecretName('GITHUB_TOKEN')).toBe('LM_GITHUB_TOKEN');
    expect(mapEnvVarToSecretName('GITHUB_SHA')).toBe('LM_GITHUB_SHA');
  });

  it('returns UNNAMED_SECRET for empty/invalid input', () => {
    expect(mapEnvVarToSecretName('')).toBe('UNNAMED_SECRET');
    expect(mapEnvVarToSecretName('...')).toBe('UNNAMED_SECRET');
  });
});

describe('autoMapEnvVars', () => {
  it('maps unique env vars without conflicts', () => {
    const result = autoMapEnvVars([
      { id: '1', key_name: 'DB_HOST' },
      { id: '2', key_name: 'DB_PORT' },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].conflict).toBe(false);
    expect(result[1].conflict).toBe(false);
    expect(result[0].secretName).toBe('DB_HOST');
    expect(result[1].secretName).toBe('DB_PORT');
  });

  it('detects naming conflicts', () => {
    const result = autoMapEnvVars([
      { id: '1', key_name: 'my-key' },
      { id: '2', key_name: 'my.key' },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].conflict).toBe(false);
    expect(result[1].conflict).toBe(true);
    expect(result[1].conflictReason).toContain('MY_KEY');
  });

  it('handles empty input', () => {
    expect(autoMapEnvVars([])).toEqual([]);
  });
});
