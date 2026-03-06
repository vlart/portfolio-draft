# Portfolio Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │   Layouts    │         │
│  │ (App Router) │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                         DOMAIN LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Models     │  │  Use Cases   │  │  Validation  │         │
│  │  (Types)     │  │  (Business)  │  │   Schemas    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    DATA ABSTRACTION LAYER                        │
│  ┌────────────────────────────────────────────────────┐         │
│  │          Content Repository Interface              │         │
│  │  (abstract: getPost, getAllPosts, getProjects...)  │         │
│  └────────────────────────────────────────────────────┘         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      CMS ADAPTERS LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Decap     │  │   Strapi     │  │    Sanity    │         │
│  │   Adapter    │  │  Adapter     │  │   Adapter    │         │
│  │  (Active)    │  │  (Future)    │  │   (Future)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                     INTEGRATION LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Telegram   │  │   Analytics  │  │     RSS      │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  │  (Future)    │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      INFRASTRUCTURE                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   GitHub     │  │    Vercel    │  │   External   │         │
│  │   (Storage)  │  │  (Hosting)   │  │     APIs     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Core Architectural Principles

### 1. **Separation of Concerns**
- Each layer has a single, well-defined responsibility
- UI components never directly access CMS APIs
- Business logic is CMS-agnostic
- Integration services are decoupled from content management

### 2. **Dependency Inversion**
- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces)
- CMS adapters implement repository interfaces
- Easy to swap implementations without changing business logic

### 3. **Open/Closed Principle**
- System is open for extension (new CMS adapters)
- Closed for modification (existing code remains unchanged)
- Adding a new CMS = creating a new adapter

### 4. **Single Source of Truth**
- Content stored in Git (MDX files) for Decap CMS
- Domain models define the contract
- Frontmatter schema validates content structure

## Layer Responsibilities

### Presentation Layer (`/app`, `/components`)
**Responsibilities:**
- Rendering UI components
- Handling user interactions
- Server/Client component orchestration
- SEO optimization (metadata, structured data)
- Responsive design

**Dependencies:**
- Domain models (types only)
- Use cases (business logic)
- No direct CMS dependencies

### Domain Layer (`/lib/domain`)
**Responsibilities:**
- Core business entities (BlogPost, Project, Tag)
- Business rules and validation
- Type definitions
- Use case implementations

**Dependencies:**
- No external dependencies
- Pure TypeScript types and functions

### Data Abstraction Layer (`/lib/repositories`)
**Responsibilities:**
- Define content repository interface
- Abstract CRUD operations
- Normalize data from different sources
- Cache strategy (if needed)

**Dependencies:**
- Domain models only

### CMS Adapters Layer (`/lib/adapters`)
**Responsibilities:**
- Implement repository interface for specific CMS
- Transform CMS data to domain models
- Handle CMS-specific authentication
- Manage image/asset paths

**Dependencies:**
- Repository interfaces
- Domain models
- CMS SDK (Contentlayer, Strapi SDK, etc.)

### Integration Layer (`/lib/integrations`)
**Responsibilities:**
- External service integrations (Telegram, Analytics)
- Webhook handlers
- Third-party API clients
- Event publishing/subscription

**Dependencies:**
- Domain models
- Service-specific SDKs

## Content Strategy

### MDX + Frontmatter Approach (Current)

**Advantages:**
- Version controlled (Git)
- No database needed
- Fast builds with Contentlayer
- Offline editing
- Free hosting

**Disadvantages:**
- No visual editor (Decap CMS mitigates this)
- Build required for content updates
- Not suitable for high-frequency updates

### Git-Based CMS (Decap CMS)

**Advantages:**
- Visual editing interface
- Non-technical user friendly
- Maintains Git benefits
- No backend needed
- Free

**Disadvantages:**
- Limited to Git workflows
- OAuth configuration needed
- Not real-time

### Headless CMS (Strapi/Sanity - Future)

**Advantages:**
- Real-time content updates
- Advanced media management
- Webhooks for integrations
- Multi-user collaboration
- GraphQL/REST APIs

**Disadvantages:**
- Requires database
- Hosting costs
- More complex setup
- Lock-in risk (mitigated by adapter pattern)

## Data Flow

### Content Publishing Flow

