'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  LayoutDashboard,
  Calendar,
  Package,
  Users,
  Settings,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="px-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push('/admin')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push('/admin/bookings')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Buchungen
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push('/admin/packages')}
          >
            <Package className="mr-2 h-4 w-4" />
            Pakete
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push('/admin/customers')}
          >
            <Users className="mr-2 h-4 w-4" />
            Kunden
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push('/admin/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </Button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-primary/10 hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}