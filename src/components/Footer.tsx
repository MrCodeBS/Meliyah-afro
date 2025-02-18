'use client';

import Link from 'next/link';
import { Facebook, Instagram, Music } from 'lucide-react';
import { salonInfo } from '@/data/mockData';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="text-center">
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <address className="not-italic text-muted-foreground">
              <p>{salonInfo.address}</p>
              <p>Tel: {salonInfo.phone}</p>
              <p>Email: {salonInfo.email}</p>
            </address>
          </div>

          {/* Social Links */}
          <div className="text-center">
            <h3 className="font-semibold mb-4">Social Media</h3>
            <div className="flex flex-col items-center space-y-2">
              <a 
                href="https://www.facebook.com/meliyahafroshopofficiel/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/meliyahafro/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.tiktok.com/@meliyaafroshop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Music className="h-4 w-4" />
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="text-center">
            <h3 className="font-semibold mb-4">Rechtliches</h3>
            <div className="flex flex-col items-center space-y-2">
              <Link 
                href="/impressum"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Impressum
              </Link>
              <Link 
                href="/datenschutz"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Datenschutzerklärung
              </Link>
              <Link 
                href="/agb"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                AGB
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          © {currentYear} {salonInfo.name}. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}