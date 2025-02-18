'use client';

import { packages } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PackagesSection() {
  return (
    <section id="packages" className="space-y-6">
      <h2 className="text-3xl font-bold">Unsere Pakete</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full flex flex-col transition-all hover:shadow-lg">
              <CardContent className="p-4 md:p-6 flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-[#ff8c00]">CHF {pkg.price}</h3>
                    {pkg.discountPercentage > 0 && (
                      <span className="text-sm text-[#ff8c00] font-medium">
                        {pkg.discountPercentage}% Rabatt
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg md:text-xl font-semibold mb-4">{pkg.name}</h4>
                  <p className="text-muted-foreground mb-6">{pkg.description}</p>
                  <ul className="space-y-3 mb-6">
                    {pkg.services.map((service) => (
                      <li key={service.id} className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 text-foreground shrink-0" />
                        <span>{service.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/booking" className="mt-auto">
                  <Button className="w-full">
                    Termin buchen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}