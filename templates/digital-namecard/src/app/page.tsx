import { siteConfig } from '@/lib/config';
import { ProfileCard } from '@/components/profile-card';
import { ContactInfo } from '@/components/contact-info';
import { SocialLinks } from '@/components/social-links';
import { QrCode } from '@/components/qr-code';
import { SaveContactButton } from '@/components/save-contact-button';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="print-card rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
          {/* Accent color bar */}
          <div
            className="h-2"
            style={{
              background: `linear-gradient(90deg, ${siteConfig.accentColor}, ${siteConfig.accentColor}dd)`,
            }}
          />

          <div className="p-6 space-y-5">
            <ProfileCard config={siteConfig} />
            <ContactInfo config={siteConfig} />
            {siteConfig.socials.length > 0 && (
              <SocialLinks
                socials={siteConfig.socials}
                accentColor={siteConfig.accentColor}
              />
            )}
            <QrCode config={siteConfig} />
            <SaveContactButton config={siteConfig} />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
