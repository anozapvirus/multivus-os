import { PrismaClient, UserRole } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create demo company
  const company = await prisma.company.upsert({
    where: { document: "12345678000199" },
    update: {},
    create: {
      name: "MULTIVUS Assistência Técnica",
      document: "12345678000199",
      email: "contato@multivus.com.br",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123 - São Paulo, SP",
      settings: {
        timezone: "America/Sao_Paulo",
        currency: "BRL",
        language: "pt-BR",
      },
    },
  })

  // Create main branch
  const branch = await prisma.branch.upsert({
    where: { companyId_code: { companyId: company.id, code: "MAIN" } },
    update: {},
    create: {
      companyId: company.id,
      name: "Matriz",
      code: "MAIN",
      address: "Rua das Flores, 123 - São Paulo, SP",
      phone: "(11) 99999-9999",
      email: "matriz@multivus.com.br",
    },
  })

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10)
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@multivus.com.br" },
    update: {},
    create: {
      companyId: company.id,
      branchId: branch.id,
      email: "admin@multivus.com.br",
      password: hashedPassword,
      name: "Administrador",
      phone: "(11) 99999-9999",
      role: UserRole.ADMIN,
    },
  })

  // Create demo technician
  const techPassword = await bcrypt.hash("tech123", 10)
  const techUser = await prisma.user.upsert({
    where: { email: "tecnico@multivus.com.br" },
    update: {},
    create: {
      companyId: company.id,
      branchId: branch.id,
      email: "tecnico@multivus.com.br",
      password: techPassword,
      name: "João Silva",
      phone: "(11) 88888-8888",
      role: UserRole.TECHNICIAN,
    },
  })

  // Create demo customer
  const customer = await prisma.customer.upsert({
    where: { companyId_document: { companyId: company.id, document: "12345678901" } },
    update: {},
    create: {
      companyId: company.id,
      name: "Maria Santos",
      document: "12345678901",
      email: "maria@email.com",
      phone: "(11) 77777-7777",
      address: "Rua das Palmeiras, 456 - São Paulo, SP",
    },
  })

  // Create demo device
  const device = await prisma.device.create({
    data: {
      customerId: customer.id,
      brand: "Samsung",
      model: "Galaxy S21",
      serialNumber: "SM123456789",
      imei: "123456789012345",
      description: "Smartphone Samsung Galaxy S21 128GB Preto",
    },
  })

  // Create stock location
  const stockLocation = await prisma.stockLocation.create({
    data: {
      branchId: branch.id,
      name: "Estoque Principal",
      description: "Estoque principal da matriz",
    },
  })

  // Create demo products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        companyId: company.id,
        sku: "TELA-SAM-S21",
        name: "Tela Samsung Galaxy S21",
        description: "Tela original Samsung Galaxy S21 com touch",
        category: "Peças",
        brand: "Samsung",
        model: "S21",
        costPrice: 150.0,
        salePrice: 280.0,
        currentStock: 10,
        minStock: 2,
        barcode: "7891234567890",
      },
    }),
    prisma.product.create({
      data: {
        companyId: company.id,
        sku: "BATERIA-SAM-S21",
        name: "Bateria Samsung Galaxy S21",
        description: "Bateria original Samsung Galaxy S21 4000mAh",
        category: "Peças",
        brand: "Samsung",
        model: "S21",
        costPrice: 80.0,
        salePrice: 150.0,
        currentStock: 15,
        minStock: 3,
        barcode: "7891234567891",
      },
    }),
    prisma.product.create({
      data: {
        companyId: company.id,
        sku: "SERV-TROCA-TELA",
        name: "Troca de Tela",
        description: "Serviço de troca de tela com garantia de 90 dias",
        category: "Serviços",
        costPrice: 0,
        salePrice: 120.0,
        trackStock: false,
      },
    }),
  ])

  // Create initial stock movements
  for (const product of products.filter((p) => p.trackStock)) {
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        locationId: stockLocation.id,
        type: "IN",
        quantity: product.currentStock,
        unitCost: product.costPrice,
        totalCost: (product.costPrice || 0) * product.currentStock,
        reference: "ESTOQUE_INICIAL",
        notes: "Estoque inicial do sistema",
      },
    })
  }

  // Create demo work order
  const workOrder = await prisma.workOrder.create({
    data: {
      companyId: company.id,
      branchId: branch.id,
      number: "OS-2025-001",
      customerId: customer.id,
      deviceId: device.id,
      assignedTo: techUser.id,
      createdBy: adminUser.id,
      deviceBrand: device.brand,
      deviceModel: device.model,
      deviceSerial: device.serialNumber,
      deviceImei: device.imei,
      reportedIssue: "Tela quebrada após queda",
      status: "TRIAGING",
      priority: "MEDIUM",
      receivedAt: new Date(),
    },
  })

  // Create work order items
  await Promise.all([
    prisma.workOrderItem.create({
      data: {
        workOrderId: workOrder.id,
        productId: products[0].id, // Tela
        type: "PART",
        description: products[0].name,
        quantity: 1,
        unitCost: products[0].costPrice || 0,
        unitPrice: products[0].salePrice,
        totalCost: products[0].costPrice || 0,
        totalPrice: products[0].salePrice,
        warrantyDays: 90,
      },
    }),
    prisma.workOrderItem.create({
      data: {
        workOrderId: workOrder.id,
        productId: products[2].id, // Serviço
        type: "SERVICE",
        description: products[2].name,
        quantity: 1,
        unitCost: 0,
        unitPrice: products[2].salePrice,
        totalCost: 0,
        totalPrice: products[2].salePrice,
        warrantyDays: 90,
      },
    }),
  ])

  console.log("✅ Database seeded successfully!")
  console.log(`📊 Created:`)
  console.log(`   - Company: ${company.name}`)
  console.log(`   - Branch: ${branch.name}`)
  console.log(`   - Admin User: ${adminUser.email} (password: admin123)`)
  console.log(`   - Technician: ${techUser.email} (password: tech123)`)
  console.log(`   - Customer: ${customer.name}`)
  console.log(`   - Products: ${products.length}`)
  console.log(`   - Work Order: ${workOrder.number}`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
