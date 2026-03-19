import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getPublishedPosts, BLOG_POSTS } from '@/data/blog/posts';
import { GUIDE_DATA } from '@/data/ui/guide-data';
import { generateBlogJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { BlogPostView } from '@/components/blog/blog-post';
import type { RelatedGuideInfo } from '@/components/blog/blog-post';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: '글을 찾을 수 없습니다' };

  const baseUrl = 'https://www.linkmap.biz';

  return {
    title: `${post.title} | Linkmap 블로그`,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
      url: `${baseUrl}/blog/${post.slug}`,
      images: post.ogImage ? [{ url: `${baseUrl}${post.ogImage}` }] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  // prev/next 계산 (서버에서만 — 클라이언트 번들에 전체 BLOG_POSTS 포함 방지)
  const posts = getPublishedPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  const prevPost = idx < posts.length - 1 ? { slug: posts[idx + 1].slug, title: posts[idx + 1].title } : null;
  const nextPost = idx > 0 ? { slug: posts[idx - 1].slug, title: posts[idx - 1].title } : null;

  // relatedGuides 서버 측 해석 (GUIDE_DATA icon 컴포넌트 제외, 직렬화 가능 데이터만)
  const relatedGuideInfos: RelatedGuideInfo[] = (post.relatedGuides ?? []).reduce<RelatedGuideInfo[]>((acc, gSlug) => {
    const g = GUIDE_DATA.find((gl) => gl.slug === gSlug);
    if (g) acc.push({ slug: g.slug, title: g.title, href: g.href, readingTime: g.readingTime });
    return acc;
  }, []);

  const jsonLd = generateBlogJsonLd({
    slug: post.slug,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTime: post.readingTime,
    tags: post.tags,
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <BlogPostView
        post={post}
        prevPost={prevPost}
        nextPost={nextPost}
        relatedGuideInfos={relatedGuideInfos}
      />
    </>
  );
}
