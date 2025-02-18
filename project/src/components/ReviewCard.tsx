'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import ImageLightbox from './ImageLightbox';

interface ReviewCardProps {
  review: {
    id: string;
    author_name: string;
    rating: number;
    text: string;
    time: string;
    profile_photo_url?: string;
    photos?: string[];
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'fill-primary text-primary' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const handleImageLoad = (url: string) => {
    setLoadedImages(prev => [...prev, url]);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="group hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.profile_photo_url} alt={review.author_name} />
                <AvatarFallback>{review.author_name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-medium truncate">{review.author_name}</h3>
                    <div className="flex mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <time className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(review.time), 'PP', { locale: de })}
                  </time>
                </div>

                <AnimatePresence initial={false}>
                  <motion.div
                    initial="collapsed"
                    animate={isExpanded ? "expanded" : "collapsed"}
                    variants={{
                      expanded: { height: "auto", opacity: 1 },
                      collapsed: { height: "3rem", opacity: 1 }
                    }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 relative overflow-hidden cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <p className="text-muted-foreground">{review.text}</p>
                    
                    {!isExpanded && review.text.length > 150 && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
                    )}
                  </motion.div>
                </AnimatePresence>

                {review.photos && review.photos.length > 0 && (
                  <motion.div
                    initial="collapsed"
                    animate={isExpanded ? "expanded" : "collapsed"}
                    variants={{
                      expanded: { height: "auto", opacity: 1 },
                      collapsed: { height: 0, opacity: 0 }
                    }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 grid grid-cols-2 gap-2 overflow-hidden"
                  >
                    {review.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden group cursor-pointer"
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            loadedImages.includes(photo) ? 'opacity-100' : 'opacity-0'
                          } group-hover:scale-105`}
                          loading="lazy"
                          onLoad={() => handleImageLoad(photo)}
                        />
                        {!loadedImages.includes(photo) && (
                          <div className="absolute inset-0 bg-accent animate-pulse" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {(review.text.length > 150 || (review.photos && review.photos.length > 0)) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Weniger anzeigen
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Mehr anzeigen
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {review.photos && (
        <ImageLightbox
          images={review.photos}
          initialIndex={selectedImageIndex || 0}
          open={selectedImageIndex !== null}
          onOpenChange={(open) => !open && setSelectedImageIndex(null)}
        />
      )}
    </>
  );
}