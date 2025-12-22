import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Sprout,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Products', icon: Package, path: '/products' },
  { title: 'Orders', icon: ShoppingCart, path: '/orders' },
  { title: 'Customers', icon: Users, path: '/customers' },
  { title: 'Inventory', icon: Warehouse, path: '/inventory' },
  { title: 'Suppliers', icon: Truck, path: '/suppliers' },
  { title: 'Reports', icon: BarChart3, path: '/reports' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
            <Sprout className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-sidebar-foreground">AgroDwipa</h1>
              <p className="text-xs text-sidebar-foreground/70">Store Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          const linkContent = (
            <NavLink
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow-success'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', collapsed && 'mx-auto')} />
              {!collapsed && (
                <span className="animate-fade-in font-medium">{item.title}</span>
              )}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.path}>{linkContent}</div>;
        })}
      </nav>

      {/* Collapse Button */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* Decorative element */}
      {!collapsed && (
        <div className="absolute bottom-20 left-4 right-4 rounded-xl bg-sidebar-accent/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sidebar-primary/20 p-2">
              <Leaf className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Harvest Season</p>
              <p className="text-xs text-sidebar-foreground/70">Stock up for Q4</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
