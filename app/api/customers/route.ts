import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.type === "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customers = await prisma.customer.findMany({
      where: { companyId: session.user.companyId },
      include: {
        _count: {
          select: {
            workOrders: true,
            devices: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.type === "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        companyId: session.user.companyId,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
