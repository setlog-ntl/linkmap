import type { QuickEditQuestion } from './types';

export const personalBrandQuickEdits: QuickEditQuestion[] = [
  {
    id: 'pb-tagline',
    label: '한줄 소개 다듬기',
    emoji: '✍️',
    systemHint:
      'Rewrite the hero tagline to be more compelling and concise. Keep the same meaning but make it more professional and catchy. Provide both Korean and English versions.',
    targetModuleId: 'hero',
    targetFields: ['tagline', 'taglineEn'],
  },
  {
    id: 'pb-warm-color',
    label: '따뜻한 색감으로',
    emoji: '🎨',
    systemHint:
      'Change the gradient colors to warm tones (e.g. orange, coral, amber, rose). Return valid CSS hex color codes.',
    targetModuleId: 'hero',
    targetFields: ['gradientFrom', 'gradientTo'],
  },
  {
    id: 'pb-cool-color',
    label: '시원한 색감으로',
    emoji: '💎',
    systemHint:
      'Change the gradient colors to cool tones (e.g. blue, cyan, teal, indigo). Return valid CSS hex color codes.',
    targetModuleId: 'hero',
    targetFields: ['gradientFrom', 'gradientTo'],
  },
  {
    id: 'pb-about',
    label: '자기소개 윤문',
    emoji: '📝',
    systemHint:
      'Polish and refine the about/story text. Fix grammar, improve flow, and make it more engaging while preserving the original message. Provide both Korean and English versions.',
    targetModuleId: 'about',
    targetFields: ['story', 'storyEn'],
  },
  {
    id: 'pb-highlights',
    label: '통계 표현 개선',
    emoji: '📊',
    systemHint:
      'Improve the highlight/stat items. Make numbers more impactful and labels more concise. Keep the same data but present it better.',
    targetModuleId: 'highlights',
    targetFields: ['items'],
  },
];
