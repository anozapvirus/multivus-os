import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { WorkOrdersService } from "./work-orders.service"
import type { CreateWorkOrderDto, UpdateWorkOrderDto, AddWorkOrderItemDto, UpdateWorkOrderStatusDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole, WorkOrderStatus } from "@prisma/client"

@ApiTags("Work Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("work-orders")
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @ApiOperation({ summary: "Criar nova ordem de serviço" })
  @ApiResponse({ status: 201, description: "Ordem de serviço criada com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN)
  @Post()
  create(createWorkOrderDto: CreateWorkOrderDto, req) {
    return this.workOrdersService.create(
      {
        ...createWorkOrderDto,
        companyId: req.user.companyId,
        branchId: req.user.branchId || createWorkOrderDto.branchId,
      },
      req.user.sub,
    )
  }

  @ApiOperation({ summary: "Listar ordens de serviço" })
  @ApiResponse({ status: 200, description: "Lista de ordens de serviço" })
  @ApiQuery({ name: "branchId", required: false })
  @ApiQuery({ name: "status", enum: WorkOrderStatus, required: false })
  @ApiQuery({ name: "search", required: false })
  @Get()
  findAll(
    @Query("branchId") branchId?: string,
    @Query("status") status?: WorkOrderStatus,
    @Query("search") search?: string,
    req,
  ) {
    return this.workOrdersService.findAll(req.user.companyId, req.user.branchId || branchId, status, search)
  }

  @ApiOperation({ summary: "Obter estatísticas das ordens de serviço" })
  @ApiResponse({ status: 200, description: "Estatísticas das ordens de serviço" })
  @Get("stats")
  getStats(req) {
    return this.workOrdersService.getStats(req.user.companyId, req.user.branchId)
  }

  @ApiOperation({ summary: "Buscar ordem de serviço por ID" })
  @ApiResponse({ status: 200, description: "Ordem de serviço encontrada" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.workOrdersService.findOne(id)
  }

  @ApiOperation({ summary: "Atualizar ordem de serviço" })
  @ApiResponse({ status: 200, description: "Ordem de serviço atualizada com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN)
  @Patch(":id")
  update(@Param("id") id: string, updateWorkOrderDto: UpdateWorkOrderDto, req) {
    return this.workOrdersService.update(id, updateWorkOrderDto, req.user.sub)
  }

  @ApiOperation({ summary: "Atualizar status da ordem de serviço" })
  @ApiResponse({ status: 200, description: "Status atualizado com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN)
  @Patch(":id/status")
  updateStatus(@Param("id") id: string, updateStatusDto: UpdateWorkOrderStatusDto, req) {
    return this.workOrdersService.updateStatus(id, updateStatusDto, req.user.sub)
  }

  @ApiOperation({ summary: "Adicionar item à ordem de serviço" })
  @ApiResponse({ status: 201, description: "Item adicionado com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN)
  @Post(":id/items")
  addItem(@Param("id") workOrderId: string, addItemDto: AddWorkOrderItemDto) {
    return this.workOrdersService.addItem(workOrderId, addItemDto)
  }

  @ApiOperation({ summary: "Remover item da ordem de serviço" })
  @ApiResponse({ status: 200, description: "Item removido com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN)
  @Delete("items/:itemId")
  removeItem(@Param("itemId") itemId: string) {
    return this.workOrdersService.removeItem(itemId)
  }

  @ApiOperation({ summary: "Iniciar timesheet" })
  @ApiResponse({ status: 201, description: "Timesheet iniciado com sucesso" })
  @Roles(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.MANAGER)
  @Post(":id/timesheet/start")
  startTimesheet(@Param("id") workOrderId: string, @Body("description") description: string, req) {
    return this.workOrdersService.startTimesheet(workOrderId, req.user.sub, description)
  }

  @ApiOperation({ summary: "Finalizar timesheet" })
  @ApiResponse({ status: 200, description: "Timesheet finalizado com sucesso" })
  @Roles(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.MANAGER)
  @Patch("timesheet/:timesheetId/end")
  endTimesheet(@Param("timesheetId") timesheetId: string, @Body("description") description: string) {
    return this.workOrdersService.endTimesheet(timesheetId, description)
  }

  @ApiOperation({ summary: "Remover ordem de serviço" })
  @ApiResponse({ status: 200, description: "Ordem de serviço removida com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.workOrdersService.remove(id)
  }
}
