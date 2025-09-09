"use client"

import type React from "react"
import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyCode: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("admin-login", {
        companyCode: formData.companyCode,
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "Empresa não encontrada ou plano vencido") {
          setError("Empresa não encontrada ou plano vencido. Entre em contato com o suporte.")
        } else {
          setError("Email, senha ou código da empresa incorretos")
        }
      } else {
        // Verificar sessão e redirecionar
        const session = await getSession()
        if (session) {
          router.push("/admin/dashboard")
        }
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar à página inicial
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-600 p-3 rounded-xl w-16 h-16 flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Acesso Administrativo</CardTitle>
            <CardDescription>Entre com suas credenciais de funcionário</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyCode">Código da Empresa</Label>
                <Input
                  id="companyCode"
                  placeholder="Ex: 12345678000199"
                  value={formData.companyCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyCode: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link href="/admin/forgot-password" className="text-blue-600 hover:text-blue-500">
                Esqueceu sua senha?
              </Link>
            </div>

            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Credenciais de demonstração:</p>
              <p className="text-xs font-mono">Empresa: 12345678000199</p>
              <p className="text-xs font-mono">Email: admin@demo.com</p>
              <p className="text-xs font-mono">Senha: 123456</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
