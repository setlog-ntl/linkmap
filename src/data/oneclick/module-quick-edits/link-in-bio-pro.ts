import type { QuickEditQuestion } from './types';

export const linkInBioProQuickEdits: QuickEditQuestion[] = [
  {
    id: 'lib-bio',
    label: '프로필 소개 다듬기',
    emoji: '📝',
    systemHint:
      'Rewrite the profile bio to be more engaging and concise. Perfect for social media link pages. Provide both Korean and English versions.',
    targetModuleId: 'profile',
    targetFields: ['bio', 'bioEn'],
  },
  {
    id: 'lib-theme-color',
    label: '테마 색상 추천',
    emoji: '🎨',
    systemHint:
      'Suggest a fresh, trendy primary color for the link-in-bio page. Return a valid CSS hex color code that works well for buttons and accents.',
    targetModuleId: 'theme',
    targetFields: ['primaryColor'],
  },
  {
    id: 'lib-card-style',
    label: '카드 스타일 변경',
    emoji: '🃏',
    systemHint:
      'Suggest different card and background style combination. Pick visually appealing options that complement each other.',
    targetModuleId: 'theme',
    targetFields: ['cardStyle', 'bgStyle'],
  },
  {
    id: 'lib-link-emoji',
    label: '링크 이모지 추천',
    emoji: '✨',
    systemHint:
      'Suggest better emojis for each link item based on the link titles/URLs. Make them more visually descriptive and fun.',
    targetModuleId: 'links',
    targetFields: ['items'],
  },
  {
    id: 'lib-layout-style',
    label: '폰트 조합 추천',
    emoji: '🔤',
    systemHint:
      'Based on the current bgStyle and cardStyle, recommend the most suitable fontFamily option from: system, serif, mono, display. Explain briefly why the font matches the visual style (e.g., mono pairs well with neon-dark for a tech/indie aesthetic). Return only one of the four values as fontFamily.',
    targetModuleId: 'theme',
    targetFields: ['fontFamily'],
  },
];
