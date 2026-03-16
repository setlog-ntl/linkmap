import type { EasyCategory, ServiceCategory } from '@/types';

export const easyCategoryLabels: Record<EasyCategory, string> = {
  login_signup: '로그인/회원가입',
  data_storage: '데이터 저장',
  deploy_hosting: '배포/호스팅',
  payments: '결제',
  notifications: '알림/메시지',
  ai_tools: 'AI 도구',
  dev_tools: '개발 도구',
  sns: 'SNS',
  analytics_other: '분석/기타',
};

export const easyCategoryEmojis: Record<EasyCategory, string> = {
  login_signup: '🔐',
  data_storage: '💾',
  deploy_hosting: '🚀',
  payments: '💳',
  notifications: '📧',
  ai_tools: '🤖',
  dev_tools: '🛠️',
  sns: '📱',
  analytics_other: '📊',
};

export const easyCategoryDescriptions: Record<EasyCategory, string> = {
  login_signup: '사용자 로그인, 소셜 로그인, 회원가입 처리',
  data_storage: '데이터베이스, 파일 저장소, 캐시',
  deploy_hosting: '앱을 인터넷에 올리고 운영하기',
  payments: '결제 수단 연동, 구독 관리',
  notifications: '이메일, 문자, 푸시 알림, 채팅',
  ai_tools: 'AI 모델 연동, 챗봇, 이미지 생성',
  dev_tools: '코드 관리, 테스트, 배포 자동화',
  sns: 'Instagram, YouTube, X 등 SNS 연동',
  analytics_other: '방문자 분석, 검색, CMS, 기타',
};

export const easyCategoryToServiceCategories: Record<EasyCategory, ServiceCategory[]> = {
  login_signup: ['auth', 'social_login'],
  data_storage: ['database', 'storage', 'cache'],
  deploy_hosting: ['deploy', 'cdn', 'serverless', 'domain'],
  payments: ['payment', 'ecommerce'],
  notifications: ['email', 'sms', 'push', 'chat'],
  ai_tools: ['ai'],
  dev_tools: ['cicd', 'testing', 'code_quality', 'monitoring', 'logging', 'feature_flags', 'automation'],
  sns: ['sns'],
  analytics_other: ['analytics', 'search', 'cms', 'media', 'queue', 'scheduling', 'advertising', 'other'],
};

export const serviceCategoryToEasy: Record<ServiceCategory, EasyCategory> = {
  auth: 'login_signup',
  social_login: 'login_signup',
  database: 'data_storage',
  storage: 'data_storage',
  cache: 'data_storage',
  deploy: 'deploy_hosting',
  cdn: 'deploy_hosting',
  serverless: 'deploy_hosting',
  payment: 'payments',
  ecommerce: 'payments',
  email: 'notifications',
  sms: 'notifications',
  push: 'notifications',
  chat: 'notifications',
  ai: 'ai_tools',
  cicd: 'dev_tools',
  testing: 'dev_tools',
  code_quality: 'dev_tools',
  monitoring: 'dev_tools',
  logging: 'dev_tools',
  feature_flags: 'dev_tools',
  automation: 'dev_tools',
  sns: 'sns',
  analytics: 'analytics_other',
  search: 'analytics_other',
  cms: 'analytics_other',
  media: 'analytics_other',
  queue: 'analytics_other',
  scheduling: 'analytics_other',
  other: 'analytics_other',
  domain: 'deploy_hosting',
  advertising: 'analytics_other',
};

export interface ProcessStep {
  emoji: string;
  label: string;
}

export const easyCategoryProcessFlows: Record<EasyCategory, ProcessStep[]> = {
  login_signup: [
    { emoji: '👤', label: '사용자 방문' },
    { emoji: '🔐', label: '로그인/가입 클릭' },
    { emoji: '🌐', label: 'OAuth/이메일 인증' },
    { emoji: '✅', label: '토큰 발급' },
    { emoji: '🏠', label: '앱 진입' },
  ],
  data_storage: [
    { emoji: '📝', label: '데이터 입력' },
    { emoji: '📡', label: 'API 호출' },
    { emoji: '💾', label: 'DB 저장' },
    { emoji: '⚡', label: '캐시 적용' },
    { emoji: '📦', label: '파일 저장' },
  ],
  deploy_hosting: [
    { emoji: '💻', label: '코드 작성' },
    { emoji: '📤', label: 'Git 푸시' },
    { emoji: '🔨', label: '자동 빌드' },
    { emoji: '🚀', label: '배포 완료' },
    { emoji: '🌐', label: 'CDN 배포' },
  ],
  payments: [
    { emoji: '🛒', label: '상품 선택' },
    { emoji: '💳', label: '결제 정보 입력' },
    { emoji: '🔒', label: '결제 처리' },
    { emoji: '✅', label: '결제 완료' },
    { emoji: '📧', label: '영수증 발송' },
  ],
  notifications: [
    { emoji: '⚡', label: '이벤트 발생' },
    { emoji: '📋', label: '알림 생성' },
    { emoji: '📧', label: '이메일 전송' },
    { emoji: '📱', label: '푸시/SMS' },
    { emoji: '💬', label: '채팅 알림' },
  ],
  ai_tools: [
    { emoji: '💬', label: '프롬프트 입력' },
    { emoji: '📡', label: 'AI API 호출' },
    { emoji: '🧠', label: 'AI 모델 처리' },
    { emoji: '📝', label: '응답 생성' },
    { emoji: '✨', label: '결과 표시' },
  ],
  dev_tools: [
    { emoji: '💻', label: '코드 작성' },
    { emoji: '🔍', label: '코드 검사' },
    { emoji: '🧪', label: '테스트 실행' },
    { emoji: '♻️', label: 'CI/CD 파이프라인' },
    { emoji: '📊', label: '모니터링' },
  ],
  sns: [
    { emoji: '📝', label: '콘텐츠 작성' },
    { emoji: '📡', label: 'SNS API 호출' },
    { emoji: '📤', label: '게시물 발행' },
    { emoji: '📊', label: '인사이트 수집' },
    { emoji: '💬', label: '댓글/DM 관리' },
  ],
  analytics_other: [
    { emoji: '👤', label: '사용자 행동' },
    { emoji: '📊', label: '데이터 수집' },
    { emoji: '🔍', label: '분석/검색' },
    { emoji: '📈', label: '리포트 생성' },
    { emoji: '💡', label: '인사이트 도출' },
  ],
};

export const EASY_CATEGORY_ORDER: EasyCategory[] = [
  'login_signup',
  'data_storage',
  'deploy_hosting',
  'payments',
  'notifications',
  'ai_tools',
  'dev_tools',
  'sns',
  'analytics_other',
];
