import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

export class LoginDto {
  @ApiProperty({ example: "admin@empresa.com" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "senha123" })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ example: "EMP001", required: false })
  @IsOptional()
  @IsString()
  companyCode?: string
}

export class RegisterDto {
  @ApiProperty({ example: "João Silva" })
  @IsString()
  name: string

  @ApiProperty({ example: "joao@empresa.com" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "senha123" })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiProperty({ example: "company-id" })
  @IsOptional()
  @IsString()
  companyId?: string
}

export class ClientLoginDto {
  @ApiProperty({ example: "12345678901" })
  @IsString()
  document: string

  @ApiProperty({ example: "123456" })
  @IsString()
  verificationCode: string
}
