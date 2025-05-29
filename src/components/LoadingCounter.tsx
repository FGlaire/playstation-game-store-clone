'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LoadingCounter() {
  const [count, setCount] = useState(1)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsVisible(false), 1000) // Keep 100 visible for a second
          return 100
        }
        return prev + 1
      })
    }, 20) // Adjust speed here

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute bottom-8 right-8 font-mono text-2xl text-white pointer-events-none select-none"
          initial={{ 
            opacity: 0,
            y: 20,
            scale: 0.8
          }}
          animate={{ 
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0,
            y: -20,
            scale: 0.8
          }}
          transition={{ 
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <motion.div
            initial={{ filter: 'blur(0px)' }}
            animate={{ 
              scale: [1, 1.1, 1],
              filter: ['blur(0px)', 'blur(2px)', 'blur(0px)']
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
          >
            {String(count).padStart(3, '0')}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 