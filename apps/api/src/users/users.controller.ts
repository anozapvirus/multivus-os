import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { UsersService } from "./users.service"
import type { CreateUserDto, UpdateUserDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "@prisma/client"

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Criar novo usuário" })
  @ApiResponse({ status: 201, description: "Usuário criado com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @ApiOperation({ summary: "Listar todos os usuários" })
  @ApiResponse({ status: 200, description: "Lista de usuários" })
  @ApiQuery({ name: "companyId", required: false })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  findAll(@Query("companyId") companyId?: string, @Request() req) {
    // If not admin, filter by user's company
    const filterCompanyId = req.user.role === UserRole.ADMIN ? companyId : req.user.companyId
    return this.usersService.findAll(filterCompanyId)
  }

  @ApiOperation({ summary: "Buscar usuário por ID" })
  @ApiResponse({ status: 200, description: "Usuário encontrado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id)
  }

  @ApiOperation({ summary: "Atualizar usuário" })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @ApiOperation({ summary: "Ativar/Desativar usuário" })
  @ApiResponse({ status: 200, description: "Status do usuário alterado" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(":id/toggle-active")
  toggleActive(@Param("id") id: string) {
    return this.usersService.toggleActive(id)
  }

  @ApiOperation({ summary: "Remover usuário" })
  @ApiResponse({ status: 200, description: "Usuário removido com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @Roles(UserRole.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id)
  }
}
