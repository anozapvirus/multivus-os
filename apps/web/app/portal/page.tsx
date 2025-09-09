"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ClipboardList, Smartphone, Shield, Clock, Phone, Mail } from "lucide-react"

// Mock data for demonstration
const customer = {
  name: "Maria Santos",
  document: "123.456.789-01",
  phone: "(11) 99999-9999",
  email: "maria@email.com",
}

const workOrders = [
  {
    id: "1",
    number: "OS-2025-001",
    device: { brand: "Samsung", model: "Galaxy S21" },
    reportedIssue: "Tela quebrada após queda",
    status: "IN_PROGRESS",
    createdAt: "2025-01-15T10:30:00Z",
    estimatedAt: "2025-01-17T16:00:00Z",
    totalCost: 400.0,
    technician: "João Silva",
  },
  {
    id: "2",
    number: "OS-2024-156",
    device: { brand: "Samsung", model: "Galaxy S21" },
    reportedIssue: "Bateria não carrega",
    status: "COMPLETED",
    createdAt: "2024-12-10T14:20:00Z",
    completedAt: "2024-12-12T16:00:00Z",
    totalCost: 280.0,
    technician: "Ana Costa",
  },
]

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

const statusColors = {
  DRAFT: "secondary",
  TRIAGING: "outline",
  AWAITING_APPROVAL: "destructive",
  AWAITING_PARTS: "destructive",
  IN_PROGRESS: "default",
  QUALITY_CHECK: "outline",
  READY_FOR_PICKUP: "default",
  DELIVERED: "default",
  COMPLETED: "default",
  WARRANTY: "outline",
  CANCELLED: "secondary",
} as const

export default function ClientPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // For demo, start logged in

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Portal do Cliente</h1>
                <p className="text-primary-foreground/80 text-sm">MULTIVUS Assistência Técnica</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setIsLoggedIn(false)}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Olá, {customer.name}!</h2>
          <p className="text-muted-foreground">Acompanhe suas ordens de serviço e gerencie seus dispositivos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ordens Ativas</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Garantias</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Ativa</p>
            </CardContent>
          </Card>
        </div>

        {/* Work Orders */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Suas Ordens de Serviço</CardTitle>
            <CardDescription>Acompanhe o status dos seus dispositivos em reparo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{order.number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.device.brand} {order.device.model}
                      </p>
                    </div>
                    <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>

                  <p className="text-sm mb-3">{order.reportedIssue}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                      <div>Técnico: {order.technician}</div>
                    </div>
                    <div className="font-semibold text-foreground">R$ {order.totalCost.toFixed(2)}</div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Ver Detalhes
                    </Button>
                    {order.status === "AWAITING_APPROVAL" && (
                      <Button size="sm" className="flex-1">
                        Aprovar Orçamento
                      </Button>
                    )}
                    {order.status === "READY_FOR_PICKUP" && (
                      <Button size="sm" className="flex-1">
                        Pagar e Retirar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Precisa de Ajuda?
              </CardTitle>
              <CardDescription>Entre em contato conosco para suporte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contato@multivus.com.br</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-transparent" variant="outline">
                Abrir Chamado
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Garantias Ativas
              </CardTitle>
              <CardDescription>Seus dispositivos com garantia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Samsung Galaxy S21</span>
                  <Badge variant="outline">60 dias restantes</Badge>
                </div>
              </div>
              <Button className="w-full mt-4 bg-transparent" variant="outline">
                Ver Todas as Garantias
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [step, setStep] = useState<"document" | "verification">("document")
  const [document, setDocument] = useState("")
  const [verificationCode, setVerificationCode] = useState("")

  const handleSendCode = () => {
    // In a real app, this would call the API to send verification code
    setStep("verification")
  }

  const handleLogin = () => {
    // In a real app, this would validate the code and login
    onLogin()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Portal do Cliente</CardTitle>
          <CardDescription>Acesse sua conta para acompanhar suas ordens de serviço</CardDescription>
        </CardHeader>
        <CardContent>
          {step === "document" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="document">CPF/CNPJ</Label>
                <Input
                  id="document"
                  placeholder="000.000.000-00"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSendCode}>
                Enviar Código de Verificação
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Enviamos um código de verificação para seu telefone/email cadastrado
              </div>
              <div>
                <Label htmlFor="code">Código de Verificação</Label>
                <Input
                  id="code"
                  placeholder="0000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={4}
                />
              </div>
              <Button className="w-full" onClick={handleLogin}>
                Entrar
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("document")}>
                Voltar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
