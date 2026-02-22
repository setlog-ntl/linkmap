export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { TemplateShowcase } from '@/components/landing/template-showcase';
import { SocialProofSection } from '@/components/landing/social-proof-section';
import { FeaturesBento } from '@/components/landing/features-bento';
import { HowItWorks } from '@/components/landing/how-it-works';
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
    <div className="min-h-screen flex flex-col bg-[#f4f5f8] text-[#1a2740] dark:bg-[#0b1120] dark:text-[#e2e8f0]">
      <Header profile={profile} />

      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Template Showcase */}
      <TemplateShowcase />

      {/* Section 3: Social Proof (Stats + Testimonials) */}
      <SocialProofSection />

      {/* Section 4: How It Works (4 Steps) */}
      <HowItWorks />

      {/* Section 5: Core Features (Bento Grid + AI) */}
      <FeaturesBento />

      {/* Section 6: Supported Services */}
      <ServicesGrid />

      {/* Section 7: Pricing */}
      <PricingSection />

      {/* Section 8: Final CTA */}
      <FinalCtaSection />

      <Footer />
    </div>
  );
}
