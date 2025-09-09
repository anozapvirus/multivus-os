import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { PrismaService } from "../prisma/prisma.service"
import type { ClientLoginDto, ApproveOrderDto, CreateTicketDto } from "./dto"
import { WorkOrderStatus } from "@prisma/client"

@Injectable()
export class ClientService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: ClientLoginDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        companyId_document: {
          companyId: loginDto.companyId,
          document: loginDto.document,
        },
      },
      include: {
        company: true,
      },
    })

    if (!customer) {
      throw new UnauthorizedException("Cliente não encontrado")
    }

    if (!customer.isActive) {
      throw new UnauthorizedException("Cliente inativo")
    }

    // In a real implementation, you would send SMS/Email verification here
    // For demo purposes, we'll accept any verification code that's "1234"
    if (loginDto.verificationCode && loginDto.verificationCode !== "1234") {
      throw new UnauthorizedException("Código de verificação inválido")
    }

    const payload = {
      sub: customer.id,
      type: "client",
      companyId: customer.companyId,
      document: customer.document,
    }

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: "30d" }),
      customer: {
        id: customer.id,
        name: customer.name,
        document: customer.document,
        email: customer.email,
        phone: customer.phone,
        company: customer.company.name,
      },
    }
  }

  async sendVerificationCode(document: string, companyId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { companyId_document: { companyId, document } },
    })

    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    // In a real implementation, send SMS/Email here
    // For demo, we'll just return success
    return {
      message: "Código de verificação enviado",
      method: customer.email ? "email" : "sms",
      target: customer.email || customer.phone,
    }
  }

  async getProfile(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        company: {
          select: { name: true, phone: true, email: true, address: true },
        },
        devices: true,
        _count: {
          select: {
            workOrders: true,
          },
        },
      },
    })

    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    return customer
  }

  async getWorkOrders(customerId: string, status?: WorkOrderStatus) {
    const where: any = { customerId }
    if (status) {
      where.status = status
    }

    return this.prisma.workOrder.findMany({
      where,
      include: {
        device: {
          select: { brand: true, model: true, serialNumber: true },
        },
        assignedTechnician: {
          select: { name: true },
        },
        branch: {
          select: { name: true, phone: true },
        },
        items: {
          select: {
            type: true,
            description: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            warrantyDays: true,
          },
        },
        photos: {
          select: {
            id: true,
            url: true,
            type: true,
            description: true,
            takenAt: true,
          },
          orderBy: { takenAt: "desc" },
        },
        statusHistory: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { changedAt: "desc" },
        },
        warranties: {
          where: { isActive: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async getWorkOrder(customerId: string, workOrderId: string) {
    const workOrder = await this.prisma.workOrder.findFirst({
      where: {
        id: workOrderId,
        customerId,
      },
      include: {
        customer: {
          select: { name: true, phone: true, email: true },
        },
        device: true,
        assignedTechnician: {
          select: { name: true, phone: true },
        },
        branch: {
          select: { name: true, phone: true, email: true, address: true },
        },
        company: {
          select: { name: true, phone: true, email: true, address: true },
        },
        items: true,
        photos: {
          orderBy: { takenAt: "desc" },
        },
        attachments: {
          orderBy: { uploadedAt: "desc" },
        },
        statusHistory: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { changedAt: "desc" },
        },
        payments: {
          include: {
            receivables: true,
          },
        },
        warranties: {
          where: { isActive: true },
        },
      },
    })

    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    return workOrder
  }

  async approveOrder(customerId: string, workOrderId: string, approveDto: ApproveOrderDto) {
    const workOrder = await this.prisma.workOrder.findFirst({
      where: {
        id: workOrderId,
        customerId,
        status: WorkOrderStatus.AWAITING_APPROVAL,
      },
    })

    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada ou não está aguardando aprovação")
    }

    const newStatus = approveDto.approved ? WorkOrderStatus.AWAITING_PARTS : WorkOrderStatus.CANCELLED

    const updatedOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: { status: newStatus },
    })

    // Create status history
    await this.prisma.workOrderStatusHistory.create({
      data: {
        workOrderId,
        fromStatus: WorkOrderStatus.AWAITING_APPROVAL,
        toStatus: newStatus,
        changedBy: customerId, // Using customer ID as the changer
        notes: approveDto.approved
          ? "Orçamento aprovado pelo cliente"
          : `Orçamento rejeitado pelo cliente: ${approveDto.rejectionReason}`,
      },
    })

    return updatedOrder
  }

  async createTicket(customerId: string, createTicketDto: CreateTicketDto) {
    // In a real implementation, this would create a support ticket
    // For now, we'll create a simple record
    return {
      id: Math.random().toString(36).substring(7),
      subject: createTicketDto.subject,
      message: createTicketDto.message,
      status: "OPEN",
      createdAt: new Date(),
      customerId,
    }
  }

  async getPaymentMethods(workOrderId: string, customerId: string) {
    const workOrder = await this.prisma.workOrder.findFirst({
      where: {
        id: workOrderId,
        customerId,
      },
      select: {
        id: true,
        totalCost: true,
        status: true,
      },
    })

    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    // Generate mock Pix payment
    const pixPayment = {
      qrCode: `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2)}520400005303986540${workOrder.totalCost}5802BR5925MULTIVUS ASSISTENCIA TECN6009SAO PAULO62070503***6304`,
      pixKey: "pix@multivus.com.br",
      amount: workOrder.totalCost,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    }

    return {
      workOrderId,
      amount: workOrder.totalCost,
      methods: {
        pix: pixPayment,
        card: {
          available: true,
          installments: [1, 2, 3, 6, 12],
        },
        cash: {
          available: true,
        },
      },
    }
  }

  async confirmPayment(workOrderId: string, customerId: string, paymentMethod: string) {
    const workOrder = await this.prisma.workOrder.findFirst({
      where: {
        id: workOrderId,
        customerId,
      },
    })

    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        workOrderId,
        method: paymentMethod.toUpperCase() as any,
        amount: workOrder.totalCost || 0,
        status: "PAID",
        paidAt: new Date(),
      },
    })

    // Update work order status if it was ready for pickup
    if (workOrder.status === WorkOrderStatus.READY_FOR_PICKUP) {
      await this.prisma.workOrder.update({
        where: { id: workOrderId },
        data: {
          status: WorkOrderStatus.DELIVERED,
          deliveredAt: new Date(),
        },
      })

      // Create status history
      await this.prisma.workOrderStatusHistory.create({
        data: {
          workOrderId,
          fromStatus: WorkOrderStatus.READY_FOR_PICKUP,
          toStatus: WorkOrderStatus.DELIVERED,
          changedBy: customerId,
          notes: `Pagamento confirmado via ${paymentMethod}`,
        },
      })
    }

    return {
      paymentId: payment.id,
      status: "confirmed",
      method: paymentMethod,
      amount: payment.amount,
      paidAt: payment.paidAt,
    }
  }
}
