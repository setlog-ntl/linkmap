import { siteConfig } from '@/lib/config';
import { getTheme } from '@/lib/themes';
import { ProfileSection } from '@/components/profile-section';
import { LinkList } from '@/components/link-list';
import { SocialBar } from '@/components/social-bar';
import { ContentEmbed } from '@/components/content-embed';
import { Footer } from '@/components/footer';

export default function Home() {
  const theme = getTheme(siteConfig.theme);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 animate-gradient"
      style={{
        background: `linear-gradient(135deg, ${theme.backgroundFrom}, ${theme.primary}, ${theme.backgroundTo})`,
        backgroundSize: '200% 200%',
      }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 py-12">
        <ProfileSection config={siteConfig} theme={theme} />
        <LinkList links={siteConfig.links} theme={theme} />
        {siteConfig.socials.length > 0 && (
          <SocialBar socials={siteConfig.socials} theme={theme} />
        )}
        {siteConfig.youtubeUrl && (
          <ContentEmbed youtubeUrl={siteConfig.youtubeUrl} />
        )}
        <Footer theme={theme} />
      </div>
    </main>
  );
}
