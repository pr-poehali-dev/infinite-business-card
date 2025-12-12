import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const IntegrationsTab = () => {
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [hhConnected, setHhConnected] = useState(false);

  const integrations = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Импортируйте профиль и синхронизируйте опыт работы',
      icon: 'Linkedin',
      color: 'text-blue-600',
      connected: linkedInConnected,
      features: ['Импорт опыта работы', 'Синхронизация навыков', 'Обновление фото'],
      isPremium: false,
      onConnect: () => setLinkedInConnected(!linkedInConnected)
    },
    {
      id: 'hh',
      name: 'HeadHunter',
      description: 'Связь с резюме на hh.ru для поиска работы',
      icon: 'Briefcase',
      color: 'text-red-600',
      connected: hhConnected,
      features: ['Ссылка на резюме', 'Статус поиска работы', 'Желаемая должность'],
      isPremium: false,
      onConnect: () => setHhConnected(!hhConnected)
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Получайте уведомления о просмотрах визитки',
      icon: 'Send',
      color: 'text-blue-500',
      connected: false,
      features: ['Уведомления в реальном времени', 'Статистика в боте', 'Быстрые ответы'],
      isPremium: true,
      onConnect: () => alert('Telegram интеграция - Premium функция')
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Кнопка для связи через WhatsApp Business',
      icon: 'MessageCircle',
      color: 'text-green-600',
      connected: false,
      features: ['Быстрые ответы', 'Автоматическое приветствие', 'Метки контактов'],
      isPremium: true,
      onConnect: () => alert('WhatsApp интеграция - Premium функция')
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Запись на встречу прямо из визитки',
      icon: 'Calendar',
      color: 'text-blue-500',
      connected: false,
      features: ['Календарь доступности', 'Автобронирование', 'Напоминания'],
      isPremium: true,
      onConnect: () => alert('Calendar интеграция - Premium функция')
    },
    {
      id: 'analytics',
      name: 'Google Analytics',
      description: 'Подключите GA для детальной аналитики',
      icon: 'BarChart',
      color: 'text-orange-500',
      connected: false,
      features: ['Расширенная аналитика', 'Отслеживание конверсий', 'Цели и события'],
      isPremium: true,
      onConnect: () => alert('Analytics интеграция - Premium функция')
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Plug" className="text-gold" size={24} />
            Интеграции
          </CardTitle>
          <CardDescription>
            Подключите внешние сервисы для расширения возможностей визитки
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="border-gold/20">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                    <Icon name={integration.icon as any} className={integration.color} size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {integration.name}
                      {integration.connected && (
                        <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                          <Icon name="Check" size={12} className="mr-1" />
                          Подключено
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {integration.description}
                    </CardDescription>
                  </div>
                </div>
                {integration.isPremium && (
                  <Badge variant="outline" className="border-gold text-gold text-xs">
                    Premium
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Возможности:
                </p>
                <ul className="space-y-1">
                  {integration.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Icon name="Check" className="text-gold mt-0.5 flex-shrink-0" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={integration.connected ? 'outline' : 'default'}
                className={`w-full ${
                  integration.connected 
                    ? 'border-gold text-gold hover:bg-gold/10' 
                    : 'bg-gold text-black hover:bg-gold/90'
                }`}
                onClick={integration.onConnect}
              >
                <Icon 
                  name={integration.connected ? 'Unplug' : 'Plug'} 
                  className="mr-2" 
                  size={18} 
                />
                {integration.connected ? 'Отключить' : 'Подключить'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gold/20 bg-gold/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon name="Info" className="text-gold" size={20} />
            Нужна другая интеграция?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Напишите нам, какой сервис вы хотите подключить, и мы рассмотрим возможность добавления интеграции
          </p>
          <div className="flex gap-2">
            <Input placeholder="Например: Calendly, Notion, CRM..." />
            <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
              Отправить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTab;
