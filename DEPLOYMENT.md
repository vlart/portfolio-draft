# Deployment Guide

Complete guide for deploying your portfolio to production.

## Quick Start (Vercel - Recommended)

### Prerequisites
- Node.js 20.9+ (required for Next.js 16)
- GitHub repository with your code
- Vercel account (free tier available)
- GitHub account with OAuth app configured (for Decap CMS)

### 1. Connect Repository to Vercel

```bash
# Option 1: Via Vercel Dashboard
# 1. Go to https://vercel.com/new
# 2. Import your GitHub repository
# 3. Configure project settings (see below)
# 4. Deploy

# Option 2: Via Vercel CLI
npm install -g vercel
vercel login
vercel --prod
```

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Name
NEXT_PUBLIC_AUTHOR_NAME=Your Full Name
NEXT_PUBLIC_AUTHOR_EMAIL=your@email.com

# GitHub (for Decap CMS OAuth)
NEXT_PUBLIC_GITHUB_REPO=yourusername/portfolio
NEXT_PUBLIC_GITHUB_BRANCH=main

# Social (optional)
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
NEXT_PUBLIC_TWITTER_USERNAME=@yourusername
NEXT_PUBLIC_LINKEDIN_USERNAME=yourlinkedin

# CMS Provider
NEXT_PUBLIC_CMS_PROVIDER=decap

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Configure Build Settings

