import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: string;
}

const StatCard = ({ icon, label, value, trend, color = 'text-gold' }: StatCardProps) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-gold/10 ${color}`}>
        <Icon name={icon} size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend.positive ? 'text-green-600' : 'text-red-600'
        }`}>
          <Icon 
            name={trend.positive ? "TrendingUp" : "TrendingDown"} 
            size={16} 
          />
          {trend.value}%
        </div>
      )}
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </Card>
);

const ReputationStats = () => {
  const stats = [
    {
      icon: 'Star',
      label: 'Средний рейтинг',
      value: '4.8',
      trend: { value: 12, positive: true }
    },
    {
      icon: 'MessageSquare',
      label: 'Всего отзывов',
      value: 127,
      trend: { value: 24, positive: true }
    },
    {
      icon: 'ThumbsUp',
      label: 'Положительные',
      value: '94%',
      trend: { value: 5, positive: true }
    },
    {
      icon: 'TrendingUp',
      label: 'Рост популярности',
      value: '+38%',
      trend: { value: 15, positive: true }
    }
  ];

  const recentActivity = [
    {
      type: 'new_review',
      author: 'Анна С.',
      action: 'оставила отзыв',
      rating: 5,
      time: '2 часа назад'
    },
    {
      type: 'helpful',
      author: 'Дмитрий К.',
      action: 'отметил отзыв полезным',
      time: '5 часов назад'
    },
    {
      type: 'new_review',
      author: 'Мария П.',
      action: 'оставила отзыв',
      rating: 4,
      time: '1 день назад'
    }
  ];

  const topReviewers = [
    { name: 'Анна Смирнова', reviews: 3, avatar: 'А', verified: true },
    { name: 'Дмитрий Ковалёв', reviews: 2, avatar: 'Д', verified: true },
    { name: 'Мария Петрова', reviews: 2, avatar: 'М', verified: false }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Последняя активность</h3>
            <Icon name="Activity" className="text-muted-foreground" size={20} />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon 
                    name={activity.type === 'new_review' ? 'Star' : 'ThumbsUp'} 
                    className="text-gold" 
                    size={14} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{activity.author}</span>
                    <span className="text-muted-foreground">{activity.action}</span>
                    {activity.rating && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(activity.rating)].map((_, i) => (
                          <Icon key={i} name="Star" className="fill-gold text-gold" size={12} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Топ рецензентов</h3>
            <Icon name="Award" className="text-muted-foreground" size={20} />
          </div>
          <div className="space-y-3">
            {topReviewers.map((reviewer, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="font-semibold text-gold">{reviewer.avatar}</span>
                  </div>
                  {reviewer.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="Check" className="text-white" size={10} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{reviewer.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {reviewer.reviews} {reviewer.reviews === 1 ? 'отзыв' : reviewer.reviews < 5 ? 'отзыва' : 'отзывов'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gold">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Распределение оценок по времени</h3>
        <div className="space-y-4">
          {['Декабрь 2024', 'Ноябрь 2024', 'Октябрь 2024'].map((month, index) => {
            const rating = [4.9, 4.7, 4.6][index];
            const count = [45, 38, 32][index];
            return (
              <div key={month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{count} отзывов</span>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" className="fill-gold text-gold" size={14} />
                      <span className="font-semibold">{rating}</span>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-300"
                    style={{ width: `${(rating / 5) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ReputationStats;
