import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.type !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { approved, comment } = data

    // Verificar se a ordem pertence ao cliente
    const workOrder = await prisma.workOrder.findFirst({
      where: {
        id: params.id,
        customerId: session.user.id,
        status: "WAITING_APPROVAL",
      },
    })

    if (!workOrder) {
      return NextResponse.json({ error: "Work order not found or not awaiting approval" }, { status: 404 })
    }

    // Atualizar status da ordem
    const newStatus = approved ? "APPROVED" : "REJECTED"
    const updatedOrder = await prisma.workOrder.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        approved,
        approvedAt: approved ? new Date() : null,
      },
    })

    // Criar histórico de status
    await prisma.workOrderStatusHistory.create({
      data: {
        workOrderId: params.id,
        status: newStatus,
        comment: comment || (approved ? "Orçamento aprovado pelo cliente" : "Orçamento rejeitado pelo cliente"),
      },
    })

    return NextResponse.json({ success: true, workOrder: updatedOrder })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
