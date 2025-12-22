import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { mockOrders } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: Date;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Derive customers from orders
const customers: Customer[] = mockOrders.reduce((acc, order) => {
  const existing = acc.find((c) => c.email === order.customerEmail);
  if (existing) {
    existing.totalOrders++;
    existing.totalSpent += order.totalAmount;
    if (order.createdAt > existing.lastOrder) {
      existing.lastOrder = order.createdAt;
    }
  } else {
    acc.push({
      id: order.customerEmail,
      name: order.customerName,
      email: order.customerEmail,
      totalOrders: 1,
      totalSpent: order.totalAmount,
      lastOrder: order.createdAt,
    });
  }
  return acc;
}, [] as Customer[]);

export default function CustomersPage() {
  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {item.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'totalOrders',
      header: 'Total Orders',
      render: (item) => (
        <Badge variant="secondary" className="font-medium">
          {item.totalOrders} orders
        </Badge>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      render: (item) => <span className="font-medium">{formatCurrency(item.totalSpent)}</span>,
    },
    {
      key: 'lastOrder',
      header: 'Last Order',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{formatDate(item.lastOrder)}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Customers"
        description="View and manage your customer base"
      />

      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Search customers..."
        emptyMessage="No customers found"
      />
    </DashboardLayout>
  );
}
