import React from 'react'

interface ConditionalClerkProviderProps {
  children: React.ReactNode
}

// Server component that conditionally wraps children with ClerkProvider
export async function ConditionalClerkProvider({ children }: ConditionalClerkProviderProps) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // If Clerk is not configured, return children without ClerkProvider
  if (!clerkPublishableKey) {
    return <>{children}</>;
  }

  // If Clerk is configured, dynamically import and use ClerkProvider
  try {
    const { ClerkProvider } = await import('@clerk/nextjs');
    return <ClerkProvider>{children}</ClerkProvider>;
  } catch (error) {
    // If import fails (e.g., Clerk not properly configured), just return children
    console.warn('Clerk not properly configured, continuing without authentication');
    return <>{children}</>;
  }
}

