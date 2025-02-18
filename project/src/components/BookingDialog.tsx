'use client';

import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import StaffSelection from './booking/StaffSelection';
import DateSelection from './booking/DateSelection';
import TimeSelection from './booking/TimeSelection';
import BookingConfirmation from './booking/BookingConfirmation';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, title: 'Mitarbeiter wählen' },
  { id: 2, title: 'Termin wählen' },
  { id: 3, title: 'Zeit wählen' },
  { id: 4, title: 'Bestätigung' },
];

export default function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { state, dispatch } = useBooking();

  const progress = (currentStep / steps.length) * 100;

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(1);
    dispatch({ type: 'RESET_BOOKING' });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StaffSelection onNext={() => setCurrentStep(2)} />;
      case 2:
        return <DateSelection onNext={() => setCurrentStep(3)} />;
      case 3:
        return <TimeSelection onNext={() => setCurrentStep(4)} />;
      case 4:
        return <BookingConfirmation onComplete={handleClose} />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentStepTitle = () => {
    return steps[currentStep - 1]?.title || 'Termin buchen';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-3xl h-[90vh] overflow-y-auto"
        style={{ position: 'fixed', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <DialogHeader>
          <DialogTitle>{getCurrentStepTitle()}</DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-8 sticky top-0 bg-background pt-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-sm ${
                  step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentStep > 1 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
        )}

        {/* Selected Package Info */}
        {state.selectedPackage && (
          <div className="mb-6 p-4 bg-accent rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{state.selectedPackage.name}</h3>
                <p className="text-sm text-muted-foreground">
                  CHF {state.selectedPackage.price}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="py-4">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}