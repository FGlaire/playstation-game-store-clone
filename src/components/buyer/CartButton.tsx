'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/store'

export function CartButton() {
  const { items } = useCart()

  return (
    <Link href="/cart">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-white hover:text-white hover:bg-white/10"
      >
        <ShoppingCart className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-black font-medium">
            {items.length}
          </span>
        )}
      </Button>
    </Link>
  )
} 