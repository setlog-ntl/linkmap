/**
 * AI Feature Definitions, Default Q&A, and Preset Templates
 *
 * Used by:
 * - GET /api/admin/ai-feature-personas (auto-init when 0 features)
 * - GET/POST /api/admin/ai-feature-presets (preset application)
 */

// ─── Feature Definitions ─────────────────────────────────────────────

export interface FeatureDefinition {
  slug: string;
  label_ko: string;
  label_en: string;
  description: string;
  default_prompt_override: string | null;
}

export const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  {
    slug: 'overview_chat',
    label_ko: '개요 AI 채팅',
    label_en: 'Overview Chat',
    description: '프로젝트 개요에서 사용되는 AI 대화',
    default_prompt_override: null,
  },
  {
    slug: 'env_doctor',
    label_ko: 'AI 환경변수 닥터',
    label_en: 'Env Doctor',
    description: '환경변수 진단 및 분석',
    default_prompt_override: null,
  },
  {
    slug: 'map_narrator',
    label_ko: 'AI 아키텍처 분석',
    label_en: 'Map Narrator',
    description: '서비스맵 분석 및 인사이트',
    default_prompt_override: null,
  },
  {
    slug: 'compare_services',
    label_ko: 'AI 서비스 비교',
    label_en: 'Service Comparison',
    description: '서비스 비교 분석',
    default_prompt_override: null,
  },
  {
    slug: 'command',
    label_ko: 'AI 자연어 커맨드',
    label_en: 'AI Command',
    description: 'AI 자연어 명령어 처리',
    default_prompt_override: null,
  },
  {
    slug: 'module_suggest',
    label_ko: 'AI 모듈 추천',
    label_en: 'Module Suggest',
    description: '모듈 구성 추천',
    default_prompt_override: null,
  },
];

// ─── Default Q&A ─────────────────────────────────────────────────────

export interface DefaultQna {
  feature_slug: string;
  question: string;
  question_ko: string;
  answer_guide: string;
  sort_order: number;
}

