import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Add initialization check
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set properly. Please check your .env.local file.')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export async function getGames() {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching games:', error.message)
      throw error
    }

    return data || []
  } catch (err) {
    console.error('Error in getGames:', err)
    return []
  }
}

export async function createGame(game: Database['public']['Tables']['games']['Insert']) {
  const { data, error } = await supabase
    .from('games')
    .insert(game)
    .select()
    .single()

  if (error) {
    console.error('Error creating game:', error)
    return null
  }

  return data
}

export async function getUserRole(userId: string) {
  try {
    if (!userId) {
      console.error('getUserRole called with no userId')
      return null
    }

    console.log('Fetching role for user:', userId)
    const { data, error, status } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user role:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        status
      })
      return null
    }

    return data?.role || null
  } catch (err) {
    console.error('Unexpected error in getUserRole:', err)
    return null
  }
}

export async function setUserRole(userId: string, role: 'admin' | 'buyer') {
  try {
    if (!userId) {
      console.error('setUserRole called with no userId')
      return false
    }

    // First check if user exists and get current role
    const currentRole = await getUserRole(userId)
    
    // Don't overwrite admin role with buyer role
    if (currentRole === 'admin' && role === 'buyer') {
      console.log('Preserving admin role for user:', userId)
      return true
    }

    const { error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        role,
        can_buy: true
      })

    if (error) {
      console.error('Error setting user role:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return false
    }

    return true
  } catch (err) {
    console.error('Unexpected error in setUserRole:', err)
    return false
  }
}

export async function createOrder(userId: string, items: { gameId: number; price: number }[]) {
  console.log('Creating order for user:', userId) // Debug log
  console.log('Order items:', items) // Debug log
  
  const total = items.reduce((sum, item) => sum + item.price, 0)
  console.log('Order total:', total) // Debug log

  try {
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, total, status: 'pending' })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      console.error('Error details:', {
        code: orderError.code,
        message: orderError.message,
        details: orderError.details
      })
      return { error: orderError }
    }

    console.log('Order created successfully:', order) // Debug log

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      game_id: item.gameId,
      price: item.price,
    }))

    console.log('Creating order items:', orderItems) // Debug log

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      console.error('Error details:', {
        code: itemsError.code,
        message: itemsError.message,
        details: itemsError.details
      })
      return { error: itemsError }
    }

    console.log('Order items created successfully') // Debug log
    return { order }
  } catch (err) {
    console.error('Unexpected error in createOrder:', err)
    return { error: new Error('Unexpected error occurred') }
  }
}

export async function createOrderItems(items: Database['public']['Tables']['order_items']['Insert'][]) {
  const { data, error } = await supabase
    .from('order_items')
    .insert(items)
    .select()

  if (error) {
    console.error('Error creating order items:', error)
    return null
  }

  return data
}

export async function deleteGame(gameId: number) {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', gameId)
  
  return { error }
} 