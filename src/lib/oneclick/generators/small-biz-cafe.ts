// ──────────────────────────────────────────────
// Small Biz Cafe Generator
// ──────────────────────────────────────────────

import { createSmallBizGenerator } from './base-generator';

export const smallBizCafeGenerator = createSmallBizGenerator('small-biz-cafe', {
  name: '온기 로스터리',
  nameEn: 'Ongi Roastery',
  description: '매일 아침, 직접 로스팅한 한 잔의 커피',
  descriptionEn: 'A cup of freshly roasted coffee every morning',
  phone: '02-338-1204',
  primaryColor: '#8b6914',
  address: '서울 마포구 연남로 23길 8, 1층',
  addressEn: '1F, 8, Yeonnam-ro 23-gil, Mapo-gu, Seoul',
  defaultEmoji: '☕',
});
