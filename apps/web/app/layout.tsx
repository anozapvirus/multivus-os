import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { OfflineIndicator } from "@/components/offline-indicator"
import "./globals.css"
import { ClipboardList, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "MULTIVUS OS - Sistema de Ordem de Serviço",
  description: "Sistema completo de gestão de ordens de serviço para assistências técnicas",
  generator: "MULTIVUS OS v1.0",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-xl font-bold">MULTIVUS OS</h1>
                </div>
                <Navigation />
              </div>
              <div className="flex items-center gap-2">
                <OfflineIndicator />
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
