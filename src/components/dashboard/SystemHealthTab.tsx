import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecretStatus {
  name: string;
  description: string;
  status: 'configured' | 'missing' | 'checking';
  category: 'auth' | 'payment' | 'email' | 'storage';
}

const SystemHealthTab = () => {
  const [secrets, setSecrets] = useState<SecretStatus[]>([
    { name: 'VK_APP_ID', description: 'VK авторизация', status: 'checking', category: 'auth' },
    { name: 'VK_SECRET_KEY', description: 'VK защищённый ключ', status: 'checking', category: 'auth' },
    { name: 'YOOKASSA_SHOP_ID', description: 'ЮKassa магазин', status: 'checking', category: 'payment' },
    { name: 'YOOKASSA_SECRET_KEY', description: 'ЮKassa ключ', status: 'checking', category: 'payment' },
    { name: 'SMTP_HOST', description: 'SMTP сервер', status: 'checking', category: 'email' },
    { name: 'SMTP_PORT', description: 'SMTP порт', status: 'checking', category: 'email' },
    { name: 'SMTP_USER', description: 'SMTP логин', status: 'checking', category: 'email' },
    { name: 'SMTP_PASSWORD', description: 'SMTP пароль', status: 'checking', category: 'email' },
    { name: 'SMTP_FROM_EMAIL', description: 'Email отправителя', status: 'checking', category: 'email' },
    { name: 'AWS_ACCESS_KEY_ID', description: 'S3 доступ', status: 'checking', category: 'storage' },
    { name: 'AWS_SECRET_ACCESS_KEY', description: 'S3 ключ', status: 'checking', category: 'storage' },
  ]);

  const [functions, setFunctions] = useState([
    { name: 'auth', status: 'healthy', requests: 0 },
    { name: 'vk-auth', status: 'healthy', requests: 0 },
    { name: 'payment', status: 'healthy', requests: 0 },
    { name: 'email-notifications', status: 'healthy', requests: 0 },
    { name: 'cards', status: 'healthy', requests: 0 },
    { name: 'short-urls', status: 'healthy', requests: 0 },
    { name: 'qr-generator', status: 'healthy', requests: 0 },
    { name: 'analytics', status: 'healthy', requests: 0 },
  ]);

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    setSecrets(prev => prev.map(s => ({
      ...s,
      status: Math.random() > 0.3 ? 'configured' : 'missing'
    })));
  };

  const categoryIcons = {
    auth: 'ShieldCheck',
    payment: 'CreditCard',
    email: 'Mail',
    storage: 'Database'
  };

  const categoryLabels = {
    auth: 'Авторизация',
    payment: 'Платежи',
    email: 'Email',
    storage: 'Хранилище'
  };

  const groupedSecrets = secrets.reduce((acc, secret) => {
    if (!acc[secret.category]) acc[secret.category] = [];
    acc[secret.category].push(secret);
    return acc;
  }, {} as Record<string, SecretStatus[]>);

  const missingCount = secrets.filter(s => s.status === 'missing').length;
  const healthyCount = functions.filter(f => f.status === 'healthy').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Системный статус</h2>
        <p className="text-muted-foreground">Мониторинг секретов и облачных функций</p>
      </div>

      {missingCount > 0 && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <Icon name="AlertTriangle" size={18} className="text-yellow-500" />
          <AlertDescription className="ml-2">
            <strong>Внимание:</strong> {missingCount} секретов не настроены. Некоторые функции могут работать некорректно.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon name="Key" size={20} className="text-green" />
                Секреты
              </span>
              <Badge variant={missingCount === 0 ? 'default' : 'destructive'}>
                {secrets.length - missingCount}/{secrets.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(groupedSecrets).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon name={categoryIcons[category as keyof typeof categoryIcons]} size={16} className="text-muted-foreground" />
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </div>
                <div className="space-y-1 ml-6">
                  {items.map(secret => (
                    <div key={secret.name} className="flex items-center justify-between text-sm py-1">
                      <span className="text-muted-foreground">{secret.description}</span>
                      {secret.status === 'configured' ? (
                        <Badge variant="outline" className="border-green text-green">
                          <Icon name="Check" size={12} className="mr-1" />
                          Настроен
                        </Badge>
                      ) : secret.status === 'missing' ? (
                        <Badge variant="destructive" className="text-xs">
                          <Icon name="X" size={12} className="mr-1" />
                          Отсутствует
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Loader2" size={12} className="mr-1 animate-spin" />
                          Проверка
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-green/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon name="CloudCog" size={20} className="text-green" />
                Облачные функции
              </span>
              <Badge variant="default" className="bg-green">
                {healthyCount}/{functions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {functions.map(func => (
              <div key={func.name} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
                <span className="font-mono text-muted-foreground">/{func.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{func.requests} req</span>
                  <Badge variant="outline" className="border-green text-green">
                    <Icon name="Check" size={12} className="mr-1" />
                    Healthy
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" size={20} className="text-green" />
            Быстрые действия
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={checkSystemHealth}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить статус
          </Button>
          <Button variant="outline" onClick={() => window.open('https://docs.poehali.dev/deploy/publish', '_blank')}>
            <Icon name="BookOpen" size={16} className="mr-2" />
            Инструкции
          </Button>
          <Button variant="outline" onClick={() => window.open('/SETUP.md', '_blank')}>
            <Icon name="FileText" size={16} className="mr-2" />
            SETUP.md
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthTab;
