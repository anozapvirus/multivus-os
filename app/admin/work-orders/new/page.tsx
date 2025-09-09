"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ClipboardList, UserIcon, Smartphone } from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  document: string
  phone: string
}

interface Device {
  id: string
  brand: string
  model: string
  serialNumber?: string
}

interface Technician {
  id: string
  name: string
  role: string
}

export default function NewWorkOrderPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [users, setUsers] = useState<Technician[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    customerId: "",
    deviceId: "",
    assignedUserId: "",
    estimatedHours: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCustomers()
    fetchUsers()
  }, [])

  useEffect(() => {
    if (formData.customerId) {
      fetchDevices(formData.customerId)
    } else {
      setDevices([])
      setFormData((prev) => ({ ...prev, deviceId: "" }))
    }
  }, [formData.customerId])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    }
  }

  const fetchDevices = async (customerId: string) => {
    try {
      const response = await fetch(`/api/customers/${customerId}/devices`)
      if (response.ok) {
        const data = await response.json()
        setDevices(data)
      }
    } catch (error) {
      console.error("Erro ao carregar dispositivos:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.filter((user: Technician) => user.role === "TECHNICIAN" || user.role === "ADMIN"))
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimatedHours: formData.estimatedHours ? Number.parseFloat(formData.estimatedHours) : null,
        }),
      })

      if (response.ok) {
        const newOrder = await response.json()
        router.push(`/admin/work-orders/${newOrder.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erro ao criar ordem de serviço")
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
              href="/admin/work-orders"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às OSs
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nova Ordem de Serviço</h1>
              <p className="text-gray-600 dark:text-gray-400">Crie uma nova ordem de serviço para um cliente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <ClipboardList className="mr-3 h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Dados da Ordem de Serviço</CardTitle>
                <CardDescription>Preencha as informações da nova OS</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Básicas</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da OS *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Troca de tela do iPhone"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Baixa</SelectItem>
                        <SelectItem value="MEDIUM">Média</SelectItem>
                        <SelectItem value="HIGH">Alta</SelectItem>
                        <SelectItem value="URGENT">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Problema *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Cliente e Dispositivo */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5" />
                  Cliente e Dispositivo
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Cliente *</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.document}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {customers.length === 0 && (
                      <p className="text-xs text-gray-500">
                        Nenhum cliente encontrado.{" "}
                        <Link href="/admin/customers/new" className="text-blue-600 hover:underline">
                          Cadastrar novo cliente
                        </Link>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deviceId">Dispositivo</Label>
                    <Select
                      value={formData.deviceId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, deviceId: value }))}
                      disabled={!formData.customerId}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            formData.customerId ? "Selecione um dispositivo" : "Selecione um cliente primeiro"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.brand} {device.model}
                            {device.serialNumber && ` - ${device.serialNumber}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.customerId && devices.length === 0 && (
                      <p className="text-xs text-gray-500">
                        Nenhum dispositivo cadastrado para este cliente.{" "}
                        <Link
                          href={`/admin/customers/${formData.customerId}/devices/new`}
                          className="text-blue-600 hover:underline"
                        >
                          Cadastrar dispositivo
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Atribuição */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Atribuição e Estimativa
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedUserId">Responsável</Label>
                    <Select
                      value={formData.assignedUserId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, assignedUserId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.role === "ADMIN" ? "Administrador" : "Técnico"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Horas Estimadas</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      step="0.5"
                      placeholder="Ex: 2.5"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData((prev) => ({ ...prev, estimatedHours: e.target.value }))}
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
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Ordem de Serviço"}
                </Button>
                <Link href="/admin/work-orders">
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
