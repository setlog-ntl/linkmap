// ---------------------------------------------------------------------------
// Service Comparisons Data
// 블로그 포스트에서 참조할 수 있는 카테고리별 서비스 비교 데이터
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** 가격 플랜 정보 */
export interface PricingPlan {
  name: string;
  price: string;
  period?: '월' | '연';
  highlights: string[];
}

/** 장단점 */
export interface ProsCons {
  pros: string[];
  cons: string[];
}

/** 기능 비교 항목 */
export interface FeatureRow {
  feature: string;
  values: Record<string, string>;
  note?: string;
}

/** 타겟 사용자 적합도 */
export type TargetFit = 'best' | 'good' | 'limited' | 'none';

export interface TargetAudience {
  label: string;
  fits: Record<string, TargetFit>;
}

/** 관련 블로그 포스트 매핑 */
export interface RelatedPost {
  slug: string;
  title: string;
  relevance: string;
}

/** 개별 서비스 정보 */
export interface ServiceInfo {
  name: string;
  url: string;
  tagline: string;
  pricing: PricingPlan[];
  prosCons: ProsCons;
}

/** 카테고리별 비교 데이터 */
export interface ServiceComparison {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  services: ServiceInfo[];
  featureMatrix: FeatureRow[];
  targetAudiences: TargetAudience[];
  relatedPosts: RelatedPost[];
  verdict: string;
}

// ---------------------------------------------------------------------------
// 1. 환경변수/시크릿 관리 도구: Doppler vs Infisical vs Linkmap
// ---------------------------------------------------------------------------

export const ENV_MANAGEMENT_COMPARISON: ServiceComparison = {
  id: 'env-management-tools',
  title: '환경변수/시크릿 관리 도구 비교',
  description: 'Doppler, Infisical, Linkmap의 기능, 가격, 사용성을 비교합니다.',
  lastUpdated: '2026-03-19',
  services: [
    {
      name: 'Doppler',
      url: 'https://www.doppler.com',
      tagline: '완전 관리형 엔터프라이즈 시크릿 관리 SaaS',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: ['3명 이하 무료', '로그 보관 3일', '기본 통합'],
        },
        {
          name: 'Team',
          price: '$21/사용자',
          period: '월',
          highlights: ['무제한 프로젝트', '감사 로그', '팀 권한 관리'],
        },
        {
          name: 'Enterprise',
          price: '문의',
          highlights: ['SSO/SAML', 'SLA', '전담 지원'],
        },
      ],
      prosCons: {
        pros: [
          '직관적인 UI와 빠른 셋업',
          '풍부한 서드파티 통합 (Docker, Kubernetes, Vercel 등)',
          '엔터프라이즈 워크플로 지원',
          'CLI 사용성 우수',
        ],
        cons: [
          '셀프호스팅 불가',
          '사용자 수 기반 과금 — 팀 10명이면 월 $210',
          '한국어 지원 없음',
          '서비스 시각화 기능 없음',
        ],
      },
    },
    {
      name: 'Infisical',
      url: 'https://infisical.com',
      tagline: '오픈소스(MIT) 시크릿 관리 플랫폼',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: ['무료 영구', '클라우드 무료 플랜', '기본 기능'],
        },
        {
          name: 'Pro',
          price: '$9/사용자',
          period: '월',
          highlights: ['고급 시크릿 로테이션', 'PKI 인증서 관리', 'RBAC'],
        },
        {
          name: 'Enterprise',
          price: '문의',
          highlights: ['SSO/SAML', 'SCIM', '전용 인프라'],
        },
      ],
      prosCons: {
        pros: [
          '오픈소스(MIT) — 코드 투명성',
          '셀프호스팅으로 데이터 완전 통제',
          '동적 시크릿 생성, PKI 인증서 관리 등 고급 기능',
          'GitHub Star 12,700개 이상의 커뮤니티',
        ],
        cons: [
          '셀프호스팅 시 인프라 운영 부담',
          '클라우드 유료 플랜 API 요청 제한',
          '한국어 지원 없음',
          '초기 설정 복잡도 높음',
        ],
      },
    },
    {
      name: 'Linkmap',
      url: 'https://www.linkmap.biz',
      tagline: '서비스 연결 시각화 + 환경변수 암호화 관리 플랫폼',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: ['프로젝트 3개', '환경변수 50개', '서비스맵 시각화'],
        },
        {
          name: 'Pro',
          price: '준비 중',
          highlights: ['무제한 프로젝트', '팀 협업', '고급 AI 기능'],
        },
      ],
      prosCons: {
        pros: [
          'AES-256-GCM 암호화',
          '서비스맵 시각화 — 연결 구조를 한눈에 파악',
          '128개 서비스 카탈로그 (한국어 가이드 포함)',
          '원클릭 배포 템플릿 6종',
          'GitHub Secrets 1클릭 자동화',
          '바이브코더/1인 개발자 친화적',
        ],
        cons: [
          '동적 시크릿, PKI 등 엔터프라이즈 기능 미지원',
          '셀프호스팅 불가',
          'CLI 미구현 (개발 예정)',
          '팀 기능 개발 중',
        ],
      },
    },
  ],
  featureMatrix: [
    {
      feature: '시크릿 암호화',
      values: { Doppler: 'AES-256', Infisical: 'AES-256', Linkmap: 'AES-256-GCM' },
    },
    {
      feature: '셀프호스팅',
      values: { Doppler: '불가', Infisical: '가능 (MIT)', Linkmap: '불가' },
    },
    {
      feature: 'GitHub Secrets 동기화',
      values: { Doppler: '지원', Infisical: '지원', Linkmap: '1클릭 자동화' },
    },
    {
      feature: 'Vercel 연동',
      values: { Doppler: '지원', Infisical: '지원', Linkmap: '지원' },
    },
    {
      feature: '서비스 연결 시각화',
      values: { Doppler: '없음', Infisical: '없음', Linkmap: '서비스맵 (React Flow)' },
    },
    {
      feature: '감사 로그',
      values: { Doppler: '지원', Infisical: '지원', Linkmap: '지원' },
    },
    {
      feature: '시크릿 로테이션',
      values: { Doppler: '지원', Infisical: '지원 (고급)', Linkmap: '미지원' },
    },
    {
      feature: 'PKI 인증서 관리',
      values: { Doppler: '미지원', Infisical: '지원', Linkmap: '미지원' },
    },
    {
      feature: '서비스 카탈로그',
      values: { Doppler: '없음', Infisical: '없음', Linkmap: '128개 (한국어)' },
    },
    {
      feature: '원클릭 배포 템플릿',
      values: { Doppler: '없음', Infisical: '없음', Linkmap: '6종' },
    },
    {
      feature: 'AI 어시스턴트',
      values: { Doppler: '없음', Infisical: '없음', Linkmap: '5가지 기능' },
    },
    {
      feature: '한국어 가이드',
      values: { Doppler: '없음', Infisical: '없음', Linkmap: '완비' },
    },
    {
      feature: 'CLI',
      values: { Doppler: '지원', Infisical: '지원', Linkmap: '개발 예정' },
    },
    {
      feature: '오픈소스',
      values: { Doppler: '아니오', Infisical: '예 (MIT)', Linkmap: '아니오' },
    },
  ],
  targetAudiences: [
    {
      label: '바이브코더 (코딩 경험 0)',
      fits: { Doppler: 'limited', Infisical: 'limited', Linkmap: 'best' },
    },
    {
      label: '인디 개발자 / 1인 창업자',
      fits: { Doppler: 'good', Infisical: 'good', Linkmap: 'best' },
    },
    {
      label: '소규모 팀 (2-10명)',
      fits: { Doppler: 'good', Infisical: 'best', Linkmap: 'good' },
    },
    {
      label: '엔터프라이즈 (50명+)',
      fits: { Doppler: 'best', Infisical: 'best', Linkmap: 'limited' },
    },
    {
      label: '규정 준수 필수 (셀프호스팅)',
      fits: { Doppler: 'none', Infisical: 'best', Linkmap: 'none' },
    },
  ],
  relatedPosts: [
    {
      slug: 'doppler-vs-infisical-vs-linkmap-comparison',
      title: 'Doppler vs Infisical vs Linkmap -- 환경변수 관리 도구 비교 2026',
      relevance: '3종 상세 비교 원문',
    },
    {
      slug: 'why-dotenv-is-dangerous',
      title: '환경변수 관리, .env 파일은 왜 위험한가',
      relevance: '.env 위험성 배경지식',
    },
    {
      slug: 'env-file-exposure-crisis',
      title: '1,200만 개의 .env 파일이 인터넷에 노출되어 있다',
      relevance: '환경변수 유출 통계 데이터',
    },
    {
      slug: 'vibe-coding-secret-leak-crisis',
      title: '바이브 코딩 시대, 2,380만 개의 시크릿이 유출되고 있다',
      relevance: '바이브코딩 시대 시크릿 유출 현황',
    },
    {
      slug: 'ai-agent-reads-your-env',
      title: 'AI 코딩 에이전트가 당신의 .env를 읽고 있다',
      relevance: 'AI 도구와 환경변수 보안',
    },
    {
      slug: 'github-secrets-automation',
      title: 'GitHub Secrets 자동화 -- 수동 설정은 이제 그만',
      relevance: 'GitHub Secrets 자동화 튜토리얼',
    },
    {
      slug: 'dotenv-safe-management-tips',
      title: '.env 파일 안전하게 관리하는 5가지 방법',
      relevance: '.env 보안 실전 팁',
    },
    {
      slug: 'api-key-leak-incident-response',
      title: 'API 키 유출 사고 대응 -- 개발자가 알아야 할 즉시 조치와 예방법',
      relevance: 'API 키 유출 사고 대응 가이드',
    },
  ],
  verdict:
    '엔터프라이즈 DevOps 팀이면 Doppler, 셀프호스팅과 고급 보안이 필요하면 Infisical, 인디 개발자/바이브코더로 서비스 연결을 시각화하며 한국어 가이드가 필요하면 Linkmap이 적합합니다.',
};

