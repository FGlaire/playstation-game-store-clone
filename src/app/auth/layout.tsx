'use client'

import { Suspense } from 'react'
import { AuthTransition } from "@/components/auth/AuthTransition"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen justify-center pt-32 px-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border rounded-lg shadow-sm">
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <AuthTransition>
              {children}
            </AuthTransition>
          </Suspense>
        </div>
      </div>
    </div>
  )
} 