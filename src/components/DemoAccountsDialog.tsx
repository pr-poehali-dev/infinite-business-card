import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface DemoAccountsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountSelect: (account: DemoAccount) => void;
}

interface DemoAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'basic' | 'pro';
  description: string;
  features: string[];
}

const DemoAccountsDialog = ({ open, onOpenChange, onAccountSelect }: DemoAccountsDialogProps) => {
  const demoAccounts: DemoAccount[] = [
    {
      id: 'free-demo',
      name: 'Анна Иванова',
      email: 'demo-free@visitka.site',
      password: 'demo123',
      plan: 'free',
      description: 'Базовые возможности для знакомства с сервисом',
      features: [
        '1 визитка',
        'Базовая статистика',
        'Стандартные шаблоны',
        'QR-код'
      ]
    },
    {
      id: 'basic-demo',
      name: 'Пётр Смирнов',
      email: 'demo-basic@visitka.site',
      password: 'demo123',
      plan: 'basic',
      description: 'Расширенный функционал для малого бизнеса',
      features: [
        '5 визиток',
        'Расширенная аналитика',
        'Все шаблоны',
        'Интеграции',
        'Приоритетная поддержка'
      ]
    },
    {
      id: 'pro-demo',
      name: 'Мария Петрова',
      email: 'demo-pro@visitka.site',
      password: 'demo123',
      plan: 'pro',
      description: 'Полный доступ ко всем премиум-возможностям',
      features: [
        'Неограниченно визиток',
        'Детальная аналитика',
        'Управление командой',
        'Белый лейбл',
        'API доступ',
        'Персональный менеджер'
      ]
    }
  ];

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-500';
      case 'basic': return 'bg-blue-500';
      case 'pro': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Бесплатный';
      case 'basic': return 'Базовый';
      case 'pro': return 'Профессиональный';
      default: return plan;
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nПароль: ${password}`);
    toast.success('Данные скопированы в буфер обмена');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Icon name="Users" className="text-blue" size={28} />
              Тестовые аккаунты
            </DialogTitle>
            <DialogDescription className="text-base">
              Выберите демо-аккаунт для тестирования разных тарифных планов
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-blue/10 border border-blue/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-medium text-blue">Как использовать:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Нажмите "Использовать аккаунт" для автоматического входа</li>
                    <li>• Или скопируйте данные и войдите вручную</li>
                    <li>• Все изменения сбрасываются каждые 24 часа</li>
                    <li>• Аккаунты доступны всем для тестирования</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoAccounts.map((account) => (
                <Card 
                  key={account.id}
                  className="relative overflow-hidden border-2 hover:border-blue/50 transition-all hover:shadow-lg"
                >
                  <div className={`h-2 ${getPlanColor(account.plan)}`} />
                  
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{account.name}</h3>
                        <Badge className={getPlanColor(account.plan)}>
                          {getPlanName(account.plan)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.description}
                      </p>
                    </div>

                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="Mail" size={14} className="text-muted-foreground" />
                        <code className="text-xs">{account.email}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Lock" size={14} className="text-muted-foreground" />
                        <code className="text-xs">{account.password}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Возможности:</p>
                      <ul className="space-y-1">
                        {account.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs">
                            <Icon name="Check" size={12} className="text-green" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          onAccountSelect(account);
                          onOpenChange(false);
                        }}
                      >
                        <Icon name="LogIn" size={16} className="mr-2" />
                        Использовать аккаунт
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => copyCredentials(account.email, account.password)}
                      >
                        <Icon name="Copy" size={16} className="mr-2" />
                        Скопировать данные
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-yellow/10 border border-yellow/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-yellow flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-yellow">Важно:</p>
                  <p className="text-muted-foreground">
                    Демо-аккаунты предназначены только для тестирования. 
                    Не используйте их для хранения реальных данных. 
                    Все данные сбрасываются автоматически.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DemoAccountsDialog;
