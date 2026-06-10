'use client';

import {
  KeyRound,
  Fingerprint,
  IdCard,
  Lock,
  Undo2,
  Building2,
  Ticket,
  ScanEye,
  ShieldCheck,
  ShieldAlert,
  TableProperties,
  ArrowRightLeft,
} from 'lucide-react';
import { GlossarySection as CommonGlossarySection, type GlossaryEntry } from '@/components/guides/common';

const glossary: GlossaryEntry[] = [
  {
    term: 'OAuth',
    icon: KeyRound,
    metaphor: '대리 열쇠',
    description:
      '비밀번호를 알려주지 않고 권한만 위임하는 인증 방식. "Google로 로그인"이 대표적.',
  },
  {
    term: 'API Key',
    icon: Fingerprint,
    metaphor: '건물 출입증',
    description:
      '외부 서비스에 접근할 수 있는 고유 문자열. 발급받아 환경변수에 저장합니다.',
  },
  {
    term: 'Client ID',
    icon: IdCard,
    metaphor: '앱 주민등록번호',
    description:
      '내 앱을 식별하는 공개 ID. 카카오에서는 REST API 키가 이 역할을 합니다.',
  },
  {
    term: 'Client Secret',
    icon: Lock,
    metaphor: '앱 비밀번호',
    description:
      'Client ID와 짝을 이루는 비밀키. 서버에만 보관하며 절대 클라이언트에 노출하면 안 됩니다.',
  },
  {
    term: '콜백 URL',
    icon: Undo2,
    metaphor: '반송 주소',
    description:
      '인증이 끝나면 사용자가 돌아올 주소. 미리 등록해야 하며, 정확히 일치해야 합니다.',
  },
  {
    term: 'Provider',
    icon: Building2,
    metaphor: '인증 대행사',
    description:
      '인증을 제공하는 외부 서비스. Google, 카카오, GitHub 등이 해당됩니다.',
  },
  {
    term: '세션 (Session)',
    icon: Ticket,
    metaphor: '놀이공원 팔찌',
    description:
      '로그인 상태를 유지하는 임시 정보. 브라우저를 닫거나 시간이 지나면 만료됩니다.',
  },
  {
    term: '스코프 (Scope)',
    icon: ScanEye,
    metaphor: '접근 범위',
    description:
      'OAuth 시 요청하는 정보 범위. email, profile 등 필요한 것만 요청합니다.',
  },
  {
    term: 'JWT',
    icon: ShieldCheck,
    metaphor: '디지털 신분증',
    description:
      'JSON Web Token. 사용자 정보를 암호화한 토큰으로, 서버 없이도 인증 상태를 확인할 수 있습니다.',
  },
  {
    term: 'PKCE',
    icon: ShieldAlert,
    metaphor: '보안 강화 인증',
    description:
      'Proof Key for Code Exchange. 모바일/SPA 환경에서 인가 코드 가로채기를 방지하는 보안 메커니즘.',
  },
  {
    term: 'RLS',
    icon: TableProperties,
    metaphor: '행 수준 보안',
    description:
      'Row Level Security. DB 테이블의 각 행에 접근 정책을 설정해 사용자별 데이터를 보호합니다.',
  },
  {
    term: '리디렉션',
    icon: ArrowRightLeft,
    metaphor: '자동 이동',
    description:
      '인증 과정에서 페이지를 자동으로 이동시키는 것. 로그인 → 외부 인증 → 콜백 순으로 일어납니다.',
  },
];

export function GlossarySection() {
  return (
    <CommonGlossarySection
      items={glossary}
      title="인증 용어 사전"
      description="인증 관련 용어가 헷갈릴 때 참고하세요. 일상적인 비유와 함께 설명합니다."
      accent="purple"
    />
  );
}
