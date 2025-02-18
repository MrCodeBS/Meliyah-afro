import { useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PackageSelection from './booking/PackageSelection';
import StaffSelection from './booking/StaffSelection';
import DateSelection from './booking/DateSelection';
import TimeSelection from './booking/TimeSelection';
import BookingConfirmation from './booking/BookingConfirmation';
import { ChevronLeft } from 'lucide-react';

const steps = [
  { id: 1, title: 'Paket' },
  { id: 2, title: 'Mitarbeiter' },
  { id: 3, title: 'Termin' },
  { id: 4, title: 'Zeit' },
  { id: 5, title: 'Bestätigung' },
];

export default function BookingFunnel() {
  const { state } = useBooking();
  const [currentStep, setCurrentStep] = useState(1);

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PackageSelection onNext={() => setCurrentStep(2)} />;
      case 2:
        return <StaffSelection onNext={() => setCurrentStep(3)} />;
      case 3:
        return <DateSelection onNext={() => setCurrentStep(4)} />;
      case 4:
        return <TimeSelection onNext={() => setCurrentStep(5)} />;
      case 5:
        return <BookingConfirmation />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
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

      {/* Step Content */}
      <div className="py-4">
        {renderStep()}
      </div>
    </div>
  );
}