import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum, Min, IsDateString } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class InvoiceItemDto {
  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitPrice: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productId?: string
}

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  customerId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  workOrderId?: string

  @ApiProperty()
  @IsDateString()
  issueDate: string

  @ApiProperty()
  @IsDateString()
  dueDate: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[]

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalAmount: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number
}

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  invoiceId: string

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount: number

  @ApiProperty()
  @IsEnum(["CASH", "CARD", "PIX", "BANK_TRANSFER", "CHECK"])
  method: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiProperty()
  @IsDateString()
  paidAt: string
}
