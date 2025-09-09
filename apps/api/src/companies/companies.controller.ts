import { Controller, Get, Post, Patch, Param, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { CompaniesService } from "./companies.service"
import type { CreateCompanyDto, UpdateCompanyDto, CreateBranchDto, UpdateBranchDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "@prisma/client"

@ApiTags("Companies")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // Company endpoints
  @ApiOperation({ summary: "Criar nova empresa" })
  @ApiResponse({ status: 201, description: "Empresa criada com sucesso" })
  @Roles(UserRole.ADMIN)
  @Post()
  createCompany(createCompanyDto: CreateCompanyDto) {
    return this.companiesService.createCompany(createCompanyDto)
  }

  @ApiOperation({ summary: "Listar todas as empresas" })
  @ApiResponse({ status: 200, description: "Lista de empresas" })
  @Roles(UserRole.ADMIN)
  @Get()
  findAllCompanies() {
    return this.companiesService.findAllCompanies()
  }

  @ApiOperation({ summary: "Buscar empresa por ID" })
  @ApiResponse({ status: 200, description: "Empresa encontrada" })
  @Get(":id")
  findCompany(@Param("id") id: string) {
    return this.companiesService.findCompany(id)
  }

  @ApiOperation({ summary: "Atualizar empresa" })
  @ApiResponse({ status: 200, description: "Empresa atualizada com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(":id")
  updateCompany(@Param("id") id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.updateCompany(id, updateCompanyDto)
  }

  @ApiOperation({ summary: "Remover empresa" })
  @ApiResponse({ status: 200, description: "Empresa removida com sucesso" })
  @Roles(UserRole.ADMIN)
  @Delete(":id")
  removeCompany(@Param("id") id: string) {
    return this.companiesService.removeCompany(id)
  }

  // Branch endpoints
  @ApiOperation({ summary: "Criar nova filial" })
  @ApiResponse({ status: 201, description: "Filial criada com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post(":companyId/branches")
  createBranch(@Param("companyId") companyId: string, createBranchDto: CreateBranchDto) {
    return this.companiesService.createBranch(companyId, createBranchDto)
  }

  @ApiOperation({ summary: "Listar filiais da empresa" })
  @ApiResponse({ status: 200, description: "Lista de filiais" })
  @Get(":companyId/branches")
  findBranches(@Param("companyId") companyId: string) {
    return this.companiesService.findBranches(companyId)
  }

  @ApiOperation({ summary: "Buscar filial por ID" })
  @ApiResponse({ status: 200, description: "Filial encontrada" })
  @Get("branches/:id")
  findBranch(@Param("id") id: string) {
    return this.companiesService.findBranch(id)
  }

  @ApiOperation({ summary: "Atualizar filial" })
  @ApiResponse({ status: 200, description: "Filial atualizada com sucesso" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch("branches/:id")
  updateBranch(@Param("id") id: string, updateBranchDto: UpdateBranchDto) {
    return this.companiesService.updateBranch(id, updateBranchDto)
  }

  @ApiOperation({ summary: "Ativar/Desativar filial" })
  @ApiResponse({ status: 200, description: "Status da filial alterado" })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch("branches/:id/toggle-active")
  toggleBranchActive(@Param("id") id: string) {
    return this.companiesService.toggleBranchActive(id)
  }

  @ApiOperation({ summary: "Remover filial" })
  @ApiResponse({ status: 200, description: "Filial removida com sucesso" })
  @Roles(UserRole.ADMIN)
  @Delete("branches/:id")
  removeBranch(@Param("id") id: string) {
    return this.companiesService.removeBranch(id)
  }
}
