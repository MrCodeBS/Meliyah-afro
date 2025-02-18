import { useBooking } from '@/contexts/BookingContext';
import { packages } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PackageSelectionProps {
  onNext: () => void;
}

export default function PackageSelection({ onNext }: PackageSelectionProps) {
  const { state, dispatch } = useBooking();

  const handleSelect = (pkg: Package) => {
    dispatch({ type: 'SELECT_PACKAGE', payload: pkg });
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Wählen Sie ein Paket</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              state.selectedPackage?.id === pkg.id && "ring-2 ring-primary"
            )}
            onClick={() => handleSelect(pkg)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-semibold">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>
                <span className="text-base font-semibold">
                  CHF {pkg.price}
                </span>
              </div>
              {pkg.discountPercentage > 0 && (
                <span className="inline-block text-xs text-primary font-medium mb-2">
                  {pkg.discountPercentage}% Rabatt
                </span>
              )}
              <ul className="space-y-1">
                {pkg.services.map((service) => (
                  <li key={service.id} className="flex items-center gap-1 text-sm">
                    <Scissors className="h-3 w-3 text-foreground shrink-0" />
                    <span>{service.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}