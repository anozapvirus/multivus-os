"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building2 } from "lucide-react"
import Link from "next/link"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  maxAdmins: number
  maxSellers: number
  maxOrders: number
}

export default function NewCompanyPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [formData, setFormData] = useState({
    name: "",
    document: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    planId: "",
    planExpiresAt: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useState(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans")
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/superadmin/dashboard")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erro ao criar empresa")
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/superadmin/dashboard"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nova Empresa</h1>
              <p className="text-gray-600 dark:text-gray-400">Cadastre uma nova empresa no sistema</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Building2 className="mr-3 h-6 w-6 text-red-600" />
              <div>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>Preencha as informações da nova empresa</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados da Empresa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">CNPJ *</Label>
                  <Input
                    id="document"
                    placeholder="00.000.000/0000-00"
                    value={formData.document}
                    onChange={(e) => setFormData((prev) => ({ ...prev, document: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
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
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="SP"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                  />
                </div>
              </div>

              {/* Plano */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Plano e Vencimento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planId">Plano *</Label>
                    <Select
                      value={formData.planId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, planId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - R$ {plan.price}/mês
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="planExpiresAt">Data de Vencimento *</Label>
                    <Input
                      id="planExpiresAt"
                      type="date"
                      value={formData.planExpiresAt}
                      onChange={(e) => setFormData((prev) => ({ ...prev, planExpiresAt: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Administrador */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Administrador Principal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Nome do Administrador *</Label>
                    <Input
                      id="adminName"
                      value={formData.adminName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adminName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email do Administrador *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adminEmail: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="adminPassword">Senha Inicial *</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adminPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Empresa"}
                </Button>
                <Link href="/superadmin/dashboard">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
