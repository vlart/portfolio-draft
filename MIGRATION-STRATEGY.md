# CMS Migration Strategy

Complete guide for migrating from Decap CMS (Git-based) to Headless CMS (Strapi or Sanity).

## Migration Philosophy

The architecture is designed with **migration in mind from day one**. Key principles:

1. **No Breaking Changes**: UI components don't change during migration
2. **Data Preservation**: All content migrates without loss
3. **Minimal Downtime**: Blue-green deployment strategy
4. **Rollback Plan**: Easy reversion if issues arise
5. **Testing First**: Validate in staging before production

## When to Migrate

### Stick with Decap CMS if:
- Traffic < 10k visitors/month
- Infrequent updates (weekly or less)
- Single author
- Git workflow is comfortable
- Free hosting is priority

### Migrate to Headless CMS if:
- Traffic > 10k visitors/month
- Frequent updates (daily or more)
- Multiple authors/editors
- Need real-time publishing
- Need advanced media management
- Want webhooks for integrations
- Need content scheduling
- Want visual page builder

## Migration Options

### Option 1: Strapi (Recommended for Control)

**Pros:**
- Open source, self-hostable
- Full control over data
- GraphQL + REST APIs
- Rich plugin ecosystem
- Good TypeScript support
- Customizable admin panel

**Cons:**
- Requires database (PostgreSQL recommended)
- Hosting costs ($15-50/month)
- More maintenance
- Slower than Sanity

**Best for:** Developers who want control and flexibility

### Option 2: Sanity (Recommended for Simplicity)

**Pros:**
- Excellent developer experience
- Real-time collaboration
- Fast global CDN
- Portable Text (structured content)
- Great image handling
- Studio hosting included

**Cons:**
- Vendor lock-in
- Usage-based pricing
- Learning curve for Portable Text
- Less customization than Strapi

**Best for:** Fast setup, global performance, modern editing experience

### Option 3: Stay with Decap + Add Headless Features

**Hybrid Approach:**
- Keep Decap for blog posts
- Add Strapi/Sanity for projects or portfolio items
- Use both adapters simultaneously

**When to use:** Gradual migration, test headless CMS before full commitment

## Migration Timeline

### Phase 0: Preparation (1-2 weeks)
- [ ] Review current content structure
- [ ] Choose target CMS (Strapi vs Sanity)
- [ ] Set up CMS instance (staging)
- [ ] Create content models in new CMS
- [ ] Write new adapter implementation

### Phase 1: Adapter Implementation (1 week)
- [ ] Implement new CMS adapter
- [ ] Write adapter tests
- [ ] Test with sample content
- [ ] Validate domain model mapping

### Phase 2: Content Migration (2-3 days)
- [ ] Write migration script
- [ ] Test migration with subset of content
- [ ] Migrate images to new storage
- [ ] Migrate all content
- [ ] Validate data integrity

### Phase 3: Integration Testing (3-5 days)
- [ ] Deploy to staging environment
- [ ] Test all pages render correctly
- [ ] Test CMS admin interface
- [ ] Test image loading
- [ ] Test SEO metadata
- [ ] Performance testing

### Phase 4: Production Migration (1 day)
- [ ] Set up production CMS
- [ ] Run production migration script
- [ ] Update environment variables
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Keep Decap as backup for 1 week

### Phase 5: Cleanup (1 week)
- [ ] Monitor production for stability
- [ ] Remove Decap CMS dependencies
- [ ] Archive old content files
- [ ] Update documentation
- [ ] Remove old adapter code

**Total Time: 3-4 weeks** (can overlap phases)

## Detailed Migration Steps

### Step 1: Set Up New CMS

#### For Strapi:

```bash
# Create Strapi project (separate from portfolio)
npx create-strapi-app@latest portfolio-cms --quickstart

# Or use Docker
docker run -d \
  --name strapi \
  -p 1337:1337 \
  -e DATABASE_CLIENT=postgres \
  -e DATABASE_HOST=localhost \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=strapi \
  -e DATABASE_USERNAME=strapi \
  -e DATABASE_PASSWORD=strapi \
  strapi/strapi
```

**Configure Content Types:**

1. Create "Blog Post" collection type:
   - `title` (Text, required)
   - `slug` (UID, required)
   - `description` (Text)
   - `content` (Rich Text / Markdown)
   - `publishedAt` (Date)
   - `tags` (Relation, many-to-many)
   - `featuredImage` (Media)
   - `author` (Relation)

