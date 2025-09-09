"use client"

import { useState, useEffect } from "react"
import { syncManager } from "@/lib/sync-manager"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Start sync manager
    syncManager.startPeriodicSync()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      syncManager.stopPeriodicSync()
    }
  }, [])

  const syncNow = async () => {
    setIsSyncing(true)
    try {
      await syncManager.syncNow()
    } finally {
      setIsSyncing(false)
    }
  }

  return {
    isOnline,
    isSyncing,
    syncNow,
  }
}
