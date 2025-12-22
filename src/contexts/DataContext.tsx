import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Order, Supplier, InventoryItem } from '@/types';
import { mockProducts, mockOrders, mockSuppliers, mockInventory } from '@/data/mockData';

interface DataContextType {
  products: Product[];
  orders: Order[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addInventory: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventory: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventory: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  // Product CRUD
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...product, updatedAt: new Date() } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Order CRUD
  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrder = (id: string, order: Partial<Order>) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, ...order, updatedAt: new Date() } : o))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Supplier CRUD
  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    setSuppliers(prev =>
      prev.map(s => (s.id === id ? { ...s, ...supplier } : s))
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // Inventory CRUD
  const addInventory = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventory = (id: string, item: Partial<InventoryItem>) => {
    setInventory(prev =>
      prev.map(i => (i.id === id ? { ...i, ...item } : i))
    );
  };

  const deleteInventory = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        suppliers,
        inventory,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        deleteOrder,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addInventory,
        updateInventory,
        deleteInventory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
