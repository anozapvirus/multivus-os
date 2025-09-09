import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ error: "Phone and code are required" }, { status: 400 })
    }

    // Verificar se o código está correto e não expirou (5 minutos)
    const verification = await prisma.verificationCode.findFirst({
      where: {
        phone,
        code,
        expiresAt: { gt: new Date() },
        used: false,
      },
    })

    if (!verification) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
    }

    // Marcar código como usado
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { used: true },
    })

    // Buscar cliente pelo telefone
    const customer = await prisma.customer.findFirst({
      where: { phone },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        document: customer.document,
        phone: customer.phone,
        email: customer.email,
      },
    })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
