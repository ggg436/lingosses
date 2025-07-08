import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware will handle public and protected routes
export function middleware(request: NextRequest) {
  // Define public routes that don't need authentication
  const publicRoutes = ["/", "/api/webhooks/stripe", "/login", "/signup"];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith("/api/auth")
  );

  // For public routes, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, authentication will be checked client-side
  // using Firebase auth context
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};