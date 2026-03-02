export type TourPlacement = 'bottom' | 'top' | 'right' | 'left';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  placement: TourPlacement;
}

export const dashboardTourSteps: TourStep[] = [
  {
    id: 'create-project',
    title: '프로젝트 만들기',
    description: '새 프로젝트를 만들어 서비스와 환경변수를 한 곳에서 관리하세요.',
    targetSelector: '[data-tour="create-project"]',
    placement: 'bottom',
  },
  {
    id: 'template-dialog',
    title: '템플릿으로 빠르게 시작',
    description: 'Next.js, FastAPI 등 인기 스택 템플릿으로 서비스 구성을 한 번에 가져오세요.',
    targetSelector: '[data-tour="template-dialog"]',
    placement: 'bottom',
  },
  {
    id: 'quick-actions',
    title: '빠른 실행',
    description: '자주 쓰는 작업을 한 번의 클릭으로 바로 실행할 수 있습니다.',
    targetSelector: '[data-tour="quick-actions"]',
    placement: 'bottom',
  },
  {
    id: 'stat-cards',
    title: '프로젝트 현황 한눈에',
    description: '전체 프로젝트 수, 연결된 서비스, GitHub 레포 수를 한눈에 확인하세요.',
    targetSelector: '[data-tour="stat-cards"]',
    placement: 'bottom',
  },
];

export const projectTourSteps: TourStep[] = [
  {
    id: 'project-add-service',
    title: '서비스 추가',
    description: 'AWS, Supabase, Vercel 등 사용 중인 서비스를 프로젝트에 추가하세요.',
    targetSelector: '[data-tour="project-add-service"]',
    placement: 'bottom',
  },
  {
    id: 'project-env',
    title: '환경변수 설정',
    description: 'API 키와 환경변수를 암호화하여 안전하게 보관하고 팀원과 공유하세요.',
    targetSelector: '[data-tour="project-env"]',
    placement: 'right',
  },
  {
    id: 'project-connect',
    title: '서비스 연결',
    description: '서비스 간 연결 관계를 설정하여 의존성을 시각적으로 파악하세요.',
    targetSelector: '[data-tour="project-connect"]',
    placement: 'right',
  },
  {
    id: 'project-service-map',
    title: '서비스맵 보기',
    description: '프로젝트의 전체 아키텍처를 인터랙티브 다이어그램으로 확인하세요.',
    targetSelector: '[data-tour="project-service-map"]',
    placement: 'top',
  },
];
