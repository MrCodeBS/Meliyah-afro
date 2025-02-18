'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/sonner';
import { BookingProvider } from '@/contexts/BookingContext';
import { UserProvider } from '@/contexts/UserContext';
import ClientLayout from '@/components/ClientLayout';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <BookingProvider>
            <ClientLayout showNavbar={!isAdminRoute} showFooter={!isAdminRoute}>
              {children}
              <Toaster />
            </ClientLayout>
          </BookingProvider>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}