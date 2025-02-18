import { Package } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBooking } from '@/contexts/BookingContext';
import BookingDialog from './BookingDialog';
import { useState } from 'react';

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const [showBooking, setShowBooking] = useState(false);
  const { dispatch } = useBooking();

  const handleBooking = () => {
    dispatch({ type: 'SELECT_PACKAGE', payload: pkg });
    setShowBooking(true);
  };

  return (
    <>
      <Card className="h-full flex flex-col transition-all hover:shadow-lg">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
              </div>
              <span className="text-lg font-bold">CHF {pkg.price}</span>
            </div>
            {pkg.discountPercentage > 0 && (
              <span className="inline-block text-xs text-primary font-medium mb-2">
                {pkg.discountPercentage}% Rabatt
              </span>
            )}
            <ul className="space-y-1 mb-3">
              {pkg.services.map((service) => (
                <li key={service.id} className="flex items-center gap-1 text-sm">
                  <Scissors className="h-3 w-3 text-foreground shrink-0" />
                  <span>{service.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button 
            className="w-full mt-auto"
            onClick={handleBooking}
          >
            Termin buchen
          </Button>
        </CardContent>
      </Card>

      <BookingDialog 
        open={showBooking} 
        onOpenChange={setShowBooking}
      />
    </>
  );
}