"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Users, Clock, CheckCircle, AlertCircle, Plus, Eye, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  inProgressOrders: number
  completedOrders: number
  totalCustomers: number
  monthlyRevenue: number
}

interface RecentOrder {
  id: string
  number: string
  title: string
  status: string
  priority: string
  customer: {
    name: string
  }
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [ordersResponse, customersResponse] = await Promise.all([
        fetch("/api/work-orders?limit=5"),
        fetch("/api/customers"),
      ])

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setRecentOrders(ordersData.workOrders || [])

        // Calcular estatísticas das ordens
        const allOrders = ordersData.workOrders || []
        const pending = allOrders.filter((o: RecentOrder) => o.status === "PENDING").length
        const inProgress = allOrders.filter((o: RecentOrder) => o.status === "IN_PROGRESS").length
        const completed = allOrders.filter((o: RecentOrder) => o.status === "COMPLETED").length

        setStats((prev) => ({
          ...prev,
          totalOrders: allOrders.length,
          pendingOrders: pending,
          inProgressOrders: inProgress,
          completedOrders: completed,
        }))
      }

      if (customersResponse.ok) {
        const customersData = await customersResponse.json()
        setStats((prev) => ({
          ...prev,
          totalCustomers: customersData.length || 0,
        }))
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "DELIVERED":
        return "bg-purple-100 text-purple-800"
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Bem-vindo, {session?.user?.name} - {session?.user?.role}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/customers">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Clientes
                </Button>
              </Link>
              <Link href="/admin/work-orders/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova OS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de OSs</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Ordens de serviço</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Aguardando início</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgressOrders}</div>
              <p className="text-xs text-muted-foreground">Sendo executadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">Finalizadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Ordens de Serviço Recentes</CardTitle>
                    <CardDescription>Últimas OSs criadas no sistema</CardDescription>
                  </div>
                  <Link href="/admin/work-orders">
                    <Button variant="outline" size="sm">
                      Ver Todas
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium">{order.number}</span>
                            <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                            <span className={`text-sm ${getPriorityColor(order.priority)}`}>{order.priority}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{order.title}</p>
                          <p className="text-xs text-gray-500">Cliente: {order.customer.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                          <Link href={`/admin/work-orders/${order.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma ordem de serviço encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/work-orders/new" className="block">
                  <Button className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Ordem de Serviço
                  </Button>
                </Link>

                <Link href="/admin/customers/new" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="mr-2 h-4 w-4" />
                    Novo Cliente
                  </Button>
                </Link>

                <Link href="/admin/reports" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Relatórios
                  </Button>
                </Link>

                <Link href="/admin/calendar" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agenda
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de Clientes:</span>
                    <span className="font-medium">{stats.totalCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OSs Este Mês:</span>
                    <span className="font-medium">{stats.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Conclusão:</span>
                    <span className="font-medium text-green-600">
                      {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
