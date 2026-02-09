export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import type { Profile } from '@/types';

const plans = [
  {
    name: 'Free',
    nameKo: '무료',
    price: '0',
    period: '',
    features: [
      '프로젝트 3개',
      '프로젝트당 환경변수 20개',
      '프로젝트당 서비스 10개',
      '기본 암호화',
      '커뮤니티 지원',
    ],
    cta: '현재 플랜',
    popular: false,
  },
  {
    name: 'Pro',
    nameKo: '프로',
    price: '9,900',
    period: '/월',
    features: [
      '프로젝트 20개',
      '프로젝트당 환경변수 100개',
      '프로젝트당 서비스 50개',
      '고급 암호화 + 감사 로그',
      '우선 지원',
      '.env 동기화',
    ],
    cta: '업그레이드',
    popular: true,
  },
  {
    name: 'Team',
    nameKo: '팀',
    price: '29,900',
    period: '/월',
    features: [
      '프로젝트 100개',
      '프로젝트당 환경변수 500개',
      '프로젝트당 서비스 100개',
      '팀 멤버 25명',
      'RBAC 권한 관리',
      'SSO / SAML',
      '전담 지원',
    ],
    cta: '업그레이드',
    popular: false,
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1 container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">심플한 가격</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            개인 프로젝트부터 팀 협업까지, 필요에 맞는 플랜을 선택하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? 'border-primary shadow-lg relative' : ''}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">추천</Badge>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{plan.nameKo}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}원</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={plan.name === 'Free'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
