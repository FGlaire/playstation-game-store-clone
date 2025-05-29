'use client'

import { useRef } from 'react'

interface ScrollPanelProps {
  imageUrl: string
  index: number
  columnIndex: number
}

export function ScrollPanel({ imageUrl, index, columnIndex }: ScrollPanelProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      className="column__item" 
      ref={itemRef}
      style={{ willChange: 'opacity, filter' }}
    >
      <div 
        className="column__item-img"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    </div>
  )
} 