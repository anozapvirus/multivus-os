import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Rotas do SuperAdmin
    if (pathname.startsWith("/superadmin")) {
      if (!token || token.role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/superadmin/login", req.url))
      }
    }

    // Rotas administrativas
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      if (!token || token.type === "CLIENT") {
        return NextResponse.redirect(new URL("/admin/login", req.url))
      }

      // Verificar se a empresa está ativa (implementar verificação de plano)
    }

    // Portal do cliente
    if (pathname.startsWith("/portal") && !pathname.startsWith("/portal/login")) {
      if (!token || token.type !== "CLIENT") {
        return NextResponse.redirect(new URL("/portal/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Permitir acesso às páginas de login
        if (pathname.includes("/login") || pathname === "/") {
          return true
        }

        // Exigir token para rotas protegidas
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal/:path*",
    "/superadmin/:path*",
    "/api/companies/:path*",
    "/api/work-orders/:path*",
    "/api/plans/:path*",
  ],
}
