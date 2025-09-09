interface NotificationTemplate {
  id: string
  name: string
  subject?: string
  message: string
  type: "EMAIL" | "SMS" | "WHATSAPP" | "PUSH"
  variables: string[]
}

interface NotificationData {
  to: string
  template: string
  variables: Record<string, string>
  type: "EMAIL" | "SMS" | "WHATSAPP" | "PUSH"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
}

class NotificationService {
  private templates: Map<string, NotificationTemplate> = new Map()

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    const templates: NotificationTemplate[] = [
      {
        id: "work_order_created",
        name: "Nova Ordem de Serviço",
        subject: "Nova Ordem de Serviço - {{orderNumber}}",
        message:
          "Olá {{customerName}}! Sua ordem de serviço {{orderNumber}} foi criada. Equipamento: {{deviceInfo}}. Acompanhe em: {{portalLink}}",
        type: "WHATSAPP",
        variables: ["customerName", "orderNumber", "deviceInfo", "portalLink"],
      },
      {
        id: "budget_approval_needed",
        name: "Aprovação de Orçamento",
        subject: "Orçamento Pronto - {{orderNumber}}",
        message:
          "Seu orçamento está pronto! Ordem {{orderNumber}} - Valor: R$ {{totalAmount}}. Aprove em: {{approvalLink}}",
        type: "WHATSAPP",
        variables: ["orderNumber", "totalAmount", "approvalLink"],
      },
      {
        id: "work_order_completed",
        name: "Serviço Concluído",
        subject: "Serviço Concluído - {{orderNumber}}",
        message:
          "Ótimas notícias! Seu equipamento {{deviceInfo}} está pronto. Ordem {{orderNumber}}. Retire em nossa loja ou solicite entrega.",
        type: "WHATSAPP",
        variables: ["orderNumber", "deviceInfo"],
      },
      {
        id: "payment_received",
        name: "Pagamento Confirmado",
        subject: "Pagamento Confirmado - {{orderNumber}}",
        message: "Pagamento de R$ {{amount}} confirmado para a ordem {{orderNumber}}. Obrigado pela preferência!",
        type: "WHATSAPP",
        variables: ["orderNumber", "amount"],
      },
      {
        id: "verification_code",
        name: "Código de Verificação",
        message: "Seu código de verificação MULTIVUS é: {{code}}. Válido por 5 minutos.",
        type: "SMS",
        variables: ["code"],
      },
    ]

    templates.forEach((template) => {
      this.templates.set(template.id, template)
    })
  }

  async sendNotification(data: NotificationData): Promise<boolean> {
    const template = this.templates.get(data.template)
    if (!template) {
      throw new Error(`Template ${data.template} not found`)
    }

    let message = template.message
    let subject = template.subject

    // Replace variables
    Object.entries(data.variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, "g"), value)
      if (subject) {
        subject = subject.replace(new RegExp(`{{${key}}}`, "g"), value)
      }
    })

    switch (data.type) {
      case "WHATSAPP":
        return this.sendWhatsApp(data.to, message)
      case "SMS":
        return this.sendSMS(data.to, message)
      case "EMAIL":
        return this.sendEmail(data.to, subject || "MULTIVUS OS", message)
      case "PUSH":
        return this.sendPushNotification(data.to, subject || "MULTIVUS OS", message)
      default:
        throw new Error(`Unsupported notification type: ${data.type}`)
    }
  }

  private async sendWhatsApp(to: string, message: string): Promise<boolean> {
    try {
      // Integração com API do WhatsApp Business
      const response = await fetch("https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace(/\D/g, ""), // Remove non-digits
          type: "text",
          text: { body: message },
        }),
      })

      return response.ok
    } catch (error) {
      console.error("WhatsApp send error:", error)
      return false
    }
  }

  private async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // Integração com Twilio ou similar
      const response = await fetch("https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: process.env.TWILIO_PHONE_NUMBER || "",
          To: to,
          Body: message,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("SMS send error:", error)
      return false
    }
  }

  private async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      // Integração com SendGrid, Resend ou similar
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
              subject: subject,
            },
          ],
          from: {
            email: process.env.FROM_EMAIL || "noreply@multivus.com.br",
            name: "MULTIVUS OS",
          },
          content: [
            {
              type: "text/html",
              value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">MULTIVUS OS</h1>
                </div>
                <div style="padding: 20px; background: #f9f9f9;">
                  <p style="color: #333; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
                </div>
                <div style="padding: 20px; text-align: center; background: #e5e5e5; font-size: 12px; color: #666;">
                  <p>MULTIVUS - Sistema de Gestão de Ordens de Serviço</p>
                </div>
              </div>
            `,
            },
          ],
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Email send error:", error)
      return false
    }
  }

  private async sendPushNotification(userId: string, title: string, message: string): Promise<boolean> {
    try {
      // Implementar push notification via Web Push API
      // Aqui você integraria com o service worker para enviar notificações push

      // Por enquanto, vamos simular o envio
      console.log(`Push notification sent to ${userId}: ${title} - ${message}`)
      return true
    } catch (error) {
      console.error("Push notification error:", error)
      return false
    }
  }

  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  async sendVerificationCode(phone: string): Promise<string> {
    const code = this.generateVerificationCode()

    const success = await this.sendNotification({
      to: phone,
      template: "verification_code",
      variables: { code },
      type: "SMS",
      priority: "HIGH",
    })

    if (success) {
      return code
    } else {
      throw new Error("Failed to send verification code")
    }
  }
}

export const notificationService = new NotificationService()
