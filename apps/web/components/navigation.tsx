"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Users, Package, DollarSign, BarChart3, Settings, Menu, Home, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Ordens de Serviço", href: "/work-orders", icon: ClipboardList },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Estoque", href: "/inventory", icon: Package },
  { name: "Financeiro", href: "/financial", icon: DollarSign },
  { name: "Relatórios", href: "/reports", icon: BarChart3 },
  { name: "Configurações", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="sm">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold">MULTIVUS OS</h2>
              <Badge variant="secondary" className="text-xs">
                v1.0
              </Badge>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">João Silva</p>
                <p className="text-xs text-muted-foreground">Técnico</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
