"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Clock,
  User,
  Smartphone,
  Camera,
  CreditCard,
  CheckCircle,
  XCircle,
  QrCode,
  Copy,
} from "lucide-react"

// Mock data for demonstration
const workOrder = {
  id: "1",
  number: "OS-2025-001",
  status: "AWAITING_APPROVAL",
  device: {
    brand: "Samsung",
    model: "Galaxy S21",
    serialNumber: "SM123456789",
    imei: "123456789012345",
  },
  reportedIssue: "Tela quebrada após queda",
  diagnosis: "Tela LCD danificada, touch funcional. Necessária substituição completa da tela.",
  solution: "Substituição da tela LCD + touch por peça original Samsung",
  accessories: "Carregador, fone de ouvido, capa protetora",
  technician: "João Silva",
  createdAt: "2025-01-15T10:30:00Z",
  estimatedAt: "2025-01-17T16:00:00Z",
  items: [
    {
      type: "PART",
      description: "Tela Samsung Galaxy S21 Original",
      quantity: 1,
      unitPrice: 280.0,
      totalPrice: 280.0,
      warrantyDays: 90,
    },
    {
      type: "SERVICE",
      description: "Mão de obra - Troca de tela",
      quantity: 1,
      unitPrice: 120.0,
      totalPrice: 120.0,
      warrantyDays: 90,
    },
  ],
  totalCost: 400.0,
  photos: [
    {
      id: "1",
      type: "INTAKE",
      url: "/broken-phone-screen-before-repair.jpg",
      description: "Estado inicial - tela quebrada",
      takenAt: "2025-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "DIAGNOSTIC",
      url: "/phone-diagnostic-internal-view.jpg",
      description: "Diagnóstico interno",
      takenAt: "2025-01-15T11:00:00Z",
    },
  ],
  statusHistory: [
    {
      status: "DRAFT",
      changedAt: "2025-01-15T10:30:00Z",
      user: "Ana Costa",
      notes: "Ordem de serviço criada",
    },
    {
      status: "TRIAGING",
      changedAt: "2025-01-15T11:00:00Z",
      user: "João Silva",
      notes: "Iniciado diagnóstico técnico",
    },
    {
      status: "AWAITING_APPROVAL",
      changedAt: "2025-01-15T14:30:00Z",
      user: "João Silva",
      notes: "Orçamento enviado para aprovação do cliente",
    },
  ],
}

const statusLabels = {
  DRAFT: "Rascunho",
  TRIAGING: "Em Triagem",
  AWAITING_APPROVAL: "Aguardando Aprovação",
  AWAITING_PARTS: "Aguardando Peças",
  IN_PROGRESS: "Em Andamento",
  QUALITY_CHECK: "Controle de Qualidade",
  READY_FOR_PICKUP: "Pronto para Retirada",
  DELIVERED: "Entregue",
  COMPLETED: "Finalizado",
  WARRANTY: "Garantia",
  CANCELLED: "Cancelado",
}

export default function WorkOrderDetailsPage() {
  const params = useParams()
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = () => {
    // In a real app, this would call the API
    console.log("Approved")
    setShowApprovalDialog(false)
  }

  const handleReject = () => {
    // In a real app, this would call the API
    console.log("Rejected:", rejectionReason)
    setShowApprovalDialog(false)
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136...")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-bold">{workOrder.number}</h1>
              <p className="text-primary-foreground/80 text-sm">
                {workOrder.device.brand} {workOrder.device.model}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Status and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="text-base px-3 py-1">
              {statusLabels[workOrder.status as keyof typeof statusLabels]}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Criado em {new Date(workOrder.createdAt).toLocaleDateString("pt-BR")}
            </div>
          </div>

          {workOrder.status === "AWAITING_APPROVAL" && (
            <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
              <DialogTrigger asChild>
                <Button>Aprovar Orçamento</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Aprovar Orçamento</DialogTitle>
                  <DialogDescription>Revise o orçamento e escolha uma opção</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-lg font-semibold">Total: R$ {workOrder.totalCost.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Prazo estimado: 2 dias úteis</div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApprove} className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button variant="outline" onClick={() => setRejectionReason("")} className="flex-1">
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeitar
                    </Button>
                  </div>
                  {rejectionReason !== null && (
                    <div className="space-y-2">
                      <Label>Motivo da rejeição</Label>
                      <Textarea
                        placeholder="Informe o motivo da rejeição..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                      <Button onClick={handleReject} variant="destructive" className="w-full">
                        Confirmar Rejeição
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {workOrder.status === "READY_FOR_PICKUP" && (
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button>Pagar e Retirar</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Pagamento</DialogTitle>
                  <DialogDescription>Escolha a forma de pagamento</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">R$ {workOrder.totalCost.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Valor total</div>
                  </div>

                  <Tabs defaultValue="pix">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="pix">PIX</TabsTrigger>
                      <TabsTrigger value="card">Cartão</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pix" className="space-y-4">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                          <QrCode className="w-24 h-24 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Escaneie o QR Code ou copie o código PIX</p>
                        <Button variant="outline" onClick={copyPixCode} className="w-full bg-transparent">
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Código PIX
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="card" className="space-y-4">
                      <div className="text-center text-muted-foreground">
                        <CreditCard className="w-12 h-12 mx-auto mb-2" />
                        <p>Pagamento no cartão será processado na retirada</p>
                      </div>
                      <Button className="w-full">Confirmar Pagamento no Cartão</Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="items">Itens e Orçamento</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="timeline">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Informações do Dispositivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Marca/Modelo</Label>
                    <p>
                      {workOrder.device.brand} {workOrder.device.model}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Número de Série</Label>
                    <p>{workOrder.device.serialNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">IMEI</Label>
                    <p>{workOrder.device.imei}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Acessórios Recebidos</Label>
                    <p>{workOrder.accessories}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações do Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Problema Relatado</Label>
                    <p>{workOrder.reportedIssue}</p>
                  </div>
                  {workOrder.diagnosis && (
                    <div>
                      <Label className="text-sm font-medium">Diagnóstico</Label>
                      <p>{workOrder.diagnosis}</p>
                    </div>
                  )}
                  {workOrder.solution && (
                    <div>
                      <Label className="text-sm font-medium">Solução</Label>
                      <p>{workOrder.solution}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium">Técnico Responsável</Label>
                    <p>{workOrder.technician}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Orçamento Detalhado</CardTitle>
                <CardDescription>Itens e serviços incluídos no reparo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.description}</h4>
                        <div className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity} • Garantia: {item.warrantyDays} dias
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">R$ {item.totalPrice.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">R$ {item.unitPrice.toFixed(2)} cada</div>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>R$ {workOrder.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Fotos do Reparo
                </CardTitle>
                <CardDescription>Documentação visual do processo de reparo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workOrder.photos.map((photo) => (
                    <div key={photo.id} className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.description}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{photo.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(photo.takenAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Histórico da Ordem
                </CardTitle>
                <CardDescription>Acompanhe todas as etapas do reparo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workOrder.statusHistory.map((entry, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{statusLabels[entry.status as keyof typeof statusLabels]}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.changedAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-sm">{entry.notes}</p>
                        <p className="text-xs text-muted-foreground">Por: {entry.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
