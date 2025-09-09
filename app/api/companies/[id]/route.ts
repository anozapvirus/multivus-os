import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        plan: true,
        branches: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            lastLogin: true,
          },
        },
        _count: {
          select: {
            workOrders: true,
            customers: true,
            products: true,
            invoices: true,
          },
        },
      },
    })

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const company = await prisma.company.update({
      where: { id: params.id },
      data: {
        active: data.active,
        planExpiresAt: data.planExpiresAt ? new Date(data.planExpiresAt) : undefined,
        planId: data.planId,
      },
      include: {
        plan: true,
      },
    })

    return NextResponse.json(company)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
