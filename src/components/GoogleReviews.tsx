import { Card, CardContent } from '@/components/ui/card';
import { Star, StarHalf } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

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

export default function GoogleReviews() {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="h-4 w-4 fill-primary text-primary" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half-star" className="h-4 w-4 fill-primary text-primary" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star 
          key={`empty-star-${i}`} 
          className="h-4 w-4 text-muted-foreground"
        />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-8">
      {/* Reviews List */}
      <div className="grid gap-6 md:grid-cols-2">
        {REVIEWS.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.profile_photo_url} alt={review.author_name} />
                    <AvatarFallback>{review.author_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
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

      {/* Rating Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-4xl font-bold">{RATING_STATS.average.toFixed(1)}</div>
              <div className="flex mt-2">{renderStars(RATING_STATS.average)}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {RATING_STATS.total} Bewertungen
              </p>
            </div>
            <div className="flex-1 space-y-2">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}