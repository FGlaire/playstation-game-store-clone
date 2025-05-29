'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
}

const transition = {
  type: "spring",
  stiffness: 400,
  damping: 40
}

const getDirection = (currentPath: string, previousPath: string | null) => {
  // Coming from homepage or other non-auth pages
  if (!previousPath?.includes('/auth/')) {
    return 1
  }
  
  // Moving between auth pages
  if (currentPath === '/auth/sign-in') return -1
  if (currentPath === '/auth/sign-up') return 1
  return 0
}

interface AuthTransitionProps {
  children: React.ReactNode
}

export function AuthTransition({ children }: AuthTransitionProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const fullPath = returnUrl ? `${pathname}?returnUrl=${returnUrl}` : pathname
  const [previousPath, setPreviousPath] = React.useState<string | null>(null)

  React.useEffect(() => {
    setPreviousPath(pathname)
  }, [pathname])

  return (
    <div className="w-full relative">
      <AnimatePresence
        mode="wait"
        custom={getDirection(pathname, previousPath)}
        onExitComplete={() => window.scrollTo(0, 0)}
        initial={false}
      >
        <motion.div
          key={fullPath}
          custom={getDirection(pathname, previousPath)}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="w-full"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 