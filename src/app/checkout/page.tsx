'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { useCart } from '@/lib/store'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createOrder } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function Checkout() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle the checkout process
  async function handleCheckout() {
    if (isProcessing) return
    
    try {
      setIsProcessing(true)

      if (!user) {
        toast.error('Please sign in to checkout')
        return
      }

      const orderItems = items.map(item => ({
        gameId: item.id,
        price: item.price,
      }))

      const { error } = await createOrder(user.id, orderItems)

      if (error) {
        console.error('Order creation failed:', error)
        toast.error(error.message || 'Failed to create order')
        return
      }

      // Clear cart and show success message
      clearCart()
      toast.success('Order placed successfully!')
      
      // Wait for toast to show and order to be processed
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate home
      router.push('/')
    } catch (err) {
      console.error('Checkout error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-20 sm:py-24 px-4">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Sign in Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4 text-sm sm:text-base">Please sign in to complete your purchase</p>
            <div className="flex flex-col gap-2">
              <Link href="/auth/sign-in?returnUrl=/checkout" className="w-full">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up?returnUrl=/checkout" className="w-full">
                <Button variant="outline" className="w-full">Create Account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-20 sm:py-24 px-4">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4 text-sm sm:text-base">Add some games to your cart first</p>
            <Link href="/">
              <Button className="w-full">Browse Games</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="container mx-auto py-20 sm:py-24 px-4">
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:gap-4">
              {items.map((game) => (
                <div key={game.id} className="flex items-center gap-3 sm:gap-4">
                  <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={game.image_url}
                      alt={game.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 48px, 64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{game.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      ${game.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-base sm:text-lg font-semibold">Total:</span>
              <span className="text-base sm:text-lg font-semibold">${total.toFixed(2)}</span>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full text-sm sm:text-base">
                  Pay ${total.toFixed(2)}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 