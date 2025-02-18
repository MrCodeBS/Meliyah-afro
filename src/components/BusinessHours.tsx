import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';
import { salonInfo } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function BusinessHours() {
  const isOpen = (day: string) => {
    const hours = salonInfo.openingHours[day];
    return hours.open !== 'Geschlossen';
  };

  const formatTime = (time: string) => {
    return time === 'Geschlossen' ? time : `${time} Uhr`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Öffnungszeiten
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {Object.entries(salonInfo.openingHours).map(([day, hours]) => (
            <li 
              key={day} 
              className={cn(
                "flex justify-between items-center p-2 rounded-md transition-colors",
                !isOpen(day) && "bg-red-50 dark:bg-red-950",
                isOpen(day) && "hover:bg-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <Clock className={cn(
                  "h-4 w-4",
                  !isOpen(day) && "text-red-500",
                  isOpen(day) && "text-green-500"
                )} />
                <span className="font-medium">{day}</span>
              </div>
              <span className={cn(
                "text-muted-foreground",
                !isOpen(day) && "text-red-500 font-medium"
              )}>
                {hours.open === 'Geschlossen' 
                  ? 'Geschlossen'
                  : `${formatTime(hours.open)} - ${formatTime(hours.close)}`
                }
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}