'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function AGBPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Allgemeine Geschäftsbedingungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">1. Geltungsbereich</h2>
              <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Dienstleistungen und Waren, die von Meliyah afro-shop angeboten werden.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">2. Terminvereinbarung</h2>
              <p>Die Terminvereinbarung kann persönlich, telefonisch oder über unsere Website erfolgen. Mit der Buchung eines Termins akzeptieren Sie diese AGB.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Termine können bis zu 24 Stunden vorher kostenlos storniert werden</li>
                <li>Bei späteren Absagen oder Nichterscheinen behalten wir uns vor, 50% des Behandlungspreises in Rechnung zu stellen</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">3. Preise und Zahlung</h2>
              <p>Alle Preise verstehen sich in Schweizer Franken (CHF) inklusive der gesetzlichen Mehrwertsteuer.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Die Zahlung erfolgt direkt nach der Behandlung</li>
                <li>Wir akzeptieren Barzahlung, EC-Karte, TWINT und Kreditkarten</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">4. Behandlungen</h2>
              <p>Die Dauer und der Preis der Behandlungen können je nach Haar- und Kopfhautbeschaffenheit variieren. Wir behalten uns vor, die Behandlung anzupassen.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">5. Haftung</h2>
              <p>Wir haften nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten unsererseits beruhen.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">6. Datenschutz</h2>
              <p>Ihre personenbezogenen Daten werden gemäß unserer Datenschutzerklärung behandelt.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">7. Schlussbestimmungen</h2>
              <p>Es gilt schweizerisches Recht. Gerichtsstand ist Frauenfeld.</p>
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