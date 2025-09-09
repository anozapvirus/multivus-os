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
import { Users, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ClientLoginPage() {
  const [formData, setFormData] = useState({
    document: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("client-login", {
        document: formData.document,
        phone: formData.phone,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "PLAN_EXPIRED") {
          setError("Plano da empresa vencido. Entre em contato com o suporte para renovar.")
        } else {
          setError("CPF/CNPJ ou telefone não encontrados. Verifique os dados ou entre em contato com a empresa.")
        }
      } else {
        const session = await getSession()
        if (session) {
          router.push("/portal/dashboard")
        }
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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
            <div className="mx-auto bg-green-600 p-3 rounded-xl w-16 h-16 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Portal do Cliente</CardTitle>
            <CardDescription>Digite seu CPF/CNPJ e telefone para acessar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document">CPF ou CNPJ</Label>
                <Input
                  id="document"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={formData.document}
                  onChange={(e) => setFormData((prev) => ({ ...prev, document: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
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

            {/* Support Contact */}
            <div className="mt-6 text-center">
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                Precisa de ajuda? Fale conosco
              </Button>
            </div>

            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Dados de demonstração:</p>
              <p className="text-xs font-mono">CPF: 12345678901</p>
              <p className="text-xs font-mono">Telefone: (11) 98888-8888</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
