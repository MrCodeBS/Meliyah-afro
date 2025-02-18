import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CheckCircle2, Home } from 'lucide-react';
import Link from 'next/link';

export default function BookingConfirmation() {
  const router = useRouter();
  const { state, dispatch } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... rest of submit logic remains the same ...

    try {
      // ... existing booking logic ...
      
      // Show success state
      setIsSuccess(true);
      
      // Reset booking state
      dispatch({ type: 'RESET_BOOKING' });

    } catch (error) {
      console.error('Booking confirmation error:', error);
      toast.error(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      >
        <Card className="max-w-lg w-full">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Buchung erfolgreich!</h2>
            <p className="text-muted-foreground mb-8">
              Vielen Dank für Ihre Buchung. Eine Bestätigung wurde an {formData.email} gesendet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" passHref>
                <Button 
                  variant="default" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    // Ensure proper state reset
                    dispatch({ type: 'RESET_BOOKING' });
                  }}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Zurück zur Startseite
                </Button>
              </Link>
              
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => window.print()}
              >
                Buchung drucken
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative" // Changed from fixed to relative
    >
      <Card>
        {/* ... rest of the form content remains the same ... */}
      </Card>
    </motion.div>
  );
}