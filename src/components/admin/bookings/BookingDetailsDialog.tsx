```typescript
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { bookingsApi } from '@/lib/supabase/api/bookings';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Calendar, Clock, Package, User, CreditCard, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface BookingDetailsDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: () => void;
}

export default function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
  onStatusChange
}: BookingDetailsDialogProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { t } = useTranslation();

  const handleStatusChange = async (status: string) => {
    try {
      await bookingsApi.update(booking.id, { status });
      toast.success(t('bookingUpdated'));
      onStatusChange();
      if (status === 'CANCELLED') {
        setShowCancelDialog(false);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (!booking) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('bookingDetails')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('customerInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{booking.user?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{booking.user?.email}</span>
                </div>
                {booking.user?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{booking.user.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('appointmentDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">{booking.package?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(booking.date), 'PPP', { locale: de })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">{formatCurrency(booking.total_price)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {booking.status === 'PENDING' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={() => handleStatusChange('CONFIRMED')}
                  >
                    {t('confirm')}
                  </Button>
                </>
              )}
              {booking.status === 'CONFIRMED' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={() => handleStatusChange('COMPLETED')}
                  >
                    {t('complete')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('cancelBooking')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('cancelBookingConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('back')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusChange('CANCELLED')}
              className="bg-destructive text-destructive-foreground"
            >
              {t('cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```