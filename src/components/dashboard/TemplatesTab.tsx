import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  fields: string[];
  isPremium: boolean;
}

interface TemplatesTabProps {
  onApplyTemplate: (template: Template) => void;
}

const TemplatesTab = ({ onApplyTemplate }: TemplatesTabProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: Template[] = [
    {
      id: 'entrepreneur',
      name: 'Предприниматель',
      category: 'business',
      description: 'Для основателей стартапов и владельцев бизнеса',
      icon: 'Briefcase',
      fields: ['ИП/ООО', 'Направление бизнеса', 'Сайт', 'Соцсети', 'Pitch deck'],
      isPremium: false
    },
    {
      id: 'sales',
      name: 'Менеджер по продажам',
      category: 'business',
      description: 'Для специалистов по продажам и развитию бизнеса',
      icon: 'TrendingUp',
      fields: ['Компания', 'Продукты/услуги', 'WhatsApp', 'Telegram', 'Каталог'],
      isPremium: false
    },
    {
      id: 'developer',
      name: 'Разработчик',
      category: 'tech',
      description: 'IT-специалисты, программисты, дизайнеры',
      icon: 'Code',
      fields: ['Стек технологий', 'GitHub', 'Portfolio', 'LinkedIn', 'Резюме'],
      isPremium: false
    },
    {
      id: 'freelancer',
      name: 'Фрилансер',
      category: 'creative',
      description: 'Дизайнеры, копирайтеры, маркетологи',
      icon: 'Palette',
      fields: ['Услуги', 'Портфолио', 'Прайс', 'Кейсы', 'Отзывы клиентов'],
      isPremium: false
    },
    {
      id: 'realtor',
      name: 'Риэлтор',
      category: 'business',
      description: 'Агенты по недвижимости',
      icon: 'Home',
      fields: ['Агентство', 'Район работы', 'Объекты', 'WhatsApp', 'Консультация'],
      isPremium: true
    },
    {
      id: 'lawyer',
      name: 'Юрист',
      category: 'professional',
      description: 'Адвокаты, юристы, нотариусы',
      icon: 'Scale',
      fields: ['Специализация', 'Опыт', 'Лицензии', 'Консультация', 'Кейсы'],
      isPremium: true
    },
    {
      id: 'doctor',
      name: 'Врач',
      category: 'professional',
      description: 'Медицинские специалисты',
      icon: 'Heart',
      fields: ['Специализация', 'Клиника', 'Стаж', 'Запись на приём', 'Услуги'],
      isPremium: true
    },
    {
      id: 'coach',
      name: 'Коуч/Тренер',
      category: 'creative',
      description: 'Бизнес-коучи, фитнес-тренеры',
      icon: 'Trophy',
      fields: ['Направление', 'Программы', 'Сертификаты', 'Отзывы', 'Консультация'],
      isPremium: true
    },
    {
      id: 'photographer',
      name: 'Фотограф',
      category: 'creative',
      description: 'Свадебные, коммерческие, студийные',
      icon: 'Camera',
      fields: ['Жанры съёмки', 'Портфолио', 'Прайс', 'Instagram', 'Бронирование'],
      isPremium: false
    },
    {
      id: 'restaurant',
      name: 'Ресторан/Кафе',
      category: 'business',
      description: 'Заведения общественного питания',
      icon: 'UtensilsCrossed',
      fields: ['Меню', 'Адрес', 'Часы работы', 'Доставка', '2GIS'],
      isPremium: true
    },
    {
      id: 'beauty',
      name: 'Мастер красоты',
      category: 'creative',
      description: 'Стилисты, визажисты, nail-мастера',
      icon: 'Sparkles',
      fields: ['Услуги', 'Прайс', 'Работы', 'Запись онлайн', 'Instagram'],
      isPremium: false
    },
    {
      id: 'corporate',
      name: 'Корпоративная визитка',
      category: 'business',
      description: 'Для сотрудников компаний',
      icon: 'Building',
      fields: ['Должность', 'Отдел', 'Корп. email', 'Доб. номер', 'График работы'],
      isPremium: true
    }
  ];

  const categories = [
    { id: 'all', name: 'Все', icon: 'Grid' },
    { id: 'business', name: 'Бизнес', icon: 'Briefcase' },
    { id: 'tech', name: 'IT', icon: 'Code' },
    { id: 'creative', name: 'Креатив', icon: 'Palette' },
    { id: 'professional', name: 'Профессионалы', icon: 'Award' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="LayoutTemplate" className="text-gold" size={24} />
            Шаблоны визиток
          </CardTitle>
          <CardDescription>
            Выберите готовый шаблон для вашей профессии
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === category.id ? 'bg-gold text-black hover:bg-gold/90' : 'border-gold/30'}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon name={category.icon as any} className="mr-2" size={16} />
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="border-gold/20 hover:border-gold/50 transition-all cursor-pointer hover-scale"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                      <Icon name={template.icon as any} className="text-gold" size={24} />
                    </div>
                    {template.isPremium && (
                      <Badge variant="outline" className="border-gold text-gold">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Включённые поля:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.map((field, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gold text-black hover:bg-gold/90"
                    onClick={() => onApplyTemplate(template)}
                  >
                    Применить шаблон
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatesTab;
