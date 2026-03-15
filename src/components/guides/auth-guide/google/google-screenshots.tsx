'use client';

import type { StepData } from '../step-card-with-screenshot';
import { googleIllustrations } from './google-illustrations';

const IMG_BASE = '/img/guides/auth/google';
const SUPABASE_IMG = '/img/guides/auth/supabase';

export const googleSteps: StepData[] = [
  {
    step: 1,
    title: 'Google Cloud 프로젝트 생성',
    where: 'Google Cloud Console',
    whereUrl: 'https://console.cloud.google.com',
    what: '새 프로젝트를 만들거나 기존 프로젝트를 선택합니다.',
    why: 'OAuth 인증 정보가 이 프로젝트 안에 생성됩니다.',
    tip: '프로젝트 이름은 나중에 OAuth 동의 화면에 표시되므로 의미 있는 이름을 사용하세요.',
    screenshots: [
      {
        src: `${IMG_BASE}/01-project-dropdown.png`,
        alt: 'GCP 프로젝트 선택 및 생성',
        illustration: googleIllustrations[1],
        annotations: [
          { type: 'click', x: 15, y: 8, number: 1, label: '프로젝트 선택' },
        ],
        caption: '프로젝트 선택 → 새 프로젝트 생성',
      },
    ],
  },
  {
    step: 2,
    title: 'OAuth 동의 화면 설정',
    where: 'API 및 서비스 > OAuth 동의 화면',
    what: 'External 선택 → 앱 이름, 지원 이메일 입력 → 범위에 email, profile, openid 추가',
    why: '사용자가 로그인할 때 보게 되는 동의 화면의 내용을 정합니다.',
    tip: 'External을 선택해야 모든 Google 계정이 로그인할 수 있습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/02-consent-menu.png`,
        alt: 'OAuth 동의 화면 — External 선택 및 스코프 추가',
        illustration: googleIllustrations[2],
        annotations: [
          { type: 'click', x: 15, y: 45, number: 1, label: 'OAuth 동의 화면' },
        ],
        caption: 'External 선택 후 email, profile, openid 스코프 추가',
      },
    ],
  },
  {
    step: 3,
    title: 'OAuth 클라이언트 ID 생성',
    where: 'API 및 서비스 > 사용자 인증 정보',
    what: '사용자 인증 정보 만들기 > OAuth 클라이언트 ID > 웹 애플리케이션 → 승인된 리디렉션 URI에 Supabase 콜백 URL 추가',
    why: 'Client ID와 Client Secret을 발급받기 위한 핵심 단계입니다.',
    tip: '리디렉션 URI: https://<project-ref>.supabase.co/auth/v1/callback',
    screenshots: [
      {
        src: `${IMG_BASE}/03-credentials-menu.png`,
        alt: '클라이언트 목록 + 만들기 버튼',
        illustration: googleIllustrations[3],
        annotations: [
          { type: 'click', x: 50, y: 15, number: 1, label: '+ 클라이언트 만들기' },
        ],
        caption: '클라이언트 목록에서 "클라이언트 만들기" 클릭',
      },
      {
        src: `${IMG_BASE}/03-redirect-uri.png`,
        alt: '승인된 리디렉션 URI 입력',
        illustration: googleIllustrations[3],
        annotations: [
          { type: 'input', x: 10, y: 30, width: 75, height: 5, label: '승인된 리디렉션 URI' },
        ],
        caption: 'Supabase 콜백 URL을 리디렉션 URI에 입력',
      },
    ],
  },
  {
    step: 4,
    title: 'Client ID / Secret 복사',
    where: '생성된 OAuth 클라이언트 상세 페이지',
    what: 'Client ID와 Client Secret 값을 복사해 둡니다.',
    why: '다음 단계에서 Supabase에 붙여넣어야 합니다.',
    tip: 'Secret은 이 화면에서만 볼 수 있으므로 반드시 복사해 두세요.',
    screenshots: [
      {
        src: `${IMG_BASE}/04-created-modal.png`,
        alt: 'OAuth 클라이언트 생성 완료 — ID/Secret 복사',
        illustration: googleIllustrations[4],
        annotations: [
          { type: 'highlight', x: 15, y: 35, width: 70, height: 10 },
          { type: 'highlight', x: 15, y: 50, width: 70, height: 10 },
        ],
        caption: 'Client ID와 Client Secret 각각 복사',
      },
    ],
  },
  {
    step: 5,
    title: 'Supabase Google Provider 활성화',
    where: 'Supabase Dashboard > Authentication > Providers',
    what: 'Google 토글 ON → Client ID, Client Secret 붙여넣기',
    why: 'Supabase가 구글 로그인을 대행할 수 있도록 연결합니다.',
    screenshots: [
      {
        src: `${SUPABASE_IMG}/google-settings.png`,
        alt: 'Supabase Google Provider 설정',
        illustration: googleIllustrations[5],
        annotations: [
          { type: 'input', x: 10, y: 40, width: 80, height: 8, label: 'Client ID' },
          { type: 'input', x: 10, y: 55, width: 80, height: 8, label: 'Client Secret' },
        ],
        caption: 'Google Provider ON + ID/Secret 붙여넣기',
      },
    ],
  },
  {
    step: 6,
    title: 'URL Configuration 설정',
    where: 'Supabase Dashboard > Authentication > URL Configuration',
    what: 'Site URL 입력 + Redirect URLs에 앱 도메인/auth/callback 추가',
    why: '로그인 성공 후 앱으로 안전하게 돌아오기 위한 주소를 등록합니다.',
    tip: '로컬 개발 시 http://localhost:3000도 Redirect URLs에 추가하세요.',
    screenshots: [
      {
        src: `${SUPABASE_IMG}/url-config.png`,
        alt: 'URL Configuration 설정',
        illustration: googleIllustrations[6],
        annotations: [
          { type: 'input', x: 10, y: 30, width: 80, height: 8, label: 'Site URL' },
        ],
        caption: 'Site URL과 Redirect URLs 설정',
      },
    ],
  },
  {
    step: 7,
    title: '동작 확인',
    where: '로컬 개발 환경',
    what: 'npm run dev → 로그인 페이지 → Google 로그인 클릭 → 대시보드 도착 확인',
    why: '설정이 올바른지 실제로 테스트합니다.',
    tip: '브라우저 시크릿 모드에서 테스트하면 캐시 문제를 피할 수 있습니다.',
    screenshots: [
      {
        alt: '로그인 플로우 전체 확인',
        illustration: googleIllustrations[7],
        caption: '로그인 페이지 → Google 동의 화면 → 대시보드 도착',
      },
    ],
  },
];
