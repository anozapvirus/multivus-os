import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  barcode?: string

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number

  @ApiProperty()
  @IsNumber()
  @Min(0)
  cost: number

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number

  @ApiProperty()
  @IsNumber()
  @Min(0)
  minQuantity: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierId?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  branchId?: string
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  barcode?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minQuantity?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierId?: string
}

export class CreateSupplierDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  document?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactPerson?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string
}

export class PurchaseOrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitPrice: number
}

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsString()
  supplierId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiProperty({ type: [PurchaseOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[]
}