2. Create "Tag" collection type:
   - `name` (Text, required)
   - `slug` (UID, required)

3. Create "Project" collection type (similar to Blog Post)

#### For Sanity:

```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Initialize project
sanity init

# Choose:
# - Create new project
# - Blog schema (customize later)
```

**Define Schemas** (`sanity/schemas/`):

```typescript
// blogPost.ts
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'text' },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'tags', type: 'array', of: [{ type: 'reference', to: [{ type: 'tag' }] }] },
    { name: 'featuredImage', type: 'image' },
  ]
}
```

### Step 2: Implement New Adapter

#### Create Strapi Adapter

```typescript
// lib/adapters/strapi/StrapiAdapter.ts
import { ContentRepository } from '@/lib/repositories/ContentRepository'
import { BlogPost, Project, Tag } from '@/lib/domain/models'

export class StrapiAdapter implements ContentRepository {
  private apiUrl: string
  private apiToken: string

  constructor() {
    this.apiUrl = process.env.STRAPI_API_URL!
    this.apiToken = process.env.STRAPI_API_TOKEN!
  }

  async getPost(slug: string): Promise<BlogPost> {
    const response = await fetch(
      `${this.apiUrl}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        next: { revalidate: 60 } // ISR: revalidate every 60 seconds
      }
    )

    const data = await response.json()
    const strapiPost = data.data[0]

    return this.transformToPost(strapiPost)
  }

  async getAllPosts(): Promise<BlogPost[]> {
    const response = await fetch(
      `${this.apiUrl}/api/blog-posts?populate=*&sort=publishedAt:desc`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        next: { revalidate: 60 }
      }
    )

    const data = await response.json()
    return data.data.map(this.transformToPost)
  }

  async getAllProjects(): Promise<Project[]> {
    // Similar implementation
  }

  async getAllTags(): Promise<Tag[]> {
    // Similar implementation
  }

  private transformToPost(strapiPost: any): BlogPost {
    return {
      id: strapiPost.id.toString(),
      slug: strapiPost.attributes.slug,
      title: strapiPost.attributes.title,
      description: strapiPost.attributes.description,
      content: strapiPost.attributes.content,
      publishedAt: new Date(strapiPost.attributes.publishedAt),
      updatedAt: new Date(strapiPost.attributes.updatedAt),
      tags: strapiPost.attributes.tags?.data.map(this.transformToTag) || [],
      featuredImage: strapiPost.attributes.featuredImage?.data
        ? {
            url: `${this.apiUrl}${strapiPost.attributes.featuredImage.data.attributes.url}`,
            alt: strapiPost.attributes.featuredImage.data.attributes.alternativeText || '',
            width: strapiPost.attributes.featuredImage.data.attributes.width,
            height: strapiPost.attributes.featuredImage.data.attributes.height,
          }
        : undefined,
      author: {
        name: strapiPost.attributes.author?.data.attributes.name || 'Unknown',
        avatar: strapiPost.attributes.author?.data.attributes.avatar?.data.attributes.url,
      },
      published: true,
    }
  }

  private transformToTag(strapiTag: any): Tag {
    return {
      id: strapiTag.id.toString(),
      name: strapiTag.attributes.name,
      slug: strapiTag.attributes.slug,
    }
  }
}
```

#### Create Sanity Adapter

```typescript
// lib/adapters/sanity/SanityAdapter.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { ContentRepository } from '@/lib/repositories/ContentRepository'
import { BlogPost, Project, Tag } from '@/lib/domain/models'

export class SanityAdapter implements ContentRepository {
  private client

