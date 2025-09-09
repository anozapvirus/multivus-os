-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'TECHNICIAN', 'ATTENDANT', 'FINANCIAL', 'CLIENT');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('DRAFT', 'TRIAGING', 'AWAITING_APPROVAL', 'AWAITING_PARTS', 'IN_PROGRESS', 'QUALITY_CHECK', 'READY_FOR_PICKUP', 'DELIVERED', 'COMPLETED', 'WARRANTY', 'RMA', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('SERVICE', 'PART', 'ACCESSORY');

-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('INTAKE', 'DIAGNOSTIC', 'REPAIR', 'COMPLETION', 'DELIVERY');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'RETURN', 'WARRANTY_RETURN');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('DRAFT', 'SENT', 'CONFIRMED', 'PARTIAL_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'PIX', 'TRANSFER', 'CHECK', 'INSTALLMENT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReceivableStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WarrantyType" AS ENUM ('PARTS', 'SERVICE', 'FULL');

-- CreateEnum
CREATE TYPE "RmaStatus" AS ENUM ('OPENED', 'IN_ANALYSIS', 'APPROVED', 'REJECTED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER_CREATED', 'ORDER_APPROVED', 'ORDER_READY', 'ORDER_DELIVERED', 'BUDGET_PENDING', 'BUDGET_EXPIRED', 'WARRANTY_EXPIRING', 'PAYMENT_OVERDUE');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'PUSH');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "logoUrl" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_document_key" ON "companies"("document");
