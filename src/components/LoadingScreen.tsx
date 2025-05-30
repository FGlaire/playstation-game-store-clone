'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LoadingCounter } from './LoadingCounter'

export function LoadingScreen() {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (isInitialLoad || isTransitioning) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    // Initial load handling
    if (isInitialLoad) {
      window.onload = () => {
        setTimeout(() => {
          setIsInitialLoad(false)
          setHasLoaded(true)
        }, 2500) // Minimum loading time of 2.5s to ensure counter animation completes
      }

      // Fallback in case window.onload doesn't trigger
      const fallbackTimer = setTimeout(() => {
        setIsInitialLoad(false)
        setHasLoaded(true)
      }, 3500)

      return () => {
        clearTimeout(fallbackTimer)
      }
    }
  }, [isInitialLoad, isTransitioning])

  // Store the last pathname to detect navigation
  const [lastPathname, setLastPathname] = useState(pathname)
  const isNavigatingToHome = pathname === '/' && lastPathname !== '/' && hasLoaded
  const isNavigatingToAuth = pathname.includes('/auth/') && !lastPathname?.includes('/auth/') && hasLoaded

  useEffect(() => {
    if (hasLoaded && pathname !== lastPathname) {
      // Skip transition for auth pages internal navigation (handled by AuthTransition)
      if (pathname.includes('/auth/') && lastPathname?.includes('/auth/')) {
        setLastPathname(pathname)
        return
      }

      setIsTransitioning(true)
      
      // Start checking if resources are loaded
      const checkResources = () => {
        const images = Array.from(document.images)
        const resources = [...images]
        const allLoaded = resources.every((resource) => {
          if (resource.tagName === 'IMG') {
            return resource.complete
          }
          return true
        })

        if (allLoaded) {
          // Add a minimum transition time
          setTimeout(() => {
            setIsTransitioning(false)
          }, pathname.includes('/auth/') ? 600 : 800)
        } else {
          requestAnimationFrame(checkResources)
        }
      }

      // Start checking after a small delay to allow for new content to be mounted
      setTimeout(checkResources, 100)
    }
    setLastPathname(pathname)
  }, [pathname, lastPathname, hasLoaded])

  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isTransitioning])

  return (
    <AnimatePresence mode="wait">
      {(isInitialLoad || isNavigatingToHome || isTransitioning) && (
        <>
          <motion.div
            className="fixed inset-0 bg-black z-[100] pointer-events-auto origin-right"
            initial={isInitialLoad ? { scaleX: 1 } : { scaleX: 0 }}
            animate={isNavigatingToHome || isTransitioning ? { 
              scaleX: [0, 1, 1, 0],
              opacity: isTransitioning ? (isNavigatingToAuth ? [1, 1, 1, 0] : [1, 1, 0.97, 0]) : [1, 1, 1, 0]
            } : undefined}
            exit={{ 
              scaleX: 0,
              transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1
              }
            }}
            transition={isNavigatingToHome || isTransitioning ? {
              duration: isNavigatingToAuth ? 0.8 : (isTransitioning ? 1.2 : 1.5),
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.4, 0.6, 1]
            } : undefined}
          />
          {isInitialLoad && (
            <motion.div
              className="fixed inset-0 z-[101] pointer-events-none"
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}
            >
              <LoadingCounter />
            </motion.div>
          )}
          {isTransitioning && !isNavigatingToAuth && (
            <motion.div
              className="fixed inset-0 z-[101] pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src="/playstation-logo.svg"
                alt="Loading..."
                className="w-12 h-12 opacity-80"
                animate={{ 
                  rotate: 360,
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  rotate: {
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity
                  },
                  scale: {
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity
                  }
                }}
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
} 