// 한글 유니코드 범위
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const CHOSUNG_COUNT = 588; // 21 * 28

const CHOSUNG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

/** 한글 음절에서 초성 추출. 비한글 문자는 그대로 반환 */
function getChosung(str: string): string {
  let result = '';
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code >= HANGUL_START && code <= HANGUL_END) {
      const index = Math.floor((code - HANGUL_START) / CHOSUNG_COUNT);
      result += CHOSUNG_LIST[index];
    } else {
      result += ch;
    }
  }
  return result;
}

/** query가 순수 초성으로만 이루어져 있는지 판별 */
function isChosungOnly(str: string): boolean {
  return str.length > 0 && [...str].every((ch) => CHOSUNG_LIST.includes(ch));
}

/**
 * 한글 친화적 검색 매칭
 * - 일반 includes 매칭 (대소문자 무시)
 * - 한글 초성 매칭: query="ㅍㄹ", target="폴라" → true
 */
export function matchKorean(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // 일반 includes 매칭
  if (t.includes(q)) return true;

  // 초성 매칭: query가 초성으로만 이루어진 경우
  if (isChosungOnly(q)) {
    const targetChosung = getChosung(t);
    if (targetChosung.includes(q)) return true;
  }

  return false;
}

/** 편집거리(Damerau-Levenshtein)가 max 이하인지. 초과가 확정되면 즉시 중단 */
function withinEditDistance(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  if (a === b) return true;

  // 전행/현행 2줄만 유지 (인접 전치 판정을 위해 전전행도 보관)
  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const curr: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      // 인접 두 글자 전치 (goolge → google)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d = Math.min(d, prev2[j - 2] + 1);
      }
      curr.push(d);
      if (d < rowMin) rowMin = d;
    }
    if (rowMin > max) return false;
    prev2 = prev;
    prev = curr;
  }
  return prev[b.length] <= max;
}

/** 검색어 길이에 따른 허용 오타 개수 — 짧은 검색어는 오탐이 많아 퍼지 미적용 */
function typoTolerance(query: string): number {
  if (query.length < 4) return 0;
  return query.length >= 8 ? 2 : 1;
}

/**
 * 오타 허용 매칭 — target을 단어 토큰으로 쪼개 각 토큰과 편집거리를 비교
 * 예: query="gogle", target="Google OAuth" → 토큰 "google"과 거리 1 → true
 * 정확 매칭(matchKorean)이 0건일 때의 폴백 용도로만 사용할 것 (오탐 방지)
 */
export function matchFuzzy(query: string, target: string): boolean {
  const max = typoTolerance(query);
  if (max === 0) return false;

  const q = query.toLowerCase();
  const t = target.toLowerCase();
  // 단어 토큰 + 전체 문자열(공백 포함 검색어 대응)을 후보로 비교
  const candidates = [t, ...t.split(/[^a-z0-9가-힣]+/).filter(Boolean)];
  return candidates.some((c) => withinEditDistance(q, c, max));
}
