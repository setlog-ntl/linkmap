'use client';

import type { StepData } from '../step-card-with-screenshot';
import { kakaoIllustrations } from './kakao-illustrations';

const IMG_BASE = '/img/guides/auth/kakao';

export const kakaoSteps: StepData[] = [
  {
    step: 1,
    title: '카카오 앱 생성 + REST API 키 확인',
    where: '카카오 개발자 콘솔 > 내 애플리케이션',
    whereUrl: 'https://developers.kakao.com/console/app',
    what: '"+ 앱 생성"으로 새 앱을 만들거나 기존 앱을 선택합니다. 앱 > 플랫폼 키에서 REST API 키를 복사합니다.',
    why: 'REST API 키가 OAuth의 Client ID 역할을 합니다.',
    tip: '좌측 사이드바 "앱 > 플랫폼 키" 메뉴에서 REST API 키를 확인할 수 있습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/01-console-main.png`,
        alt: '카카오 개발자 콘솔 — 전체 앱 목록',
        illustration: kakaoIllustrations[1],
        annotations: [
          { type: 'click', x: 62, y: 9, number: 1, label: '+ 앱 생성' },
        ],
        masks: [
          { x: 85, y: 1, width: 5, height: 4, label: '프로필' },
        ],
        caption: '"+ 앱 생성" 버튼으로 새 앱 생성 또는 기존 앱 카드 클릭',
      },
      {
        src: `${IMG_BASE}/01-rest-api-key.png`,
        alt: '플랫폼 키 — REST API 키 (마스킹)',
        annotations: [
          { type: 'click', x: 4, y: 22, number: 2, label: '플랫폼 키 메뉴' },
          { type: 'highlight', x: 19, y: 45, width: 33, height: 13 },
        ],
        masks: [
          { x: 21, y: 50, width: 29, height: 3, label: 'REST API 키' },
          { x: 39, y: 50, width: 28, height: 3, label: 'JS 키' },
          { x: 57, y: 50, width: 28, height: 3, label: '네이티브 키' },
          { x: 85, y: 1, width: 5, height: 4, label: '프로필' },
        ],
        caption: '좌측 "앱 > 플랫폼 키" → REST API 키 복사 (Supabase Client ID로 사용)',
      },
    ],
  },
  {
    step: 2,
    title: '카카오 로그인 활성화 + OpenID Connect',
    where: '제품 설정 > 카카오 로그인 > 일반',
    what: '"사용 설정" ON + "OpenID Connect" ON 으로 두 토글 모두 활성화합니다.',
    why: 'Supabase OIDC 연동을 위해 OpenID Connect가 반드시 필요합니다.',
    tip: '좌측 "카카오 로그인" 메뉴를 펼치면 일반/동의항목/간편가입/고급 하위 메뉴가 나타납니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/02-activation-toggle.png`,
        alt: '카카오 로그인 일반 — 사용 설정(ON) + OpenID Connect(OFF→ON)',
        illustration: kakaoIllustrations[2],
        annotations: [
          { type: 'click', x: 5, y: 27, number: 1, label: '카카오 로그인 메뉴' },
          { type: 'highlight', x: 19, y: 42, width: 14, height: 4 },
          { type: 'highlight', x: 19, y: 64, width: 14, height: 4 },
        ],
        masks: [
          { x: 85, y: 1, width: 5, height: 4, label: '프로필' },
        ],
        caption: '좌측 "카카오 로그인" → "사용 설정" ON(이미 설정됨) + "OpenID Connect" 반드시 ON',
      },
    ],
  },
  {
    step: 3,
    title: 'Redirect URI 등록',
    where: '카카오 로그인 > 일반 또는 고급',
    what: 'Supabase 콜백 URL 등록: https://<ref>.supabase.co/auth/v1/callback',
    why: '인증 완료 후 사용자가 돌아올 주소를 미리 등록해야 합니다.',
    tip: '프로토콜(https), 후행 슬래시, 포트 번호까지 정확히 일치해야 합니다.',
    screenshots: [
      {
        alt: 'Redirect URI 입력 화면',
        illustration: kakaoIllustrations[3],
        caption: 'Supabase 콜백 URL(https://<ref>.supabase.co/auth/v1/callback)을 입력 후 저장',
      },
    ],
  },
  {
    step: 4,
    title: '동의 항목 설정',
    where: '카카오 로그인 > 동의항목',
    what: '닉네임: 필수, 카카오계정(이메일): 필수(비즈 앱 전환 필요), 프로필 사진: 선택',
    why: '사용자 로그인 시 어떤 정보를 수집할지 정합니다.',
    tip: '이메일 "필수 동의"는 비즈 앱 전환이 필요합니다. 앱 설정 > 비즈니스에서 전환하세요.',
    screenshots: [
      {
        src: `${IMG_BASE}/04-email-required.png`,
        alt: '동의항목 전체 페이지 — 개인정보 테이블',
        illustration: kakaoIllustrations[4],
        annotations: [
          { type: 'click', x: 5, y: 16, number: 1, label: '동의항목 메뉴' },
          { type: 'highlight', x: 11, y: 27, width: 55, height: 4 },
          { type: 'highlight', x: 11, y: 34, width: 55, height: 4 },
        ],
        masks: [
          { x: 85, y: 1, width: 5, height: 4, label: '프로필' },
        ],
        caption: '좌측 "동의항목" → 닉네임과 카카오계정(이메일) "설정" 버튼 클릭 → "필수 동의"로 변경',
      },
    ],
  },
  {
    step: 5,
    title: 'Client Secret 생성',
    where: '카카오 로그인 > 보안 또는 고급',
    what: '"코드 생성" 클릭 → 시크릿 복사 → 활성화 상태: 사용함',
    why: 'Supabase Provider 등록에 필요한 비밀키입니다.',
    tip: '생성 후 반드시 복사해 두세요. 페이지를 벗어나면 다시 확인할 수 없습니다.',
    screenshots: [
      {
        alt: 'Client Secret 생성 화면',
        illustration: kakaoIllustrations[5],
        caption: '"코드 생성" 클릭 → 시크릿 복사 → 활성화 "사용함"',
      },
    ],
  },
  {
    step: 6,
    title: 'Supabase에 Kakao Provider 등록',
    where: 'Supabase Dashboard > Authentication > Sign In / Providers',
    what: 'Providers 목록에서 Kakao 클릭 → 토글 ON → REST API 키(Client ID), Client Secret 입력',
    why: 'Supabase가 카카오 인증을 대행할 수 있도록 연결합니다.',
    tip: '"Skip nonce check" ON 설정으로 nonce 오류를 방지하세요.',
    screenshots: [
      {
        alt: 'Kakao Provider 설정 다이얼로그',
        illustration: kakaoIllustrations[6],
        caption: 'Kakao Provider: REST API 키 → Client ID, 시크릿 → Client Secret 입력 → Save',
      },
    ],
  },
];