// ---------------------------------------------------------------------------
// 2. AI 코딩 도구: ChatGPT vs Claude Code vs Cursor vs Gemini vs GitHub Copilot vs Windsurf
// ---------------------------------------------------------------------------

export const AI_CODING_TOOLS_COMPARISON: ServiceComparison = {
  id: 'ai-coding-tools',
  title: 'AI 코딩 도구 비교',
  description:
    'ChatGPT, Claude Code, Cursor, Gemini Code Assist, GitHub Copilot, Windsurf 등 주요 AI 코딩 도구 6종의 기능, 가격, 보안을 객관적으로 비교합니다.',
  lastUpdated: '2026-03-19',
  services: [
    {
      name: 'Claude Code',
      url: 'https://claude.ai/code',
      tagline: '터미널 기반 AI 에이전트 -- 복잡한 코드베이스를 자율적으로 수정',
      pricing: [
        {
          name: 'Pro',
          price: '$20',
          period: '월',
          highlights: ['기본 사용량', 'Claude Sonnet 접근'],
        },
        {
          name: 'Max 5x',
          price: '$100',
          period: '월',
          highlights: ['Pro 대비 5배 사용량', 'Opus 4.6 접근', '1M 컨텍스트'],
        },
        {
          name: 'Max 20x',
          price: '$200',
          period: '월',
          highlights: ['Pro 대비 20배 사용량', '에이전트 팀', '우선 접근'],
        },
      ],
      prosCons: {
        pros: [
          'SWE-bench 1위 -- 코드 이해/수정 능력 최고',
          '프로젝트 전체를 컨텍스트로 파악',
          '여러 파일 동시 수정, 테스트, 커밋 자율 수행',
          '"가장 사랑받는 도구" 1위 (Pragmatic Engineer 46%)',
          '최대 200K (Max: 1M) 컨텍스트 창',
        ],
        cons: [
          'GUI 없음 (터미널 전용) -- 진입 장벽 높음',
          'CVE-2025-55284 (패치됨) -- .env 자동 로드 이력',
          '무료 플랜 없음 (Pro $20/월부터)',
          '바이브코더에게 어려울 수 있음',
        ],
      },
    },
    {
      name: 'ChatGPT',
      url: 'https://chatgpt.com',
      tagline: 'OpenAI의 대화형 AI — Canvas 코드 편집 + Code Interpreter',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: ['GPT-4o 제한 접근', 'GPT-4o mini 무제한', '기본 코드 생성'],
        },
        {
          name: 'Plus',
          price: '$20',
          period: '월',
          highlights: ['GPT-4o 확장', 'Canvas 코드 편집', 'Code Interpreter'],
        },
        {
          name: 'Pro',
          price: '$200',
          period: '월',
          highlights: ['o3 접근', '무제한 사용', '최고 성능 모델'],
        },
        {
          name: 'Team',
          price: '$25/사용자',
          period: '월',
          highlights: ['팀 공유 워크스페이스', '관리 콘솔', '데이터 미학습 보장'],
        },
      ],
      prosCons: {
        pros: [
          '가장 큰 사용자 기반 — 전 세계 2억+ MAU',
          'Canvas 모드로 코드 직접 편집·실행 가능',
          'Code Interpreter로 데이터 분석·시각화',
          '무료 플랜에서 GPT-4o 접근 가능',
          'GPTs/플러그인 생태계',
        ],
        cons: [
          'IDE 통합 없음 — 웹/앱 기반 대화만 지원',
          '프로젝트 파일 시스템 직접 접근 불가',
          '코드베이스 전체 컨텍스트 파악 어려움',
          '자동 커밋·테스트 등 에이전트 자동화 없음',
          'Canvas 코드 편집은 단일 파일 수준',
        ],
      },
    },
    {
      name: 'Cursor',
      url: 'https://cursor.com',
      tagline: 'VS Code 포크 AI IDE -- 코드베이스 전체 이해',
      pricing: [
        {
          name: 'Hobby (Free)',
          price: '$0',
          period: '월',
          highlights: ['제한된 Agent 요청', '제한된 Tab 완성'],
        },
        {
          name: 'Pro',
          price: '$20',
          period: '월',
          highlights: ['무제한 Tab 완성', '월간 크레딧 풀', 'Auto 모드 무제한'],
        },
        {
          name: 'Ultra',
          price: '$200',
          period: '월',
          highlights: ['대규모 코드베이스용', '최대 에이전트 용량'],
        },
        {
          name: 'Teams',
          price: '$40/사용자',
          period: '월',
          highlights: ['팀 공유 채팅/커맨드', '중앙 빌링', '관리 대시보드'],
        },
      ],
      prosCons: {
        pros: [
          'VS Code 기반 -- 기존 사용자 전환 비용 최저',
          'Tab 자동완성 + 채팅 + 에이전트 통합',
          '멀티모델 선택 가능',
          '코드베이스 전체 이해력 우수',
          '가장 큰 사용자 커뮤니티',
        ],
        cons: [
          'CVE-2025-54135 (패치됨) -- MCP 프롬프트 인젝션 이력',
          '.env 파일 자동 컨텍스트 포함 (.cursorignore 필요)',
          '학습 곡선 있음',
          '크레딧 시스템이 복잡할 수 있음',
        ],
      },
    },
    {
      name: 'GitHub Copilot',
      url: 'https://github.com/features/copilot',
      tagline: 'IDE 플러그인 기반 AI 코딩 어시스턴트',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: ['코드 완성 2,000회/월', '프리미엄 요청 50회/월'],
        },
        {
          name: 'Pro',
          price: '$10',
          period: '월',
          highlights: ['프리미엄 요청 300회/월', '모든 에디터 지원'],
        },
        {
          name: 'Pro+',
          price: '$39',
          period: '월',
          highlights: [
            '프리미엄 요청 1,500회/월',
            'Claude Opus 4, o3 접근',
            '고급 모델 선택',
          ],
        },
        {
          name: 'Business',
          price: '$19/사용자',
          period: '월',
          highlights: ['조직 관리', '정책 설정', '감사 로그'],
        },
        {
          name: 'Enterprise',
          price: '$39/사용자',
          period: '월',
          highlights: ['SAML SSO', '미세 조정', '지식 베이스'],
        },
      ],
      prosCons: {
        pros: [
          '무료 플랜 제공 (코드 완성 2,000회/월)',
          '가장 저렴한 유료 시작가 ($10/월)',
          'GitHub 생태계 깊은 통합',
          'VS Code, JetBrains 등 다양한 에디터 지원',
          '교사, 오픈소스 메인테이너 무료',
        ],
        cons: [
          '에이전트 모드 자율성이 상대적으로 낮음',
          'Pro+가 아니면 모델 선택 제한',
          '독립 IDE가 아닌 플러그인 형태',
          '.env 컨텍스트 범위가 열린 파일과 리포지토리에 한정',
        ],
      },
    },
    {
      name: 'Gemini Code Assist',
      url: 'https://cloud.google.com/gemini/docs/codeassist/overview',
      tagline: 'Google의 AI 코딩 어시스턴트 — IDE 플러그인 + Gemini 2.5',
      pricing: [
        {
          name: 'Free (개인)',
          price: '$0',
          period: '월',
          highlights: ['개인 개발자 무료', 'Gemini 2.5 Flash', 'IDE 플러그인'],
        },
        {
          name: 'Standard',
          price: '$19/사용자',
          period: '월',
          highlights: ['Gemini 2.5 Pro', '코드 커스터마이징', 'Google Cloud 통합'],
        },
        {
          name: 'Enterprise',
          price: '$45/사용자',
          period: '월',
          highlights: ['전체 코드베이스 인덱싱', 'Gemini 2.5 Pro 확장', '보안 정책'],
        },
      ],
      prosCons: {
        pros: [
          'Gemini 2.5 Pro — 100만 토큰 컨텍스트 창',
          'VS Code, JetBrains, Android Studio 플러그인 지원',
          '개인 개발자 무료',
          'Google Cloud 서비스 깊은 통합',
          '코드 변환, 테스트 생성, 문서화 자동화',
        ],
        cons: [
          'Google Cloud 생태계 외 통합 제한적',
          '에이전트 모드 자율성이 Claude Code·Cursor 대비 발전 중',
          'IDE 플러그인 안정성 개선 중',
          '커뮤니티 규모가 Copilot·Cursor 대비 성장 중',
          'Android Studio 외 모바일 개발 지원 제한',
        ],
      },
    },
    {
      name: 'Windsurf',
      url: 'https://windsurf.com',
      tagline: '엔터프라이즈 보안 특화 AI IDE',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: ['프롬프트 크레딧 25회/월', '무제한 Tab 완성', '무제한 인라인 수정'],
        },
        {
          name: 'Pro',
          price: '$15',
          period: '월',
          highlights: ['프롬프트 크레딧 500회/월', '모든 프리미엄 모델', '학생 50% 할인'],
        },
        {
          name: 'Teams',
          price: '$30/사용자',
          period: '월',
          highlights: ['사용자당 500 크레딧', '관리 대시보드', '200명까지'],
        },
        {
          name: 'Enterprise',
          price: '$60/사용자',
          period: '월',
          highlights: ['사용자당 1,000 크레딧', 'SOC 2', 'SSO', '데이터 레지던시'],
        },
      ],
      prosCons: {
        pros: [
          '가장 저렴한 유료 IDE ($15/월)',
          'SOC 2 준수, SSO, 데이터 레지던시',
          '학생 50% 할인',
          'Cascade 에이전트 경험',
          '무료 플랜에도 무제한 Tab/인라인 수정',
        ],
        cons: [
          '커뮤니티 규모가 Cursor 대비 작음',
          '.env 처리 방식은 다른 IDE와 기본 동일',
          '프롬프트 크레딧 제한이 빡빡할 수 있음',
          '엔터프라이즈 가격이 상대적으로 높음',
        ],
      },
    },
  ],
  featureMatrix: [
    {
      feature: '형태',
      values: {
        ChatGPT: '웹 챗봇 + Canvas',
        'Claude Code': 'CLI 에이전트',
        Cursor: 'IDE (VS Code 포크)',
        'Gemini Code Assist': 'IDE 플러그인',
        'GitHub Copilot': 'IDE 플러그인',
        Windsurf: 'IDE',
      },
    },
    {
      feature: '무료 플랜',
      values: {
        ChatGPT: 'GPT-4o 제한 + 4o mini',
        'Claude Code': '없음',
        Cursor: '제한적 (Hobby)',
        'Gemini Code Assist': '개인 무료',
        'GitHub Copilot': '2,000 완성 + 50 요청/월',
        Windsurf: '25 크레딧/월',
      },
    },
    {
      feature: '유료 시작가',
      values: {
        ChatGPT: '$20/월 (Plus)',
        'Claude Code': '$20/월',
        Cursor: '$20/월',
        'Gemini Code Assist': '$19/사용자/월',
        'GitHub Copilot': '$10/월',
        Windsurf: '$15/월',
      },
    },
    {
      feature: 'SWE-bench 순위',
      values: {
        ChatGPT: '--',
        'Claude Code': '1위',
        Cursor: '--',
        'Gemini Code Assist': '--',
        'GitHub Copilot': '--',
        Windsurf: '--',
      },
    },
    {
      feature: '"가장 사랑받는" 비율',
      values: {
        ChatGPT: '--',
        'Claude Code': '46%',
        Cursor: '19%',
        'Gemini Code Assist': '--',
        'GitHub Copilot': '9%',
        Windsurf: '--',
      },
      note: 'Pragmatic Engineer 서베이 (906명)',
    },
    {
      feature: '컨텍스트 창',
      values: {
        ChatGPT: '128K (GPT-4o)',
        'Claude Code': '최대 200K (Max: 1M)',
        Cursor: '프로젝트 전체',
        'Gemini Code Assist': '최대 100만 토큰',
        'GitHub Copilot': '리포지토리',
        Windsurf: '프로젝트 전체',
      },
    },
    {
      feature: '에이전트 모드',
      values: {
        ChatGPT: '제한적 (Canvas)',
        'Claude Code': '기본 (자율 수행)',
        Cursor: '지원',
        'Gemini Code Assist': '지원 (발전 중)',
        'GitHub Copilot': '지원',
        Windsurf: '지원 (Cascade)',
      },
    },
    {
      feature: '멀티모델 선택',
      values: {
        ChatGPT: 'OpenAI 전용',
        'Claude Code': 'Claude 전용',
        Cursor: '지원',
        'Gemini Code Assist': 'Gemini 전용',
        'GitHub Copilot': 'Pro+ 이상',
        Windsurf: '지원',
      },
    },
    {
      feature: '.env 보안',
      values: {
        ChatGPT: '파일 접근 없음 (웹 기반)',
        'Claude Code': '자동 로드 (deny 설정 필요)',
        Cursor: '자동 포함 (.cursorignore 필요)',
        'Gemini Code Assist': 'IDE 기본 동일',
        'GitHub Copilot': '열린 파일/리포 한정',
        Windsurf: 'IDE 기본 동일',
      },
    },
    {
      feature: 'CVE 이력',
      values: {
        ChatGPT: '해당 없음',
        'Claude Code': 'CVE-2025-55284 (패치됨)',
        Cursor: 'CVE-2025-54135 (패치됨)',
        'Gemini Code Assist': '해당 없음',
        'GitHub Copilot': '해당 없음',
        Windsurf: '해당 없음',
      },
    },
    {
      feature: 'SOC 2 준수',
      values: {
        ChatGPT: 'Enterprise',
        'Claude Code': '해당 없음',
        Cursor: '해당 없음',
        'Gemini Code Assist': 'Enterprise',
        'GitHub Copilot': 'Enterprise',
        Windsurf: 'Enterprise',
      },
    },
  ],
  targetAudiences: [
    {
      label: '바이브코더 (코딩 경험 0)',
      fits: {
        ChatGPT: 'best',
        'Claude Code': 'limited',
        Cursor: 'good',
        'Gemini Code Assist': 'good',
        'GitHub Copilot': 'good',
        Windsurf: 'good',
      },
    },
    {
      label: '개발자 (코딩 경험 있음)',
      fits: {
        ChatGPT: 'limited',
        'Claude Code': 'best',
        Cursor: 'best',
        'Gemini Code Assist': 'good',
        'GitHub Copilot': 'good',
        Windsurf: 'good',
      },
    },
    {
      label: '대규모 코드베이스 작업',
      fits: {
        ChatGPT: 'none',
        'Claude Code': 'best',
        Cursor: 'good',
        'Gemini Code Assist': 'good',
        'GitHub Copilot': 'limited',
        Windsurf: 'good',
      },
    },
    {
      label: '보안 중시 기업',
      fits: {
        ChatGPT: 'good',
        'Claude Code': 'limited',
        Cursor: 'good',
        'Gemini Code Assist': 'best',
        'GitHub Copilot': 'best',
        Windsurf: 'best',
      },
    },
    {
      label: '비용 민감 (무료 우선)',
      fits: {
        ChatGPT: 'good',
        'Claude Code': 'none',
        Cursor: 'limited',
        'Gemini Code Assist': 'best',
        'GitHub Copilot': 'best',
        Windsurf: 'good',
      },
    },
  ],
  relatedPosts: [
    {
      slug: 'ai-coding-tools-security-comparison',
      title: '2026 AI 코딩 도구 비교 -- 보안과 환경변수 관점에서',
      relevance: '보안 관점 상세 비교',
    },
    {
      slug: 'vibe-coding-tools-comparison-2026',
      title: '2026 바이브코딩 도구 완벽 비교 -- 목적별 추천 가이드',
      relevance: '풀스택 빌더 포함 도구 비교',
    },
    {
      slug: 'ai-agent-reads-your-env',
      title: 'AI 코딩 에이전트가 당신의 .env를 읽고 있다',
      relevance: 'AI 도구 .env 보안 심층 분석',
    },
    {
      slug: 'ai-code-security-reality',
      title: 'AI가 만든 코드의 45%는 보안 결함이 있다',
      relevance: 'AI 생성 코드 보안 통계',
    },
    {
      slug: 'vibe-coding-prompt-writing-guide',
      title: 'AI에게 잘 시키는 법 -- 바이브코딩 프롬프트 작성 가이드',
      relevance: 'AI 도구 활용 프롬프트 가이드',
    },
    {
      slug: 'linkmap-dev-story-3-community-and-next',
      title: 'ERP 담당자의 Linkmap 개발기 3 -- Cursor에서 Claude Code로 전환',
      relevance: 'Cursor vs Claude Code 실사용 경험',
    },
  ],
  verdict:
    '대화형 코드 생성과 입문은 ChatGPT, 대규모 코드베이스 이해·수정은 Claude Code, VS Code 사용자 전환은 Cursor, Google Cloud 생태계와 무료 IDE 플러그인은 Gemini Code Assist, 넓은 에디터 지원과 무료 플랜은 GitHub Copilot, 엔터프라이즈 보안은 Windsurf. 대부분의 개발자는 2-3개를 조합해 사용합니다.',
};

