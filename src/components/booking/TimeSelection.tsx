'use client';

import { useBooking } from '@/contexts/BookingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TimeSelectionProps {
  onNext: () => void;
}

export default function TimeSelection({ onNext }: TimeSelectionProps) {
  const { state, dispatch } = useBooking();

  const handleSelect = (time: string) => {
    dispatch({ type: 'SELECT_TIME', payload: time });
    onNext();
  };

  const availableTimes = state.selectedEmployee?.availability[
    format(state.selectedDate!, 'EEEE', { locale: de })
  ] || [];

  const morningSlots = availableTimes.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = availableTimes.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Wählen Sie eine Uhrzeit</h2>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          {state.selectedDate ? (
            <div className="space-y-6">
              <div className="text-lg font-medium">
                {format(state.selectedDate, 'EEEE, d. MMMM yyyy', { locale: de })}
              </div>

              <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                {morningSlots.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Vormittag</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {morningSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={state.selectedTime === slot.time ? 'default' : 'outline'}
                          onClick={() => handleSelect(slot.time)}
                          disabled={!slot.available}
                          className={cn(
                            'h-14 text-base',
                            !slot.available && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <Clock className="mr-2 h-5 w-5" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {afternoonSlots.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Nachmittag</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {afternoonSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={state.selectedTime === slot.time ? 'default' : 'outline'}
                          onClick={() => handleSelect(slot.time)}
                          disabled={!slot.available}
                          className={cn(
                            'h-14 text-base',
                            !slot.available && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <Clock className="mr-2 h-5 w-5" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Bitte wählen Sie zuerst ein Datum aus
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}