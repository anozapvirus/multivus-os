"use client"

import { useOffline } from "@/hooks/use-offline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline, isSyncing, syncNow } = useOffline()

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-1">
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isOnline ? "Online" : "Offline"}
      </Badge>

      {isOnline && (
        <Button variant="ghost" size="sm" onClick={syncNow} disabled={isSyncing} className="h-6 px-2">
          <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
        </Button>
      )}
    </div>
  )
}
