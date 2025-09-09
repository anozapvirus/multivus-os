import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const customerId = searchParams.get("customerId")

    const where: any = {}

    // Filtrar por empresa
    if (session.user.type === "CLIENT") {
      const customer = await prisma.customer.findUnique({
        where: { id: session.user.id },
      })
      where.customerId = customer?.id
    } else {
      where.companyId = session.user.companyId
    }

    if (status) where.status = status
    if (customerId) where.customerId = customerId

    const [workOrders, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        include: {
          customer: true,
          device: true,
          assignedUser: true,
          items: true,
          _count: {
            select: {
              attachments: true,
              timesheets: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.workOrder.count({ where }),
    ])

    return NextResponse.json({
      workOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.type === "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Gerar número da OS
    const lastOrder = await prisma.workOrder.findFirst({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: "desc" },
    })

    const nextNumber = lastOrder
      ? (Number.parseInt(lastOrder.number.split("-")[1]) + 1).toString().padStart(6, "0")
      : "000001"

    const orderNumber = `OS-${nextNumber}`

    const workOrder = await prisma.workOrder.create({
      data: {
        number: orderNumber,
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        customerId: data.customerId,
        deviceId: data.deviceId,
        companyId: session.user.companyId,
        branchId: session.user.branchId,
        assignedUserId: data.assignedUserId,
        estimatedHours: data.estimatedHours,
      },
      include: {
        customer: true,
        device: true,
        assignedUser: true,
      },
    })

    // Criar histórico de status
    await prisma.workOrderStatusHistory.create({
      data: {
        workOrderId: workOrder.id,
        status: "PENDING",
        comment: "Ordem de serviço criada",
        userId: session.user.id,
      },
    })

    return NextResponse.json(workOrder, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
