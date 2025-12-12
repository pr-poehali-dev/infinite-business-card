import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import PortfolioCard, { PortfolioProject } from '../portfolio/PortfolioCard';
import PortfolioDetailModal from '../portfolio/PortfolioDetailModal';

const PortfolioTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'Все проекты', icon: 'Grid3x3' },
    { id: 'web', name: 'Веб-разработка', icon: 'Globe' },
    { id: 'mobile', name: 'Мобильные', icon: 'Smartphone' },
    { id: 'design', name: 'Дизайн', icon: 'Palette' },
    { id: 'marketing', name: 'Маркетинг', icon: 'TrendingUp' },
    { id: 'consulting', name: 'Консалтинг', icon: 'Users' }
  ];

  const projects: PortfolioProject[] = [
    {
      id: '1',
      title: 'Корпоративный портал для ТехноГрупп',
      description: 'Разработка комплексной системы управления проектами с интеграцией CRM и документооборота для крупного IT-холдинга',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      category: 'Веб-разработка',
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      client: 'ТехноГрупп',
      completedDate: 'Октябрь 2024',
      stats: {
        duration: '4 месяца',
        budget: '₽2.5М',
        team: 5
      },
      results: [
        'Увеличение скорости обработки заявок на 40%',
        'Сокращение времени на документооборот в 3 раза',
        'Внедрение автоматизации 15 бизнес-процессов',
        'Обучение 120+ сотрудников работе с системой'
      ],
      testimonial: {
        text: 'Команда превзошла все наши ожидания. Система работает безупречно, а сотрудники быстро освоили новый инструмент. Рекомендуем как надёжного партнёра!',
        author: 'Сергей Иванов',
        position: 'CTO ТехноГрупп'
      }
    },
    {
      id: '2',
      title: 'Мобильное приложение FitTracker',
      description: 'Создание iOS и Android приложения для фитнес-трекинга с AI-персонализацией тренировок и интеграцией носимых устройств',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      category: 'Мобильные',
      tags: ['React Native', 'AI/ML', 'Firebase', 'HealthKit', 'Google Fit'],
      client: 'FitTech Startup',
      completedDate: 'Сентябрь 2024',
      stats: {
        duration: '6 месяцев',
        team: 4
      },
      results: [
        '50,000+ скачиваний за первый месяц',
        'Рейтинг 4.8⭐ в App Store и Google Play',
        'Интеграция с 8 популярными фитнес-трекерами',
        'AI-рекомендации увеличили retention на 65%'
      ],
      testimonial: {
        text: 'Благодаря профессионализму команды мы запустились на 2 недели раньше срока. Пользователи в восторге от интерфейса и функционала!',
        author: 'Анна Петрова',
        position: 'CEO FitTech'
      }
    },
    {
      id: '3',
      title: 'Редизайн бренда МебельПлюс',
      description: 'Полное переосмысление визуальной идентичности сети мебельных салонов, включая логотип, фирменный стиль и маркетинговые материалы',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
      category: 'Дизайн',
      tags: ['Брендинг', 'UI/UX', 'Figma', 'Adobe Suite', 'Презентации'],
      client: 'МебельПлюс',
      completedDate: 'Ноябрь 2024',
      stats: {
        duration: '2 месяца',
        team: 3
      },
      results: [
        'Узнаваемость бренда выросла на 45%',
        'Разработано 50+ элементов фирменного стиля',
        'Обновлены все маркетинговые материалы',
        'Создан брендбук на 80 страниц'
      ]
    },
    {
      id: '4',
      title: 'SEO-продвижение онлайн-школы',
      description: 'Комплексное продвижение образовательной платформы: технический SEO, контент-маркетинг, линкбилдинг, работа с репутацией',
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&h=600&fit=crop',
      category: 'Маркетинг',
      tags: ['SEO', 'Google Analytics', 'Контент', 'SMM', 'Email-маркетинг'],
      client: 'Skillbox Junior',
      completedDate: 'Декабрь 2024',
      stats: {
        duration: '8 месяцев',
        team: 4
      },
      results: [
        'Органический трафик +320%',
        'ТОП-10 по 150+ ключевым запросам',
        'Конверсия в заявки выросла на 180%',
        'ROI рекламных кампаний +240%'
      ],
      testimonial: {
        text: 'За 8 месяцев мы вышли на первые позиции в своей нише. Поток качественных заявок позволил нам масштабировать бизнес втрое!',
        author: 'Дмитрий Смирнов',
        position: 'Founder Skillbox Junior'
      }
    },
    {
      id: '5',
      title: 'IT-консалтинг для ФинансГрупп',
      description: 'Аудит ИТ-инфраструктуры, разработка стратегии цифровой трансформации и внедрение DevOps-практик для финансовой компании',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      category: 'Консалтинг',
      tags: ['DevOps', 'Cloud', 'Security', 'Agile', 'CI/CD'],
      client: 'ФинансГрупп',
      completedDate: 'Август 2024',
      stats: {
        duration: '3 месяца',
        team: 6
      },
      results: [
        'Оптимизация затрат на ИТ на 35%',
        'Ускорение релизов в 5 раз',
        'Внедрение мониторинга 24/7',
        'Сокращение инцидентов на 70%'
      ]
    },
    {
      id: '6',
      title: 'E-commerce платформа для модного бренда',
      description: 'Разработка высоконагруженного интернет-магазина с персонализацией, AR-примеркой и интеграцией с маркетплейсами',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      category: 'Веб-разработка',
      tags: ['Next.js', 'Shopify', 'AR', 'Payment', 'Analytics'],
      client: 'FashionHub',
      completedDate: 'Июль 2024',
      stats: {
        duration: '5 месяцев',
        team: 7
      },
      results: [
        'GMV ₽50М+ за первые 3 месяца',
        'AR-примерка повысила конверсию на 85%',
        'Средний чек вырос на 42%',
        'Возвраты снизились на 30%'
      ],
      testimonial: {
        text: 'AR-технология кардинально изменила опыт покупателей. Продажи превысили прогноз в 2 раза!',
        author: 'Елена Кузнецова',
        position: 'CMO FashionHub'
      }
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           project.category.toLowerCase() === categories.find(c => c.id === selectedCategory)?.name.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleProjectClick = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                <Icon name="Briefcase" className="text-gold" size={28} />
                Портфолио проектов
              </h2>
              <p className="text-muted-foreground">
                {filteredProjects.length} успешно реализованных проектов
              </p>
            </div>
            <Button className="bg-gold hover:bg-gold/90 text-background">
              <Icon name="Plus" className="mr-2" size={18} />
              Добавить проект
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Поиск по названию, описанию или технологиям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gold/20 focus-visible:ring-gold"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm transition-all ${
              selectedCategory === category.id 
                ? 'bg-gold text-background hover:bg-gold/90' 
                : 'border-gold/30 hover:bg-gold/10'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <Icon name={category.icon as any} className="mr-2" size={16} />
            {category.name}
          </Badge>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="border-gold/20">
          <CardContent className="p-12 text-center">
            <Icon name="Search" className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Проекты не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить поисковый запрос или выбрать другую категорию
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <PortfolioCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      )}

      <PortfolioDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
};

export default PortfolioTab;
