import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateProductDto, UpdateProductDto, CreateSupplierDto, CreatePurchaseOrderDto } from "./dto"
import type { Prisma } from "@prisma/client"

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Products
  async createProduct(data: CreateProductDto, companyId: string) {
    return this.prisma.product.create({
      data: {
        ...data,
        companyId,
      },
    })
  }

  async findAllProducts(companyId: string, branchId?: string) {
    const where: Prisma.ProductWhereInput = { companyId }
    if (branchId) {
      where.OR = [
        { branchId },
        { branchId: null }, // Global products
      ]
    }

    return this.prisma.product.findMany({
      where,
      include: {
        supplier: true,
        _count: {
          select: { workOrderItems: true },
        },
      },
      orderBy: { name: "asc" },
    })
  }

  async findProductById(id: string, companyId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, companyId },
      include: {
        supplier: true,
        workOrderItems: {
          include: {
            workOrder: {
              select: { id: true, orderNumber: true, status: true },
            },
          },
        },
      },
    })

    if (!product) {
      throw new NotFoundException("Product not found")
    }

    return product
  }

  async updateProduct(id: string, data: UpdateProductDto, companyId: string) {
    const product = await this.findProductById(id, companyId)

    return this.prisma.product.update({
      where: { id },
      data,
    })
  }

  async deleteProduct(id: string, companyId: string) {
    const product = await this.findProductById(id, companyId)

    // Check if product is used in any work orders
    const usageCount = await this.prisma.workOrderItem.count({
      where: { productId: id },
    })

    if (usageCount > 0) {
      throw new BadRequestException("Cannot delete product that is used in work orders")
    }

    return this.prisma.product.delete({
      where: { id },
    })
  }

  async updateStock(id: string, quantity: number, companyId: string, type: "ADD" | "REMOVE" | "SET") {
    const product = await this.findProductById(id, companyId)

    let newQuantity: number
    switch (type) {
      case "ADD":
        newQuantity = product.quantity + quantity
        break
      case "REMOVE":
        newQuantity = Math.max(0, product.quantity - quantity)
        break
      case "SET":
        newQuantity = quantity
        break
    }

    return this.prisma.product.update({
      where: { id },
      data: { quantity: newQuantity },
    })
  }

  async getLowStockProducts(companyId: string, branchId?: string) {
    const where: Prisma.ProductWhereInput = {
      companyId,
      quantity: { lte: this.prisma.product.fields.minQuantity },
    }

    if (branchId) {
      where.OR = [{ branchId }, { branchId: null }]
    }

    return this.prisma.product.findMany({
      where,
      include: { supplier: true },
    })
  }

  // Suppliers
  async createSupplier(data: CreateSupplierDto, companyId: string) {
    return this.prisma.supplier.create({
      data: {
        ...data,
        companyId,
      },
    })
  }

  async findAllSuppliers(companyId: string) {
    return this.prisma.supplier.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    })
  }

  // Purchase Orders
  async createPurchaseOrder(data: CreatePurchaseOrderDto, companyId: string, userId: string) {
    return this.prisma.purchaseOrder.create({
      data: {
        ...data,
        companyId,
        createdById: userId,
        items: {
          create: data.items,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        supplier: true,
        createdBy: true,
      },
    })
  }

  async findAllPurchaseOrders(companyId: string) {
    return this.prisma.purchaseOrder.findMany({
      where: { companyId },
      include: {
        supplier: true,
        createdBy: true,
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async updatePurchaseOrderStatus(id: string, status: string, companyId: string) {
    const po = await this.prisma.purchaseOrder.findFirst({
      where: { id, companyId },
      include: { items: true },
    })

    if (!po) {
      throw new NotFoundException("Purchase order not found")
    }

    // If receiving items, update stock
    if (status === "RECEIVED") {
      for (const item of po.items) {
        await this.updateStock(item.productId, item.quantity, companyId, "ADD")
      }
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    })
  }
}
