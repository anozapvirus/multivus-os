import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { CustomersService } from "./customers.service"
import type { CreateCustomerDto, UpdateCustomerDto, CreateDeviceDto, UpdateDeviceDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "@prisma/client"

@ApiTags("Customers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // Customer endpoints
  @ApiOperation({ summary: "Criar novo cliente" })
  @ApiResponse({ status: 201, description: "Cliente criado com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT)
  @Post()
  create(createCustomerDto: CreateCustomerDto, @Request() req) {
    return this.customersService.create({
      ...createCustomerDto,
      companyId: req.user.companyId,
    })
  }

  @ApiOperation({ summary: "Listar todos os clientes" })
  @ApiResponse({ status: 200, description: "Lista de clientes" })
  @ApiQuery({ name: "search", required: false })
  @Get()
  findAll(@Query("search") search?: string, @Request() req) {
    return this.customersService.findAll(req.user.companyId, search)
  }

  @ApiOperation({ summary: "Buscar cliente por ID" })
  @ApiResponse({ status: 200, description: "Cliente encontrado" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customersService.findOne(id)
  }

  @ApiOperation({ summary: "Atualizar cliente" })
  @ApiResponse({ status: 200, description: "Cliente atualizado com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT)
  @Patch(":id")
  update(@Param("id") id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto)
  }

  @ApiOperation({ summary: "Ativar/Desativar cliente" })
  @ApiResponse({ status: 200, description: "Status do cliente alterado" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(":id/toggle-active")
  toggleActive(@Param("id") id: string) {
    return this.customersService.toggleActive(id)
  }

  @ApiOperation({ summary: "Remover cliente" })
  @ApiResponse({ status: 200, description: "Cliente removido com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customersService.remove(id)
  }

  // Device endpoints
  @ApiOperation({ summary: "Criar novo dispositivo" })
  @ApiResponse({ status: 201, description: "Dispositivo criado com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN)
  @Post(":customerId/devices")
  createDevice(@Param("customerId") customerId: string, createDeviceDto: CreateDeviceDto) {
    return this.customersService.createDevice(customerId, createDeviceDto)
  }

  @ApiOperation({ summary: "Listar dispositivos do cliente" })
  @ApiResponse({ status: 200, description: "Lista de dispositivos" })
  @Get(":customerId/devices")
  findDevices(@Param("customerId") customerId: string) {
    return this.customersService.findDevices(customerId)
  }

  @ApiOperation({ summary: "Buscar dispositivo por ID" })
  @ApiResponse({ status: 200, description: "Dispositivo encontrado" })
  @Get("devices/:id")
  findDevice(@Param("id") id: string) {
    return this.customersService.findDevice(id)
  }

  @ApiOperation({ summary: "Atualizar dispositivo" })
  @ApiResponse({ status: 200, description: "Dispositivo atualizado com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN)
  @Patch("devices/:id")
  updateDevice(@Param("id") id: string, updateDeviceDto: UpdateDeviceDto) {
    return this.customersService.updateDevice(id, updateDeviceDto)
  }

  @ApiOperation({ summary: "Remover dispositivo" })
  @ApiResponse({ status: 200, description: "Dispositivo removido com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete("devices/:id")
  removeDevice(@Param("id") id: string) {
    return this.customersService.removeDevice(id)
  }
}
