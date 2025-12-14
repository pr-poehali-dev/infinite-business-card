import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const SubscriptionNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
    
    const interval = setInterval(() => {
      loadNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const saved = localStorage.getItem('subscription_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (e) {
        console.error('Failed to load notifications:', e);
      }
    }
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('subscription_notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('subscription_notifications', JSON.stringify(updated));
    toast.success('Все уведомления отмечены как прочитанные');
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('subscription_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('subscription_notifications');
    toast.success('Все уведомления удалены');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return { name: 'AlertTriangle', color: 'text-orange' };
      case 'error': return { name: 'XCircle', color: 'text-red-500' };
      case 'info': return { name: 'Info', color: 'text-blue' };
      case 'success': return { name: 'CheckCircle', color: 'text-green' };
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return 'Предупреждение';
      case 'error': return 'Ошибка';
      case 'info': return 'Информация';
      case 'success': return 'Успех';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Bell" size={20} />
              Уведомления подписки
              {unreadCount > 0 && (
                <Badge className="gradient-bg text-white">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Важные события и оповещения о вашей подписке
            </CardDescription>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Icon name="CheckCheck" className="mr-2" size={14} />
                  Прочитать все
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Icon name="Trash2" size={14} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-2">Нет уведомлений</p>
            <p className="text-xs text-muted-foreground">
              Здесь будут отображаться важные события подписки
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-all ${
                    notification.read ? 'bg-muted/20' : 'bg-background border-l-4'
                  } ${
                    notification.type === 'warning' ? 'border-l-orange' :
                    notification.type === 'error' ? 'border-l-red-500' :
                    notification.type === 'info' ? 'border-l-blue' :
                    'border-l-green'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon name={icon.name as any} size={20} className={`${icon.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{notification.title}</p>
                            {!notification.read && (
                              <Badge variant="outline" className="text-xs">
                                Новое
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs mb-2">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Icon name="Check" size={14} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {new Date(notification.timestamp).toLocaleString('ru-RU')}
                      </p>
                      {notification.action && (
                        <Button 
                          size="sm" 
                          onClick={notification.action.onClick}
                          className="gradient-bg text-white"
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 bg-blue/5 border border-blue/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={16} className="text-blue flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Настройка уведомлений</p>
              <p>
                Вы будете получать уведомления о приближении лимитов (80%), 
                исчерпании лимитов и окончании подписки (за 7 дней). 
                Настроить уведомления можно в разделе <strong>Настройки → Уведомления</strong>.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionNotifications;
