```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { bookingsApi } from '@/lib/supabase/api/bookings';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Search, Calendar, Clock, Package, User, CreditCard } from 'lucide-react';
import BookingDetailsDialog from './BookingDetailsDialog';
import { Badge } from '@/components/ui/badge';

export default function BookingList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await bookingsApi.getAll();
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: t('pending') },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: t('confirmed') },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: t('cancelled') },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', label: t('completed') }
    };

    const variant = variants[status as keyof typeof variants] || variants.PENDING;

    return (
      <Badge className={`${variant.bg} ${variant.text}`}>
        {variant.label}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.package?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('bookings')}</CardTitle>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchBookings')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="CONFIRMED">{t('confirmed')}</SelectItem>
              <SelectItem value="PENDING">{t('pending')}</SelectItem>
              <SelectItem value="CANCELLED">{t('cancelled')}</SelectItem>
              <SelectItem value="COMPLETED">{t('completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">{t('customer')}</th>
                  <th className="p-4 text-left">{t('package')}</th>
                  <th className="p-4 text-left">{t('dateTime')}</th>
                  <th className="p-4 text-right">{t('price')}</th>
                  <th className="p-4 text-center">{t('status')}</th>
                  <th className="p-4 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{booking.user?.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {booking.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{booking.package?.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(booking.date), 'PPP', { locale: de })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">
                            {formatCurrency(booking.total_price)}
                          </span>
                        </div>
                        {booking.payment_status && (
                          <span className="text-sm text-muted-foreground">
                            {t(booking.payment_status.toLowerCase())}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {t('details')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>

      <BookingDetailsDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
        onStatusChange={fetchBookings}
      />
    </Card>
  );
}
```