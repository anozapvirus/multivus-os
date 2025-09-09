import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workOrder = await prisma.workOrder.findFirst({
      where: {
        id: params.id,
        customerId: session.user.id, // Garantir que o cliente só vê suas próprias ordens
      },
      include: {
        device: true,
        assignedUser: {
          select: { name: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, price: true },
            },
          },
        },
        timeline: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!workOrder) {
      return NextResponse.json({ error: "Work order not found" }, { status: 404 })
    }

    const formattedWorkOrder = {
      ...workOrder,
      items: workOrder.items.map((item) => ({
        id: item.id,
        description: item.product?.name || item.description || "Item",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
      })),
      timeline: workOrder.timeline.map((event) => ({
        id: event.id,
        action: event.action,
        description: event.description,
        createdAt: event.createdAt,
        user: event.user,
      })),
    }

    return NextResponse.json(formattedWorkOrder)
  } catch (error) {
    console.error("Error fetching work order details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
