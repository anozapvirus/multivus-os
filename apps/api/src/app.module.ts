import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ScheduleModule } from "@nestjs/schedule"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { CompaniesModule } from "./companies/companies.module"
import { CustomersModule } from "./customers/customers.module"
import { WorkOrdersModule } from "./work-orders/work-orders.module"
import { ProductsModule } from "./products/products.module"
import { InventoryModule } from "./inventory/inventory.module"
import { FinancialModule } from "./financial/financial.module"
import { PaymentsModule } from "./payments/payments.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { ReportsModule } from "./reports/reports.module"
import { SyncModule } from "./sync/sync.module"
import { WebhooksModule } from "./webhooks/webhooks.module"
import { ClientModule } from "./client/client.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    CustomersModule,
    WorkOrdersModule,
    ProductsModule,
    InventoryModule,
    FinancialModule,
    PaymentsModule,
    NotificationsModule,
    ReportsModule,
    SyncModule,
    WebhooksModule,
    ClientModule,
  ],
})
export class AppModule {}
