/**
 * Author
 *
 * Represents the author of blog posts and projects.
 * For a personal portfolio, this is typically yourself, but the model
 * supports multiple authors for future extensibility.
 */
export interface Author {
  /** Unique identifier */
  id?: string

  /** Full name */
  name: string

  /** Optional bio/description */
  bio?: string

  /** Optional avatar image URL */
  avatar?: string

  /** Optional email */
  email?: string

  /** Optional website URL */
  website?: string

  /** Optional social media links */
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    [key: string]: string | undefined
  }
}

/**
 * Default author for personal portfolio
 * Override this with your information
 */
export const DEFAULT_AUTHOR: Author = {
  name: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Your Name',
  bio: 'Full-stack developer and technology enthusiast',
  avatar: '/images/avatar.jpg',
  email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL,
  website: process.env.NEXT_PUBLIC_SITE_URL,
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
    twitter: process.env.NEXT_PUBLIC_TWITTER_USERNAME,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_USERNAME,
  },
}
