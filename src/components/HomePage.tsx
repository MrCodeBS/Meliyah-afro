'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors, Facebook, Instagram, Music } from 'lucide-react';
import { salonInfo } from '@/data/mockData';
import { Package, Service } from '@/types';
import ImageCarousel from './ImageCarousel';
import MapSection from './MapSection';
import ReviewsSection from './ReviewsSection';
import Link from 'next/link';

interface HomePageProps {
  initialServices: Service[] | null;
  initialPackages: Package[] | null;
}

export default function HomePage({ initialServices, initialPackages }: HomePageProps) {
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
                <Link href="/booking">
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
          {initialPackages?.map((pkg, index) => (
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
                <Link href="/booking" className="mt-6">
                  <Button className="w-full">Auswählen</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <MapSection />

      {/* Social Media Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Folgen Sie uns</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <a 
            href="https://www.facebook.com/meliyahafroshopofficiel/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg hover:text-primary transition-colors"
          >
            <Facebook className="h-6 w-6" />
            <span>Facebook</span>
          </a>
          <a 
            href="https://www.instagram.com/meliyahafro/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg hover:text-primary transition-colors"
          >
            <Instagram className="h-6 w-6" />
            <span>Instagram</span>
          </a>
          <a 
            href="https://www.tiktok.com/@meliyaafroshop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg hover:text-primary transition-colors"
          >
            <Music className="h-6 w-6" />
            <span>TikTok</span>
          </a>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Footer */}
      <footer className="border-t pt-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {salonInfo.name}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-4">
            <Link href="/impressum" className="text-sm text-muted-foreground hover:text-primary">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-sm text-muted-foreground hover:text-primary">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}