  constructor() {
    this.client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: '2024-01-01',
      useCdn: true, // Use CDN for faster reads
    })
  }

  async getPost(slug: string): Promise<BlogPost> {
    const query = `*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      description,
      content,
      publishedAt,
      _updatedAt,
      tags[]->{ _id, name, "slug": slug.current },
      featuredImage,
      author->{ name, avatar }
    }`

    const sanityPost = await this.client.fetch(query, { slug })
    return this.transformToPost(sanityPost)
  }

  async getAllPosts(): Promise<BlogPost[]> {
    const query = `*[_type == "blogPost"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      description,
      content,
      publishedAt,
      _updatedAt,
      tags[]->{ _id, name, "slug": slug.current },
      featuredImage,
      author->{ name, avatar }
    }`

    const sanityPosts = await this.client.fetch(query)
    return sanityPosts.map(this.transformToPost)
  }

  async getAllProjects(): Promise<Project[]> {
    // Similar implementation
  }

  async getAllTags(): Promise<Tag[]> {
    // Similar implementation
  }

  private transformToPost(sanityPost: any): BlogPost {
    const builder = imageUrlBuilder(this.client)

    return {
      id: sanityPost._id,
      slug: sanityPost.slug,
      title: sanityPost.title,
      description: sanityPost.description,
      content: this.portableTextToMarkdown(sanityPost.content),
      publishedAt: new Date(sanityPost.publishedAt),
      updatedAt: new Date(sanityPost._updatedAt),
      tags: sanityPost.tags || [],
      featuredImage: sanityPost.featuredImage
        ? {
            url: builder.image(sanityPost.featuredImage).url(),
            alt: sanityPost.featuredImage.alt || '',
            width: sanityPost.featuredImage.asset?.metadata?.dimensions?.width,
            height: sanityPost.featuredImage.asset?.metadata?.dimensions?.height,
          }
        : undefined,
      author: sanityPost.author,
      published: true,
    }
  }

  private portableTextToMarkdown(portableText: any[]): string {
    // Convert Sanity's Portable Text to Markdown
    // Use @portabletext/to-markdown library
    return portableText
      .map(block => {
        if (block._type === 'block') {
          return block.children.map(child => child.text).join('')
        }
        return ''
      })
      .join('\n\n')
  }
}
```

### Step 3: Update Repository Factory

```typescript
// lib/repositories/factory.ts
import { ContentRepository } from './ContentRepository'
import { DecapAdapter } from '../adapters/decap/DecapAdapter'
import { StrapiAdapter } from '../adapters/strapi/StrapiAdapter'
import { SanityAdapter } from '../adapters/sanity/SanityAdapter'

export function createContentRepository(): ContentRepository {
  const provider = process.env.NEXT_PUBLIC_CMS_PROVIDER || 'decap'

  switch (provider) {
    case 'strapi':
      return new StrapiAdapter()
    case 'sanity':
      return new SanityAdapter()
    case 'decap':
    default:
      return new DecapAdapter()
  }
}

// Usage in components/pages:
// const repository = createContentRepository()
// const posts = await repository.getAllPosts()
```

### Step 4: Content Migration Script

```typescript
// scripts/migrate-content.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@sanity/client' // or Strapi SDK

interface MigrationResult {
  success: number
  failed: number
  errors: string[]
}

async function migrateToStrapi(): Promise<MigrationResult> {
  const result: MigrationResult = { success: 0, failed: 0, errors: [] }

  const strapiUrl = process.env.STRAPI_API_URL!
  const strapiToken = process.env.STRAPI_API_TOKEN!

  // Read all MDX files
  const contentDir = path.join(process.cwd(), 'content', 'blog')
  const files = fs.readdirSync(contentDir)

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue

    try {
      const filePath = path.join(contentDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data: frontmatter, content } = matter(fileContent)

      // Upload featured image if exists
      let featuredImageId: number | undefined
      if (frontmatter.featuredImage) {
        const imagePath = path.join(process.cwd(), 'public', frontmatter.featuredImage)
        const imageBuffer = fs.readFileSync(imagePath)
        const formData = new FormData()
        formData.append('files', new Blob([imageBuffer]), path.basename(imagePath))

        const imageResponse = await fetch(`${strapiUrl}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${strapiToken}` },
          body: formData,
        })

        const imageData = await imageResponse.json()
        featuredImageId = imageData[0]?.id
      }

      // Create blog post in Strapi
      const postResponse = await fetch(`${strapiUrl}/api/blog-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`,
        },
        body: JSON.stringify({
          data: {
            title: frontmatter.title,
            slug: frontmatter.slug || file.replace('.mdx', ''),
            description: frontmatter.description,
            content: content,
            publishedAt: frontmatter.date,
            featuredImage: featuredImageId,
            // Handle tags separately (create if not exists, then link)
          },
        }),
      })

      if (postResponse.ok) {
        result.success++
        console.log(`✓ Migrated: ${frontmatter.title}`)
      } else {
        result.failed++
        result.errors.push(`Failed to migrate ${file}: ${postResponse.statusText}`)
      }
    } catch (error) {
      result.failed++
      result.errors.push(`Error migrating ${file}: ${error.message}`)
    }
  }

  return result
}