```
┌─────────────┐
│   Author    │
│  (via CMS)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Content   │ ◄── MDX files in Git (Decap)
│   Storage   │     or Headless CMS API (future)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│CMS Adapter  │ ◄── Transforms raw data
│             │     to domain models
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repository  │ ◄── Abstract interface
│             │     (getPost, getAllPosts)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Use Cases  │ ◄── Business logic
│             │     (filtering, sorting, SEO)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Next.js    │ ◄── Server Components
│   Pages     │     fetch and render
└─────────────┘
```

### Telegram Auto-Post Flow (Future)

```
┌─────────────┐
│New Content  │
│ Published   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Webhook   │ ◄── Vercel webhook or
│   Trigger   │     GitHub Action
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Telegram   │ ◄── Format message
│   Service   │     with domain model
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Telegram   │
│     API     │
└─────────────┘
```

## Image Strategy

### Current Approach (Decap CMS)
- Store in `/public/images` or `/content/images`
- Commit to Git
- Reference via relative paths in frontmatter
- Use Next.js Image component for optimization

### Migration-Ready Approach
```typescript
// Domain model uses abstract image URL
interface BlogPost {
  featuredImage: ImageAsset
}

interface ImageAsset {
  url: string          // Abstract URL
  alt: string
  width?: number
  height?: number
}

// Adapter transforms to absolute URL
class DecapAdapter {
  getPost(slug: string): BlogPost {
    return {
      featuredImage: {
        url: `/images/${slug}/hero.jpg`,  // Local path
        alt: post.frontmatter.imageAlt
      }
    }
  }
}

class StrapiAdapter {
  getPost(slug: string): BlogPost {
    return {
      featuredImage: {
        url: strapi.image.url,  // CDN URL
        alt: strapi.image.alternativeText
      }
    }
  }
}
```

### Image Migration Strategy
1. **Phase 1 (Decap)**: Images in Git, local paths
2. **Phase 2 (Migration)**: Script to upload images to CMS
3. **Phase 3 (Headless)**: Images served from CDN
4. **Fallback**: Keep local copies, adapter handles both

## SEO Strategy

### Metadata Generation
```typescript
// Domain layer provides SEO data
interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  openGraph: OpenGraphData
  twitter: TwitterCardData
  canonical: string
  structuredData: object
}

// Use case generates SEO from domain model
function generateSEO(post: BlogPost): SEOMetadata {
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.map(t => t.name),
    // ... CMS-agnostic SEO logic
  }
}
```

### Sitemap Generation
- Dynamic sitemap generated from repository
- Independent of CMS implementation
- Includes blog posts, projects, static pages

### Structured Data
- JSON-LD for BlogPosting, Person, WebSite
- Generated from domain models
- CMS-agnostic

## Internationalization (i18n) Strategy

### Future-Proof Approach
```typescript
interface BlogPost {
  id: string
  slug: string
  locale: string        // 'en', 'ro', etc.
  translations?: {
    locale: string
    slug: string
  }[]
  // ... rest of fields
}
```

### Implementation Options
1. **Phase 1**: English only, structure supports i18n
2. **Phase 2**: Add locale field, separate MDX files per language
3. **Phase 3**: Use Next.js i18n routing + CMS multi-language support

## Performance Considerations

### Build-Time Optimization
- Static generation for all blog posts (ISR if needed)
- Contentlayer compiles MDX at build time
- Generated types for type safety

### Runtime Optimization
- Image optimization with Next.js Image
- Code splitting per route
- Lazy loading for non-critical components
- Font optimization (next/font)

### Caching Strategy
```typescript
// Repository layer handles caching
class CachedContentRepository implements ContentRepository {
  private cache: Map<string, BlogPost> = new Map()

  async getPost(slug: string): Promise<BlogPost> {
    if (this.cache.has(slug)) {
      return this.cache.get(slug)!
    }

    const post = await this.adapter.getPost(slug)
    this.cache.set(slug, post)
    return post
  }
}
```

### When to Use ISR (Incremental Static Regeneration)
- Decap CMS: Not needed (rebuild on commit)
- Headless CMS: Use ISR with revalidation on webhook
- High-traffic posts: Static generation
- Long-tail posts: On-demand ISR

## Security Considerations

### Decap CMS Phase
- OAuth provider configuration (GitHub, GitLab)
- Restrict admin access via `/admin` route
- Environment variables for OAuth credentials
- No sensitive data in MDX files

