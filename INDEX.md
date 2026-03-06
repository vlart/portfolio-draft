# Portfolio Project Index

Quick navigation and reference guide for the portfolio project architecture and documentation.

## Documentation Map

### Getting Started
- **[README.md](./README.md)** - Start here! Project overview, quick start, and installation guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - How to deploy to production (Vercel, custom domains, CI/CD)

### Architecture & Design
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture, design patterns, and technical decisions
- **[MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md)** - Step-by-step CMS migration plan (Decap → Strapi/Sanity)

### Planning & Future
- **[ROADMAP.md](./ROADMAP.md)** - 2-3 year evolution plan and feature timeline

## Quick Reference

### Key Concepts

| Concept | Location | Description |
|---------|----------|-------------|
| Domain Models | `lib/domain/models/` | BlogPost, Project, Tag, Author types |
| Repository Interface | `lib/repositories/ContentRepository.ts` | Abstract data access interface |
| CMS Adapters | `lib/adapters/` | Decap, Strapi, Sanity implementations |
| Use Cases | `lib/domain/use-cases/` | Business logic (filtering, SEO, etc.) |
| Components | `components/` | React UI components |
| Content | `content/` | MDX blog posts and projects |
| CMS Admin | `public/admin/` | Decap CMS configuration |

### Command Cheatsheet

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation

# Content
# Access CMS: http://localhost:3000/admin
# Create post: content/blog/post-name.mdx

# Deployment
git push                 # Auto-deploy on Vercel (after setup)
```

### Environment Variables Reference

```env
# Required
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Name
NEXT_PUBLIC_GITHUB_REPO=username/repo
NEXT_PUBLIC_GITHUB_BRANCH=main

# Optional (Future)
STRAPI_API_URL=
STRAPI_API_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=
```

## Project Structure Overview

```
portfolio/
├── app/                    # Next.js App Router (pages)
├── components/             # React components
├── lib/                    # Core business logic
│   ├── domain/            # Domain models & use cases
│   ├── repositories/      # Data abstraction
│   ├── adapters/          # CMS implementations
│   └── integrations/      # External services
├── content/               # MDX content files
├── public/                # Static assets
│   └── admin/            # Decap CMS
├── docs/                  # Documentation (you are here)
└── scripts/               # Utility scripts
```

## Architecture Layers

### 1. Presentation Layer
**Files**: `app/`, `components/`
**Purpose**: UI rendering, user interactions
**Dependencies**: Domain models (types), Use cases

### 2. Domain Layer
**Files**: `lib/domain/`
**Purpose**: Business logic, validation, models
**Dependencies**: None (pure TypeScript)

### 3. Data Abstraction Layer
**Files**: `lib/repositories/`
**Purpose**: Abstract content access interface
**Dependencies**: Domain models

### 4. Adapters Layer
**Files**: `lib/adapters/`
**Purpose**: CMS-specific implementations
**Dependencies**: Repository interface, Domain models

### 5. Integration Layer
**Files**: `lib/integrations/`
**Purpose**: External services (Telegram, analytics)
**Dependencies**: Domain models

## Common Tasks

### Adding a New Blog Post

#### Method 1: Using CMS (Recommended)
1. Navigate to `http://localhost:3000/admin`
2. Authenticate with GitHub
3. Click "New Post"
4. Fill in title, content, tags, image
5. Click "Publish" (commits to Git)

#### Method 2: Manual
1. Create `content/blog/my-post-slug.mdx`
2. Add frontmatter:
   ```yaml
   ---
   title: Post Title
   description: SEO description
   date: 2025-03-04
   tags: [tag1, tag2]
   featuredImage: /images/blog/slug/hero.jpg
   published: true
   ---
   ```
3. Write content in MDX
4. Commit and push

### Adding a New Project

Same as blog posts, but in `content/projects/` directory.

### Creating a New Component

```typescript
// components/blog/MyComponent.tsx
import { BlogPost } from '@/lib/domain/models/BlogPost'

interface MyComponentProps {
  post: BlogPost  // Use domain model, not CMS-specific type
}

export function MyComponent({ post }: MyComponentProps) {
  return <div>{post.title}</div>
}
```

### Creating a New Use Case

```typescript
// lib/domain/use-cases/my-use-case.ts
import { BlogPost } from '../models/BlogPost'

export function myUseCase(posts: BlogPost[]): BlogPost[] {
  // Business logic here
  return posts.filter(/* ... */)
}
```

### Switching CMS Adapter

```typescript
// lib/repositories/factory.ts
import { DecapAdapter } from '../adapters/decap/DecapAdapter'
import { StrapiAdapter } from '../adapters/strapi/StrapiAdapter'

export function createContentRepository() {
  const adapter = process.env.CMS_PROVIDER === 'strapi'
    ? new StrapiAdapter()
    : new DecapAdapter()

  return adapter
}
```

