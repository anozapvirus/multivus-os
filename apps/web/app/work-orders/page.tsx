import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClipboardList, Plus, Search, Filter, Eye, Edit, Clock, User, Phone } from "lucide-react"

// Mock data for demonstration
const workOrders = [
  {
    id: "1",
    number: "OS-2025-001",
    customer: { name: "Maria Santos", phone: "(11) 99999-9999" },
    device: { brand: "Samsung", model: "Galaxy S21" },
    reportedIssue: "Tela quebrada após queda",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    assignedTechnician: { name: "João Silva" },
    createdAt: "2025-01-15T10:30:00Z",
    estimatedAt: "2025-01-17T16:00:00Z",
  },
  {
    id: "2",
    number: "OS-2025-002",
    customer: { name: "Carlos Oliveira", phone: "(11) 88888-8888" },
    device: { brand: "Apple", model: "iPhone 13" },
    reportedIssue: "Não carrega a bateria",
    status: "AWAITING_PARTS",
    priority: "HIGH",
    assignedTechnician: { name: "Ana Costa" },
    createdAt: "2025-01-15T14:20:00Z",
    estimatedAt: "2025-01-18T12:00:00Z",
  },
  {
    id: "3",
    number: "OS-2025-003",
    customer: { name: "Fernanda Lima", phone: "(11) 77777-7777" },
    device: { brand: "Motorola", model: "Moto G60" },
    reportedIssue: "Câmera não funciona",
    status: "READY_FOR_PICKUP",
    priority: "LOW",
    assignedTechnician: { name: "João Silva" },
    createdAt: "2025-01-14T09:15:00Z",
    estimatedAt: "2025-01-16T14:00:00Z",
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
  RMA: "RMA",
  CANCELLED: "Cancelado",
}

const statusColors = {
  DRAFT: "secondary",
  TRIAGING: "outline",
  AWAITING_APPROVAL: "outline",
  AWAITING_PARTS: "destructive",
  IN_PROGRESS: "default",
  QUALITY_CHECK: "outline",
  READY_FOR_PICKUP: "default",
  DELIVERED: "default",
  COMPLETED: "default",
  WARRANTY: "outline",
  RMA: "destructive",
  CANCELLED: "secondary",
} as const

const priorityLabels = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
}

const priorityColors = {
  LOW: "secondary",
  MEDIUM: "outline",
  HIGH: "destructive",
  URGENT: "destructive",
} as const

export default function WorkOrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova OS
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ordens Abertas</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 desde ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Sendo executadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prontas</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Para retirada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <Clock className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">3</div>
              <p className="text-xs text-muted-foreground">Passaram do prazo</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Buscar por número, cliente, dispositivo..." className="pl-10" />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                  <SelectItem value="AWAITING_PARTS">Aguardando Peças</SelectItem>
                  <SelectItem value="READY_FOR_PICKUP">Pronto para Retirada</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Work Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Ordens de Serviço</CardTitle>
            <CardDescription>Gerencie todas as ordens de serviço da sua assistência técnica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Dispositivo</TableHead>
                    <TableHead>Problema</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.device.brand}</div>
                        <div className="text-sm text-muted-foreground">{order.device.model}</div>
                      </TableCell>
                      <TableCell className="max-w-48">
                        <div className="truncate" title={order.reportedIssue}>
                          {order.reportedIssue}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityColors[order.priority as keyof typeof priorityColors]}>
                          {priorityLabels[order.priority as keyof typeof priorityLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {order.assignedTechnician.name}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
