# Personal Portfolio & Blog

A modern, scalable personal portfolio and blog platform built with Next.js, TypeScript, and a CMS-agnostic architecture designed for long-term maintainability.

## Project Overview

This portfolio is built with future scalability in mind, featuring:

- **CMS-Agnostic Architecture**: Start with Decap CMS (Git-based), migrate to Strapi/Sanity later without rewriting code
- **Clean Separation of Concerns**: Layered architecture for maintainability
- **Type-Safe Content**: TypeScript domain models with Contentlayer validation
- **Production-Ready**: Deployed on Vercel with optimized performance
- **Extensible**: Ready for future integrations (Telegram auto-posting, analytics, etc.)

## Tech Stack

### Core Technologies
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript (strict mode)
- **Content**: MDX with Contentlayer
- **Styling**: Tailwind CSS
- **CMS**: Decap CMS (Git-based)

### Deployment & Infrastructure
- **Hosting**: Vercel
- **Repository**: GitHub
- **CI/CD**: GitHub Actions
- **Analytics**: Vercel Analytics

### Future Integrations
- Headless CMS (Strapi/Sanity)
- Telegram bot for auto-posting
- Advanced analytics
- Newsletter service

## Project Structure

```
portfolio/
├── app/                          # Next.js App Router
│   ├── (routes)/
│   │   ├── blog/
│   │   │   ├── [slug]/          # Dynamic blog post pages
│   │   │   └── page.tsx         # Blog listing
│   │   ├── projects/
│   │   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── about/
│   ├── api/                      # API routes
│   │   └── webhooks/            # Future webhook handlers
│   ├── layout.tsx
│   └── page.tsx                  # Homepage
│
├── components/                   # React components
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   └── PostDetail.tsx
│   ├── projects/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── ui/                       # Reusable UI components
│
├── lib/                          # Core business logic
│   ├── domain/                   # Domain models (CMS-agnostic)
│   │   ├── models/
│   │   │   ├── BlogPost.ts
│   │   │   ├── Project.ts
│   │   │   ├── Tag.ts
│   │   │   └── Author.ts
│   │   ├── schemas/              # Validation schemas
│   │   └── use-cases/            # Business logic
│   │       ├── get-published-posts.ts
│   │       ├── get-posts-by-tag.ts
│   │       └── generate-seo.ts
│   │
│   ├── repositories/             # Data abstraction layer
│   │   ├── ContentRepository.ts  # Interface
│   │   └── factory.ts            # Factory for adapters
│   │
│   ├── adapters/                 # CMS adapters
│   │   ├── decap/
│   │   │   ├── DecapAdapter.ts
│   │   │   └── contentlayer.config.ts
│   │   ├── strapi/               # Future
│   │   │   └── StrapiAdapter.ts.example
│   │   └── sanity/               # Future
│   │       └── SanityAdapter.ts.example
│   │
│   ├── integrations/             # External services
│   │   ├── telegram/
│   │   │   └── TelegramService.ts.example
│   │   └── analytics/
│   │
│   └── utils/                    # Utility functions
│       ├── seo.ts
│       ├── date.ts
│       └── url.ts
│
├── content/                      # Content files (Decap CMS)
│   ├── blog/
│   │   ├── first-post.mdx
│   │   └── second-post.mdx
│   ├── projects/
│   └── images/
│
├── public/                       # Static assets
│   ├── images/
│   ├── admin/                    # Decap CMS admin
│   │   ├── index.html
│   │   └── config.yml
│   └── favicon.ico
│
├── styles/                       # Global styles
│   └── globals.css
│
├── docs/                         # Project documentation
│   ├── ARCHITECTURE.md          # System architecture
│   ├── MIGRATION-STRATEGY.md    # CMS migration guide
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── ROADMAP.md               # Future evolution plan
│
├── scripts/                      # Utility scripts
│   └── migrate-content.ts       # Content migration helper
│
├── .github/
│   └── workflows/
│       ├── ci.yml               # CI/CD pipeline
│       └── telegram-post.yml    # Future: auto-posting
│
├── contentlayer.config.ts       # Contentlayer configuration
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 20.9+ (required for Next.js 16)
- npm/yarn/pnpm
- Git
- GitHub account (for Decap CMS OAuth)

### Installation

#### Option 1: Use This Repository (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server (with Turbopack)
npm run dev
```

#### Option 2: Start Fresh with Create Next App

```bash
# Create new Next.js 16 app
npx create-next-app@latest portfolio --typescript --tailwind --app

# Then copy the architecture files (lib/, docs/, etc.)
# from this repository into your new project
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

### Environment Variables

Create a `.env.local` file:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Your Name

# Decap CMS (GitHub OAuth)
NEXT_PUBLIC_GITHUB_REPO=yourusername/portfolio
NEXT_PUBLIC_GITHUB_BRANCH=main

# Future: Headless CMS
# STRAPI_API_URL=
# STRAPI_API_TOKEN=

# Future: Telegram Integration
# TELEGRAM_BOT_TOKEN=
# TELEGRAM_CHANNEL_ID=

# Analytics (optional)
# NEXT_PUBLIC_GA_ID=
```

