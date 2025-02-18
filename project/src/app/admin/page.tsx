'use client';

import DashboardMetrics from '@/components/admin/dashboard/DashboardMetrics';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import RecentBookings from '@/components/admin/dashboard/RecentBookings';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6">
        <DashboardMetrics />
        <RevenueChart />
        <RecentBookings />
      </div>
    </div>
  );
}