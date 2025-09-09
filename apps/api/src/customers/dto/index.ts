import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail, IsOptional, IsBoolean } from "class-validator"

export class CreateCustomerDto {
  @ApiProperty({ example: "Maria Santos" })
  @IsString()
  name: string

  @ApiProperty({ example: "12345678901" })
  @IsString()
  document: string

  @ApiProperty({ example: "maria@email.com", required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: "(11) 99999-9999" })
  @IsString()
  phone: string

  @ApiProperty({ example: "Rua das Palmeiras, 456 - São Paulo, SP", required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  companyId?: string // Set automatically from JWT
}

export class UpdateCustomerDto {
  @ApiProperty({ example: "Maria Santos Silva", required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: "12345678902", required: false })
  @IsOptional()
  @IsString()
  document?: string

  @ApiProperty({ example: "maria.nova@email.com", required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: "(11) 88888-8888", required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ example: "Rua Nova, 789 - São Paulo, SP", required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class CreateDeviceDto {
  @ApiProperty({ example: "Samsung" })
  @IsString()
  brand: string

  @ApiProperty({ example: "Galaxy S21" })
  @IsString()
  model: string

  @ApiProperty({ example: "SM123456789", required: false })
  @IsOptional()
  @IsString()
  serialNumber?: string

  @ApiProperty({ example: "123456789012345", required: false })
  @IsOptional()
  @IsString()
  imei?: string

  @ApiProperty({ example: "Smartphone Samsung Galaxy S21 128GB Preto", required: false })
  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateDeviceDto {
  @ApiProperty({ example: "Apple", required: false })
  @IsOptional()
  @IsString()
  brand?: string

  @ApiProperty({ example: "iPhone 13", required: false })
  @IsOptional()
  @IsString()
  model?: string

  @ApiProperty({ example: "AP123456789", required: false })
  @IsOptional()
  @IsString()
  serialNumber?: string

  @ApiProperty({ example: "987654321098765", required: false })
  @IsOptional()
  @IsString()
  imei?: string

  @ApiProperty({ example: "iPhone 13 256GB Azul", required: false })
  @IsOptional()
  @IsString()
  description?: string
}
