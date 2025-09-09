# MULTIVUS OS - API Documentation

## Base URL
\`\`\`
Production: https://yourdomain.com/api
Development: http://localhost:3001
\`\`\`

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:

\`\`\`http
Authorization: Bearer <your_jwt_token>
\`\`\`

### Login
\`\`\`http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "TECHNICIAN"
    }
  }
}
\`\`\`

## Work Orders

### List Work Orders
\`\`\`http
GET /work-orders?page=1&limit=10&status=IN_PROGRESS
\`\`\`

### Create Work Order
\`\`\`http
POST /work-orders
Content-Type: application/json

{
  "customerId": "customer_id",
  "deviceBrand": "Apple",
  "deviceModel": "iPhone 12",
  "reportedIssue": "Screen cracked",
  "priority": "MEDIUM"
}
\`\`\`

### Update Work Order
\`\`\`http
PATCH /work-orders/:id
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "diagnosis": "LCD panel needs replacement"
}
\`\`\`

### Upload Photos
\`\`\`http
POST /work-orders/:id/photos
Content-Type: multipart/form-data

photo: <file>
type: "DIAGNOSTIC"
description: "Before repair photo"
\`\`\`

## Customers

### List Customers
\`\`\`http
GET /customers?search=john&page=1&limit=10
\`\`\`

### Create Customer
\`\`\`http
POST /customers
Content-Type: application/json

{
  "name": "John Doe",
  "document": "12345678901",
  "email": "john@example.com",
  "phone": "+5511999999999",
  "address": "123 Main St, City"
}
\`\`\`

## Inventory

### List Products
\`\`\`http
GET /inventory/products?category=parts&lowStock=true
\`\`\`

### Update Stock
\`\`\`http
PATCH /inventory/products/:id/stock
Content-Type: application/json

{
  "quantity": 10,
  "type": "ADD"
}
\`\`\`

## Financial

### Create Invoice
\`\`\`http
POST /financial/invoices
Content-Type: application/json

{
  "customerId": "customer_id",
  "workOrderId": "work_order_id",
  "issueDate": "2024-12-08",
  "dueDate": "2024-12-15",
  "items": [
    {
      "description": "Screen replacement",
      "quantity": 1,
      "unitPrice": 150.00
    }
  ],
  "totalAmount": 150.00
}
\`\`\`

### Record Payment
\`\`\`http
POST /financial/payments
Content-Type: application/json

{
  "invoiceId": "invoice_id",
  "amount": 150.00,
  "method": "PIX",
  "paidAt": "2024-12-08T10:30:00Z"
}
\`\`\`

## Sync (Offline Support)

### Get Changes
\`\`\`http
GET /sync/changes?deviceId=device123&lastVersion=1234567890
\`\`\`

### Apply Changes
\`\`\`http
POST /sync/changes
Content-Type: application/json

{
  "deviceId": "device123",
  "changes": [
    {
      "table": "work_orders",
      "recordId": "wo_123",
      "operation": "UPDATE",
      "data": { "status": "COMPLETED" }
    }
  ]
}
\`\`\`

## Error Responses

All endpoints return errors in the following format:

\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
\`\`\`

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to:
- **Authenticated users**: 1000 requests per hour
- **Public endpoints**: 100 requests per hour

Rate limit headers are included in responses:
\`\`\`http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
\`\`\`

## Webhooks

Configure webhooks to receive real-time notifications:

\`\`\`http
POST /webhooks
Content-Type: application/json

{
  "name": "Order Status Updates",
  "url": "https://your-app.com/webhook",
  "events": ["order.created", "order.completed"],
  "secret": "your_webhook_secret"
}
\`\`\`

### Webhook Events
- `order.created` - New work order created
- `order.updated` - Work order status changed
- `order.completed` - Work order completed
- `payment.received` - Payment recorded
- `customer.created` - New customer registered

## SDKs and Libraries

### JavaScript/TypeScript
\`\`\`bash
npm install @multivus/api-client
\`\`\`

\`\`\`javascript
import { MultivusClient } from '@multivus/api-client';

const client = new MultivusClient({
  baseURL: 'https://yourdomain.com/api',
  token: 'your_jwt_token'
});

// Create work order
const workOrder = await client.workOrders.create({
  customerId: 'customer_id',
  deviceBrand: 'Apple',
  deviceModel: 'iPhone 12',
  reportedIssue: 'Screen cracked'
});
\`\`\`

### Python
\`\`\`bash
pip install multivus-api-client
\`\`\`

\`\`\`python
from multivus import MultivusClient

client = MultivusClient(
    base_url='https://yourdomain.com/api',
    token='your_jwt_token'
)

# Create work order
work_order = client.work_orders.create({
    'customerId': 'customer_id',
    'deviceBrand': 'Apple',
    'deviceModel': 'iPhone 12',
    'reportedIssue': 'Screen cracked'
})
\`\`\`

## Postman Collection

Import our Postman collection for easy API testing:
[Download MULTIVUS OS API Collection](https://api.multivus.com/postman-collection.json)
