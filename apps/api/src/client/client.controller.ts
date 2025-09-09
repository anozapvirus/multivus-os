import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { ClientService } from "./client.service"
import type { ClientLoginDto, SendVerificationDto, ApproveOrderDto, CreateTicketDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { WorkOrderStatus } from "@prisma/client"

@ApiTags("Client Portal")
@Controller("client")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({ summary: "Enviar código de verificação" })
  @ApiResponse({ status: 200, description: "Código enviado com sucesso" })
  @Post("send-verification")
  sendVerification(@Body() sendVerificationDto: SendVerificationDto) {
    return this.clientService.sendVerificationCode(
      sendVerificationDto.document,
      sendVerificationDto.companyId,
    )
  }

  @ApiOperation({ summary: "Login do cliente" })
  @ApiResponse({ status: 200, description: "Login realizado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  @Post("login")
  login(@Body() loginDto: ClientLoginDto) {
    return this.clientService.login(loginDto)
  }

  @ApiOperation({ summary: "Obter perfil do cliente" })
  @ApiResponse({ status: 200, description: "Perfil do cliente" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return this.clientService.getProfile(req.user.sub)
  }

  @ApiOperation({ summary: "Listar ordens de serviço do cliente" })
  @ApiResponse({ status: 200, description: "Lista de ordens de serviço" })
  @ApiQuery({ name: "status", enum: WorkOrderStatus, required: false })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("work-orders")
  getWorkOrders(@Query("status") status?: WorkOrderStatus, @Request() req?) {
    return this.clientService.getWorkOrders(req.user.sub, status)
  }

  @ApiOperation({ summary: "Obter detalhes da ordem de serviço" })
  @ApiResponse({ status: 200, description: "Detalhes da ordem de serviço" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("work-orders/:id")
  getWorkOrder(@Param("id") id: string, @Request() req) {
    return this.clientService.getWorkOrder(req.user.sub, id)
  }

  @ApiOperation({ summary: "Aprovar/Rejeitar orçamento" })
  @ApiResponse({ status: 200, description: "Orçamento processado com sucesso" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("work-orders/:id/approve")
  approveOrder(@Param("id") id: string, @Body() approveDto: ApproveOrderDto, @Request() req) {
    return this.clientService.approveOrder(req.user.sub, id, approveDto)
  }

  @ApiOperation({ summary: "Obter métodos de pagamento" })
  @ApiResponse({ status: 200, description: "Métodos de pagamento disponíveis" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("work-orders/:id/payment-methods")
  getPaymentMethods(@Param("id") id: string, @Request() req) {
    return this.clientService.getPaymentMethods(id, req.user.sub)
  }

  @ApiOperation({ summary: "Confirmar pagamento" })
  @ApiResponse({ status: 200, description: "Pagamento confirmado" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("work-orders/:id/payment")
  confirmPayment(@Param("id") id: string, @Body("method") method: string, @Request() req) {
    return this.clientService.confirmPayment(id, req.user.sub, method)
  }

  @ApiOperation({ summary: "Criar ticket de suporte" })
  @ApiResponse({ status: 201, description: "Ticket criado com sucesso" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("tickets")
  createTicket(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    return this.clientService.createTicket(req.user.sub, createTicketDto)
  }
}
