import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useData } from '@/contexts/DataContext';
import { Order } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

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
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function OrdersPage() {
  const { orders, updateOrder, deleteOrder } = useData();
  const { toast } = useToast();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (item) => <span className="font-medium">{item.id}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (item) => (
        <div>
          <p className="font-medium">{item.customerName}</p>
          <p className="text-xs text-muted-foreground">{item.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (item) => <span className="font-medium">{formatCurrency(item.totalAmount)}</span>,
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (item) => <StatusBadge status={item.paymentStatus} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(item)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusClick(item)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(item)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusOpen(true);
  };

  const handleStatusUpdate = () => {
    if (selectedOrder) {
      updateOrder(selectedOrder.id, { status: newStatus });
      toast({
        title: 'Order updated',
        description: `Order ${selectedOrder.id} status changed to ${newStatus}.`,
      });
      setIsStatusOpen(false);
    }
  };

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (selectedOrder) {
      deleteOrder(selectedOrder.id);
      toast({
        title: 'Order cancelled',
        description: `Order ${selectedOrder.id} has been cancelled.`,
      });
      setIsDeleteOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Orders"
        description="Manage customer orders and track shipments"
      />

      <DataTable
        columns={columns}
        data={orders}
        searchKey="customerName"
        searchPlaceholder="Search by customer name..."
        filterOptions={[
          { label: 'Pending', value: 'pending' },
          { label: 'Processing', value: 'processing' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
        ]}
      />

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl animate-scale-in">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                  <StatusBadge status={selectedOrder.paymentStatus} />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">Order Items</p>
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left text-sm font-medium">Product</th>
                        <th className="p-3 text-left text-sm font-medium">Quantity</th>
                        <th className="p-3 text-left text-sm font-medium">Price</th>
                        <th className="p-3 text-left text-sm font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="p-3 text-sm">{item.productName}</td>
                          <td className="p-3 text-sm">{item.quantity}</td>
                          <td className="p-3 text-sm">{formatCurrency(item.price)}</td>
                          <td className="p-3 text-sm font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/30">
                        <td colSpan={3} className="p-3 text-right font-medium">
                          Total
                        </td>
                        <td className="p-3 font-bold">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <div>
                <StatusBadge status={selectedOrder?.status || 'pending'} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as Order['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Cancel Order"
        description={`Are you sure you want to cancel order "${selectedOrder?.id}"? This action cannot be undone.`}
        confirmLabel="Cancel Order"
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
