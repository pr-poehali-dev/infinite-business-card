import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface HelpButtonProps {
  onStartTour: () => void;
  onWatchVideo: () => void;
  onViewAnalytics?: () => void;
}

const HelpButton = ({ onStartTour, onWatchVideo, onViewAnalytics }: HelpButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const helpItems = [
    {
      icon: 'Route',
      label: 'Интерактивный тур',
      description: 'Пройдите по интерфейсу пошагово',
      action: onStartTour,
      badge: 'Рекомендуем',
      badgeColor: 'bg-green/10 text-green border-green/20'
    },
    {
      icon: 'PlayCircle',
      label: 'Видео-инструкции',
      description: 'Короткие обучающие видео',
      action: onWatchVideo,
      badge: '2-3 мин',
      badgeColor: 'bg-blue/10 text-blue border-blue/20'
    },
    {
      icon: 'BookOpen',
      label: 'База знаний',
      description: 'Статьи и FAQ',
      action: () => {
        const helpSection = document.getElementById('help');
        if (helpSection) {
          helpSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: 'MessageCircle',
      label: 'Поддержка',
      description: 'Напишите нам в чат',
      action: () => {
        window.open('https://t.me/visitka_support', '_blank');
      }
    }
  ];

  if (onViewAnalytics) {
    helpItems.splice(2, 0, {
      icon: 'BarChart3',
      label: 'Аналитика обучения',
      description: 'Статистика прохождения тестов',
      action: onViewAnalytics
    });
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full w-12 h-12 border-2 border-blue/20 hover:border-blue/40 hover:bg-blue/5 transition-all"
        >
          <Icon name="HelpCircle" size={20} className="text-blue" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green rounded-full border-2 border-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Icon name="Sparkles" size={18} className="text-blue" />
          <span>Помощь и обучение</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {helpItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              item.action();
              setIsOpen(false);
            }}
            className="cursor-pointer p-3 focus:bg-muted"
          >
            <div className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon as any} size={16} className="text-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <Badge variant="outline" className={`text-xs ${item.badgeColor || ''}`}>
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Icon name="ChevronRight" size={14} className="text-muted-foreground mt-1 flex-shrink-0" />
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        
        <div className="p-3">
          <div className="bg-gradient-to-br from-blue/5 to-green/5 rounded-lg p-3 border border-blue/10">
            <div className="flex items-start gap-2">
              <Icon name="Lightbulb" size={16} className="text-blue mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium mb-1">Совет дня</p>
                <p className="text-xs text-muted-foreground">
                  Добавьте QR-код на визитку для быстрого обмена контактами на встречах
                </p>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpButton;