### Headless CMS Phase
- API keys in environment variables
- CORS configuration for CMS
- Webhook signature verification
- Rate limiting on API routes

### General Security
- Content Security Policy headers
- XSS prevention (MDX sanitization)
- HTTPS only
- Dependency vulnerability scanning (Dependabot)

## Scalability Strategy

### Current Scale (0-10k visitors/month)
- Static generation sufficient
- Vercel free tier
- Git-based CMS

### Medium Scale (10k-100k visitors/month)
- Consider ISR for dynamic content
- Vercel Pro tier
- CDN for images
- Analytics integration

### Large Scale (100k+ visitors/month)
- Migrate to Headless CMS with CDN
- Database for fast queries
- Edge functions for personalization
- Advanced caching strategies

## Technology Choices & Tradeoffs

### Next.js App Router vs Pages Router
**Choice**: App Router (Next.js 16)
**Reason**:
- Future of Next.js
- Better performance (Server Components)
- Improved data fetching
- Streaming support
- Turbopack bundler (2-5× faster builds)
- New "use cache" directive for granular caching

**Tradeoff**: App Router is now mature and stable in Next.js 16

### Contentlayer vs Direct MDX
**Choice**: Contentlayer
**Reason**:
- Type-safe content
- Build-time validation
- Fast content queries
- MDX compilation

**Tradeoff**: Extra dependency, potential migration if deprecated

### Monorepo vs Single Repo
**Choice**: Single repo (monolith)
**Reason**:
- Simpler deployment
- Fewer moving parts
- Suitable for portfolio scale
- Easy local development

**Tradeoff**: Less flexibility for microservices (not needed)

### TypeScript Strict Mode
**Choice**: Enabled
**Reason**:
- Type safety prevents bugs
- Better IDE support
- Self-documenting code
- Easier refactoring

**Tradeoff**: More verbose, stricter development

## Monitoring & Observability

### Analytics
- Vercel Analytics (built-in)
- Optional: Google Analytics, Plausible
- Track: page views, popular posts, user flow

### Error Tracking
- Vercel logs (basic)
- Optional: Sentry (advanced)
- Track: build errors, runtime errors, 404s

### Performance Monitoring
- Vercel Speed Insights
- Core Web Vitals tracking
- Lighthouse CI in GitHub Actions

## Backup & Disaster Recovery

### Content Backup
- **Decap CMS**: Git is the backup (clone repo)
- **Headless CMS**: Regular database backups, export content periodically
- Keep content export scripts in repository

### Configuration Backup
- All config in version control
- Environment variables documented
- Infrastructure as code (Vercel config)

### Recovery Plan
1. Clone repository
2. Install dependencies
3. Set environment variables
4. Deploy to Vercel
5. Configure CMS (if needed)
6. Restore content (if using Headless CMS)

## Testing Strategy

### Unit Tests
- Domain models validation
- Use case logic
- Utility functions
- Test framework: Jest/Vitest

### Integration Tests
- CMS adapter implementations
- Repository interface compliance
- Test with mock data

### E2E Tests
- Critical user flows
- Content rendering
- CMS admin interface
- Framework: Playwright (optional for v1)

### Content Validation
- Frontmatter schema validation
- Link checking
- Image optimization verification
- Automated in CI/CD

## Anti-Patterns to Avoid

### ❌ Don't
- Import CMS SDK directly in components
- Mix business logic with UI rendering
- Hardcode CMS-specific logic in multiple places
- Use any type without proper typing
- Skip migration strategy planning

### ✅ Do
- Use repository pattern consistently
- Keep domain models CMS-agnostic
- Write adapter tests
- Document architecture decisions
- Plan for migration from day one

## Decision Log

| Decision | Rationale | Date | Review Date |
|----------|-----------|------|-------------|
| Use Decap CMS initially | Free, Git-based, no backend needed | 2025-01 | 2025-06 |
| Contentlayer for MDX | Type safety, performance | 2025-01 | 2026-01 |
| Adapter pattern | Enable future CMS migration | 2025-01 | - |
| Next.js App Router | Modern architecture, performance | 2025-01 | - |
| Monolith architecture | Simplicity, suitable scale | 2025-01 | 2026-01 |

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentlayer Documentation](https://contentlayer.dev)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Adapter Pattern Explanation](https://refactoring.guru/design-patterns/adapter)
