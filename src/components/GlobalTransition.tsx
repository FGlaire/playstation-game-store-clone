'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface GlobalTransitionProps {
  children: React.ReactNode
}

export function GlobalTransition({ children }: GlobalTransitionProps) {
  const pathname = usePathname()
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  
  useEffect(() => {
    setPreviousPath(pathname)
  }, [pathname])

  const isLeavingHome = previousPath === '/' && pathname !== '/'
  const isEnteringHome = pathname === '/' && previousPath !== null && previousPath !== '/'
  const isAuthRoute = pathname.includes('/auth/')

  // Skip transition animation when entering home (handled by LoadingScreen)
  if (isEnteringHome) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div 
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: isAuthRoute ? 0 : -20 }}
        transition={{ 
          duration: isLeavingHome ? 0.4 : 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
} 