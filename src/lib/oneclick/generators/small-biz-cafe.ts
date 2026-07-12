// ──────────────────────────────────────────────
// Small Biz Cafe Generator
// ──────────────────────────────────────────────

import { createSmallBizGenerator } from './base-generator';

export const smallBizCafeGenerator = createSmallBizGenerator(
  'small-biz-cafe',
  {
    name: '카페 라이츠',
    nameEn: 'Cafe Wrights',
    description: '모던한 인테리어와 어우러진 감성 카페',
    descriptionEn: 'A cozy cafe with a modern interior',
    phone: '0507-1485-8892',
    primaryColor: '#8b6914',
    address: '서울 광진구 동일로20길 114 1,2,3층',
    addressEn: '114, Dongil-ro 20-gil, Gwangjin-gu, Seoul',
    defaultEmoji: '☕',
  },
  {
    extraModuleComponents: {
      about: {
        importName: 'AboutSection',
        importPath: '@/components/about-section',
        render: '        <AboutSection config={siteConfig} />',
      },
    },
    extraImportMap: {
      AboutSection: 'about',
    },
  }
);
