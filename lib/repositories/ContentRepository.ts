import { BlogPost } from '../domain/models/BlogPost'
import { Project } from '../domain/models/Project'
import { Tag } from '../domain/models/Tag'

/**
 * Content Repository Interface
 *
 * This is the key abstraction that makes the architecture CMS-agnostic.
 * Different CMS adapters (Decap, Strapi, Sanity) implement this interface.
 *
 * Components and use cases depend on this interface, not on specific implementations.
 * This allows swapping CMS providers by simply changing the adapter implementation.
 */
export interface ContentRepository {
  // Blog Posts
  /**
   * Get a single blog post by slug
   * @throws Error if post not found
   */
  getPost(slug: string): Promise<BlogPost>

  /**
   * Get all blog posts (published and unpublished)
   */
  getAllPosts(): Promise<BlogPost[]>

  /**
   * Get posts by tag slug
   */
  getPostsByTag(tagSlug: string): Promise<BlogPost[]>

  // Projects
  /**
   * Get a single project by slug
   * @throws Error if project not found
   */
  getProject(slug: string): Promise<Project>

  /**
   * Get all projects
   */
  getAllProjects(): Promise<Project[]>

  /**
   * Get featured projects
   */
  getFeaturedProjects(): Promise<Project[]>

  // Tags
  /**
   * Get all tags used in blog posts and projects
   */
  getAllTags(): Promise<Tag[]>

  /**
   * Get a single tag by slug
   */
  getTag(slug: string): Promise<Tag>
}

/**
 * Content Repository with Write Operations (Optional)
 *
 * Some CMS adapters may support write operations (e.g., creating posts via API).
 * Git-based CMS (Decap) typically doesn't need this as writes happen via Git.
 */
export interface WritableContentRepository extends ContentRepository {
  /**
   * Create a new blog post
   */
  createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost>

  /**
   * Update an existing blog post
   */
  updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost>

  /**
   * Delete a blog post
   */
  deletePost(id: string): Promise<void>

  /**
   * Create a new project
   */
  createProject(project: Omit<Project, 'id'>): Promise<Project>

  /**
   * Update an existing project
   */
  updateProject(id: string, project: Partial<Project>): Promise<Project>

  /**
   * Delete a project
   */
  deleteProject(id: string): Promise<void>
}

/**
 * Repository Error Classes
 */
export class ContentNotFoundError extends Error {
  constructor(type: 'post' | 'project' | 'tag', identifier: string) {
    super(`${type} not found: ${identifier}`)
    this.name = 'ContentNotFoundError'
  }
}

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(`Content validation failed: ${message}`)
    this.name = 'ContentValidationError'
  }
}

export class RepositoryError extends Error {
  constructor(message: string, public cause?: Error) {
    super(`Repository error: ${message}`)
    this.name = 'RepositoryError'
  }
}
