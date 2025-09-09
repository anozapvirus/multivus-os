"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  document: string
  email?: string
  phone: string
  address?: string
  city?: string
  state?: string
  active: boolean
  createdAt: string
  _count?: {
    workOrders: number
    devices: number
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers)
      return
    }

    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.document.includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    setFilteredCustomers(filtered)
  }

  const formatDocument = (document: string) => {
    if (document.length === 11) {
      // CPF
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    } else if (document.length === 14) {
      // CNPJ
      return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    return document
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    }
    return phone
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando clientes...</p>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>
              <p className="text-gray-600 dark:text-gray-400">Gerencie todos os clientes da empresa</p>
            </div>
            <Link href="/admin/customers/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, documento, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>{formatDocument(customer.document)}</CardDescription>
                    </div>
                    <Badge variant={customer.active ? "default" : "secondary"}>
                      {customer.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{formatPhone(customer.phone)}</span>
                    </div>

                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}

                    {customer.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">
                          {customer.city && customer.state ? `${customer.city}, ${customer.state}` : customer.address}
                        </span>
                      </div>
                    )}

                    {customer._count && (
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{customer._count.workOrders}</div>
                          <div className="text-xs text-gray-500">OSs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{customer._count.devices}</div>
                          <div className="text-xs text-gray-500">Dispositivos</div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3">
                      <Link href={`/admin/customers/${customer.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/admin/customers/${customer.id}/edit`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 opacity-50" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
              </h3>
              <p className="mb-4">
                {searchTerm
                  ? "Tente ajustar os termos de busca ou cadastre um novo cliente."
                  : "Comece cadastrando seu primeiro cliente."}
              </p>
              <Link href="/admin/customers/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Cliente
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
