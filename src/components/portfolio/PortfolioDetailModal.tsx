import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PortfolioProject } from './PortfolioCard';

interface PortfolioDetailModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const PortfolioDetailModal = ({ project, isOpen, onClose }: PortfolioDetailModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Icon name="Briefcase" className="text-gold" size={28} />
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="relative h-80 rounded-lg overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-gold text-background font-semibold text-base px-4 py-2">
              {project.category}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg border border-gold/20">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                <Icon name="Building2" className="text-gold" size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Клиент</p>
                <p className="font-semibold">{project.client}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg border border-gold/20">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                <Icon name="Clock" className="text-gold" size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Срок</p>
                <p className="font-semibold">{project.stats.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg border border-gold/20">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                <Icon name="Calendar" className="text-gold" size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Завершён</p>
                <p className="font-semibold">{project.completedDate}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Icon name="FileText" className="text-gold" size={20} />
              Описание проекта
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Icon name="Target" className="text-gold" size={20} />
              Достигнутые результаты
            </h3>
            <ul className="space-y-2">
              {project.results.map((result, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Check" className="text-gold" size={14} />
                  </div>
                  <span className="text-muted-foreground">{result}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Icon name="Tag" className="text-gold" size={20} />
              Технологии и навыки
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="border-gold/30 px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {project.testimonial && (
            <div className="bg-secondary/20 border border-gold/20 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Icon name="Quote" className="text-gold flex-shrink-0" size={32} />
                <div className="space-y-3">
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{project.testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold">{project.testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{project.testimonial.position}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-gold hover:bg-gold/90 text-background">
              <Icon name="MessageSquare" className="mr-2" size={18} />
              Обсудить похожий проект
            </Button>
            <Button variant="outline" className="border-gold/30 hover:bg-gold/10">
              <Icon name="Share2" size={18} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioDetailModal;