Change `CMS_PROVIDER` env variable, no code changes needed!

## Key Files Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js configuration |
| `contentlayer.config.ts` | Contentlayer setup for MDX |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript compiler options |
| `public/admin/config.yml` | Decap CMS configuration |
| `.env.local` | Environment variables (not in Git) |
| `.env.example` | Environment variables template |

### Core TypeScript Files

| File | Purpose |
|------|---------|
| `lib/domain/models/BlogPost.ts` | BlogPost domain model |
| `lib/domain/models/Project.ts` | Project domain model |
| `lib/repositories/ContentRepository.ts` | Repository interface |
| `lib/adapters/decap/DecapAdapter.ts` | Decap CMS adapter |
| `lib/domain/use-cases/get-published-posts.ts` | Get published posts |
| `lib/domain/use-cases/generate-seo.ts` | SEO metadata generation |

## Frequently Asked Questions

### Where do I write content?
- **Decap CMS**: `/admin` interface (recommended)
- **Manual**: `content/blog/` or `content/projects/` MDX files

### How do I change styling?
- Global styles: `styles/globals.css`
- Tailwind classes: Directly in components
- Tailwind config: `tailwind.config.ts`

### Where is the CMS configured?
- Decap CMS: `public/admin/config.yml`
- Contentlayer: `contentlayer.config.ts`

### How do I add a new page?
Create file in `app/(routes)/` directory:
- `app/(routes)/about/page.tsx` → `/about`
- `app/(routes)/contact/page.tsx` → `/contact`

### Where do images go?
- **Current**: `public/images/` or `content/images/`
- **Reference**: `/images/path/to/image.jpg` in frontmatter
- **Component**: Use Next.js `<Image>` component

### How do I customize the CMS?
Edit `public/admin/config.yml`:
```yaml
collections:
  - name: blog
    label: Blog
    folder: content/blog
    fields:
      - { name: title, label: Title, widget: string }
      # Add more fields...
```

### How does CMS migration work?
1. Create new adapter (e.g., `StrapiAdapter`)
2. Implement `ContentRepository` interface
3. Run migration script to move content
4. Update environment variable
5. Deploy

See [MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md) for details.

### Where is the Telegram integration?
Currently a placeholder in `lib/integrations/telegram/`.
Activate when ready:
1. Create Telegram bot
2. Get bot token and channel ID
3. Set environment variables
4. Enable webhook/GitHub Action
5. Deploy

## Design Patterns Used

### Adapter Pattern
**Purpose**: Decouple from specific CMS
**Location**: `lib/adapters/`
**Benefit**: Easy CMS migration

### Repository Pattern
**Purpose**: Abstract data access
**Location**: `lib/repositories/`
**Benefit**: Business logic independent of data source

### Facade Pattern
**Purpose**: Simplify complex subsystems
**Location**: Use cases in `lib/domain/use-cases/`
**Benefit**: Clean API for components

### Dependency Injection
**Purpose**: Loose coupling
**Location**: Repository factory
**Benefit**: Easy testing and swapping implementations

## Troubleshooting

### Build fails
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check ESLint errors
rm -rf .next        # Clear Next.js cache
npm run build       # Rebuild
```

### CMS admin not working
- Check GitHub OAuth configuration
- Verify `public/admin/config.yml`
- Check browser console for errors
- Ensure GitHub repo/branch in env vars is correct

### Content not showing
- Check frontmatter syntax
- Verify `published: true`
- Check file is in correct directory
- Run `npm run dev` to rebuild

### Type errors
```bash
npm run type-check        # Find errors
# Fix errors in source files
# Check domain models match adapters
```

## Migration Checklist

When migrating CMS (Decap → Strapi/Sanity):

- [ ] Set up new CMS instance
- [ ] Create new adapter implementing `ContentRepository`
- [ ] Write adapter tests
- [ ] Run content migration script
- [ ] Update environment variables
- [ ] Test locally
- [ ] Deploy to staging
- [ ] Verify all content renders correctly
- [ ] Update webhooks (if needed)
- [ ] Deploy to production
- [ ] Monitor for issues

Full guide: [MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md)

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Contentlayer Docs](https://contentlayer.dev)
- [Decap CMS Docs](https://decapcms.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project Docs
- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md) - CMS migration
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [ROADMAP.md](./ROADMAP.md) - Future plans

### External Resources
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## Need Help?

1. **Check documentation** in `/docs` folder
2. **Search GitHub issues** for similar problems
3. **Create new issue** with reproduction steps
4. **Review architecture** in [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Quick Links**:
[README](./README.md) | [Architecture](./ARCHITECTURE.md) | [Migration](./MIGRATION-STRATEGY.md) | [Deployment](./DEPLOYMENT.md) | [Roadmap](./ROADMAP.md)
