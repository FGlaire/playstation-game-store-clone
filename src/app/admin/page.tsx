'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddGameForm } from '@/components/admin/AddGameForm'
import { GamesManagement } from '@/components/admin/GamesManagement'
import { Analytics } from '@/components/admin/Analytics'
import { Toaster } from 'sonner'

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('analytics')

  useEffect(() => {
    console.log('=== Admin Dashboard State ===')
    console.log('User:', user ? { id: user.id, email: user.email } : 'No user')
    console.log('Is Admin:', isAdmin)
    console.log('Is Loading:', isLoading)

    if (!isLoading && (!user || !isAdmin)) {
      console.log('Redirecting to home - Not authorized')
      router.push('/')
    }
  }, [user, isAdmin, isLoading, router])

  if (isLoading) {
    console.log('Admin Dashboard: Loading...')
    return null
  }

  if (!user || !isAdmin) {
    console.log('Admin Dashboard: No access - User:', !!user, 'Admin:', isAdmin)
    return null
  }

  console.log('Admin Dashboard: Rendering dashboard')
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
        <TabsContent value="analytics" className="mt-4 sm:mt-6">
          <Analytics />
        </TabsContent>
        <TabsContent value="games" className="mt-4 sm:mt-6">
          <GamesManagement />
        </TabsContent>
        <TabsContent value="add-game" className="mt-4 sm:mt-6">
          <AddGameForm onSuccess={() => setActiveTab('games')} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 