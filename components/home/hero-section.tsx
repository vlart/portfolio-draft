'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GradientShapes } from './gradient-shapes'

interface HeroSectionProps {
  name?: string
  title?: string
  location?: string
  phone?: string
  email?: string
  profileImage?: string
  ctaText?: string
  ctaLink?: string
}

export function HeroSection({
  name = 'CAVTEA ARTIOM',
  title = 'Web Developer',
  location = 'Chisinau',
  phone = '+77 022 444 05 05',
  email = 'jacob360@gmail.com',
  profileImage = '/images/profile.jpg',
  ctaText = "Let's talk with me",
  ctaLink = '/contact',
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Animated Gradient Background */}
      <GradientShapes />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Name with animated gradient text */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="block text-foreground/90">MY NAME</span>
              <span className="block text-foreground/90">IS {name.split(' ')[0]}</span>
              <span className="block text-foreground">{name.split(' ')[1]}...</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground italic"
            >
              <span className="font-semibold text-foreground">{title}</span> based in{' '}
              <span className="font-semibold text-foreground">{location}</span>
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              asChild
              variant="gradient"
              size="xl"
              className="group"
            >
              <Link href={ctaLink}>
                {ctaText}
                <Send className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 pt-4"
          >
            {/* Phone */}
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <div className="p-2 rounded-full bg-muted group-hover:bg-brand-coral/10 transition-colors">
                <Phone className="w-5 h-5 group-hover:text-brand-coral transition-colors" />
              </div>
              <span className="font-medium">{phone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <div className="p-2 rounded-full bg-muted group-hover:bg-brand-purple/10 transition-colors">
                <Mail className="w-5 h-5 group-hover:text-brand-purple transition-colors" />
              </div>
              <span className="font-medium">{email}</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Content - Profile Image with Gradient Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative flex items-center justify-center"
        >
          {/* Gradient Background Shape */}
          <div className="relative w-full max-w-md aspect-square">
            {/* Background gradient blob */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 bg-gradient-to-br from-brand-purple via-brand-pink to-brand-coral rounded-full blur-2xl opacity-30"
            />

            {/* Profile Image */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-2xl"
            >
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-brand-orange to-brand-coral rounded-full blur-xl opacity-60"
            />

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full blur-xl opacity-50"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator (optional) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-0.5 h-8 bg-gradient-to-b from-brand-purple to-transparent"
          />
        </div>
      </motion.div>
    </section>
  )
}
