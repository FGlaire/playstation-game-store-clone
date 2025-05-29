import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange the code for a session
      const { data: { user }, error: signInError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (signInError) {
        console.error('Error in email confirmation:', signInError)
        return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=confirmation-failed`)
      }

      if (user) {
        // Create or update user record with default role
        const { error: roleError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            role: 'buyer',
            can_buy: true
          }, {
            onConflict: 'id'
          })

        if (roleError) {
          console.error('Error setting up user role:', roleError)
        }
      }
    } catch (err) {
      console.error('Unexpected error in auth callback:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=confirmation-failed`)
    }
  }

  // Redirect to the home page after successful confirmation
  return NextResponse.redirect(requestUrl.origin)
}

export const dynamic = 'force-dynamic' 