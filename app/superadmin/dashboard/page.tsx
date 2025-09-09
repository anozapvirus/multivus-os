"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, CreditCard, AlertTriangle, Plus, Eye, Settings } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  document: string
  email: string
  active: boolean
  planExpiresAt: string
  plan: {
    name: string
    price: number
  }
  _count: {
    users: number
    workOrders: number
    customers: number
  }
}

export default function SuperAdminDashboard() {
  const { data: session } = useSession()
  const [companies, setCompanies] = useState<Company[]>([])
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    expiredPlans: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies")
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)

        // Calcular estatísticas
        const now = new Date()
        const totalCompanies = data.length
        const activeCompanies = data.filter((c: Company) => c.active).length
        const expiredPlans = data.filter((c: Company) => new Date(c.planExpiresAt) < now).length
        const totalRevenue = data.reduce((sum: number, c: Company) => sum + Number(c.plan.price), 0)

        setStats({ totalCompanies, activeCompanies, expiredPlans, totalRevenue })
      }
    } catch (error) {
      console.error("Erro ao carregar empresas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCompanyStatus = async (companyId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      })

      if (response.ok) {
        fetchCompanies()
      }
    } catch (error) {
      console.error("Erro ao alterar status da empresa:", error)
    }
  }

  const isExpired = (date: string) => new Date(date) < new Date()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SuperAdmin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Bem-vindo, {session?.user?.name}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/superadmin/plans">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Gerenciar Planos
                </Button>
              </Link>
              <Link href="/superadmin/companies/new">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Empresa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeCompanies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Vencidos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.expiredPlans}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Empresas Cadastradas</CardTitle>
            <CardDescription>Gerencie todas as empresas e seus planos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Empresa</th>
                    <th className="text-left py-3 px-4">Plano</th>
                    <th className="text-left py-3 px-4">Vencimento</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Usuários</th>
                    <th className="text-left py-3 px-4">OSs</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.document}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{company.plan.name}</div>
                          <div className="text-sm text-gray-500">R$ {company.plan.price}/mês</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`text-sm ${isExpired(company.planExpiresAt) ? "text-red-600" : "text-gray-900 dark:text-white"}`}
                        >
                          {new Date(company.planExpiresAt).toLocaleDateString("pt-BR")}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Badge variant={company.active ? "default" : "secondary"}>
                            {company.active ? "Ativa" : "Inativa"}
                          </Badge>
                          {isExpired(company.planExpiresAt) && <Badge variant="destructive">Vencido</Badge>}
                        </div>
                      </td>
                      <td className="py-3 px-4">{company._count.users}</td>
                      <td className="py-3 px-4">{company._count.workOrders}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/superadmin/companies/${company.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant={company.active ? "destructive" : "default"}
                            onClick={() => toggleCompanyStatus(company.id, company.active)}
                          >
                            {company.active ? "Desativar" : "Ativar"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
