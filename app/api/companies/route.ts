import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const companies = await prisma.company.findMany({
      include: {
        plan: true,
        _count: {
          select: {
            users: true,
            workOrders: true,
            customers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(companies)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Criar empresa
    const company = await prisma.company.create({
      data: {
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        planId: data.planId,
        planExpiresAt: new Date(data.planExpiresAt),
      },
    })

    // Criar filial principal
    const branch = await prisma.branch.create({
      data: {
        name: "Matriz",
        address: data.address,
        phone: data.phone,
        companyId: company.id,
      },
    })

    // Criar usuário administrador
    const hashedPassword = await bcrypt.hash(data.adminPassword, 10)
    await prisma.user.create({
      data: {
        email: data.adminEmail,
        password: hashedPassword,
        name: data.adminName,
        role: "ADMIN",
        companyId: company.id,
        branchId: branch.id,
      },
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
