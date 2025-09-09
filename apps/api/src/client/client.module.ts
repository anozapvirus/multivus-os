import { Module } from "@nestjs/common"
import { ClientService } from "./client.service"
import { ClientController } from "./client.controller"
import { CustomersModule } from "../customers/customers.module"
import { WorkOrdersModule } from "../work-orders/work-orders.module"

@Module({
  imports: [CustomersModule, WorkOrdersModule],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
