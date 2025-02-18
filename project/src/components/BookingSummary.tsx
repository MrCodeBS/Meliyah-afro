import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { MapPin, Calendar, Clock, Package, ShoppingBag } from 'lucide-react';
import { salonInfo } from '@/data/mockData';
import { Separator } from '@/components/ui/separator';

export default function BookingSummary() {
  const { state } = useBooking();

  const calculateSubtotal = () => {
    const packagePrice = state.selectedPackage?.price || 0;
    const productsTotal = state.selectedProducts.reduce((sum, product) => sum + product.price, 0);
    return packagePrice + productsTotal;
  };

  const TAX_RATE = 0.077; // 7.7% Swiss VAT
  const subtotal = calculateSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buchungsübersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Appointment Details */}
        {state.selectedDate && state.selectedTime && (
          <div className="space-y-2">
            <h3 className="font-medium">Termin</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(state.selectedDate, 'PPP', { locale: de })}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{state.selectedTime} Uhr</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{salonInfo.address}</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Package */}
        {state.selectedPackage && (
          <div className="space-y-2">
            <h3 className="font-medium">Paket</h3>
            <div className="p-4 bg-accent/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">{state.selectedPackage.name}</span>
                </div>
                <span>CHF {state.selectedPackage.price.toFixed(2)}</span>
              </div>
              {state.selectedPackage.services.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {state.selectedPackage.services.map(service => (
                    <li key={service.id} className="flex justify-between">
                      <span>{service.name}</span>
                      <span>CHF {service.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Selected Products */}
        {state.selectedProducts.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Produkte</h3>
            <div className="space-y-2">
              {state.selectedProducts.map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                  </div>
                  <span>CHF {product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Zwischensumme</span>
            <span>CHF {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>MwSt. (7.7%)</span>
            <span>CHF {tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium text-lg">
            <span>Gesamtbetrag</span>
            <span>CHF {total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}