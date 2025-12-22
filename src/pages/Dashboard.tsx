import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockDashboardStats, mockSalesData, mockCategoryData, mockOrders } from '@/data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  'hsl(152, 45%, 35%)',
  'hsl(85, 50%, 45%)',
  'hsl(42, 80%, 55%)',
  'hsl(175, 45%, 45%)',
  'hsl(15, 60%, 50%)',
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export default function Dashboard() {
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's what's happening with your agribusiness today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Sales"
            value={formatCurrency(mockDashboardStats.totalSales)}
            icon={<DollarSign className="h-6 w-6" />}
            trend={mockDashboardStats.salesGrowth}
            trendLabel="vs last month"
            variant="primary"
          />
          <StatsCard
            title="Total Orders"
            value={mockDashboardStats.totalOrders.toLocaleString()}
            icon={<ShoppingCart className="h-6 w-6" />}
            trend={mockDashboardStats.ordersGrowth}
            trendLabel="vs last month"
            variant="success"
          />
          <StatsCard
            title="Active Customers"
            value={mockDashboardStats.activeCustomers.toLocaleString()}
            icon={<Users className="h-6 w-6" />}
            trend={5.2}
            trendLabel="new this month"
            variant="info"
          />
          <StatsCard
            title="Stock Availability"
            value={`${mockDashboardStats.stockAvailability}%`}
            icon={<Package className="h-6 w-6" />}
            trend={-2.1}
            trendLabel="vs last week"
            variant="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Monthly Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [formatCurrency(value), 'Sales']}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {mockCategoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Share']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px' }}
                      formatter={(value) => (
                        <span className="text-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            <a
              href="/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </a>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Order ID</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Customer</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-4 text-sm font-medium">{order.id}</td>
                      <td className="py-4">
                        <div>
                          <p className="text-sm font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm font-medium">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
