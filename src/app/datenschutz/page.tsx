'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salonInfo } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Datenschutzerklärung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">1. Datenschutz auf einen Blick</h2>
              <p>Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten innerhalb unseres Onlineangebotes auf.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">2. Verantwortlicher</h2>
              <p>{salonInfo.name}</p>
              <p>{salonInfo.address}</p>
              <p>Tel: {salonInfo.phone}</p>
              <p>E-Mail: {salonInfo.email}</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">3. Ihre Rechte</h2>
              <p>Sie haben folgende Rechte:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Recht auf Auskunft</li>
                <li>Recht auf Berichtigung</li>
                <li>Recht auf Löschung</li>
                <li>Recht auf Einschränkung der Verarbeitung</li>
                <li>Recht auf Datenübertragbarkeit</li>
                <li>Widerspruchsrecht</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">4. Erhebung personenbezogener Daten</h2>
              <p>Wir erheben und verarbeiten folgende Daten:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Name, Vorname</li>
                <li>Kontaktdaten (Telefon, E-Mail)</li>
                <li>Buchungshistorie</li>
                <li>Zahlungsinformationen</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">5. Zweck der Datenverarbeitung</h2>
              <p>Ihre Daten werden verarbeitet für:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Terminverwaltung</li>
                <li>Kundenservice</li>
                <li>Buchungsabwicklung</li>
                <li>Marketing (nur mit Ihrer Einwilligung)</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">6. Datensicherheit</h2>
              <p>Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen Manipulation, Verlust oder unberechtigten Zugriff zu schützen.</p>
            </section>

            <p className="text-sm text-muted-foreground mt-8">
              Stand: {new Date().toLocaleDateString('de-CH')}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}