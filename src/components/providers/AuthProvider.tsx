'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getUserRole } from '@/lib/supabase'
import { useCart } from '@/lib/store'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { clearCart } = useCart()
  const mountedRef = useRef(true)

  async function checkAdminRole(userId: string) {
    try {
      console.log('=== Starting admin role check ===')
      console.log('Checking admin role for user:', userId)
      
      setIsLoading(true)
      // Get the user's role
      const role = await getUserRole(userId)
      console.log('Retrieved role from database:', role)

      if (!mountedRef.current) return

      console.log('Final user role:', role)
      console.log('Setting isAdmin to:', role === 'admin')
      setIsAdmin(role === 'admin')
      console.log('=== Completed admin role check ===')
    } catch (err) {
      console.error('Error in checkAdminRole:', err)
      setIsAdmin(false)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true

    async function initializeAuth() {
      try {
        console.log('=== Starting auth initialization ===')
        setIsLoading(true)
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session:', session?.user ? {
          id: session.user.id,
          email: session.user.email,
          aud: session.user.aud
        } : 'No user')
        
        if (mountedRef.current) {
          setUser(session?.user ?? null)
          if (session?.user) {
            await checkAdminRole(session.user.id)
          } else {
            setIsLoading(false)
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          console.log('=== Auth state changed ===')
          console.log('Event:', _event)
          console.log('Session:', session?.user ? {
            id: session.user.id,
            email: session.user.email,
            aud: session.user.aud
          } : 'No user')
          
          if (!mountedRef.current) return

          setIsLoading(true)
          setUser(session?.user ?? null)
          if (session?.user) {
            await checkAdminRole(session.user.id)
          } else {
            setIsAdmin(false)
            setIsLoading(false)
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mountedRef.current = false
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    clearCart()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
} 