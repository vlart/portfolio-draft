'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Project {
  id: string
  title: string
  category: string
  description: string
  image: string
  liveUrl?: string
  githubUrl?: string
  tags: string[]
}

const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'A modern e-commerce platform with real-time inventory management and payment processing.',
    image: '/images/projects/project1.jpg',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    tags: ['Next.js', 'TypeScript', 'Stripe'],
  },
  {
    id: '2',
    title: 'Portfolio Website',
    category: 'UI/UX Design',
    description: 'Minimalist portfolio design for a creative agency with smooth animations and transitions.',
    image: '/images/projects/project2.jpg',
    liveUrl: 'https://example.com',
    tags: ['Figma', 'React', 'Framer Motion'],
  },
  {
    id: '3',
    title: 'Mobile Banking App',
    category: 'Mobile App',
    description: 'Secure mobile banking application with biometric authentication and real-time transactions.',
    image: '/images/projects/project3.jpg',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    tags: ['React Native', 'Node.js', 'MongoDB'],
  },
  {
    id: '4',
    title: 'Task Management Tool',
    category: 'Web Development',
    description: 'Collaborative task management platform with team workspaces and project tracking.',
    image: '/images/projects/project4.jpg',
    liveUrl: 'https://example.com',
    tags: ['Vue.js', 'Firebase', 'Tailwind'],
  },
  {
    id: '5',
    title: 'Restaurant Booking System',
    category: 'Web Development',
    description: 'Online reservation system with table management and customer notifications.',
    image: '/images/projects/project5.jpg',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    tags: ['Next.js', 'PostgreSQL', 'Prisma'],
  },
  {
    id: '6',
    title: 'Fitness Tracking App',
    category: 'Mobile App',
    description: 'Personal fitness tracker with workout plans, progress tracking, and nutrition guidance.',
    image: '/images/projects/project6.jpg',
    liveUrl: 'https://example.com',
    tags: ['Flutter', 'Firebase', 'Health API'],
  },
]

const categories = ['All', 'Web Development', 'UI/UX Design', 'Mobile App']

export default function WorksPage() {
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
            My Portfolio
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            RECENT WORKS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and expertise
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
              className="px-6 py-2 rounded-full border-2 border-muted hover:border-brand-coral hover:text-brand-coral transition-all font-medium"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-muted">
                {/* Project Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-coral/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-muted-foreground/20">
                      {project.id}
                    </div>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-95 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white text-brand-purple rounded-full hover:scale-110 transition-transform"
                      >
                        <ExternalLink className="w-6 h-6" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white text-brand-purple rounded-full hover:scale-110 transition-transform"
                      >
                        <Github className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-coral">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-brand-coral transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 bg-sidebar text-sidebar-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
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
            Load More Projects
          </Button>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-sidebar text-sidebar-foreground rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have a project in mind?
          </h2>
          <p className="text-lg mb-8 text-muted-foreground">
            Let's create something amazing together
          </p>
          <Button asChild variant="gradient" size="lg">
            <a href="/contact">
              Start a Project
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
