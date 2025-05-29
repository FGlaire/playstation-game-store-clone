export interface Game {
  id: number
  title: string
  price: number
  description: string
  image_url: string
  genre?: string
  created_at: string
}

export type UserRole = 'admin' | 'buyer'

export interface User {
  id: string
  role: UserRole
  can_buy: boolean
}

export type Order = {
  id: number
  user_id: string
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
}

export type OrderItem = {
  id: number
  order_id: number
  game_id: number
  price: number
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      games: {
        Row: Game
        Insert: Omit<Game, 'id' | 'created_at'>
        Update: Partial<Omit<Game, 'id' | 'created_at'>>
      }
      users: {
        Row: User
        Insert: User
        Update: Partial<User>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id' | 'created_at'>
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>
      }
    }
  }
} 