'use client';

import type { StepData } from '../step-card-with-screenshot';
import { googleIllustrations } from './google-illustrations';

const IMG_BASE = '/img/guides/auth/google';
const SUPABASE_IMG = '/img/guides/auth/supabase';

export const googleSteps: StepData[] = [
  {
    step: 1,
    title: 'Google Cloud 프로젝트 확인',
    where: 'Google Cloud Console 시작 페이지',
    whereUrl: 'https://console.cloud.google.com',
    what: '콘솔에 접속하여 기존 프로젝트를 확인하거나, 새 프로젝트를 생성합니다.',
    why: 'OAuth 인증 정보가 이 프로젝트 안에 생성됩니다.',
    tip: '상단 바의 프로젝트명을 클릭하면 프로젝트 선택/생성 드롭다운이 열립니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/01-project-dropdown.png`,
        alt: 'GCP 시작하기 페이지 — 프로젝트 정보, 빠른 액세스',
        illustration: googleIllustrations[1],
        annotations: [
          { type: 'click', x: 15, y: 2, number: 1, label: '프로젝트명 클릭 → 선택/생성' },
        ],
        masks: [
          { x: 12, y: 1, width: 8, height: 3, label: '프로젝트명' },
          { x: 14, y: 26, width: 17, height: 2, label: '프로젝트 번호' },
          { x: 32, y: 26, width: 22, height: 2, label: '프로젝트 ID' },
        ],
        caption: '상단 바에서 프로젝트명 클릭 → 프로젝트 선택·생성. 프로젝트 번호와 ID가 표시됩니다.',
      },
    ],
  },
  {
    step: 2,
    title: 'Google 인증 플랫폼 진입',
    where: 'Google Cloud Console > Google 인증 플랫폼 > 개요',
    what: '좌측 "브랜딩" 메뉴에서 앱 이름, 지원 이메일을 설정하고, "데이터 액세스"에서 email, profile, openid 스코프를 추가합니다.',
    why: '사용자가 로그인할 때 보게 되는 동의 화면의 내용을 정합니다.',
    tip: '좌측 메뉴에서 개요/브랜딩/대상/클라이언트/데이터 액세스/인증 센터/설정 항목을 확인할 수 있습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/02-consent-menu.png`,
        alt: 'Google 인증 플랫폼 — OAuth 개요 + 좌측 메뉴',
        illustration: googleIllustrations[2],
        annotations: [
          { type: 'click', x: 4, y: 14, number: 1, label: '브랜딩' },
          { type: 'click', x: 5, y: 25, number: 2, label: '데이터 액세스' },
        ],
        masks: [
          { x: 12, y: 1, width: 8, height: 3, label: '프로젝트명' },
        ],
        caption: '좌측 메뉴: ① "브랜딩"에서 앱 이름·지원 이메일, ② "데이터 액세스"에서 스코프 추가',
      },
    ],
  },
  {
    step: 3,
    title: 'OAuth 클라이언트 만들기',
    where: 'Google 인증 플랫폼 > 클라이언트',
    what: '좌측 메뉴 "클라이언트" → 상단 "+ 클라이언트 만들기" 클릭 → 웹 애플리케이션 선택',
    why: 'Client ID와 Client Secret을 발급받기 위한 핵심 단계입니다.',
    tip: '기존 클라이언트가 있다면 이름을 클릭하여 상세 페이지로 이동할 수 있습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/03-credentials-menu.png`,
        alt: '클라이언트 목록 페이지 — 클라이언트 만들기 버튼',
        illustration: googleIllustrations[3],
        annotations: [
          { type: 'click', x: 4, y: 24, number: 1, label: '클라이언트 메뉴' },
          { type: 'click', x: 33, y: 11, number: 2, label: '+ 클라이언트 만들기' },
          { type: 'highlight', x: 17, y: 25, width: 80, height: 4 },
        ],
        masks: [
          { x: 12, y: 1, width: 9, height: 3, label: '프로젝트명' },
          { x: 67, y: 26, width: 14, height: 3, label: 'Client ID' },
        ],
        caption: '좌측 "클라이언트" 메뉴 → "+ 클라이언트 만들기" 클릭. 기존 클라이언트는 테이블에 표시됩니다.',
      },
    ],
  },
  {
    step: 4,
    title: '리디렉션 URI + Client ID/Secret 확인',
    where: '클라이언트 상세 페이지',
    what: '왼쪽: "승인된 리디렉션 URI"에 Supabase 콜백 URL 추가. 오른쪽: Client ID와 보안 비밀번호 확인.',
    why: 'Supabase에 등록할 Client ID와 Secret을 이 화면에서 확인하고, 콜백 URL도 여기서 등록합니다.',
    tip: '리디렉션 URI는 https://<ref>.supabase.co/auth/v1/callback 형식입니다. Secret은 ****로 표시되며, 분실 시 "Add secret"으로 재생성합니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/03-redirect-uri.png`,
        alt: '클라이언트 상세 — 리디렉션 URI(왼쪽) + Client ID/Secret(오른쪽)',
        illustration: googleIllustrations[4],
        annotations: [
          { type: 'highlight', x: 18, y: 72, width: 35, height: 18 },
          { type: 'highlight', x: 60, y: 16, width: 38, height: 18 },
          { type: 'highlight', x: 60, y: 80, width: 38, height: 8 },
        ],
        masks: [
          { x: 20, y: 5, width: 55, height: 3, label: '브레드크럼 Client ID' },
          { x: 63, y: 19, width: 35, height: 6, label: 'Client ID 전체' },
          { x: 20, y: 73, width: 33, height: 3, label: 'Redirect URI 1' },
          { x: 20, y: 78, width: 33, height: 3, label: 'Redirect URI 2' },
          { x: 20, y: 83, width: 33, height: 3, label: 'Redirect URI 3' },
          { x: 20, y: 88, width: 33, height: 3, label: 'Redirect URI 4' },
        ],
        caption: '왼쪽: "승인된 리디렉션 URI"에 Supabase 콜백 URL. 오른쪽: Client ID + "클라이언트 보안 비밀번호" 확인',
      },
    ],
  },
  {
    step: 5,
    title: 'Supabase Google Provider 활성화',
    where: 'Supabase Dashboard > Authentication > Sign In / Providers',
    what: 'Providers 목록에서 Google 클릭 → 토글 ON → Client ID, Secret 붙여넣기',
    why: 'Supabase가 구글 로그인을 대행할 수 있도록 연결합니다.',
    tip: '좌측 Configuration > "Sign In / Providers" 메뉴 선택 후, 목록을 스크롤하여 Google 항목을 찾아 클릭하세요.',
    screenshots: [
      {
        src: `${SUPABASE_IMG}/providers-list.png`,
        alt: 'Supabase Auth — Providers 목록',
        illustration: googleIllustrations[5],
        annotations: [
          { type: 'click', x: 12, y: 44, number: 1, label: 'Sign In / Providers' },
        ],
        caption: '좌측 "Sign In / Providers" 선택 → 스크롤하여 Google 항목 클릭',
      },
      {
        src: `${SUPABASE_IMG}/google-settings.png`,
        alt: 'Google Provider 설정 다이얼로그',
        annotations: [
          { type: 'input', x: 52, y: 33, width: 42, height: 6, label: 'Client IDs' },
          { type: 'input', x: 52, y: 57, width: 42, height: 6, label: 'Client Secret' },
        ],
        masks: [
          { x: 52, y: 34, width: 42, height: 5, label: 'GCP Client ID' },
        ],
        caption: 'Google 다이얼로그: Client IDs에 GCP Client ID, Client Secret에 GCP Secret → Save',
      },
    ],
  },
  {
    step: 6,
    title: 'URL Configuration 설정',
    where: 'Supabase Dashboard > Authentication > URL Configuration',
    what: 'Site URL에 서비스 도메인 입력 + Redirect URLs에 /auth/callback 경로 추가',
    why: '로그인 성공 후 앱으로 안전하게 돌아오기 위한 주소를 등록합니다.',
    tip: '좌측 "URL Configuration" 메뉴. 로컬 개발 시 http://localhost:3000/auth/callback도 추가하세요.',
    screenshots: [
      {
        src: `${SUPABASE_IMG}/url-config.png`,
        alt: 'URL Configuration — Site URL + Redirect URLs',
        illustration: googleIllustrations[6],
        annotations: [
          { type: 'click', x: 12, y: 59, number: 1, label: 'URL Configuration 메뉴' },
          { type: 'highlight', x: 65, y: 32, width: 30, height: 4 },
          { type: 'highlight', x: 24, y: 68, width: 55, height: 10 },
        ],
        masks: [
          { x: 28, y: 69, width: 45, height: 3, label: 'Redirect URL 1' },
          { x: 28, y: 75, width: 35, height: 3, label: 'Redirect URL 2' },
        ],
        caption: 'Site URL(서비스 도메인) + Redirect URLs에 콜백 URL 추가. "Add URL" 버튼으로 추가합니다.',
      },
    ],
  },
  {
    step: 7,
    title: '동작 확인',
    where: '로컬 개발 환경',
    what: 'npm run dev → 로그인 페이지 → Google 로그인 클릭 → 대시보드 도착 확인',
    why: '설정이 올바른지 실제로 테스트합니다.',
    tip: '시크릿 모드에서 테스트하면 캐시 문제를 방지할 수 있습니다.',
    screenshots: [
      {
        alt: '로그인 플로우 전체 확인',
        illustration: googleIllustrations[7],
        caption: '로그인 페이지 → Google 동의 화면 → 대시보드 도착',
      },
    ],
  },
];
