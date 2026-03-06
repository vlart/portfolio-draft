import { ContentRepository } from './ContentRepository'

/**
 * Content Repository Factory
 *
 * Creates the appropriate CMS adapter based on environment configuration.
 * This is the ONLY place where we decide which CMS to use.
 *
 * To switch CMS providers:
 * 1. Change the NEXT_PUBLIC_CMS_PROVIDER environment variable
 * 2. Redeploy
 * That's it! No code changes needed.
 */

export type CMSProvider = 'decap' | 'strapi' | 'sanity'

/**
 * Create a content repository instance based on configuration
 */
export function createContentRepository(): ContentRepository {
  const provider = (process.env.NEXT_PUBLIC_CMS_PROVIDER || 'decap') as CMSProvider

  switch (provider) {
    case 'decap':
      return createDecapAdapter()

    case 'strapi':
      return createStrapiAdapter()

    case 'sanity':
      return createSanityAdapter()

    default:
      throw new Error(`Unknown CMS provider: ${provider}`)
  }
}

/**
 * Create Decap CMS adapter (Git-based, Contentlayer)
 */
function createDecapAdapter(): ContentRepository {
  // Lazy import to avoid bundling unused adapters
  // Import will be code-split in production
  const { DecapAdapter } = require('../adapters/decap/DecapAdapter')
  return new DecapAdapter()
}

/**
 * Create Strapi adapter (Headless CMS)
 */
function createStrapiAdapter(): ContentRepository {
  const { StrapiAdapter } = require('../adapters/strapi/StrapiAdapter')

  if (!process.env.STRAPI_API_URL) {
    throw new Error('STRAPI_API_URL environment variable is required')
  }

  if (!process.env.STRAPI_API_TOKEN) {
    throw new Error('STRAPI_API_TOKEN environment variable is required')
  }

  return new StrapiAdapter({
    apiUrl: process.env.STRAPI_API_URL,
    apiToken: process.env.STRAPI_API_TOKEN,
  })
}

/**
 * Create Sanity adapter (Headless CMS)
 */
function createSanityAdapter(): ContentRepository {
  const { SanityAdapter } = require('../adapters/sanity/SanityAdapter')

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required')
  }

  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    throw new Error('NEXT_PUBLIC_SANITY_DATASET environment variable is required')
  }

  return new SanityAdapter({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: process.env.NODE_ENV === 'production',
  })
}

/**
 * Singleton instance (optional, for caching)
 * Uncomment if you want a single instance across the app
 */
// let repositoryInstance: ContentRepository | null = null

// export function getContentRepository(): ContentRepository {
//   if (!repositoryInstance) {
//     repositoryInstance = createContentRepository()
//   }
//   return repositoryInstance
// }
