import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import type { PrismaService } from "../../prisma/prisma.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    })
  }

  async validate(payload: any) {
    if (payload.role === "CLIENT") {
      const customer = await this.prisma.customer.findUnique({
        where: { id: payload.sub },
        include: { company: true },
      })
      return { ...customer, role: "CLIENT" }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { company: true },
    })
    return user
  }
}
