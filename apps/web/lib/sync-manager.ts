import { offlineStorage } from "./offline-storage"

class SyncManager {
  private isOnline = true
  private syncInProgress = false
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.isOnline = navigator.onLine
      window.addEventListener("online", () => this.handleOnline())
      window.addEventListener("offline", () => this.handleOffline())
    }
  }

  private handleOnline() {
    this.isOnline = true
    console.log("[v0] Device came online, starting sync")
    this.startPeriodicSync()
    this.syncNow()
  }

  private handleOffline() {
    this.isOnline = false
    console.log("[v0] Device went offline")
    this.stopPeriodicSync()
  }

  startPeriodicSync() {
    if (this.syncInterval) return

    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncNow()
      }
    }, 30000) // Sync every 30 seconds
  }

  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  async syncNow() {
    if (!this.isOnline || this.syncInProgress) return

    this.syncInProgress = true
    console.log("[v0] Starting sync process")

    try {
      // Get device ID from localStorage or generate one
      let deviceId = localStorage.getItem("deviceId")
      if (!deviceId) {
        deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem("deviceId", deviceId)
      }

      // Push local changes to server
      await this.pushChanges(deviceId)

      // Pull changes from server
      await this.pullChanges(deviceId)

      // Clean up synced items
      await offlineStorage.clearSyncedItems()

      console.log("[v0] Sync completed successfully")
    } catch (error) {
      console.error("[v0] Sync failed:", error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async pushChanges(deviceId: string) {
    const queue = await offlineStorage.getSyncQueue()
    const unsyncedItems = queue.filter((item) => !item.synced)

    if (unsyncedItems.length === 0) return

    console.log(`[v0] Pushing ${unsyncedItems.length} changes to server`)

    try {
      const response = await fetch("/api/sync/changes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          deviceId,
          changes: unsyncedItems,
        }),
      })

      if (response.ok) {
        const results = await response.json()

        // Mark successful items as synced
        for (const result of results) {
          if (result.success) {
            await offlineStorage.markSynced(result.id)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Failed to push changes:", error)
    }
  }

  private async pullChanges(deviceId: string) {
    try {
      const lastVersion = localStorage.getItem(`lastSyncVersion-${deviceId}`) || "0"

      const response = await fetch(`/api/sync/changes?deviceId=${deviceId}&lastVersion=${lastVersion}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const { changes, cursor, hasMore } = await response.json()

        console.log(`[v0] Received ${changes.length} changes from server`)

        // Apply changes to local storage
        for (const change of changes) {
          await this.applyChange(change)
        }

        // Update cursor
        localStorage.setItem(`lastSyncVersion-${deviceId}`, cursor)

        // If there are more changes, continue pulling
        if (hasMore) {
          await this.pullChanges(deviceId)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to pull changes:", error)
    }
  }

  private async applyChange(change: any) {
    const { table, recordId, operation, data } = change

    try {
      switch (operation) {
        case "INSERT":
        case "UPDATE":
          await offlineStorage.put(table as any, data)
          break

        case "DELETE":
          await offlineStorage.delete(table as any, recordId)
          break
      }
    } catch (error) {
      console.error(`[v0] Failed to apply change for ${table}:${recordId}:`, error)
    }
  }

  async getWorkOrders() {
    if (this.isOnline) {
      try {
        const response = await fetch("/api/work-orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const workOrders = await response.json()

          // Store in offline storage
          for (const wo of workOrders) {
            await offlineStorage.put("workOrders", wo)
          }

          return workOrders
        }
      } catch (error) {
        console.log("[v0] Failed to fetch from server, using offline data")
      }
    }

    // Return offline data
    return offlineStorage.getAll("workOrders")
  }

  async createWorkOrder(workOrder: any) {
    // Always store locally first
    const id = workOrder.id || `temp-${Date.now()}`
    const woWithId = { ...workOrder, id }

    await offlineStorage.put("workOrders", woWithId)

    if (this.isOnline) {
      try {
        const response = await fetch("/api/work-orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(workOrder),
        })

        if (response.ok) {
          const serverWO = await response.json()
          // Update with server ID if it was temporary
          if (id.startsWith("temp-")) {
            await offlineStorage.delete("workOrders", id)
            await offlineStorage.put("workOrders", serverWO)
          }
          return serverWO
        }
      } catch (error) {
        console.log("[v0] Failed to create on server, will sync later")
      }
    }

    return woWithId
  }
}

export const syncManager = new SyncManager()
