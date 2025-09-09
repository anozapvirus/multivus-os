"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, MessageCircle, Clock, User, Wrench } from "lucide-react"
import Link from "next/link"

interface WorkOrderDetails {
  id: string
  number: string
  title: string
  status: string
  priority: string
  reportedIssue: string
  diagnosis?: string
  solution?: string
  totalAmount: number
  laborAmount: number
  partsAmount: number
  approved: boolean
  createdAt: string
  updatedAt: string
  estimatedCompletion?: string
  device?: {
    brand: string
    model: string
    serialNumber?: string
  }
  assignedUser?: {
    name: string
    phone?: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  timeline: Array<{
    id: string
    action: string
    description: string
    createdAt: string
    user?: { name: string }
  }>
}

export default function WorkOrderDetailsPage() {
  const params = useParams()
  const [workOrder, setWorkOrder] = useState<WorkOrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchWorkOrder(params.id as string)
    }
  }, [params.id])

  const fetchWorkOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/client/work-orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setWorkOrder(data)
      }
    } catch (error) {
      console.error("Erro ao carregar ordem:", error)
    } finally {
      setLoading(false)
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

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de falar sobre a ordem de serviço ${workOrder?.number}. Meu nome é [SEU NOME].`,
    )
    const phone = workOrder?.assignedUser?.phone || "5511999999999"
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!workOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ordem não encontrada</h2>
          <Link href="/portal/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link href="/portal/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Ordem {workOrder.number}</h1>
                <p className="text-gray-600">{workOrder.title}</p>
              </div>
            </div>
            <Badge className={getStatusColor(workOrder.status)}>{getStatusText(workOrder.status)}</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Informações do Equipamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.device ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marca:</span>
                      <span className="font-medium">{workOrder.device.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modelo:</span>
                      <span className="font-medium">{workOrder.device.model}</span>
                    </div>
                    {workOrder.device.serialNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Número de Série:</span>
                        <span className="font-medium">{workOrder.device.serialNumber}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Informações do equipamento não disponíveis</p>
                )}
              </CardContent>
            </Card>

            {/* Problem Description */}
            <Card>
              <CardHeader>
                <CardTitle>Problema Relatado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{workOrder.reportedIssue}</p>
              </CardContent>
            </Card>

            {/* Diagnosis & Solution */}
            {(workOrder.diagnosis || workOrder.solution) && (
              <Card>
                <CardHeader>
                  <CardTitle>Diagnóstico e Solução</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workOrder.diagnosis && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Diagnóstico:</h4>
                      <p className="text-gray-700">{workOrder.diagnosis}</p>
                    </div>
                  )}
                  {workOrder.solution && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Solução Aplicada:</h4>
                      <p className="text-gray-700">{workOrder.solution}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Items/Parts */}
            {workOrder.items && workOrder.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Itens e Peças</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-gray-600">
                            Qtd: {item.quantity} x R$ {item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <span className="font-bold">R$ {item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico da Ordem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workOrder.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        {index < workOrder.timeline.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{event.action}</p>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            {event.user && <p className="text-xs text-gray-500">por {event.user.name}</p>}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(event.createdAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Custos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workOrder.laborAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Mão de obra:</span>
                    <span>R$ {workOrder.laborAmount.toFixed(2)}</span>
                  </div>
                )}
                {workOrder.partsAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Peças:</span>
                    <span>R$ {workOrder.partsAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {workOrder.totalAmount.toFixed(2)}</span>
                </div>

                {workOrder.status === "WAITING_APPROVAL" && (
                  <div className="pt-4">
                    <Link href={`/portal/orders/${workOrder.id}/approve`}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Aprovar Orçamento</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Technician Info */}
            {workOrder.assignedUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Técnico Responsável
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="font-medium">{workOrder.assignedUser.name}</p>
                    {workOrder.assignedUser.phone && (
                      <p className="text-sm text-gray-600">{workOrder.assignedUser.phone}</p>
                    )}
                    <Button onClick={handleWhatsAppContact} className="w-full bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contatar via WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Relatório
                </Button>
                {(workOrder.status === "COMPLETED" || workOrder.status === "DELIVERED") && (
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Nota Fiscal
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Datas Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Criado em:</span>
                  <span>{new Date(workOrder.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Atualizado em:</span>
                  <span>{new Date(workOrder.updatedAt).toLocaleDateString("pt-BR")}</span>
                </div>
                {workOrder.estimatedCompletion && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previsão:</span>
                    <span>{new Date(workOrder.estimatedCompletion).toLocaleDateString("pt-BR")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
