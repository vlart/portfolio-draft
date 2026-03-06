# Getting Started

Quick guide to get your portfolio up and running.

## What You Have

✅ **Complete Architecture** - All files are in place and ready to use:

```
portfolio/
├── 📚 Documentation (Ready to Read)
│   ├── README.md              ← Start here!
│   ├── INDEX.md               ← Navigation guide
│   ├── ARCHITECTURE.md        ← System design
│   ├── MIGRATION-STRATEGY.md  ← CMS migration plan
│   ├── DEPLOYMENT.md          ← Deploy to production
│   └── ROADMAP.md             ← Future planning
│
├── ⚙️ Configuration (Ready to Use)
│   ├── package.json           ← Next.js 16, React 19
│   ├── tsconfig.json          ← TypeScript config
│   ├── next.config.js         ← Next.js config
│   ├── tailwind.config.ts     ← Tailwind config
│   ├── .env.example           ← Copy to .env.local
│   └── .gitignore             ← Git configuration
│
├── 🎨 Next.js App (Ready to Run)
│   └── app/
│       ├── layout.tsx         ← Root layout
│       ├── page.tsx           ← Homepage
│       └── globals.css        ← Global styles
│
├── 🏗️ Architecture (Ready to Extend)
│   └── lib/
│       ├── domain/            ← Business logic
│       │   ├── models/        ← BlogPost, Project, Tag
│       │   └── use-cases/     ← Business operations
│       ├── repositories/      ← Data abstraction
│       ├── adapters/          ← CMS implementations
│       │   ├── decap/         ← Git-based CMS
│       │   └── strapi/        ← Headless CMS (future)
│       └── integrations/      ← External services
│           └── telegram/      ← Auto-posting (future)
│
└── 📁 Content Folders (Ready for Content)
    ├── content/blog/          ← MDX blog posts
    ├── content/projects/      ← MDX projects
    └── public/                ← Static assets
```

## 5-Minute Quick Start

### Step 1: Install Dependencies

```bash
# Make sure you have Node.js 20.9+
node --version  # Should show v20.9.0 or higher

# Install dependencies
npm install
```

### Step 2: Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your information
# At minimum, change:
# - NEXT_PUBLIC_SITE_NAME
# - NEXT_PUBLIC_AUTHOR_NAME
# - NEXT_PUBLIC_AUTHOR_EMAIL
# - NEXT_PUBLIC_GITHUB_USERNAME
```

### Step 3: Run Development Server

```bash
# Start development server with Turbopack
npm run dev

# Open http://localhost:3000 in your browser
```

**That's it!** Your portfolio is running locally.

---

## Next Steps

### 1. Customize Your Information

Edit `.env.local`:
```env
NEXT_PUBLIC_SITE_NAME=John Doe Portfolio
NEXT_PUBLIC_AUTHOR_NAME=John Doe
NEXT_PUBLIC_AUTHOR_EMAIL=john@example.com
NEXT_PUBLIC_GITHUB_USERNAME=johndoe
NEXT_PUBLIC_TWITTER_USERNAME=johndoe
```

### 2. Update Homepage

Edit `app/page.tsx` to customize your homepage.

### 3. Add Your First Blog Post

Create `content/blog/my-first-post.mdx`:

```mdx
---
title: My First Blog Post
description: This is my first post on my new portfolio
date: 2025-03-04
tags: [hello, portfolio]
published: true
---

# My First Blog Post

Hello world! This is my first post.
```

### 4. Add Your First Project

Create `content/projects/my-project.mdx`:

```mdx
---
title: My Awesome Project
description: A brief description of my project
startDate: 2024-01-01
status: completed
featured: true
published: true
technologies: [nextjs, typescript, tailwind]
githubUrl: https://github.com/yourusername/project
demoUrl: https://project-demo.com
---

# My Awesome Project

