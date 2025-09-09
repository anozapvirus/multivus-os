import { Injectable, Logger } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import { Cron, CronExpression } from "@nestjs/schedule"

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name)

  constructor(private prisma: PrismaService) {}

  async createSyncChange(table: string, recordId: string, operation: "INSERT" | "UPDATE" | "DELETE", data: any) {
    const version = BigInt(Date.now())

    return this.prisma.syncChange.create({
      data: {
        table,
        recordId,
        operation,
        data,
        version,
      },
    })
  }

  async getSyncChanges(deviceId: string, lastVersion?: bigint) {
    // Get or create sync cursor for device
    let cursor = await this.prisma.syncCursor.findUnique({
      where: { deviceId },
    })

    if (!cursor) {
      cursor = await this.prisma.syncCursor.create({
        data: {
          deviceId,
          lastSync: new Date(),
          version: BigInt(0),
        },
      })
    }

    const fromVersion = lastVersion || cursor.version

    // Get changes since last sync
    const changes = await this.prisma.syncChange.findMany({
      where: {
        version: { gt: fromVersion },
      },
      orderBy: { version: "asc" },
      take: 1000, // Limit batch size
    })

    return {
      changes: changes.map((change) => ({
        ...change,
        version: Number(change.version),
      })),
      cursor: cursor.version.toString(),
      hasMore: changes.length === 1000,
    }
  }

  async applySyncChanges(deviceId: string, changes: any[]) {
    const results = []

    for (const change of changes) {
      try {
        await this.applyChange(change)
        results.push({ id: change.id, success: true })
      } catch (error) {
        this.logger.error(`Failed to apply sync change ${change.id}:`, error)
        results.push({
          id: change.id,
          success: false,
          error: error.message,
        })
      }
    }

    // Update sync cursor
    await this.updateSyncCursor(deviceId)

    return results
  }

  private async applyChange(change: any) {
    const { table, recordId, operation, data } = change

    switch (operation) {
      case "INSERT":
        return this.prisma[table].create({ data })

      case "UPDATE":
        return this.prisma[table].update({
          where: { id: recordId },
          data,
        })

      case "DELETE":
        return this.prisma[table].delete({
          where: { id: recordId },
        })

      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }

  async updateSyncCursor(deviceId: string) {
    const latestChange = await this.prisma.syncChange.findFirst({
      orderBy: { version: "desc" },
    })

    if (latestChange) {
      await this.prisma.syncCursor.upsert({
        where: { deviceId },
        update: {
          lastSync: new Date(),
          version: latestChange.version,
        },
        create: {
          deviceId,
          lastSync: new Date(),
          version: latestChange.version,
        },
      })
    }
  }

  async getConflicts(deviceId: string, changes: any[]) {
    const conflicts = []

    for (const change of changes) {
      // Check if record was modified after device's last sync
      const cursor = await this.prisma.syncCursor.findUnique({
        where: { deviceId },
      })

      if (cursor) {
        const serverChanges = await this.prisma.syncChange.findMany({
          where: {
            table: change.table,
            recordId: change.recordId,
            version: { gt: cursor.version },
          },
        })

        if (serverChanges.length > 0) {
          conflicts.push({
            change,
            serverChanges: serverChanges.map((sc) => ({
              ...sc,
              version: Number(sc.version),
            })),
          })
        }
      }
    }

    return conflicts
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupOldSyncChanges() {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 30) // Keep 30 days

    const deleted = await this.prisma.syncChange.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    })

    this.logger.log(`Cleaned up ${deleted.count} old sync changes`)
  }
}
