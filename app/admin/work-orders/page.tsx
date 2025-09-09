"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Edit, Filter, Calendar, User, Clock } from "lucide-react"
import Link from "next/link"

interface WorkOrder {
  id: string
  number: string
  title: string
  description: string
  status: string
  priority: string
  totalAmount: number
  createdAt: string
  customer: {
    name: string
    phone: string
  }
  device?: {
    brand: string
    model: string
  }
  assignedUser?: {
    name: string
  }
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<WorkOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [workOrders, searchTerm, statusFilter, priorityFilter])

  const fetchWorkOrders = async () => {
    try {
      const response = await fetch("/api/work-orders?limit=50")
      if (response.ok) {
        const data = await response.json()
        setWorkOrders(data.workOrders || [])
      }
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = workOrders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((order) => order.priority === priorityFilter)
    }

    setFilteredOrders(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "WAITING_APPROVAL":
        return "bg-purple-100 text-purple-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "DELIVERED":
        return "bg-gray-100 text-gray-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendente"
      case "IN_PROGRESS":
        return "Em Andamento"
      case "WAITING_APPROVAL":
        return "Aguardando Aprovação"
      case "APPROVED":
        return "Aprovado"
      case "COMPLETED":
        return "Concluído"
      case "DELIVERED":
        return "Entregue"
      case "CANCELLED":
        return "Cancelado"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "text-red-600"
      case "HIGH":
        return "text-orange-600"
      case "MEDIUM":
        return "text-yellow-600"
      case "LOW":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "Urgente"
      case "HIGH":
        return "Alta"
      case "MEDIUM":
        return "Média"
      case "LOW":
        return "Baixa"
      default:
        return priority
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando ordens de serviço...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ordens de Serviço</h1>
              <p className="text-gray-600 dark:text-gray-400">Gerencie todas as ordens de serviço da empresa</p>
            </div>
            <Link href="/admin/work-orders/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nova OS
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número, título ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                  <SelectItem value="WAITING_APPROVAL">Aguardando Aprovação</SelectItem>
                  <SelectItem value="APPROVED">Aprovado</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="DELIVERED">Entregue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredOrders.length} Ordem{filteredOrders.length !== 1 ? "s" : ""} de Serviço
            </CardTitle>
            <CardDescription>Lista de todas as ordens de serviço cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg">{order.number}</span>
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(order.priority)}`}>
                            {getPriorityText(order.priority)}
                          </span>
                        </div>

                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">{order.title}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{order.customer.name}</span>
                          </div>

                          {order.device && (
                            <div className="flex items-center gap-2">
                              <span>
                                {order.device.brand} {order.device.model}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>

                        {order.assignedUser && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Responsável: {order.assignedUser.name}</span>
                          </div>
                        )}

                        {order.totalAmount > 0 && (
                          <div className="mt-2">
                            <span className="text-lg font-bold text-green-600">R$ {order.totalAmount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Link href={`/admin/work-orders/${order.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/work-orders/${order.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma ordem encontrada</h3>
                  <p className="mb-4">Não há ordens de serviço que correspondam aos filtros aplicados.</p>
                  <Link href="/admin/work-orders/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Nova OS
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
