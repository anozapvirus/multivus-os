import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateCompanyDto, UpdateCompanyDto, CreateBranchDto, UpdateBranchDto } from "./dto"

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  // Company methods
  async createCompany(createCompanyDto: CreateCompanyDto) {
    const existingCompany = await this.prisma.company.findUnique({
      where: { document: createCompanyDto.document },
    })

    if (existingCompany) {
      throw new BadRequestException("CNPJ já está em uso")
    }

    return this.prisma.company.create({
      data: createCompanyDto,
      include: {
        branches: true,
        _count: {
          select: {
            users: true,
            customers: true,
            workOrders: true,
          },
        },
      },
    })
  }

  async findAllCompanies() {
    return this.prisma.company.findMany({
      include: {
        branches: true,
        _count: {
          select: {
            users: true,
            customers: true,
            workOrders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async findCompany(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        branches: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            customers: true,
            workOrders: true,
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

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({ where: { id } })
    if (!company) {
      throw new NotFoundException("Empresa não encontrada")
    }

    if (updateCompanyDto.document && updateCompanyDto.document !== company.document) {
      const existingCompany = await this.prisma.company.findUnique({
        where: { document: updateCompanyDto.document },
      })
      if (existingCompany) {
        throw new BadRequestException("CNPJ já está em uso")
      }
    }

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
      include: {
        branches: true,
      },
    })
  }

  async removeCompany(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } })
    if (!company) {
      throw new NotFoundException("Empresa não encontrada")
    }

    await this.prisma.company.delete({ where: { id } })
    return { message: "Empresa removida com sucesso" }
  }

  // Branch methods
  async createBranch(companyId: string, createBranchDto: CreateBranchDto) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } })
    if (!company) {
      throw new NotFoundException("Empresa não encontrada")
    }

    const existingBranch = await this.prisma.branch.findUnique({
      where: { companyId_code: { companyId, code: createBranchDto.code } },
    })

    if (existingBranch) {
      throw new BadRequestException("Código da filial já está em uso")
    }

    return this.prisma.branch.create({
      data: {
        ...createBranchDto,
        companyId,
      },
      include: {
        company: true,
        _count: {
          select: {
            users: true,
            workOrders: true,
          },
        },
      },
    })
  }

  async findBranches(companyId: string) {
    return this.prisma.branch.findMany({
      where: { companyId },
      include: {
        _count: {
          select: {
            users: true,
            workOrders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async findBranch(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        company: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            workOrders: true,
            stockLocations: true,
          },
        },
      },
    })

    if (!branch) {
      throw new NotFoundException("Filial não encontrada")
    }

    return branch
  }

  async updateBranch(id: string, updateBranchDto: UpdateBranchDto) {
    const branch = await this.prisma.branch.findUnique({ where: { id } })
    if (!branch) {
      throw new NotFoundException("Filial não encontrada")
    }

    if (updateBranchDto.code && updateBranchDto.code !== branch.code) {
      const existingBranch = await this.prisma.branch.findUnique({
        where: { companyId_code: { companyId: branch.companyId, code: updateBranchDto.code } },
      })
      if (existingBranch) {
        throw new BadRequestException("Código da filial já está em uso")
      }
    }

    return this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
      include: {
        company: true,
      },
    })
  }

  async removeBranch(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } })
    if (!branch) {
      throw new NotFoundException("Filial não encontrada")
    }

    await this.prisma.branch.delete({ where: { id } })
    return { message: "Filial removida com sucesso" }
  }

  async toggleBranchActive(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } })
    if (!branch) {
      throw new NotFoundException("Filial não encontrada")
    }

    return this.prisma.branch.update({
      where: { id },
      data: { isActive: !branch.isActive },
    })
  }
}
