import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ThrottlerModule } from "@nestjs/throttler"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { CompaniesModule } from "./companies/companies.module"
import { UsersModule } from "./users/users.module"
import { WorkOrdersModule } from "./work-orders/work-orders.module"
import { CustomersModule } from "./customers/customers.module"
import { InventoryModule } from "./inventory/inventory.module"
import { FinancialModule } from "./financial/financial.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { ReportsModule } from "./reports/reports.module"
import { FilesModule } from "./files/files.module"

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Core modules
    PrismaModule,
    AuthModule,

    // Business modules
    CompaniesModule,
    UsersModule,
    WorkOrdersModule,
    CustomersModule,
    InventoryModule,
    FinancialModule,
    NotificationsModule,
    ReportsModule,
    FilesModule,
  ],
})
export class AppModule {}
