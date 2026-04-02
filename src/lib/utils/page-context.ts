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

  // 원클릭 배포 (사이트)
  { pattern: /^\/sites\/new/, category: '원클릭 배포', name: '새 사이트' },
  { pattern: /^\/sites\/manage/, category: '원클릭 배포', name: '사이트 관리' },
  { pattern: /^\/sites\/showcase/, category: '원클릭 배포', name: '내 쇼케이스' },
  { pattern: /^\/sites\/[^/]+\/edit/, category: '원클릭 배포', name: '사이트 편집' },
  { pattern: /^\/sites\/[^/]+/, category: '원클릭 배포', name: '사이트 상세' },
  { pattern: /^\/sites/, category: '원클릭 배포', name: '사이트 목록' },

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

  // 탐색
  { pattern: /^\/services\/compare/, category: '탐색', name: '서비스 비교' },
  { pattern: /^\/services\/cost-simulator/, category: '탐색', name: '비용 시뮬레이터' },
  { pattern: /^\/services\/[^/]+/, category: '탐색', name: '서비스 상세' },
  { pattern: /^\/services/, category: '탐색', name: '서비스 카탈로그' },
  { pattern: /^\/showcase\/[^/]+/, category: '탐색', name: '쇼케이스 상세' },
  { pattern: /^\/showcase/, category: '탐색', name: '쇼케이스' },
  { pattern: /^\/guides\/[^/]+\/[^/]+/, category: '탐색', name: '가이드 상세' },
  { pattern: /^\/guides\/[^/]+/, category: '탐색', name: '가이드 카테고리' },
  { pattern: /^\/guides/, category: '탐색', name: '가이드' },

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

  // 관리자
  { pattern: /^\/admin\/ai-config/, category: '관리', name: 'AI 설정' },
  { pattern: /^\/admin\/users/, category: '관리', name: '사용자 관리' },
  { pattern: /^\/admin\/usage-stats/, category: '관리', name: '기능 통계' },
  { pattern: /^\/admin\/improvements/, category: '관리', name: '개선사항 관리' },
  { pattern: /^\/admin\/deploy-errors/, category: '관리', name: '배포 오류 로그' },
  { pattern: /^\/admin\/showcase/, category: '관리', name: '쇼케이스 관리' },
  { pattern: /^\/admin/, category: '관리', name: '관리자' },

  // 기타
  { pattern: /^\/pricing/, category: '기타', name: '요금제' },
  { pattern: /^\/feedback/, category: '기타', name: '피드백' },
  { pattern: /^\/blog/, category: '기타', name: '블로그' },
  { pattern: /^\/faq/, category: '기타', name: 'FAQ' },
  { pattern: /^\/glossary/, category: '기타', name: '용어집' },
];

// ─── 트리 구조 (사이드바와 동일) ─────────────────────────────────────────────

export interface PageTreeNode {
  key: string;
  label: string;
  children?: PageTreeNode[];
}

export const PAGE_TREE: PageTreeNode[] = [
  // ① 원클릭 배포
  { key: '원클릭 배포', label: '원클릭 배포', children: [
    { key: '원클릭 배포 > 사이트 관리', label: '사이트 관리' },
    { key: '원클릭 배포 > 새 사이트', label: '새 사이트' },
    { key: '원클릭 배포 > 사이트 편집', label: '사이트 편집' },
    { key: '원클릭 배포 > 내 쇼케이스', label: '내 쇼케이스' },
  ]},
  // ② 내 프로젝트
  { key: '대시보드', label: '대시보드' },
  { key: '프로젝트', label: '내 프로젝트', children: [
    { key: '프로젝트 > 프로젝트 개요', label: '프로젝트 개요' },
    { key: '프로젝트 > 서비스 관리', label: '서비스 관리' },
    { key: '프로젝트 > 서비스맵', label: '서비스맵' },
    { key: '프로젝트 > 비용 분석', label: '비용 분석' },
    { key: '프로젝트 > 연결 관리', label: '연결 관리' },
    { key: '프로젝트 > 환경변수', label: '환경변수' },
    { key: '프로젝트 > 프로젝트 설정', label: '프로젝트 설정' },
    { key: '프로젝트 > 통합 관리', label: '통합 관리' },
    { key: '프로젝트 > 모니터링', label: '모니터링' },
    { key: '프로젝트 > 상태 확인', label: '상태 확인' },
    { key: '프로젝트 > 인증정보', label: '인증정보' },
    { key: '프로젝트 > 활동 로그', label: '활동 로그' },
  ]},
  // ③ 탐색
  { key: '탐색', label: '탐색', children: [
    { key: '탐색 > 서비스 카탈로그', label: '서비스 카탈로그' },
    { key: '탐색 > 쇼케이스', label: '쇼케이스' },
    { key: '탐색 > 가이드', label: '가이드' },
    { key: '탐색 > 서비스 비교', label: '서비스 비교' },
    { key: '탐색 > 비용 시뮬레이터', label: '비용 시뮬레이터' },
  ]},
  // ④ 설정
  { key: '설정', label: '설정', children: [
    { key: '설정 > 계정', label: '계정' },
    { key: '설정 > 프로필', label: '프로필' },
    { key: '설정 > 요금 관리', label: '요금 관리' },
    { key: '설정 > GitHub 연동', label: 'GitHub 연동' },
    { key: '설정 > 서비스 연결', label: '서비스 연결' },
    { key: '설정 > 서비스 설정', label: '서비스 설정' },
    { key: '설정 > 토큰 관리', label: '토큰 관리' },
  ]},
  // ⑤ 관리
  { key: '관리', label: '관리', children: [
    { key: '관리 > AI 설정', label: 'AI 설정' },
    { key: '관리 > 사용자 관리', label: '사용자 관리' },
    { key: '관리 > 기능 통계', label: '기능 통계' },
    { key: '관리 > 개선사항 관리', label: '개선사항 관리' },
    { key: '관리 > 배포 오류 로그', label: '배포 오류 로그' },
    { key: '관리 > 쇼케이스 관리', label: '쇼케이스 관리' },
  ]},
  // 기타
  { key: '기타', label: '기타', children: [
    { key: '기타 > 요금제', label: '요금제' },
    { key: '기타 > 피드백', label: '피드백' },
    { key: '기타 > 블로그', label: '블로그' },
    { key: '기타 > FAQ', label: 'FAQ' },
  ]},
];

// ─── 유틸 함수 ───────────────────────────────────────────────────────────────

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

/** 트리에서 value가 속한 최상위 카테고리 key를 반환 */
export function findTreeCategory(value: string): string {
  if (value.includes(' > ')) return value.split(' > ')[0];
  return value;
}
