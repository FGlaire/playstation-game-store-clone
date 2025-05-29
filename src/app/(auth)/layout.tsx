'use client'

import { AuthTransition } from "@/components/auth/AuthTransition"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthTransition>
          {children}
        </AuthTransition>
      </div>
    </div>
  )
} 