-- Inserir planos padrão
INSERT INTO plans (id, name, description, price, "maxAdmins", "maxSellers", "maxOrders", features, active, "createdAt", "updatedAt") VALUES
('plan_basic', 'Básico', 'Plano básico para pequenas empresas', 99.90, 2, 5, 500, '["work_orders", "customers", "basic_reports"]', true, NOW(), NOW()),
('plan_pro', 'Profissional', 'Plano profissional com mais recursos', 199.90, 5, 15, 2000, '["work_orders", "customers", "inventory", "financial", "advanced_reports", "api_access"]', true, NOW(), NOW()),
('plan_enterprise', 'Empresarial', 'Plano empresarial completo', 399.90, 20, 50, 10000, '["work_orders", "customers", "inventory", "financial", "advanced_reports", "api_access", "multi_branch", "custom_fields", "integrations"]', true, NOW(), NOW());

-- Inserir empresa de demonstração
INSERT INTO companies (id, name, document, email, phone, address, city, state, "zipCode", "planId", "planExpiresAt", active, "createdAt", "updatedAt") VALUES
('demo_company', 'Empresa Demonstração LTDA', '12345678000199', 'contato@demo.com', '(11) 99999-9999', 'Rua Demo, 123', 'São Paulo', 'SP', '01234-567', 'plan_pro', '2025-12-31', true, NOW(), NOW());

-- Inserir filial principal
INSERT INTO branches (id, name, address, phone, "companyId", active, "createdAt", "updatedAt") VALUES
('demo_branch', 'Matriz', 'Rua Demo, 123', '(11) 99999-9999', 'demo_company', true, NOW(), NOW());

-- Inserir usuários de demonstração (senha: 123456)
INSERT INTO users (id, email, password, name, role, "companyId", "branchId", active, "createdAt", "updatedAt") VALUES
('demo_admin', 'admin@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador Demo', 'ADMIN', 'demo_company', 'demo_branch', true, NOW(), NOW()),
('demo_seller', 'vendedor@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vendedor Demo', 'SELLER', 'demo_company', 'demo_branch', true, NOW(), NOW()),
('demo_tech', 'tecnico@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Técnico Demo', 'TECHNICIAN', 'demo_company', 'demo_branch', true, NOW(), NOW());

-- Inserir clientes de demonstração
INSERT INTO customers (id, name, document, email, phone, address, city, state, "zipCode", "companyId", active, "createdAt", "updatedAt") VALUES
('demo_customer1', 'João Silva', '12345678901', 'joao@email.com', '(11) 98888-8888', 'Rua Cliente, 456', 'São Paulo', 'SP', '01234-567', 'demo_company', true, NOW(), NOW()),
('demo_customer2', 'Maria Santos', '98765432100', 'maria@email.com', '(11) 97777-7777', 'Av. Cliente, 789', 'São Paulo', 'SP', '01234-567', 'demo_company', true, NOW(), NOW());

-- Inserir dispositivos
INSERT INTO devices (id, brand, model, "serialNumber", description, "customerId", "createdAt", "updatedAt") VALUES
('demo_device1', 'Samsung', 'Galaxy S21', 'SN123456789', 'Smartphone com tela quebrada', 'demo_customer1', NOW(), NOW()),
('demo_device2', 'Apple', 'iPhone 12', 'SN987654321', 'iPhone com problema na bateria', 'demo_customer2', NOW(), NOW());

-- Inserir ordens de serviço de demonstração
INSERT INTO work_orders (id, number, title, description, status, priority, "customerId", "deviceId", "companyId", "branchId", "assignedUserId", "estimatedHours", "totalAmount", "laborAmount", "partsAmount", "createdAt", "updatedAt") VALUES
('demo_wo1', 'OS-000001', 'Troca de Tela Samsung Galaxy S21', 'Cliente relatou que derrubou o aparelho e a tela quebrou completamente', 'IN_PROGRESS', 'HIGH', 'demo_customer1', 'demo_device1', 'demo_company', 'demo_branch', 'demo_tech', 2.0, 250.00, 80.00, 170.00, NOW(), NOW()),
('demo_wo2', 'OS-000002', 'Substituição de Bateria iPhone 12', 'Bateria não segura carga, precisa trocar', 'PENDING', 'MEDIUM', 'demo_customer2', 'demo_device2', 'demo_company', 'demo_branch', 'demo_tech', 1.5, 180.00, 60.00, 120.00, NOW(), NOW());