// ---------------------------------------------------------------------------
// 3. 배포 플랫폼: Vercel vs Cloudflare Workers vs Netlify
// ---------------------------------------------------------------------------

export const DEPLOY_PLATFORMS_COMPARISON: ServiceComparison = {
  id: 'deploy-platforms',
  title: '배포 플랫폼 비교',
  description:
    'Vercel, Cloudflare Workers/Pages, Netlify의 무료 플랜, 성능, 프레임워크 지원을 비교합니다.',
  lastUpdated: '2026-03-19',
  services: [
    {
      name: 'Vercel',
      url: 'https://vercel.com',
      tagline: 'Next.js 공식 배포 플랫폼 -- 프론트엔드 최적화',
      pricing: [
        {
          name: 'Hobby (Free)',
          price: '$0',
          period: '월',
          highlights: [
            '대역폭 100GB/월',
            'Serverless 함수 100만 호출',
            'CPU 4시간/월',
            '비상업적 사용만',
          ],
        },
        {
          name: 'Pro',
          price: '$20/사용자',
          period: '월',
          highlights: ['대역폭 1TB', '상업적 사용 가능', '프리뷰 배포'],
        },
        {
          name: 'Enterprise',
          price: '문의',
          highlights: ['SLA', '전담 지원', 'SSO'],
        },
      ],
      prosCons: {
        pros: [
          'Next.js 제작팀 운영 -- App Router/API 라우트 완전 지원',
          'GitHub PR별 프리뷰 URL 자동 생성',
          '직관적인 대시보드 UI',
          '환경변수 관리 내장',
          '가장 큰 프론트엔드 배포 생태계',
        ],
        cons: [
          'Hobby 플랜은 비상업적 사용만 허용',
          '대역폭 100GB 초과 시 배포 차단',
          'Pro 플랜 가격이 사용자 수 기반 ($20/사용자)',
          'Edge Functions 런타임 제한',
        ],
      },
    },
    {
      name: 'Cloudflare Workers/Pages',
      url: 'https://workers.cloudflare.com',
      tagline: '무제한 대역폭의 엣지 컴퓨팅 플랫폼',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: [
            '대역폭 무제한',
            'Workers 요청 10만/일',
            'CPU 10ms/요청',
            '빌드 500회/월',
          ],
        },
        {
          name: 'Paid',
          price: '$5',
          period: '월',
          highlights: [
            '대역폭 무제한',
            'Workers 요청 무제한',
            'CPU 50ms/요청',
            'Durable Objects',
          ],
        },
        {
          name: 'Enterprise',
          price: '문의',
          highlights: ['SLA', '전담 지원', '커스텀 제한'],
        },
      ],
      prosCons: {
        pros: [
          '대역폭 무제한 (무료 포함)',
          '330개+ 엣지 데이터센터 -- 글로벌 최저 지연',
          '유료 시작가 $5/월 (업계 최저)',
          'R2, KV, D1 등 통합 인프라',
          'Linkmap이 실제 사용하는 배포 플랫폼',
        ],
        cons: [
          'Workers 런타임은 Node.js와 다름 (fs, path 일부 제한)',
          '무료 CPU 10ms 제한이 빡빡할 수 있음',
          'Next.js 지원은 @opennextjs/cloudflare 필요',
          'Vercel 대비 초기 설정 복잡',
        ],
      },
    },
    {
      name: 'Netlify',
      url: 'https://netlify.com',
      tagline: '정적 사이트 배포의 원조 -- Bolt.new 연동',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: [
            '월 300 크레딧 (신규 계정)',
            '배포당 15 크레딧',
            '대역폭 GB당 10 크레딧',
            '한도 초과 시 사이트 일시 중지',
          ],
        },
        {
          name: 'Pro',
          price: '$19',
          period: '월',
          highlights: ['크레딧 대폭 증가', '상업적 사용', '폼 처리'],
        },
        {
          name: 'Enterprise',
          price: '문의',
          highlights: ['SLA', 'SSO', '전담 지원'],
        },
      ],
      prosCons: {
        pros: [
          'Bolt.new 원클릭 배포 연동',
          '정적 사이트에 오랜 신뢰',
          'Netlify Forms 내장 (서버리스 폼 처리)',
          'Edge Functions 지원',
        ],
        cons: [
          '2025년 크레딧 기반 과금 전환 -- 복잡해짐',
          '무료 크레딧 소진 시 사이트 일시 중지',
          'Next.js App Router 지원이 Vercel 대비 느림',
          '서버리스 함수 실행 시간 제한',
        ],
      },
    },
  ],
  featureMatrix: [
    {
      feature: '무료 대역폭',
      values: { Vercel: '100GB/월', 'Cloudflare Workers/Pages': '무제한', Netlify: '크레딧 기반 (~30GB)' },
    },
    {
      feature: '유료 시작가',
      values: { Vercel: '$20/사용자/월', 'Cloudflare Workers/Pages': '$5/월', Netlify: '$19/월' },
    },
    {
      feature: 'Next.js 지원',
      values: { Vercel: '최고 (공식)', 'Cloudflare Workers/Pages': '@opennextjs 필요', Netlify: '지원 (약간 지연)' },
    },
    {
      feature: 'GitHub PR 프리뷰',
      values: { Vercel: '자동', 'Cloudflare Workers/Pages': '지원', Netlify: '지원' },
    },
    {
      feature: '환경변수 관리',
      values: { Vercel: '대시보드 내장', 'Cloudflare Workers/Pages': 'Wrangler CLI', Netlify: '대시보드 내장' },
    },
    {
      feature: '엣지 데이터센터',
      values: { Vercel: '글로벌', 'Cloudflare Workers/Pages': '330개+', Netlify: '글로벌' },
    },
    {
      feature: '비상업적 제한',
      values: { Vercel: 'Hobby는 비상업만', 'Cloudflare Workers/Pages': '제한 없음', Netlify: '제한 없음' },
    },
    {
      feature: '빌드 시간',
      values: { Vercel: '6,000분/월', 'Cloudflare Workers/Pages': '500회/월', Netlify: '크레딧 기반' },
    },
    {
      feature: 'Serverless/Edge Functions',
      values: { Vercel: '지원', 'Cloudflare Workers/Pages': 'Workers (V8)', Netlify: '지원' },
    },
    {
      feature: 'Bolt.new 연동',
      values: { Vercel: '--', 'Cloudflare Workers/Pages': '--', Netlify: '원클릭' },
    },
  ],
  targetAudiences: [
    {
      label: '바이브코더 (첫 배포)',
      fits: { Vercel: 'best', 'Cloudflare Workers/Pages': 'good', Netlify: 'good' },
    },
    {
      label: 'Next.js 풀스택 프로젝트',
      fits: { Vercel: 'best', 'Cloudflare Workers/Pages': 'good', Netlify: 'good' },
    },
    {
      label: '트래픽이 많은 사이트',
      fits: { Vercel: 'limited', 'Cloudflare Workers/Pages': 'best', Netlify: 'limited' },
    },
    {
      label: 'Bolt.new 사용자',
      fits: { Vercel: 'limited', 'Cloudflare Workers/Pages': 'limited', Netlify: 'best' },
    },
    {
      label: '비용 최적화',
      fits: { Vercel: 'limited', 'Cloudflare Workers/Pages': 'best', Netlify: 'good' },
    },
  ],
  relatedPosts: [
    {
      slug: 'vibe-coding-deploy-guide',
      title: '바이브코딩 프로젝트 배포 완전 정복 -- Vercel, Cloudflare, Netlify',
      relevance: '3대 플랫폼 배포 튜토리얼',
    },
    {
      slug: 'vibe-coding-launch-checklist',
      title: '바이브코딩으로 만든 앱, 실제 사용자에게 공개하기 전 체크리스트',
      relevance: '배포 전 점검 체크리스트',
    },
    {
      slug: 'vibe-coding-portfolio-site-30min',
      title: '바이브코딩으로 포트폴리오 사이트 만들기 -- 30분 완성',
      relevance: '배포 실전 (Vercel 활용)',
    },
    {
      slug: 'linkmap-dev-story-1-infra-battle',
      title: 'ERP 담당자의 Linkmap 개발기 1 -- 코드는 안 바꿨는데 서비스가 안 된다',
      relevance: '배포 환경 환경변수 문제 실사례',
    },
  ],
  verdict:
    'Next.js 프로젝트면 Vercel, 트래픽 많고 비용 최적화가 중요하면 Cloudflare, Bolt.new으로 만든 프로젝트면 Netlify. Linkmap은 Cloudflare Workers로 배포하여 무제한 대역폭과 글로벌 엣지를 활용합니다.',
};