async function migrateToSanity(): Promise<MigrationResult> {
  const result: MigrationResult = { success: 0, failed: 0, errors: [] }

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    token: process.env.SANITY_API_TOKEN!, // Write token
    apiVersion: '2024-01-01',
    useCdn: false,
  })

  const contentDir = path.join(process.cwd(), 'content', 'blog')
  const files = fs.readdirSync(contentDir)

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue

    try {
      const filePath = path.join(contentDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data: frontmatter, content } = matter(fileContent)

      // Upload image if exists
      let imageAsset
      if (frontmatter.featuredImage) {
        const imagePath = path.join(process.cwd(), 'public', frontmatter.featuredImage)
        const imageBuffer = fs.readFileSync(imagePath)
        imageAsset = await client.assets.upload('image', imageBuffer, {
          filename: path.basename(imagePath),
        })
      }

      // Convert markdown to Portable Text (simplified)
      const portableText = markdownToPortableText(content)

      // Create document
      await client.create({
        _type: 'blogPost',
        title: frontmatter.title,
        slug: { current: frontmatter.slug || file.replace('.mdx', '') },
        description: frontmatter.description,
        content: portableText,
        publishedAt: frontmatter.date,
        featuredImage: imageAsset ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        } : undefined,
      })

      result.success++
      console.log(`✓ Migrated: ${frontmatter.title}`)
    } catch (error) {
      result.failed++
      result.errors.push(`Error migrating ${file}: ${error.message}`)
    }
  }

  return result
}

function markdownToPortableText(markdown: string): any[] {
  // Simplified conversion (use a library like @sanity/block-content-to-markdown for production)
  const paragraphs = markdown.split('\n\n')
  return paragraphs.map(para => ({
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text: para }],
  }))
}

// Run migration
const target = process.argv[2] || 'strapi'

if (target === 'strapi') {
  migrateToStrapi().then(result => {
    console.log(`\nMigration complete:`)
    console.log(`  Success: ${result.success}`)
    console.log(`  Failed: ${result.failed}`)
    if (result.errors.length > 0) {
      console.log(`\nErrors:`)
      result.errors.forEach(err => console.log(`  - ${err}`))
    }
  })
} else if (target === 'sanity') {
  migrateToSanity().then(result => {
    console.log(`\nMigration complete:`)
    console.log(`  Success: ${result.success}`)
    console.log(`  Failed: ${result.failed}`)
    if (result.errors.length > 0) {
      console.log(`\nErrors:`)
      result.errors.forEach(err => console.log(`  - ${err}`))
    }
  })
}
```

**Run migration:**
```bash
# Install dependencies
npm install gray-matter

# For Strapi
STRAPI_API_URL=http://localhost:1337 \
STRAPI_API_TOKEN=your_token \
npx tsx scripts/migrate-content.ts strapi

# For Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id \
NEXT_PUBLIC_SANITY_DATASET=production \
SANITY_API_TOKEN=your_write_token \
npx tsx scripts/migrate-content.ts sanity
```

### Step 5: Update Environment Variables

```env
# .env.local (production)

# Switch CMS provider
NEXT_PUBLIC_CMS_PROVIDER=strapi  # or 'sanity'

# Strapi
STRAPI_API_URL=https://your-strapi.com
STRAPI_API_TOKEN=your_api_token

# OR Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
```

### Step 6: Deploy and Verify

```bash
# 1. Test locally
npm run dev
# Visit all pages, check content renders

# 2. Build test
npm run build
npm run start

# 3. Deploy to staging (if you have staging environment)
git push staging main

# 4. Deploy to production
git push origin main
# Or via Vercel dashboard

# 5. Monitor
# Check Vercel logs
# Test all pages in production
# Monitor error tracking (Sentry)
```

## Webhook Setup (Post-Migration)

### Strapi Webhooks

**In Strapi Admin:**
1. Settings → Webhooks → Create
2. URL: `https://yourdomain.com/api/webhooks/revalidate`
3. Events: `entry.create`, `entry.update`, `entry.delete`

