import type { QuickEditQuestion } from './types';

export const digitalNamecardQuickEdits: QuickEditQuestion[] = [
  {
    id: 'dn-title',
    label: '직함 다듬기',
    emoji: '✍️',
    systemHint:
      'Rewrite the job title to be more professional and impactful. Keep it concise but descriptive. Provide both Korean and English versions.',
    targetModuleId: 'profile',
    targetFields: ['title', 'titleEn'],
  },
  {
    id: 'dn-color',
    label: '명함 색상 추천',
    emoji: '🎨',
    systemHint:
      'Suggest a professional accent color for a digital business card. Return a valid CSS hex color code that conveys trust and professionalism.',
    targetModuleId: 'theme',
    targetFields: ['accentColor'],
  },
  {
    id: 'dn-phone',
    label: '연락처 형식 정리',
    emoji: '📱',
    systemHint:
      'Format the phone number in a clean, standard format (e.g. 010-1234-5678 for Korean numbers, +82-10-1234-5678 for international).',
    targetModuleId: 'contact',
    targetFields: ['phone'],
  },
];
