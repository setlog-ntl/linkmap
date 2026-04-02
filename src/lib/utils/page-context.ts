export interface PageContext {
  pageName: string;
  pageCategory: string;
}

interface PagePattern {
  pattern: RegExp;
  category: string;
  name: string;
}

const PAGE_PATTERNS: PagePattern[] = [
  // 대시보드
  { pattern: /^\/dashboard$/, category: '대시보드', name: '대시보드' },

  // 사이트
  { pattern: /^\/sites\/new/, category: '사이트', name: '새 사이트' },
  { pattern: /^\/sites\/manage/, category: '사이트', name: '사이트 관리' },
  { pattern: /^\/sites\/showcase/, category: '사이트', name: '쇼케이스' },
  { pattern: /^\/sites\/[^/]+/, category: '사이트', name: '사이트 상세' },
  { pattern: /^\/sites/, category: '사이트', name: '사이트 목록' },

  // 프로젝트 하위 페이지 (구체적 → 포괄적)
  { pattern: /^\/project\/[^/]+\/service-map/, category: '프로젝트', name: '서비스맵' },
  { pattern: /^\/project\/[^/]+\/services/, category: '프로젝트', name: '서비스 관리' },
  { pattern: /^\/project\/[^/]+\/env\/conflicts/, category: '프로젝트', name: '환경변수 충돌' },
  { pattern: /^\/project\/[^/]+\/env/, category: '프로젝트', name: '환경변수' },
  { pattern: /^\/project\/[^/]+\/costs\/report/, category: '프로젝트', name: '비용 리포트' },
  { pattern: /^\/project\/[^/]+\/costs/, category: '프로젝트', name: '비용 분석' },
  { pattern: /^\/project\/[^/]+\/connections/, category: '프로젝트', name: '연결 관리' },
  { pattern: /^\/project\/[^/]+\/integrations/, category: '프로젝트', name: '통합 관리' },
  { pattern: /^\/project\/[^/]+\/monitoring/, category: '프로젝트', name: '모니터링' },
  { pattern: /^\/project\/[^/]+\/health/, category: '프로젝트', name: '상태 확인' },
  { pattern: /^\/project\/[^/]+\/credentials/, category: '프로젝트', name: '인증정보' },
  { pattern: /^\/project\/[^/]+\/settings/, category: '프로젝트', name: '프로젝트 설정' },
  { pattern: /^\/project\/[^/]+\/audit/, category: '프로젝트', name: '활동 로그' },
  { pattern: /^\/project\/[^/]+$/, category: '프로젝트', name: '프로젝트 개요' },
  { pattern: /^\/project/, category: '프로젝트', name: '프로젝트 목록' },

  // 설정
  { pattern: /^\/settings\/account/, category: '설정', name: '계정' },
  { pattern: /^\/settings\/profile/, category: '설정', name: '프로필' },
  { pattern: /^\/settings\/billing/, category: '설정', name: '요금 관리' },
  { pattern: /^\/settings\/github/, category: '설정', name: 'GitHub 연동' },
  { pattern: /^\/settings\/developer/, category: '설정', name: '개발자' },
  { pattern: /^\/settings\/connections/, category: '설정', name: '서비스 연결' },
  { pattern: /^\/settings\/services/, category: '설정', name: '서비스 설정' },
  { pattern: /^\/settings\/tokens/, category: '설정', name: '토큰 관리' },
  { pattern: /^\/settings\/danger/, category: '설정', name: '위험 설정' },
  { pattern: /^\/settings/, category: '설정', name: '설정' },

  // 서비스 카탈로그
  { pattern: /^\/services\/compare/, category: '서비스', name: '서비스 비교' },
  { pattern: /^\/services\/cost-simulator/, category: '서비스', name: '비용 시뮬레이터' },
  { pattern: /^\/services\/[^/]+/, category: '서비스', name: '서비스 상세' },
  { pattern: /^\/services/, category: '서비스', name: '서비스 카탈로그' },

  // 가이드
  { pattern: /^\/guides\/[^/]+\/[^/]+/, category: '가이드', name: '가이드 상세' },
  { pattern: /^\/guides\/[^/]+/, category: '가이드', name: '가이드 카테고리' },
  { pattern: /^\/guides/, category: '가이드', name: '가이드' },

  // 기타
  { pattern: /^\/pricing/, category: '요금제', name: '요금제' },
  { pattern: /^\/feedback/, category: '피드백', name: '피드백' },
  { pattern: /^\/admin/, category: '관리자', name: '관리자' },
  { pattern: /^\/blog/, category: '블로그', name: '블로그' },
  { pattern: /^\/faq/, category: 'FAQ', name: 'FAQ' },
  { pattern: /^\/glossary/, category: '용어집', name: '용어집' },
];

