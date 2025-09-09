import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsBoolean, IsOptional } from "class-validator"

export class SendVerificationDto {
  @ApiProperty({ example: "12345678901" })
  @IsString()
  document: string

  @ApiProperty({ example: "company-id" })
  @IsString()
  companyId: string
}

export class ClientLoginDto {
  @ApiProperty({ example: "12345678901" })
  @IsString()
  document: string

  @ApiProperty({ example: "company-id" })
  @IsString()
  companyId: string

  @ApiProperty({ example: "1234", required: false })
  @IsOptional()
  @IsString()
  verificationCode?: string
}

export class ApproveOrderDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  approved: boolean

  @ApiProperty({ example: "Preço muito alto", required: false })
  @IsOptional()
  @IsString()
  rejectionReason?: string
}

export class CreateTicketDto {
  @ApiProperty({ example: "Problema com o reparo" })
  @IsString()
  subject: string

  @ApiProperty({ example: "O dispositivo apresentou o mesmo problema após o reparo..." })
  @IsString()
  message: string
}
