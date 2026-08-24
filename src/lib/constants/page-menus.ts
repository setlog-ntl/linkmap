/**
 * 방문 경로(page_path) → 실제 화면 메뉴명 사전
 *
 * 관리자 방문자 통계에서 `/project/abc/env` 같은 경로 대신
 * 사용자가 실제로 보는 메뉴 이름("비밀 키")으로 읽기 위한 매핑이다.
 * 메뉴명은 헤더(header)·사이드바(app-sidebar)·i18n ko.json 라벨과 동일하게 유지하고,
 * 프로젝트 하위 메뉴명은 audit-menus.ts와 같은 어휘를 쓴다.
 */

export interface PageMenuInfo {
  /** 사용자가 실제로 보는 메뉴 이름 */
  menu: string;
  /** 메뉴 안의 세부 대상(슬러그·ID) — 없으면 null */
  detail: string | null;
}

/** 동적 세그먼트가 없는 경로 */
const STATIC_MENUS: Record<string, string> = {
  '/': '홈',
  '/oneclick': '원클릭 배포',
  '/sites': '원클릭 배포',
  '/sites/new': '원클릭 배포',
  '/sites/manage': '내 사이트',
  '/sites/showcase': '내 쇼케이스',
  '/my-sites': '내 사이트',
  '/dashboard': '대시보드',
  '/project': '대시보드',
  '/resources': '무료배포 자료',
  '/pricing': '가격',
  '/services': '서비스 탐색',
  '/services/compare': '서비스 비교',
  '/services/cost-simulator': '비용 시뮬레이터',
  '/feedback': '기능 요청',
  '/showcase': '쇼케이스',
  '/blog': '블로그',
  '/guides': '가이드',
  '/glossary': '용어집',
  '/faq': 'FAQ',
  '/demo': '샘플 프로젝트',
  '/trash': '휴지통',
  '/settings': '설정',
  '/login': '로그인',
  '/signup': '회원가입',
  '/reset-password': '비밀번호 재설정',
  '/privacy': '개인정보처리방침',
  '/terms': '이용약관',
};

/** 프로젝트 하위 세그먼트 → 메뉴명 (사이드바 project.* 라벨과 동일) */
const PROJECT_SUB_MENUS: Record<string, string> = {
  services: '서비스 목록',
  'service-map': '연결 지도',
  costs: '비용',
  connections: '연결 관리',
  env: '비밀 키',
  credentials: '자격 증명',
  'secure-notes': '보안 메모',
  health: '상태 모니터링',
  audit: '감사 로그',
  settings: '프로젝트 설정',
  integrations: '연결 정보',
  monitoring: '상태 확인',
};

/** 설정 하위 세그먼트 → 메뉴명 (settings-nav 라벨과 동일) */
const SETTINGS_SUB_MENUS: Record<string, string> = {
  account: '내 계정',
  profile: '내 계정',
  danger: '내 계정',
  billing: '구독 및 결제',
  github: 'GitHub 연결',
  developer: '개발자 도구',
  tokens: '개발자 도구',
  services: '개발자 도구',
  accounts: '연결된 서비스 계정',
  connections: '연결 관리',
};

/** 관리자 하위 세그먼트 → 메뉴명 (사이드바 adminNav 라벨과 동일) */
const ADMIN_SUB_MENUS: Record<string, string> = {
  'ai-config': 'AI 설정',
  users: '사용자 관리',
  'usage-stats': '기능 통계',
  improvements: '개선사항 관리',
  'deploy-errors': '배포 오류 로그',
  showcase: '쇼케이스 관리',
};

/** 첫 세그먼트만으로 메뉴가 정해지고, 나머지는 세부 대상이 되는 경로 */
const DETAIL_MENUS: Record<string, string> = {
  blog: '블로그',
  glossary: '용어집',
  showcase: '쇼케이스',
  feedback: '기능 요청',
  resources: '무료배포 자료',
  guides: '가이드',
  downloads: '자료 다운로드',
};

function normalize(path: string): string {
  const withoutQuery = path.split('?')[0].split('#')[0];
  const trimmed = withoutQuery.replace(/\/+$/, '');
  return trimmed || '/';
}

export function getPageMenuInfo(path: string): PageMenuInfo {
  const clean = normalize(path);

  const direct = STATIC_MENUS[clean];
  if (direct) return { menu: direct, detail: null };

  const seg = clean.split('/').filter(Boolean);
  const [root, second, third] = seg;

  switch (root) {
    // /project/:id → 한눈에 보기, /project/:id/env → 비밀 키
    case 'project':
      if (!third) return { menu: '한눈에 보기', detail: null };
      return { menu: PROJECT_SUB_MENUS[third] ?? '프로젝트', detail: null };

    // /demo/project/:id/env → 샘플 프로젝트 (비밀 키)
    case 'demo':
      return { menu: '샘플 프로젝트', detail: PROJECT_SUB_MENUS[seg[3]] ?? null };

    // /sites/:id/edit, /my-sites/:id/edit → 내 사이트
    case 'sites':
    case 'my-sites':
      return { menu: '내 사이트', detail: null };

    // /services/:slug → 서비스 탐색 (slug)
    case 'services':
      return { menu: '서비스 탐색', detail: second ?? null };

    case 'settings':
      return { menu: SETTINGS_SUB_MENUS[second] ?? '설정', detail: null };

    case 'admin':
      return { menu: ADMIN_SUB_MENUS[second] ?? '관리자', detail: null };

    // /shared/map/:token → 공유 링크로 열린 연결 지도
    case 'shared':
      return { menu: '공유된 연결 지도', detail: null };

    default: {
      const detailMenu = DETAIL_MENUS[root];
      if (detailMenu) {
        const detail = seg.slice(1).join('/');
        return { menu: detailMenu, detail: detail || null };
      }
      // 사전에 없는 경로는 관리자가 원본을 볼 수 있도록 경로 그대로 남긴다
      return { menu: clean, detail: null };
    }
  }
}

/** 경로를 "메뉴명 (세부)" 한 줄로 */
export function formatPageMenu(path: string): string {
  const { menu, detail } = getPageMenuInfo(path);
  return detail ? `${menu} · ${detail}` : menu;
}
