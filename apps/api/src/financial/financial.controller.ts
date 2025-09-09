import { Controller, Get, Post, Param, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { FinancialService } from "./financial.service"
import type { CreateInvoiceDto, CreatePaymentDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("financial")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("financial")
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  // Invoices
  @Post("invoices")
  @Roles("ADMIN", "MANAGER", "ATTENDANT")
  @ApiOperation({ summary: "Create a new invoice" })
  createInvoice(createInvoiceDto: CreateInvoiceDto, @Request() req) {
    return this.financialService.createInvoice(createInvoiceDto, req.user.companyId)
  }

  @Get("invoices")
  @Roles("ADMIN", "MANAGER", "ATTENDANT")
  @ApiOperation({ summary: "Get all invoices" })
  findAllInvoices(
    @Request() req,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      status,
      customerId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    }
    return this.financialService.findAllInvoices(req.user.companyId, filters)
  }

  @Get("invoices/:id")
  @Roles("ADMIN", "MANAGER", "ATTENDANT")
  @ApiOperation({ summary: "Get invoice by ID" })
  findInvoice(@Param('id') id: string, @Request() req) {
    return this.financialService.findInvoiceById(id, req.user.companyId)
  }

  // Payments
  @Post("payments")
  @Roles("ADMIN", "MANAGER", "ATTENDANT")
  @ApiOperation({ summary: "Create a new payment" })
  createPayment(createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.financialService.createPayment(createPaymentDto, req.user.companyId)
  }

  @Get("payments")
  @Roles("ADMIN", "MANAGER", "ATTENDANT")
  @ApiOperation({ summary: "Get all payments" })
  findAllPayments(
    @Request() req,
    @Query('invoiceId') invoiceId?: string,
    @Query('method') method?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      invoiceId,
      method,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    }
    return this.financialService.findAllPayments(req.user.companyId, filters)
  }

  // Reports
  @Get("reports/summary")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Get financial summary" })
  getFinancialSummary(@Request() req, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.financialService.getFinancialSummary(
      req.user.companyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    )
  }

  @Get("reports/cash-flow")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Get cash flow report" })
  getCashFlow(@Request() req, @Query('days') days?: string) {
    return this.financialService.getCashFlow(req.user.companyId, days ? Number.parseInt(days) : 30)
  }
}
