'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { packages, employees } from '@/data/mockData';
import { useBooking } from '@/contexts/BookingContext';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { Package, Employee, TimeSlot } from '@/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function BookingSection() {
  const { state, dispatch } = useBooking();
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handlePackageSelect = (pkg: Package) => {
    dispatch({ type: 'SELECT_PACKAGE', payload: pkg });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && state.selectedEmployee) {
      const dayName = format(date, 'EEEE', { locale: de });
      const times = state.selectedEmployee.availability[dayName] || [];
      setAvailableTimes(times);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Staff Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-medium text-muted-foreground mb-6">
            Wählen Sie einen Mitarbeiter
          </h2>

          {state.selectedPackage && (
            <div className="mb-6 p-4 bg-accent rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{state.selectedPackage.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {state.selectedPackage.duration} Minuten
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    CHF {state.selectedPackage.price}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dispatch({ type: 'SELECT_PACKAGE', payload: null })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className={cn(
                  'p-4 rounded-lg border cursor-pointer transition-all',
                  state.selectedEmployee?.id === employee.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                )}
                onClick={() => dispatch({ type: 'SELECT_EMPLOYEE', payload: employee })}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              Hinweis: Die angezeigten Preise gelten nur als Richtwerte und können sich je nach
              Art, Dauer und Komplexität der Dienstleistung ändern.
            </p>
          </div>
        </Card>

        {/* Right Column - Calendar */}
        <Card className="p-6">
          <h2 className="text-xl font-medium text-muted-foreground mb-6">
            Wähle ein Datum und eine Uhrzeit
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium">
                {format(selectedDate || new Date(), 'MMMM yyyy', { locale: de })}
              </h3>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={de}
              className="rounded-md"
              disabled={(date) => date < addDays(new Date(), -1)}
              fromDate={new Date()}
              toDate={addDays(new Date(), 60)}
            />

            {selectedDate && (
              <ScrollArea className="h-[200px] mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={state.selectedTime === slot.time ? 'default' : 'outline'}
                      onClick={() => dispatch({ type: 'SELECT_TIME', payload: slot.time })}
                      disabled={!slot.available}
                      className={cn(
                        'w-full',
                        !slot.available && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}

            {selectedDate && availableTimes.length === 0 && (
              <div className="text-center p-4">
                <p className="text-muted-foreground">
                  Kein passendes Zeitfenster gefunden?
                </p>
                <Button variant="link" className="mt-2">
                  Klicken Sie hier, um sich auf die Warteliste einzutragen
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Wir schicken Ihnen eine E-Mail, wenn ein Platz frei wird
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Package Selection */}
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
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-muted-foreground mb-4">{pkg.description}</p>
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
                    <li key={service.id} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{service.name}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant={state.selectedPackage?.id === pkg.id ? "secondary" : "default"}
                >
                  {state.selectedPackage?.id === pkg.id ? "Ausgewählt" : "Auswählen"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}