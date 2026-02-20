/**
 * Realistic bilingual sample content for 6 website templates.
 *
 * Used for:
 *  - Preview rendering in template picker / admin UI
 *  - Default placeholder values shown in the env-var setup wizard
 *  - E2E / Storybook fixtures
 *
 * Each template has a `ko` (Korean) and `en` (English) variant.
 * Korean copy is written in natural, contemporary Korean — not a translation.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. 나만의 홈페이지 (personal-brand)
// ─────────────────────────────────────────────────────────────────────────────

export interface PersonalBrandValues {
  emoji: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
}

export interface PersonalBrandHighlight {
  labelKo: string;
  labelEn: string;
  valueKo: string;
  valueEn: string;
}

export interface PersonalBrandContent {
  name: string;
  nameEn: string;
  taglineKo: string;
  taglineEn: string;
  storyKo: string;
  storyEn: string;
  values: PersonalBrandValues[];
  highlights: PersonalBrandHighlight[];
  socials: Array<{ platform: string; url: string }>;
  email: string;
}

export const personalBrandSample: { ko: PersonalBrandContent; en: PersonalBrandContent } = {
  ko: {
    name: '이지원',
    nameEn: 'Jiwon Lee',
    taglineKo: '콘텐츠로 세상을 연결하는 크리에이터',
    taglineEn: 'Creator who connects the world through content',
    storyKo:
      '안녕하세요, 저는 이지원입니다. 5년째 디지털 콘텐츠를 만들며 브랜드와 사람 사이의 다리를 놓고 있어요. 처음엔 작은 블로그 하나로 시작했지만, 지금은 유튜브·인스타·뉴스레터를 아우르는 멀티 채널 크리에이터로 활동 중입니다. 좋은 이야기가 사람을 움직인다고 믿기 때문에, 저는 언제나 "왜 이게 중요한가"부터 물어봅니다. 광고보다 진심이 먼저라는 원칙 아래 브랜드 캠페인부터 강연까지 다양하게 활동하고 있어요.',
    storyEn:
      "Hi, I'm Jiwon Lee. For the past five years I've been building bridges between brands and people through digital content. What started as a small blog has grown into a multi-channel presence spanning YouTube, Instagram, and a weekly newsletter. I believe great stories move people, so I always ask 'why does this matter?' first. Under the principle that authenticity beats advertising every time, I work across brand campaigns, workshops, and keynote speaking.",
    values: [
      {
        emoji: '✦',
        titleKo: '진정성',
        titleEn: 'Authenticity',
        descKo: '광고처럼 느껴지지 않는 콘텐츠. 내가 직접 써봤거나 믿는 것만 이야기합니다.',
        descEn: "Content that never feels like an ad — I only talk about things I've personally used or believe in.",
      },
      {
        emoji: '✦',
        titleKo: '일관성',
        titleEn: 'Consistency',
        descKo: '2019년부터 한 주도 거르지 않은 뉴스레터. 꾸준함이 신뢰를 만든다고 생각해요.',
        descEn: 'A newsletter published every single week since 2019. I believe consistency builds trust.',
      },
      {
        emoji: '✦',
        titleKo: '호기심',
        titleEn: 'Curiosity',
        descKo: '새로운 플랫폼, 새로운 포맷, 새로운 사람. 배움을 멈추지 않는 것이 제 원동력입니다.',
        descEn: 'New platforms, new formats, new people — never stopping learning is what keeps me going.',
      },
    ],
    highlights: [
      { labelKo: '구독자 합산', labelEn: 'Total Subscribers', valueKo: '84,000+', valueEn: '84,000+' },
      { labelKo: '협업 브랜드', labelEn: 'Brand Collabs', valueKo: '120+', valueEn: '120+' },
      { labelKo: '뉴스레터 연속 발행', labelEn: 'Newsletter Streak', valueKo: '312주', valueEn: '312 Weeks' },
    ],
    socials: [
      { platform: 'youtube', url: 'https://youtube.com/@jiwonlee' },
      { platform: 'instagram', url: 'https://instagram.com/jiwon.creates' },
      { platform: 'twitter', url: 'https://twitter.com/jiwonlee_kr' },
    ],
    email: 'hello@jiwonlee.kr',
  },
  en: {
    name: 'Alex Chen',
    nameEn: 'Alex Chen',
    taglineKo: '데이터로 이야기를 만드는 저널리스트',
    taglineEn: 'Journalist who turns data into stories',
    storyKo:
      '안녕하세요, Alex Chen입니다. 뉴욕에서 시작해 서울까지 — 데이터 저널리즘이라는 분야로 두 도시를 이어온 10년 경력의 기자입니다. 숫자 뒤에 숨겨진 사람의 이야기를 찾아내는 것이 제 일입니다. NYT, The Atlantic, Wired에 기고했으며, 현재는 독립 미디어를 운영하며 한국의 테크 생태계를 세계에 소개하고 있습니다.',
    storyEn:
      "Hi, I'm Alex Chen. From New York to Seoul — I'm a data journalist with 10 years of experience connecting two cities through storytelling. My job is to find the human story hiding behind the numbers. I've contributed to NYT, The Atlantic, and Wired, and now run an independent media outlet introducing Korea's tech ecosystem to the world.",
    values: [
      {
        emoji: '✦',
        titleKo: '정확성',
        titleEn: 'Accuracy',
        descKo: '모든 데이터는 원천 소스에서. 추측은 추측이라고 명시합니다.',
        descEn: 'Every data point traces back to its source. Speculation is labeled as such.',
      },
      {
        emoji: '✦',
        titleKo: '접근성',
        titleEn: 'Accessibility',
        descKo: '복잡한 데이터를 누구나 이해할 수 있게. 전문 용어 없이 설명하는 것이 진짜 실력입니다.',
        descEn: 'Making complex data understandable for everyone — explaining without jargon is the real skill.',
      },
      {
        emoji: '✦',
        titleKo: '독립성',
        titleEn: 'Independence',
        descKo: '어떤 광고주도 편집 방향에 영향을 주지 않습니다. 독자만이 제 보스입니다.',
        descEn: 'No advertiser influences editorial direction. My readers are my only boss.',
      },
    ],
    highlights: [
      { labelKo: '발행 기사', labelEn: 'Articles Published', valueKo: '450+', valueEn: '450+' },
      { labelKo: '수상 내역', labelEn: 'Awards', valueKo: '7', valueEn: '7' },
      { labelKo: '뉴스레터 독자', labelEn: 'Newsletter Readers', valueKo: '22,000+', valueEn: '22,000+' },
    ],
    socials: [
      { platform: 'twitter', url: 'https://twitter.com/alexchen_data' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/alexchen-data' },
      { platform: 'github', url: 'https://github.com/alexchen-data' },
    ],
    email: 'alex@alexchendata.com',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. 디지털 명함 (digital-namecard)
// ─────────────────────────────────────────────────────────────────────────────

export interface NamecardContent {
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  company: string;
  companyEn: string;
  email: string;
  phone: string;
  address: string;
  addressEn: string;
  website: string;
  accentColor: string;
  socials: Array<{ platform: string; url: string }>;
}

export const namecardSample: { ko: NamecardContent; en: NamecardContent } = {
  ko: {
    name: '박소연',
    nameEn: 'Soyeon Park',
    title: '브랜드 디자인 리드',
    titleEn: 'Brand Design Lead',
    company: '스튜디오 모놀로그',
    companyEn: 'Studio Monologue',
    email: 'soyeon@monologue.studio',
    phone: '010-4512-8820',
    address: '서울특별시 마포구 와우산로 94, 3층',
    addressEn: '3F, 94 Wausan-ro, Mapo-gu, Seoul',
    website: 'https://monologue.studio',
    accentColor: '#e8553e',
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/soyeon.design' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/soyeonpark-design' },
    ],
  },
  en: {
    name: 'James Whitfield',
    nameEn: 'James Whitfield',
    title: 'Senior Product Manager',
    titleEn: 'Senior Product Manager',
    company: 'Neonloop Inc.',
    companyEn: 'Neonloop Inc.',
    email: 'james@neonloop.io',
    phone: '+1 (415) 820-3377',
    address: '340 Pine St, Suite 800, San Francisco, CA 94104',
    addressEn: '340 Pine St, Suite 800, San Francisco, CA 94104',
    website: 'https://jameswhitfield.pm',
    accentColor: '#0ea5e9',
    socials: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/jwhitfield-pm' },
      { platform: 'twitter', url: 'https://twitter.com/jwhitfield_pm' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. 개발자 쇼케이스 (dev-showcase)
// ─────────────────────────────────────────────────────────────────────────────

export interface DevShowcaseSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon?: string;
}

export interface DevShowcaseProject {
  name: string;
  description: string;
  descriptionEn: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
}

export interface DevShowcaseExperience {
  title: string;
  titleEn: string;
  company: string;
  companyEn: string;
  period: string;
  periodEn: string;
  description: string;
  descriptionEn: string;
}

export interface DevShowcaseContent {
  name: string;
  nameEn: string;
  githubUsername: string;
  taglineKo: string;
  taglineEn: string;
  aboutKo: string;
  aboutEn: string;
  skills: DevShowcaseSkill[];
  projects: DevShowcaseProject[];
  experience: DevShowcaseExperience[];
  email: string;
  linkedinUrl: string;
}

export const devShowcaseSample: { ko: DevShowcaseContent; en: DevShowcaseContent } = {
  ko: {
    name: '김태양',
    nameEn: 'Taeyang Kim',
    githubUsername: 'taeyang-dev',
    taglineKo: '백엔드 엔지니어 · 오픈소스 기여자 · 성능 덕후',
    taglineEn: 'Backend Engineer · OSS Contributor · Performance Enthusiast',
    aboutKo:
      '안녕하세요! 분산 시스템과 고성능 API에 빠진 백엔드 엔지니어 김태양입니다. Go와 Rust로 서버를 짜는 걸 특히 좋아하고, 초당 10만 요청도 거뜬히 처리하는 시스템을 만들 때 가장 즐겁습니다. 오픈소스 기여를 통해 배운 것들을 나누고, 팀의 온보딩 경험을 개선하는 데도 관심이 많습니다.',
    aboutEn:
      "Hi! I'm Taeyang Kim, a backend engineer obsessed with distributed systems and high-performance APIs. I particularly love writing servers in Go and Rust, and I'm happiest when building systems that handle 100K+ RPS without breaking a sweat. I love sharing what I learn through open source contributions and am passionate about improving team onboarding experiences.",
    skills: [
      { name: 'Go', level: 'advanced' },
      { name: 'Rust', level: 'advanced' },
      { name: 'TypeScript', level: 'advanced' },
      { name: 'PostgreSQL', level: 'advanced' },
      { name: 'Redis', level: 'intermediate' },
      { name: 'Kubernetes', level: 'intermediate' },
      { name: 'gRPC', level: 'intermediate' },
      { name: 'Python', level: 'intermediate' },
      { name: 'Terraform', level: 'beginner' },
      { name: 'AWS', level: 'beginner' },
    ],
    projects: [
      {
        name: 'turbo-cache',
        description: '초경량 Go 기반 분산 캐시 서버 — Redis보다 40% 낮은 레이턴시',
        descriptionEn: 'Ultra-lightweight distributed cache server in Go — 40% lower latency than Redis',
        url: 'https://github.com/taeyang-dev/turbo-cache',
        language: 'Go',
        stars: 1240,
        forks: 87,
      },
      {
        name: 'sql-tracer',
        description: 'Postgres 슬로우 쿼리를 실시간으로 잡아주는 CLI 툴',
        descriptionEn: 'CLI tool that catches Postgres slow queries in real time',
        url: 'https://github.com/taeyang-dev/sql-tracer',
        language: 'Rust',
        stars: 338,
        forks: 41,
      },
      {
        name: 'k8s-sidekick',
        description: 'Kubernetes 로그·메트릭을 터미널에서 한눈에 보는 대시보드',
        descriptionEn: 'Terminal dashboard for Kubernetes logs and metrics at a glance',
        url: 'https://github.com/taeyang-dev/k8s-sidekick',
        language: 'TypeScript',
        stars: 192,
        forks: 28,
      },
    ],
    experience: [
      {
        title: '백엔드 엔지니어 (시니어)',
        titleEn: 'Senior Backend Engineer',
        company: '크래프톤',
        companyEn: 'Krafton',
        period: '2022 - 현재',
        periodEn: '2022 - Present',
        description: 'Go 기반 게임 서버 API 플랫폼 설계 및 개발. 피크 DAU 5백만 트래픽 처리 아키텍처 구축.',
        descriptionEn:
          'Designed and developed Go-based game server API platform. Built architecture handling 5M peak DAU traffic.',
      },
      {
        title: '백엔드 개발자',
        titleEn: 'Backend Developer',
        company: '토스 (비바리퍼블리카)',
        companyEn: 'Toss (Viva Republica)',
        period: '2020 - 2022',
        periodEn: '2020 - 2022',
        description: '결제 서비스 마이크로서비스 분리 작업 주도. Java Spring → Go 마이그레이션으로 응답속도 60% 개선.',
        descriptionEn:
          'Led microservice decomposition of payment service. Migrated Java Spring → Go, achieving 60% improvement in response time.',
      },
    ],
    email: 'taeyang@dev.kr',
    linkedinUrl: 'https://linkedin.com/in/taeyang-kim-backend',
  },
  en: {
    name: 'Sofia Marchetti',
    nameEn: 'Sofia Marchetti',
    githubUsername: 'sofiamdev',
    taglineKo: '풀스택 개발자 · UI/UX 마니아 · 오픈소스 메인테이너',
    taglineEn: 'Full-Stack Developer · UI/UX Enthusiast · Open Source Maintainer',
    aboutKo:
      '안녕하세요! 밀라노 출신의 풀스택 개발자 Sofia Marchetti입니다. React와 TypeScript로 아름다운 사용자 경험을 만드는 것을 좋아하고, 백엔드는 Node.js와 PostgreSQL로 조합합니다. 오픈소스 UI 컴포넌트 라이브러리 maintainer로 GitHub에서 2,000명 이상의 팔로워와 함께하고 있습니다.',
    aboutEn:
      "Hi! I'm Sofia Marchetti, a full-stack developer from Milan. I love crafting beautiful user experiences with React and TypeScript, backed by Node.js and PostgreSQL. As a maintainer of an open-source UI component library, I connect with 2,000+ followers on GitHub.",
    skills: [
      { name: 'TypeScript', level: 'advanced' },
      { name: 'React', level: 'advanced' },
      { name: 'Next.js', level: 'advanced' },
      { name: 'Node.js', level: 'advanced' },
      { name: 'GraphQL', level: 'intermediate' },
      { name: 'PostgreSQL', level: 'intermediate' },
      { name: 'Figma', level: 'intermediate' },
      { name: 'Docker', level: 'intermediate' },
      { name: 'AWS CDK', level: 'beginner' },
      { name: 'Rust', level: 'beginner' },
    ],
    projects: [
      {
        name: 'velvet-ui',
        description: 'Accessiblea, beautifully animated React component library with 60+ components',
        descriptionEn: 'Accessible, beautifully animated React component library with 60+ components',
        url: 'https://github.com/sofiamdev/velvet-ui',
        language: 'TypeScript',
        stars: 2870,
        forks: 214,
      },
      {
        name: 'query-lens',
        description: 'Visual GraphQL query builder and explorer for development teams',
        descriptionEn: 'Visual GraphQL query builder and explorer for development teams',
        url: 'https://github.com/sofiamdev/query-lens',
        language: 'TypeScript',
        stars: 543,
        forks: 72,
      },
      {
        name: 'forma',
        description: 'Type-safe form state manager with zero dependencies',
        descriptionEn: 'Type-safe form state manager with zero dependencies',
        url: 'https://github.com/sofiamdev/forma',
        language: 'TypeScript',
        stars: 291,
        forks: 38,
      },
    ],
    experience: [
      {
        title: 'Senior Frontend Engineer',
        titleEn: 'Senior Frontend Engineer',
        company: 'Figma',
        companyEn: 'Figma',
        period: '2023 - Present',
        periodEn: '2023 - Present',
        description:
          'Prototyping toolchain 핵심 UI 개발. React performance 개선으로 canvas 렌더링 50% 가속.',
        descriptionEn:
          'Core UI development for the prototyping toolchain. Accelerated canvas rendering by 50% through React performance improvements.',
      },
      {
        title: 'Frontend Developer',
        titleEn: 'Frontend Developer',
        company: 'Intercom',
        companyEn: 'Intercom',
        period: '2021 - 2023',
        periodEn: '2021 - 2023',
        description:
          '고객 메시징 대시보드 재설계 주도. A/B 테스트로 활성 사용자 23% 증가 달성.',
        descriptionEn:
          'Led redesign of the customer messaging dashboard. Drove 23% increase in active users through A/B testing.',
      },
    ],
    email: 'sofia@marchetti.dev',
    linkedinUrl: 'https://linkedin.com/in/sofia-marchetti-dev',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. 포트폴리오 / 프리랜서 페이지 (freelancer-page)
// ─────────────────────────────────────────────────────────────────────────────

export interface FreelancerService {
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  priceKo: string;
  priceEn: string;
  icon: string;
}

export interface FreelancerPortfolioItem {
  titleKo: string;
  titleEn: string;
  categoryKo: string;
  categoryEn: string;
  descKo: string;
  descEn: string;
  imageUrl: string;
  tags: string[];
}

export interface FreelancerTestimonial {
  authorKo: string;
  authorEn: string;
  roleKo: string;
  roleEn: string;
  companyKo: string;
  companyEn: string;
  contentKo: string;
  contentEn: string;
  rating: number;
}

export interface FreelancerProcessStep {
  number: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
}

export interface FreelancerContent {
  name: string;
  nameEn: string;
  taglineKo: string;
  taglineEn: string;
  services: FreelancerService[];
  portfolio: FreelancerPortfolioItem[];
  testimonials: FreelancerTestimonial[];
  process: FreelancerProcessStep[];
  email: string;
  socials: Array<{ platform: string; url: string }>;
}

export const freelancerSample: { ko: FreelancerContent; en: FreelancerContent } = {
  ko: {
    name: '정하은',
    nameEn: 'Haeun Jung',
    taglineKo: '브랜드의 이야기를 시각으로 풀어내는 그래픽 디자이너',
    taglineEn: 'Graphic designer who tells brand stories through visuals',
    services: [
      {
        titleKo: '브랜드 아이덴티티',
        titleEn: 'Brand Identity',
        descKo: '로고부터 컬러 팔레트, 타이포그래피까지 — 브랜드의 첫인상을 완성합니다.',
        descEn: 'From logo to color palette and typography — creating your brand\'s first impression.',
        priceKo: '₩350만 ~',
        priceEn: 'From $2,600',
        icon: 'palette',
      },
      {
        titleKo: '패키지 디자인',
        titleEn: 'Packaging Design',
        descKo: '소비자의 손에 닿는 순간 브랜드를 느끼게 만드는 패키지 디자인.',
        descEn: 'Packaging that makes consumers feel the brand the moment they touch it.',
        priceKo: '₩180만 ~',
        priceEn: 'From $1,300',
        icon: 'package',
      },
      {
        titleKo: '소셜 미디어 키트',
        titleEn: 'Social Media Kit',
        descKo: '인스타, 유튜브, 링크드인에 바로 쓸 수 있는 일관된 비주얼 키트.',
        descEn: 'Consistent visual kit ready to use on Instagram, YouTube, and LinkedIn.',
        priceKo: '₩80만 ~',
        priceEn: 'From $600',
        icon: 'image',
      },
    ],
    portfolio: [
      {
        titleKo: '하루마 커피 리브랜딩',
        titleEn: 'Haruma Coffee Rebranding',
        categoryKo: '브랜드 아이덴티티',
        categoryEn: 'Brand Identity',
        descKo: '성수 스페셜티 카페의 브랜드 전면 개편. 로고, 컵 디자인, 간판까지 통합 디자인.',
        descEn: 'Complete brand overhaul for a Seongsu specialty cafe — logo, cups, and signage.',
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
        tags: ['로고', '패키지', '브랜딩'],
      },
      {
        titleKo: 'NILE 스킨케어 패키지',
        titleEn: 'NILE Skincare Packaging',
        categoryKo: '패키지 디자인',
        categoryEn: 'Packaging Design',
        descKo: '미니멀 럭셔리 컨셉의 스킨케어 라인 패키지 디자인. 론칭 후 올리브영 입점 달성.',
        descEn: 'Minimal-luxury skincare packaging that secured Oliveyoung placement post-launch.',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
        tags: ['패키지', '럭셔리', '뷰티'],
      },
      {
        titleKo: '그린웨이 비영리 소셜 키트',
        titleEn: 'Greenway NGO Social Kit',
        categoryKo: '소셜 미디어 키트',
        categoryEn: 'Social Media Kit',
        descKo: '환경 비영리 단체의 캠페인 비주얼 제작. 인스타그램 팔로워 3배 성장 기여.',
        descEn: 'Campaign visuals for an environmental NGO. Contributed to 3x Instagram follower growth.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
        tags: ['소셜', 'NGO', '환경'],
      },
    ],
    testimonials: [
      {
        authorKo: '강민준',
        authorEn: 'Minjun Kang',
        roleKo: '대표',
        roleEn: 'CEO',
        companyKo: '하루마 커피',
        companyEn: 'Haruma Coffee',
        contentKo:
          '브랜드 방향을 제대로 잡아주셨어요. 처음 미팅부터 최종 시안까지 군더더기 없이 딱 원하는 걸 뽑아주셔서 정말 만족합니다.',
        contentEn:
          'She nailed our brand direction exactly. From the first meeting to the final mockup, she delivered precisely what we wanted without any back-and-forth.',
        rating: 5,
      },
      {
        authorKo: '이수진',
        authorEn: 'Sujin Lee',
        roleKo: '마케팅 매니저',
        roleEn: 'Marketing Manager',
        companyKo: 'NILE 스킨케어',
        companyEn: 'NILE Skincare',
        contentKo:
          '패키지 하나로 브랜드 가치가 달라지는 걸 직접 경험했어요. 바이어들 반응이 완전히 달라졌거든요. 다음 라인도 꼭 함께 하고 싶습니다.',
        contentEn:
          "We literally saw our brand perception change with one packaging redesign. Buyer reactions were completely different. We can't wait to work together on our next line.",
        rating: 5,
      },
    ],
    process: [
      {
        number: '01',
        titleKo: '킥오프 미팅',
        titleEn: 'Kickoff Meeting',
        descKo: '브리프 공유, 레퍼런스 수집, 방향성 합의. 보통 1시간 화상으로 진행합니다.',
        descEn: 'Share brief, gather references, align on direction. Usually a 1-hour video call.',
      },
      {
        number: '02',
        titleKo: '콘셉트 제안',
        titleEn: 'Concept Proposal',
        descKo: '3가지 방향의 무드보드와 초안 제시. 피드백 2회 수정 포함.',
        descEn: '3 moodboard directions + first draft. Includes 2 rounds of revisions.',
      },
      {
        number: '03',
        titleKo: '시안 확정',
        titleEn: 'Design Finalization',
        descKo: '선택된 방향으로 완성도를 높입니다. 세부 수정 무제한.',
        descEn: 'Polish the chosen direction. Unlimited minor revisions at this stage.',
      },
      {
        number: '04',
        titleKo: '최종 납품',
        titleEn: 'Final Delivery',
        descKo: 'AI, PNG, PDF 등 필요한 모든 포맷으로 납품. 가이드라인 문서 제공.',
        descEn: 'Delivery in all needed formats (AI, PNG, PDF) + brand guideline document.',
      },
    ],
    email: 'haeun@jung-design.kr',
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/haeun.design' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/haeunju' },
    ],
  },
  en: {
    name: 'Marcus Webb',
    nameEn: 'Marcus Webb',
    taglineKo: '스타트업을 위한 UX/UI 디자이너 & 브랜드 전략가',
    taglineEn: 'UX/UI Designer & Brand Strategist for startups',
    services: [
      {
        titleKo: '프로덕트 UX 디자인',
        titleEn: 'Product UX Design',
        descKo: '사용자 리서치부터 인터랙션 설계, 프로토타이핑까지 — 전환율을 높이는 경험을 설계합니다.',
        descEn: 'From user research to interaction design and prototyping — designing experiences that convert.',
        priceKo: '$4,500 ~',
        priceEn: 'From $4,500',
        icon: 'layout',
      },
      {
        titleKo: '브랜드 스프린트',
        titleEn: 'Brand Sprint',
        descKo: '5일 안에 MVP 브랜드 아이덴티티를 완성하는 집중 스프린트.',
        descEn: '5-day intensive sprint to complete an MVP brand identity.',
        priceKo: '$2,800 ~',
        priceEn: 'From $2,800',
        icon: 'zap',
      },
      {
        titleKo: '디자인 시스템',
        titleEn: 'Design System',
        descKo: 'Figma + 코드 토큰으로 구축하는 확장 가능한 컴포넌트 라이브러리.',
        descEn: 'Scalable component library built with Figma + code tokens.',
        priceKo: '$6,000 ~',
        priceEn: 'From $6,000',
        icon: 'component',
      },
    ],
    portfolio: [
      {
        titleKo: 'Flockr 앱 UX 리디자인',
        titleEn: 'Flockr App UX Redesign',
        categoryKo: '프로덕트 UX 디자인',
        categoryEn: 'Product UX Design',
        descKo: '팀 협업 앱 전체 UX 재설계. 온보딩 완료율 68% → 91%로 향상.',
        descEn: 'Full UX redesign of a team collaboration app. Onboarding completion rate improved from 68% to 91%.',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600',
        tags: ['UX', 'Mobile', 'SaaS'],
      },
      {
        titleKo: 'Vault 핀테크 브랜드',
        titleEn: 'Vault Fintech Brand',
        categoryKo: '브랜드 스프린트',
        categoryEn: 'Brand Sprint',
        descKo: '시리즈 A 전 2주 만에 완성한 핀테크 브랜드 아이덴티티. 투자 피칭 덱에 바로 사용.',
        descEn: 'Fintech brand identity completed in 2 weeks before Series A. Used directly in the investor pitch deck.',
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
        tags: ['Brand', 'Fintech', 'Identity'],
      },
      {
        titleKo: 'Luma 디자인 시스템',
        titleEn: 'Luma Design System',
        categoryKo: '디자인 시스템',
        categoryEn: 'Design System',
        descKo: '50+ 컴포넌트, Figma 변수 연동, Storybook 통합. 개발 속도 40% 향상.',
        descEn: '50+ components, Figma variables integration, Storybook. 40% faster development velocity.',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600',
        tags: ['Design System', 'Figma', 'Storybook'],
      },
    ],
    testimonials: [
      {
        authorKo: 'Priya Sharma',
        authorEn: 'Priya Sharma',
        roleKo: 'CPO',
        roleEn: 'CPO',
        companyKo: 'Flockr',
        companyEn: 'Flockr',
        contentKo:
          'Marcus는 단순히 아름다운 화면을 만드는 게 아니에요. 비즈니스 문제를 이해하고 그것을 디자인으로 해결합니다. 함께 일한 디자이너 중 가장 전략적이에요.',
        contentEn:
          "Marcus doesn't just make pretty screens. He understands the business problem and solves it through design. The most strategic designer I've worked with.",
        rating: 5,
      },
      {
        authorKo: 'David Okafor',
        authorEn: 'David Okafor',
        roleKo: '공동창업자',
        roleEn: 'Co-founder',
        companyKo: 'Vault',
        companyEn: 'Vault',
        contentKo:
          '2주 안에 투자자들이 "믿음이 간다"고 느끼는 브랜드를 만들어줬어요. 실제로 투자 미팅에서 브랜드 칭찬을 엄청 들었습니다.',
        contentEn:
          'He built a brand that made investors say "I trust this" in two weeks. We got so many compliments on the brand during our funding meetings.',
        rating: 5,
      },
    ],
    process: [
      {
        number: '01',
        titleKo: '디스커버리',
        titleEn: 'Discovery',
        descKo: '비즈니스 목표, 타겟 사용자, 경쟁사 분석. 1시간 집중 인터뷰.',
        descEn: 'Business goals, target users, competitive analysis. 1-hour focused interview.',
      },
      {
        number: '02',
        titleKo: '전략 수립',
        titleEn: 'Strategy',
        descKo: '포지셔닝, 아키텍처, 와이어프레임 — 실행 전 방향을 확실히 잡습니다.',
        descEn: 'Positioning, architecture, wireframes — nailing direction before execution.',
      },
      {
        number: '03',
        titleKo: '디자인',
        titleEn: 'Design',
        descKo: 'Figma 고해상도 시안, 인터랙티브 프로토타입, 에셋 정리.',
        descEn: 'Figma hi-fi mockups, interactive prototype, organized assets.',
      },
      {
        number: '04',
        titleKo: '핸드오프',
        titleEn: 'Handoff',
        descKo: '개발 팀을 위한 상세 스펙, 애니메이션 가이드, 에셋 익스포트.',
        descEn: 'Detailed specs for dev team, animation guides, asset exports.',
      },
    ],
    email: 'hello@marcuswebb.design',
    socials: [
      { platform: 'twitter', url: 'https://twitter.com/marcuswebb_ux' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/marcus-webb-design' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. 우리가게 홍보 (small-biz)
// ─────────────────────────────────────────────────────────────────────────────

export interface SmallBizMenuItem {
  nameKo: string;
  nameEn: string;
  descKo: string;
  descEn: string;
  price: string;
  category: string;
  emoji: string;
}

export interface SmallBizHours {
  dayKo: string;
  dayEn: string;
  hoursKo: string;
  hoursEn: string;
  isHoliday?: boolean;
}

export interface SmallBizContent {
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  descriptionEn: string;
  phone: string;
  address: string;
  addressEn: string;
  kakaoMapId: string;
  menuItems: SmallBizMenuItem[];
  hours: SmallBizHours[];
  instagramUrl: string;
  naverBlogUrl: string;
  kakaoChannelUrl: string;
}

export const smallBizSample: { ko: SmallBizContent; en: SmallBizContent } = {
  ko: {
    nameKo: '온기 베이커리',
    nameEn: 'Ongi Bakery',
    descriptionKo: '매일 아침 직접 구운 빵 한 조각으로 하루를 시작하세요. 방부제·인공향 없이 천연재료로만 만듭니다.',
    descriptionEn:
      'Start your day with a freshly baked loaf every morning. Made with only natural ingredients — no preservatives or artificial flavors.',
    phone: '02-334-5870',
    address: '서울 마포구 연남동 239-10',
    addressEn: '239-10, Yeonnam-dong, Mapo-gu, Seoul',
    kakaoMapId: '1234567890',
    menuItems: [
      {
        nameKo: '르방 깜빠뉴',
        nameEn: 'Levain Campagne',
        descKo: '72시간 발효 천연 르방 식빵. 촉촉하고 쫀쫀한 식감.',
        descEn: '72-hour fermented sourdough. Moist, chewy texture.',
        price: '₩7,500',
        category: '빵',
        emoji: '🍞',
      },
      {
        nameKo: '크루아상',
        nameEn: 'Croissant',
        descKo: '버터 48겹 수제 크루아상. 바삭하고 풍부한 버터향.',
        descEn: '48-layer handmade croissant. Crispy with rich butter aroma.',
        price: '₩4,800',
        category: '빵',
        emoji: '🥐',
      },
      {
        nameKo: '봉봉 쇼콜라',
        nameEn: 'Bonbon Chocolat',
        descKo: '발로나 초콜릿을 넣은 반숙 마들렌. 1인 2개 한정.',
        descEn: 'Molten madeleine with Valrhona chocolate. Limited to 2 per person.',
        price: '₩3,500',
        category: '과자',
        emoji: '🍫',
      },
      {
        nameKo: '플랫 화이트',
        nameEn: 'Flat White',
        descKo: '싱글 오리진 원두, 마이크로폼 밀크로 만든 진한 커피.',
        descEn: 'Single-origin espresso with microfoam milk.',
        price: '₩6,000',
        category: '음료',
        emoji: '☕',
      },
      {
        nameKo: '얼 그레이 라떼',
        nameEn: 'Earl Grey Latte',
        descKo: '베르가못 향이 살아있는 따뜻한 얼 그레이 밀크티.',
        descEn: 'Warm Earl Grey milk tea with vibrant bergamot aroma.',
        price: '₩5,500',
        category: '음료',
        emoji: '🫖',
      },
      {
        nameKo: '계절 과일 타르트',
        nameEn: 'Seasonal Fruit Tart',
        descKo: '매주 바뀌는 제철 과일 타르트. 현재: 딸기 & 망고.',
        descEn: 'Weekly seasonal fruit tart. Current: Strawberry & Mango.',
        price: '₩9,000',
        category: '케이크',
        emoji: '🍓',
      },
    ],
    hours: [
      { dayKo: '월요일', dayEn: 'Monday', hoursKo: '08:00 - 19:00', hoursEn: '08:00 - 19:00' },
      { dayKo: '화요일', dayEn: 'Tuesday', hoursKo: '08:00 - 19:00', hoursEn: '08:00 - 19:00' },
      { dayKo: '수요일', dayEn: 'Wednesday', hoursKo: '08:00 - 19:00', hoursEn: '08:00 - 19:00' },
      { dayKo: '목요일', dayEn: 'Thursday', hoursKo: '08:00 - 19:00', hoursEn: '08:00 - 19:00' },
      { dayKo: '금요일', dayEn: 'Friday', hoursKo: '08:00 - 20:00', hoursEn: '08:00 - 20:00' },
      { dayKo: '토요일', dayEn: 'Saturday', hoursKo: '09:00 - 20:00', hoursEn: '09:00 - 20:00' },
      { dayKo: '일요일', dayEn: 'Sunday', hoursKo: '09:00 - 17:00', hoursEn: '09:00 - 17:00' },
    ],
    instagramUrl: 'https://instagram.com/ongi_bakery',
    naverBlogUrl: 'https://blog.naver.com/ongibakery',
    kakaoChannelUrl: 'https://pf.kakao.com/_ongibakery',
  },
  en: {
    nameKo: '포르투나 피자 & 파스타',
    nameEn: 'Fortuna Pizza & Pasta',
    descriptionKo: '나폴리 정통 화덕 피자와 가정식 파스타를 경험하세요. 모든 반죽은 매일 아침 손으로 빚습니다.',
    descriptionEn:
      'Experience authentic Neapolitan wood-fired pizza and homestyle pasta. All dough is hand-made fresh every morning.',
    phone: '+1 (212) 555-0192',
    address: '47 Mulberry St, New York, NY 10013',
    addressEn: '47 Mulberry St, New York, NY 10013',
    kakaoMapId: '',
    menuItems: [
      {
        nameKo: '마르게리타',
        nameEn: 'Margherita',
        descKo: '산 마르자노 토마토, 모짜렐라 디 부팔라, 신선한 바질.',
        descEn: 'San Marzano tomato, buffalo mozzarella, fresh basil.',
        price: '$18',
        category: 'Pizza',
        emoji: '🍕',
      },
      {
        nameKo: '스파이시 살라미',
        nameEn: 'Spicy Salami',
        descKo: '칼라브레제 살라미, 엔초비, 케이퍼, 매운 올리브.',
        descEn: 'Calabrese salami, anchovies, capers, spicy olives.',
        price: '$22',
        category: 'Pizza',
        emoji: '🌶️',
      },
      {
        nameKo: '카치오 에 페페',
        nameEn: 'Cacio e Pepe',
        descKo: '로마 정통 레시피. 페코리노 로마노, 파르미지아노, 굵은 통후추.',
        descEn: 'Classic Roman recipe. Pecorino Romano, Parmigiano, cracked black pepper.',
        price: '$19',
        category: 'Pasta',
        emoji: '🍝',
      },
      {
        nameKo: '해산물 링귀니',
        nameEn: 'Seafood Linguine',
        descKo: '봉골레, 새우, 칼라마리, 화이트 와인 소스.',
        descEn: 'Clams, shrimp, calamari, white wine sauce.',
        price: '$26',
        category: 'Pasta',
        emoji: '🦐',
      },
      {
        nameKo: '티라미수',
        nameEn: 'Tiramisù',
        descKo: '마스카르포네, 사보이아르디, 에스프레소, 카카오.',
        descEn: 'Mascarpone, savoiardi, espresso, cocoa.',
        price: '$9',
        category: 'Dessert',
        emoji: '🍮',
      },
      {
        nameKo: '하우스 키안티',
        nameEn: 'House Chianti',
        descKo: '토스카나 산지 직송 하우스 와인.',
        descEn: 'House wine direct from Tuscany.',
        price: '$12',
        category: 'Drinks',
        emoji: '🍷',
      },
    ],
    hours: [
      { dayKo: '월요일', dayEn: 'Monday', hoursKo: '정기 휴무', hoursEn: 'Closed', isHoliday: true },
      { dayKo: '화요일', dayEn: 'Tuesday', hoursKo: '12:00 - 22:00', hoursEn: '12:00 - 22:00' },
      { dayKo: '수요일', dayEn: 'Wednesday', hoursKo: '12:00 - 22:00', hoursEn: '12:00 - 22:00' },
      { dayKo: '목요일', dayEn: 'Thursday', hoursKo: '12:00 - 22:00', hoursEn: '12:00 - 22:00' },
      { dayKo: '금요일', dayEn: 'Friday', hoursKo: '12:00 - 23:00', hoursEn: '12:00 - 23:00' },
      { dayKo: '토요일', dayEn: 'Saturday', hoursKo: '11:30 - 23:00', hoursEn: '11:30 - 23:00' },
      { dayKo: '일요일', dayEn: 'Sunday', hoursKo: '11:30 - 21:00', hoursEn: '11:30 - 21:00' },
    ],
    instagramUrl: 'https://instagram.com/fortuna_nyc',
    naverBlogUrl: '',
    kakaoChannelUrl: '',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. SNS 링크허브 (link-in-bio-pro)
// ─────────────────────────────────────────────────────────────────────────────

export interface LinkHubLink {
  titleKo: string;
  titleEn: string;
  url: string;
  icon: string;
  highlight?: boolean;
}

export interface LinkHubContent {
  siteNameKo: string;
  siteNameEn: string;
  bioKo: string;
  bioEn: string;
  avatarUrl: string | null;
  theme: string;
  links: LinkHubLink[];
  socials: Array<{ platform: string; url: string }>;
  youtubeUrl: string | null;
  viewCountKo: string;
  viewCountEn: string;
}

export const linkHubSample: { ko: LinkHubContent; en: LinkHubContent } = {
  ko: {
    siteNameKo: '최유진의 링크 모음',
    siteNameEn: "Yujin Choi's Links",
    bioKo: '라이프스타일 유튜버 · 여행 & 먹방 · 매주 수요일 업로드',
    bioEn: 'Lifestyle YouTuber · Travel & Food · New videos every Wednesday',
    avatarUrl: null,
    theme: 'gradient',
    links: [
      {
        titleKo: '✨ 최신 유튜브 영상 보러가기',
        titleEn: '✨ Watch Latest YouTube Video',
        url: 'https://youtube.com/@yujinchoilife',
        icon: 'youtube',
        highlight: true,
      },
      {
        titleKo: '📸 인스타그램 팔로우',
        titleEn: '📸 Follow on Instagram',
        url: 'https://instagram.com/yujin.travels',
        icon: 'instagram',
      },
      {
        titleKo: '📝 매주 뉴스레터 구독하기',
        titleEn: '📝 Subscribe to Weekly Newsletter',
        url: 'https://stibee.com/yujinchoi',
        icon: 'pen-line',
      },
      {
        titleKo: '🧳 여행 준비물 템플릿 무료 다운로드',
        titleEn: '🧳 Free Travel Packing Template',
        url: 'https://yujinchoi.notion.site/travel-template',
        icon: 'briefcase',
      },
      {
        titleKo: '🛒 유진이 쓰는 여행 아이템 모음',
        titleEn: '🛒 My Favorite Travel Gear',
        url: 'https://coupang.com/yujinchoi-picks',
        icon: 'shopping-bag',
      },
      {
        titleKo: '🎤 강연 · 협업 문의하기',
        titleEn: '🎤 Speaking & Collaboration Inquiries',
        url: 'mailto:biz@yujinchoi.kr',
        icon: 'briefcase',
      },
      {
        titleKo: '☕ 커피 한 잔 사주기',
        titleEn: '☕ Buy Me a Coffee',
        url: 'https://toss.me/yujin',
        icon: 'shopping-bag',
      },
    ],
    socials: [
      { platform: 'youtube', url: 'https://youtube.com/@yujinchoilife' },
      { platform: 'instagram', url: 'https://instagram.com/yujin.travels' },
      { platform: 'twitter', url: 'https://twitter.com/yujin_kr' },
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    viewCountKo: '누적 조회수 1,240,000',
    viewCountEn: '1,240,000 total views',
  },
  en: {
    siteNameKo: '테일러 라이언',
    siteNameEn: 'Taylor Ryan',
    bioKo: '인디 게임 개발자 & 스트리머 · Twitch · YouTube · 매일 새벽 방송',
    bioEn: 'Indie Game Dev & Streamer · Twitch · YouTube · Live every night',
    avatarUrl: null,
    theme: 'neon',
    links: [
      {
        titleKo: '🎮 지금 Twitch 라이브 중!',
        titleEn: '🎮 Watch Live on Twitch NOW!',
        url: 'https://twitch.tv/taylorryan_dev',
        icon: 'youtube',
        highlight: true,
      },
      {
        titleKo: '📺 최신 데브로그 (YouTube)',
        titleEn: '📺 Latest Devlog on YouTube',
        url: 'https://youtube.com/@taylorryan_dev',
        icon: 'youtube',
      },
      {
        titleKo: '🐦 개발 일상 트위터',
        titleEn: '🐦 Dev Life on Twitter/X',
        url: 'https://twitter.com/taylorryan_dev',
        icon: 'pen-line',
      },
      {
        titleKo: '🎮 내 게임 다운로드 (Steam / itch.io)',
        titleEn: '🎮 Download My Games (Steam / itch.io)',
        url: 'https://taylorryan.itch.io',
        icon: 'briefcase',
      },
      {
        titleKo: '💬 Discord 커뮤니티 참가',
        titleEn: '💬 Join the Discord Community',
        url: 'https://discord.gg/taylorryan',
        icon: 'briefcase',
      },
      {
        titleKo: '📰 개발 뉴스레터 구독',
        titleEn: '📰 Subscribe to Devlog Newsletter',
        url: 'https://buttondown.email/taylorryan',
        icon: 'pen-line',
      },
      {
        titleKo: '☕ Ko-fi로 후원하기',
        titleEn: '☕ Support on Ko-fi',
        url: 'https://ko-fi.com/taylorryan',
        icon: 'shopping-bag',
      },
    ],
    socials: [
      { platform: 'youtube', url: 'https://youtube.com/@taylorryan_dev' },
      { platform: 'twitter', url: 'https://twitter.com/taylorryan_dev' },
      { platform: 'github', url: 'https://github.com/taylorryan-dev' },
    ],
    youtubeUrl: null,
    viewCountKo: '누적 조회수 780,000',
    viewCountEn: '780,000 total views',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Convenience lookup by template slug
// ─────────────────────────────────────────────────────────────────────────────

export const templateSampleContent = {
  'personal-brand': personalBrandSample,
  'digital-namecard': namecardSample,
  'dev-showcase': devShowcaseSample,
  'freelancer-page': freelancerSample,
  'small-biz': smallBizSample,
  'link-in-bio-pro': linkHubSample,
} as const;

export type TemplateSampleSlug = keyof typeof templateSampleContent;
