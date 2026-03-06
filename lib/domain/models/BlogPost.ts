import { Author } from './Author'
import { Tag } from './Tag'
import { ImageAsset } from './ImageAsset'

/**
 * Blog Post
 *
 * Core domain model representing a blog post.
 * This model is CMS-agnostic - it represents the business concept,
 * not the CMS-specific structure.
 *
 * Adapters transform CMS-specific data into this model.
 */
export interface BlogPost {
  /** Unique identifier (CMS-specific ID or slug) */
  id: string

  /** URL-friendly slug */
  slug: string

  /** Post title */
  title: string

  /** Short description/excerpt for SEO and listings */
  description: string

  /** Main content (Markdown or HTML string) */
  content: string

  /** Publication date */
  publishedAt: Date

  /** Last update date */
  updatedAt: Date

  /** Post author */
  author: Author

  /** Tags/categories */
  tags: Tag[]

  /** Featured/hero image */
  featuredImage?: ImageAsset

  /** Whether the post is published (vs draft) */
  published: boolean

  /** Optional reading time in minutes */
  readingTime?: number

  /** Optional table of contents */
  tableOfContents?: TableOfContentsItem[]

  /** Optional locale for i18n */
  locale?: string

  /** Optional translations */
  translations?: {
    locale: string
    slug: string
  }[]

  /** Optional custom SEO overrides */
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
}

/**
 * Table of Contents Item
 */
export interface TableOfContentsItem {
  id: string
  title: string
  level: number // 1-6 for h1-h6
  children?: TableOfContentsItem[]
}

/**
 * Helper: Calculate reading time based on content
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Helper: Extract excerpt from content if not provided
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown/HTML formatting
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headings
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[*_~`]/g, '') // Remove markdown formatting
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Trim to max length and add ellipsis
  return plainText.substring(0, maxLength).trim() + '...'
}

/**
 * Helper: Generate table of contents from markdown headings
 */
export function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: TableOfContentsItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    headings.push({
      id,
      title,
      level,
    })
  }

  return headings
}

/**
 * Type guard: Check if an object is a BlogPost
 */
export function isBlogPost(obj: any): obj is BlogPost {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string' &&
    obj.publishedAt instanceof Date
  )
}
