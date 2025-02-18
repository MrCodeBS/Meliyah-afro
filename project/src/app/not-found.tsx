'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <FileQuestion className="h-24 w-24 text-muted-foreground mx-auto" />
        <h1 className="text-4xl font-bold">404 - Seite nicht gefunden</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Die angeforderte Seite konnte nicht gefunden werden. Bitte überprüfen Sie die URL oder kehren Sie zur Startseite zurück.
        </p>
        <Link href="/">
          <Button size="lg" className="mt-4">
            Zurück zur Startseite
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}