import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
            className="w-full justify-start"
            onClick={() => navigate('/')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/bookings')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/packages')}
          >
            <Package className="mr-2 h-4 w-4" />
            Packages
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/customers')}
          >
            <Users className="mr-2 h-4 w-4" />
            Customers
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
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