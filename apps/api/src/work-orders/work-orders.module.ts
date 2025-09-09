import { Module } from "@nestjs/common"
import { WorkOrdersService } from "./work-orders.service"
import { WorkOrdersController } from "./work-orders.controller"

@Module({
  providers: [WorkOrdersService],
  controllers: [WorkOrdersController],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