// ---------------------------------------------------------------------------
// 4. BaaS: Supabase vs Firebase vs PlanetScale
// ---------------------------------------------------------------------------

export const BAAS_COMPARISON: ServiceComparison = {
  id: 'baas-platforms',
  title: 'BaaS(Backend as a Service) 비교',
  description:
    'Supabase, Firebase, PlanetScale의 기능, 가격, 바이브코더 친화도를 비교합니다.',
  lastUpdated: '2026-03-19',
  services: [
    {
      name: 'Supabase',
      url: 'https://supabase.com',
      tagline: '오픈소스 Firebase 대안 -- PostgreSQL 기반 풀스택 BaaS',
      pricing: [
        {
          name: 'Free',
          price: '$0',
          period: '월',
          highlights: [
            '프로젝트 2개',
            'DB 500MB',
            '스토리지 1GB',
            'MAU 50,000',
            '7일 미활동 시 일시중지',
          ],
        },
        {
          name: 'Pro',
          price: '$25',
          period: '월',
          highlights: ['DB 8GB', '스토리지 100GB', '일시중지 없음', '일일 백업'],
        },
        {
          name: 'Team',
          price: '$599',
          period: '월',
          highlights: ['SOC 2', 'SSO/SAML', 'SLA', '우선 지원'],
        },
      ],
      prosCons: {
        pros: [
          'PostgreSQL 기반 -- 표준 SQL, 강력한 RLS',
          '오픈소스 (Apache 2.0)',
          'DB + Auth + Storage + Realtime + Edge Functions 올인원',
          'MCP 서버 지원 -- AI 도구와 직접 연동',
          '대시보드 Table Editor로 코드 없이 DB 관리',
          'Linkmap이 실제 사용하는 BaaS',
        ],
        cons: [
          '무료 플랜 7일 미활동 시 일시중지',
          'Pro 플랜 $25/월 -- Firebase 대비 고정 비용 높음',
          'Edge Functions 생태계가 Firebase Functions 대비 작음',
          '한국 리전 없음',
        ],
      },
    },
    {
      name: 'Firebase',
      url: 'https://firebase.google.com',
      tagline: 'Google의 모바일/웹 앱 개발 플랫폼',
      pricing: [
        {
          name: 'Spark (Free)',
          price: '$0',
          period: '월',
          highlights: [
            'Firestore: 1GB 저장, 5만 읽기/일',
            'Realtime DB: 1GB 저장',
            'Cloud Functions: 200만 호출/월',
            'Storage: 1GB 저장',
          ],
        },
        {
          name: 'Blaze (종량제)',
          price: '사용량 기반',
          period: '월',
          highlights: [
            'Spark 한도 이후 과금',
            '확장에 따라 비용 증가',
            '모든 기능 접근',
          ],
        },
      ],
      prosCons: {
        pros: [
          'Google 인프라 -- 안정성, 글로벌 스케일',
          'Firestore + Auth + Hosting + Functions + Analytics 올인원',
          '모바일 SDK 최강 (iOS, Android, Flutter)',
          'Crashlytics, Remote Config 등 앱 운영 도구 포함',
          '풍부한 문서와 커뮤니티',
        ],
        cons: [
          'NoSQL(Firestore) -- 복잡한 쿼리 제한',
          'Blaze 플랜 비용 예측 어려움 (종량제)',
          '프로프라이어터리 -- 벤더 종속',
          'RLS 같은 세밀한 보안 정책 설정이 복잡',
          'Spark 한도 초과 시 앱 차단',
        ],
      },
    },
    {
      name: 'PlanetScale',
      url: 'https://planetscale.com',
      tagline: 'Vitess 기반 서버리스 MySQL + 신규 Postgres 지원',
      pricing: [
        {
          name: 'Developer (Free)',
          price: '$0',
          period: '월',
          highlights: ['10GB 저장', '1,000만 쓰기', '10억 읽기'],
        },
        {
          name: '$5 단일 노드',
          price: '$5',
          period: '월',
          highlights: ['개발/저트래픽 워크로드', '단일 노드'],
        },
        {
          name: 'Scaler',
          price: '$29',
          period: '월',
          highlights: ['25GB 저장', '5,000만 쓰기', '1,000억 읽기', '브랜칭'],
        },
        {
          name: 'Enterprise',
          price: '문의',
          highlights: ['전용 AWS/GCP 계정', 'SLA', '전담 지원'],
        },
      ],
      prosCons: {
        pros: [
          'DB 브랜칭 -- Git처럼 스키마 변경 관리',
          '자동 스케일링 (Vitess)',
          'Query Insights -- 느린 쿼리 분석',
          '무료 플랜 넉넉 (10GB, 10억 읽기)',
          'MySQL + Postgres 지원',
        ],
        cons: [
          '데이터베이스 전용 -- Auth, Storage 없음',
          '풀스택 BaaS가 아님 (직접 구성 필요)',
          '이전에 무료 플랜 삭제 후 재도입 -- 신뢰 이슈',
          '한국 리전 없음',
          'Firebase/Supabase 대비 올인원 기능 부족',
        ],
      },
    },
  ],
  featureMatrix: [
    {
      feature: '데이터베이스 종류',
      values: { Supabase: 'PostgreSQL', Firebase: 'Firestore (NoSQL)', PlanetScale: 'MySQL + Postgres' },
    },
    {
      feature: '인증 (Auth)',
      values: { Supabase: '내장 (OAuth, 이메일)', Firebase: '내장 (최다 프로바이더)', PlanetScale: '없음' },
    },
    {
      feature: '파일 저장 (Storage)',
      values: { Supabase: '내장', Firebase: '내장 (Cloud Storage)', PlanetScale: '없음' },
    },
    {
      feature: '실시간 (Realtime)',
      values: { Supabase: '내장 (PostgreSQL Changes)', Firebase: '내장 (Firestore)', PlanetScale: '없음' },
    },
    {
      feature: 'Serverless Functions',
      values: { Supabase: 'Edge Functions (Deno)', Firebase: 'Cloud Functions (Node)', PlanetScale: '없음' },
    },
    {
      feature: 'RLS (행 수준 보안)',
      values: { Supabase: '내장 (PostgreSQL)', Firebase: 'Firestore Rules', PlanetScale: '없음' },
    },
    {
      feature: 'DB 브랜칭',
      values: { Supabase: '지원 (Preview)', Firebase: '없음', PlanetScale: '핵심 기능' },
    },
    {
      feature: '오픈소스',
      values: { Supabase: '예 (Apache 2.0)', Firebase: '아니오', PlanetScale: '아니오 (Vitess는 오픈소스)' },
    },
    {
      feature: '대시보드 GUI',
      values: { Supabase: 'Table Editor', Firebase: 'Console', PlanetScale: 'Query Console' },
    },
    {
      feature: 'MCP 서버',
      values: { Supabase: '지원', Firebase: '제한적', PlanetScale: '없음' },
    },
    {
      feature: '무료 DB 저장소',
      values: { Supabase: '500MB', Firebase: '1GB (Firestore)', PlanetScale: '10GB' },
    },
    {
      feature: '미활동 시 일시중지',
      values: { Supabase: '7일 후 일시중지', Firebase: '한도 초과 시 차단', PlanetScale: '없음' },
    },
  ],
  targetAudiences: [
    {
      label: '바이브코더 (첫 백엔드)',
      fits: { Supabase: 'best', Firebase: 'good', PlanetScale: 'limited' },
    },
    {
      label: '웹 풀스택 개발자',
      fits: { Supabase: 'best', Firebase: 'good', PlanetScale: 'good' },
    },
    {
      label: '모바일 앱 개발자',
      fits: { Supabase: 'good', Firebase: 'best', PlanetScale: 'limited' },
    },
    {
      label: '데이터베이스 전문가',
      fits: { Supabase: 'good', Firebase: 'limited', PlanetScale: 'best' },
    },
    {
      label: 'SQL 선호',
      fits: { Supabase: 'best', Firebase: 'none', PlanetScale: 'best' },
    },
  ],
  relatedPosts: [
    {
      slug: 'supabase-for-vibe-coders',
      title: 'Supabase로 백엔드 없이 앱 만들기 -- 바이브코더의 데이터베이스',
      relevance: 'Supabase 입문 튜토리얼',
    },
    {
      slug: 'supabase-rls-vibe-coding-risk',
      title: 'Supabase RLS 미설정 -- 바이브 코딩의 가장 위험한 실수',
      relevance: 'Supabase RLS 보안 경고',
    },
    {
      slug: 'vibe-coding-security-checklist',
      title: '바이브 코딩 보안 체크리스트 -- 프로덕션 배포 전 반드시 확인할 15가지',
      relevance: 'DB 보안 포함 체크리스트',
    },
    {
      slug: 'vibe-coding-launch-checklist',
      title: '바이브코딩으로 만든 앱, 실제 사용자에게 공개하기 전 체크리스트',
      relevance: '런칭 전 DB/인증 점검',
    },
  ],
  verdict:
    '웹 풀스택 + SQL + 보안(RLS)이 중요하면 Supabase, 모바일 앱 + Google 생태계면 Firebase, DB 전문성 + 대규모 스케일링이면 PlanetScale. Linkmap은 Supabase를 기반으로 RLS + AES-256-GCM 이중 보안을 구현합니다.',
};

