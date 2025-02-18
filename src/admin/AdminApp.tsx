import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { Toaster } from 'sonner';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check admin token
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setIsLoading(false);
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