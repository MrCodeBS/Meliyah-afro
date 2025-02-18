'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, User, Mail, Phone } from 'lucide-react';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with Supabase query
  const customers = [
    {
      id: '1',
      name: 'Anna Müller',
      email: 'anna.mueller@example.com',
      phone: '+41 79 123 45 67',
      totalBookings: 5,
      totalSpent: 750,
      lastVisit: new Date('2024-01-15'),
    },
    // Add more mock customers
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Kunden</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Alle Kunden</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Buchungen</TableHead>
                <TableHead>Umsatz</TableHead>
                <TableHead>Letzter Besuch</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.totalBookings}</TableCell>
                  <TableCell>CHF {customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    {customer.lastVisit.toLocaleDateString('de-CH')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}