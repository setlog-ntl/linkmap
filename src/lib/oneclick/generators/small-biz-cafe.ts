// ──────────────────────────────────────────────
// Small Biz Cafe Generator
// ──────────────────────────────────────────────

import {
  createSmallBizGenerator,
  esc,
  extractSiteBlock,
  createExtractors,
  parseJsonArrayArg,
} from './base-generator';
import type { ModuleConfigState } from '@/lib/module-schema';

// ─── About(소개) config emit·parse ──────────────
// base-generator는 about 모듈을 다루지 않으므로 cafe 전용 훅으로 처리.
// 배포 컴포넌트(about-section.tsx)가 기대하는 키: aboutTitle / aboutStories(string[]) /
// aboutTags(string[]) / aboutValues(AboutValue[]).

function cafeAboutTypes(): string {
  return `export interface AboutValue {
  icon: string;
  title: string;
  desc: string;
}`;
}

function cafeAboutFields(state: ModuleConfigState): string {
  const about = state.values.about || {};
  const title = (about.title as string) || '';
  const stories = ((about.stories as Array<Record<string, unknown>>) || [])
    .map((s) => String(s.text ?? ''))
    .filter(Boolean);
  const tags = ((about.tags as Array<Record<string, unknown>>) || [])
    .map((t) => String(t.tag ?? ''))
    .filter(Boolean);
  const values = ((about.values as Array<Record<string, unknown>>) || []).map((v) => ({
    icon: String(v.icon ?? ''),
    title: String(v.title ?? ''),
    desc: String(v.desc ?? ''),
  }));

  return `  aboutTitle: process.env.NEXT_PUBLIC_ABOUT_TITLE || '${esc(title)}',
  aboutStories: parseJSON<string[]>(process.env.NEXT_PUBLIC_ABOUT_STORIES, ${JSON.stringify(stories)}),
  aboutTags: parseJSON<string[]>(process.env.NEXT_PUBLIC_ABOUT_TAGS, ${JSON.stringify(tags)}),
  aboutValues: parseJSON<AboutValue[]>(process.env.NEXT_PUBLIC_ABOUT_VALUES, ${JSON.stringify(values)}),`;
}

function cafeAboutParse(configContent: string, state: ModuleConfigState): void {
  const siteBlock = extractSiteBlock(configContent);
  const { extractString } = createExtractors(siteBlock);

  const title = extractString('aboutTitle');
  if (title !== null) state.values.about.title = title;

  const stories = parseJsonArrayArg(configContent, 'NEXT_PUBLIC_ABOUT_STORIES');
  if (stories) {
    state.values.about.stories = stories.map((text) => ({ text: String(text) }));
  }

  const tags = parseJsonArrayArg(configContent, 'NEXT_PUBLIC_ABOUT_TAGS');
  if (tags) {
    state.values.about.tags = tags.map((tag) => ({ tag: String(tag) }));
  }

  const values = parseJsonArrayArg(configContent, 'NEXT_PUBLIC_ABOUT_VALUES');
  if (values) {
    state.values.about.values = values.map((v) => {
      const o = (v ?? {}) as Record<string, unknown>;
      return {
        icon: String(o.icon ?? ''),
        title: String(o.title ?? ''),
        desc: String(o.desc ?? ''),
      };
    });
  }
}

export const smallBizCafeGenerator = createSmallBizGenerator(
  'small-biz-cafe',
  {
    name: '카페 라이츠',
    nameEn: 'Kafe Wrights',
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
    extraConfig: {
      types: cafeAboutTypes,
      fields: cafeAboutFields,
      parse: cafeAboutParse,
    },
  }
);