// ---------------------------------------------------------------------------
// 5. 바이브코딩 도구 생태계: 전체 도구 맵
// ---------------------------------------------------------------------------

/** 바이브코딩 생태계 도구 카테고리 */
export type VibeToolCategory =
  | 'ai-code-editor'
  | 'fullstack-builder'
  | 'deploy-platform'
  | 'baas'
  | 'env-management'
  | 'design-to-code'
  | 'version-control'
  | 'payment'
  | 'analytics'
  | 'community';

export interface VibeTool {
  name: string;
  url: string;
  category: VibeToolCategory;
  tagline: string;
  freeTier: string;
  paidFrom: string;
  bestFor: string;
  linkmapIntegration: 'deep' | 'catalog' | 'guide' | 'none';
}

export interface VibeToolCategoryInfo {
  id: VibeToolCategory;
  label: string;
  description: string;
}

export const VIBE_TOOL_CATEGORIES: VibeToolCategoryInfo[] = [
  {
    id: 'ai-code-editor',
    label: 'AI 코드 에디터',
    description: '코드를 직접 편집하는 AI 도구. 기존 프로젝트에 AI를 붙여 쓰는 방식.',
  },
  {
    id: 'fullstack-builder',
    label: '풀스택 앱 빌더',
    description: '자연어만으로 완성된 앱을 생성하는 도구. 코딩 경험 없이도 사용 가능.',
  },
  {
    id: 'deploy-platform',
    label: '배포 플랫폼',
    description: '코드를 인터넷에 공개하는 호스팅/배포 서비스.',
  },
  {
    id: 'baas',
    label: 'BaaS (Backend as a Service)',
    description: '데이터베이스, 인증, 파일 저장을 제공하는 백엔드 플랫폼.',
  },
  {
    id: 'env-management',
    label: '환경변수/시크릿 관리',
    description: 'API 키와 시크릿을 암호화 저장하고 안전하게 배포 환경에 동기화.',
  },
  {
    id: 'design-to-code',
    label: '디자인 to 코드',
    description: '디자인 시안이나 와이어프레임에서 코드를 생성하는 도구.',
  },
  {
    id: 'version-control',
    label: '버전 관리',
    description: '코드 변경 이력 관리와 협업을 위한 플랫폼.',
  },
  {
    id: 'payment',
    label: '결제',
    description: '온라인 결제 기능을 앱에 추가하는 서비스.',
  },
  {
    id: 'analytics',
    label: '분석/모니터링',
    description: '사용자 행동 분석, 에러 모니터링, 성능 측정.',
  },
  {
    id: 'community',
    label: '커뮤니티/학습',
    description: '바이브코딩 학습 자료와 커뮤니티.',
  },
];

