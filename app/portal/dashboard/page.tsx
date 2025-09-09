"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Clock, CreditCard, Eye, Download, MessageCircle } from "lucide-react"
import Link from "next/link"

interface WorkOrder {
  id: string
  number: string
  title: string
  status: string
  priority: string
  totalAmount: number
  laborAmount: number
  partsAmount: number
  approved: boolean
  createdAt: string
  device?: {
    brand: string
    model: string
  }
  assignedUser?: {
    name: string
  }
}

interface DashboardStats {
  totalOrders: number
  pendingApproval: number
  inProgress: number
  completed: number
  totalSpent: number
}

export default function ClientDashboard() {
  const { data: session } = useSession()
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingApproval: 0,
    inProgress: 0,
    completed: 0,
    totalSpent: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  const fetchWorkOrders = async () => {
    try {
      const response = await fetch("/api/client/work-orders")
      if (response.ok) {
        const data = await response.json()
        setWorkOrders(data.workOrders || [])

        // Calcular estatísticas
        const orders = data.workOrders || []
        const totalOrders = orders.length
        const pendingApproval = orders.filter((o: WorkOrder) => o.status === "WAITING_APPROVAL").length
        const inProgress = orders.filter((o: WorkOrder) => o.status === "IN_PROGRESS" || o.status === "APPROVED").length
        const completed = orders.filter((o: WorkOrder) => o.status === "COMPLETED" || o.status === "DELIVERED").length
        const totalSpent = orders
          .filter((o: WorkOrder) => o.status === "COMPLETED" || o.status === "DELIVERED")
          .reduce((sum: number, o: WorkOrder) => sum + Number(o.totalAmount), 0)

        setStats({ totalOrders, pendingApproval, inProgress, completed, totalSpent })
      }
    } catch (error) {
      console.error("Erro ao carregar ordens:", error)
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
      case "WAITING_APPROVAL":
        return "bg-purple-100 text-purple-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "DELIVERED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Aguardando Início"
      case "IN_PROGRESS":
        return "Em Andamento"
      case "WAITING_APPROVAL":
        return "Aguardando Sua Aprovação"
      case "APPROVED":
        return "Aprovado - Em Execução"
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

  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent(
      `Olá! Sou ${session?.user?.name} e preciso de ajuda com meus serviços no MULTIVUS OS.`,
    )
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Carregando seus serviços...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Serviços</h1>
              <p className="text-gray-600 dark:text-gray-400">Bem-vindo, {session?.user?.name}</p>
            </div>
            <Button onClick={handleWhatsAppSupport} className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="mr-2 h-4 w-4" />
              Suporte
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Ordens de serviço</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.pendingApproval}</div>
              <p className="text-xs text-muted-foreground">Precisam da sua aprovação</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Sendo executados</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {stats.totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Em serviços concluídos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Seus Serviços</CardTitle>
                <CardDescription>Acompanhe o status dos seus equipamentos</CardDescription>
              </div>
              <Link href="/portal/orders">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrders.length > 0 ? (
                workOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-white/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg">{order.number}</span>
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                          {order.status === "WAITING_APPROVAL" && (
                            <Badge variant="outline" className="text-purple-600 border-purple-600">
                              Ação Necessária
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">{order.title}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {order.device && (
                            <div>
                              <span className="font-medium">Equipamento:</span> {order.device.brand}{" "}
                              {order.device.model}
                            </div>
                          )}

                          {order.assignedUser && (
                            <div>
                              <span className="font-medium">Técnico:</span> {order.assignedUser.name}
                            </div>
                          )}

                          <div>
                            <span className="font-medium">Criado em:</span>{" "}
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>

                        {order.totalAmount > 0 && (
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-green-600">
                                R$ {order.totalAmount.toFixed(2)}
                              </span>
                              {order.laborAmount > 0 && order.partsAmount > 0 && (
                                <div className="text-xs text-gray-500">
                                  Mão de obra: R$ {order.laborAmount.toFixed(2)} | Peças: R${" "}
                                  {order.partsAmount.toFixed(2)}
                                </div>
                              )}
                            </div>
                            {order.status === "WAITING_APPROVAL" && (
                              <Link href={`/portal/orders/${order.id}/approve`}>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                  Aprovar Orçamento
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Link href={`/portal/orders/${order.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {(order.status === "COMPLETED" || order.status === "DELIVERED") && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ClipboardList className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Nenhum serviço encontrado</h3>
                  <p className="mb-4">Você ainda não possui ordens de serviço cadastradas.</p>
                  <Button onClick={handleWhatsAppSupport} className="bg-green-600 hover:bg-green-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Solicitar Serviço
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
