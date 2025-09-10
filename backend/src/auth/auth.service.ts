import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { PrismaService } from "../prisma/prisma.service"
import * as bcrypt from "bcryptjs"
import type { LoginDto, RegisterDto } from "./dto"
import { UserRole } from "@prisma/client"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { company: true },
    })

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas")
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Usuário inativo")
    }

    if (user.company && !user.company.isActive) {
      throw new UnauthorizedException("Empresa inativa - Entre em contato com o suporte")
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        company: user.company,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    })

    if (existingUser) {
      throw new BadRequestException("Email já cadastrado")
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        role: registerDto.role || UserRole.EMPLOYEE,
        companyId: registerDto.companyId,
      },
      include: { company: true },
    })

    const { password, ...result } = user
    return result
  }

  async clientLogin(document: string, verificationCode: string) {
    // Mock verification for now - in production, verify SMS/WhatsApp code
    if (verificationCode !== "123456") {
      throw new UnauthorizedException("Código de verificação inválido")
    }

    const customer = await this.prisma.customer.findFirst({
      where: { document },
      include: { company: true },
    })

    if (!customer) {
      throw new UnauthorizedException("Cliente não encontrado")
    }

    if (!customer.company.isActive) {
      throw new UnauthorizedException("Empresa inativa - Entre em contato com o suporte")
    }

    const payload = {
      sub: customer.id,
      document: customer.document,
      role: "CLIENT",
      companyId: customer.companyId,
    }

    return {
      access_token: this.jwtService.sign(payload),
      customer: {
        id: customer.id,
        name: customer.name,
        document: customer.document,
        companyId: customer.companyId,
        company: customer.company,
      },
    }
  }
}
