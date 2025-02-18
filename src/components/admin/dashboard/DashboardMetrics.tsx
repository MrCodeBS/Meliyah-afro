'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDashboard } from '@/lib/supabase/hooks/useAdminDashboard';
import { formatCurrency } from '@/lib/utils';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardMetrics() {
  const { data: metrics, isLoading, error } = useAdminDashboard('day');

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading dashboard metrics
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Gesamtumsatz',
      value: formatCurrency(metrics?.totalRevenue || 0),
      icon: DollarSign,
      description: 'Heute',
    },
    {
      title: 'Buchungen',
      value: metrics?.totalBookings || 0,
      icon: Calendar,
      description: 'Heute',
    },
    {
      title: 'Kunden',
      value: metrics?.totalCustomers || 0,
      icon: Users,
      description: 'Aktive Kunden',
    },
    {
      title: 'Durchschnittswert',
      value: formatCurrency(metrics?.averageBookingValue || 0),
      icon: TrendingUp,
      description: 'Pro Buchung',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}