'use client'

import { Cart } from '@/components/buyer/Cart'

export default function CartPage() {
  return (
    <div className="container mx-auto py-20 sm:py-24 px-4">
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
      <div className="max-w-3xl mx-auto">
        <Cart />
      </div>
    </div>
  )
} 