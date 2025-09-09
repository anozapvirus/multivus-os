"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, AlertTriangle, ShoppingCart, Search } from "lucide-react"

interface Product {
  id: string
  name: string
  sku?: string
  quantity: number
  minQuantity: number
  price: number
  cost: number
  category?: string
  supplier?: { name: string }
}

interface Supplier {
  id: string
  name: string
  email?: string
  phone?: string
  _count: { products: number }
}

interface PurchaseOrder {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  supplier: { name: string }
  createdAt: string
  _count: { items: number }
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, suppliersRes, purchaseOrdersRes, lowStockRes] = await Promise.all([
        fetch("/api/inventory/products"),
        fetch("/api/inventory/suppliers"),
        fetch("/api/inventory/purchase-orders"),
        fetch("/api/inventory/products/low-stock"),
      ])

      setProducts(await productsRes.json())
      setSuppliers(await suppliersRes.json())
      setPurchaseOrders(await purchaseOrdersRes.json())
      setLowStockProducts(await lowStockRes.json())
    } catch (error) {
      console.error("Error fetching inventory data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (quantity <= minQuantity) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage products, suppliers, and purchase orders</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.filter((po) => po.status === "PENDING").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock Alert</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.quantity, product.minQuantity)
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        {product.sku && <CardDescription>SKU: {product.sku}</CardDescription>}
                      </div>
                      <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{product.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="font-medium">R$ {product.price.toFixed(2)}</span>
                      </div>
                      {product.category && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Category:</span>
                          <span className="font-medium">{product.category}</span>
                        </div>
                      )}
                      {product.supplier && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Supplier:</span>
                          <span className="font-medium">{product.supplier.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Suppliers</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <CardDescription>{supplier._count.products} products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {supplier.email && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="font-medium">{supplier.email}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="font-medium">{supplier.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Purchase Orders</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </div>

          <div className="space-y-4">
            {purchaseOrders.map((po) => (
              <Card key={po.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">PO #{po.orderNumber}</CardTitle>
                      <CardDescription>{po.supplier.name}</CardDescription>
                    </div>
                    <Badge variant={po.status === "PENDING" ? "secondary" : "default"}>{po.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {po._count.items} items • Created {new Date(po.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {po.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-semibold">Low Stock Alert</h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products with low stock</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <Card key={product.id} className="border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Current: {product.quantity} • Minimum: {product.minQuantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Low Stock</Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Need: {product.minQuantity - product.quantity + 10} units
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
