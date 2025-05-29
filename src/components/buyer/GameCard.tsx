'use client'

import Image from 'next/image'
import { Game } from '@/lib/types'
import { useCart } from '@/lib/store'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const { addItem, items } = useCart()
  const isInCart = items.some((item) => item.id === game.id)

  const handleAddToCart = () => {
    addItem(game)
    toast.success('Added to cart')
  }

  return (
    <Card className="group relative overflow-hidden bg-black/20 backdrop-blur-sm border-0 rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
      <CardHeader className="relative z-20 p-3 md:p-4">
        <CardTitle className="text-xl md:text-2xl font-bold text-white text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ amount: 0.3 }}
            className="inline-block"
          >
            {game.title}
          </motion.span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-0">
        <div className="relative w-full pt-[56.25%]">
          <Image
            src={game.image_url}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority
          />
        </div>
      </CardContent>
      <CardFooter className="relative z-20 flex-col gap-3 md:gap-4 p-4 md:p-6">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ amount: 0.3 }}
          className="text-xs md:text-sm text-gray-300 text-center line-clamp-2"
        >
          {game.description}
        </motion.p>
        <div className="flex w-full items-center justify-between mt-2">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ amount: 0.3 }}
            className="text-xl md:text-2xl font-bold text-white"
          >
            ${game.price.toFixed(2)}
          </motion.span>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ amount: 0.3 }}
          >
            <Button
              className="bg-white text-black hover:bg-white/90 text-sm md:text-base px-3 md:px-4"
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </Button>
          </motion.div>
        </div>
      </CardFooter>
    </Card>
  )
} 