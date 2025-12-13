import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import VideoDemo from './VideoDemo';

const HelpCenter = () => {
  const [videoDemoOpen, setVideoDemoOpen] = useState(false);
  const guides = {
    beginners: [
      {
        title: 'Как создать свою первую визитку',
        duration: '5 мин',
        difficulty: 'Легко',
        steps: [
          'Зарегистрируйтесь или войдите в систему',
          'Выберите шаблон для вашей профессии',
          'Заполните контактные данные',
          'Загрузите фото и логотип',
          'Опубликуйте и поделитесь ссылкой'
        ]
      },
      {
        title: 'Как добавить QR-код в визитку',
        duration: '2 мин',
        difficulty: 'Легко',
        steps: [
          'Откройте раздел "Визитка" в личном кабинете',
          'QR-код генерируется автоматически',
          'Нажмите "Скачать vCard"',
          'Распечатайте или используйте в мобильном',
          'Сканируйте для быстрого добавления контакта'
        ]
      },
      {
        title: 'Как поделиться визиткой',
        duration: '3 мин',
        difficulty: 'Легко',
        steps: [
          'Скопируйте короткую ссылку visitka.site/ваш-ник',
          'Используйте кнопки шаринга в соцсети',
          'Отправьте QR-код для сканирования',
          'Добавьте ссылку в подпись email',
          'Разместите на своём сайте или в профилях'
        ]
      }
    ],
    business: [
      {
        title: 'Создание визиток для команды',
        duration: '10 мин',
        difficulty: 'Средне',
        steps: [
          'Подключите тариф "Бизнес" или "Корпоративный"',
          'Создайте единый дизайн компании',
          'Пригласите сотрудников по email',
          'Настройте права доступа для администраторов',
          'Отслеживайте статистику по команде'
        ]
      },
      {
        title: 'Настройка корпоративного стиля',
        duration: '15 мин',
        difficulty: 'Средне',
        steps: [
          'Загрузите логотип компании',
          'Выберите фирменные цвета в палитре',
          'Настройте шрифты и стиль карточек',
          'Создайте шаблон для всех сотрудников',
          'Примените дизайн ко всем визиткам'
        ]
      },
      {
        title: 'Аналитика и отчётность',
        duration: '8 мин',
        difficulty: 'Средне',
        steps: [
          'Откройте раздел "Аналитика" в кабинете',
          'Просмотрите общую статистику команды',
          'Экспортируйте отчёты в Excel/CSV',
          'Настройте еженедельные email-отчёты',
          'Анализируйте эффективность сотрудников'
        ]
      }
    ],
    advanced: [
      {
        title: 'Интеграция с LinkedIn и HH.ru',
        duration: '12 мин',
        difficulty: 'Сложно',
        steps: [
          'Перейдите в раздел "Интеграции"',
          'Подключите LinkedIn через OAuth',
          'Импортируйте опыт работы и навыки',
          'Добавьте ссылку на резюме HH.ru',
          'Настройте автосинхронизацию данных'
        ]
      },
      {
        title: 'Настройка автоматизации через API',
        duration: '20 мин',
        difficulty: 'Сложно',
        steps: [
          'Получите API ключ в настройках аккаунта',
          'Изучите документацию API endpoints',
          'Настройте webhook для уведомлений',
          'Интегрируйте с вашей CRM системой',
          'Тестируйте автоматическое обновление данных'
        ]
      },
      {
        title: 'Кастомизация дизайна через CSS',
        duration: '25 мин',
        difficulty: 'Сложно',
        steps: [
          'Включите режим разработчика в настройках',
          'Добавьте собственные CSS стили',
          'Настройте анимации и переходы',
          'Проверьте адаптивность на разных устройствах',
          'Опубликуйте кастомный дизайн'
        ]
      }
    ]
  };

  const useCases = [
    {
      title: 'Для начинающих предпринимателей',
      icon: 'Rocket',
      color: 'text-blue-500',
      description: 'Создайте профессиональную визитку за 5 минут и начните привлекать клиентов',
      benefits: [
        'Бесплатный старт без ограничений',
        'Готовые шаблоны для разных ниш',
        'QR-код для быстрого обмена контактами',
        'Аналитика для отслеживания интереса'
      ]
    },
    {
      title: 'Для действующих сотрудников',
      icon: 'Users',
      color: 'text-green-500',
      description: 'Упростите нетворкинг и обмен контактами с коллегами и партнёрами',
      benefits: [
        'Быстрое добавление в телефонную книгу',
        'Связь с LinkedIn и резюме',
        'История взаимодействий с контактами',
        'Интеграция с корпоративной системой'
      ]
    },
    {
      title: 'Для корпораций',
      icon: 'Building',
      color: 'text-purple-500',
      description: 'Единый стандарт визиток для всей компании с централизованным управлением',
      benefits: [
        'Безлимитное количество сотрудников',
        'Единый корпоративный стиль',
        'Панель администратора для управления',
        'Интеграция с Active Directory',
        'Детальная аналитика по отделам',
        'SLA и персональная поддержка'
      ]
    }
  ];

  const faqs = [
    {
      question: 'Можно ли использовать бесплатно?',
      answer: 'Да! Базовый тариф полностью бесплатный и включает все основные функции: создание визитки, QR-код, шаринг в соцсети и базовую аналитику.'
    },
    {
      question: 'Как добавить визитку в телефонную книгу?',
      answer: 'Просто отсканируйте QR-код на визитке или нажмите кнопку "Скачать vCard". Контакт автоматически добавится в телефон.'
    },
    {
      question: 'Можно ли изменить дизайн визитки?',
      answer: 'Да, вы можете выбрать из 6 готовых тем или настроить свой дизайн. Premium подписка открывает доступ к кастомным шрифтам и цветам.'
    },
    {
      question: 'Как работает реферальная программа?',
      answer: 'Приглашайте друзей по реферальной ссылке. За каждого зарегистрировавшегося вы получаете +7 дней Premium тарифа бесплатно!'
    },
    {
      question: 'Есть ли корпоративные скидки?',
      answer: 'Да! При подключении от 50 визиток действует скидка 30%. При 100+ визитках — индивидуальные условия и персональный менеджер.'
    },
    {
      question: 'Безопасны ли мои данные?',
      answer: 'Да, все данные шифруются SSL, серверы находятся в России. Мы соблюдаем требования 152-ФЗ о персональных данных.'
    }
  ];

  return (
    <section id="help" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/20">База знаний</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Обучающие материалы
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Всё, что нужно знать для эффективного использования визиток
          </p>
          <Button 
            onClick={() => setVideoDemoOpen(true)}
            className="gradient-bg text-white shadow-lg hover:opacity-90"
            size="lg"
          >
            <Icon name="PlayCircle" className="mr-2" size={20} />
            Смотреть видео-инструкции
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {useCases.map((useCase, idx) => (
            <Card key={idx} className="border-gold/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name={useCase.icon as any} className={useCase.color} size={24} />
                </div>
                <CardTitle>{useCase.title}</CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Icon name="Check" className="text-gold mt-0.5 flex-shrink-0" size={16} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-gold/20 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BookOpen" className="text-gold" size={24} />
              Пошаговые руководства
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="beginners" className="w-full">
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="beginners">
                  <Icon name="Star" className="mr-2" size={16} />
                  Новичкам
                </TabsTrigger>
                <TabsTrigger value="business">
                  <Icon name="Briefcase" className="mr-2" size={16} />
                  Бизнесу
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Icon name="Zap" className="mr-2" size={16} />
                  Продвинутым
                </TabsTrigger>
              </TabsList>

              {Object.entries(guides).map(([key, items]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  {items.map((guide, idx) => (
                    <Card key={idx} className="border-border">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{guide.title}</CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <Icon name="Clock" className="mr-1" size={12} />
                                {guide.duration}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {guide.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {guide.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                              <span className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center text-gold font-semibold text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="HelpCircle" className="text-gold" size={24} />
              Частые вопросы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-semibold flex items-start gap-2">
                    <Icon name="MessageCircle" className="text-gold mt-1 flex-shrink-0" size={16} />
                    {faq.question}
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <VideoDemo open={videoDemoOpen} onOpenChange={setVideoDemoOpen} />
    </section>
  );
};

export default HelpCenter;