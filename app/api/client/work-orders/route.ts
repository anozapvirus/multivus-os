import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.type !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Buscar cliente pelo ID da sessão
    const customer = await prisma.customer.findUnique({
      where: { id: session.user.id },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const workOrders = await prisma.workOrder.findMany({
      where: { customerId: customer.id },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
        device: {
          select: {
            brand: true,
            model: true,
            serialNumber: true,
          },
        },
        assignedUser: {
          select: {
            name: true,
          },
        },
        items: true,
        _count: {
          select: {
            attachments: true,
            timesheets: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ workOrders })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
