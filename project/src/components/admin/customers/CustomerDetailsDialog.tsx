'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customersApi } from '@/lib/supabase/api/customers';
import { useTranslation } from '@/hooks/useTranslation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface CustomerDetailsDialogProps {
  customer: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerDetailsDialog({
  customer,
  open,
  onOpenChange
}: CustomerDetailsDialogProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (customer?.id && open) {
      fetchCustomerStats();
    }
  }, [customer?.id, open]);

  const fetchCustomerStats = async () => {
    try {
      setLoading(true);
      const data = await customersApi.getCustomerStats(customer.id);
      setStats(data);
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('customerDetails')}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('customerInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('name')}</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('email')}</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('phone')}</p>
                    <p className="font-medium">{customer.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('memberSince')}</p>
                    <p className="font-medium">
                      {format(new Date(customer.created_at), 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {stats && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('bookingStats')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('totalSpent')}</p>
                        <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('bookingsCount')}</p>
                        <p className="text-2xl font-bold">{stats.bookingsCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('averageBooking')}</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(stats.bookingsCount ? stats.totalSpent / stats.bookingsCount : 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {customer.bookings?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('bookingHistory')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {customer.bookings.map((booking: any) => (
                          <div 
                            key={booking.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{booking.package.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.date), 'dd.MM.yyyy')}
                              </p>
                            </div>
                            <p className="font-medium">
                              {formatCurrency(booking.total_price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}