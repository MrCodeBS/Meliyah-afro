import { useBooking } from '@/contexts/BookingContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { addDays, format, isSunday, isMonday, startOfToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateSelectionProps {
  onNext: () => void;
}

export default function DateSelection({ onNext }: DateSelectionProps) {
  const { state, dispatch } = useBooking();

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      dispatch({ type: 'SELECT_DATE', payload: date });
      onNext();
    }
  };

  const isDayUnavailable = (date: Date) => {
    return isSunday(date) || isMonday(date);
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

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Wählen Sie einen Termin</h2>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0 sm:p-4">
          <Calendar
            mode="single"
            selected={state.selectedDate}
            onSelect={handleSelect}
            locale={de}
            className="w-full border-none"
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full space-y-2",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-accent",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse",
              head_row: "flex w-full",
              head_cell: "w-[14.28%] text-center text-muted-foreground font-normal text-[0.8rem]",
              row: "flex w-full mt-1",
              cell: "w-[14.28%] text-center relative p-0",
              day: cn(
                "h-8 w-8 p-0 font-normal rounded-full",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground focus:outline-none"
              ),
              day_today: "bg-accent text-accent-foreground",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
              day_hidden: "invisible",
            }}
            modifiers={{
              booked: isDayFullyBooked,
              limited: isDayLimitedAvailability,
              unavailable: isDayUnavailable,
            }}
            modifiersStyles={{
              booked: { backgroundColor: '#FF5252', color: 'white' },
              limited: { backgroundColor: '#FFA726', color: 'white' },
              unavailable: { backgroundColor: '#E0E0E0', color: '#9E9E9E' },
            }}
            disabled={(date) => 
              date < startOfToday() || isDayUnavailable(date)
            }
            fromDate={startOfToday()}
            toDate={addDays(new Date(), 60)}
          />
        </CardContent>
      </Card>
    </div>
  );
}