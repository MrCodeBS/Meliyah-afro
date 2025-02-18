import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

// Mock customer data
const mockCustomers = [
  {
    id: '1',
    name: 'Anna Müller',
    email: 'anna.mueller@example.com',
    phone: '+41 79 123 45 67',
    totalBookings: 5,
    totalSpent: 750,
    lastVisit: '2024-02-15',
    bookingHistory: [
      { date: '2024-02-15', service: 'Paket Gold', price: 180 },
      { date: '2024-01-10', service: 'Paket Silber', price: 80 },
    ],
    purchaseHistory: [
      { date: '2024-02-15', product: 'Cantu Curling Cream', price: 14.90 },
      { date: '2024-01-10', product: 'Cantu Moisturizing Cream', price: 16.90 },
    ],
  },
  // Add more mock customers as needed
];

interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  bookingHistory: Array<{ date: string; service: string; price: number; }>;
  purchaseHistory: Array<{ date: string; product: string; price: number; }>;
}

export default function CustomerSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CustomerDetails>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);

  const handleSort = (field: keyof CustomerDetails) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCustomers = [...mockCustomers]
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * modifier;
      }
      return 0;
    });

  const SortIcon = ({ field }: { field: keyof CustomerDetails }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Kunden</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email
                    <SortIcon field="email" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('totalBookings')}
                >
                  <div className="flex items-center gap-2">
                    Termine
                    <SortIcon field="totalBookings" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('totalSpent')}
                >
                  <div className="flex items-center gap-2">
                    Umsatz
                    <SortIcon field="totalSpent" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('lastVisit')}
                >
                  <div className="flex items-center gap-2">
                    Letzter Besuch
                    <SortIcon field="lastVisit" />
                  </div>
                </TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.totalBookings}</TableCell>
                  <TableCell>CHF {customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(customer.lastVisit).toLocaleDateString('de-CH')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kundendetails</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Persönliche Informationen</h3>
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {selectedCustomer.name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="text-muted-foreground">Telefon:</span> {selectedCustomer.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Statistiken</h3>
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Termine gesamt:</span> {selectedCustomer.totalBookings}</p>
                    <p><span className="text-muted-foreground">Umsatz gesamt:</span> CHF {selectedCustomer.totalSpent.toFixed(2)}</p>
                    <p><span className="text-muted-foreground">Letzter Besuch:</span> {new Date(selectedCustomer.lastVisit).toLocaleDateString('de-CH')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Buchungsverlauf</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Preis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCustomer.bookingHistory.map((booking, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(booking.date).toLocaleDateString('de-CH')}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>CHF {booking.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="font-medium mb-2">Kaufverlauf</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Produkt</TableHead>
                      <TableHead>Preis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCustomer.purchaseHistory.map((purchase, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(purchase.date).toLocaleDateString('de-CH')}</TableCell>
                        <TableCell>{purchase.product}</TableCell>
                        <TableCell>CHF {purchase.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}