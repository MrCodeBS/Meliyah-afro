'use client';

import { ReactNode } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { motion } from 'framer-motion';

interface ClientLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export default function ClientLayout({ 
  children, 
  showNavbar = true,
  showFooter = true 
}: ClientLayoutProps) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showNavbar && <NavBar />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </motion.div>
  );
}