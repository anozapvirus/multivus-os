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
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function SuperAdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"credentials" | "twoFactor">("credentials")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.email === "superadmin@multivus.com" && formData.password === "SuperAdmin@2024") {
      setStep("twoFactor")
    } else {
      setError("Email ou senha incorretos")
    }
    setIsLoading(false)
  }

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("superadmin-login", {
        email: formData.email,
        password: formData.password,
        twoFactorCode: formData.twoFactorCode,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "Código 2FA inválido") {
          setError("Código de autenticação incorreto")
        } else {
          setError("Erro de autenticação. Verifique suas credenciais.")
        }
      } else {
        const session = await getSession()
        if (session) {
          router.push("/superadmin/dashboard")
        }
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar à página inicial
        </Link>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-600 p-3 rounded-xl w-16 h-16 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-700 dark:text-red-400">SuperAdmin</CardTitle>
            <CardDescription>
              {step === "credentials"
                ? "Acesso restrito - Credenciais de SuperAdmin"
                : "Digite o código de autenticação de dois fatores"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email SuperAdmin</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="superadmin@multivus.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha SuperAdmin</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha super segura"
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

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Continuar"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="twoFactorCode">Código 2FA</Label>
                  <Input
                    id="twoFactorCode"
                    placeholder="000000"
                    maxLength={6}
                    value={formData.twoFactorCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, twoFactorCode: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Digite o código do seu aplicativo autenticador
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Entrar como SuperAdmin"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setStep("credentials")}
                >
                  Voltar
                </Button>
              </form>
            )}

            <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-700 dark:text-red-400 mb-2">Credenciais de demonstração:</p>
              <p className="text-xs font-mono">Email: superadmin@multivus.com</p>
              <p className="text-xs font-mono">Senha: SuperAdmin@2024</p>
              {step === "twoFactor" && <p className="text-xs font-mono">2FA: 123456</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
