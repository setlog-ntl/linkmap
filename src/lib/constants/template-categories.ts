export const RECOMMENDED_SLUGS = new Set([
  'personal-brand',
  'digital-namecard',
  'excel-merge',
]);

export const TEMPLATE_USE_CASES: Record<string, { ko: string[]; en: string[] }> = {
  'personal-brand':   { ko: ['누구나', '나만의 홈페이지'],    en: ['Anyone', 'Personal Homepage'] },
  'digital-namecard': { ko: ['명함 대체', 'QR 코드'],        en: ['Business Card', 'QR Code'] },
  'dev-showcase':     { ko: ['개발자', 'GitHub 연동'],        en: ['Developer', 'GitHub'] },
  'freelancer-page':  { ko: ['프리랜서', '포트폴리오'],         en: ['Designer/Writer', 'Portfolio'] },
  'small-biz':        { ko: ['요리주점/레스토랑', '소상공인'],   en: ['Restaurant/Bar', 'Small Biz'] },
  'small-biz-cafe':   { ko: ['카페/커피', '소상공인'],         en: ['Cafe/Coffee', 'Small Biz'] },
  'link-card':  { ko: ['크리에이터', '링크 모음'],       en: ['Creator', 'SNS Profile'] },
  'invitation': { ko: ['모임/파티', '생일/축하'],         en: ['Gathering/Party', 'Birthday/Event'] },
  'excel-merge': { ko: ['사무직', '엑셀 취합'],          en: ['Office Work', 'Merge Excel'] },
};
