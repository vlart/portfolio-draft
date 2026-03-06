import { BlogPost } from '../models/BlogPost'

/**
 * Get Published Posts
 *
 * Business logic to filter and sort published blog posts.
 * This is a "use case" - application-specific business logic that operates
 * on domain models but is independent of the data source.
 */

export interface GetPublishedPostsOptions {
  /** Filter by tag slug */
  tag?: string

  /** Limit number of results */
  limit?: number

  /** Sort order */
  sortBy?: 'publishedAt' | 'updatedAt' | 'title'

  /** Sort direction */
  sortDirection?: 'asc' | 'desc'

  /** Filter by locale (for i18n) */
  locale?: string
}

/**
 * Filter and sort published posts based on options
 */
export function getPublishedPosts(
  allPosts: BlogPost[],
  options: GetPublishedPostsOptions = {}
): BlogPost[] {
  let posts = allPosts.filter(post => post.published)

  // Filter by tag
  if (options.tag) {
    posts = posts.filter(post =>
      post.tags.some(tag => tag.slug === options.tag)
    )
  }

  // Filter by locale
  if (options.locale) {
    posts = posts.filter(post => post.locale === options.locale)
  }

  // Sort
  const sortBy = options.sortBy || 'publishedAt'
  const direction = options.sortDirection || 'desc'

  posts.sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'publishedAt':
        comparison = a.publishedAt.getTime() - b.publishedAt.getTime()
        break
      case 'updatedAt':
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
    }

    return direction === 'asc' ? comparison : -comparison
  })

  // Limit results
  if (options.limit) {
    posts = posts.slice(0, options.limit)
  }

  return posts
}

/**
 * Get featured posts (typically for homepage)
 */
export function getFeaturedPosts(
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  return getPublishedPosts(allPosts, {
    sortBy: 'publishedAt',
    sortDirection: 'desc',
    limit,
  })
}

/**
 * Get recent posts
 */
export function getRecentPosts(
  allPosts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  return getPublishedPosts(allPosts, {
    sortBy: 'publishedAt',
    sortDirection: 'desc',
    limit,
  })
}

/**
 * Get related posts based on shared tags
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  const currentTags = currentPost.tags.map(tag => tag.slug)

  // Calculate relevance score based on shared tags
  const postsWithScores = allPosts
    .filter(post => post.published && post.id !== currentPost.id)
    .map(post => {
      const sharedTags = post.tags.filter(tag =>
        currentTags.includes(tag.slug)
      ).length

      return {
        post,
        score: sharedTags,
      }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return postsWithScores.map(item => item.post)
}
