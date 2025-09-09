import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from "class-validator"
import { UserRole } from "@prisma/client"

export class CreateUserDto {
  @ApiProperty({ example: "joao@multivus.com.br" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "senha123" })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ example: "João Silva" })
  @IsString()
  name: string

  @ApiProperty({ example: "(11) 99999-9999", required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ enum: UserRole, example: UserRole.TECHNICIAN })
  @IsEnum(UserRole)
  role: UserRole

  @ApiProperty({ example: "company-id" })
  @IsString()
  companyId: string

  @ApiProperty({ example: "branch-id", required: false })
  @IsOptional()
  @IsString()
  branchId?: string

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateUserDto {
  @ApiProperty({ example: "joao@multivus.com.br", required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: "novaSenha123", required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string

  @ApiProperty({ example: "João Silva Santos", required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: "(11) 88888-8888", required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ enum: UserRole, example: UserRole.MANAGER, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiProperty({ example: "new-branch-id", required: false })
  @IsOptional()
  @IsString()
  branchId?: string

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
