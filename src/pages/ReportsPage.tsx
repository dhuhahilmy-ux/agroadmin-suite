import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSalesData, mockCategoryData, mockDashboardStats } from '@/data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';

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

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive business insights and performance metrics"
      />

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenue This Month"
          value={formatCurrency(mockDashboardStats.totalSales)}
          icon={<DollarSign className="h-6 w-6" />}
          trend={mockDashboardStats.salesGrowth}
          trendLabel="vs last month"
          variant="primary"
        />
        <StatsCard
          title="Orders This Month"
          value={mockDashboardStats.totalOrders.toString()}
          icon={<ShoppingCart className="h-6 w-6" />}
          trend={mockDashboardStats.ordersGrowth}
          trendLabel="vs last month"
          variant="success"
        />
        <StatsCard
          title="Avg Order Value"
          value={formatCurrency(mockDashboardStats.totalSales / mockDashboardStats.totalOrders)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={4.2}
          variant="info"
        />
        <StatsCard
          title="Stock Availability"
          value={`${mockDashboardStats.stockAvailability}%`}
          icon={<Package className="h-6 w-6" />}
          trend={-2.1}
          variant="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Annual Sales Trend */}
        <Card className="lg:col-span-2 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Annual Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSalesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152, 45%, 35%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(152, 45%, 35%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Sales']}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Orders */}
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
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

        {/* Performance Comparison */}
        <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sales vs Orders Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Sales (IDR)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
