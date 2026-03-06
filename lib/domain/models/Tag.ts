/**
 * Tag
 *
 * Represents a tag/category that can be applied to blog posts and projects.
 * Used for filtering and organizing content.
 */
export interface Tag {
  /** Unique identifier (CMS-specific ID or generated) */
  id: string

  /** Display name */
  name: string

  /** URL-friendly slug */
  slug: string

  /** Optional description */
  description?: string

  /** Optional color for UI (hex code) */
  color?: string
}

/**
 * Helper to generate a URL-friendly slug from a tag name
 */
export function tagToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
