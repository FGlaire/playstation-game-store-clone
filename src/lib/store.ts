'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Game } from './types'

interface CartStore {
  items: Game[]
  addItem: (item: Game) => void
  removeItem: (itemId: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) {
            return state
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
) 