import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { Toaster } from 'sonner';
import { supabase } from '@/lib/supabase/client';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check admin token
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <AdminLayout>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            {/* Add other admin routes here */}
          </Routes>
        </AdminLayout>
      ) : (
        <Routes>
          <Route 
            path="*" 
            element={<AdminLogin onLogin={() => setIsAuthenticated(true)} />} 
          />
        </Routes>
      )}
      <Toaster />
    </BrowserRouter>
  );
}
