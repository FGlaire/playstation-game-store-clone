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
  const adminCheckTimeoutRef = useRef<NodeJS.Timeout>()
  const initializationRef = useRef(false)
  const lastKnownRoleRef = useRef<string | null>(null)

  async function checkAdminRole(userId: string) {
    try {
      console.log('=== Starting admin role check ===')
      console.log('Checking admin role for user:', userId)
      
      // First check if we have a cached role
      if (lastKnownRoleRef.current) {
        console.log('Using cached role:', lastKnownRoleRef.current)
        setIsAdmin(lastKnownRoleRef.current === 'admin')
      }

      // Get the user's role from database
      const role = await getUserRole(userId)
      console.log('Retrieved role from database:', role)

      if (!mountedRef.current) return

      // Update cache and state
      lastKnownRoleRef.current = role
      console.log('Final user role:', role)
      console.log('Setting isAdmin to:', role === 'admin')
      setIsAdmin(role === 'admin')
      
      // Store role in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`user_role_${userId}`, role)
      }
      
      console.log('=== Completed admin role check ===')
    } catch (err) {
      console.error('Error in checkAdminRole:', err)
      if (mountedRef.current) {
        setIsAdmin(false)
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true
    let authSubscription: { unsubscribe: () => void } | null = null;

    async function initializeAuth() {
      if (initializationRef.current) return;
      initializationRef.current = true;

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
            // Try to get cached role from localStorage
            const cachedRole = typeof window !== 'undefined' ? 
              localStorage.getItem(`user_role_${session.user.id}`) : null
            
            if (cachedRole) {
              console.log('Using cached role from storage:', cachedRole)
              lastKnownRoleRef.current = cachedRole
              setIsAdmin(cachedRole === 'admin')
            }
            
            await checkAdminRole(session.user.id)
          }
          setIsLoading(false)
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

          if (session?.user) {
            setUser(session.user)
            // Try to get cached role
            const cachedRole = typeof window !== 'undefined' ? 
              localStorage.getItem(`user_role_${session.user.id}`) : null
            
            if (cachedRole) {
              console.log('Using cached role from storage:', cachedRole)
              lastKnownRoleRef.current = cachedRole
              setIsAdmin(cachedRole === 'admin')
            }
            
            await checkAdminRole(session.user.id)
          } else {
            setUser(null)
            setIsAdmin(false)
            lastKnownRoleRef.current = null
            // Clear cached role
            if (typeof window !== 'undefined') {
              localStorage.removeItem(`user_role_${session?.user?.id}`)
            }
          }
          setIsLoading(false)
        })

        authSubscription = subscription;
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
      initializationRef.current = false
      if (adminCheckTimeoutRef.current) {
        clearTimeout(adminCheckTimeoutRef.current)
      }
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
    }
  }, [])

  async function signOut() {
    if (adminCheckTimeoutRef.current) {
      clearTimeout(adminCheckTimeoutRef.current)
    }
    // Clear cached role
    if (typeof window !== 'undefined' && user) {
      localStorage.removeItem(`user_role_${user.id}`)
    }
    lastKnownRoleRef.current = null
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