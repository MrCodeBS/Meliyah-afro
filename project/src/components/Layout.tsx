import { ReactNode } from 'react';
import NavBar from './NavBar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Meliyah afro-shop. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}