import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const AnalyticsTab = () => {
  const stats = {
    totalViews: 127,
    uniqueVisitors: 89,
    avgViewTime: '2:34',
    daysActive: 12
  };

  const recentViews = [
    { date: '12.12.2024 14:30', city: 'Москва', device: 'iPhone 14', duration: '3:45' },
    { date: '12.12.2024 12:15', city: 'Санкт-Петербург', device: 'Samsung Galaxy', duration: '2:20' },
    { date: '11.12.2024 18:45', city: 'Казань', device: 'MacBook Pro', duration: '4:12' },
    { date: '11.12.2024 15:30', city: 'Екатеринбург', device: 'iPad Air', duration: '1:55' },
    { date: '10.12.2024 20:10', city: 'Новосибирск', device: 'Xiaomi Redmi', duration: '3:20' },
    { date: '10.12.2024 16:00', city: 'Москва', device: 'iPhone 13', duration: '2:40' },
    { date: '09.12.2024 11:30', city: 'Краснодар', device: 'Samsung S23', duration: '5:15' },
    { date: '09.12.2024 09:20', city: 'Самара', device: 'Honor 50', duration: '1:30' },
    { date: '08.12.2024 17:45', city: 'Нижний Новгород', device: 'iPhone 15', duration: '3:00' },
    { date: '08.12.2024 14:10', city: 'Челябинск', device: 'Realme GT', duration: '2:10' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Eye" className="text-gold" size={18} />
              Всего просмотров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">за всё время</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Users" className="text-gold" size={18} />
              Уникальные посетители
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{stats.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground mt-1">уникальных визитов</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Clock" className="text-gold" size={18} />
              Среднее время
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{stats.avgViewTime}</div>
            <p className="text-xs text-muted-foreground mt-1">на визитке</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Calendar" className="text-gold" size={18} />
              Дней активности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{stats.daysActive}</div>
            <p className="text-xs text-muted-foreground mt-1">дней использования</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" className="text-gold" size={24} />
            История просмотров
          </CardTitle>
          <CardDescription>
            Последние 10 просмотров вашей визитки
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentViews.map((view, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-gold/10 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <Icon name="Smartphone" className="text-gold" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{view.device}</p>
                    <p className="text-xs text-muted-foreground">{view.city}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{view.duration}</p>
                  <p className="text-xs text-muted-foreground">{view.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
