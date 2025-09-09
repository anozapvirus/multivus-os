import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateCustomerDto, UpdateCustomerDto, CreateDeviceDto, UpdateDeviceDto } from "./dto"

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  // Customer methods
  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { companyId_document: { companyId: createCustomerDto.companyId, document: createCustomerDto.document } },
    })

    if (existingCustomer) {
      throw new BadRequestException("Cliente com este documento já existe")
    }

    return this.prisma.customer.create({
      data: createCustomerDto,
      include: {
        devices: true,
        _count: {
          select: {
            workOrders: true,
          },
        },
      },
    })
  }

  async findAll(companyId: string, search?: string) {
    const where: any = { companyId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { document: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ]
    }

    return this.prisma.customer.findMany({
      where,
      include: {
        devices: true,
        _count: {
          select: {
            workOrders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        devices: true,
        workOrders: {
          include: {
            assignedTechnician: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    return customer
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } })
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    if (updateCustomerDto.document && updateCustomerDto.document !== customer.document) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { companyId_document: { companyId: customer.companyId, document: updateCustomerDto.document } },
      })
      if (existingCustomer) {
        throw new BadRequestException("Cliente com este documento já existe")
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        devices: true,
      },
    })
  }

  async remove(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } })
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    await this.prisma.customer.delete({ where: { id } })
    return { message: "Cliente removido com sucesso" }
  }

  async toggleActive(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } })
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    return this.prisma.customer.update({
      where: { id },
      data: { isActive: !customer.isActive },
    })
  }

  // Device methods
  async createDevice(customerId: string, createDeviceDto: CreateDeviceDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } })
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    return this.prisma.device.create({
      data: {
        ...createDeviceDto,
        customerId,
      },
    })
  }

  async findDevices(customerId: string) {
    return this.prisma.device.findMany({
      where: { customerId },
      include: {
        _count: {
          select: {
            workOrders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async findDevice(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: {
        customer: true,
        workOrders: {
          select: {
            id: true,
            number: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!device) {
      throw new NotFoundException("Dispositivo não encontrado")
    }

    return device
  }

  async updateDevice(id: string, updateDeviceDto: UpdateDeviceDto) {
    const device = await this.prisma.device.findUnique({ where: { id } })
    if (!device) {
      throw new NotFoundException("Dispositivo não encontrado")
    }

    return this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
    })
  }

  async removeDevice(id: string) {
    const device = await this.prisma.device.findUnique({ where: { id } })
    if (!device) {
      throw new NotFoundException("Dispositivo não encontrado")
    }

    await this.prisma.device.delete({ where: { id } })
    return { message: "Dispositivo removido com sucesso" }
  }
}
