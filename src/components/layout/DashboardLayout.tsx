import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <TopNav />
      <main className="ml-64 pt-16 transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
