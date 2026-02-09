import ko from './locales/ko.json';
import en from './locales/en.json';

export type Locale = 'ko' | 'en';

const messages: Record<Locale, typeof ko> = { ko, en };

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export function getMessages(locale: Locale = 'ko') {
  return messages[locale] || messages.ko;
}

export function t(locale: Locale, path: string): string {
  const msgs = getMessages(locale);
  const keys = path.split('.');
  let result: unknown = msgs;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof result === 'string' ? result : path;
}
