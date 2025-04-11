import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const protectedRoute = createRouteMatcher(['/interview/:path*']);

export default clerkMiddleware(async (auth, req) => {
  if (protectedRoute(req)) await auth.protect();

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
