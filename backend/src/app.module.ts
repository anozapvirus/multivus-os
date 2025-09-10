import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ThrottlerModule } from "@nestjs/throttler"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { CompaniesModule } from "./companies/companies.module"
import { UsersModule } from "./users/users.module"
import { CustomersModule } from "./customers/customers.module"
import { WorkOrdersModule } from "./work-orders/work-orders.module"
import { InventoryModule } from "./inventory/inventory.module"
import { FinancialModule } from "./financial/financial.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { FilesModule } from "./files/files.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    CompaniesModule,
    UsersModule,
    CustomersModule,
    WorkOrdersModule,
    InventoryModule,
    FinancialModule,
    NotificationsModule,
    FilesModule,
  ],
})
export class AppModule {}
