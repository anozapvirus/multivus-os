import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateWorkOrderDto, UpdateWorkOrderDto, AddWorkOrderItemDto, UpdateWorkOrderStatusDto } from "./dto"
import { WorkOrderStatus } from "@prisma/client"

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkOrderDto: CreateWorkOrderDto, userId: string) {
    // Generate work order number
    const branch = await this.prisma.branch.findUnique({
      where: { id: createWorkOrderDto.branchId },
    })

    if (!branch) {
      throw new NotFoundException("Filial não encontrada")
    }

    const year = new Date().getFullYear()
    const lastWorkOrder = await this.prisma.workOrder.findFirst({
      where: {
        branchId: createWorkOrderDto.branchId,
        number: { startsWith: `OS-${year}-` },
      },
      orderBy: { number: "desc" },
    })

    let nextNumber = 1
    if (lastWorkOrder) {
      const lastNumber = Number.parseInt(lastWorkOrder.number.split("-")[2])
      nextNumber = lastNumber + 1
    }

    const workOrderNumber = `OS-${year}-${nextNumber.toString().padStart(3, "0")}`

    const workOrder = await this.prisma.workOrder.create({
      data: {
        ...createWorkOrderDto,
        number: workOrderNumber,
        createdBy: userId,
        receivedAt: new Date(),
      },
      include: {
        customer: true,
        device: true,
        assignedTechnician: {
          select: { id: true, name: true, email: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
        branch: true,
        items: true,
      },
    })

    // Create status history entry
    await this.prisma.workOrderStatusHistory.create({
      data: {
        workOrderId: workOrder.id,
        toStatus: workOrder.status,
        changedBy: userId,
        notes: "Ordem de serviço criada",
      },
    })

    return workOrder
  }

  async findAll(companyId: string, branchId?: string, status?: WorkOrderStatus, search?: string) {
    const where: any = { companyId }

    if (branchId) {
      where.branchId = branchId
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { deviceBrand: { contains: search, mode: "insensitive" } },
        { deviceModel: { contains: search, mode: "insensitive" } },
        { reportedIssue: { contains: search, mode: "insensitive" } },
      ]
    }

    return this.prisma.workOrder.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, phone: true },
        },
        device: {
          select: { id: true, brand: true, model: true },
        },
        assignedTechnician: {
          select: { id: true, name: true },
        },
        branch: {
          select: { id: true, name: true, code: true },
        },
        _count: {
          select: {
            items: true,
            photos: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async findOne(id: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        device: true,
        assignedTechnician: {
          select: { id: true, name: true, email: true, phone: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
        branch: true,
        company: true,
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true },
            },
          },
        },
        photos: {
          orderBy: { takenAt: "desc" },
        },
        attachments: {
          orderBy: { uploadedAt: "desc" },
        },
        statusHistory: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { changedAt: "desc" },
        },
        timesheets: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { startTime: "desc" },
        },
        payments: true,
        warranties: true,
      },
    })

    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    return workOrder
  }

  async update(id: string, updateWorkOrderDto: UpdateWorkOrderDto, userId: string) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } })
    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: updateWorkOrderDto,
      include: {
        customer: true,
        device: true,
        assignedTechnician: {
          select: { id: true, name: true, email: true },
        },
        items: true,
      },
    })
  }

  async updateStatus(id: string, updateStatusDto: UpdateWorkOrderStatusDto, userId: string) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } })
    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    const updatedWorkOrder = await this.prisma.workOrder.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
        ...(updateStatusDto.status === WorkOrderStatus.COMPLETED && { completedAt: new Date() }),
        ...(updateStatusDto.status === WorkOrderStatus.DELIVERED && { deliveredAt: new Date() }),
      },
    })

    // Create status history entry
    await this.prisma.workOrderStatusHistory.create({
      data: {
        workOrderId: id,
        fromStatus: workOrder.status,
        toStatus: updateStatusDto.status,
        changedBy: userId,
        notes: updateStatusDto.notes,
      },
    })

    return updatedWorkOrder
  }

  async addItem(workOrderId: string, addItemDto: AddWorkOrderItemDto) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id: workOrderId } })
    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    const item = await this.prisma.workOrderItem.create({
      data: {
        ...addItemDto,
        workOrderId,
        totalCost: addItemDto.quantity * addItemDto.unitCost,
        totalPrice: addItemDto.quantity * addItemDto.unitPrice,
      },
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
      },
    })

    // Update work order totals
    await this.updateWorkOrderTotals(workOrderId)

    return item
  }

  async removeItem(itemId: string) {
    const item = await this.prisma.workOrderItem.findUnique({ where: { id: itemId } })
    if (!item) {
      throw new NotFoundException("Item não encontrado")
    }

    await this.prisma.workOrderItem.delete({ where: { id: itemId } })

    // Update work order totals
    await this.updateWorkOrderTotals(item.workOrderId)

    return { message: "Item removido com sucesso" }
  }

  async startTimesheet(workOrderId: string, userId: string, description?: string) {
    // Check if there's an active timesheet
    const activeTimesheet = await this.prisma.workOrderTimesheet.findFirst({
      where: {
        workOrderId,
        userId,
        endTime: null,
      },
    })

    if (activeTimesheet) {
      throw new BadRequestException("Já existe um timesheet ativo para este usuário")
    }

    return this.prisma.workOrderTimesheet.create({
      data: {
        workOrderId,
        userId,
        startTime: new Date(),
        description,
      },
    })
  }

  async endTimesheet(timesheetId: string, description?: string) {
    const timesheet = await this.prisma.workOrderTimesheet.findUnique({
      where: { id: timesheetId },
    })

    if (!timesheet) {
      throw new NotFoundException("Timesheet não encontrado")
    }

    if (timesheet.endTime) {
      throw new BadRequestException("Timesheet já foi finalizado")
    }

    return this.prisma.workOrderTimesheet.update({
      where: { id: timesheetId },
      data: {
        endTime: new Date(),
        description: description || timesheet.description,
      },
    })
  }

  async getStats(companyId: string, branchId?: string) {
    const where: any = { companyId }
    if (branchId) {
      where.branchId = branchId
    }

    const [totalOrders, openOrders, completedOrders, overdueOrders, revenueThisMonth] = await Promise.all([
      this.prisma.workOrder.count({ where }),
      this.prisma.workOrder.count({
        where: {
          ...where,
          status: {
            in: [
              WorkOrderStatus.DRAFT,
              WorkOrderStatus.TRIAGING,
              WorkOrderStatus.AWAITING_APPROVAL,
              WorkOrderStatus.AWAITING_PARTS,
              WorkOrderStatus.IN_PROGRESS,
              WorkOrderStatus.QUALITY_CHECK,
              WorkOrderStatus.READY_FOR_PICKUP,
            ],
          },
        },
      }),
      this.prisma.workOrder.count({
        where: {
          ...where,
          status: {
            in: [WorkOrderStatus.COMPLETED, WorkOrderStatus.DELIVERED],
          },
        },
      }),
      this.prisma.workOrder.count({
        where: {
          ...where,
          estimatedAt: { lt: new Date() },
          status: {
            notIn: [WorkOrderStatus.COMPLETED, WorkOrderStatus.DELIVERED, WorkOrderStatus.CANCELLED],
          },
        },
      }),
      this.prisma.workOrder.aggregate({
        where: {
          ...where,
          completedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: {
          totalCost: true,
        },
      }),
    ])

    return {
      totalOrders,
      openOrders,
      completedOrders,
      overdueOrders,
      revenueThisMonth: revenueThisMonth._sum.totalCost || 0,
    }
  }

  private async updateWorkOrderTotals(workOrderId: string) {
    const items = await this.prisma.workOrderItem.findMany({
      where: { workOrderId },
    })

    const laborCost = items
      .filter((item) => item.type === "SERVICE")
      .reduce((sum, item) => sum + Number(item.totalCost), 0)

    const partsCost = items
      .filter((item) => item.type === "PART")
      .reduce((sum, item) => sum + Number(item.totalCost), 0)

    const totalCost = laborCost + partsCost

    await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        laborCost,
        partsCost,
        totalCost,
      },
    })
  }

  async remove(id: string) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } })
    if (!workOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    if (workOrder.status !== WorkOrderStatus.DRAFT) {
      throw new BadRequestException("Apenas ordens em rascunho podem ser removidas")
    }

    await this.prisma.workOrder.delete({ where: { id } })
    return { message: "Ordem de serviço removida com sucesso" }
  }
}
