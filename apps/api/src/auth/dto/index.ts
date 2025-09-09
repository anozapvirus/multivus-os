import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from "class-validator"
import { UserRole } from "@prisma/client"

export class LoginDto {
  @ApiProperty({ example: "admin@multivus.com.br" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "admin123" })
  @IsString()
  @MinLength(6)
  password: string
}

export class RegisterDto {
  @ApiProperty({ example: "admin@multivus.com.br" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "admin123" })
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
}

export class ChangePasswordDto {
  @ApiProperty({ example: "senhaAtual123" })
  @IsString()
  currentPassword: string

  @ApiProperty({ example: "novaSenha123" })
  @IsString()
  @MinLength(6)
  newPassword: string
}
