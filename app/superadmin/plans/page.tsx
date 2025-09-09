"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  maxAdmins: number
  maxSellers: number
  maxOrders: number
  features: string[]
  active: boolean
}

export default function PlansManagementPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxAdmins: "",
    maxSellers: "",
    maxOrders: "",
    features: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
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
      const planData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        maxAdmins: Number.parseInt(formData.maxAdmins),
        maxSellers: Number.parseInt(formData.maxSellers),
        maxOrders: Number.parseInt(formData.maxOrders),
        features: formData.features.split(",").map((f) => f.trim()),
      }

      const url = editingPlan ? `/api/plans/${editingPlan.id}` : "/api/plans"
      const method = editingPlan ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      })

      if (response.ok) {
        fetchPlans()
        resetForm()
      } else {
        setError("Erro ao salvar plano")
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      maxAdmins: "",
      maxSellers: "",
      maxOrders: "",
      features: "",
    })
    setIsCreating(false)
    setEditingPlan(null)
  }

  const startEdit = (plan: Plan) => {
    setFormData({
      name: plan.name,
      description: plan.description || "",
      price: plan.price.toString(),
      maxAdmins: plan.maxAdmins.toString(),
      maxSellers: plan.maxSellers.toString(),
      maxOrders: plan.maxOrders.toString(),
      features: plan.features.join(", "),
    })
    setEditingPlan(plan)
    setIsCreating(true)
  }

  const deletePlan = async (planId: string) => {
    if (!confirm("Tem certeza que deseja excluir este plano?")) return

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPlans()
      }
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/superadmin/dashboard"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Planos</h1>
                <p className="text-gray-600 dark:text-gray-400">Configure os planos disponíveis para as empresas</p>
              </div>
            </div>
            <Button onClick={() => setIsCreating(true)} className="bg-red-600 hover:bg-red-700" disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          {isCreating && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{editingPlan ? "Editar Plano" : "Novo Plano"}</CardTitle>
                  <CardDescription>Preencha as informações do plano</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Plano *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Preço Mensal (R$) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="maxAdmins">Max Admins</Label>
                        <Input
                          id="maxAdmins"
                          type="number"
                          value={formData.maxAdmins}
                          onChange={(e) => setFormData((prev) => ({ ...prev, maxAdmins: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxSellers">Max Vendedores</Label>
                        <Input
                          id="maxSellers"
                          type="number"
                          value={formData.maxSellers}
                          onChange={(e) => setFormData((prev) => ({ ...prev, maxSellers: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxOrders">Max OSs</Label>
                        <Input
                          id="maxOrders"
                          type="number"
                          value={formData.maxOrders}
                          onChange={(e) => setFormData((prev) => ({ ...prev, maxOrders: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="features">Funcionalidades (separadas por vírgula)</Label>
                      <Textarea
                        id="features"
                        placeholder="work_orders, customers, inventory, financial"
                        value={formData.features}
                        onChange={(e) => setFormData((prev) => ({ ...prev, features: e.target.value }))}
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvando..." : editingPlan ? "Atualizar" : "Criar"}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Plans List */}
          <div className={isCreating ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          {plan.name}
                        </CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <Badge variant={plan.active ? "default" : "secondary"}>{plan.active ? "Ativo" : "Inativo"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-green-600">
                        R$ {plan.price.toFixed(2)}
                        <span className="text-sm font-normal text-gray-500">/mês</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Administradores:</span>
                          <span className="font-medium">{plan.maxAdmins}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Vendedores:</span>
                          <span className="font-medium">{plan.maxSellers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Ordens de Serviço:</span>
                          <span className="font-medium">{plan.maxOrders}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Funcionalidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button size="sm" variant="outline" onClick={() => startEdit(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deletePlan(plan.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
