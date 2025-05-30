'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ScrollPanel } from './ScrollPanel'
import { useAuth } from '@/components/providers/AuthProvider'

gsap.registerPlugin(ScrollTrigger)

interface ScrollColumnsProps {
  images: string[][]
}

export function ScrollColumns({ images }: ScrollColumnsProps) {
  const columnsRef = useRef<HTMLDivElement>(null)
  const columnWrapsRef = useRef<HTMLDivElement[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const { isLoading } = useAuth()

  useEffect(() => {
    // Wait for auth loading to complete before initializing scroll
    if (isLoading) return

    // GSAP animations
    const columns = columnsRef.current
    const columnWraps = columnWrapsRef.current
    const section = sectionRef.current

    if (!columns || !columnWraps.length || !section) return

    // Set initial state - completely invisible
    gsap.set(section, {
      opacity: 0
    })

    // Main fade in timeline
    const fadeInTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    })

    fadeInTl.to(section, {
      opacity: 1,
      duration: 1,
      ease: 'power1.inOut'
    })

    // Fade out timeline - mirroring the fade in logic
    const fadeOutTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#games',
        start: 'top bottom',
        end: 'top top',
        scrub: 1.5,
      }
    })

    fadeOutTl.to(section, {
      opacity: 0,
      duration: 1,
      ease: 'power1.inOut'
    })

    // Continuous column animations
    columnWraps.forEach((wrap, index) => {
      const yMove = index * -15 - 15

      gsap.to(wrap, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          invalidateOnRefresh: true
        },
        yPercent: yMove,
        ease: 'none'
      })
    })

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      window.removeEventListener('resize', handleResize)
    }
  }, [isLoading]) // Add isLoading to dependencies

  return (
    <section id="panels" className="section section--columns" ref={sectionRef}>
      <div className="columns" ref={columnsRef}>
        {images.map((column, columnIndex) => (
          <div 
            key={columnIndex} 
            className="column-wrap"
            ref={el => {
              if (el) columnWrapsRef.current[columnIndex] = el
            }}
          >
            <div className="column">
              {column.map((imageUrl, imageIndex) => (
                <ScrollPanel
                  key={`${columnIndex}-${imageIndex}`}
                  imageUrl={imageUrl}
                  index={imageIndex}
                  columnIndex={columnIndex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 