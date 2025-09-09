import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notificationService } from "@/lib/notifications"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, template, variables, type, priority = "MEDIUM" } = await request.json()

    // Validar se o usuário tem permissão para enviar notificações
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, companyId: true },
    })

    if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Enviar notificação
    const success = await notificationService.sendNotification({
      to,
      template,
      variables,
      type,
      priority,
    })

    // Registrar no log de notificações
    await prisma.notificationLog.create({
      data: {
        companyId: user.companyId,
        sentById: session.user.id,
        recipient: to,
        template,
        type,
        status: success ? "SENT" : "FAILED",
        variables: JSON.stringify(variables),
      },
    })

    return NextResponse.json({
      success,
      message: success ? "Notification sent successfully" : "Failed to send notification",
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
