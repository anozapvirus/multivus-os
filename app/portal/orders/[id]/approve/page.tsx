"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, ArrowLeft, CreditCard, Wrench, Package } from "lucide-react"
import Link from "next/link"

interface WorkOrderItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  type: string
}

interface WorkOrder {
  id: string
  number: string
  title: string
  description: string
  status: string
  totalAmount: number
  laborAmount: number
  partsAmount: number
  items: WorkOrderItem[]
  customer: {
    name: string
  }
  device?: {
    brand: string
    model: string
  }
}

export default function ApproveOrderPage() {
  const router = useRouter()
  const params = useParams()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

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
      } else {
        setError("Ordem de serviço não encontrada")
      }
    } catch (error) {
      setError("Erro ao carregar ordem de serviço")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproval = async (approved: boolean) => {
    if (!workOrder) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/client/work-orders/${workOrder.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved,
          comment: comment.trim() || undefined,
        }),
      })

      if (response.ok) {
        if (approved) {
          router.push(`/portal/orders/${workOrder.id}/payment`)
        } else {
          router.push("/portal/dashboard")
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erro ao processar aprovação")
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Carregando orçamento...</p>
        </div>
      </div>
    )
  }

  if (!workOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Ordem não encontrada</h2>
            <p className="text-gray-600 mb-4">A ordem de serviço solicitada não foi encontrada.</p>
            <Link href="/portal/dashboard">
              <Button>Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/portal/dashboard"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aprovar Orçamento</h1>
              <p className="text-gray-600 dark:text-gray-400">Revise e aprove o orçamento do seu serviço</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Info */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-3">
                  {workOrder.number}
                  <Badge className="bg-purple-100 text-purple-800">Aguardando Aprovação</Badge>
                </CardTitle>
                <CardDescription className="mt-2">{workOrder.title}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Cliente:</span> {workOrder.customer.name}
              </div>
              {workOrder.device && (
                <div>
                  <span className="font-medium">Equipamento:</span> {workOrder.device.brand} {workOrder.device.model}
                </div>
              )}
            </div>
            {workOrder.description && (
              <div className="mt-4">
                <span className="font-medium">Descrição:</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{workOrder.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget Breakdown */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Detalhamento do Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Labor Items */}
              {workOrder.items.filter((item) => item.type === "LABOR").length > 0 && (
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Wrench className="h-4 w-4" />
                    Mão de Obra
                  </h4>
                  <div className="space-y-2">
                    {workOrder.items
                      .filter((item) => item.type === "LABOR")
                      .map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <span className="font-medium">{item.description}</span>
                            <div className="text-sm text-gray-500">
                              {item.quantity}x R$ {item.unitPrice.toFixed(2)}
                            </div>
                          </div>
                          <span className="font-bold">R$ {item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Parts Items */}
              {workOrder.items.filter((item) => item.type === "PART").length > 0 && (
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4" />
                    Peças e Materiais
                  </h4>
                  <div className="space-y-2">
                    {workOrder.items
                      .filter((item) => item.type === "PART")
                      .map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <span className="font-medium">{item.description}</span>
                            <div className="text-sm text-gray-500">
                              {item.quantity}x R$ {item.unitPrice.toFixed(2)}
                            </div>
                          </div>
                          <span className="font-bold">R$ {item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total do Orçamento:</span>
                  <span className="text-green-600">R$ {workOrder.totalAmount.toFixed(2)}</span>
                </div>
                {workOrder.laborAmount > 0 && workOrder.partsAmount > 0 && (
                  <div className="text-sm text-gray-500 mt-2">
                    Mão de obra: R$ {workOrder.laborAmount.toFixed(2)} | Peças: R$ {workOrder.partsAmount.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Comentários (Opcional)</CardTitle>
            <CardDescription>Adicione observações sobre o orçamento, se necessário</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="comment">Seus comentários</Label>
              <Textarea
                id="comment"
                placeholder="Ex: Gostaria de saber se há opções mais econômicas para as peças..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => handleApproval(true)}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isSubmitting ? "Processando..." : "Aprovar e Prosseguir"}
          </Button>
          <Button
            onClick={() => handleApproval(false)}
            variant="destructive"
            className="flex-1"
            disabled={isSubmitting}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Rejeitar Orçamento
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Ao aprovar, você será direcionado para o pagamento via Pix</p>
        </div>
      </div>
    </div>
  )
}
