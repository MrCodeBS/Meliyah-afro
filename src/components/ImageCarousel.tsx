'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const images = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
  'https://images.unsplash.com/photo-1633681926035-ec1ac984418a?w=800',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800',
];

export default function ImageCarousel() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full mt-0"
    >
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <AspectRatio ratio={16/9}>
                  <img
                    src={image}
                    alt={`Salon image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </AspectRatio>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </motion.div>
  );
}