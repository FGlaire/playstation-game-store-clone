'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface AnimatedTitleProps {
  title: string
  subtitle?: string
}

export function AnimatedTitle({ title, subtitle }: AnimatedTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Only use scroll progress for subtle parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20])

  return (
    <div ref={containerRef} className="relative py-20">
      <motion.div
        className="flex flex-col items-center justify-center"
      >
        <motion.h2 
          className="text-6xl md:text-8xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          viewport={{ margin: "-100px" }}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <motion.span
            style={{ y }}
            className="inline-block"
          >
            {title}
          </motion.span>
        </motion.h2>
        {subtitle && (
          <motion.p 
            className="text-lg md:text-xl text-white/70 max-w-2xl text-center leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            viewport={{ margin: "-100px" }}
            transition={{ 
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1
            }}
          >
            <motion.span
              style={{ y }}
              className="inline-block"
            >
              {subtitle}
            </motion.span>
          </motion.p>
        )}
      </motion.div>
    </div>
  )
} 