## Content Management

### Using Decap CMS (Current)

1. **Access Admin Panel**: Navigate to `/admin`
2. **Authenticate**: Sign in with GitHub OAuth
3. **Create Content**: Use the visual editor to create posts/projects
4. **Publish**: Changes are committed to your Git repository
5. **Deploy**: Vercel auto-deploys on Git push

### Creating Content Manually

Create MDX files in `content/blog/`:

```mdx
---
title: My First Blog Post
description: A short description for SEO
date: 2025-03-04
tags: [nextjs, typescript, web-development]
featuredImage: /images/blog/first-post/hero.jpg
published: true
---

Your content here with **MDX** support!
```

## Development Workflow

### Local Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Adding a New Blog Post

1. **Via CMS**: Go to `/admin` → New Post → Write → Publish
2. **Manually**: Create `content/blog/my-post.mdx` → Commit → Push

### Adding a New Project

Similar to blog posts, use `/admin` or create `content/projects/my-project.mdx`

## Key Features

### SEO Optimized
- Automatic sitemap generation
- OpenGraph and Twitter Card meta tags
- Structured data (JSON-LD)
- Optimized images with Next.js Image

### Performance
- Static Site Generation (SSG)
- Image optimization
- Code splitting
- Font optimization (next/font)

### Type Safety
- TypeScript strict mode
- Content validation with Contentlayer
- Typed domain models
- Type-safe routing

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader friendly

## Architecture Highlights

### CMS-Agnostic Design

The system uses the **Adapter Pattern** to decouple from any specific CMS:

```typescript
// Repository interface (abstract)
interface ContentRepository {
  getPost(slug: string): Promise<BlogPost>
  getAllPosts(): Promise<BlogPost[]>
}

// Decap adapter (current)
class DecapAdapter implements ContentRepository {
  // Implementation using Contentlayer
}

// Future: Strapi adapter
class StrapiAdapter implements ContentRepository {
  // Implementation using Strapi SDK
}

// Usage in components
const posts = await contentRepository.getAllPosts()
// Works with any adapter!
```

**Migration = Swap Adapter**, no component changes needed!

### Layered Architecture

1. **Presentation**: UI components (React)
2. **Domain**: Business logic, models (TypeScript)
3. **Data**: Repository interface (abstract)
4. **Adapters**: CMS implementations (Decap, Strapi, etc.)
5. **Integrations**: External services (Telegram, analytics)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed explanation.

## Documentation

- **[INDEX.md](./INDEX.md)** - Quick navigation and reference
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions
- **[MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md)** - CMS migration roadmap
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide and checklist
- **[ROADMAP.md](./ROADMAP.md)** - Future evolution plan (2-3 years)

## Migration Path

### Current Phase: Decap CMS (Git-based)
- MDX content in repository
- Git-based workflow
- Free hosting on Vercel
- No database required

### Future Phase: Headless CMS (Strapi/Sanity)
- Real-time content updates
- Advanced media management
- Multi-user collaboration
- API-based workflow

**Migration is designed to be straightforward** - swap the adapter implementation, run content migration script, deploy.

See [MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md) for the complete plan.

## Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Configure**: Set environment variables
3. **Deploy**: Automatic on every push to main
4. **Custom Domain**: Add your domain in Vercel settings

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### GitHub Actions

CI/CD pipeline runs on every push:
- Linting (ESLint)
- Type checking (TypeScript)
- Build verification
- Future: Telegram auto-posting on new content

## Future Integrations

### Telegram Auto-Posting (Planned)
When a new blog post is published, automatically post to your Telegram channel:

```typescript
// lib/integrations/telegram/TelegramService.ts
class TelegramService {
  async postArticle(post: BlogPost): Promise<void> {
    // Send formatted message to channel
  }
}
```

Triggered via:
- GitHub Action (Decap CMS)
- Webhook (Headless CMS)

### Newsletter Integration (Future)
- Email capture component
- Integration with services (ConvertKit, Mailchimp)
- Auto-send new posts to subscribers

### Advanced Analytics (Future)
- Reading time tracking
- Popular posts analytics
- User engagement metrics

## Contributing

This is a personal portfolio, but the architecture can serve as a template. Feel free to:

- Fork the repository
- Adapt the architecture for your needs
- Share improvements via issues/discussions

## License

MIT License - See LICENSE file for details

## Support & Questions

- **Documentation**: Check `/docs` folder
- **Issues**: Create a GitHub issue
- **Architecture Questions**: See [ARCHITECTURE.md](./ARCHITECTURE.md)

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the complete 2-3 year evolution plan.

### Short Term (3-6 months)
- Launch with Decap CMS
- Basic blog and projects
- SEO optimization
- Analytics integration

### Medium Term (6-12 months)
- Telegram auto-posting
- Newsletter integration
- Consider CMS migration based on needs

### Long Term (1-3 years)
- Migrate to Headless CMS if traffic grows
- Advanced features (comments, search)
- Multi-language support

---

Built with ❤️ using Next.js, TypeScript, and a clean architecture approach.
