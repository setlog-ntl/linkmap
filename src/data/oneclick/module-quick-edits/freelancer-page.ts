import type { QuickEditQuestion } from './types';

export const freelancerPageQuickEdits: QuickEditQuestion[] = [
  {
    id: 'fp-tagline',
    label: '한줄 소개 다듬기',
    emoji: '✍️',
    systemHint:
      'Rewrite the hero tagline to be more compelling for a freelancer. Emphasize expertise and value proposition. Provide both Korean and English versions.',
    targetModuleId: 'hero',
    targetFields: ['tagline', 'taglineEn'],
  },
  {
    id: 'fp-warm-color',
    label: '따뜻한 색감으로',
    emoji: '🎨',
    systemHint:
      'Change the gradient colors to warm tones (e.g. orange, coral, amber, rose). Return valid CSS hex color codes.',
    targetModuleId: 'hero',
    targetFields: ['gradientFrom', 'gradientTo'],
  },
  {
    id: 'fp-cool-color',
    label: '시원한 색감으로',
    emoji: '💎',
    systemHint:
      'Change the gradient colors to cool tones (e.g. blue, cyan, teal, indigo). Return valid CSS hex color codes.',
    targetModuleId: 'hero',
    targetFields: ['gradientFrom', 'gradientTo'],
  },
  {
    id: 'fp-services',
    label: '서비스 설명 윤문',
    emoji: '📝',
    systemHint:
      'Polish the service descriptions. Make them more professional and client-focused. Highlight benefits over features.',
    targetModuleId: 'services',
    targetFields: ['items'],
  },
  {
    id: 'fp-process',
    label: '진행 단계 다듬기',
    emoji: '🔄',
    systemHint:
      'Improve the process/workflow step descriptions. Make them clearer and more reassuring for potential clients.',
    targetModuleId: 'process',
    targetFields: ['items'],
  },
];
