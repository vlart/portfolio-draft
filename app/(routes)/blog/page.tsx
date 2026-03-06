'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  readTime: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
}

const posts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Design: Trends to Watch in 2024',
    excerpt: 'Explore the latest trends shaping the future of web design, from AI-powered interfaces to immersive 3D experiences.',
    image: '/images/blog/post1.jpg',
    date: 'Mar 15, 2024',
    readTime: '5 min read',
    category: 'Web Design',
    tags: ['Design', 'Trends', 'UI/UX'],
    author: {
      name: 'Jacob Jones',
      avatar: '/images/profile.jpg',
    },
  },
  {
    id: '2',
    title: 'Building Scalable Applications with Next.js 16',
    excerpt: 'Learn how to leverage Next.js 16 features to build fast, scalable web applications with server components.',
    image: '/images/blog/post2.jpg',
    date: 'Mar 10, 2024',
    readTime: '8 min read',
    category: 'Development',
    tags: ['Next.js', 'React', 'TypeScript'],
    author: {
      name: 'Jacob Jones',
      avatar: '/images/profile.jpg',
    },
  },
  {
    id: '3',
    title: 'The Art of Minimalist UI Design',
    excerpt: 'Discover the principles of minimalist design and how to create clean, focused user interfaces.',
    image: '/images/blog/post3.jpg',
    date: 'Mar 5, 2024',
    readTime: '6 min read',
    category: 'UI/UX',
    tags: ['Minimalism', 'Design', 'UI'],
    author: {
      name: 'Jacob Jones',
      avatar: '/images/profile.jpg',
    },
  },
  {
    id: '4',
    title: 'Mobile-First Design: Best Practices',
    excerpt: 'Essential tips and techniques for designing mobile-first experiences that delight users on any device.',
    image: '/images/blog/post4.jpg',
    date: 'Feb 28, 2024',
    readTime: '7 min read',
    category: 'Mobile',
    tags: ['Mobile', 'Responsive', 'UX'],
    author: {
      name: 'Jacob Jones',
      avatar: '/images/profile.jpg',
    },
  },
  {
    id: '5',
    title: 'Understanding Design Systems at Scale',
    excerpt: 'How to build and maintain design systems that grow with your product and team.',
    image: '/images/blog/post5.jpg',
    date: 'Feb 20, 2024',
    readTime: '10 min read',
    category: 'Design Systems',
    tags: ['Design Systems', 'Components', 'Scalability'],
    author: {
      name: 'Jacob Jones',
      avatar: '/images/profile.jpg',
    },
  },
  {
    id: '6',
    title: 'Accessible Web Design: A Complete Guide',
    excerpt: 'Learn how to create inclusive web experiences that work for everyone, regardless of ability.',
    image: '/images/blog/post6.jpg',
    date: 'Feb 15, 2024',
    readTime: '9 min read',
    category: 'Accessibility',
    tags: ['A11y', 'Inclusive Design', 'WCAG'],
    author: {
      name: 'Jacob Jones',
      avatar: '/images/profile.jpg',
    },
  },
]

const categories = ['All', 'Web Design', 'Development', 'UI/UX', 'Mobile']

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Thoughts & Ideas
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            MY BLOG
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sharing insights, tutorials, and thoughts on design, development, and everything in between
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full border-2 border-muted hover:border-brand-purple hover:text-brand-purple transition-all font-medium"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative group overflow-hidden rounded-3xl bg-gradient-brand p-1"
        >
          <div className="bg-background rounded-[22px] overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image */}
              <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/30 to-brand-coral/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl font-bold text-muted-foreground/20">1</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-4 py-1 bg-gradient-brand text-white rounded-full font-medium">
                    Featured
                  </span>
                  <span className="text-muted-foreground">{posts[0].category}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold group-hover:text-brand-coral transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {posts[0].date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {posts[0].readTime}
                  </div>
                </div>
                <Button variant="gradient" size="lg" className="w-fit">
                  Read Article
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-muted h-full flex flex-col">
                {/* Post Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-coral/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-muted-foreground/20">
                      {post.id}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-brand-coral text-white text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6 flex-1 flex flex-col space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold group-hover:text-brand-purple transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 bg-sidebar text-sidebar-foreground rounded-full flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More Link */}
                  <a
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-brand-coral hover:text-brand-purple transition-colors font-medium text-sm pt-2"
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="gradient" size="lg">
            Load More Posts
          </Button>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-brand rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to my newsletter
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Get the latest articles, tutorials, and insights delivered directly to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-brand-purple hover:bg-white/90"
            >
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
