import { Tag } from './Tag'
import { ImageAsset } from './ImageAsset'

/**
 * Project
 *
 * Represents a portfolio project (work, personal, or open source).
 * Similar to BlogPost but with project-specific fields.
 */
export interface Project {
  /** Unique identifier */
  id: string

  /** URL-friendly slug */
  slug: string

  /** Project title */
  title: string

  /** Short description */
  description: string

  /** Detailed content (Markdown or HTML) */
  content: string

  /** Featured/hero image */
  featuredImage?: ImageAsset

  /** Additional images/screenshots */
  gallery?: ImageAsset[]

  /** Technologies/tools used */
  technologies: Tag[]

  /** Project category (web, mobile, design, etc.) */
  category?: string

  /** Project status */
  status: 'completed' | 'in-progress' | 'archived'

  /** Start date */
  startDate: Date

  /** End date (null if ongoing) */
  endDate?: Date

  /** Whether to feature this project (e.g., on homepage) */
  featured: boolean

  /** Whether the project is published */
  published: boolean

  /** Links */
  links: {
    /** Live project URL */
    demo?: string

    /** GitHub repository */
    github?: string

    /** Case study or blog post */
    caseStudy?: string

    /** Other links */
    [key: string]: string | undefined
  }

  /** Optional client/company name */
  client?: string

  /** Optional role/responsibility */
  role?: string

  /** Optional team size */
  teamSize?: number

  /** Optional achievements/results */
  achievements?: string[]

  /** Optional locale for i18n */
  locale?: string

  /** Created/published date */
  createdAt: Date

  /** Last update date */
  updatedAt: Date
}

/**
 * Project status labels for UI
 */
export const PROJECT_STATUS_LABELS: Record<Project['status'], string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  archived: 'Archived',
}

/**
 * Helper: Get project duration in months
 */
export function getProjectDuration(project: Project): number {
  const start = project.startDate.getTime()
  const end = project.endDate?.getTime() || Date.now()
  const diffInMonths = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30))
  return diffInMonths
}

/**
 * Helper: Format project duration as string
 */
export function formatProjectDuration(project: Project): string {
  const months = getProjectDuration(project)

  if (months < 1) {
    return 'Less than a month'
  }

  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''}`
  }

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (remainingMonths === 0) {
    return `${years} year${years > 1 ? 's' : ''}`
  }

  return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
}

/**
 * Type guard: Check if an object is a Project
 */
export function isProject(obj: any): obj is Project {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.status === 'string' &&
    obj.startDate instanceof Date
  )
}
