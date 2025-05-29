'use client'

import { useCart } from '@/lib/store'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { toast } from 'sonner'

export function Cart() {
  const { user } = useAuth()
  const { items, removeItem, clearCart } = useCart()
  const total = items.reduce((sum, item) => sum + item.price, 0)

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Your Cart ({items.length} items)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:gap-4">
        {items.map((game) => (
          <div key={game.id} className="flex items-center gap-2 md:gap-4">
            <div className="relative h-12 w-12 md:h-16 md:w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={game.image_url}
                alt={game.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm md:text-base truncate">{game.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                ${game.price.toFixed(2)}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                removeItem(game.id)
                toast.success('Item removed from cart')
              }}
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">Remove</span>
              <span className="sm:hidden">×</span>
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="flex w-full items-center justify-between sm:w-auto sm:flex-1">
          <span className="text-base md:text-lg font-semibold">Total:</span>
          <span className="text-base md:text-lg font-semibold">${total.toFixed(2)}</span>
        </div>
        <div className="flex w-full flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              clearCart()
              toast.success('Cart cleared')
            }}
          >
            Clear Cart
          </Button>
          {user ? (
            <Link href="/checkout" className="w-full sm:w-auto">
              <Button className="w-full">
                Checkout
              </Button>
            </Link>
          ) : (
            <Link href="/auth/sign-in?returnUrl=/checkout" className="w-full sm:w-auto">
              <Button className="w-full">
                Sign in to Checkout
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
} 