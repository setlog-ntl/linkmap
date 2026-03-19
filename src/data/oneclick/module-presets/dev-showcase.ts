import type { ModulePreset } from './personal-brand';

export const devShowcasePresets: ModulePreset[] = [
  {
    id: 'github-dark',
    name: 'GitHub 다크',
    nameEn: 'GitHub Dark',
    description: 'GitHub 시그니처 블루 — 개발자 기본 테마',
    descriptionEn: 'GitHub signature blue — default developer theme',
    colors: ['#58a6ff', '#79c0ff'],
    state: {
      values: {
        hero: { designPreset: 'github-dark' },
      },
    },
  },
  {
    id: 'vscode',
    name: 'VS Code',
    nameEn: 'VS Code',
    description: 'VS Code 블루 — 에디터 감성',
    descriptionEn: 'VS Code blue — editor aesthetic',
    colors: ['#007acc', '#3794ff'],
    state: {
      values: {
        hero: { designPreset: 'vscode' },
      },
    },
  },
  {
    id: 'dracula',
    name: '드라큘라',
    nameEn: 'Dracula',
    description: '퍼플+핑크 — 인기 에디터 테마',
    descriptionEn: 'Purple + pink — popular editor theme',
    colors: ['#bd93f9', '#ff79c6'],
    state: {
      values: {
        hero: { designPreset: 'dracula' },
      },
    },
  },
  {
    id: 'terminal',
    name: '터미널 그린',
    nameEn: 'Terminal Green',
    description: '에메랄드 그린 — 해커 감성 터미널 무드',
    descriptionEn: 'Emerald green — hacker aesthetic terminal mood',
    colors: ['#10b981', '#34d399'],
    state: {
      values: {
        hero: { designPreset: 'terminal' },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇',
    nameEn: 'Midnight',
    description: '인디고+퍼플 — 몰입감 있는 다크 모드',
    descriptionEn: 'Indigo + purple — immersive dark mode',
    colors: ['#818cf8', '#c084fc'],
    state: {
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
