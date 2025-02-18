import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react';
import { salonInfo } from '@/data/mockData';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BusinessInfo() {
  const [isHoursOpen, setIsHoursOpen] = useState(false);

  return (
    <Card className="bg-background">
      <CardContent className="p-3">
        {/* Contact Info */}
        <div className="space-y-2">
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(salonInfo.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs">{salonInfo.address}</span>
          </a>

          <a 
            href={`tel:${salonInfo.phone}`}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs">{salonInfo.phone}</span>
          </a>

          <a 
            href={`mailto:${salonInfo.email}`}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs">{salonInfo.email}</span>
          </a>
        </div>

        {/* Opening Hours Accordion */}
        <div className="mt-3">
          <button
            onClick={() => setIsHoursOpen(!isHoursOpen)}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-medium">Öffnungszeiten</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              isHoursOpen && "transform rotate-180"
            )} />
          </button>

          <AnimatePresence>
            {isHoursOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-2 py-1 space-y-1">
                  {Object.entries(salonInfo.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{day}</span>
                      <span className={cn(
                        "font-medium",
                        hours.open === 'Geschlossen' && "text-destructive"
                      )}>
                        {hours.open === 'Geschlossen' 
                          ? 'Geschlossen'
                          : `${hours.open} - ${hours.close}`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}