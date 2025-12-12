import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PricingProps {
  onSelectPlan: () => void;
}

const Pricing = ({ onSelectPlan }: PricingProps) => {
  const plans = [
    {
      name: 'Базовый',
      price: '0',
      description: 'Для начала работы с цифровой визиткой',
      features: [
        'Регистрация визитки',
        'Контакты и описание организации',
        'QR-код с контактами',
        'Шеринг в мессенджеры',
        'Просмотр статистики'
      ],
      cta: 'Начать бесплатно',
      popular: false
    },
    {
      name: 'Премиум',
      price: '790',
      period: 'в год',
      description: 'AI-генерация макетов и логотипов',
      features: [
        'Всё из Базового',
        'Загрузка макетов за 79₽',
        'AI-генерация изображений',
        'Безлимитные макеты с ИИ',
        'Приоритетная поддержка',
        'Расширенная аналитика'
      ],
      cta: 'Подключить Премиум',
      popular: true
    },
    {
      name: 'Бизнес',
      price: '1990',
      period: 'в год',
      description: 'Для команд до 10 человек',
      features: [
        'Всё из Премиум',
        '10 визиток сотрудников',
        'Единый корп. стиль',
        'Командная панель управления',
        'Аналитика по команде',
        'Приоритетная поддержка'
      ],
      cta: 'Для команды',
      popular: false
    },
    {
      name: 'Корпоративный',
      price: 'от 9990',
      period: 'в год',
      description: 'Для компаний от 50 сотрудников',
      features: [
        'Всё из Бизнес',
        'Безлимитное кол-во визиток',
        'Интеграция с Active Directory',
        'API для автоматизации',
        'Единая аналитика компании',
        'Персональный менеджер',
        'SLA 99.9%'
      ],
      cta: 'Связаться с нами',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/20">Тарифы</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Выберите свой план
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            От бесплатного старта до корпоративного решения
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden hover-scale ${
                plan.popular 
                  ? 'border-gold shadow-lg shadow-gold/20' 
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gold text-black text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Популярный
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}₽</span>
                  {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon 
                        name="Check" 
                        className={`${plan.popular ? 'text-gold' : 'text-primary'} mt-0.5 flex-shrink-0`}
                        size={20}
                      />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gold text-black hover:bg-gold/90' 
                      : 'bg-primary text-primary-foreground'
                  }`}
                  onClick={onSelectPlan}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-sm">Все тарифы включают SSL-шифрование и резервное копирование данных</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;