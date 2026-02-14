import { siteConfig } from '@/lib/config';
import { NavHeader } from '@/components/nav-header';
import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { ProjectsSection } from '@/components/projects-section';
import { ExperienceTimeline } from '@/components/experience-timeline';
import { BlogSection } from '@/components/blog-section';
import { ContactSection } from '@/components/contact-section';
import { GithubGraph } from '@/components/github-graph';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <NavHeader />
      <main>
        <HeroSection config={siteConfig} />
        <AboutSection config={siteConfig} />
        {siteConfig.githubUsername && (
          <GithubGraph username={siteConfig.githubUsername} />
        )}
        <ProjectsSection projects={siteConfig.projects} />
        <ExperienceTimeline experience={siteConfig.experience} />
        {siteConfig.blogPosts && siteConfig.blogPosts.length > 0 && (
          <BlogSection posts={siteConfig.blogPosts} />
        )}
        <ContactSection config={siteConfig} />
      </main>
      <Footer />
    </>
  );
}
