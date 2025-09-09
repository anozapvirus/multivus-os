import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsEnum, IsNumber, Min } from "class-validator"
import { WorkOrderStatus, Priority, ItemType } from "@prisma/client"
import { Transform } from "class-transformer"

export class CreateWorkOrderDto {
  @ApiProperty({ example: "customer-id" })
  @IsString()
  customerId: string

  @ApiProperty({ example: "device-id", required: false })
  @IsOptional()
  @IsString()
  deviceId?: string

  @ApiProperty({ example: "technician-id", required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string

  @ApiProperty({ example: "Samsung" })
  @IsString()
  deviceBrand: string

  @ApiProperty({ example: "Galaxy S21" })
  @IsString()
  deviceModel: string

  @ApiProperty({ example: "SM123456789", required: false })
  @IsOptional()
  @IsString()
  deviceSerial?: string

  @ApiProperty({ example: "123456789012345", required: false })
  @IsOptional()
  @IsString()
  deviceImei?: string

  @ApiProperty({ example: "1234", required: false })
  @IsOptional()
  @IsString()
  devicePassword?: string

  @ApiProperty({ example: "Tela quebrada após queda" })
  @IsString()
  reportedIssue: string

  @ApiProperty({ example: "Carregador, fone de ouvido", required: false })
  @IsOptional()
  @IsString()
  accessories?: string

  @ApiProperty({ enum: Priority, example: Priority.MEDIUM, required: false })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @ApiProperty({ example: 2.5, required: false })
  @IsOptional()
  @IsNumber()
  estimatedHours?: number

  companyId?: string // Set automatically from JWT
  branchId?: string // Set automatically from JWT or provided
}

export class UpdateWorkOrderDto {
  @ApiProperty({ example: "technician-id", required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string

  @ApiProperty({ example: "Problema na tela touch", required: false })
  @IsOptional()
  @IsString()
  diagnosis?: string

  @ApiProperty({ example: "Tela substituída com sucesso", required: false })
  @IsOptional()
  @IsString()
  solution?: string

  @ApiProperty({ enum: Priority, example: Priority.HIGH, required: false })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @ApiProperty({ example: 3.0, required: false })
  @IsOptional()
  @IsNumber()
  estimatedHours?: number

  @ApiProperty({ example: "2024-12-31T10:00:00Z", required: false })
  @IsOptional()
  estimatedAt?: Date
}

export class UpdateWorkOrderStatusDto {
  @ApiProperty({ enum: WorkOrderStatus, example: WorkOrderStatus.IN_PROGRESS })
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus

  @ApiProperty({ example: "Iniciando reparo da tela", required: false })
  @IsOptional()
  @IsString()
  notes?: string
}

export class AddWorkOrderItemDto {
  @ApiProperty({ example: "product-id", required: false })
  @IsOptional()
  @IsString()
  productId?: string

  @ApiProperty({ enum: ItemType, example: ItemType.PART })
  @IsEnum(ItemType)
  type: ItemType

  @ApiProperty({ example: "Tela Samsung Galaxy S21" })
  @IsString()
  description: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0.01)
  quantity: number

  @ApiProperty({ example: 150.0 })
  @Transform(({ value }) => Number.parseFloat(value))
  @IsNumber()
  @Min(0)
  unitCost: number

  @ApiProperty({ example: 280.0 })
  @Transform(({ value }) => Number.parseFloat(value))
  @IsNumber()
  @Min(0)
  unitPrice: number

  @ApiProperty({ example: 90, required: false })
  @IsOptional()
  @IsNumber()
  warrantyDays?: number
}