export const VIBE_CODING_TOOLS: VibeTool[] = [
  // --- AI 코드 에디터 ---
  {
    name: 'Claude Code',
    url: 'https://claude.ai/code',
    category: 'ai-code-editor',
    tagline: '터미널 기반 AI 에이전트, SWE-bench 1위',
    freeTier: '없음',
    paidFrom: '$20/월 (Pro)',
    bestFor: '대규모 코드베이스, 복잡한 리팩토링',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'Cursor',
    url: 'https://cursor.com',
    category: 'ai-code-editor',
    tagline: 'VS Code 포크 AI IDE',
    freeTier: 'Hobby (제한적)',
    paidFrom: '$20/월',
    bestFor: 'VS Code 사용자, 일반 개발',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    category: 'ai-code-editor',
    tagline: 'IDE 플러그인 AI 코딩 어시스턴트',
    freeTier: '2,000 완성 + 50 요청/월',
    paidFrom: '$10/월',
    bestFor: '다양한 에디터, 비용 민감',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'Windsurf',
    url: 'https://windsurf.com',
    category: 'ai-code-editor',
    tagline: '엔터프라이즈 보안 특화 AI IDE',
    freeTier: '25 크레딧/월',
    paidFrom: '$15/월',
    bestFor: '보안 중시 기업, 학생',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    category: 'ai-code-editor',
    tagline: 'OpenAI 대화형 AI — Canvas 코드 편집',
    freeTier: 'GPT-4o 제한 + 4o mini',
    paidFrom: '$20/월 (Plus)',
    bestFor: '입문자, 대화형 코드 생성',
    linkmapIntegration: 'none',
  },
  {
    name: 'Gemini Code Assist',
    url: 'https://cloud.google.com/gemini/docs/codeassist/overview',
    category: 'ai-code-editor',
    tagline: 'Google AI 코딩 어시스턴트 — Gemini 2.5',
    freeTier: '개인 무료',
    paidFrom: '$19/사용자/월',
    bestFor: 'Google Cloud 사용자, 무료 IDE 플러그인',
    linkmapIntegration: 'none',
  },
  // --- 풀스택 앱 빌더 ---
  {
    name: 'Lovable',
    url: 'https://lovable.dev',
    category: 'fullstack-builder',
    tagline: '자연어로 풀스택 앱 생성 (프론트+백+DB+인증)',
    freeTier: '제한적',
    paidFrom: '$20/월',
    bestFor: '비개발자 첫 프로젝트',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'Bolt.new',
    url: 'https://bolt.new',
    category: 'fullstack-builder',
    tagline: '넉넉한 무료 티어의 웹 앱 빌더',
    freeTier: '월 100만 토큰',
    paidFrom: '$20/월',
    bestFor: '무료로 시작하는 입문자',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'v0',
    url: 'https://v0.dev',
    category: 'fullstack-builder',
    tagline: 'Vercel의 React/Next.js UI 컴포넌트 생성기',
    freeTier: '제한적',
    paidFrom: '$20/월',
    bestFor: 'UI/디자인 중심 프로젝트',
    linkmapIntegration: 'catalog',
  },
  // --- 배포 플랫폼 ---
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    category: 'deploy-platform',
    tagline: 'Next.js 공식 배포 플랫폼',
    freeTier: '100GB 대역폭/월 (비상업)',
    paidFrom: '$20/사용자/월',
    bestFor: 'Next.js 프로젝트, 첫 배포',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'Cloudflare Workers/Pages',
    url: 'https://workers.cloudflare.com',
    category: 'deploy-platform',
    tagline: '무제한 대역폭의 엣지 플랫폼',
    freeTier: '대역폭 무제한, 요청 10만/일',
    paidFrom: '$5/월',
    bestFor: '트래픽 많은 사이트, 비용 최적화',
    linkmapIntegration: 'deep',
  },
  {
    name: 'Netlify',
    url: 'https://netlify.com',
    category: 'deploy-platform',
    tagline: '정적 사이트 배포 + Bolt.new 연동',
    freeTier: '300 크레딧/월',
    paidFrom: '$19/월',
    bestFor: 'Bolt.new 프로젝트, 정적 사이트',
    linkmapIntegration: 'catalog',
  },
  // --- BaaS ---
  {
    name: 'Supabase',
    url: 'https://supabase.com',
    category: 'baas',
    tagline: '오픈소스 PostgreSQL BaaS',
    freeTier: '프로젝트 2개, DB 500MB, MAU 5만',
    paidFrom: '$25/월',
    bestFor: '웹 풀스택, SQL, RLS 보안',
    linkmapIntegration: 'deep',
  },
  {
    name: 'Firebase',
    url: 'https://firebase.google.com',
    category: 'baas',
    tagline: 'Google의 모바일/웹 앱 BaaS',
    freeTier: 'Firestore 1GB, Functions 200만 호출/월',
    paidFrom: '사용량 기반 (Blaze)',
    bestFor: '모바일 앱, Google 생태계',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'PlanetScale',
    url: 'https://planetscale.com',
    category: 'baas',
    tagline: 'Vitess 기반 서버리스 MySQL + Postgres',
    freeTier: '10GB, 10억 읽기/월',
    paidFrom: '$5/월',
    bestFor: '대규모 DB, 브랜칭',
    linkmapIntegration: 'catalog',
  },
  // --- 환경변수/시크릿 관리 ---
  {
    name: 'Linkmap',
    url: 'https://www.linkmap.biz',
    category: 'env-management',
    tagline: '서비스 연결 시각화 + 환경변수 암호화 관리',
    freeTier: '프로젝트 3개, 환경변수 50개',
    paidFrom: '준비 중',
    bestFor: '인디 개발자, 바이브코더, 시각화',
    linkmapIntegration: 'deep',
  },
  {
    name: 'Doppler',
    url: 'https://www.doppler.com',
    category: 'env-management',
    tagline: '엔터프라이즈 시크릿 관리 SaaS',
    freeTier: '3명 이하 무료',
    paidFrom: '$21/사용자/월',
    bestFor: '엔터프라이즈, DevOps 팀',
    linkmapIntegration: 'none',
  },
  {
    name: 'Infisical',
    url: 'https://infisical.com',
    category: 'env-management',
    tagline: '오픈소스 시크릿 관리 (셀프호스팅 가능)',
    freeTier: '무료 영구',
    paidFrom: '$9/사용자/월',
    bestFor: '셀프호스팅, 규정 준수',
    linkmapIntegration: 'none',
  },
  // --- 디자인 to 코드 ---
  {
    name: 'Figma',
    url: 'https://figma.com',
    category: 'design-to-code',
    tagline: '협업 디자인 툴 + Dev Mode',
    freeTier: '개인 무료',
    paidFrom: '$15/에디터/월',
    bestFor: '디자인 시안, 팀 협업',
    linkmapIntegration: 'catalog',
  },
  // --- 버전 관리 ---
  {
    name: 'GitHub',
    url: 'https://github.com',
    category: 'version-control',
    tagline: '세계 최대 코드 호스팅 플랫폼',
    freeTier: '무제한 공개 저장소',
    paidFrom: '$4/월 (Pro)',
    bestFor: '모든 개발자',
    linkmapIntegration: 'deep',
  },
  // --- 결제 ---
  {
    name: 'Stripe',
    url: 'https://stripe.com',
    category: 'payment',
    tagline: '글로벌 온라인 결제 플랫폼',
    freeTier: '월 고정비 없음 (수수료 2.9%+30c)',
    paidFrom: '거래 수수료만',
    bestFor: 'SaaS 결제, 글로벌 서비스',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'Toss Payments',
    url: 'https://www.tosspayments.com',
    category: 'payment',
    tagline: '한국 최대 결제 인프라',
    freeTier: '월 고정비 없음 (수수료 기반)',
    paidFrom: '거래 수수료만',
    bestFor: '한국 서비스, 간편결제',
    linkmapIntegration: 'catalog',
  },
  // --- 분석/모니터링 ---
  {
    name: 'Vercel Analytics',
    url: 'https://vercel.com/analytics',
    category: 'analytics',
    tagline: 'Vercel 내장 웹 분석',
    freeTier: '기본 분석 무료',
    paidFrom: 'Pro 플랜에 포함',
    bestFor: 'Vercel 배포 프로젝트',
    linkmapIntegration: 'catalog',
  },
  {
    name: 'Google Analytics',
    url: 'https://analytics.google.com',
    category: 'analytics',
    tagline: '웹/앱 사용자 분석',
    freeTier: '무료',
    paidFrom: 'GA360 (엔터프라이즈)',
    bestFor: '모든 웹 프로젝트',
    linkmapIntegration: 'catalog',
  },
  // --- 커뮤니티/학습 ---
  {
    name: 'Product Hunt',
    url: 'https://producthunt.com',
    category: 'community',
    tagline: '신제품 런칭 플랫폼',
    freeTier: '무료',
    paidFrom: '광고 옵션',
    bestFor: '서비스 런칭, 초기 사용자 확보',
    linkmapIntegration: 'none',
  },
];

