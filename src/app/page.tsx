export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { SocialProofSection } from '@/components/landing/social-proof-section';
import { FeaturesBento } from '@/components/landing/features-bento';
import { HowItWorks } from '@/components/landing/how-it-works';
import { TemplateShowcase } from '@/components/landing/template-showcase';
import { ServicesGrid } from '@/components/landing/services-grid';
import { PricingSection, FinalCtaSection } from '@/components/landing/cta-section';
import type { Profile } from '@/types';

export default async function LandingPage() {
  let profile: Profile | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      profile = data ?? null;
    }
  } catch {
    profile = null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header profile={profile} />

      {/* Section 1: Hero — 듀얼 메시지 */}
      <HeroSection />

      {/* Section 2: How It Works — 경로 선택 (초보자/개발자 탭) */}
      <HowItWorks />

      {/* Section 3: Template Showcase — 초보자 deep-dive */}
      <TemplateShowcase />

      {/* Section 4: Core Features — 개발자 deep-dive */}
      <FeaturesBento />

      {/* Section 5: Supported Services */}
      <ServicesGrid />

      {/* Section 6: Social Proof — 구매 전 신뢰 */}
      <SocialProofSection />

      {/* Section 7: Pricing */}
      <PricingSection />

      {/* Section 8: Final CTA */}
      <FinalCtaSection />

      <Footer />
    </div>
  );
}
