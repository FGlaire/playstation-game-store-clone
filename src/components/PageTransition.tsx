'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition() {
  const pathname = usePathname()

  // Skip transition for auth routes
  if (pathname.includes('sign-')) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="fixed inset-0 bg-black z-[60] pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: [0, 1, 1, 0],
          originX: ["0%", "0%", "100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.4, 0.6, 1]
        }}
      >
        <motion.div
          className="absolute bottom-8 right-8 text-white font-mono text-xl origin-right"
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            x: [-20, 0, 0, 20]
          }}
          transition={{
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.4, 0.6, 1]
          }}
        >
          {pathname === '/' ? 'home' : pathname.slice(1)}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 