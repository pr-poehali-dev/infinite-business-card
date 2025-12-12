import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Анна Смирнова',
    rating: 5,
    date: '15 дек 2024',
    text: 'Отличный специалист! Быстро откликнулась, все сделала профессионально. Визитка получилась стильной и информативной.',
    verified: true
  },
  {
    id: '2',
    author: 'Дмитрий К.',
    rating: 5,
    date: '10 дек 2024',
    text: 'Рекомендую! Приятно было работать, все чётко и в срок.',
    verified: true
  },
  {
    id: '3',
    author: 'Мария Петрова',
    rating: 4,
    date: '5 дек 2024',
    text: 'Хорошая работа, небольшие правки были, но в целом всё отлично.',
    verified: false
  }
];

const Reviews = () => {
  const [reviews] = useState<Review[]>(mockReviews);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gold mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Icon 
                  key={star} 
                  name={star <= Math.round(averageRating) ? "Star" : "Star"} 
                  className={star <= Math.round(averageRating) ? "fill-gold text-gold" : "text-muted"}
                  size={20}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {reviews.length} {reviews.length === 1 ? 'отзыв' : reviews.length < 5 ? 'отзыва' : 'отзывов'}
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{star}</span>
                  <Icon name="Star" className="fill-gold text-gold" size={14} />
                </div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gold h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground w-8">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Оставить отзыв</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Ваша оценка</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Icon 
                    name="Star" 
                    className={
                      star <= (hoveredRating || rating)
                        ? "fill-gold text-gold" 
                        : "text-muted-foreground"
                    }
                    size={32}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ваш отзыв</label>
            <Textarea
              placeholder="Расскажите о вашем опыте работы..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            className="bg-gold text-black hover:bg-gold/90"
            disabled={!rating || !newReview.trim()}
          >
            <Icon name="Send" size={16} className="mr-2" />
            Отправить отзыв
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Все отзывы</h3>
        {reviews.map(review => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-semibold text-gold">
                  {review.author[0]}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{review.author}</span>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <Icon name="CheckCircle2" size={12} />
                      Подтверждён
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Icon 
                        key={star} 
                        name="Star" 
                        className={star <= review.rating ? "fill-gold text-gold" : "text-muted"}
                        size={14}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                
                <p className="text-foreground leading-relaxed">
                  {review.text}
                </p>
                
                <div className="flex gap-4 mt-3">
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Icon name="ThumbsUp" size={14} />
                    Полезно
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Icon name="MessageCircle" size={14} />
                    Ответить
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
          Загрузить ещё отзывы
        </Button>
      </div>
    </div>
  );
};

export default Reviews;
