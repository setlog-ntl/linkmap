'use client';

import type { StepData } from '../step-card-with-screenshot';
import { kakaoIllustrations } from './kakao-illustrations';

const IMG_BASE = '/img/guides/auth/kakao';
const SUPABASE_IMG = '/img/guides/auth/supabase';

export const kakaoSteps: StepData[] = [
  {
    step: 1,
    title: '카카오 앱 생성',
    where: '카카오 개발자 콘솔',
    whereUrl: 'https://developers.kakao.com',
    what: '내 애플리케이션 → 애플리케이션 추가하기 → 앱 이름, 사업자명 입력 → REST API 키 복사',
    why: 'REST API 키가 OAuth의 Client ID 역할을 합니다.',
    tip: 'REST API 키는 앱 요약 정보 페이지에서 확인할 수 있습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/01-console-main.png`,
        alt: '카카오 개발자 콘솔 — 앱 목록',
        illustration: kakaoIllustrations[1],
        annotations: [
          { type: 'click', x: 95, y: 15, number: 1, label: '+ 앱 생성' },
        ],
        caption: '내 애플리케이션에서 앱 생성 또는 선택',
      },
      {
        src: `${IMG_BASE}/01-rest-api-key.png`,
        alt: '플랫폼 키 — REST API 키 확인',
        annotations: [
          { type: 'highlight', x: 5, y: 75, width: 90, height: 10 },
        ],
        caption: 'REST API 키를 복사 (Client ID로 사용)',
      },
    ],
  },
  {
    step: 2,
    title: '카카오 로그인 활성화',
    where: '좌측 메뉴 > 카카오 로그인',
    what: '활성화 설정 → ON + OpenID Connect → 활성화',
    why: 'Supabase OIDC 연동을 위해 OpenID Connect가 반드시 필요합니다.',
    tip: 'OpenID Connect를 활성화하지 않으면 Supabase에서 토큰을 처리할 수 없습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/02-activation-toggle.png`,
        alt: '카카오 로그인 + OIDC 활성화',
        illustration: kakaoIllustrations[2],
        annotations: [
          { type: 'click', x: 80, y: 30, number: 1, label: '활성화' },
        ],
        caption: '로그인 활성화 + OpenID Connect ON',
      },
    ],
  },
  {
    step: 3,
    title: 'Redirect URI 등록',
    where: '카카오 로그인 > Redirect URI',
    what: 'Supabase 콜백 URL 등록: https://<ref>.supabase.co/auth/v1/callback',
    why: '인증 완료 후 사용자가 돌아올 주소를 미리 등록해야 합니다.',
    screenshots: [
      {
        alt: 'Redirect URI 입력',
        illustration: kakaoIllustrations[3],
        annotations: [
          { type: 'input', x: 10, y: 45, width: 75, height: 8, label: 'Redirect URI' },
        ],
        caption: 'Supabase 콜백 URL 입력 후 저장',
      },
    ],
  },
  {
    step: 4,
    title: '동의 항목 설정',
    where: '좌측 메뉴 > 동의항목',
    what: '닉네임: 필수, 이메일: 필수(비즈 앱 필요), 프로필 사진: 선택',
    why: '사용자 로그인 시 어떤 정보를 수집할지 정합니다.',
    tip: '이메일을 필수로 받으려면 먼저 "비즈 앱 전환"이 필요합니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/04-email-required.png`,
        alt: '동의항목 페이지 상단',
        illustration: kakaoIllustrations[4],
        caption: '동의항목 설정 페이지',
      },
      {
        src: `${IMG_BASE}/04-biz-app-switch.png`,
        alt: '동의항목 테이블 — 닉네임, 이메일 설정',
        annotations: [
          { type: 'highlight', x: 5, y: 50, width: 90, height: 12 },
        ],
        caption: '카카오계정(이메일) 항목을 필수 동의로 설정',
      },
    ],
  },
  {
    step: 5,
    title: 'Client Secret 생성',
    where: '카카오 로그인 > 보안',
    what: '코드 생성 → 시크릿 복사 → 활성화 상태: 사용함',
    why: 'Supabase Provider 등록에 필요한 비밀키입니다.',
    screenshots: [
      {
        alt: 'Client Secret 생성',
        illustration: kakaoIllustrations[5],
        annotations: [
          { type: 'click', x: 50, y: 50, number: 1, label: '코드 생성' },
        ],
        caption: '"코드 생성" 후 시크릿 복사',
      },
    ],
  },
  {
    step: 6,
    title: 'Supabase에 OIDC Provider 등록',
    where: 'Supabase Dashboard > Authentication > Providers',
    what: 'Custom OIDC Provider 추가 → Client ID(REST API 키), Secret, Issuer URL(https://kauth.kakao.com)',
    why: 'Supabase가 카카오 인증을 대행할 수 있도록 연결합니다.',
    tip: '"Skip nonce check"를 ON으로 설정하면 nonce 관련 오류를 방지할 수 있습니다.',
    screenshots: [
      {
        alt: 'Custom OIDC Provider 설정',
        illustration: kakaoIllustrations[6],
        annotations: [
          { type: 'input', x: 10, y: 25, width: 80, height: 7, label: 'Name (kakao)' },
        ],
        caption: 'OIDC Provider 정보 입력',
      },
    ],
  },
];
