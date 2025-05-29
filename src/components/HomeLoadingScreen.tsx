'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function HomeLoadingScreen() {
  const pathname = usePathname()
  const [shouldShow, setShouldShow] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    // Only show loading screen when directly navigating to homepage
    if (isHome && !document.referrer.includes(window.location.host)) {
      setShouldShow(true)
    }
  }, [isHome])

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="fixed inset-0 z-[70] bg-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => setShouldShow(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 1.1],
            }}
            transition={{
              duration: 2.5,
              times: [0, 0.2, 0.8, 1],
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <img
              src="/playstation-logo.svg"
              alt="PlayStation Logo"
              className="w-24 h-24"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 