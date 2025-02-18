import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { packages, employees } from '@/data/mockData';
import { useBooking } from '@/contexts/BookingContext';
import { format, isSameDay, isToday, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { Package, Employee, TimeSlot } from '@/types';
import BookingConfirmation from '@/components/BookingConfirmation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, X } from 'lucide-react';

export default function BookingPage() {
  const { state, dispatch } = useBooking();
  const [step, setStep] = useState(1);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (state.selectedDate && state.selectedEmployee) {
      const dayName = format(state.selectedDate, 'EEEE', { locale: de });
      const times = state.selectedEmployee.availability[dayName] || [];
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  }, [state.selectedDate, state.selectedEmployee]);

  const handlePackageSelect = (pkg: Package) => {
    dispatch({ type: 'SELECT_PACKAGE', payload: pkg });
    setStep(2);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    dispatch({ type: 'SELECT_EMPLOYEE', payload: employee });
    setStep(3);
  };

  const handleDateSelect = (date: Date) => {
    dispatch({ type: 'SELECT_DATE', payload: date });
    dispatch({ type: 'SELECT_TIME', payload: null });
  };

  const handleTimeSelect = (time: string) => {
    dispatch({ type: 'SELECT_TIME', payload: time });
    setStep(5);
  };

  const isDayFullyBooked = (date: Date) => {
    if (!state.selectedEmployee) return false;
    const dayName = format(date, 'EEEE', { locale: de });
    const times = state.selectedEmployee.availability[dayName] || [];
    return times.length > 0 && times.every(slot => !slot.available);
  };

  const isDayLimitedAvailability = (date: Date) => {
    if (!state.selectedEmployee) return false;
    const dayName = format(date, 'EEEE', { locale: de });
    const times = state.selectedEmployee.availability[dayName] || [];
    const availableSlots = times.filter(slot => slot.available).length;
    return times.length > 0 && availableSlots < times.length / 2;
  };

  const renderTimeSlots = () => {
    if (!state.selectedDate) return null;

    const morningSlots = availableTimes.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour < 12;
    });
    const afternoonSlots = availableTimes.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour >= 12;
    });

    const renderSlotSection = (slots: TimeSlot[], title: string) => (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => (
            <Button
              key={slot.time}
              variant={state.selectedTime === slot.time ? 'default' : 'outline'}
              onClick={() => handleTimeSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                'w-full justify-start transition-colors duration-200',
                !slot.available && 'bg-muted text-muted-foreground cursor-not-allowed',
                state.selectedTime === slot.time && 'ring-2 ring-primary',
                slot.available && 'hover:bg-primary hover:text-primary-foreground'
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              {slot.time}
            </Button>
          ))}
        </div>
      </div>
    );

    return (
      <ScrollArea className="h-[400px] pr-4">
        {morningSlots.length > 0 && renderSlotSection(morningSlots, 'Vormittag')}
        {afternoonSlots.length > 0 && renderSlotSection(afternoonSlots, 'Nachmittag')}
      </ScrollArea>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Paket wählen', 'Mitarbeiter wählen', 'Termin wählen', 'Zeit wählen', 'Bestätigung'].map((title, index) => (
          <div
            key={title}
            className={`flex items-center ${index < step ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              index < step ? 'border-primary bg-primary text-white' : 'border-muted'
            }`}>
              {index + 1}
            </div>
            <span className="ml-2">{title}</span>
            {index < 4 && <div className="w-12 h-0.5 mx-2 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Package Selection */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                state.selectedPackage?.id === pkg.id && 'ring-2 ring-primary'
              )}
              onClick={() => handlePackageSelect(pkg)}
            >
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-2xl font-bold">
                    CHF {pkg.price}
                    {pkg.discountPercentage > 0 && (
                      <span className="ml-2 text-sm text-primary">
                        {pkg.discountPercentage}% Rabatt
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {pkg.services.map((service) => (
                      <li key={service.id}>{service.name}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Employee Selection */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <Card
              key={employee.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                state.selectedEmployee?.id === employee.id && 'ring-2 ring-primary'
              )}
              onClick={() => handleEmployeeSelect(employee)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle>{employee.name}</CardTitle>
                    <CardDescription>{employee.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{employee.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {employee.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Date and Time Selection */}
      {(step === 3 || step === 4) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Wählen Sie einen Termin</CardTitle>
              <CardDescription>
                Verfügbare Termine für {state.selectedEmployee?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={state.selectedDate || undefined}
                onSelect={(date) => date && handleDateSelect(date)}
                locale={de}
                className="rounded-md border"
                modifiers={{
                  booked: (date) => isDayFullyBooked(date),
                  limited: (date) => isDayLimitedAvailability(date),
                }}
                modifiersStyles={{
                  booked: { color: 'var(--destructive)', opacity: 0.5 },
                  limited: { color: 'var(--warning)', opacity: 0.7 },
                }}
                disabled={(date) => 
                  isDayFullyBooked(date) || 
                  date < addDays(new Date(), -1)
                }
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Verfügbare Zeiten</CardTitle>
              {state.selectedDate && (
                <CardDescription>
                  {format(state.selectedDate, 'EEEE, d. MMMM yyyy', { locale: de })}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {state.selectedDate ? (
                renderTimeSlots()
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Bitte wählen Sie zuerst ein Datum aus
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation */}
      {step === 5 && <BookingConfirmation />}

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep((prev) => prev - 1)}>
            Zurück
          </Button>
        )}
        {step < 5 && state.selectedTime && (
          <Button onClick={() => setStep((prev) => prev + 1)}>
            Weiter
          </Button>
        )}
      </div>
    </div>
  );
}