**API Route** (`app/api/webhooks/revalidate/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  try {
    // Revalidate affected paths
    if (body.model === 'blog-post') {
      revalidatePath('/blog')
      revalidatePath(`/blog/${body.entry.slug}`)
    }

    return NextResponse.json({ revalidated: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 })
  }
}
```

### Sanity Webhooks

**In Sanity Dashboard:**
1. API → Webhooks → Create
2. URL: `https://yourdomain.com/api/webhooks/revalidate`
3. Dataset: production
4. Trigger on: Create, Update, Delete

Same API route as above, adjust logic for Sanity payload structure.

## Rollback Plan

If migration fails or issues arise:

### Immediate Rollback

```bash
# 1. Update environment variable
NEXT_PUBLIC_CMS_PROVIDER=decap

# 2. Redeploy
git revert HEAD
git push origin main

# Or in Vercel dashboard:
# Deployments → Select previous deployment → Promote to Production
```

### Content Rollback

If content is corrupted:

1. **Decap CMS**: Revert Git commits
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Headless CMS**: Restore from backup
   ```bash
   # Strapi: Restore database
   pg_restore -d strapi backup.dump

   # Sanity: Import from export
   sanity dataset import backup.tar.gz production
   ```

## Cost Comparison

### Decap CMS (Current)
- Hosting: $0 (Vercel free tier)
- CMS: $0 (GitHub OAuth)
- Storage: $0 (Git)
- **Total: $0/month**

### Strapi Migration
- Hosting: $15-50/month (Railway, Heroku, DigitalOcean)
- Database: Included or $10/month
- Storage: $5-10/month (S3, Cloudinary)
- **Total: $30-70/month**

### Sanity Migration
- CMS: $0 (free tier: 10k documents, 5GB assets)
- Hosting: $0 (included)
- Storage: $0 (included in free tier)
- Scaling: $99+/month (growth tier)
- **Total: $0-99/month**

## Performance Expectations

### Decap CMS (Build-time)
- Build time: 30-120s (depending on content)
- Page load: Very fast (static)
- Time to publish: 1-3 minutes (rebuild)

### Headless CMS (Run-time)
- Build time: 10-30s (no content processing)
- Page load: Fast (ISR with revalidation)
- Time to publish: Instant (with webhook revalidation)

## Testing Checklist

Before production migration:

- [ ] All blog posts render correctly
- [ ] All projects render correctly
- [ ] Images load from new storage
- [ ] SEO metadata is correct
- [ ] Sitemap generates correctly
- [ ] RSS feed works (if implemented)
- [ ] Tags/categories work
- [ ] Search works (if implemented)
- [ ] CMS admin interface is accessible
- [ ] Webhooks trigger revalidation
- [ ] Performance is acceptable (Lighthouse)
- [ ] Mobile responsive
- [ ] Accessibility audit passes

## Common Issues & Solutions

### Issue: Images not loading
**Solution:** Update image paths in adapter transformation
```typescript
// Ensure absolute URLs
url: `${process.env.CMS_URL}${image.url}`
```

### Issue: Build fails after migration
**Solution:** Check environment variables are set in Vercel
```bash
vercel env pull .env.local
# Verify all required vars are present
```

### Issue: Content formatting broken
**Solution:** Adjust content transformation in adapter
```typescript
// Handle rich text → markdown conversion carefully
// Test with various content formats
```

### Issue: Slow page loads
**Solution:** Implement ISR with proper revalidation
```typescript
export const revalidate = 60 // Revalidate every 60 seconds
```

### Issue: CMS authentication fails
**Solution:** Check API tokens and CORS settings
```javascript
// In Strapi: Settings → Users & Permissions → Roles → Public
// Enable find and findOne for blog-posts
```

## Post-Migration Cleanup

After 1-2 weeks of stable operation:

```bash
# Remove Decap CMS
rm -rf public/admin

# Remove Contentlayer (if not needed)
npm uninstall contentlayer next-contentlayer
rm contentlayer.config.ts

# Remove old content files (keep in Git history)
git mv content content-archive
git commit -m "Archive old content files"

# Update documentation
# Remove Decap CMS references from README
```

## Future Migrations

The adapter pattern makes future changes easy:

### Adding a Second CMS (Hybrid)
```typescript
export function createContentRepository(source?: 'blog' | 'projects') {
  if (source === 'blog') {
    return new StrapiAdapter() // Blog posts in Strapi
  } else if (source === 'projects') {
    return new SanityAdapter() // Projects in Sanity
  }
  return new DecapAdapter() // Default
}
```

### Switching Between Headless CMS
Same process as Decap → Strapi migration:
1. Create new adapter
2. Run migration script
3. Update env variable
4. Deploy

## Support Resources

- **Strapi**: [strapi.io/documentation](https://strapi.io/documentation)
- **Sanity**: [sanity.io/docs](https://sanity.io/docs)
- **Migration Tools**:
  - `contentful-to-strapi`
  - `sanity-migration-toolkit`
  - Custom scripts (recommended for control)

---

**Remember**: The architecture makes migration a **configuration change**, not a rewrite.
