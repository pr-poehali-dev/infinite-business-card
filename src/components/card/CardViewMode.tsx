import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';

interface CardData {
  id: number;
  name: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  view_count: number;
}

interface CardViewModeProps {
  card: CardData;
  isOwner: boolean;
  onEditToggle: () => void;
  onContact: (type: 'phone' | 'email' | 'website') => void;
  onShare: () => void;
}

const CardViewMode = ({ card, isOwner, onEditToggle, onContact, onShare }: CardViewModeProps) => {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Logo size="md" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline" className="border-gold/50 text-gold/80">
            <Icon name="Eye" size={14} className="mr-1" />
            {card.view_count} просмотров
          </Badge>
          {isOwner && (
            <Button 
              variant="outline"
              size="sm"
              onClick={onEditToggle}
              className="border-gold/50 text-gold hover:bg-gold/10"
            >
              <Icon name="Edit" size={14} className="mr-1" />
              Редактировать
            </Button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden border-2 border-gold/20 shadow-xl">
        <div className="relative">
          {/* Gold accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gold via-yellow-400 to-gold"></div>
          
          <div className="p-8 pt-10">
            {/* Logo / Avatar */}
            {card.logo_url ? (
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold/20 shadow-lg">
                  <img src={card.logo_url} alt={card.name} className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border-4 border-gold/20 shadow-lg">
                  <Icon name="User" size={48} className="text-gold/60" />
                </div>
              </div>
            )}

            {/* Name & Position */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {card.name}
              </h1>
              
              {card.position && (
                <p className="text-lg text-muted-foreground font-medium mb-1">{card.position}</p>
              )}
              
              {card.company && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="Briefcase" size={16} />
                  <p>{card.company}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {card.description && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-center text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {card.description}
                </p>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="grid grid-cols-1 gap-3">
              {card.phone && (
                <Button 
                  onClick={() => onContact('phone')}
                  variant="outline" 
                  className="w-full h-14 text-base border-2 hover:border-gold/50 hover:bg-gold/5 transition-all"
                >
                  <Icon name="Phone" className="mr-3" size={20} />
                  {card.phone}
                </Button>
              )}
              
              {card.email && (
                <Button 
                  onClick={() => onContact('email')}
                  variant="outline"
                  className="w-full h-14 text-base border-2 hover:border-gold/50 hover:bg-gold/5 transition-all"
                >
                  <Icon name="Mail" className="mr-3" size={20} />
                  {card.email}
                </Button>
              )}
              
              {card.website && (
                <Button 
                  onClick={() => onContact('website')}
                  variant="outline"
                  className="w-full h-14 text-base border-2 hover:border-gold/50 hover:bg-gold/5 transition-all"
                >
                  <Icon name="Globe" className="mr-3" size={20} />
                  {card.website}
                </Button>
              )}
            </div>

            {/* Share Button */}
            <Button
              onClick={onShare}
              variant="ghost"
              className="w-full mt-4"
            >
              <Icon name="Share2" className="mr-2" size={18} />
              Поделиться визиткой
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CardViewMode;
