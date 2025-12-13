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
import { exportService, BusinessCardData, AnalyticsData, LeadData } from '@/lib/export';
import { toast } from 'sonner';

interface ExportMenuProps {
  type: 'card' | 'analytics' | 'leads';
  data?: BusinessCardData | AnalyticsData[] | LeadData[];
  cardData?: BusinessCardData;
  analyticsData?: AnalyticsData[];
  leadsData?: LeadData[];
}

const ExportMenu = ({ type, cardData, analyticsData, leadsData }: ExportMenuProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    
    try {
      if (type === 'card' && cardData) {
        if (format === 'pdf') {
          exportService.exportBusinessCardToPDF(cardData);
          toast.success('Визитка экспортирована в PDF');
        }
      } else if (type === 'analytics' && analyticsData) {
        if (format === 'pdf') {
          exportService.exportAnalyticsToPDF(analyticsData);
          toast.success('Аналитика экспортирована в PDF');
        } else {
          exportService.exportAnalyticsToExcel(analyticsData, leadsData || []);
          toast.success('Аналитика экспортирована в Excel');
        }
      } else if (type === 'leads' && leadsData) {
        if (format === 'pdf') {
          exportService.exportLeadsToPDF(leadsData);
          toast.success('Лиды экспортированы в PDF');
        } else {
          exportService.exportLeadsToExcel(leadsData);
          toast.success('Лиды экспортированы в Excel');
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Ошибка при экспорте данных');
    } finally {
      setIsExporting(false);
    }
  };

  const getMenuItems = () => {
    const items = [];

    if (type === 'card') {
      items.push({
        icon: 'FileText',
        label: 'Экспорт в PDF',
        description: 'Сохранить визитку как PDF документ',
        action: () => handleExport('pdf'),
        color: 'text-red-500'
      });
    }

    if (type === 'analytics') {
      items.push(
        {
          icon: 'FileText',
          label: 'PDF отчёт',
          description: 'Создать PDF с графиками и таблицами',
          action: () => handleExport('pdf'),
          color: 'text-red-500'
        },
        {
          icon: 'FileSpreadsheet',
          label: 'Excel таблица',
          description: 'Экспорт данных для анализа',
          action: () => handleExport('excel'),
          color: 'text-green'
        }
      );
    }

    if (type === 'leads') {
      items.push(
        {
          icon: 'FileText',
          label: 'PDF список',
          description: 'Список всех лидов в PDF',
          action: () => handleExport('pdf'),
          color: 'text-red-500'
        },
        {
          icon: 'FileSpreadsheet',
          label: 'Excel таблица',
          description: 'Экспорт для работы в Excel',
          action: () => handleExport('excel'),
          color: 'text-green'
        }
      );
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Icon name="Download" className="mr-2" size={18} />
          {isExporting ? 'Экспорт...' : 'Экспорт'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Icon name="Download" size={16} />
          Экспорт данных
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {menuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.action}
            className="cursor-pointer p-3"
          >
            <div className="flex items-start gap-3 w-full">
              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <Icon name={item.icon as any} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        
        <div className="p-3">
          <div className="bg-blue/5 rounded-lg p-2 border border-blue/10">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={14} className="text-blue mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Файлы сохраняются локально на ваше устройство
              </p>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportMenu;
