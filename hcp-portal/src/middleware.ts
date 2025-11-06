import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if Clerk environment variables are set
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

// Middleware that allows all routes if Clerk is not configured
// This is useful for development when Clerk is optional
export default async function middleware(request: NextRequest) {
  // If Clerk is not configured, allow all routes (for development)
  if (!clerkPublishableKey || !clerkSecretKey) {
    return NextResponse.next();
  }

  // If Clerk is configured, use Clerk middleware
  // Dynamically import to avoid errors when Clerk is not configured
  const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server');
  
  const isPublicRoute = createRouteMatcher([
    '/',
    '/landing',
    '/auth/login(.*)',
    '/auth/register(.*)',
    '/api/public(.*)',
  ]);

  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  })(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

