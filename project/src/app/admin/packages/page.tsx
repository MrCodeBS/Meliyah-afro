'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, Pencil, Trash2 } from 'lucide-react';

export default function PackagesPage() {
  // Mock data - replace with Supabase query
  const packages = [
    {
      id: '1',
      name: 'Paket Gold',
      description: 'Premium Behandlung mit allen Services',
      price: 180,
      services: ['Haarschnitt', 'Färben', 'Styling'],
      discountPercentage: 10,
    },
    // Add more mock packages
  ];

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pakete</h1>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Neues Paket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Pakete</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>Rabatt</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{pkg.description}</TableCell>
                  <TableCell>{pkg.services.join(', ')}</TableCell>
                  <TableCell>CHF {pkg.price.toFixed(2)}</TableCell>
                  <TableCell>{pkg.discountPercentage}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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