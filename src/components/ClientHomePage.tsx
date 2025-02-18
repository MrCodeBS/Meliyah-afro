'use client';

import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import ImageCarousel from './ImageCarousel';
import MapSection from './MapSection';
import ReviewsSection from './ReviewsSection';
import PackagesSection from './PackagesSection';

export default function ClientHomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto px-4" // Reduced space between sections
    >
      <HeroSection />
      <ImageCarousel />
      <PackagesSection />
      <MapSection />
      <ReviewsSection />
    </motion.div>
  );
}