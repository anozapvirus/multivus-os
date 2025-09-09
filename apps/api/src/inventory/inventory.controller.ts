import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { InventoryService } from "./inventory.service"
import type { CreateProductDto, UpdateProductDto, CreateSupplierDto, CreatePurchaseOrderDto } from "./dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("inventory")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("inventory")
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Products
  @Post("products")
  @Roles("ADMIN", "MANAGER", "TECHNICIAN")
  @ApiOperation({ summary: "Create a new product" })
  createProduct(createProductDto: CreateProductDto, @Request() req) {
    return this.inventoryService.createProduct(createProductDto, req.user.companyId)
  }

  @Get("products")
  @Roles("ADMIN", "MANAGER", "TECHNICIAN", "ATTENDANT")
  @ApiOperation({ summary: "Get all products" })
  findAllProducts(@Request() req, @Query('branchId') branchId?: string) {
    return this.inventoryService.findAllProducts(req.user.companyId, branchId)
  }

  @Get("products/low-stock")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Get products with low stock" })
  getLowStockProducts(@Request() req, @Query('branchId') branchId?: string) {
    return this.inventoryService.getLowStockProducts(req.user.companyId, branchId)
  }

  @Get("products/:id")
  @Roles("ADMIN", "MANAGER", "TECHNICIAN", "ATTENDANT")
  @ApiOperation({ summary: "Get product by ID" })
  findProduct(@Param('id') id: string, @Request() req) {
    return this.inventoryService.findProductById(id, req.user.companyId)
  }

  @Patch("products/:id")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Update product" })
  updateProduct(@Param('id') id: string, updateProductDto: UpdateProductDto, @Request() req) {
    return this.inventoryService.updateProduct(id, updateProductDto, req.user.companyId)
  }

  @Patch("products/:id/stock")
  @Roles("ADMIN", "MANAGER", "TECHNICIAN")
  @ApiOperation({ summary: "Update product stock" })
  updateStock(@Param('id') id: string, body: { quantity: number; type: "ADD" | "REMOVE" | "SET" }, @Request() req) {
    return this.inventoryService.updateStock(id, body.quantity, req.user.companyId, body.type)
  }

  @Delete("products/:id")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Delete product" })
  deleteProduct(@Param('id') id: string, @Request() req) {
    return this.inventoryService.deleteProduct(id, req.user.companyId)
  }

  // Suppliers
  @Post("suppliers")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Create a new supplier" })
  createSupplier(createSupplierDto: CreateSupplierDto, @Request() req) {
    return this.inventoryService.createSupplier(createSupplierDto, req.user.companyId)
  }

  @Get('suppliers')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: 'Get all suppliers' })
  findAllSuppliers(@Request() req) {
    return this.inventoryService.findAllSuppliers(req.user.companyId);
  }

  // Purchase Orders
  @Post("purchase-orders")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Create a new purchase order" })
  createPurchaseOrder(createPurchaseOrderDto: CreatePurchaseOrderDto, @Request() req) {
    return this.inventoryService.createPurchaseOrder(createPurchaseOrderDto, req.user.companyId, req.user.sub)
  }

  @Get('purchase-orders')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all purchase orders' })
  findAllPurchaseOrders(@Request() req) {
    return this.inventoryService.findAllPurchaseOrders(req.user.companyId);
  }

  @Patch("purchase-orders/:id/status")
  @Roles("ADMIN", "MANAGER")
  @ApiOperation({ summary: "Update purchase order status" })
  updatePurchaseOrderStatus(@Param('id') id: string, body: { status: string }, @Request() req) {
    return this.inventoryService.updatePurchaseOrderStatus(id, body.status, req.user.companyId)
  }
}
