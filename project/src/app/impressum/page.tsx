'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salonInfo } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Impressum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
              <p>{salonInfo.name}</p>
              <p>{salonInfo.address}</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Kontakt</h2>
              <p>Telefon: {salonInfo.phone}</p>
              <p>E-Mail: {salonInfo.email}</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Verantwortlich für den Inhalt</h2>
              <p>Geschäftsführung: [Name der Geschäftsführung]</p>
              <p>USt-IdNr: [Ihre USt-IdNr]</p>
              <p>Handelsregister: [Handelsregisternummer]</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Aufsichtsbehörde</h2>
              <p>[Zuständige Aufsichtsbehörde]</p>
              <p>[Adresse der Aufsichtsbehörde]</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Streitschlichtung</h2>
              <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr/</a></p>
              <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Haftung für Inhalte</h2>
              <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
            </section>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}