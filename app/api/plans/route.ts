import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const plans = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    })

    return NextResponse.json(plans)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        maxAdmins: data.maxAdmins,
        maxSellers: data.maxSellers,
        maxOrders: data.maxOrders,
        features: data.features,
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
