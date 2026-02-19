export type TemplateCategory = 'all' | 'personal' | 'business' | 'community';

export const TEMPLATE_CATEGORY_ORDER: TemplateCategory[] = [
  'all', 'personal', 'business', 'community',
];

export const templateCategoryLabels: Record<TemplateCategory, { ko: string; en: string }> = {
  all:       { ko: '전체',       en: 'All' },
  personal:  { ko: '개인',       en: 'Personal' },
  business:  { ko: '비즈니스',   en: 'Business' },
  community: { ko: '커뮤니티',   en: 'Community' },
};

export const templateSlugToCategory: Record<string, TemplateCategory> = {
  'link-in-bio-pro':    'personal',
  'digital-namecard':   'personal',
  'dev-showcase':       'personal',
  'resume-site':        'personal',
  'personal-brand':     'personal',
  'small-biz':          'business',
  'product-landing':    'business',
  'qr-menu-pro':        'business',
  'freelancer-page':    'business',
  'saas-landing':       'business',
  'community-hub':      'community',
  'study-recruit':      'community',
  'event-page':         'community',
  'nonprofit-page':     'community',
  'newsletter-landing': 'community',
};

export const RECOMMENDED_SLUGS = new Set([
  'link-in-bio-pro',
  'digital-namecard',
  'dev-showcase',
]);

export const TEMPLATE_USE_CASES: Record<string, { ko: string[]; en: string[] }> = {
  'link-in-bio-pro':    { ko: ['크리에이터', 'SNS 프로필'],    en: ['Creator', 'SNS Profile'] },
  'digital-namecard':   { ko: ['명함 대체', 'QR 코드'],       en: ['Business Card', 'QR Code'] },
  'dev-showcase':       { ko: ['개발자', 'GitHub 연동'],       en: ['Developer', 'GitHub'] },
  'small-biz':          { ko: ['카페/음식점', '소상공인'],      en: ['Cafe/Restaurant', 'Small Biz'] },
  'product-landing':    { ko: ['사이드 프로젝트', 'SaaS'],     en: ['Side Project', 'SaaS'] },
  'qr-menu-pro':        { ko: ['QR 메뉴판', '식당/카페'],      en: ['QR Menu', 'Restaurant'] },
  'resume-site':        { ko: ['취업 준비', '이력서'],          en: ['Job Seeking', 'Resume'] },
  'personal-brand':     { ko: ['퍼스널 브랜딩', 'MZ세대'],     en: ['Personal Brand', 'Storytelling'] },
  'freelancer-page':    { ko: ['프리랜서', '포트폴리오'],       en: ['Freelancer', 'Portfolio'] },
  'saas-landing':       { ko: ['스타트업', '전환율 최적화'],    en: ['Startup', 'Conversion'] },
  'newsletter-landing': { ko: ['뉴스레터', '구독 CTA'],       en: ['Newsletter', 'Subscribe'] },
  'event-page':         { ko: ['밋업/컨퍼런스', '카운트다운'],  en: ['Meetup', 'Countdown'] },
  'community-hub':      { ko: ['스터디/동호회', '커뮤니티'],    en: ['Study Group', 'Community'] },
  'study-recruit':      { ko: ['모집 페이지', '스터디'],        en: ['Recruitment', 'Study Group'] },
  'nonprofit-page':     { ko: ['비영리 단체', '후원 CTA'],     en: ['Nonprofit', 'Donation'] },
};
