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
import { Supplier } from '@/types';
import { categories } from '@/data/mockData';
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
import { MoreHorizontal, Pencil, Trash2, Eye, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  commodities: z.array(z.string()).min(1, 'Select at least one commodity'),
  status: z.enum(['active', 'inactive']),
  rating: z.coerce.number().min(0).max(5),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [editMode, setEditMode] = useState(false);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      commodities: [],
      status: 'active',
      rating: 4,
    },
  });

  const columns: Column<Supplier>[] = [
    {
      key: 'name',
      header: 'Supplier Name',
      render: (item) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'commodities',
      header: 'Commodities',
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.commodities.slice(0, 2).map((c) => (
            <Badge key={c} variant="secondary" className="text-xs">
              {c}
            </Badge>
          ))}
          {item.commodities.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{item.commodities.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="font-medium">{item.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
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
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
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
    setSelectedSupplier(null);
    form.reset({
      name: '',
      email: '',
      phone: '',
      address: '',
      commodities: [],
      status: 'active',
      rating: 4,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditMode(true);
    setSelectedSupplier(supplier);
    form.reset({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      commodities: supplier.commodities,
      status: supplier.status,
      rating: supplier.rating,
    });
    setIsFormOpen(true);
  };

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (selectedSupplier) {
      deleteSupplier(selectedSupplier.id);
      toast({
        title: 'Supplier deleted',
        description: `${selectedSupplier.name} has been deleted successfully.`,
      });
      setIsDeleteOpen(false);
    }
  };

  const onSubmit = (data: SupplierFormData) => {
    const supplierData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      commodities: data.commodities,
      status: data.status,
      rating: data.rating,
    };
    if (editMode && selectedSupplier) {
      updateSupplier(selectedSupplier.id, supplierData);
      toast({
        title: 'Supplier updated',
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      addSupplier(supplierData as Omit<Supplier, 'id' | 'createdAt'>);
      toast({
        title: 'Supplier created',
        description: `${data.name} has been created successfully.`,
      });
    }
    setIsFormOpen(false);
    form.reset();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Suppliers"
        description="Manage your agricultural commodity suppliers"
        actionLabel="Add Supplier"
        onAction={handleCreate}
      />

      <DataTable
        columns={columns}
        data={suppliers}
        searchKey="name"
        searchPlaceholder="Search suppliers..."
        filterOptions={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
      />

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg animate-scale-in">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+62 xxx xxxx xxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commodities"
                render={() => (
                  <FormItem>
                    <FormLabel>Commodities</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((category) => (
                        <FormField
                          key={category}
                          control={form.control}
                          name="commodities"
                          render={({ field }) => (
                            <FormItem
                              key={category}
                              className="flex items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, category])
                                      : field.onChange(field.value?.filter((v) => v !== category));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{category}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          placeholder="4.0"
                          {...field}
                        />
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
                <Button type="submit">{editMode ? 'Update Supplier' : 'Create Supplier'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-lg animate-scale-in">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier Name</p>
                  <p className="font-medium">{selectedSupplier.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <StatusBadge status={selectedSupplier.status} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedSupplier.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{selectedSupplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium">{selectedSupplier.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{selectedSupplier.address}</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Commodities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSupplier.commodities.map((c) => (
                    <Badge key={c} variant="secondary">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Supplier"
        description={`Are you sure you want to delete "${selectedSupplier?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
