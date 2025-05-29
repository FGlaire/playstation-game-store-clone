import { setUserRole } from '../src/lib/supabase'

const userId = '6c1cd341-02c8-4308-a282-75e265ed676a'

async function setAdmin() {
  console.log('Setting admin role for user:', userId)
  const success = await setUserRole(userId, 'admin')
  console.log('Result:', success ? 'Success' : 'Failed')
  process.exit(0)
}

setAdmin() 