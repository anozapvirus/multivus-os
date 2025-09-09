import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { UsersService } from "../users/users.service"
import type { PrismaService } from "../prisma/prisma.service"
import * as bcrypt from "bcryptjs"
import type { LoginDto, RegisterDto, ChangePasswordDto } from "./dto"
import type { User } from "@prisma/client"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user
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

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Create session
    const sessionToken = this.generateSessionToken()
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      branchId: user.branchId,
    }

    return {
      access_token: this.jwtService.sign(payload),
      session_token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        branchId: user.branchId,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email)
    if (existingUser) {
      throw new BadRequestException("Email já está em uso")
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
      },
    })

    const { password: _, ...result } = user
    return result
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado")
    }

    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password)

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException("Senha atual incorreta")
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10)

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    })

    // Invalidate all sessions
    await this.prisma.userSession.deleteMany({
      where: { userId },
    })

    return { message: "Senha alterada com sucesso" }
  }

  async logout(sessionToken: string) {
    await this.prisma.userSession.delete({
      where: { token: sessionToken },
    })
    return { message: "Logout realizado com sucesso" }
  }

  async validateSession(sessionToken: string): Promise<User | null> {
    const session = await this.prisma.userSession.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return session.user
  }

  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}
