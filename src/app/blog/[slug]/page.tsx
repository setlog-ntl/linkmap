import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, BLOG_POSTS } from '@/data/blog/posts';
import { generateBlogJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { BlogPostView } from '@/components/blog/blog-post';

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
      <BlogPostView post={post} />
    </>
  );
}
