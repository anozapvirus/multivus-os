"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { auth } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect if already authenticated
    if (auth.isAuthenticated()) {
      const user = auth.getCurrentUser()
      if (user?.role === "SUPERADMIN") {
        router.push("/superadmin/dashboard")
      } else if (user?.role === "CLIENT") {
        router.push("/portal/dashboard")
      } else if (auth.isAdmin()) {
        router.push("/admin/dashboard")
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">MULTIVUS OS</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Sistema de Gestão de Ordens de Serviço</p>
        </div>

        {/* Access Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Administrative Access */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Acesso Administrativo</CardTitle>
              <CardDescription>Para funcionários, administradores e técnicos</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>• Gerenciar ordens de serviço</li>
                <li>• Controle de estoque</li>
                <li>• Relatórios financeiros</li>
                <li>• Administração do sistema</li>
              </ul>
              <Link href="/admin/login">
                <Button className="w-full group">
                  Entrar como Funcionário
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Client Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">Portal do Cliente</CardTitle>
              <CardDescription>Para clientes acompanharem seus serviços</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>• Acompanhar ordens de serviço</li>
                <li>• Aprovar orçamentos</li>
                <li>• Histórico de serviços</li>
                <li>• Pagamentos via Pix</li>
              </ul>
              <Link href="/portal/login">
                <Button variant="outline" className="w-full group bg-transparent">
                  Entrar como Cliente
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* SuperAdmin Access */}
        <div className="text-center mt-8">
          <Link
            href="/superadmin/login"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Acesso SuperAdmin
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 MULTIVUS OS - Sistema de Gestão de Ordens de Serviço</p>
        </div>
      </div>
    </div>
  )
}
