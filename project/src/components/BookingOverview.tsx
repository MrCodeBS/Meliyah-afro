import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { MapPin, Calendar, Clock, Package } from 'lucide-react';
import { salonInfo } from '@/data/mockData';
import { Separator } from '@/components/ui/separator';
import GoogleMap from './GoogleMap';

export default function BookingOverview() {
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buchungsübersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appointment Details */}
          {state.selectedDate && state.selectedTime && (
            <div className="space-y-4">
              <h3 className="font-medium">Termin Details</h3>
              <div className="grid gap-3">
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

          <Separator />

          {/* Selected Package */}
          {state.selectedPackage && (
            <div className="space-y-4">
              <h3 className="font-medium">Gewähltes Paket</h3>
              <div className="flex items-start justify-between p-4 bg-accent/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">{state.selectedPackage.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{state.selectedPackage.description}</p>
                </div>
                <span className="font-medium">
                  CHF {state.selectedPackage.price.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Selected Products */}
          {state.selectedProducts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Gewählte Produkte</h3>
              <div className="space-y-3">
                {state.selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">CHF {product.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Menge: 1</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Price Summary */}
          <div className="space-y-3">
            <h3 className="font-medium">Zusammenfassung</h3>
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
          </div>

          {/* Location Map */}
          <div className="space-y-4">
            <h3 className="font-medium">Standort</h3>
            <div className="rounded-lg overflow-hidden border">
              <GoogleMap address={salonInfo.address} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}