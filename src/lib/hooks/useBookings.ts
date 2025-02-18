import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Booking } from '@/types';
import { useSync } from '@/contexts/SyncContext';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.getBookings(),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: (booking: Omit<Booking, 'id'>) => api.createBooking(booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      sendUpdate({ type: 'BOOKING_UPDATED' });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking['status'] }) =>
      api.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      sendUpdate({ type: 'BOOKING_UPDATED' });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: ({ 
      id, 
      paymentStatus, 
      paymentMethod 
    }: { 
      id: string; 
      paymentStatus: Booking['paymentStatus'];
      paymentMethod?: Booking['paymentMethod'];
    }) => api.updatePaymentStatus(id, paymentStatus, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      sendUpdate({ type: 'BOOKING_UPDATED' });
    },
  });
}