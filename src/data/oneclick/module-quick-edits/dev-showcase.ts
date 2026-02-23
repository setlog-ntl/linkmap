import type { QuickEditQuestion } from './types';

export const devShowcaseQuickEdits: QuickEditQuestion[] = [
  {
    id: 'ds-tagline',
    label: '한줄 소개 다듬기',
    emoji: '✍️',
    systemHint:
      'Rewrite the hero tagline to be more compelling for a developer portfolio. Keep it professional and memorable. Provide both Korean and English versions.',
    targetModuleId: 'hero',
    targetFields: ['tagline', 'taglineEn'],
  },
  {
    id: 'ds-typing',
    label: '타이핑 텍스트 추천',
    emoji: '⌨️',
    systemHint:
      'Suggest creative typing animation words for a developer portfolio hero section. Return an array of 3-5 short phrases that showcase developer identity (e.g. tech stack, roles, passions).',
    targetModuleId: 'hero',
    targetFields: ['typingWords'],
  },
  {
    id: 'ds-about',
    label: '자기소개 윤문',
    emoji: '📝',
    systemHint:
      'Polish and refine the developer bio/story. Make it more professional and engaging for potential employers or collaborators. Provide both Korean and English versions.',
    targetModuleId: 'about',
    targetFields: ['story', 'storyEn'],
  },
  {
    id: 'ds-theme',
    label: '다른 코드 테마로',
    emoji: '🌙',
    systemHint:
      'Suggest a different code/design preset theme. Pick from common developer-friendly themes and return the preset identifier.',
    targetModuleId: 'hero',
    targetFields: ['designPreset'],
  },
];
