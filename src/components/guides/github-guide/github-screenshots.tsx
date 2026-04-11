'use client';

import type { StepData } from '../auth-guide/step-card-with-screenshot';
import { githubIllustrations } from './github-illustrations';

const IMG = '/img/guides/github';

/**
 * git-setup 서브 가이드용 스텝 데이터
 * - install-git, signup, ssh, config 섹션에 매핑
 */
export const gitSetupSteps: StepData[] = [
  {
    step: 1,
    title: 'Git 다운로드 및 설치',
    where: 'git-scm.com',
    whereUrl: 'https://git-scm.com/downloads',
    what: 'OS에 맞는 Git 설치 파일을 다운로드하여 설치합니다.',
    why: 'Git이 있어야 코드를 버전 관리하고 GitHub에 push할 수 있습니다.',
    tip: 'Windows는 설치 중 모든 옵션을 기본값으로 유지하세요. GitHub Desktop을 설치하면 Git이 자동 포함됩니다.',
    screenshots: [
      {
        src: `${IMG}/02-git-download-main.png`,
        alt: 'Git 다운로드 메인 페이지 — OS별 설치 파일 선택',
        illustration: githubIllustrations['git-download'],
        annotations: [
          { type: 'click', x: 38, y: 27, number: 1, label: 'Windows 탭 클릭' },
          { type: 'click', x: 45, y: 27, number: 2, label: 'macOS 탭' },
          { type: 'click', x: 52, y: 27, number: 3, label: 'Linux 탭' },
        ],
        caption: 'git-scm.com/downloads에서 Windows/macOS/Linux 탭을 선택하여 다운로드',
      },
    ],
  },
  {
    step: 2,
    title: 'GitHub 가입',
    where: 'github.com/signup',
    whereUrl: 'https://github.com/signup',
    what: '이메일, 비밀번호, 사용자 이름을 입력하고 무료 계정을 만듭니다.',
    why: 'GitHub에 코드를 저장하고 공유하려면 계정이 필요합니다.',
    tip: '사용자 이름은 GitHub URL에 포함됩니다 (github.com/my-name). 짧고 기억하기 쉬운 이름을 추천합니다.',
    screenshots: [
      {
        src: `${IMG}/01-signup-page.png`,
        alt: 'GitHub 가입 페이지 — 이메일, 비밀번호, 사용자 이름 입력',
        illustration: githubIllustrations['signup'],
        annotations: [
          { type: 'input', x: 56, y: 40, width: 34, height: 5, label: 'Email' },
          { type: 'input', x: 56, y: 52, width: 34, height: 5, label: 'Password' },
          { type: 'input', x: 56, y: 67, width: 34, height: 5, label: 'Username' },
        ],
        caption: 'Email → Password → Username → Country 선택 후 Continue',
      },
    ],
  },
  {
    step: 3,
    title: 'SSH 키 생성 및 등록',
    where: 'Terminal + GitHub Settings',
    whereUrl: 'https://github.com/settings/keys',
    what: 'SSH 키를 생성하고 GitHub에 등록하면 비밀번호 없이 push/pull할 수 있습니다.',
    why: 'GitHub은 HTTPS 비밀번호 인증을 지원하지 않습니다. SSH 키 인증이 가장 안전하고 편리합니다.',
    tip: 'GitHub Desktop을 사용하면 이 단계를 건너뛸 수 있습니다.',
    screenshots: [
      {
        alt: '터미널에서 SSH 키 생성 명령어 실행',
        illustration: githubIllustrations['ssh-keygen'],
        caption: 'ssh-keygen으로 Ed25519 키 생성 → cat으로 공개 키 확인',
      },
      {
        alt: 'GitHub Settings에서 SSH 키 등록',
        illustration: githubIllustrations['ssh-github'],
        caption: 'Settings > SSH keys > New SSH key에 공개 키 붙여넣기',
      },
    ],
  },
  {
    step: 4,
    title: 'SSH 연결 테스트',
    where: 'Terminal',
    what: 'SSH가 올바르게 설정되었는지 확인합니다.',
    why: '설정이 제대로 되었는지 확인해야 나중에 push할 때 오류가 발생하지 않습니다.',
    screenshots: [
      {
        alt: 'SSH 연결 테스트 성공 화면',
        illustration: githubIllustrations['ssh-test'],
        caption: '"Hi username!" 메시지가 나오면 SSH 설정 완료',
      },
    ],
  },
  {
    step: 5,
    title: 'git config 기본 설정',
    where: 'Terminal',
    what: '커밋에 기록될 이름과 이메일을 설정합니다.',
    why: 'GitHub 가입 이메일과 동일하게 설정해야 커밋이 프로필에 연결됩니다.',
    tip: '--global 옵션으로 한 번만 설정하면 모든 저장소에 적용됩니다.',
    screenshots: [
      {
        alt: 'git config 설정 명령어',
        illustration: githubIllustrations['git-config'],
        caption: 'user.name, user.email, init.defaultBranch 설정 후 git config --list로 확인',
      },
    ],
  },
];
