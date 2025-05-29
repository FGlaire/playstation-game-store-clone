'use client'

import { useEffect, useState } from 'react'
import { Game } from '@/lib/types'
import { getGames } from '@/lib/supabase'
import { GameCard } from '@/components/buyer/GameCard'
import { motion, useAnimationControls, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ScrollColumns } from '@/components/ScrollColumns'
import { AnimatedTitle } from '@/components/AnimatedTitle'

// Each array represents a column
const PANEL_IMAGES = [
  // Column 1
  ['/panel11.jpg', '/panel12.jpg', '/panel13.jpg', '/panel14.jpg', '/panel11.jpg', '/panel12.jpg', '/panel13.jpg'],
  // Column 2
  ['/panel12.jpg', '/panel13.jpg', '/panel14.jpg', '/panel11.jpg', '/panel12.jpg', '/panel13.jpg', '/panel14.jpg'],
  // Column 3
  ['/panel13.jpg', '/panel14.jpg', '/panel11.jpg', '/panel12.jpg', '/panel13.jpg', '/panel14.jpg', '/panel11.jpg'],
  // Column 4
  ['/panel14.jpg', '/panel11.jpg', '/panel12.jpg', '/panel13.jpg', '/panel14.jpg', '/panel11.jpg', '/panel12.jpg'],
  // Column 5
  ['/panel11.jpg', '/panel12.jpg', '/panel13.jpg', '/panel14.jpg', '/panel11.jpg', '/panel12.jpg', '/panel13.jpg']
]

const marqueeStyles = `
  .marquee-wrapper {
    max-width: 100%;
    overflow: hidden;
    position: absolute;
    top: 20px;
    width: 100%;
    pointer-events: none;
  }

  .marquee {
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    animation: marquee 20s linear infinite;
  }

  .marquee span {
    display: inline-block;
  }

  @keyframes marquee {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }
`

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })
  const { ref: gamesRef, inView: gamesInView } = useInView({ triggerOnce: true })

  useEffect(() => {
    async function loadGames() {
      const data = await getGames()
      setGames(data)
      setLoading(false)
    }
    loadGames()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Panels Section - Behind everything */}
      <ScrollColumns images={PANEL_IMAGES} />

      {/* Content wrapper with higher z-index */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          id="hero"
          ref={heroRef}
          className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black"
        >
          {/* Background layers */}
          <div className="absolute inset-0">
            {/* Hero image with built-in texture */}
            <div 
              className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center scale-[1.02]"
              style={{ 
                backgroundPosition: '50% 30%',
                filter: 'brightness(0.8) contrast(1.1)'
              }}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
          </div>

          {/* Content */}
          <div className="relative w-full h-full min-h-[100dvh]">
            {/* Scrolling Text */}
            <style>{marqueeStyles}</style>
            <div className="marquee-wrapper">
              <div className="marquee">
                <span className="text-[15vw] font-medium tracking-wide text-white/85 mr-[10vw]">
                  PLAYSTATION@2025
                </span>
                <span className="text-[15vw] font-medium tracking-wide text-white/85 mr-[10vw]">
                  PLAYSTATION@2025
                </span>
                <span className="text-[15vw] font-medium tracking-wide text-white/85 mr-[10vw]">
                  PLAYSTATION@2025
                </span>
                <span className="text-[15vw] font-medium tracking-wide text-white/85 mr-[10vw]">
                  PLAYSTATION@2025
                </span>
              </div>
            </div>

            {/* Subtext */}
            <div className="absolute bottom-6 left-12 max-w-md">
              <p className="text-white/90 text-xl font-medium leading-tight tracking-wide">
                DISCOVER THE NEWEST ADVENTURES<br />
                AND CHALLENGES IN PLAYSTATION'S<br />
                LATEST GAME LINEUP.
              </p>
            </div>

            {/* Arrow Button */}
            <div className="absolute bottom-6 right-12">
              <a 
                href="#games" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <svg 
                  className="w-4 h-4 transform rotate-90 group-hover:scale-110 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Spacer section to show scrolling animation */}
        <section className="h-[200vh] w-full"></section>

        {/* Featured Games Section */}
        <section 
          id="games"
          ref={gamesRef}
          className="relative py-20 px-4 bg-black"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={gamesInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="container mx-auto relative z-10"
          >
            <AnimatedTitle 
              title="Featured Games"
              subtitle="Explore PlayStation's curated selection of featured games, showcasing the best in storytelling, graphics, and gameplay."
            />
            
            {loading ? (
              <div className="text-center text-white/60 mt-12">Loading games...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={gamesInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  )
}
