'use client'

import { Suspense } from 'react'
import { AuthTransition } from "@/components/auth/AuthTransition"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <AuthTransition>
            {children}
          </AuthTransition>
        </Suspense>
      </div>
    </div>
  )
} 