import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Search, Eye, Edit, Phone, Mail, MapPin, Smartphone } from "lucide-react"

// Mock data for demonstration
const customers = [
  {
    id: "1",
    name: "Maria Santos",
    document: "123.456.789-01",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    address: "Rua das Palmeiras, 456 - São Paulo, SP",
    isActive: true,
    devicesCount: 2,
    ordersCount: 5,
    createdAt: "2024-12-01T10:30:00Z",
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    document: "987.654.321-00",
    email: "carlos@email.com",
    phone: "(11) 88888-8888",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    isActive: true,
    devicesCount: 1,
    ordersCount: 3,
    createdAt: "2024-11-15T14:20:00Z",
  },
  {
    id: "3",
    name: "Fernanda Lima",
    document: "456.789.123-45",
    email: "fernanda@email.com",
    phone: "(11) 77777-7777",
    address: "Rua Augusta, 200 - São Paulo, SP",
    isActive: false,
    devicesCount: 3,
    ordersCount: 8,
    createdAt: "2024-10-20T09:15:00Z",
  },
]

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Clientes</h1>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
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
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">91% do total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">284</div>
              <p className="text-xs text-muted-foreground">Cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos este Mês</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+8% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Buscar Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Buscar por nome, documento, email ou telefone..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Gerencie todos os clientes da sua assistência técnica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Dispositivos</TableHead>
                    <TableHead>Ordens</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.document}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 text-muted-foreground" />
                          <div className="text-sm truncate" title={customer.address}>
                            {customer.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          {customer.devicesCount}
                        </div>
                      </TableCell>
                      <TableCell>{customer.ordersCount}</TableCell>
                      <TableCell>
                        <Badge variant={customer.isActive ? "default" : "secondary"}>
                          {customer.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(customer.createdAt).toLocaleDateString("pt-BR")}</TableCell>
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
