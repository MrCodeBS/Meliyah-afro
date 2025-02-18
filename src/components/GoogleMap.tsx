import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GoogleMapProps {
  className?: string;
}

export default function GoogleMap({ className }: GoogleMapProps) {
  return (
    <motion.div 
      className={cn("map-container", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <iframe
        width="800"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2769.1234567890123!2d8.7595294!3d47.5678604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a93bb8e5d2bbf%3A0xfb933de73c24e39f!2sMeliyah+afro-shop!5e0!3m2!1sen!2sch!4v1600000000000"
        title="Meliyah afro-shop location"
        aria-label="Map showing Meliyah afro-shop location"
      />
    </motion.div>
  );
}