import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is using HTTPS
  if (
    process.env.NODE_ENV === 'production' && // Only in production
    !request.headers.get('x-forwarded-proto')?.includes('https')
  ) {
    // Create the HTTPS URL
    const httpsUrl = 'https://' + request.headers.get('host') + request.nextUrl.pathname
    return NextResponse.redirect(httpsUrl, 301)
  }

  return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 