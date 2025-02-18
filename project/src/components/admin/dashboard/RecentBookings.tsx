'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDashboard } from '@/lib/supabase/hooks/useAdminDashboard';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function RecentBookings() {
  const { data: metrics } = useAdminDashboard('day');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Aktuelle Buchungen</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kunde</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Betrag</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics?.recentBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  {booking.user.name}
                  <div className="text-sm text-muted-foreground">
                    {booking.user.email}
                  </div>
                </TableCell>
                <TableCell>{booking.package.name}</TableCell>
                <TableCell>
                  {format(new Date(booking.date), 'PPP', { locale: de })}
                  <div className="text-sm text-muted-foreground">
                    {booking.time}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(booking.total_price)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}