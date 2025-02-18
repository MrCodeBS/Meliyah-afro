import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import BookingPage from '@/pages/BookingPage';
import ProductsPage from '@/pages/ProductsPage';
import { BookingProvider } from '@/contexts/BookingContext';
import { UserProvider } from '@/contexts/UserContext';
import { CartProvider } from '@/contexts/CartContext';
import { SyncProvider } from '@/contexts/SyncContext';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <UserProvider>
          <CartProvider>
            <SyncProvider>
              <BookingProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                  </Routes>
                </Layout>
                <Toaster />
              </BookingProvider>
            </SyncProvider>
          </CartProvider>
        </UserProvider>
      </Router>
    </QueryClientProvider>
  );
}