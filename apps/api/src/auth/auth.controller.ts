import { Controller, Post, Body, UseGuards, Request, Get } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { AuthService } from "./auth.service"
import type { LoginDto, RegisterDto, ChangePasswordDto } from "./dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login do usuário" })
  @ApiResponse({ status: 200, description: "Login realizado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @ApiOperation({ summary: "Registro de novo usuário" })
  @ApiResponse({ status: 201, description: "Usuário criado com sucesso" })
  @ApiResponse({ status: 400, description: "Email já está em uso" })
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @ApiOperation({ summary: "Alterar senha do usuário" })
  @ApiResponse({ status: 200, description: "Senha alterada com sucesso" })
  @ApiResponse({ status: 401, description: "Senha atual incorreta" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("change-password")
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, changePasswordDto)
  }

  @ApiOperation({ summary: "Logout do usuário" })
  @ApiResponse({ status: 200, description: "Logout realizado com sucesso" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    const sessionToken = req.headers["x-session-token"]
    return this.authService.logout(sessionToken)
  }

  @ApiOperation({ summary: "Obter perfil do usuário logado" })
  @ApiResponse({ status: 200, description: "Perfil do usuário" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Request() req) {
    return req.user
  }
}
