import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useData } from '@/contexts/DataContext';
import { InventoryItem } from '@/types';
import { warehouses } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { MoreHorizontal, Pencil, Trash2, PackagePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const inventorySchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  warehouse: z.string().min(1, 'Warehouse is required'),
  quantity: z.coerce.number().min(0, 'Quantity must be non-negative'),
  minStock: z.coerce.number().min(0, 'Min stock must be non-negative'),
  maxStock: z.coerce.number().min(1, 'Max stock must be at least 1'),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export default function InventoryPage() {
  const { inventory, products, addInventory, updateInventory, deleteInventory } = useData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editMode, setEditMode] = useState(false);

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      productName: '',
      warehouse: '',
      quantity: 0,
      minStock: 0,
      maxStock: 100,
    },
  });

  const getStockStatus = (item: InventoryItem): InventoryItem['status'] => {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.minStock) return 'low-stock';
    return 'in-stock';
  };

  const getStockPercentage = (item: InventoryItem) => {
    return Math.min((item.quantity / item.maxStock) * 100, 100);
  };

  const columns: Column<InventoryItem>[] = [
    {
      key: 'productName',
      header: 'Product',
      render: (item) => <span className="font-medium">{item.productName}</span>,
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
    },
    {
      key: 'quantity',
      header: 'Stock Level',
      render: (item) => (
        <div className="w-40 space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.quantity}</span>
            <span className="text-muted-foreground">/ {item.maxStock}</span>
          </div>
          <Progress value={getStockPercentage(item)} className="h-2" />
        </div>
      ),
    },
    {
      key: 'minStock',
      header: 'Min Stock',
    },
    {
      key: 'lastRestocked',
      header: 'Last Restocked',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{formatDate(item.lastRestocked)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={getStockStatus(item)} />,
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
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              Update Stock
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(item)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleCreate = () => {
    setEditMode(false);
    setSelectedItem(null);
    form.reset({
      productName: '',
      warehouse: '',
      quantity: 0,
      minStock: 0,
      maxStock: 100,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditMode(true);
    setSelectedItem(item);
    form.reset({
      productName: item.productName,
      warehouse: item.warehouse,
      quantity: item.quantity,
      minStock: item.minStock,
      maxStock: item.maxStock,
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteInventory(selectedItem.id);
      toast({
        title: 'Inventory deleted',
        description: `${selectedItem.productName} has been removed from inventory.`,
      });
      setIsDeleteOpen(false);
    }
  };

  const onSubmit = (data: InventoryFormData) => {
    const status = data.quantity === 0 ? 'out-of-stock' : data.quantity <= data.minStock ? 'low-stock' : 'in-stock';
    
    if (editMode && selectedItem) {
      updateInventory(selectedItem.id, {
        ...data,
        status,
        lastRestocked: new Date(),
      });
      toast({
        title: 'Inventory updated',
        description: `${data.productName} stock has been updated.`,
      });
    } else {
      addInventory({
        productId: Date.now().toString(),
        productName: data.productName,
        warehouse: data.warehouse,
        quantity: data.quantity,
        minStock: data.minStock,
        maxStock: data.maxStock,
        lastRestocked: new Date(),
        status,
      });
      toast({
        title: 'Inventory added',
        description: `${data.productName} has been added to inventory.`,
      });
    }
    setIsFormOpen(false);
    form.reset();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Inventory"
        description="Track and manage stock levels across warehouses"
        actionLabel="Add Stock Entry"
        actionIcon={<PackagePlus className="h-4 w-4" />}
        onAction={handleCreate}
      />

      <DataTable
        columns={columns}
        data={inventory}
        searchKey="productName"
        searchPlaceholder="Search inventory..."
        filterOptions={warehouses.map((w) => ({ label: w.split(' - ')[0], value: w }))}
      />

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg animate-scale-in">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Update Stock' : 'Add Stock Entry'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={editMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.name}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warehouse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse} value={warehouse}>
                            {warehouse}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editMode ? 'Update Stock' : 'Add Entry'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Inventory Entry"
        description={`Are you sure you want to delete "${selectedItem?.productName}" from inventory? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
