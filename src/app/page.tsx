export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { StatsSection } from '@/components/landing/stats-section';
import { FeaturesBento } from '@/components/landing/features-bento';
import { AiFeaturesSection } from '@/components/landing/ai-features-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { ServicesGrid } from '@/components/landing/services-grid';
import { OneclickDeploySection } from '@/components/landing/oneclick-deploy-section';
import { PricingSection, FinalCtaSection } from '@/components/landing/cta-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
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
    <div className="min-h-screen flex flex-col bg-[#f4f5f8] text-[#1a2740]">
      <Header profile={profile} />

      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Stats Bar */}
      <StatsSection />

      {/* Section 3: Core Features (Bento Grid) */}
      <FeaturesBento />

      {/* Section 4: AI Features */}
      <AiFeaturesSection />

      {/* Section 5: How It Works (4 steps) */}
      <HowItWorks />

      {/* Section 6: Supported Services */}
      <ServicesGrid />

      {/* Section 7: One-Click Deploy */}
      <OneclickDeploySection />

      {/* Section 8: Pricing */}
      <PricingSection />

      {/* Section 9: Testimonials */}
      <TestimonialsSection />

      {/* Section 10: Final CTA */}
      <FinalCtaSection />

      <Footer />
    </div>
  );
}
