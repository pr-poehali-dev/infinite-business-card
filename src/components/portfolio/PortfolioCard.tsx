import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  client: string;
  completedDate: string;
  stats: {
    duration: string;
    budget?: string;
    team?: number;
  };
  results: string[];
  testimonial?: {
    text: string;
    author: string;
    position: string;
  };
}

interface PortfolioCardProps {
  project: PortfolioProject;
  onClick: () => void;
}

const PortfolioCard = ({ project, onClick }: PortfolioCardProps) => {
  return (
    <Card 
      className="group cursor-pointer border-gold/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-secondary/20">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
              <Icon name="Eye" size={14} className="mr-1" />
              Открыть
            </Badge>
            <div className="flex gap-2">
              {project.stats.team && (
                <Badge variant="outline" className="bg-background/80">
                  <Icon name="Users" size={14} className="mr-1" />
                  {project.stats.team}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 bg-gold text-background font-semibold"
        >
          {project.category}
        </Badge>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs border-gold/30">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-gold/30">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="pt-4 border-t border-gold/10 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Building2" size={16} className="text-gold" />
            <span className="font-medium">{project.client}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Calendar" size={16} className="text-gold" />
            <span>{project.completedDate}</span>
          </div>
        </div>

        {project.stats.duration && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} className="text-gold" />
            <span>Срок выполнения: {project.stats.duration}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
