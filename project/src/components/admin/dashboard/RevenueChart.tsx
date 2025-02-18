'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDashboard } from '@/lib/supabase/hooks/useAdminDashboard';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function RevenueChart() {
  const { data: metrics } = useAdminDashboard('month');

  const chartData = metrics?.revenueByPackage.map((item) => ({
    name: item.packageName,
    value: item.revenue,
  })) || [];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Umsatzentwicklung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={(value) => format(new Date(value), 'dd.MM', { locale: de })}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => format(new Date(label), 'dd.MM.yyyy', { locale: de })}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}