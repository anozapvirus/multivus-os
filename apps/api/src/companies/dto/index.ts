import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail, IsOptional, IsBoolean, IsObject } from "class-validator"

export class CreateCompanyDto {
  @ApiProperty({ example: "MULTIVUS Assistência Técnica" })
  @IsString()
  name: string

  @ApiProperty({ example: "12345678000199" })
  @IsString()
  document: string

  @ApiProperty({ example: "contato@multivus.com.br", required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: "(11) 99999-9999", required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ example: "Rua das Flores, 123 - São Paulo, SP", required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ example: "https://logo.url", required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string

  @ApiProperty({ example: { timezone: "America/Sao_Paulo" }, required: false })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>
}

export class UpdateCompanyDto {
  @ApiProperty({ example: "MULTIVUS Assistência Técnica Ltda", required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: "12345678000199", required: false })
  @IsOptional()
  @IsString()
  document?: string

  @ApiProperty({ example: "novo@multivus.com.br", required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: "(11) 88888-8888", required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ example: "Rua Nova, 456 - São Paulo, SP", required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ example: "https://newlogo.url", required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string

  @ApiProperty({ example: { timezone: "America/Sao_Paulo", currency: "BRL" }, required: false })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>
}

export class CreateBranchDto {
  @ApiProperty({ example: "Matriz" })
  @IsString()
  name: string

  @ApiProperty({ example: "MAIN" })
  @IsString()
  code: string

  @ApiProperty({ example: "Rua das Flores, 123 - São Paulo, SP", required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ example: "(11) 99999-9999", required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ example: "matriz@multivus.com.br", required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateBranchDto {
  @ApiProperty({ example: "Filial Centro", required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: "CENTRO", required: false })
  @IsOptional()
  @IsString()
  code?: string

  @ApiProperty({ example: "Rua Nova, 456 - São Paulo, SP", required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ example: "(11) 88888-8888", required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ example: "centro@multivus.com.br", required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
