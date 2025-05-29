'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmation() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const total = searchParams.get('total')
  const router = useRouter()

  useEffect(() => {
    if (!orderId || !total) {
      router.push('/')
    }
  }, [orderId, total, router])

  if (!orderId || !total) {
    return null
  }

  return (
    <div className="container mx-auto py-20 sm:py-24 px-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Thank you for your purchase!</p>
            <p className="font-semibold">Order #{orderId}</p>
            <p className="text-lg font-bold">Total: ${parseFloat(total).toFixed(2)}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 