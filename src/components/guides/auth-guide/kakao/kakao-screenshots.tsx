'use client';

import type { StepData } from '../step-card-with-screenshot';
import { kakaoIllustrations } from './kakao-illustrations';

const IMG_BASE = '/img/guides/auth/kakao';
const SUPABASE_IMG = '/img/guides/auth/supabase';

export const kakaoSteps: StepData[] = [
  {
    step: 1,
    title: '카카오 앱 생성 + REST API 키 확인',
    where: '카카오 개발자 콘솔 > 내 애플리케이션',
    whereUrl: 'https://developers.kakao.com/console/app',
    what: '내 애플리케이션에서 기존 앱을 선택하거나 "+ 앱 생성"으로 새 앱을 만듭니다. 앱 선택 후 좌측 메뉴 "앱 설정 > 앱 > 플랫폼 키"에서 REST API 키를 복사합니다.',
    why: 'REST API 키가 OAuth의 Client ID 역할을 합니다.',
    tip: '좌측 사이드바에서 앱 설정 > 앱 > "플랫폼 키" 메뉴를 선택하면 REST API 키, JavaScript 키, 네이티브 앱 키를 모두 확인할 수 있습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/01-console-main.png`,
        alt: '카카오 개발자 콘솔 — 전체 앱 목록 + 앱 생성 버튼',
        illustration: kakaoIllustrations[1],
        annotations: [
          { type: 'click', x: 62, y: 8, number: 1, label: '+ 앱 생성' },
          { type: 'highlight', x: 13, y: 19, width: 37, height: 25 },
        ],
        caption: '"+ 앱 생성" 버튼으로 새 앱을 만들거나, 기존 앱 카드를 클릭하여 상세 설정으로 이동합니다.',
      },
      {
        src: `${IMG_BASE}/01-rest-api-key.png`,
        alt: '플랫폼 키 페이지 — REST API 키, JavaScript 키, 네이티브 앱 키 (마스킹)',
        annotations: [
          { type: 'click', x: 3, y: 22, number: 2, label: '좌측: 플랫폼 키' },
          { type: 'highlight', x: 19, y: 47, width: 33, height: 15 },
        ],
        caption: '좌측 "앱 > 플랫폼 키" 메뉴 선택 → "REST API 키"의 Default Rest API Key 값을 복사합니다. 이 값이 Supabase에서 Client ID로 사용됩니다.',
      },
    ],
  },
  {
    step: 2,
    title: '카카오 로그인 활성화 + OpenID Connect',
    where: '좌측 메뉴 > 제품 설정 > 카카오 로그인 > 일반',
    what: '"사용 설정" 토글을 ON으로 변경하고, 아래 "OpenID Connect" 토글도 ON으로 활성화합니다.',
    why: 'Supabase OIDC 연동을 위해 OpenID Connect가 반드시 필요합니다.',
    tip: '좌측 사이드바에서 "제품 설정 > 카카오 로그인" 을 펼치면 일반/동의항목/간편가입/고급 하위 메뉴가 나타납니다. "일반" 페이지에서 두 토글을 모두 ON으로 설정하세요.',
    screenshots: [
      {
        src: `${IMG_BASE}/02-activation-toggle.png`,
        alt: '카카오 로그인 일반 — 사용 설정(ON) + OpenID Connect(OFF→ON)',
        illustration: kakaoIllustrations[2],
        annotations: [
          { type: 'click', x: 6, y: 27, number: 1, label: '좌측: 카카오 로그인' },
          { type: 'highlight', x: 19, y: 41, width: 30, height: 5 },
          { type: 'highlight', x: 19, y: 63, width: 30, height: 5 },
        ],
        caption: '좌측 "카카오 로그인" 메뉴 선택 → "사용 설정" ON (이미 ON) + "OpenID Connect" 토글을 반드시 ON으로 변경',
      },
    ],
  },
  {
    step: 3,
    title: 'Redirect URI 등록',
    where: '카카오 로그인 > 일반 페이지 하단 또는 고급',
    what: 'Supabase 콜백 URL 등록: https://<ref>.supabase.co/auth/v1/callback',
    why: '인증 완료 후 사용자가 돌아올 주소를 미리 등록해야 합니다.',
    tip: '카카오 로그인 설정의 "Redirect URI" 섹션에서 등록합니다. 프로토콜(https), 후행 슬래시, 포트 번호까지 정확히 일치해야 합니다.',
    screenshots: [
      {
        alt: 'Redirect URI 입력 화면',
        illustration: kakaoIllustrations[3],
        annotations: [
          { type: 'input', x: 10, y: 45, width: 75, height: 8, label: 'Redirect URI' },
        ],
        caption: 'Supabase 콜백 URL(https://<ref>.supabase.co/auth/v1/callback)을 입력하고 저장',
      },
    ],
  },
  {
    step: 4,
    title: '동의 항목 설정',
    where: '좌측 메뉴 > 카카오 로그인 > 동의항목',
    what: '개인정보 테이블에서 닉네임을 "필수 동의", 카카오계정(이메일)을 "필수 동의"로 설정합니다.',
    why: '사용자 로그인 시 어떤 정보를 수집할지 정합니다.',
    tip: '이메일을 "필수 동의"로 설정하려면 먼저 "비즈 앱 전환"이 필요합니다. 앱 설정 > 비즈니스에서 개인 개발자 비즈 앱으로 전환하세요. 전환은 심사 없이 즉시 적용됩니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/04-email-required.png`,
        alt: '동의항목 전체 페이지 — 개인정보 테이블 (닉네임, 프로필 사진, 이메일 등)',
        illustration: kakaoIllustrations[4],
        annotations: [
          { type: 'click', x: 5, y: 16, number: 1, label: '좌측: 동의항목 메뉴' },
          { type: 'highlight', x: 11, y: 27, width: 55, height: 4 },
          { type: 'highlight', x: 11, y: 33, width: 55, height: 4 },
        ],
        caption: '좌측 "동의항목" 메뉴 선택 → 개인정보 테이블에서 닉네임과 카카오계정(이메일) 항목의 "설정" 버튼을 클릭하여 "필수 동의"로 변경',
      },
    ],
  },
  {
    step: 5,
    title: 'Client Secret 생성',
    where: '좌측 메뉴 > 카카오 로그인 > 보안',
    what: '"코드 생성" 버튼 클릭 → 생성된 시크릿 복사 → 활성화 상태: 사용함',
    why: 'Supabase Provider 등록에 필요한 비밀키입니다.',
    tip: '좌측 "카카오 로그인 > 고급" 또는 별도 "보안" 메뉴에서 Client Secret을 생성합니다. 생성 후 반드시 복사해 두세요.',
    screenshots: [
      {
        alt: 'Client Secret 생성 화면',
        illustration: kakaoIllustrations[5],
        annotations: [
          { type: 'click', x: 50, y: 50, number: 1, label: '코드 생성' },
        ],
        caption: '"코드 생성" 클릭 → 시크릿을 복사한 뒤 활성화 상태를 "사용함"으로 변경',
      },
    ],
  },
  {
    step: 6,
    title: 'Supabase에 Kakao Provider 등록',
    where: 'Supabase Dashboard > Authentication > Sign In / Providers',
    what: 'Auth Providers 목록에서 Kakao를 클릭 → 토글 ON → REST API 키(Client ID), Client Secret, Issuer URL(https://kauth.kakao.com) 입력',
    why: 'Supabase가 카카오 인증을 대행할 수 있도록 연결합니다.',
    tip: 'Supabase에서 Kakao는 기본 Provider로 제공됩니다. Providers 목록을 스크롤하여 "Kakao" 항목을 찾아 클릭하세요. "Skip nonce check"를 ON으로 설정하면 nonce 관련 오류를 방지할 수 있습니다.',
    screenshots: [
      {
        alt: 'Kakao Provider 설정 다이얼로그',
        illustration: kakaoIllustrations[6],
        annotations: [
          { type: 'input', x: 10, y: 25, width: 80, height: 7, label: 'Client ID (REST API 키)' },
          { type: 'input', x: 10, y: 38, width: 80, height: 7, label: 'Client Secret' },
        ],
        caption: 'Kakao Provider에서 REST API 키를 Client ID로, 생성한 시크릿을 Client Secret으로 입력 → Save',
      },
    ],
  },
];