Project details here...
```

### 5. Set Up Decap CMS (Optional)

For a visual content editor:

1. Create GitHub OAuth App (see [DEPLOYMENT.md](./DEPLOYMENT.md#github-oauth-setup))
2. Configure `public/admin/config.yml`
3. Access CMS at `/admin`

---

## Common Tasks

### Build for Production

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

### Lint Code

```bash
npm run lint
```

### Preview Production Build

```bash
npm run build
npm run start
```

---

## Project Structure Explained

### App Router (`/app`)

Next.js 16 App Router for pages:
- `app/layout.tsx` - Root layout (HTML, fonts, global CSS)
- `app/page.tsx` - Homepage
- `app/(routes)/blog/` - Blog pages (create this)
- `app/(routes)/projects/` - Project pages (create this)

### Domain Layer (`/lib/domain`)

**CMS-agnostic business logic:**
- `models/` - TypeScript interfaces (BlogPost, Project, Tag)
- `use-cases/` - Business operations (filtering, sorting, SEO)

**Why?** Changing CMS doesn't break your app logic!

### Data Layer (`/lib/repositories`)

**Abstract interface for content:**
- `ContentRepository.ts` - Interface all CMS adapters implement
- `factory.ts` - Creates the right adapter based on env vars

**Why?** Swap CMS by changing one environment variable!

### Adapters Layer (`/lib/adapters`)

**CMS-specific implementations:**
- `decap/` - Current: Git-based CMS with Contentlayer
- `strapi/` - Future: Headless CMS option
- `sanity/` - Future: Another headless option

**Why?** Add new CMS support without changing existing code!

### Integration Layer (`/lib/integrations`)

**External service integrations:**
- `telegram/` - Auto-post to Telegram (future)
- `analytics/` - Analytics service (future)

---

## Architecture Benefits

### ✅ CMS-Agnostic
```typescript
// Your components depend on domain models, not CMS
function BlogPost({ post }: { post: BlogPost }) {
  return <h1>{post.title}</h1>
}

// Adapter transforms CMS data to domain model
class DecapAdapter implements ContentRepository {
  async getPost(slug: string): Promise<BlogPost> {
    // Transform Contentlayer → BlogPost
  }
}
```

**Result**: Migrate CMS without rewriting components!

### ✅ Type-Safe
```typescript
// Everything is typed with TypeScript
const post: BlogPost = await repository.getPost('my-post')
post.title    // ✅ string
post.date     // ✅ Date
post.unknown  // ❌ TypeScript error
```

**Result**: Catch errors at compile time!

### ✅ Testable
```typescript
// Mock the repository for testing
class MockRepository implements ContentRepository {
  async getPost(slug: string) {
    return mockPost
  }
}
```

**Result**: Easy unit testing!

---

## What's NOT Included (Yet)

The boilerplate is ready, but you'll need to build:

- [ ] Blog listing page (`app/(routes)/blog/page.tsx`)
- [ ] Blog detail page (`app/(routes)/blog/[slug]/page.tsx`)
- [ ] Projects listing page (`app/(routes)/projects/page.tsx`)
- [ ] Project detail page (`app/(routes)/projects/[slug]/page.tsx`)
- [ ] UI components (`components/blog/`, `components/projects/`)
- [ ] Contentlayer setup (if using Decap CMS)
- [ ] Decap CMS configuration (`public/admin/`)

**Don't worry!** The architecture is ready. Just add pages and components as you need them.

---

## Recommended Development Flow

### Phase 1: Get Comfortable (Week 1)
1. ✅ Run the project locally
2. ✅ Explore the file structure
3. ✅ Read ARCHITECTURE.md to understand the design
4. ✅ Customize the homepage

### Phase 2: Add Content Support (Week 2)
1. Set up Contentlayer (see contentlayer.config.ts.example)
2. Create blog listing and detail pages
3. Create your first blog post
4. Test locally

### Phase 3: Deploy (Week 3)
1. Set up GitHub repository
2. Configure Vercel
3. Set environment variables
4. Deploy!

### Phase 4: Polish (Ongoing)
1. Add more pages (About, Contact)
2. Create UI components
3. Add projects
4. Set up Decap CMS for easy editing

---

## Need Help?

- **Quick Reference**: See [INDEX.md](./INDEX.md)
- **Architecture Questions**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment Help**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Future Plans**: See [ROADMAP.md](./ROADMAP.md)

---

## System Requirements

```
✅ Node.js: 20.9.0 or higher
✅ npm: 10.0.0 or higher
✅ Git: Any recent version
✅ OS: macOS, Linux, or Windows (WSL recommended)
```

Check your versions:
```bash
node --version    # v20.9.0+
npm --version     # v10.0.0+
git --version     # Any version
```

---

## Troubleshooting

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### "Module parse failed" errors
```bash
# Make sure you're using Node.js 20.9+
node --version

# Update if needed
nvm install 20.9
nvm use 20.9
```

### TypeScript errors
```bash
# Run type check to see all errors
npm run type-check
```

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

---

## Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions.

---

**You're all set!** 🎉

The foundation is solid. Now build something amazing!
