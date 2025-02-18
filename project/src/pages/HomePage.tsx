import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { packages, salonInfo } from '@/data/mockData';
import { MapPin, Phone, Facebook, Instagram, Music, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageCarousel from '@/components/ImageCarousel';
import MapSection from '@/components/MapSection';
import GoogleReviews from '@/components/GoogleReviews';

export default function HomePage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-lg overflow-hidden"
      >
        <div className="py-16 px-8 md:py-24 md:px-12 bg-gradient-to-r from-background via-background/95 to-background/50">
          <div className="max-w-3xl flex items-center gap-4">
            <Scissors className="h-12 w-12 text-primary" />
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                {salonInfo.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl text-muted-foreground mb-8"
              >
                {salonInfo.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Link to="/booking">
                  <Button 
                    size="lg" 
                    className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Termin buchen
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Image Carousel */}
      <ImageCarousel images={salonInfo.images} />

      {/* Packages Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Unsere Pakete</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <Card 
              key={pkg.id}
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex-1">
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
                          <Scissors className="h-4 w-4 text-primary" />
                          <span>{service.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link to="/booking" className="mt-6">
                  <Button className="w-full">Auswählen</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Kontaktdaten / Öffnungszeiten</h2>
          
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-12 gap-y-4">
            {/* Opening Hours */}
            <div className="space-y-4">
              {Object.entries(salonInfo.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{day}</span>
                  <span className="font-medium">
                    {hours.open === 'Geschlossen' 
                      ? 'Geschlossen'
                      : `${hours.open} - ${hours.close}`
                    }
                  </span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>{salonInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <a href={`tel:${salonInfo.phone}`} className="hover:text-primary">
                  {salonInfo.phone}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <a 
                href="https://www.facebook.com/meliyahafroshopofficiel/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span>Facebook öffnen</span>
              </a>
              <a 
                href="https://www.instagram.com/meliyahafro/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span>Instagram öffnen</span>
              </a>
              <a 
                href="https://www.tiktok.com/@meliyaafroshop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Music className="h-5 w-5" />
                <span>TikTok öffnen</span>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Section */}
      <MapSection />

      {/* Reviews Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Kundenbewertungen</h2>
        <GoogleReviews />
      </section>
    </div>
  );
}