export const DEFAULT_QNA: DefaultQna[] = [
  // overview_chat
  {
    feature_slug: 'overview_chat',
    question: 'Recommend services for my project',
    question_ko: '프로젝트에 적합한 서비스 추천해줘',
    answer_guide: '사용자의 프로젝트 정보(이름, 현재 서비스, 환경변수 수)를 분석하여 부족한 레이어의 서비스를 추천하세요. 반드시 recommendations JSON 블록을 포함하세요.',
    sort_order: 1,
  },
  {
    feature_slug: 'overview_chat',
    question: 'Analyze my architecture',
    question_ko: '현재 아키텍처를 분석해줘',
    answer_guide: '프로젝트에 연결된 서비스 목록과 연결 상태를 기반으로 아키텍처의 강점과 개선점을 분석하세요. 누락된 레이어나 단일 장애점을 지적하세요.',
    sort_order: 2,
  },
  {
    feature_slug: 'overview_chat',
    question: 'Explain env variable best practices',
    question_ko: '환경변수 관리 모범 사례 알려줘',
    answer_guide: '환경변수 네이밍 규칙, 시크릿 관리, .env 파일 구조, 서비스별 환경변수 분리 방법을 설명하세요.',
    sort_order: 3,
  },
  // env_doctor
  {
    feature_slug: 'env_doctor',
    question: 'Check for missing env vars',
    question_ko: '누락된 환경변수 확인해줘',
    answer_guide: '프로젝트의 서비스 목록과 현재 환경변수를 비교하여 누락된 필수 환경변수를 찾아 목록으로 제시하세요.',
    sort_order: 1,
  },
  {
    feature_slug: 'env_doctor',
    question: 'Find duplicate or conflicting values',
    question_ko: '중복되거나 충돌하는 값 찾아줘',
    answer_guide: '환경변수 이름과 값을 분석하여 중복된 키, 충돌하는 설정, 비표준 네이밍을 찾아 수정 방안을 제시하세요.',
    sort_order: 2,
  },
  // map_narrator
  {
    feature_slug: 'map_narrator',
    question: 'Describe my service architecture',
    question_ko: '서비스 아키텍처를 설명해줘',
    answer_guide: '서비스맵에 표시된 서비스들의 역할과 연결 관계를 분석하여 전체 아키텍처를 이야기 형식으로 설명하세요.',
    sort_order: 1,
  },
  {
    feature_slug: 'map_narrator',
    question: 'Find potential issues in the map',
    question_ko: '서비스맵에서 잠재적 문제 찾아줘',
    answer_guide: '서비스 간 연결 패턴, 의존성 깊이, 단일 장애점, 순환 의존성 등을 분석하여 잠재적 문제를 진단하세요.',
    sort_order: 2,
  },
  // compare_services
  {
    feature_slug: 'compare_services',
    question: 'Compare these services objectively',
    question_ko: '이 서비스들을 객관적으로 비교해줘',
    answer_guide: '선택된 서비스들의 가격, 기능, 확장성, 커뮤니티 지원, 학습 곡선을 표 형식으로 비교하세요.',
    sort_order: 1,
  },
  {
    feature_slug: 'compare_services',
    question: 'Which one fits my project best?',
    question_ko: '내 프로젝트에 가장 적합한 것은?',
    answer_guide: '프로젝트의 규모, 기술 스택, 팀 역량을 고려하여 가장 적합한 서비스를 추천하고 그 이유를 설명하세요.',
    sort_order: 2,
  },
  // command
  {
    feature_slug: 'command',
    question: 'What commands are available?',
    question_ko: '사용 가능한 명령어가 뭐야?',
    answer_guide: '사용 가능한 자연어 명령어 목록(서비스 추가/제거, 환경변수 생성, 연결 관리 등)을 안내하세요.',
    sort_order: 1,
  },
  // module_suggest
  {
    feature_slug: 'module_suggest',
    question: 'Suggest modules for my site',
    question_ko: '내 사이트에 적합한 모듈 추천해줘',
    answer_guide: '사이트의 목적과 현재 모듈 구성을 분석하여 추가하면 좋을 모듈을 추천하고 배치 순서를 제안하세요.',
    sort_order: 1,
  },
  {
    feature_slug: 'module_suggest',
    question: 'Optimize module order',
    question_ko: '모듈 순서를 최적화해줘',
    answer_guide: '현재 모듈 순서를 사용자 경험과 전환율 관점에서 분석하여 최적의 순서를 제안하세요.',
    sort_order: 2,
  },
];

// ─── Presets ─────────────────────────────────────────────────────────

export interface PresetQna {
  question: string;
  question_ko: string;
  answer_guide: string;
  sort_order: number;
}

export interface PresetFeatureConfig {
  system_prompt_override: string | null;
  qna: PresetQna[];
}

export interface Preset {
  key: string;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
  features: Record<string, PresetFeatureConfig>;
}