export interface PageTreeNode {
  key: string;
  label: string;
  children?: PageTreeNode[];
}

export const PAGE_TREE: PageTreeNode[] = [
  { key: '대시보드', label: '대시보드' },
  { key: '사이트', label: '사이트', children: [
    { key: '사이트 > 사이트 목록', label: '사이트 목록' },
    { key: '사이트 > 새 사이트', label: '새 사이트' },
    { key: '사이트 > 사이트 관리', label: '사이트 관리' },
    { key: '사이트 > 쇼케이스', label: '쇼케이스' },
  ]},
  { key: '프로젝트', label: '프로젝트', children: [
    { key: '프로젝트 > 프로젝트 개요', label: '프로젝트 개요' },
    { key: '프로젝트 > 서비스 관리', label: '서비스 관리' },
    { key: '프로젝트 > 서비스맵', label: '서비스맵' },
    { key: '프로젝트 > 환경변수', label: '환경변수' },
    { key: '프로젝트 > 비용 분석', label: '비용 분석' },
    { key: '프로젝트 > 연결 관리', label: '연결 관리' },
    { key: '프로젝트 > 통합 관리', label: '통합 관리' },
    { key: '프로젝트 > 모니터링', label: '모니터링' },
    { key: '프로젝트 > 상태 확인', label: '상태 확인' },
    { key: '프로젝트 > 인증정보', label: '인증정보' },
    { key: '프로젝트 > 프로젝트 설정', label: '프로젝트 설정' },
    { key: '프로젝트 > 활동 로그', label: '활동 로그' },
  ]},
  { key: '설정', label: '설정', children: [
    { key: '설정 > 계정', label: '계정' },
    { key: '설정 > 프로필', label: '프로필' },
    { key: '설정 > 요금 관리', label: '요금 관리' },
    { key: '설정 > GitHub 연동', label: 'GitHub 연동' },
    { key: '설정 > 서비스 연결', label: '서비스 연결' },
    { key: '설정 > 서비스 설정', label: '서비스 설정' },
    { key: '설정 > 토큰 관리', label: '토큰 관리' },
  ]},
  { key: '서비스', label: '서비스 카탈로그', children: [
    { key: '서비스 > 서비스 비교', label: '서비스 비교' },
    { key: '서비스 > 비용 시뮬레이터', label: '비용 시뮬레이터' },
  ]},
  { key: '가이드', label: '가이드' },
  { key: '요금제', label: '요금제' },
  { key: '피드백', label: '피드백' },
  { key: '기타', label: '기타' },
];

export function getPageContext(pathname: string): PageContext {
  for (const { pattern, category, name } of PAGE_PATTERNS) {
    if (pattern.test(pathname)) {
      return { pageName: name, pageCategory: category };
    }
  }
  return { pageName: '기타', pageCategory: '기타' };
}

export function formatPageContext(ctx: PageContext): string {
  if (ctx.pageCategory === ctx.pageName) return ctx.pageName;
  return `${ctx.pageCategory} > ${ctx.pageName}`;
}
