'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface Stat {
  value: string
  label: string
  color: string
}

const stats: Stat[] = [
  { value: '10+', label: 'Years experience...', color: 'text-brand-coral' },
  { value: '14', label: 'Clients Worldwide...', color: 'text-brand-purple' },
]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center sm:text-left"
        >
          <div className={`text-5xl md:text-6xl font-bold ${stat.color} mb-2`}>
            {stat.value}
          </div>
          <div className="text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
