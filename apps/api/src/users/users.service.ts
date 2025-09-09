import { Injectable, NotFoundException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateUserDto, UpdateUserDto } from "./dto"
import * as bcrypt from "bcryptjs"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      include: {
        company: true,
        branch: true,
      },
    })

    const { password: _, ...result } = user
    return result
  }

  async findAll(companyId?: string) {
    const where = companyId ? { companyId } : {}

    const users = await this.prisma.user.findMany({
      where,
      include: {
        company: true,
        branch: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return users.map(({ password: _, ...user }) => user)
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
        branch: true,
      },
    })

    if (!user) {
      throw new NotFoundException("Usuário não encontrado")
    }

    const { password: _, ...result } = user
    return result
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
        branch: true,
      },
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException("Usuário não encontrado")
    }

    const updateData: any = { ...updateUserDto }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
        branch: true,
      },
    })

    const { password: _, ...result } = updatedUser
    return result
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException("Usuário não encontrado")
    }

    await this.prisma.user.delete({ where: { id } })
    return { message: "Usuário removido com sucesso" }
  }

  async toggleActive(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException("Usuário não encontrado")
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    })

    const { password: _, ...result } = updatedUser
    return result
  }
}
