'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/AuthProvider'
import { CartButton } from '@/components/buyer/CartButton'
import { useEffect, useState } from 'react'

export function Header() {
  const { user, isAdmin, signOut, isLoading } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY
      
      // Show header at the top
      if (currentScrollY < 50) {
        setIsVisible(true)
        return
      }

      // Scrolling down - hide header
      if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } 
      // Scrolling up - show header
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlHeader)
    return () => window.removeEventListener('scroll', controlHeader)
  }, [lastScrollY])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-lg md:text-xl font-medium tracking-tight text-white hover:text-white/80 transition-colors"
        >
          <Image
            src="/playstation-logo.svg"
            alt="PlayStation Logo"
            width={32}
            height={32}
            className="w-6 h-6 md:w-8 md:h-8"
          />
          <span className="hidden sm:inline">PlayStation Games</span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-4">
          <CartButton />
          {user ? (
            <>
              {!isLoading && isAdmin && (
                <Link href="/admin" className="hidden sm:inline-block">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-white hover:bg-white/10"
                    disabled={isLoading}
                  >
                    Admin
                  </Button>
                </Link>
              )}
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-white hover:text-white hover:bg-white/10"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </>
          ) : (
            <Link href="/auth/sign-in">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
} 