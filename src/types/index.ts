export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  supplier: string;
  status: 'active' | 'inactive' | 'low-stock';
  image?: string | null;
  imageUrl?: string | null;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  commodities: string[];
  status: 'active' | 'inactive';
  rating: number;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  warehouse: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  lastRestocked: Date;
  expiryDate?: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatar?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  activeCustomers: number;
  stockAvailability: number;
  salesGrowth: number;
  ordersGrowth: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}
