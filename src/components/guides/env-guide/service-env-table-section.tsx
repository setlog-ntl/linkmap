'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Lock, Unlock, Copy, Check, ExternalLink } from 'lucide-react';

interface EnvVar {
  name: string;
  secret: boolean;
  description: string;
}

interface ServiceInfo {
  name: string;
  vars: EnvVar[];
  docsUrl: string;
}

interface Category {
  id: string;
  label: string;
  services: ServiceInfo[];
}

const categories: Category[] = [
  {
    id: 'auth-db',
    label: '인증/DB',
    services: [
      {
        name: 'Supabase',
        docsUrl: 'https://supabase.com/docs/guides/getting-started',
        vars: [
          { name: 'NEXT_PUBLIC_SUPABASE_URL', secret: false, description: '프로젝트 URL' },
          { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', secret: false, description: '공개 API 키' },
          { name: 'SUPABASE_SERVICE_ROLE_KEY', secret: true, description: '관리자 키 (RLS 우회)' },
        ],
      },
      {
        name: 'Firebase',
        docsUrl: 'https://firebase.google.com/docs/web/setup',
        vars: [
          { name: 'NEXT_PUBLIC_FIREBASE_API_KEY', secret: false, description: '웹 API 키' },
          { name: 'FIREBASE_ADMIN_SDK', secret: true, description: '서비스 어카운트 JSON' },
        ],
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    services: [
      {
        name: 'OpenAI',
        docsUrl: 'https://platform.openai.com/api-keys',
        vars: [
          { name: 'OPENAI_API_KEY', secret: true, description: 'API 키 (요금 발생)' },
        ],
      },
      {
        name: 'Anthropic',
        docsUrl: 'https://console.anthropic.com/settings/keys',
        vars: [
          { name: 'ANTHROPIC_API_KEY', secret: true, description: 'API 키 (요금 발생)' },
        ],
      },
    ],
  },
  {
    id: 'payment',
    label: '결제',
    services: [
      {
        name: 'Stripe',
        docsUrl: 'https://dashboard.stripe.com/apikeys',
        vars: [
          { name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', secret: false, description: '공개 키 (클라이언트)' },
          { name: 'STRIPE_SECRET_KEY', secret: true, description: '비밀 키 (서버 전용)' },
          { name: 'STRIPE_WEBHOOK_SECRET', secret: true, description: '웹훅 서명 키' },
        ],
      },
    ],
  },
  {
    id: 'deploy',
    label: '배포',
    services: [
      {
        name: 'Vercel',
        docsUrl: 'https://vercel.com/docs/environment-variables',
        vars: [
          { name: 'VERCEL_URL', secret: false, description: '자동 제공 (배포 URL)' },
          { name: 'NEXT_PUBLIC_VERCEL_URL', secret: false, description: '자동 제공 (클라이언트용)' },
        ],
      },
      {
        name: 'Cloudflare',
        docsUrl: 'https://developers.cloudflare.com/workers/configuration/secrets/',
        vars: [
          { name: 'Workers Secrets', secret: true, description: 'wrangler secret으로 관리' },
        ],
      },
    ],
  },
  {
    id: 'email-analytics',
    label: '이메일/분석',
    services: [
      {
        name: 'Resend',
        docsUrl: 'https://resend.com/api-keys',
        vars: [
          { name: 'RESEND_API_KEY', secret: true, description: '이메일 발송 API 키' },
        ],
      },
      {
        name: 'Google Analytics',
        docsUrl: 'https://analytics.google.com/',
        vars: [
          { name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID', secret: false, description: '측정 ID (G-XXXXX)' },
        ],
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </Button>
  );
}

export function ServiceEnvTableSection() {
  return (
    <section id="service-env" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">서비스별 환경변수</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          자주 사용하는 서비스별 환경변수를 정리했습니다. 변수명을 클릭하면 복사할 수 있어요.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Tabs defaultValue="auth-db" className="max-w-3xl">
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="space-y-4">
              {cat.services.map((service) => (
                <Card key={service.name} className="border">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{service.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        asChild
                      >
                        <a href={service.docsUrl} target="_blank" rel="noopener noreferrer">
                          발급 방법
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {service.vars.map((v) => (
                        <div
                          key={v.name}
                          className="flex items-center gap-2 flex-wrap sm:flex-nowrap"
                        >
                          {v.secret ? (
                            <Badge variant="destructive" className="text-xs shrink-0 gap-1">
                              <Lock className="h-3 w-3" />
                              비밀
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs shrink-0 gap-1 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                              <Unlock className="h-3 w-3" />
                              공개
                            </Badge>
                          )}
                          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded break-all">
                            {v.name}
                          </code>
                          <CopyButton text={v.name} />
                          <span className="text-xs text-muted-foreground ml-auto">
                            {v.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </ScrollReveal>
    </section>
  );
}
