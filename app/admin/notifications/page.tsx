"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, MessageSquare, Mail, Smartphone, Bell, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotificationLog {
  id: string
  recipient: string
  template: string
  type: string
  status: string
  createdAt: string
  sentBy: { name: string }
}

interface NotificationTemplate {
  id: string
  name: string
  type: string
  message: string
  variables: string[]
}

export default function NotificationsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [templates] = useState<NotificationTemplate[]>([
    {
      id: "work_order_created",
      name: "Nova Ordem de Serviço",
      type: "WHATSAPP",
      message: "Olá {{customerName}}! Sua ordem de serviço {{orderNumber}} foi criada.",
      variables: ["customerName", "orderNumber", "deviceInfo", "portalLink"],
    },
    {
      id: "budget_approval_needed",
      name: "Aprovação de Orçamento",
      type: "WHATSAPP",
      message: "Seu orçamento está pronto! Ordem {{orderNumber}} - Valor: R$ {{totalAmount}}.",
      variables: ["orderNumber", "totalAmount", "approvalLink"],
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [recipient, setRecipient] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [notificationType, setNotificationType] = useState<string>("WHATSAPP")
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchNotificationLogs()
  }, [])

  const fetchNotificationLogs = async () => {
    try {
      const response = await fetch("/api/notifications/logs")
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      console.error("Error fetching notification logs:", error)
    }
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setCustomMessage(template.message)
      setNotificationType(template.type)

      // Reset variables
      const newVariables: Record<string, string> = {}
      template.variables.forEach((variable) => {
        newVariables[variable] = ""
      })
      setVariables(newVariables)
    }
  }

  const handleVariableChange = (variable: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [variable]: value,
    }))
  }

  const handleSendNotification = async () => {
    if (!recipient || (!selectedTemplate && !customMessage)) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          template: selectedTemplate || "custom",
          variables: selectedTemplate ? variables : { message: customMessage },
          type: notificationType,
          priority: "MEDIUM",
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Notificação enviada com sucesso!",
        })

        // Reset form
        setRecipient("")
        setSelectedTemplate("")
        setCustomMessage("")
        setVariables({})

        // Refresh logs
        fetchNotificationLogs()
      } else {
        throw new Error(result.message || "Failed to send notification")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "WHATSAPP":
        return <MessageSquare className="h-4 w-4" />
      case "EMAIL":
        return <Mail className="h-4 w-4" />
      case "SMS":
        return <Smartphone className="h-4 w-4" />
      case "PUSH":
        return <Bell className="h-4 w-4" />
      default:
        return <Send className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "SENT" ? "default" : "destructive"}>{status === "SENT" ? "Enviado" : "Falhou"}</Badge>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Central de Notificações</h1>
          <p className="text-muted-foreground">Envie notificações e gerencie comunicações</p>
        </div>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Enviar Notificação</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Enviar Nova Notificação
              </CardTitle>
              <CardDescription>Envie notificações via WhatsApp, SMS, Email ou Push</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipient">Destinatário</Label>
                  <Input
                    id="recipient"
                    placeholder="Telefone, email ou ID do usuário"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Notificação</Label>
                  <Select value={notificationType} onValueChange={setNotificationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WHATSAPP">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                      <SelectItem value="SMS">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          SMS
                        </div>
                      </SelectItem>
                      <SelectItem value="EMAIL">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="PUSH">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Push Notification
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="template">Template (Opcional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template ou escreva mensagem personalizada" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="space-y-3">
                  <Label>Variáveis do Template</Label>
                  {templates
                    .find((t) => t.id === selectedTemplate)
                    ?.variables.map((variable) => (
                      <div key={variable}>
                        <Label htmlFor={variable} className="text-sm">
                          {variable}
                        </Label>
                        <Input
                          id={variable}
                          placeholder={`Digite o valor para ${variable}`}
                          value={variables[variable] || ""}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                        />
                      </div>
                    ))}
                </div>
              )}

              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Digite sua mensagem personalizada..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleSendNotification} disabled={loading} className="w-full">
                {loading ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(template.type)}
                      <span className="text-sm text-muted-foreground">{template.type}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{template.message}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Notificações
              </CardTitle>
              <CardDescription>Acompanhe todas as notificações enviadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(log.type)}
                      <div>
                        <p className="font-medium">{log.template}</p>
                        <p className="text-sm text-muted-foreground">
                          Para: {log.recipient} • Por: {log.sentBy.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(log.status)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
