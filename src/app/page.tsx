import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { SocialProofSection } from '@/components/landing/social-proof-section';
import { FeaturesBento } from '@/components/landing/features-bento';
import { HowItWorks } from '@/components/landing/how-it-works';
import { TemplateShowcase } from '@/components/landing/template-showcase';
import { ServicesGrid } from '@/components/landing/services-grid';
import { PricingSection, FinalCtaSection } from '@/components/landing/cta-section';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateWebAppJsonLd } from '@/lib/seo/json-ld';

export default function LandingPage() {
  const webAppJsonLd = generateWebAppJsonLd();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <JsonLdScript data={webAppJsonLd} />
      <Header profile={null} />

      {/* Section 1: Hero */}
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
