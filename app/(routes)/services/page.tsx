'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Palette, Smartphone, Users, Layout } from 'lucide-react'

interface Service {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  details: string
}

const services: Service[] = [
  {
    id: 'web-design',
    icon: <Layout className="w-8 h-8" />,
    title: 'Web Design',
    description: 'Creating beautiful, functional websites',
    details:
      'I create stunning, user-friendly websites that not only look great but also deliver exceptional user experiences. From concept to launch, I handle every aspect of web design with attention to detail and modern best practices.',
  },
  {
    id: 'ui-ux-design',
    icon: <Palette className="w-8 h-8" />,
    title: 'UI/UX Design',
    description: 'Crafting intuitive user experiences',
    details:
      'I specialize in creating intuitive interfaces that users love. Through research, wireframing, prototyping, and testing, I ensure every interaction is smooth and every design decision is backed by user needs.',
  },
  {
    id: 'mobile-app',
    icon: <Smartphone className="w-8 h-8" />,
    title: 'Mobile Application',
    description: 'Building responsive mobile experiences',
    details:
      'I develop mobile applications that work seamlessly across all devices. Whether it\'s iOS, Android, or cross-platform solutions, I create apps that are fast, reliable, and delightful to use.',
  },
  {
    id: 'user-research',
    icon: <Users className="w-8 h-8" />,
    title: 'User Research',
    description: 'Understanding your users deeply',
    details:
      'I conduct comprehensive user research to uncover insights that drive design decisions. Through interviews, surveys, and usability testing, I help you understand what your users truly need.',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            What I Do
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            MY SERVICES
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I provide a wide range of design and development services to help bring your ideas to life
          </p>
        </motion.div>

        {/* Services Grid - Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 bg-muted rounded-xl hover:bg-gradient-brand hover:text-white transition-all duration-300"
            >
              <div className="text-brand-coral group-hover:text-white transition-colors mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
              <p className="text-muted-foreground group-hover:text-white/90 transition-colors">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Accordion - Detailed */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Detailed Services
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {services.map((service, index) => (
              <AccordionItem
                key={service.id}
                value={service.id}
                className="bg-sidebar text-sidebar-foreground rounded-lg px-6 border-0"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div className="text-brand-coral">{service.icon}</div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sidebar-foreground/80 pt-4">
                  {service.details}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-brand rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to work together?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Let's discuss your project and see how I can help you achieve your goals
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-purple font-medium rounded-lg hover:bg-white/90 transition-all hover:scale-105"
          >
            Get in touch
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
