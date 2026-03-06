'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, MapPin, Phone, User } from 'lucide-react'
import { StatsSection } from '@/components/about/stats-section'
import { ExperienceSection } from '@/components/about/experience-section'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
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
            Nice to meet you!
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            WELCOME TO...
          </h1>
        </motion.div>

        {/* Profile Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto aspect-square">
              {/* Colorful background blobs */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-purple/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-coral/30 rounded-full blur-3xl" />
              </div>

              {/* Profile image */}
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="/images/profile.jpg"
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Signature overlay */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-sidebar px-6 py-2 rounded-full shadow-lg">
                <span className="font-bold text-2xl bg-gradient-brand bg-clip-text text-transparent">
                  Jacob
                </span>
              </div>
            </div>

            {/* Info cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              <InfoCard icon={<Phone className="w-5 h-5" />} text="+77 022 444 05 05" />
              <InfoCard icon={<User className="w-5 h-5" />} text="25 yrs" />
              <InfoCard icon={<Mail className="w-5 h-5" />} text="jacob360@gmail.com" />
              <InfoCard icon={<MapPin className="w-5 h-5" />} text="United kingdom, London" />
            </motion.div>
          </motion.div>

          {/* Right - Info and Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Stats */}
            <StatsSection />

            {/* Bio */}
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Hello there! My name is <span className="font-semibold text-foreground">Jacob Jones</span>.
                I am a web designer & developer, and I'm very passionate and dedicated to my work.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With 10+ years experience as a professional a graphic designer, I have acquired the skills and
                knowledge necessary to make your project a success.
              </p>
            </div>

            {/* Quote */}
            <div className="bg-sidebar text-sidebar-foreground p-6 rounded-lg">
              <blockquote className="text-lg italic">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus sed sit ultrices et
                sed metus sollicitudin."
              </blockquote>
            </div>

            {/* Download CV */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-brand bg-clip-text text-transparent">
                JACOB JONES
              </h3>
              <p className="text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">Product Designer</span> based in London
              </p>
              <Button
                asChild
                variant="gradient"
                size="lg"
              >
                <a href="/cv.pdf" download>
                  Download CV
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExperienceSection />
        </motion.div>
      </div>
    </div>
  )
}

function InfoCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
      <div className="text-brand-coral">{icon}</div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}
