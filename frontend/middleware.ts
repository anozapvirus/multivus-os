import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value
  const userData = request.cookies.get("user_data")?.value

  // Parse user data
  let user = null
  if (userData) {
    try {
      user = JSON.parse(userData)
    } catch {
      // Invalid user data, clear cookies
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("auth_token")
      response.cookies.delete("user_data")
      return response
    }
  }

  // Protected routes
  const protectedRoutes = ["/admin", "/portal", "/superadmin"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check authentication for protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Role-based access control
  if (token && user) {
    // SuperAdmin routes
    if (pathname.startsWith("/superadmin") && user.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Admin routes
    if (pathname.startsWith("/admin") && !["SUPERADMIN", "ADMIN", "MANAGER", "EMPLOYEE"].includes(user.role)) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Client portal routes
    if (pathname.startsWith("/portal") && user.role !== "CLIENT") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Check company status (except for SuperAdmin)
    if (user.role !== "SUPERADMIN" && user.company && !user.company.isActive) {
      if (!pathname.startsWith("/plan-expired")) {
        return NextResponse.redirect(new URL("/plan-expired", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)"],
}
