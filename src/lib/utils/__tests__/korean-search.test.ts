import { describe, it, expect } from 'vitest';
import { matchKorean, matchFuzzy } from '../korean-search';

describe('matchKorean', () => {
  it('대소문자 무시 부분 일치', () => {
    expect(matchKorean('google', 'Google OAuth')).toBe(true);
    expect(matchKorean('구글', '구글 로그인')).toBe(true);
  });

  it('초성 매칭', () => {
    expect(matchKorean('ㅍㄹ', '폴라')).toBe(true);
    expect(matchKorean('ㅅㅍ', '폴라')).toBe(false);
  });
});

describe('matchFuzzy', () => {
  // 회귀: "gogle"(o 누락) 검색 시 Google 서비스가 0건이던 문제
  it('한 글자 누락 오타를 허용한다', () => {
    expect(matchFuzzy('gogle', 'Google OAuth')).toBe(true);
    expect(matchFuzzy('gogle', 'google-drive')).toBe(true);
  });

  it('인접 글자 전치 오타를 허용한다', () => {
    expect(matchFuzzy('goolge', 'Google Maps Platform')).toBe(true);
  });

  it('3글자 이하 검색어에는 퍼지를 적용하지 않는다', () => {
    expect(matchFuzzy('aws', 'AWS S3')).toBe(false);
    expect(matchFuzzy('gcs', 'GCP')).toBe(false);
  });

  it('무관한 서비스에는 매칭되지 않는다', () => {
    expect(matchFuzzy('gogle', 'Supabase')).toBe(false);
    expect(matchFuzzy('stripe', 'Google Drive')).toBe(false);
  });

  it('한글 오타도 허용한다', () => {
    expect(matchFuzzy('구클 드라이브', '구글 드라이브')).toBe(true);
  });
});
