import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { SyncService } from "./sync.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("sync")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("sync")
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get("changes")
  @ApiOperation({ summary: "Get sync changes for device" })
  async getSyncChanges(deviceId: string, lastVersion?: string) {
    const version = lastVersion ? BigInt(lastVersion) : undefined
    return this.syncService.getSyncChanges(deviceId, version)
  }

  @Post('changes')
  @ApiOperation({ summary: 'Apply sync changes from device' })
  async applySyncChanges(@Body() body: { deviceId: string; changes: any[] }) {
    return this.syncService.applySyncChanges(body.deviceId, body.changes);
  }

  @Post('conflicts')
  @ApiOperation({ summary: 'Check for sync conflicts' })
  async getConflicts(@Body() body: { deviceId: string; changes: any[] }) {
    return this.syncService.getConflicts(body.deviceId, body.changes);
  }

  @Post('cursor')
  @ApiOperation({ summary: 'Update sync cursor for device' })
  async updateCursor(@Body() body: { deviceId: string }) {
    return this.syncService.updateSyncCursor(body.deviceId);
  }
}
