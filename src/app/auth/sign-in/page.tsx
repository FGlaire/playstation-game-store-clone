'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/'
  const error = searchParams.get('error')
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (error === 'confirmation-failed') {
      toast.error('Email confirmation failed. Please try again or contact support.')
    }
  }, [error])

  useEffect(() => {
    if (user) {
      router.push(returnUrl)
    }
  }, [user, router, returnUrl])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please confirm your email address before signing in')
        } else {
          toast.error('Invalid email or password')
        }
        return
      }

      if (data.user) {
        // First check if user exists and get their current role
        const { error: fetchError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (fetchError && fetchError.code === 'PGRST116') {
          // User doesn't exist, create with buyer role
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              role: 'buyer',
              can_buy: true
            })

          if (createError) {
            console.error('Error creating user record:', createError)
            toast.error('Error setting up account')
            return
          }
        } else if (fetchError) {
          console.error('Error fetching user data:', fetchError)
          toast.error('Error checking account status')
          return
        }
        // If user exists, don't modify their role
      }

      router.push(returnUrl)
    } catch (err) {
      console.error('Error in sign in:', err)
      toast.error('An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <div className="text-sm text-center">
            Don't have an account?{' '}
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
} 