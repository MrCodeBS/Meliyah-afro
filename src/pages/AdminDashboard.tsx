import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooking } from '@/contexts/BookingContext';
import ProductManagement from './ProductManagement';
import PackageManagement from './PackageManagement';
import CustomerSection from './CustomerSection';
import MarketingSection from './MarketingSection';
import {
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Mail,
  MessageSquare,
  Settings,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { de } from 'date-fns/locale';
import { useMetricsComparison } from '@/lib/hooks/useMetricsComparison';
import { useRevenueTimeline } from '@/lib/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function AdminDashboard() {
  const { state } = useBooking();
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  // Fetch metrics with comparisons
  const appointmentsMetrics = useMetricsComparison('bookings', selectedPeriod);
  const customersMetrics = useMetricsComparison('customers', 'month');
  const revenueMetrics = useMetricsComparison('revenue', selectedPeriod);
  const emailMetrics = useMetricsComparison('emailRate', 'week');

  // Fetch revenue timeline data
  const { data: revenueData, isLoading: isLoadingRevenue, error: revenueError } = useRevenueTimeline(
    'month',
    format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd'),
    format(new Date(), 'yyyy-MM-dd')
  );

  const filteredBookings = state.bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const matchesFilter = 
      (appointmentFilter === 'today' && isToday(bookingDate)) ||
      (appointmentFilter === 'week' && isThisWeek(bookingDate)) ||
      (appointmentFilter === 'month' && isThisMonth(bookingDate)) ||
      appointmentFilter === 'all';

    const matchesSearch = 
      booking.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => setShowAiAssistant(!showAiAssistant)}>
          <HelpCircle className="h-4 w-4 mr-2" />
          KI-Assistent
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Termine Heute</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentsMetrics.current}</div>
            {appointmentsMetrics.percentageChange !== 0 && (
              <p className="text-xs text-muted-foreground">
                {appointmentsMetrics.percentageChange > 0 ? '+' : ''}
                {appointmentsMetrics.percentageChange.toFixed(1)}% gegenüber gestern
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kunden Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersMetrics.current}</div>
            {customersMetrics.percentageChange !== 0 && (
              <p className="text-xs text-muted-foreground">
                {customersMetrics.percentageChange > 0 ? '+' : ''}
                {customersMetrics.percentageChange.toFixed(1)}% diesen Monat
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umsatz Heute</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              CHF {revenueMetrics.current.toFixed(2)}
            </div>
            {revenueMetrics.percentageChange !== 0 && (
              <p className="text-xs text-muted-foreground">
                {revenueMetrics.percentageChange > 0 ? '+' : ''}
                {revenueMetrics.percentageChange.toFixed(1)}% gegenüber letzter Woche
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email-Öffnungsrate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailMetrics.current}%</div>
            {emailMetrics.percentageChange !== 0 && (
              <p className="text-xs text-muted-foreground">
                {emailMetrics.percentageChange > 0 ? '+' : ''}
                {emailMetrics.percentageChange.toFixed(1)}% diese Woche
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="appointments">Termine</TabsTrigger>
          <TabsTrigger value="products">Produkte</TabsTrigger>
          <TabsTrigger value="packages">Pakete</TabsTrigger>
          <TabsTrigger value="customers">Kunden</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Umsatzentwicklung</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoadingRevenue ? (
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : revenueError ? (
                <ErrorMessage 
                  title="Fehler beim Laden der Umsatzdaten"
                  message={revenueError.message} 
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), 'dd.MM', { locale: de })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => format(new Date(date), 'dd.MM.yyyy', { locale: de })}
                      formatter={(value: number) => [`CHF ${value.toFixed(2)}`, 'Umsatz']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Termine</CardTitle>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-[200px]"
                    />
                  </div>
                  <Select
                    value={appointmentFilter}
                    onValueChange={setAppointmentFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Heute</SelectItem>
                      <SelectItem value="week">Diese Woche</SelectItem>
                      <SelectItem value="month">Dieser Monat</SelectItem>
                      <SelectItem value="all">Alle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Keine Termine gefunden
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <div>
                          <p className="font-medium">{booking.customerId}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.date), 'PPP', { locale: de })}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{booking.packageId}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.time} Uhr
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">
                            CHF {booking.totalPrice.toFixed(2)}
                          </p>
                          {booking.products && booking.products.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {booking.products.length} Produkte
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            getStatusColor(booking.status)
                          }`}>
                            {booking.status}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            getStatusColor(booking.paymentStatus)
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="packages">
          <PackageManagement />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerSection />
        </TabsContent>

        <TabsContent value="marketing">
          <MarketingSection />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Einstellungen</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Einstellungen kommen bald...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Assistant */}
      {showAiAssistant && (
        <div className="fixed bottom-4 right-4 w-96 bg-card rounded-lg shadow-lg border p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              KI-Assistent
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAiAssistant(false)}
            >
              ✕
            </Button>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Wie kann ich Ihnen helfen?
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Stellen Sie eine Frage..."
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <Button size="sm">Senden</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}