import type { QuickEditQuestion } from './types';

export const smallBizQuickEdits: QuickEditQuestion[] = [
  {
    id: 'sb-description',
    label: '가게 소개 다듬기',
    emoji: '✍️',
    systemHint:
      'Rewrite the store/shop description to be more inviting and warm. Highlight what makes this business special. Provide both Korean and English versions.',
    targetModuleId: 'hero',
    targetFields: ['description', 'descriptionEn'],
  },
  {
    id: 'sb-color',
    label: '가게 색상 추천',
    emoji: '🎨',
    systemHint:
      'Suggest a primary color that matches the business type and atmosphere. Return a valid CSS hex color code.',
    targetModuleId: 'hero',
    targetFields: ['primaryColor'],
  },
  {
    id: 'sb-menu',
    label: '메뉴 설명 윤문',
    emoji: '📝',
    systemHint:
      'Polish the menu item descriptions. Make them more appetizing and descriptive while keeping them concise.',
    targetModuleId: 'menu',
    targetFields: ['items'],
  },
  {
    id: 'sb-hours',
    label: '영업시간 정리',
    emoji: '🕐',
    systemHint:
      'Clean up and standardize the business hours format. Use consistent formatting (e.g. 09:00 - 21:00) and group similar days.',
    targetModuleId: 'hours',
    targetFields: ['items'],
  },
];
