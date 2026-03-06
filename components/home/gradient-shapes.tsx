'use client'

import { motion } from 'framer-motion'

export function GradientShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Purple blob - top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute -top-20 right-0 w-[500px] h-[500px]"
      >
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full rounded-full bg-gradient-to-br from-brand-purple to-brand-pink blur-3xl opacity-60"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          }}
        />
      </motion.div>

      {/* Pink/Coral blob - center right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px]"
      >
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full rounded-full bg-gradient-to-br from-brand-pink to-brand-coral blur-3xl opacity-50"
        />
      </motion.div>

      {/* Orange blob - bottom right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-0 right-1/3 w-[350px] h-[350px]"
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full rounded-full bg-gradient-to-br from-brand-coral to-brand-orange blur-3xl opacity-60"
          style={{
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
        />
      </motion.div>

      {/* Small accent shape - with dots pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-20 right-20 w-20 h-20"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-full h-full grid grid-cols-4 gap-1"
        >
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-brand-orange" />
          ))}
        </motion.div>
      </motion.div>

      {/* Sparkle/star icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute top-32 right-48"
      >
        <motion.svg
          animate={{
            rotate: [0, 180, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-purple"
        >
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </motion.svg>
      </motion.div>
    </div>
  )
}
