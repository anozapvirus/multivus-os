"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, MessageCircle, CreditCard, Clock } from "lucide-react"

export default function PlanExpiredPage() {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Olá! Meu plano do MULTIVUS OS venceu e preciso renovar. Podem me ajudar?")
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const handleEmailContact = () => {
    const subject = encodeURIComponent("Renovação de Plano - MULTIVUS OS")
    const body = encodeURIComponent(
      "Olá,\n\nMeu plano do MULTIVUS OS venceu e preciso renovar o acesso.\n\nDados da empresa:\n- Nome: [Sua empresa]\n- CNPJ: [Seu CNPJ]\n- Email: [Seu email]\n\nAguardo retorno.\n\nObrigado!",
    )
    const emailUrl = `mailto:suporte@multivus.com?subject=${subject}&body=${body}`
    window.location.href = emailUrl
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-100 dark:bg-red-900 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl text-red-700 dark:text-red-400">Plano Vencido</CardTitle>
            <CardDescription>Seu acesso ao MULTIVUS OS foi suspenso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                O plano da sua empresa venceu. Para continuar usando o sistema, é necessário renovar a assinatura.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">O que acontece agora?</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Acesso ao sistema suspenso</li>
                  <li>• Dados preservados com segurança</li>
                  <li>• Sistema volta ao normal após pagamento</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-center">Entre em contato para renovar:</h3>

                <div className="space-y-3">
                  <Button onClick={handleWhatsAppContact} className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Falar no WhatsApp
                  </Button>

                  <Button onClick={handleEmailContact} variant="outline" className="w-full bg-transparent">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Enviar Email
                  </Button>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                <p>Suporte: (11) 99999-9999</p>
                <p>Email: suporte@multivus.com</p>
                <p>Horário: Segunda a Sexta, 8h às 18h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