/** 바이브코딩 생태계 관련 블로그 포스트 */
export const VIBE_ECOSYSTEM_RELATED_POSTS: RelatedPost[] = [
  {
    slug: 'vibe-coding-ecosystem-2026',
    title: '2026 바이브코딩 생태계 총정리 -- 트렌드, 도구, 커뮤니티',
    relevance: '생태계 전체 조망',
  },
  {
    slug: 'vibe-coding-tools-comparison-2026',
    title: '2026 바이브코딩 도구 완벽 비교 -- 목적별 추천 가이드',
    relevance: '6개 도구 상세 비교',
  },
  {
    slug: 'vibe-coding-learning-roadmap',
    title: '바이브코딩 학습 로드맵 -- 0에서 첫 서비스 배포까지',
    relevance: '도구 선택 순서 가이드',
  },
  {
    slug: 'what-is-vibe-coding',
    title: '바이브 코딩이란 무엇인가 -- AI 시대의 새로운 개발 방식',
    relevance: '바이브코딩 개념 소개',
  },
  {
    slug: 'vibe-coding-getting-started-guide',
    title: '바이브코딩 시작하기 -- 비개발자를 위한 첫걸음 가이드',
    relevance: '입문 가이드',
  },
  {
    slug: 'vibe-coding-success-stories',
    title: '비개발자가 바이브코딩으로 실제 서비스를 만든 사례 5선',
    relevance: '실제 성공 사례',
  },
  {
    slug: 'vibe-coding-vs-traditional-coding',
    title: '바이브코딩 vs 전통 코딩 -- 언제 어떤 것을 선택할까',
    relevance: '바이브코딩 vs 전통 코딩 비교',
  },
  {
    slug: 'vibe-coding-side-project-monetization',
    title: '바이브코딩으로 사이드 프로젝트 수익화하기 -- 현실적인 전략',
    relevance: '수익화 전략',
  },
  {
    slug: 'vibe-coding-common-mistakes',
    title: '바이브코딩 실패 패턴 5가지 -- 초보자가 반드시 피해야 할 함정',
    relevance: '실패 패턴과 회피 전략',
  },
];

// ---------------------------------------------------------------------------
// 전체 비교 데이터 통합 export
// ---------------------------------------------------------------------------

export const ALL_SERVICE_COMPARISONS: ServiceComparison[] = [
  ENV_MANAGEMENT_COMPARISON,
  AI_CODING_TOOLS_COMPARISON,
  DEPLOY_PLATFORMS_COMPARISON,
  BAAS_COMPARISON,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getComparisonById(id: string): ServiceComparison | undefined {
  return ALL_SERVICE_COMPARISONS.find((c) => c.id === id);
}

export function getToolsByCategory(category: VibeToolCategory): VibeTool[] {
  return VIBE_CODING_TOOLS.filter((t) => t.category === category);
}

export function getLinkmapIntegratedTools(): VibeTool[] {
  return VIBE_CODING_TOOLS.filter((t) => t.linkmapIntegration !== 'none');
}

export function getRelatedPostsForComparison(comparisonId: string): RelatedPost[] {
  const comparison = getComparisonById(comparisonId);
  return comparison?.relatedPosts ?? [];
}
