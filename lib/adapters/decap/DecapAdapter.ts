import {
  ContentRepository,
  ContentNotFoundError,
  RepositoryError,
} from '../../repositories/ContentRepository'
import { BlogPost, calculateReadingTime } from '../../domain/models/BlogPost'
import { Project } from '../../domain/models/Project'
import { Tag } from '../../domain/models/Tag'
import { DEFAULT_AUTHOR } from '../../domain/models/Author'

/**
 * Decap CMS Adapter
 *
 * Implements ContentRepository interface for Decap CMS (Git-based).
 * Uses Contentlayer to read and validate MDX files at build time.
 *
 * This adapter transforms Contentlayer's generated types into our domain models.
 */
export class DecapAdapter implements ContentRepository {
  /**
   * Get a single blog post by slug
   */
  async getPost(slug: string): Promise<BlogPost> {
    try {
      // In actual implementation, import from contentlayer/generated
      // const { allPosts } = await import('contentlayer/generated')
      // const contentlayerPost = allPosts.find(p => p.slug === slug)

      // For now, this is a placeholder showing the transformation logic
      const contentlayerPost = await this.fetchContentlayerPost(slug)

      if (!contentlayerPost) {
        throw new ContentNotFoundError('post', slug)
      }

      return this.transformToBlogPost(contentlayerPost)
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        throw error
      }
      throw new RepositoryError(`Failed to get post: ${slug}`, error as Error)
    }
  }

  /**
   * Get all blog posts
   */
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      // const { allPosts } = await import('contentlayer/generated')
      const allPosts = await this.fetchAllContentlayerPosts()

      return allPosts.map(post => this.transformToBlogPost(post))
    } catch (error) {
      throw new RepositoryError('Failed to get all posts', error as Error)
    }
  }

  /**
   * Get posts by tag slug
   */
  async getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
    const allPosts = await this.getAllPosts()
    return allPosts.filter(post =>
      post.tags.some(tag => tag.slug === tagSlug)
    )
  }

  /**
   * Get a single project by slug
   */
  async getProject(slug: string): Promise<Project> {
    try {
      // const { allProjects } = await import('contentlayer/generated')
      const contentlayerProject = await this.fetchContentlayerProject(slug)

      if (!contentlayerProject) {
        throw new ContentNotFoundError('project', slug)
      }

      return this.transformToProject(contentlayerProject)
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        throw error
      }
      throw new RepositoryError(`Failed to get project: ${slug}`, error as Error)
    }
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<Project[]> {
    try {
      // const { allProjects } = await import('contentlayer/generated')
      const allProjects = await this.fetchAllContentlayerProjects()

      return allProjects.map(project => this.transformToProject(project))
    } catch (error) {
      throw new RepositoryError('Failed to get all projects', error as Error)
    }
  }

  /**
   * Get featured projects
   */
  async getFeaturedProjects(): Promise<Project[]> {
    const allProjects = await this.getAllProjects()
    return allProjects.filter(project => project.featured && project.published)
  }

  /**
   * Get all tags
   */
  async getAllTags(): Promise<Tag[]> {
    const [posts, projects] = await Promise.all([
      this.getAllPosts(),
      this.getAllProjects(),
    ])

    const tagMap = new Map<string, Tag>()

    // Collect tags from posts
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (!tagMap.has(tag.slug)) {
          tagMap.set(tag.slug, tag)
        }
      })
    })

    // Collect tags from projects (technologies)
    projects.forEach(project => {
      project.technologies.forEach(tag => {
        if (!tagMap.has(tag.slug)) {
          tagMap.set(tag.slug, tag)
        }
      })
    })

    return Array.from(tagMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }

  /**
   * Get a single tag by slug
   */
  async getTag(slug: string): Promise<Tag> {
    const allTags = await this.getAllTags()
    const tag = allTags.find(t => t.slug === slug)

    if (!tag) {
      throw new ContentNotFoundError('tag', slug)
    }

    return tag
  }

  /**
   * Transform Contentlayer post to domain BlogPost model
   */
  private transformToBlogPost(contentlayerPost: any): BlogPost {
    return {
      id: contentlayerPost._id,
      slug: contentlayerPost.slug,
      title: contentlayerPost.title,
      description: contentlayerPost.description,
      content: contentlayerPost.body.html || contentlayerPost.body.raw,
      publishedAt: new Date(contentlayerPost.date),
      updatedAt: new Date(contentlayerPost.updatedAt || contentlayerPost.date),
      author: DEFAULT_AUTHOR, // Or parse from frontmatter
      tags: this.parseTags(contentlayerPost.tags || []),
      featuredImage: contentlayerPost.featuredImage
        ? {
            url: contentlayerPost.featuredImage,
            alt: contentlayerPost.featuredImageAlt || contentlayerPost.title,
          }
        : undefined,
      published: contentlayerPost.published ?? true,
      readingTime:
        contentlayerPost.readingTime ||
        calculateReadingTime(contentlayerPost.body.raw),
      locale: contentlayerPost.locale || 'en',
      seo: contentlayerPost.seo,
    }
  }

  /**
   * Transform Contentlayer project to domain Project model
   */
  private transformToProject(contentlayerProject: any): Project {
    return {
      id: contentlayerProject._id,
      slug: contentlayerProject.slug,
      title: contentlayerProject.title,
      description: contentlayerProject.description,
      content: contentlayerProject.body.html || contentlayerProject.body.raw,
      featuredImage: contentlayerProject.featuredImage
        ? {
            url: contentlayerProject.featuredImage,
            alt: contentlayerProject.featuredImageAlt || contentlayerProject.title,
          }
        : undefined,
      gallery: contentlayerProject.gallery?.map((img: any) => ({
        url: img.url || img,
        alt: img.alt || '',
      })),
      technologies: this.parseTags(contentlayerProject.technologies || []),
      category: contentlayerProject.category,
      status: contentlayerProject.status || 'completed',
      startDate: new Date(contentlayerProject.startDate),
      endDate: contentlayerProject.endDate
        ? new Date(contentlayerProject.endDate)
        : undefined,
      featured: contentlayerProject.featured ?? false,
      published: contentlayerProject.published ?? true,
      links: contentlayerProject.links || {},
      client: contentlayerProject.client,
      role: contentlayerProject.role,
      teamSize: contentlayerProject.teamSize,
      achievements: contentlayerProject.achievements,
      locale: contentlayerProject.locale || 'en',
      createdAt: new Date(contentlayerProject.createdAt || contentlayerProject.startDate),
      updatedAt: new Date(
        contentlayerProject.updatedAt || contentlayerProject.createdAt || contentlayerProject.startDate
      ),
    }
  }

  /**
   * Parse tags from frontmatter (array of strings or objects)
   */
  private parseTags(tags: any[]): Tag[] {
    return tags.map((tag, index) => {
      if (typeof tag === 'string') {
        return {
          id: `tag-${index}`,
          name: tag,
          slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }
      }

      return {
        id: tag.id || `tag-${index}`,
        name: tag.name,
        slug: tag.slug || tag.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: tag.description,
        color: tag.color,
      }
    })
  }

  /**
   * Placeholder methods for fetching Contentlayer data
   * In actual implementation, these would import from 'contentlayer/generated'
   */
  private async fetchContentlayerPost(slug: string): Promise<any> {
    // const { allPosts } = await import('contentlayer/generated')
    // return allPosts.find(p => p.slug === slug)
    throw new Error('Contentlayer not configured yet')
  }

  private async fetchAllContentlayerPosts(): Promise<any[]> {
    // const { allPosts } = await import('contentlayer/generated')
    // return allPosts
    return []
  }

  private async fetchContentlayerProject(slug: string): Promise<any> {
    // const { allProjects } = await import('contentlayer/generated')
    // return allProjects.find(p => p.slug === slug)
    throw new Error('Contentlayer not configured yet')
  }

  private async fetchAllContentlayerProjects(): Promise<any[]> {
    // const { allProjects } = await import('contentlayer/generated')
    // return allProjects
    return []
  }
}
