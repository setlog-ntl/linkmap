// JSON-LD structured data generators for GEO (Generative Engine Optimization)

import { GUIDE_DATA } from '@/data/ui/guide-data';

const SITE_URL = 'https://www.linkmap.biz';
const SITE_NAME = 'Linkmap';
const LOGO_URL = `${SITE_URL}/logo.png`;

// ---------------------------------------------------------------------------
// Organization (shared across schemas)
// ---------------------------------------------------------------------------

function organizationJsonLd() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: ['https://github.com/linkmap-biz'],
  };
}

// ---------------------------------------------------------------------------
// WebApplication + Organization (Landing page)
// ---------------------------------------------------------------------------

export function generateWebAppJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: SITE_URL,
        description:
          '바이브 코딩 플랫폼. 서비스 연결 시각화, API 키 암호화 관리, 환경변수 자동 설정, 원클릭 배포까지.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
          description: '무료 플랜 — 프로젝트 3개, 환경변수 50개',
        },
        featureList: [
          '80+ 서비스 카탈로그 — 연결 방법·환경변수 자동 안내',
          'AES-256-GCM 암호화 API 키 관리',
          'React Flow 기반 서비스 맵 시각화',
          '6개 원클릭 배포 템플릿',
          '10개 초보자 교육 가이드',
          '환경변수 자동 점검 & 동기화',
          'GitHub 연동 자동 시크릿 배포',
        ],
        screenshot: `${SITE_URL}/og-image.png`,
        author: organizationJsonLd(),
      },
      {
        ...organizationJsonLd(),
        '@context': undefined,
        description:
          'Linkmap은 바이브 코딩 시대의 프로젝트 설정 플랫폼입니다. 초보자부터 개발자까지, 복잡한 서비스 연결과 환경변수 관리를 쉽고 안전하게.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Guide — Article + HowTo
// ---------------------------------------------------------------------------

interface GuideJsonLdInput {
  slug: string;
  title: string;
  description: string;
  readingTime?: string;
  faqs?: Array<{ q: string; a: string }>;
}

export function generateGuideJsonLd(input: GuideJsonLdInput) {
  const guideMeta = GUIDE_DATA.find((g) => g.slug === input.slug);
  const url = `${SITE_URL}/guides/${input.slug}`;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      headline: input.title,
      description: input.description,
      url,
      author: organizationJsonLd(),
      publisher: organizationJsonLd(),
      mainEntityOfPage: url,
      inLanguage: 'ko',
      ...(guideMeta?.readingTime && {
        timeRequired: `PT${parseInt(guideMeta.readingTime)}M`,
      }),
    },
  ];

  if (input.faqs && input.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: input.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

// ---------------------------------------------------------------------------
// Blog — Article (with datePublished/dateModified for GEO)
// ---------------------------------------------------------------------------

interface BlogJsonLdInput {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  tags?: string[];
}

export function generateBlogJsonLd(input: BlogJsonLdInput) {
  const url = `${SITE_URL}/blog/${input.slug}`;
  const readMin = input.readingTime ? parseInt(input.readingTime) : undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: input.title,
        description: input.description,
        url,
        author: organizationJsonLd(),
        publisher: organizationJsonLd(),
        mainEntityOfPage: url,
        inLanguage: 'ko',
        datePublished: input.publishedAt,
        dateModified: input.updatedAt ?? input.publishedAt,
        ...(readMin && { timeRequired: `PT${readMin}M` }),
        ...(input.tags && input.tags.length > 0 && { keywords: input.tags.join(', ') }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: '블로그', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: input.title, item: url },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Service — SoftwareApplication
// ---------------------------------------------------------------------------

interface ServiceJsonLdInput {
  name: string;
  slug: string;
  description: string;
  category?: string;
  websiteUrl?: string;
  pricingInfo?: Record<string, unknown>;
  difficultyLevel?: string;
}

export function generateServiceJsonLd(input: ServiceJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: `${SITE_URL}/services/${input.slug}`,
    applicationCategory: input.category ?? 'DeveloperApplication',
    ...(input.websiteUrl && { sameAs: input.websiteUrl }),
    ...(input.difficultyLevel && {
      educationalLevel: input.difficultyLevel,
    }),
    offers: input.pricingInfo
      ? {
          '@type': 'Offer',
          description: JSON.stringify(input.pricingInfo),
          priceCurrency: 'USD',
        }
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// FAQ Page
// ---------------------------------------------------------------------------

export function generateFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; href: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// Pricing — Product + Offer
// ---------------------------------------------------------------------------

export function generatePricingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Linkmap',
    description:
      '바이브 코딩 플랫폼. 서비스 연결 시각화, API 키 암호화 관리, 환경변수 자동 설정.',
    brand: organizationJsonLd(),
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'KRW',
        description:
          '프로젝트 3개, 환경변수 50개, 서비스 카탈로그 전체 열람, 교육 가이드 10개',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '9900',
        priceCurrency: 'KRW',
        description:
          '프로젝트 무제한, 환경변수 무제한, GitHub 시크릿 자동 배포, 팀 협업',
        availability: 'https://schema.org/InStock',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// ItemList (for compare page)
// ---------------------------------------------------------------------------

export function generateItemListJsonLd(
  items: Array<{ name: string; url: string; description?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
      ...(item.description && { description: item.description }),
    })),
  };
}

// ---------------------------------------------------------------------------
// Glossary — DefinedTerm
// ---------------------------------------------------------------------------

export function generateGlossaryJsonLd(
  terms: Array<{ term: string; definition: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: '바이브 코딩 용어집 | Linkmap',
    url: `${SITE_URL}/glossary`,
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      inDefinedTermSet: `${SITE_URL}/glossary`,
    })),
  };
}
