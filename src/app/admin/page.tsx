'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddGameForm } from '@/components/admin/AddGameForm'
import { GamesManagement } from '@/components/admin/GamesManagement'
import { Analytics } from '@/components/admin/Analytics'
import { Toaster } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

function TabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-lg border bg-card">
            <div className="space-y-3">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-8 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(() => {
    // Try to get saved tab from localStorage, default to 'analytics'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminActiveTab') || 'analytics'
    }
    return 'analytics'
  })
  const [isTabContentLoading, setIsTabContentLoading] = useState(true)

  useEffect(() => {
    // Save active tab to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminActiveTab', activeTab)
    }
  }, [activeTab])

  useEffect(() => {
    console.log('=== Admin Dashboard State ===')
    console.log('User:', user ? { id: user.id, email: user.email } : 'No user')
    console.log('Is Admin:', isAdmin)
    console.log('Is Loading:', isLoading)

    // Only redirect if we're not loading and either there's no user or the user is not an admin
    if (!isLoading && (!user || !isAdmin)) {
      console.log('Redirecting to home - Not authorized')
      router.replace('/')
      return
    }

    if (user && isAdmin) {
      console.log('Admin Dashboard: Rendering dashboard')
      // Reset tab content loading state when auth is confirmed
      setIsTabContentLoading(false)
    }
  }, [user, isAdmin, isLoading, router])

  // Show nothing while loading auth
  if (isLoading) {
    console.log('Admin Dashboard: Loading...')
    return null
  }

  // Show nothing if not authorized (redirect will happen via useEffect)
  if (!user || !isAdmin) {
    console.log('Admin Dashboard: No access - User:', !!user, 'Admin:', isAdmin)
    return null
  }

  return (
    <div className="container mx-auto px-4 pt-20 sm:pt-24 pb-10">
      <Toaster />
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex gap-1">
          <TabsTrigger value="analytics" className="text-sm sm:text-base">Analytics</TabsTrigger>
          <TabsTrigger value="games" className="text-sm sm:text-base">Games</TabsTrigger>
          <TabsTrigger value="add-game" className="text-sm sm:text-base">Add Game</TabsTrigger>
        </TabsList>
        {isTabContentLoading ? (
          <div className="mt-4 sm:mt-6">
            <TabSkeleton />
          </div>
        ) : (
          <>
            <TabsContent value="analytics" className="mt-4 sm:mt-6">
              <Analytics />
            </TabsContent>
            <TabsContent value="games" className="mt-4 sm:mt-6">
              <GamesManagement />
            </TabsContent>
            <TabsContent value="add-game" className="mt-4 sm:mt-6">
              <AddGameForm onSuccess={() => setActiveTab('games')} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
} 