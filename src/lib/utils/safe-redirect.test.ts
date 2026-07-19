import { describe, it, expect } from 'vitest';
import { safeInternalPath } from './safe-redirect';

describe('safeInternalPath', () => {
  it('내부 절대 경로는 그대로 허용한다', () => {
    expect(safeInternalPath('/dashboard')).toBe('/dashboard');
    expect(safeInternalPath('/sites/new')).toBe('/sites/new');
    expect(safeInternalPath('/project/abc?tab=env')).toBe('/project/abc?tab=env');
  });

  it('프로토콜 상대 URL(//evil.com)을 차단한다', () => {
    expect(safeInternalPath('//evil.com')).toBe('/dashboard');
    expect(safeInternalPath('//evil.com/phish')).toBe('/dashboard');
  });

  it('스킴 포함 절대 URL을 차단한다', () => {
    expect(safeInternalPath('https://evil.com')).toBe('/dashboard');
    expect(safeInternalPath('http://evil.com')).toBe('/dashboard');
    expect(safeInternalPath('javascript:alert(1)')).toBe('/dashboard');
  });

  it('백슬래시/인코딩 우회를 차단한다', () => {
    expect(safeInternalPath('/\\evil.com')).toBe('/dashboard');
    expect(safeInternalPath('/%2Fevil.com')).toBe('/dashboard');
    expect(safeInternalPath('/%5Cevil.com')).toBe('/dashboard');
  });

  it('상대 경로/빈 값/null은 fallback을 반환한다', () => {
    expect(safeInternalPath('dashboard')).toBe('/dashboard');
    expect(safeInternalPath('')).toBe('/dashboard');
    expect(safeInternalPath(null)).toBe('/dashboard');
    expect(safeInternalPath(undefined)).toBe('/dashboard');
  });

  it('커스텀 fallback을 지원한다', () => {
    expect(safeInternalPath(null, '/login')).toBe('/login');
    expect(safeInternalPath('//evil.com', '/login')).toBe('/login');
  });
});
