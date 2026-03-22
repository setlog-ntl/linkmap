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
