import { describe, it, expect } from 'vitest';
import {
  buildEnvKeyServiceMap,
  buildEnvPrefixServiceMap,
  matchEnvKeyToServiceFuzzy,
} from '@/lib/utils/env-service-matcher';
import type { Service } from '@/types';

// 테스트용 최소 서비스 mock
function createMockService(overrides: Partial<Service> & { id: string; name: string; slug: string }): Service {
  return {
    category: 'other',
    description: null,
    description_ko: null,
    icon_url: null,
    website_url: null,
    docs_url: null,
    pricing_info: {},
    required_env_vars: [],
    ...overrides,
  } as Service;
}

describe('env-service-matcher', () => {
  describe('buildEnvKeyServiceMap — exact match', () => {
    it('required_env_vars의 name으로 정확 매칭 맵 생성', () => {
      const services = [
        createMockService({
          id: 'svc-1', name: 'Polar', slug: 'polar',
          required_env_vars: [
            { name: 'POLAR_ACCESS_TOKEN', public: false, description: '' },
            { name: 'NEXT_PUBLIC_POLAR_PRODUCT_PRO', public: true, description: '' },
          ],
        }),
      ];
      const map = buildEnvKeyServiceMap(services);
      expect(map.get('POLAR_ACCESS_TOKEN')).toEqual({ serviceId: 'svc-1', serviceName: 'Polar' });
      expect(map.get('NEXT_PUBLIC_POLAR_PRODUCT_PRO')).toEqual({ serviceId: 'svc-1', serviceName: 'Polar' });
      expect(map.get('RANDOM_KEY')).toBeUndefined();
    });
  });

  describe('buildEnvPrefixServiceMap — prefix match', () => {
    it('0차 패스: slug/name 자체를 prefix로 등록 (required_env_vars 없어도)', () => {
      const services = [
        createMockService({
          id: 'svc-1', name: 'Polar', slug: 'polar',
          required_env_vars: [],  // env vars 없음
        }),
      ];
      const map = buildEnvPrefixServiceMap(services);
      expect(map.get('POLAR')).toEqual({ serviceId: 'svc-1', serviceName: 'Polar' });
    });

    it('slug과 name이 다른 경우 둘 다 등록', () => {
      const services = [
        createMockService({
          id: 'svc-1', name: 'AWS S3', slug: 'aws-s3',
          required_env_vars: [
            { name: 'AWS_ACCESS_KEY_ID', public: false, description: '' },
          ],
        }),
      ];
      const map = buildEnvPrefixServiceMap(services);
      // slug 정리: 'aws-s3' → toUpperCase → 'AWS-S3' — 하이픈 포함이므로 prefix로 사용 불가
      // name 정리: 'AWS S3' → 'AWSS3' (공백·특문 제거)
      expect(map.get('AWSS3')).toEqual({ serviceId: 'svc-1', serviceName: 'AWS S3' });
      // env var 기반: AWS_ACCESS_KEY_ID → first segment = AWS
      expect(map.get('AWS')).toEqual({ serviceId: 'svc-1', serviceName: 'AWS S3' });
    });

    it('1차 패스: 서비스 slug/name과 일치하는 env var prefix가 우선', () => {
      const services = [
        createMockService({
          id: 'svc-stripe', name: 'Stripe', slug: 'stripe',
          required_env_vars: [
            { name: 'STRIPE_SECRET_KEY', public: false, description: '' },
          ],
        }),
        createMockService({
          id: 'svc-other', name: 'Other', slug: 'other',
          required_env_vars: [
            { name: 'STRIPE_PLUGIN_KEY', public: false, description: '' },
          ],
        }),
      ];
      const map = buildEnvPrefixServiceMap(services);
      // STRIPE prefix는 Stripe 서비스가 소유 (slug 일치)
      expect(map.get('STRIPE')?.serviceId).toBe('svc-stripe');
    });
  });

  describe('matchEnvKeyToServiceFuzzy — 통합 매칭', () => {
    const services = [
      createMockService({
        id: 'svc-polar', name: 'Polar', slug: 'polar',
        required_env_vars: [
          { name: 'POLAR_ACCESS_TOKEN', public: false, description: '' },
          { name: 'NEXT_PUBLIC_POLAR_PRODUCT_PRO', public: true, description: '' },
        ],
      }),
      createMockService({
        id: 'svc-cf', name: 'Cloudflare', slug: 'cloudflare',
        required_env_vars: [
          { name: 'CLOUDFLARE_API_TOKEN', public: false, description: '' },
        ],
      }),
    ];

    const exactMap = buildEnvKeyServiceMap(services);
    const prefixMap = buildEnvPrefixServiceMap(services);

    it('exact match: POLAR_ACCESS_TOKEN → Polar (exact)', () => {
      const result = matchEnvKeyToServiceFuzzy('POLAR_ACCESS_TOKEN', exactMap, prefixMap);
      expect(result).toEqual({ serviceId: 'svc-polar', serviceName: 'Polar', confidence: 'exact' });
    });

    it('exact match: NEXT_PUBLIC_POLAR_PRODUCT_PRO → Polar (exact)', () => {
      const result = matchEnvKeyToServiceFuzzy('NEXT_PUBLIC_POLAR_PRODUCT_PRO', exactMap, prefixMap);
      expect(result).toEqual({ serviceId: 'svc-polar', serviceName: 'Polar', confidence: 'exact' });
    });

    it('prefix match: NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY → Polar (prefix)', () => {
      // 이 키는 exact map에 없지만 prefix POLAR로 매칭
      const result = matchEnvKeyToServiceFuzzy('NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY', exactMap, prefixMap);
      expect(result).toEqual({ serviceId: 'svc-polar', serviceName: 'Polar', confidence: 'prefix' });
    });

    it('prefix match: CLOUDFLARE_ZONE_ID → Cloudflare (prefix)', () => {
      const result = matchEnvKeyToServiceFuzzy('CLOUDFLARE_ZONE_ID', exactMap, prefixMap);
      expect(result).toEqual({ serviceId: 'svc-cf', serviceName: 'Cloudflare', confidence: 'prefix' });
    });

    it('프레임워크 접두사 제거: REACT_APP_POLAR_KEY → Polar (prefix)', () => {
      const result = matchEnvKeyToServiceFuzzy('REACT_APP_POLAR_KEY', exactMap, prefixMap);
      expect(result).toEqual({ serviceId: 'svc-polar', serviceName: 'Polar', confidence: 'prefix' });
    });

    it('VITE_ 접두사 제거: VITE_CLOUDFLARE_TOKEN → Cloudflare (prefix)', () => {
      const result = matchEnvKeyToServiceFuzzy('VITE_CLOUDFLARE_TOKEN', exactMap, prefixMap);
      expect(result).toEqual({ serviceId: 'svc-cf', serviceName: 'Cloudflare', confidence: 'prefix' });
    });

    it('매칭 불가: RANDOM_UNKNOWN_KEY → null', () => {
      const result = matchEnvKeyToServiceFuzzy('RANDOM_UNKNOWN_KEY', exactMap, prefixMap);
      expect(result).toBeNull();
    });

    it('required_env_vars 없는 서비스도 slug로 매칭', () => {
      const noEnvServices = [
        createMockService({
          id: 'svc-midjourney', name: 'Midjourney', slug: 'midjourney',
          required_env_vars: [],
        }),
      ];
      const eMap = buildEnvKeyServiceMap(noEnvServices);
      const pMap = buildEnvPrefixServiceMap(noEnvServices);
      const result = matchEnvKeyToServiceFuzzy('MIDJOURNEY_API_KEY', eMap, pMap);
      expect(result).toEqual({ serviceId: 'svc-midjourney', serviceName: 'Midjourney', confidence: 'prefix' });
    });
  });
});
