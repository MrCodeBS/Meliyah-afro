import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { salonInfo } from '@/data/mockData';

export default function OpeningHours() {
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
            <li key={day} className="flex justify-between items-center">
              <span className="font-medium min-w-[120px]">{day}</span>
              <span className="text-muted-foreground">
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