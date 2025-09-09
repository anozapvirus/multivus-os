import { invoke } from "@tauri-apps/api/tauri"
import { listen } from "@tauri-apps/api/event"
import { syncManager } from "./sync-manager"

class DesktopBridge {
  private isDesktop = false

  constructor() {
    // Check if running in Tauri
    this.isDesktop = typeof window !== "undefined" && "__TAURI__" in window

    if (this.isDesktop) {
      this.setupEventListeners()
    }
  }

  private async setupEventListeners() {
    // Listen for menu events
    await listen("menu-backup", () => this.handleBackup())
    await listen("menu-restore", () => this.handleRestore())
    await listen("menu-export", () => this.handleExport())
    await listen("menu-sync", () => this.handleSync())
  }

  async handleBackup() {
    try {
      const backupName = `backup-${new Date().toISOString().split("T")[0]}`
      const backupPath = await invoke("create_backup", { backupName })

      // Show success notification
      if ("Notification" in window) {
        new Notification("Backup Created", {
          body: `Backup saved to: ${backupPath}`,
          icon: "/icon-192.png",
        })
      }
    } catch (error) {
      console.error("Backup failed:", error)
      alert("Failed to create backup: " + error)
    }
  }

  async handleRestore() {
    // In a real implementation, you'd show a file picker dialog
    const backupPath = prompt("Enter backup file path:")
    if (!backupPath) return

    try {
      await invoke("restore_backup", { backupPath })

      // Show success notification
      if ("Notification" in window) {
        new Notification("Backup Restored", {
          body: "Database has been restored from backup",
          icon: "/icon-192.png",
        })
      }

      // Reload the app
      window.location.reload()
    } catch (error) {
      console.error("Restore failed:", error)
      alert("Failed to restore backup: " + error)
    }
  }

  async handleExport() {
    // In a real implementation, you'd show a save dialog
    const exportPath = prompt("Enter export file path:")
    if (!exportPath) return

    try {
      await invoke("export_data", { exportPath })

      // Show success notification
      if ("Notification" in window) {
        new Notification("Data Exported", {
          body: `Data exported to: ${exportPath}`,
          icon: "/icon-192.png",
        })
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to export data: " + error)
    }
  }

  async handleSync() {
    try {
      await syncManager.syncNow()

      // Show success notification
      if ("Notification" in window) {
        new Notification("Sync Complete", {
          body: "Data has been synchronized with server",
          icon: "/icon-192.png",
        })
      }
    } catch (error) {
      console.error("Sync failed:", error)
      alert("Failed to sync data: " + error)
    }
  }

  async getAppDataDir() {
    if (!this.isDesktop) return null

    try {
      return await invoke("get_app_data_dir")
    } catch (error) {
      console.error("Failed to get app data directory:", error)
      return null
    }
  }

  isRunningInDesktop() {
    return this.isDesktop
  }
}

export const desktopBridge = new DesktopBridge()