Vercel should auto-detect Next.js. Verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (or use default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (or use default)

### 4. Deploy

```bash
git push origin main
# Vercel automatically deploys on push to main
```

Your site will be live at `https://your-project.vercel.app`

### 5. Add Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Configure DNS:
   - Add A record: `76.76.21.21`
   - Or CNAME record: `cname.vercel-dns.com`
4. Wait for DNS propagation (5-30 minutes)

---

## Decap CMS Configuration

### GitHub OAuth Setup

1. **Create GitHub OAuth App**:
   - Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
   - Application name: `Portfolio CMS`
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Register application
   - Copy Client ID and Client Secret

2. **Configure Decap CMS** (`public/admin/config.yml`):

```yaml
backend:
  name: github
  repo: yourusername/portfolio
  branch: main
  base_url: https://api.netlify.com
  auth_endpoint: auth

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "content/blog"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Tags", name: "tags", widget: "list" }
      - { label: "Featured Image", name: "featuredImage", widget: "image" }
      - { label: "Published", name: "published", widget: "boolean", default: true }
      - { label: "Body", name: "body", widget: "markdown" }

  - name: "projects"
    label: "Projects"
    folder: "content/projects"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Featured Image", name: "featuredImage", widget: "image" }
      - { label: "Technologies", name: "technologies", widget: "list" }
      - { label: "Status", name: "status", widget: "select", options: ["completed", "in-progress", "archived"] }
      - { label: "Start Date", name: "startDate", widget: "datetime" }
      - { label: "End Date", name: "endDate", widget: "datetime", required: false }
      - { label: "Featured", name: "featured", widget: "boolean", default: false }
      - { label: "Published", name: "published", widget: "boolean", default: true }
      - { label: "Demo URL", name: "demoUrl", widget: "string", required: false }
      - { label: "GitHub URL", name: "githubUrl", widget: "string", required: false }
      - { label: "Body", name: "body", widget: "markdown" }
```

3. **Use Netlify Identity (Alternative)**:
   - If you prefer, deploy to Netlify instead of Vercel
   - Enable Netlify Identity in site settings
   - Enable Git Gateway
   - Invite yourself as a user
   - Update `config.yml` backend to use `git-gateway`

### Access CMS

1. Go to `https://yourdomain.com/admin`
2. Authenticate with GitHub
3. Start creating content!

---

## CI/CD Pipeline

### GitHub Actions Setup

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
          NEXT_PUBLIC_SITE_NAME: ${{ secrets.NEXT_PUBLIC_SITE_NAME }}
          NEXT_PUBLIC_CMS_PROVIDER: decap

      - name: Run tests (if you have them)
        run: npm test
        if: false  # Enable when you add tests
```

### Environment Variables in GitHub

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add secrets:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SITE_NAME`
   - Any other sensitive variables

---

## Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify login
netlify init
netlify deploy --prod
```

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### AWS Amplify

1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add environment variables
5. Deploy

### Docker (Self-hosted)

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
      - NEXT_PUBLIC_SITE_NAME=${NEXT_PUBLIC_SITE_NAME}
      - NEXT_PUBLIC_CMS_PROVIDER=decap
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

---

## Performance Optimization

### Build Optimization

1. **Analyze Bundle Size**:
```bash
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

2. **Enable Compression**:
Next.js automatically gzips assets on Vercel.

3. **Image Optimization**:
Always use Next.js `<Image>` component:
```tsx
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

4. **Font Optimization**:
Use `next/font`:
```tsx
import { Inter } from 'next/font/inter'

const inter = Inter({ subsets: ['latin'] })

<body className={inter.className}>
```

### Runtime Optimization

1. **Enable ISR** (when using Headless CMS):
```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 60 // Revalidate every 60 seconds
```

2. **Implement Caching**:
```tsx
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

### CDN and Edge

Vercel automatically deploys to edge locations globally.

For images, consider:
- Cloudinary
- imgix
- Vercel Image Optimization (included)

---

## Monitoring & Analytics

### Vercel Analytics (Recommended)

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Google Analytics

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Follow the wizard to configure Sentry.

---

## Security Best Practices

### Environment Variables

✅ **Do:**
- Store secrets in Vercel environment variables
- Use different values for preview and production
- Prefix client-side vars with `NEXT_PUBLIC_`

❌ **Don't:**
- Commit `.env.local` to Git
- Expose API keys in client-side code
- Use production credentials in development

### Content Security Policy

Add CSP headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}
```

### API Routes Protection

```typescript
// app/api/webhooks/[...]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.WEBHOOK_SECRET

  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Process webhook...
}
```

---

## Deployment Checklist

### Before First Deploy

- [ ] Environment variables configured
- [ ] Custom domain DNS configured
- [ ] GitHub OAuth app created (for Decap CMS)
- [ ] Decap CMS config updated with correct repo
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)

### After Deploy

- [ ] Site accessible at production URL
- [ ] All pages render correctly
- [ ] Images load properly
- [ ] SEO meta tags present (check with View Source)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] RSS feed accessible at `/rss.xml` (if implemented)
- [ ] CMS admin accessible at `/admin`
- [ ] Can authenticate with GitHub OAuth
- [ ] Can create/edit content via CMS
- [ ] Changes push to Git correctly
- [ ] Analytics tracking works
- [ ] Mobile responsive
- [ ] Performance score good (Lighthouse)
- [ ] SSL certificate active (HTTPS)

### Ongoing

- [ ] Monitor Vercel Analytics
- [ ] Check error logs weekly
- [ ] Update dependencies monthly
- [ ] Backup content (Git is backup for Decap)
- [ ] Review performance metrics

---

## Troubleshooting

### Build Fails

**Issue**: Build fails with module not found
```
Solution: Check that all dependencies are in package.json
npm install <missing-package> --save
```

**Issue**: Environment variable not defined
```
Solution: Add to Vercel environment variables and redeploy
```

### CMS Not Working

**Issue**: Cannot access `/admin`
```
Solution: Check that public/admin/index.html and config.yml exist
```

**Issue**: OAuth authentication fails
```
Solution: Verify GitHub OAuth app settings:
- Callback URL must be https://api.netlify.com/auth/done
- Check client ID in config.yml
```

### Images Not Loading

**Issue**: Images 404
```
Solution: Check image paths in frontmatter
- Use /images/... for public folder
- Ensure images are committed to Git
```

**Issue**: Next.js Image optimization errors
```
Solution: Add domain to next.config.js:
module.exports = {
  images: {
    domains: ['your-cms-domain.com'],
  },
}
```

### Performance Issues

**Issue**: Slow page loads
```
Solution:
1. Check Lighthouse score
2. Optimize images (use WebP, correct sizes)
3. Enable ISR for dynamic content
4. Use dynamic imports for heavy components
```

---

## Rollback Procedure

### Quick Rollback (Vercel)

1. Go to Vercel Dashboard → Deployments
2. Find previous stable deployment
3. Click three dots → Promote to Production

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Decap CMS Documentation**: https://decapcms.org/docs/
- **GitHub Actions**: https://docs.github.com/en/actions

---

**Next Steps**: See [ROADMAP.md](./ROADMAP.md) for future enhancements.
