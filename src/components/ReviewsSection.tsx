'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const REVIEWS = [
  {
    id: '1',
    author_name: 'Yvonne Baumgartner',
    rating: 5,
    text: 'Sehr freundliche Bedienung, kompetente Beratung. Ich komme gerne wieder.',
    time: '2024-01-15',
    profile_photo_url: 'https://lh3.googleusercontent.com/a/ACg8ocLFNtRVxXoE6tF_uJGHJ9Xv0UxC_kqz0Y_kxIAD=w36-h36-p-rp-mo-br100'
  },
  {
    id: '2',
    author_name: 'Mélanie Baumgartner',
    rating: 5,
    text: 'Super Beratung, sehr freundlich und kompetent. Tolle Produktauswahl!',
    time: '2023-12-20',
    profile_photo_url: 'https://lh3.googleusercontent.com/a/ACg8ocJHvhqX8nGhPJxGRxNjzqY9LYQQrEo_9Q9vhkWf=w36-h36-p-rp-mo-br100'
  }
];

const RATING_STATS = {
  average: 5.0,
  total: 74,
  distribution: {
    5: 70,
    4: 4,
    3: 0,
    2: 0,
    1: 0
  }
};

export default function ReviewsSection() {
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

  return (
    <section className="space-y-8 pb-16">
      <h2 className="text-3xl font-bold">Kundenbewertungen</h2>

      {/* Rating Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{RATING_STATS.average.toFixed(1)}</span>
                <span className="text-muted-foreground">von 5</span>
              </div>
              <div className="flex">{renderStars(RATING_STATS.average)}</div>
              <p className="text-sm text-muted-foreground">
                Basierend auf {RATING_STATS.total} Google Bewertungen
              </p>
            </div>

            <div className="space-y-2">
              {Object.entries(RATING_STATS.distribution)
                .reverse()
                .map(([rating, count]) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-12 text-sm">{rating} Sterne</span>
                    <Progress
                      value={(count / RATING_STATS.total) * 100}
                      className="h-2"
                    />
                    <span className="w-12 text-sm text-muted-foreground">
                      {count}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-center">
              <a 
                href="https://www.google.com/maps/place/Meliyah+afro-shop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Alle Google Bewertungen ansehen
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {REVIEWS.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.profile_photo_url} alt={review.author_name} />
                    <AvatarFallback>{review.author_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.author_name}</p>
                        <div className="flex mt-1">{renderStars(review.rating)}</div>
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {new Date(review.time).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </time>
                    </div>
                    <p className="mt-4 text-muted-foreground">{review.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator className="my-16" />
    </section>
  );
}