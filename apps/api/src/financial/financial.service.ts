import { Injectable, NotFoundException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateInvoiceDto, CreatePaymentDto } from "./dto"
import type { Prisma } from "@prisma/client"

@Injectable()
export class FinancialService {
  constructor(private prisma: PrismaService) {}

  // Invoices
  async createInvoice(data: CreateInvoiceDto, companyId: string) {
    const invoiceNumber = await this.generateInvoiceNumber(companyId)

    return this.prisma.invoice.create({
      data: {
        ...data,
        companyId,
        invoiceNumber,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
        customer: true,
        workOrder: true,
      },
    })
  }

  async findAllInvoices(
    companyId: string,
    filters?: {
      status?: string
      customerId?: string
      startDate?: Date
      endDate?: Date
    },
  ) {
    const where: Prisma.InvoiceWhereInput = { companyId }

    if (filters?.status) {
      where.status = filters.status
    }
    if (filters?.customerId) {
      where.customerId = filters.customerId
    }
    if (filters?.startDate || filters?.endDate) {
      where.issueDate = {}
      if (filters.startDate) {
        where.issueDate.gte = filters.startDate
      }
      if (filters.endDate) {
        where.issueDate.lte = filters.endDate
      }
    }

    return this.prisma.invoice.findMany({
      where,
      include: {
        customer: true,
        workOrder: true,
        _count: {
          select: { items: true, payments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async findInvoiceById(id: string, companyId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, companyId },
      include: {
        items: true,
        customer: true,
        workOrder: true,
        payments: true,
      },
    })

    if (!invoice) {
      throw new NotFoundException("Invoice not found")
    }

    return invoice
  }

  // Payments
  async createPayment(data: CreatePaymentDto, companyId: string) {
    const invoice = await this.findInvoiceById(data.invoiceId, companyId)

    const payment = await this.prisma.payment.create({
      data: {
        ...data,
        companyId,
      },
    })

    // Update invoice status if fully paid
    const totalPaid = await this.prisma.payment.aggregate({
      where: { invoiceId: data.invoiceId },
      _sum: { amount: true },
    })

    const totalAmount = invoice.totalAmount
    const paidAmount = totalPaid._sum.amount || 0

    let status = "PENDING"
    if (paidAmount >= totalAmount) {
      status = "PAID"
    } else if (paidAmount > 0) {
      status = "PARTIAL"
    }

    await this.prisma.invoice.update({
      where: { id: data.invoiceId },
      data: { status },
    })

    return payment
  }

  async findAllPayments(
    companyId: string,
    filters?: {
      invoiceId?: string
      method?: string
      startDate?: Date
      endDate?: Date
    },
  ) {
    const where: Prisma.PaymentWhereInput = { companyId }

    if (filters?.invoiceId) {
      where.invoiceId = filters.invoiceId
    }
    if (filters?.method) {
      where.method = filters.method
    }
    if (filters?.startDate || filters?.endDate) {
      where.paidAt = {}
      if (filters.startDate) {
        where.paidAt.gte = filters.startDate
      }
      if (filters.endDate) {
        where.paidAt.lte = filters.endDate
      }
    }

    return this.prisma.payment.findMany({
      where,
      include: {
        invoice: {
          include: { customer: true },
        },
      },
      orderBy: { paidAt: "desc" },
    })
  }

  // Reports
  async getFinancialSummary(companyId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.InvoiceWhereInput = { companyId }

    if (startDate || endDate) {
      where.issueDate = {}
      if (startDate) where.issueDate.gte = startDate
      if (endDate) where.issueDate.lte = endDate
    }

    const [invoices, payments] = await Promise.all([
      this.prisma.invoice.aggregate({
        where,
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: {
          companyId,
          ...(startDate || endDate
            ? {
                paidAt: {
                  ...(startDate && { gte: startDate }),
                  ...(endDate && { lte: endDate }),
                },
              }
            : {}),
        },
        _sum: { amount: true },
        _count: true,
      }),
    ])

    const totalInvoiced = invoices._sum.totalAmount || 0
    const totalReceived = payments._sum.amount || 0
    const pendingAmount = totalInvoiced - totalReceived

    return {
      totalInvoiced,
      totalReceived,
      pendingAmount,
      invoiceCount: invoices._count,
      paymentCount: payments._count,
    }
  }

  async getCashFlow(companyId: string, days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const payments = await this.prisma.payment.findMany({
      where: {
        companyId,
        paidAt: { gte: startDate },
      },
      select: {
        amount: true,
        paidAt: true,
        method: true,
      },
      orderBy: { paidAt: "asc" },
    })

    // Group by date
    const cashFlow = payments.reduce(
      (acc, payment) => {
        const date = payment.paidAt.toISOString().split("T")[0]
        if (!acc[date]) {
          acc[date] = { date, total: 0, methods: {} }
        }
        acc[date].total += payment.amount
        acc[date].methods[payment.method] = (acc[date].methods[payment.method] || 0) + payment.amount
        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(cashFlow)
  }

  private async generateInvoiceNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.prisma.invoice.count({
      where: {
        companyId,
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    })

    return `${year}${String(count + 1).padStart(6, "0")}`
  }
}
