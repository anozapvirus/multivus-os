import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateCompanyDto, UpdateCompanyDto } from "./dto"
import * as bcrypt from "bcryptjs"

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const existingCompany = await this.prisma.company.findUnique({
      where: { document: createCompanyDto.document },
    })

    if (existingCompany) {
      throw new BadRequestException("CNPJ já cadastrado")
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: createCompanyDto.planId },
    })

    if (!plan) {
      throw new NotFoundException("Plano não encontrado")
    }

    // Create company
    const company = await this.prisma.company.create({
      data: {
        name: createCompanyDto.name,
        document: createCompanyDto.document,
        email: createCompanyDto.email,
        phone: createCompanyDto.phone,
        address: createCompanyDto.address,
        city: createCompanyDto.city,
        state: createCompanyDto.state,
        zipCode: createCompanyDto.zipCode,
        planId: createCompanyDto.planId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: { plan: true },
    })

    // Create admin user
    if (createCompanyDto.adminUser) {
      const hashedPassword = await bcrypt.hash(createCompanyDto.adminUser.password, 12)

      await this.prisma.user.create({
        data: {
          name: createCompanyDto.adminUser.name,
          email: createCompanyDto.adminUser.email,
          password: hashedPassword,
          role: "ADMIN",
          companyId: company.id,
        },
      })
    }

    return company
  }

  async findAll() {
    return this.prisma.company.findMany({
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
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        plan: true,
        users: true,
        _count: {
          select: {
            workOrders: true,
            customers: true,
            products: true,
          },
        },
      },
    })

    if (!company) {
      throw new NotFoundException("Empresa não encontrada")
    }

    return company
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id)

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
      include: { plan: true },
    })
  }

  async toggleStatus(id: string) {
    const company = await this.findOne(id)

    return this.prisma.company.update({
      where: { id },
      data: { isActive: !company.isActive },
      include: { plan: true },
    })
  }
}
