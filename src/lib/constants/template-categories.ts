export const RECOMMENDED_SLUGS = new Set([
  'personal-brand',
  'digital-namecard',
]);

export const TEMPLATE_USE_CASES: Record<string, { ko: string[]; en: string[] }> = {
  'personal-brand':   { ko: ['누구나', '나만의 홈페이지'],    en: ['Anyone', 'Personal Homepage'] },
  'digital-namecard': { ko: ['명함 대체', 'QR 코드'],        en: ['Business Card', 'QR Code'] },
  'dev-showcase':     { ko: ['개발자', 'GitHub 연동'],        en: ['Developer', 'GitHub'] },
  'freelancer-page':  { ko: ['디자이너/작가', '포트폴리오'],   en: ['Designer/Writer', 'Portfolio'] },
  'small-biz':        { ko: ['카페/음식점', '소상공인'],       en: ['Cafe/Restaurant', 'Small Biz'] },
  'link-in-bio-pro':  { ko: ['크리에이터', 'SNS 프로필'],     en: ['Creator', 'SNS Profile'] },
};
