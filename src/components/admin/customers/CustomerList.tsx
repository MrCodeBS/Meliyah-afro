'use client';

import { useState, useEffect } from 'react';
import { customersApi } from '@/lib/supabase/api/customers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import CustomerDetailsDialog from './CustomerDetailsDialog';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Search, SortAsc, SortDesc } from 'lucide-react';

export default function CustomerList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await customersApi.getAll();
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      return aValue > bValue ? modifier : -modifier;
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('customers')}</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchCustomers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('name')}
                    className="font-medium"
                  >
                    {t('name')}
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </th>
                <th className="p-4 text-left">{t('email')}</th>
                <th className="p-4 text-right">{t('totalSpent')}</th>
                <th className="p-4 text-right">{t('bookingsCount')}</th>
                <th className="p-4 text-right">{t('lastBooking')}</th>
                <th className="p-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCustomers.map((customer) => (
                <tr key={customer.id} className="border-b">
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4 text-right">
                    {formatCurrency(customer.bookings?.reduce((sum: number, b: any) => sum + b.total_price, 0) || 0)}
                  </td>
                  <td className="p-4 text-right">
                    {customer.bookings?.length || 0}
                  </td>
                  <td className="p-4 text-right">
                    {customer.bookings?.[0] 
                      ? format(new Date(customer.bookings[0].date), 'dd.MM.yyyy')
                      : '-'
                    }
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      {t('details')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
      />
    </Card>
  );
}