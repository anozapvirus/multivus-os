"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react"

interface Invoice {
  id: string
  invoiceNumber: string
  status: string
  totalAmount: number
  issueDate: string
  dueDate: string
  customer: { name: string }
  _count: { items: number; payments: number }
}

interface Payment {
  id: string
  amount: number
  method: string
  paidAt: string
  invoice: {
    invoiceNumber: string
    customer: { name: string }
  }
}

interface FinancialSummary {
  totalInvoiced: number
  totalReceived: number
  pendingAmount: number
  invoiceCount: number
  paymentCount: number
}

export default function FinancialPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [invoicesRes, paymentsRes, summaryRes] = await Promise.all([
        fetch("/api/financial/invoices"),
        fetch("/api/financial/payments"),
        fetch("/api/financial/reports/summary"),
      ])

      setInvoices(await invoicesRes.json())
      setPayments(await paymentsRes.json())
      setSummary(await summaryRes.json())
    } catch (error) {
      console.error("Error fetching financial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      PAID: "default",
      PENDING: "secondary",
      PARTIAL: "outline",
      OVERDUE: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const getMethodBadge = (method: string) => {
    const colors = {
      PIX: "bg-green-100 text-green-800",
      CASH: "bg-blue-100 text-blue-800",
      CARD: "bg-purple-100 text-purple-800",
      BANK_TRANSFER: "bg-orange-100 text-orange-800",
    } as const

    return <Badge className={colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{method}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground">Track invoices, payments, and financial reports</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Financial Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {summary.totalInvoiced.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{summary.invoiceCount} invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {summary.totalReceived.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{summary.paymentCount} payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ {summary.pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {((summary.pendingAmount / summary.totalInvoiced) * 100).toFixed(1)}% pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((summary.totalReceived / summary.totalInvoiced) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Payment efficiency</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Invoices</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>

          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Invoice #{invoice.invoiceNumber}</CardTitle>
                      <CardDescription>{invoice.customer.name}</CardDescription>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Issued: {new Date(invoice.issueDate).toLocaleDateString()} • Due:{" "}
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice._count.items} items • {invoice._count.payments} payments
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">R$ {invoice.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Payments</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>

          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Invoice #{payment.invoice.invoiceNumber}</h3>
                      <p className="text-sm text-muted-foreground">{payment.invoice.customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Paid on {new Date(payment.paidAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-xl font-bold text-green-600">R$ {payment.amount.toFixed(2)}</p>
                      {getMethodBadge(payment.method)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["PIX", "CASH", "CARD", "BANK_TRANSFER"].map((method) => {
                    const methodPayments = payments.filter((p) => p.method === method)
                    const total = methodPayments.reduce((sum, p) => sum + p.amount, 0)
                    const percentage = payments.length > 0 ? (methodPayments.length / payments.length) * 100 : 0

                    return (
                      <div key={method} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getMethodBadge(method)}
                          <span className="text-sm">{methodPayments.length} payments</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Overview</CardTitle>
                <CardDescription>Current status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["PAID", "PENDING", "PARTIAL", "OVERDUE"].map((status) => {
                    const statusInvoices = invoices.filter((i) => i.status === status)
                    const total = statusInvoices.reduce((sum, i) => sum + i.totalAmount, 0)
                    const percentage = invoices.length > 0 ? (statusInvoices.length / invoices.length) * 100 : 0

                    return (
                      <div key={status} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(status)}
                          <span className="text-sm">{statusInvoices.length} invoices</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
