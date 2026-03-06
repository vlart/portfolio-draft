'use client'

import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Experience {
  period: string
  title: string
  company: string
}

const experiences: Experience[] = [
  {
    period: '~2018 - Present',
    title: 'LEAD UI/UX DESIGNER',
    company: '-Rolling Thunder',
  },
  {
    period: '~2018 - 2010',
    title: 'SENIOR UI/UX DESIGNER',
    company: '-Locost Accessories',
  },
  {
    period: '~2008 - 2006',
    title: 'JUNIOR UI/UX DESIGNER',
    company: '-Sagebrush',
  },
]

export function ExperienceSection() {
  return (
    <div className="bg-gradient-brand rounded-3xl p-8 md:p-12 lg:p-16 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-12">
        {/* Left side - intro */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm uppercase tracking-wider mb-2 opacity-90">
              Experience
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              MY EXPERIENCE
            </h2>
          </div>

          <p className="text-white/90 leading-relaxed">
            Hello there! My name is <span className="font-semibold">Jacob Jones</span>. I am a web
            designer & developer, and I'm very passionate and dedicated to my work.
          </p>

          <Button
            asChild
            variant="secondary"
            size="lg"
            className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"
          >
            <a href="/cv.pdf" download>
              <Download className="mr-2 w-5 h-5" />
              Download my resume
            </a>
          </Button>
        </motion.div>

        {/* Right side - timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-l-2 border-white/30 pl-6 pb-8 last:pb-0"
            >
              <div className="text-sm opacity-90 mb-2">{exp.period}</div>
              <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
              <p className="text-white/80">{exp.company}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