export const PRESETS: Preset[] = [
  {
    key: 'default',
    name_ko: '기본 설정',
    name_en: 'Default',
    description_ko: '균형 잡힌 기본 Q&A와 설정으로 시작합니다',
    description_en: 'Balanced default Q&A and settings',
    features: Object.fromEntries(
      FEATURE_DEFINITIONS.map((f) => [
        f.slug,
        {
          system_prompt_override: null,
          qna: DEFAULT_QNA.filter((q) => q.feature_slug === f.slug).map((q) => ({
            question: q.question,
            question_ko: q.question_ko,
            answer_guide: q.answer_guide,
            sort_order: q.sort_order,
          })),
        },
      ])
    ),
  },
  {
    key: 'expert',
    name_ko: '전문가 모드',
    name_en: 'Expert Mode',
    description_ko: '상세한 기술 분석과 깊은 인사이트를 제공합니다',
    description_en: 'Detailed technical analysis with deep insights',
    features: {
      overview_chat: {
        system_prompt_override: '전문 소프트웨어 아키텍트로서 답변하세요. 기술적 깊이를 우선하며, 구체적인 코드 예시와 아키텍처 다이어그램 설명을 포함하세요. 트레이드오프를 항상 언급하세요.',
        qna: [
          { question: 'Deep architecture review', question_ko: '심층 아키텍처 리뷰해줘', answer_guide: '마이크로서비스 vs 모놀리스 관점, SOLID 원칙, 확장성, 장애 복구 전략을 포함한 심층 분석을 제공하세요. 각 서비스의 SLA, RPO/RTO를 고려하세요.', sort_order: 1 },
          { question: 'Security audit of my setup', question_ko: '보안 감사해줘', answer_guide: 'OWASP Top 10 관점에서 현재 설정을 검토하세요. 환경변수 노출 위험, API 키 로테이션 정책, 네트워크 격리 수준을 분석하세요.', sort_order: 2 },
          { question: 'Performance optimization plan', question_ko: '성능 최적화 계획 세워줘', answer_guide: '현재 서비스 구성에서 병목점을 식별하고, CDN, 캐싱 레이어, DB 쿼리 최적화, 비동기 처리 전환 등 구체적인 최적화 방안을 단계별로 제시하세요.', sort_order: 3 },
        ],
      },
      env_doctor: {
        system_prompt_override: '시니어 DevOps 엔지니어로서 환경변수를 분석하세요. 12-Factor App 원칙을 기준으로 진단하고, 시크릿 관리 모범 사례를 적용하세요.',
        qna: [
          { question: 'Full security scan of env vars', question_ko: '환경변수 보안 전체 스캔', answer_guide: '민감 정보 노출 여부, 약한 키/토큰 패턴, 하드코딩된 시크릿, 환경별 분리 미흡 등을 CRITICAL/WARNING/INFO 등급으로 분류하여 보고하세요.', sort_order: 1 },
          { question: 'Cross-service dependency analysis', question_ko: '서비스 간 환경변수 의존성 분석', answer_guide: '여러 서비스가 공유하는 환경변수를 식별하고, 변경 시 영향 범위를 매핑하세요. 순환 의존이나 숨은 커플링을 찾아내세요.', sort_order: 2 },
        ],
      },
      map_narrator: {
        system_prompt_override: '클라우드 아키텍트 관점에서 서비스맵을 분석하세요. AWS Well-Architected Framework의 5개 핵심 축(운영 우수성, 보안, 안정성, 성능 효율, 비용 최적화)으로 평가하세요.',
        qna: [
          { question: 'Well-Architected review', question_ko: 'Well-Architected 프레임워크 리뷰', answer_guide: '5개 핵심 축 각각에 대해 현재 아키텍처를 평가하고, 개선 항목을 우선순위별로 제시하세요.', sort_order: 1 },
          { question: 'Disaster recovery assessment', question_ko: '재해 복구 평가', answer_guide: '각 서비스의 가용성 수준, 데이터 백업 전략, 장애 전파 경로, 복구 시간 목표를 분석하세요.', sort_order: 2 },
        ],
      },
      compare_services: {
        system_prompt_override: '기술 리서치 분석가로서 서비스를 비교하세요. 벤치마크 데이터, 실제 사례, TCO 분석을 포함하세요.',
        qna: [
          { question: 'Total cost of ownership analysis', question_ko: 'TCO(총소유비용) 분석', answer_guide: '라이선스 비용, 인프라 비용, 인력 비용, 마이그레이션 비용, 숨은 비용을 포함한 3년 TCO를 비교하세요.', sort_order: 1 },
          { question: 'Migration complexity assessment', question_ko: '마이그레이션 난이도 평가', answer_guide: '각 서비스로/에서 마이그레이션 시 필요한 작업량, 호환성 이슈, 다운타임 예상, 롤백 전략을 분석하세요.', sort_order: 2 },
        ],
      },
      command: {
        system_prompt_override: '고급 사용자를 위해 복합 명령과 배치 처리를 지원하세요. 가능한 경우 여러 작업을 하나의 트랜잭션으로 묶어 실행하세요.',
        qna: [
          { question: 'Batch operations guide', question_ko: '일괄 작업 가이드', answer_guide: '여러 서비스 추가, 환경변수 일괄 설정, 연결 대량 생성 등 배치 명령어 사용법을 안내하세요.', sort_order: 1 },
        ],
      },
      module_suggest: {
        system_prompt_override: 'UX 전문가이자 프론트엔드 아키텍트로서 모듈을 추천하세요. 전환율 데이터와 A/B 테스트 결과를 근거로 제시하세요.',
        qna: [
          { question: 'Conversion optimization modules', question_ko: '전환율 최적화 모듈 추천', answer_guide: 'CTA 배치, 소셜 프루프, 어전시(긴급성), A/B 테스트 가능한 모듈 조합을 전환율 관점에서 추천하세요.', sort_order: 1 },
          { question: 'SEO-optimized module structure', question_ko: 'SEO 최적화 모듈 구성', answer_guide: '검색 엔진 최적화에 유리한 모듈 순서와 콘텐츠 구조를 추천하세요. 스키마 마크업, 헤딩 계층 구조를 고려하세요.', sort_order: 2 },
        ],
      },
    },
  },
  {
    key: 'concise',
    name_ko: '간결 모드',
    name_en: 'Concise Mode',
    description_ko: '핵심만 빠르게 전달합니다. 짧고 명확한 답변을 제공합니다.',
    description_en: 'Quick, to-the-point answers. Short and clear.',
    features: {
      overview_chat: {
        system_prompt_override: '답변은 3문장 이내로 핵심만 전달하세요. 불릿 포인트를 사용하고, 부연 설명은 생략하세요.',
        qna: [
          { question: 'Quick project summary', question_ko: '프로젝트 요약', answer_guide: '프로젝트의 핵심 구성(서비스 수, 환경변수 수, 연결 상태)을 한 줄로 요약하세요.', sort_order: 1 },
          { question: 'Top 3 action items', question_ko: '우선 해야 할 3가지', answer_guide: '지금 즉시 조치해야 할 상위 3가지 항목만 불릿 포인트로 제시하세요.', sort_order: 2 },
        ],
      },
      env_doctor: {
        system_prompt_override: '진단 결과를 불릿 포인트로 요약하세요. 문제 → 해결책 형식으로 간결하게.',
        qna: [
          { question: 'Quick health check', question_ko: '빠른 상태 점검', answer_guide: '환경변수 상태를 OK/WARNING/ERROR로 한 줄씩 요약하세요.', sort_order: 1 },
        ],
      },
      map_narrator: {
        system_prompt_override: '서비스맵을 3줄 이내로 요약하세요. 핵심 연결과 주요 리스크만 언급하세요.',
        qna: [
          { question: 'Architecture one-liner', question_ko: '아키텍처 한 줄 요약', answer_guide: '전체 아키텍처를 한 문장으로 설명하세요.', sort_order: 1 },
        ],
      },
      compare_services: {
        system_prompt_override: '비교 결과를 표 하나로 요약하세요. 승자를 명확히 표시하세요.',
        qna: [
          { question: 'Quick winner pick', question_ko: '빠른 추천', answer_guide: '가장 추천하는 서비스 하나와 그 이유를 한 문장으로 답하세요.', sort_order: 1 },
        ],
      },
      command: {
        system_prompt_override: '명령 실행 결과만 간결하게 보여주세요. 부가 설명 없이 결과만.',
        qna: [
          { question: 'Quick command list', question_ko: '명령어 목록', answer_guide: '사용 가능한 명령어를 한 줄씩 나열하세요.', sort_order: 1 },
        ],
      },
      module_suggest: {
        system_prompt_override: '추천 모듈을 이름만 나열하세요. 설명은 필요 시 한 줄로.',
        qna: [
          { question: 'Must-have modules', question_ko: '필수 모듈', answer_guide: '반드시 포함해야 할 모듈 3개만 추천하세요.', sort_order: 1 },
        ],
      },
    },
  },
];
