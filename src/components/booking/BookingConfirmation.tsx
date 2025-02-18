import { useState, useEffect } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';
import { CheckCircle2, Calendar, Clock, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingConfirmation() {
  const { state, dispatch } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    acceptTerms: false,
    marketingConsent: false
  });

  // Save form data to context when it changes
  useEffect(() => {
    if (formData.name && formData.email) {
      dispatch({
        type: 'SET_BOOKING_DATA',
        payload: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          marketingConsent: formData.marketingConsent
        }
      });
    }
  }, [formData, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting booking with state:', {
      package: state.selectedPackage,
      date: state.selectedDate,
      time: state.selectedTime,
      formData
    });

    // Early validation
    if (!formData.acceptTerms) {
      toast.error('Bitte akzeptieren Sie die AGB');
      return;
    }

    const packageId = state.selectedPackage?.id;
    if (!packageId) {
      toast.error('Bitte wählen Sie ein Paket aus');
      return;
    }

    if (!state.selectedDate) {
      toast.error('Bitte wählen Sie ein Datum aus');
      return;
    }

    if (!state.selectedTime) {
      toast.error('Bitte wählen Sie eine Uhrzeit aus');
      return;
    }

    if (!formData.name || !formData.email) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      toast.error('Bitte wählen Sie ein Paket, Datum und Uhrzeit');
      return;
    }

    setIsProcessing(true);

    try {
      // Format date as YYYY-MM-DD
      const formattedDate = format(state.selectedDate!, 'yyyy-MM-dd');
      
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        package_id: packageId,
        date: formattedDate,
        time: state.selectedTime,
        total_price: state.selectedPackage.price,
        marketing_consent: formData.marketingConsent
      };

      console.log('Sending booking request with data:', bookingData);

      // Validate package ID format
      if (!bookingData.package_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
        throw new Error('Ungültiges Paket-Format');
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      console.log('Received booking response:', result);

      if (!result.success) {
        const errorMessage = result.error || 'Buchung konnte nicht erstellt werden';
        console.error('Booking failed:', errorMessage);
        
        if (result.details) {
          // Handle validation errors
          const validationErrors = result.details.map((err: any) => err.message).join(', ');
          throw new Error(`Validierungsfehler: ${validationErrors}`);
        }
        
        throw new Error(errorMessage);
      }

      setIsSuccess(true);
      toast.success('Buchung erfolgreich erstellt!');

      if (result.emailSent) {
        toast.success('Bestätigungsemail wurde gesendet');
      } else {
        toast.warning('Bestätigungsemail konnte nicht gesendet werden. Wir werden Sie kontaktieren.');
      }

      dispatch({ type: 'RESET_BOOKING' });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
      console.error('Booking error:', error);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Buchung erfolgreich!</h2>
        <p className="text-muted-foreground mb-8">
          Vielen Dank für Ihre Buchung. Eine Bestätigung wurde an {formData.email} gesendet.
        </p>

        <Card className="mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{state.selectedPackage?.name}</p>
                <p className="text-sm text-muted-foreground">
                  CHF {state.selectedPackage?.price.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <p>{format(state.selectedDate!, 'PPP', { locale: de })}</p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <p>{state.selectedTime} Uhr</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-x-4">
          <Button 
            variant="outline" 
            onClick={() => {
              dispatch({ type: 'RESET_BOOKING' });
            }}
          >
            Neue Buchung
          </Button>
          <Button
            onClick={() => {
              window.print();
            }}
          >
            Buchung drucken
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Buchung bestätigen</h2>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, acceptTerms: checked as boolean })
                }
              />
              <Label htmlFor="terms" className="text-sm">
                Ich akzeptiere die AGB *
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                checked={formData.marketingConsent}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, marketingConsent: checked as boolean })
                }
              />
              <Label htmlFor="marketing" className="text-sm">
                Ich möchte Newsletter erhalten
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isProcessing || !formData.acceptTerms}
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Wird verarbeitet...
                </>
              ) : (
                'Buchung abschließen'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}