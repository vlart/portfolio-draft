import { BlogPost } from '../models/BlogPost'
import { Project } from '../models/Project'
import type { Metadata } from 'next'

/**
 * Generate SEO Metadata
 *
 * Business logic to generate Next.js metadata for SEO optimization.
 * Works with any content type (BlogPost, Project, etc.) in a CMS-agnostic way.
 */

interface SEOConfig {
  siteName: string
  siteUrl: string
  defaultOgImage: string
  twitterHandle?: string
}

const defaultConfig: SEOConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  defaultOgImage: '/images/og-default.jpg',
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_USERNAME,
}

/**
 * Generate metadata for a blog post
 */
export function generateBlogPostMetadata(
  post: BlogPost,
  config: Partial<SEOConfig> = {}
): Metadata {
  const cfg = { ...defaultConfig, ...config }
  const url = `${cfg.siteUrl}/blog/${post.slug}`

  // Use custom SEO overrides if provided
  const title = post.seo?.title || post.title
  const description = post.seo?.description || post.description
  const ogImage = post.seo?.ogImage || post.featuredImage?.url || cfg.defaultOgImage

  return {
    title,
    description,
    keywords: post.seo?.keywords || post.tags.map(tag => tag.name),
    authors: [{ name: post.author.name }],
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: post.featuredImage?.width || 1200,
          height: post.featuredImage?.height || 630,
          alt: post.featuredImage?.alt || title,
        },
      ],
      siteName: cfg.siteName,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      tags: post.tags.map(tag => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      site: cfg.twitterHandle,
      creator: cfg.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      ...(post.translations && {
        languages: Object.fromEntries(
          post.translations.map(t => [t.locale, `${cfg.siteUrl}/blog/${t.slug}`])
        ),
      }),
    },
  }
}

/**
 * Generate metadata for a project
 */
export function generateProjectMetadata(
  project: Project,
  config: Partial<SEOConfig> = {}
): Metadata {
  const cfg = { ...defaultConfig, ...config }
  const url = `${cfg.siteUrl}/projects/${project.slug}`

  const title = project.title
  const description = project.description
  const ogImage = project.featuredImage?.url || cfg.defaultOgImage

  return {
    title,
    description,
    keywords: project.technologies.map(tech => tech.name),
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: project.featuredImage?.width || 1200,
          height: project.featuredImage?.height || 630,
          alt: project.featuredImage?.alt || title,
        },
      ],
      siteName: cfg.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      site: cfg.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate metadata for blog listing page
 */
export function generateBlogListingMetadata(
  config: Partial<SEOConfig> = {}
): Metadata {
  const cfg = { ...defaultConfig, ...config }
  const url = `${cfg.siteUrl}/blog`

  return {
    title: `Blog | ${cfg.siteName}`,
    description: 'Thoughts on software development, technology, and more.',
    openGraph: {
      type: 'website',
      url,
      title: 'Blog',
      description: 'Thoughts on software development, technology, and more.',
      siteName: cfg.siteName,
      images: [cfg.defaultOgImage],
    },
    twitter: {
      card: 'summary',
      site: cfg.twitterHandle,
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate structured data (JSON-LD) for a blog post
 */
export function generateBlogPostStructuredData(
  post: BlogPost,
  config: Partial<SEOConfig> = {}
) {
  const cfg = { ...defaultConfig, ...config }
  const url = `${cfg.siteUrl}/blog/${post.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.featuredImage?.url || cfg.defaultOgImage,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.website,
      image: post.author.avatar,
    },
    publisher: {
      '@type': 'Person',
      name: post.author.name,
      url: cfg.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags.map(tag => tag.name).join(', '),
    ...(post.readingTime && {
      timeRequired: `PT${post.readingTime}M`,
    }),
  }
}

/**
 * Generate structured data for the website (Person schema)
 */
export function generatePersonStructuredData(config: Partial<SEOConfig> = {}) {
  const cfg = { ...defaultConfig, ...config }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: cfg.siteName,
    url: cfg.siteUrl,
    sameAs: [
      // Add social media URLs from config
    ],
  }
}
