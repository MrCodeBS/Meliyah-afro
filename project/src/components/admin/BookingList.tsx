'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
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
import { 
  Check, 
  X, 
  Clock,
  Calendar,
  User,
  Package,
  CreditCard
} from 'lucide-react';

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    fetchBookings();
    // Subscribe to realtime changes
    const channel = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings' 
      }, handleBookingChange)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleBookingChange = (payload) => {
    console.log('Booking changed:', payload);
    fetchBookings();
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(name, email, phone),
          package:packages(name, price)
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Fehler beim Laden der Buchungen');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Buchung ${status === 'CONFIRMED' ? 'bestätigt' : 'storniert'}`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Fehler beim Aktualisieren der Buchung');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Ausstehend' },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Bestätigt' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Storniert' },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Abgeschlossen' }
    };

    const variant = variants[status] || variants.PENDING;

    return (
      <Badge className={`${variant.bg} ${variant.text}`}>
        {variant.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum & Zeit</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Preis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(booking.date), 'P', { locale: de })}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {booking.time}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {booking.user.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    {booking.package.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    CHF {booking.total_price}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {booking.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCancelDialog(true);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Buchung stornieren</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diese Buchung wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                updateBookingStatus(selectedBooking.id, 'CANCELLED');
                setShowCancelDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Stornieren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}