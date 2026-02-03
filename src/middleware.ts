import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // 1. Create an unmodified response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Initialize Supabase Client specifically for Middleware
  // This client allows us to read/write cookies to manage the session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update the cookie in the request (for immediate use)
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Update the cookie in the response (to be sent to browser)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // 3. Check the User Session
  // getUser() is safer than getSession() as it validates the token on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Define Protected Routes
  // If user is NOT logged in and tries to access /dashboard...
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/"; // Redirect to Login Page
    return NextResponse.redirect(loginUrl);
  }

  // 5. Define Auth Routes (Optional but good UX)
  // If user IS logged in and tries to access the Login page...
  if (user && request.nextUrl.pathname === "/") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard"; // Redirect to Dashboard
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
