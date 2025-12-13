import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ReputationStats from '../ReputationStats';

interface AnalyticsData {
  total_views: number;
  unique_visitors: number;
  days_active: number;
  recent_views: Array<{ date: string; device: string; ip: string }>;
}

const AnalyticsTab = () => {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const cardId = 1;

  useEffect(() => {
    fetchAnalytics();
     
  }, []);

  const fetchAnalytics = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(
        `https://functions.poehali.dev/ea725b5f-7761-454d-9939-38a4accb72da?card_id=${cardId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId || ''
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="visits" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="visits">
          <Icon name="Eye" className="mr-2" size={16} />
          Просмотры
        </TabsTrigger>
        <TabsTrigger value="reputation">
          <Icon name="Star" className="mr-2" size={16} />
          Репутация
        </TabsTrigger>
      </TabsList>

      <TabsContent value="visits" className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-gold/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon name="Eye" className="text-gold" size={18} />
                    Всего просмотров
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gold">{stats.total_views}</div>
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
                  <div className="text-3xl font-bold text-gold">{stats.unique_visitors}</div>
                  <p className="text-xs text-muted-foreground mt-1">уникальных визитов</p>
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
                  <div className="text-3xl font-bold text-gold">{stats.days_active}</div>
                  <p className="text-xs text-muted-foreground mt-1">дней использования</p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Не удалось загрузить статистику</p>
          </div>
        )}

        {stats && stats.recent_views.length > 0 && (
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Activity" className="text-gold" size={24} />
                История просмотров
              </CardTitle>
              <CardDescription>
                Последние {stats.recent_views.length} просмотров вашей визитки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.recent_views.map((view, idx) => (
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
                        <p className="text-xs text-muted-foreground">{view.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{view.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="reputation" className="space-y-6">
        <ReputationStats />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTab;