// Shared types for the MULTIVUS OS system

export interface Company {
  id: string
  name: string
  document: string
  email?: string
  phone?: string
  address?: string
  logoUrl?: string
  settings?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Branch {
  id: string
  companyId: string
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  companyId: string
  branchId?: string
  email: string
  name: string
  phone?: string
  role: UserRole
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  TECHNICIAN = "TECHNICIAN",
  ATTENDANT = "ATTENDANT",
  FINANCIAL = "FINANCIAL",
  CLIENT = "CLIENT",
}

export interface WorkOrder {
  id: string
  companyId: string
  branchId: string
  number: string
  customerId: string
  deviceId?: string
  assignedTo?: string
  createdBy: string

  deviceBrand: string
  deviceModel: string
  deviceSerial?: string
  deviceImei?: string

  reportedIssue: string
  diagnosis?: string
  solution?: string
  accessories?: string

  status: WorkOrderStatus
  priority: Priority
  estimatedHours?: number

  laborCost?: number
  partsCost?: number
  totalCost?: number

  receivedAt?: Date
  estimatedAt?: Date
  completedAt?: Date
  deliveredAt?: Date

  createdAt: Date
  updatedAt: Date
}

export enum WorkOrderStatus {
  DRAFT = "DRAFT",
  TRIAGING = "TRIAGING",
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
  AWAITING_PARTS = "AWAITING_PARTS",
  IN_PROGRESS = "IN_PROGRESS",
  QUALITY_CHECK = "QUALITY_CHECK",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  WARRANTY = "WARRANTY",
  RMA = "RMA",
  CANCELLED = "CANCELLED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SyncPayload {
  changes: SyncChange[]
  cursor: string
}

export interface SyncChange {
  id: string
  table: string
  recordId: string
  operation: "INSERT" | "UPDATE" | "DELETE"
  data: Record<string, any>
  version: number
  createdAt: Date
}
