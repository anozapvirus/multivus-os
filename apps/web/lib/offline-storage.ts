import { openDB, type DBSchema, type IDBPDatabase } from "idb"

interface MultivusDB extends DBSchema {
  workOrders: {
    key: string
    value: any
    indexes: { "by-status": string; "by-customer": string }
  }
  customers: {
    key: string
    value: any
    indexes: { "by-document": string }
  }
  products: {
    key: string
    value: any
    indexes: { "by-sku": string }
  }
  syncQueue: {
    key: string
    value: {
      id: string
      table: string
      recordId: string
      operation: "INSERT" | "UPDATE" | "DELETE"
      data: any
      timestamp: number
      synced: boolean
    }
  }
  settings: {
    key: string
    value: any
  }
}

class OfflineStorage {
  private db: IDBPDatabase<MultivusDB> | null = null

  async init() {
    if (this.db) return this.db

    this.db = await openDB<MultivusDB>("multivus-os", 1, {
      upgrade(db) {
        // Work Orders
        const workOrderStore = db.createObjectStore("workOrders", { keyPath: "id" })
        workOrderStore.createIndex("by-status", "status")
        workOrderStore.createIndex("by-customer", "customerId")

        // Customers
        const customerStore = db.createObjectStore("customers", { keyPath: "id" })
        customerStore.createIndex("by-document", "document")

        // Products
        const productStore = db.createObjectStore("products", { keyPath: "id" })
        productStore.createIndex("by-sku", "sku")

        // Sync Queue
        db.createObjectStore("syncQueue", { keyPath: "id" })

        // Settings
        db.createObjectStore("settings", { keyPath: "key" })
      },
    })

    return this.db
  }

  async get(store: keyof MultivusDB, key: string) {
    const db = await this.init()
    return db.get(store, key)
  }

  async getAll(store: keyof MultivusDB) {
    const db = await this.init()
    return db.getAll(store)
  }

  async put(store: keyof MultivusDB, data: any) {
    const db = await this.init()
    await db.put(store, data)

    // Add to sync queue if not a sync operation
    if (store !== "syncQueue" && store !== "settings") {
      await this.addToSyncQueue(store, data.id, "UPDATE", data)
    }
  }

  async delete(store: keyof MultivusDB, key: string) {
    const db = await this.init()
    await db.delete(store, key)

    // Add to sync queue
    if (store !== "syncQueue" && store !== "settings") {
      await this.addToSyncQueue(store, key, "DELETE", null)
    }
  }

  async addToSyncQueue(table: string, recordId: string, operation: "INSERT" | "UPDATE" | "DELETE", data: any) {
    const db = await this.init()
    const queueItem = {
      id: `${table}-${recordId}-${Date.now()}`,
      table,
      recordId,
      operation,
      data,
      timestamp: Date.now(),
      synced: false,
    }

    await db.put("syncQueue", queueItem)
  }

  async getSyncQueue() {
    const db = await this.init()
    return db.getAll("syncQueue")
  }

  async markSynced(queueId: string) {
    const db = await this.init()
    const item = await db.get("syncQueue", queueId)
    if (item) {
      item.synced = true
      await db.put("syncQueue", item)
    }
  }

  async clearSyncedItems() {
    const db = await this.init()
    const tx = db.transaction("syncQueue", "readwrite")
    const store = tx.objectStore("syncQueue")
    const items = await store.getAll()

    for (const item of items) {
      if (item.synced) {
        await store.delete(item.id)
      }
    }

    await tx.done
  }

  async search(store: keyof MultivusDB, indexName: string, query: string) {
    const db = await this.init()
    const tx = db.transaction(store, "readonly")
    const index = tx.objectStore(store).index(indexName)
    return index.getAll(query)
  }
}

export const offlineStorage = new OfflineStorage()
