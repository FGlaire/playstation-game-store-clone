'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="w-full lg:w-48 flex lg:flex-col gap-2">
      <Link href="/admin" className="flex-1 lg:flex-none">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname === '/admin' && 'bg-white/10'
          )}
        >
          Analytics
        </Button>
      </Link>
      <Link href="/admin/games" className="flex-1 lg:flex-none">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname === '/admin/games' && 'bg-white/10'
          )}
        >
          Games
        </Button>
      </Link>
      <Link href="/admin/add-game" className="flex-1 lg:flex-none">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname === '/admin/add-game' && 'bg-white/10'
          )}
        >
          Add Game
        </Button>
      </Link>
    </nav>
  )
} 