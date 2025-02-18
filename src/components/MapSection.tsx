'use client';

import { Card, CardContent } from '@/components/ui/card';
import { salonInfo } from '@/data/mockData';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MapSection() {
  return (
    <section id="contact" className="space-y-6">
      <h2 className="text-3xl font-bold">Standort</h2>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 gap-0">
            {/* Map Container */}
            <div className="md:col-span-2 relative">
              <motion.div 
                className="aspect-[16/9] md:aspect-auto md:h-full w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2769.1234567890123!2d8.7595294!3d47.5678604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a93bb8e5d2bbf%3A0xfb933de73c24e39f!2sMeliyah+afro-shop!5e0!3m2!1sen!2sch!4v1600000000000"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Meliyah afro-shop location"
                />
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="p-6 bg-accent/50">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Kontaktdaten</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-muted-foreground">{salonInfo.address}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Telefon</p>
                        <a 
                          href={`tel:${salonInfo.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {salonInfo.phone}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a 
                          href={`mailto:${salonInfo.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {salonInfo.email}
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Öffnungszeiten</h3>
                  <ul className="space-y-2">
                    {Object.entries(salonInfo.openingHours).map(([day, hours]) => (
                      <li key={day} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{day}</span>
                        <span className={hours.open === 'Geschlossen' ? 'text-destructive' : ''}>
                          {hours.open === 'Geschlossen' 
                            ? 'Geschlossen'
                            : `${hours.open} - ${hours.close}`
                          }
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}