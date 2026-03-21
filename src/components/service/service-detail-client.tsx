'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ExternalLink, Globe, BookOpen, Clock, Copy, Check, KeyRound, UserPlus } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { allCategoryLabels, domainLabels, domainIcons } from '@/lib/constants/service-filters';
import { DifficultyBadge, GithubStarsBadge, FreeTierBadge, VendorLockInBadge } from './service-badges';
import { AddToProjectButton } from './service-list-item';
import type {
  Service, ServiceGuide, ServiceCostTier, ServiceDependency,
  ServiceCategory, ServiceDomain, DependencyType,
  ServiceFeatureGuide, ServiceSignupGuide,
} from '@/types';

interface ServiceDetailClientProps {
  service: Service;
  guide: ServiceGuide | null;
  costTiers: ServiceCostTier[];
  dependencies: (ServiceDependency & { depends_on_service: Service })[];
}

function CodeBlock({ code }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

const depTypeLabels: Record<DependencyType, string> = {
  alternative: '대안 서비스',
  recommended: '추천 함께 사용',
  optional: '선택적 통합',
  required: '필수 연동',
};

export function ServiceDetailClient({ service, guide, costTiers, dependencies }: ServiceDetailClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasGuide = guide && (
    guide.quick_start ||
    guide.setup_steps?.length > 0 ||
    guide.signup ||
    (guide.features && guide.features.length > 0)
  );
  const hasTips = guide && (guide.common_pitfalls?.length > 0 || guide.integration_tips?.length > 0 || guide.pros?.length > 0 || guide.cons?.length > 0);

  // Group dependencies by type
  const depsByType = dependencies.reduce<Record<string, (ServiceDependency & { depends_on_service: Service })[]>>((acc, dep) => {
    const key = dep.dependency_type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(dep);
    return acc;
  }, {});

  const availableTabs = [
    { value: 'overview', label: '개요' },
    ...(hasGuide ? [{ value: 'quickstart', label: '시작하기' }] : []),
    ...(costTiers.length > 0 ? [{ value: 'pricing', label: '가격' }] : []),
    ...(dependencies.length > 0 ? [{ value: 'related', label: '대안 & 연관' }] : []),
    ...(hasTips ? [{ value: 'tips', label: '활용 팁' }] : []),
  ];

  const tabParam = searchParams.get('tab');
  const validTabs = availableTabs.map(t => t.value);
  const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    if (value === 'overview') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', value);
    }
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Button variant="ghost" size="sm" asChild>
        <Link prefetch={false} href="/services">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          카탈로그로 돌아가기
        </Link>
      </Button>

      {/* Service header */}
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <ServiceIcon serviceId={service.slug} size={32} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{service.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {allCategoryLabels[service.category as ServiceCategory] || service.category}
                </Badge>
                {service.domain && (
                  <Badge variant="outline">
                    {domainIcons[service.domain as ServiceDomain]} {domainLabels[service.domain as ServiceDomain]}
                  </Badge>
                )}
              </div>
            </div>
            <AddToProjectButton serviceId={service.id} serviceName={service.name} className="h-9 text-sm shrink-0" />
          </div>
          <p className="text-muted-foreground mt-3">
            {service.description_ko || service.description}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetaCard label="난이도">
              <DifficultyBadge level={service.difficulty_level} />
            </MetaCard>
            <MetaCard label="GitHub Stars">
              <GithubStarsBadge stars={service.github_stars} />
            </MetaCard>
            <MetaCard label="무료 플랜">
              <FreeTierBadge quality={service.free_tier_quality} />
            </MetaCard>
            <MetaCard label="셋업 시간">
              {service.setup_time_minutes ? (
                <span className="text-sm flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ~{service.setup_time_minutes}분
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </MetaCard>
            <MetaCard label="벤더 종속성">
              <VendorLockInBadge risk={service.vendor_lock_in_risk} />
            </MetaCard>
          </div>

          {/* Cost estimate */}
          {service.monthly_cost_estimate && Object.keys(service.monthly_cost_estimate).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">월 예상 비용</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(service.monthly_cost_estimate).map(([tier, cost]) => (
                    <div key={tier} className="text-sm">
                      <span className="text-muted-foreground">{tier}:</span>{' '}
                      <span className="font-medium">{cost}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compatibility */}
          {service.compatibility && (service.compatibility.framework?.length || service.compatibility.language?.length) ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">호환성</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.compatibility.framework && service.compatibility.framework.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground mb-1 block">프레임워크</span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.compatibility.framework.map((fw) => (
                        <Badge key={fw} variant="outline" className="text-xs">{fw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {service.compatibility.language && service.compatibility.language.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground mb-1 block">언어</span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.compatibility.language.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Official SDKs */}
          {service.official_sdks && Object.keys(service.official_sdks).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">공식 SDK</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(service.official_sdks).map(([name, url]) => (
                    <Button key={name} variant="outline" size="sm" asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {name}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">태그</h3>
              <div className="flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* External links */}
          <Separator />
          <div className="flex flex-wrap gap-3">
            {service.website_url && (
              <Button variant="outline" asChild>
                <a href={service.website_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-1.5 h-4 w-4" />
                  웹사이트
                </a>
              </Button>
            )}
            {service.docs_url && (
              <Button variant="outline" asChild>
                <a href={service.docs_url} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="mr-1.5 h-4 w-4" />
                  문서
                </a>
              </Button>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: 시작하기 */}
        {hasGuide && (
          <TabsContent value="quickstart" className="space-y-6 mt-6">
            {/* 1. 서비스 소개 카드 */}
            {guide.quick_start && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">서비스 소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{guide.quick_start}</p>
                </CardContent>
              </Card>
            )}

            {/* 2. 가입 안내 (signup 있을 때만) */}
            {guide.signup && <SignupSection signup={guide.signup} />}

            {/* 3. 기능별 API 키 아코디언 (features 있을 때) */}
            {guide.features && guide.features.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">기능별 시작 가이드</h3>
                <FeatureAccordion features={guide.features} />
              </div>
            )}

            {/* 4. Fallback: features 없을 때 기존 UI 유지 */}
            {(!guide.features || guide.features.length === 0) && (
              <>
                {guide.api_key_url && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <KeyRound className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">API 키 발급 / 확인</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {guide.api_key_url_label || service.name} 콘솔에서 키를 발급받으세요
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0" asChild>
                        <a href={guide.api_key_url} target="_blank" rel="noopener noreferrer">
                          {guide.api_key_url_label || '콘솔 열기'}
                          <ExternalLink className="ml-1.5 h-3 w-3" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {guide.setup_steps && guide.setup_steps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">설정 단계</h3>
                    <Accordion type="multiple" className="space-y-2">
                      {guide.setup_steps.map((step, i) => (
                        <AccordionItem key={i} value={`step-${i}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-sm">
                            <span className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs shrink-0">
                                {step.step}
                              </Badge>
                              {step.title_ko || step.title}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              {step.description_ko || step.description}
                            </p>
                            {step.code_snippet && (
                              <CodeBlock code={step.code_snippet} />
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {guide.code_examples && Object.keys(guide.code_examples).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">코드 예제</h3>
                    <div className="space-y-4">
                      {Object.entries(guide.code_examples).map(([title, code]) => (
                        <div key={title}>
                          <p className="text-sm font-medium mb-2">{title}</p>
                          <CodeBlock code={code} language="typescript" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        )}

        {/* Tab 3: Pricing */}
        {costTiers.length > 0 && (
          <TabsContent value="pricing" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">티어</th>
                    <th className="text-left py-3 px-4 font-medium">월 가격</th>
                    <th className="text-left py-3 px-4 font-medium">연 가격</th>
                    <th className="text-left py-3 px-4 font-medium">주요 기능</th>
                    <th className="text-left py-3 px-4 font-medium">제한사항</th>
                    <th className="text-left py-3 px-4 font-medium">추천 대상</th>
                  </tr>
                </thead>
                <tbody>
                  {costTiers.map((tier) => {
                    const isFree = tier.price_monthly === '$0' || tier.price_monthly === '무료' || tier.tier_name.toLowerCase().includes('free');
                    return (
                      <tr key={tier.id} className={`border-b ${isFree ? 'bg-green-50/50' : ''}`}>
                        <td className="py-3 px-4 font-medium">
                          {tier.tier_name_ko || tier.tier_name}
                          {isFree && <Badge className="ml-2 text-xs" variant="secondary">무료</Badge>}
                        </td>
                        <td className="py-3 px-4">{tier.price_monthly || '-'}</td>
                        <td className="py-3 px-4">{tier.price_yearly || '-'}</td>
                        <td className="py-3 px-4">
                          <ul className="space-y-1">
                            {tier.features?.map((f, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <span>{f.included ? '✅' : '❌'}</span>
                                <span className="text-xs">{f.feature_ko || f.feature}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-4">
                          {tier.limits && Object.keys(tier.limits).length > 0 ? (
                            <ul className="space-y-0.5">
                              {Object.entries(tier.limits).map(([k, v]) => (
                                <li key={k} className="text-xs text-muted-foreground">
                                  {k}: {v}
                                </li>
                              ))}
                            </ul>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {tier.recommended_for || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        )}

        {/* Tab 4: Related & Alternative Services */}
        {dependencies.length > 0 && (
          <TabsContent value="related" className="space-y-6 mt-6">
            {(Object.entries(depsByType) as [DependencyType, typeof dependencies][]).map(([type, deps]) => (
              <div key={type}>
                <h3 className="text-sm font-medium mb-3">{depTypeLabels[type] || type}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {deps.map((dep) => (
                    <Card key={dep.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link
                              href={`/services/${dep.depends_on_service?.slug}`}
                              className="font-medium text-sm hover:text-primary transition-colors"
                            >
                              {dep.depends_on_service?.name || 'Unknown'}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                              {dep.description_ko || dep.description}
                            </p>
                          </div>
                          {dep.depends_on_service?.website_url && (
                            <Button variant="ghost" size="sm" asChild className="shrink-0">
                              <a href={dep.depends_on_service.website_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        )}

        {/* Tab 5: Tips */}
        {hasTips && (
          <TabsContent value="tips" className="space-y-6 mt-6">
            {/* Pros & Cons */}
            {(guide.pros?.length > 0 || guide.cons?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guide.pros && guide.pros.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-green-700">장점</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guide.pros.map((item, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="shrink-0">✅</span>
                            {item.text_ko || item.text}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                {guide.cons && guide.cons.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-red-700">단점</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guide.cons.map((item, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="shrink-0">❌</span>
                            {item.text_ko || item.text}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Common pitfalls */}
            {guide.common_pitfalls && guide.common_pitfalls.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">흔한 실수</h3>
                <Accordion type="multiple" className="space-y-2">
                  {guide.common_pitfalls.map((pitfall, i) => (
                    <AccordionItem key={i} value={`pitfall-${i}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-sm">
                        {pitfall.title_ko || pitfall.title}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">문제:</span> {pitfall.problem}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">해결:</span> {pitfall.solution}
                        </p>
                        {pitfall.code && <CodeBlock code={pitfall.code} />}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Integration tips */}
            {guide.integration_tips && guide.integration_tips.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">통합 팁</h3>
                <div className="space-y-3">
                  {guide.integration_tips.map((tip, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {tip.with_service_slug}
                        </Badge>
                        <p className="text-sm">{tip.tip_ko || tip.tip}</p>
                        {tip.code && <CodeBlock code={tip.code} />}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function MetaCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3">
      <span className="text-xs text-muted-foreground block mb-1">{label}</span>
      {children}
    </div>
  );
}

// ── 가입 안내 섹션 ────────────────────────────────────────────────────────────
function SignupSection({ signup }: { signup: ServiceSignupGuide }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          가입 안내
          {signup.free_tier && (
            <Badge variant="secondary" className="text-xs font-normal ml-1">
              {signup.free_tier}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-2">
          {signup.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
        <Button size="sm" asChild>
          <a href={signup.url} target="_blank" rel="noopener noreferrer">
            가입하기
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// ── 기능별 아코디언 ────────────────────────────────────────────────────────────
const featureTagLabels: Record<string, { label: string; className: string }> = {
  free:  { label: '무료', className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  paid:  { label: '유료', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  beta:  { label: 'Beta', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
};

function FeatureAccordion({ features }: { features: ServiceFeatureGuide[] }) {
  return (
    <Accordion type="multiple" className="space-y-2">
      {features.map((feature) => {
        const tagMeta = feature.tag ? featureTagLabels[feature.tag] : null;
        return (
          <AccordionItem
            key={feature.id}
            value={feature.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="text-sm hover:no-underline">
              <span className="flex items-center gap-2 min-w-0">
                <span className="font-medium truncate">{feature.name}</span>
                {tagMeta && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${tagMeta.className}`}>
                    {tagMeta.label}
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              <p className="text-sm text-muted-foreground">{feature.description}</p>

              {/* API 키 발급 */}
              {feature.api_key && (
                <div className="rounded-lg bg-muted/60 border p-3 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-xs font-medium">API 키 발급</span>
                    </div>
                    <code className="text-[11px] bg-background border rounded px-1.5 py-0.5 font-mono text-primary">
                      {feature.api_key.env_var}
                    </code>
                  </div>
                  <ApiKeyIssueSteps steps={feature.api_key.issue_steps} />
                  <Button variant="outline" size="sm" asChild className="w-full justify-center">
                    <a href={feature.api_key.url} target="_blank" rel="noopener noreferrer">
                      {feature.api_key.url_label}
                      <ExternalLink className="ml-1.5 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              )}

              {/* 기능별 설정 단계 */}
              {feature.setup_steps && feature.setup_steps.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 text-muted-foreground">설정 단계</p>
                  <ol className="space-y-1.5">
                    {feature.setup_steps.map((step, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium">{step.step}. {step.title_ko || step.title}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step.description_ko || step.description}
                        </p>
                        {step.code_snippet && <CodeBlock code={step.code_snippet} />}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* 코드 예제 */}
              {feature.code_example && (
                <div>
                  <p className="text-xs font-medium mb-2 text-muted-foreground">코드 예제</p>
                  <CodeBlock code={feature.code_example} />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

// ── API 키 발급 단계 번호 목록 ────────────────────────────────────────────────
function ApiKeyIssueSteps({ steps }: { steps: { step: number; title: string; description: string }[] }) {
  return (
    <ol className="space-y-2">
      {steps.map((s) => (
        <li key={s.step} className="flex items-start gap-2 text-xs">
          <span className="flex-shrink-0 h-4.5 w-4.5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-[10px] mt-0.5">
            {s.step}
          </span>
          <div>
            <span className="font-medium text-foreground">{s.title}</span>
            {s.description && (
              <p className="text-muted-foreground mt-0.5">{s.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
