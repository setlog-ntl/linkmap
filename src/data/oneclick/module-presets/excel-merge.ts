import type { ModulePreset } from './personal-brand';

/**
 * 나만의 엑셀자동화(excel-merge) 룩 프리셋
 *
 * 도구형 템플릿이라 theme 모듈의 accent + bgStyle 조합만 바꾼다.
 * - accent: 배지·버튼·단계 번호 강조색 (generateExcelMergePresetCss의 --em-accent)
 * - bgStyle: 페이지 밝기 (light/dark)
 */
export const excelMergePresets: ModulePreset[] = [
  {
    id: 'office-teal',
    name: '오피스 틸',
    nameEn: 'Office Teal',
    description: '밝은 배경 + 틸 포인트 — 차분하고 실무적인 기본 룩',
    descriptionEn: 'Light background with teal accent — calm, practical default',
    colors: ['#0f766e', '#14b8a6'],
    state: { values: { theme: { accent: '#0f766e', bgStyle: 'light' } } },
  },
  {
    id: 'business-blue',
    name: '비즈니스 블루',
    nameEn: 'Business Blue',
    description: '밝은 배경 + 파란색 포인트 — 사내 공유용 신뢰감 룩',
    descriptionEn: 'Light background with blue accent — trustworthy office look',
    colors: ['#2563eb', '#60a5fa'],
    state: { values: { theme: { accent: '#2563eb', bgStyle: 'light' } } },
  },
  {
    id: 'forest-green',
    name: '포레스트 그린',
    nameEn: 'Forest Green',
    description: '밝은 배경 + 진초록 포인트 — 스프레드시트와 어울리는 그린',
    descriptionEn: 'Light background with deep green accent — spreadsheet green',
    colors: ['#15803d', '#4ade80'],
    state: { values: { theme: { accent: '#15803d', bgStyle: 'light' } } },
  },
  {
    id: 'midnight-teal',
    name: '미드나잇 틸',
    nameEn: 'Midnight Teal',
    description: '다크 배경 + 연한 틸 포인트 — 눈이 편한 야간 작업 룩',
    descriptionEn: 'Dark background with light teal accent — easy on the eyes',
    colors: ['#2dd4bf', '#0b1220'],
    state: { values: { theme: { accent: '#2dd4bf', bgStyle: 'dark' } } },
  },
];
