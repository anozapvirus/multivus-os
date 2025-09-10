import { Controller, Post, UseGuards, Get, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { AuthService } from "./auth.service"
import type { LoginDto, RegisterDto, ClientLoginDto } from "./dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Login administrativo" })
  @ApiResponse({ status: 200, description: "Login realizado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post("register")
  @ApiOperation({ summary: "Registrar novo usuário" })
  @ApiResponse({ status: 201, description: "Usuário criado com sucesso" })
  @ApiResponse({ status: 400, description: "Email já cadastrado" })
  async register(registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post("client/login")
  @ApiOperation({ summary: "Login do cliente" })
  @ApiResponse({ status: 200, description: "Login do cliente realizado com sucesso" })
  @ApiResponse({ status: 401, description: "Documento ou código inválido" })
  async clientLogin(clientLoginDto: ClientLoginDto) {
    return this.authService.clientLogin(clientLoginDto.document, clientLoginDto.verificationCode)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
